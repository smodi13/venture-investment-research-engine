"""Approval store, exclusive execution lock, and one-shot execution for the
targeted author-enrichment operation.

This module wires approval + execution WITHOUT touching the canonical request in
:mod:`sourcing.enrichment` (so its fingerprint stays fixed). It never calls the
network by itself; ``execute_enrichment`` makes exactly one request only when all
gates pass and an exclusive lock is created.
"""

from __future__ import annotations

import hashlib
import json
import os
import tempfile
import uuid
from datetime import timedelta
from pathlib import Path
from typing import Any, Optional

import yaml

from .config import CONFIG_DIR, PROJECT_ROOT
from .enrichment import (
    APPROVAL_TTL_SECONDS,
    APPROVED_AUTHOR_IDS,
    ENDPOINT,
    HTTP_METHOD,
    OPERATION_NAME,
    OUTPUT_PATHS,
    REQUESTED_USER_FIELDS,
    build_enrichment_request,
    enrichment_budget,
    expected_max_cost,
    user_read_cost,
)
from .money import money_str, parse_money
from .timeutil import now_utc, parse_rfc3339, to_rfc3339

APPROVAL_SCHEMA_VERSION = 1
LOCK_SCHEMA_VERSION = 1
EXPECTED_FINGERPRINT = "sha256:5985e545246d303c14d1c3b1e864656f6c5e6feeb114cd19f8f1e7a3d2a4dd43"

DECISIONS_PATH = CONFIG_DIR / "enrichment_decisions.yaml"
LOCK_DIR = PROJECT_ROOT / "data" / "state" / "enrichment_execution_locks"
CONFIRMATION_VALUE = OPERATION_NAME  # "targeted_candidate_author_enrichment"


# ---------------------------------------------------------------------------
# Atomic write
# ---------------------------------------------------------------------------
def _atomic_write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            fh.write(text)
            fh.flush()
            os.fsync(fh.fileno())
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


# ---------------------------------------------------------------------------
# Confirmation input helper (stdin only)
# ---------------------------------------------------------------------------
def read_confirmation(prompt: str, expected: str, stream, is_tty: Optional[bool] = None) -> tuple[bool, str]:
    """Read exactly one confirmation line. Returns (ok, reason). Fails closed.

    Never treats an exception, EOF, empty, whitespace-only, wrong, or extra input
    as approval. Confirmation must come ONLY through the provided stdin stream.
    """
    try:
        tty = stream.isatty() if is_tty is None else is_tty
    except Exception:
        tty = False
    try:
        if tty:
            print(prompt, end="", flush=True)
            line = stream.readline()
            if line == "":
                return False, "eof"
        else:
            line = stream.readline()
            if line == "":
                return False, "eof"
            rest = stream.read()
            if rest and rest.strip():
                return False, "extra_input"
    except EOFError:
        return False, "eof_error"
    except BrokenPipeError:
        return False, "broken_pipe"
    except Exception:
        return False, "input_exception"

    normalized = line.strip()
    if not normalized:
        return False, "empty"
    if normalized != expected:
        return False, "mismatch"
    return True, "ok"


# ---------------------------------------------------------------------------
# Approval decision store
# ---------------------------------------------------------------------------
def load_enrichment_decision(path: Path | None = None) -> Optional[dict[str, Any]]:
    path = path or DECISIONS_PATH
    if not path.exists():
        return None
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    return data.get("decision")


def record_enrichment_approval(reviewer: str, path: Path | None = None,
                               now=None) -> dict[str, Any]:
    """Write an approval record atomically. New unique approval_record_id each time."""
    path = path or DECISIONS_PATH
    req = build_enrichment_request()
    fp = req.fingerprint()
    if fp != EXPECTED_FINGERPRINT:
        raise ValueError(f"canonical fingerprint changed: {fp} != {EXPECTED_FINGERPRINT}")
    approved_at = (now or now_utc())
    expires_at = approved_at + timedelta(seconds=APPROVAL_TTL_SECONDS)
    record = {
        "approval_schema_version": APPROVAL_SCHEMA_VERSION,
        "operation_name": OPERATION_NAME,
        "decision": "approved",
        "reviewer": reviewer,
        "approval_record_id": uuid.uuid4().hex,
        "approved_at_utc": to_rfc3339(approved_at),
        "expires_at_utc": to_rfc3339(expires_at),
        "approved_request_fingerprint": fp,
        "canonical_request": req.canonical_dict(),
        "author_ids": sorted(req.author_ids),
        "requested_user_fields": sorted(req.requested_user_fields),
        "endpoint": ENDPOINT,
        "http_method": HTTP_METHOD,
        "expected_max_cost_usd": req.expected_max_cost_usd,
        "global_enrichment_budget_usd": req.global_enrichment_budget_usd,
        "max_http_requests": req.max_http_requests,
        "approval_consumed": False,
    }
    _atomic_write(path, yaml.safe_dump({"decision": record}, sort_keys=True))
    return record


def _mirror_decision(path: Path, decision: dict, started_utc: str, lock_path: str,
                     lock_status: str) -> None:
    decision = dict(decision)
    decision["approval_consumed"] = True
    decision["execution_attempt"] = 1
    decision["execution_started_at_utc"] = started_utc
    decision["execution_lock_path"] = lock_path
    decision["execution_lock_status"] = lock_status
    _atomic_write(path, yaml.safe_dump({"decision": decision}, sort_keys=True))


# ---------------------------------------------------------------------------
# Gate checks
# ---------------------------------------------------------------------------
def gate_checks(req, decision: Optional[dict], now=None) -> tuple[bool, list[str]]:
    reasons: list[str] = []
    if decision is None:
        return False, ["no approval decision recorded"]
    if decision.get("decision") not in ("approved", "run"):
        reasons.append(f"decision is '{decision.get('decision')}', not approved/run")
    if not decision.get("approval_record_id"):
        reasons.append("missing approval_record_id")
    fp = req.fingerprint()
    if fp != EXPECTED_FINGERPRINT:
        reasons.append("current canonical fingerprint != expected")
    if decision.get("approved_request_fingerprint") != fp:
        reasons.append("approval fingerprint mismatch")
    if decision.get("approval_consumed"):
        reasons.append("approval already consumed")
    # TTL
    exp = decision.get("expires_at_utc")
    now = now or now_utc()
    if not exp or now >= parse_rfc3339(exp):
        reasons.append("approval expired")
    # invariants
    if sorted(decision.get("author_ids", [])) != sorted(APPROVED_AUTHOR_IDS):
        reasons.append("author-ID set changed")
    if sorted(decision.get("requested_user_fields", [])) != sorted(REQUESTED_USER_FIELDS):
        reasons.append("user fields changed")
    if decision.get("endpoint") != ENDPOINT or decision.get("http_method") != HTTP_METHOD:
        reasons.append("endpoint/method changed")
    if decision.get("max_http_requests") != 1:
        reasons.append("max request count changed")
    if parse_money(decision.get("expected_max_cost_usd", "0")) > parse_money("0.030"):
        reasons.append("expected cost changed")
    if parse_money(decision.get("global_enrichment_budget_usd", "0")) > parse_money("0.040"):
        reasons.append("budget changed")
    return (len(reasons) == 0), reasons


# ---------------------------------------------------------------------------
# Execution lock
# ---------------------------------------------------------------------------
def lock_identity_filename(operation_name: str, fingerprint: str,
                           approval_record_id: str, approved_at_utc: str) -> str:
    """Filesystem-safe filename derived from a hash of the lock identity fields.

    Includes approval_record_id so a NEW approval of the same canonical request
    (new id) maps to a DISTINCT lock path.
    """
    identity = "|".join([operation_name, fingerprint, approval_record_id, approved_at_utc])
    return hashlib.sha256(identity.encode("utf-8")).hexdigest() + ".lock"


def _read_lock_meta(lock_path: Path) -> Optional[dict]:
    try:
        text = lock_path.read_text(encoding="utf-8")
        if not text.strip():
            return None
        return json.loads(text)
    except Exception:
        return None


# ---------------------------------------------------------------------------
# One-shot execution
# ---------------------------------------------------------------------------
def execute_enrichment(*, secrets=None, cache=None, client=None,
                       decision_path: Path | None = None,
                       lock_dir: Path | None = None,
                       output_dir: Path | None = None,
                       now=None) -> dict[str, Any]:
    from .enrichment import (CANDIDATES, account_type, candidate_project_match,
                             extract_profile, founder_or_builder_signal, enrichment_disposition)

    decision_path = decision_path or DECISIONS_PATH
    lock_dir = Path(lock_dir or LOCK_DIR)
    output_dir = Path(output_dir or OUTPUT_PATHS["raw_user_response"].parent)

    req = build_enrichment_request()
    fp = req.fingerprint()
    decision = load_enrichment_decision(decision_path)
    ok, reasons = gate_checks(req, decision, now=now)
    if not ok:
        return {"status": "gate_failed", "reasons": reasons, "fingerprint": fp}

    # --- exclusive lock is the authoritative one-shot authorization ---
    lock_dir.mkdir(parents=True, exist_ok=True)
    fname = lock_identity_filename(OPERATION_NAME, fp, decision["approval_record_id"],
                                   decision["approved_at_utc"])
    lock_path = lock_dir / fname
    try:
        fd = os.open(str(lock_path), os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        meta = _read_lock_meta(lock_path)
        return {
            "status": "execution_already_consumed",
            "approved_request_fingerprint": fp,
            "approval_record_id": decision["approval_record_id"],
            "execution_started_at_utc": (meta or {}).get("execution_started_at_utc"),
            "lock_metadata": "lock_metadata_unavailable" if meta is None else "present",
        }

    started = to_rfc3339(now or now_utc())
    lock_meta = {
        "lock_schema_version": LOCK_SCHEMA_VERSION,
        "operation_name": OPERATION_NAME,
        "approval_record_id": decision["approval_record_id"],
        "approved_request_fingerprint": fp,
        "approved_at_utc": decision["approved_at_utc"],
        "execution_started_at_utc": started,
        "execution_attempt": 1,
        "approval_consumed": True,
        "process_id": os.getpid(),
        "lock_acquisition_status": "acquired",
    }
    os.write(fd, json.dumps(lock_meta).encode("utf-8"))
    os.fsync(fd)
    os.close(fd)

    # Mirror YAML (reporting only; failure must NOT release the lock/approval).
    audit_note = None
    try:
        _mirror_decision(decision_path, decision, started, str(lock_path), "acquired")
    except Exception as exc:  # noqa: BLE001
        audit_note = f"decision_mirror_failed:{type(exc).__name__}"

    # --- exactly one network request (no retry) ---
    if client is None:
        from .x_client import XClient
        client = XClient(secrets, cache)
    ids = sorted(req.author_ids)
    user_fields = ",".join(sorted(f for f in req.requested_user_fields if f != "id"))
    params = {"ids": ",".join(ids), "user.fields": user_fields}
    raw: Any
    exec_error = None
    try:
        raw = client._get("/users", params, cache_sig=f"enrichment::{fp}")
    except Exception as exc:  # noqa: BLE001 - one attempt; no auto retry
        exec_error = type(exc).__name__
        raw = {"execution_error": exec_error, "detail": str(exc)[:200]}

    output_dir.mkdir(parents=True, exist_ok=True)
    # 1. raw FIRST (before any derived output)
    _atomic_write(output_dir / "raw_user_response.json", json.dumps(raw, indent=2, default=str))

    returned_users = (raw.get("data") if isinstance(raw, dict) else None) or []
    errors = (raw.get("errors") if isinstance(raw, dict) else None) or []
    by_id = {str(u.get("id")): u for u in returned_users}

    parsed = []
    for aid in ids:
        u = by_id.get(aid)
        cand = CANDIDATES.get(aid, {})
        rec = {"author_id": aid, "requested": True, "returned": u is not None,
               "missing": u is None, "api_error": None, "parsing_status": "n/a",
               "enrichment_status": "not_returned"}
        if u is not None:
            prof = extract_profile(u, cand)
            m = candidate_project_match(u, prof, cand)
            fs = founder_or_builder_signal(u.get("description", ""))
            at = account_type(u.get("description", ""))
            disp = enrichment_disposition(u, m, fs[0], m["evidence"].get("established_org_tie", False))
            rec.update({
                "username": u.get("username"), "display_name": u.get("name"),
                "account_type": at[0], "founder_or_builder_signal": fs[0],
                "candidate_project_name": cand.get("project"),
                "candidate_project_match": m["match"],
                "enrichment_disposition": disp["enrichment_disposition"],
                "enrichment_reason_codes": disp["enrichment_reason_codes"],
                "parsing_status": "ok", "enrichment_status": "classified",
            })
        parsed.append(rec)

    # 2..7 derived outputs
    _atomic_write(output_dir / "parsed_user_response.json", json.dumps(parsed, indent=2, default=str))

    n_returned = len(returned_users)
    price = user_read_cost()
    est = min(price * (n_returned or 0), expected_max_cost())
    ledger = {
        "price_per_user_usd": money_str(price),
        "maximum_expected_users": 3,
        "maximum_expected_cost_usd": money_str(expected_max_cost()),
        "enrichment_budget_usd": money_str(enrichment_budget()),
        "users_returned": n_returned,
        "estimated_cost_usd": money_str(est),
        "observed_console_cost_usd": None,
        "cost_variance_usd": None,
        "reconciliation_status": "unavailable_external_project_access",
        "billing_status": "estimated_only",
    }
    manifest = {
        "operation_name": OPERATION_NAME, "fingerprint": fp,
        "approval_record_id": decision["approval_record_id"],
        "execution_started_at_utc": started, "execution_attempt": 1,
        "requested_author_ids": ids, "users_returned": n_returned,
        "errors": errors, "exec_error": exec_error, "audit_note": audit_note,
        "response_metadata": getattr(client, "last_response_meta", {}),
        "run_complete": exec_error is None,
    }
    _atomic_write(output_dir / "enrichment_manifest.json", json.dumps(manifest, indent=2, default=str))
    _atomic_write(output_dir / "enrichment_cost_ledger.json", json.dumps(ledger, indent=2))
    _atomic_write(output_dir / "enrichment_audit.json", json.dumps(
        {"per_author": parsed, "errors": errors, "lock_path": str(lock_path),
         "approval_consumed": True}, indent=2, default=str))
    _atomic_write(output_dir / "enrichment_candidate_report.json", json.dumps(
        [{"author_id": r["author_id"], "candidate": r.get("candidate_project_name"),
          "match": r.get("candidate_project_match"),
          "disposition": r.get("enrichment_disposition")} for r in parsed], indent=2))
    # sanitized fixture only from saved raw
    _atomic_write(output_dir / "sanitized_user_fixture.json", json.dumps(
        _sanitize_users(raw), indent=2, default=str))

    return {"status": "executed", "fingerprint": fp, "users_returned": n_returned,
            "exec_error": exec_error, "lock_path": str(lock_path),
            "approval_record_id": decision["approval_record_id"], "cost_ledger": ledger,
            "per_author": parsed}


def _sanitize_users(raw: Any) -> dict:
    if not isinstance(raw, dict):
        return {"data": []}
    out = []
    for u in raw.get("data", []) or []:
        ents = u.get("entities", {}) or {}
        out.append({
            "id": u.get("id"), "username": "SANITIZED", "name": "SANITIZED",
            "description": "SANITIZED",
            "protected": u.get("protected"), "verified": u.get("verified"),
            "verified_type": u.get("verified_type"),
            "public_metrics": u.get("public_metrics"),
            "entities": {"url": ents.get("url", {}), "description": {
                "urls": (ents.get("description", {}) or {}).get("urls", []),
            }},
        })
    return {"data": out, "errors": raw.get("errors", [])}

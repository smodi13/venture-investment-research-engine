"""Approval store, exclusive lock, one-shot execution for the pilot-shortlist
author enrichment. Separate operation, decision file, lock dir, and outputs.
Never calls the network by itself."""

from __future__ import annotations

import json
import os
import uuid
from datetime import timedelta
from pathlib import Path
from typing import Any, Optional

import yaml

from .config import CONFIG_DIR, PROJECT_ROOT
from .enrichment_run import _atomic_write, _read_lock_meta, lock_identity_filename, read_confirmation
from .money import money_str, parse_money
from .pilot_enrichment import (
    APPROVAL_TTL_SECONDS, CANDIDATES, ENDPOINT, HTTP_METHOD, OPERATION_NAME, OUTPUT_PATHS,
    REQUESTED_USER_FIELDS, SELECTED_AUTHOR_IDS, build_pilot_enrichment_request, expected_max_cost,
    pilot_enrichment_budget,
)
from .timeutil import now_utc, parse_rfc3339, to_rfc3339

APPROVAL_SCHEMA_VERSION = 1
LOCK_SCHEMA_VERSION = 1
DECISIONS_PATH = CONFIG_DIR / "pilot_enrichment_decisions.yaml"
LOCK_DIR = PROJECT_ROOT / "data" / "state" / "pilot_enrichment_execution_locks"
CONFIRMATION_VALUE = OPERATION_NAME


def load_decision(path: Path | None = None) -> Optional[dict]:
    path = path or DECISIONS_PATH
    if not path.exists():
        return None
    return (yaml.safe_load(path.read_text(encoding="utf-8")) or {}).get("decision")


def record_approval(reviewer: str, path: Path | None = None, now=None) -> dict:
    path = path or DECISIONS_PATH
    req = build_pilot_enrichment_request()
    approved_at = now or now_utc()
    rec = {
        "approval_schema_version": APPROVAL_SCHEMA_VERSION, "operation_name": OPERATION_NAME,
        "decision": "approved", "reviewer": reviewer, "approval_record_id": uuid.uuid4().hex,
        "approved_at_utc": to_rfc3339(approved_at),
        "expires_at_utc": to_rfc3339(approved_at + timedelta(seconds=APPROVAL_TTL_SECONDS)),
        "approved_request_fingerprint": req.fingerprint(), "canonical_request": req.canonical_dict(),
        "author_ids": sorted(req.author_ids), "requested_user_fields": sorted(req.requested_user_fields),
        "endpoint": ENDPOINT, "http_method": HTTP_METHOD, "max_http_requests": req.max_http_requests,
        "max_expected_cost_usd": req.max_expected_cost_usd,
        "global_pilot_enrichment_budget_usd": req.global_pilot_enrichment_budget_usd,
        "approval_consumed": False,
    }
    _atomic_write(path, yaml.safe_dump({"decision": rec}, sort_keys=True))
    return rec


def gate_checks(req, decision: Optional[dict], now=None) -> tuple[bool, list[str]]:
    reasons: list[str] = []
    if decision is None:
        return False, ["no approval decision recorded"]
    if decision.get("decision") not in ("approved", "run"):
        reasons.append("decision not approved/run")
    if not decision.get("approval_record_id"):
        reasons.append("missing approval_record_id")
    if decision.get("approved_request_fingerprint") != req.fingerprint():
        reasons.append("approval fingerprint mismatch")
    if decision.get("approval_consumed"):
        reasons.append("approval already consumed")
    exp = decision.get("expires_at_utc")
    now = now or now_utc()
    if not exp or now >= parse_rfc3339(exp):
        reasons.append("approval expired")
    if sorted(decision.get("author_ids", [])) != sorted(SELECTED_AUTHOR_IDS):
        reasons.append("author set changed")
    if sorted(decision.get("requested_user_fields", [])) != sorted(REQUESTED_USER_FIELDS):
        reasons.append("user fields changed")
    if decision.get("endpoint") != ENDPOINT or decision.get("http_method") != HTTP_METHOD:
        reasons.append("endpoint/method changed")
    if decision.get("max_http_requests") != 1:
        reasons.append("request count changed")
    if parse_money(decision.get("max_expected_cost_usd", "0")) > parse_money("0.080"):
        reasons.append("expected cost changed")
    if parse_money(decision.get("global_pilot_enrichment_budget_usd", "0")) > parse_money("0.100"):
        reasons.append("budget changed")
    return (len(reasons) == 0), reasons


def execute_pilot_enrichment(*, secrets=None, cache=None, client=None,
                             decision_path: Path | None = None, lock_dir: Path | None = None,
                             output_dir: Path | None = None, now=None) -> dict:
    from .enrichment import (account_type, candidate_project_match, combined_disposition,
                             diligence_questions, extract_profile, profile_role_signal,
                             enrichment_disposition, founder_or_builder_signal)

    decision_path = decision_path or DECISIONS_PATH
    lock_dir = Path(lock_dir or LOCK_DIR)
    base = Path(output_dir) if output_dir else OUTPUT_PATHS["raw_user_response"].parent

    req = build_pilot_enrichment_request()
    fp = req.fingerprint()
    decision = load_decision(decision_path)
    ok, reasons = gate_checks(req, decision, now=now)
    if not ok:
        return {"status": "gate_failed", "reasons": reasons, "fingerprint": fp}

    lock_dir.mkdir(parents=True, exist_ok=True)
    fname = lock_identity_filename(OPERATION_NAME, fp, decision["approval_record_id"], decision["approved_at_utc"])
    lock_path = lock_dir / fname
    try:
        fd = os.open(str(lock_path), os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        meta = _read_lock_meta(lock_path)
        return {"status": "execution_already_consumed", "fingerprint": fp,
                "approval_record_id": decision["approval_record_id"],
                "lock_metadata": "lock_metadata_unavailable" if meta is None else "present"}
    started = to_rfc3339(now or now_utc())
    os.write(fd, json.dumps({"lock_schema_version": LOCK_SCHEMA_VERSION, "operation_name": OPERATION_NAME,
                             "approval_record_id": decision["approval_record_id"],
                             "approved_request_fingerprint": fp, "execution_started_at_utc": started,
                             "execution_attempt": 1, "approval_consumed": True, "process_id": os.getpid(),
                             "lock_acquisition_status": "acquired"}).encode())
    os.fsync(fd)
    os.close(fd)
    try:
        d = dict(decision); d["approval_consumed"] = True; d["execution_started_at_utc"] = started
        d["execution_lock_path"] = str(lock_path)
        _atomic_write(decision_path, yaml.safe_dump({"decision": d}, sort_keys=True))
    except Exception:  # noqa: BLE001
        pass

    if client is None:
        from .x_client import XClient
        client = XClient(secrets, cache)
    ids = sorted(req.author_ids)
    user_fields = ",".join(sorted(f for f in req.requested_user_fields if f != "id"))
    params = {"ids": ",".join(ids), "user.fields": user_fields}
    exec_error = None
    try:
        raw = client._get("/users", params, cache_sig=f"pilotenrich::{fp}")
    except Exception as exc:  # noqa: BLE001 - one attempt, no retry
        exec_error = type(exc).__name__
        raw = {"execution_error": exec_error}

    base.mkdir(parents=True, exist_ok=True)
    _atomic_write(base / "raw_user_response.json", json.dumps(raw, indent=2, default=str))  # raw FIRST

    users = (raw.get("data") if isinstance(raw, dict) else None) or []
    by_id = {str(u.get("id")): u for u in users}
    parsed, combined = [], []
    for aid in ids:
        u = by_id.get(aid)
        cand = CANDIDATES.get(aid, {})
        rec = {"author_id": aid, "requested": True, "returned": u is not None, "missing": u is None,
               "api_error": None, "parsing_status": "n/a", "enrichment_status": "not_returned"}
        if u is not None:
            prof = extract_profile(u, cand)
            role, _re = profile_role_signal(u.get("description", ""))
            m = candidate_project_match(u, prof, cand)
            disp = enrichment_disposition(u, m, founder_or_builder_signal(u.get("description", ""))[0],
                                          m["evidence"].get("established_org_tie", False))
            comb = combined_disposition(
                {"lead_disposition": "keep_verified" if cand.get("github_owner") or cand.get("product_domains") else "keep_for_enrichment",
                 "has_level_a": bool(cand.get("github_owner") or cand.get("product_domains")),
                 "announcement_attribution": "direct_builder_claim"},
                m, role, bool(m["evidence"].get("conflicting_affiliation")))
            q = diligence_questions(cand, comb["combined_candidate_disposition"], m, role)
            rec.update({"username": u.get("username"), "account_type": account_type(u.get("description", ""))[0],
                        "profile_role_signal": role, "candidate_project_name": cand.get("project"),
                        "candidate_project_match": m["match"],
                        "enrichment_disposition": disp["enrichment_disposition"],
                        "combined_candidate_disposition": comb["combined_candidate_disposition"],
                        "unresolved_diligence_questions": q,
                        "parsing_status": "ok", "enrichment_status": "classified"})
            combined.append({"author_id": aid, "candidate": cand.get("project"),
                             "combined": comb["combined_candidate_disposition"]})
        parsed.append(rec)

    n = len(users)
    est = min(expected_max_cost(1) * (n or 0), expected_max_cost())
    ledger = {"price_per_user_usd": money_str(expected_max_cost(1)), "maximum_expected_users": 8,
              "maximum_expected_cost_usd": money_str(expected_max_cost()),
              "enrichment_budget_usd": money_str(pilot_enrichment_budget()),
              "users_returned": n, "estimated_cost_usd": money_str(est),
              "observed_console_cost_usd": None, "cost_variance_usd": None,
              "reconciliation_status": "unavailable_external_project_access", "billing_status": "estimated_only"}
    _w = lambda name, obj: _atomic_write(base / name, json.dumps(obj, indent=2, default=str))
    _w("parsed_user_response.json", parsed)
    _w("enrichment_cost_ledger.json", ledger)
    _w("enrichment_manifest.json", {"operation_name": OPERATION_NAME, "fingerprint": fp,
                                    "approval_record_id": decision["approval_record_id"],
                                    "execution_started_at_utc": started, "exec_error": exec_error,
                                    "users_returned": n, "lock_path": str(lock_path)})
    _w("enrichment_candidate_report.json", combined)
    _w("combined_candidate_report.json", parsed)
    _w("final_comparison_queue.json", sorted(combined, key=lambda r: r["combined"]))
    _w("sanitized_enrichment_fixture.json", {"data": [{"id": u.get("id"), "username": "SANITIZED"} for u in users]})
    return {"status": "executed", "fingerprint": fp, "users_returned": n, "exec_error": exec_error,
            "lock_path": str(lock_path), "cost_ledger": ledger}

"""Approval store, exclusive execution lock, and one-shot execution for the
broad-market 14-author profile enrichment. Separate decision file, lock dir, and
output dir. Never calls the network by itself: exactly one /2/users request runs
only when every gate passes and a durable lock is created.
"""

from __future__ import annotations

import json
import os
import uuid
from datetime import timedelta
from decimal import Decimal
from pathlib import Path
from typing import Any, Optional

import yaml

from .config import CONFIG_DIR, PROJECT_ROOT
from .enrichment_run import _atomic_write, _read_lock_meta, lock_identity_filename, read_confirmation
from .money import money_str
from .broad_market_enrichment14 import (
    APPROVAL_TTL_SECONDS, ENDPOINT, HTTP_METHOD, MAX_EXPECTED_COST_USD, OPERATION_BUDGET_USD,
    OPERATION_NAME, OUTPUT_DIR_14, OUTPUT_PATHS, REQUESTED_USER_FIELDS, USER_PRICE_USD,
    build_enrichment14_request, combined_disposition, decision_questions,
    profile_company_relation, profile_role_classification, selected_author_ids,
)
from .timeutil import now_utc, parse_rfc3339, to_rfc3339

APPROVAL_SCHEMA_VERSION = 1
LOCK_SCHEMA_VERSION = 1
DECISIONS_PATH = CONFIG_DIR / "broad_enrichment14_decisions.yaml"
LOCK_DIR = PROJECT_ROOT / "data" / "state" / "broad_enrichment14_execution_locks"
CONFIRMATION_VALUE = OPERATION_NAME


def load_decision(path: Path | None = None) -> Optional[dict]:
    path = path or DECISIONS_PATH
    if not path.exists():
        return None
    return (yaml.safe_load(path.read_text(encoding="utf-8")) or {}).get("decision")


def record_approval(reviewer: str, path: Path | None = None, now=None) -> dict:
    path = path or DECISIONS_PATH
    req = build_enrichment14_request()
    approved_at = now or now_utc()
    rec = {
        "approval_schema_version": APPROVAL_SCHEMA_VERSION, "operation_name": OPERATION_NAME,
        "decision": "approved", "reviewer": reviewer, "approval_record_id": uuid.uuid4().hex,
        "approved_at_utc": to_rfc3339(approved_at),
        "expires_at_utc": to_rfc3339(approved_at + timedelta(seconds=APPROVAL_TTL_SECONDS)),
        "approved_request_fingerprint": req.fingerprint(), "canonical_request": req.canonical_dict(),
        "author_ids_ordered": list(req.author_ids),
        "requested_user_fields": list(req.requested_user_fields),
        "endpoint": ENDPOINT, "http_method": HTTP_METHOD, "max_http_requests": req.max_http_requests,
        "max_expected_cost_usd": req.max_expected_cost_usd, "operation_budget_usd": req.operation_budget_usd,
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
    if list(decision.get("author_ids_ordered", [])) != list(req.author_ids):
        reasons.append("author set/order changed")
    if list(decision.get("requested_user_fields", [])) != list(REQUESTED_USER_FIELDS):
        reasons.append("user fields changed")
    if decision.get("endpoint") != ENDPOINT or decision.get("http_method") != HTTP_METHOD:
        reasons.append("endpoint/method changed")
    if decision.get("max_http_requests") != 1:
        reasons.append("request count changed")
    return (len(reasons) == 0), reasons


def execute_enrichment14(*, secrets=None, cache=None, client=None,
                         decision_path: Path | None = None, lock_dir: Path | None = None,
                         output_dir: Path | None = None, now=None) -> dict:
    decision_path = decision_path or DECISIONS_PATH
    lock_dir = Path(lock_dir or LOCK_DIR)
    base = Path(output_dir) if output_dir else OUTPUT_DIR_14

    req = build_enrichment14_request()
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
    except Exception:  # noqa: BLE001 - reporting only; must not release lock/approval
        pass

    if client is None:
        from .x_client import XClient
        client = XClient(secrets, cache)
    ids = list(req.author_ids)  # order preserved
    user_fields = ",".join(f for f in REQUESTED_USER_FIELDS if f != "id")
    params = {"ids": ",".join(ids), "user.fields": user_fields}
    exec_error = None
    try:
        raw = client._get("/users", params, cache_sig=f"bmenrich14::{fp}")  # exactly one request, no retry
    except Exception as exc:  # noqa: BLE001
        exec_error = type(exc).__name__
        raw = {"execution_error": exec_error}

    base.mkdir(parents=True, exist_ok=True)
    _atomic_write(base / "raw_user_response.json", json.dumps(raw, indent=2, default=str))  # RAW FIRST

    users = (raw.get("data") if isinstance(raw, dict) else None) or []
    errors = (raw.get("errors") if isinstance(raw, dict) else None) or []
    by_id = {str(u.get("id")): u for u in users}
    ctx = {q["author_id"]: q for q in decision_questions()}

    profile_records, role_rows, relation_rows, combined_rows = [], [], [], []
    returned_ids, missing_ids = [], []
    for aid in ids:
        u = by_id.get(aid)
        cand = ctx.get(aid, {})
        if u is None:
            missing_ids.append(aid)
            combined_rows.append({"author_id": aid, "returned": False,
                                  **combined_disposition(cand, "unclear", {"profile_company_relation": "unclear", "profile_domains": [], "contradiction_entity": None}, False),
                                  "pre_enrichment_disposition": cand.get("current_disposition")})
            continue
        returned_ids.append(aid)
        role = profile_role_classification(u.get("description", ""), u.get("name", ""))
        rel = profile_company_relation(u, cand, aid)
        comb = combined_disposition(cand, role, rel, True)
        profile_records.append({"author_id": aid, "username": u.get("username"), "name": u.get("name"),
                                "description": u.get("description"), "location": u.get("location"),
                                "created_at": u.get("created_at"), "url": u.get("url"),
                                "verified": u.get("verified"), "protected": u.get("protected"),
                                "pinned_tweet_id": u.get("pinned_tweet_id"),
                                "public_metrics": u.get("public_metrics")})
        role_rows.append({"author_id": aid, "profile_role_classification": role})
        relation_rows.append({"author_id": aid, **rel})
        combined_rows.append({
            "author_id": aid, "returned": True,
            "pre_enrichment_disposition": cand.get("current_disposition"),
            "profile_role_classification": role,
            "profile_company_relation": rel["profile_company_relation"],
            "profile_evidence": {"domains": rel["profile_domains"], "basis": rel.get("relation_basis")},
            "profile_contradictions": rel.get("contradiction_entity"),
            **comb,
        })

    n = len(returned_ids)
    est = min(USER_PRICE_USD * n, MAX_EXPECTED_COST_USD)
    ledger = {"price_per_user_usd": money_str(USER_PRICE_USD), "maximum_expected_users": 14,
              "maximum_expected_cost_usd": money_str(MAX_EXPECTED_COST_USD),
              "operation_budget_usd": money_str(OPERATION_BUDGET_USD),
              "users_returned": n, "estimated_cost_usd": money_str(est),
              "observed_console_cost_usd": None, "cost_variance_usd": None,
              "reconciliation_status": "unavailable_external_project_access", "billing_status": "estimated_only"}

    _w = lambda name, obj: _atomic_write(base / name, json.dumps(obj, indent=2, default=str))
    _w("requested_user_ids.json", ids)
    _w("returned_user_ids.json", returned_ids)
    _w("missing_user_ids.json", missing_ids)
    _w("profile_records.json", profile_records)
    _w("profile_role_classification.json", role_rows)
    _w("profile_company_relation.json", relation_rows)
    _w("profile_evidence_audit.json", [{"author_id": r["author_id"], "domains": r.get("profile_domains")} for r in relation_rows])
    _w("profile_contradiction_audit.json", [r for r in combined_rows if r.get("profile_contradictions")])
    _w("combined_candidate_results.json", combined_rows)
    _w("enrichment_cost_ledger.json", ledger)
    _w("enrichment_manifest.json", {"operation_name": OPERATION_NAME, "fingerprint": fp,
                                    "approval_record_id": decision["approval_record_id"],
                                    "execution_started_at_utc": started, "exec_error": exec_error,
                                    "requested": len(ids), "returned": n, "missing": len(missing_ids),
                                    "errors": errors, "lock_path": str(lock_path)})
    _w("enrichment_summary.json", {"requested": len(ids), "returned": n, "missing": len(missing_ids),
                                   "advance_for_diligence": sum(1 for r in combined_rows if r["combined_disposition"] == "advance_for_diligence"),
                                   "retain_for_manual_research": sum(1 for r in combined_rows if r["combined_disposition"] == "retain_for_manual_research"),
                                   "archived": sum(1 for r in combined_rows if r["combined_disposition"].startswith("archive")),
                                   "insufficient_total_evidence": sum(1 for r in combined_rows if r["combined_disposition"] == "insufficient_total_evidence")})
    _w("sanitized_enrichment_fixture.json", [{"id": u.get("id"), "username": "SANITIZED", "name": "SANITIZED",
                                              "description": "SANITIZED"} for u in users])
    return {"status": "executed", "fingerprint": fp, "requested": len(ids), "returned": n,
            "missing": len(missing_ids), "exec_error": exec_error, "lock_path": str(lock_path),
            "cost_ledger": ledger, "combined": combined_rows}

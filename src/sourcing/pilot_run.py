"""Approval store, exclusive execution lock, and one-shot execution for the
six-query sourcing pilot. Reuses the generic approval/lock helpers; never calls
the network by itself.
"""

from __future__ import annotations

import json
import os
import uuid
from datetime import timedelta
from pathlib import Path
from typing import Any, Optional

import yaml

from .config import CONFIG_DIR, PROJECT_ROOT
from .enrichment_run import (
    _atomic_write, _read_lock_meta, lock_identity_filename, read_confirmation,
)
from .money import money_str, parse_money
from .pilot import (
    APPROVAL_TTL_SECONDS, APPROVED_QUERY_IDS, ENDPOINT, HTTP_METHOD, MAX_RESULTS_PER_QUERY,
    OPERATION_NAME, OUTPUT_PATHS, WINDOW_POLICY, build_pilot_request, compute_pilot_metrics,
    pilot_expected_cost, pilot_post_budget, post_read_cost,
)
from .timeutil import now_utc, parse_rfc3339, to_rfc3339

APPROVAL_SCHEMA_VERSION = 1
LOCK_SCHEMA_VERSION = 1
DECISIONS_PATH = CONFIG_DIR / "pilot_decisions.yaml"
LOCK_DIR = PROJECT_ROOT / "data" / "state" / "pilot_execution_locks"
CONFIRMATION_VALUE = OPERATION_NAME


def load_pilot_decision(path: Path | None = None) -> Optional[dict[str, Any]]:
    path = path or DECISIONS_PATH
    if not path.exists():
        return None
    return (yaml.safe_load(path.read_text(encoding="utf-8")) or {}).get("decision")


def record_pilot_approval(reviewer: str, path: Path | None = None, now=None) -> dict[str, Any]:
    path = path or DECISIONS_PATH
    req = build_pilot_request()
    fp = req.fingerprint()
    approved_at = now or now_utc()
    expires_at = approved_at + timedelta(seconds=APPROVAL_TTL_SECONDS)
    rec = {
        "approval_schema_version": APPROVAL_SCHEMA_VERSION,
        "operation_name": OPERATION_NAME, "decision": "approved", "reviewer": reviewer,
        "approval_record_id": uuid.uuid4().hex,
        "approved_at_utc": to_rfc3339(approved_at), "expires_at_utc": to_rfc3339(expires_at),
        "approved_request_fingerprint": fp, "canonical_request": req.canonical_dict(),
        "query_ids": sorted(req.query_ids), "endpoint": ENDPOINT, "http_method": HTTP_METHOD,
        "max_results_per_query": req.max_results_per_query, "max_total_posts": req.max_total_posts,
        "max_http_requests": req.max_http_requests,
        "max_expected_cost_usd": req.max_expected_cost_usd,
        "global_pilot_post_budget_usd": req.global_pilot_post_budget_usd,
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
    if sorted(decision.get("query_ids", [])) != sorted(APPROVED_QUERY_IDS):
        reasons.append("query-ID set changed")
    if decision.get("endpoint") != ENDPOINT or decision.get("http_method") != HTTP_METHOD:
        reasons.append("endpoint/method changed")
    if decision.get("max_http_requests", 0) > 6:
        reasons.append("request count changed")
    if decision.get("max_total_posts", 0) > 300:
        reasons.append("max posts changed")
    if parse_money(decision.get("max_expected_cost_usd", "0")) > parse_money("1.500"):
        reasons.append("expected cost changed")
    if parse_money(decision.get("global_pilot_post_budget_usd", "0")) > parse_money("1.600"):
        reasons.append("budget changed")
    return (len(reasons) == 0), reasons


def execute_pilot(*, secrets=None, cache=None, client=None,
                  decision_path: Path | None = None, lock_dir: Path | None = None,
                  output_dir: Path | None = None, now=None) -> dict[str, Any]:
    from .approval import resolve_canary_window

    decision_path = decision_path or DECISIONS_PATH
    lock_dir = Path(lock_dir or LOCK_DIR)
    base = Path(output_dir) if output_dir else OUTPUT_PATHS["parsed_posts"].parent

    req = build_pilot_request()
    fp = req.fingerprint()
    decision = load_pilot_decision(decision_path)
    ok, reasons = gate_checks(req, decision, now=now)
    if not ok:
        return {"status": "gate_failed", "reasons": reasons, "fingerprint": fp}

    lock_dir.mkdir(parents=True, exist_ok=True)
    fname = lock_identity_filename(OPERATION_NAME, fp, decision["approval_record_id"],
                                   decision["approved_at_utc"])
    lock_path = lock_dir / fname
    try:
        fd = os.open(str(lock_path), os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        meta = _read_lock_meta(lock_path)
        return {"status": "execution_already_consumed", "fingerprint": fp,
                "approval_record_id": decision["approval_record_id"],
                "lock_metadata": "lock_metadata_unavailable" if meta is None else "present"}

    started = to_rfc3339(now or now_utc())
    os.write(fd, json.dumps({
        "lock_schema_version": LOCK_SCHEMA_VERSION, "operation_name": OPERATION_NAME,
        "approval_record_id": decision["approval_record_id"], "approved_request_fingerprint": fp,
        "execution_started_at_utc": started, "execution_attempt": 1, "approval_consumed": True,
        "process_id": os.getpid(), "lock_acquisition_status": "acquired",
    }).encode("utf-8"))
    os.fsync(fd)
    os.close(fd)

    # mirror YAML (reporting only)
    try:
        d = dict(decision); d["approval_consumed"] = True; d["execution_started_at_utc"] = started
        d["execution_lock_path"] = str(lock_path); d["execution_attempt"] = 1
        _atomic_write(decision_path, yaml.safe_dump({"decision": d}, sort_keys=True))
    except Exception:  # noqa: BLE001
        pass

    # --- one window resolution + exactly 6 requests (no retry, no pagination) ---
    win = resolve_canary_window(now or now_utc(), WINDOW_POLICY)
    if client is None:
        from .x_client import XClient
        client = XClient(secrets, cache)
    from .x_client import TWEET_FIELDS

    raw_dir = base / "raw_responses_by_query"
    raw_dir.mkdir(parents=True, exist_ok=True)
    posts_by_query: dict[str, list] = {}
    query_map = dict(req.queries)
    total = 0
    exec_error = None
    for qid in sorted(req.query_ids):
        remaining = req.max_total_posts - total
        if remaining <= 0:
            posts_by_query[qid] = []
            continue
        params = {
            "query": query_map[qid],
            "max_results": min(MAX_RESULTS_PER_QUERY, remaining),
            "tweet.fields": TWEET_FIELDS, "sort_order": "recency",
            "start_time": win["resolved_start_time_utc"], "end_time": win["resolved_end_time_utc"],
        }  # NO expansions, NO user.fields, NO pagination
        try:
            data = client._get("/tweets/search/recent", params, cache_sig=f"pilot::{fp}::{qid}")
            posts = (data.get("data") if isinstance(data, dict) else None) or []
        except Exception as exc:  # noqa: BLE001 - no auto retry
            exec_error = exec_error or type(exc).__name__
            posts = []
            data = {"execution_error": type(exc).__name__}
        # raw FIRST
        _atomic_write(raw_dir / f"{qid}.json", json.dumps(data, indent=2, default=str))
        posts_by_query[qid] = posts
        total += len(posts)

    metrics = compute_pilot_metrics(posts_by_query)
    ov = metrics["overall"]
    ledger = {
        "post_read_usd": money_str(post_read_cost()),
        "max_total_posts": req.max_total_posts,
        "max_expected_cost_usd": money_str(pilot_expected_cost()),
        "global_pilot_post_budget_usd": money_str(pilot_post_budget()),
        "posts_returned": ov["posts_returned"],
        "estimated_retrieval_cost_usd": ov["estimated_retrieval_cost_usd"],
        "estimated_cost_per_actionable_lead_usd": ov["estimated_cost_per_actionable_lead_usd"],
        "observed_console_cost_usd": None, "cost_variance_usd": None,
        "reconciliation_status": "unavailable_external_project_access",
        "billing_status": "estimated_only",
    }
    _w = lambda key, obj: _atomic_write(OUTPUT_PATHS[key] if output_dir is None else base / OUTPUT_PATHS[key].name,
                                        json.dumps(obj, indent=2, default=str))
    _w("parsed_posts", metrics["per_post"])
    _w("pilot_query_metrics", metrics["per_query"])
    _w("pilot_summary", ov)
    _w("pilot_cost_ledger", ledger)
    _w("pilot_dedup_audit", {"duplicate_posts": ov["duplicate_posts_across_queries"],
                             "provenance": metrics["provenance"]})
    _w("pilot_manifest", {"operation_name": OPERATION_NAME, "fingerprint": fp,
                          "approval_record_id": decision["approval_record_id"],
                          "execution_started_at_utc": started, "exec_error": exec_error,
                          "posts_returned": ov["posts_returned"], "lock_path": str(lock_path)})
    return {"status": "executed", "fingerprint": fp, "metrics_overall": ov,
            "lock_path": str(lock_path), "exec_error": exec_error, "cost_ledger": ledger}

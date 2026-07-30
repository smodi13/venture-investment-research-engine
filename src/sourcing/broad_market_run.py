"""Approval store, exclusive execution lock, and one-shot execution for the two
broad-market operations: the 20-query count preflight and the 4000-post retrieval.

Separate decision files, lock dirs, and output dirs per operation. Never calls the
network by itself: execution runs only when every gate passes and an exclusive lock
is created. Preparation code — nothing here is invoked until a human approves.
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

from . import broad_market as BM
from .config import CONFIG_DIR, PROJECT_ROOT
from .enrichment_run import (_atomic_write, _read_lock_meta, lock_identity_filename,
                             read_confirmation)
from .money import money_str, parse_money
from .timeutil import now_utc, parse_rfc3339, to_rfc3339

APPROVAL_SCHEMA_VERSION = 1
LOCK_SCHEMA_VERSION = 1

COUNT_DECISIONS_PATH = CONFIG_DIR / "broad_count_decisions.yaml"
RUN_DECISIONS_PATH = CONFIG_DIR / "broad_run_decisions.yaml"
COUNT_LOCK_DIR = PROJECT_ROOT / "data" / "state" / "broad_count_execution_locks"
RUN_LOCK_DIR = PROJECT_ROOT / "data" / "state" / "broad_run_execution_locks"


# ---------------------------------------------------------------------------
# Approval store (one per operation)
# ---------------------------------------------------------------------------
def load_decision(path: Path) -> Optional[dict]:
    if not path.exists():
        return None
    return (yaml.safe_load(path.read_text(encoding="utf-8")) or {}).get("decision")


def record_count_approval(reviewer: str, path: Path | None = None, now=None) -> dict:
    return _record_approval(BM.build_count_request(), reviewer,
                            path or COUNT_DECISIONS_PATH, BM.COUNT_OPERATION, now)


def record_run_approval(reviewer: str, path: Path | None = None, now=None) -> dict:
    return _record_approval(BM.build_retrieval_request(), reviewer,
                            path or RUN_DECISIONS_PATH, BM.RUN_OPERATION, now)


def _record_approval(req, reviewer: str, path: Path, operation: str, now) -> dict:
    approved_at = now or now_utc()
    rec = {
        "approval_schema_version": APPROVAL_SCHEMA_VERSION, "operation_name": operation,
        "decision": "pending_review", "reviewer": reviewer, "approval_record_id": uuid.uuid4().hex,
        "approved_at_utc": to_rfc3339(approved_at),
        "expires_at_utc": to_rfc3339(approved_at + timedelta(seconds=BM.APPROVAL_TTL_SECONDS)),
        "approved_request_fingerprint": req.fingerprint(), "canonical_request": req.canonical_dict(),
        "approval_consumed": False,
    }
    _atomic_write(path, yaml.safe_dump({"decision": rec}, sort_keys=True))
    return rec


def approve_decision(path: Path, confirmation_stream, operation: str, expected: str) -> dict:
    """Flip a recorded decision to run only on exact typed confirmation. Fail-closed."""
    decision = load_decision(path)
    if decision is None:
        return {"status": "no_pending_request"}
    ok, reason = read_confirmation(f"Type '{expected}' to approve {operation}: ", expected, confirmation_stream)
    if not ok:
        return {"status": "not_confirmed", "reason": reason}
    decision["decision"] = "run"
    decision["human_approved_at_utc"] = to_rfc3339(now_utc())
    _atomic_write(path, yaml.safe_dump({"decision": decision}, sort_keys=True))
    return {"status": "approved", "operation": operation}


# ---------------------------------------------------------------------------
# Gate checks
# ---------------------------------------------------------------------------
def gate_checks(req, decision: Optional[dict], now=None) -> tuple[bool, list[str]]:
    reasons: list[str] = []
    if decision is None:
        return False, ["no approval decision recorded"]
    if decision.get("decision") not in ("run", "approved"):
        reasons.append("decision not run/approved (defaults pending_review)")
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
    return (len(reasons) == 0), reasons


def _acquire_lock(lock_dir: Path, operation: str, fp: str, decision: dict, now) -> tuple[Optional[Path], Optional[dict]]:
    lock_dir.mkdir(parents=True, exist_ok=True)
    fname = lock_identity_filename(operation, fp, decision["approval_record_id"], decision["approved_at_utc"])
    lock_path = lock_dir / fname
    try:
        fd = os.open(str(lock_path), os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        meta = _read_lock_meta(lock_path)
        return None, {"status": "execution_already_consumed", "fingerprint": fp,
                      "approval_record_id": decision["approval_record_id"],
                      "lock_metadata": "lock_metadata_unavailable" if meta is None else "present"}
    started = to_rfc3339(now or now_utc())
    os.write(fd, json.dumps({"lock_schema_version": LOCK_SCHEMA_VERSION, "operation_name": operation,
                             "approval_record_id": decision["approval_record_id"],
                             "approved_request_fingerprint": fp, "execution_started_at_utc": started,
                             "execution_attempt": 1, "approval_consumed": True,
                             "process_id": os.getpid(), "lock_acquisition_status": "acquired"}).encode())
    os.fsync(fd)
    os.close(fd)
    return lock_path, {"started": started}


# ---------------------------------------------------------------------------
# Count preflight execution (≤20 GET /2/tweets/counts/recent)
# ---------------------------------------------------------------------------
def execute_broad_counts(*, secrets=None, cache=None, client=None,
                         decision_path: Path | None = None, lock_dir: Path | None = None,
                         output_dir: Path | None = None, now=None) -> dict:
    decision_path = decision_path or COUNT_DECISIONS_PATH
    lock_dir = Path(lock_dir or COUNT_LOCK_DIR)
    base = Path(output_dir) if output_dir else BM.BROAD_DIR / "count_preflight"

    req = BM.build_count_request()
    fp = req.fingerprint()
    decision = load_decision(decision_path)
    ok, reasons = gate_checks(req, decision, now=now)
    if not ok:
        return {"status": "gate_failed", "reasons": reasons, "fingerprint": fp}

    lock_path, info = _acquire_lock(lock_dir, BM.COUNT_OPERATION, fp, decision, now)
    if lock_path is None:
        return info
    started = info["started"]

    if client is None:
        from .x_client import XClient
        client = XClient(secrets, cache)

    base.mkdir(parents=True, exist_ok=True)
    (base / "raw_counts_by_query").mkdir(parents=True, exist_ok=True)
    results, requests_made, exec_error = [], 0, None
    for q in BM.load_broad_queries():
        if requests_made >= BM.MAX_COUNT_REQUESTS:
            break
        params = {"query": q["query"], "granularity": "day"}
        try:
            raw = client._get("/tweets/counts/recent", params, cache_sig=f"broadcount::{fp}::{q['id']}")
        except Exception as exc:  # noqa: BLE001 - no retry
            exec_error = type(exc).__name__
            raw = {"execution_error": exec_error}
        requests_made += 1
        _atomic_write(base / "raw_counts_by_query" / f"{q['id']}.json",
                      json.dumps(raw, indent=2, default=str))
        total = 0
        for bucket in (raw.get("data") if isinstance(raw, dict) else None) or []:
            total += int(bucket.get("tweet_count", 0) or 0)
        results.append({"query_id": q["id"], "sector_bucket": q["sector_bucket"],
                        "broad_group": q["broad_group"], "total_recent_count": total})
        if exec_error:
            break

    est = BM.counts_request_cost() * Decimal(requests_made)
    ledger = {"price_per_request_usd": money_str(BM.counts_request_cost()),
              "requests_made": requests_made, "maximum_expected_requests": BM.MAX_COUNT_REQUESTS,
              "estimated_cost_usd": money_str(est),
              "max_count_cost_usd": money_str(BM.count_expected_cost()),
              "count_budget_usd": money_str(BM.count_budget()),
              "observed_console_cost_usd": None, "cost_variance_usd": None,
              "reconciliation_status": "unavailable_external_project_access", "billing_status": "estimated_only"}
    _atomic_write(base / "count_metrics.json", json.dumps(results, indent=2))
    _atomic_write(base / "count_cost_ledger.json", json.dumps(ledger, indent=2))
    _atomic_write(base / "count_manifest.json", json.dumps(
        {"operation_name": BM.COUNT_OPERATION, "fingerprint": fp, "requests_made": requests_made,
         "execution_started_at_utc": started, "exec_error": exec_error, "lock_path": str(lock_path)}, indent=2))
    return {"status": "executed", "fingerprint": fp, "requests_made": requests_made,
            "exec_error": exec_error, "lock_path": str(lock_path), "cost_ledger": ledger}


# ---------------------------------------------------------------------------
# Retrieval execution (≤40 GET /2/tweets/search/recent, ≤4000 posts)
# ---------------------------------------------------------------------------
def execute_broad_run(*, secrets=None, cache=None, client=None,
                      decision_path: Path | None = None, lock_dir: Path | None = None,
                      output_dir: Path | None = None, now=None) -> dict:
    decision_path = decision_path or RUN_DECISIONS_PATH
    lock_dir = Path(lock_dir or RUN_LOCK_DIR)
    base = Path(output_dir) if output_dir else BM.BROAD_DIR

    req = BM.build_retrieval_request()
    fp = req.fingerprint()
    decision = load_decision(decision_path)
    ok, reasons = gate_checks(req, decision, now=now)
    if not ok:
        return {"status": "gate_failed", "reasons": reasons, "fingerprint": fp}
    # group-coverage gate: at least one run query from each required broad group
    groups = {q["broad_group"] for q in BM.load_broad_queries()}
    if not BM.REQUIRED_BROAD_GROUPS <= groups:
        return {"status": "gate_failed", "reasons": ["missing required broad-group coverage"], "fingerprint": fp}

    lock_path, info = _acquire_lock(lock_dir, BM.RUN_OPERATION, fp, decision, now)
    if lock_path is None:
        return info
    started = info["started"]

    if client is None:
        from .x_client import XClient
        client = XClient(secrets, cache)

    raw_dir = base / "raw_responses_by_query_and_page"
    raw_dir.mkdir(parents=True, exist_ok=True)
    http_requests, total_posts, exec_error = 0, 0, None
    by_query: dict[str, list[dict]] = {}
    for q in BM.load_broad_queries():
        if http_requests >= BM.MAX_HTTP_REQUESTS or total_posts >= BM.MAX_TOTAL_POSTS:
            break
        next_token, page, collected = None, 0, []
        while page < BM.MAX_PAGES_PER_QUERY and len(collected) < BM.MAX_RESULTS_PER_QUERY:
            if http_requests >= BM.MAX_HTTP_REQUESTS or total_posts >= BM.MAX_TOTAL_POSTS:
                break
            params = {"query": q["query"], "max_results": BM.MAX_RESULTS_PER_REQUEST,
                      "sort_order": "recency", "tweet.fields": req.tweet_fields}
            if next_token:
                params["next_token"] = next_token
            try:
                raw = client._get("/tweets/search/recent", params,
                                  cache_sig=f"broadrun::{fp}::{q['id']}::{page}")
            except Exception as exc:  # noqa: BLE001 - no retry
                exec_error = type(exc).__name__
                raw = {"execution_error": exec_error}
            http_requests += 1
            page += 1
            _atomic_write(raw_dir / f"{q['id']}_page{page}.json", json.dumps(raw, indent=2, default=str))
            posts = (raw.get("data") if isinstance(raw, dict) else None) or []
            room = min(BM.MAX_RESULTS_PER_QUERY - len(collected), BM.MAX_TOTAL_POSTS - total_posts)
            posts = posts[:max(room, 0)]
            collected.extend(posts)
            total_posts += len(posts)
            next_token = (raw.get("meta", {}) if isinstance(raw, dict) else {}).get("next_token")
            if exec_error or not next_token:
                break
        by_query[q["id"]] = collected
        if exec_error:
            break

    dedup = BM.dedup_against_prior(by_query)
    est = BM.post_read_cost() * Decimal(total_posts)
    ledger = {"price_per_post_usd": money_str(BM.post_read_cost()), "posts_retrieved": total_posts,
              "http_requests": http_requests, "maximum_expected_posts": BM.MAX_TOTAL_POSTS,
              "estimated_cost_usd": money_str(est),
              "max_expected_cost_usd": money_str(BM.post_expected_cost()),
              "operation_budget_usd": money_str(BM.post_budget()),
              "observed_console_cost_usd": None, "cost_variance_usd": None,
              "reconciliation_status": "unavailable_external_project_access", "billing_status": "estimated_only"}
    _atomic_write(base / "broad_run_cost_ledger.json", json.dumps(ledger, indent=2))
    _atomic_write(base / "cross_run_dedup_audit.json", json.dumps(
        {"cross_run_duplicates": dedup["cross_run_duplicates"],
         "within_run_duplicates": dedup["within_run_duplicates"],
         "new_discovery_count": dedup["new_discovery_count"]}, indent=2))
    _atomic_write(base / "query_provenance_audit.json", json.dumps(dedup["provenance"], indent=2))
    _atomic_write(base / "parsed_posts.json", json.dumps(dedup["unique_new_posts"], indent=2, default=str))
    _atomic_write(base / "broad_run_manifest.json", json.dumps(
        {"operation_name": BM.RUN_OPERATION, "fingerprint": fp, "http_requests": http_requests,
         "posts_retrieved": total_posts, "new_discovery_count": dedup["new_discovery_count"],
         "execution_started_at_utc": started, "exec_error": exec_error, "lock_path": str(lock_path)}, indent=2))
    return {"status": "executed", "fingerprint": fp, "http_requests": http_requests,
            "posts_retrieved": total_posts, "new_discovery_count": dedup["new_discovery_count"],
            "exec_error": exec_error, "lock_path": str(lock_path), "cost_ledger": ledger}

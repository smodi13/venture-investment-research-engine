"""Broad-market 20-query sourcing preparation.

Two operations: a count preflight (broad_market_20_query_counts) and a 4000-post
retrieval (broad_market_4000_post_run). Builds canonical requests + fingerprints,
validates all caps + the project-credit projection (Decimal), labels sectors, and
deduplicates against prior runs. Reuses the existing deterministic pipeline. Never
calls the network by itself.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from decimal import Decimal
from functools import lru_cache
from pathlib import Path
from typing import Any

import yaml

from .config import CONFIG_DIR, OUTPUT_DIR
from .money import money_str, parse_money
from .pricing import load_pricing
from .validator import MAX_QUERY_CHARS, validate_query

SCHEMA_VERSION = 1
COUNT_OPERATION = "broad_market_20_query_counts"
RUN_OPERATION = "broad_market_4000_post_run"
SEARCH_ENDPOINT = "/2/tweets/search/recent"
COUNTS_ENDPOINT = "/2/tweets/counts/recent"
HTTP_METHOD = "GET"
APPROVAL_TTL_SECONDS = 900

# Retrieval caps.
MAX_RESULTS_PER_REQUEST = 100
MAX_PAGES_PER_QUERY = 2
MAX_RESULTS_PER_QUERY = 200
MAX_QUERIES = 20
MAX_HTTP_REQUESTS = 40
MAX_TOTAL_POSTS = 4000
# Count caps.
MAX_COUNT_REQUESTS = 20
# Future enrichment (NOT part of these operations).
MAX_FUTURE_PROFILES = 30

WINDOW_POLICY = {"mode": "recent_relative", "lookback_days": 7,
                 "start_guard_seconds": 300, "end_guard_seconds": 30,
                 "resolve_once_at_execution": True}

SECTOR_BUCKETS = {
    "ai_infrastructure", "ai_application_software", "non_ai_b2b_saas",
    "developer_infrastructure", "cybersecurity", "fintech_software", "vertical_saas",
    "hardware_deeptech", "climate_energy", "medical_device", "industrial_manufacturing",
    "consumer_hardware", "mixed", "unclear",
}
MANDATE_FITS = {"high", "medium", "low", "outside", "unclear"}
REQUIRED_BROAD_GROUPS = {"ai", "non_ai_b2b", "hardware_deeptech", "physical_products"}

BROAD_DIR = OUTPUT_DIR / "broad_market_4000"
OUTPUT_PATHS = {name: BROAD_DIR / fname for name, fname in {
    "raw_dir": "raw_responses_by_query_and_page", "broad_run_manifest": "broad_run_manifest.json",
    "broad_run_cost_ledger": "broad_run_cost_ledger.json", "parsed_posts": "parsed_posts.json",
    "cross_run_dedup_audit": "cross_run_dedup_audit.json",
    "company_consolidation_audit": "company_consolidation_audit.json",
    "query_provenance_audit": "query_provenance_audit.json", "exclusion_audit": "exclusion_audit.json",
    "all_candidate_records": "all_candidate_records.json", "ai_candidate_shortlist": "ai_candidate_shortlist.json",
    "non_ai_saas_shortlist": "non_ai_saas_shortlist.json", "hardware_deeptech_shortlist": "hardware_deeptech_shortlist.json",
    "physical_product_shortlist": "physical_product_shortlist.json",
    "headline_mandate_shortlist": "headline_mandate_shortlist.json",
    "overall_venture_shortlist": "overall_venture_shortlist.json",
    "broad_run_query_metrics": "broad_run_query_metrics.json", "broad_run_sector_metrics": "broad_run_sector_metrics.json",
    "broad_run_summary": "broad_run_summary.json", "future_enrichment_plan": "future_enrichment_plan.json",
    "sanitized_broad_run_fixture": "sanitized_broad_run_fixture.json",
}.items()}


class BroadMarketValidationError(ValueError):
    pass


@lru_cache(maxsize=1)
def load_broad_queries() -> list[dict[str, Any]]:
    path = CONFIG_DIR / "broad_market_queries.yaml"
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    return data.get("queries", [])


def broad_config_version() -> int:
    path = CONFIG_DIR / "broad_market_queries.yaml"
    return int((yaml.safe_load(path.read_text(encoding="utf-8")) or {}).get("config_version", 2))


def validate_query_lengths() -> list[dict[str, Any]]:
    """Per-query char count + validation (operators + 512-char limit). No revision."""
    out = []
    for q in load_broad_queries():
        vr = validate_query(q["query"])
        out.append({"query_id": q["id"], "char_count": len(q["query"]),
                    "within_limit": len(q["query"]) <= MAX_QUERY_CHARS,
                    "valid": vr.ok and len(q["query"]) <= MAX_QUERY_CHARS,
                    "errors": vr.errors, "warnings": vr.warnings,
                    "sector_bucket": q["sector_bucket"], "discovery_lane": q["discovery_lane"],
                    "broad_group": q["broad_group"], "literal_query": q["query"]})
    return out


def assert_queries_valid() -> None:
    for r in validate_query_lengths():
        if not r["valid"]:
            raise BroadMarketValidationError(
                f"invalid query {r['query_id']}: len={r['char_count']} errors={r['errors']}")


# ---------------------------------------------------------------------------
# Costs / budgets / projection (Decimal)
# ---------------------------------------------------------------------------
def _cost(name: str) -> Decimal:
    return parse_money(load_pricing().get("costs", {}).get(name), field=f"costs.{name}")


def post_read_cost() -> Decimal:
    return _cost("post_read_usd")


def counts_request_cost() -> Decimal:
    return _cost("counts_recent_request_usd")


def user_read_cost() -> Decimal:
    return _cost("user_read_usd")


def _budget(name: str) -> Decimal:
    return parse_money(load_pricing().get("run_budget", {}).get(name), field=f"run_budget.{name}")


def count_budget() -> Decimal:
    return _budget("broad_market_count_budget_usd")


def post_budget() -> Decimal:
    return _budget("broad_market_post_budget_usd")


def future_enrichment_budget() -> Decimal:
    return _budget("broad_market_future_enrichment_budget_usd")


def total_allowance() -> Decimal:
    return parse_money(load_pricing().get("project_credit", {}).get("total_allowance_usd"),
                       field="project_credit.total_allowance_usd")


def current_spend() -> Decimal:
    return parse_money(load_pricing().get("project_credit", {}).get("current_estimated_spend_usd"),
                       field="project_credit.current_estimated_spend_usd")


def count_expected_cost() -> Decimal:
    return counts_request_cost() * Decimal(MAX_COUNT_REQUESTS)          # 20 * 0.005 = 0.100


def post_expected_cost() -> Decimal:
    return post_read_cost() * Decimal(MAX_TOTAL_POSTS)                  # 4000 * 0.005 = 20.000


def future_enrichment_expected_cost() -> Decimal:
    return user_read_cost() * Decimal(MAX_FUTURE_PROFILES)             # 30 * 0.010 = 0.300


def projection() -> dict[str, str]:
    counts, posts, future = count_expected_cost(), post_expected_cost(), future_enrichment_expected_cost()
    projected = current_spend() + counts + posts + future
    cushion = total_allowance() - projected
    return {
        "current_estimated_spend_usd": money_str(current_spend()),
        "count_expected_cost_usd": money_str(counts),
        "post_expected_cost_usd": money_str(posts),
        "future_enrichment_expected_cost_usd": money_str(future),
        "projected_total_activity_usd": money_str(projected),
        "total_allowance_usd": money_str(total_allowance()),
        "projected_credit_cushion_usd": money_str(cushion),
    }


def pricing_config_version() -> int:
    return int(load_pricing().get("pricing_config_version", 1))


# ---------------------------------------------------------------------------
# Canonical requests
# ---------------------------------------------------------------------------
def _queries_pairs() -> tuple[tuple[str, str], ...]:
    return tuple((q["id"], q["query"]) for q in load_broad_queries())


def _sector_map() -> dict[str, str]:
    return {q["id"]: q["sector_bucket"] for q in load_broad_queries()}


def _lane_map() -> dict[str, str]:
    return {q["id"]: q["discovery_lane"] for q in load_broad_queries()}


def _group_map() -> dict[str, str]:
    return {q["id"]: q["broad_group"] for q in load_broad_queries()}


@dataclass(frozen=True)
class CountRequest:
    query_config_version: int
    max_count_cost_usd: str
    count_budget_usd: str
    pricing_config_version: int
    canonical_request_schema_version: int = SCHEMA_VERSION
    operation_name: str = COUNT_OPERATION
    endpoint: str = COUNTS_ENDPOINT
    http_method: str = HTTP_METHOD
    max_count_requests: int = MAX_COUNT_REQUESTS
    approval_ttl_seconds: int = APPROVAL_TTL_SECONDS

    def canonical_dict(self) -> dict[str, Any]:
        return {
            "canonical_request_schema_version": self.canonical_request_schema_version,
            "operation_name": self.operation_name,
            "query_ids": sorted(q["id"] for q in load_broad_queries()),
            "queries": {qid: text for qid, text in sorted(_queries_pairs())},
            "query_config_version": self.query_config_version,
            "endpoint": self.endpoint, "http_method": self.http_method,
            "max_count_requests": self.max_count_requests,
            "window_policy": {k: WINDOW_POLICY[k] for k in sorted(WINDOW_POLICY)},
            "counts_recent_request_usd": money_str(counts_request_cost()),
            "max_count_cost_usd": self.max_count_cost_usd, "count_budget_usd": self.count_budget_usd,
            "pricing_config_version": self.pricing_config_version,
            "approval_ttl_seconds": self.approval_ttl_seconds,
        }

    def fingerprint(self) -> str:
        return "sha256:" + hashlib.sha256(
            json.dumps(self.canonical_dict(), sort_keys=True, separators=(",", ":")).encode()).hexdigest()


@dataclass(frozen=True)
class RetrievalRequest:
    query_config_version: int
    max_expected_cost_usd: str
    operation_budget_usd: str
    pricing_config_version: int
    canonical_request_schema_version: int = SCHEMA_VERSION
    operation_name: str = RUN_OPERATION
    endpoint: str = SEARCH_ENDPOINT
    http_method: str = HTTP_METHOD
    max_results_per_request: int = MAX_RESULTS_PER_REQUEST
    max_pages_per_query: int = MAX_PAGES_PER_QUERY
    max_results_per_query: int = MAX_RESULTS_PER_QUERY
    max_total_posts: int = MAX_TOTAL_POSTS
    max_http_requests: int = MAX_HTTP_REQUESTS
    expansions: str = "none"
    user_fields: str = "none"
    tweet_fields: str = "id,created_at,author_id,lang,public_metrics,entities,referenced_tweets"
    sort_order: str = "recency"
    connect_timeout_seconds: int = 5
    read_timeout_seconds: int = 30
    network_timeout_retry: str = "disabled"
    approval_ttl_seconds: int = APPROVAL_TTL_SECONDS

    def canonical_dict(self) -> dict[str, Any]:
        return {
            "canonical_request_schema_version": self.canonical_request_schema_version,
            "operation_name": self.operation_name,
            "query_ids": sorted(q["id"] for q in load_broad_queries()),
            "queries": {qid: text for qid, text in sorted(_queries_pairs())},
            "query_config_version": self.query_config_version,
            "sector_buckets": {k: _sector_map()[k] for k in sorted(_sector_map())},
            "discovery_lanes": {k: _lane_map()[k] for k in sorted(_lane_map())},
            "endpoint": self.endpoint, "http_method": self.http_method,
            "window_policy": {k: WINDOW_POLICY[k] for k in sorted(WINDOW_POLICY)},
            "max_results_per_request": self.max_results_per_request,
            "max_pages_per_query": self.max_pages_per_query,
            "max_results_per_query": self.max_results_per_query,
            "max_total_posts": self.max_total_posts, "max_http_requests": self.max_http_requests,
            "expansions": self.expansions, "user_fields": self.user_fields,
            "tweet_fields": self.tweet_fields, "sort_order": self.sort_order,
            "timeout_policy": {"connect_timeout_seconds": self.connect_timeout_seconds,
                               "read_timeout_seconds": self.read_timeout_seconds,
                               "network_timeout_retry": self.network_timeout_retry},
            "post_read_usd": money_str(post_read_cost()),
            "max_expected_cost_usd": self.max_expected_cost_usd, "operation_budget_usd": self.operation_budget_usd,
            "pricing_config_version": self.pricing_config_version,
            "approval_ttl_seconds": self.approval_ttl_seconds,
        }

    def fingerprint(self) -> str:
        return "sha256:" + hashlib.sha256(
            json.dumps(self.canonical_dict(), sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def build_count_request() -> CountRequest:
    assert_queries_valid()
    req = CountRequest(query_config_version=broad_config_version(),
                       max_count_cost_usd=money_str(count_expected_cost()),
                       count_budget_usd=money_str(count_budget()),
                       pricing_config_version=pricing_config_version())
    validate_count_request(req)
    return req


def validate_count_request(req: CountRequest) -> None:
    if len(load_broad_queries()) != MAX_QUERIES:
        raise BroadMarketValidationError("expected exactly 20 queries")
    if req.max_count_requests > MAX_COUNT_REQUESTS:
        raise BroadMarketValidationError("count requests exceed 20")
    if req.endpoint != COUNTS_ENDPOINT or req.http_method != HTTP_METHOD:
        raise BroadMarketValidationError("count endpoint/method invalid")
    if parse_money(req.max_count_cost_usd) > Decimal("0.100"):
        raise BroadMarketValidationError("count cost exceeds 0.100")
    if parse_money(req.count_budget_usd) > Decimal("0.150"):
        raise BroadMarketValidationError("count budget exceeds 0.150")
    if req.pricing_config_version != pricing_config_version():
        raise BroadMarketValidationError("pricing config version mismatch")


def build_retrieval_request() -> RetrievalRequest:
    assert_queries_valid()
    req = RetrievalRequest(query_config_version=broad_config_version(),
                           max_expected_cost_usd=money_str(post_expected_cost()),
                           operation_budget_usd=money_str(post_budget()),
                           pricing_config_version=pricing_config_version())
    validate_retrieval_request(req)
    return req


def validate_retrieval_request(req: RetrievalRequest) -> None:
    qs = load_broad_queries()
    if len(qs) != MAX_QUERIES:
        raise BroadMarketValidationError("expected exactly 20 queries")
    # literal text unchanged vs config
    live = {q["id"]: q["query"] for q in qs}
    for qid, text in req.canonical_dict()["queries"].items():
        if live.get(qid) != text:
            raise BroadMarketValidationError(f"query text changed for {qid}")
    if req.max_results_per_request > 100:
        raise BroadMarketValidationError("max_results_per_request exceeds 100")
    if req.max_pages_per_query > 2:
        raise BroadMarketValidationError("max_pages_per_query exceeds 2 (no third page)")
    if req.max_results_per_query > 200:
        raise BroadMarketValidationError("max_results_per_query exceeds 200")
    if req.max_total_posts > 4000:
        raise BroadMarketValidationError("max_total_posts exceeds 4000")
    if req.max_http_requests > 40:
        raise BroadMarketValidationError("max_http_requests exceeds 40")
    if req.expansions != "none":
        raise BroadMarketValidationError("expansions must be none")
    if req.user_fields != "none":
        raise BroadMarketValidationError("user_fields must be none")
    if req.endpoint != SEARCH_ENDPOINT or req.http_method != HTTP_METHOD:
        raise BroadMarketValidationError("endpoint/method invalid")
    if req.network_timeout_retry != "disabled":
        raise BroadMarketValidationError("retry must be disabled")
    if parse_money(req.max_expected_cost_usd) > Decimal("20.000"):
        raise BroadMarketValidationError("expected cost exceeds 20.000")
    if parse_money(req.operation_budget_usd) > Decimal("20.500"):
        raise BroadMarketValidationError("operation budget exceeds 20.500")
    # sector labels valid
    for q in qs:
        if q["sector_bucket"] not in SECTOR_BUCKETS:
            raise BroadMarketValidationError(f"invalid sector_bucket {q['sector_bucket']}")
    # required broad-group coverage among queries
    groups = {q["broad_group"] for q in qs}
    if not REQUIRED_BROAD_GROUPS <= groups:
        raise BroadMarketValidationError("missing a required broad group")
    # project-credit projection fail-closed
    proj = projection()
    if parse_money(proj["projected_total_activity_usd"]) > Decimal("21.485"):
        raise BroadMarketValidationError("projected activity exceeds 21.485")
    if parse_money(proj["projected_total_activity_usd"]) > total_allowance():
        raise BroadMarketValidationError("projected activity exceeds total allowance")


# ---------------------------------------------------------------------------
# Cross-run deduplication (prior runs = canary + six-query pilot)
# ---------------------------------------------------------------------------
def prior_post_ids() -> set[str]:
    ids: set[str] = set()
    canary = OUTPUT_DIR / "canary" / "raw_response.json"
    if canary.exists():
        d = json.loads(canary.read_text())
        ids.update(str(t["id"]) for t in (d.get("data") or []))
    pilot_raw = OUTPUT_DIR / "six_query_pilot" / "raw_responses_by_query"
    if pilot_raw.is_dir():
        for f in pilot_raw.glob("*.json"):
            d = json.loads(f.read_text())
            ids.update(str(t["id"]) for t in (d.get("data") or []) if isinstance(d, dict))
    return ids


def load_count_snapshot_review() -> dict[str, Any] | None:
    """Non-fingerprinted review metadata derived from the SAVED count outputs.

    Read-only: used only for the retrieval approval display. Never enters the
    canonical request or its fingerprint (which describe authorization limits,
    not the temporary count snapshot). Returns None if no count run exists.
    """
    path = BROAD_DIR / "count_preflight" / "count_metrics.json"
    if not path.exists():
        return None
    metrics = json.loads(path.read_text())
    total = sum(int(r["total_recent_count"]) for r in metrics)
    capped = sum(min(int(r["total_recent_count"]), MAX_RESULTS_PER_QUERY) for r in metrics)
    over = [r for r in metrics if int(r["total_recent_count"]) > MAX_RESULTS_PER_QUERY]
    est = post_read_cost() * Decimal(capped)
    return {
        "total_aggregate_7d_count": total,
        "aggregate_is_not_unique_posts": True,
        "expected_resources_after_200_cap": capped,
        "expected_post_cost_usd": money_str(est),
        "max_authorized_posts": MAX_TOTAL_POSTS,
        "max_authorized_post_cost_usd": money_str(post_expected_cost()),
        "queries_over_cap": [
            {"query_id": r["query_id"], "count": int(r["total_recent_count"]),
             "omitted_estimate": int(r["total_recent_count"]) - MAX_RESULTS_PER_QUERY}
            for r in over],
        "caveat": "expected cost is not a guarantee; counts and the recent window can change",
    }


def dedup_against_prior(new_posts_by_query: dict[str, list[dict]]) -> dict[str, Any]:
    prior = prior_post_ids()
    seen_new: set[str] = set()
    provenance: dict[str, list[str]] = {}
    unique_new, cross_run_dupes, within_run_dupes = [], [], []
    for qid, raws in new_posts_by_query.items():
        for r in raws:
            pid = str(r.get("id"))
            provenance.setdefault(pid, [])
            if qid not in provenance[pid]:
                provenance[pid].append(qid)
            if pid in prior:
                cross_run_dupes.append(pid)
                continue
            if pid in seen_new:
                within_run_dupes.append(pid)
                continue
            seen_new.add(pid)
            unique_new.append(r)
    return {"unique_new_posts": unique_new, "provenance": provenance,
            "cross_run_duplicates": sorted(set(cross_run_dupes)),
            "within_run_duplicates": sorted(set(within_run_dupes)),
            "new_discovery_count": len(unique_new)}

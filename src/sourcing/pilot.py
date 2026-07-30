"""Six-query sourcing pilot — canonical request, validation, cost, metrics.

Preparation module. Reuses the EXISTING deterministic pipeline (parse, URL
normalization, dedup, ownership attribution, registry, lead disposition) without
modifying it. Never calls the network by itself.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from decimal import Decimal
from typing import Any, Optional

from .config import OUTPUT_DIR, load_queries
from .money import money_str, parse_money
from .pricing import load_pricing

OPERATION_NAME = "six_query_sourcing_pilot"
SCHEMA_VERSION = 1
ENDPOINT = "/2/tweets/search/recent"
HTTP_METHOD = "GET"
APPROVAL_TTL_SECONDS = 900

MAX_RESULTS_PER_QUERY = 50
MAX_TOTAL_POSTS = 300
MAX_HTTP_REQUESTS = 6

# Guarded relative window (same guard bands as the canary schema v2).
WINDOW_POLICY = {
    "mode": "recent_relative", "lookback_days": 7,
    "start_guard_seconds": 300, "end_guard_seconds": 30,
    "resolve_once_at_execution": True,
}

PILOT_DIR = OUTPUT_DIR / "six_query_pilot"
OUTPUT_PATHS = {
    "raw_by_query_dir": PILOT_DIR / "raw_responses_by_query",
    "parsed_posts": PILOT_DIR / "parsed_posts.json",
    "pilot_manifest": PILOT_DIR / "pilot_manifest.json",
    "pilot_cost_ledger": PILOT_DIR / "pilot_cost_ledger.json",
    "pilot_query_metrics": PILOT_DIR / "pilot_query_metrics.json",
    "pilot_exclusion_audit": PILOT_DIR / "pilot_exclusion_audit.json",
    "pilot_dedup_audit": PILOT_DIR / "pilot_dedup_audit.json",
    "pilot_candidate_report": PILOT_DIR / "pilot_candidate_report.json",
    "pilot_actionable_shortlist": PILOT_DIR / "pilot_actionable_shortlist.json",
    "pilot_summary": PILOT_DIR / "pilot_summary.json",
    "sanitized_pilot_fixture": PILOT_DIR / "sanitized_pilot_fixture.json",
}

APPROVED_QUERY_IDS = ["q1_artifact_infra", "q2_artifact_devtools", "q3_founder_infra_devtools",
                      "q4_traction_devtools", "q5_traction_workflows", "q6_founder_workflows"]


class PilotValidationError(ValueError):
    """Raised when the pilot request violates a fail-closed constraint."""


# ---------------------------------------------------------------------------
# Cost / budget (Decimal only)
# ---------------------------------------------------------------------------
def post_read_cost() -> Decimal:
    return parse_money(load_pricing().get("costs", {}).get("post_read_usd"),
                       field="costs.post_read_usd")


def pilot_post_budget() -> Decimal:
    return parse_money(load_pricing().get("run_budget", {}).get("global_pilot_post_budget_usd"),
                       field="run_budget.global_pilot_post_budget_usd")


def pilot_expected_cost() -> Decimal:
    return post_read_cost() * Decimal(MAX_TOTAL_POSTS)


def pricing_config_version() -> int:
    return int(load_pricing().get("pricing_config_version", 1))


def _query_texts() -> dict[str, str]:
    from .pipeline import build_query_specs
    return {s.id: s.query for s in build_query_specs(None)}


# ---------------------------------------------------------------------------
# Canonical request
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class PilotRequest:
    query_ids: tuple[str, ...]
    queries: tuple[tuple[str, str], ...]   # (query_id, literal_query) pairs
    query_config_version: int
    max_expected_cost_usd: str
    global_pilot_post_budget_usd: str
    pricing_config_version: int
    canonical_request_schema_version: int = SCHEMA_VERSION
    operation_name: str = OPERATION_NAME
    endpoint: str = ENDPOINT
    http_method: str = HTTP_METHOD
    max_results_per_query: int = MAX_RESULTS_PER_QUERY
    max_total_posts: int = MAX_TOTAL_POSTS
    max_http_requests: int = MAX_HTTP_REQUESTS
    expansions: str = "none"
    user_fields: str = "none"
    pagination: bool = False
    sort_order: str = "recency"
    connect_timeout_seconds: int = 5
    read_timeout_seconds: int = 30
    network_timeout_retry: str = "disabled"
    approval_ttl_seconds: int = APPROVAL_TTL_SECONDS

    def canonical_dict(self) -> dict[str, Any]:
        return {
            "canonical_request_schema_version": self.canonical_request_schema_version,
            "operation_name": self.operation_name,
            "query_ids": sorted(self.query_ids),
            "queries": {qid: text for qid, text in sorted(self.queries)},
            "query_config_version": self.query_config_version,
            "endpoint": self.endpoint,
            "http_method": self.http_method,
            "max_results_per_query": self.max_results_per_query,
            "max_total_posts": self.max_total_posts,
            "max_http_requests": self.max_http_requests,
            "expansions": self.expansions,
            "user_fields": self.user_fields,
            "pagination": self.pagination,
            "sort_order": self.sort_order,
            "window_policy": {k: WINDOW_POLICY[k] for k in sorted(WINDOW_POLICY)},
            "timeout_policy": {
                "connect_timeout_seconds": self.connect_timeout_seconds,
                "read_timeout_seconds": self.read_timeout_seconds,
                "network_timeout_retry": self.network_timeout_retry,
            },
            "post_read_usd": money_str(post_read_cost()),
            "max_expected_cost_usd": self.max_expected_cost_usd,
            "global_pilot_post_budget_usd": self.global_pilot_post_budget_usd,
            "pricing_config_version": self.pricing_config_version,
            "approval_ttl_seconds": self.approval_ttl_seconds,
        }

    def fingerprint(self) -> str:
        blob = json.dumps(self.canonical_dict(), sort_keys=True, separators=(",", ":"))
        return "sha256:" + hashlib.sha256(blob.encode("utf-8")).hexdigest()


def build_pilot_request() -> PilotRequest:
    texts = _query_texts()
    req = PilotRequest(
        query_ids=tuple(sorted(texts)),
        queries=tuple(sorted(texts.items())),
        query_config_version=int(load_queries().get("config_version", 1)),
        max_expected_cost_usd=money_str(pilot_expected_cost()),
        global_pilot_post_budget_usd=money_str(pilot_post_budget()),
        pricing_config_version=pricing_config_version(),
    )
    validate_pilot_request(req)
    return req


def validate_pilot_request(req: PilotRequest) -> None:
    ids = sorted(req.query_ids)
    if ids != sorted(APPROVED_QUERY_IDS):
        raise PilotValidationError("query-ID set does not match the approved six")
    if len(ids) != 6:
        raise PilotValidationError(f"expected exactly 6 queries, got {len(ids)}")
    # literal text must match the current source of truth
    live = _query_texts()
    for qid, text in req.queries:
        if live.get(qid) != text:
            raise PilotValidationError(f"literal query text changed for {qid}")
    if req.max_results_per_query > 50:
        raise PilotValidationError("max_results_per_query exceeds 50")
    if req.max_total_posts > 300:
        raise PilotValidationError("max_total_posts exceeds 300")
    if req.max_http_requests > 6:
        raise PilotValidationError("max_http_requests exceeds 6")
    if req.pagination:
        raise PilotValidationError("pagination must be disabled")
    if req.expansions != "none":
        raise PilotValidationError("expansions must be none")
    if req.user_fields != "none":
        raise PilotValidationError("user_fields must be none (no author enrichment)")
    if req.endpoint != ENDPOINT or req.http_method != HTTP_METHOD:
        raise PilotValidationError("endpoint/method must be GET recent-search")
    if parse_money(req.max_expected_cost_usd) > Decimal("1.500"):
        raise PilotValidationError("expected cost exceeds 1.500")
    if parse_money(req.global_pilot_post_budget_usd) > Decimal("1.600"):
        raise PilotValidationError("pilot budget exceeds 1.600")


# ---------------------------------------------------------------------------
# Dedup + provenance + metrics (uses EXISTING pipeline, unmodified)
# ---------------------------------------------------------------------------
def dedup_with_provenance(posts_by_query: dict[str, list[dict]]) -> tuple[list, dict, int]:
    """Return (unique parsed posts, {post_id: [query_ids]}, duplicate_count)."""
    from .x_client import parse_post
    provenance: dict[str, list[str]] = {}
    unique: dict[str, Any] = {}
    total = 0
    for qid, raws in posts_by_query.items():
        for raw in raws:
            total += 1
            pid = str(raw.get("id"))
            provenance.setdefault(pid, [])
            if qid not in provenance[pid]:
                provenance[pid].append(qid)
            if pid not in unique:
                unique[pid] = parse_post(raw, query_groups=[qid])
    dup = total - len(unique)
    return list(unique.values()), provenance, dup


def _safe_rate(numerator: int, denominator: int, name: str) -> dict:
    if denominator == 0:
        return {"value": None, "explanation": f"denominator ({name}) is zero"}
    return {"value": round(numerator / denominator, 4),
            "formula": f"{numerator}/{denominator}", "denominator": name}


def compute_pilot_metrics(posts_by_query: dict[str, list[dict]]) -> dict[str, Any]:
    """Compute pilot + per-query metrics using the existing deterministic layers."""
    from .filters import extract
    from .ownership import analyze

    unique, provenance, dup = dedup_with_provenance(posts_by_query)
    total_returned = sum(len(v) for v in posts_by_query.values())

    counts = {k: 0 for k in (
        "direct_builder_claim", "third_party_announcement", "industry_commentary", "unclear",
        "level_a", "level_b_self_claim", "archive_third_party", "archive_commentary",
        "archive_established_org", "keep_verified", "keep_for_enrichment", "manual_review")}
    authors, projects, shortlist = set(), set(), []
    per_post = []
    for post in unique:
        ex = extract(post, None)
        o = analyze(ex, bool(ex.matched_categories))
        authors.add(post.author_id)
        has_a = "A" in o.artifact_evidence_level
        if has_a:
            counts["level_a"] += 1
        if "B" in o.artifact_evidence_level:
            counts["level_b_self_claim"] += 1
        counts[o.announcement_attribution] = counts.get(o.announcement_attribution, 0) + 1
        disp = o.lead_disposition
        counts[disp] = counts.get(disp, 0) + 1
        if o.claimed_project_name or o.verified_project_name:
            projects.add(o.verified_project_name or o.claimed_project_name)
        if disp in ("keep_verified", "keep_for_enrichment"):
            shortlist.append(post.id)
        per_post.append({"id": post.id, "author_id": post.author_id,
                         "surfaced_by_queries": provenance.get(post.id, []),
                         "attribution": o.announcement_attribution, "disposition": disp,
                         "level_a": has_a})

    unique_n = len(unique)
    actionable = len(shortlist)
    metrics = {
        "posts_requested": len(posts_by_query) * MAX_RESULTS_PER_QUERY,
        "posts_returned": total_returned,
        "unique_post_ids": unique_n,
        "duplicate_posts_across_queries": dup,
        "unique_authors": len(authors),
        "unique_detected_projects": len(projects),
        **counts,
        "actionable_shortlist_size": actionable,
        "verified_artifact_rate": _safe_rate(counts["level_a"], unique_n, "unique_post_ids"),
        "direct_builder_rate": _safe_rate(counts["direct_builder_claim"], unique_n, "unique_post_ids"),
        "actionable_lead_rate": _safe_rate(actionable, unique_n, "unique_post_ids"),
        "duplicate_rate": _safe_rate(dup, total_returned, "posts_returned"),
        "estimated_retrieval_cost_usd": money_str(post_read_cost() * Decimal(total_returned)),
        "estimated_cost_per_actionable_lead_usd": (
            money_str(post_read_cost() * Decimal(total_returned) / Decimal(actionable))
            if actionable else None),
        "cost_per_actionable_lead_note": (None if actionable else
                                          "no actionable leads; cost-per-lead undefined"),
    }
    # per-query metrics
    per_query = {}
    for qid, raws in posts_by_query.items():
        ids = [str(r.get("id")) for r in raws]
        pq = [p for p in per_post if qid in p["surfaced_by_queries"]]
        db = sum(1 for p in pq if p["attribution"] == "direct_builder_claim")
        la = sum(1 for p in pq if p["level_a"])
        act = sum(1 for p in pq if p["disposition"] in ("keep_verified", "keep_for_enrichment"))
        per_query[qid] = {
            "returned": len(ids), "unique_contributed": len(pq),
            "direct_builder_claim": db, "level_a": la, "actionable": act,
            "direct_builder_rate": _safe_rate(db, len(pq), "unique_contributed"),
        }
    return {"overall": metrics, "per_query": per_query, "per_post": per_post,
            "provenance": provenance}

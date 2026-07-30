"""Pipeline orchestration + API-usage estimation.

Honors the frozen MVP budgets by default (<=300 posts, <=20 enrichments,
<=10 LLM analyses, top 5 reviewed, 1 final pick) and the cost controls in
:mod:`sourcing.cli`.

``estimate_usage`` is deterministic and makes NO network calls, so ``--dry-run``
and the pre-run budget check both rely on it.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from math import ceil
from typing import Optional

from . import classify as classify_mod
from . import report as report_mod
from .cache import Cache
from .config import (
    OUTPUT_DIR,
    Secrets,
    ensure_dirs,
    load_queries,
)
from .evidence import decay_all
from .filters import PostExtraction, classify_exclusion, extract
from .llm import analyze_companies
from .models import RawPost, RawUser, ScoredCompany
from .platform_risk import assess_platform_risk, replication_test
from .scoring import extract_features, score_company

log = logging.getLogger(__name__)

# Frozen MVP caps (upper bounds; CLI values are clamped to these).
FROZEN_MAX_POSTS = 300
FROZEN_MAX_USERS = 20
FROZEN_MAX_TIMELINES = 20
FROZEN_MAX_LLM = 10
FROZEN_REVIEW_TOP = 5


@dataclass
class RunConfig:
    max_posts: int = FROZEN_MAX_POSTS
    max_users: int = FROZEN_MAX_USERS
    max_timelines: int = FROZEN_MAX_TIMELINES
    posts_per_timeline: int = 10
    budget_limit: int = 0  # 0 => no explicit limit (gate is opt-in via --budget-limit)
    dry_run: bool = False
    query_group: Optional[str] = None  # "A"/"B"/"C"/"D" or None for all
    output_limit: int = FROZEN_REVIEW_TOP
    paginate: bool = False
    use_llm: bool = False
    enrich: bool = True
    # Page size is a distinct request parameter (part of the fingerprint).
    page_size: int = 100
    # Approval-control cost gates.
    op_budget_limit: int = 0        # max posts per single query op (0 => unset)
    acknowledge_stale_pricing: bool = False

    def clamp(self) -> "RunConfig":
        """Clamp to the frozen MVP ceilings (never exceed without confirmation)."""
        self.max_posts = min(self.max_posts, FROZEN_MAX_POSTS)
        self.max_users = min(self.max_users, FROZEN_MAX_USERS)
        self.max_timelines = min(self.max_timelines, FROZEN_MAX_TIMELINES)
        self.page_size = min(100, max(10, self.page_size))
        return self


@dataclass
class QuerySpec:
    id: str
    lane: str
    topics: list[str]
    query: str  # includes the global-filter suffix
    objective: str = ""
    expected_strong_signals: str = ""
    expected_false_positives: str = ""

    @property
    def label(self) -> str:
        return f"{self.lane}×{'+'.join(self.topics)}"


@dataclass
class Estimate:
    queries: list[QuerySpec]
    search_requests: int
    est_posts_from_search: int
    user_requests: int
    est_users: int
    timeline_requests: int
    est_posts_from_timelines: int
    total_requests: int
    est_posts_read: int
    llm_calls: int
    within_budget: bool
    budget_limit: int


# ---------------------------------------------------------------------------
# Query building
# ---------------------------------------------------------------------------
def build_query_specs(query_group: Optional[str] = None) -> list[QuerySpec]:
    """Build the curated query specs, optionally filtered to one topic group.

    A topic filter keeps any query whose topic list INCLUDES that group (a query
    may span multiple topics, e.g. founder_transition × [A, B]).
    """
    cfg = load_queries()
    gf = cfg.get("global_filters", {})
    suffix_parts = []
    if gf.get("lang"):
        suffix_parts.append(f"lang:{gf['lang']}")
    if gf.get("exclude_retweets", True):
        suffix_parts.append("-is:retweet")
    if gf.get("exclude_replies", False):
        suffix_parts.append("-is:reply")
    suffix = (" " + " ".join(suffix_parts)) if suffix_parts else ""

    specs: list[QuerySpec] = []
    for q in cfg.get("queries", []):
        topics = [str(t) for t in q.get("topics", [])]
        if query_group and query_group.upper() not in [t.upper() for t in topics]:
            continue
        specs.append(
            QuerySpec(
                id=q["id"],
                lane=q["lane"],
                topics=topics,
                query=f"{q['query']}{suffix}",
                objective=q.get("objective", ""),
                expected_strong_signals=q.get("expected_strong_signals", ""),
                expected_false_positives=q.get("expected_false_positives", ""),
            )
        )
    return specs


# ---------------------------------------------------------------------------
# Usage estimation (no network)
# ---------------------------------------------------------------------------
def estimate_usage(cfg: RunConfig) -> Estimate:
    queries = build_query_specs(cfg.query_group)
    per_page = min(100, max(10, cfg.page_size))
    # Search: issue queries until the post cap is reached (1 page each unless paginate).
    est_posts_from_search = min(cfg.max_posts, len(queries) * per_page)
    search_requests = min(len(queries), ceil(cfg.max_posts / per_page)) if queries else 0
    search_requests = max(search_requests, min(len(queries), 1)) if queries else 0
    # More realistically we hit one request per query up to the cap:
    search_requests = min(len(queries), max(1, ceil(est_posts_from_search / per_page))) if queries else 0

    est_users = min(cfg.max_users, est_posts_from_search)
    user_requests = ceil(est_users / 100) if est_users else 0

    timeline_requests = min(cfg.max_timelines, cfg.output_limit if cfg.output_limit else FROZEN_REVIEW_TOP)
    est_posts_from_timelines = timeline_requests * cfg.posts_per_timeline

    total_requests = search_requests + user_requests + timeline_requests
    est_posts_read = est_posts_from_search + est_posts_from_timelines
    llm_calls = min(FROZEN_MAX_LLM, cfg.output_limit * 2) if cfg.use_llm else 0

    within = cfg.budget_limit <= 0 or est_posts_read <= cfg.budget_limit
    return Estimate(
        queries=queries,
        search_requests=search_requests,
        est_posts_from_search=est_posts_from_search,
        user_requests=user_requests,
        est_users=est_users,
        timeline_requests=timeline_requests,
        est_posts_from_timelines=est_posts_from_timelines,
        total_requests=total_requests,
        est_posts_read=est_posts_read,
        llm_calls=llm_calls,
        within_budget=within,
        budget_limit=cfg.budget_limit,
    )


def format_estimate(est: Estimate, cfg: RunConfig) -> str:
    lines = [
        "=== Estimated X API usage (no calls made yet) ===",
        f"  Curated queries:          {len(est.queries)}"
        + (f" (topic {cfg.query_group})" if cfg.query_group else " (all topics)"),
        f"  Recent-search requests:   ~{est.search_requests}",
        f"  Posts read from search:   ~{est.est_posts_from_search} (cap {cfg.max_posts})",
        f"  User-profile requests:    ~{est.user_requests} (<= {cfg.max_users} users)",
        f"  Timeline requests:        ~{est.timeline_requests} "
        f"(x {cfg.posts_per_timeline} posts each = ~{est.est_posts_from_timelines} posts)",
        f"  --------------------------------------------",
        f"  TOTAL API requests:       ~{est.total_requests}",
        f"  TOTAL posts read:         ~{est.est_posts_read}",
        f"  LLM analysis calls:       ~{est.llm_calls}"
        + ("" if cfg.use_llm else " (LLM disabled)"),
        f"  Budget limit (posts):     "
        + (str(cfg.budget_limit) if cfg.budget_limit > 0 else "none (set --budget-limit to enforce)"),
        f"  Within budget:            "
        + ("YES" if est.within_budget else "NO — exceeds limit"),
        "================================================",
    ]
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Full run
# ---------------------------------------------------------------------------
def run_pipeline(cfg: RunConfig, secrets: Secrets, cache: Cache) -> dict:
    """Execute the full pipeline and write outputs. Returns the run summary dict."""
    from .x_client import XClient  # local import: not needed for dry-run

    from .validator import validate_and_announce
    from .approval import build_canonical_request, check_execution_gate, load_decisions
    from .config import load_queries
    from .pricing import is_pricing_stale

    ensure_dirs()
    started = datetime.now(timezone.utc)
    client = XClient(secrets, cache)
    specs = build_query_specs(cfg.query_group)

    # Approval-control preconditions (evaluated once).
    decisions = load_decisions()
    config_version = load_queries().get("config_version", 1)
    est = estimate_usage(cfg)
    global_budget_ok = est.within_budget
    pricing_ok = (not is_pricing_stale()) or cfg.acknowledge_stale_pricing
    skipped_queries: list[dict] = []

    # 1. Search --------------------------------------------------------------
    all_posts: dict[str, RawPost] = {}
    page_size = min(100, max(10, cfg.page_size))
    for spec in specs:
        if len(all_posts) >= cfg.max_posts:
            break
        # Validate + print/log the EXACT query BEFORE anything else.
        validate_and_announce(spec.query, label=spec.id)

        # Fail-closed approval gate BEFORE any post retrieval.
        req = build_canonical_request(spec, cfg, config_version)
        op_est = page_size * (2 if cfg.paginate else 1)
        op_budget_ok = cfg.op_budget_limit <= 0 or op_est <= cfg.op_budget_limit
        gate = check_execution_gate(
            req,
            decisions,
            global_budget_ok=global_budget_ok,
            op_budget_ok=op_budget_ok,
            pricing_ok=pricing_ok,
        )
        if not gate.allowed:
            log.warning("GATE BLOCKED %s: %s", spec.id, "; ".join(gate.reasons))
            print(f"[{spec.id}] BLOCKED (fail-closed): {'; '.join(gate.reasons)}")
            skipped_queries.append({"query_id": spec.id, "reasons": gate.reasons})
            continue

        remaining = cfg.max_posts - len(all_posts)
        posts = client.search_recent(
            spec.query,
            max_results=min(page_size, remaining),
            query_groups=spec.topics,
            paginate=cfg.paginate,
        )
        for p in posts:
            if not p.query_lanes:
                p.query_lanes = [spec.lane]
            if p.id in all_posts:
                # merge topic + lane tags for a post surfaced by multiple queries
                existing = all_posts[p.id]
                for g in p.query_groups:
                    if g not in existing.query_groups:
                        existing.query_groups.append(g)
                if spec.lane not in existing.query_lanes:
                    existing.query_lanes.append(spec.lane)
            else:
                all_posts[p.id] = p
    log.info("Collected %d unique posts", len(all_posts))

    # 2. Enrich authors (batch, capped) -------------------------------------
    author_ids = list(dict.fromkeys(p.author_id for p in all_posts.values() if p.author_id))
    author_ids = author_ids[: cfg.max_users]
    users = client.get_users(author_ids)
    users_by_id: dict[str, RawUser] = {u.id: u for u in users}

    # 3. Extract + exclude ---------------------------------------------------
    extractions: list[PostExtraction] = []
    excluded_count = 0
    for post in all_posts.values():
        user = users_by_id.get(post.author_id)
        ex = extract(post, user)
        is_excl, reason = classify_exclusion(post, ex, user)
        ex.excluded = is_excl
        ex.exclusion_reason = reason
        if is_excl:
            excluded_count += 1
            continue
        # time decay applied to signals now
        decay_all(ex.signals)
        extractions.append(ex)
    log.info("Kept %d posts after exclusion (%d excluded)", len(extractions), excluded_count)

    # 4. Aggregate to companies ---------------------------------------------
    from .aggregate import aggregate

    companies = aggregate(extractions, users_by_id)
    log.info("Aggregated into %d companies", len(companies))

    # Engagement Signal (NON-scoring): computed locally from public_metrics.
    from .engagement import apply_engagement_signal

    for comp in companies:
        apply_engagement_signal(comp, all_posts)

    # Build a text corpus per company for scoring/features.
    text_by_company: dict[str, str] = {}
    ex_by_post = {ex.post.id: ex for ex in extractions}
    for comp in companies:
        parts = []
        for pid in comp.post_ids:
            ex = ex_by_post.get(pid)
            if ex:
                parts.append(ex.post.text)
                u = users_by_id.get(ex.post.author_id)
                if u and u.description:
                    parts.append(u.description)
        text_by_company[comp.canonical_id] = "\n".join(parts)

    # 5. Score + platform risk + replication + classify ---------------------
    scored: list[ScoredCompany] = []
    for comp in companies:
        text = text_by_company.get(comp.canonical_id, "")
        sc = score_company(comp, text)
        features = extract_features(comp, text)
        sc.platform_risk = assess_platform_risk(comp, features, text)
        sc.replication = replication_test(features)
        sc.classification = classify_mod.classify(sc, features)
        scored.append(sc)

    # Rank: score first, then Discovery Status (rarer = better), then Engagement
    # Signal LAST as a low-priority tie-breaker. Engagement never enters the
    # numeric score, so it cannot outweigh the core factors.
    discovery_rank = {
        "Under the radar": 0,
        "Emerging": 1,
        "Already visible": 2,
        "Widely known": 3,
    }
    scored.sort(
        key=lambda s: (
            -s.total_score,
            discovery_rank.get(s.discovery_status.value, 9),
            -s.company.engagement_normalized,
        )
    )

    # 6. LLM analysis (top 10 max) ------------------------------------------
    if cfg.use_llm:
        analyze_companies(scored, secrets, max_analyses=FROZEN_MAX_LLM)

    # 7. Top-N selection, enrichment (top 5), actionability -----------------
    top = scored[: cfg.output_limit]
    review_top = scored[:FROZEN_REVIEW_TOP]
    if cfg.enrich:
        from .enrich import enrich_company

        for sc in review_top:
            enrich_company(sc, cache)
    for sc in top:
        report_mod.add_actionability(sc, text_by_company.get(sc.company.canonical_id, ""))

    # 8. Outputs -------------------------------------------------------------
    from .timeutil import to_rfc3339

    finished = datetime.now(timezone.utc)
    run_meta = {
        "generated_at": to_rfc3339(finished),
        "companies_total": len(companies),
    }
    report_mod.write_all_candidates(scored, OUTPUT_DIR / "all_candidates.csv")
    report_mod.write_top_leads_csv(top, OUTPUT_DIR / "top_leads.csv")
    report_mod.write_top_leads_md(top, OUTPUT_DIR / "top_leads.md", run_meta)
    report_mod.write_review_csv(review_top, OUTPUT_DIR / "review.csv")

    summary = {
        "started_at": to_rfc3339(started),
        "finished_at": to_rfc3339(finished),
        "config": cfg.__dict__,
        "queries_run": len(specs) - len(skipped_queries),
        "query_ids": [s.id for s in specs],
        "queries_blocked": skipped_queries,
        "posts_collected": len(all_posts),
        "posts_excluded": excluded_count,
        "posts_kept": len(extractions),
        "companies": len(companies),
        "api_calls_made": client.api_calls,
        "cache_counts": cache.counts(),
        "top_pick": top[0].company.name if top else None,
        "classification_breakdown": _classification_breakdown(scored),
        "outputs": [
            str(OUTPUT_DIR / f)
            for f in ("all_candidates.csv", "top_leads.csv", "top_leads.md", "review.csv", "run_summary.json")
        ],
    }
    report_mod.write_run_summary(summary, OUTPUT_DIR / "run_summary.json")
    return summary


def _classification_breakdown(scored: list[ScoredCompany]) -> dict[str, int]:
    out: dict[str, int] = {}
    for sc in scored:
        out[sc.classification.value] = out.get(sc.classification.value, 0) + 1
    return out

"""Phase 2 count preflight.

Runs ONLY GET /2/tweets/counts/recent for the six curated queries against ONE
frozen shared UTC window. It does NOT retrieve posts, enrich users, fetch
timelines/replies/quotes, call an LLM, access GitHub, or approve any query.

The engine never decides run/revise/disable from count volume; it only reports.
"""

from __future__ import annotations

import hashlib
import json
import logging
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from .approval import (
    build_canary_request,
    build_canonical_request,
    load_decisions,
    seed_pending_decisions,
)
from .config import OUTPUT_DIR, Secrets, ensure_dirs, load_queries
from .ledger import (
    COST_AUDIT_PATH,
    current_run_ledger,
    project_to_date_ledger,
    record_prior_preflight_and_correction,
    record_recent_count_event,
)
from .analysis import volume_assessment
from .pipeline import RunConfig, build_query_specs
from .validator import validate_query

log = logging.getLogger(__name__)

# Canary configuration whose fingerprint we display for reviewer approval.
CANARY_PAGE_SIZE = 10

# API guard bands: the recent-counts window must sit inside (now-7d, now).
# end_time is anchored slightly in the past; start_time is nudged forward from
# the exact 7-day mark so it stays on/after the API's now-7d lower bound as the
# run progresses. Disclosed in the audit.
END_GUARD_SECONDS = 15
START_GUARD_SECONDS = 120

COUNTS_JSON_PATH = OUTPUT_DIR / "counts.json"
QUERY_AUDIT_PATH = OUTPUT_DIR / "query_audit.md"


def _rfc3339(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def query_hash(literal_query: str) -> str:
    return "sha256:" + hashlib.sha256(literal_query.encode("utf-8")).hexdigest()


def extract_operators(query: str) -> list[str]:
    """List every X search operator used in a query (for the audit)."""
    import re

    ops: list[str] = []
    if '"' in query:
        n = query.count('"') // 2
        ops.append(f"exact phrase(s) x{n}")
    if re.search(r"\bOR\b", query):
        ops.append("Boolean OR")
    if "(" in query:
        ops.append("grouping ( )")
    # field / boolean operators, including negated ones like -is:retweet
    for tok in sorted(set(re.findall(r"-?[a-z_]+:[^\s()]+", query))):
        ops.append(tok)
    # bare exclusions like -word (not operator:value)
    for tok in sorted(set(re.findall(r"(?<!\S)-[A-Za-z][\w-]*(?![:\w])", query))):
        ops.append(f"exclusion {tok}")
    return ops


def _human_duration(seconds: int) -> str:
    days, rem = divmod(int(seconds), 86400)
    hours, rem = divmod(rem, 3600)
    minutes, secs = divmod(rem, 60)
    parts = []
    if days:
        parts.append(f"{days} day{'s' if days != 1 else ''}")
    if hours:
        parts.append(f"{hours} hour{'s' if hours != 1 else ''}")
    if minutes:
        parts.append(f"{minutes} minute{'s' if minutes != 1 else ''}")
    if secs:
        parts.append(f"{secs} second{'s' if secs != 1 else ''}")
    return ", ".join(parts) or "0 seconds"


@dataclass
class FrozenWindow:
    request_anchor_utc: str   # the execution-time anchor (end_time == this)
    start_time_utc: str
    end_time_utc: str
    granularity: str = "day"
    start_guard_seconds: int = START_GUARD_SECONDS
    end_guard_seconds: int = END_GUARD_SECONDS
    effective_window_seconds: int = 0
    effective_window_human_readable: str = ""

    def __post_init__(self):
        if not self.effective_window_seconds:
            start = datetime.strptime(self.start_time_utc, "%Y-%m-%dT%H:%M:%SZ")
            end = datetime.strptime(self.end_time_utc, "%Y-%m-%dT%H:%M:%SZ")
            self.effective_window_seconds = int((end - start).total_seconds())
        if not self.effective_window_human_readable:
            self.effective_window_human_readable = _human_duration(self.effective_window_seconds)


def freeze_window(now: Optional[datetime] = None) -> FrozenWindow:
    """Freeze one exact shared window at the start of the run.

    request_anchor_utc is the execution-time anchor (now, pulled back by
    END_GUARD_SECONDS). end_time_utc == request_anchor_utc. start_time_utc is
    seven days before the anchor, nudged forward by START_GUARD_SECONDS to
    satisfy the recent-counts now-7d lower bound. The SAME window is used for all
    six count requests.
    """
    now = (now or datetime.now(timezone.utc)).replace(microsecond=0)
    anchor = now - timedelta(seconds=END_GUARD_SECONDS)
    end = anchor
    start = anchor - timedelta(days=7) + timedelta(seconds=START_GUARD_SECONDS)
    return FrozenWindow(
        request_anchor_utc=_rfc3339(anchor),
        start_time_utc=_rfc3339(start),
        end_time_utc=_rfc3339(end),
    )


def build_static_report(config_version: Any) -> list[dict[str, Any]]:
    """Per-query static info (no network): fingerprint at canary config, etc."""
    canary_cfg = RunConfig(page_size=CANARY_PAGE_SIZE, paginate=False).clamp()
    out: list[dict[str, Any]] = []
    for spec in build_query_specs(None):
        vr = validate_query(spec.query)
        # The canary fingerprint reflects the CORRECTED zero-enrichment canary
        # request (not the count-preflight canonical request).
        req = build_canary_request(spec, canary_cfg, config_version)
        out.append(
            {
                "query_id": spec.id,
                "lane": spec.lane,
                "topics": "+".join(spec.topics),
                "literal_query": spec.query,
                "char_count": len(spec.query),
                "operators_used": extract_operators(spec.query),
                "canary_fingerprint": req.fingerprint(),
                "canary_page_size": CANARY_PAGE_SIZE,
                "canary_config": req.canonical_dict(),
                "query_hash": query_hash(spec.query),
                "objective": spec.objective,
                "expected_strong_signals": spec.expected_strong_signals,
                "expected_false_positives": spec.expected_false_positives,
                "validation_status": "valid" if vr.ok else "INVALID",
                "validation_warnings": vr.warnings,
                "validation_errors": vr.errors,
            }
        )
    return out


def run_count_preflight(secrets: Secrets, cache, budget_usd: Optional[float] = None) -> dict[str, Any]:
    """Execute the counts-only preflight and write outputs. Returns a summary."""
    from .x_client import XAPIError, XClient

    ensure_dirs()
    config_version = load_queries().get("config_version", 1)
    specs = build_query_specs(None)

    # Seed pending_review for all six. NEVER auto-approve.
    seed_pending_decisions([s.id for s in specs], config_version)

    # Append-only cost correction for the prior auth user lookup.
    record_prior_preflight_and_correction()

    window = freeze_window()
    static = build_static_report(config_version)
    static_by_id = {s["query_id"]: s for s in static}

    client = XClient(secrets, cache)
    count_results: list[dict[str, Any]] = []
    attempted = 0
    for spec in specs:
        info = static_by_id[spec.id]
        request_ts = _rfc3339(datetime.now(timezone.utc))
        record_recent_count_event(spec.id)  # append-only cost event ($/request)
        attempted += 1
        try:
            total, _raw = client.count_recent_window(
                spec.query,
                start_time=window.start_time_utc,
                end_time=window.end_time_utc,
                granularity=window.granularity,
            )
            error = None
        except XAPIError as exc:
            total, error = None, str(exc)

        count_results.append(
            {
                "query_id": spec.id,
                "literal_query": spec.query,
                "query_hash": info["query_hash"],
                "start_time_utc": window.start_time_utc,
                "end_time_utc": window.end_time_utc,
                "granularity": window.granularity,
                "total_tweet_count": total,
                "request_timestamp_utc": request_ts,
                "estimated_cost_usd": 0.005,
                "volume_assessment": volume_assessment(total),
                "error": error,
            }
        )
        # Cost-safe: stop early if the first request fails (e.g. bad window/auth).
        if error is not None and attempted == 1:
            log.warning("First count failed (%s); stopping early to avoid wasted spend.", error)
            break

    # Persist raw count results.
    COUNTS_JSON_PATH.write_text(json.dumps(
        {"window": window.__dict__, "results": count_results}, indent=2
    ), encoding="utf-8")

    decisions = load_decisions()
    current = current_run_ledger(recent_count_requests=len(count_results), budget_override=budget_usd)
    ptd = project_to_date_ledger(current["current_run_estimated_cost_usd"])

    _write_query_audit(window, static, count_results, decisions, current, ptd)

    return {
        "window": window,
        "static": static,
        "count_results": count_results,
        "decisions": decisions,
        "current_run_ledger": current,
        "project_to_date_ledger": ptd,
        "api_calls_made": client.api_calls,
    }


# Query-id renames applied to previously cached count metadata (no re-request).
RENAME_MAP = {"q6_founder_artifact_workflows": "q6_founder_workflows"}


def _window_from_dict(d: dict) -> FrozenWindow:
    anchor = d.get("request_anchor_utc") or d.get("as_of_utc")
    return FrozenWindow(
        request_anchor_utc=anchor,
        start_time_utc=d["start_time_utc"],
        end_time_utc=d["end_time_utc"],
        granularity=d.get("granularity", "day"),
        start_guard_seconds=d.get("start_guard_seconds", START_GUARD_SECONDS),
        end_guard_seconds=d.get("end_guard_seconds", END_GUARD_SECONDS),
    )


def regenerate_from_counts() -> dict[str, Any]:
    """Regenerate audit + counts.json from EXISTING cached counts. No network.

    Migrates renamed query ids (preserving their counts), recomputes volume
    labels with the current vocabulary, refreshes the window schema, reseeds
    decisions to the current query set, and appends an append-only rename event.
    """
    from .approval import reseed_pending_decisions, load_decisions
    from .approval import OLD_Q1_CANARY_FINGERPRINT_V1
    from .governance import (
        record_approval_invalidation,
        record_canonical_schema_migration,
        record_cached_result_migration,
        record_config_migration,
        record_query_rename,
    )
    from .ledger import record_governance_routing_notice

    ensure_dirs()
    config_version = load_queries().get("config_version", 1)

    data = json.loads(COUNTS_JSON_PATH.read_text(encoding="utf-8"))
    window = _window_from_dict(data["window"])

    # Migrate renamed ids + recompute volume labels from preserved counts.
    results = []
    for r in data["results"]:
        qid = RENAME_MAP.get(r["query_id"], r["query_id"])
        total = r.get("total_tweet_count")
        results.append({
            **r,
            "query_id": qid,
            "volume_assessment": volume_assessment(total),
        })

    # Reseed decisions to the current query set (drops the old q6 id).
    specs = build_query_specs(None)
    dropped = reseed_pending_decisions([s.id for s in specs], config_version)

    # Governance events go to governance_audit.jsonl (NOT the cost log). The
    # existing query_id_rename in cost_audit.jsonl is preserved; append a
    # one-time routing notice there.
    record_governance_routing_notice()
    record_config_migration(
        change="volume_assessment_thresholds_relocated",
        frm="config/pricing.yaml",
        to="config/query_analysis.yaml",
        reason="Pricing config must contain only cost and pricing assumptions.",
    )
    # Canary canonical request schema v1 -> v2 (structured, fingerprinted
    # window_policy). Old fingerprint invalidated; decision stays pending_review.
    record_canonical_schema_migration(
        query_id="q1_artifact_infra",
        old_schema_version=1,
        new_schema_version=2,
        old_fingerprint=OLD_Q1_CANARY_FINGERPRINT_V1,
        decision_reset_to="pending_review",
    )
    for old_id, new_id in RENAME_MAP.items():
        preserved = next(
            (r.get("total_tweet_count") for r in results if r["query_id"] == new_id), None
        )
        record_query_rename(
            old_id, new_id, preserved,
            reason="Query belongs to the founder_transition lane, not "
                   "product_artifact; id corrected for consistency.",
        )
        record_cached_result_migration(old_id, new_id, preserved)
        record_approval_invalidation(
            old_id,
            reason="Query id renamed; any prior request fingerprint tied to the "
                   "old id is invalidated.",
        )
    # Any other ids dropped from the decision set are also invalidated.
    for qid in dropped:
        if qid not in RENAME_MAP:
            record_approval_invalidation(
                qid, reason="Query removed from the active set; prior fingerprint invalidated."
            )

    # Rewrite counts.json (migrated) and the audit.
    COUNTS_JSON_PATH.write_text(json.dumps(
        {"window": window.__dict__, "results": results}, indent=2
    ), encoding="utf-8")

    static = build_static_report(config_version)
    decisions = load_decisions()
    current = current_run_ledger(recent_count_requests=len(results))
    ptd = project_to_date_ledger(current["current_run_estimated_cost_usd"])
    _write_query_audit(window, static, results, decisions, current, ptd)

    return {
        "window": window,
        "static": static,
        "count_results": results,
        "decisions": decisions,
        "dropped_decision_ids": dropped,
        "current_run_ledger": current,
        "project_to_date_ledger": ptd,
    }


def _decision_of(decisions, qid: str) -> str:
    dec = decisions.get(qid)
    return dec.decision if dec else "pending_review"


def _suggested_review_note(count: Optional[int]) -> str:
    band = volume_assessment(count)
    return (
        f"Volume is {band}. This is context only — the engine does NOT decide "
        "run/revise/disable from volume. Human review required."
    )


def _write_query_audit(window, static, count_results, decisions, current, ptd) -> None:
    by_id = {r["query_id"]: r for r in count_results}
    lines: list[str] = []
    lines.append("# Query Audit — Phase 2 Count Preflight")
    lines.append("")
    lines.append(f"_Generated {_rfc3339(datetime.now(timezone.utc))}_")
    lines.append("")
    lines.append("**Live base URL:** `https://api.x.com/2` (production).")
    lines.append("")
    lines.append("## Frozen shared count window (identical for all six queries)")
    lines.append("")
    lines.append(f"- request_anchor_utc: `{window.request_anchor_utc}`  "
                 f"(execution-time anchor — July 18 run)")
    lines.append(f"- start_time_utc: `{window.start_time_utc}`")
    lines.append(f"- end_time_utc: `{window.end_time_utc}`")
    lines.append(f"- start_guard_seconds: `{window.start_guard_seconds}`")
    lines.append(f"- end_guard_seconds: `{window.end_guard_seconds}`")
    lines.append(f"- effective_window_seconds: `{window.effective_window_seconds}`")
    lines.append(f"- effective_window_human_readable: `{window.effective_window_human_readable}`")
    lines.append(f"- granularity: `{window.granularity}`")
    lines.append(
        f"- Note: end_time is anchored {window.end_guard_seconds}s in the past and "
        f"start_time is nudged +{window.start_guard_seconds}s from the exact "
        "7-day mark to satisfy the recent-counts now−7d lower bound. This yields "
        "the preserved shared window above; the count requests are NOT rerun."
    )
    lines.append("")
    lines.append("> The application must not decide whether a query runs, is "
                 "revised, or is disabled based only on its count volume. All six "
                 "decisions remain **pending_review** for a human.")
    lines.append("")

    for s in static:
        qid = s["query_id"]
        cr = by_id.get(qid, {})
        lines.append(f"## {qid}")
        lines.append("")
        lines.append(f"- **Discovery lane:** {s['lane']}")
        lines.append(f"- **Role-topic group:** {s['topics']}")
        lines.append(f"- **Full literal query:**")
        lines.append(f"  ```\n  {s['literal_query']}\n  ```")
        lines.append(f"- **Character count:** {s['char_count']}")
        lines.append(f"- **Search operators used:** {', '.join(s['operators_used'])}")
        lines.append(f"- **Objective:** {s['objective']}")
        lines.append(f"- **Expected high-quality signals:** {s['expected_strong_signals']}")
        lines.append(f"- **Expected false positives:** {s['expected_false_positives']}")
        lines.append(f"- **Validation result:** {s['validation_status']}")
        if s["validation_warnings"]:
            lines.append(f"  - warnings: {s['validation_warnings']}")
        if s["validation_errors"]:
            lines.append(f"  - errors: {s['validation_errors']}")
        total = cr.get("total_tweet_count")
        lines.append(f"- **Count (seven-day frozen window):** "
                     f"**{total if total is not None else 'unavailable'}**")
        lines.append(f"- **Volume assessment:** {cr.get('volume_assessment', 'n/a')}")
        lines.append(f"- **Count start time:** `{cr.get('start_time_utc', 'n/a')}`")
        lines.append(f"- **Count end time:** `{cr.get('end_time_utc', 'n/a')}`")
        if cr.get("error"):
            lines.append(f"- **Error:** {cr['error']}")
        lines.append(f"- **Suggested review note:** {_suggested_review_note(total)}")
        lines.append(f"- **Intended ten-post canary request configuration:**")
        cfg = s["canary_config"]
        for k in sorted(cfg):
            if k == "query":
                continue
            lines.append(f"    - {k}: `{cfg[k]}`")
        lines.append(f"- **Intended ten-post canary request fingerprint:** "
                     f"`{s['canary_fingerprint']}`")
        lines.append(f"- **Query hash:** `{s['query_hash']}`")
        lines.append(f"- **Human decision:** **{_decision_of(decisions, qid)}** "
                     "(remaining pending_review)")
        lines.append("")

    lines.append("## Current count-preflight run — cost ledger (historical)")
    lines.append("")
    lines.append(f"- recent-count requests: {current['recent_count_requests']}")
    lines.append(f"- configured cost per recent-count request: "
                 f"${current['configured_cost_per_recent_count_request_usd']}")
    lines.append(f"- estimated current-run cost: ${current['current_run_estimated_cost_usd']}")
    lines.append(f"- current-run budget (historical, as executed): "
                 f"${current['global_run_budget_usd']}")
    lines.append(f"- estimated current-run remaining budget: "
                 f"${current['current_run_remaining_budget_usd']}")
    lines.append("")
    lines.append("> Least-privilege note for FUTURE counts-only runs: a six-query "
                 "counts run needs only ~$0.03, so budget it tightly, e.g. "
                 "`--budget-usd 0.05` or `--budget-usd 0.10`. The $5 above is "
                 "preserved as the historical budget of the completed run.")
    lines.append("")
    lines.append("## Project-to-date — cost ledger")
    lines.append("")
    lines.append(f"- prior user-lookup estimated cost: ${ptd['previous_estimated_spend_usd']}")
    lines.append(f"- current count-preflight estimated cost: ${ptd['current_run_estimated_cost_usd']}")
    lines.append(f"- cumulative estimated cost: ${ptd['cumulative_estimated_spend_usd']}")
    lines.append(f"- cumulative observed console cost: {ptd['cumulative_observed_console_spend_usd']}")
    lines.append("")
    lines.append(f"_Append-only cost audit trail: `{COST_AUDIT_PATH}`_")

    QUERY_AUDIT_PATH.write_text("\n".join(lines), encoding="utf-8")

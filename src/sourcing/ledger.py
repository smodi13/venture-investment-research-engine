"""Cost ledgers + append-only cost audit trail.

Rates come from ``config/pricing.yaml`` (never hardcoded in source). The audit
log is append-only JSONL: events are only ever appended, never overwritten or
deleted, so corrections are added as new events rather than edits.

Two ledgers are maintained:
  * current-run  — spend for THE run in progress (e.g. the count preflight),
                   charged against a per-run budget.
  * project-to-date — prior estimated spend + current run, rolled up. Prior
                   spend (e.g. the auth user lookup) appears here but does NOT
                   consume the current-run budget.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
from typing import Any

from .config import OUTPUT_DIR
from .money import money_str, parse_money
from .pricing import load_pricing
from .timeutil import now_utc, to_rfc3339

COST_AUDIT_PATH = OUTPUT_DIR / "cost_audit.jsonl"

PENDING_RECONCILIATION = "pending_manual_reconciliation"


def _now() -> str:
    return to_rfc3339(now_utc())


def _costs() -> dict[str, Any]:
    return load_pricing().get("costs", {})


# -- exact-decimal rate accessors (never floats) ----------------------------
def post_read_cost() -> Decimal:
    return parse_money(_costs().get("post_read_usd"), field="costs.post_read_usd")


def user_read_cost() -> Decimal:
    return parse_money(_costs().get("user_read_usd"), field="costs.user_read_usd")


def counts_recent_cost() -> Decimal:
    return parse_money(_costs().get("counts_recent_request_usd"), field="costs.counts_recent_request_usd")


def canary_budget() -> Decimal:
    rb = load_pricing().get("run_budget", {})
    return parse_money(rb.get("global_canary_budget_usd"), field="run_budget.global_canary_budget_usd")


def canary_estimated_post_cost(n_posts: int) -> Decimal:
    return post_read_cost() * Decimal(int(n_posts))


def canary_remaining_budget(estimated: Decimal) -> Decimal:
    return canary_budget() - estimated


# ---------------------------------------------------------------------------
# Append-only audit log
# ---------------------------------------------------------------------------
def append_event(event: dict[str, Any], path: Path = COST_AUDIT_PATH) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(event, default=str) + "\n")


def load_events(path: Path = COST_AUDIT_PATH) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    out = []
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                out.append(json.loads(line))
    return out


def _has_event(events: list[dict], **match: Any) -> bool:
    return any(all(e.get(k) == v for k, v in match.items()) for e in events)


def record_prior_preflight_and_correction(path: Path = COST_AUDIT_PATH) -> list[dict]:
    """Append the original user-lookup cost event AND its correction event.

    Idempotent by append: each event is only appended if an equivalent one is not
    already present. Nothing is ever overwritten or deleted.
    """
    events = load_events(path)
    added: list[dict] = []
    user_lookup_cost = money_str(user_read_cost())

    if not _has_event(events, event_type="operation", operation="user_lookup"):
        ev = {
            "event_type": "operation",
            "operation": "user_lookup",
            "description": "Auth preflight: GET /2/users/by/username/xdevelopers.",
            "user_resources_returned": 1,
            "post_resources_returned": 0,
            "estimated_cost_usd": user_lookup_cost,
            "actual_console_cost_usd": PENDING_RECONCILIATION,
            "recorded_at_utc": _now(),
        }
        append_event(ev, path)
        added.append(ev)

    if not _has_event(events, event_type="cost_estimate_correction", original_operation="user_lookup"):
        corr = {
            "event_type": "cost_estimate_correction",
            "original_operation": "user_lookup",
            "original_description": (
                "The auth-preflight user lookup was previously described as "
                "effectively free because it consumed no Post resources."
            ),
            "corrected_estimated_cost_usd": user_lookup_cost,
            "correction_reason": (
                "A user lookup returns one User resource and carries a billable "
                "cost; it must not be described as free merely because no Post "
                "resources were consumed."
            ),
            "corrected_at_utc": _now(),
            "actual_console_cost_usd": None,  # null until manually reconciled
        }
        append_event(corr, path)
        added.append(corr)

    return added


def record_governance_routing_notice(path: Path = COST_AUDIT_PATH) -> bool:
    """Append (once) a clarification that governance events now live elsewhere.

    Preserves the existing query_id_rename event already in this cost log; only
    appends a routing notice. Nothing is overwritten or deleted.
    """
    events = load_events(path)
    if _has_event(events, event_type="governance_routing_notice"):
        return False
    append_event({
        "event_type": "governance_routing_notice",
        "note": (
            "Future non-cost governance events (query renames, approval "
            "invalidations, configuration migrations, cached-result migrations) "
            "are recorded in governance_audit.jsonl. The prior query_id_rename "
            "event in this cost log is preserved for historical continuity."
        ),
        "recorded_at_utc": _now(),
    }, path)
    return True


def record_recent_count_event(query_id: str, path: Path = COST_AUDIT_PATH) -> dict:
    ev = {
        "event_type": "operation",
        "operation": "recent_count",
        "query_id": query_id,
        "post_resources_returned": 0,   # counts endpoint returns aggregates, not posts
        "estimated_cost_usd": money_str(counts_recent_cost()),
        "actual_console_cost_usd": PENDING_RECONCILIATION,
        "recorded_at_utc": _now(),
    }
    append_event(ev, path)
    return ev


# ---------------------------------------------------------------------------
# Ledgers (exact Decimal arithmetic; monetary outputs are fixed-point strings)
# ---------------------------------------------------------------------------
def recent_count_unit_cost() -> Decimal:
    return counts_recent_cost()


def current_run_ledger(recent_count_requests: int, budget_override: Any | None = None) -> dict[str, Any]:
    unit = recent_count_unit_cost()
    if budget_override is not None:
        budget = parse_money(budget_override, field="budget_override")
    else:
        budget = parse_money(
            load_pricing().get("run_budget", {}).get("global_run_budget_usd"),
            field="run_budget.global_run_budget_usd",
        )
    est = unit * Decimal(int(recent_count_requests))
    remaining = budget - est
    return {
        "global_run_budget_usd": money_str(budget),
        "recent_count_requests": recent_count_requests,
        "configured_cost_per_recent_count_request_usd": money_str(unit),
        "current_run_estimated_cost_usd": money_str(est),
        "current_run_remaining_budget_usd": money_str(remaining),
        "current_run_spend_by_operation": {"recent_count": money_str(est)},
    }


def project_to_date_ledger(current_run_estimated_cost_usd: Any) -> dict[str, Any]:
    ptd = load_pricing().get("project_to_date", {})
    previous = parse_money(ptd.get("previous_estimated_spend_usd"), field="previous_estimated_spend_usd")
    current = parse_money(current_run_estimated_cost_usd, field="current_run_estimated_cost_usd")
    cumulative = previous + current
    return {
        "previous_estimated_spend_usd": money_str(previous),
        "current_run_estimated_cost_usd": money_str(current),
        "cumulative_estimated_spend_usd": money_str(cumulative),
        "cumulative_observed_console_spend_usd": "pending manual reconciliation",
    }

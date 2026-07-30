"""Cost ledgers + append-only audit trail."""

from __future__ import annotations

from sourcing import ledger


def test_current_run_ledger_uses_pricing_rates_as_fixed_strings():
    cur = ledger.current_run_ledger(recent_count_requests=6)
    # 6 * 0.005 = 0.030, serialized as a fixed-point decimal STRING.
    assert cur["recent_count_requests"] == 6
    assert cur["configured_cost_per_recent_count_request_usd"] == "0.005"
    assert cur["current_run_estimated_cost_usd"] == "0.030"
    assert cur["global_run_budget_usd"] == "5.000"
    assert cur["current_run_remaining_budget_usd"] == "4.970"
    assert cur["current_run_spend_by_operation"] == {"recent_count": "0.030"}


def test_project_to_date_includes_prior_but_separate_from_run():
    ptd = ledger.project_to_date_ledger(current_run_estimated_cost_usd="0.030")
    # Prior user lookup (0.010) appears here but not in the current-run cost.
    assert ptd["previous_estimated_spend_usd"] == "0.010"
    assert ptd["current_run_estimated_cost_usd"] == "0.030"
    assert ptd["cumulative_estimated_spend_usd"] == "0.040"
    assert ptd["cumulative_observed_console_spend_usd"] == "pending manual reconciliation"


def test_canary_cost_math_is_exact_decimal():
    from decimal import Decimal

    # Ten Posts at 0.005 => exactly 0.050; 0.070 - 0.050 => exactly 0.020.
    est = ledger.canary_estimated_post_cost(10)
    assert est == Decimal("0.050")
    assert ledger.canary_remaining_budget(est) == Decimal("0.020")
    assert ledger.canary_budget() == Decimal("0.070")


def test_cost_audit_is_append_only(tmp_path):
    path = tmp_path / "cost_audit.jsonl"
    ledger.append_event({"event_type": "operation", "operation": "user_lookup"}, path)
    ledger.append_event({"event_type": "operation", "operation": "recent_count"}, path)
    events = ledger.load_events(path)
    assert len(events) == 2
    # Appending again grows the log; nothing is overwritten.
    ledger.append_event({"event_type": "operation", "operation": "recent_count"}, path)
    assert len(ledger.load_events(path)) == 3


def test_prior_preflight_correction_is_idempotent(tmp_path):
    path = tmp_path / "cost_audit.jsonl"
    ledger.record_prior_preflight_and_correction(path)
    first = ledger.load_events(path)
    # Two events: the operation + the correction.
    assert any(e["event_type"] == "cost_estimate_correction" for e in first)
    assert any(e.get("operation") == "user_lookup" for e in first)
    # Correction event has null actual console cost until reconciled.
    corr = next(e for e in first if e["event_type"] == "cost_estimate_correction")
    assert corr["actual_console_cost_usd"] is None
    # Re-running does not duplicate (still append-only, but guarded).
    ledger.record_prior_preflight_and_correction(path)
    assert len(ledger.load_events(path)) == len(first)

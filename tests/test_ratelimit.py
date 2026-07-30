"""Header-aware bounded rate-limit decision logic."""

from __future__ import annotations

from sourcing import ratelimit as rl
from sourcing.ratelimit import RateLimitHeaders, RateLimitPolicy, decide

POLICY = RateLimitPolicy(max_retries=1, max_auto_wait_seconds=120, reset_safety_seconds=2)
NOW = 1000.0


def _headers(reset, limit=100, remaining=0):
    return RateLimitHeaders(limit=limit, remaining=remaining, reset_epoch=reset)


def test_policy_from_config():
    p = RateLimitPolicy.from_config({"rate_limit_policy": {"max_retries": 1, "max_auto_wait_seconds": 120, "reset_safety_seconds": 2}})
    assert (p.max_retries, p.max_auto_wait_seconds, p.reset_safety_seconds) == (1, 120, 2)


def test_429_with_valid_reset_allows_single_retry():
    d = decide(_headers(NOW + 10), NOW, POLICY, retry_count=0)
    assert d.should_retry is True
    assert d.wait_seconds == 12  # 10 + reset_safety_seconds(2)
    assert d.stop_reason is None


def test_429_with_missing_reset_fails_closed():
    d = decide(_headers(None), NOW, POLICY, retry_count=0)
    assert d.should_retry is False
    assert d.stop_reason == rl.STOP_RESET_MISSING


def test_required_wait_exceeding_max_auto_wait():
    d = decide(_headers(NOW + 200), NOW, POLICY, retry_count=0)
    assert d.should_retry is False
    assert d.stop_reason == rl.STOP_WAIT_EXCEEDS_POLICY


def test_retry_crossing_approval_expiration():
    # wait would be 12s, but approval expires in 5s.
    d = decide(_headers(NOW + 10), NOW, POLICY, retry_count=0, approval_expiry_epoch=NOW + 5)
    assert d.should_retry is False
    assert d.stop_reason == rl.STOP_APPROVAL_WOULD_EXPIRE


def test_exactly_one_retry_then_another_429_is_exhausted():
    # After one retry (retry_count reaches max_retries), a second 429 stops.
    d = decide(_headers(NOW + 10), NOW, POLICY, retry_count=1)
    assert d.should_retry is False
    assert d.stop_reason == rl.STOP_RETRY_EXHAUSTED


def test_budget_gate_failure_blocks_retry():
    d = decide(_headers(NOW + 10), NOW, POLICY, retry_count=0, budget_ok=False)
    assert d.should_retry is False
    assert d.stop_reason == rl.STOP_BUDGET_GATE_FAILED


def test_reset_in_past_yields_zero_wait_retry():
    d = decide(_headers(NOW - 100), NOW, POLICY, retry_count=0)
    assert d.should_retry is True
    assert d.wait_seconds == 0.0


# --- endpoint-scoped preemptive state -------------------------------------
from sourcing.ratelimit import (  # noqa: E402
    PREEMPT_DISCARD_THEN_PROCEED,
    PREEMPT_PROCEED,
    PREEMPT_STOP,
    PREEMPT_WAIT,
    endpoint_scope,
    preemptive_decision,
)


def test_endpoint_scope_is_method_endpoint_auth():
    assert endpoint_scope("GET", "/tweets/search/recent") == "GET:/2/tweets/search/recent:app_bearer"
    assert endpoint_scope("GET", "/tweets/counts/recent") == "GET:/2/tweets/counts/recent:app_bearer"
    # Dynamic segments collapse to a single scope.
    assert endpoint_scope("GET", "/users/123/tweets") == "GET:/2/users/:id/tweets:app_bearer"
    assert endpoint_scope("GET", "/users/by/username/xdevelopers") == "GET:/2/users/by/username/:username:app_bearer"


def test_counts_state_does_not_share_scope_with_search():
    # A throttled counts scope is a different key than search — no cross-block.
    store = {endpoint_scope("GET", "/tweets/counts/recent"): _headers(NOW + 300, remaining=0)}
    search_scope = endpoint_scope("GET", "/tweets/search/recent")
    r = preemptive_decision(store.get(search_scope), NOW, POLICY)
    assert r.action == PREEMPT_PROCEED


def test_user_lookup_state_does_not_block_search():
    store = {endpoint_scope("GET", "/users/by/username/xdevelopers"): _headers(NOW + 300, remaining=0)}
    search_scope = endpoint_scope("GET", "/tweets/search/recent")
    r = preemptive_decision(store.get(search_scope), NOW, POLICY)
    assert r.action == PREEMPT_PROCEED


def test_search_state_remaining_positive_proceeds():
    r = preemptive_decision(_headers(NOW + 300, remaining=5), NOW, POLICY)
    assert r.action == PREEMPT_PROCEED


def test_search_state_remaining_zero_expired_reset_is_discarded():
    r = preemptive_decision(_headers(NOW - 10, remaining=0), NOW, POLICY)
    assert r.action == PREEMPT_DISCARD_THEN_PROCEED


def test_search_state_remaining_zero_future_reset_invokes_bounded_wait():
    r = preemptive_decision(_headers(NOW + 10, remaining=0), NOW, POLICY)
    assert r.action == PREEMPT_WAIT
    assert r.wait_seconds == 12  # 10 + reset_safety_seconds

    # future reset beyond policy => stop, not an unbounded wait
    r2 = preemptive_decision(_headers(NOW + 500, remaining=0), NOW, POLICY)
    assert r2.action == PREEMPT_STOP


def test_no_prior_state_allows_canary_to_proceed():
    r = preemptive_decision(None, NOW, POLICY)
    assert r.action == PREEMPT_PROCEED

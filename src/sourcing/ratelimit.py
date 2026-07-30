"""Header-aware, bounded rate-limit handling (HTTP 429).

No fixed 60-second retry. The required wait is computed from x-rate-limit-reset,
bounded by policy, and at most ONE retry is permitted — and only when the
approval will still be valid after the wait, the budget gates still pass, and the
required wait is within policy. The caller re-resolves the relative-window policy
immediately before an allowed retry. Never a recursive/unlimited loop.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any, Callable, Optional

# Supported stop reasons (fail-closed, no retry).
STOP_WAIT_EXCEEDS_POLICY = "rate_limit_wait_exceeds_policy"
STOP_APPROVAL_WOULD_EXPIRE = "approval_would_expire_before_retry"
STOP_RESET_MISSING = "rate_limit_reset_missing"
STOP_RETRY_EXHAUSTED = "rate_limit_retry_exhausted"
STOP_BUDGET_GATE_FAILED = "rate_limit_budget_gate_failed"  # extra (budget precondition)


@dataclass(frozen=True)
class RateLimitPolicy:
    max_retries: int = 1
    max_auto_wait_seconds: float = 120.0
    reset_safety_seconds: float = 2.0

    @classmethod
    def from_config(cls, runtime_cfg: dict[str, Any]) -> "RateLimitPolicy":
        p = (runtime_cfg or {}).get("rate_limit_policy", {})
        return cls(
            max_retries=int(p.get("max_retries", 1)),
            max_auto_wait_seconds=float(p.get("max_auto_wait_seconds", 120)),
            reset_safety_seconds=float(p.get("reset_safety_seconds", 2)),
        )


@dataclass(frozen=True)
class RateLimitHeaders:
    limit: Optional[int]
    remaining: Optional[int]
    reset_epoch: Optional[float]

    @classmethod
    def from_response_headers(cls, headers: dict) -> "RateLimitHeaders":
        def _int(key: str) -> Optional[int]:
            raw = headers.get(key)
            try:
                return int(raw) if raw is not None else None
            except (TypeError, ValueError):
                return None

        def _float(key: str) -> Optional[float]:
            raw = headers.get(key)
            try:
                return float(raw) if raw is not None else None
            except (TypeError, ValueError):
                return None

        return cls(
            limit=_int("x-rate-limit-limit"),
            remaining=_int("x-rate-limit-remaining"),
            reset_epoch=_float("x-rate-limit-reset"),
        )


@dataclass(frozen=True)
class RateLimitDecision:
    should_retry: bool
    wait_seconds: float = 0.0
    stop_reason: Optional[str] = None


@dataclass
class RetryContext:
    """Higher-level context consulted before an allowed retry."""

    approval_expiry_epoch: Optional[float] = None
    budget_ok: Callable[[], bool] = lambda: True
    reresolve_window: Callable[[], None] = lambda: None


# ---------------------------------------------------------------------------
# Endpoint-scoped preemptive rate-limit state (in-memory, per process).
# X rate limits are endpoint-specific: state from /2/tweets/counts/recent must
# NEVER block or delay /2/tweets/search/recent.
# ---------------------------------------------------------------------------
def normalize_endpoint(path: str) -> str:
    """Normalize a request path to a stable endpoint template.

    Dynamic segments (numeric ids, usernames) are replaced with placeholders so
    that, e.g., /users/123/tweets and /users/456/tweets share one scope.
    """
    p = path if path.startswith("/2") else "/2" + path
    p = re.sub(r"/users/\d+/tweets", "/users/:id/tweets", p)
    p = re.sub(r"/users/by/username/[^/]+", "/users/by/username/:username", p)
    return p


def endpoint_scope(method: str, path: str, auth_mode: str = "app_bearer") -> str:
    """Scope key: METHOD:normalized_endpoint_template:auth_mode."""
    return f"{method.upper()}:{normalize_endpoint(path)}:{auth_mode}"


# Preemptive actions.
PREEMPT_PROCEED = "proceed"
PREEMPT_DISCARD_THEN_PROCEED = "discard_then_proceed"
PREEMPT_WAIT = "wait"
PREEMPT_STOP = "stop"


@dataclass(frozen=True)
class PreemptiveResult:
    action: str
    wait_seconds: float = 0.0
    stop_reason: Optional[str] = None


def preemptive_decision(
    state: Optional[RateLimitHeaders],
    now_epoch: float,
    policy: RateLimitPolicy,
    *,
    approval_expiry_epoch: Optional[float] = None,
    budget_ok: bool = True,
) -> PreemptiveResult:
    """Decide whether to proceed / discard-stale / wait / stop BEFORE sending.

    Uses ONLY prior state from the same scoped endpoint (the caller looks it up).
    Never makes an extra request to check status.
    """
    if state is None:
        return PreemptiveResult(PREEMPT_PROCEED)
    if state.remaining is None or state.remaining > 0:
        return PreemptiveResult(PREEMPT_PROCEED)
    # remaining == 0
    if state.reset_epoch is None:
        # No reset to reason about; don't over-block on a preemptive check.
        return PreemptiveResult(PREEMPT_PROCEED)
    if state.reset_epoch <= now_epoch:
        # Stale exhaustion: the window has reset. Discard and proceed.
        return PreemptiveResult(PREEMPT_DISCARD_THEN_PROCEED)
    # remaining == 0 and reset in the future: apply the bounded-wait policy.
    d = decide(
        state,
        now_epoch,
        policy,
        retry_count=0,
        approval_expiry_epoch=approval_expiry_epoch,
        budget_ok=budget_ok,
    )
    if d.should_retry:
        return PreemptiveResult(PREEMPT_WAIT, wait_seconds=d.wait_seconds)
    return PreemptiveResult(PREEMPT_STOP, stop_reason=d.stop_reason)


def decide(
    headers: RateLimitHeaders,
    now_epoch: float,
    policy: RateLimitPolicy,
    retry_count: int,
    *,
    approval_expiry_epoch: Optional[float] = None,
    budget_ok: bool = True,
) -> RateLimitDecision:
    """Decide whether to retry a 429, or the reason to fail closed.

    Order: missing reset → retries exhausted → wait exceeds policy → approval
    would expire → budget gate failed → retry.
    """
    if headers.reset_epoch is None:
        return RateLimitDecision(False, stop_reason=STOP_RESET_MISSING)

    if retry_count >= policy.max_retries:
        return RateLimitDecision(False, stop_reason=STOP_RETRY_EXHAUSTED)

    required_wait = max(0.0, headers.reset_epoch - now_epoch + policy.reset_safety_seconds)

    if required_wait > policy.max_auto_wait_seconds:
        return RateLimitDecision(False, stop_reason=STOP_WAIT_EXCEEDS_POLICY)

    if approval_expiry_epoch is not None and (now_epoch + required_wait) > approval_expiry_epoch:
        return RateLimitDecision(False, stop_reason=STOP_APPROVAL_WOULD_EXPIRE)

    if not budget_ok:
        return RateLimitDecision(False, stop_reason=STOP_BUDGET_GATE_FAILED)

    return RateLimitDecision(True, wait_seconds=required_wait)

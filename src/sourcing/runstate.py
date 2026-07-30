"""Run-state classification, empty/partial handling, and sanitized metadata.

Distinguishes: success, success_zero_results, partial_api_success, client_error,
rate_limited, server_error. Never stores Authorization headers, bearer tokens,
cookies, or secret header info.
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Optional

from .ratelimit import RateLimitHeaders
from .timeutil import reset_epoch_to_rfc3339, to_rfc3339


class RunStatus(str, Enum):
    SUCCESS = "success"
    SUCCESS_ZERO_RESULTS = "success_zero_results"
    PARTIAL_API_SUCCESS = "partial_api_success"
    CLIENT_ERROR = "client_error"
    RATE_LIMITED = "rate_limited"
    SERVER_ERROR = "server_error"
    NETWORK_TIMEOUT = "network_timeout"


def interpret_response(
    http_status: int,
    body: dict[str, Any] | None,
    *,
    post_read_cost_usd: float = 0.0,
) -> dict[str, Any]:
    """Classify a response into a run state with empty/partial handling.

    For 200: distinguishes success / success_zero_results / partial_api_success.
    Missing ``data`` or ``data: []`` yields zero results without crashing.
    """
    base = {
        "run_status": None,
        "run_complete": False,
        "zero_results_found": False,
        "partial_results_valid": False,
        "posts": [],
        "errors": [],
        "actual_posts_returned": 0,
        "estimated_post_cost_usd": 0.00,
    }

    if http_status == 429:
        base["run_status"] = RunStatus.RATE_LIMITED.value
        return base  # rate-limited run must NEVER be marked complete
    if 400 <= http_status < 500:
        base["run_status"] = RunStatus.CLIENT_ERROR.value
        base["errors"] = (body or {}).get("errors", []) or []
        return base
    if 500 <= http_status < 600:
        base["run_status"] = RunStatus.SERVER_ERROR.value
        return base

    # HTTP 200
    body = body or {}
    data = body.get("data")
    posts = data if isinstance(data, list) else []
    errors = body.get("errors") or []
    n = len(posts)
    cost = round(n * float(post_read_cost_usd), 2)

    base["posts"] = posts
    base["errors"] = errors
    base["actual_posts_returned"] = n
    base["estimated_post_cost_usd"] = cost

    if n > 0 and errors:
        base["run_status"] = RunStatus.PARTIAL_API_SUCCESS.value
        base["run_complete"] = False
        base["partial_results_valid"] = True
    elif n > 0:
        base["run_status"] = RunStatus.SUCCESS.value
        base["run_complete"] = True
    elif errors:
        # 200 with errors but no valid posts: partial (no valid results).
        base["run_status"] = RunStatus.PARTIAL_API_SUCCESS.value
        base["run_complete"] = False
        base["partial_results_valid"] = False
    else:
        # Missing data or data: [] with no errors => genuine zero results.
        base["run_status"] = RunStatus.SUCCESS_ZERO_RESULTS.value
        base["run_complete"] = True
        base["zero_results_found"] = True
        base["estimated_post_cost_usd"] = 0.00
    return base


def sanitized_response_metadata(
    response_headers: dict,
    http_status: int,
    request_ts: datetime,
    response_ts: datetime,
    retry_count: int,
    duration_ms: float,
) -> dict[str, Any]:
    """Sanitized per-response metadata for the run manifest.

    Timestamps are aware-UTC RFC 3339 with ``Z``; ``duration_ms`` comes from a
    MONOTONIC clock (not wall-clock subtraction). Includes only status,
    rate-limit headers, timings, and retry count. NEVER includes Authorization
    headers, bearer tokens, cookies, or secrets.
    """
    rl = RateLimitHeaders.from_response_headers(response_headers)
    return {
        "http_status": http_status,
        "x_rate_limit_limit": rl.limit,
        "x_rate_limit_remaining": rl.remaining,
        "x_rate_limit_reset_utc": reset_epoch_to_rfc3339(rl.reset_epoch),
        "request_timestamp_utc": to_rfc3339(request_ts, field="request_timestamp_utc"),
        "response_timestamp_utc": to_rfc3339(response_ts, field="response_timestamp_utc"),
        "response_duration_ms": round(duration_ms, 2),
        "retry_count": retry_count,
    }


def network_timeout_state(
    exception_type: str,
    duration_ms: float,
    *,
    request_ts_utc: Optional[str] = None,
) -> dict[str, Any]:
    """Fail-closed run state for a connect/read timeout (no auto-retry).

    A connect/read timeout is NOT an exact total request-duration ceiling; this
    only records the observed behavior. ``duration_ms`` is monotonic-derived.
    """
    return {
        "run_status": RunStatus.NETWORK_TIMEOUT.value,
        "run_complete": False,
        "partial_results_valid": False,   # unless a full body was received+parsed
        "retry_attempted": False,
        "billing_status": "manual_reconciliation_required",
        "actual_posts_returned": 0,
        "estimated_post_cost_usd": "0.000",
        "sanitized_exception_type": exception_type,  # type name only, no message/creds
        "request_timestamp_utc": request_ts_utc,
        "duration_ms": round(duration_ms, 2),
    }

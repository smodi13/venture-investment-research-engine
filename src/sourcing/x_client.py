"""X API v2 client.

Responsibilities (mandate section 1):
  * Read the bearer token from the environment (never printed in full).
  * Recent-search for posts.
  * Batch user-profile lookups (<=100 per call).
  * Recent timelines for shortlisted accounts ONLY.
  * Pagination only when explicitly enabled.
  * Handle rate limits, timeouts, malformed responses, exhausted credits.
  * Cache every response in SQLite; never refetch the same resource in a run.

The parsing layer converts raw API JSON into :mod:`sourcing.models` objects.
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Iterable, Optional

import requests

from .cache import Cache
from .config import ConfigError, Secrets, load_runtime
from .models import RawPost, RawUser
from .ratelimit import (
    PREEMPT_DISCARD_THEN_PROCEED,
    PREEMPT_STOP,
    PREEMPT_WAIT,
    RateLimitHeaders,
    RateLimitPolicy,
    RetryContext,
    decide as ratelimit_decide,
    endpoint_scope,
    preemptive_decision,
)
from .runstate import sanitized_response_metadata
from .timeutil import Stopwatch, now_utc, to_rfc3339

log = logging.getLogger(__name__)

# Current documented X API v2 production host. Custom base URLs are permitted
# ONLY for tests / explicitly configured local mocks (see XClient(base_url=...)).
BASE_URL = "https://api.x.com/2"
SEARCH_MAX_PER_PAGE = 100  # X API cap for recent search
USERS_BATCH_MAX = 100      # X API cap for /2/users
MAX_TIMEOUT_SECONDS = 120  # configured upper bound for connect/read timeouts


@dataclass(frozen=True)
class HttpTimeouts:
    """Separate connect + read timeouts (NOT a single total wall-clock ceiling)."""

    connect_seconds: float
    read_seconds: float

    def as_tuple(self) -> tuple[float, float]:
        return (self.connect_seconds, self.read_seconds)


def _validate_timeout(value: Any, field: str) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ConfigError(f"http.{field}: must be a number")
    v = float(value)
    if v != v or v in (float("inf"), float("-inf")):
        raise ConfigError(f"http.{field}: must be finite")
    if v <= 0:
        raise ConfigError(f"http.{field}: must be > 0")
    if v > MAX_TIMEOUT_SECONDS:
        raise ConfigError(f"http.{field}: exceeds max {MAX_TIMEOUT_SECONDS}s")
    return v


def load_http_timeouts(runtime_cfg: Optional[dict] = None) -> HttpTimeouts:
    """Load + validate connect/read timeouts. Fails closed on missing/invalid."""
    cfg = (runtime_cfg if runtime_cfg is not None else load_runtime()).get("http", {})
    if "connect_timeout_seconds" not in cfg or "read_timeout_seconds" not in cfg:
        raise ConfigError("http.connect_timeout_seconds and http.read_timeout_seconds are required")
    return HttpTimeouts(
        connect_seconds=_validate_timeout(cfg.get("connect_timeout_seconds"), "connect_timeout_seconds"),
        read_seconds=_validate_timeout(cfg.get("read_timeout_seconds"), "read_timeout_seconds"),
    )

TWEET_FIELDS = "created_at,lang,public_metrics,entities,referenced_tweets,author_id"
USER_FIELDS = "description,url,verified,created_at,public_metrics,entities"


# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------
class XAPIError(RuntimeError):
    """Base class for X API failures."""


class RateLimitError(XAPIError):
    """HTTP 429 — rate limit hit (fail-closed).

    ``message`` is the machine-readable stop reason (e.g. rate_limit_reset_missing).
    """

    def __init__(self, message: str, reset_epoch: Optional[float] = None):
        super().__init__(message)
        self.stop_reason = message
        self.reset_epoch = reset_epoch


class CreditsExhaustedError(XAPIError):
    """Monthly usage cap / credits exhausted (HTTP 403 with usage-cap payload)."""


class MalformedResponseError(XAPIError):
    """Response was not valid JSON or lacked the expected shape."""


class NetworkTimeoutError(XAPIError):
    """Connect or read timeout. Fail-closed: no automatic retry during the canary.

    Carries only a sanitized exception TYPE name and a monotonic-derived duration
    — never a message that could contain credentials.
    """

    def __init__(self, exception_type: str, duration_ms: float, request_ts_utc: Optional[str] = None):
        super().__init__(f"network timeout ({exception_type})")
        self.exception_type = exception_type
        self.duration_ms = duration_ms
        self.request_ts_utc = request_ts_utc


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------
def _parse_dt(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def _extract_url_details(entities: dict[str, Any]) -> list[dict[str, Any]]:
    """Build preserved URL representations for each URL entity (no network)."""
    from .urlutil import build_url_info

    return [build_url_info(u) for u in (entities or {}).get("urls", []) or []]


def parse_post(raw: dict[str, Any], query_groups: Optional[list[str]] = None) -> RawPost:
    """Convert a raw tweet object into a :class:`RawPost`."""
    entities = raw.get("entities", {}) or {}
    metrics = raw.get("public_metrics", {}) or {}
    refs = raw.get("referenced_tweets", []) or []
    is_retweet = any(r.get("type") == "retweeted" for r in refs)
    is_reply = any(r.get("type") == "replied_to" for r in refs)
    url_details = _extract_url_details(entities)
    return RawPost(
        id=str(raw["id"]),
        text=raw.get("text", ""),
        author_id=str(raw.get("author_id", "")),
        created_at=_parse_dt(raw.get("created_at")),
        lang=raw.get("lang"),
        like_count=metrics.get("like_count", 0),
        reply_count=metrics.get("reply_count", 0),
        retweet_count=metrics.get("retweet_count", 0),
        quote_count=metrics.get("quote_count", 0),
        impression_count=metrics.get("impression_count", 0),
        is_retweet=is_retweet,
        is_reply=is_reply,
        expanded_urls=[d["selected_canonical_url"] for d in url_details if d["selected_canonical_url"]],
        url_details=url_details,
        hashtags=[h.get("tag", "") for h in entities.get("hashtags", []) or []],
        mentions=[m.get("username", "") for m in entities.get("mentions", []) or []],
        query_groups=list(query_groups or []),
    )


def parse_user(raw: dict[str, Any]) -> RawUser:
    entities = raw.get("entities", {}) or {}
    # Profile URLs live under entities.url.urls and entities.description.urls.
    url_entities = (entities.get("url", {}) or {}).get("urls", []) or []
    desc_entities = (entities.get("description", {}) or {}).get("urls", []) or []
    expanded = []
    for u in list(url_entities) + list(desc_entities):
        e = u.get("expanded_url") or u.get("url")
        if e:
            expanded.append(e)
    metrics = raw.get("public_metrics", {}) or {}
    return RawUser(
        id=str(raw["id"]),
        username=raw.get("username", ""),
        name=raw.get("name", ""),
        description=raw.get("description", ""),
        url=raw.get("url"),
        verified=bool(raw.get("verified", False)),
        created_at=_parse_dt(raw.get("created_at")),
        followers_count=metrics.get("followers_count", 0),
        following_count=metrics.get("following_count", 0),
        tweet_count=metrics.get("tweet_count", 0),
        expanded_urls=expanded,
    )


# ---------------------------------------------------------------------------
# Client
# ---------------------------------------------------------------------------
class XClient:
    def __init__(
        self,
        secrets: Secrets,
        cache: Cache,
        *,
        max_retries: int = 3,
        session: Optional[requests.Session] = None,
        sleep_fn=time.sleep,
        base_url: Optional[str] = None,
        rate_limit_policy: Optional[RateLimitPolicy] = None,
        http_timeouts: Optional[HttpTimeouts] = None,
    ):
        if not secrets.x_bearer_token:
            raise XAPIError("No X bearer token available.")
        self._token = secrets.x_bearer_token
        self.cache = cache
        self.max_retries = max_retries
        self._sleep = sleep_fn
        # Separate connect + read timeouts (validated, fail-closed).
        self.http_timeouts = http_timeouts or load_http_timeouts()
        # Production defaults to BASE_URL; a custom base_url is for tests/mocks only.
        self.base_url = base_url or BASE_URL
        self.rate_limit_policy = rate_limit_policy or RateLimitPolicy.from_config(load_runtime())
        self._session = session or requests.Session()
        self._session.headers.update({"Authorization": f"Bearer {self._token}"})
        # Credential logging: never reveal prefix/suffix/length/shape.
        log.info("Bearer token loaded: yes")
        log.info("Bearer token value: redacted")
        # Live counters (real network calls only, not cache hits).
        self.api_calls = 0
        # Sanitized metadata of the most recent live response (for the manifest).
        self.last_response_meta: dict[str, Any] = {}
        # Endpoint-scoped preemptive rate-limit state (in-memory, per process
        # only — NEVER persisted across restarts). Keyed by endpoint scope.
        self._rl_state: dict[str, RateLimitHeaders] = {}

    # -- low-level GET with retry/backoff ----------------------------------
    def _get(
        self,
        path: str,
        params: dict[str, Any],
        *,
        cache_sig: Optional[str],
        retry_context: Optional[RetryContext] = None,
    ) -> dict[str, Any]:
        if cache_sig is not None:
            cached = self.cache.get_http(cache_sig)
            if cached is not None:
                log.debug("cache hit: %s", cache_sig)
                return cached

        url = f"{self.base_url}{path}"
        scope = endpoint_scope("GET", path)

        # Preemptive, endpoint-scoped rate-limit check BEFORE sending. Uses only
        # prior state from the SAME scope; makes no extra API request.
        pre = preemptive_decision(
            self._rl_state.get(scope),
            time.time(),
            self.rate_limit_policy,
            approval_expiry_epoch=(retry_context.approval_expiry_epoch if retry_context else None),
            budget_ok=(retry_context.budget_ok() if retry_context else True),
        )
        if pre.action == PREEMPT_DISCARD_THEN_PROCEED:
            self._rl_state.pop(scope, None)  # stale exhaustion; window has reset
        elif pre.action == PREEMPT_WAIT:
            self._sleep(pre.wait_seconds)
            # Re-resolve the relative search window AFTER waiting, before sending.
            if retry_context is not None:
                retry_context.reresolve_window()
        elif pre.action == PREEMPT_STOP:
            raise RateLimitError(pre.stop_reason or "rate_limited")

        rl_retries = 0
        server_retries = 0
        while True:
            request_ts = now_utc()
            watch = Stopwatch()  # monotonic elapsed measurement
            try:
                resp = self._session.get(
                    url, params=params, timeout=self.http_timeouts.as_tuple()
                )
            except requests.Timeout as exc:
                # Connect/read timeout: FAIL CLOSED, NO automatic retry. Carry only
                # a sanitized exception TYPE (never a message that could leak creds).
                raise NetworkTimeoutError(
                    type(exc).__name__,
                    watch.elapsed_ms(),
                    request_ts_utc=to_rfc3339(request_ts, field="request_timestamp_utc"),
                ) from None
            except requests.RequestException as exc:
                raise XAPIError(f"Network error: {type(exc).__name__}") from None

            self.api_calls += 1
            response_ts = now_utc()
            # Sanitized metadata for the run manifest (no secrets ever); duration
            # comes from the MONOTONIC clock, not wall-clock subtraction.
            self.last_response_meta = sanitized_response_metadata(
                dict(resp.headers), resp.status_code, request_ts, response_ts,
                rl_retries, watch.elapsed_ms(),
            )
            # Record endpoint-scoped rate-limit state for future preemptive checks.
            self._rl_state[scope] = RateLimitHeaders.from_response_headers(dict(resp.headers))

            if resp.status_code == 200:
                data = self._parse_json(resp)
                if cache_sig is not None:
                    self.cache.put_http(cache_sig, data)
                return data

            if resp.status_code == 429:
                headers = RateLimitHeaders.from_response_headers(dict(resp.headers))
                decision = ratelimit_decide(
                    headers,
                    time.time(),
                    self.rate_limit_policy,
                    rl_retries,
                    approval_expiry_epoch=(retry_context.approval_expiry_epoch if retry_context else None),
                    budget_ok=(retry_context.budget_ok() if retry_context else True),
                )
                if decision.should_retry:
                    # Re-resolve the approved relative-window policy immediately
                    # before retrying, then wait exactly the header-derived time.
                    if retry_context is not None:
                        retry_context.reresolve_window()
                    log.warning("429: single bounded retry after %.1fs (reset-derived)", decision.wait_seconds)
                    self._sleep(decision.wait_seconds)
                    rl_retries += 1
                    continue
                raise RateLimitError(decision.stop_reason or "rate_limited", headers.reset_epoch)

            if resp.status_code == 403:
                # Distinguish usage-cap / credits exhaustion from other 403s.
                body = resp.text.lower()
                if "usage" in body or "cap" in body or "credit" in body:
                    raise CreditsExhaustedError(
                        "X API credits/usage cap exhausted (HTTP 403)."
                    )
                raise XAPIError(f"Forbidden (403): {resp.text[:200]}")

            if 500 <= resp.status_code < 600:
                server_retries += 1
                if server_retries > self.max_retries:
                    raise XAPIError(f"Server error {resp.status_code}")
                self._backoff(server_retries)
                continue

            raise XAPIError(f"Unexpected status {resp.status_code}: {resp.text[:200]}")

    @staticmethod
    def _parse_json(resp: requests.Response) -> dict[str, Any]:
        try:
            data = resp.json()
        except ValueError as exc:
            raise MalformedResponseError("Response was not valid JSON") from exc
        if not isinstance(data, dict):
            raise MalformedResponseError("Response JSON was not an object")
        return data

    def _backoff(self, attempt: int) -> None:
        delay = min(2 ** attempt, 30.0)
        log.warning("Retrying after %.1fs (attempt %d)", delay, attempt)
        self._sleep(delay)

    # -- recent search -----------------------------------------------------
    def search_recent(
        self,
        query: str,
        *,
        max_results: int,
        query_groups: Optional[list[str]] = None,
        paginate: bool = False,
        page_limit: int = 1,
        retry_context: Optional[RetryContext] = None,
    ) -> list[RawPost]:
        """Search recent posts.

        Pagination is OFF unless ``paginate=True`` (mandate: pagination only when
        explicitly enabled). ``max_results`` is the TOTAL cap across pages.
        ``retry_context`` supplies approval/budget/window hooks consulted before a
        single bounded 429 retry.
        """
        collected: list[RawPost] = []
        next_token: Optional[str] = None
        pages = 0
        while True:
            pages += 1
            per_page = min(SEARCH_MAX_PER_PAGE, max(10, max_results - len(collected)))
            params: dict[str, Any] = {
                "query": query,
                "max_results": per_page,
                "tweet.fields": TWEET_FIELDS,
                "expansions": "author_id",
                "user.fields": USER_FIELDS,
            }
            if next_token:
                params["next_token"] = next_token
            sig = f"search::{query}::{per_page}::{next_token or ''}"
            data = self._get(
                "/tweets/search/recent", params, cache_sig=sig, retry_context=retry_context
            )

            includes_users = {
                u["id"]: u for u in data.get("includes", {}).get("users", [])
            }
            for raw in data.get("data", []) or []:
                post = parse_post(raw, query_groups=query_groups)
                # Cache raw post + its author (so we don't refetch the author).
                self.cache.put_post(post.id, raw)
                author = includes_users.get(post.author_id)
                if author and not self.cache.has_user(post.author_id):
                    self.cache.put_user(post.author_id, author)
                collected.append(post)
                if len(collected) >= max_results:
                    return collected

            next_token = (data.get("meta", {}) or {}).get("next_token")
            if not paginate or not next_token or pages >= page_limit:
                break
        return collected

    # -- recent counts (volume assessment during approval) -----------------
    def count_recent(self, query: str) -> Optional[int]:
        """Return the recent post count for a query, or None on failure.

        Uses the counts endpoint for volume assessment during approval. Kept
        best-effort: any error returns None rather than raising, so approval can
        still proceed with 'counts unavailable'.
        """
        params = {"query": query, "granularity": "day"}
        sig = f"counts::{query}"
        try:
            data = self._get("/tweets/counts/recent", params, cache_sig=sig)
        except XAPIError:
            return None
        meta = data.get("meta", {}) or {}
        total = meta.get("total_tweet_count")
        return int(total) if total is not None else None

    def count_recent_window(
        self,
        query: str,
        *,
        start_time: str,
        end_time: str,
        granularity: str = "day",
    ) -> tuple[Optional[int], dict[str, Any]]:
        """Recent-counts for a FROZEN shared [start_time, end_time] window.

        Returns (total_tweet_count, raw_response). Times are RFC3339 UTC strings.
        Used by the count preflight so all queries share one exact window.
        """
        params = {
            "query": query,
            "granularity": granularity,
            "start_time": start_time,
            "end_time": end_time,
        }
        sig = f"counts::{query}::{start_time}::{end_time}::{granularity}"
        data = self._get("/tweets/counts/recent", params, cache_sig=sig)
        meta = data.get("meta", {}) or {}
        total = meta.get("total_tweet_count")
        return (int(total) if total is not None else None), data

    # -- user batches ------------------------------------------------------
    def get_users(self, user_ids: Iterable[str]) -> list[RawUser]:
        """Fetch user profiles in batches of <=100, using cache first."""
        ids = list(dict.fromkeys(str(i) for i in user_ids if i))  # dedup, keep order
        out: list[RawUser] = []
        to_fetch: list[str] = []
        for uid in ids:
            cached = self.cache.get_user(uid)
            if cached is not None:
                out.append(parse_user(cached))
            else:
                to_fetch.append(uid)

        for i in range(0, len(to_fetch), USERS_BATCH_MAX):
            batch = to_fetch[i : i + USERS_BATCH_MAX]
            params = {"ids": ",".join(batch), "user.fields": USER_FIELDS}
            sig = f"users::{','.join(batch)}"
            data = self._get("/users", params, cache_sig=sig)
            for raw in data.get("data", []) or []:
                self.cache.put_user(str(raw["id"]), raw)
                out.append(parse_user(raw))
        return out

    # -- timelines (shortlist only) ----------------------------------------
    def get_timeline(self, user_id: str, *, max_results: int = 10) -> list[RawPost]:
        """Fetch a user's recent posts. Call for SHORTLISTED accounts only."""
        cached = self.cache.get_timeline(user_id)
        if cached is not None:
            return [parse_post(raw) for raw in cached.get("data", []) or []]

        per_page = min(SEARCH_MAX_PER_PAGE, max(5, max_results))
        params = {
            "max_results": per_page,
            "tweet.fields": TWEET_FIELDS,
            "exclude": "retweets,replies",
        }
        sig = f"timeline::{user_id}::{per_page}"
        data = self._get(f"/users/{user_id}/tweets", params, cache_sig=sig)
        self.cache.put_timeline(user_id, data)
        posts = []
        for raw in data.get("data", []) or []:
            self.cache.put_post(str(raw["id"]), raw)
            posts.append(parse_post(raw))
        return posts

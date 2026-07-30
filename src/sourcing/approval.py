"""Approval control via request fingerprinting (FINAL AMENDMENT).

A live search is gated on an ``approved_request_fingerprint`` computed from the
FULL canonical request — not just the literal query text. Adding an expansion,
changing requested fields, page size, or the query configuration version all
change the fingerprint and therefore INVALIDATE a prior approval. The gate fails
closed on any mismatch.

Decisions are persisted atomically to ``config/query_decisions.yaml``.
"""

from __future__ import annotations

import hashlib
import json
import os
import tempfile
from dataclasses import asdict, dataclass, field
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Optional

import yaml

from .config import CONFIG_DIR
from .timeutil import (
    ensure_aware_utc,
    epoch_from_rfc3339,
    now_utc,
    parse_rfc3339,
    to_rfc3339,
)

DECISIONS_PATH = CONFIG_DIR / "query_decisions.yaml"

# Human-approvable decisions (via approve-query). "pending_review" is the initial
# seeded state and is NEVER runnable — the gate fails closed on it.
VALID_DECISIONS = {"run", "revise", "disable"}
PENDING_REVIEW = "pending_review"


def seed_pending_decisions(query_ids: list[str], config_version, path: Path | None = None) -> None:
    """Seed any not-yet-decided queries as pending_review. Never auto-approves."""
    existing = load_decisions(path)
    changed = False
    for qid in query_ids:
        if qid not in existing:
            existing[qid] = QueryDecision(
                query_id=qid,
                decision=PENDING_REVIEW,
                reviewer="",
                note="awaiting human review",
                reviewed_at_utc="",
                approved_request_fingerprint=None,
                query_config_version=str(config_version),
            )
            changed = True
    if changed:
        payload = {"decisions": {qid: d.to_dict() for qid, d in existing.items()}}
        _atomic_write_yaml(payload, path or DECISIONS_PATH)


def reseed_pending_decisions(query_ids: list[str], config_version, path: Path | None = None) -> list[str]:
    """Rewrite decisions to EXACTLY the current query set.

    Keeps existing decisions for still-current ids, adds missing ids as
    pending_review, and DROPS ids no longer present (invalidating any fingerprint
    that was tied to a renamed/removed id). Returns the list of dropped ids.
    """
    existing = load_decisions(path)
    current = set(query_ids)
    dropped = [qid for qid in existing if qid not in current]
    new: dict[str, QueryDecision] = {}
    for qid in query_ids:
        if qid in existing:
            new[qid] = existing[qid]
        else:
            new[qid] = QueryDecision(
                query_id=qid,
                decision=PENDING_REVIEW,
                reviewer="",
                note="awaiting human review",
                reviewed_at_utc="",
                approved_request_fingerprint=None,
                query_config_version=str(config_version),
            )
    payload = {"decisions": {qid: d.to_dict() for qid, d in new.items()}}
    _atomic_write_yaml(payload, path or DECISIONS_PATH)
    return dropped


# ---------------------------------------------------------------------------
# Canonical request + fingerprint
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class CanonicalRequest:
    """Every parameter that affects returned resources, cost, or interpretation.

    Anything added here becomes part of the fingerprint. Keep it exhaustive.
    """

    query_id: str
    query: str                      # full literal query (incl. global filters)
    tweet_fields: str               # requested post fields
    expansions: str                 # requested expansions (e.g. author_id)
    user_fields: str                # requested user fields (tied to expansions)
    start_time_policy: str          # start-time policy
    end_time_policy: str            # end-time policy
    max_results_per_page: int       # page size
    query_config_version: str       # config_version from queries.yaml
    extra: dict[str, Any] = field(default_factory=dict)

    def canonical_dict(self) -> dict[str, Any]:
        d = asdict(self)
        # `extra` is included but normalised to stable key order.
        d["extra"] = {k: d["extra"][k] for k in sorted(d["extra"])}
        return d

    def fingerprint(self) -> str:
        blob = json.dumps(self.canonical_dict(), sort_keys=True, separators=(",", ":"))
        digest = hashlib.sha256(blob.encode("utf-8")).hexdigest()
        return f"sha256:{digest}"

    def describe(self) -> str:
        d = self.canonical_dict()
        lines = ["  Canonical request configuration:"]
        for k in sorted(d):
            if k == "query":
                continue  # shown separately in full
            lines.append(f"    {k}: {d[k]}")
        return "\n".join(lines)


def build_canonical_request(spec, cfg, config_version: Any) -> CanonicalRequest:
    """Build the canonical request for a query spec + run config.

    Both ``approve-query`` and the execution gate call this identically, so the
    fingerprints they compute are guaranteed to match for the same inputs.
    """
    from .x_client import SEARCH_MAX_PER_PAGE, TWEET_FIELDS, USER_FIELDS

    page_size = min(SEARCH_MAX_PER_PAGE, max(10, cfg.page_size))
    return CanonicalRequest(
        query_id=spec.id,
        query=spec.query,
        tweet_fields=TWEET_FIELDS,
        expansions="author_id",
        user_fields=USER_FIELDS,
        start_time_policy="recent_search_default_7d",
        end_time_policy="now",
        max_results_per_page=page_size,
        query_config_version=str(config_version),
        extra={"paginate": bool(cfg.paginate)},
    )


# ---------------------------------------------------------------------------
# Canary canonical request — schema VERSION 2 with a structured, fingerprinted
# window_policy. Legacy start_time_policy/end_time_policy are removed entirely.
# ---------------------------------------------------------------------------
CANARY_SCHEMA_VERSION = 2
CANARY_MAX_RESULTS = 10          # the canary is a fixed ten-post request
SUPPORTED_WINDOW_MODES = {"recent_relative"}
_WINDOW_POLICY_KEYS = {
    "mode", "lookback_days", "start_guard_seconds", "end_guard_seconds",
    "resolve_once_at_execution",
}
# The pre-migration (schema v1) q1 canary fingerprint, now invalidated.
OLD_Q1_CANARY_FINGERPRINT_V1 = (
    "sha256:79ab64e234798b78f16fa5fbf06c6648085c569e39929c2ef5a6ac9116d4ec7b"
)


class CanonicalRequestSchemaError(ValueError):
    """Raised when a canary canonical request violates the v2 schema (fail closed)."""


def _is_number(v: Any) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def validate_canary_canonical_request(d: dict[str, Any]) -> None:
    """Fail-closed validator for the v2 canary canonical request.

    Belongs in canonical-request construction and the approval execution gate —
    NOT in the X response parser.
    """
    ver = d.get("canonical_request_schema_version")
    if ver is None:
        raise CanonicalRequestSchemaError("canonical_request_schema_version is missing")
    if ver != 2:
        raise CanonicalRequestSchemaError(f"canonical_request_schema_version must be 2, got {ver!r}")
    if "start_time_policy" in d:
        raise CanonicalRequestSchemaError("legacy 'start_time_policy' must not be present")
    if "end_time_policy" in d:
        raise CanonicalRequestSchemaError("legacy 'end_time_policy' must not be present")

    wp = d.get("window_policy")
    if wp is None:
        raise CanonicalRequestSchemaError("window_policy is missing")
    if not isinstance(wp, dict):
        raise CanonicalRequestSchemaError("window_policy must be an object")

    mode = wp.get("mode")
    if mode is None or mode not in SUPPORTED_WINDOW_MODES:
        raise CanonicalRequestSchemaError(f"window_policy.mode is missing/unsupported: {mode!r}")
    ld = wp.get("lookback_days")
    if ld is None or not _is_number(ld) or ld <= 0:
        raise CanonicalRequestSchemaError("window_policy.lookback_days must be a positive number")
    for g in ("start_guard_seconds", "end_guard_seconds"):
        gv = wp.get(g)
        if gv is None or not _is_number(gv) or gv < 0:
            raise CanonicalRequestSchemaError(f"window_policy.{g} must be a non-negative number")
    if wp.get("resolve_once_at_execution") is not True:
        raise CanonicalRequestSchemaError("window_policy.resolve_once_at_execution must be true")
    unknown = set(wp) - _WINDOW_POLICY_KEYS
    if unknown:
        raise CanonicalRequestSchemaError(f"window_policy has unknown fields: {sorted(unknown)}")


@dataclass(frozen=True)
class CanaryCanonicalRequest:
    """Schema-v2 canary recent-search canonical request (no legacy policy keys)."""

    query_id: str
    query: str
    tweet_fields: str
    expansions: str                 # "" => none
    user_fields: str                # "" => none
    max_results: int
    sort_order: str
    paginate: bool
    query_config_version: str
    window_policy: dict[str, Any]
    canonical_request_schema_version: int = CANARY_SCHEMA_VERSION

    def canonical_dict(self) -> dict[str, Any]:
        return {
            "canonical_request_schema_version": self.canonical_request_schema_version,
            "query_id": self.query_id,
            "query": self.query,
            "tweet_fields": self.tweet_fields,
            "expansions": self.expansions,
            "user_fields": self.user_fields,
            "max_results": self.max_results,
            "sort_order": self.sort_order,
            "paginate": self.paginate,
            "query_config_version": self.query_config_version,
            "window_policy": {k: self.window_policy[k] for k in sorted(self.window_policy)},
        }

    def fingerprint(self) -> str:
        # sort_keys makes serialization deterministic regardless of insertion order.
        blob = json.dumps(self.canonical_dict(), sort_keys=True, separators=(",", ":"))
        return "sha256:" + hashlib.sha256(blob.encode("utf-8")).hexdigest()

    def describe(self) -> str:
        d = self.canonical_dict()
        lines = ["  Canary canonical request configuration (schema v2):"]
        for k in sorted(d):
            if k == "query":
                continue
            lines.append(f"    {k}: {d[k]}")
        return "\n".join(lines)


def build_canary_request(spec, cfg, config_version: Any) -> CanaryCanonicalRequest:
    """Schema-v2 canonical request for the ten-post CANARY.

    ZERO author expansions and ZERO user enrichment; sort_order=recency; a
    structured, FINGERPRINTED window_policy (resolved once at execution). Legacy
    start_time_policy/end_time_policy are gone. ``build_canonical_request``
    (count preflight) is unchanged.
    """
    from .x_client import TWEET_FIELDS

    req = CanaryCanonicalRequest(
        query_id=spec.id,
        query=spec.query,
        tweet_fields=TWEET_FIELDS,
        expansions="",
        user_fields="",
        max_results=CANARY_MAX_RESULTS,   # fixed at 10 (independent of cfg.page_size)
        sort_order="recency",
        paginate=bool(cfg.paginate),
        query_config_version=str(config_version),
        window_policy={
            "mode": "recent_relative",
            "lookback_days": 7,
            "start_guard_seconds": 300,
            "end_guard_seconds": 30,
            "resolve_once_at_execution": True,
        },
    )
    # Validate at construction (fail closed).
    validate_canary_canonical_request(req.canonical_dict())
    return req


def resolve_canary_window(request_anchor_utc: datetime, window_policy: dict[str, Any]) -> dict[str, Any]:
    """Resolve the guarded relative window ONCE from an aware-UTC anchor.

    end   = anchor - end_guard_seconds
    start = anchor - lookback_days + start_guard_seconds
    These resolved timestamps are temporary and are NOT part of the fingerprint.
    """
    anchor = ensure_aware_utc(request_anchor_utc, field="request_anchor_utc")
    end = anchor - timedelta(seconds=window_policy["end_guard_seconds"])
    start = (
        anchor
        - timedelta(days=window_policy["lookback_days"])
        + timedelta(seconds=window_policy["start_guard_seconds"])
    )
    eff = int((end - start).total_seconds())
    return {
        "request_anchor_utc": to_rfc3339(anchor),
        "resolved_start_time_utc": to_rfc3339(start),
        "resolved_end_time_utc": to_rfc3339(end),
        "start_guard_seconds": window_policy["start_guard_seconds"],
        "end_guard_seconds": window_policy["end_guard_seconds"],
        "effective_window_seconds": eff,
        "effective_window_human_readable": _human_seconds(eff),
    }


def _human_seconds(seconds: int) -> str:
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
    if secs or not parts:
        parts.append(f"{secs} second{'s' if secs != 1 else ''}")
    return ", ".join(parts)


# ---------------------------------------------------------------------------
# Decision store
# ---------------------------------------------------------------------------
# 15-minute approval time-to-live.
APPROVAL_TTL_SECONDS = 900


@dataclass
class QueryDecision:
    query_id: str
    decision: str
    reviewer: str
    note: str
    reviewed_at_utc: str
    approved_request_fingerprint: Optional[str] = None
    query_config_version: Optional[str] = None
    approved_at_utc: Optional[str] = None   # aware-UTC RFC3339 (run decisions)
    expires_at_utc: Optional[str] = None    # approved_at + APPROVAL_TTL_SECONDS

    def to_dict(self) -> dict[str, Any]:
        return {
            "decision": self.decision,
            "approved_request_fingerprint": self.approved_request_fingerprint,
            "reviewer": self.reviewer,
            "note": self.note,
            "reviewed_at_utc": self.reviewed_at_utc,
            "query_config_version": self.query_config_version,
            "approved_at_utc": self.approved_at_utc,
            "expires_at_utc": self.expires_at_utc,
        }


def load_decisions(path: Path | None = None) -> dict[str, QueryDecision]:
    # Resolve at call time so tests can monkeypatch DECISIONS_PATH.
    path = path or DECISIONS_PATH
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as fh:
        data = yaml.safe_load(fh) or {}
    out: dict[str, QueryDecision] = {}
    for qid, row in (data.get("decisions", {}) or {}).items():
        out[qid] = QueryDecision(
            query_id=qid,
            decision=row.get("decision", ""),
            reviewer=row.get("reviewer", ""),
            note=row.get("note", ""),
            reviewed_at_utc=row.get("reviewed_at_utc", ""),
            approved_request_fingerprint=row.get("approved_request_fingerprint"),
            query_config_version=row.get("query_config_version"),
            approved_at_utc=row.get("approved_at_utc"),
            expires_at_utc=row.get("expires_at_utc"),
        )
    return out


def _atomic_write_yaml(payload: dict[str, Any], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            yaml.safe_dump(payload, fh, sort_keys=True, default_flow_style=False)
            fh.flush()
            os.fsync(fh.fileno())
        os.replace(tmp, path)  # atomic on POSIX
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


def record_decision(decision: QueryDecision, path: Path | None = None) -> None:
    """Persist a decision atomically, preserving other queries' decisions."""
    path = path or DECISIONS_PATH
    existing = load_decisions(path)
    existing[decision.query_id] = decision
    payload = {"decisions": {qid: d.to_dict() for qid, d in existing.items()}}
    _atomic_write_yaml(payload, path)


def now_utc_iso() -> str:
    return to_rfc3339(now_utc())


def compute_ttl(approved_at: datetime | None = None) -> tuple[str, str]:
    """Return (approved_at_utc, expires_at_utc) as aware-UTC RFC3339 Z strings."""
    approved_at = ensure_aware_utc(approved_at) if approved_at else now_utc()
    expires_at = approved_at + timedelta(seconds=APPROVAL_TTL_SECONDS)
    return to_rfc3339(approved_at), to_rfc3339(expires_at)


def approval_expiry_epoch(decision: QueryDecision) -> Optional[float]:
    """POSIX epoch of the approval expiry (aware UTC), or None if not set."""
    if not decision.expires_at_utc:
        return None
    return epoch_from_rfc3339(decision.expires_at_utc, field="expires_at_utc")


def is_approval_valid(decision: QueryDecision, now: datetime | None = None) -> bool:
    """True if the approval TTL has not yet elapsed (aware-UTC comparison)."""
    if not decision.expires_at_utc:
        return False
    now = ensure_aware_utc(now) if now else now_utc()
    return now < parse_rfc3339(decision.expires_at_utc, field="expires_at_utc")


# ---------------------------------------------------------------------------
# Execution gate
# ---------------------------------------------------------------------------
@dataclass
class GateResult:
    allowed: bool
    reasons: list[str] = field(default_factory=list)


def check_execution_gate(
    request: CanonicalRequest,
    decisions: dict[str, QueryDecision],
    *,
    global_budget_ok: bool,
    op_budget_ok: bool = True,
    pricing_ok: bool = True,
) -> GateResult:
    """Verify ALL conditions before any post retrieval. Fails closed.

    Conditions:
      * a ``run`` decision exists for this query_id
      * current fingerprint == approved fingerprint (full canonical request)
      * global budget check passes
      * operation-level budget check passes (when configured)
      * stale pricing acknowledged when required
    """
    reasons: list[str] = []
    dec = decisions.get(request.query_id)
    if dec is None:
        reasons.append(f"no approval decision recorded for '{request.query_id}'")
    elif dec.decision != "run":
        reasons.append(f"decision is '{dec.decision}', not 'run'")
    elif not dec.approved_request_fingerprint:
        reasons.append("approved decision has no runnable fingerprint")
    elif dec.approved_request_fingerprint != request.fingerprint():
        reasons.append(
            "request fingerprint mismatch — the request changed since approval "
            "(query text, fields, expansions, page size, or config version); "
            "re-approve required"
        )

    if not global_budget_ok:
        reasons.append("global budget check failed")
    if not op_budget_ok:
        reasons.append("operation-level budget check failed")
    if not pricing_ok:
        reasons.append("stale pricing not acknowledged")

    return GateResult(allowed=(len(reasons) == 0), reasons=reasons)

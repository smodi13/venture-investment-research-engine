"""Query validator — runs BEFORE any X API call.

Enforces the X API v2 recent-search contract so we never rely on unsupported
operators (which can silently fail) or exceed the length limit.

Rules:
  * Reject min_faves:/min_replies:/min_retweets: (unsupported; engagement is
    computed locally from public_metrics after retrieval).
  * Reject any operator token not on the allowlist.
  * Warn if a query exceeds the 512-character self-serve limit.
  * Conjunction-required operators (has:*, is:*, url:, from:, to:, list:) must be
    paired with a standalone search term, never used alone.
  * The exact query text is printed and logged before execution (see
    :func:`validate_and_announce`).
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field

log = logging.getLogger(__name__)

MAX_QUERY_CHARS = 512

# Explicitly forbidden (unsupported by recent-search v2).
FORBIDDEN_OPERATORS = ("min_faves:", "min_replies:", "min_retweets:")

# Allowlisted operator prefixes. `has:` and `is:` require a specific value.
ALLOWED_EXACT = {
    "has:links", "has:images", "has:videos", "has:media",
    "is:retweet", "is:reply",
}
ALLOWED_PREFIXES = ("from:", "to:", "url:", "lang:", "list:")

# Operators that REQUIRE a standalone (non-operator) term to be present.
CONJUNCTION_REQUIRED = {
    "has:links", "has:images", "has:videos", "has:media",
    "is:retweet", "is:reply",
} | {p for p in ("url:",)}

# Matches an operator-like token, e.g. `has:links`, `from:foo`, `min_faves:10`.
_OPERATOR_RE = re.compile(r"-?[a-zA-Z_]+:[^\s()]*")
_QUOTED_RE = re.compile(r'"[^"]*"')


class QueryValidationError(ValueError):
    """Raised when a query violates a hard rule (must not be sent to the API)."""


@dataclass
class ValidationResult:
    query: str
    ok: bool = True
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


def _operator_tokens(query: str) -> list[str]:
    return _OPERATOR_RE.findall(query)


def _has_standalone_term(query: str) -> bool:
    """True if the query contains a bare keyword or an exact phrase.

    Operators (word:value) and Boolean glue (OR, parentheses, `-`) do not count.
    """
    if _QUOTED_RE.search(query):
        return True
    # Remove quoted phrases, operator tokens, then boolean/punctuation glue.
    stripped = _QUOTED_RE.sub(" ", query)
    stripped = _OPERATOR_RE.sub(" ", stripped)
    stripped = stripped.replace("(", " ").replace(")", " ")
    tokens = [t for t in stripped.split() if t and t != "OR" and t != "-"]
    tokens = [t for t in tokens if not t.startswith("-") or len(t) > 1]
    return len(tokens) > 0


def validate_query(query: str) -> ValidationResult:
    result = ValidationResult(query=query)
    low = query.lower()

    # 1. Forbidden engagement operators.
    for op in FORBIDDEN_OPERATORS:
        if op in low:
            result.ok = False
            result.errors.append(
                f"Forbidden operator '{op}' — unsupported by recent-search v2; "
                "engagement is computed locally from public_metrics."
            )

    # 2. Operator allowlist.
    for tok in _operator_tokens(query):
        norm = tok.lstrip("-").lower()
        if any(norm.startswith(p) for p in ALLOWED_PREFIXES):
            continue
        if norm in ALLOWED_EXACT:
            continue
        # Already reported if it's a forbidden engagement op.
        if any(norm.startswith(op) for op in FORBIDDEN_OPERATORS):
            continue
        result.ok = False
        result.errors.append(f"Disallowed operator token '{tok}'.")

    # 3. Length warning.
    if len(query) > MAX_QUERY_CHARS:
        result.warnings.append(
            f"Query is {len(query)} chars, exceeds the {MAX_QUERY_CHARS}-char "
            "recent-search limit; it may be rejected or truncated."
        )

    # 4. Conjunction-required operators need a standalone term.
    used_conjunction_ops = [
        tok for tok in _operator_tokens(query)
        if tok.lstrip("-").lower() in CONJUNCTION_REQUIRED
    ]
    if used_conjunction_ops and not _has_standalone_term(query):
        result.ok = False
        result.errors.append(
            f"Operator(s) {used_conjunction_ops} require a standalone search "
            "term (keyword or exact phrase); cannot be used alone."
        )

    return result


def validate_and_announce(query: str, *, label: str = "") -> ValidationResult:
    """Validate, print+log the exact query, and raise on hard errors."""
    result = validate_query(query)
    prefix = f"[{label}] " if label else ""
    # Print and log the EXACT query text before it executes.
    print(f"{prefix}QUERY: {query}")
    log.info("%svalidated query: %s", prefix, query)
    for w in result.warnings:
        log.warning("%s%s", prefix, w)
        print(f"{prefix}WARNING: {w}")
    if not result.ok:
        for e in result.errors:
            log.error("%s%s", prefix, e)
        raise QueryValidationError(
            f"{prefix}query failed validation: " + "; ".join(result.errors)
        )
    return result

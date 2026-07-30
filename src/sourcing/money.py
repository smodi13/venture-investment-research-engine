"""Exact decimal currency arithmetic.

Monetary values are NEVER Python floats. They are stored in config as quoted
decimal strings, parsed/validated with :class:`decimal.Decimal`, and serialized
as fixed-point strings. Ledger math uses Decimal only — never binary floats, and
never mixes Decimal with float.
"""

from __future__ import annotations

from decimal import Decimal, InvalidOperation
from typing import Any

# Placeholder markers that must be rejected as monetary values.
_PLACEHOLDERS = {
    "placeholder", "tbd", "unset", "n/a", "na", "none", "null", "pending",
    "pending_manual_reconciliation",
}

DEFAULT_PLACES = 3


class MoneyError(ValueError):
    """Raised when a monetary value is missing, non-finite, or otherwise invalid."""


def parse_money(raw: Any, *, field: str = "value", allow_zero: bool = False) -> Decimal:
    """Parse a monetary value into an exact Decimal, failing closed on bad input.

    Rejects: missing/null, empty, boolean, float source, NaN/±Infinity, negative,
    zero (unless ``allow_zero``), placeholder markers, and non-decimal strings.
    """
    if isinstance(raw, bool):
        raise MoneyError(f"{field}: boolean is not a valid monetary value")
    if raw is None:
        raise MoneyError(f"{field}: missing/null monetary value")
    if isinstance(raw, float):
        raise MoneyError(f"{field}: float source not allowed; quote as a decimal string")
    s = str(raw).strip()
    if not s:
        raise MoneyError(f"{field}: empty monetary value")
    if s.lower() in _PLACEHOLDERS:
        raise MoneyError(f"{field}: placeholder value '{s}' is not a valid amount")
    try:
        d = Decimal(s)
    except InvalidOperation as exc:
        raise MoneyError(f"{field}: '{s}' is not a valid decimal") from exc
    if not d.is_finite():
        raise MoneyError(f"{field}: non-finite value (NaN/Infinity) not allowed")
    if d < 0:
        raise MoneyError(f"{field}: negative value not allowed")
    if d == 0 and not allow_zero:
        raise MoneyError(f"{field}: zero value not allowed")
    return d


def money_str(value: Decimal, places: int = DEFAULT_PLACES) -> str:
    """Serialize a Decimal as a fixed-point string, e.g. Decimal('0.05') -> '0.050'."""
    if isinstance(value, float):
        raise MoneyError("refusing to serialize a float as money")
    quant = Decimal(1).scaleb(-places)  # 10^-places
    return str(value.quantize(quant))

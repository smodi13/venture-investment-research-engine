"""Non-cost governance audit trail.

Records governance events — query renames, approval invalidations, configuration
migrations, cached-result migrations — in an append-only JSONL log SEPARATE from
the cost audit trail. Events are only appended, never overwritten or deleted.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .config import OUTPUT_DIR
from .timeutil import now_utc, to_rfc3339

GOVERNANCE_AUDIT_PATH = OUTPUT_DIR / "governance_audit.jsonl"


def _now() -> str:
    return to_rfc3339(now_utc())


def append_governance_event(event: dict[str, Any], path: Path = GOVERNANCE_AUDIT_PATH) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(event, default=str) + "\n")


def load_governance_events(path: Path = GOVERNANCE_AUDIT_PATH) -> list[dict[str, Any]]:
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


# -- typed recorders (each idempotent by append-guard) ----------------------
def record_config_migration(change: str, frm: str, to: str, reason: str,
                            path: Path = GOVERNANCE_AUDIT_PATH) -> bool:
    if _has_event(load_governance_events(path), event_type="configuration_migration", change=change):
        return False
    append_governance_event({
        "event_type": "configuration_migration",
        "change": change,
        "from": frm,
        "to": to,
        "reason": reason,
        "recorded_at_utc": _now(),
    }, path)
    return True


def record_query_rename(old_query_id: str, new_query_id: str, preserved_count,
                        reason: str, path: Path = GOVERNANCE_AUDIT_PATH) -> bool:
    if _has_event(load_governance_events(path), event_type="query_id_rename", old_query_id=old_query_id):
        return False
    append_governance_event({
        "event_type": "query_id_rename",
        "old_query_id": old_query_id,
        "new_query_id": new_query_id,
        "preserved_count": preserved_count,
        "reason": reason,
        "note": "Canonical governance record; the original historical entry is "
                "preserved in cost_audit.jsonl for continuity.",
        "recorded_at_utc": _now(),
    }, path)
    return True


def record_approval_invalidation(query_id: str, reason: str,
                                 path: Path = GOVERNANCE_AUDIT_PATH) -> bool:
    if _has_event(load_governance_events(path), event_type="approval_invalidation", query_id=query_id):
        return False
    append_governance_event({
        "event_type": "approval_invalidation",
        "query_id": query_id,
        "reason": reason,
        "recorded_at_utc": _now(),
    }, path)
    return True


def record_canonical_schema_migration(
    query_id: str,
    old_schema_version: int,
    new_schema_version: int,
    old_fingerprint: str,
    decision_reset_to: str,
    path: Path = GOVERNANCE_AUDIT_PATH,
) -> bool:
    if _has_event(load_governance_events(path),
                  event_type="canonical_request_schema_migration", query_id=query_id):
        return False
    append_governance_event({
        "event_type": "canonical_request_schema_migration",
        "query_id": query_id,
        "old_schema_version": old_schema_version,
        "new_schema_version": new_schema_version,
        "old_fingerprint": old_fingerprint,
        "old_fingerprint_invalidated": True,
        "decision_reset_to": decision_reset_to,
        "migrated_at_utc": _now(),
    }, path)
    return True


def record_cached_result_migration(old_query_id: str, new_query_id: str, preserved_count,
                                   path: Path = GOVERNANCE_AUDIT_PATH) -> bool:
    key = f"{old_query_id}->{new_query_id}"
    if _has_event(load_governance_events(path), event_type="cached_result_migration", migration=key):
        return False
    append_governance_event({
        "event_type": "cached_result_migration",
        "migration": key,
        "old_query_id": old_query_id,
        "new_query_id": new_query_id,
        "preserved_count": preserved_count,
        "recorded_at_utc": _now(),
    }, path)
    return True

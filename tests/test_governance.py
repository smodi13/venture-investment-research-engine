"""Governance audit trail + config separation."""

from __future__ import annotations

from sourcing import governance
from sourcing.analysis import load_query_analysis, volume_label
from sourcing.pricing import load_pricing


def test_volume_bands_live_in_query_analysis_not_pricing():
    # Thresholds moved OUT of pricing into query_analysis config.
    assert "volume_bands" in load_query_analysis()
    assert "volume_bands" not in load_pricing()
    # Behaviour is unchanged after the move.
    assert volume_label(4) == "very_low"
    assert volume_label(186) == "manageable"


def test_governance_log_is_append_only_and_typed(tmp_path):
    path = tmp_path / "governance_audit.jsonl"
    assert governance.record_config_migration(
        "x_moved", "config/a.yaml", "config/b.yaml", "reason", path=path
    ) is True
    # Idempotent: second call does not duplicate.
    assert governance.record_config_migration(
        "x_moved", "config/a.yaml", "config/b.yaml", "reason", path=path
    ) is False

    assert governance.record_query_rename("old_id", "new_id", 4, "reason", path=path) is True
    assert governance.record_approval_invalidation("old_id", "reason", path=path) is True
    assert governance.record_cached_result_migration("old_id", "new_id", 4, path=path) is True

    events = governance.load_governance_events(path)
    types = {e["event_type"] for e in events}
    assert types == {
        "configuration_migration",
        "query_id_rename",
        "approval_invalidation",
        "cached_result_migration",
    }
    # Appending more never rewrites earlier events.
    governance.record_approval_invalidation("another_id", "reason", path=path)
    assert len(governance.load_governance_events(path)) == len(events) + 1

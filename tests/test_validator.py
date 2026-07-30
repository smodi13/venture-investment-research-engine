"""Query validator tests — enforces the recent-search v2 contract."""

from __future__ import annotations

import pytest

from sourcing.validator import (
    MAX_QUERY_CHARS,
    QueryValidationError,
    validate_and_announce,
    validate_query,
)


def test_rejects_min_faves():
    r = validate_query('("AI agent") min_faves:100')
    assert r.ok is False
    assert any("min_faves:" in e for e in r.errors)


def test_rejects_min_replies():
    r = validate_query('("AI agent") min_replies:10')
    assert r.ok is False
    assert any("min_replies:" in e for e in r.errors)


def test_rejects_min_retweets():
    r = validate_query('("AI agent") min_retweets:5')
    assert r.ok is False
    assert any("min_retweets:" in e for e in r.errors)


def test_warns_on_query_over_512_characters():
    long_q = '("' + ("agent OR " * 80) + 'infra")'
    assert len(long_q) > MAX_QUERY_CHARS
    r = validate_query(long_q)
    assert any("512" in w for w in r.warnings)


def test_rejects_has_links_without_keyword():
    r = validate_query("has:links")
    assert r.ok is False
    assert any("standalone" in e for e in r.errors)


def test_accepts_valid_recent_search_query():
    q = '("AI agent runtime" OR "MCP server") ("just launched" OR "open sourced") lang:en -is:retweet'
    r = validate_query(q)
    assert r.ok is True
    assert r.errors == []


def test_has_links_paired_with_keyword_is_ok():
    r = validate_query('("AI coding") has:links')
    assert r.ok is True


def test_validate_and_announce_raises_on_error(capsys):
    with pytest.raises(QueryValidationError):
        validate_and_announce("min_faves:50", label="bad")
    out = capsys.readouterr().out
    assert "QUERY:" in out  # exact query printed before failing


def test_disallowed_operator_rejected():
    r = validate_query('("AI agent") conversation_id:12345')
    assert r.ok is False

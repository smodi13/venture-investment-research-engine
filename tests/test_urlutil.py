"""t.co URL extraction/normalization regression tests (no network)."""

from __future__ import annotations

import json
from pathlib import Path

from sourcing.urlutil import (
    build_url_info,
    github_owner_repo,
    is_product_domain,
    normalize_url,
    normalized_domain,
    select_canonical_url,
)
from sourcing.x_client import parse_post
from sourcing.filters import extract
from sourcing.models import RawPost

FIXTURE = Path("tests/fixtures/live_schema_canary.json")


# --- selection priority ----------------------------------------------------
def test_unwound_preferred_over_expanded():
    e = {"url": "https://t.co/x", "expanded_url": "https://exp.com/a", "unwound_url": "https://real.com/b"}
    assert select_canonical_url(e) == "https://real.com/b"
    assert build_url_info(e)["normalized_domain"] == "real.com"


def test_expanded_preferred_over_url():
    e = {"url": "https://t.co/x", "expanded_url": "https://exp.com/a"}
    assert select_canonical_url(e) == "https://exp.com/a"


def test_fallback_to_url():
    e = {"url": "https://acme.ai/thing"}  # only url, non-shortener
    info = build_url_info(e)
    assert info["selected_canonical_url"] == "https://acme.ai/thing"
    assert info["url_resolution_status"] == "resolved"


def test_unresolved_tco_shortener():
    e = {"url": "https://t.co/abc123"}  # only t.co, no expansion
    info = build_url_info(e)
    assert info["url_resolution_status"] == "unresolved_shortener"
    assert info["is_product_domain"] is False
    # original short url preserved, never discarded
    assert info["original_short_url"] == "https://t.co/abc123"


# --- normalization ---------------------------------------------------------
def test_github_owner_repo_extraction():
    assert github_owner_repo("https://github.com/nrkoka786/synapse") == "nrkoka786/synapse"
    assert github_owner_repo("https://github.com/OnlyOwner") == "OnlyOwner"
    assert github_owner_repo("https://acme.ai/x") is None


def test_tracking_parameter_removal():
    u = "https://acme.ai/p?utm_source=x&utm_medium=y&fbclid=z&gclid=q&keep=1"
    assert normalize_url(u) == "https://acme.ai/p?keep=1"


def test_www_and_trailing_slash_normalization():
    assert normalize_url("https://www.acme.ai/product/") == "https://acme.ai/product"
    assert normalize_url("https://ACME.ai/") == "https://acme.ai"
    # http/https compare equal by domain
    assert normalized_domain("http://www.acme.ai/x") == normalized_domain("https://acme.ai/x")


def test_no_product_domain_from_x_twitter_tco():
    for host in ("https://x.com/u/status/1/photo/1", "https://twitter.com/u/status/2", "https://t.co/abc"):
        assert is_product_domain(host) is False


def test_original_tco_never_discarded():
    e = {"url": "https://t.co/keepme", "expanded_url": "https://github.com/a/b"}
    info = build_url_info(e)
    assert info["original_short_url"] == "https://t.co/keepme"
    assert info["expanded_url"] == "https://github.com/a/b"


# --- artifact detection via extract() --------------------------------------
def _post_with_entities(entities):
    details = [build_url_info(e) for e in entities]
    return RawPost(
        id="p1", text="just launched our AI agent runtime", author_id="a1",
        url_details=details,
        expanded_urls=[d["selected_canonical_url"] for d in details if d["selected_canonical_url"]],
    )


def test_multiple_urls_in_one_post():
    post = _post_with_entities([
        {"url": "https://t.co/1", "expanded_url": "https://github.com/acme/agent"},
        {"url": "https://t.co/2", "expanded_url": "https://acme.ai/docs"},
    ])
    ex = extract(post, None)
    types = {a.type.value for a in ex.artifacts}
    assert "github" in types and "docs" in types


def test_duplicate_urls_produce_one_canonical_artifact():
    post = _post_with_entities([
        {"url": "https://t.co/1", "expanded_url": "https://github.com/acme/agent"},
        {"url": "https://t.co/2", "expanded_url": "https://github.com/acme/agent/"},  # dup (trailing slash)
    ])
    ex = extract(post, None)
    gh = [a for a in ex.artifacts if a.type.value == "github"]
    assert len(gh) == 1  # deduplicated to one canonical artifact


def test_xcom_media_link_is_not_a_product_artifact():
    post = _post_with_entities([
        {"url": "https://t.co/9", "expanded_url": "https://x.com/user/status/123/photo/1"},
    ])
    ex = extract(post, None)
    assert ex.artifacts == []          # no Level A artifact from a self-referencing media link
    assert ex.product_domains == []


# --- regression against the saved live-schema fixture ----------------------
def test_live_fixture_github_post_resolves_and_xcom_posts_do_not():
    data = json.loads(FIXTURE.read_text())["data"]
    by_id = {t["id"]: parse_post(t) for t in data}

    gh_post = by_id["2078687429293129950"]  # has github + HN links
    domains = {d["normalized_domain"] for d in gh_post.url_details}
    assert "github.com" in domains
    ex = extract(gh_post, None)
    assert any(a.type.value == "github" for a in ex.artifacts)

    xcom_post = by_id["2078688196926316737"]  # only x.com photo expansion
    assert all(d["is_product_domain"] is False for d in xcom_post.url_details)
    assert extract(xcom_post, None).artifacts == []

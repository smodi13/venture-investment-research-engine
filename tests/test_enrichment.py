"""Targeted author-enrichment preparation: canonical request, validation, parsing.

All zero-network. No live API calls."""

from __future__ import annotations

import dataclasses
from decimal import Decimal

import pytest

from sourcing import enrichment as E
from sourcing.enrichment import (
    APPROVED_AUTHOR_IDS,
    CANDIDATES,
    EnrichmentValidationError,
    REQUESTED_USER_FIELDS,
    account_type,
    build_enrichment_request,
    candidate_project_match,
    classify_profile_url_role,
    enrichment_disposition,
    extract_profile,
    founder_or_builder_signal,
    validate_enrichment_request,
)


def _user(**kw):
    base = {"id": "1", "name": "", "username": "", "description": "",
            "entities": {}, "protected": False,
            "public_metrics": {"followers_count": 0, "following_count": 0,
                               "tweet_count": 0, "listed_count": 0}}
    base.update(kw)
    return base


def _url_entity(**kw):
    return kw


# --- canonical request / validation (1-14, 45-52) --------------------------
def test_1_exact_three_author_set_accepted():
    req = build_enrichment_request()
    assert list(req.author_ids) == sorted(APPROVED_AUTHOR_IDS)


def test_2_fourth_author_rejected():
    with pytest.raises(EnrichmentValidationError):
        build_enrichment_request(APPROVED_AUTHOR_IDS + ["999"])


def test_3_missing_author_rejected():
    with pytest.raises(EnrichmentValidationError):
        build_enrichment_request(APPROVED_AUTHOR_IDS[:2])


def test_4_author_order_does_not_change_fingerprint():
    a = build_enrichment_request(APPROVED_AUTHOR_IDS)
    b = build_enrichment_request(list(reversed(APPROVED_AUTHOR_IDS)))
    assert a.fingerprint() == b.fingerprint()


def test_5_changed_user_field_changes_fingerprint():
    a = build_enrichment_request()
    b = dataclasses.replace(a, requested_user_fields=tuple(sorted(list(REQUESTED_USER_FIELDS) + ["z"])))
    assert a.fingerprint() != b.fingerprint()


def test_6_7_8_expansion_pagination_second_request_rejected():
    a = build_enrichment_request()
    for bad in (dataclasses.replace(a, expansions="pinned_tweet_id"),
                dataclasses.replace(a, pagination=True),
                dataclasses.replace(a, max_http_requests=2)):
        with pytest.raises(EnrichmentValidationError):
            validate_enrichment_request(bad)


def test_9_10_cost_and_budget_bounds():
    a = build_enrichment_request()
    with pytest.raises(EnrichmentValidationError):
        validate_enrichment_request(dataclasses.replace(a, expected_max_cost_usd="0.031"))
    with pytest.raises(EnrichmentValidationError):
        validate_enrichment_request(dataclasses.replace(a, global_enrichment_budget_usd="0.041"))


def test_13_pinned_captured_not_expanded_and_14_no_post_fields():
    req = build_enrichment_request()
    assert "pinned_tweet_id" in req.requested_user_fields   # captured as metadata
    assert req.expansions == "none"                          # NOT expanded
    post_fields = {"created_at", "text", "public_metrics", "entities", "referenced_tweets"}
    # no Post-only expansions; the only overlap names are user fields, not post fields
    assert "tweet.fields" not in req.canonical_dict()


def test_45_profile_image_not_requested_46_affiliation_unexpanded():
    req = build_enrichment_request()
    assert "profile_image_url" not in req.requested_user_fields
    assert req.affiliation_included is False
    assert "affiliation" not in req.requested_user_fields
    assert E.AFFILIATION_SUPPORTED is False


def test_50_enrichment_paths_separate_from_canary():
    assert "targeted_enrichment" in str(E.OUTPUT_PATHS["raw_user_response"])
    assert "canary" not in str(E.OUTPUT_PATHS["raw_user_response"])


def test_51_52_no_retry_and_one_request():
    req = build_enrichment_request()
    assert req.network_timeout_retry == "disabled"
    assert req.max_http_requests == 1


# --- profile URL parsing (15-30) ------------------------------------------
def test_15_16_17_18_structured_entities_parsed():
    user = _user(entities={
        "url": {"urls": [_url_entity(url="https://t.co/a", expanded_url="https://acme.ai")]},
        "description": {
            "urls": [_url_entity(url="https://t.co/b", expanded_url="https://github.com/nrkoka786/synapse")],
            "mentions": [{"username": "NeurainX"}],
            "hashtags": [{"tag": "MCP"}],
        }})
    p = extract_profile(user)
    assert any(u["normalized_domain"] == "acme.ai" for u in p["profile_all_urls"])
    assert any(u["normalized_domain"] == "github.com" for u in p["profile_bio_urls"])
    assert p["profile_mentioned_handles"] == ["NeurainX"]
    assert p["profile_bio_hashtags"] == ["MCP"]


def test_19_20_structured_preferred_regex_fallback():
    struct = _user(entities={"description": {"urls": [_url_entity(url="https://t.co/x", expanded_url="https://acme.ai")],
                                             "mentions": [{"username": "acme"}]}},
                   description="ignore @regexonly and http://regex.dev")
    p = extract_profile(struct)
    assert p["profile_entity_extraction_source"] == "structured_entities"
    assert p["profile_mentioned_handles"] == ["acme"]  # structured, not regex

    regex = _user(entities={"description": {}}, description="follow @handleX at http://tool.dev #ai")
    p2 = extract_profile(regex)
    assert p2["profile_entity_extraction_source"] == "regex_fallback"
    assert "handleX" in p2["profile_mentioned_handles"]


def test_21_22_23_24_url_priority():
    from sourcing.enrichment import _profile_url_info
    # unwound_url preferred
    i1 = _profile_url_info({"url": "https://t.co/x", "expanded_url": "https://exp.com", "unwound_url": "https://unw.com"}, "profile_url", None)
    assert i1["normalized_domain"] == "unw.com"
    # unwound.url object preferred
    i2 = _profile_url_info({"url": "https://t.co/x", "expanded_url": "https://exp.com", "unwound": {"url": "https://deep.com"}}, "profile_url", None)
    assert i2["normalized_domain"] == "deep.com"
    # expanded fallback
    i3 = _profile_url_info({"url": "https://t.co/x", "expanded_url": "https://exp.com"}, "profile_url", None)
    assert i3["normalized_domain"] == "exp.com"
    # raw fallback
    i4 = _profile_url_info({"url": "https://acme.ai/x"}, "profile_url", None)
    assert i4["normalized_domain"] == "acme.ai"


def test_25_unresolved_tco_not_browsed():
    from sourcing.enrichment import _profile_url_info
    i = _profile_url_info({"url": "https://t.co/only"}, "profile_url", None)
    assert i["url_resolution_status"] == "unresolved_shortener"
    assert i["profile_url_role"] == "unknown"


def test_26_27_28_29_30_normalization_and_domains():
    from sourcing.enrichment import _profile_url_info
    i = _profile_url_info({"url": "https://t.co/x", "expanded_url": "https://www.Acme.ai/p/?utm_source=t&k=1"}, "description", None)
    assert i["selected_canonical_url"] == "https://acme.ai/p?k=1"          # www + tracking + trailing
    gh = _profile_url_info({"url": "https://t.co/x", "expanded_url": "https://github.com/Owner/Repo"}, "description", None)
    assert gh["profile_url_role"] == "github"
    from sourcing.urlutil import github_owner_repo
    assert github_owner_repo(gh["selected_canonical_url"]) == "Owner/Repo"
    for host in ("https://x.com/u", "https://twitter.com/u", "https://t.co/z"):
        assert classify_profile_url_role(host) == "social_profile"


# --- URL/mention alone does not confirm ownership (31-36) ------------------
def test_31_32_33_aggregator_personal_profile_url_not_ownership():
    assert classify_profile_url_role("https://linktr.ee/someone") == "link_aggregator"
    assert classify_profile_url_role("https://acme.ai") in ("company_site", "candidate_product")
    cand = CANDIDATES["2063311066294054912"]
    user = _user(description="AI enthusiast", url="https://linktr.ee/x",
                 entities={"url": {"urls": [_url_entity(url="https://t.co/x", expanded_url="https://linktr.ee/x")]}})
    p = extract_profile(user, cand)
    m = candidate_project_match(user, p, cand)
    assert m["match"] in ("unsupported", "unclear")   # aggregator link alone != ownership


def test_34_35_36_mention_username_name_alone_not_ownership():
    cand = CANDIDATES["2061874923639836672"]   # Comfy MCP, handle NeurainX
    # username matches candidate handle but NO ownership phrase / project name
    user = _user(username="NeurainX", description="posting cool stuff")
    p = extract_profile(user, cand)
    m = candidate_project_match(user, p, cand)
    assert m["match"] != "confirmed"   # handle alone is not confirmation


# --- candidate match levels (37-41) ---------------------------------------
def test_37_confirmed_name_plus_second_signal():
    cand = CANDIDATES["2063311066294054912"]
    user = _user(name="Nikhil", username="nrkoka786",
                 description="Building Synapse, a local codebase indexer",
                 entities={"url": {"urls": [_url_entity(url="https://t.co/x", expanded_url="https://github.com/nrkoka786/synapse")]}})
    p = extract_profile(user, cand)
    m = candidate_project_match(user, p, cand)
    assert m["match"] == "confirmed"
    assert "CANDIDATE_MATCH_CONFIRMED" in m["reason_codes"]


def test_38_likely_single_signal():
    cand = CANDIDATES["15963134"]   # AOS
    # Names the project but NO ownership/builder phrase and no second signal.
    user = _user(description="AOS — an operating system for autonomous AI.")
    p = extract_profile(user, cand)
    m = candidate_project_match(user, p, cand)
    assert m["match"] == "likely"


def test_39_generic_bio_is_unclear_and_unrelated_role_is_unsupported():
    cand = CANDIDATES["15963134"]
    # generic/vague bio -> unclear (not unsupported)
    generic = _user(description="thoughts on AI and coffee")
    assert candidate_project_match(generic, extract_profile(generic, cand), cand)["match"] == "unclear"
    # explicit unrelated role/org -> unsupported
    unrelated = _user(description="CTO at BigUnrelatedCorp. Opinions my own.")
    assert candidate_project_match(unrelated, extract_profile(unrelated, cand), cand)["match"] == "unsupported"


def test_40_contradicted_conflicting_employer():
    cand = CANDIDATES["2063311066294054912"]   # Synapse
    user = _user(description="Senior Engineer at Microsoft. Opinions my own.")
    m = candidate_project_match(user, extract_profile(user, cand), cand)
    assert m["match"] == "contradicted"


def test_41_unclear_empty_profile():
    cand = CANDIDATES["15963134"]
    user = _user(description="")
    m = candidate_project_match(user, extract_profile(user, cand), cand)
    assert m["match"] == "unclear"


# --- non-influence of vanity metrics (42-44) ------------------------------
def test_42_43_44_metrics_do_not_affect_classification():
    cand = CANDIDATES["15963134"]
    lo = _user(description="Building AOS", public_metrics={"followers_count": 1}, verified=False)
    hi = _user(description="Building AOS", public_metrics={"followers_count": 999999}, verified=True,
               created_at="2007-01-01T00:00:00Z")
    assert candidate_project_match(lo, extract_profile(lo, cand), cand)["match"] == \
        candidate_project_match(hi, extract_profile(hi, cand), cand)["match"]


# --- account type / founder signal ----------------------------------------
def test_account_type_and_founder_signal():
    assert account_type("Founder of Synapse")[0] == "individual"
    assert account_type("Official account for Acme")[0] == "company"
    assert account_type("Open-source project")[0] == "project"
    assert account_type("")[0] == "unclear"
    assert founder_or_builder_signal("Co-founder & CEO")[0] == "explicit_cofounder"
    assert founder_or_builder_signal("Founder")[0] == "explicit_founder"
    assert founder_or_builder_signal("Building things")[0] == "explicit_builder"
    assert founder_or_builder_signal("")[0] == "unclear"


# --- disposition rules -----------------------------------------------------
def test_disposition_advance_and_archive_paths():
    cand = CANDIDATES["2063311066294054912"]
    u = _user(name="N", username="nrkoka786", description="Founder, building Synapse",
              entities={"url": {"urls": [_url_entity(url="https://t.co/x", expanded_url="https://github.com/nrkoka786/synapse")]}})
    p = extract_profile(u, cand)
    m = candidate_project_match(u, p, cand)
    fs = founder_or_builder_signal(u["description"])[0]
    d = enrichment_disposition(u, m, fs, m["evidence"].get("established_org_tie", False))
    assert d["enrichment_disposition"] == "advance_for_diligence"

    # contradicted -> archive_contradicted_ownership
    u2 = _user(description="Engineer at Microsoft")
    m2 = candidate_project_match(u2, extract_profile(u2, cand), cand)
    d2 = enrichment_disposition(u2, m2, "explicit_employee", False)
    assert d2["enrichment_disposition"] == "archive_contradicted_ownership"


# --- partial / empty / error response handling (47-49) --------------------
def test_47_48_49_response_handling_shapes():
    from sourcing.runstate import interpret_response
    # partial: 2 users + errors
    r = interpret_response(200, {"data": [{"id": "1"}, {"id": "2"}], "errors": [{"title": "Not Found"}]})
    assert r["run_status"] == "partial_api_success"
    assert len(r["errors"]) == 1
    # empty: no users
    assert interpret_response(200, {"data": []})["run_status"] == "success_zero_results"
    # error array preserved on client error
    ce = interpret_response(403, {"errors": [{"title": "Forbidden"}]})
    assert ce["run_status"] == "client_error" and len(ce["errors"]) == 1

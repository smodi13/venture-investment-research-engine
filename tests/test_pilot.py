"""Six-query pilot: canonical request, validation, dedup/provenance, metrics.

All zero-network."""

from __future__ import annotations

import dataclasses
import json
from decimal import Decimal
from pathlib import Path

import pytest

from sourcing import pilot as P
from sourcing.pilot import (
    APPROVED_QUERY_IDS, MAX_TOTAL_POSTS, PilotValidationError,
    build_pilot_request, compute_pilot_metrics, dedup_with_provenance,
    pilot_expected_cost, pilot_post_budget, validate_pilot_request,
)


def _raw(pid, author="a", text="just launched our AI agent runtime https://github.com/acme/agent",
         urls=None):
    ents = {"urls": [{"url": "https://t.co/x", "expanded_url": u} for u in (urls or [])]}
    return {"id": pid, "text": text, "author_id": author, "entities": ents,
            "created_at": "2026-07-19T00:00:00.000Z", "public_metrics": {}}


# --- canonical request / validation ---------------------------------------
def test_exactly_six_queries_and_texts_match():
    req = build_pilot_request()
    assert sorted(req.query_ids) == sorted(APPROVED_QUERY_IDS)
    assert len(req.queries) == 6


def test_altered_or_seventh_query_rejected():
    req = build_pilot_request()
    bad_text = dataclasses.replace(req, queries=tuple([("q1_artifact_infra", "CHANGED")] + list(req.queries[1:])))
    with pytest.raises(PilotValidationError):
        validate_pilot_request(bad_text)
    seventh = dataclasses.replace(req, query_ids=tuple(list(req.query_ids) + ["q7"]))
    with pytest.raises(PilotValidationError):
        validate_pilot_request(seventh)


def test_limits_rejected():
    req = build_pilot_request()
    for bad in (dataclasses.replace(req, max_results_per_query=51),
                dataclasses.replace(req, max_total_posts=301),
                dataclasses.replace(req, max_http_requests=7),
                dataclasses.replace(req, pagination=True),
                dataclasses.replace(req, expansions="author_id"),
                dataclasses.replace(req, user_fields="description"),
                dataclasses.replace(req, max_expected_cost_usd="1.501"),
                dataclasses.replace(req, global_pilot_post_budget_usd="1.601")):
        with pytest.raises(PilotValidationError):
            validate_pilot_request(bad)


def test_decimal_cost_and_budget():
    assert pilot_expected_cost() == Decimal("1.500")   # 300 * 0.005
    assert pilot_post_budget() == Decimal("1.600")


def test_query_order_does_not_change_fingerprint_but_text_does():
    a = build_pilot_request()
    b = dataclasses.replace(a, query_ids=tuple(reversed(a.query_ids)),
                            queries=tuple(reversed(a.queries)))
    assert a.fingerprint() == b.fingerprint()          # order-independent
    c = dataclasses.replace(a, queries=tuple([("q1_artifact_infra", "X")] + list(a.queries[1:])))
    assert a.fingerprint() != c.fingerprint()          # changed literal text


# --- dedup + provenance ----------------------------------------------------
def test_duplicate_post_ids_deduped_with_provenance():
    posts_by_query = {
        "q1_artifact_infra": [_raw("100"), _raw("101")],
        "q2_artifact_devtools": [_raw("100")],           # duplicate across queries
    }
    unique, prov, dup = dedup_with_provenance(posts_by_query)
    assert len(unique) == 2 and dup == 1
    assert sorted(prov["100"]) == ["q1_artifact_infra", "q2_artifact_devtools"]  # provenance preserved


# --- metrics ---------------------------------------------------------------
def test_metrics_and_per_query_and_rates():
    posts_by_query = {
        "q1_artifact_infra": [_raw("100", urls=["https://github.com/acme/agent"])],
        "q2_artifact_devtools": [_raw("100", urls=["https://github.com/acme/agent"]),  # dup
                                 _raw("200", text="Reuters just launched an MCP server")],
    }
    m = compute_pilot_metrics(posts_by_query)
    ov = m["overall"]
    assert ov["posts_returned"] == 3 and ov["unique_post_ids"] == 2
    assert ov["duplicate_posts_across_queries"] == 1
    assert ov["duplicate_rate"]["value"] == round(1 / 3, 4)
    assert "q1_artifact_infra" in m["per_query"] and "q2_artifact_devtools" in m["per_query"]
    # provenance retained on the deduped post
    p100 = next(p for p in m["per_post"] if p["id"] == "100")
    assert sorted(p100["surfaced_by_queries"]) == ["q1_artifact_infra", "q2_artifact_devtools"]


def test_zero_denominator_rate_is_null_with_explanation():
    m = compute_pilot_metrics({q: [] for q in APPROVED_QUERY_IDS})
    ov = m["overall"]
    assert ov["unique_post_ids"] == 0
    assert ov["verified_artifact_rate"]["value"] is None
    assert "zero" in ov["verified_artifact_rate"]["explanation"]
    assert ov["estimated_cost_per_actionable_lead_usd"] is None
    assert ov["cost_per_actionable_lead_note"]


# --- integrity: existing outputs untouched --------------------------------
def test_existing_canary_and_enrichment_outputs_present_and_separate():
    assert Path("data/output/canary/raw_response.json").exists()
    assert Path("data/output/targeted_enrichment/raw_user_response.json").exists()
    assert "six_query_pilot" in str(P.OUTPUT_PATHS["parsed_posts"])
    assert "canary" not in str(P.OUTPUT_PATHS["parsed_posts"])

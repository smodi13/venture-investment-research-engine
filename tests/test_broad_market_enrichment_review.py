"""Decision-value profile-enrichment selection review. Zero-network."""

from __future__ import annotations

import hashlib
import json
from decimal import Decimal
from pathlib import Path

import pytest

from sourcing import broad_market_enrichment_review as ER
from sourcing.broad_market_process import PRIOR_ENRICHED_AUTHOR_IDS
from sourcing.money import parse_money


@pytest.fixture(scope="module")
def review():
    return ER.build_review()


def test_keep_verified_eligible_for_review(review):
    assert any(c["current_disposition"] == "keep_verified" for c in review["considered"])


def test_keep_for_enrichment_eligible(review):
    assert any(c["current_disposition"] == "keep_for_enrichment" for c in review["considered"])


def test_selected_manual_review_requires_material_identity_question(review):
    mr = [c for c in review["revised"] if c["current_disposition"] == "manual_review"]
    for c in mr:
        # material = unresolved identity component contributed points
        assert c["score_components"]["unresolved_identity"] > 0 or c["score_components"]["verified_artifact_unclear_team"] > 0
        assert c["expected_decision_impact"] == "could_advance_or_archive"


def test_previously_enriched_excluded_from_revised(review):
    ids = {c["author_id"] for c in review["revised"]}
    assert not (ids & PRIOR_ENRICHED_AUTHOR_IDS)


def test_third_party_and_commentary_excluded(review):
    # no archived-attribution author should ever be recommended enrich
    for c in review["considered"]:
        if c["current_disposition"] in ("archive_third_party", "archive_commentary"):
            assert c["recommended_action"] == "exclude"
    # and the candidate pool only draws from keep_*/manual_review
    assert all(c["current_disposition"] in ("keep_verified", "keep_for_enrichment", "manual_review")
               for c in review["considered"])


def test_selection_not_auto_filled_to_30(review):
    assert len(review["revised"]) < 30
    assert len(review["revised"]) == review["cost"]["selected_profiles"]


def test_revised_set_is_a_mix(review):
    mix = review["mix"]
    assert mix.get("keep_for_enrichment", 0) > 0
    assert len(mix) >= 2      # more than one disposition type


def test_actual_project_spend_used(review):
    c = review["cost"]
    assert c["total_before_enrichment_usd"] == "7.580"
    assert ER.TOTAL_BEFORE_ENRICHMENT_USD == Decimal("7.580")
    # computed spend figures must use actual resources, never the 21.485 max-auth projection
    for k in ("total_before_enrichment_usd", "estimated_total_after_enrichment_usd",
              "remaining_estimated_credit_usd"):
        assert parse_money(c[k]) != Decimal("21.485")
    assert parse_money(c["estimated_total_after_enrichment_usd"]) < Decimal("8.000")


def test_profile_cost_is_one_cent(review):
    assert review["cost"]["profile_cost_usd"] == "0.010"
    n = review["cost"]["selected_profiles"]
    assert parse_money(review["cost"]["expected_enrichment_cost_usd"]) == Decimal("0.010") * n


def test_cost_math_and_remaining_balance(review):
    c = review["cost"]
    total = parse_money(c["total_before_enrichment_usd"]) + parse_money(c["expected_enrichment_cost_usd"])
    assert parse_money(c["estimated_total_after_enrichment_usd"]) == total
    assert parse_money(c["remaining_estimated_credit_usd"]) == Decimal("25.000") - total


def test_no_network_client_constructed(monkeypatch):
    import sourcing.x_client as xc
    monkeypatch.setattr(xc.XClient, "__init__",
                        lambda *a, **k: (_ for _ in ()).throw(AssertionError("no network in review")))
    r = ER.build_review()          # reads saved files only
    assert len(r["considered"]) > 0


def test_prior_processed_outputs_unchanged(tmp_path):
    watch = ["all_processed_records.json", "overall_venture_shortlist.json",
             "combined_comparison_set.json", "proposed_profile_enrichment.json",
             "keep_verified.json", "global_metrics.json"]
    before = {f: hashlib.sha256((ER.PROCESSED_DIR / f).read_bytes()).hexdigest() for f in watch}
    ER.write_review(ER.build_review())     # writes only the two review files
    after = {f: hashlib.sha256((ER.PROCESSED_DIR / f).read_bytes()).hexdigest() for f in watch}
    assert before == after


def test_no_enrichment_request_built_or_approved():
    ER.write_review(ER.build_review())
    out = json.loads((ER.PROCESSED_DIR / "profile_enrichment_selection_review.json").read_text())
    assert out["enrichment_request_built"] is False
    assert out["enrichment_request_approved"] is False
    assert out["network_calls"] == 0 and out["user_profiles_retrieved"] == 0
    # no broad-enrichment decision/lock artifacts exist
    assert not Path("config/broad_enrichment_decisions.yaml").exists()
    assert not Path("data/state/broad_enrichment_execution_locks").exists()


def test_prior_comparison_candidates_mostly_already_enriched(review):
    rows = review["prior_rows"]
    enriched = [p for p in rows if p["already_enriched"]]
    assert len(enriched) == 9          # all resolvable prior candidates are enriched
    mit = [p for p in rows if p["name"] == "Mitsumono"][0]
    assert mit["author_id"] is None and mit["recommended_action"] == "hold"


def test_non_venture_posts_excluded_from_enrichment(review):
    # crypto-token / military / charity / news / marketplace posts must never be
    # recommended for enrichment even if they carry a direct-builder verb.
    for c in review["revised"]:
        assert not ER._non_venture_signal({"text": c["post_text"]}), c["author_id"]


def test_non_venture_signal_detects_examples():
    assert ER._non_venture_signal({"text": "we launched the PERS Treasury token with locked tokenomics"})
    assert ER._non_venture_signal({"text": "we launched missile & drone strikes (IRGC Op. Nasr)"})
    assert not ER._non_venture_signal({"text": "we launched an MCP server for agent orchestration"})


def test_compact_decision_table_capped(review):
    tbl = ER.compact_decision_table(review, limit=40)
    assert len(tbl) <= 40
    # comparison candidates sort first
    assert tbl[0]["in_comparison"] is True

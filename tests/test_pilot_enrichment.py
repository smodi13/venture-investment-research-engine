"""Pilot-shortlist author enrichment: request, validation, approval/lock. Zero-network."""

from __future__ import annotations

import dataclasses
import json
from decimal import Decimal
from pathlib import Path

import pytest

from sourcing import pilot_enrichment as PE
from sourcing import pilot_enrichment_run as PER
from sourcing.pilot_enrichment import (
    EXCLUDED_MARGINAL, PREVIOUSLY_ENRICHED, SELECTED_AUTHOR_IDS, MAX_EXPECTED_USERS,
    PilotEnrichmentValidationError, build_pilot_enrichment_request, expected_max_cost,
    pilot_enrichment_budget, validate_pilot_enrichment_request,
)

EXPECTED_EIGHT = sorted([
    "1581663006328778753", "1728811697035677696", "176285260", "1858065635223261184",
    "1984220819657285632", "2065358674076319746", "2068381226306822144", "2068596121732055041",
])


def test_exactly_eight_sorted_unique_new_authors():
    req = build_pilot_enrichment_request()
    assert len(req.author_ids) == 8
    assert MAX_EXPECTED_USERS == 8
    assert list(req.author_ids) == EXPECTED_EIGHT
    assert list(req.author_ids) == sorted(set(req.author_ids))
    assert not (set(req.author_ids) & PREVIOUSLY_ENRICHED)      # none previously enriched


def test_two_marginal_authors_excluded_no_replacements():
    ids = set(SELECTED_AUTHOR_IDS)
    assert "1842770165873979392" in EXCLUDED_MARGINAL and "2050456733437534208" in EXCLUDED_MARGINAL
    assert not (ids & set(EXCLUDED_MARGINAL))                   # marginals not in the set
    assert len(ids) == 8                                        # no replacements added
    with pytest.raises(PilotEnrichmentValidationError):
        build_pilot_enrichment_request(list(EXPECTED_EIGHT[:7]) + ["1842770165873979392"])


def test_previously_enriched_and_duplicates_rejected():
    with pytest.raises(PilotEnrichmentValidationError):
        build_pilot_enrichment_request(EXPECTED_EIGHT[:7] + ["15963134"])  # enriched
    with pytest.raises(PilotEnrichmentValidationError):
        build_pilot_enrichment_request(EXPECTED_EIGHT[:7] + [EXPECTED_EIGHT[0]])  # dup


def test_more_than_eight_rejected():
    with pytest.raises(PilotEnrichmentValidationError):
        build_pilot_enrichment_request(EXPECTED_EIGHT + ["999999999"])


def test_limits_rejected():
    req = build_pilot_enrichment_request()
    for bad in (dataclasses.replace(req, expansions="author_id"),
                dataclasses.replace(req, pagination=True),
                dataclasses.replace(req, max_http_requests=2),
                dataclasses.replace(req, affiliation_included=True),
                dataclasses.replace(req, max_expected_cost_usd="0.081"),
                dataclasses.replace(req, global_pilot_enrichment_budget_usd="0.101")):
        with pytest.raises(PilotEnrichmentValidationError):
            validate_pilot_enrichment_request(bad)


def test_decimal_cost_and_budget():
    assert expected_max_cost() == Decimal("0.080")             # 8 * 0.010
    assert pilot_enrichment_budget() == Decimal("0.100")
    assert (pilot_enrichment_budget() - expected_max_cost()) == Decimal("0.020")  # margin


def test_changed_fields_or_authors_change_fingerprint():
    a = build_pilot_enrichment_request()
    b = dataclasses.replace(a, requested_user_fields=tuple(sorted(list(a.requested_user_fields) + ["z"])))
    assert a.fingerprint() != b.fingerprint()
    c = dataclasses.replace(a, author_ids=tuple(sorted(list(a.author_ids)[:9] + ["424242424242"])))
    assert a.fingerprint() != c.fingerprint()
    # order-independent
    d = dataclasses.replace(a, author_ids=tuple(reversed(a.author_ids)))
    assert a.fingerprint() == d.fingerprint()


def test_output_dir_separate_from_prior():
    assert "pilot_shortlist_enrichment" in str(PE.OUTPUT_PATHS["raw_user_response"])
    assert "targeted_enrichment/raw" not in str(PE.OUTPUT_PATHS["raw_user_response"])


# --- approval / lock / execution (stub client, temp dirs) -----------------
USERS = {"data": [{"id": SELECTED_AUTHOR_IDS[0], "name": "A", "username": "yrqx",
                   "description": "Founder, building Adaptive",
                   "entities": {"url": {"urls": [{"url": "https://t.co/x", "expanded_url": "https://github.com/Yrqx-95/adaptive"}]}}}]}


class Stub:
    def __init__(self, resp=USERS, raises=None):
        self.calls, self.resp, self.raises = [], resp, raises
        self.last_response_meta = {}

    def _get(self, path, params, cache_sig=None, retry_context=None):
        self.calls.append(params)
        if self.raises:
            raise self.raises
        return self.resp


@pytest.fixture
def env(tmp_path):
    return {"dp": tmp_path / "dec.yaml", "ld": tmp_path / "locks", "od": tmp_path / "out"}


def _approve(env, now=None):
    return PER.record_approval("Sahil Modi", path=env["dp"], now=now)


def test_no_approval_blocks(env):
    stub = Stub()
    r = PER.execute_pilot_enrichment(client=stub, decision_path=env["dp"], lock_dir=env["ld"], output_dir=env["od"])
    assert r["status"] == "gate_failed" and stub.calls == []


def test_one_time_execution_and_lock_durable(env):
    _approve(env)
    stub = Stub()
    r = PER.execute_pilot_enrichment(client=stub, decision_path=env["dp"], lock_dir=env["ld"], output_dir=env["od"])
    assert r["status"] == "executed" and len(stub.calls) == 1
    # user.fields present, no expansions/pagination in the request
    assert "expansions" not in stub.calls[0] and "user.fields" in stub.calls[0]
    assert (env["od"] / "raw_user_response.json").exists()
    locks = list(env["ld"].glob("*.lock"))
    assert len(locks) == 1
    stub2 = Stub()
    r2 = PER.execute_pilot_enrichment(client=stub2, decision_path=env["dp"], lock_dir=env["ld"], output_dir=env["od"])
    assert r2["status"] in ("gate_failed", "execution_already_consumed") and stub2.calls == []
    assert locks[0].exists()                                   # lock not deleted


def test_expired_and_mismatch_gate(env):
    from datetime import timedelta
    from sourcing.timeutil import now_utc
    _approve(env, now=now_utc() - timedelta(seconds=1000))
    ok, reasons = PER.gate_checks(build_pilot_enrichment_request(), PER.load_decision(env["dp"]))
    assert ok is False and any("expired" in x for x in reasons)


def test_cost_ledger_estimated_only(env):
    _approve(env)
    PER.execute_pilot_enrichment(client=Stub(), decision_path=env["dp"], lock_dir=env["ld"], output_dir=env["od"])
    ledger = json.loads((env["od"] / "enrichment_cost_ledger.json").read_text())
    assert ledger["billing_status"] == "estimated_only"
    assert ledger["observed_console_cost_usd"] is None
    assert ledger["reconciliation_status"] == "unavailable_external_project_access"


# --- prior artifacts untouched --------------------------------------------
def test_prior_outputs_and_locks_untouched():
    assert Path("data/output/canary/raw_response.json").exists()
    assert Path("data/output/targeted_enrichment/raw_user_response.json").exists()
    assert Path("data/output/six_query_pilot/pilot_summary.json").exists()
    # prior enrichment fingerprint still fixed
    from sourcing.enrichment import build_enrichment_request
    from sourcing.enrichment_run import EXPECTED_FINGERPRINT
    assert build_enrichment_request().fingerprint() == EXPECTED_FINGERPRINT

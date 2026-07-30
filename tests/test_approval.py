"""Approval control: request fingerprinting, invalidation, and the fail-closed gate."""

from __future__ import annotations

from sourcing.approval import (
    CanonicalRequest,
    QueryDecision,
    build_canonical_request,
    check_execution_gate,
    load_decisions,
    record_decision,
)
from sourcing.pipeline import QuerySpec, RunConfig


def _req(**overrides) -> CanonicalRequest:
    base = dict(
        query_id="q1",
        query='("AI agent") ("just launched")',
        tweet_fields="created_at,lang,public_metrics,entities,referenced_tweets,author_id",
        expansions="author_id",
        user_fields="description,url,verified,created_at,public_metrics,entities",
        start_time_policy="recent_search_default_7d",
        end_time_policy="now",
        max_results_per_page=100,
        query_config_version="1",
        extra={"paginate": False},
    )
    base.update(overrides)
    return CanonicalRequest(**base)


def _approved_decisions(req: CanonicalRequest) -> dict[str, QueryDecision]:
    return {
        req.query_id: QueryDecision(
            query_id=req.query_id,
            decision="run",
            reviewer="Sahil Modi",
            note="ok",
            reviewed_at_utc="2026-07-18T00:00:00+00:00",
            approved_request_fingerprint=req.fingerprint(),
            query_config_version="1",
        )
    }


# --- fingerprint stability + invalidation ---------------------------------
def test_fingerprint_stable_for_identical_request():
    assert _req().fingerprint() == _req().fingerprint()


def test_invalidated_by_literal_query_text_change():
    base = _req()
    changed = _req(query='("AI agent") ("open sourced")')
    assert changed.fingerprint() != base.fingerprint()


def test_invalidated_by_added_expansion():
    base = _req(expansions="author_id")
    changed = _req(expansions="author_id,referenced_tweets.id")
    assert changed.fingerprint() != base.fingerprint()


def test_invalidated_by_removed_expansion():
    base = _req(expansions="author_id")
    changed = _req(expansions="")
    assert changed.fingerprint() != base.fingerprint()


def test_invalidated_by_tweet_fields_change():
    base = _req()
    changed = _req(tweet_fields="created_at,author_id")
    assert changed.fingerprint() != base.fingerprint()


def test_invalidated_by_page_size_change():
    base = _req(max_results_per_page=100)
    changed = _req(max_results_per_page=50)
    assert changed.fingerprint() != base.fingerprint()


def test_invalidated_by_query_config_version_change():
    base = _req(query_config_version="1")
    changed = _req(query_config_version="2")
    assert changed.fingerprint() != base.fingerprint()


# --- fail-closed execution gate -------------------------------------------
def test_gate_passes_when_fingerprint_matches_and_budgets_ok():
    req = _req()
    gate = check_execution_gate(req, _approved_decisions(req), global_budget_ok=True)
    assert gate.allowed is True
    assert gate.reasons == []


def test_gate_blocks_when_no_decision():
    req = _req()
    gate = check_execution_gate(req, {}, global_budget_ok=True)
    assert gate.allowed is False
    assert any("no approval decision" in r for r in gate.reasons)


def test_gate_blocks_on_fingerprint_mismatch_even_if_query_text_unchanged():
    req = _req()
    decisions = _approved_decisions(req)
    # Same literal query text, but an added expansion changes the fingerprint.
    changed = _req(expansions="author_id,attachments.media_keys")
    assert changed.query == req.query  # literal text identical
    gate = check_execution_gate(changed, decisions, global_budget_ok=True)
    assert gate.allowed is False
    assert any("fingerprint mismatch" in r for r in gate.reasons)


def test_gate_blocks_on_global_budget():
    req = _req()
    gate = check_execution_gate(req, _approved_decisions(req), global_budget_ok=False)
    assert gate.allowed is False
    assert any("global budget" in r for r in gate.reasons)


def test_gate_blocks_on_op_budget():
    req = _req()
    gate = check_execution_gate(
        req, _approved_decisions(req), global_budget_ok=True, op_budget_ok=False
    )
    assert gate.allowed is False
    assert any("operation-level budget" in r for r in gate.reasons)


def test_gate_blocks_on_stale_pricing():
    req = _req()
    gate = check_execution_gate(
        req, _approved_decisions(req), global_budget_ok=True, pricing_ok=False
    )
    assert gate.allowed is False
    assert any("stale pricing" in r for r in gate.reasons)


def test_revise_and_disable_have_no_runnable_fingerprint():
    req = _req()
    for decision in ("revise", "disable"):
        decisions = {
            req.query_id: QueryDecision(
                query_id=req.query_id,
                decision=decision,
                reviewer="Sahil Modi",
                note="",
                reviewed_at_utc="2026-07-18T00:00:00+00:00",
                approved_request_fingerprint=None,
            )
        }
        gate = check_execution_gate(req, decisions, global_budget_ok=True)
        assert gate.allowed is False


# --- decision store (atomic, preserves others) ----------------------------
def test_record_and_load_roundtrip(tmp_path):
    path = tmp_path / "query_decisions.yaml"
    req = _req()
    rec = QueryDecision(
        query_id="q1", decision="run", reviewer="Sahil Modi", note="n",
        reviewed_at_utc="2026-07-18T00:00:00+00:00",
        approved_request_fingerprint=req.fingerprint(), query_config_version="1",
    )
    record_decision(rec, path=path)
    loaded = load_decisions(path)
    assert loaded["q1"].approved_request_fingerprint == req.fingerprint()


def test_record_preserves_other_queries(tmp_path):
    path = tmp_path / "query_decisions.yaml"
    record_decision(
        QueryDecision("q1", "run", "Sahil Modi", "", "t", approved_request_fingerprint="sha256:a"),
        path=path,
    )
    record_decision(
        QueryDecision("q2", "disable", "Sahil Modi", "", "t"),
        path=path,
    )
    loaded = load_decisions(path)
    assert set(loaded) == {"q1", "q2"}
    assert loaded["q1"].decision == "run"
    assert loaded["q2"].decision == "disable"


# --- build_canonical_request integration ----------------------------------
def test_build_canonical_request_matches_between_approval_and_gate():
    spec = QuerySpec(id="q1", lane="product_artifact", topics=["A"], query='("x") ("just launched")')
    cfg = RunConfig(page_size=100).clamp()
    r1 = build_canonical_request(spec, cfg, config_version=1)
    r2 = build_canonical_request(spec, cfg, config_version=1)
    assert r1.fingerprint() == r2.fingerprint()
    # A different page size must change the fingerprint.
    cfg2 = RunConfig(page_size=50).clamp()
    r3 = build_canonical_request(spec, cfg2, config_version=1)
    assert r3.fingerprint() != r1.fingerprint()

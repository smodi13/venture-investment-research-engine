"""Budget limits, usage estimation, and frozen-cap clamping."""

from __future__ import annotations

from sourcing.pipeline import (
    FROZEN_MAX_POSTS,
    FROZEN_MAX_USERS,
    RunConfig,
    build_query_specs,
    estimate_usage,
)


def test_estimate_no_network_and_within_budget_when_unset():
    cfg = RunConfig().clamp()
    est = estimate_usage(cfg)
    assert est.est_posts_read > 0
    assert est.within_budget is True  # no explicit limit => never blocks


def test_budget_exceeded_flag():
    cfg = RunConfig(budget_limit=10).clamp()
    est = estimate_usage(cfg)
    assert est.est_posts_read > 10
    assert est.within_budget is False


def test_budget_respected_when_generous():
    cfg = RunConfig(budget_limit=100000).clamp()
    est = estimate_usage(cfg)
    assert est.within_budget is True


def test_frozen_caps_clamp():
    cfg = RunConfig(max_posts=99999, max_users=99999, max_timelines=99999).clamp()
    assert cfg.max_posts == FROZEN_MAX_POSTS
    assert cfg.max_users == FROZEN_MAX_USERS


def test_query_group_filter_reduces_queries():
    all_q = build_query_specs(None)
    group_a = build_query_specs("A")
    assert len(group_a) <= len(all_q)
    # Every kept query must INCLUDE topic A among its topics.
    assert all("A" in spec.topics for spec in group_a)


def test_curated_query_budget_is_capped():
    # Mandate: start with no more than six queries total.
    assert len(build_query_specs(None)) <= 6


def test_llm_calls_zero_when_disabled():
    cfg = RunConfig(use_llm=False).clamp()
    est = estimate_usage(cfg)
    assert est.llm_calls == 0

"""End-to-end pipeline run against a fake client (no network, no LLM)."""

from __future__ import annotations

from datetime import datetime, timezone

from sourcing.config import Secrets
from sourcing.models import RawPost, RawUser
from sourcing import pipeline as pl
from tests.conftest import make_post, make_user


class FakeClient:
    """Stand-in for XClient returning canned data; no network."""

    def __init__(self, *_a, **_k):
        self.api_calls = 0
        self._posts = [
            make_post(
                "100",
                "Launched Acme, our AI code review agent. First customer in production. "
                "Deep integration + proprietary data flywheel. https://acme.ai/docs",
                author_id="u1",
                urls=["https://github.com/acme/agent", "https://acme.ai/docs"],
                query_groups=["B"],
            ),
            make_post(
                "101",
                "Acme changelog: now supports SAML https://acme.ai/changelog",
                author_id="u1",
                urls=["https://acme.ai/changelog"],
                query_groups=["B"],
            ),
            make_post(
                "200",
                "Building in stealth: an AI agent runtime with sandboxing + MCP. Ex-infra lead. WIP.",
                author_id="u2",
                query_groups=["A"],
            ),
            make_post(
                "300",
                "Our software agency builds MVPs for you. Book a consultation!",
                author_id="u3",
                query_groups=["C"],
            ),
        ]
        self._users = {
            "u1": make_user("u1", "acme_alice", description="Founder building AI dev tools, ex-Datadog", followers=800),
            "u2": make_user("u2", "stealth_sam", description="Founder, previously staff eng on agent infrastructure", followers=120),
            "u3": make_user("u3", "agencyacct", description="We build apps for you", followers=50),
        }

    def search_recent(self, query, *, max_results, query_groups=None, paginate=False):
        # Return the canned posts once; dedup by id collapses repeats across queries.
        return self._posts[:max_results]

    def get_users(self, ids):
        return [self._users[i] for i in dict.fromkeys(ids) if i in self._users]

    def get_timeline(self, user_id, *, max_results=10):
        return []


def _approve_all(monkeypatch, tmp_path, cfg):
    """Record matching 'run' approvals for every query so the gate passes."""
    import sourcing.approval as approval
    from sourcing.config import load_queries

    decisions_path = tmp_path / "query_decisions.yaml"
    monkeypatch.setattr(approval, "DECISIONS_PATH", decisions_path)
    config_version = load_queries().get("config_version", 1)
    for spec in pl.build_query_specs(cfg.query_group):
        req = approval.build_canonical_request(spec, cfg, config_version)
        approval.record_decision(
            approval.QueryDecision(
                query_id=spec.id,
                decision="run",
                reviewer="Sahil Modi",
                note="test approval",
                reviewed_at_utc=approval.now_utc_iso(),
                approved_request_fingerprint=req.fingerprint(),
                query_config_version=str(config_version),
            ),
            path=decisions_path,
        )


def test_full_pipeline_writes_outputs(tmp_path, monkeypatch, fake_cache):
    # Redirect outputs to a temp dir and inject the fake client.
    out = tmp_path / "output"
    out.mkdir()
    monkeypatch.setattr(pl, "OUTPUT_DIR", out)
    monkeypatch.setattr("sourcing.x_client.XClient", FakeClient)

    cfg = pl.RunConfig(enrich=False, use_llm=False).clamp()
    _approve_all(monkeypatch, tmp_path, cfg)
    summary = pl.run_pipeline(cfg, Secrets(x_bearer_token="fake"), fake_cache)

    # Files exist.
    for name in ("all_candidates.csv", "top_leads.csv", "top_leads.md", "review.csv", "run_summary.json"):
        assert (out / name).exists(), f"missing {name}"

    # Agency post excluded; Acme + stealth founder survive as companies.
    assert summary["posts_excluded"] >= 1
    assert summary["companies"] >= 2
    assert summary["top_pick"] is not None

    # Acme's two posts aggregated into one company (no duplicate record).
    md = (out / "top_leads.md").read_text()
    assert "Acme" in md
    assert "Disclaimer" in md  # replication disclaimer present
    assert "Platform Absorption Risk" in md

    # review.csv has the manual columns, left blank.
    review = (out / "review.csv").read_text()
    assert "manual_relevant" in review
    assert "would_contact" in review
    assert "false_positive_reason" in review


def test_pipeline_fails_closed_without_approval(tmp_path, monkeypatch, fake_cache):
    """With no approvals recorded, the gate blocks every query — no retrieval."""
    import sourcing.approval as approval

    out = tmp_path / "output"
    out.mkdir()
    monkeypatch.setattr(pl, "OUTPUT_DIR", out)
    monkeypatch.setattr("sourcing.x_client.XClient", FakeClient)
    monkeypatch.setattr(approval, "DECISIONS_PATH", tmp_path / "query_decisions.yaml")

    cfg = pl.RunConfig(enrich=False, use_llm=False).clamp()
    summary = pl.run_pipeline(cfg, Secrets(x_bearer_token="fake"), fake_cache)

    # Every query blocked, zero posts retrieved, no companies.
    assert summary["queries_run"] == 0
    assert len(summary["queries_blocked"]) >= 1
    assert summary["posts_collected"] == 0
    assert summary["companies"] == 0

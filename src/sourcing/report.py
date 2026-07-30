"""Output generation (mandate section 15) + deterministic actionability fields.

Writes:
  data/output/all_candidates.csv
  data/output/top_leads.csv
  data/output/top_leads.md
  data/output/run_summary.json
  data/output/review.csv   (manual, human-completed columns)
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

import pandas as pd

from .models import ArtifactType, Classification, ScoredCompany
from .scoring import CompanyFeatures, extract_features

POST_URL = "https://x.com/i/web/status/{}"


# ---------------------------------------------------------------------------
# Deterministic actionability (top-5) -- mandate section 11
# ---------------------------------------------------------------------------
def _what_it_does(sc: ScoredCompany) -> str:
    if sc.llm_summary:
        return sc.llm_summary
    cats = ", ".join(
        s.description.split(":", 1)[1]
        for s in sc.company.signals
        if s.description.startswith("category:")
    ) or "AI-native software"
    return f"Appears to build in: {cats}."


def add_actionability(sc: ScoredCompany, text: str) -> ScoredCompany:
    company = sc.company
    f = extract_features(company, text)
    cats = ", ".join(sorted(f.categories)) or "the AI-native software space"

    groups = ", ".join(sorted(company.query_groups_matched)) or "n/a"
    sc.why_contact_now = (
        f"Surfaced on query groups {groups} with "
        f"{f.distinct_level_a} Level-A artifact(s) and "
        f"{company.relevant_post_count} relevant post(s); classified "
        f"{sc.classification.value}."
    )
    sc.why_headline = (
        f"Directly in Headline's AI-infra/dev-tools/agentic thesis "
        f"({cats}); {sc.discovery_status.value.lower()} on X."
    )
    route = None
    if company.x_handle:
        route = f"https://x.com/{company.x_handle}"
    elif company.domain:
        route = f"https://{company.domain}"
    sc.public_contact_route = route or "No public contact route found on X."

    if f.has_design_partner:
        sc.suggested_outreach_angle = (
            "They are actively seeking design partners — reference the specific "
            "problem they described and offer a warm intro to a relevant portfolio buyer."
        )
    elif company.is_stealth:
        sc.suggested_outreach_angle = (
            "Stealth builder — lead with genuine interest in the problem space and "
            "the founder's background, not a pitch."
        )
    else:
        sc.suggested_outreach_angle = (
            f"Reference their recent shipping activity in {cats} and ask about "
            "early customer traction."
        )

    # Primary diligence question: prefer the biggest unknown.
    if sc.llm_diligence_questions:
        sc.primary_diligence_question = sc.llm_diligence_questions[0]
    elif f.customer_level_b > 0 and f.customer_level_a == 0:
        sc.primary_diligence_question = (
            "Customer/traction claims are founder-reported (Level B) — can they "
            "share verifiable usage, retention, or references?"
        )
    elif sc.platform_risk and sc.platform_risk.score >= 50:
        absorber = (sc.platform_risk.likely_absorbers or ["an incumbent"])[0]
        sc.primary_diligence_question = (
            f"What prevents {absorber} from absorbing this as a feature?"
        )
    else:
        sc.primary_diligence_question = (
            "What is the proprietary data, integration, or workflow moat that is "
            "not visible from the public product?"
        )
    return sc


# ---------------------------------------------------------------------------
# Flattening for CSV
# ---------------------------------------------------------------------------
def _flat_row(sc: ScoredCompany) -> dict:
    c = sc.company
    pr = sc.platform_risk
    return {
        "company": c.name,
        "canonical_id": c.canonical_id,
        "domain": c.domain or "",
        "x_handle": c.x_handle or "",
        "github_org": c.github_org or "",
        "founder_handles": ";".join(c.founder_handles),
        "total_score": sc.total_score,
        "role_thesis_fit": sc.components.role_thesis_fit,
        "founder_startup_fit": sc.components.founder_startup_fit,
        "product_technical_evidence": sc.components.product_technical_evidence,
        "customer_pull": sc.components.customer_pull,
        "workflow_depth": sc.components.workflow_depth,
        "defensibility": sc.components.defensibility,
        "shipping_momentum": sc.components.shipping_momentum,
        "total_penalty": sc.total_penalty,
        "penalties": ";".join(f"{k}={v}" for k, v in sc.penalties.items()),
        "classification": sc.classification.value,
        "discovery_status": sc.discovery_status.value,
        "platform_absorption_risk": pr.score if pr else "",
        "likely_absorber_category": (pr.likely_absorber_category if pr else "") or "",
        "likely_absorbers": ";".join(pr.likely_absorbers) if pr else "",
        "replication_difficulty": sc.replication.difficulty.value if sc.replication else "",
        "relevant_posts": c.relevant_post_count,
        "query_groups": ";".join(sorted(c.query_groups_matched)),
        "query_lanes": ";".join(sorted(c.query_lanes_matched)),
        "independent_artifacts": c.independent_artifact_count,
        "is_stealth": c.is_stealth,
        # Engagement Signal is NON-scoring ("closer look", not quality).
        "engagement_signal": c.engagement_signal,
        "engagement_normalized": c.engagement_normalized,
        "deserves_closer_look": c.deserves_closer_look,
        "llm_category": sc.llm_category or "",
    }


def write_all_candidates(scored: Iterable[ScoredCompany], path: Path) -> None:
    rows = [_flat_row(sc) for sc in scored]
    pd.DataFrame(rows).to_csv(path, index=False)


def write_top_leads_csv(top: list[ScoredCompany], path: Path) -> None:
    rows = []
    for sc in top:
        row = _flat_row(sc)
        row.update(
            {
                "why_contact_now": sc.why_contact_now or "",
                "why_headline": sc.why_headline or "",
                "public_contact_route": sc.public_contact_route or "",
                "suggested_outreach_angle": sc.suggested_outreach_angle or "",
                "primary_diligence_question": sc.primary_diligence_question or "",
            }
        )
        rows.append(row)
    pd.DataFrame(rows).to_csv(path, index=False)


def write_review_csv(top5: list[ScoredCompany], path: Path) -> None:
    """Manual review file: empty columns are completed BY HAND after review."""
    rows = []
    for sc in top5:
        rows.append(
            {
                "company": sc.company.name,
                "x_handle": sc.company.x_handle or "",
                "classification": sc.classification.value,
                "total_score": sc.total_score,
                "public_contact_route": sc.public_contact_route or "",
                # Human-completed columns (left intentionally blank):
                "manual_relevant": "",
                "would_contact": "",
                "false_positive_reason": "",
                "review_notes": "",
            }
        )
    pd.DataFrame(rows).to_csv(path, index=False)


# ---------------------------------------------------------------------------
# Markdown report
# ---------------------------------------------------------------------------
def _lead_markdown(sc: ScoredCompany, rank: int) -> str:
    c = sc.company
    pr = sc.platform_risk
    lines: list[str] = []
    lines.append(f"## {rank}. {c.name}  —  {sc.total_score}/100")
    lines.append("")
    founder = ", ".join(f"@{h}" for h in c.founder_handles) or "unknown"
    lines.append(f"- **Founder(s):** {founder}")
    lines.append(f"- **Company:** {c.name}")
    lines.append(f"- **X handle:** {('@' + c.x_handle) if c.x_handle else 'unknown'}")
    lines.append(f"- **What it does:** {_what_it_does(sc)}")
    lines.append(
        f"- **Why it surfaced:** query groups "
        f"{', '.join(sorted(c.query_groups_matched)) or 'n/a'}; "
        f"{c.relevant_post_count} relevant post(s), "
        f"{c.independent_artifact_count} independent artifact(s)."
    )
    lines.append("")
    lines.append("### Scores")
    lines.append(f"- Role & Thesis Fit: **{sc.components.role_thesis_fit}/20**")
    lines.append(f"- Founder-Startup Fit: **{sc.components.founder_startup_fit}/15**")
    a_ct = c.independent_artifact_count
    lines.append(
        f"- Product & Technical Evidence: **{sc.components.product_technical_evidence}/20** "
        f"(Level A artifacts: {a_ct})"
    )
    lines.append(
        f"- Customer Pull & Adoption: **{sc.components.customer_pull}/15** "
        f"(founder-reported/Level B claims: {len(c.founder_claims)}, "
        f"third-party/Level C signals: {len(c.third_party_signals)} — "
        f"not presented as proven traction)"
    )
    lines.append(f"- Workflow Depth & Retention: **{sc.components.workflow_depth}/15**")
    lines.append(f"- Defensibility: **{sc.components.defensibility}/10**")
    lines.append(f"- Shipping Momentum: **{sc.components.shipping_momentum}/5**")
    if sc.penalties:
        pen = ", ".join(f"{k} (-{v})" for k, v in sc.penalties.items())
        lines.append(f"- Penalties applied: {pen}")
    lines.append("")
    lines.append("### Defensibility & Platform Risk")
    lines.append(f"- **Defensibility hypothesis (Level D):** {sc.llm_moat_evidence or _defensibility_hypothesis(sc)}")
    if pr:
        absorbers = ", ".join(pr.likely_absorbers) or "n/a"
        lines.append(
            f"- **Platform Absorption Risk:** {pr.score}/100 (higher is worse). "
            f"Most likely absorber category: {pr.likely_absorber_category or 'n/a'} "
            f"→ {absorbers}."
        )
        if sc.llm_platform_risk_explanation:
            lines.append(f"  - {sc.llm_platform_risk_explanation}")
    if sc.replication:
        lines.append(
            f"- **Visible Feature Replication Test:** "
            f"**{sc.replication.difficulty.value}**. {sc.replication.explanation}"
        )
        lines.append(f"  - _Disclaimer:_ {sc.replication.disclaimer}")
    lines.append("")
    lines.append(f"- **Discovery Status (tie-breaker only):** {sc.discovery_status.value}")
    lines.append(
        f"- **Engagement Signal (non-scoring — \"deserves a closer look\", not a "
        f"quality judgement):** {c.engagement_signal} raw / "
        f"{c.engagement_normalized} follower-normalized · "
        f"closer look: {'yes' if c.deserves_closer_look else 'no'}. "
        f"High engagement can also mean criticism, controversy, or spam."
    )
    if sc.reply_classifications:
        counts: dict[str, int] = {}
        for rc in sc.reply_classifications:
            counts[rc.reply_class.value] = counts.get(rc.reply_class.value, 0) + 1
        lines.append(
            "- **Sampled reply/quote mix:** "
            + ", ".join(f"{k}={v}" for k, v in counts.items())
        )
    lines.append(f"- **Recommended classification:** {sc.classification.value}")
    lines.append("")
    if sc.missing_information:
        lines.append("### Missing information (needs a founder conversation)")
        for m in sc.missing_information:
            lines.append(f"- {m}")
        lines.append("")
    lines.append("### Actionability")
    lines.append(f"- **Why contact now:** {sc.why_contact_now or 'n/a'}")
    lines.append(f"- **Why Headline:** {sc.why_headline or 'n/a'}")
    lines.append(f"- **Public contact route:** {sc.public_contact_route or 'n/a'}")
    lines.append(f"- **Suggested outreach angle:** {sc.suggested_outreach_angle or 'n/a'}")
    lines.append(f"- **Primary diligence question:** {sc.primary_diligence_question or 'n/a'}")
    lines.append("")
    lines.append("### Source posts")
    for pid in list(dict.fromkeys(c.post_ids))[:10]:
        lines.append(f"- {POST_URL.format(pid)}")
    lines.append("")
    lines.append("---")
    return "\n".join(lines)


def _defensibility_hypothesis(sc: ScoredCompany) -> str:
    if sc.components.defensibility >= 6:
        return "Moat signals present (data loop and/or deep integrations). Verify depth with founder."
    return (
        "No strong moat visible publicly — defensibility unclear. Treat as a "
        "hypothesis to test, not a conclusion."
    )


def write_top_leads_md(top: list[ScoredCompany], path: Path, run_meta: dict) -> None:
    header = [
        "# Headline — X Sourcing Engine: Top Leads",
        "",
        f"_Generated {run_meta.get('generated_at', '')} · "
        f"{run_meta.get('companies_total', 0)} companies aggregated · "
        f"showing top {len(top)}._",
        "",
        "> Scores are 100% deterministic. Customer/traction claims are labelled by "
        "evidence level and are **not** presented as proven traction.",
        "",
    ]
    body = [_lead_markdown(sc, i + 1) for i, sc in enumerate(top)]
    path.write_text("\n".join(header + body), encoding="utf-8")


def write_run_summary(summary: dict, path: Path) -> None:
    path.write_text(json.dumps(summary, indent=2, default=str), encoding="utf-8")

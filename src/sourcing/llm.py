"""Optional LLM analysis for the strongest candidates (mandate section 13).

The LLM ONLY: summarises what a company does, categorises it, identifies
possible moat evidence, generates diligence questions, and explains platform
risk. It NEVER assigns a numeric score -- all scoring is deterministic Python.

Guarded: requires ``--llm`` and ``ANTHROPIC_API_KEY``. If the SDK or key is
missing, analysis is skipped gracefully.
"""

from __future__ import annotations

import json
import logging
from typing import Optional

from .config import Secrets
from .models import ScoredCompany

log = logging.getLogger(__name__)

# Cost-effective default; summarisation does not need a frontier model.
DEFAULT_MODEL = "claude-haiku-4-5-20251001"
MAX_ANALYSES = 10  # frozen MVP cap

_SYSTEM = (
    "You are a venture sourcing analyst for Headline's AI Infrastructure & "
    "Software seat (AI infra, developer tools, agentic systems, AI-native SaaS). "
    "You summarise and categorise companies from pre-extracted evidence. "
    "You MUST NOT assign, suggest, or imply any numeric score or ranking. "
    "Only describe, categorise, and raise questions. Return STRICT JSON."
)

_SCHEMA_HINT = (
    '{"summary": str, "category": str, "moat_evidence": str, '
    '"platform_risk_explanation": str, "diligence_questions": [str, str, str]}'
)


def _build_prompt(sc: ScoredCompany) -> str:
    c = sc.company
    artifacts = ", ".join(sorted({a.type.value for a in c.artifacts})) or "none"
    claims = "; ".join(cl.text for cl in c.founder_claims[:6]) or "none"
    categories = ", ".join(
        s.description.split(":", 1)[1]
        for s in c.signals
        if s.description.startswith("category:")
    ) or "none"
    risk = sc.platform_risk
    return (
        f"Company (normalized): {c.name}\n"
        f"Domain: {c.domain or 'unknown'} | X handle: {c.x_handle or 'unknown'} | "
        f"GitHub org: {c.github_org or 'none'}\n"
        f"Detected categories: {categories}\n"
        f"Public artifacts (Level A): {artifacts}\n"
        f"Founder-reported claims (Level B, unverified): {claims}\n"
        f"Third-party signals (Level C): {len(c.third_party_signals)}\n"
        f"Platform absorption risk (deterministic, 0-100): "
        f"{risk.score if risk else 'n/a'}; likely absorber category: "
        f"{risk.likely_absorber_category if risk else 'n/a'}\n"
        f"Visible Feature Replication difficulty: "
        f"{sc.replication.difficulty.value if sc.replication else 'n/a'}\n\n"
        f"Return STRICT JSON matching: {_SCHEMA_HINT}\n"
        "Do NOT include any score or ranking. diligence_questions: exactly 3."
    )


def _parse_response(text: str) -> dict:
    text = text.strip()
    # Strip accidental markdown fencing.
    if text.startswith("```"):
        text = text.split("```", 2)[1]
        if text.startswith("json"):
            text = text[4:]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        log.warning("LLM returned non-JSON; skipping structured parse")
        return {}


def analyze_companies(
    scored: list[ScoredCompany],
    secrets: Secrets,
    *,
    model: str = DEFAULT_MODEL,
    max_analyses: int = MAX_ANALYSES,
) -> list[ScoredCompany]:
    """Annotate the top ``max_analyses`` candidates in place. Never scores."""
    if not secrets.anthropic_api_key:
        log.info("No ANTHROPIC_API_KEY; skipping LLM analysis.")
        return scored
    try:
        import anthropic
    except ImportError:
        log.warning("anthropic SDK not installed; skipping LLM analysis.")
        return scored

    client = anthropic.Anthropic(api_key=secrets.anthropic_api_key)
    for sc in scored[: min(max_analyses, MAX_ANALYSES)]:
        try:
            resp = client.messages.create(
                model=model,
                max_tokens=700,
                system=_SYSTEM,
                messages=[{"role": "user", "content": _build_prompt(sc)}],
            )
            text = "".join(
                block.text for block in resp.content if getattr(block, "type", "") == "text"
            )
            data = _parse_response(text)
        except Exception as exc:  # noqa: BLE001 - never let LLM break the run
            log.warning("LLM analysis failed for %s: %s", sc.company.name, exc)
            continue

        sc.llm_summary = data.get("summary")
        sc.llm_category = data.get("category")
        sc.llm_moat_evidence = data.get("moat_evidence")
        sc.llm_platform_risk_explanation = data.get("platform_risk_explanation")
        q = data.get("diligence_questions") or []
        if isinstance(q, list):
            sc.llm_diligence_questions = [str(x) for x in q][:3]
    return scored

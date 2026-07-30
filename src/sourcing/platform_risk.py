"""Platform Absorption Risk overlay + Visible Feature Replication Test.

Mandate sections 8 & 9. Both are SEPARATE from the numeric score. High risk or
low replication difficulty never auto-eliminates a company; classify.py routes
such leads to "Investigate founder, challenge moat".
"""

from __future__ import annotations

from .config import load_platform_risk
from .models import (
    ArtifactType,
    Company,
    PlatformRisk,
    ReplicationDifficulty,
    ReplicationTest,
)
from .scoring import CompanyFeatures

_PR = load_platform_risk()

# Model-provider tokens for the single-provider-dependency heuristic.
_PROVIDERS = ["openai", "gpt-4", "gpt-3", "gpt4", "anthropic", "claude", "gemini", "llama", "mistral"]

# Categories generally considered crowded (multiple credible clones).
_CROWDED = {"coding_tools", "agent_infra"}

# Category priority when several absorber categories match.
_ABSORBER_PRIORITY = ["security", "observability", "data_infrastructure", "workflow_software", "coding_tools"]


def most_likely_absorber(features: CompanyFeatures) -> tuple[str | None, list[str]]:
    absorbers = _PR.get("absorbers", {})
    for cat in _ABSORBER_PRIORITY:
        if cat in features.categories and cat in absorbers:
            return cat, list(absorbers[cat])
    # Fall back to any matched category present in the table.
    for cat in features.categories:
        if cat in absorbers:
            return cat, list(absorbers[cat])
    return None, []


def assess_platform_risk(company: Company, features: CompanyFeatures, text: str) -> PlatformRisk:
    rf = _PR["risk_factors"]
    low = text.lower()
    triggered: dict[str, float] = {}

    thin = (
        not features.data_loop
        and not features.deep_integration
        and ArtifactType.GITHUB not in features.artifact_types
    )
    if thin or "wrapper" in low:
        triggered["core_value_is_prompt_plus_api"] = rf["core_value_is_prompt_plus_api"]

    if features.categories & {"coding_tools", "agent_infra"}:
        triggered["model_provider_offers_adjacent"] = rf["model_provider_offers_adjacent"]

    absorber_cat, absorbers = most_likely_absorber(features)
    if absorber_cat is not None:
        triggered["incumbent_owns_workflow"] = rf["incumbent_owns_workflow"]

    provider_hits = [p for p in _PROVIDERS if p in low]
    if len(provider_hits) == 1:
        triggered["depends_on_single_model_provider"] = rf["depends_on_single_model_provider"]

    if not features.data_loop:
        triggered["no_proprietary_data_or_loop"] = rf["no_proprietary_data_or_loop"]
    if not features.deep_integration:
        triggered["no_meaningful_integrations"] = rf["no_meaningful_integrations"]
    if thin and (features.categories & _CROWDED):
        triggered["multiple_clones_exist"] = rf["multiple_clones_exist"]
    if not features.deep_integration and not features.data_loop:
        triggered["low_switching_cost"] = rf["low_switching_cost"]

    score = min(100.0, sum(triggered.values()))
    return PlatformRisk(
        score=score,
        factors_triggered=triggered,
        likely_absorber_category=absorber_cat,
        likely_absorbers=absorbers,
    )


def replication_test(features: CompanyFeatures) -> ReplicationTest:
    sig = _PR["replication_difficulty_signals"]
    points = 0
    reasons: list[str] = []
    if features.data_loop:
        points += sig["proprietary_data_loop"]
        reasons.append("evidence of a proprietary data / learning loop")
    if features.deep_integration:
        points += sig["deep_integrations"]
        reasons.append("deep integrations into external systems")
    if ArtifactType.GITHUB in features.artifact_types or ArtifactType.DOCS in features.artifact_types:
        points += sig["technical_depth_artifacts"]
        reasons.append("public technical artifacts (GitHub/docs)")
    if features.multi_step_workflow:
        points += sig["multi_step_workflow"]
        reasons.append("ownership of a multi-step workflow")

    if points == 0:
        difficulty = ReplicationDifficulty.VERY_LOW
    elif points == 1:
        difficulty = ReplicationDifficulty.LOW
    elif points <= 3:
        difficulty = ReplicationDifficulty.MODERATE
    elif points <= 5:
        difficulty = ReplicationDifficulty.HIGH
    else:
        difficulty = ReplicationDifficulty.VERY_HIGH

    if reasons:
        explanation = (
            f"Classified {difficulty.value} replication difficulty based on: "
            + "; ".join(reasons) + "."
        )
    else:
        explanation = (
            f"Classified {difficulty.value}: no publicly visible moat signals "
            "(no proprietary data loop, deep integrations, technical artifacts, "
            "or multi-step workflow ownership) were detected."
        )

    return ReplicationTest(
        difficulty=difficulty,
        explanation=explanation,
        disclaimer=_PR["replication_disclaimer"],
    )

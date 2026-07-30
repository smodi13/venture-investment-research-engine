"""Classification rules (mandate section 10).

Six mutually-exclusive buckets. Companies with high platform risk or low
replication difficulty are NOT eliminated -- they are routed to
"Investigate founder, challenge moat".
"""

from __future__ import annotations

from .models import (
    ArtifactType,
    Classification,
    Company,
    ReplicationDifficulty,
    ReplicationTest,
    ScoredCompany,
)
from .scoring import CompanyFeatures

PLATFORM_RISK_MEANINGFUL = 50.0  # >= this counts as "meaningful" platform risk
LOW_REPLICATION = {ReplicationDifficulty.VERY_LOW, ReplicationDifficulty.LOW}


def meaningful_signal_count(company: Company, f: CompanyFeatures) -> int:
    count = f.distinct_level_a
    count += f.customer_level_a + f.customer_level_b + f.third_party_c
    count += 1 if f.has_design_partner else 0
    count += 1 if f.has_hiring else 0
    count += f.shipping_count
    count += f.quant_claim_count
    return count


def beyond_single_promo(company: Company, f: CompanyFeatures) -> bool:
    """True if evidence extends beyond one promotional post."""
    if company.relevant_post_count >= 2:
        return True
    if f.customer_level_a + f.customer_level_b + f.third_party_c > 0:
        return True
    if f.has_design_partner or f.has_hiring:
        return True
    if {ArtifactType.GITHUB, ArtifactType.DOCS, ArtifactType.PRICING} & f.artifact_types:
        return True
    return False


def _serious_stealth_work(company: Company, f: CompanyFeatures) -> bool:
    return (
        f.shipping_count > 0
        or ArtifactType.GITHUB in f.artifact_types
        or f.quant_claim_count > 0
        or f.has_design_partner
        or company.relevant_post_count >= 2
        or company.is_stealth  # stealth flag already implies founder+builder language
    )


def classify(scored: ScoredCompany, f: CompanyFeatures) -> Classification:
    company = scored.company
    risk = scored.platform_risk.score if scored.platform_risk else 0.0
    replication = (
        scored.replication.difficulty if scored.replication else ReplicationDifficulty.MODERATE
    )

    # 1. Clear non-lead / outside mandate -> Archive.
    if not f.categories and not company.is_stealth and not company.artifacts:
        return Classification.ARCHIVE

    n_signals = meaningful_signal_count(company, f)
    strong_product = (
        f.has_level_a and n_signals >= 2 and beyond_single_promo(company, f)
    )
    defensibility_unclear = (
        scored.components.defensibility <= 3 or replication in LOW_REPLICATION
    )
    risk_meaningful = risk >= PLATFORM_RISK_MEANINGFUL
    strong_founder = f.has_founder_language and bool(f.categories)

    # 2. Contact now -- strongest, defensible enough.
    if strong_product and not defensibility_unclear and not risk_meaningful:
        return Classification.CONTACT_NOW

    # 3. Investigate founder, challenge moat -- strong but moat/platform risk flagged.
    if (strong_product or (strong_founder and f.has_level_a)) and (
        defensibility_unclear or risk_meaningful
    ):
        return Classification.INVESTIGATE_MOAT

    # 4. Stealth founder lead -- founder-problem alignment + building, no Level A required.
    if strong_founder and _serious_stealth_work(company, f):
        if not f.has_level_a or company.is_stealth:
            return Classification.STEALTH_FOUNDER_LEAD

    # 5. Interesting product, likely feature.
    likely_feature = (
        replication in LOW_REPLICATION
        and not f.deep_integration
        and not f.multi_step_workflow
        and not f.data_loop
    )
    if likely_feature and f.has_level_a:
        return Classification.LIKELY_FEATURE

    # 6. Relevant but insufficient evidence -> Watchlist. Else Archive.
    if f.categories or company.is_stealth:
        return Classification.WATCHLIST
    return Classification.ARCHIVE

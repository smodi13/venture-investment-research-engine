"""Primary Sourcing Score (mandate section 7) -- 100% deterministic.

Every point is computed from extracted evidence and the weights in scoring.yaml.
The LLM never contributes to any number here.

Also provides :class:`CompanyFeatures`, a reusable deterministic feature bundle
consumed by :mod:`platform_risk` and :mod:`classify`.

Founder-Startup Fit (exact phrase) explicitly EXCLUDES follower count, virality,
investor followers, and writing-style confidence as inputs.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from .config import load_scoring
from .models import (
    ArtifactType,
    Company,
    ComponentScores,
    DiscoveryStatus,
    EvidenceLevel,
    ScoredCompany,
    SignalType,
)

_SCORING = load_scoring()
_BUZZWORDS = [b.lower() for b in _SCORING.get("buzzwords", [])]

_PAIN_WORDS = [
    "slow", "manual", "expensive", "broken", "tedious", "hours", "painful",
    "error-prone", "bottleneck", "waste", "spend hours", "wastes", "toil",
]
_SERVICES_PHRASES = [
    "we build for you", "done for you", "we'll build", "we will build",
    "we build mvps", "we build your", "hire us", "we do it for you",
    "managed service", "we handle everything for",
]
_INTEGRATION_WORDS = ["integrat", "connects to", "plugs into", "works with", "api for"]
_MULTISTEP_WORDS = ["workflow", "end-to-end", "pipeline", "orchestrat", "multi-step"]
_RETENTION_WORDS = ["in production", "every day", "daily", "embedded", "mission-critical", "rely on"]
_DATA_LOOP_WORDS = ["proprietary data", "data flywheel", "learning loop", "fine-tune", "our own model", "feedback loop"]


@dataclass
class CompanyFeatures:
    categories: set[str] = field(default_factory=set)
    artifact_types: set[ArtifactType] = field(default_factory=set)
    distinct_level_a: int = 0
    has_level_a: bool = False
    has_live_product: bool = False
    customer_level_a: int = 0
    customer_level_b: int = 0
    third_party_c: int = 0
    has_design_partner: bool = False
    has_hiring: bool = False
    shipping_weight: float = 0.0
    shipping_count: int = 0
    quant_claim_count: int = 0
    has_founder_language: bool = False
    buzzword_count: int = 0
    problem_specific: bool = False
    services_framing: bool = False
    deep_integration: bool = False
    multi_step_workflow: bool = False
    retention_signal: bool = False
    data_loop: bool = False
    claims_without_support: bool = False
    core_family: bool = False


def _category_from_signal(desc: str) -> str | None:
    if desc.startswith("category:"):
        return desc.split(":", 1)[1]
    return None


def extract_features(company: Company, text: str) -> CompanyFeatures:
    """Compute deterministic features from a company's signals + combined text."""
    low = text.lower()
    f = CompanyFeatures()

    for s in company.signals:
        if s.type == SignalType.PRODUCT_CATEGORY:
            cat = _category_from_signal(s.description)
            if cat:
                f.categories.add(cat)
        if s.type == SignalType.FOUNDER_BACKGROUND:
            f.has_founder_language = True
        if s.type == SignalType.DESIGN_PARTNER:
            f.has_design_partner = True
        if s.type == SignalType.HIRING:
            f.has_hiring = True
        if s.type == SignalType.SHIPPING or s.type == SignalType.LAUNCH:
            f.shipping_count += 1
            f.shipping_weight += s.decay_weight
        # customer pull inputs, labelled strictly by evidence level
        if s.type in (SignalType.CUSTOMER, SignalType.USAGE):
            if s.evidence_level == EvidenceLevel.A:
                f.customer_level_a += 1
            elif s.evidence_level == EvidenceLevel.B:
                f.customer_level_b += 1
            elif s.evidence_level == EvidenceLevel.C:
                f.third_party_c += 1
        if s.evidence_level == EvidenceLevel.C and s.type == SignalType.USAGE:
            pass  # already counted above

    for a in company.artifacts:
        f.artifact_types.add(a.type)
    f.distinct_level_a = company.independent_artifact_count
    f.has_level_a = bool(company.artifacts)
    f.has_live_product = any(
        t in f.artifact_types
        for t in (ArtifactType.PRODUCT_URL, ArtifactType.PRICING, ArtifactType.DOCS)
    )

    f.quant_claim_count = len(company.founder_claims)
    f.buzzword_count = sum(1 for b in _BUZZWORDS if b in low)
    f.problem_specific = bool(f.categories) and any(p in low for p in _PAIN_WORDS)
    f.services_framing = any(p in low for p in _SERVICES_PHRASES)
    f.deep_integration = any(w in low for w in _INTEGRATION_WORDS) or "workflow_software" in f.categories
    f.multi_step_workflow = any(w in low for w in _MULTISTEP_WORDS)
    f.retention_signal = any(w in low for w in _RETENTION_WORDS)
    f.data_loop = any(w in low for w in _DATA_LOOP_WORDS)
    f.core_family = bool(company.query_groups_matched & {"A", "B", "C"})

    # claims without support: has founder-reported (B) or inference (D) claims but
    # no verifiable (A) or third-party (C) corroboration anywhere.
    has_a_or_c = f.has_level_a or f.third_party_c > 0 or f.customer_level_a > 0
    f.claims_without_support = (f.customer_level_b > 0 or f.quant_claim_count > 0) and not has_a_or_c

    return f


def _cap(value: float, maximum: float) -> float:
    return min(value, maximum)


def score_components(company: Company, features: CompanyFeatures) -> ComponentScores:
    c = _SCORING["components"]
    cs = ComponentScores()

    # Role & thesis fit -------------------------------------------------
    rt = c["role_thesis_fit"]
    pts = len(features.categories) * rt["points_per_category"]
    if features.core_family:
        pts += rt["core_family_bonus"]
    cs.role_thesis_fit = _cap(pts, rt["max"])

    # Founder-Startup Fit (deterministic proxies only) ------------------
    fsf = c["founder_startup_fit"]
    pts = 0.0
    if features.has_founder_language:
        pts += fsf["prior_relevant_work"] if features.categories else 0
        pts += fsf["technical_domain_experience"] if features.categories else 0
    if ArtifactType.GITHUB in features.artifact_types:
        pts += fsf["prior_products_or_oss"]
    if features.problem_specific:
        pts += fsf["problem_specificity"]
    if features.shipping_count > 0:
        pts += fsf["evidence_of_shipping"]
    if company.relevant_post_count >= 2:
        pts += fsf["focus_consistency"]
    cs.founder_startup_fit = _cap(pts, fsf["max"])

    # Product & technical evidence --------------------------------------
    pte = c["product_technical_evidence"]
    pts = 0.0
    if features.distinct_level_a >= 1:
        pts += pte["level_a_artifact"]
        pts += (features.distinct_level_a - 1) * pte["per_additional_artifact"]
    if features.has_live_product:
        pts += pte["live_product_bonus"]
    cs.product_technical_evidence = _cap(pts, pte["max"])

    # Customer pull & adoption (labelled by evidence level) -------------
    cp = c["customer_pull"]
    pts = (
        features.customer_level_a * cp["level_a_customer_evidence"]
        + features.customer_level_b * cp["level_b_customer_claim"]
        + features.third_party_c * cp["level_c_third_party"]
    )
    cs.customer_pull = _cap(pts, cp["max"])

    # Workflow depth & retention ----------------------------------------
    wd = c["workflow_depth"]
    pts = 0.0
    if features.deep_integration:
        pts += wd["deep_integration_signal"]
    if features.multi_step_workflow:
        pts += wd["multi_step_workflow"]
    if features.retention_signal:
        pts += wd["retention_signal"]
    cs.workflow_depth = _cap(pts, wd["max"])

    # Defensibility ------------------------------------------------------
    df = c["defensibility"]
    pts = 0.0
    if features.data_loop:
        pts += df["proprietary_data_loop"]
    if features.deep_integration:
        pts += df["integrations_moat"]
    if ArtifactType.GITHUB in features.artifact_types or ArtifactType.DOCS in features.artifact_types:
        pts += df["technical_depth"]
    cs.defensibility = _cap(pts, df["max"])

    # Shipping momentum (decay-weighted) --------------------------------
    sm = c["shipping_momentum"]
    pts = 0.0
    if features.shipping_weight > 0:
        pts += sm["recent_shipping_signal"] * min(1.0, features.shipping_weight)
    if features.shipping_count >= 2:
        pts += sm["multiple_shipping_signals"]
    cs.shipping_momentum = _cap(pts, sm["max"])

    return cs


def compute_penalties(company: Company, features: CompanyFeatures) -> dict[str, float]:
    p = _SCORING["penalties"]
    out: dict[str, float] = {}
    if features.buzzword_count >= 2 and not features.problem_specific:
        out["excessive_buzzwords_no_problem"] = p["excessive_buzzwords_no_problem"]
    if features.customer_level_a == 0 and features.customer_level_b == 0 and features.third_party_c == 0 and not features.categories:
        out["no_identifiable_customer_or_usecase"] = p["no_identifiable_customer_or_usecase"]
    if features.services_framing:
        out["services_business_as_software"] = p["services_business_as_software"]
    if features.claims_without_support:
        out["claims_without_evidence"] = p["claims_without_evidence"]
    if not features.categories:
        out["outside_sector_focus"] = p["outside_sector_focus"]
    return out


def discovery_status(company: Company) -> DiscoveryStatus:
    """NON-scoring tie-breaker label based on author follower reach."""
    ds = _SCORING["discovery_status"]
    f = company.max_author_followers
    if f <= ds["under_the_radar_max_followers"]:
        return DiscoveryStatus.UNDER_THE_RADAR
    if f <= ds["emerging_max_followers"]:
        return DiscoveryStatus.EMERGING
    if f <= ds["already_visible_max_followers"]:
        return DiscoveryStatus.ALREADY_VISIBLE
    return DiscoveryStatus.WIDELY_KNOWN


def score_company(company: Company, text: str) -> ScoredCompany:
    """Full deterministic scoring for one company."""
    features = extract_features(company, text)
    components = score_components(company, features)
    penalties = compute_penalties(company, features)
    total = max(0.0, components.subtotal() - sum(penalties.values()))
    return ScoredCompany(
        company=company,
        components=components,
        penalties=penalties,
        total_score=round(total, 2),
        discovery_status=discovery_status(company),
    )

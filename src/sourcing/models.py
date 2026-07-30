"""Pydantic data models for the sourcing engine.

Layered as:
  raw API objects  -> RawPost, RawUser
  extracted facts  -> Signal, Claim, Artifact
  aggregation      -> Company
  scoring output   -> ComponentScores, PlatformRisk, ReplicationTest, ScoredCompany
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------
class EvidenceLevel(str, Enum):
    """Confidence in a claim's source (mandate section 5)."""

    A = "A"  # directly verifiable artifact
    B = "B"  # founder-reported claim
    C = "C"  # third-party signal
    D = "D"  # engine inference


class SignalType(str, Enum):
    """Categories of extracted signals.

    The first block is time-decayable; the second block records ENDURING facts
    that must NOT decay (mandate section 6).
    """

    # decayable (time-sensitive)
    LAUNCH = "launch"
    CUSTOMER = "customer"
    USAGE = "usage"
    DESIGN_PARTNER = "design_partner"
    HIRING = "hiring"
    SHIPPING = "shipping"
    # enduring (no decay)
    FOUNDER_BACKGROUND = "founder_background"
    PRODUCT_CATEGORY = "product_category"
    TECHNICAL_ARCHITECTURE = "technical_architecture"
    PRODUCT_ARTIFACT = "product_artifact"


class ArtifactType(str, Enum):
    GITHUB = "github"
    DOCS = "docs"
    PRICING = "pricing"
    CHANGELOG = "changelog"
    DEMO = "demo"
    PRODUCTHUNT = "producthunt"
    PRODUCT_URL = "product_url"


class Classification(str, Enum):
    CONTACT_NOW = "Contact now"
    STEALTH_FOUNDER_LEAD = "Stealth founder lead"
    INVESTIGATE_MOAT = "Investigate founder, challenge moat"
    LIKELY_FEATURE = "Interesting product, likely feature"
    WATCHLIST = "Watchlist"
    ARCHIVE = "Archive"


class DiscoveryStatus(str, Enum):
    UNDER_THE_RADAR = "Under the radar"
    EMERGING = "Emerging"
    ALREADY_VISIBLE = "Already visible"
    WIDELY_KNOWN = "Widely known"


class ReplicationDifficulty(str, Enum):
    VERY_LOW = "very_low"
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    VERY_HIGH = "very_high"


class ReplyClass(str, Enum):
    """Categories for a sampled reply/quote post (top candidates only)."""

    TECHNICAL_QUESTION = "technical_question"
    POTENTIAL_CUSTOMER_INTEREST = "potential_customer_interest"
    EXISTING_USER_FEEDBACK = "existing_user_feedback"
    CREDIBLE_THIRD_PARTY_VALIDATION = "credible_third_party_validation"
    GENERIC_CONGRATULATIONS = "generic_congratulations"
    CRITICISM = "criticism"
    SPAM = "spam"


# ---------------------------------------------------------------------------
# Raw API objects (subset of X API v2 fields we consume)
# ---------------------------------------------------------------------------
class RawUser(BaseModel):
    id: str
    username: str
    name: str = ""
    description: str = ""
    url: Optional[str] = None
    verified: bool = False
    created_at: Optional[datetime] = None
    followers_count: int = 0
    following_count: int = 0
    tweet_count: int = 0
    # Expanded URLs from the user's profile entities.
    expanded_urls: list[str] = Field(default_factory=list)


class RawPost(BaseModel):
    id: str
    text: str
    author_id: str
    created_at: Optional[datetime] = None
    lang: Optional[str] = None
    like_count: int = 0
    reply_count: int = 0
    retweet_count: int = 0
    quote_count: int = 0
    impression_count: int = 0
    is_retweet: bool = False
    is_reply: bool = False
    expanded_urls: list[str] = Field(default_factory=list)
    # Full per-URL representations (original_short_url, expanded_url, unwound_url,
    # selected_canonical_url, normalized_domain, url_resolution_status, ...).
    url_details: list[dict] = Field(default_factory=list)
    hashtags: list[str] = Field(default_factory=list)
    mentions: list[str] = Field(default_factory=list)  # usernames
    # Which topic group(s) and discovery lane(s) surfaced this post.
    query_groups: list[str] = Field(default_factory=list)
    query_lanes: list[str] = Field(default_factory=list)

    @property
    def url(self) -> str:
        return f"https://x.com/i/web/status/{self.id}"

    @property
    def engagement_raw(self) -> int:
        """Raw public engagement (see engagement.py for the weighted signal)."""
        return self.like_count + self.retweet_count + self.reply_count + self.quote_count


# ---------------------------------------------------------------------------
# Extracted facts
# ---------------------------------------------------------------------------
class Artifact(BaseModel):
    type: ArtifactType
    url: str
    source_post_id: str


class Signal(BaseModel):
    type: SignalType
    evidence_level: EvidenceLevel
    description: str
    source_post_id: str
    created_at: Optional[datetime] = None
    # Populated by evidence.apply_time_decay; 1.0 for enduring facts.
    decay_weight: float = 1.0

    @property
    def decayable(self) -> bool:
        from .evidence import DECAYABLE_SIGNALS  # local import avoids cycle

        return self.type in DECAYABLE_SIGNALS


class Claim(BaseModel):
    text: str
    evidence_level: EvidenceLevel
    source_post_id: str


# ---------------------------------------------------------------------------
# Aggregation
# ---------------------------------------------------------------------------
class Company(BaseModel):
    """A company-level candidate consolidated across many posts/authors."""

    canonical_id: str  # stable dedup key
    name: str
    domain: Optional[str] = None
    x_handle: Optional[str] = None
    github_org: Optional[str] = None
    founder_handles: list[str] = Field(default_factory=list)

    post_ids: list[str] = Field(default_factory=list)
    query_groups_matched: set[str] = Field(default_factory=set)
    artifacts: list[Artifact] = Field(default_factory=list)
    signals: list[Signal] = Field(default_factory=list)
    founder_claims: list[Claim] = Field(default_factory=list)
    third_party_signals: list[Signal] = Field(default_factory=list)

    # Author metrics used ONLY for Discovery Status (never in the numeric score).
    max_author_followers: int = 0
    is_stealth: bool = False

    # Discovery lanes that surfaced this company (product_artifact, etc.).
    query_lanes_matched: set[str] = Field(default_factory=set)

    # Engagement Signal (NON-scoring; "this post deserves a closer look", not a
    # quality judgement). Secondary tie-breaker only — never in the 100-pt score.
    engagement_signal: float = 0.0          # weighted raw, best post
    engagement_normalized: float = 0.0      # follower-floored normalisation
    deserves_closer_look: bool = False

    @property
    def relevant_post_count(self) -> int:
        return len(set(self.post_ids))

    @property
    def independent_artifact_count(self) -> int:
        return len({(a.type, a.url) for a in self.artifacts})


# ---------------------------------------------------------------------------
# Scoring output
# ---------------------------------------------------------------------------
class ComponentScores(BaseModel):
    role_thesis_fit: float = 0.0
    founder_startup_fit: float = 0.0
    product_technical_evidence: float = 0.0
    customer_pull: float = 0.0
    workflow_depth: float = 0.0
    defensibility: float = 0.0
    shipping_momentum: float = 0.0

    def subtotal(self) -> float:
        return (
            self.role_thesis_fit
            + self.founder_startup_fit
            + self.product_technical_evidence
            + self.customer_pull
            + self.workflow_depth
            + self.defensibility
            + self.shipping_momentum
        )


class PlatformRisk(BaseModel):
    score: float  # 0-100, higher is worse
    factors_triggered: dict[str, float] = Field(default_factory=dict)
    likely_absorber_category: Optional[str] = None
    likely_absorbers: list[str] = Field(default_factory=list)


class ReplicationTest(BaseModel):
    difficulty: ReplicationDifficulty
    explanation: str
    disclaimer: str


class ReplyClassification(BaseModel):
    source_post_id: str
    reply_class: ReplyClass
    text_excerpt: str


class ScoredCompany(BaseModel):
    company: Company
    components: ComponentScores
    penalties: dict[str, float] = Field(default_factory=dict)
    total_score: float = 0.0
    discovery_status: DiscoveryStatus = DiscoveryStatus.UNDER_THE_RADAR
    platform_risk: Optional[PlatformRisk] = None
    replication: Optional[ReplicationTest] = None
    classification: Classification = Classification.WATCHLIST

    # LLM-generated (optional, non-scoring) narrative fields.
    llm_summary: Optional[str] = None
    llm_category: Optional[str] = None
    llm_moat_evidence: Optional[str] = None
    llm_platform_risk_explanation: Optional[str] = None
    llm_diligence_questions: list[str] = Field(default_factory=list)

    # Actionability fields (top-5) -- mandate section 11.
    why_contact_now: Optional[str] = None
    why_headline: Optional[str] = None
    public_contact_route: Optional[str] = None
    suggested_outreach_angle: Optional[str] = None
    primary_diligence_question: Optional[str] = None

    # Enrichment notes (top-5).
    enrichment: dict[str, str] = Field(default_factory=dict)
    missing_information: list[str] = Field(default_factory=list)

    # Sampled reply/quote classifications (top 10-15 only, when available).
    reply_classifications: list["ReplyClassification"] = Field(default_factory=list)

    @property
    def total_penalty(self) -> float:
        return sum(self.penalties.values())

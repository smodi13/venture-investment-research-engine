"""Deterministic first-pass extraction and filtering (mandate section 3).

NO LLM is used here. Everything is rule-based: keywords, URLs, and metadata.

Two public entry points:
  * :func:`extract` -- pull signals, artifacts, claims, categories, flags from a
    post (+ optional author profile).
  * :func:`classify_exclusion` -- decide whether a post is a clear non-lead.

Evidence levels are assigned AT EXTRACTION TIME from the source type:
  * artifact URL / verifiable  -> Level A
  * author-stated claim        -> Level B (founder-reported)
  * someone else's description  -> Level C (third-party)
Time decay is applied later in :mod:`sourcing.evidence`.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Optional
from urllib.parse import urlparse

from .config import load_keywords
from .models import (
    Artifact,
    ArtifactType,
    Claim,
    EvidenceLevel,
    RawPost,
    RawUser,
    Signal,
    SignalType,
)

_KW = load_keywords()

# Map keyword-bank signal categories to SignalType enum members.
_SIGNAL_TYPE_MAP = {
    "launch": SignalType.LAUNCH,
    "customer": SignalType.CUSTOMER,
    "usage": SignalType.USAGE,
    "design_partner": SignalType.DESIGN_PARTNER,
    "hiring": SignalType.HIRING,
    "shipping": SignalType.SHIPPING,
}

# Hosts that never count as a company product artifact.
_NON_PRODUCT_HOSTS = {
    "x.com", "twitter.com", "t.co", "linkedin.com", "medium.com",
    "substack.com", "notion.so", "calendly.com", "lu.ma",
}

# Quant-claim regex: a number (optionally $/k/m/x/%) near a metric noun.
_QUANT_NOUNS = [re.escape(n) for n in _KW.get("quant_metric_nouns", [])]
_QUANT_RE = re.compile(
    r"(\$?\d[\d,\.]*\s*[kKmMxX%+]?\s*(?:%|\b(?:" + "|".join(_QUANT_NOUNS) + r")\b))",
    re.IGNORECASE,
)

# ---------------------------------------------------------------------------
# Auto-exclusion banks (clear non-leads only; NEVER excludes stealth founders).
# ---------------------------------------------------------------------------
_EXCLUDE_RECRUITING = [
    "recruiting agency", "staffing agency", "we place candidates",
    "hiring agency", "talent agency", "recruiter dm", "we recruit",
]
_EXCLUDE_CONSULTING = [
    "consulting services", "we consult", "book a consultation",
    "our agency helps", "we build mvps for", "we build apps for you",
    "development agency", "software agency", "we offer development",
]
_EXCLUDE_COURSE = [
    "enroll now", "my course", "free course", "masterclass", "cohort starts",
    "sign up for my bootcamp", "learn to code", "udemy", "join my cohort",
]
_EXCLUDE_AFFILIATE = [
    "affiliate link", "use my code", "discount code", "promo code",
    "commission", "referral link", "sponsored",
]
_EXCLUDE_GIVEAWAY = [
    "giveaway", "retweet to win", "rt to win", "tag 3 friends",
    "like and retweet", "follow to enter", "airdrop",
]
_EXCLUDE_ENGAGEMENT = [
    "reply with", "comment below and", "drop a", "who wants",
    "unpopular opinion", "hot take", "agree?", "thoughts?",
]
_EXCLUDE_CRYPTO = [
    "nft", "crypto", "web3", "token launch", "presale", "memecoin",
    "$sol", "$eth", "$btc", "mint now", "whitelist", "defi",
]
_EXCLUDE_NEWS = [
    "breaking:", "report:", "study finds", "according to", "just in:",
    "new research shows", "the ai news", "newsletter roundup",
]
_EXCLUDE_INVESTOR = [
    "we invested in", "our portfolio", "excited to back", "led the round",
    "we led", "partner at", "raising a fund", "lp update",
]


@dataclass
class PostExtraction:
    post: RawPost
    signals: list[Signal] = field(default_factory=list)
    artifacts: list[Artifact] = field(default_factory=list)
    claims: list[Claim] = field(default_factory=list)
    matched_categories: set[str] = field(default_factory=set)
    quant_claims: list[str] = field(default_factory=list)
    product_domains: list[str] = field(default_factory=list)
    github_orgs: list[str] = field(default_factory=list)

    has_founder_language: bool = False
    has_stealth_language: bool = False
    has_customer_language: bool = False
    has_design_partner_language: bool = False
    has_third_party_language: bool = False

    excluded: bool = False
    exclusion_reason: Optional[str] = None

    @property
    def meaningful_signal_count(self) -> int:
        """Distinct meaningful signals (used by classification rules)."""
        return len({(s.type, s.source_post_id) for s in self.signals}) + len(
            self.artifacts
        )


def _contains_any(haystack: str, needles: list[str]) -> Optional[str]:
    for n in needles:
        if n in haystack:
            return n
    return None


def _classify_url(url: str) -> tuple[Optional[ArtifactType], Optional[str], Optional[str]]:
    """Return (artifact_type, domain, github_org) for a SELECTED CANONICAL URL.

    Returns (None, None, None) for hosts that are never a product artifact
    (x.com/twitter.com/t.co and other non-product hosts) so a self-referencing
    media/status link is NOT counted as a Level A artifact.
    """
    from .urlutil import NON_PRODUCT_HOSTS, bare_host as _bare_host, github_owner_repo

    low = url.lower()
    patterns = _KW.get("artifact_url_patterns", {})
    host = _bare_host(url)

    # Never an artifact: x/twitter/t.co and other non-product hosts.
    if not host or host in NON_PRODUCT_HOSTS or host in _NON_PRODUCT_HOSTS:
        return None, None, None

    # github/gitlab -> the OWNER is the identity, not the host domain.
    owner_repo = github_owner_repo(url)
    if owner_repo is not None:
        return ArtifactType.GITHUB, None, owner_repo.split("/")[0]

    # Docs/pricing/changelog live on the company's own domain -> keep host.
    for atype, frags in (
        (ArtifactType.CHANGELOG, patterns.get("changelog", [])),
        (ArtifactType.PRICING, patterns.get("pricing", [])),
        (ArtifactType.DOCS, patterns.get("docs", [])),
    ):
        if any(frag in low for frag in frags):
            return atype, host, None
    # Third-party platforms are NOT the company domain.
    for atype, frags in (
        (ArtifactType.PRODUCTHUNT, patterns.get("producthunt", [])),
        (ArtifactType.DEMO, patterns.get("demo", [])),
    ):
        if any(frag in low for frag in frags):
            return atype, None, None

    # Otherwise: a plausible company product URL.
    return ArtifactType.PRODUCT_URL, host, None


def extract(post: RawPost, user: Optional[RawUser] = None) -> PostExtraction:
    """Extract all deterministic signals from a post and optional author bio."""
    text = post.text.lower()
    bio = (user.description.lower() if user else "")
    combined = f"{text}\n{bio}"

    ex = PostExtraction(post=post)

    # -- signals from keyword banks (author-stated => level B, launch=>A-ish) --
    for cat, phrases in _KW.get("signals", {}).items():
        stype = _SIGNAL_TYPE_MAP.get(cat)
        if stype is None:
            continue
        hit = _contains_any(text, phrases)
        if hit:
            # Launch/shipping with a URL become Level A via artifacts below;
            # the bare textual signal is founder-reported (Level B).
            level = EvidenceLevel.B
            ex.signals.append(
                Signal(
                    type=stype,
                    evidence_level=level,
                    description=f"matched '{hit}'",
                    source_post_id=post.id,
                    created_at=post.created_at,
                )
            )
            if cat == "customer":
                ex.has_customer_language = True
            if cat == "design_partner":
                ex.has_design_partner_language = True

    # -- artifacts from URLs (Level A) -------------------------------------
    # Use the selected canonical URLs (unwound>expanded>url). Skip unresolved
    # t.co shorteners and non-product hosts (x.com/twitter.com/t.co) so a
    # self-referencing media/status link is NOT a Level A artifact.
    if post.url_details:
        canonical_urls = [
            d["selected_canonical_url"] for d in post.url_details
            if d.get("selected_canonical_url")
            and d.get("url_resolution_status") != "unresolved_shortener"
        ]
    else:
        canonical_urls = list(post.expanded_urls)

    seen_artifacts: set[tuple] = set()
    for url in canonical_urls:
        atype, domain, gh_org = _classify_url(url)
        if atype is None:
            continue  # non-product host (x/twitter/t.co) -> no artifact
        key = (atype, gh_org or domain or url)
        if key in seen_artifacts:
            continue  # duplicate URL -> one canonical artifact
        seen_artifacts.add(key)
        ex.artifacts.append(
            Artifact(type=atype, url=url, source_post_id=post.id)
        )
        # A live artifact is a Level A product-artifact signal.
        ex.signals.append(
            Signal(
                type=SignalType.PRODUCT_ARTIFACT,
                evidence_level=EvidenceLevel.A,
                description=f"{atype.value}: {url}",
                source_post_id=post.id,
                created_at=post.created_at,
            )
        )
        if domain:
            ex.product_domains.append(domain)
        if gh_org:
            ex.github_orgs.append(gh_org)

    # -- founder / stealth language ----------------------------------------
    ex.has_founder_language = _contains_any(combined, _KW.get("founder_language", [])) is not None
    ex.has_stealth_language = _contains_any(combined, _KW.get("stealth_language", [])) is not None
    if ex.has_founder_language:
        ex.signals.append(
            Signal(
                type=SignalType.FOUNDER_BACKGROUND,
                evidence_level=EvidenceLevel.B,
                description="founder/builder language present",
                source_post_id=post.id,
                created_at=post.created_at,
            )
        )

    # -- third-party (Level C) language ------------------------------------
    tp_hit = _contains_any(text, _KW.get("third_party_language", []))
    if tp_hit:
        ex.has_third_party_language = True
        sig = Signal(
            type=SignalType.USAGE,
            evidence_level=EvidenceLevel.C,
            description=f"third-party usage language '{tp_hit}'",
            source_post_id=post.id,
            created_at=post.created_at,
        )
        ex.signals.append(sig)

    # -- quantitative claims (Level B founder-reported) --------------------
    for m in _QUANT_RE.findall(post.text):
        claim_text = m if isinstance(m, str) else m[0]
        claim_text = claim_text.strip()
        if claim_text:
            ex.quant_claims.append(claim_text)
            ex.claims.append(
                Claim(
                    text=claim_text,
                    evidence_level=EvidenceLevel.B,
                    source_post_id=post.id,
                )
            )

    # -- technical keyword categories (role/thesis fit) --------------------
    for cat, phrases in _KW.get("technical_keywords", {}).items():
        if _contains_any(combined, phrases):
            ex.matched_categories.add(cat)
            # Category is the engine's own classification of the text => Level D
            # (engine inference), an enduring fact, so it does not time-decay.
            ex.signals.append(
                Signal(
                    type=SignalType.PRODUCT_CATEGORY,
                    evidence_level=EvidenceLevel.D,
                    description=f"category:{cat}",
                    source_post_id=post.id,
                    created_at=post.created_at,
                )
            )

    return ex


# ---------------------------------------------------------------------------
# Exclusion
# ---------------------------------------------------------------------------
_EXCLUSION_BANKS: list[tuple[str, list[str]]] = [
    ("recruiting_agency", _EXCLUDE_RECRUITING),
    ("consulting_agency", _EXCLUDE_CONSULTING),
    ("course", _EXCLUDE_COURSE),
    ("affiliate_marketing", _EXCLUDE_AFFILIATE),
    ("giveaway", _EXCLUDE_GIVEAWAY),
    ("crypto_nft", _EXCLUDE_CRYPTO),
]


def classify_exclusion(post: RawPost, extraction: PostExtraction, user: Optional[RawUser] = None) -> tuple[bool, Optional[str]]:
    """Return (excluded, reason). NEVER excludes stealth founders.

    A post is excluded only if it is a *clear* non-lead. If any founder/builder
    or product signal exists, we keep it (route decisions happen in classify.py).
    """
    text = post.text.lower()
    bio = (user.description.lower() if user else "")
    combined = f"{text}\n{bio}"

    # Retweets are excluded outright.
    if post.is_retweet:
        return True, "retweet"

    # Stealth-founder protection: credible founder/builder language + role fit +
    # some evidence of serious work => NEVER auto-exclude, even if other banks hit.
    stealth_protected = (
        extraction.has_founder_language
        and bool(extraction.matched_categories)
        and (extraction.meaningful_signal_count >= 1 or extraction.has_stealth_language)
    )

    # Hard-spam banks (crypto/giveaway/etc.) exclude even founders, because these
    # are unambiguous non-leads for this mandate.
    for reason, bank in _EXCLUSION_BANKS:
        hit = _contains_any(combined, bank)
        if hit:
            # Crypto/NFT and giveaways are always non-leads for this seat.
            if reason in {"crypto_nft", "giveaway", "affiliate_marketing", "course"}:
                return True, f"{reason} ('{hit}')"
            # Recruiting/consulting: exclude unless clearly a founder building a product.
            if not stealth_protected and not extraction.artifacts:
                return True, f"{reason} ('{hit}')"

    # Engagement farming with no product/founder signal.
    if not stealth_protected and not extraction.artifacts and not extraction.matched_categories:
        if _contains_any(text, _EXCLUDE_ENGAGEMENT):
            return True, "engagement_farming"
        # Generic AI news with no lead.
        if _contains_any(text, _EXCLUDE_NEWS):
            return True, "generic_ai_news"
        # Investor commentary with no startup lead.
        if _contains_any(text, _EXCLUDE_INVESTOR):
            return True, "investor_commentary_no_lead"

    # Genuinely no signal of any kind.
    no_signal = (
        not extraction.has_founder_language
        and not extraction.artifacts
        and not extraction.matched_categories
        and not extraction.signals
    )
    if no_signal:
        return True, "no_founder_product_or_building_signal"

    return False, None

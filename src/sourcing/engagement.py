"""Engagement Signal (renamed from "Engagement Quality Score").

Computed LOCALLY in Python from X public_metrics AFTER retrieval — never via
unsupported query operators (min_faves:, etc., are rejected by the validator).

Framing (important): the Engagement Signal answers "does this post deserve a
closer look?", NOT "is this good/positive?". High engagement can equally mean
criticism, controversy, or spam.

Guarantees:
  * It is NON-scoring. It never enters the 100-point Primary Sourcing Score, so
    it can never outweigh Founder-Startup Fit, product evidence, customer pull,
    or workflow depth. It is used only as a low-priority tie-breaker and a
    "closer look" flag.
  * No minimum engagement threshold is applied to the product_artifact or
    founder_transition lanes — small accounts are expected and valid there.
"""

from __future__ import annotations

import math
import re

from .models import (
    Company,
    RawPost,
    ReplyClass,
    ReplyClassification,
)

# Weights keep the signal transparent. Replies/quotes weigh more than likes
# because they indicate someone bothered to engage substantively.
_W_LIKE = 1.0
_W_REPOST = 2.0
_W_REPLY = 2.0
_W_QUOTE = 3.0

# Follower-count floor so small accounts don't get artificially extreme ratios.
FOLLOWER_FLOOR = 500

# Lanes where NO minimum engagement threshold is applied.
NO_THRESHOLD_LANES = {"product_artifact", "founder_transition"}

# Normalised-engagement threshold that flags "deserves a closer look" for the
# early_traction lane only.
CLOSER_LOOK_THRESHOLD = 0.05


def post_engagement_signal(post: RawPost) -> float:
    """Weighted engagement for a single post (local computation)."""
    return (
        _W_LIKE * post.like_count
        + _W_REPOST * post.retweet_count
        + _W_REPLY * post.reply_count
        + _W_QUOTE * post.quote_count
    )


def normalized_engagement(signal: float, follower_count: int) -> float:
    """Follower-floored normalisation (mandate refinement).

    Uses a denominator floor so a 3-follower account with 5 likes doesn't
    outrank a real company. A logarithmic variant is available for reference.
    """
    return signal / max(follower_count, FOLLOWER_FLOOR)


def normalized_engagement_log(signal: float, follower_count: int) -> float:
    """Logarithmic alternative normalisation (documented option)."""
    return signal / math.log1p(max(follower_count, 1))


def apply_engagement_signal(company: Company, posts_by_id: dict[str, RawPost]) -> Company:
    """Compute and attach the Engagement Signal to a company (in place).

    Uses the company's single strongest post so a company isn't penalised for
    also having low-engagement posts. NON-scoring; tie-breaker/flag only.
    """
    best_signal = 0.0
    best_normalized = 0.0
    for pid in set(company.post_ids):
        post = posts_by_id.get(pid)
        if not post:
            continue
        sig = post_engagement_signal(post)
        norm = normalized_engagement(sig, company.max_author_followers)
        if norm > best_normalized:
            best_normalized = norm
            best_signal = sig

    company.engagement_signal = round(best_signal, 2)
    company.engagement_normalized = round(best_normalized, 4)

    # No threshold on product_artifact / founder_transition lanes: those posts
    # always deserve a look. Only early_traction uses the normalised threshold.
    lanes = company.query_lanes_matched
    if lanes & NO_THRESHOLD_LANES:
        company.deserves_closer_look = True
    else:
        company.deserves_closer_look = best_normalized >= CLOSER_LOOK_THRESHOLD
    return company


# ---------------------------------------------------------------------------
# Reply / quote classifier (top 10-15 candidates only, when samples available).
# Deterministic keyword rules. NO LLM required.
# ---------------------------------------------------------------------------
_SPAM_HINTS = ["airdrop", "giveaway", "dm me", "check my bio", "promo", "free crypto", "🚀🚀"]
_CRITICISM_HINTS = ["doesn't work", "broken", "disappointed", "overhyped", "scam", "worse than", "not impressed", "hate"]
_TECH_Q_HINTS = ["how do you", "how does", "does it support", "what about", "can it", "is there an api", "which model", "?"]
_CUSTOMER_INTEREST_HINTS = ["how much", "pricing", "can i try", "sign me up", "is this available", "would love to use", "waitlist"]
_USER_FEEDBACK_HINTS = ["we use", "i use", "been using", "switched to", "in our stack", "our team uses"]
_VALIDATION_HINTS = ["we deployed", "in production for", "saved us", "replaced our", "cut our", "works great in prod"]
_CONGRATS_HINTS = ["congrats", "congratulations", "amazing", "awesome", "love this", "great work", "🔥", "🎉"]


def _any(text: str, hints: list[str]) -> bool:
    return any(h in text for h in hints)


def classify_reply(text: str) -> ReplyClass:
    """Classify a single reply/quote post deterministically."""
    low = text.lower().strip()
    if _any(low, _SPAM_HINTS):
        return ReplyClass.SPAM
    if _any(low, _CRITICISM_HINTS):
        return ReplyClass.CRITICISM
    if _any(low, _VALIDATION_HINTS):
        return ReplyClass.CREDIBLE_THIRD_PARTY_VALIDATION
    if _any(low, _USER_FEEDBACK_HINTS):
        return ReplyClass.EXISTING_USER_FEEDBACK
    if _any(low, _CUSTOMER_INTEREST_HINTS):
        return ReplyClass.POTENTIAL_CUSTOMER_INTEREST
    if _any(low, _TECH_Q_HINTS):
        return ReplyClass.TECHNICAL_QUESTION
    if _any(low, _CONGRATS_HINTS):
        return ReplyClass.GENERIC_CONGRATULATIONS
    # Default: treat short low-signal replies as generic congratulations.
    return ReplyClass.GENERIC_CONGRATULATIONS


def classify_reply_sample(posts: list[RawPost], limit: int = 10) -> list[ReplyClassification]:
    """Classify a bounded sample of reply/quote posts."""
    out: list[ReplyClassification] = []
    for post in posts[:limit]:
        out.append(
            ReplyClassification(
                source_post_id=post.id,
                reply_class=classify_reply(post.text),
                text_excerpt=post.text[:120],
            )
        )
    return out

"""Engagement Signal (non-scoring) and reply/quote classification."""

from __future__ import annotations

from sourcing.aggregate import aggregate
from sourcing.engagement import (
    FOLLOWER_FLOOR,
    apply_engagement_signal,
    classify_reply,
    normalized_engagement,
    post_engagement_signal,
)
from sourcing.filters import extract
from sourcing.models import ReplyClass
from sourcing.scoring import score_company
from tests.conftest import make_post, make_user


def test_follower_floor_prevents_extreme_scores():
    # A 3-follower account with modest engagement must be floored, not extreme.
    tiny = normalized_engagement(10, 3)
    assert tiny == 10 / FOLLOWER_FLOOR  # denominator floored at 500
    big = normalized_engagement(10, 100000)
    assert big < tiny  # larger account => smaller normalized value


def test_post_engagement_weighting():
    post = make_post("1", "hi", like_count=1, retweet_count=1, reply_count=1, quote_count=1)
    # weights: like1 + repost2 + reply2 + quote3 = 8
    assert post_engagement_signal(post) == 8.0


def test_engagement_is_not_in_numeric_score():
    text = "Launched Acme AI code review agent https://acme.ai/docs"
    low = make_post("1", text, urls=["https://acme.ai/docs"], like_count=0)
    high = make_post("2", text, urls=["https://acme.ai/docs"], author_id="u2",
                     like_count=9999, retweet_count=9999, reply_count=9999, quote_count=9999)
    u1, u2 = make_user("u1", "a", followers=500), make_user("u2", "b", followers=500)
    c_low = aggregate([extract(low, u1)], {"u1": u1})[0]
    c_high = aggregate([extract(high, u2)], {"u2": u2})[0]
    s_low = score_company(c_low, text)
    s_high = score_company(c_high, text)
    # Identical evidence => identical numeric score regardless of engagement.
    assert s_low.total_score == s_high.total_score


def test_no_threshold_on_product_artifact_lane():
    post = make_post("1", "just shipped our tool", query_lanes=["product_artifact"], like_count=0)
    user = make_user("u1", "alice", followers=10)
    comp = aggregate([extract(post, user)], {"u1": user})[0]
    apply_engagement_signal(comp, {"1": post})
    # product_artifact lane => always deserves a look, even with zero engagement.
    assert comp.deserves_closer_look is True


def test_early_traction_lane_uses_threshold():
    post = make_post("1", "first customer in production", query_lanes=["early_traction"], like_count=0)
    user = make_user("u1", "alice", followers=100000)
    comp = aggregate([extract(post, user)], {"u1": user})[0]
    apply_engagement_signal(comp, {"1": post})
    # Zero engagement on early_traction => below threshold => not flagged.
    assert comp.deserves_closer_look is False


def test_classify_reply_categories():
    assert classify_reply("How do you handle auth for the agent?") == ReplyClass.TECHNICAL_QUESTION
    assert classify_reply("What's the pricing? Can I try it?") == ReplyClass.POTENTIAL_CUSTOMER_INTEREST
    assert classify_reply("We use this in our stack every day") == ReplyClass.EXISTING_USER_FEEDBACK
    assert classify_reply("We deployed it and it saved us 20 hours") == ReplyClass.CREDIBLE_THIRD_PARTY_VALIDATION
    assert classify_reply("Congrats, amazing work!") == ReplyClass.GENERIC_CONGRATULATIONS
    assert classify_reply("This is broken and overhyped") == ReplyClass.CRITICISM
    assert classify_reply("Free crypto airdrop, dm me") == ReplyClass.SPAM

"""Company-level aggregation, duplicate posts, and duplicate authors."""

from __future__ import annotations

from sourcing.aggregate import aggregate, domain_key, normalize_name
from sourcing.filters import extract
from tests.conftest import make_post, make_user


def _extractions(posts_users):
    exs = []
    users_by_id = {}
    for post, user in posts_users:
        if user:
            users_by_id[user.id] = user
        exs.append(extract(post, user))
    return exs, users_by_id


def test_aggregation_merges_same_domain():
    p1 = make_post("1", "Launching Acme, our AI code review agent https://acme.ai",
                   author_id="u1", urls=["https://acme.ai"])
    p2 = make_post("2", "Acme now supports GitLab too https://acme.ai/changelog",
                   author_id="u2", urls=["https://acme.ai/changelog"])
    u1 = make_user("u1", "alice")
    u2 = make_user("u2", "bob")
    exs, users = _extractions([(p1, u1), (p2, u2)])
    companies = aggregate(exs, users)
    # Same domain => ONE company, not two.
    assert len(companies) == 1
    comp = companies[0]
    assert comp.relevant_post_count == 2
    assert set(comp.founder_handles) == {"alice", "bob"}


def test_aggregation_merges_same_author():
    p1 = make_post("1", "Building an AI agent runtime", author_id="u1")
    p2 = make_post("2", "More on our agent sandbox today", author_id="u1")
    u1 = make_user("u1", "alice", description="founder building agent infra")
    exs, users = _extractions([(p1, u1), (p2, u1)])
    companies = aggregate(exs, users)
    assert len(companies) == 1
    assert companies[0].relevant_post_count == 2


def test_separate_companies_stay_separate():
    p1 = make_post("1", "Acme AI observability https://acme.ai", author_id="u1", urls=["https://acme.ai"])
    p2 = make_post("2", "Beta AI security https://beta.dev", author_id="u2", urls=["https://beta.dev"])
    u1, u2 = make_user("u1", "alice"), make_user("u2", "bob")
    exs, users = _extractions([(p1, u1), (p2, u2)])
    companies = aggregate(exs, users)
    assert len(companies) == 2


def test_duplicate_posts_not_double_counted():
    # Same post id appearing twice must not inflate the post count.
    p1 = make_post("1", "Acme AI https://acme.ai", author_id="u1", urls=["https://acme.ai"])
    u1 = make_user("u1", "alice")
    exs, users = _extractions([(p1, u1), (p1, u1)])
    companies = aggregate(exs, users)
    assert companies[0].relevant_post_count == 1  # de-duplicated by id


def test_normalize_name_strips_corporate_suffixes():
    assert normalize_name("Acme Inc") == "acme"
    assert normalize_name("Acme.ai") == "acme"


def test_domain_key_keeps_distinct_companies_separate():
    # Registrable label preserved; subdomains collapse, distinct SLDs stay apart.
    assert domain_key("acme.ai") == "acme"
    assert domain_key("docs.acme.ai") == "acme"
    assert domain_key("acme-labs.io") == "acmelabs"
    assert domain_key("acme.ai") != domain_key("acme-labs.io")

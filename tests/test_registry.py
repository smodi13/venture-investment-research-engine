"""Organization registry matching rules (exact / subdomain / owner / no-substring)."""

from __future__ import annotations

from sourcing.registry import match_domain, match_github_owner, match_aliases_in_text


def test_exact_and_subdomain_domain_match():
    assert match_domain("microsoft.com").entity_name == "Microsoft"
    assert match_domain("docs.microsoft.com").entity_name == "Microsoft"   # dot-boundary subdomain
    assert match_domain("api.stripe.com").entity_name == "Stripe"
    assert match_domain("aws.amazon.com").entity_name == "Amazon Web Services"


def test_domain_substring_is_rejected():
    assert match_domain("notmicrosoft.com") is None
    assert match_domain("fakereuters.com") is None
    assert match_domain("microsoft.com.evil.com") is None


def test_github_owner_exact_case_insensitive():
    assert match_github_owner("microsoft").entity_name == "Microsoft"
    assert match_github_owner("MICROSOFT").entity_name == "Microsoft"
    assert match_github_owner("aws").entity_name == "Amazon Web Services"


def test_github_owner_substring_rejected():
    assert match_github_owner("microsoft-labs") is None
    assert match_github_owner("notmicrosoft") is None


def test_unregistered_owner_is_none():
    assert match_github_owner("nrkoka786") is None
    assert match_domain("synapse.dev") is None


def test_alias_match_does_not_prove_employment():
    # Alias present in text -> a match object, but it is NOT proof of employment.
    matches = match_aliases_in_text("I love using Microsoft products")
    assert any(m.entity_name == "Microsoft" and m.match_type == "alias" for m in matches)

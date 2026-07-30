"""Company-level aggregation (mandate section 4).

Consolidate posts into one record per company using: company domain, company X
handle, founder X handle, GitHub organisation, and normalised company name.
A single highly active company must not create duplicate candidate records.

Implementation: union-find over posts that share any strong identity key
(domain, github org, or author handle). Weak keys (mentions) are deliberately
NOT used as merge keys to avoid over-merging on a shared big-account mention.
"""

from __future__ import annotations

import re
from typing import Optional

from .filters import PostExtraction
from .models import Claim, Company, EvidenceLevel, RawUser, Signal

_SUFFIX_RE = re.compile(r"\b(inc|llc|ltd|co|corp|ai|io|app|hq|labs|technologies)\b", re.I)


def normalize_name(raw: str) -> str:
    """Normalise a company/domain-derived name for dedup."""
    name = raw.lower().strip()
    name = re.sub(r"https?://", "", name)
    name = name.split("/")[0]
    name = _SUFFIX_RE.sub("", name)
    name = re.sub(r"[^a-z0-9]+", "", name)
    return name


def _domain_root(domain: str) -> str:
    d = domain.lower()
    if d.startswith("www."):
        d = d[4:]
    return d


def domain_key(domain: str) -> str:
    """Stable dedup key from a domain's registrable (second-level) label.

    Unlike :func:`normalize_name`, this does NOT strip corporate suffix words,
    so distinct companies (e.g. ``acme.ai`` vs ``acme-labs.io``) stay separate,
    while subdomains of the same site collapse (``docs.acme.ai`` -> ``acme``).
    """
    host = _domain_root(domain).split("/")[0]
    labels = [p for p in host.split(".") if p]
    if len(labels) >= 2:
        sld = labels[-2]  # label before the TLD
    elif labels:
        sld = labels[0]
    else:
        sld = host
    return re.sub(r"[^a-z0-9]+", "", sld)


def _company_name_from_domain(domain: str) -> str:
    root = _domain_root(domain)
    return root.split(".")[0].replace("-", " ").title()


class _UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))

    def find(self, x: int) -> int:
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a: int, b: int) -> None:
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.parent[rb] = ra


def _strong_keys(ex: PostExtraction, user: Optional[RawUser]) -> set[str]:
    keys: set[str] = set()
    for d in ex.product_domains:
        keys.add(f"domain:{domain_key(d)}")
    for g in ex.github_orgs:
        keys.add(f"gh:{g.lower()}")
    if user and user.username:
        keys.add(f"author:{user.username.lower()}")
    return keys


def aggregate(
    extractions: list[PostExtraction],
    users_by_id: dict[str, RawUser],
) -> list[Company]:
    """Consolidate extractions into deduplicated :class:`Company` records."""
    n = len(extractions)
    uf = _UnionFind(n)
    key_to_idx: dict[str, int] = {}

    ex_keys: list[set[str]] = []
    for i, ex in enumerate(extractions):
        user = users_by_id.get(ex.post.author_id)
        keys = _strong_keys(ex, user)
        ex_keys.append(keys)
        for k in keys:
            if k in key_to_idx:
                uf.union(key_to_idx[k], i)
            else:
                key_to_idx[k] = i

    # Group indices by their union-find root.
    groups: dict[int, list[int]] = {}
    for i in range(n):
        groups.setdefault(uf.find(i), []).append(i)

    companies: list[Company] = []
    for root, idxs in groups.items():
        companies.append(_build_company(idxs, extractions, users_by_id))
    return companies


def _build_company(
    idxs: list[int],
    extractions: list[PostExtraction],
    users_by_id: dict[str, RawUser],
) -> Company:
    post_ids: list[str] = []
    query_groups: set[str] = set()
    query_lanes: set[str] = set()
    artifacts = []
    signals: list[Signal] = []
    founder_claims: list[Claim] = []
    third_party: list[Signal] = []
    founder_handles: list[str] = []
    domains: list[str] = []
    github_orgs: list[str] = []
    max_followers = 0
    has_founder_lang = False
    has_stealth_lang = False

    for i in idxs:
        ex = extractions[i]
        post = ex.post
        post_ids.append(post.id)
        query_groups.update(post.query_groups)
        query_lanes.update(post.query_lanes)
        artifacts.extend(ex.artifacts)
        signals.extend(ex.signals)
        founder_claims.extend(ex.claims)
        third_party.extend(s for s in ex.signals if s.evidence_level == EvidenceLevel.C)
        domains.extend(_domain_root(d) for d in ex.product_domains)
        github_orgs.extend(g.lower() for g in ex.github_orgs)
        has_founder_lang = has_founder_lang or ex.has_founder_language
        has_stealth_lang = has_stealth_lang or ex.has_stealth_language

        user = users_by_id.get(post.author_id)
        if user:
            if user.username and user.username.lower() not in [h.lower() for h in founder_handles]:
                founder_handles.append(user.username)
            max_followers = max(max_followers, user.followers_count)

    domain = domains[0] if domains else None
    github_org = github_orgs[0] if github_orgs else None

    if domain:
        name = _company_name_from_domain(domain)
        canonical = f"domain:{domain_key(domain)}"
    elif github_org:
        name = github_org
        canonical = f"gh:{github_org}"
    elif founder_handles:
        # Stealth / no public product: key on the founder handle.
        u = None
        for i in idxs:
            u = users_by_id.get(extractions[i].post.author_id)
            if u:
                break
        name = (u.name if u and u.name else founder_handles[0])
        canonical = f"author:{founder_handles[0].lower()}"
    else:
        name = "unknown"
        canonical = f"post:{post_ids[0]}"

    is_stealth = (domain is None and github_org is None) and has_founder_lang

    # Company X handle: if a single founder handle and no domain, that's the
    # public handle. Otherwise leave None (company handle unknown deterministically).
    x_handle = founder_handles[0] if founder_handles else None

    return Company(
        canonical_id=canonical,
        name=name,
        domain=domain,
        x_handle=x_handle,
        github_org=github_org,
        founder_handles=founder_handles,
        post_ids=post_ids,
        query_groups_matched=query_groups,
        query_lanes_matched=query_lanes,
        artifacts=artifacts,
        signals=signals,
        founder_claims=founder_claims,
        third_party_signals=third_party,
        max_author_followers=max_followers,
        is_stealth=is_stealth,
    )

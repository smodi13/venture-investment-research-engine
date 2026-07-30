# X Sourcing Engine: command-line engine

A lightweight, **deterministic** command-line engine that discovers early-stage
founders and companies across **AI, robotics and physical AI, biotech tooling,
deep tech infrastructure, and enterprise AI workflow** from recent X posts, and
ranks who is worth contacting for diligence.

> The web app in this repository is the review surface for this engine. See the
> in-app [Engine page](../app/engine/page.tsx) for the reviewer-facing writeup.

Scoring is 100% deterministic Python. The optional LLM step only *summarises*;
it never assigns a numeric score.

## Quick start

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # add your X_BEARER_TOKEN

# Always estimate first (no network calls):
PYTHONPATH=src python -m sourcing.cli --dry-run

# Real run (writes to data/output/):
PYTHONPATH=src python -m sourcing.cli --max-posts 200 --query-group B
```

The bearer token is read from `.env` and **never printed in full** (only a
masked prefix + length).

## Query architecture (3 topics × 3 lanes, ≤6 curated queries)

**Role-topic groups:** `A` AI infrastructure & agent systems · `B` AI-native
developer/infra tools · `C` AI-native enterprise workflows.

**Discovery lanes:** `product_artifact` · `founder_transition` · `early_traction`.

Every query combines one lane with one or more topics. We ship a **curated set of
6** (`config/queries.yaml`), not all 9 lane×topic combinations. A **validator**
(`sourcing/validator.py`) runs *before any API call*: it rejects unsupported
operators (`min_faves:`, `min_replies:`, `min_retweets:`), enforces the allowed
operator set, warns past 512 chars, requires a standalone term alongside
conjunction operators like `has:links`, and prints/logs the exact query.

## Pipeline

search → deterministic extract + exclude → company aggregation (dedup) →
time-decay → **deterministic scoring** → platform-absorption-risk overlay →
Visible Feature Replication Test → classification → top-N enrichment → optional
LLM summaries → outputs.

## Scoring (max 100, deterministic)

Role & Thesis Fit (20) · **Founder-Startup Fit** (15) · Product & Technical
Evidence (20) · Customer Pull & Adoption (15) · Workflow Depth & Retention (15) ·
Defensibility (10) · Shipping Momentum (5). Penalties are configurable and
separate (`config/scoring.yaml`).

- **Founder-Startup Fit** never uses follower count, virality, investor
  followers, or writing-style confidence.
- **Evidence levels** A/B/C/D tag every material claim; customer/traction is
  always labelled by level and never presented as proven traction.
- **Time decay** applies to launch/customer/usage/design-partner/hiring/shipping
  signals only. Enduring facts (founder background, category, architecture) do
  not decay.
- **Discovery Status** and **Engagement Signal** are **non-scoring**. Engagement
  Signal ("this post deserves a closer look", not a quality judgement) is
  computed locally from `public_metrics`, follower-floor normalised, and used
  only as a low-priority tie-breaker; it can never outweigh the core factors.

## Overlays

- **Platform Absorption Risk** (0-100, higher worse) with a category-specific
  absorber lookup (`config/platform_risk.yaml`).
- **Visible Feature Replication Test** (very_low…very_high) with a mandatory
  disclaimer on every result. High risk / low replication is **not**
  eliminated; it routes to *Investigate founder, challenge moat*.

## Outputs (`data/output/`)

`all_candidates.csv` · `top_leads.csv` · `top_leads.md` (full per-lead report) ·
`run_summary.json` · `review.csv` (blank columns for manual human review).

## Cost controls

`--max-posts --max-users --max-timelines --posts-per-timeline --budget-limit
--dry-run --query-group --output-limit`. Usage is estimated before running;
exceeding `--budget-limit` requires interactive confirmation.

### Phased, least-privilege spend

The engine spends in tightly-gated phases. A **counts-only** preflight sizes
volume before any post retrieval and costs ~$0.03 for six queries, so budget it
tightly:

```bash
# Counts only (GET /2/tweets/counts/recent), one frozen shared window:
PYTHONPATH=src python -m sourcing.cli count-preflight --budget-usd 0.05
# or --budget-usd 0.10 ; both are least-privilege for a six-query counts run.

# Regenerate the audit from cached counts with NO network calls:
PYTHONPATH=src python -m sourcing.cli regenerate-audit
```

Volume labels (`empty / very_low / manageable / broad / very_broad`) and their
thresholds live in `config/pricing.yaml`; they describe volume only and never set
a human decision. Cost rates and budgets also live in `config/pricing.yaml`, not
hardcoded in source.

## Tests

```bash
pytest -q
```

Covers dedup, aggregation, founder/stealth detection, agency exclusion, evidence
tagging, time decay, penalty logic, scoring boundaries, missing token, cache
hits, budget limits, the query validator, and Engagement Signal.

## Frozen MVP scope

≤4 query families (now 3 topics × 3 lanes, 6 curated queries) · ≤300 posts · ≤20
enrichments · ≤10 LLM analyses · top 5 manually reviewed · 1 final pick.

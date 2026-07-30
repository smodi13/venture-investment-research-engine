# Venture Sourcing Engine

Source, verify, rank, and diligence emerging private technology companies.

An independent venture capital research platform for identifying real private
companies, evaluating sourcing signals, ranking opportunities by investment
mandate, and developing structured diligence views.

Built by **Sahil Modi**.

> This is an independent work sample built by Sahil Modi. It is not affiliated
> with or endorsed by any investment firm. The private-company universe is based
> on dated public sources. Missing information is identified as not publicly
> disclosed, and investment scores combine verified evidence with clearly
> identified analyst judgment. This is not investment advice.

This repository is an independent venture sourcing work sample. It is not
affiliated with any investment firm and does not modify or connect to any prior
firm-specific repository or deployment.

**Live:** https://venture-investment-research-engine.vercel.app

## Purpose

Most sourcing tools present a company list and hide the reasoning. This one is
built the other way around. Every company entered the pipeline through a
specific, dated signal that is recorded on its page. Every material claim
carries a source. Every factor rating shows its evidence, its confidence, and
whether it rests on verified information or analyst judgment. Where a fact is
not public, the platform says so rather than estimating it.

The result is designed to make disagreement easy. A reader should be able to
reject a specific rating and see exactly which source decided it.

## The private-company sourcing workflow

1. **Identify a market signal.** Start from an observable technical,
   regulatory, commercial, or capital event rather than from a company list.
2. **Discover relevant private companies.** Work along the value chain around
   that signal to find companies positioned against the bottleneck it exposes.
3. **Verify public evidence.** Confirm the company is currently private, and
   source financing, founders, and technical claims against primary and
   corroborating records.
4. **Score mandate relevance and investment quality.** Settle whether the
   company is in scope, then score twelve quality factors.
5. **Add companies to the pipeline.** Track status, priority, the key
   unanswered question, and the next diligence step.
6. **Generate diligence questions and an investment view.** Produce
   company-specific questions and a written view with what would invalidate it.

## Real-company research policy

The sourcing universe contains **18 real private companies**. There are no
fictional companies anywhere in production data.

Every record required all of the following before inclusion:

- A working official company website
- Verification that the company is currently and independently private
- At least one primary source: the company's own site, its own announcement, or
  an official record such as a government or laboratory publication
- At least one independent corroborating publication
- A date last reviewed
- A specific sourcing rationale

A company was excluded if it was publicly traded, acquired, no longer operating
independently, or impossible to verify as currently private. During this
research a private optical interconnect company was found to have been acquired
by a public semiconductor company in February 2026 and was excluded as a result.
That case is documented on the Market Signals page, because it is the clearest
argument for why private status must be re-verified rather than assumed.

**Nothing is estimated.** Revenue, ARR, gross margin, customer counts, contract
values, valuations, ownership, burn, runway, unit economics, and market share
appear only where a company disclosed them publicly with a source attached.
Everything else reads **Not publicly disclosed**, and each record additionally
lists what is missing from the public record.

Commercial funding databases were used as a discovery aid only. They are not
cited as evidence anywhere.

## Public-company market-context policy

> Public companies are included as market signals and comparables. They are not
> venture sourcing candidates and do not appear in the private-company pipeline
> or sourcing rankings.

The separation is structural rather than a filter. Private and public companies
use different TypeScript types. The private type has no ticker, and its
financing stage type has no public member, so a listed company cannot be
represented as a sourcing candidate. The public type carries no score, no
relevance tier, and no pipeline status, so it cannot be ranked.

Public companies appear only on the **Market Signals** route and in clearly
labelled comparable sections, where they are read for capital expenditure
direction, supply constraints, earnings read-through, and competitive context.

## Mandate configuration

Mandates live in `lib/mandates.ts`. A mandate carries:

| Field | Purpose |
| --- | --- |
| `weights` | Points assigned to each of the twelve quality factors, summing to 100 |
| `sectorAffinity` | 0 to 5 affinity per sector |
| `stageAffinity` | 0 to 5 affinity per financing stage |
| `emphasisedSectors` | Sectors the interface surfaces first |
| `additionalDiligence` | Questions appended to every company under the mandate |

The four mandates are Frontier Technology, Enterprise Software, Healthcare
Technology, and Generalist Early Stage.

## Scoring methodology

Scoring runs in two stages, and the order matters.

**Stage one asks whether the company is in scope.** Relevance is the weaker of
the mandate's sector affinity and its stage affinity, on a 0 to 5 scale. This is
a conjunction, not a trade-off: a company has to be both in the right sector and
at the right stage to be core to a mandate.

| Relevance tier | Rating | Multiplier | Score ceiling |
| --- | --- | --- | --- |
| Core to mandate | 5 | 1.00 | 100 |
| Adjacent to mandate | 4 | 0.84 | 84 |
| Peripheral to mandate | 3 | 0.69 | 69 |
| Marginal to mandate | 2 | 0.54 | 54 |
| Outside mandate | 0 to 1 | 0.40 | 40 |

**Stage two asks how good the company is**, across twelve factors: technical
differentiation, technical evidence, defensibility, market importance,
commercial readiness, customer evidence, founder and team credibility, capital
efficiency, competitive intensity, financing risk, regulatory risk, and sourcing
originality.

Each factor shows its rating, weight, evidence, explanation, confidence level,
supporting source, and whether it is a verified fact or analyst judgment.
Ratings are 0 to 5, deliberately coarse, and oriented so 5 is always most
favourable, which on the three risk factors means low risk.

The final score is quality multiplied by the relevance multiplier. Ceilings are
chosen so each tier stops at the top of a band, so **only a company core to the
active mandate can reach priority research**.

Raising more capital is never rewarded. Publishing more information is never
rewarded. A widely covered company scores near zero on sourcing originality and
the platform says so.

| Band | Meaning |
| --- | --- |
| 85 to 100 | Priority research |
| 70 to 84 | Strong watchlist |
| 55 to 69 | Further diligence required |
| Below 55 | Low current priority |

## Data confidence

Every record carries an overall confidence rating, separate from its score.

- **High.** Financing, founders, product, and technical claims are each
  supported by a primary source with independent corroboration.
- **Medium.** Core facts are sourced, but at least one material area rests on a
  single source or on the company's own description.
- **Low.** Public disclosure is thin. The company may still be interesting, and
  the conclusion is correspondingly less certain.

Confidence describes how certain the conclusion is, not how good the company is.

## Source registry

Fifty registered sources, each with subject, title, publisher, type, publication
date, access date, URL, and the specific fact it supports. Only primary sources
and independent corroborating publications are registered. Every link was
checked, opens in a new tab, and uses `rel="noopener noreferrer"`. No
search-results pages are used.

## Pipeline workflow

Ten stages: new lead, initial research, founder outreach, first meeting, deep
diligence, investment memo, partner review, passed, monitoring, invested.

Pipeline status, priority, notes, and next steps are **demonstration workflow
data** showing how the tool is used. They do not indicate that any meeting,
outreach, or investment activity occurred. Company facts are sourced and are not
editable.

Workflow edits are stored in the browser via local storage and can be reset.

## Tech stack

- Next.js 16 (App Router) and React 19 with TypeScript
- Tailwind CSS
- No database, no authentication, no API keys, no external services
- All routes statically prerendered
- Workflow state via `useSyncExternalStore` over local storage

## Local setup

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Testing

```bash
npm run lint            # ESLint
npx tsc --noEmit        # TypeScript
npm run test:integrity  # data-integrity and investment-logic checks
npm run test:e2e        # headless browser suite, needs a running build
```

The **integrity suite** asserts that every company is real and private, that no
public company can reach a ranking or the pipeline, that every company has a
primary and a corroborating source, that missing fields use the not-disclosed
sentinel, that no firm-specific name or em dash appears, that the GitHub link is
present where required, and that no credential pattern or environment variable
appears anywhere.

The **end-to-end suite** runs 66 checks in an isolated headless Chromium
profile: navigation, mandate switching and recalculation, search, filters,
sorting, company details, pipeline editing, local storage persistence, CSV
export, memo generation and download, mobile layout, external link safety, the
custom 404, and browser console output.

```bash
npx playwright install chromium                    # once
BASE=https://your-deployment npm run test:e2e      # or against a deployment
```

## Deployment

Deploys to Vercel as a static site with no configuration:

```bash
npm run build
vercel --prod
```

No environment variables are required.

## Security and token protection

- **No secrets exist in this project.** There are no API keys, tokens, or
  credentials, because there are no external services to authenticate to.
- **No environment variables.** The application reads `process.env` nowhere and
  renders identically with an empty environment. The Vercel project has zero
  environment variables configured.
- **No server-side write path.** Nothing a user changes leaves their browser.
  No database, no account system, no analytics.
- **No secret is ever placed** in client-side JavaScript, React components,
  static data, HTML, local storage, source maps, build output, README examples,
  tests, CI configuration, or Vercel configuration. No `NEXT_PUBLIC_` variable
  carries a credential, because none exists.
- The integrity suite fails if any credential pattern appears in a tracked file.
- `.gitignore` and `.vercelignore` exclude every environment file, key,
  certificate, credential directory, and test artifact. The only environment
  file in Git is `.env.example`, which contains placeholder text and no variable
  assignments.

## Limitations

- **Public information about private companies is thin and uneven.** Private
  companies do not file. What is public is what the company chose to announce.
- **Funding data is self-reported.** Announced round sizes come from interested
  parties, and total raised figures omit unannounced financings.
- **Technical benchmarks are configuration dependent and expire.** Almost none
  of the technical claims here has been independently reproduced, and the
  technical evidence factor is rated accordingly.
- **Scoring models compress judgment into a number.** The factor table exists so
  that the compression can be inspected and disagreed with.
- **This is a dated research snapshot** taken on 30 July 2026. Private status in
  particular expires and must be re-verified before any decision.
- **The universe skews later stage.** Every company is Series B or beyond,
  because earlier-stage companies rarely meet the two-source verification
  standard this platform requires. The Generalist Early Stage mandate is
  therefore under-served by this universe, and the rankings correctly show most
  companies as marginal under it rather than inflating them.

## Source policy

Only primary sources and independent corroborating publications are used.
Excluded as evidence: Crunchbase, PitchBook summaries, LinkedIn descriptions,
search-result snippets, unverified company databases, social media posts,
AI-generated summaries, and unsourced funding lists.

## Project structure

```
app/
  page.tsx             Overview
  mandates/            Mandate configuration and weights
  universe/            Private-company universe and per-company records
  pipeline/            Ten stage investment pipeline
  market-signals/      Public companies, market context only
  thesis/              Featured frontier technology thesis
  intelligence/        Dated market intelligence tracker
  memo/                Investment memo generated from a sourced record
  methodology/         Methodology and source registry
components/            Mandate state, scoring views, evidence display, tables
lib/
  types.ts             Domain types, including the not-disclosed sentinel
  mandates.ts          The four mandates and their weights
  scoring.ts           Relevance gate and twelve factor quality framework
  companies.ts         Universe aggregation
  data/companies-*.ts  Verified private company records
  data/market-signals.ts  Public companies, separate type
  sources.ts           Source registry
  thesis.ts            Featured thesis
  intelligence.ts      Market intelligence entries
  memo.ts              Memo generated from a company record
  rows.ts              Compact client projection with precomputed scores
  storage.ts           Local workflow state
tests/
  integrity.ts         Data-integrity and investment-logic checks
  e2e.js               Headless browser suite
```

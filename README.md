# Venture Investment Research Engine

A configurable sourcing, research, and diligence platform for evaluating
emerging technology companies across private and public markets.

Built by **Sahil Modi** as an independent work sample.

> This is an independent work sample built by Sahil Modi. It is not affiliated
> with or endorsed by any investment firm. Company information is drawn from
> public sources or clearly labeled demonstration data. Investment scores and
> conclusions reflect an illustrative research framework and are not investment
> advice.

This repository is independent from all prior firm-specific work samples and
does not modify or connect to any other Sahil Modi repository or deployment.

## Purpose

Most investment research tools present a number and hide the reasoning. This
one is built the other way around. Every figure carries its provenance, every
factor rating shows the evidence and whether it rests on verified information
or analyst judgment, and the platform states what it does not know rather than
filling the gap with something plausible.

The result is a platform designed to make disagreement easy. A reader should be
able to reject a specific factor rating, not the output as a whole.

## The workflow

The platform demonstrates the complete workflow of a venture or frontier
technology analyst:

1. **Define a mandate.** Four mandate profiles, each with its own factor
   weights, sector and stage affinities, and required diligence.
2. **Review the universe.** Twenty seven companies across eight sectors,
   filterable and sortable on eleven dimensions including mandate relevance.
3. **Rank opportunities.** Relevance is settled first, then twelve weighted
   quality factors produce a score out of 100, recalculated whenever the
   mandate changes.
4. **Research in depth.** Technology, market, commercial, and financial
   assessments per company, with provenance on every claim.
5. **Develop a sector view.** Five sector research pages built around value
   chains and margin position.
6. **Compare across markets.** Up to four companies side by side, with public
   and private figures explicitly distinguished.
7. **Track the pipeline.** Ten stages, with notes, next steps, and priorities.
8. **Write it up.** A complete investment memo, exportable as Markdown, text,
   or print.
9. **Export the research.** CSV export carrying provenance columns alongside
   the values.

## Features

- Four configurable investment mandates that re-weight the entire scoring model
- Transparent two-stage scoring: a mandate relevance gate with published
  multipliers and score ceilings, then twelve weighted quality factors
- Provenance labelling on every figure: reported, analyst estimate,
  requires verification, demonstration data, or not publicly disclosed
- Full company research records covering technology, market, commercial, and
  financial assessment
- Public and private market comparison, with the dimensions that do not compare
  marked as such rather than left blank
- Five sector research pages with value chain maps
- A featured investment thesis on infrastructure for scaled AI inference
- Dated market intelligence tracker with confidence levels
- Ten stage investment pipeline with local workflow state
- Complete demonstration investment memo with copy, download, and print
- Source registry listing every external source and what it supports

## Mandate configuration

Mandates live in `lib/mandates.ts`. A mandate carries:

| Field | Purpose |
| --- | --- |
| `weights` | Points assigned to each of the twelve quality factors, summing to 100 |
| `sectorAffinity` | 0 to 5 affinity per sector, used to derive relevance |
| `stageAffinity` | 0 to 5 affinity per financing stage |
| `emphasisedSectors` | Sectors the interface surfaces first |
| `additionalDiligence` | Questions appended to every company under the mandate |

Relevance is never stored on a company. It is derived at read time as the
weaker of sector affinity and stage affinity, which is what makes every score
in the platform move when the mandate changes.

The four mandates are Frontier Technology, Enterprise Software, Healthcare
Technology, and Generalist Early Stage.

## Scoring methodology

Scoring runs in two stages, and the order matters.

**Stage one asks whether the company is in scope.** Relevance is the weaker of
the mandate's sector affinity and its stage affinity, on a 0 to 5 scale. This
is a conjunction, not a trade-off: a company has to be both in the right sector
and at the right stage to be core to a mandate. Each relevance tier carries a
multiplier and a hard score ceiling.

| Relevance tier | Rating | Multiplier | Score ceiling |
| --- | --- | --- | --- |
| Core to mandate | 5 | 1.00 | 100 |
| Adjacent to mandate | 4 | 0.84 | 84 |
| Peripheral to mandate | 3 | 0.69 | 69 |
| Marginal to mandate | 2 | 0.54 | 54 |
| Outside mandate | 0 to 1 | 0.40 | 40 |

**Stage two asks how good the company is.** Twelve quality factors, weighted
per mandate, totalling 100. Factors are rated 0 to 5, deliberately coarse, so
the model cannot manufacture precision the evidence does not support. Ratings
are oriented so that 5 is always most favourable, which on the four risk
factors means 5 signals low risk.

The final score is the quality score multiplied by the relevance multiplier.

| Band | Meaning |
| --- | --- |
| 85 to 100 | Priority research |
| 70 to 84 | Strong watchlist |
| 55 to 69 | Further diligence required |
| Below 55 | Low current priority |

The ceilings are chosen so that each relevance tier stops at the top of a band.
An adjacent company can reach the top of strong watchlist and no further. **Only
a company core to the active mandate can reach priority research.**

This is a correction to an earlier version of the model, which treated mandate
fit as one weighted factor among thirteen. That produced an indefensible
result: under the healthcare mandate the highest ranked company was a
semiconductor business, because eleven strong quality factors will always
outvote one weak fit factor. The company was excellent and the arithmetic was
correct, and the answer was still wrong. Relevance is not a quality to be traded
against other qualities. It is a precondition, and it is now modelled as one.

Nothing is hardcoded per company. Sector and stage affinities live on the
mandate, quality ratings live on the company, and neither knows about the other.

The highest band is called priority research, not buy. It means the company has
earned analyst time this week. No score in this platform is a recommendation.

Every factor rating carries the evidence behind it and a label stating whether
it rests on verified information or analyst judgment. Each company page reports
the proportion, and shows the quality score before adjustment alongside the tier
that reduced it, so a low score can be read as low relevance rather than as a
poor business.

## Company data methodology

The universe is 27 companies: 12 public and 15 private. They are researched
differently, and the difference is stated everywhere they appear.

**Public companies are real.** Their qualitative profiles are drawn from widely
published information about what the company sells and how it competes.
Financial figures are expressed as dated ranges labelled as analyst estimates,
never as reported point values. A static file cannot hold a current market
capitalisation or gross margin, and presenting one as though it could would be
the most misleading thing this platform could do. Where a figure exists in
filings but was not verified in this build, the interface says so explicitly
and links to the primary source rather than guessing.

**Private companies are demonstration data.** All fifteen are fictional and
labelled as such. This is an integrity decision, not a shortcut. Private
companies do not file, so a research record on a real one would consist of
funding-database figures and inference presented with unwarranted confidence.
Writing invented revenue or invented customers onto a real private company
would be indefensible. The companies here are modelled on real archetypes in
each value chain, and the research structure applied to them is exactly the
structure that would be applied to a real one. Only the facts are synthetic.

## Public versus private market treatment

Categorical dimensions such as capital intensity, commercial readiness, market
maturity, and technical differentiation are analyst assessments applied on the
same scale to both, so they compare directly. Scores compare directly for the
same reason.

Financial dimensions do not compare. A public company reports revenue growth
and gross margin; a private company reports nothing. The comparison view states
this in each affected row rather than leaving a blank cell, because an empty
cell reads as a small number rather than as an absence.

No private-company valuation is published anywhere. A funding-database
valuation is a post-money figure from a single negotiated transaction, often
stale and frequently reported by an interested party. Treating it as comparable
to a market capitalisation would be a category error.

## Featured thesis: infrastructure for scaled AI inference

Training built the current AI infrastructure market. Inference will decide who
keeps it.

Training and inference are different workloads with different economics.
Training rewards peak arithmetic throughput and tolerates proprietary software.
Inference rewards memory bandwidth, low latency, and portability. As deployed
compute shifts toward inference, the binding constraint moves from arithmetic
toward memory, interconnect, power, and heat, which relocates margin down the
stack into layers historically valued as industrial businesses.

The thesis covers the value chain layer by layer, names who captures margin at
each, and gives its disproving questions the same weight as its argument. It
publishes no market-size figure, because a defensible one is not available and
an indefensible one would weaken the argument rather than support it.

## Tech stack

- Next.js 16 (App Router) and React 19 with TypeScript
- Tailwind CSS
- No database, no authentication, no API keys, no external services
- All 41 routes are statically prerendered
- Workflow state uses browser local storage, read through
  `useSyncExternalStore`

The full research corpus stays on the server. Pages send a compact row
projection to the browser with scores precomputed for all four mandates, which
is what lets the mandate selector re-rank the universe instantly without a
round trip and without shipping the research prose to the client.

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

Lint and typecheck:

```bash
npm run lint
npx tsc --noEmit
```

## Testing

Two suites. An investment-logic suite asserts economic reasonableness of the
rankings: that quality weights sum to 100, that relevance ceilings are enforced,
that no off-thesis company can reach priority research under any mandate, that
the top of every ranking is on-thesis, and that all four mandates produce
distinct top-five lists.

```bash
npx tsx tests/rankings.ts
```

An end-to-end suite runs in an isolated headless Chromium profile and covers
56 checks: navigation across every route, mandate switching and score
recalculation, search, filters, sorting, four-way comparison, company detail
views, pipeline edits, local storage persistence across a refresh, CSV export
contents, memo copy and download, mobile layout and navigation, external link
safety, the custom 404, browser console output, and per-mandate assertions that
off-thesis companies never render as priority research.

```bash
npx playwright install chromium   # once
npm run build && npm start        # in one terminal
npm run test:e2e                  # in another

# Or point it at any deployment:
BASE=https://venture-investment-research-engine.vercel.app npm run test:e2e
```

## Deployment

Deploys to Vercel as a static site with no configuration:

```bash
npm run build
vercel --prod
```

No environment variables are required. `.vercelignore` keeps local artifacts
out of the upload.

## Security

- **No secrets exist in this project.** There are no API keys, no tokens, and
  no credentials, because there are no external services to authenticate to.
- **No server-side write path.** Nothing a user changes leaves their browser.
  There is no database, no account system, and no analytics.
- **No environment variables.** The application cannot leak configuration it
  does not have. It renders identically with an empty environment.
- **No user input reaches a server.** Search, filters, notes, and workflow
  edits are all client-side state.
- `.env` files are gitignored. `.env.example` documents that no variables are
  required.
- External links are limited to the source registry in `lib/sources.ts`, all
  primary sources, all opened with `rel="noopener noreferrer"`.

## Limitations

Stated plainly, and expanded on the methodology page:

- **Public information is incomplete and lagging.** Filings describe a quarter
  that has ended, aggregated to a level the company chooses.
- **Funding databases are not a source of truth**, which is why this platform
  does not use them.
- **Market-size estimates are the least reliable input available.** None is
  published anywhere in this platform.
- **Technical benchmarks are configuration dependent** and expire quickly.
- **This is a static snapshot.** Public-market figures are dated 31 March 2026;
  the intelligence tracker was assembled 28 July 2026. There is no live feed,
  and the interface says so rather than implying freshness it does not have.

## Source policy

Only primary sources are registered: company investor relations material and
the SEC EDGAR filing system. Secondary coverage and commercial funding
databases are deliberately excluded.

No source is invented. Demonstration companies carry no external links at all,
because a fictional company cannot have a real filing behind it. Every
registered source lists what it supports and when it was last checked, and the
full registry is published on the methodology page.

## Project structure

```
app/
  page.tsx             Overview
  mandates/            Mandate configuration and weight comparison
  universe/            Company universe and per-company research records
  sectors/             Sector research and value chain maps
  thesis/              Featured investment thesis
  intelligence/        Dated market intelligence tracker
  memo/                Demonstration investment memo
  pipeline/            Ten stage investment pipeline
  methodology/         Methodology and source registry
components/            Mandate state, scoring views, provenance display, tables
lib/
  types.ts             Domain types and the provenance model
  mandates.ts          The four mandates and their weights
  scoring.ts           Relevance gate and twelve factor quality framework
  companies.ts         Universe aggregation
  data/                Public and private company records
  sectors.ts           Sector research
  thesis.ts            Featured thesis
  intelligence.ts      Market intelligence entries
  memo.ts              Demonstration memo
  sources.ts           Source registry
  rows.ts              Compact client projection with precomputed scores
  storage.ts           Local workflow state
```

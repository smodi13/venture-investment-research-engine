# X Sourcing Engine

A venture sourcing workflow that finds **technical founders through X signals
before they appear clearly in PitchBook, Crunchbase, or other mainstream startup
databases**.

Built by **Sahil Modi** as an independent demonstration project.

> This project is an independent demonstration. It is not affiliated with,
> endorsed by, or representing any investment firm or X Corp.

## The premise

A database profile is a lagging indicator. It exists because something already
happened: a round closed, a launch got covered, an accelerator published its
cohort, and at that point every fund watching the category sees the company in
the same week.

The months before that are not quiet. Technical founders spend them publishing:
arguing with a benchmark, releasing a library, posting a demo that half works,
complaining about a workflow they have run a hundred times. This engine treats
that window as the sourcing surface, and turns those posts into structured
sourcing cards an Investment Associate can act on.

Coverage spans early technical markets rather than one narrow sector: AI drug
discovery infrastructure, robotics and physical AI, enterprise AI workflow
automation, biotech tooling, deep tech infrastructure, and technical software
with strong founder-market fit.

## What the site does

- **Overview:** the sourcing thesis, the signal taxonomy, the five-step
  workflow, and the scoring weights.
- **Pipeline:** leads surfaced from X signals, with filters for signal type,
  database visibility, category, region, stage, status, capital raised, and
  minimum score. Sortable by score, earliness, recency, or capital raised.
- **Lead card:** the originating X post and its provenance, why it cleared the
  noise filter, what corroborated it, evidence tagged by confidence, concerns,
  diligence questions, a drafted outreach note, and the full scoring breakdown.
- **Engine:** how queries are built and validated, how noise is filtered, how
  claims are corroborated, the cost governance behind live X API runs, and the
  limits and failure modes of sourcing this way.
- **Workflow:** move a lead through the pipeline, add notes, export filtered
  leads to CSV, copy the outreach draft, reset the demo. Status and notes are
  stored in the browser only.

## Signal taxonomy

Seven post shapes, ordered by how hard they are to fake:

| Signal type | What it looks like |
| --- | --- |
| Product demo | Uncut video, failures left in |
| Open-source release | Benchmarks with a published regression case |
| Technical thread | Original data with a non-obvious conclusion |
| Recurring problem discussion | The same problem, posted for months |
| Customer pain point | A quantified complaint from inside the industry |
| Hiring signal | A role that reveals the roadmap |
| Build-in-public update | Shipping cadence with real numbers |

## Scoring model

Nine factors, fixed published weights, totalling 100. The weighting is the
argument: founder depth, signal quality, and earliness carry 45 points between
them, because when a company is still invisible those are the only things
reliably observable. Traction and market sizing are scored but capped.

| Factor | Points |
| --- | --- |
| Founder-market fit & technical depth | 18 |
| Signal strength & specificity | 14 |
| Earliness vs. mainstream databases | 13 |
| Thesis fit | 12 |
| Evidence of early demand | 12 |
| Technical differentiation | 11 |
| Market size & durability | 9 |
| Why now | 6 |
| Stage fit | 5 |

A company that already has a complete database profile scores near zero on
earliness by design. One such lead is retained in the demo pipeline as a
calibration example.

The score is a **sort order for a partner's attention**, never a decision. No
lead advances on score alone.

## Demonstration data

The public deployment works immediately with **no API key required**. Every
company shown is a **clearly labeled illustrative sample**. Company names,
founder names, X handles, post text, engagement counts, funding figures, and
lead times are invented to demonstrate the workflow, and no factual claim is
made about any real business, account, or person. Sample links resolve to
`example.com` on purpose.

The dataset was built to exercise the interface honestly rather than
flatteringly: it spans strong and weak leads, includes founder-reported claims
that have not been verified, contains stealth records with almost no evidence,
and keeps one lead the engine surfaced too late to be useful.

## Tech stack

- Next.js 16 (App Router) and React 19 with TypeScript
- Tailwind CSS
- No database. The demo dataset is bundled; workflow state uses browser local
  storage.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Project structure

```
app/                   Next.js routes
  page.tsx             Overview, the sourcing narrative
  pipeline/            Sourcing dashboard
  engine/              How the engine works, and its limits
  api/source/          Server-side sourcing endpoint (demo-safe)
components/            Nav, lead table, filters, analytics, signal card,
                       lead detail panel, badges
lib/                   Demo dataset, types, scoring model, CSV export, storage
docs/ENGINE.md         Documentation for the underlying CLI sourcing engine
src/, config/, tests/  The governed Python sourcing engine (see below)
```

## Live sourcing and security

The web app runs in demonstration mode and needs no secrets. The optional,
**governed CLI sourcing engine** (Python, in `src/`, `config/`, and `tests/`)
performs real X API sourcing behind a query validator, a counts-only preflight,
explicit cost budgets, and human confirmation. Scoring there is fully
deterministic Python; any LLM step only summarizes already-scored text and never
assigns a number. See [`docs/ENGINE.md`](docs/ENGINE.md).

Security practices:

- API credentials are read only from `process.env` on the server and are never
  sent to the browser. The `/api/source` route reports only whether a credential
  is present, never its value.
- Live, paid sourcing is deliberately **not** exposed as a one-click web action,
  so a reviewer cannot accidentally spend money.
- `.env` files are gitignored; `.env.example` documents variables without real
  values.
- The web app never depends on a secret to render, so it degrades gracefully if
  external APIs fail, rate-limit, or are unconfigured.

## Environment variables

The **web app requires none**. The variables below only enable the optional CLI
engine (see `.env.example`):

| Variable | Required | Purpose |
| --- | --- | --- |
| `X_BEARER_TOKEN` | No (CLI only) | X API access for the governed CLI engine |
| `ANTHROPIC_API_KEY` | No (CLI only) | Optional LLM summary step in the CLI |

## Deployment (Vercel)

This deploys as its own Vercel project, separate from any other project in the
account. There is no linked `.vercel/` directory in the repo, so the first
deploy will prompt for a new project name.

```bash
npm run build                                        # verify a clean build
vercel link --yes --project venture-investment-research-engine
vercel --prod                                        # promote to production
```

No environment variables are needed for the public demo. `.vercelignore` keeps
the Python engine, its data, and all local artifacts out of the upload.

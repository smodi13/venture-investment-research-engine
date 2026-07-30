import Link from "next/link";
import { UNIVERSE_ROWS } from "@/lib/rows";
import { UNIVERSE_STATS } from "@/lib/companies";
import { INTELLIGENCE } from "@/lib/intelligence";
import { THESIS } from "@/lib/thesis";
import { SITE, WORKFLOW } from "@/lib/site";
import { MARKET_SIGNAL_DISCLOSURE } from "@/lib/data/market-signals";
import { TopSourced, PipelineSummary } from "@/components/OverviewPanels";
import { DisclosureNote, GitHubLink, StatTile } from "@/components/ui";
import { formatDate } from "@/lib/format";

export default function OverviewPage() {
  const latest = [...INTELLIGENCE]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">
              Venture sourcing platform · Independent work sample
            </p>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              {SITE.headline}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              {SITE.description}
            </p>
            <p className="mt-4 rounded-lg border border-accent-line bg-accent-soft px-4 py-3 text-sm leading-relaxed text-ink-soft">
              <span className="font-semibold text-ink">Central question. </span>
              {SITE.centralQuestion}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Built by {SITE.author}. Every company in the sourcing universe is
              a real, currently private company verified against dated public
              sources. Missing information is shown as not publicly disclosed
              rather than estimated.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/universe" className="btn-primary">
                Explore the private-company universe
              </Link>
              <Link href="/market-signals" className="btn-secondary">
                Review market signals
              </Link>
              <GitHubLink variant="button" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-canvas">
        <div className="container-page py-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              value={String(UNIVERSE_STATS.total)}
              label="Verified private companies"
              hint="All real, all confirmed independently private"
            />
            <StatTile
              value={String(UNIVERSE_STATS.sectorCount)}
              label="Sectors covered"
              hint="AI infrastructure through healthcare technology"
            />
            <StatTile
              value={String(UNIVERSE_STATS.headquartersCount)}
              label="Headquarters locations"
              hint="Inside and outside the largest venture hubs"
            />
            <StatTile
              value="0"
              label="Public or fictional companies"
              hint="Neither can exist in the sourcing universe by type"
            />
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="border-b border-line">
        <div className="container-page py-12">
          <h2 className="h-section">The sourcing workflow</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            Six steps, from an observable market signal through to a written
            investment view. Each one is a working part of the platform rather
            than a description of one.
          </p>
          <ol className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {WORKFLOW.map((s) => (
              <li key={s.n} className="card p-5">
                <span className="font-mono text-xs font-semibold text-accent">
                  {s.n}
                </span>
                <h3 className="mt-1.5 text-sm font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Top sourced */}
      <section className="border-b border-line bg-canvas">
        <div className="container-page py-12">
          <h2 className="h-section">Top sourced companies</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            The mandate is the configuration the whole platform reads from.
            Changing it re-weights every quality factor and re-ranks every
            company, immediately and everywhere.
          </p>
          <div className="mt-6">
            <TopSourced rows={UNIVERSE_ROWS} />
          </div>
        </div>
      </section>

      {/* Thesis and pipeline */}
      <section className="border-b border-line">
        <div className="container-page grid gap-6 py-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="card p-5 sm:p-6">
              <p className="eyebrow mb-2">Featured thesis</p>
              <h3 className="text-lg font-semibold tracking-tight text-ink">
                {THESIS.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-ink-soft">
                {THESIS.subtitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {THESIS.summary}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="label">Technical bottlenecks</p>
                  <ul className="space-y-1 text-xs leading-relaxed text-ink-soft">
                    {THESIS.technicalBottlenecks.slice(0, 3).map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="label">Questions that could disprove it</p>
                  <ul className="space-y-1 text-xs leading-relaxed text-ink-soft">
                    {THESIS.disprovingQuestions.slice(0, 2).map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link
                href="/thesis"
                className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
              >
                Read the full thesis
              </Link>
            </div>
          </div>
          <PipelineSummary rows={UNIVERSE_ROWS} />
        </div>
      </section>

      {/* Market signals note */}
      <section className="border-b border-line bg-canvas">
        <div className="container-page py-12">
          <h2 className="h-section">How public companies are used</h2>
          <p className="mt-3 max-w-3xl rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
            {MARKET_SIGNAL_DISCLOSURE}
          </p>
          <Link
            href="/market-signals"
            className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
          >
            Review market signals
          </Link>
        </div>
      </section>

      {/* Latest intelligence */}
      <section className="border-b border-line">
        <div className="container-page py-12">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="h-section">Latest market intelligence</h2>
            <Link
              href="/intelligence"
              className="text-sm font-medium text-accent hover:underline"
            >
              Full tracker
            </Link>
          </div>
          <ul className="mt-5 divide-y divide-line">
            {latest.map((e) => (
              <li key={e.id} className="py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <time
                    dateTime={e.date}
                    className="font-mono text-xs text-ink-muted"
                  >
                    {formatDate(e.date)}
                  </time>
                  <span className="chip">{e.category}</span>
                  <span className="chip">{e.sector}</span>
                </div>
                <h3 className="mt-1.5 text-sm font-medium text-ink">
                  {e.subject}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {e.summary}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Disclosure */}
      <section>
        <div className="container-page py-12">
          <h2 className="h-section">How to read this platform</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-ink">
                Every company is real and private
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Each record was confirmed to be an independently private
                company on {formatDate(SITE.snapshotDate)}, with financing,
                founders, and technical claims sourced to a primary record and
                an independent corroborating publication.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-ink">
                Missing information is shown, not filled in
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Revenue, margins, customer counts, valuations, and unit
                economics appear only where a company disclosed them publicly.
                Everything else reads not publicly disclosed, and each record
                lists what is absent.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-ink">
                Scores organise judgment
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Every factor shows its rating, evidence, confidence, source, and
                whether it rests on verified information or analyst judgment.
                Each record also carries an overall data confidence rating.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <GitHubLink variant="button" />
            <Link
              href="/methodology"
              className="text-sm font-medium text-accent hover:underline"
            >
              Read the methodology
            </Link>
          </div>
          <DisclosureNote className="mt-6" />
        </div>
      </section>
    </div>
  );
}

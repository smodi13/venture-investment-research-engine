import Link from "next/link";
import { UNIVERSE_ROWS } from "@/lib/rows";
import { UNIVERSE_STATS } from "@/lib/companies";
import { INTELLIGENCE } from "@/lib/intelligence";
import { SECTOR_RESEARCH } from "@/lib/sectors";
import { THESIS } from "@/lib/thesis";
import { SITE } from "@/lib/site";
import { MandatePreview, PipelineSummary } from "@/components/OverviewPanels";
import { DisclosureNote, StatTile } from "@/components/ui";
import { formatDate } from "@/lib/format";

const STEPS = [
  {
    n: "01",
    title: "Define a mandate",
    body: "Choose one of four mandate profiles. The mandate sets the factor weights, the sector and stage affinities, and the extra diligence every company must answer.",
    href: "/mandates",
  },
  {
    n: "02",
    title: "Review the universe",
    body: "Twenty seven companies across private and public markets, filterable by sector, stage, geography, capital intensity, commercial readiness, and mandate relevance.",
    href: "/universe",
  },
  {
    n: "03",
    title: "Rank and compare",
    body: "Relevance is settled first, then twelve weighted quality factors produce a score out of 100, with the evidence shown for every rating. Compare up to four companies side by side.",
    href: "/universe",
  },
  {
    n: "04",
    title: "Research in depth",
    body: "Technology, market, commercial, and financial assessments for each company, with provenance attached to every figure and claim.",
    href: "/universe",
  },
  {
    n: "05",
    title: "Develop a sector view",
    body: "Five sector research pages built around value chains and margin position rather than around market-size estimates.",
    href: "/sectors",
  },
  {
    n: "06",
    title: "Track and write it up",
    body: "Move companies through a ten stage pipeline, then produce an investment memo and export the research for review.",
    href: "/pipeline",
  },
];

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
              Investment research platform · Independent work sample
            </p>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              {SITE.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              {SITE.subtitle}
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              {SITE.opening}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Built by {SITE.author}. Every figure carries its provenance, every
              score shows the evidence behind it, and the platform states what
              it does not know rather than filling the gap.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/universe" className="btn-primary">
                Explore Company Universe
              </Link>
              <Link href="/thesis" className="btn-secondary">
                Review Featured Thesis
              </Link>
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
              label="Companies under research"
              hint={`${UNIVERSE_STATS.publicCount} public, ${UNIVERSE_STATS.privateCount} private`}
            />
            <StatTile
              value={String(UNIVERSE_STATS.sectorCount)}
              label="Sectors covered"
              hint="AI infrastructure through healthcare technology"
            />
            <StatTile
              value="12"
              label="Quality factors"
              hint="Re-weighted by each mandate, then scaled by relevance"
            />
            <StatTile
              value={String(UNIVERSE_STATS.demonstrationCount)}
              label="Demonstration records"
              hint="Fictional companies, labelled everywhere they appear"
            />
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="border-b border-line">
        <div className="container-page py-12">
          <h2 className="h-section">The workflow</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            Six steps, from an investment mandate through to an exported memo.
            Each one is a working part of the platform rather than a
            description of one.
          </p>
          <ol className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="card-hover p-5">
                <Link href={s.href} className="block">
                  <span className="font-mono text-xs font-semibold text-accent">
                    {s.n}
                  </span>
                  <h3 className="mt-1.5 text-sm font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {s.body}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Mandate selector and ranking */}
      <section className="border-b border-line bg-canvas">
        <div className="container-page py-12">
          <h2 className="h-section">Configure the mandate</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            The mandate is the configuration the whole platform reads from.
            Changing it re-weights every factor and re-ranks every company,
            immediately and everywhere.
          </p>
          <div className="mt-6">
            <MandatePreview rows={UNIVERSE_ROWS} />
          </div>
        </div>
      </section>

      {/* Thesis, pipeline, intelligence */}
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
                  <p className="label">Key bottlenecks</p>
                  <ul className="space-y-1 text-xs leading-relaxed text-ink-soft">
                    {THESIS.bottlenecks.slice(0, 3).map((b) => (
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

      {/* Sectors */}
      <section className="border-b border-line bg-canvas">
        <div className="container-page py-12">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="h-section">Sector research</h2>
            <Link
              href="/sectors"
              className="text-sm font-medium text-accent hover:underline"
            >
              All sector research
            </Link>
          </div>
          <ul className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {SECTOR_RESEARCH.map((s) => (
              <li key={s.slug} className="card-hover p-5">
                <Link href={`/sectors/${s.slug}`} className="block">
                  <h3 className="text-sm font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {s.summary}
                  </p>
                  <span className="chip mt-3 inline-flex">{s.maturity}</span>
                </Link>
              </li>
            ))}
          </ul>
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
                Public companies are real
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Their qualitative profiles come from widely published
                information. Financial figures are dated ranges labelled as
                analyst estimates, never reported point values, because a static
                file cannot hold a current margin or market capitalisation.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-ink">
                Private companies are demonstration data
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Every private company here is fictional and labelled as such.
                Private companies do not file, and inventing revenue or
                customers for a real one would be the worst thing this platform
                could do.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-ink">
                Scores organise judgment
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Every factor shows its rating, its evidence, and whether it
                rests on verified information or analyst judgment. The model is
                built to make disagreement easy, not to produce an answer.
              </p>
            </div>
          </div>
          <DisclosureNote className="mt-6" />
        </div>
      </section>
    </div>
  );
}

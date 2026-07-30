import Link from "next/link";
import { COMPANIES } from "@/lib/companies";
import { SCORE_FACTORS, MAX_SCORE, companyTotal } from "@/lib/scoring";
import { SIGNAL_TYPES, THESIS_CATEGORIES } from "@/lib/types";
import { SignalCard } from "@/components/SignalCard";

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

const medianLeadTime = median(COMPANIES.map((c) => c.daysAheadOfDatabases));
const notListed = COMPANIES.filter((c) => c.visibility === "Not listed").length;
const preInstitutional = COMPANIES.filter(
  (c) => c.fundingRaisedUSD === 0,
).length;

/** The highest-scoring lead, used as the worked example on this page. */
const featured = [...COMPANIES].sort(
  (a, b) => companyTotal(b) - companyTotal(a),
)[0];

const steps = [
  {
    n: "01",
    title: "Query",
    body: "Standing queries run against the X API for the signal shapes that precede a company: benchmarked open-source releases, uncut product demos, technical threads with original data, hiring posts for telling roles, and repeated discussion of one unsolved problem.",
  },
  {
    n: "02",
    title: "Filter",
    body: "Most matches are noise. The filter drops commentary, engagement farming, and accounts with no build history, and keeps posts carrying something checkable: a number, a repository, a video, or a job requisition.",
  },
  {
    n: "03",
    title: "Corroborate",
    body: "Before a lead is scored, the signal has to be confirmed somewhere it was not posted: a repository creation date, a domain registration, a job listing, a bio change, or a reply from an identifiable practitioner.",
  },
  {
    n: "04",
    title: "Score",
    body: `Nine published factors totalling ${MAX_SCORE}. Founder depth, signal quality, and earliness carry 45 points between them, because those are the only things reliably observable this early.`,
  },
  {
    n: "05",
    title: "Hand to a human",
    body: "The output is a sourcing card, not a decision: the signal and its provenance, evidence tagged by confidence, concerns, diligence questions, and a drafted outreach note that references the actual post.",
  },
];

const signalExamples: Record<string, string> = {
  "Technical thread": "Original data with a non-obvious conclusion",
  "Product demo": "Uncut video, failures left in",
  "Open-source release": "Benchmarks with a published regression case",
  "Hiring signal": "A role that reveals the roadmap",
  "Customer pain point": "A quantified complaint from inside the industry",
  "Recurring problem discussion": "The same problem, posted for months",
  "Build-in-public update": "Shipping cadence with real numbers",
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-20 sm:py-24">
          {/* The hero is the one block that is centered as a unit. */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-4">
              Venture sourcing workflow · Independent demonstration
            </p>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Technical founders post about the problem
              <span className="text-accent"> months before</span> they appear in
              a database.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              The X Sourcing Engine watches for those posts. It turns early
              founder signals on X, including technical threads, product demos,
              open-source releases, hiring posts, and repeated complaints about
              one specific problem, into structured sourcing cards an Investment
              Associate can act on.
            </p>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-muted">
              Built by Sahil Modi as an independent demonstration of early-stage
              venture sourcing, across AI, robotics and physical AI, biotech
              tooling, deep tech infrastructure, and enterprise AI workflow.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/pipeline" className="btn-primary">
                Open the pipeline
              </Link>
              <Link href="/engine" className="btn-secondary">
                How the engine works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="border-b border-line bg-canvas">
        <div className="container-page py-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                value: `${medianLeadTime}d`,
                label: "Median lead time",
                hint: "between the X signal and a mainstream database profile",
              },
              {
                value: `${notListed}/${COMPANIES.length}`,
                label: "Not yet in databases",
                hint: "no Crunchbase or PitchBook profile when surfaced",
              },
              {
                value: String(preInstitutional),
                label: "Pre-institutional",
                hint: "stealth leads with no disclosed capital raised",
              },
              {
                value: String(THESIS_CATEGORIES.length),
                label: "Technical categories",
                hint: "AI, robotics, biotech tooling, deep tech, and software",
              },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-mono text-3xl font-semibold tracking-tight text-ink">
                  {s.value}
                </div>
                <div className="mt-1.5 text-sm font-medium text-ink">
                  {s.label}
                </div>
                <div className="mx-auto mt-1 max-w-[22rem] text-xs leading-relaxed text-ink-muted">
                  {s.hint}
                </div>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-xs text-ink-muted">
            Figures describe the demonstration dataset on this site, which is
            illustrative rather than a record of live sourcing.
          </p>
        </div>
      </section>

      {/* Suggested review path: orientation for a reviewer with two minutes. */}
      <section className="border-b border-line bg-accent-soft">
        <div className="container-page py-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-3">Start here</p>
            <h2 className="h-section">Suggested review path</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
              About two minutes if you want the short version.
            </p>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Open the pipeline, sort by highest score",
                body: "The default sort is already highest score. The ranking sets reading order, not a recommendation.",
              },
              {
                n: "02",
                title: "Click the top lead",
                body: "The card opens with the X post that surfaced it, what corroborated it before scoring, evidence tagged by confidence, concerns, diligence questions, and a drafted outreach note.",
              },
              {
                n: "03",
                title: "Read the engine page",
                body: "Covers query filtering, corroboration, the scoring weights, the cost governance behind the command-line engine, and where human review sits.",
              },
            ].map((s) => (
              <li key={s.n} className="card p-5">
                <div className="font-mono text-xs font-semibold text-accent">
                  {s.n}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/pipeline" className="btn-primary text-sm">
              Start with the pipeline
            </Link>
            <Link href="/engine" className="btn-secondary text-sm">
              Read the engine page
            </Link>
          </div>
        </div>
      </section>

      {/* The gap */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="h-section">The sourcing gap this closes</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-soft">
                <p>
                  By the time a pre-seed company has a complete profile in
                  PitchBook or Crunchbase, the interesting part of the sourcing
                  work is over. A profile exists because something already
                  happened: a round closed, a launch was covered, an accelerator
                  published a cohort. Every fund watching that category sees it
                  in the same week.
                </p>
                <p>
                  The months before that are not quiet. A technical founder
                  spends them publishing: arguing with a benchmark, releasing a
                  library, posting a demo that does not quite work, complaining
                  about a workflow they have run a hundred times. That material
                  is public, timestamped, and largely unindexed by the tools
                  investors actually use.
                </p>
                <p>
                  This engine treats that window as the sourcing surface. It is
                  a lightweight workflow, not a data moat: standing queries, a
                  strict noise filter, corroboration before scoring, and a
                  transparent score whose only job is to order a human&rsquo;s
                  reading list.
                </p>
              </div>
            </div>
            <div>
              <div className="label">
                Worked example: highest-scoring lead in the demo pipeline
              </div>
              <SignalCard
                signal={featured.signal}
                visibility={featured.visibility}
                daysAhead={featured.daysAheadOfDatabases}
                compact
              />
              <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                <span className="font-medium text-ink-soft">
                  {featured.name}
                </span>{" "}
                · {featured.category} · {featured.hq} · scored{" "}
                <span className="font-mono">{companyTotal(featured)}</span>/
                {MAX_SCORE}.{" "}
                <Link
                  href="/pipeline"
                  className="font-medium text-accent hover:underline"
                >
                  Open the full card
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signal taxonomy */}
      <section className="border-b border-line bg-canvas">
        <div className="container-page py-14">
          <h2 className="h-section text-center">What counts as a signal</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-relaxed text-ink-soft">
            Seven post shapes, ordered by how hard they are to fake. A demo with
            the failure left in is worth more than a well-argued opinion, and
            the scoring model reflects that.
          </p>
          <div className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {SIGNAL_TYPES.map((type, i) => (
              <div
                key={type}
                className="border-t border-line-strong pt-3.5"
              >
                <div className="font-mono text-[11px] text-ink-muted">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-1 text-sm font-semibold text-ink">{type}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                  {signalExamples[type]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-14">
          <h2 className="h-section text-center">From post to sourcing card</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-relaxed text-ink-soft">
            Five steps, each one designed to leave a trail a partner can audit.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((s) => (
              <div key={s.n} className="card p-5">
                <div className="font-mono text-xs font-semibold text-accent">
                  {s.n}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The human counterpart to the pipeline steps above. */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-14">
          <h2 className="h-section">
            How this maps to an Associate workflow
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            The engine handles the mechanical part. The judgment stays with the
            person. This is where an Associate sits in the loop.
          </p>
          <ol className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                n: "01",
                title: "Build a thesis",
                body: "Decide which technical markets are worth covering, and write down what a promising signal looks like before running any search.",
              },
              {
                n: "02",
                title: "Run targeted queries",
                body: "Standing queries per topic and discovery lane, rather than broad keyword sweeps that return the same well-covered companies.",
              },
              {
                n: "03",
                title: "Filter the noise",
                body: "Drop commentary, engagement farming, and accounts with no build history. Keep posts carrying something checkable.",
              },
              {
                n: "04",
                title: "Convert signals into sourcing cards",
                body: "One card per lead, with the originating post, its corroboration, and evidence tagged by how firmly it is established.",
              },
              {
                n: "05",
                title: "Review concerns and diligence questions",
                body: "Read the concerns before the thesis fit, and confirm estimated fields in conversation rather than treating them as findings.",
              },
              {
                n: "06",
                title: "Move only the strongest to partner review",
                body: "A partner sees a short, documented list with the reasoning attached, not the raw feed.",
              },
            ].map((s) => (
              <li key={s.n} className="border-t border-line-strong pt-3.5">
                <div className="font-mono text-[11px] text-ink-muted">
                  {s.n}
                </div>
                <h3 className="mt-1 text-sm font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Scoring */}
      <section className="border-b border-line bg-canvas">
        <div className="container-page py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="h-section">A score that shows its work</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-soft">
                <p>
                  Nine factors, fixed weights, published in full. The score is a
                  sort order for a partner&rsquo;s attention. It decides
                  reading order, never whether to invest.
                </p>
                <p>
                  The weighting is the argument. Founder depth, signal quality,
                  and earliness carry 45 of the 100 points, because when a
                  company is still invisible those are the only things you can
                  actually observe. Traction and market sizing are scored but
                  capped, since at this stage they are the inputs most likely to
                  be wrong.
                </p>
                <p>
                  A company that already has a complete database profile scores
                  near zero on earliness by design. One such lead is kept in the
                  demo pipeline as a calibration example.
                </p>
              </div>
            </div>
            <div className="card p-5">
              <div className="space-y-2.5">
                {SCORE_FACTORS.map((f) => (
                  <div key={f.key}>
                    <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
                      <span className="font-medium text-ink-soft">
                        {f.label}
                      </span>
                      <span className="shrink-0 font-mono tabular-nums text-ink-muted">
                        {f.max}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${(f.max / 18) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t border-line pt-3 text-xs text-ink-muted">
                Bars show each factor&rsquo;s maximum weight. Full definitions
                are on the{" "}
                <Link
                  href="/engine"
                  className="font-medium text-accent hover:underline"
                >
                  engine page
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limits */}
      <section className="border-b border-line bg-surface">
        <div className="container-page py-14">
          <h2 className="h-section text-center">
            What this deliberately does not do
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "It does not decide",
                body: "No lead advances on score alone. Moving a company to partner review requires a human reading the concerns section, and the score is explicitly a reading order rather than a recommendation.",
              },
              {
                title: "It does not confuse signal with traction",
                body: "A viral post means attention, not demand. Every evidence item is tagged Observed, Founder-reported, or Inferred, and founder-reported claims are never presented as proven.",
              },
              {
                title: "It does not scale by volume",
                body: "The value is a small number of well-documented leads a partner will actually read. Widening the filter to produce more rows would make the output worse, not better.",
              },
            ].map((c) => (
              <div key={c.title} className="border-t-2 border-ink pt-4">
                <h3 className="text-sm font-semibold text-ink">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap: scoped deliberately, so the omissions read as choices. */}
      <section className="border-b border-line bg-canvas">
        <div className="container-page py-14">
          <h2 className="h-section">What I would build next</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            Left out of this demo on purpose. Each one is a small addition to the
            same workflow rather than a different product.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "Lightweight CRM view",
                body: "Leads grouped by status with an owner and a next action, so the pipeline works as a queue rather than a table to browse.",
              },
              {
                title: "Follow-up history",
                body: "A dated log of contact attempts and founder replies on each card, so the same company does not get sourced twice by two people.",
              },
              {
                title: "Portfolio theme matching",
                body: "Flag when a new signal sits adjacent to an existing portfolio company or an active thesis, which is usually what makes a lead worth a call this week.",
              },
              {
                title: "Weekly partner-ready digest",
                body: "The strongest new signals by category, short enough to read before a Monday partner meeting.",
              },
            ].map((c) => (
              <div key={c.title} className="card p-5">
                <h3 className="text-sm font-semibold text-ink">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-14">
        <div className="card flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              See {COMPANIES.length} leads and the signals behind them
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              Filter by signal type and database visibility, open any lead for
              its full provenance and scoring breakdown, move it through the
              pipeline, and export the result.
            </p>
          </div>
          <Link href="/pipeline" className="btn-primary whitespace-nowrap">
            Open the pipeline
          </Link>
        </div>
      </section>
    </div>
  );
}

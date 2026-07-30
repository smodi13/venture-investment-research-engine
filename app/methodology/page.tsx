import type { Metadata } from "next";
import { FACTORS, SCORE_BANDS, weightTotal } from "@/lib/scoring";
import { MANDATES } from "@/lib/mandates";
import { SOURCES } from "@/lib/sources";
import { UNIVERSE_STATS } from "@/lib/companies";
import { PROVENANCE_LABEL, PROVENANCE_NOTE } from "@/lib/types";
import type { Provenance } from "@/lib/types";
import { ProvenanceBadge } from "@/components/Provenance";
import { BulletList, DisclosureNote, PageHeader, Section } from "@/components/ui";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Methodology and source registry",
  description:
    "How companies are sourced, how mandates change the scoring, how estimates are labelled, and every source the research rests on.",
};

const PROVENANCE_ORDER: Provenance[] = [
  "reported",
  "estimate",
  "unverified",
  "demonstration",
  "not-disclosed",
];

const LIMITATIONS = [
  {
    title: "Public information is incomplete and lagging",
    body: "Filings describe a quarter that has already ended. Segment reporting is aggregated to a level the company chooses. Anything a company is not required to disclose, and would rather not, is generally absent. Every public-company figure here should be read as a starting point for verification.",
  },
  {
    title: "Funding databases are not a source of truth",
    body: "Private funding figures in commercial databases are frequently incomplete, delayed, or reported by an interested party. This platform does not use them. That is a large part of why the private companies here are demonstration records rather than real companies carrying database-derived numbers.",
  },
  {
    title: "Market-size estimates are the least reliable input available",
    body: "Top-down sizing for emerging technology markets has been wrong in both directions repeatedly, often by an order of magnitude. No market-size figure is published anywhere in this platform. Sector analysis argues from value chain structure and margin position instead, both of which are observable.",
  },
  {
    title: "Technical benchmarks are configuration dependent",
    body: "Accelerator, alignment, and manipulation benchmarks all depend heavily on setup, software version, and the specific workload. A benchmark more than two quarters old should generally be treated as expired, and any single number should be read as a claim about a specific configuration rather than about a technology.",
  },
  {
    title: "This is a static snapshot",
    body: "There is no live data feed. Public-market figures are dated as of 31 March 2026 and the intelligence tracker was assembled on 28 July 2026. A production version of this platform would carry an explicit refresh cadence per data type, with staleness surfaced in the interface.",
  },
];

export default function MethodologyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Methodology"
        title="How this platform reaches its conclusions"
        intro="Everything on this page exists so that a reader can disagree with a specific step rather than with the output as a whole. The weights are published, the evidence behind each rating is shown, the provenance of every figure is attached to the figure, and the limitations are stated rather than implied."
      />

      <div className="container-page space-y-12 py-10">
        <Section
          title="How companies are sourced"
          description="Two different processes, because public and private companies cannot be researched the same way."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-ink">
                Public companies ({UNIVERSE_STATS.publicCount})
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Selected by working along the value chain of the featured
                thesis and identifying the listed companies operating at each
                layer, then adding public comparison anchors for the other
                sectors. Qualitative profiles are drawn from widely published
                information about what the company sells and how it competes.
                Financial figures are expressed as dated ranges labelled as
                analyst estimates.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-ink">
                Private companies ({UNIVERSE_STATS.privateCount})
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                All are fictional demonstration records, modelled on real
                archetypes at each layer of the same value chains. This is a
                deliberate integrity decision. A private company does not file,
                so a research record on a real one would consist of database
                figures and inference presented with unwarranted confidence.
                Writing invented revenue or customers onto a real private
                company would be indefensible, so the platform models instead.
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="How mandate selection works"
          description="The mandate is not a filter. It is the configuration the scoring model reads from."
        >
          <div className="content-column space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              Selecting a mandate does four things. It replaces the weight
              assigned to each of the thirteen factors. It supplies the sector
              and stage affinities that produce the mandate-fit rating, which is
              the one factor never stored on a company and always derived at
              read time. It determines which sectors the interface emphasises.
              And it appends additional diligence questions that every company
              under that mandate must answer.
            </p>
            <p>
              The mandate-fit rating blends sector affinity and stage affinity,
              weighted two to one toward sector. A company in the right sector
              at the wrong stage is still partially relevant to a mandate; a
              company in the wrong sector rarely is.
            </p>
            <p>
              Companies outside the active mandate are deliberately retained in
              the universe rather than hidden, so that the effect of switching
              mandates stays visible. A low score under one mandate is a
              statement about fit, not about quality.
            </p>
          </div>
        </Section>

        <Section
          title="How scoring weights change"
          description="Each column sums to 100. The differences are each mandate's argument about what matters."
        >
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line-strong text-left">
                  <th className="py-3 pl-4 pr-3 font-semibold text-ink">
                    Factor
                  </th>
                  {MANDATES.map((m) => (
                    <th
                      key={m.id}
                      className="py-3 px-3 text-right font-semibold text-ink"
                    >
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FACTORS.map((f) => (
                  <tr key={f.key} className="border-b border-line">
                    <td className="py-2.5 pl-4 pr-3 text-ink-soft">
                      {f.label}
                      {f.isRisk && (
                        <span className="ml-2 text-xs text-ink-muted">
                          (risk factor)
                        </span>
                      )}
                    </td>
                    {MANDATES.map((m) => (
                      <td
                        key={m.id}
                        className="py-2.5 px-3 text-right font-mono tabular-nums text-ink-soft"
                      >
                        {m.weights[f.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-line-strong">
                  <td className="py-3 pl-4 pr-3 font-semibold text-ink">
                    Total
                  </td>
                  {MANDATES.map((m) => (
                    <td
                      key={m.id}
                      className="py-3 px-3 text-right font-mono font-semibold tabular-nums text-ink"
                    >
                      {weightTotal(m)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft">
            Factors are rated 0 to 5, deliberately coarse, so the model cannot
            manufacture precision the underlying evidence does not support.
            Ratings are oriented so that 5 is always the most favourable
            reading, which on the four risk factors means 5 signals low risk.
            The weighted total is rounded to a whole number.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SCORE_BANDS.map((b) => (
              <div key={b.label} className="card p-4">
                <p className="font-mono text-xs font-semibold text-ink-muted">
                  {b.range}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-ink">
                  {b.label}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                  {b.meaning}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="How analyst judgment is identified"
          description="Every factor rating is labelled as resting on verified information or on analyst judgment, and the label is shown next to the rating."
        >
          <div className="content-column space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              A rating is marked verified when it rests on something a reader
              could check: a disclosed figure, a reported segment, a published
              filing. It is marked judgment when it rests on an assessment that
              reasonable analysts could disagree about, such as how defensible a
              position will prove or how a competitive field will develop.
            </p>
            <p>
              Most private-company ratings are judgment by necessity, and every
              company page shows the proportion. This matters because a score of
              74 built mostly from verified inputs is a materially different
              object from a score of 74 built mostly from judgment, and the
              number alone does not distinguish them.
            </p>
          </div>
        </Section>

        <Section
          title="How estimates are labelled"
          description="Every figure in the platform carries one of five provenance labels, attached to the figure itself rather than to a legend elsewhere on the page."
        >
          <div className="space-y-2">
            {PROVENANCE_ORDER.map((p) => (
              <div
                key={p}
                className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-start sm:gap-4"
              >
                <div className="sm:w-44 sm:shrink-0">
                  <ProvenanceBadge provenance={p} />
                  <p className="mt-1.5 text-sm font-medium text-ink">
                    {PROVENANCE_LABEL[p]}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {PROVENANCE_NOTE[p]}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="How public and private companies are compared"
          description="They are compared on the dimensions where comparison is meaningful, and explicitly not on the ones where it is not."
        >
          <div className="content-column space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              Categorical dimensions such as capital intensity, commercial
              readiness, market maturity, and technical differentiation are
              analyst assessments applied on the same scale to both, so they
              compare directly. Scores compare directly for the same reason.
            </p>
            <p>
              Financial dimensions do not. A public company reports revenue
              growth and gross margin; a private company does not report
              anything. The comparison view states this in each affected row
              rather than leaving a blank cell, because an empty cell reads as a
              small number rather than as an absence.
            </p>
            <p>
              No private-company valuation is published anywhere in this
              platform. A funding-database valuation is a post-money figure from
              a single negotiated transaction, often stale and frequently
              reported by an interested party, and treating it as comparable to
              a market capitalisation would be a category error.
            </p>
          </div>
        </Section>

        <Section
          title="Data refresh requirements"
          description="What a production version of this platform would need to re-verify, and how often."
        >
          <div className="content-column">
            <BulletList
              items={[
                "Public-company financials: every quarter, on filing, from the primary document rather than from a summary",
                "Market capitalisation and valuation multiples: daily, and never stored in a static file",
                "Technical benchmarks: every two quarters, since results expire with software versions",
                "Regulatory and export control status: on change, since these have moved at short notice",
                "Private-company records: on each direct contact with the company, since there is no filing to rely on",
                "Source registry links: quarterly, to catch reorganised investor relations sites",
              ]}
            />
          </div>
        </Section>

        <Section
          title="Limitations"
          description="The constraints that apply to this research, stated directly rather than left for a reader to discover."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {LIMITATIONS.map((l) => (
              <div key={l.title} className="card p-5">
                <h3 className="text-sm font-semibold text-ink">{l.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {l.body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Why this supports rather than replaces judgment"
          description=""
        >
          <div className="content-column space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              The scoring model does not decide anything. It organises evidence
              so that a disagreement can be located precisely: not &ldquo;I do
              not like this company&rdquo; but &ldquo;I think defensibility is a
              4 rather than a 2, and here is why&rdquo;. That is a more
              productive argument, and it is
              the only real justification for putting a number on a company at
              all.
            </p>
            <p>
              The bands reinforce this. The highest band is called priority
              research, not buy. It means the company has earned analyst time
              this week. No score in this platform is a recommendation, and the
              factor that measures how overlooked a company is carries the
              smallest weight in every mandate, because being early is only
              valuable when the other twelve factors already hold.
            </p>
          </div>
        </Section>

        <Section
          title="Source registry"
          description="Every external source the research rests on, with what it supports and when it was last checked. Demonstration companies carry no external sources, because a fictional company cannot have a real filing behind it."
        >
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[48rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line-strong text-left">
                  <th className="py-3 pl-4 pr-3 font-semibold text-ink">
                    Source
                  </th>
                  <th className="py-3 px-3 font-semibold text-ink">Type</th>
                  <th className="py-3 px-3 font-semibold text-ink">Subject</th>
                  <th className="py-3 px-3 font-semibold text-ink">
                    Fact supported
                  </th>
                  <th className="py-3 pl-3 pr-4 font-semibold text-ink">
                    Accessed
                  </th>
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((s) => (
                  <tr key={s.id} className="border-b border-line align-top">
                    <td className="py-3 pl-4 pr-3">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-accent hover:underline"
                      >
                        {s.name}
                      </a>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-ink-soft">
                      {s.type}
                    </td>
                    <td className="py-3 px-3 text-ink-soft">{s.subject}</td>
                    <td className="max-w-md py-3 px-3 text-xs leading-relaxed text-ink-muted">
                      {s.supports}
                    </td>
                    <td className="py-3 pl-3 pr-4 whitespace-nowrap text-ink-muted">
                      {formatDate(s.accessDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">
            {SOURCES.length} registered sources. Only primary sources are used:
            company investor relations material and the SEC EDGAR filing system.
            Secondary coverage and commercial funding databases are deliberately
            excluded.
          </p>
        </Section>

        <DisclosureNote />
      </div>
    </div>
  );
}

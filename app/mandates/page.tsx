import type { Metadata } from "next";
import { MANDATES } from "@/lib/mandates";
import { FACTORS, weightTotal } from "@/lib/scoring";
import { UNIVERSE_ROWS } from "@/lib/rows";
import { MandatePreview } from "@/components/OverviewPanels";
import {
  BulletList,
  CrossLink,
  DisclosureNote,
  PageHeader,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Investment mandates",
  description:
    "Four configurable investment mandates, each with its own factor weights, sector and stage affinities, and required diligence.",
};

export default function MandatesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Configuration"
        title="Investment mandates"
        intro="A mandate is the configuration object the entire platform reads from. It carries the quality weights, the sector and stage affinities that set each company's relevance tier and score ceiling, the sectors emphasised in the interface, and the additional diligence every company must answer. Changing it changes the ranking, the score composition, the stated rationale, and the diligence list."
      />

      <section className="container-page py-10">
        <MandatePreview rows={UNIVERSE_ROWS} />
        <p className="mt-6 rounded-lg border border-line bg-canvas p-4 text-sm leading-relaxed text-ink-soft">
          <span className="font-medium text-ink">
            Relevance is applied before quality.{" "}
          </span>
          A company is rated on how well it matches the sectors and stages of
          the mandate, taking the weaker of the two. That rating sets a multiplier
          and a hard score ceiling, so a company outside the mandate cannot
          reach the top of the ranking on company quality alone. Only companies
          core to the active mandate can reach priority research.{" "}
          <CrossLink href="/methodology">See the full adjustment</CrossLink>.
        </p>
      </section>

      <section className="border-t border-line bg-canvas">
        <div className="container-page py-10">
          <h2 className="h-section">Quality weights by mandate</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            These are the twelve quality weights, and each column sums to 100.
            They decide how good a company looks, not whether it is in scope.
            Relevance is settled first, as a separate stage that caps the final
            score, and is explained on the methodology page. The differences
            between the columns are the argument each mandate makes about what
            matters, published rather than hidden inside the scoring code.
          </p>
          <div className="mt-5 card overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-sm">
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
                {FACTORS.map((f) => {
                  const values = MANDATES.map((m) => m.weights[f.key]);
                  const max = Math.max(...values);
                  return (
                    <tr key={f.key} className="border-b border-line align-top">
                      <td className="py-3 pl-4 pr-3">
                        <div className="font-medium text-ink">{f.label}</div>
                        <p className="mt-1 max-w-lg text-xs leading-relaxed text-ink-muted">
                          {f.description}
                        </p>
                      </td>
                      {MANDATES.map((m) => {
                        const v = m.weights[f.key];
                        return (
                          <td
                            key={m.id}
                            className={`py-3 px-3 text-right font-mono tabular-nums ${
                              v === max
                                ? "font-semibold text-accent"
                                : "text-ink-soft"
                            }`}
                          >
                            {v}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
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
        </div>
      </section>

      <section className="border-t border-line">
        <div className="container-page space-y-8 py-10">
          <h2 className="h-section">Mandate detail</h2>
          {MANDATES.map((m) => (
            <article key={m.id} className="card p-5 sm:p-6">
              <h3 className="text-lg font-semibold tracking-tight text-ink">
                {m.name}
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
                {m.summary}
              </p>
              <p className="mt-3 rounded-lg border border-accent-line bg-accent-soft px-4 py-3 text-sm leading-relaxed text-ink-soft">
                <span className="font-semibold text-ink">
                  Central question.{" "}
                </span>
                {m.centralQuestion}
              </p>
              <div className="mt-5 grid gap-6 md:grid-cols-3">
                <div>
                  <p className="label">Focus areas</p>
                  <BulletList items={m.focusAreas} />
                </div>
                <div>
                  <p className="label">Typical stages</p>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {m.typicalStages}
                  </p>
                  <p className="label mt-4">Emphasised sectors</p>
                  <BulletList items={m.emphasisedSectors} />
                </div>
                <div>
                  <p className="label">Additional diligence required</p>
                  <BulletList items={m.additionalDiligence} />
                </div>
              </div>
              <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-ink-soft">
                <span className="font-semibold text-ink">
                  How this mandate reads a score.{" "}
                </span>
                {m.scoringNote}
              </p>
            </article>
          ))}
          <DisclosureNote />
        </div>
      </section>
    </div>
  );
}

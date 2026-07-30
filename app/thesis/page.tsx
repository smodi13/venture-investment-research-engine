import type { Metadata } from "next";
import Link from "next/link";
import { THESIS } from "@/lib/thesis";
import { rowsForIds } from "@/lib/rows";
import { DemonstrationBadge } from "@/components/Provenance";
import { BulletList, DisclosureNote, PageHeader, Section } from "@/components/ui";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Featured thesis: infrastructure for scaled AI inference",
  description: THESIS.summary,
};

export default function ThesisPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Featured investment thesis"
        title={THESIS.title}
        intro={THESIS.subtitle}
      >
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ink-soft">
          {THESIS.summary}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="chip">
            Snapshot as of {formatDate(THESIS.snapshotDate)}
          </span>
          <span className="chip">
            Last reviewed {formatDate(THESIS.lastReviewed)}
          </span>
        </div>
      </PageHeader>

      <div className="container-page space-y-12 py-10">
        <div className="content-column space-y-10">
          {THESIS.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="h-section">{section.heading}</h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((p) => (
                  <p key={p} className="text-sm leading-relaxed text-ink-soft">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <Section
          title="Value chain and where the constraint sits"
          description="Each layer carries the constraint that binds it and a plain statement of who captures the margin there."
        >
          <div className="space-y-3">
            {THESIS.valueChain.map((layer) => {
              const pub = rowsForIds(layer.publicIds);
              const priv = rowsForIds(layer.privateIds);
              return (
                <div key={layer.layer} className="card p-5">
                  <h3 className="text-sm font-semibold text-ink">
                    {layer.layer}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    <span className="font-medium text-ink">Constraint. </span>
                    {layer.constraint}
                  </p>
                  <p className="mt-2 rounded-lg border border-accent-line bg-accent-soft px-3 py-2 text-xs leading-relaxed text-ink-soft">
                    <span className="font-semibold text-ink">
                      Margin capture.{" "}
                    </span>
                    {layer.whoCaptures}
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="label">Public companies</p>
                      <div className="flex flex-wrap gap-1.5">
                        {pub.length > 0 ? (
                          pub.map((c) => (
                            <Link
                              key={c.id}
                              href={`/universe/${c.id}`}
                              className="chip hover:border-accent hover:text-accent"
                            >
                              {c.name}
                            </Link>
                          ))
                        ) : (
                          <span className="text-xs text-ink-muted">
                            None tracked at this layer
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="label">Private companies</p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {priv.length > 0 ? (
                          priv.map((c) => (
                            <span
                              key={c.id}
                              className="inline-flex items-center gap-1"
                            >
                              <Link
                                href={`/universe/${c.id}`}
                                className="chip hover:border-accent hover:text-accent"
                              >
                                {c.name}
                              </Link>
                              <DemonstrationBadge />
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-ink-muted">
                            None tracked at this layer
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Key technical bottlenecks">
          <div className="content-column">
            <BulletList items={THESIS.bottlenecks} tone="risk" />
          </div>
        </Section>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-800">
              Bull case
            </h2>
            <div className="mt-3">
              <BulletList items={THESIS.bullCase} tone="positive" />
            </div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-800">
              Bear case
            </h2>
            <div className="mt-3">
              <BulletList items={THESIS.bearCase} tone="risk" />
            </div>
          </div>
        </div>

        <Section title="Investment implications">
          <div className="content-column">
            <BulletList items={THESIS.investmentImplications} />
          </div>
        </Section>

        <Section
          title="Risks"
          description="Four risks that apply across every position in this thesis rather than to any one of them."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {THESIS.risks.map((r) => (
              <div key={r.risk} className="card p-4">
                <h3 className="text-sm font-semibold text-ink">{r.risk}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {r.detail}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Questions that could disprove this thesis"
          description="A thesis is only useful if it can be wrong. These are the questions that would change the view, given the same weight as the argument itself."
        >
          <div className="content-column">
            <ol className="space-y-3">
              {THESIS.disprovingQuestions.map((q, i) => (
                <li
                  key={q}
                  className="flex gap-3 rounded-lg border border-line bg-surface p-4"
                >
                  <span className="font-mono text-xs font-semibold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-ink-soft">
                    {q}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        <Section title="Sources and snapshot dates">
          <div className="content-column space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              This thesis rests on the public-company profiles in the research
              universe, each of which links to the investor relations material
              and SEC filings it draws on. The complete source registry is
              published on the{" "}
              <Link
                href="/methodology"
                className="font-medium text-accent hover:underline"
              >
                methodology page
              </Link>
              .
            </p>
            <p>
              Financial figures referenced anywhere in this thesis are dated
              analyst estimates expressed as ranges, taken as of{" "}
              {formatDate(THESIS.snapshotDate)}. Private companies referenced
              here are demonstration records and are fictional. No market-size
              estimate is published, because a defensible one is not available
              and an indefensible one would weaken the argument rather than
              support it.
            </p>
          </div>
        </Section>

        <DisclosureNote />
      </div>
    </div>
  );
}

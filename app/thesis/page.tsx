import type { Metadata } from "next";
import Link from "next/link";
import { THESIS } from "@/lib/thesis";
import { ValueChain } from "@/components/ValueChain";
import { MARKET_SIGNAL_DISCLOSURE } from "@/lib/data/market-signals";
import { getSource } from "@/lib/sources";
import { COMPANIES } from "@/lib/companies";
import {
  BulletList,
  DisclosureNote,
  PageHeader,
  Section,
} from "@/components/ui";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Featured thesis: infrastructure for scaled AI inference",
  description: THESIS.summary,
};

export default function ThesisPage() {
  // Every private company named anywhere in the thesis value chain.
  const namedIds = [...new Set(THESIS.valueChain.flatMap((l) => l.privateIds))];
  const named = namedIds
    .map((id) => COMPANIES.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div>
      <PageHeader
        eyebrow="Featured frontier technology thesis"
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
          <span className="chip">{named.length} private companies named</span>
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
          title="Value chain map"
          description="Where the constraint sits at each layer, who captures the margin, and which private companies are positioned there."
        >
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            {MARKET_SIGNAL_DISCLOSURE}
          </p>
          <ValueChain layers={THESIS.valueChain} />
        </Section>

        <Section
          title="Investment opportunities"
          description="The private companies in the verified sourcing universe positioned against this thesis. Public companies above are context only."
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {named.map((c) => (
              <li key={c.id} className="card-hover p-4">
                <Link href={`/universe/${c.id}`} className="block">
                  <h3 className="text-sm font-semibold text-ink">{c.name}</h3>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="chip">{c.sector}</span>
                    <span className="chip">{c.financing.stage}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                    {c.technicalDifferentiation}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <div className="grid gap-8 lg:grid-cols-2">
          <Section title="Technical bottlenecks">
            <BulletList items={THESIS.technicalBottlenecks} tone="risk" />
          </Section>
          <Section title="Commercial bottlenecks">
            <BulletList items={THESIS.commercialBottlenecks} tone="risk" />
          </Section>
        </div>

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
          description="A thesis is only useful if it can be wrong. These are given the same weight as the argument itself."
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

        <Section
          title="Sources"
          description="Every private company named above carries its own dated sources on its record. The sources supporting this thesis are listed here."
        >
          <ul className="space-y-2">
            {named.flatMap((c) =>
              c.sourceIds.map((id) => {
                const src = getSource(id);
                if (!src) return null;
                return (
                  <li key={`${c.id}-${id}`} className="text-sm">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent hover:underline"
                    >
                      {src.title}
                    </a>
                    <span className="text-ink-muted">
                      {" "}
                      ({src.publisher}, published {formatDate(src.published)},
                      accessed {formatDate(src.accessed)})
                    </span>
                  </li>
                );
              }),
            )}
          </ul>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft">
            No market-size figure appears anywhere in this thesis. Top-down
            sizing for this category has been wrong in both directions
            repeatedly, and a number would add false precision to an argument
            that stands on structure instead.
          </p>
        </Section>

        <DisclosureNote />
      </div>
    </div>
  );
}

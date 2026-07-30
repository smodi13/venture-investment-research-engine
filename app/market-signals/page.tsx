import type { Metadata } from "next";
import Link from "next/link";
import {
  MARKET_SIGNALS,
  MARKET_SIGNAL_DISCLOSURE,
} from "@/lib/data/market-signals";
import { COMPANY_BY_ID } from "@/lib/companies";
import { getSource } from "@/lib/sources";
import { BulletList, DisclosureNote, PageHeader, Section } from "@/components/ui";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Market signals",
  description:
    "Public companies used as market signals and comparables. They are not venture sourcing candidates and do not appear in the private-company pipeline or sourcing rankings.",
};

export default function MarketSignalsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Market context"
        title="Market signals and comparables"
        intro="Public companies inform a private-company thesis by showing where capital is being spent, what is constrained, and where margin is currently captured. They are read here as indicators, not as opportunities."
      />

      <div className="container-page space-y-10 py-10">
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium leading-relaxed text-amber-900">
          {MARKET_SIGNAL_DISCLOSURE}
        </p>

        <Section
          title="Why these companies are here"
          description="Each entry states what the company signals and, just as importantly, what it does not tell you."
        >
          <div className="space-y-4">
            {MARKET_SIGNALS.map((s) => {
              const related = s.relatedPrivateIds
                .map((id) => COMPANY_BY_ID[id])
                .filter(Boolean);
              return (
                <article key={s.id} className="card p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-tight text-ink">
                      {s.name}
                    </h3>
                    <span className="chip">{s.ticker}</span>
                    <span className="chip">{s.exchange}</span>
                    <span className="chip border-amber-200 bg-amber-50 text-amber-800">
                      Public company, market signal only
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">{s.sector}</p>

                  <div className="mt-4 grid gap-5 lg:grid-cols-2">
                    <div>
                      <p className="label">What it signals</p>
                      <p className="text-sm leading-relaxed text-ink-soft">
                        {s.whatItSignals}
                      </p>
                    </div>
                    <div>
                      <p className="label">How to read it</p>
                      <p className="text-sm leading-relaxed text-ink-soft">
                        {s.howToRead}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-5 lg:grid-cols-2">
                    <div>
                      <p className="label">Used for</p>
                      <BulletList items={s.signalUses} />
                    </div>
                    <div>
                      <p className="label">
                        Related private sourcing candidates
                      </p>
                      {related.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {related.map((c) => (
                            <Link
                              key={c.id}
                              href={`/universe/${c.id}`}
                              className="chip hover:border-accent hover:text-accent"
                            >
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-ink-muted">
                          None tracked against this signal.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-3 text-xs text-ink-muted">
                    <span>Reviewed {formatDate(s.lastReviewed)}</span>
                    {s.sourceIds.map((id) => {
                      const src = getSource(id);
                      if (!src) return null;
                      return (
                        <a
                          key={id}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-accent hover:underline"
                        >
                          {src.publisher}
                        </a>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </Section>

        <Section
          title="A worked example of why this separation matters"
          description="The clearest argument for keeping public companies out of the sourcing universe came from the research itself."
        >
          <div className="content-column space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              During this research, a private optical interconnect company was a
              credible sourcing candidate: strong technology, strong investors,
              and a position in a layer of the AI value chain that is growing
              faster than accelerator volumes.
            </p>
            <p>
              Verification found that a public semiconductor company had
              completed its acquisition in February 2026. It was therefore no
              longer an independently private company, and it was excluded from
              the universe entirely.
            </p>
            <p>
              That is the practical reason this platform keeps the two
              categories structurally separate rather than merely filtered.
              Private status is a fact that expires, and a sourcing engine that
              cannot tell the difference between a target and a comparable will
              eventually present one as the other.
            </p>
          </div>
        </Section>

        <DisclosureNote />
      </div>
    </div>
  );
}

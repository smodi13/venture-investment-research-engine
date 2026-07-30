import type { Metadata } from "next";
import Link from "next/link";
import { SECTOR_RESEARCH } from "@/lib/sectors";
import { UNIVERSE_ROWS } from "@/lib/rows";
import { DisclosureNote, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sector research",
  description:
    "Value chain research across AI infrastructure, robotics and autonomy, quantum technology, biotechnology and research tools, and energy and advanced materials.",
};

export default function SectorsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Sector research"
        title="Five sectors, described through their value chains"
        intro="Each sector is analysed through where margin accrues along the value chain rather than through a market-size figure. Top-down sizing is the least reliable input available this early in a technology cycle, and this platform deliberately does not publish one."
      />

      <section className="container-page space-y-4 py-10">
        {SECTOR_RESEARCH.map((s) => {
          const companies = UNIVERSE_ROWS.filter((r) =>
            s.sectors.includes(r.sector),
          );
          return (
            <article key={s.slug} className="card-hover p-5 sm:p-6">
              <Link href={`/sectors/${s.slug}`} className="block">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight text-ink">
                    {s.title}
                  </h2>
                  <span className="chip">{s.maturity}</span>
                  <span className="chip">{companies.length} companies</span>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
                  {s.summary}
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="label">Value chain layers</p>
                    <p className="text-xs leading-relaxed text-ink-soft">
                      {s.valueChain.map((l) => l.name).join(" · ")}
                    </p>
                  </div>
                  <div>
                    <p className="label">Primary technical bottleneck</p>
                    <p className="text-xs leading-relaxed text-ink-soft">
                      {s.technicalBottlenecks[0]}
                    </p>
                  </div>
                </div>
                <span className="mt-4 inline-block text-sm font-medium text-accent">
                  Read the sector research
                </span>
              </Link>
            </article>
          );
        })}
        <DisclosureNote />
      </section>
    </div>
  );
}

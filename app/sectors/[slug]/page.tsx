import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SECTOR_RESEARCH, getSectorResearch } from "@/lib/sectors";
import { UNIVERSE_ROWS } from "@/lib/rows";
import { ValueChain } from "@/components/ValueChain";
import { DemonstrationBadge } from "@/components/Provenance";
import { BulletList, DisclosureNote, PageHeader, Section } from "@/components/ui";

export function generateStaticParams() {
  return SECTOR_RESEARCH.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const research = getSectorResearch(slug);
  if (!research) return { title: "Sector not found" };
  return { title: research.title, description: research.summary };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const research = getSectorResearch(slug);
  if (!research) notFound();

  const companies = UNIVERSE_ROWS.filter((r) =>
    research.sectors.includes(r.sector),
  );
  const publicCompanies = companies.filter((c) => c.marketType === "Public");
  const privateCompanies = companies.filter((c) => c.marketType === "Private");

  return (
    <div>
      <PageHeader
        eyebrow="Sector research"
        title={research.title}
        intro={research.summary}
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="chip">Maturity: {research.maturity}</span>
          <span className="chip">{companies.length} companies tracked</span>
        </div>
      </PageHeader>

      <div className="container-page space-y-12 py-10">
        <Section title="Sector overview">
          <div className="content-column space-y-4">
            {research.overview.map((p) => (
              <p key={p} className="text-sm leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
            <p className="rounded-lg border border-line bg-canvas p-4 text-sm leading-relaxed text-ink-soft">
              <span className="font-semibold text-ink">Market maturity. </span>
              {research.maturityNote}
            </p>
          </div>
        </Section>

        <Section
          title="Value chain map"
          description="Where the work happens, and where the margin accrues. Companies from the universe are attached to the layer they operate at."
        >
          <ValueChain layers={research.valueChain} />
        </Section>

        <div className="grid gap-10 lg:grid-cols-2">
          <Section title="Technical bottlenecks">
            <BulletList items={research.technicalBottlenecks} tone="risk" />
          </Section>
          <Section title="Commercialisation barriers">
            <BulletList items={research.commercialisationBarriers} tone="risk" />
          </Section>
        </div>

        <Section title="Capital requirements">
          <p className="content-column text-sm leading-relaxed text-ink-soft">
            {research.capitalRequirements}
          </p>
        </Section>

        <div className="grid gap-10 lg:grid-cols-2">
          <Section title="Regulatory issues">
            <BulletList items={research.regulatoryIssues} />
          </Section>
          <Section title="Current catalysts">
            <BulletList items={research.catalysts} tone="positive" />
          </Section>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <Section title="Key risks">
            <BulletList items={research.risks} tone="risk" />
          </Section>
          <Section
            title="Public-company signals"
            description="Observable indicators that lead the private opportunities in this sector."
          >
            <BulletList items={research.publicSignals} />
          </Section>
        </div>

        <Section
          title="Companies in this sector"
          description="Public companies act as comparison anchors. Private companies are the pipeline, and all of them are demonstration records."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="label">Public companies</p>
              <ul className="space-y-2">
                {publicCompanies.map((c) => (
                  <li key={c.id} className="card p-3">
                    <Link
                      href={`/universe/${c.id}`}
                      className="text-sm font-medium text-ink hover:text-accent hover:underline"
                    >
                      {c.name}
                      {c.ticker && (
                        <span className="ml-2 font-mono text-xs text-ink-muted">
                          {c.ticker}
                        </span>
                      )}
                    </Link>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                      {c.subsector}
                    </p>
                  </li>
                ))}
                {publicCompanies.length === 0 && (
                  <li className="text-sm text-ink-muted">
                    No public companies tracked in this sector.
                  </li>
                )}
              </ul>
            </div>
            <div>
              <p className="label">Private-company pipeline</p>
              <ul className="space-y-2">
                {privateCompanies.map((c) => (
                  <li key={c.id} className="card p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/universe/${c.id}`}
                        className="text-sm font-medium text-ink hover:text-accent hover:underline"
                      >
                        {c.name}
                      </Link>
                      <DemonstrationBadge />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                      {c.subsector}, {c.stage}
                    </p>
                  </li>
                ))}
                {privateCompanies.length === 0 && (
                  <li className="text-sm text-ink-muted">
                    No private companies tracked in this sector.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Section>

        <Section
          title="Important investor questions"
          description="The questions worth asking of any company in this sector, regardless of how good the product looks."
        >
          <div className="content-column">
            <BulletList items={research.investorQuestions} />
          </div>
        </Section>

        <DisclosureNote />
      </div>
    </div>
  );
}

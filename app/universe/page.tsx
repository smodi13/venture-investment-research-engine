import type { Metadata } from "next";
import { UNIVERSE_ROWS } from "@/lib/rows";
import { activeSectors, activeSubsectors, UNIVERSE_STATS } from "@/lib/companies";
import { UniverseExplorer } from "@/components/UniverseExplorer";
import { DisclosureNote, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Company universe",
  description:
    "Twenty seven companies across private and public markets, ranked by a transparent two-stage framework: mandate relevance first, then twelve weighted quality factors.",
};

export default function UniversePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Research universe"
        title="Company universe"
        intro={`${UNIVERSE_STATS.total} companies across ${UNIVERSE_STATS.sectorCount} sectors, ${UNIVERSE_STATS.publicCount} public and ${UNIVERSE_STATS.privateCount} private. Search, filter, and sort the universe, then compare up to four companies side by side. Every score recalculates when the mandate changes.`}
      />

      <section className="container-page py-8">
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <p className="rounded-lg border border-line bg-surface p-4 text-xs leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">Public companies. </span>
            Real companies. Qualitative profiles are drawn from widely published
            information. Financial figures are dated ranges labelled as analyst
            estimates and should be reconciled against the primary filings
            linked on each company page.
          </p>
          <p className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-xs leading-relaxed text-violet-900">
            <span className="font-semibold">Private companies. </span>
            All {UNIVERSE_STATS.privateCount} are fictional demonstration
            records, labelled everywhere they appear. They are modelled on real
            archetypes so the workflow is realistic, but they describe no real
            business.
          </p>
        </div>

        <UniverseExplorer
          rows={UNIVERSE_ROWS}
          sectors={activeSectors()}
          subsectors={activeSubsectors()}
        />

        <DisclosureNote className="mt-8" />
      </section>
    </div>
  );
}

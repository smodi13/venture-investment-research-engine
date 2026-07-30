import type { Metadata } from "next";
import { UNIVERSE_ROWS } from "@/lib/rows";
import {
  activeSectors,
  activeSubsectors,
  UNIVERSE_STATS,
} from "@/lib/companies";
import { UniverseExplorer } from "@/components/UniverseExplorer";
import { DisclosureNote, PageHeader } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Private-company universe",
  description:
    "Verified private technology companies, ranked by mandate relevance and twelve weighted quality factors, each with dated sources and a data confidence rating.",
};

export default function UniversePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Sourcing universe"
        title="Private-company universe"
        intro={`${UNIVERSE_STATS.total} real private companies across ${UNIVERSE_STATS.sectorCount} sectors and ${UNIVERSE_STATS.headquartersCount} headquarters locations. Every record was confirmed as an independently private company on ${formatDate(SITE.snapshotDate)} and carries at least one primary source and one corroborating source.`}
      />

      <section className="container-page py-8">
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <p className="rounded-lg border border-line bg-surface p-4 text-xs leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">
              Every company here is real and private.{" "}
            </span>
            There are no fictional records and no public companies. Financing,
            founders, and technical claims are sourced. Facts that are not
            publicly disclosed are shown as such rather than estimated.
          </p>
          <p className="rounded-lg border border-line bg-surface p-4 text-xs leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">
              Data confidence is separate from quality.{" "}
            </span>
            A company with thin public disclosure can be an excellent company.
            The confidence rating describes how certain the conclusion is, not
            how good the business is, and a company is never rewarded for
            publishing more.
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

import type { Metadata } from "next";
import { IntelligenceFeed } from "@/components/IntelligenceFeed";
import { DisclosureNote, PageHeader } from "@/components/ui";
import { INTELLIGENCE, SNAPSHOT_DATE } from "@/lib/intelligence";
import { formatDate, describeAge } from "@/lib/format";

export const metadata: Metadata = {
  title: "Market intelligence",
  description:
    "A dated static snapshot of real financing, product, regulatory, technical, and government events relevant to the sourcing universe.",
};

export default function IntelligencePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Market intelligence"
        title="Dated developments across the sourcing universe"
        intro="Each entry carries its date, category, source, confidence level, the private companies it bears on, and the thesis it affects. Every event described is real and sourced."
      />

      <section className="container-page py-8">
        <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <span className="font-semibold">This is a static snapshot.</span> There
          is no live market data behind this page. The tracker was assembled on{" "}
          {formatDate(SNAPSHOT_DATE)}, {describeAge(SNAPSHOT_DATE)}, and does
          not update. It contains {INTELLIGENCE.length} entries. A production
          version would be wired to primary sources with an explicit refresh
          cadence, and saying so is more useful than implying a freshness the
          page does not have.
        </p>

        <IntelligenceFeed />

        <DisclosureNote className="mt-8" />
      </section>
    </div>
  );
}

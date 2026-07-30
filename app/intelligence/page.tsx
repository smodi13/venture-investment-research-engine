import type { Metadata } from "next";
import { IntelligenceFeed } from "@/components/IntelligenceFeed";
import { DisclosureNote, PageHeader } from "@/components/ui";
import { INTELLIGENCE, SNAPSHOT_DATE } from "@/lib/intelligence";
import { formatDate, describeAge } from "@/lib/format";

export const metadata: Metadata = {
  title: "Market intelligence",
  description:
    "A dated static snapshot of funding, product, regulatory, technical, and earnings developments relevant to the research universe.",
};

export default function IntelligencePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Market intelligence"
        title="Dated developments across the research universe"
        intro="Each entry carries its date, category, provenance, confidence level, and the thesis it bears on. Entries about real companies are written as structural observations about publicly discussed dynamics, not as reports of specific transactions."
      />

      <section className="container-page py-8">
        <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <span className="font-semibold">This is a static snapshot.</span> There
          is no live data integration behind this page. The tracker was
          assembled on {formatDate(SNAPSHOT_DATE)}, which makes it{" "}
          {describeAge(SNAPSHOT_DATE)}, and it does not update. It contains{" "}
          {INTELLIGENCE.length} entries. A production version of this page would
          be wired to primary sources with an explicit refresh cadence, and
          saying so is more useful than implying a freshness the page does not
          have.
        </p>

        <IntelligenceFeed />

        <DisclosureNote className="mt-8" />
      </section>
    </div>
  );
}

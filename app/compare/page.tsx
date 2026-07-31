import type { Metadata } from "next";
import { UNIVERSE_ROWS } from "@/lib/rows";
import { Comparison } from "@/components/Comparison";
import { CrossLink, DisclosureNote, PageHeader } from "@/components/ui";
import { UNIVERSE_STATS } from "@/lib/companies";

export const metadata: Metadata = {
  title: "Compare companies",
  description:
    "Compare verified private companies side by side under a stated investment mandate, including score, relevance tier, disclosed round, data confidence, and signal freshness.",
};

export default function ComparePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Comparison"
        title="Compare private companies"
        intro={`Put up to four of the ${UNIVERSE_STATS.total} private companies side by side under a stated mandate. The comparison shows the fields that usually decide a pass: what stage the company is actually at, how solid the evidence is, how recent the reason for looking is, and what question is still open.`}
      />

      <section className="container-page py-8">
        <p className="mb-6 rounded-lg border border-line bg-surface p-4 text-xs leading-relaxed text-ink-soft">
          <span className="font-semibold text-ink">
            Only private companies can be compared here.{" "}
          </span>
          The rows come from the private universe, which by type has no public
          members. Public companies are read as market signals and comparables
          and are kept on a separate route. Nothing on this page is estimated:
          fields that a company has not disclosed publicly read as not publicly
          disclosed.
        </p>

        <Comparison rows={UNIVERSE_ROWS} />

        <p className="mt-8 text-sm text-ink-soft">
          Filter and search the full list on the{" "}
          <CrossLink href="/universe">private-company universe</CrossLink>, or
          read how relevance gates the score on the{" "}
          <CrossLink href="/methodology">methodology page</CrossLink>.
        </p>

        <DisclosureNote className="mt-8" />
      </section>
    </div>
  );
}

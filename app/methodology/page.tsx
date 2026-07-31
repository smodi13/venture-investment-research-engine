import type { Metadata } from "next";
import {
  FACTORS,
  RELEVANCE_ORDER,
  RELEVANCE_TIERS,
  SCORE_BANDS,
  weightTotal,
} from "@/lib/scoring";
import { MANDATES } from "@/lib/mandates";
import { SOURCES } from "@/lib/sources";
import { UNIVERSE_STATS } from "@/lib/companies";
import { MARKET_SIGNAL_DISCLOSURE } from "@/lib/data/market-signals";
import {
  CLAIM_PROVENANCE_LEVELS,
  CLAIM_PROVENANCE_MEANING,
  DATA_CONFIDENCE_LEVELS,
  DATA_CONFIDENCE_MEANING,
  SIGNAL_FRESHNESS_LEVELS,
  SIGNAL_FRESHNESS_MEANING,
} from "@/lib/types";
import {
  ConfidenceBadge,
  FreshnessBadge,
  ProvenanceBadge,
} from "@/components/Provenance";
import {
  BulletList,
  DisclosureNote,
  GitHubLink,
  PageHeader,
  Section,
} from "@/components/ui";
import { formatDate } from "@/lib/format";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Methodology and source registry",
  description:
    "How real private companies are sourced and verified, how mandates affect ranking, how data confidence is assigned, and every source the research rests on.",
};

const LIMITATIONS = [
  {
    title: "Public information about private companies is thin and uneven",
    body: "Private companies do not file. What is public is what the company chose to announce, filtered through what a publication chose to cover. Revenue, margins, customer counts, and unit economics are almost never available, and this platform shows them as not publicly disclosed rather than estimating them.",
  },
  {
    title: "Funding data is incomplete and often reported by an interested party",
    body: "Announced round sizes are self-reported, valuations are frequently unconfirmed, and total raised figures omit unannounced financings. Where a company states a figure, this platform attributes it to the company rather than presenting it as established fact. Commercial funding databases were used only as a discovery aid and are not cited as evidence.",
  },
  {
    title: "Technical benchmarks are configuration dependent and expire",
    body: "A vendor benchmark describes a configuration the vendor selected. Almost none of the technical claims in this universe has been independently reproduced, and the technical evidence factor is rated accordingly rather than accepting the claim.",
  },
  {
    title: "Scoring models compress judgment into a number",
    body: "A score of 74 built mostly from verified inputs is a materially different object from a score of 74 built mostly from judgment, and the number alone does not distinguish them. Every company page shows the proportion, and the factor table shows the basis, confidence, and source per factor.",
  },
  {
    title: "This is a dated research snapshot",
    body: `Everything was verified on ${formatDate(SITE.snapshotDate)}. Private status in particular expires: one company was excluded during this research because a public acquirer completed its purchase mid-review. Any record should be re-verified before it informs a decision.`,
  },
];

export default function MethodologyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Methodology"
        title="How this platform reaches its conclusions"
        intro="Everything here exists so that a reader can disagree with a specific step rather than with the output as a whole. The weights are published, the evidence behind each rating is shown with its source, and the limitations are stated rather than implied."
      />

      <div className="container-page space-y-12 py-10">
        <Section
          title="Four statements about this dataset"
          description="Stated first because they govern how everything else should be read."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                t: "No fictional companies are used",
                b: `All ${UNIVERSE_STATS.total} companies in the sourcing universe are real and were confirmed as independently private on ${formatDate(SITE.snapshotDate)}.`,
              },
              {
                t: "Missing information is not invented",
                b: "Revenue, margins, customer counts, valuations, ownership, burn, and runway appear only where a company disclosed them publicly. Everything else reads not publicly disclosed.",
              },
              {
                t: "Public companies are market signals only",
                b: MARKET_SIGNAL_DISCLOSURE,
              },
              {
                t: "Workflow statuses are demonstration data",
                b: "Pipeline status, priority, and notes show how the tool is used and do not indicate that any meeting, outreach, or investment occurred. Company facts are sourced and dated.",
              },
            ].map((x) => (
              <div key={x.t} className="card p-5">
                <h3 className="text-sm font-semibold text-ink">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {x.b}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="How real private companies are sourced"
          description="Sourcing starts from an observable event, not from a company list."
        >
          <div className="content-column space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              Each company entered the universe through a specific, dated signal:
              a financing, a product launch, a government contract, a published
              technical result, a manufacturing commitment, or an industry
              bottleneck that made a category worth examining. That signal is
              recorded on every company page under the heading{" "}
              <span className="font-medium text-ink">
                why this company entered the pipeline
              </span>
              , together with why it may be timely and why it may be overlooked.
            </p>
            <p>
              Where the evidence does not support an overlooked claim, the record
              says so directly and explains why the company remains relevant
              anyway. Several companies here are widely covered, and the sourcing
              originality factor scores them near zero rather than pretending
              otherwise.
            </p>
            <p>
              Companies were excluded if they were publicly traded, acquired, no
              longer operating independently, or impossible to verify as
              currently private. Commercial databases were used to discover
              candidates and were never used as evidence.
            </p>
          </div>
        </Section>

        <Section
          title="How company status is verified"
          description="Every record required a working official website, one primary source, and one independent corroborating source."
        >
          <div className="content-column space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              Primary sources are the company&apos;s own site, its own announcements,
              or an official record such as a government or laboratory
              publication. Corroborating sources are independent technology or
              business publications. Both are registered below with a
              publication date, an access date, and the specific fact each
              supports.
            </p>
            <p>
              Private status was checked individually rather than assumed. During
              this research a private optical interconnect company was found to
              have been acquired by a public semiconductor company in February
              2026, and was excluded from the universe as a result. That case is
              documented on the market signals page, because it is the clearest
              argument for why this check has to be repeated rather than
              inherited.
            </p>
          </div>
        </Section>

        <Section
          title="How a score is produced: two stages, in this order"
          description="Relevance is settled before quality is scored."
        >
          <div className="content-column space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              Relevance is not a quality to be traded against other qualities. It
              is a precondition. A fund with a healthcare mandate cannot buy a
              semiconductor company however good it is, so the model must not be
              able to rank one first.
            </p>
            <p>
              Stage one asks whether the company is in scope. The relevance
              rating is the weaker of the mandate&apos;s sector affinity and its
              stage affinity, because a company has to be both in the right
              sector and at the right stage to be core to a mandate. Stage two
              scores twelve quality factors. The final score is quality
              multiplied by the relevance multiplier.
            </p>
          </div>

          <div className="mt-6 card overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line-strong text-left">
                  <th className="py-3 pl-4 pr-3 font-semibold text-ink">
                    Relevance tier
                  </th>
                  <th className="py-3 px-3 text-right font-semibold text-ink">
                    Rating
                  </th>
                  <th className="py-3 px-3 text-right font-semibold text-ink">
                    Multiplier
                  </th>
                  <th className="py-3 px-3 text-right font-semibold text-ink">
                    Score ceiling
                  </th>
                  <th className="py-3 pl-3 pr-4 font-semibold text-ink">
                    Effect
                  </th>
                </tr>
              </thead>
              <tbody>
                {RELEVANCE_ORDER.map((id, i) => {
                  const t = RELEVANCE_TIERS[id];
                  const rating = [5, 4, 3, 2, "0 to 1"][i];
                  return (
                    <tr key={id} className="border-b border-line align-top">
                      <td className="py-3 pl-4 pr-3 font-medium text-ink">
                        {t.label}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-ink-soft">
                        {rating}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-ink">
                        &times;{t.multiplier.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums text-ink">
                        {t.ceiling}
                      </td>
                      <td className="max-w-lg py-3 pl-3 pr-4 text-xs leading-relaxed text-ink-soft">
                        {t.meaning}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="content-column mt-6 space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              The ceilings are chosen so each tier stops at the top of a scoring
              band. Only a company core to the active mandate can reach priority
              research. Nothing is hardcoded per company: sector and stage
              affinities live on the mandate, quality ratings live on the
              company, and neither knows about the other.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SCORE_BANDS.map((b) => (
              <div key={b.label} className="card p-4">
                <p className="font-mono text-xs font-semibold text-ink-muted">
                  {b.range}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-ink">
                  {b.label}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                  {b.meaning}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="How scoring weights change by mandate"
          description="Quality weights only. Each column sums to 100, and relevance is applied afterwards."
        >
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line-strong text-left">
                  <th className="py-3 pl-4 pr-3 font-semibold text-ink">
                    Factor
                  </th>
                  {MANDATES.map((m) => (
                    <th
                      key={m.id}
                      className="py-3 px-3 text-right font-semibold text-ink"
                    >
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FACTORS.map((f) => (
                  <tr key={f.key} className="border-b border-line">
                    <td className="py-2.5 pl-4 pr-3 text-ink-soft">
                      {f.label}
                      {f.isRisk && (
                        <span className="ml-2 text-xs text-ink-muted">
                          (risk factor)
                        </span>
                      )}
                    </td>
                    {MANDATES.map((m) => (
                      <td
                        key={m.id}
                        className="py-2.5 px-3 text-right font-mono tabular-nums text-ink-soft"
                      >
                        {m.weights[f.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-line-strong">
                  <td className="py-3 pl-4 pr-3 font-semibold text-ink">
                    Total
                  </td>
                  {MANDATES.map((m) => (
                    <td
                      key={m.id}
                      className="py-3 px-3 text-right font-mono font-semibold tabular-nums text-ink"
                    >
                      {weightTotal(m)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft">
            Factors are rated 0 to 5, deliberately coarse, so the model cannot
            manufacture precision the evidence does not support. Ratings are
            oriented so 5 is always most favourable, which on the three risk
            factors means 5 signals low risk. Raising more capital is never
            itself rewarded, and neither is publishing more information.
          </p>
        </Section>

        <Section
          title="How quantified claims are classified"
          description="Every traction, customer, adoption, benchmark, backlog, contract, member, and clinical figure carries a label saying who is vouching for it."
        >
          <div className="space-y-2">
            {CLAIM_PROVENANCE_LEVELS.map((level) => (
              <div
                key={level}
                className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-start sm:gap-4"
              >
                <div className="sm:w-52 sm:shrink-0">
                  <ProvenanceBadge provenance={level} />
                </div>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {CLAIM_PROVENANCE_MEANING[level]}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft">
            The rule that does the work here is that a press release and a
            publication reprinting that press release are the same voice
            recorded twice. Both look like third-party coverage in a search
            result. Only one of them is corroboration, so every registered
            source additionally records whether its publisher did original
            reporting or reproduced an announcement, and a claim can only be
            called independently verified if it rests on original reporting,
            peer-reviewed research, an official record, or a public technical
            record anyone can query.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">
            Company-reported is not a criticism. Most of what is publicly known
            about a private company comes from the company, and that is the
            normal state of this kind of research. The label exists so a reader
            can see the difference at a glance rather than inferring it from the
            name of a publisher.
          </p>
        </Section>

        <Section
          title="How companies are discovered, and how freshness is treated"
          description="Every company records the channel it surfaced through and the date of the signal that surfaced it."
        >
          <div className="space-y-2">
            {SIGNAL_FRESHNESS_LEVELS.map((level) => (
              <div
                key={level}
                className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-start sm:gap-4"
              >
                <div className="sm:w-44 sm:shrink-0">
                  <FreshnessBadge freshness={level} />
                </div>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {SIGNAL_FRESHNESS_MEANING[level]}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft">
            Freshness is never folded into the quality score. A company is not a
            better investment because it announced something last month, and a
            ranking that rewarded recency heavily would simply reproduce the news
            cycle. Freshness answers a different question: whether the reason for
            looking now still holds.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">
            The overview page orders companies by quality score plus a capped
            adjustment of up to three points for data confidence and up to three
            for signal freshness. Six points is the maximum, which is small
            enough that it cannot overturn a clear score difference. The
            integrity suite asserts that directly, and both the underlying score
            and the adjustment are printed on every card. Everywhere else in the
            platform, ranking is the quality score alone.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">
            Each record also states what a funding-database search would fail to
            surface about the company, and what evidence is still missing that
            would change the assessment. Both are written before any conclusion
            is drawn, so a reader can judge whether the sourcing reasoning holds
            independently of whether the score does.
          </p>
        </Section>

        <Section
          title="How data confidence is assigned"
          description="Confidence describes how certain the conclusion is, not how good the company is."
        >
          <div className="space-y-2">
            {DATA_CONFIDENCE_LEVELS.map((level) => (
              <div
                key={level}
                className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-start sm:gap-4"
              >
                <div className="sm:w-44 sm:shrink-0">
                  <ConfidenceBadge confidence={level} />
                </div>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {DATA_CONFIDENCE_MEANING[level]}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft">
            A company with limited public disclosure may still be an excellent
            investment. The platform separates the two judgments deliberately, so
            that a low score can be read as low relevance or thin evidence rather
            than as a poor business. Companies are not rewarded for disclosing
            more.
          </p>
        </Section>

        <Section
          title="How missing information is treated"
          description="Every gap is shown as a gap."
        >
          <div className="content-column space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              Where a fact is unavailable, the interface displays{" "}
              <span className="font-medium text-ink">not publicly disclosed</span>{" "}
              rather than an estimate. Each financing assessment additionally
              lists what is absent from the public record, so a reader can see
              the shape of the gap rather than inferring it.
            </p>
            <p>
              No estimate appears anywhere in this dataset. An estimate would be
              permitted only if the calculation and its assumptions were shown
              and it were labelled as analyst judgment, and no case in this
              universe met a standard where an estimate was more useful than an
              honest gap.
            </p>
          </div>
        </Section>

        <Section
          title="How public companies are separated from venture candidates"
          description="Structurally, not by a filter."
        >
          <div className="content-column space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              Private companies and public companies use different types. The
              private type has no ticker and its financing stage type has no
              public member, so a listed company cannot be represented as a
              sourcing candidate at all. The public type carries no score, no
              relevance tier, and no pipeline status, so it cannot be ranked.
            </p>
            <p>{MARKET_SIGNAL_DISCLOSURE}</p>
          </div>
        </Section>

        <Section
          title="Data refresh requirements"
          description="What a production version would need to re-verify, and how often."
        >
          <div className="content-column">
            <BulletList
              items={[
                "Private status: before any decision, and at minimum quarterly. This is the fact most likely to expire.",
                "Financing and investors: on each announcement, from the company's own release rather than from a summary",
                "Founders and leadership: annually, and on any public change",
                "Technical claims and benchmarks: every two quarters, since results expire with software and hardware versions",
                "Official website and source links: quarterly, to catch reorganised sites and removed announcements",
                "Market signals: each reporting period for public companies referenced as context",
              ]}
            />
          </div>
        </Section>

        <Section
          title="Limitations"
          description="The constraints that apply to this research, stated directly."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {LIMITATIONS.map((l) => (
              <div key={l.title} className="card p-5">
                <h3 className="text-sm font-semibold text-ink">{l.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {l.body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Why this supports rather than replaces investor judgment">
          <div className="content-column space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              The scoring model does not decide anything. It organises evidence
              so that a disagreement can be located precisely: not that a company
              looks uninteresting, but that technical evidence is a 3 rather than
              a 5, and here is the source that decides it.
            </p>
            <p>
              The bands reinforce this. The highest band is called priority
              research, not buy. It means the company has earned analyst time
              this week. The sourcing originality factor carries the smallest
              weight in every mandate, because being early is only valuable when
              the other eleven factors already hold.
            </p>
            <div className="pt-2">
              <GitHubLink variant="button" />
            </div>
          </div>
        </Section>

        <Section
          title="Source registry"
          description="Every external source the research rests on, with what it supports and when it was checked. Only primary sources and independent corroborating publications are registered. Commercial funding databases are excluded."
        >
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[56rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line-strong text-left">
                  <th className="py-3 pl-4 pr-3 font-semibold text-ink">
                    Company or sector
                  </th>
                  <th className="py-3 px-3 font-semibold text-ink">Source</th>
                  <th className="py-3 px-3 font-semibold text-ink">Publisher</th>
                  <th className="py-3 px-3 font-semibold text-ink">Type</th>
                  <th className="py-3 px-3 font-semibold text-ink">Published</th>
                  <th className="py-3 px-3 font-semibold text-ink">Accessed</th>
                  <th className="py-3 pl-3 pr-4 font-semibold text-ink">
                    Fact supported
                  </th>
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((s) => (
                  <tr key={s.id} className="border-b border-line align-top">
                    <td className="py-3 pl-4 pr-3 whitespace-nowrap font-medium text-ink">
                      {s.subject}
                    </td>
                    <td className="py-3 px-3">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-accent hover:underline"
                      >
                        {s.title}
                      </a>
                      {s.primary && (
                        <span className="ml-2 text-xs text-ink-muted">
                          primary
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-ink-soft">{s.publisher}</td>
                    <td className="py-3 px-3 whitespace-nowrap text-ink-soft">
                      {s.type}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-ink-muted">
                      {formatDate(s.published)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-ink-muted">
                      {formatDate(s.accessed)}
                    </td>
                    <td className="max-w-md py-3 pl-3 pr-4 text-xs leading-relaxed text-ink-muted">
                      {s.supports}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">
            {SOURCES.length} registered sources, {SOURCES.filter((s) => s.primary).length}{" "}
            of them primary. Every link was checked on{" "}
            {formatDate(SITE.snapshotDate)}.
          </p>
        </Section>

        <DisclosureNote />
      </div>
    </div>
  );
}

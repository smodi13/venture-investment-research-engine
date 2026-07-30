import type { Metadata } from "next";
import Link from "next/link";
import { SCORE_FACTORS, MAX_SCORE } from "@/lib/scoring";
import { SIGNAL_TYPES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Engine",
  description:
    "How the X Sourcing Engine queries, filters, corroborates, and scores early founder signals, and the cost governance behind live X API runs.",
};

function Section({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-10">
      <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
      {lede && (
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{lede}</p>
      )}
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}

const contents = [
  { id: "surface", label: "The sourcing surface" },
  { id: "query", label: "Query architecture" },
  { id: "filter", label: "Noise filtering" },
  { id: "corroborate", label: "Corroboration" },
  { id: "scoring", label: "Scoring model" },
  { id: "governance", label: "Cost governance" },
  { id: "estimates", label: "What is estimated" },
  { id: "review", label: "Human review" },
  { id: "limits", label: "Limits and failure modes" },
];

export default function EnginePage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <div className="content-column">
        <p className="eyebrow mb-3">Engine</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          How the engine turns X posts into sourcing cards
        </h1>
        <p className="mt-5 text-base leading-relaxed text-ink-soft">
          Two pieces sit behind this site. A governed command-line engine
          performs real X API sourcing under explicit cost budgets and human
          approval. This web app is the review surface: it presents the sourcing
          card an Associate actually works from. Both are built so the reasoning
          behind any lead stays visible and arguable.
        </p>

        <nav
          aria-label="Contents"
          className="mt-8 rounded-xl border border-line bg-surface p-4"
        >
          <div className="label">Contents</div>
          <ol className="grid gap-1.5 sm:grid-cols-2">
            {contents.map((c, i) => (
              <li key={c.id} className="flex gap-2 text-sm">
                <span className="font-mono text-xs text-ink-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a
                  href={`#${c.id}`}
                  className="text-ink-soft hover:text-accent hover:underline"
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-4">
          <Section
            id="surface"
            title="The sourcing surface"
            lede="Why X, and why this window."
          >
            <p>
              A database profile is a lagging indicator. It exists because
              something already happened: a round closed, a launch got covered,
              an accelerator published its cohort. At that point the company is
              visible to every fund watching the category simultaneously, and
              sourcing has become a speed contest rather than an insight one.
            </p>
            <p>
              The months before that are not quiet. Technical founders spend them
              publishing: arguing with a benchmark, releasing a library, posting
              a demo that half works, complaining about a workflow they have run
              a hundred times. This material is public and timestamped, and it is
              largely unindexed by the tools investors use day to day.
            </p>
            <p>
              The engine treats that window as the surface to work. It is not a
              data moat, because anyone can read the same posts. The claim is narrower:
              a disciplined workflow over that surface produces a small number of
              well-documented leads earlier than a database subscription will.
            </p>
          </Section>

          <Section
            id="query"
            title="Query architecture"
            lede="Standing queries over signal shapes, validated before a single API call."
          >
            <p>
              Queries are composed from two axes: the technical topic and the
              discovery lane. Topics cover AI infrastructure and agent systems,
              robotics and physical AI, biotech and drug discovery tooling, deep
              tech infrastructure, and enterprise AI workflow. Lanes describe the
              kind of moment being looked for: a product artifact, a founder
              transition, or early traction.
            </p>
            <p>
              Rather than running every topic-by-lane combination, the engine
              ships a curated set of six queries. A validator runs before any
              network call: it rejects unsupported search operators, enforces an
              allowlist, warns on length, requires a standalone term alongside
              conjunction operators, and logs the exact query that will be sent.
              A malformed query that would burn budget for nothing fails locally
              instead.
            </p>
            <p>
              The signal types surfaced in this demo correspond to the post
              shapes those queries target:
            </p>
            <ul className="mt-1 grid gap-1.5 sm:grid-cols-2">
              {SIGNAL_TYPES.map((s) => (
                <li key={s} className="flex gap-2">
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50"
                  />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            id="filter"
            title="Noise filtering"
            lede="Most matches are not leads."
          >
            <p>
              A query that finds founders also finds commentary, engagement
              farming, recruiters, agencies, and people describing someone
              else&rsquo;s product. The filter is deterministic and deliberately
              strict: it drops accounts with no build history, excludes agencies
              and service providers, and keeps posts carrying something checkable
              such as a number, a repository, a video, or a job requisition.
            </p>
            <p>
              Engagement is explicitly <em>not</em> a quality judgment. It is
              computed locally, normalized against a follower floor, and used
              only as a low-priority tie-breaker. It can never outweigh a core
              factor. A post with four hundred likes from the right forty people
              routinely outranks one with forty thousand.
            </p>
            <p>
              Signals that decay do decay. Launch, customer, usage, hiring, and
              shipping signals lose weight with age; enduring facts such as
              founder background, category, and architecture do not.
            </p>
          </Section>

          <Section
            id="corroborate"
            title="Corroboration"
            lede="A claim is not evidence until it is confirmed somewhere it was not posted."
          >
            <p>
              Before a lead is scored, the originating signal has to be
              corroborated independently. In practice that means a repository
              creation date, a domain registration predating the post, a job
              listing, a bio change, a cohort page, or a substantive reply from
              an identifiable practitioner rather than a follower.
            </p>
            <p>
              Every material claim then carries a confidence level, shown on the
              card as <strong>Observed</strong>, <strong>Founder-reported</strong>
              , or <strong>Inferred</strong>. A founder saying they have three
              design partners is recorded as exactly that and never rendered as
              proven traction. This is the single most important honesty
              mechanism in the workflow, because at pre-seed almost everything
              interesting is initially founder-reported.
            </p>
          </Section>

          <Section
            id="scoring"
            title="Scoring model"
            lede={`Nine factors, fixed published weights, totalling ${MAX_SCORE}.`}
          >
            <p>
              The weighting is the argument, not the arithmetic. Founder depth,
              signal quality, and earliness carry 45 of the 100 points, because
              when a company is still invisible those are the only things
              reliably observable. Traction and market sizing are scored but
              capped, since at this stage they are the inputs most likely to be
              wrong.
            </p>
            <ul className="mt-2 space-y-2.5">
              {SCORE_FACTORS.map((f) => (
                <li key={f.key} className="flex gap-3">
                  <span className="mt-0.5 w-12 shrink-0 text-right font-mono text-xs font-semibold text-accent">
                    {f.max} pts
                  </span>
                  <span>
                    <span className="font-medium text-ink">{f.label}.</span>{" "}
                    {f.description}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Scoring in the command-line engine is fully deterministic Python.
              Where a language model is used at all, it only summarizes text that
              has already been scored, and it never assigns a number. Follower
              count, virality, and writing polish are excluded from founder
              scoring by construction.
            </p>
            <p>
              A company with a complete database profile scores near zero on
              earliness by design, and one such lead is retained in the demo
              pipeline as a calibration example. Overlays for platform-absorption
              risk and feature-replication risk flag leads whose product a large
              incumbent could absorb; a high-risk result routes to{" "}
              <em>investigate the founder, challenge the moat</em> rather than to
              elimination.
            </p>
          </Section>

          <Section
            id="governance"
            title="Cost governance"
            lede="Live X API calls cost money, so spending is gated in phases."
          >
            <p>
              The command-line engine estimates usage before it runs and requires
              interactive confirmation to exceed a stated budget. A counts-only
              preflight sizes query volume before any post retrieval, which keeps
              the expensive phase from starting against a query that was going to
              return nothing useful. Cost rates, budgets, and volume thresholds
              live in configuration rather than in source, so they can be
              tightened without a code change.
            </p>
            <p>
              A dry-run mode makes no network calls at all, and cached results can
              regenerate an audit trail with no further spend. Every run writes a
              candidate list, a ranked lead list, a per-lead report, a run
              summary, and a review file with blank columns for a human to fill
              in.
            </p>
            <p>
              Live sourcing is deliberately <strong>not</strong> exposed as a
              one-click web action. This site runs entirely on its bundled
              demonstration dataset, so no credential is needed to review it, and
              a reviewer cannot accidentally spend money. Credentials, when
              present, are read from the server environment only and are never
              sent to the browser or logged.
            </p>
          </Section>

          <Section
            id="estimates"
            title="What is estimated on this site"
            lede="Stated plainly, because the alternative is misleading."
          >
            <p>
              Every company in this deployment is an illustrative sample. Company
              names, founder names, X handles, post text, engagement counts,
              funding figures, and lead times are invented to demonstrate the
              workflow end to end. No factual claim is made about any real
              business, account, or person, and the sample links resolve to
              example.com on purpose.
            </p>
            <p>
              The dataset was built to exercise the interface honestly rather
              than flatteringly: it spans strong and weak leads, includes
              founder-reported claims that have not been verified, contains
              stealth records with almost no evidence at all, and keeps one lead
              that the engine surfaced too late to be useful.
            </p>
          </Section>

          <Section
            id="review"
            title="How a human should review the output"
            lede="The score sets reading order. Nothing else."
          >
            <p>
              Start at the top of the ranked list, read the originating signal
              first, then the concerns section before the thesis-fit section. If
              the concerns do not change your read of the score, you have
              probably not read them properly.
            </p>
            <p>
              Work through the diligence questions before any outreach, and
              confirm the estimated fields in conversation rather than treating
              them as findings. The drafted outreach message is a starting point
              that references the actual post; it should be personalized before
              sending, and sending it unedited would defeat the point of sourcing
              this way.
            </p>
            <p>
              Advancing a lead to partner review should always follow a human
              read of the full card. No status in this workflow changes
              automatically on score.
            </p>
          </Section>

          <Section
            id="limits"
            title="Limits and failure modes"
            lede="The honest version."
          >
            <p>
              <strong>X is a biased sample.</strong> It over-represents founders
              who post, which skews toward developer tools, infrastructure, and
              AI, and away from founders in regulated industries or those who
              simply do not use the platform. This engine is a complement to
              network-driven sourcing, not a replacement, and treating its output
              as market coverage would be a mistake.
            </p>
            <p>
              <strong>Early signals are thin and easy to over-read.</strong> A
              compelling thread and a viable company are different things. The
              confidence tags and the capped traction weighting exist to keep
              that distinction from collapsing under enthusiasm.
            </p>
            <p>
              <strong>Precision beats volume here.</strong> The value is a small
              number of leads a partner will actually read. Widening the filter
              to produce more rows would make the output worse, and the scoring
              weights are tuned on that assumption.
            </p>
          </Section>
        </div>

        <div className="mt-10 rounded-xl border border-accent-line bg-accent-soft p-5 text-sm leading-relaxed text-ink-soft">
          <p>
            X Sourcing Engine is an independent demonstration project built by
            Sahil Modi. It is not affiliated with, endorsed by, or representing
            any investment firm or X Corp.
          </p>
          <p className="mt-3">
            <Link
              href="/pipeline"
              className="font-medium text-accent hover:underline"
            >
              Open the sourcing pipeline
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

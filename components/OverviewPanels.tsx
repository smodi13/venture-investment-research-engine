"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useMandate } from "./MandateProvider";
import { MandateSelector } from "./MandateSelector";
import { RelevanceBadge, ScoreBadge, ScoreBar } from "./Score";
import { ConfidenceBadge } from "./Provenance";
import { RELEVANCE_TIERS } from "@/lib/scoring";
import type { UniverseRow } from "@/lib/rows";
import { mergeRows, useOverrides } from "@/lib/storage";
import { PIPELINE_STAGES } from "@/lib/types";
import { formatDate } from "@/lib/format";

/**
 * The top-ranked sourcing candidates.
 *
 * Every card here is a real private company. No public company can appear:
 * the rows come from the private universe, which has no public members by type.
 */
export function TopSourced({ rows }: { rows: UniverseRow[] }) {
  const { mandateId, mandate } = useMandate();

  const top = useMemo(
    () =>
      [...rows]
        .sort((a, b) => b.scores[mandateId] - a.scores[mandateId])
        .slice(0, 6),
    [rows, mandateId],
  );

  return (
    <div className="space-y-6">
      <MandateSelector />

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink">
            Top sourced private companies under {mandate.name}
          </h3>
          <Link
            href="/universe"
            className="text-sm font-medium text-accent hover:underline"
          >
            Explore the private-company universe
          </Link>
        </div>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((r, i) => (
            <li key={r.id} className="card-hover p-4">
              <Link href={`/universe/${r.id}`} className="block">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-mono text-xs text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="mt-1 font-medium text-ink">{r.name}</div>
                  </div>
                  <ScoreBadge score={r.scores[mandateId]} showBand={false} />
                </div>
                <div className="mt-2">
                  <ScoreBar score={r.scores[mandateId]} />
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="chip">{r.sector}</span>
                  <span className="chip">{r.stage}</span>
                  <span className="chip">{r.headquarters.split(",")[0]}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <ConfidenceBadge confidence={r.dataConfidence} />
                  <span
                    className="chip"
                    title={RELEVANCE_TIERS[r.tiers[mandateId]].meaning}
                  >
                    {RELEVANCE_TIERS[r.tiers[mandateId]].label}
                  </span>
                </div>
                <dl className="mt-3 space-y-1.5 text-xs leading-relaxed">
                  <div>
                    <dt className="font-medium text-ink-soft">
                      Latest disclosed financing
                    </dt>
                    <dd className="text-ink-muted">{r.latestRound}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-ink-soft">Why sourced</dt>
                    <dd className="text-ink-muted">
                      {r.sourcingSignal}. {r.whyEntered.slice(0, 150)}
                      {r.whyEntered.length > 150 ? "..." : ""}
                    </dd>
                  </div>
                </dl>
                <p className="mt-2 text-[11px] text-ink-muted">
                  Reviewed {formatDate(r.lastReviewed)}
                </p>
              </Link>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          Switching the mandate re-weights all twelve quality factors and
          re-ranks every company. Only private companies appear here. Public
          companies are used as market signals and comparables and are kept on a
          separate route.
        </p>
      </div>
    </div>
  );
}

/** A compact read on where the pipeline currently stands. */
export function PipelineSummary({ rows }: { rows: UniverseRow[] }) {
  const overrides = useOverrides();
  const records = useMemo(() => mergeRows(rows, overrides), [rows, overrides]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of records) map.set(r.status, (map.get(r.status) ?? 0) + 1);
    return map;
  }, [records]);

  const active = records.filter(
    (r) =>
      r.status !== "Passed" &&
      r.status !== "Monitoring" &&
      r.status !== "Invested",
  ).length;

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">Pipeline summary</h3>
        <Link
          href="/pipeline"
          className="text-sm font-medium text-accent hover:underline"
        >
          Open the pipeline
        </Link>
      </div>
      <p className="mt-1 text-xs text-ink-muted">
        {active} companies in an active stage, out of {records.length} tracked.
      </p>
      <ul className="mt-4 space-y-1.5">
        {PIPELINE_STAGES.filter((s) => (counts.get(s) ?? 0) > 0).map((s) => (
          <li key={s} className="flex items-center gap-3 text-sm">
            <span className="w-6 shrink-0 text-right font-mono font-semibold text-ink">
              {counts.get(s)}
            </span>
            <span className="flex-1 text-ink-soft">{s}</span>
            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-canvas">
              <span
                className="block h-full rounded-full bg-accent"
                style={{
                  width: `${Math.min(100, ((counts.get(s) ?? 0) / records.length) * 100 * 4)}%`,
                }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Relevance badge helper reused on the detail page header. */
export { RelevanceBadge };

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMandate } from "./MandateProvider";
import { MandateSelector } from "./MandateSelector";
import { ScoreBadge, ScoreBar } from "./Score";
import { ConfidenceBadge, FreshnessBadge, ProvenanceBadge } from "./Provenance";
import { RELEVANCE_TIERS } from "@/lib/scoring";
import { priorityAdjustment, type UniverseRow } from "@/lib/rows";
import { formatDate } from "@/lib/format";

/**
 * Side-by-side comparison of private companies.
 *
 * Deliberately small. The point is not to compute a winner, it is to put the
 * fields that usually decide a pass next to each other so that the difference
 * between two companies is visible in one screen: what stage they are actually
 * at, how solid the evidence is, how recent the reason for looking is, and what
 * question is still open.
 *
 * Only private companies can appear here. The rows come from the private
 * universe, which by type has no public members.
 */

const MAX = 4;

const FIELDS: {
  label: string;
  render: (r: UniverseRow, mandateId: string) => React.ReactNode;
}[] = [
  {
    label: "Sector",
    render: (r) => (
      <>
        {r.sector}
        <span className="mt-0.5 block text-xs text-ink-muted">{r.subsector}</span>
      </>
    ),
  },
  {
    label: "Most recent disclosed round",
    render: (r) => (
      <>
        {r.disclosedRound}
        {r.disclosedRound !== r.stage ? (
          <span className="mt-0.5 block text-xs text-ink-muted">
            Grouped as {r.stage} for stage affinity.
          </span>
        ) : null}
      </>
    ),
  },
  { label: "Headquarters", render: (r) => r.headquarters },
  { label: "Total disclosed funding", render: (r) => r.totalDisclosedFunding },
  { label: "Named investors", render: (r) => r.namedInvestors },
  {
    label: "Discovery channel",
    render: (r) => (
      <>
        {r.discoveryChannel}
        <span className="mt-0.5 block text-xs text-ink-muted">
          {r.sourcingSignal}
        </span>
      </>
    ),
  },
  {
    label: "Signal freshness",
    render: (r) => (
      <>
        <FreshnessBadge freshness={r.signalFreshness} signalDate={r.signalDate} />
        <span className="mt-1 block text-xs text-ink-muted">
          Signal dated {formatDate(r.signalDate)}
        </span>
      </>
    ),
  },
  {
    label: "Data confidence",
    render: (r) => (
      <>
        <ConfidenceBadge confidence={r.dataConfidence} />
        <span className="mt-1 block text-xs text-ink-muted">
          {r.sourceCount} source{r.sourceCount === 1 ? "" : "s"}
        </span>
      </>
    ),
  },
  {
    label: "Traction claim",
    render: (r) => (
      <>
        {r.tractionSignal}
        <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <ProvenanceBadge provenance={r.tractionProvenance} />
          <span className="text-[11px] text-ink-muted">
            as of {formatDate(r.tractionAsOf)}
          </span>
        </span>
      </>
    ),
  },
  { label: "Commercial readiness", render: (r) => r.commercialReadiness },
  { label: "Capital intensity", render: (r) => r.capitalIntensity },
  { label: "Main technical risk", render: (r) => r.mainTechnicalRisk },
  { label: "Additional evidence needed", render: (r) => r.evidenceNeeded },
  { label: "Recommended next step", render: (r) => r.recommendedNextStep },
];

export function Comparison({ rows }: { rows: UniverseRow[] }) {
  const { mandateId, mandate } = useMandate();
  const [selected, setSelected] = useState<string[]>([]);

  const byScore = useMemo(
    () => [...rows].sort((a, b) => b.scores[mandateId] - a.scores[mandateId]),
    [rows, mandateId],
  );

  const chosen = useMemo(
    () =>
      selected
        .map((id) => rows.find((r) => r.id === id))
        .filter((r): r is UniverseRow => !!r),
    [selected, rows],
  );

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= MAX
          ? prev
          : [...prev, id],
    );
  }

  return (
    <div className="space-y-6">
      <MandateSelector />

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="h-section">
            Select up to {MAX} private companies to compare
          </h2>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-sm font-medium text-accent hover:underline"
            >
              Clear selection
            </button>
          )}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">
          Ordered by score under {mandate.name}. Scores re-rank when the mandate
          changes, so a comparison is always read against one stated mandate
          rather than in the abstract.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {byScore.map((r) => {
            const on = selected.includes(r.id);
            const full = selected.length >= MAX && !on;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggle(r.id)}
                disabled={full}
                aria-pressed={on}
                data-compare-chip={r.id}
                className={`rounded border px-2.5 py-1.5 text-xs font-medium transition ${
                  on
                    ? "border-accent bg-accent-soft text-ink"
                    : full
                      ? "cursor-not-allowed border-line bg-surface text-ink-muted opacity-50"
                      : "border-line bg-surface text-ink-soft hover:border-accent-line"
                }`}
              >
                {r.name}
                <span className="ml-1.5 font-mono text-ink-muted">
                  {r.scores[mandateId]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {chosen.length === 0 ? (
        <p className="rounded-lg border border-line bg-surface p-6 text-sm text-ink-muted">
          Choose two or more companies above to see them side by side.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[44rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-soft text-left">
                <th className="w-40 py-3 pl-4 pr-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Field
                </th>
                {chosen.map((r) => (
                  <th key={r.id} className="py-3 px-3 align-top">
                    <Link
                      href={`/universe/${r.id}`}
                      className="font-medium text-ink hover:text-accent hover:underline"
                    >
                      {r.name}
                    </Link>
                    <div className="mt-2 flex items-center gap-2">
                      <ScoreBadge score={r.scores[mandateId]} showBand={false} />
                      <span className="text-[11px] text-ink-muted">
                        {RELEVANCE_TIERS[r.tiers[mandateId]].label}
                      </span>
                    </div>
                    <div className="mt-2 w-28">
                      <ScoreBar score={r.scores[mandateId]} />
                    </div>
                    <div className="mt-1.5 text-[11px] font-normal text-ink-muted">
                      {priorityAdjustment(r) > 0
                        ? `Plus ${priorityAdjustment(r)} on the overview ordering`
                        : "No overview adjustment"}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(r.id)}
                      className="mt-2 text-[11px] font-normal text-ink-muted hover:text-accent hover:underline"
                    >
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIELDS.map((f) => (
                <tr key={f.label} className="border-b border-line last:border-0">
                  <th className="py-3 pl-4 pr-3 text-left align-top text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    {f.label}
                  </th>
                  {chosen.map((r) => (
                    <td
                      key={r.id}
                      className="max-w-xs py-3 px-3 align-top text-xs leading-relaxed text-ink-soft"
                    >
                      {f.render(r, mandateId)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

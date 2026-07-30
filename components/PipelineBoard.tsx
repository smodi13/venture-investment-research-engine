"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { useMandate } from "./MandateProvider";
import { MandateSelector } from "./MandateSelector";
import { ScoreBadge } from "./Score";
import { DemonstrationBadge } from "./Provenance";
import type { UniverseRow } from "@/lib/rows";
import {
  mergeRows,
  resetWorkflow,
  updateRecord,
  useOverrides,
  type WorkflowRow,
} from "@/lib/storage";
import { downloadCsv, recordsToCsv } from "@/lib/csv";
import { formatDate } from "@/lib/format";
import { PIPELINE_STAGES, PRIORITIES } from "@/lib/types";
import type { PipelineStage, Priority } from "@/lib/types";

const STAGE_TONE: Record<string, string> = {
  Passed: "border-line bg-canvas text-ink-muted",
  Invested: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Monitoring: "border-line bg-canvas text-ink-soft",
  "Partner review": "border-accent-line bg-accent-soft text-accent",
  "Investment memo": "border-accent-line bg-accent-soft text-accent",
};

const PRIORITY_TONE: Record<Priority, string> = {
  High: "border-amber-200 bg-amber-50 text-amber-800",
  Medium: "border-line bg-canvas text-ink-soft",
  Low: "border-line bg-canvas text-ink-muted",
};

export function PipelineBoard({ rows }: { rows: UniverseRow[] }) {
  const { mandateId, mandate } = useMandate();
  const overrides = useOverrides();
  const [statusFilter, setStatusFilter] = useState("Any");
  const [priorityFilter, setPriorityFilter] = useState("Any");
  const [expanded, setExpanded] = useState<string | null>(null);

  const records = useMemo(
    () => mergeRows(rows, overrides),
    [rows, overrides],
  );

  const filtered = useMemo(
    () =>
      records
        .filter((r) => statusFilter === "Any" || r.status === statusFilter)
        .filter((r) => priorityFilter === "Any" || r.priority === priorityFilter)
        .sort((a, b) => b.scores[mandateId] - a.scores[mandateId]),
    [records, statusFilter, priorityFilter, mandateId],
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of records) map.set(r.status, (map.get(r.status) ?? 0) + 1);
    return map;
  }, [records]);

  function patch(id: string, next: Partial<WorkflowRow>) {
    updateRecord(id, next);
  }

  function onReset() {
    resetWorkflow();
    setExpanded(null);
  }

  function exportCsv() {
    const csv = recordsToCsv(filtered, mandateId, mandate.name);
    downloadCsv(
      `pipeline-${mandateId}-${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-4 sm:p-5">
        <MandateSelector variant="compact" />
      </div>

      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {PIPELINE_STAGES.map((stage) => (
          <button
            key={stage}
            type="button"
            onClick={() =>
              setStatusFilter((cur) => (cur === stage ? "Any" : stage))
            }
            aria-pressed={statusFilter === stage}
            className={`rounded-lg border px-3 py-2 text-left transition-colors ${
              statusFilter === stage
                ? "border-accent bg-accent-soft"
                : "border-line bg-surface hover:border-line-strong hover:bg-canvas"
            }`}
          >
            <div className="font-mono text-lg font-semibold text-ink">
              {counts.get(stage) ?? 0}
            </div>
            <div className="text-xs leading-tight text-ink-soft">{stage}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <label className="block">
            <span className="label">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-52"
            >
              <option value="Any">All statuses</option>
              {PIPELINE_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label">Priority</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input w-40"
            >
              <option value="Any">All priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportCsv} className="btn-secondary">
            Export {filtered.length} to CSV
          </button>
          <button type="button" onClick={onReset} className="btn-ghost">
            Reset demonstration data
          </button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[64rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pl-4 pr-3 font-semibold text-ink">Company</th>
              <th className="py-3 px-3 font-semibold text-ink">Status</th>
              <th className="py-3 px-3 font-semibold text-ink">Priority</th>
              <th className="py-3 px-3 font-semibold text-ink">Next step</th>
              <th className="py-3 px-3 font-semibold text-ink">Owner</th>
              <th className="py-3 px-3 font-semibold text-ink">Activity</th>
              <th className="py-3 pl-3 pr-4 font-semibold text-ink">Score</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <Fragment key={r.id}>
                <tr className="border-b border-line align-top last:border-0">
                  <td className="py-3 pl-4 pr-3">
                    <Link
                      href={`/universe/${r.id}`}
                      className="font-medium text-ink hover:text-accent hover:underline"
                    >
                      {r.name}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="chip">{r.sector}</span>
                      {r.isDemonstration && <DemonstrationBadge />}
                    </div>
                    <div className="mt-1 text-xs text-ink-muted">
                      Sourced via {r.source}, {formatDate(r.dateSourced)}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((cur) => (cur === r.id ? null : r.id))
                      }
                      className="mt-1.5 text-xs font-medium text-accent hover:underline"
                      aria-expanded={expanded === r.id}
                    >
                      {expanded === r.id ? "Hide notes" : "Notes and next step"}
                    </button>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={r.status}
                      onChange={(e) =>
                        patch(r.id, {
                          status: e.target.value as PipelineStage,
                        })
                      }
                      aria-label={`Pipeline status for ${r.name}`}
                      className={`rounded-lg border px-2 py-1 text-xs font-medium ${
                        STAGE_TONE[r.status] ??
                        "border-line bg-surface text-ink-soft"
                      }`}
                    >
                      {PIPELINE_STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={r.priority}
                      onChange={(e) =>
                        patch(r.id, { priority: e.target.value as Priority })
                      }
                      aria-label={`Priority for ${r.name}`}
                      className={`rounded-lg border px-2 py-1 text-xs font-medium ${PRIORITY_TONE[r.priority]}`}
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="max-w-xs py-3 px-3 text-xs leading-relaxed text-ink-soft">
                    {r.nextStep}
                    <div className="mt-1 text-ink-muted">
                      Due {formatDate(r.nextStepDate)}
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-ink-soft">
                    {r.owner}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-ink-muted">
                    {formatDate(r.lastActivity)}
                  </td>
                  <td className="py-3 pl-3 pr-4">
                    <ScoreBadge score={r.scores[mandateId]} showBand={false} />
                  </td>
                </tr>
                {expanded === r.id && (
                  <tr className="border-b border-line bg-canvas">
                    <td colSpan={7} className="px-4 py-4">
                      <div className="grid gap-4 lg:grid-cols-2">
                        <label className="block">
                          <span className="label">Notes</span>
                          <textarea
                            value={r.notes}
                            onChange={(e) =>
                              patch(r.id, { notes: e.target.value })
                            }
                            rows={4}
                            placeholder="What do you actually think, and what would change your mind?"
                            className="input resize-y"
                          />
                        </label>
                        <div className="space-y-3">
                          <label className="block">
                            <span className="label">Next step</span>
                            <input
                              type="text"
                              value={r.nextStep}
                              onChange={(e) =>
                                patch(r.id, { nextStep: e.target.value })
                              }
                              className="input"
                            />
                          </label>
                          <label className="block">
                            <span className="label">Next step date</span>
                            <input
                              type="date"
                              value={r.nextStepDate}
                              onChange={(e) =>
                                patch(r.id, { nextStepDate: e.target.value })
                              }
                              className="input"
                            />
                          </label>
                          <div>
                            <span className="label">Key risk</span>
                            <p className="text-xs leading-relaxed text-ink-soft">
                              {r.keyRisk}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-sm text-ink-muted"
                >
                  No companies at this status. Clear the filters to see the full
                  pipeline.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs leading-relaxed text-ink-muted">
        Status, priority, notes, and next steps are stored in this browser only,
        using local storage. Nothing is sent to a server, and resetting returns
        every record to its starting state.
      </p>
    </div>
  );
}

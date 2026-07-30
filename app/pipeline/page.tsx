"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { LeadRecord, PipelineStatus } from "@/lib/types";
import {
  PIPELINE_STATUSES,
  FUNDING_STAGES,
  SIGNAL_TYPES,
  VISIBILITY_LEVELS,
} from "@/lib/types";
import { companyTotal } from "@/lib/scoring";
import { loadLeads, updateStatus, updateNotes, resetDemo } from "@/lib/storage";
import { leadsToCsv, downloadCsv } from "@/lib/csv";
import { formatFunding, formatLeadTime, daysAgo } from "@/lib/format";
import { Analytics } from "@/components/Analytics";
import { StatusBadge } from "@/components/StatusBadge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { SignalTypeChip } from "@/components/SignalTypeChip";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { CompanyDetail } from "@/components/CompanyDetail";

type SortKey = "score" | "earliness" | "recent" | "funding" | "name";

const ALL = "All";

const FUNDING_OPTIONS = [
  { label: "Any", value: Infinity },
  { label: "Undisclosed only", value: 0 },
  { label: "Under $1M", value: 1_000_000 },
  { label: "Under $2M", value: 2_000_000 },
];

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Highest score", value: "score" },
  { label: "Earliest vs. databases", value: "earliness" },
  { label: "Most recently surfaced", value: "recent" },
  { label: "Least capital raised", value: "funding" },
  { label: "Company name", value: "name" },
];

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort();
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<LeadRecord[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL);
  const [region, setRegion] = useState(ALL);
  const [stage, setStage] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [signalType, setSignalType] = useState(ALL);
  const [visibility, setVisibility] = useState(ALL);
  const [maxFunding, setMaxFunding] = useState<number>(Infinity);
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState<SortKey>("score");

  useEffect(() => {
    setLeads(loadLeads());
  }, []);

  const categories = useMemo(
    () => (leads ? uniqueSorted(leads.map((l) => l.category)) : []),
    [leads],
  );
  const regions = useMemo(
    () => (leads ? uniqueSorted(leads.map((l) => l.region)) : []),
    [leads],
  );

  const filtered = useMemo(() => {
    if (!leads) return [];
    const q = search.trim().toLowerCase();
    const result = leads.filter((l) => {
      if (
        q &&
        !`${l.name} ${l.founder} ${l.signal.handle}`.toLowerCase().includes(q)
      )
        return false;
      if (category !== ALL && l.category !== category) return false;
      if (region !== ALL && l.region !== region) return false;
      if (stage !== ALL && l.stage !== stage) return false;
      if (status !== ALL && l.status !== status) return false;
      if (signalType !== ALL && l.signal.type !== signalType) return false;
      if (visibility !== ALL && l.visibility !== visibility) return false;
      if (l.fundingRaisedUSD > maxFunding) return false;
      if (companyTotal(l) < minScore) return false;
      return true;
    });
    result.sort((a, b) => {
      switch (sort) {
        case "score":
          return companyTotal(b) - companyTotal(a);
        case "earliness":
          return b.daysAheadOfDatabases - a.daysAheadOfDatabases;
        case "recent":
          return b.dateDiscovered.localeCompare(a.dateDiscovered);
        case "funding":
          return a.fundingRaisedUSD - b.fundingRaisedUSD;
        case "name":
          return a.name.localeCompare(b.name);
      }
    });
    return result;
  }, [
    leads,
    search,
    category,
    region,
    stage,
    status,
    signalType,
    visibility,
    maxFunding,
    minScore,
    sort,
  ]);

  const selected = leads?.find((l) => l.id === selectedId) ?? null;

  function handleStatus(id: string, next: PipelineStatus) {
    updateStatus(id, next);
    setLeads((prev) =>
      prev ? prev.map((l) => (l.id === id ? { ...l, status: next } : l)) : prev,
    );
  }

  function handleNotes(id: string, notes: string) {
    updateNotes(id, notes);
    setLeads((prev) =>
      prev ? prev.map((l) => (l.id === id ? { ...l, notes } : l)) : prev,
    );
  }

  function handleReset() {
    if (
      !window.confirm(
        "Reset all pipeline statuses and notes back to the demo defaults?",
      )
    )
      return;
    resetDemo();
    setLeads(loadLeads());
  }

  function handleExport() {
    downloadCsv("x-sourcing-leads.csv", leadsToCsv(filtered));
  }

  function clearFilters() {
    setSearch("");
    setCategory(ALL);
    setRegion(ALL);
    setStage(ALL);
    setStatus(ALL);
    setSignalType(ALL);
    setVisibility(ALL);
    setMaxFunding(Infinity);
    setMinScore(0);
    setSort("score");
  }

  if (!leads) {
    return (
      <div className="container-page py-16">
        <div className="animate-pulse text-sm text-ink-muted">
          Loading pipeline…
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">Sourcing pipeline</p>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {leads.length} leads surfaced from X signals
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">
            Each row started as a post, not a database entry. Open any lead to
            see the signal that surfaced it, what corroborated it, and how it
            scored.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary text-sm">
            Export CSV
          </button>
          <button onClick={handleReset} className="btn-ghost text-sm">
            Reset demo
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-accent-line bg-accent-soft px-4 py-3 text-xs leading-relaxed text-ink-soft">
        <span className="font-semibold text-ink">Demonstration dataset.</span>{" "}
        Every record is an illustrative sample. Company names, founder names, X
        handles, engagement counts, and funding figures are invented to
        demonstrate the workflow, and no factual claim is made about any real
        business, account, or person. Status changes and notes save to your
        browser only.
      </div>

      <Analytics leads={leads} />

      {/* Filters */}
      <div className="card mb-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="label" htmlFor="search">
              Search company, founder, or handle
            </label>
            <input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Tessellate, @theo_distsys…"
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="sort">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="input"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="visibility">
              Database visibility
            </label>
            <select
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="input"
            >
              <option value={ALL}>Any visibility</option>
              {VISIBILITY_LEVELS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              <option value={ALL}>All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="signal">
              Signal type
            </label>
            <select
              id="signal"
              value={signalType}
              onChange={(e) => setSignalType(e.target.value)}
              className="input"
            >
              <option value={ALL}>All signal types</option>
              {SIGNAL_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="stage">
              Stage
            </label>
            <select
              id="stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="input"
            >
              <option value={ALL}>All stages</option>
              {FUNDING_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="region">
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="input"
            >
              <option value={ALL}>All regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="status">
              Pipeline status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input"
            >
              <option value={ALL}>All statuses</option>
              {PIPELINE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="funding">
              Capital raised
            </label>
            <select
              id="funding"
              value={maxFunding}
              onChange={(e) => setMaxFunding(Number(e.target.value))}
              className="input"
            >
              {FUNDING_OPTIONS.map((o) => (
                <option key={o.label} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="minscore">
              Minimum score:{" "}
              <span className="font-mono text-ink-soft">{minScore}</span>
            </label>
            <input
              id="minscore"
              type="range"
              min={0}
              max={100}
              step={5}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="mt-2.5 w-full accent-accent"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <span className="text-xs text-ink-muted">
            Showing{" "}
            <span className="font-mono font-medium text-ink-soft">
              {filtered.length}
            </span>{" "}
            of {leads.length} leads
          </span>
          <button onClick={clearFilters} className="btn-ghost text-xs">
            Clear filters
          </button>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm font-medium text-ink">No leads match.</p>
          <p className="mt-1 text-sm text-ink-muted">
            Try widening the filters or clearing the search.
          </p>
          <button onClick={clearFilters} className="btn-secondary mt-4 text-sm">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card hidden overflow-hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
              <caption className="sr-only">
                Sourcing pipeline. Select a row to open the full lead card.
              </caption>
              <thead>
                <tr className="border-b border-line bg-canvas text-left text-[11px] uppercase tracking-wider text-ink-muted">
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Company
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Originating signal
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Stage
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Lead time
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => setSelectedId(l.id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedId(l.id);
                      }
                    }}
                    className="cursor-pointer border-b border-line last:border-0 transition-colors hover:bg-canvas focus:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/40"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-ink">{l.name}</div>
                      <div className="text-xs text-ink-muted">
                        {l.founder} · {l.hq}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <SignalTypeChip type={l.signal.type} />
                      <div className="mt-1 font-mono text-[11px] text-ink-muted">
                        {l.signal.handle}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-ink-soft">{l.category}</td>
                    <td className="px-4 py-3.5">
                      <div className="text-ink-soft">{l.stage}</div>
                      <div className="font-mono text-[11px] text-ink-muted">
                        {formatFunding(l.fundingRaisedUSD)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <VisibilityBadge visibility={l.visibility} />
                      <div
                        className={`mt-1 font-mono text-[11px] ${
                          l.daysAheadOfDatabases > 0
                            ? "text-ink-muted"
                            : "text-rose-600"
                        }`}
                      >
                        {formatLeadTime(l.daysAheadOfDatabases)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end">
                        <ScoreBadge score={companyTotal(l)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 lg:hidden">
            {filtered.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                className="card-hover p-4 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-ink">{l.name}</div>
                    <div className="text-xs text-ink-muted">
                      {l.founder} · {l.hq}
                    </div>
                  </div>
                  <ScoreBadge score={companyTotal(l)} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <SignalTypeChip type={l.signal.type} />
                  <VisibilityBadge visibility={l.visibility} />
                  <StatusBadge status={l.status} />
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-soft">
                  <span>{l.category}</span>
                  <span aria-hidden>·</span>
                  <span>{l.stage}</span>
                  <span aria-hidden>·</span>
                  <span className="font-mono">
                    {formatFunding(l.fundingRaisedUSD)}
                  </span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-ink-muted">
                  {l.signal.handle} · {formatLeadTime(l.daysAheadOfDatabases)} ·
                  surfaced {daysAgo(l.dateDiscovered)}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <p className="mt-6 text-xs text-ink-muted">
        Scoring weights and the full filtering method are documented on the{" "}
        <Link href="/engine" className="font-medium text-accent hover:underline">
          engine page
        </Link>
        .
      </p>

      {selected && (
        <CompanyDetail
          lead={selected}
          onClose={() => setSelectedId(null)}
          onStatusChange={handleStatus}
          onNotesChange={handleNotes}
        />
      )}
    </div>
  );
}

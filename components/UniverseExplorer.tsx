"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMandate } from "./MandateProvider";
import { MandateSelector } from "./MandateSelector";
import { ScoreBadge, ScoreBar } from "./Score";
import { RELEVANCE_TIERS, RELEVANCE_ORDER } from "@/lib/scoring";
import { DemonstrationBadge } from "./Provenance";
import { CompareTable } from "./CompareTable";
import type { UniverseRow } from "@/lib/rows";
import { downloadCsv, recordsToCsv } from "@/lib/csv";
import { baseFields } from "@/lib/storage";
import { formatDate } from "@/lib/format";
import {
  CAPITAL_INTENSITIES,
  COMMERCIAL_READINESS,
  MARKET_TYPES,
  REGIONS,
  STAGES,
  type Stage,
} from "@/lib/types";

type SortKey =
  | "score"
  | "reviewed"
  | "name"
  | "stage"
  | "capital"
  | "market";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "score", label: "Highest score" },
  { key: "reviewed", label: "Recently reviewed" },
  { key: "name", label: "Company name" },
  { key: "stage", label: "Funding stage" },
  { key: "capital", label: "Capital raised" },
  { key: "market", label: "Public versus private" },
];

const ANY = "Any";

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      >
        <option value={ANY}>{ANY}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function UniverseExplorer({
  rows,
  sectors,
  subsectors,
}: {
  rows: UniverseRow[];
  sectors: string[];
  subsectors: string[];
}) {
  const { mandateId, mandate } = useMandate();

  const [query, setQuery] = useState("");
  const [sector, setSector] = useState(ANY);
  const [subsector, setSubsector] = useState(ANY);
  const [marketType, setMarketType] = useState(ANY);
  const [stage, setStage] = useState(ANY);
  const [region, setRegion] = useState(ANY);
  const [capital, setCapital] = useState(ANY);
  const [readiness, setReadiness] = useState(ANY);
  const [minScore, setMinScore] = useState(0);
  const [relevance, setRelevance] = useState(ANY);
  const [sort, setSort] = useState<SortKey>("score");
  const [compare, setCompare] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter((r) => {
      if (q && !r.search.includes(q)) return false;
      if (sector !== ANY && r.sector !== sector) return false;
      if (subsector !== ANY && r.subsector !== subsector) return false;
      if (marketType !== ANY && r.marketType !== marketType) return false;
      if (stage !== ANY && r.stage !== stage) return false;
      if (region !== ANY && r.region !== region) return false;
      if (capital !== ANY && r.capitalIntensity !== capital) return false;
      if (readiness !== ANY && r.commercialReadiness !== readiness) return false;
      if (relevance !== ANY && RELEVANCE_TIERS[r.tiers[mandateId]].label !== relevance)
        return false;
      if (r.scores[mandateId] < minScore) return false;
      return true;
    });

    const stageOrder = (s: Stage) => STAGES.indexOf(s);
    return list.sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "reviewed":
          return b.lastReviewed.localeCompare(a.lastReviewed);
        case "stage":
          return stageOrder(a.stage) - stageOrder(b.stage);
        case "capital":
          return (b.capitalRaisedValue ?? -1) - (a.capitalRaisedValue ?? -1);
        case "market":
          return (
            a.marketType.localeCompare(b.marketType) ||
            b.scores[mandateId] - a.scores[mandateId]
          );
        default:
          return b.scores[mandateId] - a.scores[mandateId];
      }
    });
  }, [
    rows,
    query,
    sector,
    subsector,
    marketType,
    stage,
    region,
    capital,
    readiness,
    relevance,
    minScore,
    sort,
    mandateId,
  ]);

  const compareRows = useMemo(
    () => compare.map((id) => rows.find((r) => r.id === id)!).filter(Boolean),
    [compare, rows],
  );

  function toggleCompare(id: string) {
    setCompare((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= 4
          ? prev
          : [...prev, id],
    );
  }

  function resetFilters() {
    setQuery("");
    setSector(ANY);
    setSubsector(ANY);
    setMarketType(ANY);
    setStage(ANY);
    setRegion(ANY);
    setCapital(ANY);
    setReadiness(ANY);
    setRelevance(ANY);
    setMinScore(0);
  }

  function exportCsv() {
    // The universe table has no workflow state of its own, so rows are
    // exported against their default pipeline placement.
    const records = filtered.map((r) => ({ ...r, ...baseFields(r) }));
    const csv = recordsToCsv(records, mandateId, mandate.name);
    downloadCsv(
      `research-universe-${mandateId}-${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-4 sm:p-5">
        <MandateSelector variant="compact" />
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          {mandate.scoringNote}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block flex-1">
          <span className="label">
            Search company, founder focus, sector, technology, or product
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="For example: inference, cooling, lineage, NVDA"
            className="input"
          />
        </label>
        <label className="block sm:w-56">
          <span className="label">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="input"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="btn-secondary shrink-0"
          aria-expanded={showFilters}
        >
          {showFilters ? "Hide filters" : "More filters"}
        </button>
      </div>

      {showFilters && (
        <div className="card grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Sector"
            value={sector}
            options={sectors}
            onChange={setSector}
          />
          <Select
            label="Subsector"
            value={subsector}
            options={subsectors}
            onChange={setSubsector}
          />
          <Select
            label="Public or private"
            value={marketType}
            options={MARKET_TYPES}
            onChange={setMarketType}
          />
          <Select
            label="Financing stage"
            value={stage}
            options={STAGES}
            onChange={setStage}
          />
          <Select
            label="Geography"
            value={region}
            options={REGIONS}
            onChange={setRegion}
          />
          <Select
            label="Capital intensity"
            value={capital}
            options={CAPITAL_INTENSITIES}
            onChange={setCapital}
          />
          <Select
            label="Commercial readiness"
            value={readiness}
            options={COMMERCIAL_READINESS}
            onChange={setReadiness}
          />
          <Select
            label="Mandate relevance"
            value={relevance}
            options={RELEVANCE_ORDER.map((t) => RELEVANCE_TIERS[t].label)}
            onChange={setRelevance}
          />
          <label className="block">
            <span className="label">Minimum score: {minScore}</span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
          </label>
          <div className="sm:col-span-2 lg:col-span-4">
            <button
              type="button"
              onClick={resetFilters}
              className="btn-ghost px-0"
            >
              Reset all filters
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          <span className="font-semibold text-ink">{filtered.length}</span> of{" "}
          {rows.length} companies, ranked under the{" "}
          <span className="font-medium text-ink">{mandate.name}</span> mandate.
        </p>
        <button type="button" onClick={exportCsv} className="btn-secondary">
          Export {filtered.length} to CSV
        </button>
      </div>

      {compareRows.length > 0 && (
        <CompareTable
          rows={compareRows}
          mandateId={mandateId}
          onRemove={toggleCompare}
          onClear={() => setCompare([])}
        />
      )}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[60rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="w-10 py-3 pl-4 pr-2" title="Add to comparison">
                <span className="sr-only">Compare</span>
              </th>
              <th className="py-3 pr-3 font-semibold text-ink">Company</th>
              <th className="py-3 px-3 font-semibold text-ink">Sector</th>
              <th className="py-3 px-3 font-semibold text-ink">Stage</th>
              <th className="py-3 px-3 font-semibold text-ink">Capital</th>
              <th className="py-3 px-3 font-semibold text-ink">Readiness</th>
              <th className="py-3 px-3 font-semibold text-ink">Reviewed</th>
              <th className="py-3 pl-3 pr-4 font-semibold text-ink">Score</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const score = r.scores[mandateId];
              const checked = compare.includes(r.id);
              return (
                <tr
                  key={r.id}
                  className="border-b border-line align-top last:border-0 hover:bg-canvas"
                >
                  <td className="py-3 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!checked && compare.length >= 4}
                      onChange={() => toggleCompare(r.id)}
                      aria-label={`Compare ${r.name}`}
                      className="mt-1 h-4 w-4 accent-accent"
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <Link
                      href={`/universe/${r.id}`}
                      className="font-medium text-ink hover:text-accent hover:underline"
                    >
                      {r.name}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="chip">{r.marketType}</span>
                      {r.ticker && <span className="chip">{r.ticker}</span>}
                      {r.isDemonstration && <DemonstrationBadge />}
                    </div>
                    <p className="mt-1.5 max-w-md text-xs leading-relaxed text-ink-muted">
                      {r.subsector}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-ink-soft">{r.sector}</td>
                  <td className="py-3 px-3 text-ink-soft">{r.stage}</td>
                  <td className="py-3 px-3 text-ink-soft">
                    {r.capitalRaised}
                    <div className="mt-0.5 text-xs text-ink-muted">
                      {r.capitalIntensity} intensity
                    </div>
                  </td>
                  <td className="py-3 px-3 text-ink-soft">
                    {r.commercialReadiness}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-ink-muted">
                    {formatDate(r.lastReviewed)}
                  </td>
                  <td className="py-3 pl-3 pr-4">
                    <ScoreBadge score={score} />
                    <div className="mt-2 w-24">
                      <ScoreBar score={score} />
                    </div>
                    <div
                      className="mt-1.5 text-[11px] leading-tight text-ink-muted"
                      title={RELEVANCE_TIERS[r.tiers[mandateId]].meaning}
                    >
                      {RELEVANCE_TIERS[r.tiers[mandateId]].label}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-sm text-ink-muted">
                  No companies match these filters. Try widening the score
                  threshold or resetting the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMandate } from "./MandateProvider";
import { MandateSelector } from "./MandateSelector";
import { RelevanceBadge, ScoreBadge, ScoreBar } from "./Score";
import { ConfidenceBadge } from "./Provenance";
import { RELEVANCE_ORDER, RELEVANCE_TIERS, mandateRelevance } from "@/lib/scoring";
import type { UniverseRow } from "@/lib/rows";
import { downloadCsv, recordsToCsv } from "@/lib/csv";
import { baseFields, mergeRows, useOverrides } from "@/lib/storage";
import { formatDate } from "@/lib/format";
import {
  CAPITAL_INTENSITIES,
  COMMERCIAL_READINESS,
  DATA_CONFIDENCE_LEVELS,
  PIPELINE_STAGES,
  REGIONS,
  STAGES,
  type Stage,
} from "@/lib/types";

type SortKey =
  | "score"
  | "reviewed"
  | "funded"
  | "name"
  | "stage"
  | "confidence"
  | "originality";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "score", label: "Highest score" },
  { key: "reviewed", label: "Recently reviewed" },
  { key: "funded", label: "Recently funded" },
  { key: "name", label: "Company name" },
  { key: "stage", label: "Financing stage" },
  { key: "confidence", label: "Data confidence" },
  { key: "originality", label: "Sourcing originality" },
];

const ANY = "Any";
const CONFIDENCE_ORDER = { High: 3, Medium: 2, Low: 1 } as const;

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
  const overrides = useOverrides();

  const [query, setQuery] = useState("");
  const [sector, setSector] = useState(ANY);
  const [subsector, setSubsector] = useState(ANY);
  const [stage, setStage] = useState(ANY);
  const [region, setRegion] = useState(ANY);
  const [capital, setCapital] = useState(ANY);
  const [readiness, setReadiness] = useState(ANY);
  const [confidence, setConfidence] = useState(ANY);
  const [status, setStatus] = useState(ANY);
  const [relevance, setRelevance] = useState(ANY);
  const [reviewedSince, setReviewedSince] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState<SortKey>("score");
  const [showFilters, setShowFilters] = useState(false);

  const records = useMemo(() => mergeRows(rows, overrides), [rows, overrides]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = records.filter((r) => {
      if (q && !r.search.includes(q)) return false;
      if (sector !== ANY && r.sector !== sector) return false;
      if (subsector !== ANY && r.subsector !== subsector) return false;
      if (stage !== ANY && r.stage !== stage) return false;
      if (region !== ANY && r.region !== region) return false;
      if (capital !== ANY && r.capitalIntensity !== capital) return false;
      if (readiness !== ANY && r.commercialReadiness !== readiness) return false;
      if (confidence !== ANY && r.dataConfidence !== confidence) return false;
      if (status !== ANY && r.status !== status) return false;
      if (
        relevance !== ANY &&
        RELEVANCE_TIERS[r.tiers[mandateId]].label !== relevance
      )
        return false;
      if (reviewedSince && r.lastReviewed < reviewedSince) return false;
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
        case "funded":
          return b.latestRoundDate.localeCompare(a.latestRoundDate);
        case "stage":
          return stageOrder(a.stage) - stageOrder(b.stage);
        case "confidence":
          return (
            CONFIDENCE_ORDER[b.dataConfidence] -
              CONFIDENCE_ORDER[a.dataConfidence] ||
            b.scores[mandateId] - a.scores[mandateId]
          );
        case "originality":
          return (
            Number(a.wellRecognised) - Number(b.wellRecognised) ||
            b.scores[mandateId] - a.scores[mandateId]
          );
        default:
          return b.scores[mandateId] - a.scores[mandateId];
      }
    });
  }, [
    records,
    query,
    sector,
    subsector,
    stage,
    region,
    capital,
    readiness,
    confidence,
    status,
    relevance,
    reviewedSince,
    minScore,
    sort,
    mandateId,
  ]);

  function resetFilters() {
    setQuery("");
    setSector(ANY);
    setSubsector(ANY);
    setStage(ANY);
    setRegion(ANY);
    setCapital(ANY);
    setReadiness(ANY);
    setConfidence(ANY);
    setStatus(ANY);
    setRelevance(ANY);
    setReviewedSince("");
    setMinScore(0);
  }

  function exportCsv() {
    const csv = recordsToCsv(filtered, mandateId, mandate.name);
    downloadCsv(
      `private-company-universe-${mandateId}-${new Date().toISOString().slice(0, 10)}.csv`,
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
            Search company, founder, technology, product, sector, or sourcing
            signal
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="For example: inference, welding, quantum, cement, Lonsberry"
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
          <Select label="Sector" value={sector} options={sectors} onChange={setSector} />
          <Select
            label="Subsector"
            value={subsector}
            options={subsectors}
            onChange={setSubsector}
          />
          <Select label="Financing stage" value={stage} options={STAGES} onChange={setStage} />
          <Select label="Geography" value={region} options={REGIONS} onChange={setRegion} />
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
            label="Data confidence"
            value={confidence}
            options={DATA_CONFIDENCE_LEVELS}
            onChange={setConfidence}
          />
          <Select
            label="Pipeline status"
            value={status}
            options={PIPELINE_STAGES}
            onChange={setStatus}
          />
          <Select
            label="Mandate relevance"
            value={relevance}
            options={RELEVANCE_ORDER.map((t) => RELEVANCE_TIERS[t].label)}
            onChange={setRelevance}
          />
          <label className="block">
            <span className="label">Reviewed on or after</span>
            <input
              type="date"
              value={reviewedSince}
              onChange={(e) => setReviewedSince(e.target.value)}
              className="input"
            />
          </label>
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
            <button type="button" onClick={resetFilters} className="btn-ghost px-0">
              Reset all filters
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          <span className="font-semibold text-ink">{filtered.length}</span> of{" "}
          {rows.length} verified private companies, ranked under the{" "}
          <span className="font-medium text-ink">{mandate.name}</span> mandate.
        </p>
        <button type="button" onClick={exportCsv} className="btn-secondary">
          Export {filtered.length} to CSV
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[64rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pl-4 pr-3 font-semibold text-ink">Company</th>
              <th className="py-3 px-3 font-semibold text-ink">Sector</th>
              <th className="py-3 px-3 font-semibold text-ink">Stage</th>
              <th className="py-3 px-3 font-semibold text-ink">
                Latest financing
              </th>
              <th className="py-3 px-3 font-semibold text-ink">Why sourced</th>
              <th className="py-3 px-3 font-semibold text-ink">Confidence</th>
              <th className="py-3 pl-3 pr-4 font-semibold text-ink">Score</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b border-line align-top last:border-0 hover:bg-canvas"
              >
                <td className="py-3 pl-4 pr-3">
                  <Link
                    href={`/universe/${r.id}`}
                    className="font-medium text-ink hover:text-accent hover:underline"
                  >
                    {r.name}
                  </Link>
                  <p className="mt-1 max-w-xs text-xs leading-relaxed text-ink-muted">
                    {r.subsector}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {r.headquarters}
                  </p>
                </td>
                <td className="py-3 px-3 text-ink-soft">{r.sector}</td>
                <td className="py-3 px-3 text-ink-soft">{r.stage}</td>
                <td className="max-w-[16rem] py-3 px-3 text-xs leading-relaxed text-ink-soft">
                  {r.latestRound}
                  <div className="mt-1 text-ink-muted">
                    {formatDate(r.latestRoundDate)}
                  </div>
                </td>
                <td className="max-w-[14rem] py-3 px-3 text-xs leading-relaxed text-ink-soft">
                  <span className="chip mb-1 inline-flex">{r.sourcingSignal}</span>
                  <div className="text-ink-muted">
                    Sourced {formatDate(r.dateSourced)}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <ConfidenceBadge confidence={r.dataConfidence} />
                  <div className="mt-1.5 text-xs text-ink-muted">
                    {r.sourceCount} source{r.sourceCount === 1 ? "" : "s"}
                  </div>
                  <div className="mt-1 text-xs text-ink-muted">
                    Reviewed {formatDate(r.lastReviewed)}
                  </div>
                </td>
                <td className="py-3 pl-3 pr-4">
                  <ScoreBadge score={r.scores[mandateId]} />
                  <div className="mt-2 w-24">
                    <ScoreBar score={r.scores[mandateId]} />
                  </div>
                  <div className="mt-1.5 text-[11px] leading-tight text-ink-muted">
                    {RELEVANCE_TIERS[r.tiers[mandateId]].label}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-ink-muted">
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

export { mandateRelevance, RelevanceBadge };

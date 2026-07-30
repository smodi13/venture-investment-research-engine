"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  EVENT_CATEGORIES,
  INTELLIGENCE,
  type IntelligenceEntry,
} from "@/lib/intelligence";
import { MANDATES, type MandateId } from "@/lib/mandates";
import { ProvenanceBadge } from "./Provenance";
import { formatDate } from "@/lib/format";
import { SECTORS, MARKET_TYPES } from "@/lib/types";

const ANY = "Any";

const CONFIDENCE_TONE: Record<string, string> = {
  High: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Medium: "border-amber-200 bg-amber-50 text-amber-800",
  Low: "border-line bg-canvas text-ink-muted",
};

/** Sectors each mandate emphasises, used by the mandate filter. */
function mandateSectors(id: MandateId): string[] {
  return MANDATES.find((m) => m.id === id)?.emphasisedSectors ?? [];
}

export function IntelligenceFeed() {
  const [sector, setSector] = useState(ANY);
  const [category, setCategory] = useState(ANY);
  const [marketType, setMarketType] = useState(ANY);
  const [mandate, setMandate] = useState(ANY);
  const [since, setSince] = useState("");

  const filtered = useMemo(() => {
    return INTELLIGENCE.filter((e: IntelligenceEntry) => {
      if (sector !== ANY && e.sector !== sector) return false;
      if (category !== ANY && e.category !== category) return false;
      if (marketType !== ANY && e.marketType !== marketType) return false;
      if (since && e.date < since) return false;
      if (mandate !== ANY) {
        const sectors = mandateSectors(mandate as MandateId);
        if (sectors.length > 0 && !sectors.includes(e.sector)) return false;
      }
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [sector, category, marketType, mandate, since]);

  return (
    <div className="space-y-6">
      <div className="card grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="block">
          <span className="label">Sector</span>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="input"
          >
            <option value={ANY}>All sectors</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Event category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
          >
            <option value={ANY}>All categories</option>
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Public or private</span>
          <select
            value={marketType}
            onChange={(e) => setMarketType(e.target.value)}
            className="input"
          >
            <option value={ANY}>Both</option>
            {MARKET_TYPES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Investment mandate</span>
          <select
            value={mandate}
            onChange={(e) => setMandate(e.target.value)}
            className="input"
          >
            <option value={ANY}>All mandates</option>
            {MANDATES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">On or after</span>
          <input
            type="date"
            value={since}
            onChange={(e) => setSince(e.target.value)}
            className="input"
          />
        </label>
      </div>

      <p className="text-sm text-ink-soft">
        <span className="font-semibold text-ink">{filtered.length}</span> of{" "}
        {INTELLIGENCE.length} entries.
      </p>

      <ol className="space-y-3">
        {filtered.map((e) => (
          <li key={e.id} className="card p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <time
                dateTime={e.date}
                className="font-mono text-xs font-semibold text-ink-muted"
              >
                {formatDate(e.date)}
              </time>
              <span className="chip">{e.category}</span>
              <span className="chip">{e.sector}</span>
              <span className="chip">{e.marketType}</span>
              <ProvenanceBadge provenance={e.provenance} />
              <span
                className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${CONFIDENCE_TONE[e.confidence]}`}
              >
                {e.confidence} confidence
              </span>
            </div>
            <h3 className="mt-2.5 text-sm font-semibold text-ink">
              {e.companyId ? (
                <Link
                  href={`/universe/${e.companyId}`}
                  className="hover:text-accent hover:underline"
                >
                  {e.subject}
                </Link>
              ) : (
                e.subject
              )}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              {e.summary}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="label">Investment relevance</p>
                <p className="text-xs leading-relaxed text-ink-soft">
                  {e.investmentRelevance}
                </p>
              </div>
              <div>
                <p className="label">Affected thesis</p>
                <p className="text-xs leading-relaxed text-ink-soft">
                  {e.affectedThesis}
                </p>
              </div>
            </div>
            <p className="mt-3 border-t border-line pt-2.5 text-xs leading-relaxed text-ink-muted">
              <span className="font-medium">Source. </span>
              {e.sourceNote}
            </p>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="card p-8 text-center text-sm text-ink-muted">
            No entries match these filters.
          </li>
        )}
      </ol>
    </div>
  );
}

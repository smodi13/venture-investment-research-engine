import {
  PROVENANCE_LABEL,
  PROVENANCE_NOTE,
  type Fact,
  type Provenance,
} from "@/lib/types";
import { factText, formatDate } from "@/lib/format";
import { getSource } from "@/lib/sources";

/**
 * Provenance is rendered next to the value it qualifies, never in a legend
 * elsewhere on the page. A reader should not have to remember what a colour
 * means in order to know whether a number was reported or estimated.
 */

const TONE: Record<Provenance, string> = {
  reported: "border-emerald-200 bg-emerald-50 text-emerald-800",
  estimate: "border-amber-200 bg-amber-50 text-amber-800",
  demonstration: "border-violet-200 bg-violet-50 text-violet-800",
  unverified: "border-orange-200 bg-orange-50 text-orange-800",
  "not-disclosed": "border-line bg-canvas text-ink-muted",
};

export function ProvenanceBadge({
  provenance,
  className = "",
}: {
  provenance: Provenance;
  className?: string;
}) {
  return (
    <span
      title={PROVENANCE_NOTE[provenance]}
      className={`inline-flex items-center whitespace-nowrap rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TONE[provenance]} ${className}`}
    >
      {PROVENANCE_LABEL[provenance]}
    </span>
  );
}

/** A labelled figure with its provenance, as-of date, and source link. */
export function FactRow({
  label,
  fact,
}: {
  label: string;
  fact: Fact<string | number>;
}) {
  const source = getSource(fact.sourceId);
  return (
    <div className="border-b border-line py-3 last:border-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <dt className="text-sm font-medium text-ink-soft">{label}</dt>
        <ProvenanceBadge provenance={fact.provenance} />
      </div>
      <dd className="mt-1 text-sm leading-relaxed text-ink">
        {factText(fact)}
      </dd>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        As of {formatDate(fact.asOf)}
        {fact.note ? `. ${fact.note}` : ""}
      </p>
      {source && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs font-medium text-accent hover:underline"
        >
          {source.name}
        </a>
      )}
    </div>
  );
}

/** Inline evidence claim carrying its own confidence label. */
export function EvidenceLine({
  claim,
  provenance,
  asOf,
  sourceId,
}: {
  claim: string;
  provenance: Provenance;
  asOf: string;
  sourceId?: string;
}) {
  const source = getSource(sourceId);
  return (
    <li className="flex flex-col gap-1 border-b border-line py-2.5 last:border-0">
      <span className="text-sm leading-relaxed text-ink-soft">{claim}</span>
      <span className="flex flex-wrap items-center gap-2">
        <ProvenanceBadge provenance={provenance} />
        <span className="text-xs text-ink-muted">{formatDate(asOf)}</span>
        {source && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-accent hover:underline"
          >
            Source
          </a>
        )}
      </span>
    </li>
  );
}

/** The badge shown wherever a fictional company appears. */
export function DemonstrationBadge({ className = "" }: { className?: string }) {
  return (
    <span
      title="A fictional company included to exercise the research workflow. It describes no real business."
      className={`inline-flex items-center whitespace-nowrap rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-800 ${className}`}
    >
      Demonstration
    </span>
  );
}

import {
  DATA_CONFIDENCE_MEANING,
  NOT_DISCLOSED,
  type Basis,
  type DataConfidence,
} from "@/lib/types";
import { getSource } from "@/lib/sources";
import { formatDate } from "@/lib/format";

/**
 * Evidence rendering.
 *
 * Confidence and basis are shown next to the value they qualify, never in a
 * legend elsewhere on the page. A reader should not have to remember what a
 * colour means to know how solid a claim is.
 */

const CONFIDENCE_TONE: Record<DataConfidence, string> = {
  High: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Medium: "border-amber-200 bg-amber-50 text-amber-800",
  Low: "border-orange-200 bg-orange-50 text-orange-800",
};

export function ConfidenceBadge({
  confidence,
  className = "",
}: {
  confidence: DataConfidence;
  className?: string;
}) {
  return (
    <span
      title={DATA_CONFIDENCE_MEANING[confidence]}
      className={`inline-flex items-center whitespace-nowrap rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${CONFIDENCE_TONE[confidence]} ${className}`}
    >
      {confidence} confidence
    </span>
  );
}

export function BasisBadge({ basis }: { basis: Basis }) {
  return (
    <span
      title={
        basis === "verified"
          ? "Rests on something a reader can check in a cited source."
          : "Rests on analyst judgment about the available evidence."
      }
      className={`inline-flex whitespace-nowrap rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        basis === "verified"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-line bg-canvas text-ink-muted"
      }`}
    >
      {basis === "verified" ? "Verified" : "Judgment"}
    </span>
  );
}

/** A link to a registered source, opened safely in a new tab. */
export function SourceLink({
  sourceId,
  showPublisher = true,
}: {
  sourceId: string | undefined;
  showPublisher?: boolean;
}) {
  const source = getSource(sourceId);
  if (!source) return null;
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${source.title}. ${source.publisher}. Supports: ${source.supports}`}
      className="text-xs font-medium text-accent hover:underline"
    >
      {showPublisher ? source.publisher : "Source"}
      {source.primary ? " (primary)" : ""}
    </a>
  );
}

/** An evidence claim with its basis and source. */
export function EvidenceLine({
  claim,
  sourceId,
  basis,
}: {
  claim: string;
  sourceId: string;
  basis: Basis;
}) {
  return (
    <li className="flex flex-col gap-1 border-b border-line py-2.5 last:border-0">
      <span className="text-sm leading-relaxed text-ink-soft">{claim}</span>
      <span className="flex flex-wrap items-center gap-2">
        <BasisBadge basis={basis} />
        <SourceLink sourceId={sourceId} />
      </span>
    </li>
  );
}

/**
 * A value that may be absent. Missing values are rendered explicitly rather
 * than left blank, because a blank cell reads as a small number.
 */
export function Value({ value }: { value: string | number }) {
  if (value === NOT_DISCLOSED) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink-muted/50" />
        {NOT_DISCLOSED}
      </span>
    );
  }
  return <span className="text-sm text-ink-soft">{String(value)}</span>;
}

/** A dated fact with its source, used across the financing sections. */
export function DatedFact({
  label,
  value,
  date,
  sourceId,
}: {
  label: string;
  value: string;
  date?: string;
  sourceId?: string;
}) {
  return (
    <div className="border-b border-line py-3 last:border-0">
      <dt className="label">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink-soft">
        <Value value={value} />
      </dd>
      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        {date && <span>Announced {formatDate(date)}</span>}
        <SourceLink sourceId={sourceId} />
      </p>
    </div>
  );
}

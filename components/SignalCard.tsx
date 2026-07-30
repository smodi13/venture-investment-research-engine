import type { XSignal, Visibility } from "@/lib/types";
import { formatDate, formatLeadTime } from "@/lib/format";
import { SignalTypeChip } from "./SignalTypeChip";
import { VisibilityBadge } from "./VisibilityBadge";

function XGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * The provenance record for a lead: the X post that surfaced it, why it
 * cleared the noise filter, and what corroborated it before scoring. This is
 * the part of the workflow that a mainstream database cannot reproduce.
 */
export function SignalCard({
  signal,
  visibility,
  daysAhead,
  compact = false,
}: {
  signal: XSignal;
  visibility: Visibility;
  daysAhead: number;
  compact?: boolean;
}) {
  const early = daysAhead > 0;
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      {/* Provenance header */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 border-b border-line bg-signal-soft px-4 py-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-signal text-white">
          <XGlyph className="h-3 w-3" />
        </span>
        <span className="font-mono text-xs font-medium text-ink">
          {signal.handle}
        </span>
        <SignalTypeChip type={signal.type} />
        <span className="ml-auto font-mono text-[11px] text-ink-muted">
          {formatDate(signal.observedAt)}
        </span>
      </div>

      <div className="px-4 py-4">
        {/* The post itself */}
        <blockquote className="border-l-2 border-line-strong pl-3.5 text-sm leading-relaxed text-ink">
          {signal.excerpt}
        </blockquote>
        <p className="mt-2.5 pl-3.5 font-mono text-[11px] text-ink-muted">
          {signal.engagement}
        </p>

        {/* Earliness: the metric the engine optimizes for */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <VisibilityBadge visibility={visibility} />
          <span
            className={`inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-xs font-medium ${
              early
                ? "border-accent-line bg-accent-soft text-accent"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {formatLeadTime(daysAhead)}
          </span>
          <span className="text-xs text-ink-muted">
            vs. a mainstream database profile
          </span>
        </div>

        {!compact && (
          <>
            <div className="mt-4 rounded-lg bg-canvas px-3.5 py-3">
              <div className="label mb-1">Why it cleared the filter</div>
              <p className="text-sm leading-relaxed text-ink-soft">
                {signal.whySurfaced}
              </p>
            </div>

            <div className="mt-4">
              <div className="label">
                Corroborated before scoring ({signal.corroboration.length})
              </div>
              <ul className="space-y-1.5">
                {signal.corroboration.map((c, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm leading-relaxed text-ink-soft"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50"
                    />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

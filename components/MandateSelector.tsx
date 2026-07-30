"use client";

import { MANDATES } from "@/lib/mandates";
import { useMandate } from "./MandateProvider";

/**
 * The mandate selector.
 *
 * Changing the selection re-weights every score in the platform, re-ranks the
 * universe, and changes the diligence questions attached to each company. It
 * is the single most important control in the application, so it is rendered
 * as a visible set of options rather than hidden inside a dropdown.
 */
export function MandateSelector({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  const { mandateId, mandate, setMandateId } = useMandate();

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Mandate
        </span>
        <div
          role="group"
          aria-label="Investment mandate"
          className="flex flex-wrap gap-1"
        >
          {MANDATES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMandateId(m.id)}
              aria-pressed={m.id === mandateId}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                m.id === mandateId
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-surface text-ink-soft hover:border-line-strong hover:bg-canvas"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        role="group"
        aria-label="Investment mandate"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {MANDATES.map((m) => {
          const active = m.id === mandateId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMandateId(m.id)}
              aria-pressed={active}
              className={`rounded-xl border p-4 text-left transition-colors ${
                active
                  ? "border-accent bg-accent-soft"
                  : "border-line bg-surface hover:border-line-strong hover:bg-canvas"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-sm font-semibold ${active ? "text-accent" : "text-ink"}`}
                >
                  {m.name}
                </span>
                {active && (
                  <span className="rounded border border-accent-line bg-surface px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                    Active
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                {m.summary}
              </p>
              <p className="mt-2 text-[11px] font-medium text-ink-muted">
                {m.targetStages}
              </p>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        <span className="font-medium text-ink">Central question. </span>
        {mandate.centralQuestion}
      </p>
    </div>
  );
}

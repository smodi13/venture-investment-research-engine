import type { Visibility } from "@/lib/types";

/**
 * How visible the company already is in mainstream startup databases.
 * "Not listed" is the desirable state here, which is why it carries the
 * positive colour, because the sourcing edge exists only while this is thin.
 */
const STYLES: Record<Visibility, string> = {
  "Not listed": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Thin profile": "border-amber-200 bg-amber-50 text-amber-800",
  Listed: "border-slate-200 bg-slate-100 text-slate-600",
};

const LABELS: Record<Visibility, string> = {
  "Not listed": "Not in databases",
  "Thin profile": "Thin profile",
  Listed: "Already listed",
};

export function VisibilityBadge({
  visibility,
  className = "",
}: {
  visibility: Visibility;
  className?: string;
}) {
  return (
    <span
      title={`Mainstream startup database coverage: ${visibility}`}
      className={`inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium ${STYLES[visibility]} ${className}`}
    >
      {LABELS[visibility]}
    </span>
  );
}

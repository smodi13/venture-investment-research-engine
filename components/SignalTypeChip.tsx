import type { SignalType } from "@/lib/types";

/**
 * Signal types are ordered by how hard they are to fake. Demos and
 * benchmarked releases sit at the top; opinion-shaped posts sit lower.
 * The colour carries that ordering.
 */
const STYLES: Record<SignalType, string> = {
  "Product demo": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Open-source release": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Technical thread": "border-accent-line bg-accent-soft text-accent",
  "Recurring problem discussion": "border-violet-200 bg-violet-50 text-violet-800",
  "Customer pain point": "border-sky-200 bg-sky-50 text-sky-800",
  "Hiring signal": "border-amber-200 bg-amber-50 text-amber-800",
  "Build-in-public update": "border-slate-200 bg-slate-100 text-slate-700",
};

export function SignalTypeChip({
  type,
  className = "",
}: {
  type: SignalType;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium ${STYLES[type]} ${className}`}
    >
      {type}
    </span>
  );
}

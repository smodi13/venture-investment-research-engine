import type { PipelineStatus } from "@/lib/types";

const STYLES: Record<PipelineStatus, string> = {
  "New Signal": "bg-slate-100 text-slate-700 border-slate-200",
  Researching: "bg-sky-50 text-sky-700 border-sky-200",
  "Founder Outreach": "bg-amber-50 text-amber-700 border-amber-200",
  "Partner Review": "bg-emerald-50 text-emerald-700 border-emerald-200",
  Passed: "bg-rose-50 text-rose-700 border-rose-200",
};

export function StatusBadge({ status }: { status: PipelineStatus }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}

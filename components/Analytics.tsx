import { companyTotal } from "@/lib/scoring";
import { PIPELINE_STATUSES } from "@/lib/types";
import type { LeadRecord } from "@/lib/types";

function countBy<T extends string>(
  items: LeadRecord[],
  key: (l: LeadRecord) => T,
): { label: T; count: number }[] {
  const map = new Map<T, number>();
  for (const item of items) {
    const k = key(item);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

function DistroBar({
  rows,
  total,
}: {
  rows: { label: string; count: number }[];
  total: number;
}) {
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-xs">
            <span className="truncate text-ink-soft">{r.label}</span>
            <span className="shrink-0 font-mono tabular-nums text-ink-muted">
              {r.count}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${total ? (r.count / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Analytics({ leads }: { leads: LeadRecord[] }) {
  const total = leads.length;
  const avg =
    total === 0
      ? 0
      : Math.round(leads.reduce((sum, l) => sum + companyTotal(l), 0) / total);
  const partnerReview = leads.filter((l) => l.status === "Partner Review")
    .length;
  const preDatabase = leads.filter((l) => l.visibility === "Not listed").length;
  const medianLead = median(leads.map((l) => l.daysAheadOfDatabases));

  const byCategory = countBy(leads, (l) => l.category);
  const bySignal = countBy(leads, (l) => l.signal.type);
  const byStatus = PIPELINE_STATUSES.map((s) => ({
    label: s,
    count: leads.filter((l) => l.status === s).length,
  }));

  const stats = [
    {
      label: "Leads in pipeline",
      value: String(total),
      hint: "surfaced from X signals",
    },
    {
      label: "Median lead time",
      value: medianLead > 0 ? `${medianLead}d` : "n/a",
      hint: "ahead of a database profile",
    },
    {
      label: "Not yet in databases",
      value: `${preDatabase}/${total}`,
      hint: "no mainstream profile found",
    },
    {
      label: "Average score",
      value: total ? `${avg}` : "n/a",
      hint: `of 100 · ${partnerReview} at partner review`,
    },
  ];

  return (
    <section aria-label="Pipeline analytics" className="mb-6">
      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="font-mono text-2xl font-semibold tabular-nums text-ink">
              {s.value}
            </div>
            <div className="mt-1.5 text-xs font-medium text-ink-soft">
              {s.label}
            </div>
            <div className="mt-0.5 text-xs text-ink-muted">{s.hint}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="card p-4">
          <h3 className="mb-3 text-sm font-medium text-ink">By category</h3>
          <DistroBar rows={byCategory} total={total} />
        </div>
        <div className="card p-4">
          <h3 className="mb-3 text-sm font-medium text-ink">
            By originating X signal
          </h3>
          <DistroBar rows={bySignal} total={total} />
        </div>
        <div className="card p-4">
          <h3 className="mb-3 text-sm font-medium text-ink">
            By pipeline stage
          </h3>
          <DistroBar rows={byStatus} total={total} />
        </div>
      </div>
    </section>
  );
}

import { SCORE_FACTORS, MAX_SCORE, totalScore, scoreTier } from "@/lib/scoring";
import type { ScoreBreakdown } from "@/lib/types";

const FILL = {
  strong: "bg-emerald-600",
  solid: "bg-accent",
  watch: "bg-slate-400",
} as const;

export function ScoreBars({ scores }: { scores: ScoreBreakdown }) {
  const total = totalScore(scores);
  const { tone, label } = scoreTier(total);
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink">Sourcing score</span>
        <span className="font-mono text-sm tabular-nums text-ink-muted">
          <span className="text-lg font-semibold text-ink">{total}</span> /{" "}
          {MAX_SCORE}
        </span>
      </div>
      <p className="mb-4 text-xs text-ink-muted">
        {label}. Weights are fixed and published; every factor is shown so any
        single input can be disagreed with.
      </p>
      <div className="space-y-2.5">
        {SCORE_FACTORS.map((f) => {
          const val = scores[f.key] ?? 0;
          const pct = Math.round((val / f.max) * 100);
          return (
            <div key={f.key}>
              <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                <span className="text-ink-soft">{f.label}</span>
                <span className="shrink-0 font-mono tabular-nums text-ink-muted">
                  {val}/{f.max}
                </span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-line"
                role="img"
                aria-label={`${f.label}: ${val} of ${f.max}`}
              >
                <div
                  className={`h-full rounded-full ${FILL[tone]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

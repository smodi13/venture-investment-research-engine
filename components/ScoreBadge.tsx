import { scoreTier, MAX_SCORE } from "@/lib/scoring";

const TONES = {
  strong: "bg-emerald-600 text-white",
  solid: "bg-accent text-white",
  watch: "bg-slate-200 text-slate-700",
} as const;

export function ScoreBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "md" | "lg";
}) {
  const { tone, label } = scoreTier(score);
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg font-mono font-semibold tabular-nums ${
        TONES[tone]
      } ${size === "lg" ? "h-12 w-14 text-lg" : "h-9 w-11 text-sm"}`}
      title={`${score} of ${MAX_SCORE}, ${label}`}
    >
      {score}
    </span>
  );
}

/** Score plus the recommendation it implies, for the detail header. */
export function ScoreTierLabel({ score }: { score: number }) {
  const { tone, label } = scoreTier(score);
  const text =
    tone === "strong"
      ? "text-emerald-700"
      : tone === "solid"
        ? "text-accent"
        : "text-ink-muted";
  return <span className={`text-xs font-medium ${text}`}>{label}</span>;
}

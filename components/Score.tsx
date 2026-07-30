import {
  scoreBand,
  type Relevance,
  type RelevanceTierId,
  type ScoreResult,
  type ScoreTone,
} from "@/lib/scoring";
import { BasisBadge, ConfidenceBadge, SourceLink } from "./Provenance";

const TONE: Record<ScoreTone, { chip: string; bar: string }> = {
  priority: {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-800",
    bar: "bg-emerald-500",
  },
  watchlist: {
    chip: "border-accent-line bg-accent-soft text-accent",
    bar: "bg-accent",
  },
  diligence: {
    chip: "border-amber-200 bg-amber-50 text-amber-800",
    bar: "bg-amber-500",
  },
  low: { chip: "border-line bg-canvas text-ink-muted", bar: "bg-ink-muted" },
};

const RELEVANCE_TONE: Record<RelevanceTierId, string> = {
  core: "border-emerald-200 bg-emerald-50 text-emerald-800",
  adjacent: "border-accent-line bg-accent-soft text-accent",
  peripheral: "border-amber-200 bg-amber-50 text-amber-800",
  marginal: "border-orange-200 bg-orange-50 text-orange-800",
  outside: "border-line bg-canvas text-ink-muted",
};

export function RelevanceBadge({
  relevance,
  className = "",
}: {
  relevance: Relevance;
  className?: string;
}) {
  return (
    <span
      title={`${relevance.tier.meaning} Score ceiling ${relevance.tier.ceiling}.`}
      className={`inline-flex items-center whitespace-nowrap rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${RELEVANCE_TONE[relevance.tier.id]} ${className}`}
    >
      {relevance.tier.label}
    </span>
  );
}

export function ScoreBadge({
  score,
  showBand = true,
}: {
  score: number;
  showBand?: boolean;
}) {
  const band = scoreBand(score);
  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-mono text-sm font-semibold tabular-nums text-ink">
        {score}
      </span>
      {showBand && (
        <span
          className={`inline-flex whitespace-nowrap rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TONE[band.tone].chip}`}
        >
          {band.label}
        </span>
      )}
    </span>
  );
}

export function ScoreBar({ score }: { score: number }) {
  const band = scoreBand(score);
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-canvas"
      role="img"
      aria-label={`Score ${score} of 100, ${band.label}`}
    >
      <div
        className={`h-full rounded-full ${TONE[band.tone].bar}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

/**
 * The factor breakdown.
 *
 * Every row shows the rating, the weight, the points, the evidence, the
 * explanation, the confidence, whether it is verified or judgment, and its
 * source. The table ends with the relevance adjustment, so the arithmetic from
 * quality through to final score is visible in one place.
 */
export function ScoreBreakdown({ result }: { result: ScoreResult }) {
  const { relevance } = result;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[52rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line-strong text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Factor</th>
            <th className="py-2 px-3 text-right font-semibold text-ink">
              Rating
            </th>
            <th className="py-2 px-3 text-right font-semibold text-ink">
              Weight
            </th>
            <th className="py-2 px-3 text-right font-semibold text-ink">
              Points
            </th>
            <th className="py-2 pl-3 font-semibold text-ink">Basis</th>
          </tr>
        </thead>
        <tbody>
          {result.contributions.map((c) => (
            <tr
              key={c.factor.key}
              className="border-b border-line align-top last:border-0"
            >
              <td className="py-3 pr-3">
                <div className="font-medium text-ink">{c.factor.label}</div>
                <p className="mt-1 max-w-lg text-xs leading-relaxed text-ink-muted">
                  {c.assessment.evidence}
                </p>
                <p className="mt-1 max-w-lg text-xs leading-relaxed text-ink-soft">
                  {c.assessment.explanation}
                </p>
                {c.factor.isRisk && (
                  <p className="mt-1 text-[11px] font-medium text-ink-muted">
                    Risk factor. A rating of 5 means low risk.
                  </p>
                )}
                {c.assessment.sourceId && (
                  <div className="mt-1.5">
                    <SourceLink sourceId={c.assessment.sourceId} />
                  </div>
                )}
              </td>
              <td className="py-3 px-3 text-right font-mono tabular-nums text-ink">
                {c.assessment.rating} / 5
              </td>
              <td className="py-3 px-3 text-right font-mono tabular-nums text-ink-soft">
                {c.weight}
              </td>
              <td className="py-3 px-3 text-right font-mono tabular-nums text-ink">
                {c.points.toFixed(1)}
              </td>
              <td className="py-3 pl-3">
                <div className="flex flex-col items-start gap-1">
                  <BasisBadge basis={c.assessment.basis} />
                  <ConfidenceBadge confidence={c.assessment.confidence} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-line-strong">
            <td className="py-3 pr-3 font-semibold text-ink">
              Company quality under the {result.mandate.name} weighting
            </td>
            <td className="py-3 px-3" />
            <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums text-ink">
              100
            </td>
            <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums text-ink">
              {result.quality}
            </td>
            <td className="py-3 pl-3" />
          </tr>
          <tr className="border-t border-line">
            <td className="py-3 pr-3 align-top">
              <div className="font-semibold text-ink">
                Mandate relevance adjustment
              </div>
              <p className="mt-1 max-w-lg text-xs leading-relaxed text-ink-muted">
                {relevance.explanation}
              </p>
              <div className="mt-1.5">
                <RelevanceBadge relevance={relevance} />
              </div>
            </td>
            <td className="py-3 px-3 text-right font-mono tabular-nums text-ink">
              {relevance.rating} / 5
            </td>
            <td className="py-3 px-3 text-right font-mono tabular-nums text-ink-soft">
              &times;{relevance.tier.multiplier.toFixed(2)}
            </td>
            <td className="py-3 px-3 text-right font-mono tabular-nums text-ink">
              {result.total}
            </td>
            <td className="py-3 pl-3 text-xs text-ink-muted">
              ceiling {relevance.tier.ceiling}
            </td>
          </tr>
          <tr className="border-t-2 border-line-strong">
            <td className="py-3 pr-3 font-semibold text-ink">
              Final score under the {result.mandate.name} mandate
            </td>
            <td className="py-3 px-3" />
            <td className="py-3 px-3" />
            <td className="py-3 px-3 text-right font-mono text-base font-semibold tabular-nums text-ink">
              {result.total}
            </td>
            <td className="py-3 pl-3" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

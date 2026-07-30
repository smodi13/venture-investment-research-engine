import type { Company, ScoreBreakdown, ScoreKey } from "./types";

export interface ScoreFactor {
  key: ScoreKey;
  label: string;
  short: string;
  max: number;
  description: string;
}

/**
 * Transparent scoring framework. Weights sum to 100.
 *
 * The weighting encodes the thesis of this engine. At the moment a founder is
 * still invisible to mainstream databases, the only things you can actually
 * observe are the person, the signal, and how early you are; those three
 * factors carry 45 of the 100 points. Traction and market sizing are still
 * scored, but they are deliberately not allowed to dominate, because at this
 * stage they are the least reliable inputs available.
 *
 * Every factor is scored from stated evidence and labeled assumptions, never
 * from private knowledge. The model organizes judgment; it does not replace it.
 */
export const SCORE_FACTORS: ScoreFactor[] = [
  {
    key: "founder",
    label: "Founder-market fit & technical depth",
    short: "Founder",
    max: 18,
    description:
      "Evidence the founder has genuinely lived this problem: research history, prior systems shipped, maintainer record, or operating experience inside the industry they are now selling into.",
  },
  {
    key: "signal",
    label: "Signal strength & specificity",
    short: "Signal",
    max: 14,
    description:
      "How specific and hard to fake the originating X signal was. A working demo or a benchmarked open-source release outranks a well-written opinion thread.",
  },
  {
    key: "earliness",
    label: "Earliness vs. mainstream databases",
    short: "Earliness",
    max: 13,
    description:
      "How far ahead of a Crunchbase or PitchBook profile the signal appeared. A company already fully profiled scores low here by design, because the sourcing edge is gone.",
  },
  {
    key: "thesis",
    label: "Thesis fit",
    short: "Thesis",
    max: 12,
    description:
      "Alignment with early-stage technical markets: AI, robotics and physical AI, biotech tooling, deep tech infrastructure, and enterprise AI workflow.",
  },
  {
    key: "demand",
    label: "Evidence of early demand",
    short: "Demand",
    max: 12,
    description:
      "Observable pull such as design partners, pilots, paid deployments, usage, or inbound from named buyers. Weighted down when the founder is the only source.",
  },
  {
    key: "technical",
    label: "Technical differentiation",
    short: "Technical",
    max: 11,
    description:
      "Whether the hard part is genuinely hard: a novel method, a proprietary data loop, real physical systems work, or an integration surface that resists a weekend rebuild.",
  },
  {
    key: "market",
    label: "Market size & durability",
    short: "Market",
    max: 9,
    description:
      "Estimated size and staying power of the market. Scored conservatively at this stage, since market framing usually changes before the Series A.",
  },
  {
    key: "timing",
    label: "Why now",
    short: "Why now",
    max: 6,
    description:
      "Whether a specific recent shift in cost curve, model capability, regulation, or supply chain makes this buildable now and not three years ago.",
  },
  {
    key: "stage",
    label: "Stage fit",
    short: "Stage",
    max: 5,
    description:
      "Whether the company sits at the stealth, pre-seed, or seed entry point rather than already being priced past it.",
  },
];

export const MAX_SCORE = SCORE_FACTORS.reduce((sum, f) => sum + f.max, 0); // 100

export function totalScore(scores: ScoreBreakdown): number {
  return SCORE_FACTORS.reduce((sum, f) => sum + (scores[f.key] ?? 0), 0);
}

export type ScoreTone = "strong" | "solid" | "watch";

export function scoreTier(total: number): { label: string; tone: ScoreTone } {
  if (total >= 80) return { label: "Recommend partner review", tone: "strong" };
  if (total >= 65) return { label: "Continue diligence", tone: "solid" };
  return { label: "Monitor", tone: "watch" };
}

export function companyTotal(c: Company): number {
  return totalScore(c.scores);
}

/** Factor keys ordered by weight, used where only the top drivers are shown. */
export function topFactors(
  scores: ScoreBreakdown,
  count: number,
): { factor: ScoreFactor; value: number; pct: number }[] {
  return SCORE_FACTORS.map((factor) => {
    const value = scores[factor.key] ?? 0;
    return { factor, value, pct: value / factor.max };
  })
    .sort((a, b) => b.pct - a.pct || b.value - a.value)
    .slice(0, count);
}

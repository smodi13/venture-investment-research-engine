import { getMandate, type Mandate, type MandateId } from "./mandates";
import type { Company, FactorAssessment, FactorKey } from "./types";

/**
 * The scoring framework.
 *
 * Scoring runs in two stages, and the order matters.
 *
 * Stage one asks whether the company is even in scope for the active mandate.
 * Stage two asks how good the company is. The final score is the quality score
 * scaled by a relevance multiplier, so a company outside the mandate cannot
 * reach the top of the ranking on company quality alone.
 *
 * An earlier version of this model treated mandate fit as one weighted factor
 * among thirteen. That was wrong, and it produced an indefensible result: a
 * company with straight fives on quality outranked every genuinely on-thesis
 * company under a mandate it had nothing to do with, because eleven strong
 * factors will always outvote one weak one. Relevance is not a quality worth
 * trading against other qualities. It is a precondition, and it is now modelled
 * as one.
 *
 * Two rules still govern the quality stage. No score is produced without the
 * evidence and the basis that produced it. And the model refuses false
 * precision: factors are rated 0 to 5, weights are whole numbers, and totals
 * are rounded.
 */

export interface Factor {
  key: FactorKey;
  label: string;
  short: string;
  description: string;
  /**
   * Risk factors are rated so that 5 means low risk. Stating this on the
   * factor itself keeps the direction unambiguous everywhere it is rendered.
   */
  isRisk: boolean;
}

export const FACTORS: Factor[] = [
  {
    key: "differentiation",
    label: "Technical differentiation",
    short: "Differentiation",
    description:
      "Whether the hard part is genuinely hard: a novel method, a proprietary data or process loop, real physical systems work, or an integration surface that resists a quick rebuild.",
    isRisk: false,
  },
  {
    key: "defensibility",
    label: "Defensibility",
    short: "Defensibility",
    description:
      "What stops a well-funded competitor from arriving at the same position in eighteen months. Switching costs, accumulated data, process knowledge, regulatory clearance, and supply agreements all count. Brand and first-mover status largely do not.",
    isRisk: false,
  },
  {
    key: "marketPotential",
    label: "Market potential",
    short: "Market",
    description:
      "Size and durability of the market being entered, judged from the structure of the buying process rather than from a top-down market-size estimate.",
    isRisk: false,
  },
  {
    key: "commercialReadiness",
    label: "Commercial readiness",
    short: "Readiness",
    description:
      "How close the company is to a repeatable product sold on repeatable terms, as distinct from a capable team running bespoke deployments.",
    isRisk: false,
  },
  {
    key: "customerEvidence",
    label: "Customer evidence",
    short: "Customers",
    description:
      "Observable pull: paid deployments, named design partners, renewals, usage growth, or inbound demand. Weighted down sharply when the company itself is the only source for the claim.",
    isRisk: false,
  },
  {
    key: "teamCredibility",
    label: "Team credibility",
    short: "Team",
    description:
      "Evidence the team has lived this problem: research record, systems shipped, operating experience inside the industry they now sell into, or a prior company taken through the same transition.",
    isRisk: false,
  },
  {
    key: "capitalEfficiency",
    label: "Capital efficiency",
    short: "Capital efficiency",
    description:
      "Output achieved per dollar consumed, judged against what this category normally costs. A capital-hungry business is not penalised for its category, only for consuming more than its peers to reach the same point.",
    isRisk: false,
  },
  {
    key: "competitiveIntensity",
    label: "Competitive intensity",
    short: "Competition",
    description:
      "How crowded and how well funded the field is. Rated so that 5 means a favourable competitive position and 0 means a crowded field with better-capitalised incumbents.",
    isRisk: true,
  },
  {
    key: "technicalRisk",
    label: "Technical risk",
    short: "Technical risk",
    description:
      "Probability that the technology does not reach the performance required at the cost required. Rated so that 5 means low technical risk.",
    isRisk: true,
  },
  {
    key: "regulatoryRisk",
    label: "Regulatory risk",
    short: "Regulatory risk",
    description:
      "Exposure to approval, certification, export control, or data governance decisions outside the company's control. Rated so that 5 means low regulatory risk.",
    isRisk: true,
  },
  {
    key: "financingRisk",
    label: "Financing or valuation risk",
    short: "Financing risk",
    description:
      "For private companies, the risk that the next round is hard to raise or heavily dilutive. For public companies, the risk carried in the current valuation. Rated so that 5 means low financing risk.",
    isRisk: true,
  },
  {
    key: "overlooked",
    label: "Degree to which the company appears overlooked",
    short: "Overlooked",
    description:
      "Whether the opportunity is under-examined relative to its quality. Weighted lightly everywhere, because being early is only valuable if the other eleven factors already hold.",
    isRisk: false,
  },
];

export const FACTOR_BY_KEY: Record<FactorKey, Factor> = Object.fromEntries(
  FACTORS.map((f) => [f.key, f]),
) as Record<FactorKey, Factor>;

export const MAX_SCORE = 100;
export const MAX_RATING = 5;

/* -------------------------------------------------------------------------- */
/* Stage one: mandate relevance                                               */
/* -------------------------------------------------------------------------- */

export type RelevanceTierId =
  | "core"
  | "adjacent"
  | "peripheral"
  | "marginal"
  | "outside";

export interface RelevanceTier {
  id: RelevanceTierId;
  label: string;
  /** Quality score is multiplied by this. */
  multiplier: number;
  /** The highest final score this tier can reach, which is multiplier * 100. */
  ceiling: number;
  meaning: string;
}

/**
 * Five relevance tiers, each capped at the top of a scoring band.
 *
 * The multipliers are chosen so that each tier's ceiling lands exactly at the
 * top of a band. A company that is merely adjacent to the mandate can reach
 * the top of strong watchlist and no further; only a core company can reach
 * priority research. That is the whole adjustment, and it is one number per
 * tier rather than a rule buried in code.
 */
export const RELEVANCE_TIERS: Record<RelevanceTierId, RelevanceTier> = {
  core: {
    id: "core",
    label: "Core to mandate",
    multiplier: 1.0,
    ceiling: 100,
    meaning:
      "Squarely inside the mandate on both sector and stage. Can reach any band, including priority research.",
  },
  adjacent: {
    id: "adjacent",
    label: "Adjacent to mandate",
    multiplier: 0.84,
    ceiling: 84,
    meaning:
      "Close to the mandate but not squarely inside it. Capped at the top of strong watchlist, so it cannot be presented as priority research.",
  },
  peripheral: {
    id: "peripheral",
    label: "Peripheral to mandate",
    multiplier: 0.69,
    ceiling: 69,
    meaning:
      "Relevant only at the edges. Capped at the top of the further diligence band.",
  },
  marginal: {
    id: "marginal",
    label: "Marginal to mandate",
    multiplier: 0.54,
    ceiling: 54,
    meaning:
      "Largely outside the mandate. Capped inside low current priority, however strong the company itself is.",
  },
  outside: {
    id: "outside",
    label: "Outside mandate",
    multiplier: 0.4,
    ceiling: 40,
    meaning:
      "Not investable under this mandate. Retained in the universe so the effect of switching mandates stays visible.",
  },
};

export const RELEVANCE_ORDER: RelevanceTierId[] = [
  "core",
  "adjacent",
  "peripheral",
  "marginal",
  "outside",
];

export interface Relevance {
  /** 0 to 5. The binding constraint of sector affinity and stage affinity. */
  rating: number;
  sectorAffinity: number;
  stageAffinity: number;
  tier: RelevanceTier;
  explanation: string;
}

/**
 * Relevance is the weaker of sector affinity and stage affinity, not their
 * average.
 *
 * This is a conjunction, not a trade-off. A company has to be both in the
 * right sector and at the right stage to be core to a mandate. Averaging would
 * let an excellent sector match compensate for a company being fifteen years
 * and one public listing past the stage the mandate invests at, which is not
 * how any real mandate works.
 */
export function mandateRelevance(
  company: Company,
  mandate: Mandate,
): Relevance {
  const sectorAffinity = mandate.sectorAffinity[company.sector] ?? 0;
  const stageAffinity = mandate.stageAffinity[company.stage] ?? 0;
  const rating = Math.min(sectorAffinity, stageAffinity);

  const tierId: RelevanceTierId =
    rating >= 5
      ? "core"
      : rating === 4
        ? "adjacent"
        : rating === 3
          ? "peripheral"
          : rating === 2
            ? "marginal"
            : "outside";

  const binding =
    sectorAffinity < stageAffinity
      ? `sector (${company.sector})`
      : stageAffinity < sectorAffinity
        ? `stage (${company.stage})`
        : "sector and stage equally";

  return {
    rating,
    sectorAffinity,
    stageAffinity,
    tier: RELEVANCE_TIERS[tierId],
    explanation: `Sector affinity ${sectorAffinity} of 5, stage affinity ${stageAffinity} of 5 under the ${mandate.name} mandate. Relevance takes the weaker of the two, so the binding constraint is ${binding}.`,
  };
}

/* -------------------------------------------------------------------------- */
/* Stage two: quality, then the combined score                                */
/* -------------------------------------------------------------------------- */

export interface FactorContribution {
  factor: Factor;
  assessment: FactorAssessment;
  weight: number;
  /** Points earned toward the quality score, out of `weight`. */
  points: number;
  /** Points lost against this factor's weight. */
  deduction: number;
}

export interface ScoreResult {
  /** Company quality out of 100, before the relevance adjustment. */
  quality: number;
  relevance: Relevance;
  /** quality multiplied by the relevance multiplier, rounded. */
  total: number;
  contributions: FactorContribution[];
  mandate: Mandate;
}

export function scoreCompany(
  company: Company,
  mandateId: MandateId,
): ScoreResult {
  const mandate = getMandate(mandateId);

  const contributions: FactorContribution[] = FACTORS.map((factor) => {
    const assessment = company.factors[factor.key];
    const weight = mandate.weights[factor.key];
    const points = (assessment.rating / MAX_RATING) * weight;
    return { factor, assessment, weight, points, deduction: weight - points };
  });

  const qualityRaw = contributions.reduce((sum, c) => sum + c.points, 0);
  const relevance = mandateRelevance(company, mandate);

  return {
    quality: Math.round(qualityRaw),
    relevance,
    total: Math.round(qualityRaw * relevance.tier.multiplier),
    contributions,
    mandate,
  };
}

/** Total only. Used by tables and sorting, which do not need the breakdown. */
export function companyScore(company: Company, mandateId: MandateId): number {
  return scoreCompany(company, mandateId).total;
}

/* -------------------------------------------------------------------------- */
/* Interpretation                                                             */
/* -------------------------------------------------------------------------- */

export type ScoreTone = "priority" | "watchlist" | "diligence" | "low";

export interface ScoreBand {
  label: string;
  tone: ScoreTone;
  range: string;
  meaning: string;
}

export const SCORE_BANDS: ScoreBand[] = [
  {
    label: "Priority research",
    tone: "priority",
    range: "85 to 100",
    meaning:
      "Worth analyst time this week. Only companies core to the active mandate can reach this band, because the relevance ceiling for every other tier sits below it.",
  },
  {
    label: "Strong watchlist",
    tone: "watchlist",
    range: "70 to 84",
    meaning:
      "Track deliberately, with a named next step and a date. Most companies that eventually become investments pass through this band first.",
  },
  {
    label: "Further diligence required",
    tone: "diligence",
    range: "55 to 69",
    meaning:
      "Something specific is unresolved. Check the relevance tier first: a peripheral company sits here because of its fit, not because of its quality.",
  },
  {
    label: "Low current priority",
    tone: "low",
    range: "Below 55",
    meaning:
      "Not a judgment on the company, only on its fit with the active mandate today. Switching mandates frequently moves companies out of this band.",
  },
];

export function scoreBand(total: number): ScoreBand {
  if (total >= 85) return SCORE_BANDS[0];
  if (total >= 70) return SCORE_BANDS[1];
  if (total >= 55) return SCORE_BANDS[2];
  return SCORE_BANDS[3];
}

/* -------------------------------------------------------------------------- */
/* Derived narrative                                                          */
/* -------------------------------------------------------------------------- */

export function topContributors(
  result: ScoreResult,
  count: number,
): FactorContribution[] {
  return [...result.contributions]
    .sort((a, b) => b.points - a.points)
    .slice(0, count);
}

export function topDeductions(
  result: ScoreResult,
  count: number,
): FactorContribution[] {
  return [...result.contributions]
    .filter((c) => c.deduction > 0.5)
    .sort((a, b) => b.deduction - a.deduction)
    .slice(0, count);
}

/**
 * A rationale sentence assembled from the active mandate's own weighting and
 * relevance tier, so the stated reason for a ranking always matches the
 * arithmetic behind it.
 */
export function investmentRationale(
  company: Company,
  result: ScoreResult,
): string {
  const drivers = topContributors(result, 2).map((c) =>
    c.factor.short.toLowerCase(),
  );
  const band = scoreBand(result.total);
  const { tier } = result.relevance;

  const quality = `On company quality alone ${company.name} scores ${result.quality} of 100 under the ${result.mandate.name} weighting, carried by ${drivers.join(" and ")}.`;

  if (tier.id === "core") {
    const drags = topDeductions(result, 1);
    const lead = `${quality} It is core to this mandate, so the quality score carries through unadjusted, placing it in the ${band.label.toLowerCase()} band.`;
    return drags.length === 0
      ? lead
      : `${lead} The largest deduction is ${drags[0].factor.short.toLowerCase()}, which costs ${Math.round(drags[0].deduction)} points and sets the first diligence question.`;
  }

  return `${quality} It is ${tier.label.toLowerCase()}, however, so the score is scaled by ${tier.multiplier.toFixed(2)} to ${result.total} and is capped at ${tier.ceiling}. It sits in the ${band.label.toLowerCase()} band because of fit rather than because of quality.`;
}

/** Share of verified versus judgment-based ratings behind a score. */
export function evidenceMix(result: ScoreResult): {
  verified: number;
  judgment: number;
  verifiedShare: number;
} {
  const verified = result.contributions.filter(
    (c) => c.assessment.basis === "verified",
  ).length;
  const judgment = result.contributions.length - verified;
  return {
    verified,
    judgment,
    verifiedShare: Math.round((verified / result.contributions.length) * 100),
  };
}

/** Weight totals per mandate, rendered on the methodology page as a check. */
export function weightTotal(mandate: Mandate): number {
  return FACTORS.reduce((sum, f) => sum + mandate.weights[f.key], 0);
}

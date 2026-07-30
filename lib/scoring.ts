import { getMandate, type Mandate, type MandateId } from "./mandates";
import type { FactorAssessment, FactorKey, PrivateCompany } from "./types";

/**
 * The scoring framework.
 *
 * Scoring runs in two stages, and the order matters.
 *
 * Stage one asks whether the company is in scope for the active mandate.
 * Stage two asks how good the company is. The final score is the quality score
 * scaled by a relevance multiplier, so a company outside the mandate cannot
 * reach the top of the ranking on company quality alone.
 *
 * Only verified private companies are ever passed to this module. Public
 * companies have a separate type with no factors and no score, so they cannot
 * be ranked here even by mistake.
 */

export interface Factor {
  key: FactorKey;
  label: string;
  short: string;
  description: string;
  /** Risk factors are rated so that 5 means low risk. */
  isRisk: boolean;
}

export const FACTORS: Factor[] = [
  {
    key: "technicalDifferentiation",
    label: "Technical differentiation",
    short: "Differentiation",
    description:
      "Whether the hard part is genuinely hard: a novel method, a proprietary process, real physical systems work, or an integration surface that resists a quick rebuild.",
    isRisk: false,
  },
  {
    key: "technicalEvidence",
    label: "Technical evidence",
    short: "Evidence",
    description:
      "How much of the technical claim can be checked from outside the company: published results, government or laboratory validation, shipped product, or independent benchmarking. Rated separately from differentiation on purpose, because a strong claim with no external evidence is a different investment from the same claim with it.",
    isRisk: false,
  },
  {
    key: "defensibility",
    label: "Defensibility",
    short: "Defensibility",
    description:
      "What stops a well-funded competitor reaching the same position in eighteen months. Switching costs, accumulated data, process knowledge, regulatory clearance, and supply agreements count. Brand and first-mover status largely do not.",
    isRisk: false,
  },
  {
    key: "marketImportance",
    label: "Market importance",
    short: "Market",
    description:
      "Whether the bottleneck being addressed actually matters, judged from the structure of the buying process rather than from a top-down market-size estimate. This platform publishes no market-size figures.",
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
      "Observable pull: named customers, disclosed contracts, government awards, or independent adoption. Weighted down sharply when the company itself is the only source for the claim.",
    isRisk: false,
  },
  {
    key: "teamCredibility",
    label: "Founder and team credibility",
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
      "Output achieved per dollar consumed, judged against what this category normally costs. A capital-hungry business is not penalised for its category, only for consuming more than its peers to reach the same point. Raising more money is never itself rewarded.",
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
    key: "financingRisk",
    label: "Financing risk",
    short: "Financing risk",
    description:
      "The risk that the next round is hard to raise, heavily dilutive, or required before the proving milestone arrives. Rated so that 5 means low financing risk.",
    isRisk: true,
  },
  {
    key: "regulatoryRisk",
    label: "Regulatory risk",
    short: "Regulatory risk",
    description:
      "Exposure to approval, certification, export control, licensing, or data governance decisions outside the company's control. Rated so that 5 means low regulatory risk.",
    isRisk: true,
  },
  {
    key: "sourcingOriginality",
    label: "Sourcing originality",
    short: "Originality",
    description:
      "Whether the opportunity is under-examined relative to its quality. Weighted lightly everywhere, because being early is only valuable if the other eleven factors already hold. A widely covered company scores low here and the platform says so rather than pretending otherwise.",
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
  multiplier: number;
  /** The highest final score this tier can reach. */
  ceiling: number;
  meaning: string;
}

/**
 * Five relevance tiers, each capped at the top of a scoring band.
 *
 * The multipliers are chosen so each tier's ceiling lands exactly at the top of
 * a band. A company merely adjacent to the mandate can reach the top of strong
 * watchlist and no further; only a core company can reach priority research.
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
  rating: number;
  sectorAffinity: number;
  stageAffinity: number;
  tier: RelevanceTier;
  explanation: string;
}

/**
 * Relevance is the weaker of sector affinity and stage affinity, not their
 * average. This is a conjunction, not a trade-off: a company has to be both in
 * the right sector and at the right stage to be core to a mandate.
 */
export function mandateRelevance(
  company: PrivateCompany,
  mandate: Mandate,
): Relevance {
  const sectorAffinity = mandate.sectorAffinity[company.sector] ?? 0;
  const stageAffinity = mandate.stageAffinity[company.financing.stage] ?? 0;
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
        ? `stage (${company.financing.stage})`
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
  points: number;
  deduction: number;
}

export interface ScoreResult {
  /** Company quality out of 100, before the relevance adjustment. */
  quality: number;
  relevance: Relevance;
  /** Quality multiplied by the relevance multiplier, rounded. */
  total: number;
  contributions: FactorContribution[];
  mandate: Mandate;
}

export function scoreCompany(
  company: PrivateCompany,
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

export function companyScore(
  company: PrivateCompany,
  mandateId: MandateId,
): number {
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
      "Something specific is unresolved. Check the relevance tier and the data confidence first: a company can sit here because of fit or because of thin public disclosure rather than because of quality.",
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

export function investmentRationale(
  company: PrivateCompany,
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

export function weightTotal(mandate: Mandate): number {
  return FACTORS.reduce((sum, f) => sum + mandate.weights[f.key], 0);
}

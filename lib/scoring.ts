import { getMandate, type Mandate, type MandateId } from "./mandates";
import type { Company, FactorAssessment, FactorKey } from "./types";

/**
 * The scoring framework.
 *
 * Two rules govern this file. First, no score is ever produced without the
 * evidence and the basis that produced it, so every number in the interface
 * can be traced back to a stated reason. Second, the model refuses false
 * precision: factors are rated 0 to 5, weights are whole numbers, and the
 * total is rounded. A score of 78 means "strong watchlist", not "1.4 points
 * better than the company below it".
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
    key: "mandateFit",
    label: "Mandate fit",
    short: "Mandate fit",
    description:
      "How closely the company matches the active mandate on sector and stage. This is the one factor derived entirely from the mandate rather than stored on the company, which is why every score moves when the mandate changes.",
    isRisk: false,
  },
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
      "Whether the opportunity is under-examined relative to its quality. Weighted lightly everywhere, because being early is only valuable if the other twelve factors already hold.",
    isRisk: false,
  },
];

export const FACTOR_BY_KEY: Record<FactorKey, Factor> = Object.fromEntries(
  FACTORS.map((f) => [f.key, f]),
) as Record<FactorKey, Factor>;

export const MAX_SCORE = 100;
export const MAX_RATING = 5;

/* -------------------------------------------------------------------------- */
/* Mandate fit, derived rather than stored                                    */
/* -------------------------------------------------------------------------- */

/**
 * Mandate fit blends sector affinity and stage affinity, weighted two to one
 * toward sector. A company in the right sector at the wrong stage is still
 * partially relevant; a company in the wrong sector rarely is.
 */
export function mandateFitAssessment(
  company: Company,
  mandate: Mandate,
): FactorAssessment {
  const sector = mandate.sectorAffinity[company.sector] ?? 0;
  const stage = mandate.stageAffinity[company.stage] ?? 0;
  const rating = Math.round((sector * 2 + stage) / 3);
  return {
    rating,
    basis: "judgment",
    evidence: `${company.sector}, ${company.stage}. Sector affinity ${sector} of 5, stage affinity ${stage} of 5 under the ${mandate.name} mandate.`,
    rationale:
      sector >= 4 && stage >= 4
        ? "Squarely inside the mandate on both sector and stage."
        : sector >= 4
          ? "The sector is central to this mandate, but the stage sits outside where the mandate normally invests."
          : stage >= 4
            ? "The stage fits, but the sector is peripheral to this mandate."
            : "Outside this mandate on both dimensions. Retained in the universe so the effect of switching mandates stays visible.",
  };
}

/* -------------------------------------------------------------------------- */
/* Scoring                                                                    */
/* -------------------------------------------------------------------------- */

export interface FactorContribution {
  factor: Factor;
  assessment: FactorAssessment;
  weight: number;
  /** Points earned, out of `weight`. */
  points: number;
  /** Points lost against this factor's weight, shown as the deduction. */
  deduction: number;
}

export interface ScoreResult {
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
    const assessment =
      factor.key === "mandateFit"
        ? mandateFitAssessment(company, mandate)
        : company.factors[factor.key];
    const weight = mandate.weights[factor.key];
    const points = (assessment.rating / MAX_RATING) * weight;
    return {
      factor,
      assessment,
      weight,
      points,
      deduction: weight - points,
    };
  });

  const total = Math.round(
    contributions.reduce((sum, c) => sum + c.points, 0),
  );

  return { total, contributions, mandate };
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
      "Worth analyst time this week. The score justifies opening a research file, not writing a cheque.",
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
      "Something specific is unresolved. The factor breakdown identifies which factor is holding the score down.",
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

/** The factors carrying the score, strongest contribution first. */
export function topContributors(
  result: ScoreResult,
  count: number,
): FactorContribution[] {
  return [...result.contributions]
    .sort((a, b) => b.points - a.points)
    .slice(0, count);
}

/** The factors costing the most points, largest deduction first. */
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
 * A rationale sentence assembled from the active mandate's own weighting, so
 * the stated reason for a ranking always matches the arithmetic behind it.
 */
export function investmentRationale(
  company: Company,
  result: ScoreResult,
): string {
  const drivers = topContributors(result, 2).map((c) =>
    c.factor.short.toLowerCase(),
  );
  const drags = topDeductions(result, 1);
  const band = scoreBand(result.total);
  const lead = `Under the ${result.mandate.name} mandate, ${company.name} scores ${result.total} of 100 and sits in the ${band.label.toLowerCase()} band, carried by ${drivers.join(" and ")}.`;
  if (drags.length === 0) return lead;
  return `${lead} The largest deduction is ${drags[0].factor.short.toLowerCase()}, which costs ${Math.round(drags[0].deduction)} points and sets the first diligence question.`;
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

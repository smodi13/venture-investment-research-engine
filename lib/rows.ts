import { COMPANIES } from "./companies";
import { MANDATES, type MandateId } from "./mandates";
import { companyScore, mandateRelevance, type RelevanceTierId } from "./scoring";
import type {
  CapitalIntensity,
  CommercialReadiness,
  DataConfidence,
  PrivateCompany,
  Region,
  Sector,
  SourcingSignal,
  Stage,
} from "./types";

/**
 * A compact projection of a private company, carrying only what the table,
 * filters, sorting, and homepage cards need.
 *
 * Scores and relevance tiers are precomputed for every mandate, which is what
 * lets the mandate selector re-rank the universe instantly without a round
 * trip and without shipping the full research corpus to the browser.
 */
export interface UniverseRow {
  id: string;
  name: string;
  website: string;
  sector: Sector;
  subsector: string;
  stage: Stage;
  region: Region;
  headquarters: string;
  foundedYear: string;
  founders: string;
  description: string;
  capitalIntensity: CapitalIntensity;
  commercialReadiness: CommercialReadiness;
  dataConfidence: DataConfidence;
  lastReviewed: string;
  /** Latest disclosed financing, already resolved to a display string. */
  latestRound: string;
  latestRoundDate: string;
  totalDisclosedFunding: string;
  namedInvestors: string;
  sourcingSignal: SourcingSignal;
  dateSourced: string;
  whyEntered: string;
  whyTimely: string;
  whyOverlooked: string;
  wellRecognised: boolean;
  recommendedNextStep: string;
  keyUnansweredQuestion: string;
  mainTechnicalRisk: string;
  sourceCount: number;
  scores: Record<MandateId, number>;
  tiers: Record<MandateId, RelevanceTierId>;
  /** Lowercased haystack for free-text search. */
  search: string;
}

function toRow(c: PrivateCompany): UniverseRow {
  const scores = Object.fromEntries(
    MANDATES.map((m) => [m.id, companyScore(c, m.id)]),
  ) as Record<MandateId, number>;
  const tiers = Object.fromEntries(
    MANDATES.map((m) => [m.id, mandateRelevance(c, m).tier.id]),
  ) as Record<MandateId, RelevanceTierId>;

  return {
    id: c.id,
    name: c.name,
    website: c.website,
    sector: c.sector,
    subsector: c.subsector,
    stage: c.financing.stage,
    region: c.region,
    headquarters: c.headquarters,
    foundedYear: String(c.foundedYear),
    founders: c.founders.length > 0 ? c.founders.join(", ") : "Not publicly disclosed",
    description: c.description,
    capitalIntensity: c.financing.capitalIntensity,
    commercialReadiness:
      c.factors.commercialReadiness.rating >= 4
        ? "Scaling"
        : c.factors.commercialReadiness.rating >= 3
          ? "Early Deployment"
          : c.factors.commercialReadiness.rating >= 2
            ? "Prototype"
            : "Research",
    dataConfidence: c.dataConfidence,
    lastReviewed: c.lastReviewed,
    latestRound: c.financing.latestRound,
    latestRoundDate: c.financing.latestRoundDate,
    totalDisclosedFunding: String(c.financing.totalDisclosedFunding),
    namedInvestors:
      c.financing.namedInvestors.length > 0
        ? c.financing.namedInvestors.join(", ")
        : "Not publicly disclosed",
    sourcingSignal: c.sourcing.signal,
    dateSourced: c.sourcing.dateSourced,
    whyEntered: c.sourcing.whyEntered,
    whyTimely: c.sourcing.whyTimely,
    whyOverlooked: c.sourcing.whyOverlooked,
    wellRecognised: c.sourcing.wellRecognised,
    recommendedNextStep: c.investment.recommendedNextStep,
    keyUnansweredQuestion: c.investment.invalidators[0] ?? c.mainTechnicalRisk,
    mainTechnicalRisk: c.mainTechnicalRisk,
    sourceCount: c.sourceIds.length,
    scores,
    tiers,
    search: [
      c.name,
      c.sector,
      c.subsector,
      c.description,
      c.technicalDifferentiation,
      c.founders.join(" "),
      c.headquarters,
      c.sourcing.signal,
      c.sourcing.whyEntered,
      c.targetCustomer,
      c.technology.howItWorks,
    ]
      .join(" ")
      .toLowerCase(),
  };
}

export const UNIVERSE_ROWS: UniverseRow[] = COMPANIES.map(toRow);

export function rowsForIds(ids: readonly string[]): UniverseRow[] {
  const byId = new Map(UNIVERSE_ROWS.map((r) => [r.id, r]));
  return ids.map((id) => byId.get(id)).filter((r): r is UniverseRow => !!r);
}

export function topRanked(mandateId: MandateId, count: number): UniverseRow[] {
  return [...UNIVERSE_ROWS]
    .sort((a, b) => b.scores[mandateId] - a.scores[mandateId])
    .slice(0, count);
}

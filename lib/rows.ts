import { COMPANIES } from "./companies";
import { MANDATES, type MandateId } from "./mandates";
import { companyScore } from "./scoring";
import { factText } from "./format";
import type {
  CapitalIntensity,
  CommercialReadiness,
  Company,
  MarketMaturity,
  MarketType,
  Provenance,
  Region,
  Sector,
  Stage,
} from "./types";

/**
 * A compact projection of a company, carrying only what the table, filters,
 * sorting, and comparison views need.
 *
 * The reason this exists is page weight. The full universe carries a large
 * amount of research prose that the browser has no use for while someone is
 * filtering a table, so the server sends this instead. Scores are precomputed
 * for every mandate, which is what lets the mandate selector re-rank the whole
 * universe instantly without a round trip.
 */
export interface UniverseRow {
  id: string;
  name: string;
  isDemonstration: boolean;
  marketType: MarketType;
  ticker: string | null;
  sector: Sector;
  subsector: string;
  stage: Stage;
  region: Region;
  hq: string;
  foundedYear: number;
  capitalIntensity: CapitalIntensity;
  commercialReadiness: CommercialReadiness;
  marketMaturity: MarketMaturity;
  lastReviewed: string;
  description: string;
  businessModel: string;
  primaryCustomer: string;
  technicalDifferentiation: string;
  investmentRisk: string;
  keyCatalyst: string;
  recommendedNextStep: string;
  /** Display strings, already resolved through their provenance. */
  capitalRaised: string;
  capitalRaisedValue: number | null;
  capitalRaisedProvenance: Provenance;
  marketCap: string;
  revenueGrowth: string;
  grossMargin: string;
  cashPosition: string;
  valuationMultiple: string;
  tractionSignal: string;
  tractionProvenance: Provenance;
  /** Score under each mandate, so switching is instant and offline. */
  scores: Record<MandateId, number>;
  /** Lowercased haystack for free-text search. */
  search: string;
}

function toRow(c: Company): UniverseRow {
  const isPublic = c.financials.kind === "public";
  const scores = Object.fromEntries(
    MANDATES.map((m) => [m.id, companyScore(c, m.id)]),
  ) as Record<MandateId, number>;

  return {
    id: c.id,
    name: c.name,
    isDemonstration: c.isDemonstration,
    marketType: c.marketType,
    ticker: c.financials.kind === "public" ? c.financials.ticker : null,
    sector: c.sector,
    subsector: c.subsector,
    stage: c.stage,
    region: c.region,
    hq: c.hq,
    foundedYear: c.foundedYear,
    capitalIntensity: c.capitalIntensity,
    commercialReadiness: c.commercialReadiness,
    marketMaturity: c.market.maturity,
    lastReviewed: c.lastReviewed,
    description: c.description,
    businessModel: c.businessModel,
    primaryCustomer: c.primaryCustomer,
    technicalDifferentiation: c.technicalDifferentiation,
    investmentRisk: c.investmentRisk,
    keyCatalyst: c.keyCatalyst,
    recommendedNextStep: c.investment.recommendedNextStep,
    capitalRaised:
      c.financials.kind === "private"
        ? factText(c.financials.capitalRaised)
        : "Publicly listed",
    capitalRaisedValue:
      c.financials.kind === "private" ? c.financials.capitalRaised.value : null,
    capitalRaisedProvenance:
      c.financials.kind === "private"
        ? c.financials.capitalRaised.provenance
        : "not-disclosed",
    marketCap: isPublic && c.financials.kind === "public"
      ? factText(c.financials.marketCap)
      : "Private company",
    revenueGrowth:
      c.financials.kind === "public"
        ? factText(c.financials.revenueGrowth)
        : "Not disclosed for private companies",
    grossMargin:
      c.financials.kind === "public"
        ? factText(c.financials.grossMargin)
        : "Not disclosed for private companies",
    cashPosition:
      c.financials.kind === "public"
        ? factText(c.financials.cashPosition)
        : c.financials.futureFinancingNeed,
    valuationMultiple:
      c.financials.kind === "public"
        ? factText(c.financials.valuationMultiple)
        : "Not applicable",
    tractionSignal: factText(c.tractionSignal),
    tractionProvenance: c.tractionSignal.provenance,
    scores,
    search: [
      c.name,
      c.sector,
      c.subsector,
      c.description,
      c.technicalDifferentiation,
      c.businessModel,
      c.primaryCustomer,
      c.hq,
      c.financials.kind === "public" ? c.financials.ticker : "",
      c.technology.howItWorks,
      c.technology.coreAdvantage,
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

/** Top ranked rows under a mandate, used on the overview page. */
export function topRanked(mandateId: MandateId, count: number): UniverseRow[] {
  return [...UNIVERSE_ROWS]
    .sort((a, b) => b.scores[mandateId] - a.scores[mandateId])
    .slice(0, count);
}

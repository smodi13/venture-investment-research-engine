/**
 * Core domain types for the Venture Investment Research Engine.
 *
 * The central idea in this file is `Fact<T>`. Every number and every material
 * claim in the platform carries its own provenance, as-of date, and optional
 * source reference, so the interface can never present an analyst estimate as
 * a reported figure. Rendering code reads the provenance, not just the value.
 */

/** Where a value came from, and therefore how much weight it can carry. */
export type Provenance =
  | "reported" // Disclosed by the company or a filing. Cite a source.
  | "estimate" // Analyst estimate built on public information. Approximate.
  | "demonstration" // Illustrative value on a fictional company.
  | "unverified" // A public figure exists but was not verified in this build.
  | "not-disclosed"; // Genuinely unavailable in public sources.

export const PROVENANCE_LABEL: Record<Provenance, string> = {
  reported: "Reported",
  estimate: "Analyst estimate",
  demonstration: "Demonstration data",
  unverified: "Requires verification",
  "not-disclosed": "Not publicly disclosed",
};

export const PROVENANCE_NOTE: Record<Provenance, string> = {
  reported:
    "Disclosed by the company or drawn from a public filing. Confirm against the cited source before relying on it.",
  estimate:
    "An analyst estimate assembled from public information, expressed as a range rather than a point value. Directional, not a reported figure.",
  demonstration:
    "An illustrative value on a fictional company, included to exercise the workflow. It describes no real business.",
  unverified:
    "A figure exists in public filings but has not been verified inside this build. Populate it from the primary source before using it in a decision.",
  "not-disclosed":
    "No reliable public figure exists. The field is deliberately left empty rather than filled with a guess.",
};

/**
 * A single value plus everything needed to judge it. `value` is null when the
 * figure is genuinely unavailable, which the interface renders explicitly
 * rather than hiding.
 */
export interface Fact<T> {
  value: T | null;
  provenance: Provenance;
  /** ISO date the value was accurate as of. Every figure is dated. */
  asOf: string;
  /** Optional qualifier shown alongside the value. */
  note?: string;
  /** Id into the source registry in lib/sources.ts. */
  sourceId?: string;
}

/** Convenience constructors, used heavily by the dataset. */
export const reported = <T>(
  value: T,
  asOf: string,
  sourceId?: string,
  note?: string,
): Fact<T> => ({ value, provenance: "reported", asOf, sourceId, note });

export const estimate = <T>(
  value: T,
  asOf: string,
  note?: string,
  sourceId?: string,
): Fact<T> => ({ value, provenance: "estimate", asOf, note, sourceId });

export const demo = <T>(value: T, asOf: string, note?: string): Fact<T> => ({
  value,
  provenance: "demonstration",
  asOf,
  note,
});

export const undisclosed = <T>(asOf: string, note?: string): Fact<T> => ({
  value: null,
  provenance: "not-disclosed",
  asOf,
  note,
});

/**
 * For figures that genuinely exist in public filings but were not verified
 * inside this build. The interface renders these as an explicit gap with a
 * link to the primary source, which is more useful than a confident guess.
 */
export const unverified = <T>(
  asOf: string,
  sourceId?: string,
  note?: string,
): Fact<T> => ({ value: null, provenance: "unverified", asOf, sourceId, note });

/* -------------------------------------------------------------------------- */
/* Classification                                                             */
/* -------------------------------------------------------------------------- */

export type MarketType = "Public" | "Private";

export const MARKET_TYPES: MarketType[] = ["Public", "Private"];

export type Sector =
  | "AI Infrastructure"
  | "Semiconductors"
  | "Robotics & Autonomy"
  | "Quantum Technology"
  | "Biotechnology & Research Tools"
  | "Energy & Advanced Materials"
  | "Enterprise Software"
  | "Healthcare Technology";

export const SECTORS: Sector[] = [
  "AI Infrastructure",
  "Semiconductors",
  "Robotics & Autonomy",
  "Quantum Technology",
  "Biotechnology & Research Tools",
  "Energy & Advanced Materials",
  "Enterprise Software",
  "Healthcare Technology",
];

export type Stage =
  | "Pre-Seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series C"
  | "Growth"
  | "Public";

export const STAGES: Stage[] = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Growth",
  "Public",
];

export type Region =
  | "North America"
  | "Europe"
  | "Asia Pacific"
  | "Middle East & Africa";

export const REGIONS: Region[] = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Middle East & Africa",
];

/**
 * How much capital the business model consumes before it can scale. A decisive
 * variable in frontier technology, where two companies with identical revenue
 * can need an order of magnitude different amounts of money to get there.
 */
export type CapitalIntensity = "Low" | "Moderate" | "High" | "Very High";

export const CAPITAL_INTENSITIES: CapitalIntensity[] = [
  "Low",
  "Moderate",
  "High",
  "Very High",
];

/** How close the company is to selling a repeatable product. */
export type CommercialReadiness =
  | "Research"
  | "Prototype"
  | "Early Deployment"
  | "Scaling"
  | "Established";

export const COMMERCIAL_READINESS: CommercialReadiness[] = [
  "Research",
  "Prototype",
  "Early Deployment",
  "Scaling",
  "Established",
];

export type MarketMaturity = "Emerging" | "Developing" | "Mature";

/* -------------------------------------------------------------------------- */
/* Pipeline                                                                   */
/* -------------------------------------------------------------------------- */

export type PipelineStage =
  | "New lead"
  | "Initial research"
  | "Founder outreach"
  | "First meeting"
  | "Deep diligence"
  | "Investment memo"
  | "Partner review"
  | "Passed"
  | "Monitoring"
  | "Invested";

export const PIPELINE_STAGES: PipelineStage[] = [
  "New lead",
  "Initial research",
  "Founder outreach",
  "First meeting",
  "Deep diligence",
  "Investment memo",
  "Partner review",
  "Passed",
  "Monitoring",
  "Invested",
];

/** Stages that represent an active position in the funnel. */
export const ACTIVE_PIPELINE_STAGES: PipelineStage[] = PIPELINE_STAGES.filter(
  (s) => s !== "Passed" && s !== "Monitoring" && s !== "Invested",
);

export type Priority = "High" | "Medium" | "Low";

export const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

/* -------------------------------------------------------------------------- */
/* Research detail                                                            */
/* -------------------------------------------------------------------------- */

/** A claim carrying its own confidence label, shown next to the claim itself. */
export interface Evidence {
  claim: string;
  provenance: Provenance;
  asOf: string;
  sourceId?: string;
}

export interface TechnologyAssessment {
  howItWorks: string;
  coreAdvantage: string;
  supportingEvidence: Evidence[];
  benchmarks: string;
  intellectualProperty: string;
  thirdPartyDependency: string;
  milestoneForScale: string;
  failurePoints: string[];
}

export interface MarketAssessment {
  painPoint: string;
  structure: string;
  adoptionDrivers: string[];
  whyNow: string;
  competitors: string[];
  substitutes: string[];
  regulatoryEnvironment: string;
  maturity: MarketMaturity;
}

export interface CommercialAssessment {
  pricingModel: string;
  salesMotion: string;
  customerType: string;
  adoptionEvidence: Evidence[];
  implementationBurden: string;
  expansionOpportunity: string;
  goToMarketRisk: string;
}

/** Financing view for a private company. */
export interface PrivateFinancials {
  kind: "private";
  stage: Stage;
  capitalRaised: Fact<number>;
  latestRound: Fact<string>;
  capitalIntensity: CapitalIntensity;
  futureFinancingNeed: string;
  ownershipConsiderations: string;
  financingRisk: string;
}

/**
 * Financing view for a public company.
 *
 * Every figure here is typed as a string rather than a number on purpose. This
 * build expresses public-market financials as dated ranges ("gross margin in
 * the low to mid seventies"), because a point value carried in a static file
 * would be stale within a quarter and would read as more precise than the
 * underlying verification supports.
 */
export interface PublicFinancials {
  kind: "public";
  ticker: string;
  marketCap: Fact<string>;
  revenueGrowth: Fact<string>;
  grossMargin: Fact<string>;
  operatingMargin: Fact<string>;
  cashPosition: Fact<string>;
  valuationMultiple: Fact<string>;
  marketExpectations: string;
  earningsCatalysts: string[];
}

export type Financials = PrivateFinancials | PublicFinancials;

export interface InvestmentView {
  thesis: string;
  bullCase: string;
  baseCase: string;
  bearCase: string;
  catalysts: string[];
  risks: string[];
  invalidators: string[];
  recommendedNextStep: string;
}

export interface DiligenceSet {
  technology: string[];
  product: string[];
  customers: string[];
  competition: string[];
  unitEconomics: string[];
  capitalRequirements: string[];
  regulation: string[];
  team: string[];
  financing: string[];
  commercialization: string[];
}

/* -------------------------------------------------------------------------- */
/* Scoring                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The twelve quality factors.
 *
 * Mandate fit is deliberately absent. It is not a quality factor and is not
 * scored additively, because a weighted factor can always be outvoted by the
 * other eleven: a superb company outside a mandate would still rank near the
 * top, which is not how a mandate works. Relevance is handled as a separate
 * stage in lib/scoring.ts.
 */
export type FactorKey =
  | "differentiation"
  | "defensibility"
  | "marketPotential"
  | "commercialReadiness"
  | "customerEvidence"
  | "teamCredibility"
  | "capitalEfficiency"
  | "competitiveIntensity"
  | "technicalRisk"
  | "regulatoryRisk"
  | "financingRisk"
  | "overlooked";

/**
 * A per-factor assessment. `rating` is 0 to 5 and is deliberately coarse: the
 * weighted score is derived from it, so the model cannot manufacture precision
 * the underlying evidence does not support.
 *
 * Ratings are oriented so that 5 is always the most favourable reading. On the
 * four risk factors that means 5 signals low risk, which the methodology page
 * states explicitly so the direction is never ambiguous.
 */
export interface FactorAssessment {
  rating: number; // 0 to 5
  evidence: string;
  rationale: string;
  /** Whether the rating rests on verified information or analyst judgment. */
  basis: "verified" | "judgment";
}

export type FactorSet = Record<FactorKey, FactorAssessment>;

/** Terse constructor for factor assessments, used throughout the dataset. */
export const fa = (
  rating: number,
  basis: "verified" | "judgment",
  evidence: string,
  rationale: string,
): FactorAssessment => ({ rating, basis, evidence, rationale });

/* -------------------------------------------------------------------------- */
/* Company                                                                    */
/* -------------------------------------------------------------------------- */

export interface Company {
  id: string;
  name: string;
  /**
   * True when the company is fictional. Every private company in this build is
   * a demonstration record; the public companies are real, and their
   * qualitative profiles are drawn from widely published information.
   */
  isDemonstration: boolean;
  marketType: MarketType;
  hq: string;
  region: Region;
  foundedYear: number;
  sector: Sector;
  subsector: string;
  stage: Stage;
  description: string;
  businessModel: string;
  primaryCustomer: string;
  technicalDifferentiation: string;
  tractionSignal: Fact<string>;
  keyCatalyst: string;
  investmentRisk: string;
  technicalRisk: string;
  competitiveThreat: string;
  capitalIntensity: CapitalIntensity;
  commercialReadiness: CommercialReadiness;
  /** ISO date this record was last reviewed by the analyst. */
  lastReviewed: string;
  /** Ids into the source registry. Empty for demonstration companies. */
  sourceIds: string[];
  financials: Financials;
  technology: TechnologyAssessment;
  market: MarketAssessment;
  commercial: CommercialAssessment;
  investment: InvestmentView;
  diligence: DiligenceSet;
  outreach: string;
  factors: FactorSet;
}

/** Locally editable workflow fields layered on top of a static company. */
export interface PipelineFields {
  status: PipelineStage;
  priority: Priority;
  owner: string;
  dateSourced: string;
  lastActivity: string;
  nextStep: string;
  nextStepDate: string;
  notes: string;
  keyRisk: string;
  source: string;
}

export type CompanyRecord = Company & PipelineFields;

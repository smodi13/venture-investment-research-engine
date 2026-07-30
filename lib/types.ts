/**
 * Core domain types for the Venture Sourcing Engine.
 *
 * Two rules shape this file.
 *
 * First, the sourcing universe contains only real, currently private
 * companies. There is no `isDemonstration` flag and no public company in the
 * sourcing type at all, because the type system should make it impossible to
 * put a mature public company into a venture sourcing ranking. Public
 * companies have their own type and their own route.
 *
 * Second, every material claim carries a source. A field that cannot be
 * sourced is set to NOT_DISCLOSED rather than estimated, because a plausible
 * invented number is worse than an honest gap.
 */

/** The exact string shown wherever a fact could not be verified. */
export const NOT_DISCLOSED = "Not publicly disclosed" as const;
export type NotDisclosed = typeof NOT_DISCLOSED;

/** A value that is either sourced or explicitly absent. */
export type Sourced<T> = T | NotDisclosed;

export function isDisclosed<T>(value: Sourced<T>): value is T {
  return value !== NOT_DISCLOSED;
}

/* -------------------------------------------------------------------------- */
/* Evidence and confidence                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Whether a rating rests on something a reader can check, or on the analyst's
 * reading of it. Shown next to every factor.
 */
export type Basis = "verified" | "judgment";

/**
 * How much of a company's record is supported by primary sources.
 *
 * This is not a quality signal. A company with thin public disclosure can be
 * an excellent company, and the platform says so. It is a statement about how
 * certain the conclusion is, nothing more.
 */
export type DataConfidence = "High" | "Medium" | "Low";

export const DATA_CONFIDENCE_LEVELS: DataConfidence[] = [
  "High",
  "Medium",
  "Low",
];

export const DATA_CONFIDENCE_MEANING: Record<DataConfidence, string> = {
  High: "Financing, founders, product, and technical claims are each supported by a primary source, with corroboration from an independent publication.",
  Medium:
    "The core facts are sourced, but at least one material area rests on a single source or on the company's own description.",
  Low: "Public disclosure is thin. The company may still be interesting, and the conclusion is correspondingly less certain.",
};

/** A claim with the source that supports it. */
export interface Evidence {
  claim: string;
  /** Id into the source registry. */
  sourceId: string;
  basis: Basis;
}

/* -------------------------------------------------------------------------- */
/* Classification                                                             */
/* -------------------------------------------------------------------------- */

export type Sector =
  | "AI Infrastructure"
  | "Semiconductors & Advanced Computing"
  | "Robotics & Autonomy"
  | "Quantum Computing"
  | "Biotechnology & Research Tools"
  | "Energy Systems"
  | "Advanced Materials"
  | "Space & Aerospace"
  | "Enterprise Infrastructure Software"
  | "Healthcare Technology";

export const SECTORS: Sector[] = [
  "AI Infrastructure",
  "Semiconductors & Advanced Computing",
  "Robotics & Autonomy",
  "Quantum Computing",
  "Biotechnology & Research Tools",
  "Energy Systems",
  "Advanced Materials",
  "Space & Aerospace",
  "Enterprise Infrastructure Software",
  "Healthcare Technology",
];

/**
 * Financing stages a venture sourcing engine can act on. There is deliberately
 * no "Public" member: a public company cannot be a sourcing candidate, and the
 * type prevents one being recorded as such.
 */
export type Stage =
  | "Pre-Seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series C"
  | "Later stage";

export const STAGES: Stage[] = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Later stage",
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

export type CapitalIntensity = "Low" | "Moderate" | "High" | "Very High";

export const CAPITAL_INTENSITIES: CapitalIntensity[] = [
  "Low",
  "Moderate",
  "High",
  "Very High",
];

export type CommercialReadiness =
  | "Research"
  | "Prototype"
  | "Early Deployment"
  | "Scaling";

export const COMMERCIAL_READINESS: CommercialReadiness[] = [
  "Research",
  "Prototype",
  "Early Deployment",
  "Scaling",
];

export type MarketMaturity = "Emerging" | "Developing" | "Mature";

/* -------------------------------------------------------------------------- */
/* Sourcing                                                                   */
/* -------------------------------------------------------------------------- */

/** The observable event that caused a company to enter the pipeline. */
export type SourcingSignal =
  | "Recent financing"
  | "Product launch"
  | "Research publication"
  | "Technical benchmark"
  | "Patent activity"
  | "Regulatory milestone"
  | "Government grant"
  | "Government contract"
  | "Manufacturing milestone"
  | "Founder background"
  | "Open-source adoption"
  | "Major partnership"
  | "Customer announcement"
  | "Hiring pattern"
  | "New facility"
  | "Industry bottleneck"
  | "Strategic investor participation";

export const SOURCING_SIGNALS: SourcingSignal[] = [
  "Recent financing",
  "Product launch",
  "Research publication",
  "Technical benchmark",
  "Patent activity",
  "Regulatory milestone",
  "Government grant",
  "Government contract",
  "Manufacturing milestone",
  "Founder background",
  "Open-source adoption",
  "Major partnership",
  "Customer announcement",
  "Hiring pattern",
  "New facility",
  "Industry bottleneck",
  "Strategic investor participation",
];

export interface SourcingRationale {
  /** The primary signal type that surfaced the company. */
  signal: SourcingSignal;
  /** ISO date the signal was observed. */
  dateSourced: string;
  /** How the company was found. */
  channel: string;
  /** Specific, evidenced statement of why this entered the pipeline. */
  whyEntered: string;
  whyTimely: string;
  /**
   * Why the company may be under-examined. When the evidence does not support
   * an overlooked claim, this states plainly that the company is already well
   * recognised and explains why it remains relevant.
   */
  whyOverlooked: string;
  /** True when the company is widely covered and the platform says so. */
  wellRecognised: boolean;
}

/* -------------------------------------------------------------------------- */
/* Assessments                                                                */
/* -------------------------------------------------------------------------- */

export interface TechnologyAssessment {
  howItWorks: string;
  coreAdvantage: string;
  supportingEvidence: Evidence[];
  benchmarks: Sourced<string>;
  intellectualProperty: Sourced<string>;
  thirdPartyDependency: string;
  milestoneForScale: string;
  failurePoints: string[];
}

export interface MarketAssessment {
  painPoint: string;
  structure: string;
  adoptionDrivers: string[];
  competitors: string[];
  substitutes: string[];
  regulatoryEnvironment: string;
  maturity: MarketMaturity;
  currentCatalyst: string;
}

export interface CommercialAssessment {
  customerType: string;
  pricingModel: Sourced<string>;
  salesMotion: string;
  adoptionEvidence: Evidence[];
  implementationBurden: string;
  expansionOpportunity: string;
  goToMarketRisk: string;
}

export interface FinancingAssessment {
  stage: Stage;
  /** Human-readable description of the latest disclosed round. */
  latestRound: string;
  /** ISO date the latest round was announced. */
  latestRoundDate: string;
  latestRoundSourceId: string;
  totalDisclosedFunding: Sourced<string>;
  namedInvestors: string[];
  capitalIntensity: CapitalIntensity;
  futureCapitalRequirement: string;
  financingRisk: string;
  /** What a reader should know is absent from the public record. */
  missingInformation: string[];
}

export interface InvestmentView {
  thesis: string;
  bullCase: string;
  baseCase: string;
  bearCase: string;
  catalysts: string[];
  risks: string[];
  invalidators: string[];
  recommendedNextStep: string;
  confidence: DataConfidence;
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

export type FactorKey =
  | "technicalDifferentiation"
  | "technicalEvidence"
  | "defensibility"
  | "marketImportance"
  | "commercialReadiness"
  | "customerEvidence"
  | "teamCredibility"
  | "capitalEfficiency"
  | "competitiveIntensity"
  | "financingRisk"
  | "regulatoryRisk"
  | "sourcingOriginality";

/**
 * A per-factor assessment. Ratings are 0 to 5 and deliberately coarse, so the
 * model cannot manufacture precision the evidence does not support.
 *
 * Ratings are oriented so 5 is always the most favourable reading. On the
 * three risk factors that means 5 signals low risk.
 */
export interface FactorAssessment {
  rating: number;
  evidence: string;
  explanation: string;
  basis: Basis;
  confidence: DataConfidence;
  /** Source supporting the evidence, where one exists. */
  sourceId?: string;
}

export type FactorSet = Record<FactorKey, FactorAssessment>;

/** Terse constructor used throughout the dataset. */
export const fa = (
  rating: number,
  basis: Basis,
  confidence: DataConfidence,
  evidence: string,
  explanation: string,
  sourceId?: string,
): FactorAssessment => ({
  rating,
  basis,
  confidence,
  evidence,
  explanation,
  sourceId,
});

/* -------------------------------------------------------------------------- */
/* The private company                                                        */
/* -------------------------------------------------------------------------- */

export interface PrivateCompany {
  id: string;
  name: string;
  /** Official company website. Verified to resolve. */
  website: string;
  /**
   * Always true, and asserted by the data-integrity tests. The field exists so
   * that the check is explicit in the data rather than implied by the type.
   */
  currentlyPrivate: true;
  /** How private status was confirmed, and when. */
  privateStatusNote: string;
  headquarters: string;
  region: Region;
  foundedYear: Sourced<number>;
  founders: string[];
  sector: Sector;
  subsector: string;
  description: string;
  targetCustomer: string;
  businessModel: string;
  technicalDifferentiation: string;
  tractionSignal: Sourced<string>;
  recentCatalyst: string;
  primaryCompetitors: string[];
  mainTechnicalRisk: string;
  mainCommercialRisk: string;
  mainFinancingRisk: string;
  sourcing: SourcingRationale;
  financing: FinancingAssessment;
  technology: TechnologyAssessment;
  market: MarketAssessment;
  commercial: CommercialAssessment;
  investment: InvestmentView;
  diligence: DiligenceSet;
  outreach: string;
  factors: FactorSet;
  dataConfidence: DataConfidence;
  /** Why the record carries the confidence rating it does. */
  dataConfidenceNote: string;
  /** Source registry ids. At least one primary and one corroborating. */
  sourceIds: string[];
  /** ISO date the record was last reviewed against its sources. */
  lastReviewed: string;
}

/* -------------------------------------------------------------------------- */
/* Public companies, used only as market signals                              */
/* -------------------------------------------------------------------------- */

export type SignalUse =
  | "Capital expenditure trend"
  | "Earnings read-through"
  | "Customer demand indicator"
  | "Supply-chain signal"
  | "Technology adoption signal"
  | "Valuation context"
  | "Competitive context"
  | "Market maturity";

/**
 * A public company. Structurally separate from PrivateCompany and carrying no
 * score, no pipeline status, and no sourcing rationale, because it is not a
 * sourcing candidate and cannot be turned into one.
 */
export interface MarketSignalCompany {
  id: string;
  name: string;
  ticker: string;
  exchange: string;
  website: string;
  sector: Sector;
  /** What this company tells a venture investor. */
  signalUses: SignalUse[];
  whatItSignals: string;
  /** How to read it, including what it does not tell you. */
  howToRead: string;
  /** Private companies in the universe whose thesis this bears on. */
  relatedPrivateIds: string[];
  sourceIds: string[];
  lastReviewed: string;
}

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

export type Priority = "High" | "Medium" | "Low";

export const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

/** Locally editable workflow fields layered on top of a sourced company. */
export interface PipelineFields {
  status: PipelineStage;
  priority: Priority;
  keyUnansweredQuestion: string;
  nextStep: string;
  nextStepDate: string;
  notes: string;
}

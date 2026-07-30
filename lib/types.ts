export type PipelineStatus =
  | "New Signal"
  | "Researching"
  | "Founder Outreach"
  | "Partner Review"
  | "Passed";

export const PIPELINE_STATUSES: PipelineStatus[] = [
  "New Signal",
  "Researching",
  "Founder Outreach",
  "Partner Review",
  "Passed",
];

export type FundingStage = "Stealth" | "Pre-Seed" | "Seed";

export const FUNDING_STAGES: FundingStage[] = ["Stealth", "Pre-Seed", "Seed"];

/**
 * Thesis categories the engine sources against. Deliberately broad across
 * early technical markets rather than narrowed to a single sector.
 */
export type ThesisCategory =
  | "AI Drug Discovery"
  | "Robotics & Physical AI"
  | "Enterprise AI Workflow"
  | "Biotech Tooling"
  | "Deep Tech Infrastructure"
  | "Technical Software";

export const THESIS_CATEGORIES: ThesisCategory[] = [
  "AI Drug Discovery",
  "Robotics & Physical AI",
  "Enterprise AI Workflow",
  "Biotech Tooling",
  "Deep Tech Infrastructure",
  "Technical Software",
];

/**
 * The shape of the X post or account behavior that caused a lead to surface.
 * These are the primitives the engine actually queries for.
 */
export type SignalType =
  | "Technical thread"
  | "Product demo"
  | "Open-source release"
  | "Hiring signal"
  | "Customer pain point"
  | "Recurring problem discussion"
  | "Build-in-public update";

export const SIGNAL_TYPES: SignalType[] = [
  "Technical thread",
  "Product demo",
  "Open-source release",
  "Hiring signal",
  "Customer pain point",
  "Recurring problem discussion",
  "Build-in-public update",
];

/**
 * How visible the company already is in mainstream startup databases. The
 * premise of the engine is finding companies while this is still thin.
 */
export type Visibility = "Not listed" | "Thin profile" | "Listed";

export const VISIBILITY_LEVELS: Visibility[] = [
  "Not listed",
  "Thin profile",
  "Listed",
];

/** How firmly a claim is established. Shown next to every evidence item. */
export type Confidence = "Observed" | "Founder-reported" | "Inferred";

export interface EvidenceItem {
  claim: string;
  confidence: Confidence;
}

/** Provenance for the X signal that surfaced the lead. */
export interface XSignal {
  type: SignalType;
  /** Illustrative handle for a sample company. Not a real account. */
  handle: string;
  /** What the post actually said or showed. */
  excerpt: string;
  /** ISO date the engine observed the post. */
  observedAt: string;
  /** Illustrative engagement shape, used as a weak ranking input only. */
  engagement: string;
  /** Why this post cleared the noise filter and became a lead. */
  whySurfaced: string;
  /** Independent places the signal was corroborated before scoring. */
  corroboration: string[];
}

export type ScoreKey =
  | "founder"
  | "signal"
  | "earliness"
  | "thesis"
  | "demand"
  | "technical"
  | "market"
  | "timing"
  | "stage";

export type ScoreBreakdown = Record<ScoreKey, number>;

export interface Company {
  id: string;
  name: string;
  /** Every record in the public deployment is a labeled demonstration lead. */
  isDemo: boolean;
  founder: string;
  founderTitle: string;
  hq: string;
  /** Region bucket used for filtering. */
  region: string;
  category: ThesisCategory;
  stage: FundingStage;
  /** Estimated total raised, in USD. Always an estimate for demo records. */
  fundingRaisedUSD: number;
  foundedYear: number;
  website: string;
  linkedin: string;
  description: string;
  /** Why this lead is relevant to an early-stage technical thesis. */
  thesisFit: string;
  /** The X signal that surfaced this company. */
  signal: XSignal;
  visibility: Visibility;
  /**
   * Illustrative estimate of how far ahead of a mainstream database profile
   * the X signal appeared. The core metric this engine optimizes for.
   */
  daysAheadOfDatabases: number;
  dateDiscovered: string; // ISO date
  scores: ScoreBreakdown;
  // Detail view fields
  founderBackground: string;
  marketOpportunity: string;
  whyNow: string;
  evidence: EvidenceItem[];
  concerns: string[];
  diligenceQuestions: string[];
  outreach: string;
}

/** Runtime record = static company plus the locally editable workflow fields. */
export interface LeadRecord extends Company {
  status: PipelineStatus;
  notes: string;
}

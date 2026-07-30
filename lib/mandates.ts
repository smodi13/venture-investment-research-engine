import type { FactorKey, Sector, Stage } from "./types";

/**
 * Investment mandates.
 *
 * A mandate is the configuration object the whole platform reads from. It
 * carries the factor weights, the sector and stage affinities that produce a
 * mandate-fit rating, the sectors the interface should emphasise, and the
 * extra diligence a mandate demands. Changing the mandate changes the ranking,
 * the score composition, the rationale, and the diligence list, because all
 * four are derived from this file rather than hard coded per company.
 */

export type MandateId =
  | "frontier-technology"
  | "enterprise-software"
  | "healthcare-technology"
  | "generalist-early-stage";

export interface Mandate {
  id: MandateId;
  name: string;
  summary: string;
  /** The investment question this mandate is really asking. */
  centralQuestion: string;
  focusAreas: string[];
  typicalStages: string;
  /** Weights per factor, summing to 100. */
  weights: Record<FactorKey, number>;
  /** 0 to 5 affinity used to derive the mandate-fit rating. */
  sectorAffinity: Record<Sector, number>;
  stageAffinity: Record<Stage, number>;
  /** Sectors surfaced first in the interface under this mandate. */
  emphasisedSectors: Sector[];
  /** Appended to every company diligence list while this mandate is active. */
  additionalDiligence: string[];
  /** How this mandate reads a score, stated in the mandate's own terms. */
  scoringNote: string;
}

export const MANDATES: Mandate[] = [
  {
    id: "frontier-technology",
    name: "Frontier Technology",
    summary:
      "Deep technology companies where the hard problem is genuinely hard, the capital requirement is real, and the defensibility comes from physics, process, or accumulated engineering rather than from a feature set.",
    centralQuestion:
      "Is the technical advantage real, durable, and reachable with the capital this company can plausibly raise?",
    focusAreas: [
      "AI infrastructure",
      "Robotics and autonomy",
      "Advanced computing",
      "Quantum technology",
      "Biotechnology and research tools",
      "Energy systems",
      "Advanced materials",
      "Space and aerospace technology",
    ],
    typicalStages: "Seed through growth, plus select public-market opportunities",
    weights: {
      mandateFit: 22,
      differentiation: 13,
      defensibility: 11,
      marketPotential: 9,
      commercialReadiness: 4,
      customerEvidence: 5,
      teamCredibility: 9,
      capitalEfficiency: 6,
      competitiveIntensity: 4,
      technicalRisk: 7,
      regulatoryRisk: 3,
      financingRisk: 4,
      overlooked: 3,
    },
    sectorAffinity: {
      "AI Infrastructure": 5,
      Semiconductors: 5,
      "Robotics & Autonomy": 5,
      "Quantum Technology": 5,
      "Biotechnology & Research Tools": 4,
      "Energy & Advanced Materials": 5,
      "Enterprise Software": 2,
      "Healthcare Technology": 2,
    },
    stageAffinity: {
      "Pre-Seed": 3,
      Seed: 4,
      "Series A": 5,
      "Series B": 5,
      "Series C": 4,
      Growth: 4,
      Public: 4,
    },
    emphasisedSectors: [
      "AI Infrastructure",
      "Semiconductors",
      "Robotics & Autonomy",
      "Quantum Technology",
      "Energy & Advanced Materials",
    ],
    additionalDiligence: [
      "What is the specific physical or engineering constraint that competitors cannot design around, and how long does it hold?",
      "What total capital is required to reach a repeatable unit of production, and what is the cost per unit at that point?",
      "Which parts of the stack depend on a supplier that could be acquired by a competitor or constrained by export control?",
    ],
    scoringNote:
      "Mandate fit carries 22 points, and differentiation, defensibility, and team credibility carry 33 more, because in frontier technology those are the variables that decide whether anything else ever matters. Commercial readiness is weighted lightly on purpose: penalising a company for being early would defeat the mandate.",
  },
  {
    id: "enterprise-software",
    name: "Enterprise Software",
    summary:
      "Software companies selling into a defined budget line, where the question is whether early customer evidence points to a repeatable sales motion rather than a set of favours.",
    centralQuestion:
      "Does the early customer evidence describe a repeatable sale, or a series of one-off relationships?",
    focusAreas: [
      "Vertical software",
      "Data infrastructure",
      "Security",
      "Developer tools",
      "Financial technology",
      "Workflow software",
    ],
    typicalStages: "Seed through Series C",
    weights: {
      mandateFit: 22,
      differentiation: 9,
      defensibility: 10,
      marketPotential: 8,
      commercialReadiness: 9,
      customerEvidence: 12,
      teamCredibility: 8,
      capitalEfficiency: 7,
      competitiveIntensity: 7,
      technicalRisk: 3,
      regulatoryRisk: 2,
      financingRisk: 2,
      overlooked: 1,
    },
    sectorAffinity: {
      "AI Infrastructure": 4,
      Semiconductors: 1,
      "Robotics & Autonomy": 2,
      "Quantum Technology": 1,
      "Biotechnology & Research Tools": 2,
      "Energy & Advanced Materials": 1,
      "Enterprise Software": 5,
      "Healthcare Technology": 3,
    },
    stageAffinity: {
      "Pre-Seed": 3,
      Seed: 5,
      "Series A": 5,
      "Series B": 5,
      "Series C": 4,
      Growth: 2,
      Public: 2,
    },
    emphasisedSectors: [
      "Enterprise Software",
      "AI Infrastructure",
      "Healthcare Technology",
    ],
    additionalDiligence: [
      "What proportion of revenue comes from customers who found the product rather than being sold it, and how has that proportion moved?",
      "How long does the second deployment inside an existing customer take compared with the first?",
      "What happens to gross margin once support and implementation are fully loaded into cost of revenue?",
    ],
    scoringNote:
      "Customer evidence and commercial readiness carry 21 points between them, more than any other mandate assigns. Technical risk is weighted lightly because in this category execution risk usually outweighs feasibility risk.",
  },
  {
    id: "healthcare-technology",
    name: "Healthcare Technology",
    summary:
      "Companies selling into clinical, research, or payer environments, where regulatory path and reimbursement often decide the outcome before the product does.",
    centralQuestion:
      "Is there a credible path through regulation and reimbursement, and does the team have direct evidence of having walked one?",
    focusAreas: [
      "Healthcare software",
      "Clinical research infrastructure",
      "Life sciences tools",
      "Drug discovery technology",
      "Care delivery infrastructure",
      "Healthcare data",
    ],
    typicalStages: "Seed through growth",
    weights: {
      mandateFit: 22,
      differentiation: 8,
      defensibility: 8,
      marketPotential: 8,
      commercialReadiness: 7,
      customerEvidence: 9,
      teamCredibility: 9,
      capitalEfficiency: 4,
      competitiveIntensity: 3,
      technicalRisk: 4,
      regulatoryRisk: 14,
      financingRisk: 3,
      overlooked: 1,
    },
    sectorAffinity: {
      "AI Infrastructure": 2,
      Semiconductors: 1,
      "Robotics & Autonomy": 2,
      "Quantum Technology": 1,
      "Biotechnology & Research Tools": 5,
      "Energy & Advanced Materials": 1,
      "Enterprise Software": 2,
      "Healthcare Technology": 5,
    },
    stageAffinity: {
      "Pre-Seed": 2,
      Seed: 4,
      "Series A": 5,
      "Series B": 5,
      "Series C": 4,
      Growth: 4,
      Public: 3,
    },
    emphasisedSectors: [
      "Healthcare Technology",
      "Biotechnology & Research Tools",
    ],
    additionalDiligence: [
      "What is the specific regulatory pathway, who has walked it before at this company, and what is the realistic timeline including a first rejection?",
      "Who actually pays, out of which budget, and does that budget grow or shrink when the product works as intended?",
      "How is patient or research data governed, and what happens to the product if that governing rule changes?",
    ],
    scoringNote:
      "Regulatory risk carries 14 points, the highest weight this platform assigns to any risk factor. In this category a strong product with an unclear regulatory path is a worse investment than an adequate product with a cleared one.",
  },
  {
    id: "generalist-early-stage",
    name: "Generalist Early Stage",
    summary:
      "Broad early-stage technology investing where the company is young enough that founder quality and market choice are the only things reliably observable.",
    centralQuestion:
      "Is this a person who will find a way through, in a market large enough to make that worth doing?",
    focusAreas: [
      "Broad software and technology",
      "Founder quality",
      "Market potential",
      "Early customer evidence",
      "Capital efficiency",
    ],
    typicalStages: "Pre-seed through Series A",
    weights: {
      mandateFit: 18,
      differentiation: 9,
      defensibility: 8,
      marketPotential: 12,
      commercialReadiness: 5,
      customerEvidence: 10,
      teamCredibility: 16,
      capitalEfficiency: 9,
      competitiveIntensity: 4,
      technicalRisk: 3,
      regulatoryRisk: 2,
      financingRisk: 3,
      overlooked: 1,
    },
    sectorAffinity: {
      "AI Infrastructure": 4,
      Semiconductors: 2,
      "Robotics & Autonomy": 3,
      "Quantum Technology": 2,
      "Biotechnology & Research Tools": 3,
      "Energy & Advanced Materials": 3,
      "Enterprise Software": 5,
      "Healthcare Technology": 4,
    },
    stageAffinity: {
      "Pre-Seed": 5,
      Seed: 5,
      "Series A": 4,
      "Series B": 2,
      "Series C": 1,
      Growth: 1,
      Public: 1,
    },
    emphasisedSectors: ["Enterprise Software", "AI Infrastructure"],
    additionalDiligence: [
      "What has this founder built before, and what does the way they describe the failure tell you about how they think?",
      "If the current product is wrong, what does the team already know that would make the second attempt faster than the first?",
      "How many months of runway does the current plan assume, and what is the smallest result that would make the next round straightforward?",
    ],
    scoringNote:
      "Team credibility carries 16 points and market potential 12, the heaviest non-mandate weights any profile assigns. At pre-seed and seed the product will change, so the model deliberately weights the people and the market over the current artefact. Mandate fit is 18 rather than 22 here, because a generalist mandate is meant to be broad.",
  },
];

export const DEFAULT_MANDATE_ID: MandateId = "frontier-technology";

export function getMandate(id: MandateId): Mandate {
  return MANDATES.find((m) => m.id === id) ?? MANDATES[0];
}

export function isMandateId(value: string): value is MandateId {
  return MANDATES.some((m) => m.id === value);
}

import type { FactorKey, Sector, Stage } from "./types";

/**
 * Investment mandates.
 *
 * A mandate is the configuration object the whole platform reads from. It
 * carries the quality weights, the sector and stage affinities that set a
 * company's relevance tier, the sectors the interface emphasises, and the
 * extra diligence the mandate demands.
 *
 * Note what is absent: there is no public-company stage. The Stage type has no
 * "Public" member, so a public company cannot be scored by any mandate here.
 * Public companies are excluded structurally rather than by a filter that
 * could later be forgotten.
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
  centralQuestion: string;
  focusAreas: string[];
  targetStages: string;
  /** Quality-factor weights, summing to 100. Relevance is applied separately. */
  weights: Record<FactorKey, number>;
  /** 0 to 5. Relevance takes the weaker of sector and stage affinity. */
  sectorAffinity: Record<Sector, number>;
  stageAffinity: Record<Stage, number>;
  emphasisedSectors: Sector[];
  additionalDiligence: string[];
  scoringNote: string;
}

export const MANDATES: Mandate[] = [
  {
    id: "frontier-technology",
    name: "Frontier Technology",
    summary:
      "Deep technology companies where the hard problem is genuinely hard, the capital requirement is real, and defensibility comes from physics, process, or accumulated engineering rather than from a feature set.",
    centralQuestion:
      "Is the technical advantage real, durable, and reachable with the capital this company can plausibly raise?",
    focusAreas: [
      "AI infrastructure",
      "Advanced computing",
      "Semiconductors",
      "Robotics",
      "Quantum technology",
      "Biotechnology tools",
      "Energy systems",
      "Advanced materials",
      "Space and aerospace technology",
    ],
    targetStages:
      "Pre-Seed through Series C, plus limited later-stage private opportunities",
    weights: {
      technicalDifferentiation: 15,
      technicalEvidence: 14,
      defensibility: 12,
      marketImportance: 10,
      commercialReadiness: 4,
      customerEvidence: 6,
      teamCredibility: 11,
      capitalEfficiency: 7,
      competitiveIntensity: 5,
      financingRisk: 6,
      regulatoryRisk: 4,
      sourcingOriginality: 6,
    },
    sectorAffinity: {
      "AI Infrastructure": 5,
      "Semiconductors & Advanced Computing": 5,
      "Robotics & Autonomy": 5,
      "Quantum Computing": 5,
      "Biotechnology & Research Tools": 4,
      "Energy Systems": 5,
      "Advanced Materials": 5,
      "Space & Aerospace": 5,
      "Enterprise Infrastructure Software": 2,
      "Healthcare Technology": 2,
    },
    stageAffinity: {
      "Pre-Seed": 4,
      Seed: 5,
      "Series A": 5,
      "Series B": 5,
      "Series C": 5,
      "Later stage": 3,
    },
    emphasisedSectors: [
      "AI Infrastructure",
      "Semiconductors & Advanced Computing",
      "Robotics & Autonomy",
      "Quantum Computing",
      "Energy Systems",
      "Space & Aerospace",
    ],
    additionalDiligence: [
      "What is the specific physical or engineering constraint that competitors cannot design around, and how long does it hold?",
      "What total capital is required to reach a repeatable unit of production, and what is the cost per unit at that point?",
      "Which parts of the stack depend on a supplier that could be acquired by a competitor or constrained by export control?",
    ],
    scoringNote:
      "Technical differentiation and technical evidence carry 29 of the 100 quality points between them, because in frontier technology a claim without published or independently observable evidence is the most common way to be wrong. Commercial readiness is weighted lightly on purpose: penalising a company for being early would defeat the mandate.",
  },
  {
    id: "enterprise-software",
    name: "Enterprise Software",
    summary:
      "Software companies selling into a defined budget line, where the question is whether early customer evidence points to a repeatable sales motion rather than a set of favours.",
    centralQuestion:
      "Does the early customer evidence describe a repeatable sale, or a series of one-off relationships?",
    focusAreas: [
      "Data infrastructure",
      "Cybersecurity",
      "Developer tools",
      "Vertical software",
      "Workflow software",
      "Financial technology",
      "Enterprise infrastructure",
    ],
    targetStages: "Seed through Series C",
    weights: {
      technicalDifferentiation: 10,
      technicalEvidence: 8,
      defensibility: 13,
      marketImportance: 10,
      commercialReadiness: 12,
      customerEvidence: 15,
      teamCredibility: 10,
      capitalEfficiency: 8,
      competitiveIntensity: 8,
      financingRisk: 3,
      regulatoryRisk: 1,
      sourcingOriginality: 2,
    },
    sectorAffinity: {
      "AI Infrastructure": 5,
      "Semiconductors & Advanced Computing": 1,
      "Robotics & Autonomy": 2,
      "Quantum Computing": 1,
      "Biotechnology & Research Tools": 2,
      "Energy Systems": 1,
      "Advanced Materials": 1,
      "Space & Aerospace": 1,
      "Enterprise Infrastructure Software": 5,
      "Healthcare Technology": 3,
    },
    stageAffinity: {
      "Pre-Seed": 3,
      Seed: 5,
      "Series A": 5,
      "Series B": 5,
      "Series C": 5,
      "Later stage": 2,
    },
    emphasisedSectors: [
      "Enterprise Infrastructure Software",
      "AI Infrastructure",
      "Healthcare Technology",
    ],
    additionalDiligence: [
      "What proportion of revenue comes from customers who found the product rather than being sold it, and how has that proportion moved?",
      "How long does the second deployment inside an existing customer take compared with the first?",
      "What happens to gross margin once support and implementation are fully loaded into cost of revenue?",
    ],
    scoringNote:
      "Customer evidence and commercial readiness carry 27 of the 100 quality points between them, more than any other mandate assigns. Technical evidence is weighted lower because in this category execution risk usually outweighs feasibility risk.",
  },
  {
    id: "healthcare-technology",
    name: "Healthcare Technology",
    summary:
      "Companies selling into clinical, research, or payer environments, where regulatory path and reimbursement often decide the outcome before the product does.",
    centralQuestion:
      "Is there a credible path through regulation and reimbursement, and does the team have direct evidence of having walked one?",
    focusAreas: [
      "Clinical software",
      "Healthcare infrastructure",
      "Life-sciences tools",
      "Drug-discovery technology",
      "Research infrastructure",
      "Care-delivery technology",
      "Healthcare data",
    ],
    targetStages: "Seed through growth",
    weights: {
      technicalDifferentiation: 9,
      technicalEvidence: 11,
      defensibility: 10,
      marketImportance: 10,
      commercialReadiness: 9,
      customerEvidence: 12,
      teamCredibility: 11,
      capitalEfficiency: 5,
      competitiveIntensity: 4,
      financingRisk: 4,
      regulatoryRisk: 13,
      sourcingOriginality: 2,
    },
    sectorAffinity: {
      "AI Infrastructure": 2,
      "Semiconductors & Advanced Computing": 1,
      "Robotics & Autonomy": 2,
      "Quantum Computing": 1,
      "Biotechnology & Research Tools": 5,
      "Energy Systems": 1,
      "Advanced Materials": 1,
      "Space & Aerospace": 1,
      "Enterprise Infrastructure Software": 2,
      "Healthcare Technology": 5,
    },
    stageAffinity: {
      "Pre-Seed": 3,
      Seed: 5,
      "Series A": 5,
      "Series B": 5,
      "Series C": 5,
      "Later stage": 4,
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
      "Regulatory risk carries 13 of the 100 quality points, the highest weight this platform assigns to any risk factor. In this category a strong product with an unclear regulatory path is a worse investment than an adequate product with a cleared one.",
  },
  {
    id: "generalist-early-stage",
    name: "Generalist Early Stage",
    summary:
      "Broad early-stage technology investing where the company is young enough that founder quality and market choice are the only things reliably observable.",
    centralQuestion:
      "Is this a team that will find a way through, in a market important enough to make that worth doing?",
    focusAreas: [
      "Broad technology",
      "Founder quality",
      "Early customer evidence",
      "Market importance",
      "Capital efficiency",
      "Technical or product differentiation",
    ],
    targetStages: "Pre-Seed through Series A",
    weights: {
      technicalDifferentiation: 10,
      technicalEvidence: 8,
      defensibility: 9,
      marketImportance: 15,
      commercialReadiness: 6,
      customerEvidence: 12,
      teamCredibility: 19,
      capitalEfficiency: 10,
      competitiveIntensity: 5,
      financingRisk: 3,
      regulatoryRisk: 1,
      sourcingOriginality: 2,
    },
    sectorAffinity: {
      "AI Infrastructure": 4,
      "Semiconductors & Advanced Computing": 3,
      "Robotics & Autonomy": 4,
      "Quantum Computing": 2,
      "Biotechnology & Research Tools": 4,
      "Energy Systems": 4,
      "Advanced Materials": 3,
      "Space & Aerospace": 3,
      "Enterprise Infrastructure Software": 5,
      "Healthcare Technology": 4,
    },
    stageAffinity: {
      "Pre-Seed": 5,
      Seed: 5,
      "Series A": 5,
      "Series B": 2,
      "Series C": 1,
      "Later stage": 1,
    },
    emphasisedSectors: [
      "Enterprise Infrastructure Software",
      "AI Infrastructure",
    ],
    additionalDiligence: [
      "What has this team built before, and what does the way they describe the hard part tell you about how they think?",
      "If the current product is wrong, what does the team already know that would make the second attempt faster than the first?",
      "How many months of runway does the current plan assume, and what is the smallest result that would make the next round straightforward?",
    ],
    scoringNote:
      "Team credibility carries 19 of the 100 quality points and market importance 15, the heaviest weights any profile assigns to either. At pre-seed and seed the product will change, so the model deliberately weights the people and the market over the current artefact. The stage affinities are narrow: anything past Series A falls out of relevance quickly.",
  },
];

export const DEFAULT_MANDATE_ID: MandateId = "frontier-technology";

export function getMandate(id: MandateId): Mandate {
  return MANDATES.find((m) => m.id === id) ?? MANDATES[0];
}

export function isMandateId(value: string): value is MandateId {
  return MANDATES.some((m) => m.id === value);
}

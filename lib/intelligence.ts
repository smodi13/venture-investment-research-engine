import type { Sector } from "./types";

/**
 * Market intelligence.
 *
 * A dated, static research snapshot. There is no live feed behind this page
 * and the interface says so rather than implying freshness it does not have.
 *
 * Every entry describes a real, sourced event. Entries relating to private
 * companies link to the sourcing universe; entries relating to public
 * companies are market context only.
 */

export type EventCategory =
  | "Private financing"
  | "Product launch"
  | "Partnership"
  | "Regulatory development"
  | "Technical benchmark"
  | "Research publication"
  | "Government contract"
  | "Manufacturing milestone"
  | "Customer announcement"
  | "Public market signal";

export const EVENT_CATEGORIES: EventCategory[] = [
  "Private financing",
  "Product launch",
  "Partnership",
  "Regulatory development",
  "Technical benchmark",
  "Research publication",
  "Government contract",
  "Manufacturing milestone",
  "Customer announcement",
  "Public market signal",
];

export type Confidence = "High" | "Medium" | "Low";

export interface IntelligenceEntry {
  id: string;
  date: string;
  subject: string;
  sector: Sector;
  category: EventCategory;
  summary: string;
  investmentRelevance: string;
  /** Private companies in the universe this bears on. */
  relatedPrivateIds: string[];
  affectedThesis: string;
  sourceId: string;
  confidence: Confidence;
}

export const SNAPSHOT_DATE = "2026-07-30";

export const INTELLIGENCE: IntelligenceEntry[] = [
  {
    id: "int-etched-launch",
    date: "2026-06-30",
    subject: "Etched exits stealth with working silicon and contracted demand",
    sector: "AI Software Infrastructure",
    category: "Product launch",
    summary:
      "Etched disclosed 800 million dollars raised across four private financings, a working Sohu chip, more than one billion dollars in customer contracts, and first rack shipments beginning this summer.",
    investmentRelevance:
      "Moves the transformer-specific ASIC question from feasibility to delivery. The contract figure is a company statement and the delivery record will be the first externally checkable fact.",
    relatedPrivateIds: ["etched"],
    affectedThesis: "Inference is a memory problem before a compute problem",
    sourceId: "etched-site",
    confidence: "Medium",
  },
  {
    id: "int-atom-toric",
    date: "2026-06-17",
    subject:
      "Atom Computing demonstrates toric code error correction and raises over 300 million dollars",
    sector: "Quantum Computing",
    category: "Technical benchmark",
    summary:
      "Announced a full demonstration of quantum error correction using a toric code, with errors reducing as more qubits are used, alongside a 100 million dollar Series C and a signed letter of intent with the US Department of Commerce for a further 100 million dollars.",
    investmentRelevance:
      "Error suppression with scale is the property fault tolerance requires, and demonstrating it differs from publishing a roadmap toward it. Note that a third of the announced figure is a letter of intent rather than committed capital.",
    relatedPrivateIds: ["atom-computing", "quera"],
    affectedThesis: "Quantum computing remains pre-commercial",
    sourceId: "atom-prnewswire",
    confidence: "High",
  },
  {
    id: "int-marvell-celestial",
    date: "2026-02-02",
    subject: "Marvell completes acquisition of Celestial AI",
    sector: "Semiconductors & Advanced Computing",
    category: "Public market signal",
    summary:
      "Marvell completed its acquisition of the private optical interconnect company Celestial AI, paying approximately 1.3 billion dollars in cash net of cash acquired plus approximately 24.5 million shares.",
    investmentRelevance:
      "The clearest available exit comparable for private interconnect companies, and a direct demonstration that private status must be re-verified rather than assumed. Celestial AI was a credible sourcing candidate until this transaction closed and was excluded from the universe as a result.",
    relatedPrivateIds: ["ayar-labs", "lightmatter"],
    affectedThesis: "Interconnect grows faster than accelerator volume",
    sourceId: "mrvl-celestial",
    confidence: "High",
  },
  {
    id: "int-stoke-extension",
    date: "2026-02-10",
    subject: "Stoke Space extends Series D to 860 million dollars",
    sector: "Space & Aerospace",
    category: "Private financing",
    summary:
      "Extended its previously announced Series D financing to a total of 860 million dollars, having raised 510 million dollars in October 2025 to fund Nova through first flights.",
    investmentRelevance:
      "Sizes the capital required to attempt full reusability including the upper stage. The company has no orbital flight, so this is capital committed entirely ahead of technical demonstration.",
    relatedPrivateIds: ["stoke-space"],
    affectedThesis: "Frontier technology capital intensity",
    sourceId: "stoke-extension",
    confidence: "High",
  },
  {
    id: "int-openevidence-d",
    date: "2026-01-21",
    subject: "OpenEvidence raises Series D at a reported 12 billion dollar valuation",
    sector: "Healthcare Technology",
    category: "Private financing",
    summary:
      "Raised a 250 million dollar Series D led by Thrive Capital and DST Global, roughly doubling its valuation within three months, having relocated headquarters from Cambridge to Miami during 2025.",
    investmentRelevance:
      "Demonstrates how quickly clinical adoption can reprice a healthcare application. The business model remains undisclosed, which makes the valuation difficult to underwrite from outside.",
    relatedPrivateIds: ["openevidence"],
    affectedThesis: "Healthcare technology mandate",
    sourceId: "openevidence-cnbc",
    confidence: "High",
  },
  {
    id: "int-base-seriesc",
    date: "2026-01-15",
    subject: "Base Power raises one billion dollars to build a domestic factory",
    sector: "Energy Systems",
    category: "Private financing",
    summary:
      "Raised a one billion dollar Series C to build a battery manufacturing facility and expand its distributed home battery and retail electricity model beyond Texas.",
    investmentRelevance:
      "Sizes the capital intensity of vertically integrated distributed energy. The model's revenue depends on grid services market rules, which regulators set and can change.",
    relatedPrivateIds: ["base-power"],
    affectedThesis: "Power is the binding constraint on deployment",
    sourceId: "base-esgtoday",
    confidence: "High",
  },
  {
    id: "int-radiant-seriesd",
    date: "2025-12-17",
    subject:
      "Radiant raises over 300 million dollars to mass-produce portable microreactors",
    sector: "Energy Systems",
    category: "Private financing",
    summary:
      "Raised more than 300 million dollars following a 165 million dollar Series C earlier in 2025, with a fuelled prototype test of its Kaleidos microreactor scheduled at the Idaho National Laboratory DOME facility.",
    investmentRelevance:
      "A fuelled test slot at a Department of Energy facility is an externally administered gate that few reactor developers reach. It is a technical milestone, not a licensing one, and commercial deployment requires the latter.",
    relatedPrivateIds: ["radiant-industries"],
    affectedThesis: "Power is the binding constraint on deployment",
    sourceId: "radiant-seriesd",
    confidence: "High",
  },
  {
    id: "int-k2-seriesc",
    date: "2025-12-12",
    subject: "K2 Space raises 250 million dollars at a stated 3 billion dollar valuation",
    sector: "Space & Aerospace",
    category: "Manufacturing milestone",
    summary:
      "Raised a Series C led by Redpoint to scale its Torrance factory toward up to one hundred high-power satellites per year, citing 500 million dollars in signed contracts and a first production launch planned for March 2026.",
    investmentRelevance:
      "Factory capital committed ahead of flight heritage. The first production launch resolves whether this sequencing was conviction or overreach.",
    relatedPrivateIds: ["k2-space"],
    affectedThesis: "Frontier technology capital intensity",
    sourceId: "k2-prnewswire",
    confidence: "High",
  },
  {
    id: "int-dmatrix-seriesc",
    date: "2025-11-12",
    subject: "d-Matrix raises 275 million dollar Series C for AI inference",
    sector: "Semiconductors & Advanced Computing",
    category: "Private financing",
    summary:
      "Raised a 275 million dollar Series C bringing disclosed total funding to 450 million dollars, with participation from Microsoft's venture fund and Temasek, alongside a rack-scale product announcement naming Supermicro, Arista Networks, and Broadcom as ecosystem partners.",
    investmentRelevance:
      "Strategic participation from a hyperscaler venture arm at the inference silicon layer is a useful signal, because those investors see internal demand data that is not public. Ecosystem partners are not the same as end customers.",
    relatedPrivateIds: ["d-matrix"],
    affectedThesis: "Inference is a memory problem before a compute problem",
    sourceId: "dmatrix-announcement",
    confidence: "High",
  },
  {
    id: "int-stoke-seriesd",
    date: "2025-10-08",
    subject: "Stoke Space raises 510 million dollars and refurbishes Launch Complex 14",
    sector: "Space & Aerospace",
    category: "Government contract",
    summary:
      "Raised a Series D to scale Nova manufacturing, with refurbishment of Launch Complex 14 at Cape Canaveral Space Force Station scheduled for activation in early 2026.",
    investmentRelevance:
      "Range assignments are allocated by parties other than the company, which makes them an external signal of programme seriousness that a funding announcement is not.",
    relatedPrivateIds: ["stoke-space"],
    affectedThesis: "Frontier technology capital intensity",
    sourceId: "stoke-announcement",
    confidence: "High",
  },
  {
    id: "int-oxide-seriesb",
    date: "2025-07-30",
    subject: "Oxide Computer raises 100 million dollar Series B",
    sector: "Enterprise Infrastructure Software",
    category: "Private financing",
    summary:
      "Raised a Series B led by US Innovative Technology Fund with all existing investors participating, to scale manufacturing and customer support for its integrated rack-scale computer.",
    investmentRelevance:
      "Insider participation across the full existing investor base is a constructive signal about information those investors hold privately. Named national laboratory customers are an unusually strong reference for infrastructure of this kind.",
    relatedPrivateIds: ["oxide-computer"],
    affectedThesis: "Owned compute infrastructure",
    sourceId: "oxide-prnewswire",
    confidence: "High",
  },
  {
    id: "int-radiant-seriesc",
    date: "2025-05-28",
    subject: "Radiant closes 165 million dollar Series C",
    sector: "Energy Systems",
    category: "Private financing",
    summary:
      "Closed a Series C led by DCVC bringing total venture funding to 225 million dollars, ahead of the planned fuelled test of its Kaleidos microreactor.",
    investmentRelevance:
      "Establishes the capital consumed before any licensed commercial deployment, which in nuclear is measured in years rather than quarters.",
    relatedPrivateIds: ["radiant-industries"],
    affectedThesis: "Power is the binding constraint on deployment",
    sourceId: "radiant-seriesc",
    confidence: "High",
  },
  {
    id: "int-chainguard-seriesd",
    date: "2025-04-23",
    subject: "Chainguard raises 356 million dollar Series D",
    sector: "Enterprise Infrastructure Software",
    category: "Private financing",
    summary:
      "Raised a Series D led by Kleiner Perkins and IVP at a reported 3.5 billion dollar valuation, disclosing revenue growth from 5 million to 40 million dollars, more than 100 paying enterprise customers, and catalogue growth from 400 to 1,400 images.",
    investmentRelevance:
      "Rare disclosed operating metrics for a private security company, which makes the commercial claim checkable. The figures date from April 2025 and have not been publicly updated since.",
    relatedPrivateIds: ["chainguard"],
    affectedThesis: "Enterprise software mandate",
    sourceId: "chainguard-announcement",
    confidence: "High",
  },
  {
    id: "int-path-seriesd",
    date: "2025-03-04",
    subject: "Path Robotics raises 100 million dollar Series D for robotic welding",
    sector: "Robotics & Autonomy",
    category: "Private financing",
    summary:
      "Raised a Series D led by Matter Venture Partners and Drive Capital to scale its autonomous welding cells, which scan and plan welds without programming.",
    investmentRelevance:
      "One of few companies attacking the skilled welder shortage with autonomy rather than better programming tools, and located outside the major venture hubs.",
    relatedPrivateIds: ["path-robotics"],
    affectedThesis: "Robotics deployment economics",
    sourceId: "path-robotreport",
    confidence: "High",
  },
  {
    id: "int-quera-financing",
    date: "2025-02-01",
    subject: "QuEra raises 230 million dollars and progresses in DARPA programme",
    sector: "Quantum Computing",
    category: "Government contract",
    summary:
      "Raised 230 million dollars with Google and SoftBank Vision Fund cited as leads, and was selected for Phase B of the DARPA Quantum Benchmarking Initiative, having published logical-level magic state distillation results.",
    investmentRelevance:
      "DARPA programme selection is one of very few externally administered technical filters in quantum computing, where most milestones are self-reported.",
    relatedPrivateIds: ["quera"],
    affectedThesis: "Quantum computing remains pre-commercial",
    sourceId: "quera-site",
    confidence: "Medium",
  },
  {
    id: "int-cradle-seriesb",
    date: "2024-11-26",
    subject: "Cradle raises 73 million dollar Series B for protein engineering",
    sector: "Biotechnology & Research Tools",
    category: "Customer announcement",
    summary:
      "Raised a Series B led by IVP bringing total funding above 100 million dollars, naming Novo Nordisk, Johnson & Johnson Innovative Medicine, Grifols, and Novozymes as users of its protein design platform.",
    investmentRelevance:
      "Named enterprise customers across pharmaceutical, plasma, and industrial enzyme markets suggest the tool generalises beyond a single application. The disclosure is now more than eighteen months old.",
    relatedPrivateIds: ["cradle-bio"],
    affectedThesis: "Biotechnology tooling",
    sourceId: "cradle-seriesb",
    confidence: "High",
  },
  {
    id: "int-sublime-strategic",
    date: "2024-09-24",
    subject: "CRH and Holcim invest 75 million dollars in Sublime Systems",
    sector: "Advanced Materials",
    category: "Partnership",
    summary:
      "Two of the largest global building materials companies made a combined 75 million dollar strategic investment in electrochemical cement production, confirmed independently in Holcim's own disclosure.",
    investmentRelevance:
      "Incumbents in a commodity industry funding a process that would displace their own asset base is an unusual signal and suggests the technology passed their technical review. Equity without offtake remains an option rather than a demand commitment.",
    relatedPrivateIds: ["sublime-systems"],
    affectedThesis: "Industrial decarbonisation",
    sourceId: "sublime-holcim",
    confidence: "High",
  },
  {
    id: "int-cobot-seriesb",
    date: "2024-04-16",
    subject: "Collaborative Robotics raises 100 million dollar Series B",
    sector: "Robotics & Autonomy",
    category: "Private financing",
    summary:
      "Raised a Series B led by General Catalyst with the Mayo Clinic participating, bringing total capital raised to more than 140 million dollars within two years of founding.",
    investmentRelevance:
      "The most recent public financing data point for this company. Its age is itself informative for a company operating in a fast-moving category.",
    relatedPrivateIds: ["collaborative-robotics"],
    affectedThesis: "Robotics deployment economics",
    sourceId: "cobot-prnewswire",
    confidence: "High",
  },
];

export function intelligenceForCompany(companyId: string): IntelligenceEntry[] {
  return INTELLIGENCE.filter((e) => e.relatedPrivateIds.includes(companyId));
}

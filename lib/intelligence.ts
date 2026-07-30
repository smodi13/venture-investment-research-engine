import type { MarketType, Provenance, Sector } from "./types";

/**
 * Market intelligence.
 *
 * This is a static, dated snapshot. There is no live feed behind it, and the
 * interface says so on the page rather than implying freshness it does not
 * have. Entries describing real companies are written as structural
 * observations about publicly discussed dynamics, not as reports of specific
 * transactions, because a static file cannot responsibly assert that a
 * particular event happened on a particular date.
 */

export type EventCategory =
  | "Funding"
  | "Product launch"
  | "Partnership"
  | "Regulatory"
  | "Technical benchmark"
  | "Research publication"
  | "Earnings signal"
  | "Manufacturing"
  | "Customer announcement"
  | "Leadership";

export const EVENT_CATEGORIES: EventCategory[] = [
  "Funding",
  "Product launch",
  "Partnership",
  "Regulatory",
  "Technical benchmark",
  "Research publication",
  "Earnings signal",
  "Manufacturing",
  "Customer announcement",
  "Leadership",
];

export type Confidence = "High" | "Medium" | "Low";

export interface IntelligenceEntry {
  id: string;
  date: string;
  subject: string;
  /** Company id in the universe, where the entry maps to one. */
  companyId?: string;
  sector: Sector;
  marketType: MarketType;
  category: EventCategory;
  summary: string;
  investmentRelevance: string;
  /** Which thesis or sector view this bears on. */
  affectedThesis: string;
  provenance: Provenance;
  confidence: Confidence;
  sourceNote: string;
}

export const SNAPSHOT_DATE = "2026-07-28";

export const INTELLIGENCE: IntelligenceEntry[] = [
  {
    id: "int-01",
    date: "2026-07-22",
    subject: "Grid interconnection queues in primary data centre regions",
    sector: "Energy & Advanced Materials",
    marketType: "Public",
    category: "Regulatory",
    summary:
      "Interconnection wait times in the most active data centre regions continue to be measured in years, keeping power availability rather than equipment supply as the gating factor on new capacity.",
    investmentRelevance:
      "Directly supports the demand case for behind-the-meter generation and control. Also the single largest risk to it, since the constraint is what creates the market.",
    affectedThesis: "Infrastructure required for scaled AI inference",
    provenance: "estimate",
    confidence: "Medium",
    sourceNote:
      "Structural observation drawn from publicly discussed grid operator queue data. Verify current queue length with the relevant grid operator before relying on it.",
  },
  {
    id: "int-02",
    date: "2026-07-15",
    subject: "High bandwidth memory contracting structure",
    companyId: "mu",
    sector: "Semiconductors",
    marketType: "Public",
    category: "Earnings signal",
    summary:
      "High bandwidth memory continues to be sold under long-term agreements rather than at spot prices, a structural departure from the historical memory cycle.",
    investmentRelevance:
      "If this holds through a demand softening, it would confirm a genuine structural change in memory economics. If it reverts, the memory cycle is intact and simply delayed.",
    affectedThesis: "Inference is a memory problem before it is a compute problem",
    provenance: "estimate",
    confidence: "Medium",
    sourceNote:
      "Directionally well established across recent reporting. Confirm contracting disclosure in the latest filing.",
  },
  {
    id: "int-03",
    date: "2026-07-10",
    subject: "Liquid cooling attach rates in new data centre construction",
    companyId: "vrt",
    sector: "Energy & Advanced Materials",
    marketType: "Public",
    category: "Product launch",
    summary:
      "Liquid cooling has moved from a specialist product to a default requirement at high rack densities, changing the product mix across data centre thermal management.",
    investmentRelevance:
      "Mix shift toward liquid cooling is the mechanism by which thermal vendors improve margin. Watch attach rate rather than headline order growth.",
    affectedThesis: "Power and heat are the binding constraint on deployment",
    provenance: "estimate",
    confidence: "Medium",
    sourceNote:
      "Widely discussed industry shift. Confirm attach rate commentary in vendor disclosure.",
  },
  {
    id: "int-04",
    date: "2026-07-08",
    subject: "Customer-designed accelerators in production inference",
    companyId: "avgo",
    sector: "Semiconductors",
    marketType: "Public",
    category: "Customer announcement",
    summary:
      "Hyperscale custom accelerator programmes continue to expand, with design partners handling leading-node implementation and packaging.",
    investmentRelevance:
      "The central competitive question for merchant accelerator margins. Track the count of committed multi-generation programmes rather than announcements.",
    affectedThesis: "Where the margin goes as workloads shift to inference",
    provenance: "estimate",
    confidence: "Medium",
    sourceNote:
      "Publicly discussed by multiple parties. Confirm programme count in the latest disclosure.",
  },
  {
    id: "int-05",
    date: "2026-06-30",
    subject: "Meridian Fabric qualification progress",
    companyId: "meridian-fabric",
    sector: "AI Infrastructure",
    marketType: "Private",
    category: "Technical benchmark",
    summary:
      "Two system manufacturers hold the co-packaged optical engine in qualification. No production revenue and no volume commitment to date.",
    investmentRelevance:
      "Qualification completion is the entire investment case. In-rack thermal data, not bench results, is the evidence that matters.",
    affectedThesis: "Interconnect grows faster than accelerator volume",
    provenance: "demonstration",
    confidence: "Low",
    sourceNote:
      "Demonstration data on a fictional company. Describes no real business.",
  },
  {
    id: "int-06",
    date: "2026-06-24",
    subject: "Anvil Grid third utility territory approval",
    companyId: "anvil-grid",
    sector: "Energy & Advanced Materials",
    marketType: "Private",
    category: "Regulatory",
    summary:
      "Behind-the-meter control approach approved for interconnection in a third utility territory, with two sites now past a full year of operation including summer peak.",
    investmentRelevance:
      "Repeatability of the regulatory approval across territories is the moat. A third approval is the first evidence the process is transferable rather than relationship-specific.",
    affectedThesis: "Power and heat are the binding constraint on deployment",
    provenance: "demonstration",
    confidence: "Low",
    sourceNote:
      "Demonstration data on a fictional company. Describes no real business.",
  },
  {
    id: "int-07",
    date: "2026-06-18",
    subject: "Export controls on advanced accelerators",
    sector: "Semiconductors",
    marketType: "Public",
    category: "Regulatory",
    summary:
      "Export control rules on advanced accelerators remain an active constraint on which products may be sold into which markets, and have changed at short notice previously.",
    investmentRelevance:
      "Applies across every accelerator supplier in the universe. Size the revenue at risk under the widest plausible tightening rather than under the current rule.",
    affectedThesis: "Cross-cutting risk on AI infrastructure positions",
    provenance: "estimate",
    confidence: "Medium",
    sourceNote:
      "Well-established policy area. Verify current rules with the relevant regulator before relying on any specific interpretation.",
  },
  {
    id: "int-08",
    date: "2026-06-12",
    subject: "Ravelin Data net revenue retention",
    companyId: "ravelin-data",
    sector: "Enterprise Software",
    marketType: "Private",
    category: "Customer announcement",
    summary:
      "Net revenue retention held above one hundred and ten percent across the past year on sixty two paying customers, with the majority acquired inbound.",
    investmentRelevance:
      "The strongest retention evidence in the private set on the smallest capital base. The forward test is retention among customers whose warehouse vendor has shipped native lineage.",
    affectedThesis: "Enterprise software mandate, data infrastructure",
    provenance: "demonstration",
    confidence: "Low",
    sourceNote:
      "Demonstration data on a fictional company. Describes no real business.",
  },
  {
    id: "int-09",
    date: "2026-06-05",
    subject: "Neutral atom error correction publications",
    companyId: "palisade-quantum",
    sector: "Quantum Technology",
    marketType: "Private",
    category: "Research publication",
    summary:
      "Peer-reviewed work on atom loss during extended computations published, including the limiting case rather than only the best result.",
    investmentRelevance:
      "Atom loss is the specific constraint that most limits this modality. Publishing the limit is a credibility signal and a negative technical datapoint at the same time.",
    affectedThesis: "Quantum technology remains pre-commercial",
    provenance: "demonstration",
    confidence: "Low",
    sourceNote:
      "Demonstration data on a fictional company. Describes no real business.",
  },
  {
    id: "int-10",
    date: "2026-05-28",
    subject: "Advanced packaging capacity as a shipment constraint",
    sector: "Semiconductors",
    marketType: "Public",
    category: "Manufacturing",
    summary:
      "Advanced packaging capacity continues to be discussed as a constraint on accelerator and high bandwidth memory output, independent of wafer availability.",
    investmentRelevance:
      "Affects accelerator vendors and memory manufacturers simultaneously, so it is a correlated exposure across positions that otherwise look diversified.",
    affectedThesis: "Infrastructure required for scaled AI inference",
    provenance: "estimate",
    confidence: "Medium",
    sourceNote:
      "Widely discussed supply dynamic. Confirm current capacity commentary in supplier disclosure.",
  },
  {
    id: "int-11",
    date: "2026-05-20",
    subject: "Coldbrook Thermal repeat installations",
    companyId: "coldbrook-thermal",
    sector: "Energy & Advanced Materials",
    marketType: "Private",
    category: "Customer announcement",
    summary:
      "Two of four operators have repeated after a first installation, bringing deployed facilities to nine with no reported coolant leak incidents to date.",
    investmentRelevance:
      "Repeat purchase is the strongest evidence available at this stage. Three-year coolant chemistry data remains the outstanding diligence item.",
    affectedThesis: "Power and heat are the binding constraint on deployment",
    provenance: "demonstration",
    confidence: "Low",
    sourceNote:
      "Demonstration data on a fictional company. Describes no real business.",
  },
  {
    id: "int-12",
    date: "2026-05-14",
    subject: "Arm data centre royalty rate progression",
    companyId: "arm",
    sector: "Semiconductors",
    marketType: "Public",
    category: "Earnings signal",
    summary:
      "Value captured per device depends on adoption of complete compute subsystems rather than individual cores, which is the mechanism for royalty rate expansion.",
    investmentRelevance:
      "Volume growth alone does not support the current valuation. Royalty per chip is the number that matters and is disclosed separately.",
    affectedThesis: "Processor architecture layer economics",
    provenance: "estimate",
    confidence: "Medium",
    sourceNote:
      "Directionally established. Confirm royalty disclosure in the latest filing.",
  },
  {
    id: "int-13",
    date: "2026-05-06",
    subject: "Wrenfield Robotics pilot duration",
    companyId: "wrenfield-robotics",
    sector: "Robotics & Autonomy",
    marketType: "Private",
    category: "Product launch",
    summary:
      "One production pilot has now run eleven months across full shifts, with published success rates including failure modes and recovery times. No production order yet.",
    investmentRelevance:
      "Duration under real conditions is meaningful, but the absence of conversion after eleven months is the more informative datapoint.",
    affectedThesis: "Robotics deployment economics",
    provenance: "demonstration",
    confidence: "Low",
    sourceNote:
      "Demonstration data on a fictional company. Describes no real business.",
  },
  {
    id: "int-14",
    date: "2026-04-29",
    subject: "Inference share of deployed AI compute",
    sector: "AI Infrastructure",
    marketType: "Public",
    category: "Technical benchmark",
    summary:
      "The share of deployed compute serving inference rather than training continues to rise as applications move from pilot into production.",
    investmentRelevance:
      "The central mechanism of the featured thesis. Any disclosure separating training from inference workloads is the highest value datapoint available.",
    affectedThesis: "Training and inference are not the same problem",
    provenance: "estimate",
    confidence: "Low",
    sourceNote:
      "Directional industry observation. No company discloses this split precisely, which is itself worth noting.",
  },
  {
    id: "int-15",
    date: "2026-04-21",
    subject: "Ferrule Photonics repeat system order",
    companyId: "ferrule-photonics",
    sector: "Semiconductors",
    marketType: "Private",
    category: "Customer announcement",
    summary:
      "A customer placed a second alignment system after six months of production operation, bringing installed systems to six across three customers.",
    investmentRelevance:
      "A repeat order after production use is the only evidence that the payback case is real. What that customer measured is the key diligence question.",
    affectedThesis: "Interconnect grows faster than accelerator volume",
    provenance: "demonstration",
    confidence: "Low",
    sourceNote:
      "Demonstration data on a fictional company. Describes no real business.",
  },
  {
    id: "int-16",
    date: "2026-04-14",
    subject: "Sable Health denial reduction durability",
    companyId: "sable-health",
    sector: "Healthcare Technology",
    marketType: "Private",
    category: "Customer announcement",
    summary:
      "Measured denial rate reduction has been sustained beyond the first year at the eight longest-running accounts, across at least one payer policy change.",
    investmentRelevance:
      "Durability through payer adaptation is the question that separates a structural product from a temporary arbitrage.",
    affectedThesis: "Healthcare technology mandate, data assets",
    provenance: "demonstration",
    confidence: "Low",
    sourceNote:
      "Demonstration data on a fictional company. Describes no real business.",
  },
  {
    id: "int-17",
    date: "2026-04-02",
    subject: "Reimbursement environment for genomic diagnostics",
    companyId: "tem",
    sector: "Healthcare Technology",
    marketType: "Public",
    category: "Regulatory",
    summary:
      "Payer coverage and reimbursement rates remain the primary determinant of clinical sequencing volume economics, and are set outside the company's control.",
    investmentRelevance:
      "A reimbursement reduction would compress the segment that generates the data asset, which is the mechanism by which the whole model works.",
    affectedThesis: "Biotechnology and research tools sector view",
    provenance: "estimate",
    confidence: "Medium",
    sourceNote:
      "Well-established sector dynamic. Verify current coverage determinations with the relevant payer.",
  },
  {
    id: "int-18",
    date: "2026-03-25",
    subject: "Tidewater Autonomy fleet expansion",
    companyId: "tidewater-autonomy",
    sector: "Robotics & Autonomy",
    marketType: "Private",
    category: "Customer announcement",
    summary:
      "Thirty one vessels now under subscription across five operators, with expansion beyond initial vessels at four of the five.",
    investmentRelevance:
      "Fleet expansion after a season of operation is strong evidence. Certification for reduced watchkeeping remains the step that would change the value proposition.",
    affectedThesis: "Robotics deployment economics",
    provenance: "demonstration",
    confidence: "Low",
    sourceNote:
      "Demonstration data on a fictional company. Describes no real business.",
  },
  {
    id: "int-19",
    date: "2026-03-17",
    subject: "Larkspur Systems open-source conversion",
    companyId: "larkspur-systems",
    sector: "AI Infrastructure",
    marketType: "Private",
    category: "Product launch",
    summary:
      "Eleven paid deployments, most originating inbound from use of the open-source routing component, with three expansions at renewal.",
    investmentRelevance:
      "Inbound conversion from open source is efficient acquisition. Retention through an accelerator vendor scheduling upgrade is the unproven part.",
    affectedThesis: "Serving and scheduling layer contestability",
    provenance: "demonstration",
    confidence: "Low",
    sourceNote:
      "Demonstration data on a fictional company. Describes no real business.",
  },
  {
    id: "int-20",
    date: "2026-03-05",
    subject: "Physics-based versus learned molecular property prediction",
    companyId: "sdgr",
    sector: "Biotechnology & Research Tools",
    marketType: "Public",
    category: "Research publication",
    summary:
      "Machine learning approaches to molecular property prediction continue to improve, narrowing the advantage of physics-based simulation in some applications while leaving novel chemistry as the harder case.",
    investmentRelevance:
      "The competitive threat here comes from a different methodology rather than a direct competitor, which makes it easier to underestimate.",
    affectedThesis: "Biotechnology and research tools sector view",
    provenance: "estimate",
    confidence: "Medium",
    sourceNote:
      "Ongoing methodological debate in the scientific literature. Assess against current peer-reviewed benchmarks.",
  },
];

export function intelligenceForCompany(companyId: string): IntelligenceEntry[] {
  return INTELLIGENCE.filter((e) => e.companyId === companyId);
}

import type { MarketSignalCompany } from "../types";

/**
 * Public companies, used only as market signals and comparables.
 *
 * These are not sourcing candidates. They carry no investment score, no
 * relevance tier, and no pipeline status, and they use a different type from
 * the private universe so that no code path can rank them alongside it.
 *
 * They are here because a venture investor reading a private company's thesis
 * needs to know what the public market is saying about the same bottleneck:
 * capital expenditure direction, supply constraints, and where margin is
 * currently captured.
 */

const REVIEWED = "2026-07-30";

export const MARKET_SIGNAL_DISCLOSURE =
  "Public companies are included as market signals and comparables. They are not venture sourcing candidates and do not appear in the private-company pipeline or sourcing rankings.";

export const MARKET_SIGNALS: MarketSignalCompany[] = [
  {
    id: "nvda",
    name: "NVIDIA",
    ticker: "NVDA",
    exchange: "NASDAQ",
    website: "https://investor.nvidia.com/",
    sector: "AI Software Infrastructure",
    signalUses: [
      "Capital expenditure trend",
      "Customer demand indicator",
      "Competitive context",
      "Technology adoption signal",
    ],
    whatItSignals:
      "Data centre segment reporting is the closest available proxy for how much AI compute is actually being deployed, and management commentary on supply constraints indicates which part of the chain is binding.",
    howToRead:
      "Read the direction and the constraint commentary, not the absolute figures. What it does not tell you is how that compute is split between training and inference, which is the variable that matters most for the private inference companies in this universe and which no company discloses precisely.",
    relatedPrivateIds: ["etched", "d-matrix", "ayar-labs", "lightmatter"],
    sourceIds: ["nvda-edgar", "nvda-ir", "sec-edgar"],
    lastReviewed: REVIEWED,
  },
  {
    id: "avgo",
    name: "Broadcom",
    ticker: "AVGO",
    exchange: "NASDAQ",
    website: "https://www.broadcom.com/",
    sector: "Semiconductors & Advanced Computing",
    signalUses: [
      "Customer demand indicator",
      "Competitive context",
      "Market maturity",
    ],
    whatItSignals:
      "Custom accelerator programme disclosure indicates how seriously the largest buyers are pursuing alternatives to merchant silicon, which is the central competitive question for every private inference chip company.",
    howToRead:
      "Treat the count of committed custom programmes as the signal rather than the revenue. It tells you how much of the inference market may never be addressable by a merchant supplier at all.",
    relatedPrivateIds: ["etched", "d-matrix"],
    sourceIds: ["avgo-site", "sec-edgar"],
    lastReviewed: REVIEWED,
  },
  {
    id: "amd",
    name: "Advanced Micro Devices",
    ticker: "AMD",
    exchange: "NASDAQ",
    website: "https://ir.amd.com/",
    sector: "Semiconductors & Advanced Computing",
    signalUses: ["Competitive context", "Technology adoption signal"],
    whatItSignals:
      "The progress of the only merchant second source for AI accelerators indicates how much appetite buyers actually have for alternatives, as distinct from how much they say they have.",
    howToRead:
      "Watch named production deployments rather than benchmark claims. The gap between evaluation and production is where most accelerator challengers have historically stalled, private ones included.",
    relatedPrivateIds: ["etched", "d-matrix"],
    sourceIds: ["amd-ir", "sec-edgar"],
    lastReviewed: REVIEWED,
  },
  {
    id: "mu",
    name: "Micron Technology",
    ticker: "MU",
    exchange: "NASDAQ",
    website: "https://investors.micron.com/",
    sector: "Semiconductors & Advanced Computing",
    signalUses: ["Supply-chain signal", "Capital expenditure trend"],
    whatItSignals:
      "High bandwidth memory commentary indicates whether memory remains an allocated constraint, which determines how many accelerators of any kind can actually be built.",
    howToRead:
      "Memory capital expenditure across the industry is a better forward indicator than any single company's demand commentary, because supply discipline rather than demand has historically decided memory returns.",
    relatedPrivateIds: ["d-matrix", "etched"],
    sourceIds: ["mu-ir", "sec-edgar"],
    lastReviewed: REVIEWED,
  },
  {
    id: "vrt",
    name: "Vertiv",
    ticker: "VRT",
    exchange: "NYSE",
    website: "https://investors.vertiv.com/",
    sector: "Energy Systems",
    signalUses: [
      "Capital expenditure trend",
      "Customer demand indicator",
      "Market maturity",
    ],
    whatItSignals:
      "Orders and book-to-bill for data centre power and thermal equipment lead facility readiness, which now gates AI deployment more often than chip supply does.",
    howToRead:
      "Book-to-bill is a leading indicator for the whole downstream chain. A sustained reading below one would be an early warning for every company in this universe that depends on data centre construction.",
    relatedPrivateIds: ["base-power", "antora-energy", "radiant-industries"],
    sourceIds: ["vrt-edgar", "vrt-ir", "sec-edgar"],
    lastReviewed: REVIEWED,
  },
  {
    id: "mrvl",
    name: "Marvell Technology",
    ticker: "MRVL",
    exchange: "NASDAQ",
    website: "https://www.marvell.com/company/newsroom/marvell-completes-acquisition-of-celestial-ai.html",
    sector: "Semiconductors & Advanced Computing",
    signalUses: ["Competitive context", "Valuation context", "Market maturity"],
    whatItSignals:
      "Its completed acquisition of a private optical interconnect company in February 2026 is a direct read on how public acquirers value this layer, and it removed one of the two most comparable private companies from the market.",
    howToRead:
      "This is the clearest available exit comparable for the private interconnect companies in this universe. It also demonstrates why private status must be re-verified rather than assumed: that company was a credible sourcing candidate until the day the transaction closed.",
    relatedPrivateIds: ["ayar-labs", "lightmatter"],
    sourceIds: ["mrvl-celestial"],
    lastReviewed: REVIEWED,
  },
];

export const SIGNAL_BY_ID: Record<string, MarketSignalCompany> =
  Object.fromEntries(MARKET_SIGNALS.map((s) => [s.id, s]));

/** Market signals relevant to a given private company. */
export function signalsForCompany(companyId: string): MarketSignalCompany[] {
  return MARKET_SIGNALS.filter((s) => s.relatedPrivateIds.includes(companyId));
}

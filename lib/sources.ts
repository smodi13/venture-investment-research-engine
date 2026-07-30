/**
 * Source registry.
 *
 * Every external link in the platform is declared here once, so the
 * methodology page can render the complete list and every link can be checked
 * mechanically before deployment.
 *
 * Rules applied to this registry:
 *
 * - No search-results pages, and no link that merely mentions a company
 *   without supporting the specific claim attached to it.
 * - Commercial funding databases are used as a discovery aid only and are not
 *   registered here as evidence.
 * - Every company has at least one primary source (its own site, its own
 *   announcement, or a filing) and at least one independent corroborating
 *   publication.
 */

export type SourceType =
  | "Official company website"
  | "Company announcement"
  | "Technology publication"
  | "Business publication"
  | "Regulatory filing"
  | "Government or laboratory"
  | "Research institution";

export interface Source {
  id: string;
  /** Company or sector this source supports. */
  subject: string;
  title: string;
  publisher: string;
  type: SourceType;
  /** ISO date the source was published, where stated. */
  published: string;
  /** ISO date the link was checked during this build. */
  accessed: string;
  url: string;
  /** The specific fact this source is used to support. */
  supports: string;
  /** Primary sources carry the company's own or an official record. */
  primary: boolean;
}

const ACCESSED = "2026-07-30";

function s(
  id: string,
  subject: string,
  title: string,
  publisher: string,
  type: SourceType,
  published: string,
  url: string,
  supports: string,
  primary: boolean,
): Source {
  return {
    id,
    subject,
    title,
    publisher,
    type,
    published,
    accessed: ACCESSED,
    url,
    supports,
    primary,
  };
}

export const SOURCES: Source[] = [
  /* ------------------------------------------------------------- Etched */
  s(
    "etched-site",
    "Etched",
    "Etched company site",
    "Etched",
    "Official company website",
    "2026-07-30",
    "https://www.etched.com",
    "Product description, San Jose headquarters, founders, total capital raised, and customer contract figure as stated by the company.",
    true,
  ),
  s(
    "etched-eenews",
    "Etched",
    "Startup Etched raises US$120m to bet on transformer-only ASIC",
    "eeNews Europe",
    "Technology publication",
    "2024-06-26",
    "https://www.eenewseurope.com/en/startup-etched-raises-us120m-to-bet-on-transformer-only-asic/",
    "Independent corroboration of the Series A financing and the transformer-specific ASIC approach.",
    false,
  ),

  /* ----------------------------------------------------------- d-Matrix */
  s(
    "dmatrix-announcement",
    "d-Matrix",
    "d-Matrix Raises $275 Million to Power the Age of AI Inference",
    "d-Matrix",
    "Company announcement",
    "2025-11-12",
    "https://www.d-matrix.ai/announcements/d-matrix-raises-275-million-to-power-the-age-of-ai-inference/",
    "Series C financing amount, investor list, and total capital raised, as announced by the company.",
    true,
  ),
  s(
    "dmatrix-site",
    "d-Matrix",
    "d-Matrix company site",
    "d-Matrix",
    "Official company website",
    "2026-07-30",
    "https://www.d-matrix.ai",
    "Corsair, JetStream, and SquadRack product descriptions and the memory-centric compute architecture.",
    true,
  ),
  s(
    "dmatrix-prnewswire",
    "d-Matrix",
    "d-Matrix Raises $275 Million to Power the Age of AI Inference",
    "PR Newswire",
    "Business publication",
    "2025-11-12",
    "https://www.prnewswire.com/news-releases/d-matrix-raises-275-million-to-power-the-age-of-ai-inference-302612502.html",
    "Independent distribution of the Series C announcement, including founder names and office locations.",
    false,
  ),

  /* --------------------------------------------------------- Ayar Labs */
  s(
    "ayar-site",
    "Ayar Labs",
    "Ayar Labs company site",
    "Ayar Labs",
    "Official company website",
    "2026-07-30",
    "https://ayarlabs.com",
    "TeraPHY optical engine and SuperNova light source product descriptions, San Jose headquarters, Series E financing, and strategic investor list.",
    true,
  ),

  s(
    "ayar-seriese",
    "Ayar Labs",
    "Ayar Labs Closes $500M Series E, Accelerates Volume Production of Co-Packaged Optics",
    "Ayar Labs",
    "Company announcement",
    "2026-03-03",
    "https://ayarlabs.com/news/ayar-labs-closes-500m-series-e-accelerates-volume-production-of-co-packaged-optics/",
    "Series E amount, lead investor, close date, total capital raised, and the strategic participants.",
    true,
  ),
  s(
    "ayar-dcd",
    "Ayar Labs",
    "Optical interconnect startup Ayar Labs closes $500m funding round backed by Nvidia and AMD",
    "Data Center Dynamics",
    "Technology publication",
    "2026-03-04",
    "https://www.datacenterdynamics.com/en/news/optical-interconnect-startup-ayar-labs-closes-500m-funding-round-backed-by-nvidia-and-amd/",
    "Independent corroboration of the Series E, its strategic investors, and the co-packaged optics product.",
    false,
  ),

  /* -------------------------------------------------------- Lightmatter */
  s(
    "lightmatter-site",
    "Lightmatter",
    "Lightmatter company site",
    "Lightmatter",
    "Official company website",
    "2026-07-30",
    "https://lightmatter.co",
    "Passage interconnect and Guide light engine product descriptions and the silicon photonics approach.",
    true,
  ),
  s(
    "lightmatter-dcd",
    "Lightmatter",
    "Photonic computing company Lightmatter valued at $4.4bn in $400m funding round",
    "Data Center Dynamics",
    "Technology publication",
    "2024-10-16",
    "https://www.datacenterdynamics.com/en/news/photonic-computing-company-lightmatter-achieves-44bn-valuation-from-400m-series-d-funding-round/",
    "Series D financing amount and valuation, independently reported.",
    false,
  ),

  /* --------------------------------------------------------- QuEra ---- */
  s(
    "quera-site",
    "QuEra Computing",
    "QuEra Computing company site",
    "QuEra Computing",
    "Official company website",
    "2026-07-30",
    "https://www.quera.com",
    "Neutral-atom architecture, Boston headquarters, 2021 founding, financing round, DARPA Quantum Benchmarking Initiative selection, and published error-correction milestones.",
    true,
  ),

  s(
    "quera-financing",
    "QuEra Computing",
    "QuEra Computing Completes $230M Financing to Accelerate Development of Large-Scale Fault-Tolerant Quantum Computers",
    "QuEra Computing",
    "Company announcement",
    "2025-02-11",
    "https://www.quera.com/press-releases/quera-computing-completes-230m-financing-to-accelerate-development-of-large-scale-fault-tolerant-quantum-computers",
    "Financing amount, investor list, and the portion contingent on achieving technical milestones.",
    true,
  ),
  s(
    "quera-tqi",
    "QuEra Computing",
    "QuEra Computing Completes $230 Million Financing",
    "The Quantum Insider",
    "Technology publication",
    "2025-02-11",
    "https://thequantuminsider.com/2025/02/11/quera-computing-completes-230-million-financing-to-accelerate-development-of-large-scale-fault-tolerant-quantum-computers/",
    "Independent corroboration of the financing, its investors, and the milestone-contingent structure.",
    false,
  ),

  /* --------------------------------------------------- Atom Computing */
  s(
    "atom-site",
    "Atom Computing",
    "Atom Computing company site",
    "Atom Computing",
    "Official company website",
    "2026-07-30",
    "https://atom-computing.com",
    "Neutral-atom architecture, Berkeley headquarters, and company milestones.",
    true,
  ),
  s(
    "atom-prnewswire",
    "Atom Computing",
    "Atom Computing Raises More Than $300 Million to Accelerate Deployment of Fault-Tolerant, Neutral-Atom Quantum Computers",
    "PR Newswire",
    "Company announcement",
    "2026-06-17",
    "https://www.prnewswire.com/news-releases/atom-computing-raises-more-than-300-million-to-accelerate-deployment-of-fault-tolerant-neutral-atom-quantum-computers-302800832.html",
    "Series C financing, the Department of Commerce letter of intent, and the toric-code error-correction demonstration.",
    true,
  ),
  s(
    "atom-hpcwire",
    "Atom Computing",
    "Atom Computing Raises $100M Series C to Accelerate Deployment of Fault-Tolerant, Neutral-Atom Quantum Computers",
    "HPCwire",
    "Technology publication",
    "2026-06-17",
    "https://www.hpcwire.com/off-the-wire/atom-computing-raises-more-than-300m-to-accelerate-deployment-of-fault-tolerant-neutral-atom-quantum-computers/",
    "Independent corroboration of the Series C investors and the fault-tolerance roadmap.",
    false,
  ),

  /* ----------------------------------------------------- Path Robotics */
  s(
    "path-site",
    "Path Robotics",
    "Path Robotics about page",
    "Path Robotics",
    "Official company website",
    "2026-07-30",
    "https://www.path-robotics.com/about",
    "Columbus headquarters, 2018 founding by Andy and Alex Lonsberry, and the autonomous welding product line.",
    true,
  ),
  s(
    "path-robotreport",
    "Path Robotics",
    "Path Robotics raises $100M to automate welding",
    "The Robot Report",
    "Technology publication",
    "2025-03-04",
    "https://www.therobotreport.com/path-robotics-raises-100m-to-automate-welding/",
    "Series D financing amount, lead investors, and the AW-3 and AF-1 robotic welding cells.",
    false,
  ),

  /* -------------------------------------------- Collaborative Robotics */
  s(
    "cobot-site",
    "Collaborative Robotics",
    "Collaborative Robotics news",
    "Collaborative Robotics",
    "Official company website",
    "2026-07-30",
    "https://www.co.bot/news",
    "Product positioning and company announcements.",
    true,
  ),
  s(
    "cobot-prnewswire",
    "Collaborative Robotics",
    "Collaborative Robotics Raises $100 Million in Series B Funding",
    "PR Newswire",
    "Company announcement",
    "2024-04-16",
    "https://www.prnewswire.com/news-releases/collaborative-robotics-raises-100-million-in-series-b-funding-302112670.html",
    "Series B financing amount, investor list, Santa Clara headquarters, and total capital raised.",
    true,
  ),

  /* ------------------------------------------------------------- Oxide */
  s(
    "oxide-site",
    "Oxide Computer",
    "Oxide Computer company site",
    "Oxide Computer Company",
    "Official company website",
    "2026-07-30",
    "https://oxide.computer",
    "Product description of the Oxide Cloud Computer and named customers including Lawrence Livermore National Laboratory and Idaho National Laboratory.",
    true,
  ),
  s(
    "oxide-prnewswire",
    "Oxide Computer",
    "Oxide Raises $100M Series B to Scale Cloud Infrastructure for On-Premises Computing",
    "PR Newswire",
    "Company announcement",
    "2025-07-30",
    "https://www.prnewswire.com/news-releases/oxide-raises-100m-series-b-to-scale-cloud-infrastructure-for-on-premises-computing-302516798.html",
    "Series B financing amount, lead investor, Emeryville headquarters, and founder names.",
    true,
  ),

  /* -------------------------------------------------------- Chainguard */
  s(
    "chainguard-announcement",
    "Chainguard",
    "Announcing Chainguard's Series D: Building the Safe Source for All Open Source",
    "Chainguard",
    "Company announcement",
    "2025-04-23",
    "https://www.chainguard.dev/unchained/announcing-chainguards-series-d-building-the-safe-source-for-all-open-source",
    "Series D financing, lead investors, and the company's own description of its hardened container image catalogue.",
    true,
  ),
  s(
    "chainguard-geekwire",
    "Chainguard",
    "Cybersecurity startup Chainguard lands $356M at $3.5B valuation",
    "GeekWire",
    "Business publication",
    "2025-04-23",
    "https://www.geekwire.com/2025/cybersecurity-startup-chainguard-lands-356m-now-valued-at-3-5b/",
    "Independent corroboration of the Series D amount, valuation, and Kirkland headquarters.",
    false,
  ),

  /* ---------------------------------------------------------- Sublime */
  s(
    "sublime-site",
    "Sublime Systems",
    "Sublime Systems company site",
    "Sublime Systems",
    "Official company website",
    "2026-07-30",
    "https://sublime-systems.com",
    "Electrochemical cement process, Somerville headquarters, scale-up from grams to tonnes, and strategic backers.",
    true,
  ),
  s(
    "sublime-announcement",
    "Sublime Systems",
    "Sublime Systems Secures Combined $75M in Investments from CRH and Holcim",
    "Sublime Systems",
    "Company announcement",
    "2024-09-24",
    "https://sublime-systems.com/sublime-systems-secures-combined-75m-in-investments-from-global-building-materials-majors-crh-and-holcim-to-accelerate-scale-up-of-true-zero-cement-manufacturing-technology/",
    "The $75 million strategic investment from CRH and Holcim and the associated offtake framing.",
    true,
  ),
  s(
    "sublime-holcim",
    "Sublime Systems",
    "Holcim invests in Sublime Systems to scale up innovative low-carbon technology",
    "Holcim",
    "Company announcement",
    "2024-09-24",
    "https://www.holcim.com/media/company-news/investment-sublime-systems-low-carbon-technology",
    "Independent confirmation of the strategic investment from the investing party's own disclosure.",
    false,
  ),

  /* -------------------------------------------------------- Base Power */
  s(
    "base-site",
    "Base Power",
    "Base Power company site",
    "Base Power Company",
    "Official company website",
    "2026-07-30",
    "https://www.basepowercompany.com",
    "Austin headquarters, Texas and Illinois service areas, Texas Public Utility Commission licence number, and the battery plus retail electricity business model.",
    true,
  ),
  s(
    "base-esgtoday",
    "Base Power",
    "Home Energy Storage Startup Base Power Raises $1 Billion",
    "ESG Today",
    "Business publication",
    "2026-01-15",
    "https://www.esgtoday.com/home-energy-storage-startup-base-power-raises-1-billion/",
    "Series C financing amount and investor participation.",
    false,
  ),

  /* ------------------------------------------------------------ Antora */
  s(
    "antora-site",
    "Antora Energy",
    "Antora Energy company site",
    "Antora Energy",
    "Official company website",
    "2026-07-30",
    "https://www.antora.com",
    "Thermal battery technology, San Jose headquarters, manufacturing facility, and project announcements.",
    true,
  ),
  s(
    "antora-arpae",
    "Antora Energy",
    "ARPA-E Investor Update Vol. 22: Antora Energy's Thermal Batteries",
    "US Department of Energy, ARPA-E",
    "Government or laboratory",
    "2023-08-01",
    "https://arpa-e.energy.gov/news-and-events/news-and-insights/arpa-e-investor-update-vol-22-antora-energys-thermal-batteries",
    "Government confirmation of the thermophotovoltaic and thermal storage technology and its federal research support.",
    true,
  ),

  /* ----------------------------------------------------------- Radiant */
  s(
    "radiant-seriesc",
    "Radiant Industries",
    "Radiant closes $165 Million Series C",
    "Radiant Nuclear",
    "Company announcement",
    "2025-05-28",
    "https://www.radiantnuclear.com/blog/series-c-close/",
    "Series C close, total venture funding to date, and the investor list.",
    true,
  ),
  s(
    "radiant-seriesd",
    "Radiant Industries",
    "Radiant raises over $300 million in new funding to mass-produce portable nuclear reactors",
    "Radiant Nuclear",
    "Company announcement",
    "2025-12-17",
    "https://www.radiantnuclear.com/blog/series-d-announcement/",
    "The subsequent financing round and the plan to mass-produce the Kaleidos microreactor.",
    true,
  ),
  s(
    "radiant-wna",
    "Radiant Industries",
    "Development and funding milestones for microreactor project",
    "World Nuclear News",
    "Technology publication",
    "2025-12-18",
    "https://www.world-nuclear-news.org/articles/development-and-funding-milestones-for-microreactor-project",
    "Independent corroboration of the financing and the planned fuelled test at the Idaho National Laboratory DOME facility.",
    false,
  ),

  /* ---------------------------------------------------------- K2 Space */
  s(
    "k2-prnewswire",
    "K2 Space",
    "K2 Space Raises $250M at $3B Valuation to Roll Out a New Class of High-Capability Satellites",
    "PR Newswire",
    "Company announcement",
    "2025-12-12",
    "https://www.prnewswire.com/news-releases/k2-space-raises-250m-at-3b-valuation-to-roll-out-a-new-class-of-high-capability-satellites-302638936.html",
    "Series C financing, lead investor, Torrance headquarters, contracted backlog, and the GRAVITAS launch plan.",
    true,
  ),
  s(
    "k2-payload",
    "K2 Space",
    "K2 Space Raises $250M Series C",
    "Payload",
    "Technology publication",
    "2025-12-12",
    "https://payloadspace.com/k2-space-raises-250m-series-c/",
    "Independent corroboration of the Series C and the Mega Class satellite programme.",
    false,
  ),

  /* -------------------------------------------------------- Stoke Space */
  s(
    "stoke-announcement",
    "Stoke Space",
    "Stoke Raises $510 Million to Scale Manufacturing of Fully Reusable Nova Launch Vehicle",
    "Stoke Space",
    "Company announcement",
    "2025-10-08",
    "https://www.stokespace.com/stoke-space-technologies-raises-510-million-to-scale-manufacturing-of-fully-reusable-nova-launch-vehicle/",
    "Series D financing, lead investor, total capital raised, and the Launch Complex 14 refurbishment.",
    true,
  ),
  s(
    "stoke-extension",
    "Stoke Space",
    "Stoke Space Technologies Extends Previously Announced Series D Financing to $860 Million",
    "Stoke Space",
    "Company announcement",
    "2026-02-10",
    "https://www.stokespace.com/stoke-space-technologies-extends-previously-announced-series-d-financing-to-860-million/",
    "The extension of the Series D round to its final size.",
    true,
  ),
  s(
    "stoke-geekwire",
    "Stoke Space",
    "Stoke Space raises a whopping $510M to accelerate work on its fully reusable Nova launch system",
    "GeekWire",
    "Business publication",
    "2025-10-08",
    "https://www.geekwire.com/2025/stoke-space-510m-nova-rocket/",
    "Independent corroboration of the financing and the Kent, Washington base of operations.",
    false,
  ),

  /* ------------------------------------------------------------ Cradle */
  s(
    "cradle-seriesb",
    "Cradle Bio",
    "Cradle raises $73M Series B to Put AI-Powered Protein Engineering in Every Lab",
    "Cradle",
    "Company announcement",
    "2024-11-26",
    "https://www.cradle.bio/blog/series-b",
    "Series B financing, lead investor, total capital raised, and the company's description of its protein design platform.",
    true,
  ),
  s(
    "cradle-siliconangle",
    "Cradle Bio",
    "AI-driven protein discovery platform Cradle raises $73M",
    "SiliconANGLE",
    "Technology publication",
    "2024-11-26",
    "https://siliconangle.com/2024/11/26/ai-driven-protein-discovery-platform-cradle-raises-73m/",
    "Independent corroboration of the Series B and the Amsterdam and Zurich operations.",
    false,
  ),

  /* ------------------------------------------------------ OpenEvidence */
  s(
    "openevidence-site",
    "OpenEvidence",
    "OpenEvidence announcements",
    "OpenEvidence",
    "Official company website",
    "2026-07-30",
    "https://www.openevidence.com/announcements/openevidence-the-fastest-growing-application-for-physicians-in-history-announces-dollar210-million-round-at-dollar35-billion-valuation",
    "The company's own financing announcement and its description of physician adoption.",
    true,
  ),
  s(
    "openevidence-cnbc",
    "OpenEvidence",
    "OpenEvidence, the 'ChatGPT for doctors,' doubles valuation to $12 billion",
    "CNBC",
    "Business publication",
    "2026-01-21",
    "https://www.cnbc.com/2026/01/21/openevidence-chatgpt-for-doctors-doubles-valuation-to-12-billion.html",
    "Series D financing, valuation, investor list, and the relocation of headquarters to Miami.",
    false,
  ),

  /* ------------------------------------------- Market signal companies */
  s(
    "nvda-ir",
    "NVIDIA",
    "NVIDIA Investor Relations",
    "NVIDIA",
    "Official company website",
    "2026-07-30",
    "https://investor.nvidia.com/",
    "Data centre segment reporting and management commentary on accelerated computing demand.",
    true,
  ),
  s(
    "avgo-site",
    "Broadcom",
    "Broadcom investor relations",
    "Broadcom",
    "Official company website",
    "2026-07-30",
    "https://www.broadcom.com/",
    "Custom accelerator and networking segment disclosure reached through the investor relations section.",
    true,
  ),
  s(
    "mu-ir",
    "Micron Technology",
    "Micron Investor Relations",
    "Micron Technology",
    "Official company website",
    "2026-07-30",
    "https://investors.micron.com/",
    "High bandwidth memory commentary and capital expenditure guidance.",
    true,
  ),
  s(
    "amd-ir",
    "Advanced Micro Devices",
    "AMD Investor Relations",
    "Advanced Micro Devices",
    "Official company website",
    "2026-07-30",
    "https://ir.amd.com/",
    "Data centre segment disclosure and accelerator roadmap statements.",
    true,
  ),
  s(
    "vrt-ir",
    "Vertiv",
    "Vertiv Investor Relations",
    "Vertiv",
    "Official company website",
    "2026-07-30",
    "https://investors.vertiv.com/",
    "Orders, backlog, and book-to-bill disclosure for data centre power and thermal management.",
    true,
  ),
  s(
    "mrvl-celestial",
    "Marvell Technology",
    "Marvell Completes Acquisition of Celestial AI",
    "Marvell Technology",
    "Company announcement",
    "2026-02-02",
    "https://www.marvell.com/company/newsroom/marvell-completes-acquisition-of-celestial-ai.html",
    "Confirmation that Celestial AI ceased to be an independent private company, which is why it was excluded from the sourcing universe.",
    true,
  ),
  s(
    "sec-edgar",
    "US-listed companies",
    "SEC EDGAR full-text search",
    "US Securities and Exchange Commission",
    "Regulatory filing",
    "2026-07-30",
    "https://www.sec.gov/edgar/search/",
    "The filing system behind every public-company reference in the market signals section.",
    true,
  ),
];

export const SOURCE_BY_ID: Record<string, Source> = Object.fromEntries(
  SOURCES.map((x) => [x.id, x]),
);

export function getSource(id: string | undefined): Source | undefined {
  return id ? SOURCE_BY_ID[id] : undefined;
}

export function sourcesForSubject(subject: string): Source[] {
  return SOURCES.filter((x) => x.subject === subject);
}

/** Sources grouped by subject, for the registry table. */
export function sourcesBySubject(): { subject: string; sources: Source[] }[] {
  const map = new Map<string, Source[]>();
  for (const source of SOURCES) {
    const list = map.get(source.subject) ?? [];
    list.push(source);
    map.set(source.subject, list);
  }
  return [...map.entries()]
    .map(([subject, sources]) => ({ subject, sources }))
    .sort((a, b) => a.subject.localeCompare(b.subject));
}

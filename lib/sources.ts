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
  | "Research institution"
  | "Public code repository";

/**
 * How the publisher obtained what it published.
 *
 * The distinction that matters is between a publication doing its own
 * reporting and a publication reprinting a company announcement. Both look
 * like third-party coverage in a search result. Only the first is corroboration.
 */
export type SourceReporting =
  | "Company statement"
  | "Wire reproduction"
  | "Independent reporting"
  | "Investor statement"
  | "Government or official record"
  | "Peer-reviewed research"
  | "Public technical record";

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
  /** Who did the reporting, which decides what a claim citing it can be called. */
  reporting: SourceReporting;
  /**
   * False when the publisher blocks automated requests.
   *
   * These links open normally in a browser, so they stay in the registry, but
   * a reviewer running a link checker will see them fail. Every record that
   * cites one must also cite a source that opens without a browser, which the
   * integrity suite enforces.
   */
  automatedAccess: boolean;
}

/**
 * The default reporting mode for a source type. Overridden per source where a
 * publication is reprinting an announcement rather than reporting on it.
 */
function defaultReporting(type: SourceType): SourceReporting {
  switch (type) {
    case "Official company website":
    case "Company announcement":
      return "Company statement";
    case "Government or laboratory":
    case "Regulatory filing":
      return "Government or official record";
    case "Research institution":
      return "Peer-reviewed research";
    case "Public code repository":
      return "Public technical record";
    default:
      return "Independent reporting";
  }
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
  reporting?: SourceReporting,
  automatedAccess = true,
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
    reporting: reporting ?? defaultReporting(type),
    automatedAccess,
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
    "Wire reproduction",
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
    "Independent corroboration of the Series E, its strategic investors, and the co-packaged optics product. This publisher blocks automated requests; it opens normally in a browser, and the same facts are also carried by an accessible source.",
    false,
    "Independent reporting",
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
    "Series D financing amount and valuation, independently reported. This publisher blocks automated requests; it opens normally in a browser, and the same facts are also carried by an accessible source.",
    false,
    "Independent reporting",
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
    "Wire reproduction",
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
    "Independent corroboration of the Series D amount, valuation, and Kirkland headquarters. This publisher blocks automated requests; it opens normally in a browser, and the same facts are also carried by an accessible source.",
    false,
    "Independent reporting",
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
    "Investor statement",
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
    "Series C close, total venture funding to date, and the investor list. This publisher blocks automated requests; it opens normally in a browser, and the same facts are also carried by an accessible source.",
    true,
    "Company statement",
    false,
  ),
  s(
    "radiant-seriesd",
    "Radiant Industries",
    "Radiant raises over $300 million in new funding to mass-produce portable nuclear reactors",
    "Radiant Nuclear",
    "Company announcement",
    "2025-12-17",
    "https://www.radiantnuclear.com/blog/series-d-announcement/",
    "The subsequent financing round and the plan to mass-produce the Kaleidos microreactor. This publisher blocks automated requests; it opens normally in a browser, and the same facts are also carried by an accessible source.",
    true,
    "Company statement",
    false,
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
    "Independent corroboration of the financing and the Kent, Washington base of operations. This publisher blocks automated requests; it opens normally in a browser, and the same facts are also carried by an accessible source.",
    false,
    "Independent reporting",
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
    "Data centre segment reporting and management commentary on accelerated computing demand. This site blocks automated requests; the audited filings behind it are registered separately and open freely.",
    true,
    "Company statement",
    false,
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
    "Orders, backlog, and book-to-bill disclosure for data centre power and thermal management. This site blocks automated requests; the audited filings behind it are registered separately and open freely.",
    true,
    "Company statement",
    false,
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

  /* ------------------------------------------------------------- Extropic */
  s(
    "extropic-announcement",
    "Extropic",
    "Extropic Signs $75 Million Letter of Intent with U.S. Department of Commerce to Scale and Onshore Thermodynamic Computing",
    "Extropic",
    "Company announcement",
    "2026-07-30",
    "https://extropic.ai/writing/thermodynamic-computing-chips-in-america",
    "The letter of intent, its non-binding status, the Z1 cluster milestone, and the description of thermodynamic sampling units.",
    true,
  ),
  s(
    "extropic-nist",
    "Extropic",
    "Department of Commerce Announces Letters of Intent With 7 Companies for $874 Million to Accelerate Semiconductor R&D for the Compute Supply Chain",
    "National Institute of Standards and Technology",
    "Government or laboratory",
    "2026-07-29",
    "https://www.nist.gov/news-events/news/2026/07/department-commerce-announces-letters-intent-7-companies-874-million",
    "Official confirmation that the letter of intent exists and forms part of a wider CHIPS research and development programme.",
    true,
  ),
  s(
    "extropic-siliconangle",
    "Extropic",
    "Extropic raises $14.1M to build physics-based computing hardware for generative AI",
    "SiliconANGLE",
    "Technology publication",
    "2023-12-04",
    "https://siliconangle.com/2023/12/04/extropic-raises-14-1m-build-physics-based-computing-hardware-generative-ai/",
    "The 14.1 million dollar seed round led by Kindred Ventures, and the founding of the company in 2022.",
    false,
  ),

  /* ----------------------------------------------------------- Emerald AI */
  s(
    "emerald-nvidia",
    "Emerald AI",
    "Sharing Our Seed Extension: Emerald AI's Total Funding Reaches $42.5 Million to Scale Power-Flexible AI Infrastructure",
    "Emerald AI",
    "Company announcement",
    "2025-10-30",
    "https://www.emeraldai.co/blog/sharing-our-seed-extension-emerald-ais-total-funding-reaches-42-5-million-to-scale-power-flexible-ai-infrastructure",
    "The 18 million dollar seed extension, total funding of 42.5 million dollars, the investor list, and the Conductor product.",
    true,
  ),
  s(
    "emerald-fortune",
    "Emerald AI",
    "Emerald AI and Nvidia aim to offer a fast pass for data center grid connects, partnering with power producers and raising new funds",
    "Fortune",
    "Business publication",
    "2026-03-31",
    "https://fortune.com/2026/03/31/emerald-ai-nvidia-fast-pass-data-center-grid-connects/",
    "Independent reporting on the grid flexibility approach, the semiconductor partnership, and continued financing.",
    false,
  ),

  /* ---------------------------------------------------------------- Rerun */
  s(
    "rerun-globenewswire",
    "Rerun",
    "Rerun Raises $17M to Build the Data Infrastructure Powering the Physical AI Revolution",
    "Rerun, distributed by GlobeNewswire",
    "Company announcement",
    "2025-03-20",
    "https://www.globenewswire.com/news-release/2025/03/20/3046617/0/en/Rerun-Raises-17M-to-Build-the-Data-Infrastructure-Powering-the-Physical-AI-Revolution.html",
    "The 17 million dollar seed round led by Point Nine, total funding of 20.2 million dollars, and the investor list.",
    true,
  ),
  s(
    "rerun-techcrunch",
    "Rerun",
    "Rerun's open-source AI platform for robots, drones and cars revs up with $17M seed",
    "TechCrunch",
    "Technology publication",
    "2025-03-20",
    "https://techcrunch.com/2025/03/20/reruns-open-source-ai-platform-for-robots-drones-and-cars-revs-up-with-17m-seed/",
    "Original reporting on the 17 million dollar seed round, the lead investor, the Stockholm base, the 2022 founding, total funding of 20.2 million dollars, and open-source adoption by major technology companies. Replaces a previously registered publication whose site stopped responding.",
    false,
  ),

  /* ----------------------------------------------------------- turbopuffer */
  s(
    "turbopuffer-site",
    "turbopuffer",
    "turbopuffer: fast search on object storage",
    "turbopuffer",
    "Official company website",
    "2024-06-25",
    "https://turbopuffer.com/blog/turbopuffer",
    "The object storage architecture, the tiered cache design, and the published cost comparison against memory-resident alternatives.",
    true,
  ),
  s(
    "turbopuffer-about",
    "turbopuffer",
    "turbopuffer: about",
    "turbopuffer",
    "Official company website",
    "2026-07-30",
    "https://turbopuffer.com/about",
    "The Canadian remote-first structure, the Ottawa base, and the two co-founders and their prior infrastructure engineering roles.",
    true,
  ),
  s(
    "turbopuffer-sed",
    "turbopuffer",
    "turbopuffer with Simon Hørup Eskildsen",
    "Software Engineering Daily",
    "Technology publication",
    "2025-09-30",
    "https://softwareengineeringdaily.com/2025/09/30/turbopuffer-with-simon-horup-eskildsen/",
    "The founder's own account of the architecture, the trade-offs it accepts, and the decision not to raise conventional growth financing.",
    false,
    "Company statement",
  ),

  /* --------------------------------------------------------------- Socket */
  s(
    "socket-seriesb",
    "Socket",
    "Socket secures $40M to combat next-generation software supply chain security attacks",
    "Socket, distributed by GlobeNewswire",
    "Company announcement",
    "2024-10-22",
    "https://www.globenewswire.com/news-release/2024/10/22/2967115/0/en/Socket-secures-40M-to-combat-next-generation-software-supply-chain-security-attacks-led-by-industry-titans-Abstract-Ventures-Elad-Gil-and-a16z.html",
    "The 40 million dollar Series B, its investors, total funding of 65 million dollars, and the stated organisation and repository coverage.",
    true,
  ),
  s(
    "socket-forbes",
    "Socket",
    "How Socket Plans To Save The World From Open-Source Attacks",
    "Forbes",
    "Business publication",
    "2024-10-22",
    "https://www.forbes.com/sites/davidprosser/2024/10/22/how-socket-plans-to-save-the-world-from-open-source-attacks/",
    "Independent reporting on the founder, the San Francisco base, and the behavioural approach to package analysis.",
    false,
  ),

  /* ------------------------------------------------------ Zed Industries */
  s(
    "zed-blog",
    "Zed Industries",
    "Sequoia Backs Zed's Vision for Collaborative Coding",
    "Zed Industries",
    "Company announcement",
    "2025-08-20",
    "https://zed.dev/blog/sequoia-backs-zed",
    "The 32 million dollar Series B, the lead investor, and the stated direction toward real-time collaboration between developers and agents.",
    true,
  ),
  s(
    "zed-startuphub",
    "Zed Industries",
    "Zed Raises $32M to Advance AI-Powered Collaborative Coding",
    "StartupHub.ai",
    "Technology publication",
    "2025-08-20",
    "https://www.startuphub.ai/ai-news/funding-round/2025/zed-raises-32m-to-advance-ai-powered-collaborative-coding",
    "Total funding above 42 million dollars, and the stated 1,100 contributors and more than 150,000 active developers. This publication reproduces the company announcement rather than reporting independently on it, which is why the Zed record is marked low confidence.",
    false,
    "Wire reproduction",
  ),

  /* -------------------------------------------------------------- Inngest */
  s(
    "inngest-seriesa",
    "Inngest",
    "Iteration is the new product moat",
    "Inngest",
    "Company announcement",
    "2025-09-01",
    "https://www.inngest.com/blog/announcing-inngest-series-a",
    "The 21 million dollar Series A led by Altimeter and the positioning toward durable execution for AI agent workflows.",
    true,
  ),
  s(
    "inngest-site",
    "Inngest",
    "Inngest company site",
    "Inngest",
    "Official company website",
    "2026-07-30",
    "https://www.inngest.com",
    "The named production customers, the durable execution programming model, and the product description.",
    true,
  ),
  s(
    "inngest-techcrunch",
    "Inngest",
    "Inngest raises $6.1M as it expands its workflow engine",
    "TechCrunch",
    "Technology publication",
    "2024-01-30",
    "https://techcrunch.com/2024/01/30/inngest-raises-6-1m-as-it-expands-its-workflow-engine/",
    "Independent reporting on the seed round led by Andreessen Horowitz and on the workflow engine.",
    false,
  ),

  /* ---------------------------------------------------------- Positron AI */
  s(
    "positron-press",
    "Positron AI",
    "Positron: Atlas",
    "Positron AI",
    "Official company website",
    "2026-07-30",
    "https://www.positron.ai/atlas",
    "The Atlas product description, the 93 percent memory bandwidth utilisation figure, the performance and power comparisons, and the named customers.",
    true,
  ),
  s(
    "positron-seriesb",
    "Positron AI",
    "Positron AI Raises $230 Million Series B at Over $1 Billion Valuation to Scale Energy-Efficient AI Inference",
    "Positron AI, distributed via HPCwire",
    "Company announcement",
    "2026-02-04",
    "https://www.hpcwire.com/off-the-wire/positron-ai-raises-230m-series-b-at-over-1b-valuation-to-scale-energy-efficient-ai-inference/",
    "The 230 million dollar Series B, the valuation above one billion dollars, the investor list, and the Asimov silicon tape-out and production schedule.",
    true,
  ),
  s(
    "positron-toms",
    "Positron AI",
    "Positron AI says its Atlas accelerator beats Nvidia H200 on inference in just 33% of the power",
    "Tom's Hardware",
    "Technology publication",
    "2025-08-14",
    "https://www.tomshardware.com/tech-industry/artificial-intelligence/positron-ai-says-its-atlas-accelerator-beats-nvidia-h200-on-inference-in-just-33-percent-of-the-power-delivers-280-tokens-per-second-per-user-with-llama-3-1-8b-in-2000w-envelope",
    "Independent technology reporting on the Atlas performance claims and on evaluation by a major internet infrastructure operator.",
    false,
  ),

  /* -------------------------------------------------------- Chef Robotics */
  s(
    "chef-prnewswire",
    "Chef Robotics",
    "Chef Robotics Announces $43M Series A Round Led by Avataar Ventures to Scale the Deployment of AI-Enabled Robotics",
    "Chef Robotics, distributed by PR Newswire",
    "Company announcement",
    "2025-03-31",
    "https://www.prnewswire.com/news-releases/chef-robotics-announces-43m-series-a-round-led-by-avataar-ventures-to-scale-the-deployment-of-ai-enabled-robotics-302416039.html",
    "The Series A structure of equity plus equipment financing, the investor list, total capital raised, and the cumulative servings figure.",
    true,
  ),
  s(
    "chef-robotreport",
    "Chef Robotics",
    "Chef Robotics brings in $43M to deploy more food assembly robots",
    "The Robot Report",
    "Technology publication",
    "2025-04-01",
    "https://www.therobotreport.com/chef-robotics-brings-in-43m-to-deploy-more-food-assembly-robots/",
    "Independent trade reporting on the funding structure, the robotics-as-a-service model, and the deployed food assembly application.",
    false,
  ),

  /* ------------------------------------------------ Portal Space Systems */
  s(
    "portal-seriesa",
    "Portal Space Systems",
    "Portal Space Systems Raises $50 Million Series A to Advance Rapidly Maneuverable Spacecraft Capabilities",
    "Portal Space Systems",
    "Company announcement",
    "2026-04-09",
    "https://www.portalsystems.space/news/press-release-portal-space-systems-raises-50-million-series-a-to-advance-rapidly-maneuverable-spacecraft-capabilities",
    "The 50 million dollar Series A, the co-leads and participating investors, and the Starburst and Supernova programmes.",
    true,
  ),
  s(
    "portal-spacenews",
    "Portal Space Systems",
    "Portal Space Systems raises $50 million to accelerate spacecraft development",
    "SpaceNews",
    "Technology publication",
    "2026-04-09",
    "https://spacenews.com/portal-space-systems-raises-50-million-to-accelerate-spacecraft-development/",
    "Independent reporting on the financing, the solar thermal propulsion approach, the production facility, and the 2027 Supernova schedule.",
    false,
  ),
  s(
    "portal-geekwire",
    "Portal Space Systems",
    "Portal Space Systems raises $50M as it gets set to launch its first orbital vehicle made for rapid maneuvers",
    "GeekWire",
    "Technology publication",
    "2026-04-09",
    "https://www.geekwire.com/2026/portal-space-systems-50m-starburst/",
    "Independent reporting on the Bothell production facility, the Starburst-1 launch manifest, and headcount. This publisher blocks automated requests; it opens normally in a browser, and the same facts are also carried by accessible sources.",
    false,
    "Independent reporting",
    false,
  ),

  /* ------------------------------------------------------------- Anterior */
  s(
    "anterior-raise",
    "Anterior",
    "Anterior closes $40 million to accelerate health plan AI adoption",
    "Anterior",
    "Company announcement",
    "2026-02-16",
    "https://www.anterior.com/insights/anterior-raises-40m-series",
    "The 40 million dollar round, total funding of 64 million dollars, the investor list, the named health plan customer, and the care management platform integration.",
    true,
  ),
  s(
    "anterior-fierce",
    "Anterior",
    "Payer AI company Anterior banks $40M funding round",
    "Fierce Healthcare",
    "Business publication",
    "2026-02-16",
    "https://www.fiercehealthcare.com/ai-and-machine-learning/payer-ai-company-anterior-banks-40m-funding-round",
    "Independent reporting on the financing, the investors, and the prior authorisation workflow the product addresses. This publisher blocks automated requests; it opens normally in a browser, and the same facts are also carried by an accessible source.",
    false,
    "Independent reporting",
    false,
  ),

  /* ---------------------------------------------------------------- Tennr */
  s(
    "tennr-seriesc",
    "Tennr",
    "Healthcare referrals are where patients get lost. Tennr raises $101M to bring the visibility our system desperately needs",
    "Tennr, distributed by PR Newswire",
    "Company announcement",
    "2025-06-18",
    "https://www.prnewswire.com/news-releases/healthcare-referrals-are-where-patients-get-lost-tennr-raises-101m-to-bring-the-visibility-our-system-desperately-needs-302485255.html",
    "The 101 million dollar Series C, the investor list, the stated revenue tripling since the Series B, and the hundreds of providers served.",
    true,
  ),
  s(
    "tennr-fortune",
    "Tennr",
    "Exclusive: Health tech startup Tennr raises $101 million Series C at $605 million valuation to fix the patient referral process",
    "Fortune",
    "Business publication",
    "2025-06-18",
    "https://fortune.com/2025/06/18/tennr-health-tech-ai-patient-referral-ivp-a16z-lightspeed-iconiq-series-c/",
    "Independent reporting on the 605 million dollar valuation, the investor list, the 2021 founding, the founders, and the stated revenue tripling since the Series B.",
    false,
  ),

  /* ------------------------------------------------------- Counsel Health */
  s(
    "counsel-seriesa",
    "Counsel Health",
    "Story Behind Counsel's $25M Series A Funding",
    "Counsel Health",
    "Company announcement",
    "2025-10-16",
    "https://www.counselhealth.com/blog/how-we-got-here-the-story-behind-our-series-a",
    "The 25 million dollar Series A, the lead investors, total funding of 36 million dollars, and the physician-supervised care model.",
    true,
  ),
  s(
    "counsel-a16z",
    "Counsel Health",
    "Investing in Counsel Health",
    "Andreessen Horowitz",
    "Company announcement",
    "2025-10-16",
    "https://a16z.com/announcement/investing-in-counsel-health/",
    "The lead investor's description of the chief executive's clinical and research background and of the physician coverage ratio the company is scaling.",
    true,
    "Investor statement",
  ),
  s(
    "counsel-hit",
    "Counsel Health",
    "Counsel Health Raises $25M to Launch Physician-Supervised AI Care Platform",
    "HIT Consultant",
    "Technology publication",
    "2025-10-16",
    "https://hitconsultant.net/2025/10/16/counsel-health-raises-25m-to-launch-physician-supervised-ai-care-platform/",
    "Independent reporting on the more than 100,000 members served, the 96 percent issue resolution rate, the two minute response time, and the 381 dollar annual savings figure.",
    false,
    "Wire reproduction",
  ),

  /* ------------------------------------------- Conceivable Life Sciences */
  s(
    "conceivable-seriesa",
    "Conceivable Life Sciences",
    "Conceivable Life Sciences Secures $50 Million Series A",
    "Conceivable Life Sciences, distributed by GlobeNewswire",
    "Company announcement",
    "2025-09-15",
    "https://www.globenewswire.com/news-release/2025/09/15/3150041/0/en/Conceivable-Life-Sciences-Secures-50-Million-Series-A.html",
    "The 50 million dollar Series A, the investor list, total funding of 70 million dollars including a December 2022 seed round, and the AURA platform description.",
    true,
  ),
  s(
    "conceivable-femtech",
    "Conceivable Life Sciences",
    "Conceivable Life Sciences Raises $50M Series A for US Launch of Automated IVF Lab",
    "Femtech Insider",
    "Technology publication",
    "2025-09-16",
    "https://femtechinsider.com/conceivable-life-sciences-raises-50m-series-a-for-us-launch-of-automated-ivf-lab/",
    "Independent reporting on the prototype study births, the 100 patient pilot trial, and the planned United States commercial availability.",
    false,
    "Wire reproduction",
  ),

  /* ----------------------------------------------------- Basecamp Research */
  s(
    "basecamp-release",
    "Basecamp Research",
    "Basecamp Research Initiates Genetic Medicine Collaboration and Completes $60 Million Series B Financing",
    "Basecamp Research, distributed by GlobeNewswire",
    "Company announcement",
    "2024-10-09",
    "https://www.globenewswire.com/news-release/2024/10/09/2960328/0/en/Basecamp-Research-Initiates-Genetic-Medicine-Collaboration-with-the-Liu-Laboratory-and-Completes-60-Million-Series-B-Financing.html",
    "The 60 million dollar Series B, the lead investor, and the genetic medicine research collaboration announced alongside it.",
    true,
  ),
  s(
    "basecamp-sifted",
    "Basecamp Research",
    "Basecamp Research raises $60m Series B led by Singular",
    "Sifted",
    "Technology publication",
    "2024-10-09",
    "https://sifted.eu/articles/basecamp-research-60m-series-b",
    "Independent reporting on the founders, the London base, the full investor list, the stated dataset scale relative to public databases, and the biodiversity partner network.",
    false,
  ),
  /* ------------------------------------------- Conceivable, clinical record */
  s(
    "conceivable-humrep",
    "Conceivable Life Sciences",
    "Automated oocyte retrieval, denudation, sperm preparation, and ICSI in the IVF laboratory: a proof-of-concept study and report of the first live births",
    "Human Reproduction, via PubMed Central",
    "Research institution",
    "2026-02-01",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC12957933/",
    "The proof-of-concept study: 11 patients treated between April and October 2024, 12 single warmed blastocyst transfers in the automated arm, 5 live births, 3 biochemical pregnancies, and 1 early loss. The paper also records that autonomy without human intervention was achieved only in sperm preparation and selected ICSI tasks, and that the study was sponsored by the company.",
    false,
  ),

  /* ------------------------------------------------- Zed, public code record */
  s(
    "zed-github",
    "Zed Industries",
    "zed-industries/zed public repository",
    "GitHub",
    "Public code repository",
    "2026-07-31",
    "https://github.com/zed-industries/zed",
    "Public repository metrics anyone can query directly through the GitHub API: stars, forks, named contributors, and pull request throughput. Used in place of the company's own active developer figure, which no independent source supports.",
    false,
  ),

  /* -------------------------------------------------------------- Perceptic */
  s(
    "perceptic-site",
    "Perceptic",
    "Perceptic company site",
    "Perceptic",
    "Official company website",
    "2026-07-30",
    "https://www.perceptic.com/",
    "The product description as an intelligence layer unifying asset scouting, scientific evaluation, and clinical data across the drug development lifecycle, and the founders' research backgrounds.",
    true,
  ),
  s(
    "perceptic-fortune",
    "Perceptic",
    "Exclusive: Ex-Palantir AI execs raise $12 million seed round for Perceptic, a startup automating drug discovery",
    "Fortune",
    "Business publication",
    "2026-05-26",
    "https://fortune.com/2026/05/26/exclusive-perceptic-a-startup-automating-drug-discovery-end-to-end-for-big-pharma-emerges-from-stealth-with-12-million-in-seed-funding/",
    "Original reporting on the 12 million dollar seed round, the lead investor, the three founders and their prior roles building Palantir's life sciences practice, the 2024 London founding, and deployment across pharmaceutical companies and contract research organisations.",
    false,
  ),
  s(
    "perceptic-airstreet",
    "Perceptic",
    "Introducing Perceptic: the AI operating system for drug development",
    "Air Street Capital",
    "Company announcement",
    "2026-05-26",
    "https://press.airstreet.com/p/introducing-perceptic",
    "The investor's account of the round, the named customer CSL, and the company-reported performance figures for asset evaluation, screening throughput, and clinical data extraction.",
    false,
    "Investor statement",
  ),
  /* ------------------------- Reviewer-accessible replacements and backups */
  s(
    "stoke-spacenews",
    "Stoke Space",
    "Stoke Space raises $510 million",
    "SpaceNews",
    "Technology publication",
    "2025-10-08",
    "https://spacenews.com/stoke-space-raises-510-million/",
    "Independent corroboration of the 510 million dollar Series D, the lead investor, the accompanying debt facility, total capital raised, the Kent, Washington base, and the Nova launch vehicle programme. Added because the equivalent GeekWire report blocks automated requests.",
    false,
  ),
  s(
    "portal-starburst",
    "Portal Space Systems",
    "Portal unveils Starburst, an ESPA-class rapid-maneuverability spacecraft, and announces the Starburst-1 mission on SpaceX in Q4 2026",
    "Portal Space Systems",
    "Company announcement",
    "2026-06-24",
    "https://www.portalsystems.space/news/portal-unveils-starburst-an-espa-class-rapid-maneuverability-spacecraft-and-announces-starburst-1-mission-on-spacex-in-q4-2026",
    "The Starburst spacecraft, and the Starburst-1 mission manifested for a SpaceX Transporter rideshare scheduled for the fourth quarter of 2026. This is an announced launch manifest, not a flown mission. Added so the manifest does not rest solely on a report that blocks automated requests.",
    true,
  ),
  s(
    "portal-payload",
    "Portal Space Systems",
    "Exclusive: Portal Unveils Starburst, Set for Flight Next Year",
    "Payload",
    "Technology publication",
    "2026-06-24",
    "https://payloadspace.com/exclusive-portal-unveils-starburst-set-for-flight-next-year/",
    "Independent space trade reporting on the Starburst spacecraft, the Bothell production facility, and the first flight schedule.",
    false,
  ),
  s(
    "nvda-edgar",
    "NVIDIA",
    "NVIDIA Corporation annual report filings",
    "US Securities and Exchange Commission, EDGAR",
    "Regulatory filing",
    "2026-07-30",
    "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001045810&type=10-K&dateb=&owner=include&count=40",
    "Audited segment reporting for the data centre business, filed rather than presented. Added because the investor relations site blocks automated requests, and a filing is the better record in any case.",
    true,
  ),
  s(
    "vrt-edgar",
    "Vertiv",
    "Vertiv Holdings Co annual report filings",
    "US Securities and Exchange Commission, EDGAR",
    "Regulatory filing",
    "2026-07-30",
    "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001674101&type=10-K&dateb=&owner=include&count=40",
    "Audited disclosure of orders, backlog, and book-to-bill for data centre power and thermal management. Added because the investor relations site blocks automated requests.",
    true,
  ),
  s(
    "ayar-siliconangle",
    "Ayar Labs",
    "Co-packaged optics startup Ayar Labs raises $500M round backed by Nvidia, AMD",
    "SiliconANGLE",
    "Technology publication",
    "2026-03-03",
    "https://siliconangle.com/2026/03/03/co-packaged-optics-startup-ayar-labs-raises-500m-round-backed-nvidia-amd/",
    "Independent corroboration of the 500 million dollar round, the strategic chip-maker investors, and the co-packaged optics product. Added because the equivalent Data Center Dynamics report blocks automated requests.",
    false,
  ),
  s(
    "lightmatter-eetimes",
    "Lightmatter",
    "Lightmatter Raises $400 Million Series D",
    "EE Times",
    "Technology publication",
    "2024-10-16",
    "https://www.eetimes.com/lightmatter-raises-400-million-series-d/",
    "Independent electronics trade corroboration of the 400 million dollar Series D, the valuation, the lead investor, and the Passage photonic interconnect product. Added because the equivalent Data Center Dynamics report blocks automated requests.",
    false,
  ),
  s(
    "lightmatter-release",
    "Lightmatter",
    "Lightmatter Raises $400M Series D; Quadruples Valuation to $4.4B",
    "Lightmatter",
    "Company announcement",
    "2024-10-16",
    "https://lightmatter.co/press-release/lightmatter-raises-400m-series-d-quadruples-valuation-to-4-4b-as-photonics-leader-for-next-gen-ai-data-centers/",
    "The company's own account of the Series D, total capital raised, and the intended deployment of Passage in partner data centres.",
    true,
  ),
  s(
    "chainguard-builtin",
    "Chainguard",
    "Software Security Company Chainguard Raises $356M at $3.5B Valuation",
    "Built In Seattle",
    "Technology publication",
    "2025-04-24",
    "https://www.builtinseattle.com/articles/chainguard-raises-356m-3b-valuation-20250424",
    "Independent corroboration of the 356 million dollar Series D, the 3.5 billion dollar valuation, the co-leads, and the Kirkland, Washington base. Added because the equivalent GeekWire report blocks automated requests.",
    false,
  ),
  s(
    "radiant-ans",
    "Radiant Industries",
    "Radiant secures funding, moves toward microreactor testing in INL's DOME",
    "American Nuclear Society, Nuclear Newswire",
    "Research institution",
    "2025-02-20",
    "https://www.ans.org/news/article-6581/radiant-secures-funding-moves-toward-microreactor-testing-in-inls-dome/",
    "Professional society reporting on the financing and on the scheduled Kaleidos test at the Idaho National Laboratory DOME facility. Added because the company's own announcement pages block automated requests.",
    false,
    "Independent reporting",
  ),
  s(
    "radiant-newswire",
    "Radiant Industries",
    "Radiant Secures $100 Million in Series C Funding, Plans Milestone Test at INL's DOME Facility",
    "Radiant Nuclear, distributed by Newswire",
    "Company announcement",
    "2025-02-19",
    "https://www.newswire.com/news/radiant-secures-100-million-in-series-c-funding-plans-milestone-test-22466583",
    "The company's own account of the Series C and the planned DOME test, in a distribution that opens without a browser.",
    true,
  ),
  s(
    "anterior-medcity",
    "Anterior",
    "Anterior Snags $40M to Speed Care Approvals with AI",
    "MedCity News",
    "Technology publication",
    "2026-02-17",
    "https://medcitynews.com/2026/02/anterior-ai-health-plan/",
    "Independent healthcare trade corroboration of the 40 million dollar round, the investors, and the prior authorisation workflow. Added because the equivalent Fierce Healthcare report blocks automated requests.",
    false,
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

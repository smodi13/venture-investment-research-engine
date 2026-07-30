/**
 * Source registry.
 *
 * Every external link in this platform is declared here once, so the
 * methodology page can render a complete list of what the research rests on
 * and every link can be checked mechanically before deployment.
 *
 * Two rules apply. Only primary sources are registered: company investor
 * relations material and the SEC EDGAR filing system, not secondary coverage
 * or funding databases. And no source is invented: demonstration companies
 * carry no external links at all, because a fictional company cannot have a
 * real filing behind it.
 */

export type SourceType =
  | "Investor relations"
  | "Regulatory filing system"
  | "Company website";

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  /** Company or sector this source supports. */
  subject: string;
  url: string;
  /** What the source is used to support in this build. */
  supports: string;
  /** ISO date the link was last checked. */
  accessDate: string;
}

const ACCESS_DATE = "2026-07-29";

/** SEC EDGAR full-text search, the canonical filing source for US issuers. */
export const EDGAR_SEARCH = "https://www.sec.gov/edgar/search/";

function edgar(subject: string, query: string): Source {
  return {
    id: `edgar-${query.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: `SEC EDGAR filings, ${subject}`,
    type: "Regulatory filing system",
    subject,
    url: `${EDGAR_SEARCH}#/q=%22${encodeURIComponent(query)}%22&forms=10-K%2C10-Q`,
    supports:
      "Annual and quarterly reports, the primary record for revenue, margin, cash position, and disclosed risk factors.",
    accessDate: ACCESS_DATE,
  };
}

function ir(
  id: string,
  subject: string,
  url: string,
  supports: string,
): Source {
  return {
    id,
    name: `${subject} investor relations`,
    type: "Investor relations",
    subject,
    url,
    supports,
    accessDate: ACCESS_DATE,
  };
}

export const SOURCES: Source[] = [
  ir(
    "nvda-ir",
    "NVIDIA",
    "https://investor.nvidia.com/",
    "Segment reporting, data centre revenue disclosure, and management commentary on accelerated computing demand.",
  ),
  edgar("NVIDIA", "NVIDIA"),
  ir(
    "amd-ir",
    "Advanced Micro Devices",
    "https://ir.amd.com/",
    "Data centre segment disclosure and accelerator product roadmap statements.",
  ),
  edgar("Advanced Micro Devices", "Advanced Micro Devices"),
  {
    id: "avgo-ir",
    name: "Broadcom investor relations",
    type: "Company website",
    subject: "Broadcom",
    url: "https://www.broadcom.com/",
    supports:
      "Semiconductor solutions segment disclosure covering custom accelerators and networking, reached through the investor relations section.",
    accessDate: ACCESS_DATE,
  },
  edgar("Broadcom", "Broadcom"),
  ir(
    "mu-ir",
    "Micron Technology",
    "https://investors.micron.com/",
    "Memory segment disclosure, including high bandwidth memory commentary and capital expenditure guidance.",
  ),
  edgar("Micron Technology", "Micron Technology"),
  ir(
    "arm-ir",
    "Arm Holdings",
    "https://www.arm.com/company/investors",
    "Royalty and licensing revenue disclosure and commentary on compute subsystem adoption.",
  ),
  edgar("Arm Holdings", "Arm Holdings"),
  ir(
    "alab-ir",
    "Astera Labs",
    "https://www.asteralabs.com/",
    "Connectivity product revenue disclosure and commentary on rack-scale deployment.",
  ),
  edgar("Astera Labs", "Astera Labs"),
  ir(
    "crdo-ir",
    "Credo Technology",
    "https://investors.credosemi.com/",
    "Product and customer concentration disclosure for high-speed connectivity.",
  ),
  edgar("Credo Technology", "Credo Technology"),
  ir(
    "vrt-ir",
    "Vertiv",
    "https://investors.vertiv.com/",
    "Orders, backlog, and book-to-bill disclosure for data centre power and thermal management.",
  ),
  edgar("Vertiv", "Vertiv"),
  ir(
    "ionq-ir",
    "IonQ",
    "https://investors.ionq.com/",
    "Bookings and technical roadmap disclosure for trapped-ion quantum systems.",
  ),
  edgar("IonQ", "IonQ"),
  ir(
    "sdgr-ir",
    "Schrodinger",
    "https://ir.schrodinger.com/",
    "Software and drug discovery segment disclosure, including collaboration economics.",
  ),
  edgar("Schrodinger", "Schrodinger"),
  ir(
    "tem-ir",
    "Tempus AI",
    "https://www.tempus.com/investors/",
    "Genomics and data segment revenue disclosure and reimbursement commentary.",
  ),
  edgar("Tempus AI", "Tempus AI"),
  ir(
    "be-ir",
    "Bloom Energy",
    "https://investor.bloomenergy.com/",
    "Product acceptance volumes and commentary on data centre power deployments.",
  ),
  edgar("Bloom Energy", "Bloom Energy"),
  {
    id: "sec-edgar",
    name: "SEC EDGAR full-text search",
    type: "Regulatory filing system",
    subject: "All US-listed companies in the universe",
    url: EDGAR_SEARCH,
    supports:
      "The filing system behind every public-company figure in this platform. Any number shown here should be reconciled against the most recent filing before use.",
    accessDate: ACCESS_DATE,
  },
];

export const SOURCE_BY_ID: Record<string, Source> = Object.fromEntries(
  SOURCES.map((s) => [s.id, s]),
);

export function getSource(id: string | undefined): Source | undefined {
  return id ? SOURCE_BY_ID[id] : undefined;
}

/** Sources grouped by the subject they support, for the registry table. */
export function sourcesBySubject(): { subject: string; sources: Source[] }[] {
  const map = new Map<string, Source[]>();
  for (const s of SOURCES) {
    const list = map.get(s.subject) ?? [];
    list.push(s);
    map.set(s.subject, list);
  }
  return [...map.entries()]
    .map(([subject, sources]) => ({ subject, sources }))
    .sort((a, b) => a.subject.localeCompare(b.subject));
}

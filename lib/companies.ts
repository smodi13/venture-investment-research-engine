import { PUBLIC_COMPANIES } from "./data/public-companies";
import { PRIVATE_COMPANIES } from "./data/private-companies";
import type { Company, Sector } from "./types";

/**
 * The research universe.
 *
 * Public companies are real, and carry qualitative profiles drawn from widely
 * published information with financial figures expressed as dated, labelled
 * ranges. Private companies are fictional demonstration records, because a
 * private company cannot be researched to the same standard from public
 * sources and inventing facts about a real one would be indefensible.
 *
 * That split is stated on every surface where a company appears, so a reader
 * always knows which kind of record they are looking at.
 */
export const COMPANIES: Company[] = [...PUBLIC_COMPANIES, ...PRIVATE_COMPANIES];

export const COMPANY_BY_ID: Record<string, Company> = Object.fromEntries(
  COMPANIES.map((c) => [c.id, c]),
);

export function getCompany(id: string): Company | undefined {
  return COMPANY_BY_ID[id];
}

/** Sectors actually present in the universe. */
export function activeSectors(): Sector[] {
  return [...new Set(COMPANIES.map((c) => c.sector))];
}

/** Subsectors present, used to populate the filter control. */
export function activeSubsectors(): string[] {
  return [...new Set(COMPANIES.map((c) => c.subsector))].sort();
}

export const UNIVERSE_STATS = {
  total: COMPANIES.length,
  publicCount: COMPANIES.filter((c) => c.marketType === "Public").length,
  privateCount: COMPANIES.filter((c) => c.marketType === "Private").length,
  sectorCount: new Set(COMPANIES.map((c) => c.sector)).size,
  demonstrationCount: COMPANIES.filter((c) => c.isDemonstration).length,
};

/**
 * Free-text search across the fields a researcher would actually search on.
 * Deliberately includes the technical description, because most useful
 * searches in this universe are for a technology rather than for a name.
 */
export function matchesQuery(company: Company, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    company.name,
    company.sector,
    company.subsector,
    company.description,
    company.technicalDifferentiation,
    company.businessModel,
    company.primaryCustomer,
    company.hq,
    company.financials.kind === "public" ? company.financials.ticker : "",
    company.technology.howItWorks,
    company.technology.coreAdvantage,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

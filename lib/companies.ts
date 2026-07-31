import { COMPANIES_A } from "./data/companies-a";
import { COMPANIES_B } from "./data/companies-b";
import { COMPANIES_C } from "./data/companies-c";
import { COMPANIES_D } from "./data/companies-d";
import { COMPANIES_E } from "./data/companies-e";
import { COMPANIES_F } from "./data/companies-f";
import { COMPANIES_G } from "./data/companies-g";
import { COMPANIES_H } from "./data/companies-h";
import type { PrivateCompany, Sector } from "./types";

/**
 * The sourcing universe.
 *
 * Every company here is a real, independently private company verified against
 * public sources on 30 July 2026. There are no fictional records, and by
 * construction there are no public companies: the PrivateCompany type has no
 * ticker and the Stage type has no public member, so a listed company cannot
 * be represented here at all.
 *
 * Public companies live in market-signals.ts with a different type, no score,
 * and no pipeline status.
 */
export const COMPANIES: PrivateCompany[] = [
  ...COMPANIES_A,
  ...COMPANIES_B,
  ...COMPANIES_C,
  ...COMPANIES_D,
  ...COMPANIES_E,
  ...COMPANIES_F,
  ...COMPANIES_G,
  ...COMPANIES_H,
];

export const COMPANY_BY_ID: Record<string, PrivateCompany> = Object.fromEntries(
  COMPANIES.map((c) => [c.id, c]),
);

export function getCompany(id: string): PrivateCompany | undefined {
  return COMPANY_BY_ID[id];
}

export function activeSectors(): Sector[] {
  return [...new Set(COMPANIES.map((c) => c.sector))];
}

export function activeSubsectors(): string[] {
  return [...new Set(COMPANIES.map((c) => c.subsector))].sort();
}

export function activeRegions(): string[] {
  return [...new Set(COMPANIES.map((c) => c.region))].sort();
}

export const UNIVERSE_STATS = {
  total: COMPANIES.length,
  sectorCount: new Set(COMPANIES.map((c) => c.sector)).size,
  regionCount: new Set(COMPANIES.map((c) => c.region)).size,
  headquartersCount: new Set(COMPANIES.map((c) => c.headquarters)).size,
  highConfidence: COMPANIES.filter((c) => c.dataConfidence === "High").length,
  sourceCount: new Set(COMPANIES.flatMap((c) => c.sourceIds)).size,
};

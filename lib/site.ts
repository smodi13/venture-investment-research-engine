/** Product identity and the disclosure shown wherever it is needed. */

export const SITE = {
  name: "Venture Investment Research Engine",
  shortName: "Research Engine",
  subtitle:
    "A configurable sourcing, research, and diligence platform for evaluating emerging technology companies across private and public markets.",
  author: "Sahil Modi",
  opening:
    "Venture Investment Research Engine is a configurable platform for sourcing, comparing, and developing investment views on emerging technology companies across private and public markets.",
  disclosure:
    "This is an independent work sample built by Sahil Modi. It is not affiliated with or endorsed by any investment firm. Company information is drawn from public sources or clearly labeled demonstration data. Investment scores and conclusions reflect an illustrative research framework and are not investment advice.",
  /** The date the static research snapshot was assembled. */
  snapshotDate: "2026-07-29",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Overview" },
  { href: "/mandates", label: "Mandates" },
  { href: "/universe", label: "Company Universe" },
  { href: "/sectors", label: "Sector Research" },
  { href: "/intelligence", label: "Market Intelligence" },
  { href: "/memo", label: "Investment Memo" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/methodology", label: "Methodology" },
] as const;

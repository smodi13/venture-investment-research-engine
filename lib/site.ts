/** Product identity, disclosure, and navigation. */

export const SITE = {
  name: "Venture Sourcing Engine",
  shortName: "Sourcing Engine",
  headline:
    "Source, verify, rank, and diligence emerging private technology companies.",
  description:
    "An independent venture capital research platform for identifying real private companies, evaluating sourcing signals, ranking opportunities by investment mandate, and developing structured diligence views.",
  author: "Sahil Modi",
  centralQuestion:
    "Is the technical advantage real, durable, and reachable with the capital this company can plausibly raise?",
  disclosure:
    "This is an independent work sample built by Sahil Modi. It is not affiliated with or endorsed by any investment firm. The private-company universe is based on dated public sources. Missing information is identified as not publicly disclosed, and investment scores combine verified evidence with clearly identified analyst judgment. This is not investment advice.",
  repository: "https://github.com/smodi13/venture-investment-research-engine",
  repositoryLabel: "View source code on GitHub",
  /** The date the research snapshot was assembled and every source checked. */
  snapshotDate: "2026-07-30",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Overview" },
  { href: "/mandates", label: "Mandates" },
  { href: "/universe", label: "Company Universe" },
  { href: "/compare", label: "Compare" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/market-signals", label: "Market Signals" },
  { href: "/thesis", label: "Featured Thesis" },
  { href: "/intelligence", label: "Market Intelligence" },
  { href: "/methodology", label: "Methodology" },
] as const;

/** The sourcing workflow, shown on the overview page. */
export const WORKFLOW = [
  {
    n: "01",
    title: "Identify a market signal",
    body: "Start from an observable technical, regulatory, commercial, or capital event rather than from a company list.",
  },
  {
    n: "02",
    title: "Discover relevant private companies",
    body: "Work along the value chain around that signal to find the companies positioned against the bottleneck it exposes.",
  },
  {
    n: "03",
    title: "Verify public evidence",
    body: "Confirm the company is currently private, and source financing, founders, and technical claims against primary and corroborating records.",
  },
  {
    n: "04",
    title: "Score mandate relevance and investment quality",
    body: "Settle whether the company is in scope for the mandate, then score twelve quality factors, each with its evidence and confidence.",
  },
  {
    n: "05",
    title: "Add companies to the pipeline",
    body: "Track status, priority, the key unanswered question, and the next diligence step.",
  },
  {
    n: "06",
    title: "Generate diligence questions and an investment view",
    body: "Produce company-specific questions across technology, commercial, team, and financing, and a written view with what would invalidate it.",
  },
] as const;

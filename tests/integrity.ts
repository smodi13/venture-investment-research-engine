/**
 * Data-integrity and investment-logic checks.
 *
 * These assert the promises the platform makes about its own data: that every
 * sourcing candidate is real and private, that no public company can reach a
 * ranking, that every claim has a source, and that missing information is
 * shown rather than invented.
 *
 * Run with:  npm run test:integrity
 */
import { COMPANIES, UNIVERSE_STATS } from "../lib/companies";
import { MARKET_SIGNALS } from "../lib/data/market-signals";
import { MANDATES, type MandateId } from "../lib/mandates";
import { UNIVERSE_ROWS, topRanked } from "../lib/rows";
import {
  mandateRelevance,
  scoreBand,
  scoreCompany,
  weightTotal,
  FACTORS,
} from "../lib/scoring";
import { SOURCES, SOURCE_BY_ID } from "../lib/sources";
import { INTELLIGENCE } from "../lib/intelligence";
import { baseFields } from "../lib/storage";
import { THESIS } from "../lib/thesis";
import { SITE, NAV_LINKS } from "../lib/site";
import {
  CLAIM_PROVENANCE_LEVELS,
  DISCOVERY_CHANNELS,
  NOT_DISCLOSED,
  SIGNAL_FRESHNESS_MEANING,
  type Sector,
} from "../lib/types";
import { signalFreshness } from "../lib/format";
import {
  CONFIDENCE_BONUS,
  FRESHNESS_BONUS,
  sourcingPriority,
} from "../lib/rows";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

let failures = 0;
function check(name: string, pass: boolean, detail = "") {
  if (!pass) failures++;
  console.log(
    `${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  :: " + detail : ""}`,
  );
}

/** Every source file that could contain visible copy. */
function sourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (["node_modules", ".next", ".git", ".vercel"].includes(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, acc);
    else if (/\.(ts|tsx|md|json|css|mjs)$/.test(entry)) acc.push(full);
  }
  return acc;
}
const FILES = sourceFiles(process.cwd());

console.log("=== 1 to 3: the universe is real, private, and free of public companies ===");
check(
  `all ${COMPANIES.length} companies are flagged currently private`,
  COMPANIES.every((c) => c.currentlyPrivate === true),
);
check(
  "every company records how private status was verified",
  COMPANIES.every((c) => c.privateStatusNote.length > 30),
);
check(
  "no company carries a ticker, exchange, or public marker",
  COMPANIES.every(
    (c) => !("ticker" in c) && !("exchange" in c) && !("marketType" in c),
  ),
);
check(
  "no financing stage is public",
  COMPANIES.every((c) => (c.financing.stage as string) !== "Public"),
);
{
  const publicNames = MARKET_SIGNALS.map((s) => s.name.toLowerCase());
  const collisions = COMPANIES.filter((c) =>
    publicNames.includes(c.name.toLowerCase()),
  );
  check(
    "no market-signal company appears in the sourcing universe",
    collisions.length === 0,
    collisions.map((c) => c.name).join(", "),
  );
}

console.log("\n=== 2: no fictional or demonstration company in production data ===");
{
  // Names of every fictional company from the previous build.
  const FICTIONAL = [
    "Tidewater Autonomy", "Anvil Grid", "Larkspur Systems", "Meridian Fabric",
    "Coldbrook Thermal", "Halden Compute", "Wrenfield Robotics",
    "Palisade Quantum", "Kestrel Bio", "Ferrule Photonics", "Ravelin Data",
    "Sable Health", "Halyard Systems", "Corvid Security", "Alder Clinical",
  ];
  const hits: string[] = [];
  for (const file of FILES) {
    if (file.includes("tests/")) continue;
    const text = readFileSync(file, "utf8");
    for (const name of FICTIONAL) {
      if (text.includes(name)) hits.push(`${name} in ${file}`);
    }
  }
  check("no fictional company name appears anywhere", hits.length === 0, hits.slice(0, 4).join("; "));

  const demoWords: string[] = [];
  for (const file of FILES) {
    if (file.includes("tests/") || file.includes("storage.ts")) continue;
    const text = readFileSync(file, "utf8");
    if (/isDemonstration\s*[:?]|<DemonstrationBadge|DemonstrationBadge\s*}/.test(text)) {
      demoWords.push(file);
    }
  }
  check(
    "no demonstration badge or flag remains in company data or components",
    demoWords.length === 0,
    demoWords.join(", "),
  );
}

console.log("\n=== 4 and 5: public companies never rank or enter the pipeline ===");
for (const m of MANDATES) {
  const ranked = topRanked(m.id, UNIVERSE_ROWS.length);
  const publicIds = new Set(MARKET_SIGNALS.map((s) => s.id));
  check(
    `${m.name}: ranking contains no market-signal company`,
    ranked.every((r) => !publicIds.has(r.id)),
  );
}
{
  const universeIds = new Set(COMPANIES.map((c) => c.id));
  const pipelineIds = UNIVERSE_ROWS.map((r) => r.id);
  check(
    "every pipeline company exists in the verified private universe",
    pipelineIds.every((id) => universeIds.has(id)),
  );
  check(
    "market signals carry no score, tier, or pipeline status",
    MARKET_SIGNALS.every(
      (s) => !("scores" in s) && !("tiers" in s) && !("status" in s),
    ),
  );
}

console.log("\n=== 6 to 10: every company is sourced ===");
check(
  "every company has a working official website recorded",
  COMPANIES.every((c) => /^https:\/\/[a-z0-9.-]+/i.test(c.website)),
);
check(
  "every company has at least one primary source",
  COMPANIES.every((c) =>
    c.sourceIds.some((id) => SOURCE_BY_ID[id]?.primary === true),
  ),
  COMPANIES.filter(
    (c) => !c.sourceIds.some((id) => SOURCE_BY_ID[id]?.primary === true),
  )
    .map((c) => c.name)
    .join(", "),
);
{
  // A corroborating source is a second registered source on the record.
  const thin = COMPANIES.filter((c) => c.sourceIds.length < 2);
  check(
    "every company has at least one corroborating source",
    thin.length === 0,
    thin.map((c) => `${c.name} (${c.sourceIds.length})`).join(", "),
  );
}
check(
  "every registered source id on a company resolves",
  COMPANIES.every((c) => c.sourceIds.every((id) => Boolean(SOURCE_BY_ID[id]))),
);
check(
  "every company has a last-reviewed date",
  COMPANIES.every((c) => /^\d{4}-\d{2}-\d{2}$/.test(c.lastReviewed)),
);
check(
  "every financing claim has a supporting source that resolves",
  COMPANIES.every((c) => Boolean(SOURCE_BY_ID[c.financing.latestRoundSourceId])),
);
check(
  "every financing claim has an announcement date",
  COMPANIES.every((c) => /^\d{4}-\d{2}-\d{2}$/.test(c.financing.latestRoundDate)),
);

console.log("\n=== 11 and 12: sourcing rationale and confidence ===");
check(
  "every company has a specific sourcing rationale",
  COMPANIES.every(
    (c) =>
      c.sourcing.whyEntered.length > 80 &&
      c.sourcing.whyTimely.length > 40 &&
      c.sourcing.whyOverlooked.length > 40,
  ),
);
check(
  "every company records a sourcing signal, channel, and date",
  COMPANIES.every(
    (c) =>
      c.sourcing.signal.length > 0 &&
      c.sourcing.channel.length > 0 &&
      /^\d{4}-\d{2}-\d{2}$/.test(c.sourcing.dateSourced),
  ),
);
check(
  "every company has a data-confidence rating and an explanation",
  COMPANIES.every(
    (c) =>
      ["High", "Medium", "Low"].includes(c.dataConfidence) &&
      c.dataConfidenceNote.length > 60,
  ),
);
check(
  "every factor carries evidence, explanation, basis, and confidence",
  COMPANIES.every((c) =>
    FACTORS.every((f) => {
      const a = c.factors[f.key];
      return (
        a &&
        a.evidence.length > 10 &&
        a.explanation.length > 10 &&
        ["verified", "judgment"].includes(a.basis) &&
        ["High", "Medium", "Low"].includes(a.confidence)
      );
    }),
  ),
);
{
  const wellKnown = COMPANIES.filter((c) => c.sourcing.wellRecognised);
  check(
    "companies marked well recognised score low on sourcing originality",
    wellKnown.every((c) => c.factors.sourcingOriginality.rating <= 2),
    wellKnown
      .map((c) => `${c.name}:${c.factors.sourcingOriginality.rating}`)
      .join(", "),
  );
}

console.log("\n=== 13: homepage top cards are private companies ===");
for (const m of MANDATES) {
  const top6 = topRanked(m.id, 6);
  const universeIds = new Set(COMPANIES.map((c) => c.id));
  check(
    `${m.name}: all six homepage cards are verified private companies`,
    top6.length === 6 && top6.every((r) => universeIds.has(r.id)),
  );
}

console.log("\n=== 15: missing fields display the not-disclosed sentinel ===");
{
  // Nothing may be an empty string where a fact belongs.
  const blanks = COMPANIES.filter(
    (c) =>
      c.businessModel.trim() === "" ||
      String(c.financing.totalDisclosedFunding).trim() === "" ||
      String(c.technology.benchmarks).trim() === "",
  );
  check(
    "no factual field is left blank instead of marked not disclosed",
    blanks.length === 0,
    blanks.map((c) => c.name).join(", "),
  );
  const undisclosedCount = COMPANIES.reduce((n, c) => {
    const vals = [
      c.businessModel,
      c.tractionSignal,
      String(c.foundedYear),
      String(c.financing.totalDisclosedFunding),
      String(c.technology.benchmarks),
      String(c.technology.intellectualProperty),
      String(c.commercial.pricingModel),
      String(c.commercial.salesMotion),
    ];
    return n + vals.filter((v) => v === NOT_DISCLOSED).length;
  }, 0);
  check(
    "the not-disclosed sentinel is actually used where facts are missing",
    undisclosedCount > 0,
    `${undisclosedCount} fields marked not publicly disclosed`,
  );
  check(
    "every company lists what is missing from its financing record",
    COMPANIES.every((c) => c.financing.missingInformation.length > 0),
  );
}

console.log("\n=== 16: public companies appear only as market signals ===");
{
  const signalNames = MARKET_SIGNALS.map((s) => s.name);
  const offenders: string[] = [];
  for (const file of FILES) {
    if (
      file.includes("tests/") ||
      file.includes("market-signals") ||
      file.includes("thesis.ts") ||
      file.includes("intelligence.ts") ||
      file.includes("sources.ts") ||
      file.includes("README") ||
      file.includes("companies-")
    )
      continue;
    const text = readFileSync(file, "utf8");
    for (const n of signalNames) {
      if (new RegExp(`["'\`]${n}["'\`]`).test(text)) offenders.push(`${n} in ${file}`);
    }
  }
  check(
    "public company names appear only in market signals, thesis context, sources, and competitor lists",
    offenders.length === 0,
    offenders.slice(0, 4).join("; "),
  );
}

console.log("\n=== 17 and 18: no firm names, no em dashes ===");
{
  // Case-sensitive and word-bounded. "headline" and "matchstick" are ordinary
  // English words; only the capitalised firm names are disqualifying. Lock
  // files are skipped because their integrity hashes are not visible copy.
  const FIRMS = [
    "Headline", "LDV", "Remoti", "Matchstick", "Magid",
    "Boston Millennia", "ldv-x-sourcing", "x-sourcing-engine",
  ];
  const hits: string[] = [];
  for (const file of FILES) {
    if (file.includes("tests/integrity") || file.endsWith("package-lock.json"))
      continue;
    const text = readFileSync(file, "utf8");
    for (const firm of FIRMS) {
      if (new RegExp(`\\b${firm}\\b`).test(text)) hits.push(`${firm} in ${file}`);
    }
  }
  check("no firm-specific name appears anywhere", hits.length === 0, hits.slice(0, 5).join("; "));

  const dashes: string[] = [];
  for (const file of FILES) {
    if (file.includes("tests/integrity")) continue;
    const text = readFileSync(file, "utf8");
    if (text.includes("—")) dashes.push(file);
  }
  check("no em dash appears in any source file", dashes.length === 0, dashes.join(", "));
}

console.log("\n=== 19: the GitHub link is present where required ===");
{
  const required = [
    "app/page.tsx",
    "components/Footer.tsx",
    "app/methodology/page.tsx",
  ];
  for (const file of required) {
    const text = readFileSync(join(process.cwd(), file), "utf8");
    check(`${file} renders the GitHub link`, /GitHubLink/.test(text));
  }
  check(
    "the repository URL points at the independent repository",
    SITE.repository === "https://github.com/smodi13/venture-investment-research-engine",
    SITE.repository,
  );
}

console.log("\n=== 20 and 21: no environment variables, no secrets ===");
{
  const envUses: string[] = [];
  const secretHits: string[] = [];
  const SECRET = /(ghp_|github_pat_|nvapi-|sk-[A-Za-z0-9]{16,}|AKIA[0-9A-Z]{16})/;
  for (const file of FILES) {
    if (file.includes("tests/integrity")) continue;
    const text = readFileSync(file, "utf8");
    if (/process\.env\./.test(text)) envUses.push(file);
    if (SECRET.test(text)) secretHits.push(file);
  }
  check("the application reads no environment variable", envUses.length === 0, envUses.join(", "));
  check("no credential pattern appears in any source file", secretHits.length === 0, secretHits.join(", "));
}

console.log("\n=== Scoring and mandate integrity ===");
for (const m of MANDATES) {
  check(`${m.name}: quality weights sum to 100`, weightTotal(m) === 100, String(weightTotal(m)));
  const breaches = COMPANIES.map((c) => scoreCompany(c, m.id)).filter(
    (r) => r.total > r.relevance.tier.ceiling,
  );
  check(`${m.name}: no company exceeds its relevance ceiling`, breaches.length === 0);
}
{
  const tops = new Set(
    MANDATES.map((m) => topRanked(m.id, 6).map((r) => r.id).join(">")),
  );
  check("all four mandates produce distinct top-six lists", tops.size === 4, `${tops.size}/4`);
}
{
  // On-thesis sectors per mandate, used to check economic reasonableness.
  const ON: Record<MandateId, Sector[]> = {
    "frontier-technology": [
      "AI Software Infrastructure", "Semiconductors & Advanced Computing",
      "Robotics & Autonomy", "Quantum Computing", "Energy Systems",
      "Advanced Materials", "Space & Aerospace", "Biotechnology & Research Tools",
    ],
    "enterprise-software": [
      "Enterprise Infrastructure Software", "AI Software Infrastructure",
    ],
    "healthcare-technology": [
      "Healthcare Technology", "Biotechnology & Research Tools",
    ],
    "generalist-early-stage": [
      "Enterprise Infrastructure Software", "AI Software Infrastructure",
      "Healthcare Technology", "Robotics & Autonomy",
      "Biotechnology & Research Tools", "Energy Systems",
      "Advanced Materials", "Semiconductors & Advanced Computing",
      "Space & Aerospace", "Quantum Computing",
    ],
  };
  for (const m of MANDATES) {
    const offThesisPriority = COMPANIES.map((c) => ({ c, r: scoreCompany(c, m.id) }))
      .filter(
        ({ c, r }) =>
          scoreBand(r.total).label === "Priority research" &&
          !ON[m.id].includes(c.sector),
      );
    check(
      `${m.name}: no off-thesis company reaches priority research`,
      offThesisPriority.length === 0,
      offThesisPriority.map((x) => x.c.name).join(", "),
    );
    const top = topRanked(m.id, 1)[0];
    const topCompany = COMPANIES.find((c) => c.id === top.id)!;
    check(
      `${m.name}: the top-ranked company is on-thesis`,
      ON[m.id].includes(topCompany.sector),
      `${topCompany.name} (${topCompany.sector})`,
    );
  }
}

console.log("\n=== Sources, navigation, and intelligence integrity ===");
check(
  "every registered source has a resolvable https URL and an access date",
  SOURCES.every(
    (s) => /^https:\/\//.test(s.url) && /^\d{4}-\d{2}-\d{2}$/.test(s.accessed),
  ),
);
check(
  "no registered source is a search-results page",
  SOURCES.every((s) => !/[?&]q=|\/search\?|google\.com\/search/.test(s.url)),
);
check(
  "every intelligence entry has a resolvable source",
  INTELLIGENCE.every((e) => Boolean(SOURCE_BY_ID[e.sourceId])),
);
check(
  "every intelligence entry links only to companies in the universe",
  INTELLIGENCE.every((e) =>
    e.relatedPrivateIds.every((id) => COMPANIES.some((c) => c.id === id)),
  ),
);
check(
  "the thesis names only private companies from the universe",
  THESIS.valueChain.every((l) =>
    l.privateIds.every((id) => COMPANIES.some((c) => c.id === id)),
  ),
);
check(
  "the Market Signals route is present in navigation",
  NAV_LINKS.some((l) => l.href === "/market-signals"),
);
check(
  "pipeline defaults resolve for every company",
  UNIVERSE_ROWS.every((r) => Boolean(baseFields(r).status)),
);

console.log("\n=== Portfolio construction: stage mix, sourcing depth, and freshness ===");

const EARLY_STAGES = ["Seed", "Series A"] as const;
const LATER_STAGES = ["Series D", "Series E", "Growth", "Later stage"] as const;
const earlyCount = COMPANIES.filter((c) =>
  (EARLY_STAGES as readonly string[]).includes(c.financing.stage),
).length;
const laterCount = COMPANIES.filter((c) =>
  (LATER_STAGES as readonly string[]).includes(c.financing.stage),
).length;
const seedCount = COMPANIES.filter((c) => c.financing.stage === "Seed").length;

// 1
check(
  "universe holds at least 28 verified private companies",
  COMPANIES.length >= 28,
  `${COMPANIES.length} companies`,
);
// 2
check(
  "at least a quarter of the universe is Seed or Series A",
  earlyCount / COMPANIES.length >= 0.25,
  `${earlyCount} of ${COMPANIES.length} (${((100 * earlyCount) / COMPANIES.length).toFixed(1)}%)`,
);
// 3
check(
  "at least four companies are at Seed stage",
  seedCount >= 4,
  `${seedCount} seed-stage companies`,
);
// 4
check(
  "later-stage companies are no more than a quarter of the universe",
  laterCount / COMPANIES.length <= 0.25,
  `${laterCount} of ${COMPANIES.length} (${((100 * laterCount) / COMPANIES.length).toFixed(1)}%)`,
);
// 5
check(
  "no company reports a generic stage bucket as its disclosed round",
  COMPANIES.every(
    (c) =>
      !/^(later stage|growth|unknown|n\/a)$/i.test(
        String(c.financing.disclosedRound).trim(),
      ),
  ),
  COMPANIES.filter((c) =>
    /^(later stage|growth|unknown|n\/a)$/i.test(
      String(c.financing.disclosedRound).trim(),
    ),
  )
    .map((c) => c.name)
    .join(", "),
);
// 6
check(
  "every company records a discovery channel from the declared list",
  COMPANIES.every((c) =>
    DISCOVERY_CHANNELS.includes(c.sourcing.discoveryChannel),
  ),
);
// 7
check(
  "every sourcing signal is a valid date at or before the snapshot date",
  COMPANIES.every(
    (c) =>
      /^\d{4}-\d{2}-\d{2}$/.test(c.sourcing.signalDate) &&
      c.sourcing.signalDate <= SITE.snapshotDate,
  ),
  COMPANIES.filter((c) => c.sourcing.signalDate > SITE.snapshotDate)
    .map((c) => c.name)
    .join(", "),
);
// 8
check(
  "signal freshness classifies correctly at the 90 day and 12 month boundaries",
  signalFreshness("2026-05-01") === "Fresh" &&
    signalFreshness("2026-04-01") === "Recent" &&
    signalFreshness("2025-07-01") === "Established" &&
    Object.keys(SIGNAL_FRESHNESS_MEANING).length === 3,
);
// 9
check(
  "every company states why a database search would miss it, distinctly from why it entered",
  COMPANIES.every(
    (c) =>
      c.sourcing.whyNotObvious.trim().length >= 60 &&
      c.sourcing.whyNotObvious !== c.sourcing.whyEntered,
  ),
  COMPANIES.filter((c) => c.sourcing.whyNotObvious.trim().length < 60)
    .map((c) => c.name)
    .join(", "),
);
// 10
check(
  "every company names the additional evidence still needed",
  COMPANIES.every((c) => c.sourcing.evidenceNeeded.trim().length >= 40),
  COMPANIES.filter((c) => c.sourcing.evidenceNeeded.trim().length < 40)
    .map((c) => c.name)
    .join(", "),
);
// 11
{
  const top = topRanked("enterprise-software", 5).map(
    (r) => COMPANIES.find((c) => c.id === r.id)!,
  );
  const software = top.filter((c) =>
    ["Enterprise Infrastructure Software", "AI Software Infrastructure"].includes(
      c.sector,
    ),
  ).length;
  check(
    "the enterprise software mandate top five is majority software companies",
    software >= 3,
    top.map((c) => `${c.name} (${c.sector})`).join("; "),
  );
}
// 12
{
  const top = topRanked("healthcare-technology", 5).map(
    (r) => COMPANIES.find((c) => c.id === r.id)!,
  );
  const health = top.every((c) =>
    ["Healthcare Technology", "Biotechnology & Research Tools"].includes(
      c.sector,
    ),
  );
  check(
    "the healthcare mandate top five contains only healthcare and life-science companies",
    health,
    top.map((c) => `${c.name} (${c.sector})`).join("; "),
  );
}
// 13
{
  const top = topRanked("generalist-early-stage", 5).map(
    (r) => COMPANIES.find((c) => c.id === r.id)!,
  );
  const early = top.every((c) =>
    ["Seed", "Series A", "Series B"].includes(c.financing.stage),
  );
  check(
    "the generalist early stage mandate top five contains no company past Series B",
    early,
    top.map((c) => `${c.name} (${c.financing.stage})`).join("; "),
  );
}
// 14
{
  const maxAdjustment =
    Math.max(...Object.values(CONFIDENCE_BONUS)) +
    Math.max(...Object.values(FRESHNESS_BONUS));
  let violation = "";
  for (const m of MANDATES) {
    for (const a of UNIVERSE_ROWS) {
      for (const b of UNIVERSE_ROWS) {
        const gap = a.scores[m.id] - b.scores[m.id];
        if (
          gap > maxAdjustment &&
          sourcingPriority(b, m.id) > sourcingPriority(a, m.id)
        ) {
          violation = `${b.name} overtook ${a.name} under ${m.name}`;
        }
      }
    }
  }
  check(
    "confidence and freshness adjustments never overturn a clear score difference",
    maxAdjustment <= 6 && violation === "",
    `maximum adjustment ${maxAdjustment} points${violation ? "; " + violation : ""}`,
  );
}

console.log("\n=== Claim provenance and mandate coverage ===");

/** Every quantified claim on a record: the traction line plus both evidence lists. */
function quantifiedClaims(c: (typeof COMPANIES)[number]) {
  return [...c.technology.supportingEvidence, ...c.commercial.adoptionEvidence];
}

/** Reporting modes that can support an "independently verified" label. */
const INDEPENDENT_REPORTING = new Set([
  "Independent reporting",
  "Peer-reviewed research",
  "Government or official record",
  "Public technical record",
]);

// 15
{
  const healthcare = COMPANIES.filter(
    (c) => c.sector === "Healthcare Technology",
  );
  check(
    "at least six Healthcare Technology companies exist",
    healthcare.length >= 6,
    `${healthcare.length}: ${healthcare.map((c) => c.name).join(", ")}`,
  );
}
// 16
check(
  "every company classifies the provenance of its traction claim",
  COMPANIES.every((c) =>
    CLAIM_PROVENANCE_LEVELS.includes(c.tractionProvenance),
  ),
);
// 17
check(
  "every traction claim carries a valid as-of date at or before the snapshot",
  COMPANIES.every(
    (c) =>
      /^\d{4}-\d{2}-\d{2}$/.test(c.tractionAsOf) &&
      c.tractionAsOf <= "2026-08-01",
  ),
  COMPANIES.filter((c) => !/^\d{4}-\d{2}-\d{2}$/.test(c.tractionAsOf))
    .map((c) => c.name)
    .join(", "),
);
// 18
{
  const unclassified = COMPANIES.flatMap((c) =>
    quantifiedClaims(c)
      .filter((e) => !CLAIM_PROVENANCE_LEVELS.includes(e.provenance))
      .map((e) => `${c.name}: ${e.claim.slice(0, 40)}`),
  );
  const total = COMPANIES.reduce((n, c) => n + quantifiedClaims(c).length, 0);
  check(
    "every quantified claim carries a provenance classification",
    unclassified.length === 0,
    `${total} claims classified`,
  );
}
// 19
{
  const bad = COMPANIES.flatMap((c) =>
    quantifiedClaims(c)
      .filter(
        (e) =>
          e.provenance === "Independently verified" &&
          !INDEPENDENT_REPORTING.has(SOURCE_BY_ID[e.sourceId]?.reporting),
      )
      .map(
        (e) =>
          `${c.name} cites ${e.sourceId} (${SOURCE_BY_ID[e.sourceId]?.reporting})`,
      ),
  );
  check(
    "no claim is called independently verified on the strength of a reproduced announcement",
    bad.length === 0,
    bad.slice(0, 3).join("; "),
  );
}
// 20
{
  const unlabelled = COMPANIES.flatMap((c) =>
    quantifiedClaims(c)
      .filter((e) => !SOURCE_BY_ID[e.sourceId])
      .map((e) => `${c.name}: ${e.sourceId}`),
  );
  check(
    "every classified claim resolves to a registered source",
    unlabelled.length === 0,
    unlabelled.join(", "),
  );
}
// 21
{
  const unsupported = COMPANIES.flatMap((c) =>
    quantifiedClaims(c)
      .filter((e) => e.provenance === "Not sufficiently supported")
      .map((e) => `${c.name}: ${e.claim.slice(0, 50)}`),
  );
  check(
    "no unsupported quantified claim is used as evidence in production data",
    unsupported.length === 0,
    unsupported.join("; "),
  );
}
// 22
{
  const claimed = COMPANIES.filter(
    (c) =>
      c.tractionProvenance === "Not sufficiently supported" &&
      c.tractionSignal !== NOT_DISCLOSED,
  );
  check(
    "a company with no supportable traction figure states so rather than asserting one",
    claimed.length === 0,
    claimed.map((c) => c.name).join(", "),
  );
}

/* Mandate coverage ------------------------------------------------------- */

const EARLY_ONLY = ["Pre-Seed", "Seed", "Series A"];

for (const m of MANDATES) {
  const top = topRanked(m.id, 6);
  // 23 to 26
  check(
    `${m.name}: produces six ranked companies with non-zero scores`,
    top.length === 6 && top.every((r) => r.scores[m.id] > 0),
    top.map((r) => `${r.name} ${r.scores[m.id]}`).join(", "),
  );
  const core = top.filter((r) => r.tiers[m.id] === "core").length;
  check(
    `${m.name}: at least four of the top six are core to the mandate`,
    core >= 4,
    `${core} core`,
  );
}
// 27
{
  const top = topRanked("generalist-early-stage", 6).map(
    (r) => COMPANIES.find((c) => c.id === r.id)!,
  );
  check(
    "Generalist Early Stage top six are all Pre-Seed, Seed, or Series A",
    top.every((c) => EARLY_ONLY.includes(c.financing.stage)),
    top.map((c) => `${c.name} (${c.financing.stage})`).join("; "),
  );
}

console.log("\n=== Semantic mandate fit ===");

/**
 * Sectors that build physical hardware. A mandate focused on software should
 * never rate one of these core unless it says so in coreSectors explicitly.
 */
const HARDWARE_SECTORS: Sector[] = [
  "Semiconductors & Advanced Computing",
  "Quantum Computing",
  "Robotics & Autonomy",
  "Advanced Materials",
  "Space & Aerospace",
  "Energy Systems",
];

// 28: the two statements of mandate scope must agree
{
  const mismatches: string[] = [];
  for (const m of MANDATES) {
    const derived = (Object.entries(m.sectorAffinity) as [Sector, number][])
      .filter(([, v]) => v === 5)
      .map(([k]) => k)
      .sort();
    const declared = [...m.coreSectors].sort();
    if (JSON.stringify(derived) !== JSON.stringify(declared)) {
      mismatches.push(
        `${m.name}: declared [${declared.join(", ")}] vs affinity [${derived.join(", ")}]`,
      );
    }
  }
  check(
    "each mandate's declared core sectors match its affinity table exactly",
    mismatches.length === 0,
    mismatches.join(" | "),
  );
}

// 29: no company can reach core through a sector the mandate never declared
{
  const offenders: string[] = [];
  for (const m of MANDATES) {
    for (const c of COMPANIES) {
      const rel = mandateRelevance(c, m);
      if (rel.tier.id === "core" && !m.coreSectors.includes(c.sector)) {
        offenders.push(`${c.name} (${c.sector}) core to ${m.name}`);
      }
    }
  }
  check(
    "no company is core to a mandate through an undeclared sector",
    offenders.length === 0,
    offenders.slice(0, 4).join("; "),
  );
}

// 30: the specific bug this audit found
{
  const es = MANDATES.find((m) => m.id === "enterprise-software")!;
  const semisDeclared = es.coreSectors.includes(
    "Semiconductors & Advanced Computing",
  );
  const offenders = COMPANIES.filter(
    (c) =>
      c.sector === "Semiconductors & Advanced Computing" &&
      mandateRelevance(c, es).tier.id === "core",
  );
  check(
    "a semiconductor company cannot be core to Enterprise Software unless the mandate declares semiconductors",
    semisDeclared || offenders.length === 0,
    offenders.map((c) => c.name).join(", ") || "no semiconductor company is core",
  );
}

// 31: the same guard generalised to every hardware sector
{
  const softwareMandates = MANDATES.filter(
    (m) => m.id === "enterprise-software" || m.id === "healthcare-technology",
  );
  const offenders: string[] = [];
  for (const m of softwareMandates) {
    for (const sector of HARDWARE_SECTORS) {
      if (m.coreSectors.includes(sector)) continue;
      for (const c of COMPANIES.filter((x) => x.sector === sector)) {
        if (mandateRelevance(c, m).tier.id === "core") {
          offenders.push(`${c.name} (${sector}) core to ${m.name}`);
        }
      }
    }
  }
  check(
    "no hardware company is core to a software-focused mandate that excludes its sector",
    offenders.length === 0,
    offenders.slice(0, 4).join("; "),
  );
}

// 32: every top-six company sits in a sector its mandate declares core
{
  const offenders: string[] = [];
  for (const m of MANDATES) {
    for (const r of topRanked(m.id, 6)) {
      const c = COMPANIES.find((x) => x.id === r.id)!;
      if (!m.coreSectors.includes(c.sector)) {
        offenders.push(`${m.name}: ${c.name} (${c.sector})`);
      }
    }
  }
  check(
    "every top-six company sits in a sector its mandate declares core",
    offenders.length === 0,
    offenders.join("; "),
  );
}

// 33: every top-six company sits at a stage the mandate actually wants
{
  const offenders: string[] = [];
  for (const m of MANDATES) {
    for (const r of topRanked(m.id, 6)) {
      const c = COMPANIES.find((x) => x.id === r.id)!;
      if (m.stageAffinity[c.financing.stage] < 4) {
        offenders.push(
          `${m.name}: ${c.name} (${c.financing.stage}, affinity ${m.stageAffinity[c.financing.stage]})`,
        );
      }
    }
  }
  check(
    "every top-six company sits at a stage its mandate rates 4 or higher",
    offenders.length === 0,
    offenders.join("; "),
  );
}

// 34: the rendered explanation must state the numbers the model actually used
{
  const offenders: string[] = [];
  for (const m of MANDATES) {
    for (const c of COMPANIES) {
      const rel = mandateRelevance(c, m);
      const saysSector = rel.explanation.includes(
        `Sector affinity ${rel.sectorAffinity} of 5`,
      );
      const saysStage = rel.explanation.includes(
        `stage affinity ${rel.stageAffinity} of 5`,
      );
      const saysMandate = rel.explanation.includes(m.name);
      if (!saysSector || !saysStage || !saysMandate) {
        offenders.push(`${c.name} under ${m.name}`);
      }
    }
  }
  check(
    "the displayed relevance explanation states the affinities the model actually used",
    offenders.length === 0,
    offenders.slice(0, 3).join("; "),
  );
}

// 35: relevance is computed, never stored
{
  const raw = readFileSync(join(process.cwd(), "lib/scoring.ts"), "utf8");
  const dataFiles = readdirSync(join(process.cwd(), "lib/data")).filter((f) =>
    f.endsWith(".ts"),
  );
  const storedTier = dataFiles.some((f) =>
    /\b(tier|relevance|rank|score)\s*:/.test(
      readFileSync(join(process.cwd(), "lib/data", f), "utf8"),
    ),
  );
  check(
    "no company record stores a rank, score, or relevance tier",
    !storedTier && /Math\.min/.test(raw),
    storedTier ? "a data file stores a ranking field" : "relevance derived at runtime",
  );
}

// 36: a company's sector must match the kind of thing its subsector describes
{
  const HARDWARE_WORDS =
    /\b(silicon|chip|accelerator|wafer|photonic|interconnect|robot|spacecraft|satellite|launch|reactor|battery|cement|laborator(y|ies)|hardware)\b/i;
  const offenders = COMPANIES.filter(
    (c) =>
      !HARDWARE_SECTORS.includes(c.sector) &&
      c.sector !== "Healthcare Technology" &&
      c.sector !== "Biotechnology & Research Tools" &&
      HARDWARE_WORDS.test(c.subsector),
  ).map((c) => `${c.name}: ${c.sector} / ${c.subsector}`);
  check(
    "no company describing hardware sits in a software sector",
    offenders.length === 0,
    offenders.join("; "),
  );
}

console.log("\n=== Source accessibility ===");

// 37
{
  const blocked = SOURCES.filter((x) => !x.automatedAccess);
  const offenders = COMPANIES.filter(
    (c) => !c.sourceIds.some((id) => SOURCE_BY_ID[id]?.automatedAccess),
  ).map((c) => c.name);
  check(
    "every company cites at least one source that opens without a browser",
    offenders.length === 0,
    `${blocked.length} source(s) block automated requests: ${blocked.map((x) => x.id).join(", ")}`,
  );
}
// 38
{
  const offenders = MARKET_SIGNALS.filter(
    (m) => !m.sourceIds.some((id) => SOURCE_BY_ID[id]?.automatedAccess),
  ).map((m) => m.name);
  check(
    "every market signal cites at least one source that opens without a browser",
    offenders.length === 0,
    offenders.join(", "),
  );
}
// 39
{
  const offenders = COMPANIES.flatMap((c) =>
    [...c.technology.supportingEvidence, ...c.commercial.adoptionEvidence]
      .filter((e) => !SOURCE_BY_ID[e.sourceId]?.automatedAccess)
      .map((e) => `${c.name}: ${e.sourceId}`),
  );
  check(
    "no individual claim rests solely on a source that blocks automated requests",
    offenders.length === 0,
    offenders.join("; "),
  );
}
// 40
{
  const offenders = SOURCES.filter(
    (x) => !x.automatedAccess && !/blocks automated requests/i.test(x.supports),
  ).map((x) => x.id);
  check(
    "every blocked source says so in its registry entry",
    offenders.length === 0,
    offenders.join(", "),
  );
}

console.log("\n=== Future milestones are described as future ===");

/**
 * Milestones the corpus names that have not happened yet.
 *
 * Each carries the date it is scheduled for. The first check asserts that date
 * is still in the future relative to the snapshot, so when one of these
 * actually flies the suite fails and forces the copy to be revisited rather
 * than silently going stale.
 */
const FUTURE_MILESTONES: { term: string; scheduled: string }[] = [
  { term: "Starburst-1", scheduled: "2026-10-01" },
  { term: "Supernova", scheduled: "2027-01-01" },
];

/** Verbs that would assert the thing already happened. */
const COMPLETED_ACTION =
  /\b(launched|has flown|have flown|flew|completed|deployed|achieved|delivered to orbit|reached orbit|successfully (?:launched|flew|completed|deployed))\b/i;

/**
 * Negated constructions, stripped before looking for completed actions.
 * "has never flown" and "neither of which has flown" contain the verb and
 * assert the opposite of it.
 */
const NEGATED =
  /\b(?:has|have|had|which has|which have)\s+(?:never|not|not yet|yet)\s+\w+|\bneither\s+of\s+which\s+(?:has|have)\s+\w+|\bno[tn]e?\s+(?:of\s+\w+\s+)?(?:has|have)\s+\w+/gi;

/** A date that has not arrived yet, relative to the snapshot. */
const FUTURE_DATE = /\b(fourth quarter of 2026|Q4 2026|202[7-9]|20[3-9]\d)\b/i;

/** Language that marks a statement as forward-looking. */
const FORWARD_LOOKING =
  /\b(scheduled|planned|plans?\s+to|manifested|targets?|targeting|expected|intends?|would be|will be|not yet|upcoming|ahead of|due|until)\b/i;

/** Every sentence of company copy that a reader actually sees. */
function companyProse(c: (typeof COMPANIES)[number]): string[] {
  const parts = [
    c.description,
    String(c.tractionSignal),
    c.recentCatalyst,
    c.technicalDifferentiation,
    c.mainTechnicalRisk,
    c.mainCommercialRisk,
    c.technology.howItWorks,
    c.technology.coreAdvantage,
    c.technology.milestoneForScale,
    c.market.currentCatalyst,
    c.commercial.expansionOpportunity,
    c.commercial.goToMarketRisk,
    c.investment.thesis,
    c.investment.bullCase,
    c.investment.baseCase,
    c.investment.bearCase,
    c.investment.recommendedNextStep,
    c.outreach,
    c.sourcing.whyEntered,
    c.sourcing.whyTimely,
    c.sourcing.whyNotObvious,
    ...c.technology.supportingEvidence.map((e) => e.claim),
    ...c.commercial.adoptionEvidence.map((e) => e.claim),
    ...Object.values(c.factors).map((f) => `${f.evidence} ${f.explanation}`),
  ];
  return parts
    .join(" ")
    .split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

// 41
{
  const past = FUTURE_MILESTONES.filter((m) => m.scheduled <= SITE.snapshotDate);
  check(
    "every milestone listed as future is still scheduled after the snapshot date",
    past.length === 0,
    past.length > 0
      ? `${past.map((m) => m.term).join(", ")} is now in the past; revisit the copy`
      : FUTURE_MILESTONES.map((m) => `${m.term} ${m.scheduled}`).join(", "),
  );
}
// 42
{
  const offenders: string[] = [];
  for (const c of COMPANIES) {
    for (const sentence of companyProse(c)) {
      for (const m of FUTURE_MILESTONES) {
        if (!sentence.includes(m.term)) continue;
        const asserted = sentence.replace(NEGATED, " ");
        if (COMPLETED_ACTION.test(asserted)) {
          offenders.push(`${c.name}: "${sentence.slice(0, 110)}"`);
        }
      }
    }
  }
  check(
    "no future mission is described with a completed-action verb",
    offenders.length === 0,
    offenders.slice(0, 3).join(" | "),
  );
}
// 43
{
  const offenders: string[] = [];
  for (const c of COMPANIES) {
    for (const sentence of companyProse(c)) {
      for (const m of FUTURE_MILESTONES) {
        // Only sentences pairing the mission with a date that has not
        // arrived need the hedge. A sentence dated to a past financing round
        // is talking about the round, not the flight.
        if (!sentence.includes(m.term)) continue;
        if (!FUTURE_DATE.test(sentence)) continue;
        if (!FORWARD_LOOKING.test(sentence)) {
          offenders.push(`${c.name}: "${sentence.slice(0, 110)}"`);
        }
      }
    }
  }
  check(
    "every dated mention of a future mission carries forward-looking language",
    offenders.length === 0,
    offenders.slice(0, 3).join(" | "),
  );
}
// 44
{
  const offenders = SOURCES.filter(
    (x) =>
      FUTURE_MILESTONES.some((m) => x.supports.includes(m.term)) &&
      COMPLETED_ACTION.test(x.supports.replace(NEGATED, " ")),
  ).map((x) => x.id);
  check(
    "no source registry entry describes a future mission as completed",
    offenders.length === 0,
    offenders.join(", "),
  );
}

console.log("\n=== Universe composition ===");
console.log(`  Companies: ${UNIVERSE_STATS.total}`);
console.log(`  Sectors: ${UNIVERSE_STATS.sectorCount}`);
console.log(`  Headquarters locations: ${UNIVERSE_STATS.headquartersCount}`);
console.log(`  Registered sources: ${SOURCES.length}`);
{
  const bySector = new Map<string, number>();
  for (const c of COMPANIES) bySector.set(c.sector, (bySector.get(c.sector) ?? 0) + 1);
  console.log(
    "  Sector distribution: " +
      [...bySector.entries()].map(([s, n]) => `${s} ${n}`).join(", "),
  );
  const byStage = new Map<string, number>();
  for (const c of COMPANIES)
    byStage.set(c.financing.stage, (byStage.get(c.financing.stage) ?? 0) + 1);
  console.log(
    "  Stage distribution: " +
      [...byStage.entries()].map(([s, n]) => `${s} ${n}`).join(", "),
  );
  const byConf = new Map<string, number>();
  for (const c of COMPANIES)
    byConf.set(c.dataConfidence, (byConf.get(c.dataConfidence) ?? 0) + 1);
  console.log(
    "  Data confidence: " +
      [...byConf.entries()].map(([s, n]) => `${s} ${n}`).join(", "),
  );
}

console.log("\n=== Top six per mandate ===");
for (const m of MANDATES) {
  console.log(`\n${m.name}`);
  for (const [i, r] of topRanked(m.id, 6).entries()) {
    const c = COMPANIES.find((x) => x.id === r.id)!;
    const res = scoreCompany(c, m.id);
    console.log(
      `  ${i + 1}. ${c.name.padEnd(24)} ${String(res.total).padStart(3)}  ` +
        `(quality ${res.quality} x ${res.relevance.tier.multiplier.toFixed(2)})  ` +
        `${c.sector}, ${c.financing.stage}, ${c.dataConfidence} confidence`,
    );
  }
}

console.log(
  `\n${failures === 0 ? "ALL INTEGRITY CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`,
);
process.exit(failures === 0 ? 0 : 1);

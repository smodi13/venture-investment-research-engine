/**
 * Investment-logic checks on the scoring model.
 *
 * These assert economic reasonableness, not arithmetic. The arithmetic is
 * checked by the type system and by the weight totals; what matters here is
 * whether each mandate produces a ranking a partner would defend in a meeting.
 *
 * Run with:  npx tsx tests/rankings.ts
 */
import { COMPANIES } from "../lib/companies";
import { MANDATES, type MandateId } from "../lib/mandates";
import { scoreCompany, scoreBand, weightTotal } from "../lib/scoring";
import type { Company, Sector } from "../lib/types";

let failures = 0;
function check(name: string, pass: boolean, detail = "") {
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  :: " + detail : ""}`);
}

/**
 * Sectors a mandate is genuinely about. A company outside these is off-thesis
 * for that mandate regardless of how good a company it is.
 */
const ON_THESIS: Record<MandateId, Sector[]> = {
  "frontier-technology": [
    "AI Infrastructure",
    "Semiconductors",
    "Robotics & Autonomy",
    "Quantum Technology",
    "Energy & Advanced Materials",
    "Biotechnology & Research Tools",
  ],
  "enterprise-software": ["Enterprise Software", "AI Infrastructure"],
  "healthcare-technology": [
    "Healthcare Technology",
    "Biotechnology & Research Tools",
  ],
  "generalist-early-stage": [
    "Enterprise Software",
    "AI Infrastructure",
    "Healthcare Technology",
    "Robotics & Autonomy",
    "Biotechnology & Research Tools",
    "Energy & Advanced Materials",
  ],
};

/** Stages a mandate actually invests at. */
const ON_STAGE: Record<MandateId, (c: Company) => boolean> = {
  "frontier-technology": () => true,
  "enterprise-software": (c) => c.stage !== "Public",
  "healthcare-technology": (c) => c.stage !== "Public",
  "generalist-early-stage": (c) =>
    ["Pre-Seed", "Seed", "Series A"].includes(c.stage),
};

function ranked(mandateId: MandateId) {
  return COMPANIES.map((c) => ({ c, r: scoreCompany(c, mandateId) })).sort(
    (a, b) => b.r.total - a.r.total,
  );
}

console.log("=== Weight integrity ===");
for (const m of MANDATES) {
  check(`${m.name}: quality weights sum to 100`, weightTotal(m) === 100,
    String(weightTotal(m)));
}

console.log("\n=== Requirement 1 and 7: off-thesis companies cannot be priority research ===");
for (const m of MANDATES) {
  const offThesisPriority = ranked(m.id).filter(
    ({ c, r }) =>
      scoreBand(r.total).label === "Priority research" &&
      !ON_THESIS[m.id].includes(c.sector),
  );
  check(
    `${m.name}: no off-sector company reaches priority research`,
    offThesisPriority.length === 0,
    offThesisPriority.map((x) => `${x.c.name} ${x.r.total}`).join(", "),
  );

  const offStagePriority = ranked(m.id).filter(
    ({ c, r }) =>
      scoreBand(r.total).label === "Priority research" && !ON_STAGE[m.id](c),
  );
  check(
    `${m.name}: no off-stage company reaches priority research`,
    offStagePriority.length === 0,
    offStagePriority.map((x) => `${x.c.name} ${x.r.total}`).join(", "),
  );
}

console.log("\n=== Requirement 1: the top of each ranking is on-thesis ===");
for (const m of MANDATES) {
  const top5 = ranked(m.id).slice(0, 5);
  const onThesis = top5.filter(({ c }) => ON_THESIS[m.id].includes(c.sector));
  check(
    `${m.name}: at least 4 of the top 5 are in an on-thesis sector`,
    onThesis.length >= 4,
    `${onThesis.length}/5`,
  );
  check(
    `${m.name}: the top-ranked company is on-thesis`,
    ON_THESIS[m.id].includes(top5[0].c.sector),
    `${top5[0].c.name} (${top5[0].c.sector})`,
  );
}

console.log("\n=== Requirement 2: relevance ceilings are enforced ===");
for (const m of MANDATES) {
  const breaches = ranked(m.id).filter(
    ({ r }) => r.total > r.relevance.tier.ceiling,
  );
  check(
    `${m.name}: no company exceeds its relevance ceiling`,
    breaches.length === 0,
    breaches.map((x) => `${x.c.name} ${x.r.total}>${x.r.relevance.tier.ceiling}`).join(", "),
  );
}

console.log("\n=== Requirement 4: rankings are derived, not hardcoded ===");
{
  const tops = new Set(MANDATES.map((m) => ranked(m.id).slice(0, 5).map((x) => x.c.id).join(">")));
  check("all four mandates produce distinct top-five lists", tops.size === 4, `${tops.size}/4`);

  // A company's quality is mandate-dependent through the weights alone; its
  // relevance is mandate-dependent through affinities alone. Neither is stored.
  const nvda = COMPANIES.find((c) => c.id === "nvda")!;
  const qualities = new Set(MANDATES.map((m) => scoreCompany(nvda, m.id).quality));
  check("company quality varies with mandate weighting", qualities.size > 1,
    [...qualities].join(", "));
}

console.log("\n=== Requirement 6 and 10: final top five per mandate ===");
for (const m of MANDATES) {
  console.log(`\n${m.name}`);
  for (const [i, { c, r }] of ranked(m.id).slice(0, 5).entries()) {
    console.log(
      `  ${i + 1}. ${c.name.padEnd(26)} ${String(r.total).padStart(3)}  ` +
        `(quality ${r.quality} x ${r.relevance.tier.multiplier.toFixed(2)} ${r.relevance.tier.label})  ` +
        `${c.sector}, ${c.stage}, ${c.marketType}`,
    );
  }
}

console.log("\n=== Band distribution sanity ===");
for (const m of MANDATES) {
  const counts = new Map<string, number>();
  for (const { r } of ranked(m.id)) {
    const b = scoreBand(r.total).label;
    counts.set(b, (counts.get(b) ?? 0) + 1);
  }
  console.log(
    `  ${m.name.padEnd(24)} ` +
      [...counts.entries()].map(([b, n]) => `${b}: ${n}`).join(", "),
  );
}

console.log(`\n${failures === 0 ? "ALL INVESTMENT-LOGIC CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

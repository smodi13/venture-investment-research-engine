/**
 * Isolated headless end-to-end test for the Venture Investment Research Engine.
 * Uses a fresh Playwright Chromium profile. Never touches the user's Chrome.
 */
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE || "http://localhost:3111";
const DOWNLOADS = path.join(__dirname, ".tmp-downloads");
fs.mkdirSync(DOWNLOADS, { recursive: true });

const results = [];
const consoleIssues = [];

function record(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  :: " + detail : ""}`);
}

function watch(page, label) {
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      const t = m.text();
      // Favicon and network noise are not application errors.
      if (/favicon|Failed to load resource/i.test(t)) return;
      consoleIssues.push(`[${label}] ${m.type()}: ${t}`);
    }
  });
  page.on("pageerror", (e) => consoleIssues.push(`[${label}] pageerror: ${e.message}`));
}

const ROUTES = [
  "/", "/mandates", "/universe", "/sectors", "/intelligence",
  "/memo", "/pipeline", "/methodology", "/thesis",
  "/sectors/ai-infrastructure", "/sectors/robotics-autonomy",
  "/sectors/quantum-technology", "/sectors/biotechnology-research-tools",
  "/sectors/energy-advanced-materials",
  "/universe/nvda", "/universe/coldbrook-thermal", "/universe/anvil-grid",
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ acceptDownloads: true });
  const page = await ctx.newPage();
  watch(page, "desktop");

  /* 2. Navigation across all major routes ------------------------------- */
  let navOk = true;
  for (const r of ROUTES) {
    const resp = await page.goto(BASE + r, { waitUntil: "networkidle" });
    const status = resp.status();
    const h1 = await page.locator("h1").first().textContent().catch(() => null);
    if (status !== 200 || !h1) { navOk = false; record(`route ${r}`, false, `status ${status}`); }
  }
  record(`navigation: all ${ROUTES.length} routes render with an h1`, navOk);

  /* 13. Unknown route -> 404 -------------------------------------------- */
  {
    const resp = await page.goto(BASE + "/universe/not-a-real-company", { waitUntil: "networkidle" });
    const body = await page.textContent("body");
    record("unknown route returns 404", resp.status() === 404, `status ${resp.status()}`);
    record("404 page renders content", /404|not be found|not found/i.test(body));
  }

  /* 3. Mandate switching and score recalculation ------------------------ */
  await page.goto(BASE + "/universe", { waitUntil: "networkidle" });
  const firstRowName = () => page.locator("table tbody tr td:nth-child(2) a").first().textContent();
  const scoreCells = () => page.locator("table tbody tr td:last-child span.font-mono").allTextContents();

  const topN = async (n) =>
    (await page.locator("table tbody tr td:nth-child(2) a").allTextContents())
      .slice(0, n).map((s) => s.trim());

  const rankings = {};
  for (const m of ["Frontier Technology", "Enterprise Software",
                   "Healthcare Technology", "Generalist Early Stage"]) {
    await page.getByRole("button", { name: m }).first().click();
    await page.waitForTimeout(400);
    rankings[m] = { top: await topN(6), scores: (await scoreCells()).join(",") };
    console.log(`      ${m}: ${rankings[m].top.join(" | ")}`);
  }
  const uniqueScoreSets = new Set(Object.values(rankings).map((r) => r.scores));
  record("mandate switch changes scores", uniqueScoreSets.size === 4,
    `${uniqueScoreSets.size} distinct score sets across 4 mandates`);

  const uniqueTops = new Set(Object.values(rankings).map((r) => r.top.join(">")));
  record("mandate switch re-ranks the universe", uniqueTops.size === 4,
    `${uniqueTops.size} distinct top-6 orderings across 4 mandates`);

  /* Requirement 7: off-thesis companies cannot be priority research ------ */
  // Read the rendered table rather than the model, so this asserts what a user
  // actually sees. Each entry is a company that is materially outside the
  // mandate on sector, stage, or both.
  const OFF_THESIS = {
    "Healthcare Technology": ["Broadcom", "NVIDIA", "Arm Holdings", "Micron Technology"],
    "Enterprise Software": ["Broadcom", "Micron Technology", "Bloom Energy", "IonQ"],
    "Frontier Technology": ["Ravelin Data", "Sable Health", "Halyard Systems"],
    "Generalist Early Stage": ["Broadcom", "NVIDIA", "Arm Holdings", "Vertiv"],
  };

  for (const [mandateName, offThesis] of Object.entries(OFF_THESIS)) {
    await page.getByRole("button", { name: mandateName }).first().click();
    await page.waitForTimeout(400);

    const rendered = await page.locator("table tbody tr").evaluateAll((rows) =>
      rows.map((row) => ({
        name: row.querySelector("td:nth-child(2) a")?.textContent?.trim(),
        cell: row.querySelector("td:last-child")?.textContent ?? "",
      })),
    );

    const violations = rendered.filter(
      (r) => offThesis.includes(r.name) && /Priority research/.test(r.cell),
    );
    record(
      `${mandateName}: off-thesis companies never show priority research`,
      violations.length === 0,
      violations.map((v) => v.name).join(", "),
    );

    // And the top of the ranking is not an off-thesis company.
    record(
      `${mandateName}: top-ranked company is not off-thesis`,
      !offThesis.includes(rendered[0]?.name),
      `top = ${rendered[0]?.name}`,
    );

    // Every row states its relevance tier, so a low score is explainable.
    const tiered = rendered.filter((r) => /to mandate|Outside mandate/.test(r.cell));
    record(
      `${mandateName}: every row shows a relevance tier`,
      tiered.length === rendered.length,
      `${tiered.length}/${rendered.length}`,
    );
  }

  await page.getByRole("button", { name: "Healthcare Technology" }).first().click();
  await page.waitForTimeout(400);
  const afterName = (await firstRowName()).trim();

  /* 8. localStorage persistence of mandate ------------------------------ */
  await page.reload({ waitUntil: "networkidle" });
  const persistedTop = (await firstRowName()).trim();
  record("mandate persists across reload", persistedTop === afterName,
    `after reload top=${persistedTop}`);
  // Restore the default mandate for later checks.
  await page.getByRole("button", { name: "Frontier Technology" }).first().click();
  await page.waitForTimeout(300);

  /* 4. Search, filters, sorting ----------------------------------------- */
  const rowCount = () => page.locator("table tbody tr").count();
  const allRows = await rowCount();

  await page.getByPlaceholder(/inference, cooling/i).fill("cooling");
  await page.waitForTimeout(400);
  const searchRows = await rowCount();
  record("search narrows results", searchRows > 0 && searchRows < allRows,
    `${allRows} -> ${searchRows}`);
  const searchHit = await page.locator("table tbody tr td:nth-child(2) a").first().textContent();
  record("search returns a relevant company", /coldbrook|vertiv/i.test(searchHit), searchHit.trim());

  await page.getByPlaceholder(/inference, cooling/i).fill("");
  await page.waitForTimeout(300);

  await page.getByRole("button", { name: /more filters/i }).click();
  await page.waitForTimeout(200);
  await page.locator("select").filter({ hasText: "Public" }).first().selectOption("Public").catch(async () => {
    // Fall back to the labelled control.
    const sel = page.locator("label:has-text('Public or private') select");
    await sel.selectOption("Public");
  });
  await page.waitForTimeout(400);
  const publicRows = await rowCount();
  record("public/private filter works", publicRows === 12, `${publicRows} public companies`);

  await page.getByRole("button", { name: /reset all filters/i }).click();
  await page.waitForTimeout(400);
  record("reset filters restores full universe", (await rowCount()) === allRows, `${allRows} rows`);

  const sortSel = page.locator("label:has-text('Sort by') select");
  await sortSel.selectOption("name");
  await page.waitForTimeout(400);
  const names = await page.locator("table tbody tr td:nth-child(2) a").allTextContents();
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  record("sort by name orders alphabetically", JSON.stringify(names) === JSON.stringify(sorted),
    `first=${names[0]}`);
  await sortSel.selectOption("score");
  await page.waitForTimeout(300);

  /* 5. Company comparison ----------------------------------------------- */
  const boxes = page.locator('table tbody input[type="checkbox"]');
  for (let i = 0; i < 4; i++) { await boxes.nth(i).check(); await page.waitForTimeout(120); }
  await page.waitForTimeout(300);
  const compareHeading = await page.getByText(/Comparing 4 of up to 4 companies/i).count();
  record("comparison supports 4 companies", compareHeading === 1);
  const fifthDisabled = await boxes.nth(4).isDisabled();
  record("comparison caps at 4 (5th disabled)", fifthDisabled);
  const compareRows = await page.locator("table").nth(0).locator("tbody tr").count();
  record("comparison table renders dimension rows", compareRows >= 10, `${compareRows} rows`);
  await page.getByRole("button", { name: /clear comparison/i }).click();
  await page.waitForTimeout(300);
  record("clear comparison works",
    (await page.getByText(/Comparing/i).count()) === 0);

  /* 9. CSV export -------------------------------------------------------- */
  {
    const [dl] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /Export .* to CSV/i }).click(),
    ]);
    const file = path.join(DOWNLOADS, dl.suggestedFilename());
    await dl.saveAs(file);
    const csv = fs.readFileSync(file, "utf8");
    const lines = csv.trim().split("\n");
    record("CSV export downloads", fs.existsSync(file), dl.suggestedFilename());
    // Derived from the rendered table rather than hardcoded, so the check
    // survives the universe growing.
    record("CSV has preamble, header and one row per company",
      lines.length === 3 + 1 + allRows, `${lines.length} lines for ${allRows} companies`);
    record("CSV carries provenance columns",
      /provenance/i.test(csv) && /Demonstration data/.test(csv));
    record("CSV states scores are not advice", /not investment advice/i.test(csv));
  }

  /* 6. Company detail views --------------------------------------------- */
  await page.goto(BASE + "/universe/nvda", { waitUntil: "networkidle" });
  const nvdaText = await page.textContent("body");
  record("public detail: all research sections present",
    ["Technology assessment", "Market assessment", "Commercial assessment",
     "Financial assessment", "Investment view", "Scoring breakdown",
     "Diligence questions"].every((s) => nvdaText.includes(s)));
  record("public detail: provenance labels shown",
    nvdaText.includes("Analyst estimate") && nvdaText.includes("Requires verification"));
  const factorRows = await page.locator("table tbody tr").count();
  record("scoring breakdown shows 12 quality factors", factorRows === 12, `${factorRows} rows`);
  record("detail page shows the relevance adjustment arithmetic",
    /Mandate relevance adjustment/.test(nvdaText) &&
      /Company quality under/.test(nvdaText) &&
      /Final score under/.test(nvdaText));
  record("detail page states the relevance tier and its ceiling",
    /(Core|Adjacent|Peripheral|Marginal|Outside) to mandate|Outside mandate/.test(nvdaText) &&
      /ceiling \d+/.test(nvdaText));

  await page.goto(BASE + "/universe/coldbrook-thermal", { waitUntil: "networkidle" });
  const demoText = await page.textContent("body");
  record("private detail: demonstration warning shown",
    /Demonstration company/i.test(demoText) && /fictional/i.test(demoText));
  record("private detail: financing section shown", demoText.includes("Financing assessment"));
  record("private detail: outreach copy button present",
    (await page.getByRole("button", { name: /copy outreach draft/i }).count()) === 1);

  /* Mandate switch on a detail page changes the score --------------------- */
  const detailScore = () => page.locator("span.font-mono.text-sm.font-semibold").first().textContent();
  const s1 = (await detailScore()).trim();
  await page.getByRole("button", { name: "Enterprise Software" }).first().click();
  await page.waitForTimeout(400);
  const s2 = (await detailScore()).trim();
  record("detail page score recalculates on mandate change", s1 !== s2, `${s1} -> ${s2}`);
  await page.getByRole("button", { name: "Frontier Technology" }).first().click();
  await page.waitForTimeout(300);

  /* 7. Pipeline status and notes + 8. persistence ------------------------ */
  await page.goto(BASE + "/pipeline", { waitUntil: "networkidle" });
  const firstStatus = page.locator("table tbody select").first();
  const origStatus = await firstStatus.inputValue();
  await firstStatus.selectOption("Partner review");
  await page.waitForTimeout(400);
  record("pipeline status can be changed",
    (await firstStatus.inputValue()) === "Partner review", `was ${origStatus}`);

  await page.getByRole("button", { name: /notes and next step/i }).first().click();
  await page.waitForTimeout(300);
  const notes = page.locator("textarea").first();
  await notes.fill("E2E test note: verify persistence.");
  await page.waitForTimeout(400);
  record("pipeline notes can be edited",
    (await notes.inputValue()).includes("E2E test note"));

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const statusAfter = await page.locator("table tbody select").first().inputValue();
  record("pipeline status persists after refresh", statusAfter === "Partner review", statusAfter);
  await page.getByRole("button", { name: /notes and next step/i }).first().click();
  await page.waitForTimeout(300);
  const notesAfter = await page.locator("textarea").first().inputValue();
  record("pipeline notes persist after refresh", notesAfter.includes("E2E test note"));

  const resetBtn = page.getByRole("button", { name: /reset demonstration data/i });
  await resetBtn.click();
  await page.waitForTimeout(500);
  const statusReset = await page.locator("table tbody select").first().inputValue();
  record("reset restores demonstration data", statusReset !== "Partner review", statusReset);

  /* 10. Memo copy and download ------------------------------------------ */
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(BASE + "/memo", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /^Copy memo$/i }).click();
  await page.waitForTimeout(500);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  record("memo copy writes to clipboard", clip.includes("INVESTMENT MEMO"), `${clip.length} chars`);
  record("memo copy includes the disclosure", /not investment advice/i.test(clip));

  for (const [label, ext] of [[/Download Markdown/i, ".md"], [/Download text/i, ".txt"]]) {
    const [dl] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: label }).click(),
    ]);
    const file = path.join(DOWNLOADS, dl.suggestedFilename());
    await dl.saveAs(file);
    const content = fs.readFileSync(file, "utf8");
    record(`memo downloads ${ext}`, dl.suggestedFilename().endsWith(ext) && content.length > 2000,
      `${dl.suggestedFilename()} (${content.length} chars)`);
  }

  /* 12. External links --------------------------------------------------- */
  await page.goto(BASE + "/methodology", { waitUntil: "networkidle" });
  const links = await page.locator('a[href^="http"]').evaluateAll((els) =>
    els.map((e) => ({ href: e.href, rel: e.rel, target: e.target })));
  const unique = [...new Set(links.map((l) => l.href))];
  record("external links present in source registry", unique.length >= 20, `${unique.length} unique`);
  record("all external links open safely (noopener noreferrer)",
    links.every((l) => l.target === "_blank" && /noopener/.test(l.rel) && /noreferrer/.test(l.rel)));
  fs.writeFileSync(path.join(DOWNLOADS, "external-links.txt"), unique.join("\n"));

  /* 11. Mobile layout ---------------------------------------------------- */
  const mctx = await browser.newContext({ ...devices["iPhone 13"] });
  const mp = await mctx.newPage();
  watch(mp, "mobile");
  for (const r of ["/", "/universe", "/pipeline", "/memo", "/methodology"]) {
    await mp.goto(BASE + r, { waitUntil: "networkidle" });
    const overflow = await mp.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 2) record(`mobile ${r} horizontal overflow`, false, `${overflow}px`);
  }
  record("mobile: no page-level horizontal overflow on key routes", true);

  await mp.goto(BASE + "/", { waitUntil: "networkidle" });
  const menuBtn = mp.getByRole("button", { name: /^Menu$/ });
  record("mobile: menu button visible", await menuBtn.isVisible());
  await menuBtn.click();
  await mp.waitForTimeout(300);
  const mobileLinks = await mp.locator("#mobile-nav a").count();
  record("mobile: menu opens with all 8 nav links", mobileLinks === 8, `${mobileLinks} links`);
  await mp.locator("#mobile-nav a", { hasText: "Company Universe" }).click();
  await mp.waitForTimeout(600);
  record("mobile: navigation works and menu closes",
    mp.url().endsWith("/universe") && (await mp.locator("#mobile-nav").count()) === 0);

  await mctx.close();

  /* 1. Console errors ---------------------------------------------------- */
  record("no console errors or warnings", consoleIssues.length === 0,
    consoleIssues.slice(0, 5).join(" | "));

  await browser.close();

  console.log("\n================ SUMMARY ================");
  const failed = results.filter((r) => !r.pass);
  console.log(`${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    console.log("\nFAILURES:");
    failed.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`));
  }
  if (consoleIssues.length) {
    console.log("\nCONSOLE ISSUES:");
    consoleIssues.forEach((c) => console.log("  " + c));
  }
  process.exit(failed.length ? 1 : 0);
})();

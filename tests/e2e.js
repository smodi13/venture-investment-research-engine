/**
 * Isolated headless end-to-end test for the Venture Sourcing Engine.
 * Uses a fresh Playwright Chromium profile. Never touches the user's browser.
 *
 *   npm run build && npm start        # in one terminal
 *   npm run test:e2e                  # in another
 *   BASE=https://... npm run test:e2e # or against a deployment
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
      if (/favicon|Failed to load resource/i.test(t)) return;
      consoleIssues.push(`[${label}] ${m.type()}: ${t}`);
    }
  });
  page.on("pageerror", (e) => consoleIssues.push(`[${label}] pageerror: ${e.message}`));
}

const ROUTES = [
  "/", "/mandates", "/universe", "/pipeline", "/market-signals",
  "/thesis", "/intelligence", "/memo", "/methodology",
  "/universe/etched", "/universe/sublime-systems", "/universe/oxide-computer",
  "/universe/quera", "/universe/path-robotics",
];

/** Public companies that must never appear as sourcing candidates. */
const PUBLIC_NAMES = ["NVIDIA", "Broadcom", "Micron", "Advanced Micro Devices", "Vertiv", "Marvell"];

/** Fictional companies from the previous build that must be gone. */
const FICTIONAL = [
  "Tidewater Autonomy", "Anvil Grid", "Larkspur Systems", "Meridian Fabric",
  "Coldbrook Thermal", "Halden Compute", "Wrenfield Robotics", "Palisade Quantum",
  "Kestrel Bio", "Ferrule Photonics", "Ravelin Data", "Sable Health",
  "Halyard Systems", "Corvid Security", "Alder Clinical",
];

const FIRMS = ["LDV", "Remoti", "Matchstick", "Magid", "Boston Millennia"];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ acceptDownloads: true });
  const page = await ctx.newPage();
  watch(page, "desktop");

  /* Navigation --------------------------------------------------------- */
  let navOk = true;
  for (const r of ROUTES) {
    const resp = await page.goto(BASE + r, { waitUntil: "networkidle" });
    const h1 = await page.locator("h1").first().textContent().catch(() => null);
    if (resp.status() !== 200 || !h1) { navOk = false; record(`route ${r}`, false, `status ${resp.status()}`); }
  }
  record(`navigation: all ${ROUTES.length} routes render with an h1`, navOk);

  /* Custom 404 ---------------------------------------------------------- */
  {
    const resp = await page.goto(BASE + "/universe/not-a-real-company", { waitUntil: "networkidle" });
    const body = await page.textContent("body");
    record("unknown route returns 404", resp.status() === 404, `status ${resp.status()}`);
    record("404 page renders content", /404|not be found|not found/i.test(body));
  }

  /* Product positioning ------------------------------------------------- */
  {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const body = await page.textContent("body");
    record("product is named Venture Sourcing Engine", body.includes("Venture Sourcing Engine"));
    record(
      "homepage carries the required headline",
      body.includes("Source, verify, rank, and diligence emerging private technology companies."),
    );
    record(
      "homepage carries the central question",
      body.includes("Is the technical advantage real, durable, and reachable"),
    );
    record(
      "homepage carries the required disclosure",
      body.includes("It is not affiliated with or endorsed by any investment firm"),
    );
    record("no em dash in rendered homepage copy", !body.includes("—"));
  }

  /* No firm names, no fictional companies, sitewide ---------------------- */
  {
    const firmHits = [];
    const fictionalHits = [];
    for (const r of ROUTES) {
      await page.goto(BASE + r, { waitUntil: "networkidle" });
      const body = await page.textContent("body");
      for (const f of FIRMS) if (new RegExp(`\\b${f}\\b`).test(body)) firmHits.push(`${f} on ${r}`);
      for (const f of FICTIONAL) if (body.includes(f)) fictionalHits.push(`${f} on ${r}`);
      if (body.includes("—")) firmHits.push(`em dash on ${r}`);
    }
    record("no firm-specific name appears on any page", firmHits.length === 0, firmHits.slice(0, 4).join("; "));
    record("no fictional company appears on any page", fictionalHits.length === 0, fictionalHits.slice(0, 4).join("; "));
  }

  /* Public companies never appear as sourcing candidates ----------------- */
  {
    await page.goto(BASE + "/universe", { waitUntil: "networkidle" });
    const names = await page.locator("table tbody tr td:nth-child(1) a").allTextContents();
    const offenders = names.filter((n) => PUBLIC_NAMES.some((p) => n.trim() === p));
    record("no public company in the private-company universe", offenders.length === 0, offenders.join(", "));
    record("universe lists 18 verified private companies", names.length === 18, `${names.length} rows`);

    await page.goto(BASE + "/pipeline", { waitUntil: "networkidle" });
    const pipeNames = await page.locator("table tbody tr td:nth-child(1) a").allTextContents();
    const pipeOffenders = pipeNames.filter((n) => PUBLIC_NAMES.some((p) => n.trim() === p));
    record("no public company in the venture pipeline", pipeOffenders.length === 0, pipeOffenders.join(", "));
  }

  /* Market Signals route ------------------------------------------------ */
  {
    await page.goto(BASE + "/market-signals", { waitUntil: "networkidle" });
    const body = await page.textContent("body");
    record(
      "market signals page carries the required explanation",
      body.includes("They are not venture sourcing candidates and do not appear in the private-company pipeline or sourcing rankings."),
    );
    record("market signals page lists public companies", PUBLIC_NAMES.some((p) => body.includes(p)));
    record("market signals companies show no investment score",
      (await page.locator("text=/Priority research|Strong watchlist/").count()) === 0);
  }

  /* Homepage top cards are private -------------------------------------- */
  {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const cards = await page.locator("ol li a div.font-medium").allTextContents();
    const top = cards.slice(0, 6).map((c) => c.trim());
    record("homepage shows six top sourced companies", top.length === 6, top.join(", "));
    record("no homepage card is a public company",
      !top.some((n) => PUBLIC_NAMES.includes(n)), top.join(", "));
  }

  /* Mandate switching --------------------------------------------------- */
  {
    await page.goto(BASE + "/universe", { waitUntil: "networkidle" });
    const scoreCells = () => page.locator("table tbody tr td:last-child span.font-mono").allTextContents();
    const rankings = {};
    for (const m of ["Frontier Technology", "Enterprise Software", "Healthcare Technology", "Generalist Early Stage"]) {
      await page.getByRole("button", { name: m }).first().click();
      await page.waitForTimeout(400);
      const names = await page.locator("table tbody tr td:nth-child(1) a").allTextContents();
      rankings[m] = { top: names.slice(0, 6).map((s) => s.trim()), scores: (await scoreCells()).join(",") };
      console.log(`      ${m}: ${rankings[m].top.join(" | ")}`);

      // Public companies may legitimately be named inside a row as investors
      // or competitors. What must never happen is one appearing as the sourced
      // company itself, so this checks the company-name cell only.
      record(`${m}: no public company is a ranked sourcing candidate`,
        !rankings[m].top.some((n) => PUBLIC_NAMES.includes(n)),
        rankings[m].top.join(", "));
    }
    record("mandate switch changes scores",
      new Set(Object.values(rankings).map((r) => r.scores)).size === 4);
    record("mandate switch re-ranks the universe",
      new Set(Object.values(rankings).map((r) => r.top.join(">"))).size === 4);

    await page.reload({ waitUntil: "networkidle" });
    const after = (await page.locator("table tbody tr td:nth-child(1) a").allTextContents())[0].trim();
    record("mandate persists across reload", after === rankings["Generalist Early Stage"].top[0], after);
    await page.getByRole("button", { name: "Frontier Technology" }).first().click();
    await page.waitForTimeout(300);
  }

  /* Search, filters, sorting -------------------------------------------- */
  {
    const rowCount = () => page.locator("table tbody tr").count();
    const all = await rowCount();

    await page.getByPlaceholder(/inference, welding/i).fill("welding");
    await page.waitForTimeout(400);
    record("search narrows results", (await rowCount()) < all, `${all} -> ${await rowCount()}`);
    const hit = await page.locator("table tbody tr td:nth-child(1) a").first().textContent();
    record("search finds the expected company", /Path Robotics/i.test(hit), hit.trim());

    await page.getByPlaceholder(/inference, welding/i).fill("Lonsberry");
    await page.waitForTimeout(400);
    record("search matches on founder name", (await rowCount()) === 1, `${await rowCount()} rows`);
    await page.getByPlaceholder(/inference, welding/i).fill("");
    await page.waitForTimeout(300);

    await page.getByRole("button", { name: /more filters/i }).click();
    await page.waitForTimeout(200);
    await page.locator("label").filter({ hasText: /^Data confidence/ }).locator("select").selectOption("High");
    await page.waitForTimeout(400);
    const highRows = await rowCount();
    record("data confidence filter works", highRows > 0 && highRows < all, `${highRows} high confidence`);

    await page.getByRole("button", { name: /reset all filters/i }).click();
    await page.waitForTimeout(400);
    record("reset filters restores the universe", (await rowCount()) === all);

    const sortSel = page.locator("label").filter({ hasText: /^Sort by/ }).locator("select");
    await sortSel.selectOption("name");
    await page.waitForTimeout(400);
    const names = await page.locator("table tbody tr td:nth-child(1) a").allTextContents();
    record("sort by name orders alphabetically",
      JSON.stringify(names) === JSON.stringify([...names].sort((a, b) => a.localeCompare(b))));
    await sortSel.selectOption("score");
    await page.waitForTimeout(300);
  }

  /* CSV export ---------------------------------------------------------- */
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
    record("CSV has preamble, header, and one row per company", lines.length === 4 + 1 + 18, `${lines.length} lines`);
    record("CSV states no public or fictional companies are included",
      /No public companies and no fictional companies are included/.test(csv));
    record("CSV carries sourcing and confidence columns",
      /Data confidence/.test(csv) && /Why sourced/.test(csv) && /Sources/.test(csv));
    record("CSV contains no public company", !PUBLIC_NAMES.some((p) => new RegExp(`^${p},`, "m").test(csv)));
  }

  /* Company detail ------------------------------------------------------ */
  {
    await page.goto(BASE + "/universe/sublime-systems", { waitUntil: "networkidle" });
    const body = await page.textContent("body");
    record("detail: sourcing rationale section is present",
      body.includes("Why this company entered the pipeline") &&
      body.includes("Why it may be timely now"));
    record("detail: all assessment sections present",
      ["Technology assessment", "Market assessment", "Commercial assessment",
       "Financing assessment", "Investment view", "Scoring breakdown",
       "Diligence questions", "Founder outreach"].every((s) => body.includes(s)));
    record("detail: shows data confidence and its explanation",
      /confidence/i.test(body) && body.includes("Why this confidence rating"));
    record("detail: shows the relevance adjustment arithmetic",
      body.includes("Mandate relevance adjustment") && body.includes("Final score under"));
    const factorRows = await page.locator("table tbody tr").count();
    record("detail: scoring breakdown shows 12 quality factors", factorRows === 12, `${factorRows} rows`);
    record("detail: lists missing information rather than estimating",
      body.includes("Missing information") && body.includes("Not publicly disclosed"));
    record("detail: outreach does not claim to represent a fund",
      !/I work (with|for) (a|an) (venture|fund)/i.test(body));
    const officialLink = await page.locator('a[href="https://sublime-systems.com"]').count();
    record("detail: links to the official company website", officialLink > 0);
  }

  /* Not publicly disclosed is actually rendered -------------------------- */
  {
    await page.goto(BASE + "/universe/ayar-labs", { waitUntil: "networkidle" });
    const body = await page.textContent("body");
    record("missing fields render as Not publicly disclosed",
      body.includes("Not publicly disclosed"));
  }

  /* Pipeline ------------------------------------------------------------ */
  {
    await page.goto(BASE + "/pipeline", { waitUntil: "networkidle" });
    const body = await page.textContent("body");
    record("pipeline labels workflow data as demonstration",
      body.includes("demonstration workflow data") &&
      body.includes("do not indicate that any meeting, outreach, or investment activity occurred"));

    const firstStatus = page.locator("table tbody select").first();
    await firstStatus.selectOption("Partner review");
    await page.waitForTimeout(400);
    record("pipeline status can be changed", (await firstStatus.inputValue()) === "Partner review");

    await page.getByRole("button", { name: /notes and next step/i }).first().click();
    await page.waitForTimeout(300);
    const notes = page.locator("textarea").first();
    await notes.fill("E2E note: verify persistence.");
    await page.waitForTimeout(400);

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    record("pipeline status persists after refresh",
      (await page.locator("table tbody select").first().inputValue()) === "Partner review");
    await page.getByRole("button", { name: /notes and next step/i }).first().click();
    await page.waitForTimeout(300);
    record("pipeline notes persist after refresh",
      (await page.locator("textarea").first().inputValue()).includes("E2E note"));

    await page.getByRole("button", { name: /reset demonstration workflow data/i }).click();
    await page.waitForTimeout(500);
    record("reset restores demonstration workflow data",
      (await page.locator("table tbody select").first().inputValue()) !== "Partner review");
  }

  /* Memo ---------------------------------------------------------------- */
  {
    await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(BASE + "/memo", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /^Copy memo$/i }).click();
    await page.waitForTimeout(500);
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    record("memo copy writes to clipboard", clip.includes("INVESTMENT MEMO"), `${clip.length} chars`);
    record("memo names a real company from the universe", clip.includes("Sublime Systems"));
    record("memo includes sources and the disclosure",
      /SOURCES/.test(clip) && /not investment advice/i.test(clip));

    for (const [label, ext] of [[/Download Markdown/i, ".md"], [/Download text/i, ".txt"]]) {
      const [dl] = await Promise.all([
        page.waitForEvent("download"),
        page.getByRole("button", { name: label }).click(),
      ]);
      const file = path.join(DOWNLOADS, dl.suggestedFilename());
      await dl.saveAs(file);
      record(`memo downloads ${ext}`,
        dl.suggestedFilename().endsWith(ext) && fs.readFileSync(file, "utf8").length > 2000,
        dl.suggestedFilename());
    }
  }

  /* GitHub link --------------------------------------------------------- */
  {
    const REPO = "https://github.com/smodi13/venture-investment-research-engine";
    for (const r of ["/", "/methodology"]) {
      await page.goto(BASE + r, { waitUntil: "networkidle" });
      const links = await page.locator(`a[href="${REPO}"]`).evaluateAll((els) =>
        els.map((e) => ({ rel: e.rel, target: e.target, text: e.textContent })));
      record(`${r}: GitHub link present, safe, and labelled`,
        links.length > 0 &&
        links.every((l) => l.target === "_blank" && /noopener/.test(l.rel) && /noreferrer/.test(l.rel)) &&
        links.some((l) => /View source code on GitHub/.test(l.text)),
        `${links.length} link(s)`);
    }
    // The footer is on every page, so any page proves the footer link.
    const footerLinks = await page.locator(`footer a[href="${REPO}"]`).count();
    record("footer: GitHub link present", footerLinks > 0);
  }

  /* External links ------------------------------------------------------ */
  {
    await page.goto(BASE + "/methodology", { waitUntil: "networkidle" });
    const links = await page.locator('a[href^="http"]').evaluateAll((els) =>
      els.map((e) => ({ href: e.href, rel: e.rel, target: e.target })));
    const unique = [...new Set(links.map((l) => l.href))];
    record("source registry renders external links", unique.length >= 40, `${unique.length} unique`);
    record("all external links open safely",
      links.every((l) => l.target === "_blank" && /noopener/.test(l.rel) && /noreferrer/.test(l.rel)));
    record("no external link is a search-results page",
      !unique.some((u) => /[?&]q=|\/search\?/.test(u)));
    fs.writeFileSync(path.join(DOWNLOADS, "external-links.txt"), unique.join("\n"));
  }

  /* Mobile -------------------------------------------------------------- */
  const mctx = await browser.newContext({ ...devices["iPhone 13"] });
  const mp = await mctx.newPage();
  watch(mp, "mobile");
  {
    let overflow = false;
    for (const r of ["/", "/universe", "/pipeline", "/market-signals", "/methodology"]) {
      await mp.goto(BASE + r, { waitUntil: "networkidle" });
      const px = await mp.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (px > 2) { overflow = true; record(`mobile ${r} horizontal overflow`, false, `${px}px`); }
    }
    record("mobile: no page-level horizontal overflow", !overflow);

    await mp.goto(BASE + "/", { waitUntil: "networkidle" });
    const menuBtn = mp.getByRole("button", { name: /^Menu$/ });
    record("mobile: menu button visible", await menuBtn.isVisible());
    await menuBtn.click();
    await mp.waitForTimeout(300);
    record("mobile: menu opens with all nav links",
      (await mp.locator("#mobile-nav a").count()) === 8, `${await mp.locator("#mobile-nav a").count()} links`);
    await mp.locator("#mobile-nav a", { hasText: "Market Signals" }).click();
    await mp.waitForTimeout(600);
    record("mobile: navigation works and menu closes",
      mp.url().endsWith("/market-signals") && (await mp.locator("#mobile-nav").count()) === 0);
  }
  await mctx.close();

  /* Console ------------------------------------------------------------- */
  record("no console errors or warnings", consoleIssues.length === 0, consoleIssues.slice(0, 5).join(" | "));

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

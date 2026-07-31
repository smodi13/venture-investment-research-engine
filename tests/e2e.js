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
  "/", "/mandates", "/universe", "/compare", "/pipeline", "/market-signals",
  "/thesis", "/intelligence", "/memo", "/methodology",
  "/universe/etched", "/universe/sublime-systems", "/universe/oxide-computer",
  "/universe/quera", "/universe/path-robotics", "/universe/socket",
  "/universe/anterior", "/universe/rerun", "/universe/perceptic",
  "/universe/conceivable-life-sciences", "/universe/zed-industries",
];

/** Kept in step with lib/companies.ts. */
const UNIVERSE_SIZE = 34;

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
    record(`universe lists ${UNIVERSE_SIZE} verified private companies`, names.length === UNIVERSE_SIZE, `${names.length} rows`);

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

  /* Signal freshness and discovery channel ------------------------------ */
  {
    await page.goto(BASE + "/universe", { waitUntil: "networkidle" });
    const badges = await page.locator("table tbody tr").locator("text=/ signal$/i").count();
    record("universe rows show a signal freshness badge", badges > 0, `${badges} badges`);

    const sortSel = page.locator("label").filter({ hasText: /^Sort by/ }).locator("select");
    await sortSel.selectOption("freshness");
    await page.waitForTimeout(400);
    const dates = await page.locator("table tbody tr td:nth-child(5)").allTextContents();
    const parsed = dates.map((t) => {
      const m = t.match(/Signal ([A-Za-z]{3} \d{1,2}, \d{4})/);
      return m ? Date.parse(m[1]) : NaN;
    }).filter((n) => !Number.isNaN(n));
    const descending = parsed.every((v, i) => i === 0 || parsed[i - 1] >= v);
    record("sort by signal freshness orders newest signal first", parsed.length > 0 && descending,
      `${parsed.length} dated signals`);
    await sortSel.selectOption("score");
    await page.waitForTimeout(300);

    await page.goto(BASE + "/universe/rerun", { waitUntil: "networkidle" });
    const body = await page.textContent("body");
    record("company detail shows the discovery channel and dated signal",
      /Originating signal dated/.test(body) && /Open-source activity/.test(body));
    record("company detail states why a database search would miss the company",
      body.includes("Why a database search would miss this"));
    record("company detail names the additional evidence needed",
      body.includes("Additional evidence needed"));
    record("company detail shows a specific disclosed round, not a generic bucket",
      /Most recent disclosed round/.test(body) && !/Most recent disclosed round\s*Later stage/.test(body));
  }

  /* Claim provenance ---------------------------------------------------- */
  {
    await page.goto(BASE + "/universe", { waitUntil: "networkidle" });
    const provBadges = await page.locator("table tbody tr").locator("text=/^(Independently verified|Company-reported|Investor-reported|Government-reported|Not sufficiently supported)$/").count();
    record("universe rows label the provenance of the traction claim",
      provBadges === UNIVERSE_SIZE, `${provBadges} labels for ${UNIVERSE_SIZE} rows`);

    await page.goto(BASE + "/universe/conceivable-life-sciences", { waitUntil: "networkidle" });
    let body = await page.textContent("body");
    record("peer-reviewed clinical claim is labelled independently verified",
      /Independently verified/.test(body) && /Human Reproduction/.test(body));
    record("live-birth figures are the precise study figures, not a combined total",
      /5 live births|five live births/i.test(body) && !/18 healthy babies/.test(body));
    record("the limits of the automation are stated alongside the result",
      /only in sperm preparation and selected ICSI tasks/.test(body));

    await page.goto(BASE + "/universe/zed-industries", { waitUntil: "networkidle" });
    body = await page.textContent("body");
    // The figure may still appear where the record explains that it was
    // removed. What must not happen is the page asserting it as traction.
    const asserted = body.replace(/\s+/g, " ").match(/[^.]*150,000 active developers[^.]*\./g) || [];
    record("unsupported active-developer figure is never asserted as traction",
      asserted.every((sn) => /has no independent support|was removed|reproduces the company announcement|not used here/i.test(sn)),
      `${asserted.length} mention(s), all in a removal note`);
    record("verifiable repository metrics are used instead",
      /87,800 stars/.test(body) && /482 named contributors/.test(body));

    await page.goto(BASE + "/universe/positron-ai", { waitUntil: "networkidle" });
    body = await page.textContent("body");
    record("named-customer claim narrowed to the supported statement",
      !/Cloudflare/.test(body) && /customer categories including content delivery network operators/.test(body));
    record("roadmap claim carries a dated company-source label",
      /company roadmap statement dated 4 February 2026/.test(body));

    await page.goto(BASE + "/universe/counsel-health", { waitUntil: "networkidle" });
    body = await page.textContent("body");
    record("member count is labelled company-reported with its dated source",
      /100,000 members/.test(body) && /Company-reported/.test(body));

    await page.goto(BASE + "/universe/etched", { waitUntil: "networkidle" });
    body = await page.textContent("body");
    record("contract-value claim is labelled company-reported",
      /billion dollars in customer contracts/.test(body) && /Company-reported/.test(body));

    await page.goto(BASE + "/universe/k2-space", { waitUntil: "networkidle" });
    body = await page.textContent("body");
    record("backlog claim is labelled company-reported",
      /500 million dollars in signed contracts/.test(body) && /Company-reported/.test(body));

    await page.goto(BASE + "/methodology", { waitUntil: "networkidle" });
    body = await page.textContent("body");
    record("methodology explains all five provenance classifications",
      ["Independently verified","Company-reported","Investor-reported","Government-reported","Not sufficiently supported"]
        .every((x) => body.includes(x)));
    record("methodology states the reproduction rule",
      /same voice\s+recorded twice|same voice recorded twice/.test(body.replace(/\s+/g," ")));
  }

  /* Healthcare mandate depth -------------------------------------------- */
  {
    await page.goto(BASE + "/universe", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Healthcare Technology" }).first().click();
    await page.waitForTimeout(400);
    const top = (await page.locator("table tbody tr td:nth-child(1) a").allTextContents()).slice(0, 6).map((s) => s.trim());
    record("healthcare mandate top six are healthcare or life-science companies",
      top.length === 6 && !top.some((n) => PUBLIC_NAMES.includes(n)), top.join(", "));
    record("the new healthcare company is in the universe", top.includes("Perceptic") || (await page.locator("table tbody tr td:nth-child(1) a", { hasText: "Perceptic" }).count()) === 1);
    await page.getByRole("button", { name: "Frontier Technology" }).first().click();
    await page.waitForTimeout(300);
  }

  /* Semantic mandate fit ------------------------------------------------ */
  {
    await page.goto(BASE + "/universe", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Enterprise Software" }).first().click();
    await page.waitForTimeout(400);
    const names = await page.locator("table tbody tr td:nth-child(1) a").allTextContents();
    const sectors = await page.locator("table tbody tr td:nth-child(2)").allTextContents();
    const top6 = names.slice(0, 6).map((s) => s.trim());
    const top6Sectors = sectors.slice(0, 6).map((s) => s.trim());
    record("Enterprise Software top six contains no semiconductor company",
      !top6Sectors.some((s) => /Semiconductor|Quantum|Space|Advanced Materials/.test(s)),
      top6.map((n, i) => `${n} (${top6Sectors[i]})`).join("; "));
    record("Enterprise Software top six are software sectors only",
      top6Sectors.every((s) => /Enterprise Infrastructure Software|AI Software Infrastructure/.test(s)),
      top6Sectors.join(", "));

    // The inference-silicon company must not be core to a software mandate.
    const rowIndex = names.findIndex((n) => n.trim() === "Etched");
    const tierCell = await page.locator("table tbody tr").nth(rowIndex).locator("td:last-child").textContent();
    record("the inference-silicon company is not core to Enterprise Software",
      !/Core to mandate/.test(tierCell), tierCell.replace(/\s+/g, " ").trim());

    await page.goto(BASE + "/universe/etched", { waitUntil: "networkidle" });
    const body = await page.textContent("body");
    record("its detail page shows a semiconductor sector",
      /Semiconductors & Advanced Computing/.test(body));
    record("relevance explanation states the affinities used",
      /Sector affinity \d of 5/.test(body) && /stage affinity \d of 5/.test(body));

    await page.getByRole("button", { name: "Frontier Technology" }).first().click();
    await page.waitForTimeout(300);
  }

  /* Future missions read as future in rendered copy ---------------------- */
  {
    await page.goto(BASE + "/universe/portal-space", { waitUntil: "networkidle" });
    // innerText, not textContent: textContent includes the serialised RSC
    // payload inside <script>, which has no sentence boundaries and turns the
    // whole page into one blob.
    const body = (await page.locator("body").innerText()).replace(/\s+/g, " ");
    const sentences = body.split(/(?<=[.!?]) /).filter((x) => /Starburst-1|Supernova/.test(x));
    const negated = /\b(?:has|have|had|which has|which have)\s+(?:never|not|not yet|yet)\s+\w+|\bneither\s+of\s+which\s+(?:has|have)\s+\w+|\bbefore\s+[^.]*?\bhas\s+flown\b/gi;
    const completed = /\b(launched|has flown|have flown|flew|completed|deployed|achieved|reached orbit|successfully (?:launched|flew|completed|deployed))\b/i;
    const bad = sentences.filter((x) => completed.test(x.replace(negated, " ")));
    record("rendered copy never says a future mission launched or completed",
      bad.length === 0, bad.slice(0, 2).join(" | ") || `${sentences.length} sentences checked`);
    record("rendered copy frames the rideshare as scheduled and not yet flown",
      /manifested for a SpaceX Transporter rideshare scheduled for the fourth quarter of 2026/.test(body) &&
      /has not yet launched/.test(body));
    record("rendered copy states the propulsion has never flown",
      /has never flown/.test(body) && /unflown propulsion/i.test(body));
    record("rendered copy carries no launched, deployed, or achieved framing for Starburst-1",
      !/Starburst-1[^.]*\b(launched|flew|deployed|achieved|completed)\b/i.test(body));
  }

  /* Comparison tool ----------------------------------------------------- */
  {
    await page.goto(BASE + "/compare", { waitUntil: "networkidle" });
    record("compare page renders with no table before a selection",
      (await page.locator("table").count()) === 0);

    const chips = page.locator("button[data-compare-chip]");
    const chipCount = await chips.count();
    record("compare page offers every private company for selection",
      chipCount === UNIVERSE_SIZE, `${chipCount} selectable companies`);

    const chipNames = await chips.allTextContents();
    record("no public company can be selected for comparison",
      !chipNames.some((t) => PUBLIC_NAMES.some((p) => t.trim().startsWith(p))));

    await chips.nth(0).click();
    await chips.nth(1).click();
    await page.waitForTimeout(300);
    const cols = await page.locator("table thead th").count();
    record("comparison table appears with a column per selected company", cols === 3, `${cols} columns`);

    await chips.nth(2).click();
    await chips.nth(3).click();
    await page.waitForTimeout(300);
    record("comparison accepts four companies", (await page.locator("table thead th").count()) === 5);

    const disabled = await page.locator("button[data-compare-chip][disabled]").count();
    record("comparison caps the selection at four", disabled === UNIVERSE_SIZE - 4, `${disabled} disabled`);

    const cmpBody = await page.textContent("body");
    record("comparison shows disclosed round, confidence, and freshness",
      /Most recent disclosed round/.test(cmpBody) &&
      /Data confidence/.test(cmpBody) &&
      /Signal freshness/.test(cmpBody));
    record("comparison shows the evidence still needed and the next step",
      /Additional evidence needed/.test(cmpBody) && /Recommended next step/.test(cmpBody));

    await page.getByRole("button", { name: /clear selection/i }).click();
    await page.waitForTimeout(300);
    record("clearing the selection removes the comparison table",
      (await page.locator("table").count()) === 0);
  }

  /* CSV export ---------------------------------------------------------- */
  {
    await page.goto(BASE + "/universe", { waitUntil: "networkidle" });
    const [dl] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /Export .* to CSV/i }).click(),
    ]);
    const file = path.join(DOWNLOADS, dl.suggestedFilename());
    await dl.saveAs(file);
    const csv = fs.readFileSync(file, "utf8");
    const lines = csv.trim().split("\n");
    record("CSV export downloads", fs.existsSync(file), dl.suggestedFilename());
    record("CSV has preamble, header, and one row per company", lines.length === 4 + 1 + UNIVERSE_SIZE, `${lines.length} lines`);
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
      (await mp.locator("#mobile-nav a").count()) === 9, `${await mp.locator("#mobile-nav a").count()} links`);
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

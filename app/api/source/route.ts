import { NextResponse } from "next/server";
import { COMPANIES } from "@/lib/companies";
import { companyTotal } from "@/lib/scoring";

/**
 * Server-side sourcing endpoint.
 *
 * This route demonstrates the secure pattern for live sourcing: any API
 * credential is read from process.env on the server and is NEVER sent to the
 * browser. The public deployment runs in demonstration mode and returns the
 * bundled sample dataset, so a reviewer never has to supply a key and can
 * never trigger paid API usage from the web.
 *
 * Real, paid sourcing against the X API is handled by the governed
 * command-line engine in this repository, which gates every live call behind a
 * query validator, a counts-only preflight, a cost budget, and explicit human
 * confirmation. That governance is intentionally not exposed as a one-click
 * web action.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  // Presence check only. The value is never logged or returned.
  const liveConfigured = Boolean(process.env.X_BEARER_TOKEN);

  try {
    return NextResponse.json({
      mode: "demo",
      liveConfigured,
      note: liveConfigured
        ? "Live credentials detected on the server. This endpoint still runs in demonstration mode; real X API sourcing runs only through the governed CLI engine."
        : "No live credentials configured. Running in demonstration mode with the bundled sample dataset.",
      disclaimer:
        "Every record is an illustrative sample. Company names, founder names, X handles, post text, engagement counts, and funding figures are invented to demonstrate the workflow. No factual claim is made about any real business, account, or person.",
      count: COMPANIES.length,
      leads: COMPANIES.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        stage: c.stage,
        region: c.region,
        score: companyTotal(c),
        visibility: c.visibility,
        daysAheadOfDatabases: c.daysAheadOfDatabases,
        signalType: c.signal.type,
        signalObservedAt: c.signal.observedAt,
        isDemo: c.isDemo,
      })),
    });
  } catch {
    return NextResponse.json(
      {
        mode: "error",
        liveConfigured,
        note: "Sourcing failed. No data returned.",
        count: 0,
        leads: [],
      },
      { status: 200 },
    );
  }
}

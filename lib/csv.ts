import type { MandateId } from "./mandates";
import { scoreBand } from "./scoring";
import type { WorkflowRow } from "./storage";

/**
 * CSV export.
 *
 * The export carries provenance columns alongside the values. A file that left
 * this application without them would let an analyst estimate be pasted into a
 * model as though it were a reported figure, which is the exact failure the
 * rest of the platform is built to prevent.
 *
 * It operates on the compact workflow row rather than the full company record,
 * because that is what both the universe table and the pipeline actually hold.
 */

function esc(value: string | number | null | undefined): string {
  const s = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const HEADERS = [
  "Company",
  "Record type",
  "Market",
  "Ticker",
  "Sector",
  "Subsector",
  "Stage",
  "HQ",
  "Region",
  "Founded",
  "Mandate",
  "Score (of 100)",
  "Score band",
  "Capital intensity",
  "Commercial readiness",
  "Market maturity",
  "Pipeline status",
  "Priority",
  "Owner",
  "Next step",
  "Next step date",
  "Key risk",
  "Capital raised",
  "Capital raised provenance",
  "Market cap",
  "Revenue growth",
  "Gross margin",
  "Traction signal",
  "Traction provenance",
  "Last reviewed",
  "Notes",
];

export function recordsToCsv(
  records: WorkflowRow[],
  mandateId: MandateId,
  mandateName: string,
): string {
  const rows = records.map((r) => {
    const score = r.scores[mandateId];
    return [
      r.name,
      r.isDemonstration ? "Demonstration data" : "Real company",
      r.marketType,
      r.ticker ?? "",
      r.sector,
      r.subsector,
      r.stage,
      r.hq,
      r.region,
      r.foundedYear,
      mandateName,
      score,
      scoreBand(score).label,
      r.capitalIntensity,
      r.commercialReadiness,
      r.marketMaturity,
      r.status,
      r.priority,
      r.owner,
      r.nextStep,
      r.nextStepDate,
      r.keyRisk,
      r.capitalRaised,
      r.marketType === "Private" ? r.capitalRaisedProvenance : "not-applicable",
      r.marketCap,
      r.revenueGrowth,
      r.grossMargin,
      r.tractionSignal,
      r.tractionProvenance,
      r.lastReviewed,
      r.notes,
    ]
      .map(esc)
      .join(",");
  });

  const preamble = [
    `# Venture Investment Research Engine export. Mandate: ${mandateName}. Generated ${new Date().toISOString().slice(0, 10)}.`,
    "# Scores reflect an illustrative research framework and are not investment advice.",
    "# Rows marked Demonstration data describe fictional companies. Rows marked Real company carry dated estimates requiring verification against primary filings.",
  ].join("\n");

  return [preamble, HEADERS.join(","), ...rows].join("\n");
}

export function downloadFile(
  filename: string,
  contents: string,
  mime: string,
): void {
  const blob = new Blob([contents], { type: `${mime};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoking synchronously can cancel a download that has not started yet in
  // some browsers, so the handle is released on a later tick instead.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export const downloadCsv = (filename: string, csv: string) =>
  downloadFile(filename, csv, "text/csv");

export const downloadMarkdown = (filename: string, md: string) =>
  downloadFile(filename, md, "text/markdown");

export const downloadText = (filename: string, text: string) =>
  downloadFile(filename, text, "text/plain");

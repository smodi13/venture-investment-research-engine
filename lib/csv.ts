import type { MandateId } from "./mandates";
import { scoreBand } from "./scoring";
import type { WorkflowRow } from "./storage";

/**
 * CSV export.
 *
 * The export carries data confidence, the sourcing rationale, and the source
 * count alongside the score, so a figure cannot be pasted into a model without
 * the caveats that qualify it. It contains only private companies, because
 * only private companies exist in the sourcing universe.
 */

function esc(value: string | number | null | undefined): string {
  const s = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const HEADERS = [
  "Company",
  "Website",
  "Sector",
  "Subsector",
  "Financing stage",
  "Headquarters",
  "Region",
  "Founded",
  "Founders",
  "Latest disclosed financing",
  "Financing announced",
  "Total disclosed funding",
  "Named investors",
  "Mandate",
  "Score (of 100)",
  "Score band",
  "Data confidence",
  "Sourcing signal",
  "Date sourced",
  "Why sourced",
  "Pipeline status",
  "Priority",
  "Key unanswered question",
  "Next diligence step",
  "Next-step date",
  "Notes",
  "Sources",
  "Date last reviewed",
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
      r.website,
      r.sector,
      r.subsector,
      r.stage,
      r.headquarters,
      r.region,
      r.foundedYear,
      r.founders,
      r.latestRound,
      r.latestRoundDate,
      r.totalDisclosedFunding,
      r.namedInvestors,
      mandateName,
      score,
      scoreBand(score).label,
      r.dataConfidence,
      r.sourcingSignal,
      r.dateSourced,
      r.whyEntered,
      r.status,
      r.priority,
      r.keyUnansweredQuestion,
      r.nextStep,
      r.nextStepDate,
      r.notes,
      r.sourceCount,
      r.lastReviewed,
    ]
      .map(esc)
      .join(",");
  });

  const preamble = [
    `# Venture Sourcing Engine export. Mandate: ${mandateName}. Generated ${new Date().toISOString().slice(0, 10)}.`,
    "# All companies are real and were verified as independently private on 30 July 2026. No public companies and no fictional companies are included.",
    "# Scores combine verified evidence with clearly identified analyst judgment and are not investment advice.",
    "# Pipeline status, priority, and notes are demonstration workflow data. Company facts are sourced and dated.",
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

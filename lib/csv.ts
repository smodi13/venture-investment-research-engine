import { companyTotal } from "./scoring";
import type { LeadRecord } from "./types";

function esc(value: string | number): string {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const HEADERS = [
  "Company",
  "Founder",
  "HQ",
  "Region",
  "Category",
  "Stage",
  "Est. Funding (USD)",
  "Founded",
  "Pipeline Status",
  "Sourcing Score",
  "Signal Type",
  "Signal Handle",
  "Signal Observed",
  "Database Visibility",
  "Days Ahead of Databases",
  "Date Discovered",
  "Website",
  "Record Type",
];

export function leadsToCsv(leads: LeadRecord[]): string {
  const rows = leads.map((l) =>
    [
      l.name,
      l.founder,
      l.hq,
      l.region,
      l.category,
      l.stage,
      l.fundingRaisedUSD,
      l.foundedYear,
      l.status,
      companyTotal(l),
      l.signal.type,
      l.signal.handle,
      l.signal.observedAt,
      l.visibility,
      l.daysAheadOfDatabases,
      l.dateDiscovered,
      l.website,
      l.isDemo ? "Demonstration sample" : "Verified",
    ]
      .map(esc)
      .join(","),
  );
  return [HEADERS.join(","), ...rows].join("\n");
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

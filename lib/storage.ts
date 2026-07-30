import { COMPANIES } from "./companies";
import type { Company, LeadRecord, PipelineStatus } from "./types";

const STORAGE_KEY = "vire.leads.v1";

/** Default pipeline placement for the demo dataset. */
const DEFAULT_STATUS: Record<string, PipelineStatus> = {
  "lead-01": "Partner Review",
  "lead-02": "Researching",
  "lead-03": "New Signal",
  "lead-04": "Partner Review",
  "lead-05": "Founder Outreach",
  "lead-06": "Researching",
  "lead-07": "New Signal",
  "lead-08": "Founder Outreach",
  "lead-09": "Researching",
  "lead-10": "New Signal",
  "lead-11": "Researching",
  "lead-12": "Founder Outreach",
  "lead-13": "New Signal",
  "lead-14": "New Signal",
  "lead-15": "Partner Review",
  "lead-16": "Researching",
  "lead-17": "Partner Review",
  "lead-18": "New Signal",
  "lead-19": "Founder Outreach",
  "lead-20": "Passed",
};

const DEFAULT_NOTES: Record<string, string> = {
  "lead-02":
    "Pre-entity. Worth a call now precisely because there is nothing to look up yet. If a round forms it will form fast and quietly.",
  "lead-06":
    "Tracking rather than pursuing. The open question is whether this is a company or a community standard, asked directly in the outreach.",
  "lead-19":
    "Highest founder conviction in the pipeline, lowest evidence of commercial intent. Keep warm; do not push a fundraise conversation yet.",
  "lead-20":
    "Passed on timing, not quality. Earliness scored 2/13: fully profiled and funded before our signal fired. Retained as a calibration example for the visibility filter.",
};

interface Override {
  status?: PipelineStatus;
  notes?: string;
}

type OverrideMap = Record<string, Override>;

function readOverrides(): OverrideMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OverrideMap) : {};
  } catch {
    return {};
  }
}

function writeOverrides(map: OverrideMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function baseRecord(company: Company): LeadRecord {
  return {
    ...company,
    status: DEFAULT_STATUS[company.id] ?? "New Signal",
    notes: DEFAULT_NOTES[company.id] ?? "",
  };
}

export function loadLeads(): LeadRecord[] {
  const overrides = readOverrides();
  return COMPANIES.map((c) => {
    const base = baseRecord(c);
    const o = overrides[c.id];
    if (!o) return base;
    return {
      ...base,
      status: o.status ?? base.status,
      notes: o.notes ?? base.notes,
    };
  });
}

export function updateStatus(id: string, status: PipelineStatus): void {
  const overrides = readOverrides();
  overrides[id] = { ...overrides[id], status };
  writeOverrides(overrides);
}

export function updateNotes(id: string, notes: string): void {
  const overrides = readOverrides();
  overrides[id] = { ...overrides[id], notes };
  writeOverrides(overrides);
}

export function resetDemo(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

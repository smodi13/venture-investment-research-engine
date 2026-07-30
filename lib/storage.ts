"use client";

import { useSyncExternalStore } from "react";
import type { UniverseRow } from "./rows";
import type { PipelineFields, PipelineStage, Priority } from "./types";

/**
 * Workflow state.
 *
 * Everything a user changes lives in this browser only. There is no account,
 * no database, and no server-side write path anywhere in the application.
 *
 * Local storage is treated as what it is: an external store outside React.
 * It is read through useSyncExternalStore rather than through an effect, so
 * the server render and the hydrated render agree without a mismatch and
 * without a cascading re-render on mount.
 *
 * This module imports the compact row type rather than the full company
 * dataset, so adding workflow state to a page does not drag the entire
 * research corpus into the client bundle.
 */

const STORAGE_KEY = "vire.pipeline.v1";
const MANDATE_KEY = "vire.mandate.v1";

export const TODAY = "2026-07-29";

/** Deterministic starting placement, so the platform opens in a considered state. */
const DEFAULT_STATUS: Record<string, PipelineStage> = {
  nvda: "Monitoring",
  amd: "Monitoring",
  avgo: "Monitoring",
  mu: "Initial research",
  arm: "Monitoring",
  alab: "Initial research",
  crdo: "Monitoring",
  vrt: "Deep diligence",
  ionq: "Monitoring",
  sdgr: "Initial research",
  tem: "Monitoring",
  be: "Passed",
  "larkspur-systems": "First meeting",
  "meridian-fabric": "Deep diligence",
  "coldbrook-thermal": "Investment memo",
  "halden-compute": "Passed",
  "anvil-grid": "Partner review",
  "wrenfield-robotics": "Founder outreach",
  "tidewater-autonomy": "Deep diligence",
  "palisade-quantum": "Monitoring",
  "kestrel-bio": "Initial research",
  "ferrule-photonics": "Founder outreach",
  "ravelin-data": "First meeting",
  "sable-health": "Initial research",
  "halyard-systems": "Partner review",
  "corvid-security": "Founder outreach",
  "alder-clinical": "First meeting",
};

const DEFAULT_PRIORITY: Record<string, Priority> = {
  vrt: "High",
  "larkspur-systems": "High",
  "meridian-fabric": "High",
  "coldbrook-thermal": "High",
  "anvil-grid": "High",
  "ferrule-photonics": "High",
  "ravelin-data": "High",
  nvda: "Low",
  amd: "Low",
  arm: "Low",
  crdo: "Low",
  ionq: "Low",
  tem: "Low",
  be: "Low",
  "halden-compute": "Low",
  "palisade-quantum": "Low",
  "halyard-systems": "High",
  "alder-clinical": "High",
};

/** Notes written on the records where the analyst has an actual view. */
const DEFAULT_NOTES: Record<string, string> = {
  "anvil-grid":
    "The strongest asset here is not the software, it is three utility approvals that took two years each. Ask a utility engineer, not the founder, whether the pending standard revision changes anything.",
  "meridian-fabric":
    "Everything depends on qualification data we have not seen. Do not progress past diligence until the in-rack thermal numbers arrive. Laboratory results are not the question.",
  "halden-compute":
    "Passed on structure rather than on quality. The preference stack means a good outcome returns very little to a new common holder, and the next tape-out must be funded before pilots convert.",
  "coldbrook-thermal":
    "Ready for memo. The open item is three-year coolant chemistry from the two oldest sites, which is the risk that would only appear long after we invested.",
  "ferrule-photonics":
    "Genuinely overlooked. Everyone funds photonic chips and nobody funds the alignment step that sets their cost. Timing risk on co-packaged optics is a reason to be careful, not a reason to pass.",
  be: "Passed on capital efficiency and history rather than on current demand. Two decades of losses and repeated financing is a pattern, and the demand driver is a grid constraint utilities are actively working to remove.",
  "halyard-systems":
    "The clearest case in the pipeline. Break-even before the Series B, gross retention above ninety five percent, and four of six largest customers in a third contract year. The only real question is whether audit firms bundle this before the category sets.",
  "corvid-security":
    "Right primitive, no evidence. Do not price this until the first renewal cohort lands, which is roughly nine months out. Nothing else will tell us whether it is bought or merely trialled.",
  "alder-clinical":
    "The measurement work is already done, which is rare this early. The question is not whether it works but whether a sponsor will ever pay for it. Ask a sponsor, not a site.",
  "ravelin-data":
    "Best retention in the private set on the least capital. The single question that matters is retention among customers whose warehouse vendor has already shipped native lineage.",
};

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

export function baseFields(row: UniverseRow): PipelineFields {
  return {
    status: DEFAULT_STATUS[row.id] ?? "New lead",
    priority: DEFAULT_PRIORITY[row.id] ?? "Medium",
    owner: "Sahil Modi",
    dateSourced: row.lastReviewed,
    lastActivity: row.lastReviewed,
    nextStep: truncate(row.recommendedNextStep, 150),
    nextStepDate: TODAY,
    notes: DEFAULT_NOTES[row.id] ?? "",
    keyRisk: row.investmentRisk,
    source:
      row.marketType === "Public" ? "Public market screen" : "Sector research",
  };
}

export type Overrides = Record<string, Partial<PipelineFields>>;
export type WorkflowRow = UniverseRow & PipelineFields;

/* -------------------------------------------------------------------------- */
/* The external store                                                         */
/* -------------------------------------------------------------------------- */

const EMPTY_OVERRIDES: Overrides = Object.freeze({});

const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // Keep multiple tabs consistent with each other.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function emit(): void {
  for (const listener of listeners) listener();
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Storage can be unavailable in private browsing. Losing local workflow
    // edits is acceptable; breaking the page is not.
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Non-fatal, as above.
  }
}

/**
 * useSyncExternalStore requires a referentially stable snapshot, so the parsed
 * overrides are cached and only re-parsed when the underlying string changes.
 */
let cachedRaw: string | null = null;
let cachedOverrides: Overrides = EMPTY_OVERRIDES;

function getOverridesSnapshot(): Overrides {
  const raw = readRaw(STORAGE_KEY);
  if (raw === cachedRaw) return cachedOverrides;
  cachedRaw = raw;
  if (!raw) {
    cachedOverrides = EMPTY_OVERRIDES;
    return cachedOverrides;
  }
  try {
    cachedOverrides = JSON.parse(raw) as Overrides;
  } catch {
    cachedOverrides = EMPTY_OVERRIDES;
  }
  return cachedOverrides;
}

function getOverridesServerSnapshot(): Overrides {
  return EMPTY_OVERRIDES;
}

/** The current workflow overrides, kept in sync with local storage. */
export function useOverrides(): Overrides {
  return useSyncExternalStore(
    subscribe,
    getOverridesSnapshot,
    getOverridesServerSnapshot,
  );
}

export function mergeRow(row: UniverseRow, overrides: Overrides): WorkflowRow {
  return { ...row, ...baseFields(row), ...(overrides[row.id] ?? {}) };
}

export function mergeRows(
  rows: UniverseRow[],
  overrides: Overrides,
): WorkflowRow[] {
  return rows.map((r) => mergeRow(r, overrides));
}

export function updateRecord(id: string, patch: Partial<PipelineFields>): void {
  const current = getOverridesSnapshot();
  const next: Overrides = {
    ...current,
    [id]: { ...current[id], ...patch, lastActivity: TODAY },
  };
  writeRaw(STORAGE_KEY, JSON.stringify(next));
  emit();
}

export function resetWorkflow(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Non-fatal.
  }
  emit();
}

/* -------------------------------------------------------------------------- */
/* Mandate selection, also persisted locally                                  */
/* -------------------------------------------------------------------------- */

function getMandateSnapshot(): string | null {
  return readRaw(MANDATE_KEY);
}

function getMandateServerSnapshot(): string | null {
  return null;
}

/** The stored mandate id, or null when the visitor has not chosen one. */
export function useStoredMandate(): string | null {
  return useSyncExternalStore(
    subscribe,
    getMandateSnapshot,
    getMandateServerSnapshot,
  );
}

export function storeMandate(id: string): void {
  writeRaw(MANDATE_KEY, id);
  emit();
}

"use client";

import { useSyncExternalStore } from "react";
import type { UniverseRow } from "./rows";
import type { PipelineFields, PipelineStage, Priority } from "./types";

/**
 * Workflow state.
 *
 * Company facts are sourced and fixed. Only the workflow layer, meaning
 * status, priority, notes, and next steps, is editable, and it lives in this
 * browser only. There is no account, no database, and no server-side write
 * path anywhere in the application.
 *
 * The starting statuses below are demonstration workflow data. They are a
 * plausible arrangement of a research pipeline and do not indicate that any
 * meeting, outreach, or investment actually took place.
 */

const STORAGE_KEY = "vse.pipeline.v1";
const MANDATE_KEY = "vse.mandate.v1";

export const TODAY = "2026-07-30";

export const WORKFLOW_DISCLAIMER =
  "Pipeline status, priority, and notes are demonstration workflow data showing how the tool is used. They do not indicate that any meeting, outreach, or investment activity occurred. Company facts on every record are sourced and dated.";

/** Demonstration workflow placement. Company facts are unaffected by this. */
const DEFAULT_STATUS: Record<string, PipelineStage> = {
  etched: "Monitoring",
  "d-matrix": "Deep diligence",
  "ayar-labs": "Initial research",
  lightmatter: "Initial research",
  quera: "Deep diligence",
  "atom-computing": "Partner review",
  "path-robotics": "Founder outreach",
  "collaborative-robotics": "Initial research",
  "oxide-computer": "First meeting",
  chainguard: "Monitoring",
  "sublime-systems": "Investment memo",
  "base-power": "Passed",
  "antora-energy": "Deep diligence",
  "radiant-industries": "First meeting",
  "k2-space": "Initial research",
  "stoke-space": "Monitoring",
  "cradle-bio": "Founder outreach",
  openevidence: "Passed",
};

const DEFAULT_PRIORITY: Record<string, Priority> = {
  "d-matrix": "High",
  "atom-computing": "High",
  "path-robotics": "High",
  "oxide-computer": "High",
  "sublime-systems": "High",
  "antora-energy": "High",
  "cradle-bio": "High",
  etched: "Low",
  chainguard: "Low",
  "base-power": "Low",
  openevidence: "Low",
  "stoke-space": "Low",
};

/** Analyst notes. These are judgments about sourced facts, not invented facts. */
const DEFAULT_NOTES: Record<string, string> = {
  "d-matrix":
    "Best combination in the universe of a differentiated architecture and disclosed strategic backing. The gap is customer evidence: ecosystem partners are named, end customers are not. Do not progress past diligence until one is.",
  "sublime-systems":
    "Ready for memo. Two of the largest cement producers invested simultaneously and the product meets an external ASTM standard, which is stronger evidence than any vendor claim. Open item is whether the strategic investments carry offtake.",
  "base-power":
    "Passed on regulatory concentration rather than on quality. The entire customer proposition depends on grid services revenue set by regulators, and the model has not yet been proven in a second regulatory regime.",
  openevidence:
    "Passed on valuation and disclosure. Adoption is genuinely exceptional and independently reported. The business model is not public, which makes a twelve billion dollar reference point impossible to underwrite from outside.",
  "atom-computing":
    "Strongest published error-correction evidence in the quantum set. Note carefully that a third of the announced funding is a government letter of intent rather than committed capital, and the terms are not public.",
  "path-robotics":
    "Most genuinely overlooked position in the universe. Columbus based, unglamorous category, founders who welded before they built robots. The question is deployment cost for the second cell versus the first.",
  "oxide-computer":
    "Two national laboratories as named customers is a stronger reference than any enterprise logo. Ask them what they evaluated against.",
  "antora-energy":
    "Industrial heat is a larger emissions category than grid storage and attracts a fraction of the attention. ARPA-E documentation plus a commissioned project is a good evidence combination.",
  etched:
    "Monitoring rather than pursuing. Technically the most aggressive specialisation trade available, and at this valuation there is little left for a new investor unless the outcome is exceptional.",
  "ayar-labs":
    "Both major accelerator vendors on the same cap table is a rare signal. Record is low confidence: no founder names, no founding year, no total raised. Close those before anything else.",
};

/** The single question that most needs answering, per company. */
const KEY_QUESTIONS: Record<string, string> = {
  etched: "Has any customer confirmed a delivered and accepted rack?",
  "d-matrix": "Which named end customer is running production traffic?",
  "ayar-labs": "Who founded the company, and what is total capital raised?",
  lightmatter: "Is there any design win at all?",
  quera: "How is logical qubit progress tracking against the 2028 roadmap?",
  "atom-computing":
    "What conditions attach to the Department of Commerce letter of intent?",
  "path-robotics":
    "How long does the second cell take to deploy against the first?",
  "collaborative-robotics": "Has any financing closed since April 2024?",
  "oxide-computer": "How many customers have ordered a second rack?",
  chainguard: "What is current revenue against the April 2025 disclosure?",
  "sublime-systems":
    "Do the strategic investments carry offtake commitments?",
  "base-power":
    "How does the model perform under a less favourable grid services regime?",
  "antora-energy":
    "How has the commissioned project performed through a full production year?",
  "radiant-industries":
    "What are the pass criteria for the fuelled test, and what is the licensing path?",
  "k2-space": "Has the first production satellite flown, and how did it perform?",
  "stoke-space": "What has slipped against the original first flight schedule?",
  "cradle-bio":
    "How do predictions compare with open source models on prospective tasks?",
  openevidence: "What is the business model?",
};

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

export function baseFields(row: UniverseRow): PipelineFields {
  return {
    status: DEFAULT_STATUS[row.id] ?? "New lead",
    priority: DEFAULT_PRIORITY[row.id] ?? "Medium",
    keyUnansweredQuestion:
      KEY_QUESTIONS[row.id] ?? truncate(row.keyUnansweredQuestion, 120),
    nextStep: truncate(row.recommendedNextStep, 150),
    nextStepDate: TODAY,
    notes: DEFAULT_NOTES[row.id] ?? "",
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
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in private browsing. Losing local workflow
    // edits is acceptable; breaking the page is not.
  }
}

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
  const next: Overrides = { ...current, [id]: { ...current[id], ...patch } };
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
/* Mandate selection                                                          */
/* -------------------------------------------------------------------------- */

function getMandateSnapshot(): string | null {
  return readRaw(MANDATE_KEY);
}

function getMandateServerSnapshot(): string | null {
  return null;
}

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

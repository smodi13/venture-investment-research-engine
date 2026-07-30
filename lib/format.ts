import type { Fact } from "./types";

export function formatUsd(usd: number | null): string {
  if (usd === null) return "Not disclosed";
  if (usd <= 0) return "None disclosed";
  if (usd >= 1_000_000_000) {
    const b = usd / 1_000_000_000;
    return `$${b % 1 === 0 ? b.toFixed(0) : b.toFixed(1)}B`;
  }
  if (usd >= 1_000_000) {
    const m = usd / 1_000_000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  return `$${Math.round(usd / 1000)}K`;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * How old a dated figure is. Research staleness is a real risk in a platform
 * built on a static snapshot, so the interface states the age rather than
 * leaving the reader to compute it.
 */
export function ageInDays(iso: string, today = "2026-07-29"): number {
  const then = new Date(`${iso}T00:00:00`).getTime();
  const now = new Date(`${today}T00:00:00`).getTime();
  if (Number.isNaN(then) || Number.isNaN(now)) return 0;
  return Math.max(0, Math.round((now - then) / 86_400_000));
}

export function describeAge(iso: string): string {
  const days = ageInDays(iso);
  if (days === 0) return "today";
  if (days === 1) return "1 day old";
  if (days < 45) return `${days} days old`;
  const months = Math.round(days / 30);
  return months === 1 ? "1 month old" : `${months} months old`;
}

/** Renders the value of a fact, or the reason it is absent. */
export function factText(fact: Fact<string | number>): string {
  if (fact.value === null) {
    return fact.provenance === "unverified"
      ? "Requires verification"
      : "Not publicly disclosed";
  }
  return typeof fact.value === "number"
    ? formatUsd(fact.value)
    : String(fact.value);
}

import { NOT_DISCLOSED, type SignalFreshness } from "./types";

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
export function ageInDays(iso: string, today = "2026-07-30"): number {
  const then = new Date(`${iso}T00:00:00`).getTime();
  const now = new Date(`${today}T00:00:00`).getTime();
  if (Number.isNaN(then) || Number.isNaN(now)) return 0;
  return Math.max(0, Math.round((now - then) / 86_400_000));
}

export function describeAge(iso: string): string {
  const days = ageInDays(iso);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 45) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 24) return `${months} months ago`;
  return `${Math.round(months / 12)} years ago`;
}

/** Renders a value that may be the not-disclosed sentinel. */
export function display(value: string | number): string {
  return value === NOT_DISCLOSED ? NOT_DISCLOSED : String(value);
}

export function isMissing(value: string | number): boolean {
  return value === NOT_DISCLOSED;
}

/**
 * How recent the signal that put a company into the pipeline actually is.
 *
 * This is deliberately separate from the score. A stale signal does not make a
 * company worse, it makes the reason for looking at it now weaker, and those
 * are different questions that a single number would blur together.
 */
export function signalFreshness(
  iso: string,
  today = "2026-07-30",
): SignalFreshness {
  const days = ageInDays(iso, today);
  if (days <= 90) return "Fresh";
  if (days <= 365) return "Recent";
  return "Established";
}

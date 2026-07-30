export function formatFunding(usd: number): string {
  if (usd <= 0) return "Undisclosed";
  if (usd >= 1_000_000) {
    const m = usd / 1_000_000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  const k = Math.round(usd / 1000);
  return `$${k}K`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function daysAgo(iso: string): string {
  const d = new Date(iso + "T00:00:00").getTime();
  const now = Date.now();
  const days = Math.round((now - d) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

/**
 * The headline earliness metric. Negative values mean the signal fired after
 * the company was already profiled, which is a miss worth stating plainly
 * rather than hiding.
 */
export function formatLeadTime(days: number): string {
  if (days < 0) return `${Math.abs(days)} days late`;
  if (days === 0) return "same day";
  return `${days} days early`;
}

import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-surface print:mt-4">
      <div className="container-page flex flex-col gap-5 py-9 text-xs leading-relaxed text-ink-muted lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="font-medium text-ink-soft">
            {SITE.name}, an independent research platform by {SITE.author}.
          </p>
          <p>{SITE.disclosure}</p>
        </div>
        <div className="space-y-2 lg:text-right">
          <p>
            Static research snapshot. No live data feed, no account, and no
            server-side storage of anything you change.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 lg:justify-end">
            <Link
              href="/methodology"
              className="font-medium text-accent hover:underline"
            >
              Methodology and sources
            </Link>
            <Link
              href="/thesis"
              className="font-medium text-accent hover:underline"
            >
              Featured thesis
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-4 border-t border-line bg-surface">
      <div className="container-page flex flex-col gap-4 py-8 text-xs leading-relaxed text-ink-muted sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-lg space-y-1.5">
          <p className="font-medium text-ink-soft">
            X Sourcing Engine, an independent demonstration by Sahil Modi.
          </p>
          <p>
            An independent demonstration project. Not affiliated with,
            endorsed by, or representing any investment firm or X Corp.
          </p>
        </div>
        <div className="space-y-1.5 sm:text-right">
          <p>
            Every company record is labeled demonstration data. No factual
            claim is made about any real business, account, or person.
          </p>
          <Link
            href="/engine"
            className="inline-block font-medium text-accent hover:underline"
          >
            How the engine works
          </Link>
        </div>
      </div>
    </footer>
  );
}

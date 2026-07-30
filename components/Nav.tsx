"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur print:hidden">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <Logo className="h-7 w-7 shrink-0" />
          <span className="text-sm font-semibold leading-tight tracking-tight text-ink">
            <span className="hidden sm:inline">{SITE.name}</span>
            <span className="sm:hidden">{SITE.shortName}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                isActive(l.href)
                  ? "bg-accent-soft text-accent"
                  : "text-ink-soft hover:bg-canvas hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="btn-secondary xl:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-line bg-surface xl:hidden"
        >
          <div className="container-page grid gap-0.5 py-3 sm:grid-cols-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(l.href)
                    ? "bg-accent-soft text-accent"
                    : "text-ink-soft hover:bg-canvas hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

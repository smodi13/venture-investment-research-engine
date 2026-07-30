import Link from "next/link";
import { SITE } from "@/lib/site";

/** Shared layout and typographic primitives. */

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-line bg-surface">
      <div className="container-page py-10 sm:py-12">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function Section({
  title,
  description,
  children,
  id,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="h-section">{title}</h2>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function StatTile({
  value,
  label,
  hint,
}: {
  value: string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="card p-4">
      <div className="font-mono text-2xl font-semibold tracking-tight text-ink">
        {value}
      </div>
      <div className="mt-1 text-sm font-medium text-ink">{label}</div>
      {hint && (
        <div className="mt-1 text-xs leading-relaxed text-ink-muted">{hint}</div>
      )}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink-soft">{children}</dd>
    </div>
  );
}

export function BulletList({
  items,
  tone = "neutral",
}: {
  items: readonly string[];
  tone?: "neutral" | "risk" | "positive";
}) {
  const dot =
    tone === "risk"
      ? "bg-amber-500"
      : tone === "positive"
        ? "bg-emerald-500"
        : "bg-ink-muted";
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
          <span
            aria-hidden="true"
            className={`mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full ${dot}`}
          />
          <span className="text-ink-soft">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function DisclosureNote({ className = "" }: { className?: string }) {
  return (
    <p
      className={`rounded-lg border border-line bg-canvas p-4 text-xs leading-relaxed text-ink-muted ${className}`}
    >
      {SITE.disclosure}
    </p>
  );
}

export function CrossLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="font-medium text-accent hover:underline">
      {children}
    </Link>
  );
}

/**
 * The public repository link. Rendered on the homepage, in the footer, and on
 * the methodology page so that a reviewer can inspect the data structure,
 * scoring model, source registry, and tests directly.
 */
export function GitHubLink({
  variant = "link",
  className = "",
}: {
  variant?: "link" | "button";
  className?: string;
}) {
  return (
    <a
      href={SITE.repository}
      target="_blank"
      rel="noopener noreferrer"
      className={
        variant === "button"
          ? `btn-secondary ${className}`
          : `font-medium text-accent hover:underline ${className}`
      }
    >
      {SITE.repositoryLabel}
    </a>
  );
}

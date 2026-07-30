"use client";

import Link from "next/link";
import { useState } from "react";
import { MEMO, memoToMarkdown, memoToText } from "@/lib/memo";
import { downloadMarkdown, downloadText } from "@/lib/csv";
import { DemonstrationBadge } from "./Provenance";
import { formatDate } from "@/lib/format";

export function MemoView() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(memoToText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="content-column">
      <div className="flex flex-wrap gap-2 print:hidden">
        <button type="button" onClick={copy} className="btn-secondary">
          {copied ? "Copied to clipboard" : "Copy memo"}
        </button>
        <button
          type="button"
          onClick={() =>
            downloadMarkdown(`investment-memo-${MEMO.companyId}.md`, memoToMarkdown())
          }
          className="btn-secondary"
        >
          Download Markdown
        </button>
        <button
          type="button"
          onClick={() =>
            downloadText(`investment-memo-${MEMO.companyId}.txt`, memoToText())
          }
          className="btn-secondary"
        >
          Download text
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-secondary"
        >
          Print view
        </button>
      </div>

      <header className="mt-8 border-b border-line pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow">Investment memo</span>
          <DemonstrationBadge />
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          {MEMO.companyName}
        </h1>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-1 text-sm text-ink-muted">
          <div className="flex gap-1.5">
            <dt className="font-medium text-ink-soft">Author</dt>
            <dd>{MEMO.author}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="font-medium text-ink-soft">Date</dt>
            <dd>{formatDate(MEMO.date)}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="font-medium text-ink-soft">Mandate</dt>
            <dd>{MEMO.mandate}</dd>
          </div>
        </dl>
      </header>

      <div className="mt-6 rounded-xl border border-accent-line bg-accent-soft p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Recommendation
        </p>
        <p className="mt-2 text-lg font-semibold text-ink">
          {MEMO.recommendation}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {MEMO.recommendationDetail}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          {MEMO.scoreNote}
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {MEMO.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="h-section">{section.heading}</h2>
            <div className="mt-3 space-y-3">
              {section.body.map((p) => (
                <p key={p} className="text-sm leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </div>
            {section.points && (
              <ul className="mt-3 space-y-2">
                {section.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink-muted"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <footer className="mt-10 space-y-3 border-t border-line pt-6 text-xs leading-relaxed text-ink-muted">
        <p>
          {MEMO.companyName} is a demonstration company. It is fictional and
          describes no real business. The memo is written on a fictional company
          precisely so that every judgment in it can be stated with the
          confidence a memo requires without asserting anything about a real
          one.
        </p>
        <p className="print:hidden">
          <Link
            href={`/universe/${MEMO.companyId}`}
            className="font-medium text-accent hover:underline"
          >
            See the full research record behind this memo
          </Link>
        </p>
      </footer>
    </article>
  );
}

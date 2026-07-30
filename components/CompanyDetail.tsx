"use client";

import { useEffect, useState } from "react";
import { PIPELINE_STATUSES } from "@/lib/types";
import type { Confidence, LeadRecord, PipelineStatus } from "@/lib/types";
import { companyTotal } from "@/lib/scoring";
import { formatFunding, formatDate } from "@/lib/format";
import { ScoreBars } from "./ScoreBars";
import { ScoreBadge, ScoreTierLabel } from "./ScoreBadge";
import { StatusBadge } from "./StatusBadge";
import { SignalCard } from "./SignalCard";

const CONFIDENCE_STYLES: Record<Confidence, string> = {
  Observed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Founder-reported": "border-amber-200 bg-amber-50 text-amber-800",
  Inferred: "border-slate-200 bg-slate-100 text-slate-600",
};

function ConfidenceTag({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${CONFIDENCE_STYLES[confidence]}`}
    >
      {confidence}
    </span>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="text-sm text-ink-soft">{children}</div>
    </div>
  );
}

function Block({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-5">
      <h4 className="text-sm font-semibold text-ink">{title}</h4>
      {subtitle && <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>}
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-ink-soft">{children}</p>
  );
}

export function CompanyDetail({
  lead,
  onClose,
  onStatusChange,
  onNotesChange,
}: {
  lead: LeadRecord;
  onClose: () => void;
  onStatusChange: (id: string, status: PipelineStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
}) {
  const [notes, setNotes] = useState(lead.notes);
  const [copied, setCopied] = useState(false);
  const total = companyTotal(lead);

  useEffect(() => {
    setNotes(lead.notes);
    setCopied(false);
  }, [lead.id, lead.notes]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    // Stop the page behind the panel from scrolling.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  async function copyOutreach() {
    try {
      await navigator.clipboard.writeText(lead.outreach);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${lead.name} sourcing card`}
        className="relative flex h-full w-full max-w-2xl animate-slide-in flex-col overflow-y-auto bg-surface shadow-panel"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-line bg-surface/95 px-6 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight text-ink">
                  {lead.name}
                </h2>
                {lead.isDemo && (
                  <span className="rounded border border-line px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-muted">
                    Sample record
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-ink-muted">
                {lead.category} · {lead.hq}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden text-right sm:block">
                <ScoreBadge score={total} />
              </div>
              <button
                onClick={onClose}
                className="btn-ghost -mr-2 px-2 py-1 text-sm"
                aria-label="Close panel"
              >
                Close
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={lead.status} />
            <ScoreTierLabel score={total} />
          </div>
        </div>

        <div className="px-6 pb-12">
          {/* The signal comes first, because it is why this record exists. */}
          <div className="pt-5">
            <div className="label">Originating signal</div>
            <SignalCard
              signal={lead.signal}
              visibility={lead.visibility}
              daysAhead={lead.daysAheadOfDatabases}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-line py-5 sm:grid-cols-3">
            <Field label="Founder">
              {lead.founder}
              <span className="block text-xs text-ink-muted">
                {lead.founderTitle}
              </span>
            </Field>
            <Field label="Stage">{lead.stage}</Field>
            <Field label="Est. raised">
              {formatFunding(lead.fundingRaisedUSD)}
              <span className="block text-xs text-ink-muted">estimate</span>
            </Field>
            <Field label="Founded">{lead.foundedYear}</Field>
            <Field label="Region">{lead.region}</Field>
            <Field label="Surfaced">{formatDate(lead.dateDiscovered)}</Field>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-line py-4">
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs"
            >
              Website
            </a>
            <a
              href={lead.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs"
            >
              LinkedIn
            </a>
            <span className="inline-flex items-center px-1 text-xs text-ink-muted">
              Sample links resolve to example.com by design.
            </span>
          </div>

          <Block title="What the company does">
            <Prose>{lead.description}</Prose>
          </Block>

          <Block
            title="Founder background"
            subtitle="Assembled from public record. Confidence is stated in the text."
          >
            <Prose>{lead.founderBackground}</Prose>
          </Block>

          <Block title="Why it fits an early technical thesis">
            <Prose>{lead.thesisFit}</Prose>
          </Block>

          <Block title="Market opportunity">
            <Prose>{lead.marketOpportunity}</Prose>
          </Block>

          <Block title="Why now">
            <Prose>{lead.whyNow}</Prose>
          </Block>

          <Block
            title="Evidence"
            subtitle="Each claim carries how firmly it is established. Founder-reported is never presented as proven."
          >
            <ul className="space-y-2.5">
              {lead.evidence.map((e, i) => (
                <li key={i} className="flex flex-wrap items-start gap-2">
                  <ConfidenceTag confidence={e.confidence} />
                  <span className="min-w-[12rem] flex-1 text-sm leading-relaxed text-ink-soft">
                    {e.claim}
                  </span>
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Concerns">
            <ul className="space-y-2">
              {lead.concerns.map((c, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400"
                  />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Diligence questions">
            <ol className="space-y-2">
              {lead.diligenceQuestions.map((q, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-0.5 font-mono text-xs text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-ink-soft">
                    {q}
                  </span>
                </li>
              ))}
            </ol>
          </Block>

          <Block
            title="Drafted founder outreach"
            subtitle="A starting point that references the actual signal. Personalize before sending."
          >
            <div className="rounded-lg border border-line bg-canvas p-3.5 text-sm leading-relaxed text-ink-soft">
              {lead.outreach}
            </div>
            <button
              onClick={copyOutreach}
              className="btn-secondary mt-3 text-xs"
            >
              {copied ? "Copied" : "Copy message"}
            </button>
          </Block>

          <Block title="Scoring breakdown">
            <ScoreBars scores={lead.scores} />
          </Block>

          <Block
            title="Workflow"
            subtitle="Status and notes are saved in this browser only."
          >
            <div className="mb-4">
              <div className="label">Pipeline status</div>
              <div className="flex flex-wrap gap-1.5">
                {PIPELINE_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => onStatusChange(lead.id, s)}
                    aria-pressed={s === lead.status}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                      s === lead.status
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-line text-ink-soft hover:bg-canvas"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => onNotesChange(lead.id, notes)}
                rows={4}
                placeholder="Add research notes..."
                className="input resize-y"
              />
            </div>
          </Block>
        </div>
      </aside>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useMandate } from "./MandateProvider";
import { MandateSelector } from "./MandateSelector";
import { RelevanceBadge, ScoreBadge, ScoreBar, ScoreBreakdown } from "./Score";
import {
  ConfidenceBadge,
  DatedFact,
  EvidenceLine,
  SourceLink,
  Value,
} from "./Provenance";
import { BulletList, Field, Section } from "./ui";
import {
  evidenceMix,
  investmentRationale,
  scoreBand,
  scoreCompany,
} from "@/lib/scoring";
import { getSource } from "@/lib/sources";
import { signalsForCompany } from "@/lib/data/market-signals";
import { intelligenceForCompany } from "@/lib/intelligence";
import { formatDate, describeAge } from "@/lib/format";
import { isDisclosed, NOT_DISCLOSED, type PrivateCompany } from "@/lib/types";

const DILIGENCE_LABELS: {
  key: keyof PrivateCompany["diligence"];
  label: string;
}[] = [
  { key: "technology", label: "Technology" },
  { key: "product", label: "Product" },
  { key: "customers", label: "Customers" },
  { key: "competition", label: "Competition" },
  { key: "unitEconomics", label: "Unit economics" },
  { key: "capitalRequirements", label: "Capital requirements" },
  { key: "regulation", label: "Regulation" },
  { key: "team", label: "Team" },
  { key: "financing", label: "Financing" },
  { key: "commercialization", label: "Commercialisation" },
];

export function CompanyDetail({ company }: { company: PrivateCompany }) {
  const { mandateId, mandate } = useMandate();
  const [copied, setCopied] = useState(false);
  const result = scoreCompany(company, mandateId);
  const band = scoreBand(result.total);
  const mix = evidenceMix(result);
  const f = company.financing;
  const signals = signalsForCompany(company.id);
  const news = intelligenceForCompany(company.id);

  async function copyOutreach() {
    try {
      await navigator.clipboard.writeText(company.outreach);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/universe"
          className="text-sm font-medium text-accent hover:underline"
        >
          Back to the private-company universe
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-ink">
              {company.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="chip">Private</span>
              <span className="chip">{company.sector}</span>
              <span className="chip">{f.stage}</span>
              <span className="chip">{company.headquarters}</span>
              {isDisclosed(company.foundedYear) && (
                <span className="chip">Founded {company.foundedYear}</span>
              )}
              <ConfidenceBadge confidence={company.dataConfidence} />
            </div>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
            >
              {company.website}
            </a>
          </div>
          <div className="shrink-0 text-right">
            <ScoreBadge score={result.total} />
            <div className="mt-2 w-40">
              <ScoreBar score={result.total} />
            </div>
            <div className="mt-2 flex justify-end">
              <RelevanceBadge relevance={result.relevance} />
            </div>
            <p className="mt-1.5 text-xs text-ink-muted">
              Under the {mandate.name} mandate
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-soft">
          {company.description}
        </p>
        <p className="mt-3 text-xs text-ink-muted">
          Record last reviewed {formatDate(company.lastReviewed)},{" "}
          {describeAge(company.lastReviewed)}. {company.privateStatusNote}
        </p>
      </div>

      <div className="card p-4 sm:p-5">
        <MandateSelector variant="compact" />
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {investmentRationale(company, result)}
        </p>
      </div>

      <section className="rounded-xl border border-accent-line bg-accent-soft p-5 sm:p-6">
        <h2 className="h-section">Why this company entered the pipeline</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="chip bg-surface">{company.sourcing.signal}</span>
          <span className="chip bg-surface">
            Sourced {formatDate(company.sourcing.dateSourced)}
          </span>
          <span className="chip bg-surface">{company.sourcing.channel}</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          {company.sourcing.whyEntered}
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="label">Why it may be timely now</p>
            <p className="text-sm leading-relaxed text-ink-soft">
              {company.sourcing.whyTimely}
            </p>
          </div>
          <div>
            <p className="label">
              {company.sourcing.wellRecognised
                ? "On visibility"
                : "Why it may be overlooked"}
            </p>
            <p className="text-sm leading-relaxed text-ink-soft">
              {company.sourcing.whyOverlooked}
            </p>
          </div>
        </div>
      </section>

      <Section
        title="Overview"
        description="What the company does, who buys it, and where the record comes from."
      >
        <dl className="grid gap-5 sm:grid-cols-2">
          <Field label="Target customer">{company.targetCustomer}</Field>
          <Field label="Business model">
            <Value value={company.businessModel} />
          </Field>
          <Field label="Founders">
            {company.founders.length > 0
              ? company.founders.join(", ")
              : NOT_DISCLOSED}
          </Field>
          <Field label="Technical differentiation">
            {company.technicalDifferentiation}
          </Field>
          <Field label="Traction signal">
            <Value value={company.tractionSignal} />
          </Field>
          <Field label="Recent catalyst">{company.recentCatalyst}</Field>
        </dl>

        <div className="mt-6">
          <p className="label">Primary sources</p>
          <ul className="space-y-1.5">
            {company.sourceIds.map((id) => {
              const src = getSource(id);
              if (!src) return null;
              return (
                <li key={id} className="text-sm">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent hover:underline"
                  >
                    {src.title}
                  </a>
                  <span className="text-ink-muted">
                    {" "}
                    ({src.publisher},{" "}
                    {src.primary ? "primary" : "corroborating"}, published{" "}
                    {formatDate(src.published)}, accessed{" "}
                    {formatDate(src.accessed)})
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      <Section
        title="Technology assessment"
        description="What the technology does, what protects it, and where it could fail."
      >
        <dl className="grid gap-5 sm:grid-cols-2">
          <Field label="How it works">{company.technology.howItWorks}</Field>
          <Field label="Core technical advantage">
            {company.technology.coreAdvantage}
          </Field>
          <Field label="Relevant technical benchmarks">
            <Value value={company.technology.benchmarks} />
          </Field>
          <Field label="Intellectual property or proprietary assets">
            <Value value={company.technology.intellectualProperty} />
          </Field>
          <Field label="Dependence on third-party infrastructure">
            {company.technology.thirdPartyDependency}
          </Field>
          <Field label="Technical milestone required for scale">
            {company.technology.milestoneForScale}
          </Field>
        </dl>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="label">Supporting evidence</p>
            <ul>
              {company.technology.supportingEvidence.map((e) => (
                <EvidenceLine key={e.claim} {...e} />
              ))}
            </ul>
          </div>
          <div>
            <p className="label">Potential technical failure points</p>
            <BulletList items={company.technology.failurePoints} tone="risk" />
          </div>
        </div>
      </Section>

      <Section
        title="Market assessment"
        description="The buying problem, the structure around it, and what is changing now."
      >
        <dl className="grid gap-5 sm:grid-cols-2">
          <Field label="Customer pain point">{company.market.painPoint}</Field>
          <Field label="Market structure">{company.market.structure}</Field>
          <Field label="Current catalyst">
            {company.market.currentCatalyst}
          </Field>
          <Field label="Regulatory environment">
            {company.market.regulatoryEnvironment}
          </Field>
          <Field label="Market maturity">{company.market.maturity}</Field>
        </dl>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <p className="label">Adoption drivers</p>
            <BulletList items={company.market.adoptionDrivers} />
          </div>
          <div>
            <p className="label">Competitive landscape</p>
            <BulletList items={company.market.competitors} />
          </div>
          <div>
            <p className="label">Substitute technologies</p>
            <BulletList items={company.market.substitutes} />
          </div>
        </div>
      </Section>

      <Section
        title="Commercial assessment"
        description="How it is sold, what adoption looks like, and what could stop it."
      >
        <dl className="grid gap-5 sm:grid-cols-2">
          <Field label="Customer type">{company.commercial.customerType}</Field>
          <Field label="Pricing model">
            <Value value={company.commercial.pricingModel} />
          </Field>
          <Field label="Sales motion">
            <Value value={company.commercial.salesMotion} />
          </Field>
          <Field label="Implementation burden">
            {company.commercial.implementationBurden}
          </Field>
          <Field label="Expansion opportunity">
            {company.commercial.expansionOpportunity}
          </Field>
          <Field label="Main go-to-market risk">
            {company.commercial.goToMarketRisk}
          </Field>
        </dl>
        <div className="mt-6">
          <p className="label">Adoption evidence</p>
          <ul className="max-w-2xl">
            {company.commercial.adoptionEvidence.map((e) => (
              <EvidenceLine key={e.claim} {...e} />
            ))}
          </ul>
        </div>
      </Section>

      <Section
        title="Financing assessment"
        description="What is disclosed, what is not, and what the capital requirement implies."
      >
        <div className="grid gap-x-8 lg:grid-cols-2">
          <dl>
            <DatedFact
              label="Latest disclosed round"
              value={f.latestRound}
              date={f.latestRoundDate}
              sourceId={f.latestRoundSourceId}
            />
            <DatedFact
              label="Total disclosed funding"
              value={String(f.totalDisclosedFunding)}
              sourceId={f.latestRoundSourceId}
            />
          </dl>
          <div className="space-y-5 pt-3">
            <Field label="Current financing stage">{f.stage}</Field>
            <Field label="Named investors">
              {f.namedInvestors.length > 0
                ? f.namedInvestors.join(", ")
                : NOT_DISCLOSED}
            </Field>
            <Field label="Capital intensity">{f.capitalIntensity}</Field>
            <Field label="Likely future capital requirements">
              {f.futureCapitalRequirement}
            </Field>
            <Field label="Financing risk">{f.financingRisk}</Field>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-line bg-canvas p-4">
          <p className="label">Missing information</p>
          <p className="mb-3 text-xs leading-relaxed text-ink-muted">
            These are not publicly disclosed. They are listed rather than
            estimated, because a plausible invented figure is worse than an
            honest gap.
          </p>
          <BulletList items={f.missingInformation} />
        </div>
      </Section>

      <Section
        title="Investment view"
        description="The thesis, the cases around it, and what would prove it wrong."
      >
        <div className="space-y-5">
          <Field label="Thesis">{company.investment.thesis}</Field>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Bull case
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {company.investment.bullCase}
              </p>
            </div>
            <div className="rounded-lg border border-line bg-canvas p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Base case
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {company.investment.baseCase}
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Bear case
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {company.investment.bearCase}
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="label">Catalysts</p>
              <BulletList
                items={company.investment.catalysts}
                tone="positive"
              />
            </div>
            <div>
              <p className="label">Risks</p>
              <BulletList items={company.investment.risks} tone="risk" />
            </div>
            <div>
              <p className="label">What would invalidate the thesis</p>
              <BulletList items={company.investment.invalidators} tone="risk" />
            </div>
          </div>
          <div className="rounded-lg border border-accent-line bg-accent-soft p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Recommended next step
              </p>
              <ConfidenceBadge confidence={company.investment.confidence} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {company.investment.recommendedNextStep}
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Scoring breakdown"
        description={`Twelve quality factors weighted by the active mandate, then scaled by mandate relevance. ${mix.verifiedShare} percent of the ratings on this company rest on verified information, and the rest are analyst judgment, labelled per factor.`}
      >
        <div className="mb-4 space-y-3 rounded-lg border border-line bg-canvas p-4">
          <div className="flex flex-wrap items-center gap-3">
            <ScoreBadge score={result.total} />
            <RelevanceBadge relevance={result.relevance} />
            <ConfidenceBadge confidence={company.dataConfidence} />
          </div>
          <p className="text-sm leading-relaxed text-ink-soft">
            Quality {result.quality} of 100, multiplied by{" "}
            {result.relevance.tier.multiplier.toFixed(2)} for mandate relevance,
            gives {result.total}. This tier is capped at{" "}
            {result.relevance.tier.ceiling}.
          </p>
          <p className="text-sm leading-relaxed text-ink-soft">{band.meaning}</p>
          <p className="text-xs leading-relaxed text-ink-muted">
            <span className="font-medium text-ink-soft">
              Why this confidence rating.{" "}
            </span>
            {company.dataConfidenceNote}
          </p>
        </div>
        <ScoreBreakdown result={result} />
      </Section>

      <Section
        title="Diligence questions"
        description={`Company-specific questions, plus the additional questions the ${mandate.name} mandate requires of every company it evaluates.`}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {DILIGENCE_LABELS.map(({ key, label }) => (
            <div key={key}>
              <p className="label">{label}</p>
              <BulletList items={company.diligence[key]} />
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg border border-accent-line bg-accent-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Required by the {mandate.name} mandate
          </p>
          <div className="mt-3">
            <BulletList items={mandate.additionalDiligence} />
          </div>
        </div>
      </Section>

      {signals.length > 0 && (
        <Section
          title="Related market signals"
          description="Public companies that inform this thesis. They are market context and comparables only, and are not sourcing candidates."
        >
          <ul className="grid gap-3 sm:grid-cols-2">
            {signals.map((s) => (
              <li key={s.id} className="card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/market-signals"
                    className="text-sm font-medium text-ink hover:text-accent hover:underline"
                  >
                    {s.name}
                  </Link>
                  <span className="chip">{s.ticker}</span>
                  <span className="chip">Public, market signal</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                  {s.whatItSignals}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {news.length > 0 && (
        <Section title="Related market intelligence">
          <ul className="space-y-2">
            {news.map((e) => (
              <li key={e.id} className="card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <time
                    dateTime={e.date}
                    className="font-mono text-xs text-ink-muted"
                  >
                    {formatDate(e.date)}
                  </time>
                  <span className="chip">{e.category}</span>
                  <SourceLink sourceId={e.sourceId} />
                </div>
                <p className="mt-1.5 text-sm font-medium text-ink">
                  {e.subject}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                  {e.investmentRelevance}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        title="Founder outreach"
        description="A draft referencing the company's verified work. Generic praise is deliberately absent, and the note does not claim to represent any fund."
      >
        <div className="card p-4 sm:p-5">
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">
            {company.outreach}
          </p>
          <button
            type="button"
            onClick={copyOutreach}
            className="btn-secondary mt-4"
          >
            {copied ? "Copied" : "Copy outreach draft"}
          </button>
        </div>
      </Section>
    </div>
  );
}

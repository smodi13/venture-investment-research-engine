"use client";

import Link from "next/link";
import { useState } from "react";
import { useMandate } from "./MandateProvider";
import { MandateSelector } from "./MandateSelector";
import { ScoreBadge, ScoreBar, ScoreBreakdown } from "./Score";
import {
  DemonstrationBadge,
  EvidenceLine,
  FactRow,
  ProvenanceBadge,
} from "./Provenance";
import { BulletList, Field, Section } from "./ui";
import {
  evidenceMix,
  investmentRationale,
  scoreBand,
  scoreCompany,
} from "@/lib/scoring";
import { getSource } from "@/lib/sources";
import { formatDate, describeAge } from "@/lib/format";
import type { Company } from "@/lib/types";

const DILIGENCE_LABELS: { key: keyof Company["diligence"]; label: string }[] = [
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

export function CompanyDetail({ company }: { company: Company }) {
  const { mandateId, mandate } = useMandate();
  const [copied, setCopied] = useState(false);
  const result = scoreCompany(company, mandateId);
  const band = scoreBand(result.total);
  const mix = evidenceMix(result);
  const f = company.financials;

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
      {/* Header */}
      <div>
        <Link
          href="/universe"
          className="text-sm font-medium text-accent hover:underline"
        >
          Back to company universe
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-ink">
              {company.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="chip">{company.marketType}</span>
              {f.kind === "public" && <span className="chip">{f.ticker}</span>}
              <span className="chip">{company.sector}</span>
              <span className="chip">{company.stage}</span>
              <span className="chip">{company.hq}</span>
              <span className="chip">Founded {company.foundedYear}</span>
              {company.isDemonstration && <DemonstrationBadge />}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <ScoreBadge score={result.total} />
            <div className="mt-2 w-40">
              <ScoreBar score={result.total} />
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
          Last reviewed {formatDate(company.lastReviewed)},{" "}
          {describeAge(company.lastReviewed)}.
        </p>
      </div>

      {company.isDemonstration && (
        <p className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm leading-relaxed text-violet-900">
          <strong className="font-semibold">Demonstration company.</strong>{" "}
          {company.name} is fictional. Every figure and claim on this page is
          illustrative, included to exercise the research workflow, and
          describes no real business. Private companies in this platform are
          modelled rather than researched, because inventing facts about a real
          private company would be indefensible.
        </p>
      )}

      <div className="card p-4 sm:p-5">
        <MandateSelector variant="compact" />
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {investmentRationale(company, result)}
        </p>
      </div>

      {/* Overview */}
      <Section
        title="Overview"
        description="What the company sells, who buys it, and where the record came from."
      >
        <dl className="grid gap-5 sm:grid-cols-2">
          <Field label="Business model">{company.businessModel}</Field>
          <Field label="Primary customer">{company.primaryCustomer}</Field>
          <Field label="Technical differentiation">
            {company.technicalDifferentiation}
          </Field>
          <Field label="Key catalyst">{company.keyCatalyst}</Field>
          <div>
            <dt className="label">Traction signal</dt>
            <dd className="text-sm leading-relaxed text-ink-soft">
              {company.tractionSignal.value ?? "Not publicly disclosed"}
            </dd>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <ProvenanceBadge provenance={company.tractionSignal.provenance} />
              <span className="text-xs text-ink-muted">
                As of {formatDate(company.tractionSignal.asOf)}
              </span>
            </div>
          </div>
          <Field label="Geography and stage">
            {company.hq}, {company.region}. {company.stage},{" "}
            {company.commercialReadiness.toLowerCase()} commercial readiness,{" "}
            {company.capitalIntensity.toLowerCase()} capital intensity.
          </Field>
        </dl>

        {company.sourceIds.length > 0 && (
          <div className="mt-6">
            <p className="label">Key public sources</p>
            <ul className="space-y-1.5">
              {company.sourceIds.map((id) => {
                const s = getSource(id);
                if (!s) return null;
                return (
                  <li key={id} className="text-sm">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent hover:underline"
                    >
                      {s.name}
                    </a>
                    <span className="text-ink-muted">
                      {" "}
                      ({s.type}, accessed {formatDate(s.accessDate)})
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Section>

      {/* Technology */}
      <Section
        title="Technology assessment"
        description="What the technology does, what protects it, and where it could fail."
      >
        <dl className="grid gap-5 sm:grid-cols-2">
          <Field label="How it works">{company.technology.howItWorks}</Field>
          <Field label="Core technical advantage">
            {company.technology.coreAdvantage}
          </Field>
          <Field label="Benchmarks">{company.technology.benchmarks}</Field>
          <Field label="Intellectual property">
            {company.technology.intellectualProperty}
          </Field>
          <Field label="Third-party dependency">
            {company.technology.thirdPartyDependency}
          </Field>
          <Field label="Milestone required for scale">
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

      {/* Market */}
      <Section
        title="Market assessment"
        description="The buying problem, the structure around it, and what is changing now."
      >
        <dl className="grid gap-5 sm:grid-cols-2">
          <Field label="Customer pain point">{company.market.painPoint}</Field>
          <Field label="Market structure">{company.market.structure}</Field>
          <Field label="Why now">{company.market.whyNow}</Field>
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
            <p className="label">Competitors</p>
            <BulletList items={company.market.competitors} />
          </div>
          <div>
            <p className="label">Substitute technologies</p>
            <BulletList items={company.market.substitutes} />
          </div>
        </div>
      </Section>

      {/* Commercial */}
      <Section
        title="Commercial assessment"
        description="How it is sold, what adoption looks like, and what could stop it."
      >
        <dl className="grid gap-5 sm:grid-cols-2">
          <Field label="Pricing model">{company.commercial.pricingModel}</Field>
          <Field label="Sales motion">{company.commercial.salesMotion}</Field>
          <Field label="Customer type">{company.commercial.customerType}</Field>
          <Field label="Implementation burden">
            {company.commercial.implementationBurden}
          </Field>
          <Field label="Expansion opportunity">
            {company.commercial.expansionOpportunity}
          </Field>
          <Field label="Go-to-market risk">
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

      {/* Financials */}
      <Section
        title={
          f.kind === "public"
            ? "Financial assessment"
            : "Financing assessment"
        }
        description={
          f.kind === "public"
            ? "Every figure below is a dated range carrying an explicit provenance label. None is a reported point value, and each should be reconciled against the primary filing before use."
            : "Financing structure for a private company. All figures are demonstration data on a fictional company."
        }
      >
        {f.kind === "public" ? (
          <div className="grid gap-x-8 lg:grid-cols-2">
            <dl>
              <FactRow label="Market capitalisation" fact={f.marketCap} />
              <FactRow label="Revenue growth" fact={f.revenueGrowth} />
              <FactRow label="Gross margin" fact={f.grossMargin} />
            </dl>
            <dl>
              <FactRow label="Operating margin" fact={f.operatingMargin} />
              <FactRow label="Cash position" fact={f.cashPosition} />
              <FactRow label="Valuation multiple" fact={f.valuationMultiple} />
            </dl>
            <div className="mt-4 space-y-5 lg:col-span-2">
              <Field label="Public-market expectations">
                {f.marketExpectations}
              </Field>
              <div>
                <p className="label">Earnings catalysts</p>
                <BulletList items={f.earningsCatalysts} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-x-8 lg:grid-cols-2">
            <dl>
              <FactRow label="Capital raised" fact={f.capitalRaised} />
              <FactRow label="Latest round" fact={f.latestRound} />
            </dl>
            <div className="space-y-5 pt-3">
              <Field label="Capital intensity">{f.capitalIntensity}</Field>
              <Field label="Expected future financing need">
                {f.futureFinancingNeed}
              </Field>
              <Field label="Ownership and dilution considerations">
                {f.ownershipConsiderations}
              </Field>
              <Field label="Financing risk">{f.financingRisk}</Field>
            </div>
          </div>
        )}
      </Section>

      {/* Investment view */}
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
              <BulletList items={company.investment.catalysts} tone="positive" />
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
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Recommended next step
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {company.investment.recommendedNextStep}
            </p>
          </div>
        </div>
      </Section>

      {/* Scoring */}
      <Section
        title="Scoring breakdown"
        description={`Thirteen factors weighted by the active mandate. ${mix.verifiedShare} percent of the ratings on this company rest on verified information, and the rest are analyst judgment, labelled per factor.`}
      >
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-canvas p-4">
          <ScoreBadge score={result.total} />
          <p className="text-sm leading-relaxed text-ink-soft">{band.meaning}</p>
        </div>
        <ScoreBreakdown result={result} />
      </Section>

      {/* Diligence */}
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

      {/* Outreach */}
      <Section
        title="Founder outreach"
        description="A draft that references the company's actual work. Generic praise is deliberately absent, because it is the fastest way to be ignored."
      >
        <div className="card p-4 sm:p-5">
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">
            {company.outreach}
          </p>
          {company.marketType === "Private" && (
            <button
              type="button"
              onClick={copyOutreach}
              className="btn-secondary mt-4"
            >
              {copied ? "Copied" : "Copy outreach draft"}
            </button>
          )}
        </div>
      </Section>
    </div>
  );
}

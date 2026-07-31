import { getCompany } from "./companies";
import { getSource } from "./sources";
import { scoreBand, scoreCompany } from "./scoring";
import type { MandateId } from "./mandates";
import { isDisclosed, type PrivateCompany } from "./types";

/**
 * The investment memo.
 *
 * The memo is generated from a real company's sourced record rather than
 * written separately, so nothing can appear in it that is not already
 * supported by the research and its sources. If a fact is not disclosed in the
 * record, it is not disclosed in the memo either.
 */

/** The company the featured memo is written on. */
export const MEMO_COMPANY_ID = "sublime-systems";
export const MEMO_MANDATE: MandateId = "frontier-technology";
export const MEMO_DATE = "2026-07-30";

export interface MemoSection {
  heading: string;
  body: string[];
  points?: string[];
}

export function buildMemo(
  company: PrivateCompany,
  mandateId: MandateId,
): { recommendation: string; scoreNote: string; sections: MemoSection[] } {
  const result = scoreCompany(company, mandateId);
  const band = scoreBand(result.total);

  const recommendation =
    band.tone === "priority" || band.tone === "watchlist"
      ? "Proceed to partner review"
      : "Continue diligence before progressing";

  const scoreNote = `Scores ${result.total} of 100 under the ${result.mandate.name} mandate, in the ${band.label.toLowerCase()} band, from a quality score of ${result.quality} adjusted by a ${result.relevance.tier.label.toLowerCase()} relevance multiplier of ${result.relevance.tier.multiplier.toFixed(2)}. Data confidence on this record is ${company.dataConfidence.toLowerCase()}.`;

  const sections: MemoSection[] = [
    {
      heading: "Executive summary",
      body: [company.description, company.investment.thesis],
      points: [
        `Most recent disclosed round: ${company.financing.disclosedRound}, headquartered in ${company.headquarters}`,
        `Latest disclosed financing: ${company.financing.latestRound}`,
        `Data confidence: ${company.dataConfidence}. ${company.dataConfidenceNote}`,
      ],
    },
    {
      heading: "Why this company entered the pipeline",
      body: [
        company.sourcing.whyEntered,
        `Why now. ${company.sourcing.whyTimely}`,
        company.sourcing.wellRecognised
          ? `On visibility. ${company.sourcing.whyOverlooked}`
          : `Why it may be overlooked. ${company.sourcing.whyOverlooked}`,
      ],
      points: [
        `Sourcing signal: ${company.sourcing.signal}`,
        `Date sourced: ${company.sourcing.dateSourced}`,
        `Sourcing channel: ${company.sourcing.channel}`,
      ],
    },
    {
      heading: "Technology assessment",
      body: [
        company.technology.howItWorks,
        company.technology.coreAdvantage,
      ],
      points: [
        `Benchmarks: ${company.technology.benchmarks}`,
        `Third-party dependency: ${company.technology.thirdPartyDependency}`,
        `Milestone required for scale: ${company.technology.milestoneForScale}`,
        ...company.technology.failurePoints.map((f) => `Failure point: ${f}`),
      ],
    },
    {
      heading: "Market assessment",
      body: [company.market.painPoint, company.market.structure],
      points: [
        `Current catalyst: ${company.market.currentCatalyst}`,
        `Regulatory environment: ${company.market.regulatoryEnvironment}`,
        `Competitors: ${company.market.competitors.join(", ")}`,
      ],
    },
    {
      heading: "Commercial assessment",
      body: [company.commercial.salesMotion, company.commercial.goToMarketRisk],
      points: [
        `Customer type: ${company.commercial.customerType}`,
        `Pricing model: ${company.commercial.pricingModel}`,
        `Implementation burden: ${company.commercial.implementationBurden}`,
        ...company.commercial.adoptionEvidence.map((e) => `Evidence: ${e.claim}`),
      ],
    },
    {
      heading: "Financing assessment",
      body: [
        company.financing.futureCapitalRequirement,
        company.financing.financingRisk,
      ],
      points: [
        `Total disclosed funding: ${company.financing.totalDisclosedFunding}`,
        `Named investors: ${company.financing.namedInvestors.join(", ") || "Not publicly disclosed"}`,
        `Capital intensity: ${company.financing.capitalIntensity}`,
        ...company.financing.missingInformation.map(
          (m) => `Not publicly disclosed: ${m}`,
        ),
      ],
    },
    {
      heading: "Investment view",
      body: [
        `Bull case. ${company.investment.bullCase}`,
        `Base case. ${company.investment.baseCase}`,
        `Bear case. ${company.investment.bearCase}`,
      ],
      points: [
        ...company.investment.catalysts.map((c) => `Catalyst: ${c}`),
        ...company.investment.risks.map((r) => `Risk: ${r}`),
      ],
    },
    {
      heading: "What would invalidate the thesis",
      body: [
        "Two conditions would end this position rather than merely reduce it.",
      ],
      points: company.investment.invalidators,
    },
    {
      heading: "Recommendation",
      body: [
        `${recommendation}. ${company.investment.recommendedNextStep}`,
        `Confidence in this view is ${company.investment.confidence.toLowerCase()}, reflecting the quality of the public record rather than enthusiasm for the company.`,
      ],
    },
    {
      heading: "Sources",
      body: [
        "Every factual claim in this memo is drawn from the company record, which is sourced as follows.",
      ],
      points: company.sourceIds.map((id) => {
        const src = getSource(id);
        return src
          ? `${src.title}, ${src.publisher}, published ${src.published}, accessed ${src.accessed}`
          : id;
      }),
    },
  ];

  return { recommendation, scoreNote, sections };
}

export function memoCompany(): PrivateCompany {
  const company = getCompany(MEMO_COMPANY_ID);
  if (!company) throw new Error("Memo company not found in the universe");
  return company;
}

function renderLines(
  company: PrivateCompany,
  mandateId: MandateId,
): { recommendation: string; scoreNote: string; sections: MemoSection[] } {
  return buildMemo(company, mandateId);
}

export function memoToText(): string {
  const company = memoCompany();
  const { recommendation, scoreNote, sections } = renderLines(
    company,
    MEMO_MANDATE,
  );
  const lines: string[] = [
    `INVESTMENT MEMO: ${company.name}`,
    `Author: Sahil Modi`,
    `Date: ${MEMO_DATE}`,
    `Website: ${company.website}`,
    `Founders: ${company.founders.join(", ") || "Not publicly disclosed"}`,
    `Founded: ${isDisclosed(company.foundedYear) ? company.foundedYear : "Not publicly disclosed"}`,
    "",
    `RECOMMENDATION: ${recommendation}`,
    scoreNote,
    "",
    "---",
    "",
  ];
  for (const section of sections) {
    lines.push(section.heading.toUpperCase(), "");
    for (const p of section.body) lines.push(p, "");
    if (section.points) {
      for (const point of section.points) lines.push(`  - ${point}`);
      lines.push("");
    }
  }
  lines.push(
    "---",
    "",
    "This memo is generated from a sourced company record. Every factual claim is supported by the sources listed above.",
    "This is an independent work sample by Sahil Modi. It is not affiliated with or endorsed by any investment firm, and is not investment advice.",
  );
  return lines.join("\n");
}

export function memoToMarkdown(): string {
  const company = memoCompany();
  const { recommendation, scoreNote, sections } = renderLines(
    company,
    MEMO_MANDATE,
  );
  const lines: string[] = [
    `# Investment memo: ${company.name}`,
    "",
    `**Author:** Sahil Modi  `,
    `**Date:** ${MEMO_DATE}  `,
    `**Website:** ${company.website}  `,
    `**Founders:** ${company.founders.join(", ") || "Not publicly disclosed"}`,
    "",
    `> **Recommendation: ${recommendation}**  `,
    `> ${scoreNote}`,
    "",
  ];
  for (const section of sections) {
    lines.push(`## ${section.heading}`, "");
    for (const p of section.body) lines.push(p, "");
    if (section.points) {
      for (const point of section.points) lines.push(`- ${point}`);
      lines.push("");
    }
  }
  lines.push(
    "---",
    "",
    "*This memo is generated from a sourced company record. Every factual claim is supported by the sources listed above.*",
    "",
    "*This is an independent work sample by Sahil Modi. It is not affiliated with or endorsed by any investment firm, and is not investment advice.*",
  );
  return lines.join("\n");
}

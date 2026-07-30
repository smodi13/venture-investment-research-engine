/**
 * The demonstration investment memo.
 *
 * Written on a fictional company so that every judgment in it can be stated
 * with the confidence a memo requires without asserting anything about a real
 * business. The structure, the ordering, and the willingness to name what
 * would change the recommendation are the parts worth reading.
 */

export interface MemoSection {
  heading: string;
  /** Rendered as paragraphs. */
  body: string[];
  /** Optional bullet list rendered under the body. */
  points?: string[];
}

export const MEMO = {
  companyId: "coldbrook-thermal",
  companyName: "Coldbrook Thermal",
  author: "Sahil Modi",
  date: "2026-07-24",
  mandate: "Frontier Technology",
  recommendation: "Proceed to partner review",
  recommendationDetail:
    "Recommend a Series B participation of six million dollars, conditional on receiving three-year coolant chemistry data from the two oldest installations before signing.",
  scoreNote:
    "Scores 74 of 100 under the Frontier Technology mandate, in the strong watchlist band. The score does not drive this recommendation; the repeat purchase behaviour does.",

  sections: [
    {
      heading: "Executive summary",
      body: [
        "Coldbrook Thermal sells direct-to-chip liquid cooling designed to be retrofitted into existing air-cooled data halls. The differentiation is not thermal performance, where several larger vendors are competitive, but tolerance for the water quality and rack dimensions found in buildings that were never designed for liquid cooling.",
        "Nine facilities are deployed across four operators. Two of the four have repeated after their first installation, and service contract attach is high across the installed base. That repeat behaviour, from operators who took real risk installing coolant loops into live facilities, is the strongest evidence available at this stage and is the basis for this recommendation.",
        "The case against is that retrofit may be a transitional market. If operators simply build new facilities designed for liquid cooling, the reason to retrofit disappears. This is a genuine risk and it is not fully answerable today.",
      ],
    },
    {
      heading: "Company overview",
      body: [
        "Founded in 2020 in Delft, the company has raised fifty two million dollars across two institutional rounds, with a strategic investor from the data centre engineering contractor channel holding a board observer seat.",
        "Products are sold through engineering contractors, which shortens the sales cycle and gives away some gross margin. Revenue is hardware at installation plus annual service contracts covering coolant chemistry and pump maintenance.",
      ],
    },
    {
      heading: "Technology assessment",
      body: [
        "Cold plates mount directly to processors and accelerators, with coolant circulating through a manifold to a heat exchanger connected to the building's existing chilled water loop. The engineering choice that matters is designing for imperfect water quality rather than specifying it away, which is what makes retrofit practical instead of theoretical.",
        "Six patents cover manifold design and coolant chemistry. The chemistry work is the harder of the two to reproduce and is the more defensible asset.",
      ],
      points: [
        "No reported coolant leak incidents across nine deployed facilities to date",
        "Heat removal per rack is measured per installation and depends heavily on the host building, so cross-site comparison is limited",
        "Long-term coolant chemistry behaviour in real building loops is the primary unresolved technical question",
      ],
    },
    {
      heading: "Market opportunity",
      body: [
        "Rack densities have risen past what air cooling removes, while existing facilities carry leases with years remaining and construction timelines for new liquid-cooled buildings run to years. That gap is the market.",
        "This platform deliberately does not publish a market size figure here. Top-down sizing for this category would be guesswork, and the structural argument stands without it: the number of facilities carrying both unexpired leases and density requirements they cannot meet is large and currently growing.",
      ],
    },
    {
      heading: "Business model and commercial evidence",
      body: [
        "Hardware is priced per rack with annual service contracts on top. The service revenue is the more interesting half of the model, because it accrues on an installed base that only grows and carries better margins than the equipment.",
        "Installation happens in live facilities, which binds the sales cycle to maintenance windows and cannot be accelerated by adding sales capacity.",
      ],
      points: [
        "Nine facilities across four operators",
        "Two of four operators have repeated after a first installation",
        "Service contract attach rate is high across deployed sites",
        "Channel sales through engineering contractors who also carry competing products",
      ],
    },
    {
      heading: "Competitive landscape",
      body: [
        "The large thermal management vendors are credible competitors with global service organisations and existing operator relationships. They serve new construction well. They serve messy retrofits into buildings with unpredictable water quality less well, which is the segment this company has chosen.",
        "That choice is the whole strategy. It is also the reason the position is narrow: if the large vendors decide the retrofit segment is worth serving properly, the differentiation is not deep enough to hold them off indefinitely.",
      ],
    },
    {
      heading: "Team",
      body: [
        "Thermal engineering team from a research university background, technically strong and commercially less proven. Nobody on the team has taken a thermal product through hyperscale qualification, which matters for the expansion case rather than for the current business.",
      ],
    },
    {
      heading: "Financial and financing considerations",
      body: [
        "Fifty two million dollars raised to reach nine deployed facilities is reasonable for a hardware business. The next round is working capital for manufacturing scale rather than research funding, which is a materially better reason to raise and reduces financing risk relative to the rest of the private universe.",
        "The strategic investor from the contractor channel helps distribution and narrows the eventual buyer list, since a sale to a competing thermal vendor becomes more complicated. That should be priced into any expectation of exit optionality.",
      ],
    },
    {
      heading: "Investment thesis",
      body: [
        "A practical answer to a constraint operators face today, differentiated by tolerance for real building conditions rather than by thermal performance, with a service annuity accumulating underneath the equipment revenue.",
        "The service base is what makes this more than a construction-cycle exposure. If retrofit demand softens, an installed base under contract still generates revenue at better margins than the original sale.",
      ],
    },
    {
      heading: "Risks",
      body: [
        "Three risks matter, in this order.",
      ],
      points: [
        "A leak incident at a reference customer would be commercially severe regardless of fault. Nine facilities is not enough operating history to have a meaningful base rate.",
        "Retrofit may be transitional. If new construction designed for liquid cooling absorbs the demand, the differentiation loses its purpose.",
        "Channel dependence on engineering contractors who carry competing products and control the customer relationship.",
      ],
    },
    {
      heading: "Diligence questions",
      body: [
        "The following remain open and should be closed before signing.",
      ],
      points: [
        "What does coolant chemistry look like after three years in a real building loop rather than in test conditions?",
        "Of the two repeating operators, what specifically drove the second purchase decision?",
        "How does installation time compare between the first and the most recent deployment?",
        "What is the margin split between hardware and service after channel commission?",
        "Where has the company lost against the large thermal vendors, and on what basis?",
      ],
    },
    {
      heading: "Catalysts",
      body: [
        "Three events would materially change the assessment upward.",
      ],
      points: [
        "A hyperscale operator deployment, which would move the company out of the retrofit niche",
        "Multi-year coolant chemistry data confirming stability at the oldest sites",
        "Service revenue reaching a meaningful share of total revenue",
      ],
    },
    {
      heading: "What would invalidate the thesis",
      body: [
        "Two things would end this position rather than merely reduce it.",
      ],
      points: [
        "A coolant leak incident at a reference site, which would damage the reference base that the sales motion depends on",
        "Repeat purchase rate falling as operators shift decisively to new construction, which would confirm retrofit as a transitional category",
      ],
    },
    {
      heading: "Recommendation",
      body: [
        "Proceed to partner review with a proposed six million dollar participation in the Series B, conditional on receiving three-year coolant chemistry data from the two oldest installations.",
        "The condition is not procedural. Long-term chemistry degradation is the risk that would surface years after an investment, and it is the one piece of evidence that cannot be reconstructed later. If that data is unavailable or unfavourable, the recommendation is to pass rather than to proceed at a lower amount.",
      ],
    },
  ] satisfies MemoSection[],
} as const;

/** Plain-text rendering, used for the copy and download actions. */
export function memoToText(): string {
  const lines: string[] = [
    `INVESTMENT MEMO: ${MEMO.companyName}`,
    `Author: ${MEMO.author}`,
    `Date: ${MEMO.date}`,
    `Mandate: ${MEMO.mandate}`,
    "",
    `RECOMMENDATION: ${MEMO.recommendation}`,
    MEMO.recommendationDetail,
    "",
    MEMO.scoreNote,
    "",
    "---",
    "",
  ];
  for (const section of MEMO.sections) {
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
    "Coldbrook Thermal is a demonstration company. It is fictional and describes no real business.",
    "This memo is an independent work sample by Sahil Modi. It is not affiliated with or endorsed by any investment firm, and is not investment advice.",
  );
  return lines.join("\n");
}

/** Markdown rendering, used for the download action. */
export function memoToMarkdown(): string {
  const lines: string[] = [
    `# Investment memo: ${MEMO.companyName}`,
    "",
    `**Author:** ${MEMO.author}  `,
    `**Date:** ${MEMO.date}  `,
    `**Mandate:** ${MEMO.mandate}`,
    "",
    `> **Recommendation: ${MEMO.recommendation}**  `,
    `> ${MEMO.recommendationDetail}`,
    "",
    MEMO.scoreNote,
    "",
  ];
  for (const section of MEMO.sections) {
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
    "*Coldbrook Thermal is a demonstration company. It is fictional and describes no real business.*",
    "",
    "*This memo is an independent work sample by Sahil Modi. It is not affiliated with or endorsed by any investment firm, and is not investment advice.*",
  );
  return lines.join("\n");
}

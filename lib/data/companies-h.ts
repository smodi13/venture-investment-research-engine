import { fa, NOT_DISCLOSED, type PrivateCompany } from "../types";

/** Verified private companies, part eight. See companies-a.ts for the data policy. */

const REVIEWED = "2026-07-30";

export const COMPANIES_H: PrivateCompany[] = [
  /* ------------------------------------------------------------- Perceptic */
  {
    id: "perceptic",
    name: "Perceptic",
    website: "https://www.perceptic.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Emerged from stealth with a seed financing in May 2026, with no listing or acquisition notice.",
    headquarters: "London, United Kingdom",
    region: "Europe",
    foundedYear: 2024,
    founders: ["Tilman Flock", "Martin Copes", "Zaki Trache"],
    sector: "Healthcare Technology",
    subsector: "Drug development data and decision infrastructure",
    description:
      "Connects the evidence, data, and decisions scattered across a drug development programme into one layer, so that asset scouting, scientific evaluation, and clinical data can be reasoned over together rather than reconciled by hand each time a question is asked.",
    targetCustomer:
      "Large pharmaceutical companies, biotechnology firms, and contract research organisations running drug development programmes across disconnected systems.",
    businessModel: NOT_DISCLOSED,
    technicalDifferentiation:
      "The founders built this integration layer repeatedly as a services engagement inside a large data platform company before building it as a product, which means the hard part, the shape of pharmaceutical data in practice, was learned at customer expense rather than guessed at.",
    tractionSignal:
      "The lead investor states the platform is deployed across multiple large pharmaceutical companies, biotechnology firms, and contract research organisations, and names CSL as a customer. The company reports asset evaluation falling from a week to an hour in production, screening moving from hundreds of assets per week to thousands in minutes, and a fiftyfold improvement in clinical data extraction. None of these figures has been independently measured.",
    tractionProvenance: "Investor-reported",
    tractionAsOf: "2026-05-26",
    recentCatalyst:
      "Emerged from stealth on 26 May 2026 with a 12 million dollar seed round led by Accel and Air Street Capital.",
    primaryCompetitors: [
      "Large data platform companies serving life sciences",
      "In-house pharmaceutical data engineering teams",
      "Clinical data management and scientific informatics vendors",
    ],
    mainTechnicalRisk:
      "Pharmaceutical data is fragmented differently at every organisation, so a platform that generalises poorly becomes a services business wearing a product's margins.",
    mainCommercialRisk:
      "The buyer set is small, procurement is slow, and the incumbent the founders came from is already inside many of these accounts.",
    mainFinancingRisk:
      "Low against the raise. Enterprise pharmaceutical sales cycles are long enough that a seed round has to fund a long unproven period.",
    sourcing: {
      discoveryChannel: "Founder research",
      signalDate: "2026-05-26",
      signal: "Founder background",
      dateSourced: "2026-07-30",
      channel: "Founding team origin tracking in life sciences software",
      whyEntered:
        "Three engineers who built a large data platform company's life sciences practice left to build the same integration layer as a product. That is a specific and unusual bet: they are claiming the work they were paid to do bespoke can be generalised, and they have more evidence than anyone else about whether that is true.",
      whyTimely:
        "Pharmaceutical organisations are being asked to reason over evidence, assets, and clinical data together, and the systems holding those three things were never designed to be joined. The constraint is integration, not modelling, and that is exactly what this team spent years doing by hand.",
      whyOverlooked:
        "The company emerged from stealth in May 2026, is based in London rather than a United States healthcare hub, and sells infrastructure rather than a clinical product, which is the least visible position in healthcare technology.",
      whyNotObvious:
        "A funding database records a 12 million dollar seed in health software. It does not record that the founding team built this exact capability inside a company that sells it as a service, which is the reason to take the bet seriously at all.",
      evidenceNeeded:
        "Contract values and renewal behaviour at the named customers, and evidence that a second deployment took materially less work than the first. Without the second, this is a services business.",
      wellRecognised: false,
    },
    financing: {
      stage: "Seed",
      disclosedRound: "Seed",
      latestRound:
        "12 million dollar seed round announced 26 May 2026, led by Accel and Air Street Capital with Elder Gull participating.",
      latestRoundDate: "2026-05-26",
      latestRoundSourceId: "perceptic-fortune",
      totalDisclosedFunding: "12 million dollars",
      namedInvestors: ["Accel", "Air Street Capital", "Elder Gull"],
      capitalIntensity: "Low",
      futureCapitalRequirement:
        "Moderate. Software economics against enterprise sales cycles that consume runway before revenue arrives.",
      financingRisk:
        "Moderate. Recently and adequately funded for a seed company, with a long path to the next round.",
      missingInformation: [
        "Revenue and contract values",
        "Customer count beyond the named reference",
        "Pricing and business model",
        "Headcount",
      ],
    },
    technology: {
      howItWorks:
        "The platform sits above the systems a drug development organisation already runs and unifies asset scouting, scientific evaluation, and clinical data into one queryable layer, so a question about an asset can be answered against all of the relevant evidence at once.",
      coreAdvantage:
        "Knowing in advance how pharmaceutical data is actually shaped, badly and differently at every organisation, because the founding team spent years integrating it by hand at these customers.",
      supportingEvidence: [
        {
          claim:
            "Three founders who were core contributors to a large data platform company's life sciences practice raised 12 million dollars to build an end-to-end drug development platform, with deployments across pharmaceutical companies and contract research organisations.",
          sourceId: "perceptic-fortune",
          basis: "verified",
          provenance: "Independently verified",
        },
        {
          claim:
            "CSL is named as a customer, and the company reports asset evaluation falling from a week to an hour, screening moving from hundreds per week to thousands in minutes, and a fiftyfold improvement in clinical data extraction.",
          sourceId: "perceptic-airstreet",
          basis: "verified",
          provenance: "Investor-reported",
        },
        {
          claim:
            "The platform is described by the company as an intelligence layer unifying asset scouting, scientific evaluation, and clinical data across the drug development lifecycle.",
          sourceId: "perceptic-site",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      benchmarks:
        "The speed and throughput figures are the company's own, relayed by an investor. No methodology, baseline, or independent measurement is published for any of them.",
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "The customer's existing scientific, clinical, and regulatory systems, which the platform reads from and does not control.",
      milestoneForScale:
        "Evidence that a second and third deployment took materially less integration work than the first, which is the only thing separating a product from a consultancy in this category.",
      failurePoints: [
        "Integration effort that does not fall across deployments",
        "The incumbent the founders came from extending its own life sciences product",
        "Pharmaceutical procurement stalling a seed-stage company",
      ],
    },
    market: {
      painPoint:
        "Evidence, asset data, and clinical data sit in systems that were never designed to be joined, so every cross-cutting question in drug development is answered by people reconciling spreadsheets.",
      structure:
        "A small number of very large buyers with long procurement cycles, plus biotechnology firms and contract research organisations.",
      adoptionDrivers: [
        "Pressure to shorten drug development timelines",
        "Demand to reason over scientific and clinical data together rather than separately",
      ],
      competitors: [
        "Large data platform companies serving life sciences",
        "In-house pharmaceutical data engineering",
        "Scientific informatics vendors",
      ],
      substitutes: [
        "Consulting engagements",
        "Internal data teams building the same integrations",
      ],
      regulatoryEnvironment:
        "Clinical and patient data handling requirements apply, along with pharmaceutical data integrity expectations.",
      maturity: "Emerging",
      currentCatalyst:
        "Emergence from stealth with a named pharmaceutical customer and a seed round from established investors.",
    },
    commercial: {
      customerType:
        "Pharmaceutical companies, biotechnology firms, and contract research organisations.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Direct enterprise sales into scientific and data leadership, drawing on the founders' existing relationships.",
      adoptionEvidence: [
        {
          claim:
            "Deployment across multiple pharmaceutical companies, biotechnology firms, and contract research organisations, with one customer named. No contract values, customer count, or revenue are disclosed.",
          sourceId: "perceptic-airstreet",
          basis: "verified",
          provenance: "Investor-reported",
        },
      ],
      implementationBurden:
        "High. Connecting to a pharmaceutical organisation's scientific and clinical systems is the work, and it is where this category usually stalls.",
      expansionOpportunity:
        "Additional programmes and therapeutic areas within an organisation once the integration exists.",
      goToMarketRisk:
        "Selling infrastructure to a handful of very large, very slow buyers on a seed round.",
    },
    investment: {
      thesis:
        "A founding team productising the integration work they previously delivered by hand at these exact customers, attacking the constraint in drug development that is organisational rather than scientific, at seed stage with a named pharmaceutical reference already in place.",
      bullCase:
        "Integration effort falls sharply across deployments, and the platform becomes the layer pharmaceutical organisations reason over, with switching costs that grow with every connected system.",
      baseCase:
        "Strong references and slow enterprise adoption, with revenue quality depending on how much of each deployment is bespoke.",
      bearCase:
        "Every deployment stays bespoke, the incumbent extends its own product into the same position, and this becomes a well-regarded services business.",
      catalysts: [
        "A second named pharmaceutical customer with disclosed contract value",
        "Evidence that deployment time is falling",
      ],
      risks: [
        "Integration effort that does not generalise",
        "A well-resourced incumbent already inside the accounts",
        "Very small buyer universe",
      ],
      invalidators: [
        "Deployment time flat or rising across successive customers",
        "The named reference customer not expanding",
      ],
      recommendedNextStep:
        "Ask how long the second deployment took relative to the first. In this category that ratio is the entire difference between a product and a consultancy, and nothing else about the company can be judged without it.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "Which parts of an integration are reusable across customers, and which are rebuilt every time?",
      ],
      product: [
        "What is the baseline behind the claim that asset evaluation falls from a week to an hour?",
      ],
      customers: [
        "How many organisations are in production rather than in evaluation?",
      ],
      competition: [
        "How does this differ from what the founders delivered as a service at their previous employer?",
      ],
      unitEconomics: [
        "What share of contract value is delivery work rather than licence?",
      ],
      capitalRequirements: [
        "How long does the seed round fund, given pharmaceutical sales cycles?",
      ],
      regulation: [
        "How is clinical and patient data handled and segregated across customers?",
      ],
      team: [
        "How large is the team, and what proportion is delivery rather than engineering?",
      ],
      financing: ["What is current revenue, and what is contracted but unrecognised?"],
      commercialization: [
        "What is the time from first contact to a production deployment?",
      ],
    },
    outreach:
      "I have been researching where the real constraint sits in drug development, and my read is that it is integration rather than modelling: the evidence, the asset data, and the clinical data live in systems that were never meant to be joined. What makes Perceptic interesting is that your team did that joining by hand at these organisations before deciding it could be a product, so you know better than anyone what generalises. I would like to understand how much less work the second deployment took than the first. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(3, "judgment", "Medium",
        "An integration and reasoning layer above existing pharmaceutical systems, built by a team that delivered the same capability as a service.",
        "The differentiation is accumulated domain knowledge rather than novel technology, which is real but hard to defend."),
      technicalEvidence: fa(2, "verified", "Low",
        "Deployments reported by an investor with one named customer, and speed figures that are the company's own with no published baseline or methodology.",
        "Deployment is evidenced; every performance number is unmeasured by anyone outside the company.", "perceptic-airstreet"),
      defensibility: fa(3, "judgment", "Low",
        "Switching costs once a customer's systems are connected, against an incumbent that already sells into these accounts.",
        "Prospective. The moat would be integration depth, and none of it is disclosed."),
      marketImportance: fa(4, "judgment", "Medium",
        "Drug development timelines are a first-order cost in pharmaceutical economics, and the data fragmentation behind them is real.",
        "Genuinely important, with a small and slow buyer set."),
      commercialReadiness: fa(3, "verified", "Low",
        "Live deployments across pharmaceutical companies and contract research organisations with one named, and no pricing, contract value, or revenue disclosed.",
        "Past pilot with a real pharmaceutical reference, and nothing quantified.", "perceptic-airstreet"),
      customerEvidence: fa(3, "verified", "Low",
        "One named pharmaceutical customer plus unnamed deployments, all reported by the lead investor rather than confirmed independently.",
        "A named large-pharma reference at seed is meaningful; the source is an interested party."),
      teamCredibility: fa(4, "verified", "High",
        "Three founders reported by independent business press as core contributors to a large data platform company's life sciences practice, one with a prior research background at several universities.",
        "Directly relevant and independently reported, which is unusual at seed stage.", "perceptic-fortune"),
      capitalEfficiency: fa(4, "judgment", "Medium",
        "Pharmaceutical deployments including a named large customer reached on a 12 million dollar seed.",
        "Efficient, if the deployments are as substantial as reported."),
      competitiveIntensity: fa(2, "judgment", "Medium",
        "A very large data platform incumbent already inside these accounts, plus internal data teams and informatics vendors.",
        "Competing directly against the company the founders came from is the hardest version of this."),
      financingRisk: fa(4, "verified", "Medium",
        "12 million dollars raised in May 2026 from established investors, against a low capital requirement and long sales cycles.",
        "Comfortable for now.", "perceptic-fortune"),
      regulatoryRisk: fa(3, "judgment", "Medium",
        "Clinical and patient data handling requirements apply, without the company itself being a regulated product.",
        "Standard for infrastructure serving regulated customers."),
      sourcingOriginality: fa(5, "judgment", "Medium",
        "Out of stealth for two months, London based, and selling infrastructure rather than a clinical product, which is the least visible position in healthcare technology.",
        "Among the most under-examined companies in this universe."),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "The founders, their prior roles, the 2024 London founding, the financing, and the existence of pharmaceutical deployments are supported by original independent business reporting. The named customer and every performance figure come from the lead investor's own announcement and are labelled investor-reported. Revenue, contract values, pricing, headcount, and any independent measurement of the speed claims are not available.",
    sourceIds: ["perceptic-fortune", "perceptic-airstreet", "perceptic-site"],
    lastReviewed: REVIEWED,
  },
];

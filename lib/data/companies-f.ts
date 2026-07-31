import { fa, NOT_DISCLOSED, type PrivateCompany } from "../types";

/** Verified private companies, part six. See companies-a.ts for the data policy. */

const REVIEWED = "2026-07-30";

export const COMPANIES_F: PrivateCompany[] = [
  /* ------------------------------------------------------------------ Socket */
  {
    id: "socket",
    name: "Socket",
    website: "https://socket.dev",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series B announced October 2024 as a private financing, with no listing or acquisition notice.",
    headquarters: "San Francisco, California, United States",
    region: "North America",
    foundedYear: 2020,
    founders: ["Feross Aboukhadijeh"],
    sector: "Enterprise Infrastructure Software",
    subsector: "Software supply chain security",
    description:
      "Inspects the actual behaviour of open source packages rather than matching them against a vulnerability list, so that a package which starts exfiltrating data is caught on the change rather than after disclosure.",
    targetCustomer:
      "Security and platform engineering teams at companies shipping software built on open source dependencies.",
    businessModel: "Annual subscription sold to engineering organisations.",
    technicalDifferentiation:
      "Detecting malicious behaviour on introduction rather than known vulnerabilities after publication. A vulnerability database is always behind an active attacker; behavioural analysis does not have to be.",
    tractionSignal:
      "The company states its platform blocks over 100 software supply chain attacks weekly and secures more than 7,500 organisations and 300,000 repositories.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2024-10-22",
    recentCatalyst:
      "40 million dollar Series B led by Abstract Ventures with Elad Gil and Andreessen Horowitz, bringing total funding to 65 million dollars.",
    primaryCompetitors: [
      "Legacy software composition analysis vendors",
      "Chainguard",
      "Cloud provider native dependency scanning",
    ],
    mainTechnicalRisk:
      "Behavioural detection produces false positives, and a security tool that interrupts developers too often gets disabled.",
    mainCommercialRisk:
      "Code hosting platforms bundle dependency scanning free, which sets a low anchor price for anything adjacent.",
    mainFinancingRisk:
      "Modest by category standards. The business is software with a low capital requirement.",
    sourcing: {
      discoveryChannel: "Open-source activity",
      signalDate: "2024-10-22",
      signal: "Open-source adoption",
      dateSourced: "2026-05-14",
      channel: "Open source security tooling adoption scan",
      whyEntered:
        "The company publishes attack disclosures on malicious packages it catches, which is a continuous public record of the product working rather than a claim about it. Very few security companies can produce that kind of evidence week after week.",
      whyTimely:
        "Supply chain attacks moved from a theoretical risk to a routine one, and procurement requirements in regulated industries now name the category explicitly.",
      whyOverlooked:
        "Overshadowed in searches by the larger and better funded companies in adjacent supply chain security categories, despite attacking a different problem.",
      whyNotObvious:
        "A database search files this alongside vulnerability scanners, which is the category it was built to replace rather than the one it belongs to.",
      evidenceNeeded:
        "Net revenue retention and the false positive rate in production, which together determine whether developers keep the tool enabled.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series B",
      disclosedRound: "Series B",
      latestRound:
        "40 million dollar Series B led by Abstract Ventures with participation from Elad Gil and Andreessen Horowitz, bringing total funding to 65 million dollars.",
      latestRoundDate: "2024-10-22",
      latestRoundSourceId: "socket-seriesb",
      totalDisclosedFunding: "65 million dollars",
      namedInvestors: ["Abstract Ventures", "Andreessen Horowitz", "Elad Gil"],
      capitalIntensity: "Low",
      futureCapitalRequirement: "Low. A software business with software economics.",
      financingRisk:
        "Low. Adequately funded, with the most recent disclosure now over a year old.",
      missingInformation: [
        "Revenue",
        "Net revenue retention",
        "Pricing",
        "Any financing after October 2024",
      ],
    },
    technology: {
      howItWorks:
        "Each package version is analysed for what its code actually does, including newly introduced network calls, filesystem access, and obfuscation, and flagged when behaviour changes between versions.",
      coreAdvantage:
        "Behaviour on introduction rather than known vulnerabilities after the fact, which is the only approach that can catch an attack the day it lands.",
      supportingEvidence: [
        {
          claim:
            "The company states it blocks over 100 supply chain attacks weekly across more than 7,500 organisations and 300,000 repositories.",
          sourceId: "socket-seriesb",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Independent business press covered the Series B and the behavioural detection approach.",
          sourceId: "socket-forbes",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Package registries and code hosting platforms, which control the integration points and also ship competing scanning.",
      milestoneForScale:
        "Evidence that enterprise customers keep the tool enforcing rather than merely reporting, which is where security tooling usually stalls.",
      failurePoints: [
        "False positive rates high enough that teams disable enforcement",
        "Platform vendors bundling equivalent behavioural analysis",
        "Registry access terms changing",
      ],
    },
    market: {
      painPoint:
        "Organisations inherit thousands of dependencies and learn about a malicious one only after it is disclosed, by which point it has already run.",
      structure:
        "Broad enterprise demand led by security teams, with a free developer tier setting adoption.",
      adoptionDrivers: [
        "Supply chain attacks becoming routine rather than exceptional",
        "Procurement requirements naming the category",
      ],
      competitors: [
        "Legacy software composition analysis vendors",
        "Chainguard",
        "Platform native scanning",
      ],
      substitutes: ["Vulnerability scanning", "Manual dependency review"],
      regulatoryEnvironment:
        "No direct product regulation. Government and regulated-industry software requirements drive demand.",
      maturity: "Developing",
      currentCatalyst:
        "Continued public disclosure of blocked attacks, which functions as ongoing product evidence.",
    },
    commercial: {
      customerType: "Security and platform engineering teams.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Developer-led adoption through a free tier, converting to enterprise contracts.",
      adoptionEvidence: [
        {
          claim:
            "More than 7,500 organisations and 300,000 repositories secured, per the company.",
          sourceId: "socket-seriesb",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden: "Low. Integrates into existing code review workflows.",
      expansionOpportunity:
        "Additional languages and ecosystems within existing customers.",
      goToMarketRisk:
        "Competing against free platform features anchors the price of the paid product.",
    },
    investment: {
      thesis:
        "A behavioural approach to a problem the incumbent category structurally cannot solve, with a continuous public record of the product working, at a stage where the commercial figures are not yet disclosed.",
      bullCase:
        "Behavioural detection becomes the expected standard, and the accumulated package analysis corpus makes the position hard to reproduce.",
      baseCase:
        "Solid growth in a category with clear demand and persistent pricing pressure from free alternatives.",
      bearCase:
        "Platform vendors ship adequate behavioural scanning free, and the standalone purchase loses its rationale.",
      catalysts: [
        "An updated financing or revenue disclosure",
        "Evidence that enterprise customers run the tool in enforcing mode",
      ],
      risks: [
        "Platform bundling",
        "False positive fatigue",
        "A funding record now over a year old",
      ],
      invalidators: [
        "A major code hosting platform shipping equivalent behavioural analysis at no cost",
        "Evidence that customers run the tool in reporting mode only",
      ],
      recommendedNextStep:
        "Ask what proportion of enterprise customers run the tool in enforcing rather than reporting mode. That single ratio separates a security product from a dashboard.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What is the false positive rate in production, and how is it measured?",
      ],
      product: [
        "Which language ecosystems are covered to the same depth?",
      ],
      customers: [
        "What proportion of enterprise customers enforce rather than report?",
      ],
      competition: [
        "What behavioural analysis do the major code hosting platforms ship today?",
      ],
      unitEconomics: [
        "What is gross margin after the cost of analysing every package version?",
      ],
      capitalRequirements: [
        "What is the analysis infrastructure cost as the package corpus grows?",
      ],
      regulation: [
        "Which procurement requirements name behavioural supply chain analysis specifically?",
      ],
      team: [
        "How large is the security research team relative to engineering?",
      ],
      financing: [
        "Has any round closed since October 2024, and what is current revenue?",
      ],
      commercialization: [
        "What is the conversion rate from the free tier to enterprise contracts?",
      ],
    },
    outreach:
      "I have been researching software supply chain security, and the decision to analyse what a package actually does rather than match it against a vulnerability list is the distinction that seems to matter most. A database is always behind an attacker by definition. The weekly disclosures of blocked attacks are unusually concrete evidence for a security product. I would like to understand what proportion of enterprise customers run it in enforcing mode. Would you be open to a call?",
    factors: {
      technicalDifferentiation: fa(4, "verified", "High",
        "Behavioural analysis of package code on introduction, rather than matching against a known vulnerability database.",
        "A genuinely different detection model from the incumbent category.", "socket-seriesb"),
      technicalEvidence: fa(5, "verified", "High",
        "Continuous public disclosure of blocked supply chain attacks, plus stated coverage of 7,500 organisations and 300,000 repositories.",
        "An ongoing public record of the product working is stronger evidence than any benchmark.", "socket-seriesb"),
      defensibility: fa(3, "judgment", "Medium",
        "An accumulated corpus of analysed package versions, against platform vendors who could bundle equivalent scanning.",
        "Moderate. The corpus compounds; the integration point is owned by others."),
      marketImportance: fa(4, "verified", "High",
        "Supply chain attacks are routine and procurement requirements now name the category.",
        "Demand is a requirement rather than a preference."),
      commercialReadiness: fa(4, "verified", "Medium",
        "Enterprise customers at scale on a developer-led motion.",
        "Genuinely commercial and repeatable.", "socket-seriesb"),
      customerEvidence: fa(4, "verified", "Medium",
        "More than 7,500 organisations secured, stated by the company with no revenue figure disclosed.",
        "Broad adoption evidence, sourced only to the company.", "socket-seriesb"),
      teamCredibility: fa(4, "verified", "Medium",
        "Founded in 2020 by Feross Aboukhadijeh, with a long record in open source package tooling before the company.",
        "Directly relevant background in the ecosystem the product secures.", "socket-forbes"),
      capitalEfficiency: fa(4, "judgment", "Medium",
        "Broad adoption reached on 65 million dollars total.",
        "Efficient for a security company at this reach."),
      competitiveIntensity: fa(2, "judgment", "Medium",
        "Legacy scanning vendors, an adjacent well-funded competitor, and free platform features.",
        "Crowded, with the free alternative the most dangerous."),
      financingRisk: fa(4, "verified", "Low",
        "65 million dollars raised against a low capital requirement, though the last disclosure is over a year old.",
        "Comfortable, with the age of the data point the main uncertainty.", "socket-seriesb"),
      regulatoryRisk: fa(5, "judgment", "High",
        "No direct product regulation, and regulation drives demand rather than constraining it.",
        "Regulation works in this company's favour."),
      sourcingOriginality: fa(4, "judgment", "Medium",
        "Attacks a different problem from the better-known companies it is filed alongside in searches.",
        "Under-examined relative to adjacent supply chain security names."),
    },
    dataConfidence: "High",
    dataConfidenceNote:
      "Founder, founding year, headquarters, financing, and adoption figures are supported by the company's own announcement with independent business press corroboration. Revenue, retention, and pricing are not disclosed, and no financing has been announced since October 2024.",
    sourceIds: ["socket-seriesb", "socket-forbes"],
    lastReviewed: REVIEWED,
  },

  /* -------------------------------------------------------------------- Zed */
  {
    id: "zed-industries",
    name: "Zed Industries",
    website: "https://zed.dev",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series B announced August 2025 as a private financing, with no listing or acquisition notice.",
    headquarters: "Remote, United States",
    region: "North America",
    foundedYear: NOT_DISCLOSED,
    founders: ["Nathan Sobo"],
    sector: "Enterprise Infrastructure Software",
    subsector: "Developer tools and collaborative code editing",
    description:
      "An open source code editor written in Rust and built for performance, extended so that developers and AI agents can work in the same buffer at the same time rather than through a chat window beside it.",
    targetCustomer:
      "Professional software teams, with adoption beginning from individual developers.",
    businessModel:
      "Open source with an optional paid service, and the company has stated it intends to apply the same approach to its new storage technology.",
    technicalDifferentiation:
      "Building the editor from scratch in Rust with the collaboration primitives at the core, rather than adding agents to an architecture that assumed one human author.",
    tractionSignal:
      "The public repository carries roughly 87,800 stars, 9,800 forks, and 482 named contributors, with pull request numbering past 61,900, all queryable directly through the GitHub API on 31 July 2026. The company has separately claimed a larger contributor count and an active developer figure that no independent source supports. Neither is used here.",
    tractionProvenance: "Independently verified",
    tractionAsOf: "2026-07-31",
    recentCatalyst:
      "32 million dollar Series B led by Sequoia Capital announced 20 August 2025, bringing total funding to over 42 million dollars.",
    primaryCompetitors: [
      "Established integrated development environments",
      "AI-first code editors",
      "Terminal-based editors with agent plugins",
    ],
    mainTechnicalRisk:
      "Editor adoption is decided by ecosystem depth as much as by performance, and a new editor starts with none of the extension catalogue incumbents accumulated over decades.",
    mainCommercialRisk:
      "The stated model is a free open source editor with an optional paid service, and no conversion rate, paid seat count, or revenue is disclosed.",
    mainFinancingRisk:
      "A modest raise against competitors with far larger war chests in the same category.",
    sourcing: {
      discoveryChannel: "Open-source activity",
      signalDate: "2025-08-20",
      signal: "Open-source adoption",
      dateSourced: "2026-06-18",
      channel: "Developer tooling repository and release-cadence tracking",
      whyEntered:
        "A team rebuilding an editor from first principles in Rust, then attracting a lead investor at Series B, is making an argument that the architecture matters more than the feature list. The shipping cadence in the public repository is the evidence for whether that argument is being executed.",
      whyTimely:
        "Agents are being added to editors designed on the assumption of one human author. If multi-author collaboration has to be architectural rather than bolted on, the window for a rebuilt editor is now.",
      whyOverlooked:
        "Developer tools with no disclosed business model are easy for investors to admire and hard to underwrite, which suppresses attention relative to the product's technical reception.",
      whyNotObvious:
        "A funding database records a Series B in developer tools. It does not record the release cadence or the technical reception, which is where the actual evidence about this team lives.",
      evidenceNeeded:
        "A stated business model and any revenue or paid seat disclosure, neither of which exists publicly.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series B",
      disclosedRound: "Series B",
      latestRound:
        "32 million dollar Series B led by Sequoia Capital with participation from Redpoint Ventures and Root Ventures, bringing total funding to over 42 million dollars.",
      latestRoundDate: "2025-08-20",
      latestRoundSourceId: "zed-blog",
      totalDisclosedFunding: "Over 42 million dollars",
      namedInvestors: ["Sequoia Capital", "Redpoint Ventures", "Root Ventures"],
      capitalIntensity: "Low",
      futureCapitalRequirement:
        "Moderate. An engineering-heavy cost base with no infrastructure requirement.",
      financingRisk:
        "Moderate. Well funded for the stage, with no disclosed revenue to underwrite the next round.",
      missingInformation: [
        "Pricing and free-to-paid conversion",
        "Revenue",
        "Paid seat counts",
        "Founding year",
      ],
    },
    technology: {
      howItWorks:
        "The editor is written in Rust with a custom rendering and concurrency layer, and the collaboration model treats a human and an agent as equivalent participants editing shared state.",
      coreAdvantage:
        "Treating agents as first-class editing participants rather than as a side panel, which is an architectural decision that cannot be retrofitted easily.",
      supportingEvidence: [
        {
          claim:
            "The company announced a Series B led by Sequoia Capital to build real-time collaboration between developers and AI agents inside the editor.",
          sourceId: "zed-blog",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Roughly 87,800 stars, 9,800 forks, and 482 named contributors on the public repository, with pull request numbering past 61,900. Queryable directly through the GitHub API rather than asserted by anyone.",
          sourceId: "zed-github",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty:
        "The editor is open source. Distribution rather than protection is the asset.",
      thirdPartyDependency:
        "Language servers and model providers, both supplied by others.",
      milestoneForScale:
        "A disclosed conversion rate from repository adoption to the paid service, since that ratio is the only thing turning developer interest into revenue.",
      failurePoints: [
        "Extension ecosystem depth never matching incumbents",
        "Incumbent editors adding adequate agent collaboration",
        "Free-to-paid conversion too low to support the cost base",
      ],
    },
    market: {
      painPoint:
        "Editors were designed for a single human author, and agent assistance is being attached to that assumption rather than built into it.",
      structure:
        "Individual developer adoption, with team purchases following only if a paid tier exists.",
      adoptionDrivers: [
        "Agent-assisted coding becoming standard practice",
        "Performance frustration with established editors",
      ],
      competitors: [
        "Established integrated development environments",
        "AI-first code editors",
      ],
      substitutes: ["Existing editors with agent plugins"],
      regulatoryEnvironment: "No direct product regulation.",
      maturity: "Developing",
      currentCatalyst:
        "The Series B and the shift toward multi-participant editing.",
    },
    commercial: {
      customerType: "Professional software developers and teams.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Developer-led adoption of the free open source editor, with an optional paid service above it.",
      adoptionEvidence: [
        {
          claim:
            "Repository adoption at the scale above. No paid seats, conversion rate, named customers, or revenue are disclosed anywhere, and the company's active developer figure has no independent support, so it is not relied on.",
          sourceId: "zed-github",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      implementationBurden: "Low. Installing an editor.",
      expansionOpportunity:
        "Team and enterprise tiers, if a business model is introduced.",
      goToMarketRisk:
        "Converting free open source users to a paid service is the hardest commercial position in developer tools, and no conversion figure is disclosed.",
    },
    investment: {
      thesis:
        "A technically ambitious rebuild of a tool developers use all day, positioned for a shift in how code gets written, with real adoption and an unquantified path from that adoption to revenue.",
      bullCase:
        "Multi-participant editing becomes the norm, the architecture proves decisive, and a team tier converts a large developer base.",
      baseCase:
        "A beloved editor with strong technical reception and slow monetisation.",
      bearCase:
        "Incumbents add adequate agent collaboration, ecosystem depth wins, and free-to-paid conversion stays negligible.",
      catalysts: [
        "A disclosed free-to-paid conversion rate or paid seat count",
        "Evidence that agent collaboration drives paid upgrades",
      ],
      risks: [
        "Unquantified free-to-paid conversion",
        "Ecosystem depth versus incumbents",
        "Well-funded competitors in the same category",
      ],
      invalidators: [
        "An incumbent editor shipping equivalent agent collaboration",
        "Evidence that paid conversion is negligible against this level of adoption",
      ],
      recommendedNextStep:
        "Ask how an active developer is counted, and what proportion of them pay for the optional service. The company's own usage figure has no independent support, and the conversion rate behind it has never been stated.",
      confidence: "Low",
    },
    diligence: {
      technology: [
        "What does the collaboration architecture allow that a plugin cannot?",
      ],
      product: [
        "How deep is the extension ecosystem relative to what professional teams require?",
      ],
      customers: [
        "How is an active developer counted, and can that definition be audited?",
      ],
      competition: [
        "What agent collaboration have incumbent editors shipped in the last year?",
      ],
      unitEconomics: [
        "What does serving an active user cost, given model inference is involved?",
      ],
      capitalRequirements: [
        "What does the current plan fund, and for how long?",
      ],
      regulation: ["What data handling applies when code is sent to model providers?"],
      team: ["What is the founding year, and how large is the engineering team?"],
      financing: ["What revenue, if any, exists today?"],
      commercialization: [
        "What proportion of active developers subscribe to the paid service?",
      ],
    },
    outreach:
      "I have been researching how coding tools are adapting to agents, and the argument implicit in rebuilding an editor in Rust rather than extending an existing one is the part I find most interesting. Treating an agent as a participant in shared editing state rather than as a panel beside it is an architectural claim, not a feature. I would like to understand how you are thinking about turning that into a business. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(4, "judgment", "Medium",
        "A from-scratch Rust editor with collaboration primitives at the core rather than added on.",
        "A real architectural difference, in a category where architecture rarely decides adoption."),
      technicalEvidence: fa(4, "verified", "High",
        "A shipping open source editor with roughly 87,800 stars, 9,800 forks, and 482 named contributors, all verifiable directly through the GitHub API. No performance figures published.",
        "Repository metrics are among the few adoption numbers in this universe a reader can check independently in seconds.", "zed-github"),
      defensibility: fa(2, "judgment", "Low",
        "Open source with a permissive posture and no disclosed proprietary asset.",
        "Weak. The architecture is visible to anyone who wants to copy it."),
      marketImportance: fa(4, "judgment", "Medium",
        "Every professional developer uses an editor daily, and the interaction model is being renegotiated.",
        "Large and in flux, which is when incumbency is most vulnerable."),
      commercialReadiness: fa(2, "verified", "Low",
        "A stated open source model with an optional paid service, and no disclosed pricing, conversion, or revenue.",
        "A mechanism exists; nothing about its performance is public.", "zed-blog"),
      customerEvidence: fa(2, "verified", "Medium",
        "Substantial verifiable repository adoption, with no paid seats, named customers, or revenue disclosed anywhere.",
        "Developer interest is real and checkable. A paying relationship is entirely absent from the record.", "zed-github"),
      teamCredibility: fa(4, "verified", "Medium",
        "Led by Nathan Sobo, with a long prior record building code editors before this company.",
        "Directly relevant, and the product is itself evidence of execution.", "zed-blog"),
      capitalEfficiency: fa(3, "judgment", "Low",
        "Over 42 million dollars raised to reach a top-tier open source repository, with no disclosed revenue.",
        "Efficient on developer reach, unassessable on revenue."),
      competitiveIntensity: fa(2, "judgment", "Medium",
        "Incumbent editors with enormous ecosystems and better-funded AI-first competitors.",
        "One of the harder competitive positions in developer tools."),
      financingRisk: fa(3, "verified", "Medium",
        "32 million dollar Series B from a major lead, with no revenue to underwrite the next round.",
        "Comfortable now, exposed at the next raise.", "zed-blog"),
      regulatoryRisk: fa(5, "judgment", "High",
        "No direct product regulation.", "Effectively none."),
      sourcingOriginality: fa(3, "judgment", "Medium",
        "Well regarded technically but lightly examined commercially, and this financing drew no independent press coverage that could be found.",
        "Moderately under-examined, largely by the company's own choice."),
    },
    dataConfidence: "Low",
    dataConfidenceNote:
      "Financing, lead investor, total raised, the business model, and the product direction come from the company's own announcement. No independent reporting on this financing was found, only a publication reproducing the announcement, which is not corroboration. Adoption is measured instead from the public repository, which anyone can query. The company's claim of more than 150,000 active developers has no independent support and was removed rather than repeated. Founding year, pricing, revenue, and paid seat counts are not disclosed.",
    sourceIds: ["zed-blog", "zed-github", "zed-startuphub"],
    lastReviewed: REVIEWED,
  },

  /* ---------------------------------------------------------------- Inngest */
  {
    id: "inngest",
    name: "Inngest",
    website: "https://www.inngest.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series A reported as a private financing, with no listing or acquisition notice.",
    headquarters: "San Francisco, California, United States",
    region: "North America",
    foundedYear: NOT_DISCLOSED,
    founders: [],
    sector: "Enterprise Infrastructure Software",
    subsector: "Durable execution and workflow orchestration",
    description:
      "A durable execution engine that lets developers write long-running, multi-step workflows as ordinary code, with the platform handling retries, state, and replay when a step or a server fails.",
    targetCustomer:
      "Engineering teams running long-lived asynchronous work, increasingly AI agent workflows that call models and wait on humans.",
    businessModel:
      "Usage-based platform pricing, with a self-serve entry point and an enterprise tier.",
    technicalDifferentiation:
      "Durability is provided by the platform rather than assembled by the developer from queues, retries, and a state store, which removes an entire category of failure handling from application code.",
    tractionSignal:
      "The company names SoundCloud, Tripadvisor, Contentful, and Resend as relying on the platform for core workflows.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "21 million dollar Series A led by Altimeter to serve AI workflow automation, following a 6.1 million dollar seed round led by Andreessen Horowitz.",
    primaryCompetitors: [
      "Durable execution platforms",
      "Cloud provider workflow services",
      "Self-managed queue and worker infrastructure",
    ],
    mainTechnicalRisk:
      "Durable execution requires deterministic replay, and non-deterministic model calls inside a workflow are exactly the case the guarantee handles least naturally.",
    mainCommercialRisk:
      "Cloud providers offer workflow services bundled into platforms customers already pay for.",
    mainFinancingRisk:
      "Modest capital relative to the better-funded competitors in durable execution.",
    sourcing: {
      discoveryChannel: "Customer signal",
      signalDate: "2025-06-01",
      signal: "Customer announcement",
      dateSourced: "2026-07-02",
      channel: "Named customer disclosure scan in developer infrastructure",
      whyEntered:
        "Named production customers at recognisable engineering organisations, disclosed for a Series A company. Most infrastructure companies at that stage describe capability rather than adoption, and the named list is checkable.",
      whyTimely:
        "Agent workflows are long-running, failure-prone, and involve waiting on humans and models, which is the exact shape durable execution was built for. The category's demand changed underneath it.",
      whyOverlooked:
        "Durable execution is an infrastructure primitive most investors do not have a mental model for, and the category leader absorbs most of the attention paid to it.",
      whyNotObvious:
        "A search returns a Series A in developer tools. It does not surface that named consumer-scale companies already run core workflows on it, which is the fact that changes the assessment.",
      evidenceNeeded:
        "Net revenue retention and the proportion of usage that is AI agent workflows rather than conventional background jobs.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series A",
      disclosedRound: "Series A",
      latestRound:
        "21 million dollar Series A led by Altimeter, following a 6.1 million dollar seed round led by Andreessen Horowitz announced January 2024.",
      latestRoundDate: "2025-06-01",
      latestRoundSourceId: "inngest-seriesa",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: ["Altimeter", "Andreessen Horowitz"],
      capitalIntensity: "Low",
      futureCapitalRequirement: "Moderate. Software economics with infrastructure costs.",
      financingRisk: "Moderate. Recently funded in a competitive category.",
      missingInformation: [
        "Revenue",
        "Founders and founding year",
        "Total capital raised",
        "Customer count beyond the named references",
      ],
    },
    technology: {
      howItWorks:
        "A workflow is written as a function whose steps are individually checkpointed. If a step fails or a server restarts, the platform replays from the last completed step rather than from the beginning.",
      coreAdvantage:
        "Failure handling moves from application code into the platform, which is where it belongs and where most teams get it wrong.",
      supportingEvidence: [
        {
          claim:
            "The company names SoundCloud, Tripadvisor, Contentful, and Resend as relying on the platform for core workflows.",
          sourceId: "inngest-site",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Seed financing led by Andreessen Horowitz was independently reported and announced by the company.",
          sourceId: "inngest-techcrunch",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Cloud infrastructure, supplied by providers who also offer competing workflow services.",
      milestoneForScale:
        "Evidence that AI agent workloads, rather than conventional background jobs, are driving usage growth.",
      failurePoints: [
        "Deterministic replay fitting poorly around non-deterministic model calls",
        "Cloud providers bundling adequate durable execution",
        "The category leader's ecosystem advantage compounding",
      ],
    },
    market: {
      painPoint:
        "Teams assemble long-running workflows from queues, retries, and a state store, and the resulting failure handling is where most production incidents originate.",
      structure:
        "Broad developer demand, with adoption led by engineers and expanded through usage.",
      adoptionDrivers: [
        "Agent workflows that are long-running and failure-prone by nature",
        "Growing acceptance of durable execution as a distinct primitive",
      ],
      competitors: [
        "Durable execution platforms",
        "Cloud provider workflow services",
      ],
      substitutes: ["Self-managed queues and workers", "Cron plus a database"],
      regulatoryEnvironment: "No direct product regulation.",
      maturity: "Developing",
      currentCatalyst:
        "The Series A raised explicitly around AI workflow automation.",
    },
    commercial: {
      customerType: "Engineering and platform teams.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Self-serve developer adoption with an enterprise tier above it.",
      adoptionEvidence: [
        {
          claim:
            "Named companies relying on the platform for core workflows, listed by the company.",
          sourceId: "inngest-site",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Low to moderate. Workflows are rewritten as durable functions, which is a code change rather than an infrastructure one.",
      expansionOpportunity:
        "Usage growth as agent workflows proliferate within existing customers.",
      goToMarketRisk:
        "Competing against a bundled cloud service and against a better-known category leader simultaneously.",
    },
    investment: {
      thesis:
        "An infrastructure primitive whose demand profile changed in its favour, with named production customers unusually early, in a category where the leader is better known but not obviously better positioned for agent workloads.",
      bullCase:
        "Agent workflows make durable execution mainstream, and the developer-led motion compounds into infrastructure revenue.",
      baseCase:
        "Steady growth as a credible alternative in a category with a dominant name.",
      bearCase:
        "Cloud providers bundle adequate durable execution and the category consolidates around the leader.",
      catalysts: [
        "Disclosed revenue or retention figures",
        "Evidence that agent workflows drive the majority of usage growth",
      ],
      risks: [
        "Cloud provider bundling",
        "A better-known category leader",
        "Replay semantics around non-deterministic calls",
      ],
      invalidators: [
        "A cloud provider shipping equivalent durable execution natively",
        "Named reference customers migrating away",
      ],
      recommendedNextStep:
        "Establish what proportion of usage is agent workflows rather than conventional background jobs. The Series A thesis rests on that mix shifting.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "How does deterministic replay behave when a step calls a non-deterministic model?",
      ],
      product: [
        "What does a team have to change to move an existing workflow onto the platform?",
      ],
      customers: [
        "What proportion of usage comes from the named reference customers?",
      ],
      competition: [
        "Where has the company won and lost against the category leader?",
      ],
      unitEconomics: [
        "What is gross margin after the infrastructure cost of checkpointing every step?",
      ],
      capitalRequirements: ["What does the Series A fund, and over what horizon?"],
      regulation: ["What data residency options exist for regulated customers?"],
      team: ["Who founded the company, and in what year?"],
      financing: ["What is total capital raised, and what is current revenue?"],
      commercialization: [
        "What is the conversion rate from self-serve to enterprise contracts?",
      ],
    },
    outreach:
      "I have been researching durable execution, and the shift that interests me is that agent workflows have exactly the shape the primitive was designed for: long-running, failure-prone, and frequently waiting on something outside the process. Seeing named consumer-scale companies running core workflows on the platform this early is unusual. I would like to understand how much of current usage is agent work rather than conventional background jobs. Would you be open to a call?",
    factors: {
      technicalDifferentiation: fa(3, "judgment", "Medium",
        "Durable execution as a platform primitive with a developer-friendly programming model.",
        "A sound design choice in a category where the primitive is not novel."),
      technicalEvidence: fa(4, "verified", "Medium",
        "Named companies relying on the platform for core production workflows.",
        "Named production references are strong evidence at Series A.", "inngest-site"),
      defensibility: fa(3, "judgment", "Medium",
        "Switching costs once workflows are rewritten as durable functions.",
        "Real but not exceptional; the rewrite is a code change rather than a data migration."),
      marketImportance: fa(4, "judgment", "Medium",
        "Long-running asynchronous work is universal, and agent workflows are expanding it.",
        "Broad demand with a favourable structural shift."),
      commercialReadiness: fa(4, "verified", "Medium",
        "Production customers on a self-serve motion with an enterprise tier.",
        "Genuinely commercial and repeatable.", "inngest-site"),
      customerEvidence: fa(4, "verified", "Medium",
        "Four named companies relying on the platform, disclosed by the company.",
        "Named references beat aggregate claims, though revenue is not disclosed.", "inngest-site"),
      teamCredibility: fa(3, "judgment", "Low",
        "The company does not publish founder names or founding year, and none was confirmed from a primary source.",
        "Rated on incomplete public information rather than any negative finding."),
      capitalEfficiency: fa(4, "judgment", "Medium",
        "Named production customers reached before and shortly after a 21 million dollar Series A.",
        "Efficient for infrastructure software."),
      competitiveIntensity: fa(2, "judgment", "Medium",
        "A well-known category leader plus cloud provider workflow services.",
        "Difficult on both flanks."),
      financingRisk: fa(3, "verified", "Medium",
        "21 million dollar Series A led by a growth investor, following a seed led by a major firm.",
        "Comfortable for the stage.", "inngest-seriesa"),
      regulatoryRisk: fa(5, "judgment", "High",
        "No direct product regulation.", "Effectively none."),
      sourcingOriginality: fa(4, "judgment", "Medium",
        "A primitive most investors do not model, with attention concentrated on the category leader.",
        "Under-examined relative to its named customer base."),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Financing rounds, lead investors, named production customers, and the product are supported by the company's own site and announcement with independent reporting of the seed round. Founders, founding year, total capital raised, and revenue are not disclosed.",
    sourceIds: ["inngest-seriesa", "inngest-site", "inngest-techcrunch"],
    lastReviewed: REVIEWED,
  },

  /* --------------------------------------------------------------- Positron */
  {
    id: "positron-ai",
    name: "Positron AI",
    website: "https://www.positron.ai",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series B announced February 2026 as a private financing, with no listing or acquisition notice.",
    headquarters: "Reno, Nevada, United States",
    region: "North America",
    foundedYear: 2023,
    founders: ["Thomas Sohmers", "Edward Kmett"],
    sector: "Semiconductors & Advanced Computing",
    subsector: "Memory-optimised inference accelerators",
    description:
      "Builds inference accelerators designed around memory bandwidth utilisation rather than peak arithmetic, shipping a first-generation system while developing custom silicon behind it.",
    targetCustomer:
      "Operators serving transformer inference where cost and power per token decide the economics.",
    businessModel: "Sale of inference systems to datacentre and cloud operators.",
    technicalDifferentiation:
      "Shipping on reconfigurable silicon first let the company get a memory-optimised architecture into customers' hands years before a custom chip could exist, and the architecture is the claim rather than the process node.",
    tractionSignal:
      "Positron reports Atlas usage across customer categories including content delivery network operators and AI infrastructure providers, and states Atlas delivers 3.5 times better performance per dollar and up to 66 percent lower power than a named incumbent accelerator at 93 percent memory bandwidth utilisation. Independent technology press separately reported a major internet infrastructure operator evaluating Atlas.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "230 million dollar Series B at a post-money valuation above one billion dollars announced 4 February 2026, funding the move from shipping Atlas systems to the Asimov custom silicon generation, with tape-out targeted for late 2026 and production in early 2027.",
    primaryCompetitors: [
      "NVIDIA",
      "d-Matrix",
      "Etched",
      "Hyperscaler in-house inference accelerators",
    ],
    mainTechnicalRisk:
      "The custom silicon generation has not shipped, and the reconfigurable-silicon advantage narrows as competitors ship purpose-built parts.",
    mainCommercialRisk:
      "Performance claims are vendor-published on vendor-selected configurations, with no independent reproduction.",
    mainFinancingRisk:
      "A billion dollar valuation set before the custom silicon that the roadmap depends on has been demonstrated.",
    sourcing: {
      discoveryChannel: "Product launch",
      signalDate: "2026-02-04",
      signal: "Product launch",
      dateSourced: "2026-03-10",
      channel: "Inference silicon shipment and architecture tracking",
      whyEntered:
        "The company shipped a working inference product on reconfigurable silicon while competitors were still taping out. Choosing to be in market early on less efficient silicon, rather than waiting for a custom part, is a sequencing decision that reveals how the team thinks about risk.",
      whyTimely:
        "Memory bandwidth, not arithmetic, is the binding constraint on inference cost, and a company already shipping against that constraint has a window before purpose-built parts arrive.",
      whyOverlooked:
        "Based in Reno rather than a semiconductor hub, and initially discounted by observers because reconfigurable silicon is conventionally seen as a prototyping technology rather than a product one.",
      whyNotObvious:
        "Database searches for AI chips return the well-funded custom silicon companies. A company shipping on reconfigurable silicon is easy to file as a prototype rather than as a product.",
      evidenceNeeded:
        "Independent reproduction of the performance claims on a customer workload, and evidence that the custom silicon generation is on schedule.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series B",
      disclosedRound: "Series B",
      latestRound:
        "230 million dollar Series B at a post-money valuation above one billion dollars, co-led by ARENA Private Wealth, Jump Trading, and Unless, with strategic investment from Qatar Investment Authority, Arm, and Helena, and continued participation from Valor Equity Partners, Atreides Management, DFJ Growth, Resilience Reserve, Flume Ventures, and 1517. It follows a 51.6 million dollar Series A in July 2025.",
      latestRoundDate: "2026-02-04",
      latestRoundSourceId: "positron-seriesb",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "ARENA Private Wealth",
        "Jump Trading",
        "Unless",
        "Qatar Investment Authority",
        "Arm",
        "Helena",
        "Valor Equity Partners",
        "Atreides Management",
        "DFJ Growth",
        "1517",
      ],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "High. Custom silicon development and manufacturing precede the revenue that would justify them.",
      financingRisk:
        "Moderate on cash after a large round, higher on the valuation set ahead of the custom silicon.",
      missingInformation: [
        "Revenue",
        "Total capital raised across all rounds",
        "Unit shipment volumes",
        "Contract value at the named customer",
      ],
    },
    technology: {
      howItWorks:
        "The architecture is organised around keeping memory bandwidth saturated, which is the actual limit on inference throughput, and the first generation implements it on reconfigurable silicon while custom silicon is developed.",
      coreAdvantage:
        "High memory bandwidth utilisation, which addresses the term that dominates inference cost rather than the one that dominates specification sheets.",
      supportingEvidence: [
        {
          claim:
            "The company reports 93 percent memory bandwidth utilisation, 3.5 times better performance per dollar, and up to 66 percent lower power than a named incumbent accelerator, with support for models up to 500 billion parameters per two kilowatt server.",
          sourceId: "positron-press",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Independent technology press reported the Atlas power and throughput claims and described a major internet infrastructure operator evaluating the product.",
          sourceId: "positron-toms",
          basis: "verified",
          provenance: "Independently verified",
        },
        {
          claim:
            "The Asimov custom silicon generation targets tape-out in late 2026 and production in early 2027. This is a company roadmap statement dated 4 February 2026, not an independent assessment of schedule risk.",
          sourceId: "positron-seriesb",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      benchmarks:
        "Performance figures are published by the company against named competitor parts and have been reported on by independent technology press. They remain vendor-run on vendor-selected configurations and have not been independently reproduced.",
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Reconfigurable silicon supply today, and foundry plus advanced packaging capacity for the custom generation.",
      milestoneForScale:
        "The custom silicon generation shipping and matching the architecture's projected advantage.",
      failurePoints: [
        "Custom silicon slipping while competitors ship purpose-built parts",
        "Vendor benchmarks not reproducing on customer workloads",
        "Software maturity across model architectures released after design freeze",
      ],
    },
    market: {
      painPoint:
        "Inference cost is dominated by memory traffic, and general-purpose accelerators are specified on arithmetic throughput.",
      structure:
        "Concentrated buyers with long qualification cycles who are also capable of building alternatives.",
      adoptionDrivers: [
        "Cost and power per token becoming competitive variables",
        "Buyer appetite for a second source on strategically important components",
      ],
      competitors: ["NVIDIA", "d-Matrix", "Etched"],
      substitutes: [
        "General-purpose accelerators",
        "Model efficiency work reducing memory traffic",
      ],
      regulatoryEnvironment:
        "Advanced accelerator export controls apply.",
      maturity: "Emerging",
      currentCatalyst:
        "The Series B funding the transition from reconfigurable to custom silicon.",
    },
    commercial: {
      customerType: "Datacentre and cloud operators serving inference.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: "Direct technical sales with customer workload evaluation.",
      adoptionEvidence: [
        {
          claim:
            "Positron reports Atlas usage across customer categories including content delivery network operators and AI infrastructure providers. No contract value or deployment volume is disclosed, and no reliable source establishes the specific commercial relationship behind any individual name.",
          sourceId: "positron-press",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "High. The customer ports serving infrastructure onto a different stack.",
      expansionOpportunity:
        "Fleet growth at any customer completing a first deployment, and the custom silicon generation.",
      goToMarketRisk:
        "Vendor benchmarks against a named competitor invite exactly the independent comparison that has not yet happened.",
    },
    investment: {
      thesis:
        "A memory-first inference architecture that reached market before its competitors by accepting less efficient silicon first, now funded to build the custom part the thesis ultimately requires.",
      bullCase:
        "The custom silicon lands on schedule, the memory bandwidth advantage holds, and early deployment experience compounds into a durable position.",
      baseCase:
        "The company remains a credible alternative supplier at moderate scale while the category consolidates.",
      bearCase:
        "Custom silicon slips, purpose-built competitors ship, and the reconfigurable-silicon advantage disappears.",
      catalysts: [
        "Custom silicon tape-out and first samples",
        "Independent benchmark reproduction on a customer workload",
        "A named production customer disclosed with contract value or volume",
      ],
      risks: [
        "Unshipped custom silicon underpinning the roadmap",
        "Unreproduced vendor benchmarks",
        "A valuation set ahead of the technical milestone",
      ],
      invalidators: [
        "Custom silicon slipping more than a year",
        "Independent benchmarking materially below the published figures",
      ],
      recommendedNextStep:
        "Seek an independent measurement on a customer workload rather than a reference model. The published comparison names a competitor, which makes independent reproduction both feasible and necessary.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What is the measured memory bandwidth utilisation on a customer workload rather than a reference model?",
      ],
      product: [
        "How does the software stack handle model architectures released after design freeze?",
      ],
      customers: [
        "Which operators run Atlas in production rather than evaluating it, and at what scale?",
      ],
      competition: [
        "How will the custom silicon compare with purpose-built competitors shipping on the same timeline?",
      ],
      unitEconomics: [
        "What is gross margin on reconfigurable silicon compared with the projected custom part?",
      ],
      capitalRequirements: [
        "What does the custom silicon programme cost, and is the Series B sufficient?",
      ],
      regulation: ["Which markets are restricted under export controls?"],
      team: [
        "How large is the silicon team relative to the software and compiler team?",
      ],
      financing: ["What is total capital raised, and what is the preference structure?"],
      commercialization: [
        "What is the time from evaluation to volume deployment at the furthest customer?",
      ],
    },
    outreach:
      "I have been researching inference silicon, and the sequencing decision at Positron is what caught my attention. Shipping a memory-optimised architecture on reconfigurable silicon while competitors were still taping out gets the architecture in front of real workloads years earlier, at a known efficiency cost. That is a deliberate trade and not many teams make it. I would like to understand how the measured bandwidth utilisation holds on customer workloads. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(4, "verified", "Medium",
        "An architecture organised around memory bandwidth utilisation, shipped early on reconfigurable silicon.",
        "The architecture addresses the binding constraint; the implementation medium is a deliberate interim choice.", "positron-press"),
      technicalEvidence: fa(4, "verified", "Medium",
        "Shipping product with published performance figures against a named competitor, reported on by independent technology press. No independent reproduction of the measurements themselves.",
        "A shipping product with named customers is real evidence; the benchmark figures remain vendor-run.", "positron-toms"),
      defensibility: fa(3, "judgment", "Medium",
        "Architecture knowledge and early deployment experience, against far larger competitors.",
        "Moderate. The custom silicon would be the durable asset and it does not exist yet."),
      marketImportance: fa(5, "verified", "High",
        "Inference cost and power are the central economic constraints in AI infrastructure.",
        "On the most important bottleneck in the sector."),
      commercialReadiness: fa(4, "verified", "Medium",
        "Atlas systems shipping, with the company reporting usage across customer categories and independent press reporting an operator evaluation.",
        "Genuinely in market, with the commercial terms and the depth of each relationship not public.", "positron-press"),
      customerEvidence: fa(3, "verified", "Medium",
        "Company-reported Atlas usage across customer categories including content delivery network operators, plus independent reporting of a major internet infrastructure operator evaluating the product. No named commercial relationship, contract value, or deployment volume is established.",
        "Evaluation by a demanding operator is meaningful, and it is not the same as a standardised deployment. The record does not support treating it as one.", "positron-toms"),
      teamCredibility: fa(4, "verified", "Medium",
        "Co-founded in 2023 by Thomas Sohmers and Edward Kmett, with a chief executive brought in from a compute infrastructure operator.",
        "Strong technical founding team with an operator added for commercial scale.", "positron-seriesb"),
      capitalEfficiency: fa(3, "judgment", "Medium",
        "Shipped a first-generation product before the Series B, which is early for inference silicon.",
        "Efficient to first product; the billion dollar valuation raises the bar sharply."),
      competitiveIntensity: fa(1, "judgment", "High",
        "Competing against the dominant incumbent, several funded inference silicon startups, and hyperscaler in-house programmes.",
        "One of the most crowded competitive fields in the universe."),
      financingRisk: fa(3, "verified", "Medium",
        "230 million dollar Series B at a valuation above one billion dollars, before custom silicon has shipped.",
        "Well funded, with the valuation ahead of the milestone that justifies it.", "positron-seriesb"),
      regulatoryRisk: fa(2, "verified", "High",
        "Advanced accelerator export controls apply and have changed at short notice.",
        "A live constraint outside the company's control."),
      sourcingOriginality: fa(4, "judgment", "Medium",
        "Based outside the semiconductor hubs and easy to misfile as a prototyping effort because of the silicon medium.",
        "Genuinely under-examined relative to the fact that it is shipping."),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Founders, founding year, headquarters, and both financing rounds are supported by the company's own materials, with independent technology press reporting on the Atlas performance claims and on an operator evaluation. The customer categories, the Asimov schedule, and the benchmark figures are company-reported and labelled as such throughout. Revenue, contract value, named commercial relationships, total capital raised, and any independent reproduction of the benchmark measurements are not available.",
    sourceIds: ["positron-seriesb", "positron-press", "positron-toms"],
    lastReviewed: REVIEWED,
  },

  /* ---------------------------------------------------------- Chef Robotics */
  {
    id: "chef-robotics",
    name: "Chef Robotics",
    website: "https://www.chefrobotics.ai",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series A announced March 2025 as a private financing, with no listing or acquisition notice.",
    headquarters: "San Francisco, California, United States",
    region: "North America",
    foundedYear: NOT_DISCLOSED,
    founders: ["Rajat Bhageria"],
    sector: "Robotics & Autonomy",
    subsector: "Food assembly robotics",
    description:
      "Robotic arms that portion and assemble prepared meals in food production facilities, sold as a service rather than as equipment, with a control system trained on the specific problem of handling food.",
    targetCustomer:
      "Prepared meal manufacturers and food production companies running high-mix assembly lines.",
    businessModel:
      "Robotics as a service, so the customer pays for output rather than buying a capital asset.",
    technicalDifferentiation:
      "Food is deformable, variable, and different every time, which defeats the position-controlled repeatability industrial robots rely on. The control system is built around that variability rather than around a fixed part.",
    tractionSignal:
      "The company states more than 44 million servings have been produced in production using its systems.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2025-03-31",
    recentCatalyst:
      "43.1 million dollar Series A announced 31 March 2025, comprising 20.6 million dollars in equity led by Avataar Ventures and 22.5 million dollars in equipment financing.",
    primaryCompetitors: [
      "Established industrial robot integrators",
      "Manual food assembly labour",
      "Fixed-purpose food processing machinery",
    ],
    mainTechnicalRisk:
      "Handling ingredients the system has not seen, at line speed and to a weight tolerance, is where food robotics historically fails.",
    mainCommercialRisk:
      "A service model means the company carries the hardware cost and the utilisation risk rather than the customer.",
    mainFinancingRisk:
      "The equipment financing component means the balance sheet scales with deployments.",
    sourcing: {
      discoveryChannel: "Product launch",
      signalDate: "2025-03-31",
      signal: "Customer announcement",
      dateSourced: "2026-04-22",
      channel: "Deployed robotics production volume tracking",
      whyEntered:
        "A cumulative production figure in the tens of millions of servings is an operating metric rather than a capability claim. Robotics companies that publish output volume are usually the ones that have one worth publishing.",
      whyTimely:
        "Labour availability in food production continues to tighten, and the robotics-as-a-service model removes the capital objection that has historically blocked adoption in a low-margin industry.",
      whyOverlooked:
        "Food manufacturing is unglamorous, the customers are private mid-market companies, and robotics attention concentrates on humanoids and warehouses.",
      whyNotObvious:
        "A database search files this as a robotics Series A. The interesting fact is the servings figure and the service model, and neither appears in a funding record.",
      evidenceNeeded:
        "Utilisation rates across the deployed fleet and gross margin per deployed arm, which determine whether the service model works.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series A",
      disclosedRound: "Series A",
      latestRound:
        "43.1 million dollar Series A comprising 20.6 million dollars in equity led by Avataar Ventures and 22.5 million dollars in equipment financing, bringing total capital raised to 65.6 million dollars.",
      latestRoundDate: "2025-03-31",
      latestRoundSourceId: "chef-prnewswire",
      totalDisclosedFunding:
        "65.6 million dollars, comprising 38.8 million dollars in equity and 26.75 million dollars in equipment financing",
      namedInvestors: [
        "Avataar Ventures",
        "Construct Capital",
        "Bloomberg Beta",
        "Promus Ventures",
        "MFV Partners",
      ],
      capitalIntensity: "High",
      futureCapitalRequirement:
        "High. A service model funds hardware on the balance sheet ahead of the revenue it generates.",
      financingRisk:
        "Moderate. The split between equity and equipment financing is disclosed, which is more transparency than most hardware companies provide.",
      missingInformation: [
        "Revenue",
        "Customer names and count",
        "Fleet utilisation rates",
        "Founding year",
      ],
    },
    technology: {
      howItWorks:
        "A robotic arm portions ingredients into trays on a production line, using a control system trained on how specific foods behave when scooped, dropped, and weighed, and adjusting continuously to hit a target weight.",
      coreAdvantage:
        "Accumulated data on how particular ingredients behave. Every new food handled makes the next deployment faster, which is a compounding asset a competitor cannot buy.",
      supportingEvidence: [
        {
          claim:
            "More than 44 million servings produced in production using the company's systems.",
          sourceId: "chef-prnewswire",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "The Series A structure and the robotics-as-a-service model were independently reported.",
          sourceId: "chef-robotreport",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      benchmarks:
        "Cumulative servings is an output measure rather than a performance benchmark. Weight accuracy and line speed are not published.",
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Robot arms and sensors sourced from third parties, with the control software built in house.",
      milestoneForScale:
        "Evidence that a new ingredient or customer deploys materially faster than the first, which distinguishes a product from an integration business.",
      failurePoints: [
        "Ingredients outside the training distribution failing at line speed",
        "Service model utilisation falling below the level that supports the hardware cost",
        "Customers preferring to buy equipment outright",
      ],
    },
    market: {
      painPoint:
        "Prepared meal assembly is repetitive, high-turnover work that manufacturers struggle to staff, and conventional automation cannot handle the variability of food.",
      structure:
        "Mid-market food manufacturers with thin margins and strong reluctance toward capital purchases.",
      adoptionDrivers: [
        "Persistent labour shortages in food production",
        "A service model that removes the capital objection",
      ],
      competitors: [
        "Industrial robot integrators",
        "Manual labour",
        "Fixed-purpose machinery",
      ],
      substitutes: ["Hiring more line workers", "Redesigning products for simpler assembly"],
      regulatoryEnvironment:
        "Food safety and machinery safety standards apply to equipment operating in food production.",
      maturity: "Emerging",
      currentCatalyst:
        "The Series A funding fleet expansion against a stated production volume.",
    },
    commercial: {
      customerType: "Food production and prepared meal manufacturers.",
      pricingModel:
        "Robotics as a service, with the customer paying for output rather than purchasing equipment.",
      salesMotion: "Direct sales into manufacturing operations leadership.",
      adoptionEvidence: [
        {
          claim:
            "More than 44 million servings produced in production, indicating sustained deployment rather than pilots.",
          sourceId: "chef-prnewswire",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Moderate. Installation into a live production line requires scheduling around production.",
      expansionOpportunity:
        "Additional lines and ingredients within existing customers.",
      goToMarketRisk:
        "The service model concentrates utilisation risk on the company rather than the customer.",
    },
    investment: {
      thesis:
        "A robotics company with a real production output metric, attacking a labour constraint in an industry that cannot afford capital equipment, using a commercial model built around that constraint.",
      bullCase:
        "The ingredient data compounds, deployments get faster, and the service model turns into a high-utilisation fleet business.",
      baseCase:
        "Steady deployment growth in a defined segment, with utilisation determining the outcome.",
      bearCase:
        "Ingredient variability keeps each deployment bespoke, utilisation stays low, and the balance sheet carries hardware that does not pay for itself.",
      catalysts: [
        "Disclosed fleet utilisation rates",
        "Evidence that a new ingredient deploys faster than the first",
      ],
      risks: [
        "Utilisation risk carried by the company",
        "Ingredient variability",
        "Thin-margin customers",
      ],
      invalidators: [
        "Utilisation falling below the level that supports hardware cost",
        "Deployment time per new customer failing to improve",
      ],
      recommendedNextStep:
        "Establish fleet utilisation and gross margin per deployed arm. In a service model those two numbers are the business, and neither is public.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What proportion of ingredients require new training before they can be handled at line speed?",
      ],
      product: [
        "What weight accuracy is achieved, and how does it compare with a human line worker?",
      ],
      customers: ["How many customers, and how many lines per customer?"],
      competition: [
        "What have integrators quoted for equivalent automation, and why did customers choose a service?",
      ],
      unitEconomics: [
        "What is gross margin per deployed arm at current utilisation?",
      ],
      capitalRequirements: [
        "How is hardware financed as the fleet grows, and what are the equipment financing terms?",
      ],
      regulation: [
        "What food safety certifications apply to equipment in contact with ingredients?",
      ],
      team: ["What is the founding year, and who leads manufacturing operations?"],
      financing: ["What is the split of revenue between service fees and other sources?"],
      commercialization: [
        "What is the time from first contact to a producing line?",
      ],
    },
    outreach:
      "I have been researching automation in food production, and publishing a cumulative servings figure rather than a capability demo is what made me look properly at Chef Robotics. Output volume is a much harder number to produce than a video. The service model also seems well matched to an industry that will not sign a capital purchase order. I would like to understand how utilisation is trending across the deployed fleet. Would you be open to a call?",
    factors: {
      technicalDifferentiation: fa(4, "judgment", "Medium",
        "Control system built around the variability of food rather than around repeatable part positions.",
        "A real capability difference from position-controlled industrial automation."),
      technicalEvidence: fa(5, "verified", "High",
        "More than 44 million servings produced in production, an output metric rather than a capability claim.",
        "Sustained production volume is among the strongest evidence a robotics company can offer.", "chef-prnewswire"),
      defensibility: fa(4, "judgment", "Medium",
        "Accumulated data on how specific ingredients behave, which compounds with every deployment.",
        "Genuinely compounding, and not purchasable."),
      marketImportance: fa(3, "judgment", "Medium",
        "Food production labour shortages are real, in an industry with thin margins.",
        "A genuine constraint in a market that can pay only modestly to solve it."),
      commercialReadiness: fa(4, "verified", "High",
        "Systems in sustained production across customers, sold as a service.",
        "Genuinely commercial.", "chef-prnewswire"),
      customerEvidence: fa(4, "verified", "Medium",
        "44 million servings implies sustained multi-customer deployment, though no customer is named.",
        "Strong output evidence, weaker on named references.", "chef-prnewswire"),
      teamCredibility: fa(3, "judgment", "Low",
        "Founded and led by Rajat Bhageria. Founding year and other founders are not established from a primary source.",
        "Rated on incomplete public information."),
      capitalEfficiency: fa(4, "verified", "High",
        "44 million servings reached on 38.8 million dollars of equity, with hardware funded separately through equipment financing.",
        "Efficient, and the disclosed equity-versus-debt split is unusually transparent.", "chef-prnewswire"),
      competitiveIntensity: fa(4, "judgment", "Medium",
        "Industrial integrators are adjacent but none focuses on deformable food handling at this scale.",
        "The specific position is largely uncontested."),
      financingRisk: fa(3, "verified", "Medium",
        "Equity and equipment financing disclosed separately, with the balance sheet scaling with the fleet.",
        "Moderate, and structurally tied to utilisation.", "chef-prnewswire"),
      regulatoryRisk: fa(4, "judgment", "Medium",
        "Food safety and machinery safety standards apply and are well established.",
        "Low and predictable."),
      sourcingOriginality: fa(5, "judgment", "High",
        "Food manufacturing automation attracts a fraction of the attention given to humanoids and warehouse robotics.",
        "Among the most under-examined robotics positions in the universe."),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Financing structure, investors, production volume, headquarters, and the service model are supported by the company's own announcement with independent business press corroboration. Founding year, revenue, customer names, and utilisation are not disclosed.",
    sourceIds: ["chef-prnewswire", "chef-robotreport"],
    lastReviewed: REVIEWED,
  },

  /* ---------------------------------------------------- Portal Space Systems */
  {
    id: "portal-space",
    name: "Portal Space Systems",
    website: "https://www.portalsystems.space",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series A announced April 2026 as a private financing, with no listing or acquisition notice.",
    headquarters: "Bothell, Washington, United States",
    region: "North America",
    foundedYear: NOT_DISCLOSED,
    founders: ["Jeff Thornburg"],
    sector: "Space & Aerospace",
    subsector: "Highly manoeuvrable spacecraft and solar thermal propulsion",
    description:
      "Builds Supernova, a spacecraft using solar thermal propulsion to move between orbits rapidly, aimed at missions where the ability to manoeuvre repeatedly is the capability being bought.",
    targetCustomer:
      "National security space customers and commercial operators requiring responsive orbital manoeuvring.",
    businessModel: NOT_DISCLOSED,
    technicalDifferentiation:
      "Solar thermal propulsion concentrates sunlight to heat propellant, which the company positions as delivering performance approaching nuclear thermal propulsion without carrying a reactor.",
    tractionSignal:
      "The company announced Starburst-1, its first free-flying mission with live payloads, manifested on a SpaceX Transporter rideshare in the fourth quarter of 2026, and headcount has grown to roughly 40 with a stated plan to reach 100.",
    tractionProvenance: "Independently verified",
    tractionAsOf: "2026-04-09",
    recentCatalyst:
      "50 million dollar Series A announced 9 April 2026, co-led by Geodesic Capital and Mach33, funding a 52,000 square foot production facility in Bothell and the Starburst and Supernova vehicles.",
    primaryCompetitors: [
      "Conventional chemical propulsion spacecraft builders",
      "Electric propulsion satellite manufacturers",
      "Established satellite primes",
    ],
    mainTechnicalRisk:
      "Solar thermal propulsion has never flown operationally, and the first Supernova is not scheduled until 2027.",
    mainCommercialRisk:
      "No customer contract or revenue is disclosed, and the capability is aimed at a government buyer with long procurement cycles.",
    mainFinancingRisk:
      "A production facility funded before any flight heritage exists.",
    sourcing: {
      discoveryChannel: "Funding announcement",
      signalDate: "2026-04-01",
      signal: "New facility",
      dateSourced: "2026-05-06",
      channel: "Space manufacturing facility and propulsion programme tracking",
      whyEntered:
        "A Series A that funds a 52,000 square foot production facility for a propulsion approach that has never flown is an unusually committed sequencing decision. Whether it is conviction or overreach is decided by one flight, which makes the investment question unusually clean.",
      whyTimely:
        "Responsive orbital manoeuvring has become an explicit national security priority, which creates a government buyer for a capability that previously had no commercial market.",
      whyOverlooked:
        "Space attention concentrates on launch. A propulsion company in the Seattle suburbs building spacecraft rather than rockets sits outside the categories most space searches use.",
      whyNotObvious:
        "Database entries record a seed and a Series A for a space company. They do not convey that the differentiator is an unflown propulsion method, which is the entire risk and the entire opportunity.",
      evidenceNeeded:
        "Ground test data on the solar thermal propulsion system, and any customer contract as distinct from a stated mission plan.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series A",
      disclosedRound: "Series A",
      latestRound:
        "50 million dollar Series A announced 9 April 2026, co-led by Geodesic Capital and Mach33 with Booz Allen Ventures, ARK Invest, AlleyCorp, and FUSE participating, following a 17.5 million dollar seed round announced in 2025.",
      latestRoundDate: "2026-04-09",
      latestRoundSourceId: "portal-seriesa",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "Geodesic Capital",
        "Mach33",
        "Booz Allen Ventures",
        "ARK Invest",
        "AlleyCorp",
        "FUSE",
      ],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "Very high. Spacecraft development and a production facility both precede revenue by years.",
      financingRisk:
        "High. Capital is committed to manufacturing capacity before the propulsion approach has flown.",
      missingInformation: [
        "Total capital raised",
        "Revenue and customer contracts",
        "Founding year",
        "Business model",
      ],
    },
    technology: {
      howItWorks:
        "Concentrated sunlight heats propellant to produce thrust, which avoids both the mass penalty of chemical propellant for repeated manoeuvres and the regulatory burden of a nuclear reactor.",
      coreAdvantage:
        "Repeated high-energy manoeuvres without carrying the propellant mass a chemical system would require for the same total impulse.",
      supportingEvidence: [
        {
          claim:
            "The company announced a 50 million dollar Series A to fund a production facility and its Starburst and Supernova missions.",
          sourceId: "portal-seriesa",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Independent space press reported the financing, the facility, and the 2027 first launch schedule.",
          sourceId: "portal-spacenews",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Launch availability and aerospace component supply chains.",
      milestoneForScale:
        "A successful first flight of Supernova demonstrating solar thermal propulsion on orbit.",
      failurePoints: [
        "Solar thermal propulsion underperforming in flight",
        "Production capacity built ahead of contracts that do not materialise",
        "Schedule slipping past the window of government interest",
      ],
    },
    market: {
      painPoint:
        "Spacecraft carry a fixed propellant budget, so manoeuvring is rationed. Missions that need to move repeatedly are constrained by physics rather than by intent.",
      structure:
        "Government and national security buyers with long procurement cycles, plus a small commercial market.",
      adoptionDrivers: [
        "National security interest in responsive space capability",
        "Growth in orbital congestion requiring manoeuvre",
      ],
      competitors: [
        "Chemical propulsion spacecraft builders",
        "Electric propulsion manufacturers",
      ],
      substitutes: ["Conventional chemical propulsion", "Accepting limited manoeuvre budgets"],
      regulatoryEnvironment:
        "Export control, launch licensing, and government security requirements apply.",
      maturity: "Emerging",
      currentCatalyst:
        "The Series A and the production facility opening ahead of a 2027 first launch.",
    },
    commercial: {
      customerType: "National security and commercial space operators.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: NOT_DISCLOSED,
      adoptionEvidence: [
        {
          claim:
            "Starburst-1 is manifested on a SpaceX Transporter rideshare in the fourth quarter of 2026, carrying live third-party payloads. No customer contract value is disclosed.",
          sourceId: "portal-starburst",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden: "Not applicable until a spacecraft flies.",
      expansionOpportunity: "Contingent entirely on flight demonstration.",
      goToMarketRisk:
        "There is no service to sell until the propulsion system works on orbit.",
    },
    investment: {
      thesis:
        "A propulsion bet with a clean binary test, funded through manufacturing capacity ahead of flight, aimed at a capability the government has recently decided it wants.",
      bullCase:
        "Solar thermal propulsion works on orbit, and the company owns a capability with no direct commercial equivalent.",
      baseCase:
        "First flight slips, capital is required again, and the company becomes a specialist supplier over a longer horizon.",
      bearCase:
        "The propulsion approach underperforms in flight and the production investment cannot be recovered.",
      catalysts: [
        "Ground test data on the propulsion system",
        "A disclosed customer contract",
        "First Supernova launch",
      ],
      risks: [
        "Unflown propulsion technology",
        "Facility capital committed before flight heritage",
        "Dependence on government procurement timing",
      ],
      invalidators: [
        "First flight failure",
        "Ground testing showing performance materially below the chemical alternative",
      ],
      recommendedNextStep:
        "Request ground test data on the solar thermal system. Everything else in this record is contingent on physics that has not been demonstrated in flight.",
      confidence: "Low",
    },
    diligence: {
      technology: [
        "What ground testing has the solar thermal propulsion system undergone, and at what performance?",
      ],
      product: ["What total impulse and manoeuvre cadence does Supernova target?"],
      customers: ["Are there any signed contracts, or only stated mission plans?"],
      competition: [
        "How does the performance compare with electric propulsion on the same mission profile?",
      ],
      unitEconomics: ["What is the target cost per spacecraft at the facility's capacity?"],
      capitalRequirements: [
        "What does the facility cost, and what is the runway to first flight?",
      ],
      regulation: ["What export control classification applies to the propulsion system?"],
      team: [
        "What is the founding year, and who besides the chief executive has flown a spacecraft programme?",
      ],
      financing: ["Who invested, and what is total capital raised?"],
      commercialization: ["What is the business model, given none is stated?"],
    },
    outreach:
      "I have been researching orbital manoeuvring, and solar thermal propulsion is the approach I understand least well from the outside, which is why I wanted to reach out. Building a production facility before the first flight is a strong statement about how confident you are in the ground test data. I would like to understand what that testing has shown so far, and how you think about the gap to on-orbit performance. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(5, "judgment", "Medium",
        "Solar thermal propulsion for repeated orbital manoeuvres, an approach with no operational equivalent in service.",
        "Genuinely distinctive, and correspondingly unproven."),
      technicalEvidence: fa(2, "verified", "Medium",
        "Funding and a production facility, with no flight heritage and no published ground test data.",
        "Infrastructure commitment shows seriousness, not technical success.", "portal-spacenews"),
      defensibility: fa(3, "judgment", "Low",
        "Propulsion know-how that would be hard to reproduce, entirely prospective until demonstrated.",
        "Cannot be assessed before flight."),
      marketImportance: fa(4, "judgment", "Medium",
        "Responsive manoeuvring has become an explicit national security priority.",
        "Important, and dependent on government budget continuity."),
      commercialReadiness: fa(1, "verified", "High",
        "No flight, no disclosed contract, no revenue, and no stated business model.",
        "Pre-commercial development stage."),
      customerEvidence: fa(1, "judgment", "Low",
        "No disclosed customer contracts.",
        "Nothing to assess."),
      teamCredibility: fa(4, "verified", "Medium",
        "Led by Jeff Thornburg, with a propulsion engineering background at established launch organisations.",
        "Directly relevant leadership, with the wider team not established publicly.", "portal-spacenews"),
      capitalEfficiency: fa(2, "judgment", "Medium",
        "A production facility funded before first flight.",
        "Low as measured, and a deliberate strategic choice rather than an accident."),
      competitiveIntensity: fa(4, "judgment", "Medium",
        "No direct competitor using the same propulsion approach, though chemical and electric propulsion serve overlapping missions.",
        "Uncontested in its specific approach."),
      financingRisk: fa(3, "verified", "Medium",
        "50 million dollar Series A co-led by two named funds with strategic and institutional participation, against a very high capital requirement.",
        "Adequately funded for the current phase, with a demanding path to flight.", "portal-seriesa"),
      regulatoryRisk: fa(3, "judgment", "Medium",
        "Export control and launch licensing apply, as for any spacecraft programme.",
        "Standard for the sector."),
      sourcingOriginality: fa(5, "judgment", "High",
        "A spacecraft propulsion company outside the space hubs, in a category that launch companies overshadow entirely.",
        "Genuinely under-examined."),
    },
    dataConfidence: "Low",
    dataConfidenceNote:
      "Financing, investors, headquarters, chief executive, the production facility, and the mission schedule are supported by the company's own press release with corroboration from two independent space publications. Total capital raised, founding year, business model, revenue, and any customer contract are not disclosed, which is why this record is marked low confidence.",
    sourceIds: [
      "portal-seriesa",
      "portal-starburst",
      "portal-spacenews",
      "portal-payload",
    ],
    lastReviewed: REVIEWED,
  },
];

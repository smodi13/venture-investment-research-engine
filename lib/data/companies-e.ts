import { fa, NOT_DISCLOSED, type PrivateCompany } from "../types";

/**
 * Verified private companies, part five: the early-stage expansion.
 *
 * These records were added to give the universe genuine Seed and Series A
 * depth, and to deepen enterprise software and healthcare coverage. They meet
 * the same standard as every other record: confirmed independently private,
 * a working official site, one primary source, one corroborating source, and
 * no estimated facts.
 */

const REVIEWED = "2026-07-30";

export const COMPANIES_E: PrivateCompany[] = [
  /* ---------------------------------------------------------------- Extropic */
  {
    id: "extropic",
    name: "Extropic",
    website: "https://extropic.ai",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Seed financing and a government letter of intent, with no listing or acquisition notice.",
    headquarters: "San Francisco, California, United States",
    region: "North America",
    foundedYear: 2022,
    founders: ["Guillaume Verdon"],
    sector: "Semiconductors & Advanced Computing",
    subsector: "Thermodynamic sampling hardware for probabilistic AI",
    description:
      "Builds Thermodynamic Sampling Units, a class of semiconductor that uses the natural electrical noise in ordinary CMOS transistors to sample from probability distributions directly, rather than computing those samples arithmetically.",
    targetCustomer:
      "Organisations running generative and probabilistic workloads where sampling, not matrix multiplication, is the dominant cost.",
    businessModel: NOT_DISCLOSED,
    technicalDifferentiation:
      "Using thermal noise as the computational primitive inverts the usual engineering objective. Conventional chip design spends power suppressing noise; this design uses it, which is why the energy argument is structural rather than incremental.",
    tractionSignal:
      "The company states it has produced working hardware and has begun placing it with potential customers.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "Signed a letter of intent with the US Department of Commerce for up to 75 million dollars through the CHIPS Research and Development Office on 30 July 2026, to scale the technology and qualify a domestic manufacturing path.",
    primaryCompetitors: [
      "Conventional GPU and accelerator vendors",
      "Probabilistic and analogue computing research programmes",
      "Quantum computing companies targeting sampling problems",
    ],
    mainTechnicalRisk:
      "Exploiting device-level noise reliably across process, voltage, and temperature variation at production volume is unproven, and is a fundamentally harder manufacturing problem than a deterministic digital design.",
    mainCommercialRisk:
      "No business model, pricing, or customer is publicly disclosed, so commercial viability cannot be assessed from outside at all.",
    mainFinancingRisk:
      "A substantial share of the publicly known capital is a government letter of intent rather than committed funding.",
    sourcing: {
      discoveryChannel: "Government grant",
      signalDate: "2026-07-30",
      signal: "Government grant",
      dateSourced: "2026-07-30",
      channel: "CHIPS programme award and letter of intent tracking",
      whyEntered:
        "The US Department of Commerce signed a letter of intent for up to 75 million dollars through the CHIPS Research and Development Office. A federal programme committing at that scale to an unproven computing paradigm is an externally administered technical judgment, and it is the kind of signal that appears in a government channel rather than in a funding feed.",
      whyTimely:
        "Datacentre energy consumption has become the binding constraint on AI deployment, which is the first moment a fundamentally different energy profile is worth the risk of an unfamiliar computing model. The letter of intent is days old.",
      whyOverlooked:
        "Thermodynamic computing is a category most investors have no framework for evaluating, the company raised a comparatively small seed round, and its technical writing is dense enough that the commercial question is easy to lose.",
      whyNotObvious:
        "A funding database records a 14 million dollar seed and stops there. It does not record the federal letter of intent, which is five times the size of the round and published through a different channel entirely.",
      evidenceNeeded:
        "The conditions attached to the Department of Commerce letter of intent, and independent measurement of a sampling workload on the shipped hardware against a conventional accelerator.",
      wellRecognised: false,
    },
    financing: {
      stage: "Seed",
      disclosedRound: "Seed",
      latestRound:
        "14.1 million dollar seed round led by Kindred Ventures, alongside a letter of intent with the US Department of Commerce for up to 75 million dollars announced 30 July 2026.",
      latestRoundDate: "2026-07-30",
      latestRoundSourceId: "extropic-announcement",
      totalDisclosedFunding:
        "14.1 million dollars in equity. The 75 million dollar government figure is a letter of intent, not committed capital.",
      namedInvestors: ["Kindred Ventures"],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "Very high. Qualifying a new semiconductor category for domestic manufacture requires capital far beyond the seed round.",
      financingRisk:
        "High. The equity base is small for semiconductor development, and the larger figure is contingent rather than committed.",
      missingInformation: [
        "Business model and pricing",
        "Customer names",
        "Conditions releasing the government letter of intent",
        "Revenue",
      ],
    },
    technology: {
      howItWorks:
        "Standard CMOS transistors fluctuate thermally. Rather than engineering that fluctuation away, the design programmes it, so the device settles into states that follow a target probability distribution and reading the device is itself the act of sampling.",
      coreAdvantage:
        "Sampling is performed by physics rather than by arithmetic, which removes the energy cost of computing a distribution before drawing from it.",
      supportingEvidence: [
        {
          claim:
            "The US Department of Commerce signed a letter of intent for up to 75 million dollars through the CHIPS Research and Development Office to scale and onshore the technology.",
          sourceId: "extropic-nist",
          basis: "verified",
          provenance: "Government-reported",
        },
        {
          claim:
            "The company states it has working hardware in the hands of potential customers, backed by a 14.1 million dollar seed round.",
          sourceId: "extropic-announcement",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Foundry access for a non-standard device concept, and the domestic manufacturing path the government funding is intended to qualify.",
      milestoneForScale:
        "An independent measurement showing the energy advantage holds on a workload someone actually runs, rather than on a synthetic sampling benchmark.",
      failurePoints: [
        "Device-level noise behaviour varying too much across process and temperature to be programmable at volume",
        "The addressable set of workloads proving narrower than probabilistic AI in general",
        "The government letter of intent not converting into funding",
      ],
    },
    market: {
      painPoint:
        "Generative and probabilistic workloads spend most of their energy computing distributions that physics could produce directly, and datacentre power is now the binding constraint.",
      structure:
        "No established market. Buyers would be sophisticated operators willing to adopt an unfamiliar computing model for an energy advantage.",
      adoptionDrivers: [
        "Datacentre power availability limiting deployment independently of chip supply",
        "Government interest in onshoring novel semiconductor capability",
      ],
      competitors: [
        "Conventional accelerator vendors",
        "Analogue and probabilistic computing research programmes",
      ],
      substitutes: [
        "Running sampling workloads on conventional accelerators",
        "Algorithmic efficiency work reducing the sampling required",
      ],
      regulatoryEnvironment:
        "Export controls apply to advanced semiconductors. Government funding brings domestic manufacturing and reporting obligations.",
      maturity: "Emerging",
      currentCatalyst:
        "The Department of Commerce letter of intent, signed on the date of this review.",
    },
    commercial: {
      customerType:
        "Not publicly disclosed beyond a statement that hardware is with potential customers.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: NOT_DISCLOSED,
      adoptionEvidence: [
        {
          claim:
            "The company states working hardware is in the hands of potential customers. No customer is named and no revenue is disclosed.",
          sourceId: "extropic-announcement",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Very high. A customer would have to restructure workloads around a sampling primitive rather than a matrix one.",
      expansionOpportunity:
        "Entirely contingent on demonstrating the energy advantage on a real workload.",
      goToMarketRisk:
        "There is no disclosed business model, which means the commercial mechanism cannot be evaluated at all.",
    },
    investment: {
      thesis:
        "A genuinely novel computing primitive aimed at the constraint that now limits AI deployment, validated by a federal programme rather than by a large private round, and at the earliest possible point of commercial evidence.",
      bullCase:
        "The energy advantage holds on real workloads, the government funding converts, and thermodynamic sampling establishes itself as a distinct category rather than a research curiosity.",
      baseCase:
        "Technical progress continues on government support with commercial adoption remaining several years out and further dilution required.",
      bearCase:
        "Device variation defeats programmability at volume, the addressable workload set proves narrow, and the equity base is too small to reach an answer.",
      catalysts: [
        "Conversion of the Department of Commerce letter of intent into committed funding",
        "An independent energy measurement on a production workload",
      ],
      risks: [
        "An unproven physical computing primitive",
        "A headline funding figure that is contingent rather than committed",
        "No disclosed business model",
      ],
      invalidators: [
        "The letter of intent lapsing without conversion",
        "Measured energy advantage failing to materialise outside synthetic benchmarks",
      ],
      recommendedNextStep:
        "Establish the conditions on the government letter of intent before treating the 75 million dollar figure as capital. On the technical side, ask which specific workload the shipped hardware is being evaluated against.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "How much does device behaviour vary across process corners and temperature, and how is that compensated?",
      ],
      product: [
        "What does a developer have to change to move a workload onto a sampling primitive?",
      ],
      customers: [
        "Which organisations have the hardware, and what are they measuring?",
      ],
      competition: [
        "For the workloads targeted, what is the measured energy advantage over a current accelerator?",
      ],
      unitEconomics: [
        "What is the projected cost per device at volume, and against what conventional alternative?",
      ],
      capitalRequirements: [
        "What capital is required to qualify a domestic manufacturing path, and how much of it does the letter of intent cover?",
      ],
      regulation: [
        "What obligations attach to CHIPS programme funding, and what export controls apply to the device?",
      ],
      team: [
        "How large is the device physics team relative to the software team?",
      ],
      financing: [
        "What are the conditions on the letter of intent, and what is the runway on equity alone?",
      ],
      commercialization: [
        "What is the intended business model, given none is publicly stated?",
      ],
    },
    outreach:
      "I recently came across your work on thermodynamic sampling units, and the inversion at the centre of it is what made me want to reach out. Every other chip design I look at spends power suppressing device noise, and yours spends design effort programming it instead. The Department of Commerce letter of intent suggests that argument has survived a technical review that most novel computing paradigms do not get. I have been researching the energy constraint on AI deployment and would like to understand which specific workload the shipped hardware is being measured against. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(
        5,
        "verified",
        "High",
        "A computing primitive built on device-level thermal noise rather than deterministic arithmetic, implemented in standard CMOS.",
        "Among the most genuinely novel technical approaches in the universe. Nothing else here changes the primitive itself.",
        "extropic-nist",
      ),
      technicalEvidence: fa(
        4,
        "verified",
        "High",
        "A US Department of Commerce letter of intent through the CHIPS Research and Development Office, plus working hardware the company states is with potential customers.",
        "Federal technical review is strong external validation. No independent performance measurement is public, which caps this below five.",
        "extropic-nist",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Low",
        "A novel device concept with no disclosed patent position, in a field where the underlying physics is public.",
        "Rated on what can be established. The manufacturing difficulty is probably the real barrier, and it is unproven.",
      ),
      marketImportance: fa(
        5,
        "verified",
        "High",
        "Datacentre energy consumption is the binding constraint on AI deployment.",
        "The bottleneck being addressed is the most important one in computing today.",
      ),
      commercialReadiness: fa(
        1,
        "verified",
        "High",
        "Working hardware with potential customers, no disclosed business model, pricing, or revenue.",
        "Pre-commercial by any measure.",
        "extropic-announcement",
      ),
      customerEvidence: fa(
        1,
        "judgment",
        "Low",
        "No named customer and no disclosed adoption.",
        "There is essentially nothing to assess.",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "Medium",
        "Founded in 2022 by Guillaume Verdon, previously a quantum computing researcher at Google.",
        "Directly relevant research background. No prior company outcome, and other founders are not established from a primary source.",
        "extropic-announcement",
      ),
      capitalEfficiency: fa(
        5,
        "verified",
        "High",
        "Working silicon and a federal letter of intent reached on a 14.1 million dollar seed round.",
        "Exceptional for semiconductor development, where peers consume an order of magnitude more before first hardware.",
        "extropic-announcement",
      ),
      competitiveIntensity: fa(
        4,
        "judgment",
        "Medium",
        "No direct commercial competitor in thermodynamic sampling, though conventional accelerators are the practical alternative for every workload.",
        "Uncontested in its specific approach, which is both the opportunity and the warning.",
      ),
      financingRisk: fa(
        2,
        "verified",
        "High",
        "A small equity base for semiconductor development, with the larger public figure being a letter of intent rather than committed capital.",
        "Rated down deliberately. The platform does not treat a letter of intent as funding.",
        "extropic-nist",
      ),
      regulatoryRisk: fa(
        3,
        "verified",
        "Medium",
        "Semiconductor export controls apply, and government funding carries domestic manufacturing obligations.",
        "Moderate, and currently more supportive than restrictive.",
      ),
      sourcingOriginality: fa(
        5,
        "judgment",
        "High",
        "A small seed round in a computing category with no established evaluation framework, surfaced through a government channel rather than a funding feed.",
        "The most genuinely non-obvious position in the universe.",
      ),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Founder, founding year, seed round, the government letter of intent, and the technology description are supported by the company's own announcement with independent distribution. Business model, pricing, customers, revenue, and the conditions on the letter of intent are not disclosed.",
    sourceIds: ["extropic-nist", "extropic-announcement", "extropic-siliconangle"],
    lastReviewed: REVIEWED,
  },

  /* ------------------------------------------------------------ Emerald AI */
  {
    id: "emerald-ai",
    name: "Emerald AI",
    website: "https://www.emeraldai.co",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Seed extension reported as a private financing, with no listing or acquisition notice.",
    headquarters: "Washington, District of Columbia, United States",
    region: "North America",
    foundedYear: 2024,
    founders: ["Varun Sivaram"],
    sector: "Energy Systems",
    subsector: "Grid-flexible AI datacentre orchestration",
    description:
      "Software that lets AI datacentres reduce power draw on demand without stopping work, turning a fixed load the grid must plan around into a flexible resource it can call on.",
    targetCustomer:
      "AI datacentre operators, utilities, and grid operators facing interconnection constraints.",
    businessModel: NOT_DISCLOSED,
    technicalDifferentiation:
      "Shifting and shaping compute rather than shedding it, so the grid gets flexibility without the operator losing throughput, which is what makes the arrangement acceptable to both sides.",
    tractionSignal:
      "Demonstrated with utility and infrastructure partners under an industry research initiative, with results reported as a 40 percent power reduction achieved in under a minute.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2025-10-30",
    recentCatalyst:
      "Named in a coalition announcing a power-flexible AI factory in Virginia, alongside a partnership with a national grid operator in the United Kingdom for a flexibility demonstration.",
    primaryCompetitors: [
      "Utility demand response programmes",
      "Datacentre management software vendors",
      "In-house orchestration built by hyperscale operators",
    ],
    mainTechnicalRisk:
      "Reducing power without materially degrading workload throughput is the entire claim, and it has been demonstrated in structured pilots rather than across varied production fleets.",
    mainCommercialRisk:
      "No business model or pricing is disclosed, and the value depends on grid market rules that differ by territory.",
    mainFinancingRisk:
      "A seed-stage balance sheet against a customer set of utilities and hyperscale operators with very long procurement cycles.",
    sourcing: {
      discoveryChannel: "Strategic partnership",
      signalDate: "2025-10-01",
      signal: "Major partnership",
      dateSourced: "2026-05-20",
      channel: "Datacentre flexibility demonstration and utility partnership tracking",
      whyEntered:
        "A company founded in late 2024 appears alongside a major accelerator vendor, a grid operator, and a datacentre operator in a coalition announcing a power-flexible AI factory. Being named in that company at that age is a stronger signal than the funding, because those partners select on technical review rather than on pitch.",
      whyTimely:
        "Grid interconnection is now the binding constraint on AI deployment in the most active regions. Flexibility is the only lever that adds capacity without building anything, which makes it valuable precisely while the queues are long.",
      whyOverlooked:
        "It reads as a software company in an energy category, so energy searches file it as software and software searches file it as energy. It also raised a seed extension rather than a headline round.",
      whyNotObvious:
        "A database search returns a small seed round for a company under two years old. What it does not return is the coalition membership and the utility demonstrations, which are published by the partners rather than by the company.",
      evidenceNeeded:
        "The measured throughput cost of a power reduction event on a production fleet, and a disclosed commercial contract with a utility or operator rather than a demonstration.",
      wellRecognised: false,
    },
    financing: {
      stage: "Seed",
      disclosedRound: "Seed extension",
      latestRound:
        "18 million dollar seed extension led by Lowercarbon Capital with participation from NVentures, Radical Ventures, Salesforce Ventures, and National Grid Partners, bringing total funding to 42.5 million dollars.",
      latestRoundDate: "2025-10-01",
      latestRoundSourceId: "emerald-nvidia",
      totalDisclosedFunding: "42.5 million dollars",
      namedInvestors: [
        "Lowercarbon Capital",
        "NVentures",
        "Radical Ventures",
        "Salesforce Ventures",
        "National Grid Partners",
      ],
      capitalIntensity: "Low",
      futureCapitalRequirement:
        "Moderate. The product is software, though the sales motion into utilities is long and expensive.",
      financingRisk:
        "Moderate. Recently funded with strategic participation from both an accelerator vendor and a grid operator.",
      missingInformation: [
        "Business model and pricing",
        "Revenue",
        "Commercial contracts as distinct from demonstrations",
      ],
    },
    technology: {
      howItWorks:
        "The software sits between the grid signal and the datacentre workload scheduler. When the grid needs relief, it reshapes what the facility is running rather than switching equipment off, so power falls while work continues in a modified form.",
      coreAdvantage:
        "The flexibility is negotiated at the workload level. That is why the operator can accept it, and operator acceptance is the part every previous attempt at datacentre demand response has failed on.",
      supportingEvidence: [
        {
          claim:
            "Named alongside an accelerator vendor, a research institute, a datacentre operator, and a grid operator in a coalition announcing a power-flexible AI factory.",
          sourceId: "emerald-nvidia",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "A national grid operator in the United Kingdom describes a demonstration project with the company on datacentre flexibility.",
          sourceId: "emerald-fortune",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      benchmarks:
        "A 40 percent power reduction in under a minute is reported from a structured demonstration. The workload cost of that reduction is not disclosed, which is the number that matters commercially.",
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Integration with datacentre schedulers and with utility market interfaces, both controlled by other parties.",
      milestoneForScale:
        "A commercial contract with an operator or utility, as distinct from participation in a demonstration programme.",
      failurePoints: [
        "The throughput cost of flexibility proving unacceptable to operators at production scale",
        "Grid market rules not compensating flexibility enough to fund the software",
        "Hyperscale operators building equivalent orchestration internally",
      ],
    },
    market: {
      painPoint:
        "Datacentres are planned as fixed loads, so grids must build for their peak. Interconnection queues in the most active regions now run to years as a result.",
      structure:
        "A small number of large operators and utilities, with regulators setting the value of flexibility in each territory.",
      adoptionDrivers: [
        "Interconnection queues measured in years in the most active regions",
        "Grid operators actively seeking flexible load rather than more generation",
      ],
      competitors: [
        "Utility demand response programmes",
        "Datacentre management software vendors",
        "In-house orchestration at hyperscale operators",
      ],
      substitutes: [
        "Building more generation and transmission",
        "Siting datacentres where capacity already exists",
      ],
      regulatoryEnvironment:
        "Grid market rules determine what flexibility is worth, and they differ by territory and change over time.",
      maturity: "Emerging",
      currentCatalyst:
        "The power-flexible AI factory coalition and the United Kingdom grid demonstration.",
    },
    commercial: {
      customerType: "AI datacentre operators, utilities, and grid operators.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Partnership and demonstration led, working through utilities and infrastructure providers.",
      adoptionEvidence: [
        {
          claim:
            "Participation in named demonstration programmes with a grid operator, a datacentre operator, and a research institute.",
          sourceId: "emerald-nvidia",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Integration with both the facility scheduler and the utility interface, which is a coordination problem more than a technical one.",
      expansionOpportunity:
        "Additional facilities per operator, and additional territories as market rules recognise flexible load.",
      goToMarketRisk:
        "Demonstrations are not contracts, and utility procurement is slow enough that the gap between the two can be years.",
    },
    investment: {
      thesis:
        "A seed-stage software company positioned on the single constraint currently limiting AI deployment, validated by partners who select on technical review, with no disclosed commercial model yet.",
      bullCase:
        "Flexibility becomes a standard requirement for interconnection, and the company becomes the layer through which datacentres negotiate with grids.",
      baseCase:
        "Demonstrations convert slowly into contracts, with the company remaining strategically important at modest revenue.",
      bearCase:
        "The throughput cost proves unacceptable, or hyperscale operators internalise the capability, and demonstrations never convert.",
      catalysts: [
        "A disclosed commercial contract rather than a demonstration",
        "Published data on the throughput cost of a flexibility event",
      ],
      risks: [
        "No disclosed business model",
        "Dependence on grid market rules that vary by territory",
        "Customers capable of building the capability internally",
      ],
      invalidators: [
        "An operator publicly reporting an unacceptable workload cost",
        "No commercial contract within twelve months of the demonstrations",
      ],
      recommendedNextStep:
        "Ask the demonstration partners, not the company, what the flexibility events cost them in throughput. That number decides whether this is a product or a pilot.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What is the measured throughput cost of a 40 percent power reduction, and over what duration?",
      ],
      product: [
        "What integration does a facility need before flexibility can be called?",
      ],
      customers: [
        "Which demonstration partners have moved to a commercial arrangement?",
      ],
      competition: [
        "What flexibility capability do hyperscale operators already run internally?",
      ],
      unitEconomics: [
        "How is the company compensated, and does that scale with megawatts or with facilities?",
      ],
      capitalRequirements: [
        "What does a utility sales motion cost to build?",
      ],
      regulation: [
        "In which markets do the rules currently pay for flexible load, and on what terms?",
      ],
      team: [
        "Who besides the chief executive founded the company, and who has operated inside a utility?",
      ],
      financing: [
        "What is the runway, and what evidence does a Series A require?",
      ],
      commercialization: [
        "What is the business model, given none is publicly stated?",
      ],
    },
    outreach:
      "I have been researching the grid interconnection constraint on datacentre deployment, and the framing that flexibility adds capacity without building anything is the part of your approach I keep returning to. Reshaping the workload rather than shedding it seems to be why operators will actually accept it, which is where earlier demand response attempts failed. I would like to understand what a flexibility event costs in throughput on a production fleet. Would you be open to a short call?",
    factors: {
      technicalDifferentiation: fa(
        4,
        "judgment",
        "Medium",
        "Workload-level power flexibility negotiated between grid signals and datacentre schedulers.",
        "The insight is in where the flexibility is negotiated rather than in a novel algorithm.",
      ),
      technicalEvidence: fa(
        5,
        "verified",
        "High",
        "Demonstrations reported with a grid operator, a datacentre operator, and a research institute, plus membership of a named power-flexible AI factory coalition.",
        "Multiple independent institutional parties have tested and published on this. Unusually strong evidence for a seed-stage company.",
        "emerald-fortune",
      ),
      defensibility: fa(
        2,
        "judgment",
        "Low",
        "Software with no disclosed intellectual property, integrating between two systems owned by other parties.",
        "Weak. The relationships are the asset and they are not exclusive.",
      ),
      marketImportance: fa(
        5,
        "verified",
        "High",
        "Grid interconnection is the binding constraint on AI datacentre deployment in the most active regions.",
        "Directly on the most important bottleneck in the sector.",
      ),
      commercialReadiness: fa(
        2,
        "judgment",
        "Medium",
        "Demonstrations with named partners, no disclosed commercial contract, business model, or revenue.",
        "Past prototype, short of commercial.",
      ),
      customerEvidence: fa(
        3,
        "verified",
        "High",
        "Named institutional partners in published demonstrations, and a grid operator among its investors.",
        "Real institutional engagement, which is not the same as purchase.",
        "emerald-nvidia",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "Medium",
        "Founded in November 2024 by Varun Sivaram, with an energy policy and research background.",
        "Well matched to a market where regulatory fluency matters as much as engineering.",
        "emerald-nvidia",
      ),
      capitalEfficiency: fa(
        4,
        "judgment",
        "Medium",
        "Institutional demonstrations and a coalition position reached within roughly eighteen months on 42.5 million dollars.",
        "Efficient for the access achieved.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Medium",
        "Utility demand response and internal orchestration are the alternatives, neither focused on AI workloads specifically.",
        "The specific position is currently uncontested.",
      ),
      financingRisk: fa(
        4,
        "verified",
        "Medium",
        "42.5 million dollars raised with strategic participation from an accelerator vendor and a grid operator.",
        "Comfortable for a software company at this stage.",
        "emerald-nvidia",
      ),
      regulatoryRisk: fa(
        2,
        "judgment",
        "Medium",
        "The value of flexibility is set by grid market rules that vary by territory and change.",
        "High policy dependence, in both directions.",
      ),
      sourcingOriginality: fa(
        5,
        "judgment",
        "High",
        "A company under two years old sitting inside coalitions with grid operators and accelerator vendors, discoverable through partner announcements rather than funding feeds.",
        "Genuinely non-obvious, and the signal came from a channel most sourcing never checks.",
      ),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Founder, founding date, financing, investors, and the demonstration partnerships are supported by the company's own announcement and by a grid operator's independent description of the project. Business model, pricing, revenue, and the throughput cost of flexibility are not disclosed.",
    sourceIds: ["emerald-nvidia", "emerald-fortune"],
    lastReviewed: REVIEWED,
  },

  /* ----------------------------------------------------------------- Rerun */
  {
    id: "rerun",
    name: "Rerun",
    website: "https://rerun.io",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Seed round announced March 2025 as a private financing, with no listing or acquisition notice.",
    headquarters: "Stockholm, Sweden",
    region: "Europe",
    foundedYear: 2022,
    founders: ["Nikolaus West", "Emil Ernerfeldt", "Moritz Schiebold"],
    sector: "AI Infrastructure",
    subsector: "Multimodal data infrastructure for physical AI",
    description:
      "Builds an open source framework for logging and visualising the multimodal data that robots and autonomous systems produce, and a commercial database designed for that data shape.",
    targetCustomer:
      "Robotics, drone, and autonomous vehicle engineering teams handling time-aligned sensor, video, and state data.",
    businessModel:
      "Open source visualisation framework with a commercial database offering built on the same data model.",
    technicalDifferentiation:
      "Robotics data is time-aligned across many modalities at once, which general-purpose databases handle badly. Building the storage layer around that shape rather than adapting a general one is the technical bet.",
    tractionSignal:
      "The company states its open source framework has been adopted in the open source work of Meta, Google, Hugging Face's LeRobot, and Unitree.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2025-03-20",
    recentCatalyst:
      "17 million dollar seed round in March 2025 led by Point Nine, bringing total funding to 20.2 million dollars, to build the commercial database offering.",
    primaryCompetitors: [
      "General purpose time series and object storage",
      "In-house robotics data tooling",
      "Robotics platform vendors bundling data tooling",
    ],
    mainTechnicalRisk:
      "The commercial database is the unproven half. The open source visualiser is adopted; the storage product it is meant to pull through is newer.",
    mainCommercialRisk:
      "Converting open source adoption into paid database revenue is the classic difficulty of this model, and no revenue is disclosed.",
    mainFinancingRisk:
      "A modest seed base against a category where general-purpose data infrastructure companies are far better capitalised.",
    sourcing: {
      discoveryChannel: "Open-source activity",
      signalDate: "2025-03-20",
      signal: "Open-source adoption",
      dateSourced: "2026-06-02",
      channel: "Open source dependency and adoption scan in robotics repositories",
      whyEntered:
        "The open source framework appears inside the published work of several of the largest robotics and machine learning groups. Adoption by engineers who had every option available is a harder signal to manufacture than a customer logo, and it is visible in public repositories rather than in any announcement.",
      whyTimely:
        "Robot learning has shifted from labs to fleets, which turns multimodal data handling from an internal script into infrastructure. That transition is underway now and the tooling layer is not yet consolidated.",
      whyOverlooked:
        "Stockholm based, selling developer infrastructure into robotics rather than robots themselves, in a category most robotics investors do not classify as robotics at all.",
      whyNotObvious:
        "A database search classifies this as a small European seed round in developer tools. It does not show that the library is already a dependency inside major robotics research releases, which is where the actual evidence lives.",
      evidenceNeeded:
        "Paid conversion from open source adoption, and evidence that the commercial database is deployed rather than merely announced.",
      wellRecognised: false,
    },
    financing: {
      stage: "Seed",
      disclosedRound: "Seed",
      latestRound:
        "17 million dollar seed round led by Point Nine with participation from Sunflower Capital, Costanoa Ventures, and Seedcamp, bringing total funding to 20.2 million dollars.",
      latestRoundDate: "2025-03-20",
      latestRoundSourceId: "rerun-globenewswire",
      totalDisclosedFunding: "20.2 million dollars",
      namedInvestors: [
        "Point Nine",
        "Sunflower Capital",
        "Costanoa Ventures",
        "Seedcamp",
      ],
      capitalIntensity: "Low",
      futureCapitalRequirement:
        "Moderate. A software business with an engineering-heavy cost base.",
      financingRisk:
        "Moderate. Adequately funded for the stage, in a category where competitors raise much more.",
      missingInformation: [
        "Revenue",
        "Paying customer count",
        "Pricing model",
        "Conversion rate from open source use to paid",
      ],
    },
    technology: {
      howItWorks:
        "Data from many sensors is logged against a shared timeline and rendered so an engineer can scrub through a robot's experience. The commercial database stores that same time-aligned multimodal structure for query and replay at fleet scale.",
      coreAdvantage:
        "The data model. Robotics data is not rows and is not documents, and building storage around its actual shape is what general-purpose systems cannot retrofit.",
      supportingEvidence: [
        {
          claim:
            "The open source framework has been adopted in open source work by Meta, Google, Hugging Face's LeRobot, and Unitree, per the company's funding announcement.",
          sourceId: "rerun-globenewswire",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "The company describes the multimodal data stack and the commercial database it is building on top of the open source framework.",
          sourceId: "rerun-arctic",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty:
        "The open source framework itself is the distribution asset rather than a protected one. No patent position is disclosed.",
      thirdPartyDependency:
        "Robotics frameworks and sensor formats maintained by others.",
      milestoneForScale:
        "Disclosed paid customers on the commercial database, demonstrating that open source adoption converts.",
      failurePoints: [
        "Open source adoption not converting to paid database revenue",
        "A robotics platform vendor bundling equivalent tooling",
        "General purpose data infrastructure improving enough to be adequate",
      ],
    },
    market: {
      painPoint:
        "Robotics teams reinvent multimodal logging, storage, and replay internally, and it breaks as soon as they move from one robot to a fleet.",
      structure:
        "Fragmented engineering teams, with adoption led by developers rather than procurement.",
      adoptionDrivers: [
        "Robot learning moving from single machines to fleets",
        "Growth in physical AI research generating far more multimodal data",
      ],
      competitors: [
        "General purpose time series and object storage",
        "In-house robotics tooling",
      ],
      substitutes: ["Building it internally", "Storing raw logs and re-deriving"],
      regulatoryEnvironment:
        "No direct product regulation. Customers in automotive and defence impose their own data handling requirements.",
      maturity: "Emerging",
      currentCatalyst:
        "The seed round funding the commercial database, alongside continued open source adoption.",
    },
    commercial: {
      customerType: "Robotics and autonomy engineering teams.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Developer-led adoption through the open source framework, with a commercial database layered on top.",
      adoptionEvidence: [
        {
          claim:
            "Open source framework used inside published work by several major robotics and machine learning organisations.",
          sourceId: "rerun-globenewswire",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Low for the open source component. The commercial database requires a data migration.",
      expansionOpportunity:
        "Fleet growth at any customer, since data volume rises with deployed robots.",
      goToMarketRisk:
        "Open source adoption by engineers who then build the storage layer themselves is the standard failure mode here.",
    },
    investment: {
      thesis:
        "Genuine open source distribution inside the organisations that define robot learning, at seed stage, with the commercial layer still to be proven.",
      bullCase:
        "The framework becomes the default way robotics data is represented, and the database converts that position into infrastructure revenue.",
      baseCase:
        "Strong developer adoption with slow monetisation, reaching a modest outcome or an acquisition by a platform vendor.",
      bearCase:
        "Adoption stays free, the database does not convert, and the project remains a well-loved tool rather than a business.",
      catalysts: [
        "Disclosed paying customers on the commercial database",
        "The framework becoming a declared dependency in a major robotics platform",
      ],
      risks: [
        "Open source to paid conversion",
        "Platform vendors bundling equivalent tooling",
        "A small capital base relative to data infrastructure competitors",
      ],
      invalidators: [
        "No disclosed paid database customers within twelve months",
        "A major adopter replacing the framework with an internal equivalent",
      ],
      recommendedNextStep:
        "Establish how many open source adopters have converted to paid, and what triggered the conversion. That ratio is the entire investment case at this stage.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What does the commercial database do that the open source framework plus object storage cannot?",
      ],
      product: [
        "How large a fleet does a team need before the commercial product becomes necessary?",
      ],
      customers: [
        "Which organisations use the open source framework in production rather than in research?",
      ],
      competition: [
        "Where have teams chosen to build internally instead, and why?",
      ],
      unitEconomics: [
        "What is the pricing model, and how does cost scale with data volume?",
      ],
      capitalRequirements: [
        "What does the current plan fund, and what evidence does a Series A require?",
      ],
      regulation: [
        "What data handling requirements do automotive and defence customers impose?",
      ],
      team: [
        "How much of the team maintains the open source project versus the commercial database?",
      ],
      financing: [
        "What is the runway on 20.2 million dollars at current burn?",
      ],
      commercialization: [
        "What is the conversion rate from open source use to paid, and how is it measured?",
      ],
    },
    outreach:
      "I have been researching the data layer underneath robot learning, and the decision to build storage around time-aligned multimodal data rather than adapting a general purpose system is the choice I keep coming back to. The fact that the open source framework already shows up inside published work from several major robotics groups is a harder signal than a customer list. I would like to understand what makes a team move from the open source framework to the commercial database. Would you be open to a call?",
    factors: {
      technicalDifferentiation: fa(
        4,
        "judgment",
        "Medium",
        "A data model built specifically for time-aligned multimodal robotics data, with an open source visualiser on top.",
        "A real design insight about a data shape general systems handle poorly.",
      ),
      technicalEvidence: fa(
        5,
        "verified",
        "High",
        "The open source framework is used inside published work by Meta, Google, Hugging Face's LeRobot, and Unitree.",
        "Adoption by engineers with every alternative available is among the strongest technical evidence obtainable at seed stage.",
        "rerun-globenewswire",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Medium",
        "Open source distribution and the accumulated data model, against no patent position and a permissive licence.",
        "Distribution is real defensibility; the licence means it is not exclusive.",
      ),
      marketImportance: fa(
        4,
        "judgment",
        "Medium",
        "Every robotics team handling fleet data has this problem, and physical AI is generating far more of it.",
        "Important and growing, in a category still forming.",
      ),
      commercialReadiness: fa(
        2,
        "judgment",
        "Low",
        "Open source framework widely adopted; commercial database recently funded with no disclosed customers.",
        "The free half is mature and the paid half is not.",
      ),
      customerEvidence: fa(
        3,
        "verified",
        "Medium",
        "Named organisations using the open source framework, with no disclosed paying customers.",
        "Adoption without revenue evidence, rated accordingly.",
        "rerun-globenewswire",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "High",
        "Founded in 2022 by Nikolaus West, Emil Ernerfeldt, and Moritz Schiebold, with the framework's technical reception as evidence of execution.",
        "The product itself is the strongest evidence about this team.",
        "rerun-globenewswire",
      ),
      capitalEfficiency: fa(
        5,
        "verified",
        "High",
        "Broad adoption inside major robotics organisations reached on 20.2 million dollars total.",
        "Among the most capital efficient positions in the universe.",
        "rerun-globenewswire",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Medium",
        "General purpose data infrastructure and in-house tooling, with no direct competitor at the same position.",
        "Currently uncontested in its niche.",
      ),
      financingRisk: fa(
        3,
        "judgment",
        "Medium",
        "20.2 million dollars raised, with the commercial product still to prove itself before a Series A.",
        "Moderate, and dependent on conversion evidence arriving in time.",
      ),
      regulatoryRisk: fa(
        5,
        "judgment",
        "High",
        "No direct product regulation.",
        "Effectively none.",
      ),
      sourcingOriginality: fa(
        5,
        "judgment",
        "High",
        "Discoverable through open source dependency graphs rather than funding announcements, based in Stockholm, and classified as developer tools rather than robotics.",
        "A genuinely non-obvious position surfaced through a channel most sourcing does not use.",
      ),
    },
    dataConfidence: "High",
    dataConfidenceNote:
      "Founders, founding year, financing, investors, total raised, and named open source adoption are supported by the company's funding announcement with the company's own technical writing corroborating the product direction. Revenue, pricing, and paid customer counts are not disclosed.",
    sourceIds: ["rerun-globenewswire", "rerun-arctic"],
    lastReviewed: REVIEWED,
  },

  /* ------------------------------------------------------------ Turbopuffer */
  {
    id: "turbopuffer",
    name: "turbopuffer",
    website: "https://turbopuffer.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. The company has publicly described remaining at seed stage by choice, with no listing or acquisition notice.",
    headquarters: "Ottawa, Ontario, Canada",
    region: "North America",
    foundedYear: 2023,
    founders: ["Simon Hørup Eskildsen", "Justine Li"],
    sector: "Enterprise Infrastructure Software",
    subsector: "Serverless vector and search database",
    description:
      "A search and vector database built directly on object storage rather than on attached disks, which changes the cost structure of retrieval workloads at large scale.",
    targetCustomer:
      "Engineering teams running large-scale retrieval and search workloads where storage cost dominates.",
    businessModel:
      "Usage-based database service. The company has publicly described reaching profitability rather than raising a conventional growth round.",
    technicalDifferentiation:
      "Putting the index on object storage instead of local disk trades a small amount of latency for an order of magnitude in storage cost, which is the right trade for retrieval corpora that are large and infrequently hot.",
    tractionSignal: NOT_DISCLOSED,
    tractionProvenance: "Not sufficiently supported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "The founder has publicly described declining conventional Series A financing, raising a small round in January 2025 for engineering hires, and later raising specifically to provide employee liquidity rather than for operations.",
    primaryCompetitors: [
      "Dedicated vector database vendors",
      "Search engines with vector support",
      "Cloud provider native vector search",
    ],
    mainTechnicalRisk:
      "The object storage architecture accepts higher latency by design, which limits the workloads it can serve and could be closed by competitors optimising their own storage tiers.",
    mainCommercialRisk:
      "Cloud providers bundle vector search into services customers already buy, which is the standard compression risk for a standalone database.",
    mainFinancingRisk:
      "Deliberately minimal external capital means limited buffer if the market moves against the architecture.",
    sourcing: {
      discoveryChannel: "Founder research",
      signalDate: "2025-09-30",
      signal: "Founder background",
      dateSourced: "2026-07-12",
      channel: "Engineering long-form writing and technical podcast tracking",
      whyEntered:
        "The founder published detailed reasoning about building a database on object storage and about deliberately not raising a Series A. A company that turns down capital while growing is unusual enough to be worth understanding, and the reasoning was published as engineering writing rather than as an announcement.",
      whyTimely:
        "Retrieval workloads have grown large enough that storage cost, not query latency, has become the dominant term for many teams. That inversion is recent and it is exactly what this architecture is designed for.",
      whyOverlooked:
        "Canadian, remote first, deliberately quiet, and with no conventional funding announcements to index. Sourcing processes that key on financing events will not see this company at all.",
      whyNotObvious:
        "There is almost nothing for a funding database to record. The company avoided the announcements that generate database entries, so the evidence lives in technical writing and podcast interviews instead.",
      evidenceNeeded:
        "Direct confirmation of revenue and customer concentration from the company, since the figures circulating publicly come from secondary aggregators rather than from a company statement.",
      wellRecognised: false,
    },
    financing: {
      stage: "Seed",
      disclosedRound: "Seed",
      latestRound:
        "The company has publicly described a small January 2025 raise from an individual investor to fund engineering hires, and a later raise arranged for employee liquidity rather than for operations. Round sizes beyond the first are not disclosed in a primary source.",
      latestRoundDate: "2025-01-01",
      latestRoundSourceId: "turbopuffer-site",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [],
      capitalIntensity: "Low",
      futureCapitalRequirement:
        "Low. The company has publicly positioned itself as not requiring conventional growth financing.",
      financingRisk:
        "Low on dependence, higher on buffer. Minimal external capital means little cushion if the architecture bet is wrong.",
      missingInformation: [
        "Revenue, which circulates in secondary sources but is not stated in a primary one",
        "Investor names and round sizes",
        "Customer count and concentration",
        "Pricing detail",
      ],
    },
    technology: {
      howItWorks:
        "Indexes live in object storage and are pulled into cache on demand, so the durable copy of the data costs object storage prices rather than attached disk prices, and capacity scales without provisioning.",
      coreAdvantage:
        "A cost structure competitors cannot match without rearchitecting, because it follows from where the index physically lives rather than from an optimisation.",
      supportingEvidence: [
        {
          claim:
            "The company describes a search and vector database built on object storage, with the architecture and its trade-offs published in its own technical documentation.",
          sourceId: "turbopuffer-site",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "The founder discussed the architecture and the decision not to raise a conventional Series A in a long-form technical interview.",
          sourceId: "turbopuffer-sed",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Cloud object storage, which is supplied by the same providers who offer competing vector search.",
      milestoneForScale:
        "A primary-source disclosure of revenue and customer concentration, which would replace the secondary figures currently circulating.",
      failurePoints: [
        "Cloud providers closing the cost gap by optimising their own storage tiers",
        "Latency limits narrowing the addressable workload set",
        "Dependence on the object storage of a provider who also competes",
      ],
    },
    market: {
      painPoint:
        "Vector and search databases store indexes on attached disks, which makes large retrieval corpora expensive to keep online.",
      structure:
        "Developer-led adoption across many engineering teams, with cloud providers as both suppliers and competitors.",
      adoptionDrivers: [
        "Retrieval corpora growing faster than query volume",
        "Storage cost becoming the dominant term in retrieval workloads",
      ],
      competitors: [
        "Dedicated vector database vendors",
        "Search engines with vector support",
        "Cloud provider native vector search",
      ],
      substitutes: [
        "Running an open source vector index on managed infrastructure",
        "Cloud provider bundled search",
      ],
      regulatoryEnvironment:
        "No direct product regulation. Customers impose data residency requirements.",
      maturity: "Developing",
      currentCatalyst:
        "The founder's published reasoning about the architecture and about the company's financing choices.",
    },
    commercial: {
      customerType: "Engineering teams running retrieval at scale.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Developer-led, with adoption driven by published technical writing rather than by a sales organisation.",
      adoptionEvidence: [
        {
          claim:
            "The founder has publicly described the company reaching profitability and declining conventional growth financing. Specific revenue and customer figures circulate only in secondary aggregators and are not recorded here.",
          sourceId: "turbopuffer-sed",
          basis: "judgment",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Low. Adoption is a database integration rather than an infrastructure change.",
      expansionOpportunity:
        "Usage growth within existing customers as their corpora grow.",
      goToMarketRisk:
        "A deliberately quiet company competing against vendors with large sales organisations and against bundled cloud alternatives.",
    },
    investment: {
      thesis:
        "An architecturally distinct database with an unusual financing posture, run by a founder who publishes his reasoning, where the main obstacle to underwriting is that the company deliberately discloses very little.",
      bullCase:
        "The object storage cost structure proves durable, usage compounds with corpus growth, and the company sustains an unusually efficient business.",
      baseCase:
        "A strong niche product in a crowded category, growing steadily without conventional venture scale.",
      bearCase:
        "Cloud providers close the cost gap or bundle equivalent capability, and a deliberately small company has little buffer to respond.",
      catalysts: [
        "A primary-source disclosure of revenue or customer concentration",
        "Published benchmarks against attached-disk competitors",
      ],
      risks: [
        "Cloud provider bundling",
        "Very limited public disclosure",
        "Dependence on object storage supplied by competitors",
      ],
      invalidators: [
        "A major cloud provider matching the storage cost structure natively",
        "Evidence that latency limits exclude the workloads that matter commercially",
      ],
      recommendedNextStep:
        "Ask directly for revenue and customer concentration. The figures circulating publicly come from aggregators, and a company this quiet should be underwritten on what it will state itself.",
      confidence: "Low",
    },
    diligence: {
      technology: [
        "What is the latency penalty of the object storage architecture, and which workloads does it exclude?",
      ],
      product: [
        "How does performance behave when the working set exceeds cache?",
      ],
      customers: [
        "What is customer concentration, and what proportion of usage comes from the largest account?",
      ],
      competition: [
        "How does total cost compare with an attached-disk vector database at the same corpus size?",
      ],
      unitEconomics: [
        "What is gross margin after object storage and egress costs?",
      ],
      capitalRequirements: [
        "What would the company need capital for, given its stated position?",
      ],
      regulation: [
        "What data residency options exist for regulated customers?",
      ],
      team: [
        "How large is the team, and how is it structured given the deliberate constraint on hiring?",
      ],
      financing: [
        "What rounds have actually closed, on what terms, and with which investors?",
      ],
      commercialization: [
        "What is the pricing model, and how does revenue scale with corpus growth versus query volume?",
      ],
    },
    outreach:
      "I have been researching retrieval infrastructure, and putting the index on object storage rather than attached disk is the architectural decision I find most interesting, because it accepts a latency penalty to win on a cost term that most teams only notice once their corpus is large. Your writing about declining a conventional Series A was the reason I looked properly. I would like to understand where the latency ceiling actually bites and which workloads you deliberately do not serve. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(
        4,
        "verified",
        "Medium",
        "A search and vector database built directly on object storage, with the trade-offs published by the company.",
        "A genuine architectural difference rather than an optimisation.",
        "turbopuffer-site",
      ),
      technicalEvidence: fa(
        3,
        "verified",
        "Medium",
        "Detailed public technical documentation and a long-form founder interview on the architecture. No published benchmark and no named production customer.",
        "The reasoning is unusually transparent; the outcomes are not disclosed.",
        "turbopuffer-sed",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Low",
        "An architectural choice a competitor could adopt, against switching costs once a corpus is loaded.",
        "Moderate, and dependent on how quickly incumbents rearchitect.",
      ),
      marketImportance: fa(
        4,
        "judgment",
        "Medium",
        "Retrieval is now a standard component of production AI systems, and storage cost dominates at scale.",
        "Broad and growing demand.",
      ),
      commercialReadiness: fa(
        4,
        "judgment",
        "Low",
        "A production database in commercial use, with the company describing profitability but disclosing no figures.",
        "Rated on the strength of the public statement, with low confidence because nothing is quantified.",
      ),
      customerEvidence: fa(
        2,
        "judgment",
        "Low",
        "No named customer and no primary-source revenue figure. Secondary aggregators publish figures that are not recorded here.",
        "Deliberately discounted. The platform does not treat aggregator figures as evidence.",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "Medium",
        "Co-founded by two former Shopify infrastructure engineers who scaled that platform's database and compute layer, with the founder's published engineering reasoning as further evidence.",
        "Directly relevant scaling experience, and the technical writing shows how the team reasons.",
        "turbopuffer-about",
      ),
      capitalEfficiency: fa(
        5,
        "judgment",
        "Medium",
        "The company has publicly described reaching profitability while declining conventional growth financing.",
        "If accurate, the most capital efficient position in the universe. Rated on the founder's public statement.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Medium",
        "Dedicated vector database vendors with large funding, plus cloud providers bundling equivalent capability.",
        "Crowded, with the most dangerous competitor also being the supplier of the underlying storage.",
      ),
      financingRisk: fa(
        4,
        "judgment",
        "Low",
        "Minimal external capital and a stated profitable position, which removes dependence on the next round.",
        "Low dependence, thin buffer. Rated on the company's own account.",
      ),
      regulatoryRisk: fa(
        5,
        "judgment",
        "High",
        "No direct product regulation.",
        "Effectively none.",
      ),
      sourcingOriginality: fa(
        5,
        "judgment",
        "High",
        "A company that deliberately avoids funding announcements, based outside the main hubs, discoverable only through engineering writing.",
        "Almost invisible to conventional sourcing, which is exactly why it scores at the top here.",
      ),
    },
    dataConfidence: "Low",
    dataConfidenceNote:
      "Founders, founding year, headquarters, and the architecture are supported by the company's own site and a long-form founder interview. Round sizes, investors, revenue, and customer counts are not available from a primary source. Figures circulating in secondary aggregators are deliberately excluded, which is why this record is marked low confidence rather than filled in.",
    sourceIds: ["turbopuffer-site", "turbopuffer-about", "turbopuffer-sed"],
    lastReviewed: REVIEWED,
  },
];

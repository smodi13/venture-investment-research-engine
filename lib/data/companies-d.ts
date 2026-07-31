import { fa, NOT_DISCLOSED, type PrivateCompany } from "../types";

/** Verified private companies, part four. See companies-a.ts for the data policy. */

const REVIEWED = "2026-07-30";

export const COMPANIES_D: PrivateCompany[] = [
  /* ------------------------------------------------------------ Chainguard */
  {
    id: "chainguard",
    name: "Chainguard",
    website: "https://www.chainguard.dev",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series D announced April 2025 as a private financing, with no listing or acquisition notice.",
    headquarters: "Kirkland, Washington, United States",
    region: "North America",
    foundedYear: 2021,
    founders: [
      "Dan Lorenc",
      "Kim Lewandowski",
      "Ville Aikas",
      "Matt Moore",
      "Scott Nichols",
    ],
    sector: "Enterprise Infrastructure Software",
    subsector: "Software supply chain security",
    description:
      "Rebuilds open source container images, language libraries, and virtual machine images continuously from source in controlled environments, so that enterprises consume open source without inheriting its known vulnerabilities.",
    targetCustomer:
      "Platform engineering and security teams at enterprises running containerised workloads.",
    businessModel:
      "Annual subscription for access to the maintained image and library catalogue.",
    technicalDifferentiation:
      "Continuous rebuilding from source at scale, which is an operational commitment rather than a scanning product, and is the reason the vulnerability count stays near zero rather than being reported.",
    tractionSignal:
      "The company reported revenue growth from 5 million to 40 million dollars, more than 100 paying enterprise customers, and catalogue growth from 400 to 1,400 images, in its Series D announcement.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2025-04-30",
    recentCatalyst:
      "Series D of 356 million dollars led by Kleiner Perkins and IVP at a reported 3.5 billion dollar valuation, announced April 2025.",
    primaryCompetitors: [
      "Container image scanning vendors",
      "Cloud provider base image offerings",
      "Enterprise Linux distribution vendors",
    ],
    mainTechnicalRisk:
      "The rebuild pipeline must keep pace with upstream churn across a growing catalogue, and the cost of that grows with coverage.",
    mainCommercialRisk:
      "A cloud provider or Linux vendor bundling equivalent hardened images at no additional charge.",
    mainFinancingRisk:
      "A valuation set at a high multiple of the disclosed revenue figure.",
    sourcing: {
      discoveryChannel: "Funding announcement",
      signalDate: "2025-04-23",
      signal: "Open-source adoption",
      dateSourced: "2026-01-22",
      channel: "Developer infrastructure adoption scan",
      whyEntered:
        "The company disclosed a specific revenue trajectory and customer count alongside catalogue growth, which is unusually concrete for a private security company. Disclosed operating metrics are rare and make the commercial claim checkable rather than asserted.",
      whyTimely:
        "Software supply chain requirements have moved from guidance to procurement conditions in regulated industries and government contracting, which converts a security preference into a purchasing requirement.",
      whyOverlooked:
        "Not overlooked in its own category, which is well covered. Retained because the specific question of whether a rebuild pipeline is defensible against a cloud provider bundling the same thing is under-examined relative to the attention the company receives.",
      whyNotObvious:
        "Widely covered, so nothing here is hard to find. The under-examined question is whether a rebuild pipeline stays defensible once a cloud provider bundles the same thing.",
      evidenceNeeded:
        "Current revenue against the April 2025 disclosure, and retention among customers whose platform vendor already ships hardened images.",
      wellRecognised: true,
    },
    financing: {
      stage: "Later stage",
      disclosedRound: "Series D",
      latestRound:
        "356 million dollar Series D led by Kleiner Perkins and IVP at a reported 3.5 billion dollar valuation.",
      latestRoundDate: "2025-04-23",
      latestRoundSourceId: "chainguard-announcement",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "Kleiner Perkins",
        "IVP",
        "Sequoia Capital",
        "Salesforce Ventures",
        "Datadog Ventures",
        "Redpoint",
        "Lightspeed",
      ],
      capitalIntensity: "Low",
      futureCapitalRequirement:
        "Modest. The business is software with an engineering-heavy cost base rather than a capital-heavy one.",
      financingRisk:
        "Low on cash, meaningful on valuation relative to the disclosed revenue figure.",
      missingInformation: [
        "Current revenue, as the disclosed figure is from April 2025",
        "Gross margin",
        "Net revenue retention",
        "Total capital raised across all rounds",
      ],
    },
    technology: {
      howItWorks:
        "Images and libraries are rebuilt continuously from upstream source in controlled build environments, with minimal contents so that fewer components are present to be vulnerable, and remediation delivered against a service level agreement.",
      coreAdvantage:
        "Operating a rebuild pipeline across a large catalogue is a sustained engineering commitment. The product is the pipeline, not the images.",
      supportingEvidence: [
        {
          claim:
            "Catalogue growth from 400 to 1,400 images and revenue growth from 5 million to 40 million dollars, disclosed by the company.",
          sourceId: "chainguard-announcement",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Series D amount, valuation, and Kirkland headquarters independently reported.",
          sourceId: "chainguard-builtin",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Upstream open source projects, whose release cadence and quality the company does not control.",
      milestoneForScale:
        "Evidence that catalogue expansion does not require proportional engineering headcount.",
      failurePoints: [
        "Rebuild cost scaling linearly with catalogue size",
        "A cloud provider bundling equivalent hardened images",
        "Upstream projects changing licensing or distribution terms",
      ],
    },
    market: {
      painPoint:
        "Enterprises inherit thousands of known vulnerabilities from the open source they depend on, and scanning reports them without removing them.",
      structure:
        "Broad enterprise demand with purchasing led by security and platform teams under audit pressure.",
      adoptionDrivers: [
        "Software supply chain requirements becoming procurement conditions",
        "Container adoption increasing the surface being inherited",
      ],
      competitors: [
        "Container image scanning vendors",
        "Cloud provider base image offerings",
        "Enterprise Linux distribution vendors",
      ],
      substitutes: [
        "Scanning and manually remediating",
        "Building and maintaining hardened images internally",
      ],
      regulatoryEnvironment:
        "No direct product regulation. Government and regulated-industry procurement requirements drive demand.",
      maturity: "Developing",
      currentCatalyst:
        "Series D funding and a disclosed revenue trajectory that makes the commercial claim checkable.",
    },
    commercial: {
      customerType: "Security and platform engineering teams at enterprises.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Enterprise sales with developer-led entry through the free catalogue.",
      adoptionEvidence: [
        {
          claim:
            "More than 100 paying enterprise customers and revenue growth from 5 million to 40 million dollars, disclosed at Series D.",
          sourceId: "chainguard-announcement",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Low. Images substitute into existing container workflows.",
      expansionOpportunity:
        "Additional image and library coverage within existing customers.",
      goToMarketRisk:
        "The most dangerous competitor is a free feature from a platform the customer already pays for.",
    },
    investment: {
      thesis:
        "A rare private security company with disclosed operating metrics, addressing a requirement that has moved from preference to procurement condition, with a valuation that assumes the rebuild pipeline stays defensible.",
      bullCase:
        "Supply chain requirements harden further, catalogue coverage compounds, and the pipeline proves too operationally demanding for platform vendors to replicate casually.",
      baseCase:
        "Strong growth in regulated industries with gradually increasing competition from bundled alternatives.",
      bearCase:
        "A major cloud provider ships equivalent hardened images as standard, and the standalone purchase loses its rationale.",
      catalysts: [
        "An updated revenue disclosure against the April 2025 figure",
        "Evidence that catalogue growth is not headcount-linear",
      ],
      risks: [
        "Platform bundling",
        "Rebuild cost scaling with coverage",
        "Valuation set on a revenue figure now more than a year old",
      ],
      invalidators: [
        "A major cloud provider shipping an equivalent maintained catalogue at no additional charge",
        "Evidence that engineering cost scales linearly with catalogue size",
      ],
      recommendedNextStep:
        "Establish current revenue against the disclosed April 2025 figure. The valuation rests on a growth rate that has not been publicly updated since.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "How does rebuild pipeline cost scale as the catalogue grows?",
      ],
      product: [
        "What proportion of a typical customer's container surface is actually covered?",
      ],
      customers: [
        "What is net revenue retention among the disclosed enterprise customers?",
      ],
      competition: [
        "What hardened image offerings do the major cloud providers ship today, and at what price?",
      ],
      unitEconomics: [
        "What is gross margin after fully loading the rebuild infrastructure?",
      ],
      capitalRequirements: [
        "Given a software cost base, what is the Series D actually funding?",
      ],
      regulation: [
        "Which procurement requirements name this category explicitly?",
      ],
      team: [
        "How much of the founding team, which came from a shared open source security background, remains?",
      ],
      financing: [
        "What is total capital raised, and what is current revenue?",
      ],
      commercialization: [
        "What proportion of enterprise customers began through the free catalogue?",
      ],
    },
    outreach:
      "I have been researching software supply chain security, and the decision to rebuild continuously from source rather than to scan and report is what makes your approach interesting to me. It converts a reporting product into an operational commitment, which is much harder and much more useful. I would like to understand how rebuild cost scales as the catalogue grows, since that seems to be the question the whole model rests on. Would you be open to a call?",
    factors: {
      technicalDifferentiation: fa(
        3,
        "verified",
        "High",
        "Continuous rebuilding from source across a large catalogue, delivered with a remediation service level agreement.",
        "The idea is not exotic; sustaining it at scale is the differentiation.",
        "chainguard-announcement",
      ),
      technicalEvidence: fa(
        4,
        "verified",
        "High",
        "Catalogue growth from 400 to 1,400 images with disclosed customer count and revenue trajectory.",
        "Concrete disclosed operating metrics, which are rare in private security companies.",
        "chainguard-announcement",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Medium",
        "Switching costs once images are embedded in build pipelines, against the risk of platform bundling.",
        "Moderate. The operational burden is the barrier, and a large platform can absorb it.",
      ),
      marketImportance: fa(
        4,
        "verified",
        "High",
        "Supply chain security has become a procurement condition in regulated industries and government contracting.",
        "A requirement rather than a preference, which is the strongest form of demand.",
      ),
      commercialReadiness: fa(
        5,
        "verified",
        "High",
        "More than 100 paying enterprise customers on a repeatable motion.",
        "Fully repeatable.",
        "chainguard-announcement",
      ),
      customerEvidence: fa(
        5,
        "verified",
        "High",
        "Disclosed revenue growth from 5 million to 40 million dollars with a stated customer count.",
        "Among the strongest customer evidence in the universe, and unusually specific for a private company.",
        "chainguard-announcement",
      ),
      teamCredibility: fa(
        5,
        "verified",
        "High",
        "Five named founders from a shared background in open source software supply chain security.",
        "Directly relevant and well documented.",
        "chainguard-builtin",
      ),
      capitalEfficiency: fa(
        4,
        "judgment",
        "Medium",
        "Reached a disclosed 40 million dollar revenue level before the Series D.",
        "Efficient, with the Series D raising the bar it now has to clear.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Medium",
        "Cloud providers and Linux vendors could bundle equivalent offerings at no marginal cost to the customer.",
        "The classic infrastructure software risk: the competitor does not need to be better, only included.",
      ),
      financingRisk: fa(
        4,
        "verified",
        "Medium",
        "Large recent round with a low capital requirement business model.",
        "Low on cash. Rated down slightly for valuation relative to disclosed revenue.",
        "chainguard-builtin",
      ),
      regulatoryRisk: fa(
        5,
        "judgment",
        "High",
        "No direct product regulation, and regulation is a demand driver rather than a constraint.",
        "Regulation works in this company's favour.",
      ),
      sourcingOriginality: fa(
        1,
        "verified",
        "High",
        "Widely covered in security and business press following the Series D.",
        "No sourcing edge here, and the model records that rather than crediting the company for being well known.",
      ),
    },
    dataConfidence: "High",
    dataConfidenceNote:
      "Founders, founding year, headquarters, financing, catalogue growth, customer count, and revenue trajectory are supported by the company's own announcement with independent corroboration. The revenue figure dates from April 2025 and has not been publicly updated.",
    sourceIds: ["chainguard-announcement", "chainguard-builtin"],
    lastReviewed: REVIEWED,
  },

  /* -------------------------------------------------------- Sublime Systems */
  {
    id: "sublime-systems",
    name: "Sublime Systems",
    website: "https://sublime-systems.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Strategic investments from CRH and Holcim were minority equity, with no acquisition or listing notice.",
    headquarters: "Somerville, Massachusetts, United States",
    region: "North America",
    foundedYear: 2020,
    founders: ["Leah Ellis", "Yet-Ming Chiang"],
    sector: "Advanced Materials",
    subsector: "Electrochemical cement manufacturing",
    description:
      "Makes cement using an electrochemical process at ambient temperature instead of a fossil-fired kiln, producing a material that meets the ASTM standard for use as a drop-in replacement.",
    targetCustomer:
      "Cement producers, concrete suppliers, and large construction contractors.",
    businessModel:
      "Cement manufacturing and sale, with strategic partnerships and offtake relationships with incumbent producers.",
    technicalDifferentiation:
      "Replacing the kiln removes both the fuel emissions and the process emissions from limestone, which is the part of cement decarbonisation that efficiency measures cannot reach.",
    tractionSignal:
      "Deploying cement in real-world projects since 2023, operating a pilot plant in Somerville, and developing a first commercial facility in Holyoke, Massachusetts.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "Combined 75 million dollar strategic investment from CRH and Holcim, two of the largest global building materials companies.",
    primaryCompetitors: [
      "Incumbent Portland cement producers",
      "Carbon capture retrofits on conventional kilns",
      "Alternative low-carbon cement chemistries",
    ],
    mainTechnicalRisk:
      "Electrochemical production must hold its cost and quality characteristics at commercial plant scale, which is a different problem from pilot scale.",
    mainCommercialRisk:
      "Cement is a commodity sold on price, and a green premium depends on procurement rules and customer commitments that can change.",
    mainFinancingRisk:
      "Commercial plants are capital projects, and project finance for first-of-a-kind facilities is difficult and expensive.",
    sourcing: {
      discoveryChannel: "Strategic partnership",
      signalDate: "2024-09-24",
      signal: "Strategic investor participation",
      dateSourced: "2026-02-05",
      channel: "Industrial decarbonisation supply chain scan",
      whyEntered:
        "Two of the largest global cement producers invested in the same company simultaneously. Incumbents in a commodity industry funding a process that would displace their own asset base is an unusual signal and suggests the technology passed their technical review.",
      whyTimely:
        "Cement is roughly a tenth of global industrial emissions with no available efficiency route to deep reduction, and procurement rules in several markets now specify embodied carbon.",
      whyOverlooked:
        "Materials companies have long commercialisation cycles and are frequently overlooked by investors accustomed to software timelines. Cement in particular is a slow, unglamorous industry with few venture-scale comparables.",
      whyNotObvious:
        "Filed under climate technology, where a search returns hundreds of companies and does not distinguish the ones whose own incumbents have invested in them.",
      evidenceNeeded:
        "Whether the strategic investments carry offtake commitments, and the projected cost per tonne at the commercial facility.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series B",
      disclosedRound: "Series B",
      latestRound:
        "Combined 75 million dollar strategic investment from CRH and Holcim, announced September 2024.",
      latestRoundDate: "2024-09-24",
      latestRoundSourceId: "sublime-announcement",
      totalDisclosedFunding:
        "More than 200 million dollars, as stated by the company, including US Department of Energy programme awards",
      namedInvestors: ["CRH", "Holcim", "Siam Cement Group", "Suffolk Construction"],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "Substantial. Commercial plants are capital projects requiring project finance rather than venture equity.",
      financingRisk:
        "High. First-of-a-kind industrial facilities are among the hardest assets to finance.",
      missingInformation: [
        "Revenue",
        "Cost per tonne at commercial scale",
        "Offtake contract terms with the strategic investors",
      ],
    },
    technology: {
      howItWorks:
        "An electrochemical process extracts reactive calcium and silicates from raw materials at ambient temperature, avoiding the high-temperature kiln that conventional cement requires and co-producing other minerals.",
      coreAdvantage:
        "Eliminating the kiln addresses process emissions as well as fuel emissions, which is the constraint that conventional efficiency improvements cannot overcome.",
      supportingEvidence: [
        {
          claim:
            "The company states its product meets ASTM C1157 and functions as a drop-in replacement for ordinary Portland cement.",
          sourceId: "sublime-site",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "CRH and Holcim invested a combined 75 million dollars, confirmed independently by Holcim's own disclosure.",
          sourceId: "sublime-holcim",
          basis: "verified",
          provenance: "Investor-reported",
        },
      ],
      benchmarks:
        "Compliance with ASTM C1157 is an external standard rather than a vendor claim, which is stronger evidence than a self-reported performance figure.",
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Low-carbon electricity supply and raw material feedstock availability.",
      milestoneForScale:
        "The Holyoke commercial facility operating at its stated capacity with cost per tonne disclosed.",
      failurePoints: [
        "Cost per tonne at commercial scale not converging toward conventional cement",
        "Electricity cost or availability at plant scale",
        "Green premium eroding if procurement rules change",
      ],
    },
    market: {
      painPoint:
        "Cement production emits carbon dioxide from both fuel and the chemical decomposition of limestone, and the second cannot be addressed by efficiency.",
      structure:
        "A commodity industry dominated by a small number of very large producers with long asset lives.",
      adoptionDrivers: [
        "Embodied carbon requirements entering public procurement rules",
        "Corporate construction commitments specifying low-carbon materials",
      ],
      competitors: [
        "Incumbent Portland cement producers",
        "Carbon capture retrofits",
        "Alternative cement chemistries",
      ],
      substitutes: [
        "Conventional cement with carbon offsets",
        "Supplementary cementitious materials reducing clinker content",
      ],
      regulatoryEnvironment:
        "Building material standards govern acceptance, and procurement rules increasingly specify embodied carbon. Standards compliance is a gate rather than a preference.",
      maturity: "Emerging",
      currentCatalyst:
        "Development of the Holyoke commercial facility and a US Department of Energy award supporting it.",
    },
    commercial: {
      customerType: "Cement producers, concrete suppliers, and contractors.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Partnership-led, working through incumbent producers and large contractors rather than selling directly at scale.",
      adoptionEvidence: [
        {
          claim:
            "Cement deployed in real-world projects since 2023 and partnerships with large general contractors.",
          sourceId: "sublime-site",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Low for the end user by design, since the product is specified as a drop-in replacement.",
      expansionOpportunity:
        "Additional plants and licensing the process to incumbent producers.",
      goToMarketRisk:
        "Selling into a commodity industry where price is the dominant purchasing criterion.",
    },
    investment: {
      thesis:
        "A process change that addresses the part of cement emissions no efficiency measure can reach, validated by strategic investment from the two largest incumbents and by external standards compliance.",
      bullCase:
        "The Holyoke facility demonstrates cost convergence, incumbents move from investment to offtake and licensing, and the process becomes an industry standard route.",
      baseCase:
        "Slow scaling supported by procurement rules and strategic partners, with a green premium persisting for years.",
      bearCase:
        "Cost per tonne does not converge, procurement support weakens, and capital-intensive plants cannot be financed.",
      catalysts: [
        "Holyoke facility commissioning and disclosed cost per tonne",
        "Conversion of strategic investment into offtake agreements",
      ],
      risks: [
        "First-of-a-kind plant financing",
        "Commodity price competition",
        "Policy dependence of the green premium",
      ],
      invalidators: [
        "Cost per tonne at commercial scale materially above conventional cement with no closing path",
        "Strategic investors declining to sign offtake",
      ],
      recommendedNextStep:
        "Establish whether the strategic investments carry offtake commitments. Equity without offtake is an option on the technology rather than a demand signal.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What is the projected cost per tonne at the Holyoke facility, and what drives the gap to conventional cement?",
      ],
      product: [
        "How does the material perform in long-duration durability testing relative to Portland cement?",
      ],
      customers: [
        "Which projects have used the cement, and at what volume?",
      ],
      competition: [
        "How does the cost trajectory compare with carbon capture retrofits on conventional kilns?",
      ],
      unitEconomics: [
        "What electricity price is assumed, and how sensitive is cost per tonne to it?",
      ],
      capitalRequirements: [
        "What is the capital cost of the Holyoke plant, and how is it financed?",
      ],
      regulation: [
        "Which procurement rules currently specify embodied carbon in the target markets?",
      ],
      team: [
        "Who on the team has commissioned an industrial plant before?",
      ],
      financing: [
        "What are the terms of the strategic investments, and do they include offtake?",
      ],
      commercialization: [
        "What volume is contracted for the Holyoke facility output?",
      ],
    },
    outreach:
      "I have been researching industrial decarbonisation, and cement is the case where efficiency measures cannot reach the emissions that matter, because they come from the chemistry rather than the fuel. Removing the kiln entirely is the only approach I have seen that addresses that directly. I would like to understand how cost per tonne is expected to behave at the Holyoke facility and what the strategic partnerships look like in practice. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(
        5,
        "verified",
        "High",
        "Ambient-temperature electrochemical cement production, eliminating the kiln entirely.",
        "A fundamental process change rather than an efficiency improvement.",
        "sublime-site",
      ),
      technicalEvidence: fa(
        5,
        "verified",
        "High",
        "ASTM C1157 compliance, cement deployed in projects since 2023, scale-up from grams to tonnes, and a pilot plant operating.",
        "External standards compliance plus real deployment is unusually strong evidence for a materials company at this stage.",
        "sublime-site",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Medium",
        "Process knowledge accumulated through scale-up, plus strategic relationships with the largest incumbents.",
        "Strong in practice, since replicating a working electrochemical process at scale is genuinely difficult.",
      ),
      marketImportance: fa(
        5,
        "verified",
        "High",
        "Cement is among the largest industrial emissions sources with no efficiency route to deep reduction.",
        "The bottleneck is real, large, and structurally unavoidable.",
      ),
      commercialReadiness: fa(
        3,
        "verified",
        "High",
        "Pilot plant operating with product deployed in projects, and a commercial facility under development.",
        "Past prototype, not yet at commercial production scale.",
        "sublime-site",
      ),
      customerEvidence: fa(
        4,
        "verified",
        "High",
        "Strategic investment from CRH and Holcim, partnerships with large general contractors, and product in real projects.",
        "Incumbent producers investing in a displacing process is a strong signal, short of offtake.",
        "sublime-holcim",
      ),
      teamCredibility: fa(
        5,
        "verified",
        "High",
        "Founded by Leah Ellis and Yet-Ming Chiang out of MIT, with Chiang having previously founded multiple materials companies.",
        "Exceptional materials science pedigree with prior commercialisation experience.",
        "sublime-site",
      ),
      capitalEfficiency: fa(
        3,
        "verified",
        "Medium",
        "More than 200 million dollars raised, including government awards, to reach pilot scale and a commercial plant under development.",
        "Reasonable for heavy industry, low in absolute terms.",
        "sublime-site",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Medium",
        "Incumbents are potential competitors and partners simultaneously, and alternative chemistries exist.",
        "Moderate, and unusually cooperative for a displacing technology.",
      ),
      financingRisk: fa(
        2,
        "judgment",
        "Medium",
        "Commercial plants require project finance, which is difficult for first-of-a-kind facilities.",
        "The primary risk in this business is financing rather than technology.",
      ),
      regulatoryRisk: fa(
        3,
        "verified",
        "Medium",
        "Building standards govern acceptance and procurement rules drive the premium.",
        "Currently supportive, and policy dependence cuts both ways.",
      ),
      sourcingOriginality: fa(
        4,
        "judgment",
        "Medium",
        "Industrial materials receive far less venture attention than software or AI despite comparable capital needs.",
        "Genuinely under-examined relative to the size of the problem.",
      ),
    },
    dataConfidence: "High",
    dataConfidenceNote:
      "Founders, founding year, headquarters, process, standards compliance, strategic investment, and plant development are supported by the company's own site and announcement, with independent confirmation from Holcim's own disclosure. Revenue and cost per tonne are not disclosed.",
    sourceIds: ["sublime-site", "sublime-announcement", "sublime-holcim"],
    lastReviewed: REVIEWED,
  },

  /* ------------------------------------------------------------ Base Power */
  {
    id: "base-power",
    name: "Base Power",
    website: "https://www.basepowercompany.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series C reported as a private financing, with no listing or acquisition notice.",
    headquarters: "Austin, Texas, United States",
    region: "North America",
    foundedYear: 2023,
    founders: ["Zach Dell", "Justin Lopas"],
    sector: "Energy Systems",
    subsector: "Distributed home battery and retail electricity",
    description:
      "Installs home batteries and sells electricity as a retail provider, using the aggregated batteries to provide grid services rather than charging customers for the hardware.",
    targetCustomer:
      "Residential electricity customers in deregulated Texas markets and in utility partnership areas.",
    businessModel:
      "Retail electricity plans bundled with battery backup, with revenue from grid balancing services rather than from hardware margin.",
    technicalDifferentiation:
      "Vertical integration of hardware, installation, and the retail electricity licence, which lets the company monetise the battery through grid services rather than selling it.",
    tractionSignal:
      "The company states it serves more than 30,000 homeowners and holds Texas Public Utility Commission licence number 10338.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "Series C of one billion dollars to build a domestic factory and expand beyond Texas.",
    primaryCompetitors: [
      "Residential solar and storage installers",
      "Incumbent retail electricity providers",
      "Utility-run demand response programmes",
    ],
    mainTechnicalRisk:
      "Aggregated battery dispatch must perform reliably at grid scale, and hardware failures are distributed across thousands of homes.",
    mainCommercialRisk:
      "The economics depend on grid services revenue, which is set by market rules that regulators can change.",
    mainFinancingRisk:
      "Batteries are financed on the balance sheet ahead of the grid services revenue that pays for them.",
    sourcing: {
      discoveryChannel: "Funding announcement",
      signalDate: "2026-01-15",
      signal: "New facility",
      dateSourced: "2026-01-20",
      channel: "Distributed energy and grid services scan",
      whyEntered:
        "The company holds a retail electricity licence as well as building hardware, which is an unusual combination. Owning the customer relationship and the market participation together is what makes the business model work, and it is much harder to assemble than either half alone.",
      whyTimely:
        "Grid reliability events in Texas have made home backup a mainstream purchase, and distributed batteries have become a recognised grid resource in market rules.",
      whyOverlooked:
        "Not overlooked. The company is widely covered, partly because of its founder. It is retained because the regulatory dependency of the business model receives much less scrutiny than the funding does.",
      whyNotObvious:
        "Heavily covered. What receives far less attention than the funding is that the business depends on grid services market rules set by regulators rather than on the hardware.",
      evidenceNeeded:
        "Modelled economics under a materially less favourable grid services regime, and evidence the model transfers to a second regulatory jurisdiction.",
      wellRecognised: true,
    },
    financing: {
      stage: "Series C",
      disclosedRound: "Series C",
      latestRound:
        "One billion dollar Series C, funding a domestic battery factory and expansion beyond Texas.",
      latestRoundDate: "2026-01-15",
      latestRoundSourceId: "base-esgtoday",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "Addition",
        "Valor Equity Partners",
        "Thrive Capital",
        "Lightspeed",
        "Andreessen Horowitz",
        "CapitalG",
      ],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "Very high. Battery hardware, installation, and factory construction are all capital consuming ahead of revenue.",
      financingRisk:
        "Moderate on cash after a very large round, high on the capital intensity of the model itself.",
      missingInformation: [
        "Revenue",
        "Grid services revenue per battery",
        "Total capital raised across all rounds",
        "Unit economics per installation",
      ],
    },
    technology: {
      howItWorks:
        "A battery is installed at the home and provides backup during outages. When the grid needs support, the aggregated fleet is dispatched, and the company earns from that participation rather than from selling the hardware.",
      coreAdvantage:
        "Holding the retail electricity licence alongside the hardware, which allows the value of grid participation to be returned to the customer as a lower rate rather than captured as hardware margin.",
      supportingEvidence: [
        {
          claim:
            "Texas Public Utility Commission retail electricity licence number 10338, stated on the company site.",
          sourceId: "base-site",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Series C of one billion dollars, independently reported, funding a factory and national expansion.",
          sourceId: "base-esgtoday",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Battery cell supply, and the market rules of the grid operators in each territory.",
      milestoneForScale:
        "Demonstrating the model works in a second regulatory regime outside Texas, which the company states it is beginning in Illinois.",
      failurePoints: [
        "Grid services market rules changing and compressing the revenue that funds the model",
        "Distributed hardware failure rates across a large installed fleet",
        "Battery cell supply cost and availability",
      ],
    },
    market: {
      painPoint:
        "Home electricity is unreliable in some markets and grids need flexible capacity, and neither problem is solved by selling batteries as a consumer product.",
      structure:
        "Residential customers acquired individually, with revenue depending on wholesale market participation rules.",
      adoptionDrivers: [
        "Grid reliability events driving demand for home backup",
        "Distributed storage recognised as a dispatchable resource in market rules",
      ],
      competitors: [
        "Residential solar and storage installers",
        "Incumbent retail electricity providers",
        "Utility demand response programmes",
      ],
      substitutes: ["Standby generators", "Accepting outages"],
      regulatoryEnvironment:
        "Directly regulated. The company holds a retail electricity licence, and grid services revenue depends on market rules set by regulators in each territory.",
      maturity: "Developing",
      currentCatalyst:
        "Factory investment and expansion into Illinois, which tests whether the model transfers across regulatory regimes.",
    },
    commercial: {
      customerType: "Residential electricity customers.",
      pricingModel:
        "Fixed-rate electricity plans bundled with battery backup, with variants for energy only and backup only, as described on the company site.",
      salesMotion: "Direct consumer acquisition with installation.",
      adoptionEvidence: [
        {
          claim:
            "The company states more than 30,000 homeowners served and operation in Texas with expansion into Illinois.",
          sourceId: "base-site",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Physical installation at each home, which makes customer acquisition cost partly a logistics problem.",
      expansionOpportunity:
        "Additional territories, each requiring separate regulatory work.",
      goToMarketRisk:
        "Each new state is a new regulatory entry rather than a marketing expansion.",
    },
    investment: {
      thesis:
        "A vertically integrated distributed energy business whose real asset is the combination of hardware, installation, and a retail electricity licence, expanding into a second regulatory regime for the first time.",
      bullCase:
        "The model transfers across regulatory regimes, the factory reduces hardware cost, and the aggregated fleet becomes a significant grid resource.",
      baseCase:
        "Strong growth in Texas with slower expansion elsewhere as each regulatory entry takes longer than planned.",
      bearCase:
        "Grid services market rules change, compressing the revenue that funds the customer proposition, and the capital intensity becomes unsupportable.",
      catalysts: [
        "Evidence the model works in Illinois",
        "Factory commissioning and disclosed hardware cost reduction",
      ],
      risks: [
        "Regulatory dependence of the revenue model",
        "Very high capital intensity",
        "Distributed hardware reliability at scale",
      ],
      invalidators: [
        "A material adverse change in grid services market rules in Texas",
        "Illinois expansion stalling on regulatory grounds",
      ],
      recommendedNextStep:
        "Model the business under a materially less favourable grid services regime. The entire customer proposition depends on that revenue and it is set by regulators.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What is the observed failure rate across the installed battery fleet?",
      ],
      product: [
        "What is the measured dispatch reliability of the aggregated fleet during grid events?",
      ],
      customers: [
        "What is customer churn, and how does it behave after an outage event?",
      ],
      competition: [
        "How does the offer compare with incumbent retail electricity plans on total annual cost?",
      ],
      unitEconomics: [
        "What is the fully loaded cost per installation against grid services revenue per battery per year?",
      ],
      capitalRequirements: [
        "How is battery hardware financed, and does it sit on the balance sheet?",
      ],
      regulation: [
        "What market rule changes are pending in Texas, and how would they affect the model?",
      ],
      team: [
        "Who on the team has operated inside a regulated utility or grid operator?",
      ],
      financing: [
        "What is total capital raised, and what does the factory cost?",
      ],
      commercialization: [
        "What has the Illinois entry required regulatorily, and how long did it take?",
      ],
    },
    outreach:
      "I have been researching distributed energy, and holding the retail electricity licence alongside the hardware is the part of your model that I think is under-discussed. It is what lets the grid services value reach the customer instead of being captured as hardware margin, and it is much harder to assemble than either piece alone. I would like to understand how the Illinois entry has gone regulatorily. Would you be open to a call?",
    factors: {
      technicalDifferentiation: fa(
        3,
        "judgment",
        "Medium",
        "Vertical integration of hardware, installation, and retail electricity supply rather than a novel battery technology.",
        "The differentiation is structural and regulatory rather than technical.",
      ),
      technicalEvidence: fa(
        4,
        "verified",
        "High",
        "A held retail electricity licence, a stated installed base of more than 30,000 homes, and operation across two states.",
        "The licence is externally verifiable, which is stronger evidence than a technical claim would be.",
        "base-site",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Medium",
        "Regulatory licensing plus an installed physical fleet, neither of which a competitor can acquire quickly.",
        "Genuinely difficult to replicate, particularly the regulatory half.",
      ),
      marketImportance: fa(
        4,
        "judgment",
        "Medium",
        "Grid flexibility is a real and growing need as electrification and intermittent generation increase.",
        "Important, with the value distributed across regulatory regimes that differ by state.",
      ),
      commercialReadiness: fa(
        4,
        "verified",
        "High",
        "Serving customers commercially across two states with a licensed retail operation.",
        "Fully commercial at meaningful scale.",
        "base-site",
      ),
      customerEvidence: fa(
        4,
        "verified",
        "Medium",
        "More than 30,000 homeowners served, as stated by the company.",
        "A large number, sourced only to the company itself, which is why this is four rather than five.",
        "base-site",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "High",
        "Co-founded in 2023 by Zach Dell and Justin Lopas, the latter previously a lead engineer at SpaceX.",
        "Credible operating background, with the company young enough that the record is short.",
        "base-esgtoday",
      ),
      capitalEfficiency: fa(
        1,
        "judgment",
        "Medium",
        "One billion dollars raised in a single round for a business that finances hardware at each installation.",
        "Structurally low. The model consumes capital by design.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Medium",
        "Incumbent retailers and installers exist, but few combine hardware, installation, and a retail licence.",
        "The specific combination is currently uncontested.",
      ),
      financingRisk: fa(
        3,
        "verified",
        "Medium",
        "Very large recent round against a very capital-intensive model.",
        "Well funded now, with an ongoing requirement that does not stop.",
        "base-esgtoday",
      ),
      regulatoryRisk: fa(
        1,
        "verified",
        "High",
        "The company is a licensed retail electricity provider and its revenue depends on grid services market rules.",
        "The highest regulatory exposure in the universe. The same regulation that creates the moat creates the risk.",
        "base-site",
      ),
      sourcingOriginality: fa(
        1,
        "verified",
        "High",
        "Widely covered in business and technology press.",
        "No sourcing edge available, and the model records that honestly.",
      ),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Headquarters, founders, founding year, regulatory licence, service areas, business model, and installed base are supported by the company's own site with independent corroboration of the Series C. Revenue, unit economics, and total capital raised are not disclosed.",
    sourceIds: ["base-site", "base-esgtoday"],
    lastReviewed: REVIEWED,
  },

  /* ---------------------------------------------------------- Antora Energy */
  {
    id: "antora-energy",
    name: "Antora Energy",
    website: "https://www.antora.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series C reported as a private financing, with no listing or acquisition notice.",
    headquarters: "San Jose, California, United States",
    region: "North America",
    foundedYear: NOT_DISCLOSED,
    founders: ["Andrew Ponec"],
    sector: "Energy Systems",
    subsector: "Thermal energy storage for industrial heat",
    description:
      "Stores electricity as high-temperature heat in solid carbon blocks and returns it as industrial heat or, through thermophotovoltaics, as electricity, targeting industrial processes that currently burn fuel.",
    targetCustomer:
      "Heavy industrial facilities requiring continuous high-temperature process heat.",
    businessModel:
      "Sale or long-term supply of thermal battery systems to industrial sites.",
    technicalDifferentiation:
      "Storing energy as heat in carbon avoids the critical mineral supply chains that constrain electrochemical batteries, and carbon is abundant and cheap.",
    tractionSignal:
      "Commissioned a five gigawatt-hour thermal battery project with POET in South Dakota, per the company.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "Series C of 550 million dollars co-led by G2 Venture Partners and Eclipse, funding manufacturing capacity expansion.",
    primaryCompetitors: [
      "Other thermal storage companies",
      "Industrial electrification via electric boilers",
      "Continued fossil fuel combustion",
    ],
    mainTechnicalRisk:
      "Thermophotovoltaic conversion efficiency determines whether electricity return is economic, and it is the least mature part of the system.",
    mainCommercialRisk:
      "Industrial customers replace process heat infrastructure rarely, on decade-scale capital cycles.",
    mainFinancingRisk:
      "Manufacturing capacity is funded ahead of the order book that would justify it.",
    sourcing: {
      discoveryChannel: "Government grant",
      signalDate: "2026-06-01",
      signal: "Government grant",
      dateSourced: "2026-03-11",
      channel: "Industrial decarbonisation and federal research award tracking",
      whyEntered:
        "The technology carries federal research validation through ARPA-E alongside a commissioned utility-scale project with a named industrial partner. Government technical review plus a real deployment is a stronger combination than either alone.",
      whyTimely:
        "Industrial heat is roughly a quarter of industrial energy use and has no straightforward electrification path, while intermittent renewable generation is producing periods of very low-cost electricity that thermal storage can absorb.",
      whyOverlooked:
        "Industrial heat is unglamorous and the customers are slow-moving, so the category receives far less attention than grid-scale electrochemical storage despite addressing a larger share of emissions.",
      whyNotObvious:
        "Industrial heat sits outside the categories most energy searches use, and the ARPA-E technical documentation is published separately from any funding record.",
      evidenceNeeded:
        "Performance of the commissioned project against specification through a full production year, reported by the industrial partner.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series C",
      disclosedRound: "Series C",
      latestRound:
        "550 million dollar Series C co-led by G2 Venture Partners and Eclipse, expanding US manufacturing and deployment.",
      latestRoundDate: "2026-06-01",
      latestRoundSourceId: "antora-site",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "G2 Venture Partners",
        "Eclipse",
        "Ribbit Capital",
        "Salesforce Ventures",
        "Activate Capital",
        "StepStone Group",
      ],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "High. Manufacturing capacity and project deployment both consume capital ahead of revenue.",
      financingRisk:
        "Moderate after a large round, against a long industrial sales cycle.",
      missingInformation: [
        "Revenue",
        "Founding year, which the company does not state",
        "Cost per unit of stored energy",
        "Total capital raised",
      ],
    },
    technology: {
      howItWorks:
        "Low-cost electricity heats blocks of solid carbon to very high temperature. The stored heat is delivered to industrial processes directly, or converted back to electricity using thermophotovoltaic cells that capture emitted light.",
      coreAdvantage:
        "Using carbon as the storage medium removes dependence on constrained critical minerals and allows multi-day storage at a cost electrochemical batteries cannot reach.",
      supportingEvidence: [
        {
          claim:
            "ARPA-E documented the thermal storage and thermophotovoltaic technology and its federal research support.",
          sourceId: "antora-arpae",
          basis: "verified",
          provenance: "Government-reported",
        },
        {
          claim:
            "A five gigawatt-hour thermal battery project commissioned with POET in South Dakota, per the company.",
          sourceId: "antora-site",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Carbon block supply and thermophotovoltaic cell manufacturing, the latter produced in house.",
      milestoneForScale:
        "Repeat orders from an industrial customer after a first system has operated through a full production year.",
      failurePoints: [
        "Thermophotovoltaic conversion efficiency limiting the electricity return case",
        "Industrial capital cycles delaying adoption regardless of economics",
        "Electricity price spreads narrowing and removing the arbitrage",
      ],
    },
    market: {
      painPoint:
        "Industrial process heat is generated by burning fuel, and there is no simple electrification path for high-temperature applications.",
      structure:
        "A concentrated set of heavy industrial operators with long capital cycles and strong reliability requirements.",
      adoptionDrivers: [
        "Periods of very low-cost renewable electricity creating an arbitrage",
        "Industrial decarbonisation commitments and incentives",
      ],
      competitors: [
        "Other thermal storage companies",
        "Electric boilers and industrial heat pumps",
        "Continued fossil combustion",
      ],
      substitutes: ["Natural gas combustion", "Carbon capture on existing equipment"],
      regulatoryEnvironment:
        "Industrial emissions rules and energy incentive programmes materially affect project economics.",
      maturity: "Emerging",
      currentCatalyst:
        "A commissioned utility-scale project with a named industrial partner and a large round funding manufacturing.",
    },
    commercial: {
      customerType: "Heavy industrial facility operators.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Long project-based industrial sales tied to facility capital cycles.",
      adoptionEvidence: [
        {
          claim:
            "Five gigawatt-hour project commissioned with a named industrial partner.",
          sourceId: "antora-site",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "High. Integration into an operating industrial facility requires planned downtime.",
      expansionOpportunity:
        "Additional sites within multi-facility industrial customers.",
      goToMarketRisk:
        "Industrial buyers move on decade-scale capital cycles that cannot be accelerated by sales effort.",
    },
    investment: {
      thesis:
        "A thermal storage approach that sidesteps critical mineral supply chains, with federal research validation and a commissioned utility-scale deployment, addressing a larger emissions category than grid batteries do.",
      bullCase:
        "Industrial heat electrification accelerates, the manufacturing investment lowers cost per unit, and repeat orders establish a durable industrial franchise.",
      baseCase:
        "Steady project-by-project growth constrained by industrial capital cycles.",
      bearCase:
        "Thermophotovoltaic efficiency limits the electricity case, electricity price spreads narrow, and adoption stays project-bound.",
      catalysts: [
        "A repeat order from an existing industrial customer",
        "Disclosed cost per unit of stored energy from the new manufacturing capacity",
      ],
      risks: [
        "Thermophotovoltaic conversion efficiency",
        "Long industrial capital cycles",
        "Dependence on electricity price spreads",
      ],
      invalidators: [
        "No repeat order after a first system completes a full production year",
        "Electricity price spreads compressing durably",
      ],
      recommendedNextStep:
        "Ask the industrial partner, not the company, how the commissioned system has performed against its specification through a full production year.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What is the measured thermophotovoltaic conversion efficiency in the deployed system?",
      ],
      product: [
        "What is the round-trip efficiency for heat delivery against electricity return?",
      ],
      customers: [
        "How has the commissioned project performed against specification?",
      ],
      competition: [
        "How does delivered cost per unit of heat compare with natural gas at current prices?",
      ],
      unitEconomics: [
        "What electricity price spread is required for the economics to work?",
      ],
      capitalRequirements: [
        "What does the manufacturing expansion cost, and what order book supports it?",
      ],
      regulation: [
        "Which incentive programmes underpin current project economics, and when do they expire?",
      ],
      team: [
        "Who founded the company alongside the chief executive, and what is the founding year?",
      ],
      financing: [
        "What is total capital raised across all rounds?",
      ],
      commercialization: [
        "What is the typical time from first industrial contact to commissioned system?",
      ],
    },
    outreach:
      "I have been researching industrial heat, which seems to me the part of decarbonisation with the least obvious answer, and storing energy in carbon rather than in critical minerals is a genuinely different approach to the cost problem. I would like to understand how the commissioned project has performed against specification, and where thermophotovoltaic efficiency currently sits. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(
        5,
        "verified",
        "High",
        "High-temperature thermal storage in solid carbon with thermophotovoltaic conversion, avoiding critical mineral supply chains.",
        "A genuinely distinct approach to a problem most companies address electrochemically.",
        "antora-arpae",
      ),
      technicalEvidence: fa(
        5,
        "verified",
        "High",
        "ARPA-E documentation of the technology plus a commissioned five gigawatt-hour project with a named industrial partner.",
        "Federal technical review combined with a real deployment is about as strong as pre-scale evidence gets.",
        "antora-arpae",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Medium",
        "Manufacturing process knowledge and thermophotovoltaic cell production, in a category with several competitors.",
        "Moderate. Thermal storage concepts are not exclusive; executing them economically is the barrier.",
      ),
      marketImportance: fa(
        5,
        "verified",
        "High",
        "Industrial process heat is a large emissions category with no straightforward electrification route.",
        "Addresses a bigger share of emissions than grid storage, with far less attention.",
      ),
      commercialReadiness: fa(
        3,
        "verified",
        "High",
        "A commissioned utility-scale project with an industrial partner and manufacturing capacity being built.",
        "Real deployment, early in the commercial curve.",
        "antora-site",
      ),
      customerEvidence: fa(
        3,
        "verified",
        "Medium",
        "One named industrial partner with a commissioned project.",
        "A real customer, and a single one.",
        "antora-site",
      ),
      teamCredibility: fa(
        3,
        "judgment",
        "Low",
        "Andrew Ponec is chief executive and co-founder. Other founders and the founding year are not stated by the company.",
        "Rated on incomplete public information rather than on any negative finding.",
      ),
      capitalEfficiency: fa(
        2,
        "judgment",
        "Low",
        "A 550 million dollar round with total raised not disclosed and no revenue disclosed.",
        "Characteristic of heavy industry, and not fully assessable.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Medium",
        "Several thermal storage companies exist, alongside simpler electrification approaches.",
        "Moderate, in a category that is growing rather than consolidating.",
      ),
      financingRisk: fa(
        3,
        "verified",
        "Medium",
        "Large recent round funding manufacturing ahead of the order book.",
        "Comfortable now, with capacity investment preceding demand.",
        "antora-site",
      ),
      regulatoryRisk: fa(
        3,
        "judgment",
        "Medium",
        "Industrial emissions rules and incentive programmes materially affect project economics.",
        "Policy dependent in both directions.",
      ),
      sourcingOriginality: fa(
        5,
        "judgment",
        "High",
        "Industrial heat receives a small fraction of the attention given to grid-scale electrochemical storage despite covering a larger emissions category.",
        "Among the most under-examined positions in the universe.",
      ),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Technology, headquarters, chief executive, the commissioned project, and the Series C are supported by the company's own site with independent federal documentation of the technology. Founding year, other founders, revenue, and total capital raised are not disclosed.",
    sourceIds: ["antora-site", "antora-arpae"],
    lastReviewed: REVIEWED,
  },

  /* ------------------------------------------------------ Radiant Industries */
  {
    id: "radiant-industries",
    name: "Radiant Industries",
    website: "https://www.radiantnuclear.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series C and the subsequent round were reported as private financings, with no listing or acquisition notice.",
    headquarters: "El Segundo, California, United States",
    region: "North America",
    foundedYear: 2020,
    founders: ["Doug Bernauer"],
    sector: "Energy Systems",
    subsector: "Portable nuclear microreactors",
    description:
      "Develops Kaleidos, a one megawatt portable nuclear microreactor designed to replace diesel generators, with a fuelled test scheduled at a US Department of Energy facility.",
    targetCustomer:
      "Defence installations, remote industrial sites, disaster response, and data centres requiring off-grid power.",
    businessModel: NOT_DISCLOSED,
    technicalDifferentiation:
      "Designing for factory mass production and transportability rather than for site construction, which inverts the economics of conventional nuclear.",
    tractionSignal:
      "Scheduled to conduct a fuelled prototype test at the Idaho National Laboratory DOME facility, which is a US Department of Energy demonstration site.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "Raised more than 300 million dollars in December 2025, following a 165 million dollar Series C closed in May 2025.",
    primaryCompetitors: [
      "Other microreactor developers",
      "Diesel generators",
      "Small modular reactor developers",
    ],
    mainTechnicalRisk:
      "No microreactor of this design has operated with fuel. The scheduled test is the first real demonstration.",
    mainCommercialRisk:
      "Nuclear licensing timelines are long and largely outside the company's control.",
    mainFinancingRisk:
      "Capital must be committed for years ahead of any licensed commercial deployment.",
    sourcing: {
      discoveryChannel: "Regulatory milestone",
      signalDate: "2025-12-17",
      signal: "Regulatory milestone",
      dateSourced: "2026-01-08",
      channel: "National laboratory demonstration programme tracking",
      whyEntered:
        "Securing a slot for a fuelled test at a Department of Energy demonstration facility is an externally administered gate that very few reactor developers pass. It is a far stronger signal than a design announcement.",
      whyTimely:
        "Data centre power demand and defence interest in resilient off-grid power have converged, and the federal government has created demonstration pathways that did not previously exist.",
      whyOverlooked:
        "Nuclear has a long commercialisation cycle and a history of disappointing investors, which suppresses venture attention relative to the scale of the potential market.",
      whyNotObvious:
        "Funding searches return the rounds. The DOME test assignment is published through Department of Energy channels and is the stronger signal, because it is administered by someone other than the company.",
      evidenceNeeded:
        "The pass criteria for the fuelled test, and a realistic licensing timeline including a first rejection.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series C",
      disclosedRound: "Series C",
      latestRound:
        "More than 300 million dollars raised in December 2025, following a 165 million dollar Series C closed 28 May 2025 that brought total venture funding to 225 million dollars.",
      latestRoundDate: "2025-12-17",
      latestRoundSourceId: "radiant-seriesd",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "DCVC",
        "StepStone",
        "Giant Ventures",
        "ARK Venture Fund",
        "Gigascale Capital",
        "Draper Associates",
        "Boost VC",
      ],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "Very high. Licensing, fuel, and factory construction all precede revenue by years.",
      financingRisk:
        "High. The company must fund a multi-year licensing path before any commercial deployment.",
      missingInformation: [
        "Revenue",
        "Business model and pricing",
        "Total capital raised across all rounds",
        "Licensing timeline for commercial deployment",
      ],
    },
    technology: {
      howItWorks:
        "A one megawatt reactor is built as a transportable unit intended for factory production, delivered to a site and operated as a replacement for diesel generation.",
      coreAdvantage:
        "Manufacturing rather than construction. If reactors can be produced in a factory, the cost curve behaves like manufacturing rather than like civil engineering.",
      supportingEvidence: [
        {
          claim:
            "A fuelled prototype test is scheduled at the Idaho National Laboratory DOME facility.",
          sourceId: "radiant-wna",
          basis: "verified",
          provenance: "Independently verified",
        },
        {
          claim:
            "Series C of 165 million dollars closed May 2025 bringing total venture funding to 225 million dollars, followed by more than 300 million dollars in December 2025.",
          sourceId: "radiant-newswire",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "High-assay low-enriched uranium fuel supply and Nuclear Regulatory Commission licensing.",
      milestoneForScale:
        "A successful fuelled test, followed by a licensing pathway to commercial operation.",
      failurePoints: [
        "The fuelled test not performing to specification",
        "Fuel supply availability, which is currently constrained",
        "Licensing timelines extending beyond the funding horizon",
      ],
    },
    market: {
      painPoint:
        "Remote and resilient power is supplied by diesel generators, which are expensive to fuel, logistically demanding, and emitting.",
      structure:
        "Defence, industrial, and data centre buyers, with the regulator as the decisive gatekeeper.",
      adoptionDrivers: [
        "Data centre power demand exceeding grid availability",
        "Defence interest in resilient off-grid power",
      ],
      competitors: [
        "Other microreactor developers",
        "Diesel generators",
        "Small modular reactor developers",
      ],
      substitutes: ["Diesel generation", "Grid interconnection where available"],
      regulatoryEnvironment:
        "Directly and heavily regulated. Nuclear licensing governs whether commercial deployment is possible at all.",
      maturity: "Emerging",
      currentCatalyst:
        "The scheduled fuelled test at a Department of Energy facility.",
    },
    commercial: {
      customerType: "Defence, remote industrial, and data centre operators.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: NOT_DISCLOSED,
      adoptionEvidence: [
        {
          claim:
            "Selection for a fuelled test at a Department of Energy demonstration facility.",
          sourceId: "radiant-wna",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      implementationBurden:
        "Extremely high. Siting a reactor requires licensing, security, and community processes.",
      expansionOpportunity:
        "Entirely contingent on licensing, which has not been achieved.",
      goToMarketRisk:
        "There is no commercial market until a licence exists.",
    },
    investment: {
      thesis:
        "A manufacturing-first approach to nuclear power that has passed an externally administered gate few developers reach, with an unlicensed and unproven product and a very long path to revenue.",
      bullCase:
        "The fuelled test succeeds, licensing proceeds, and factory-produced microreactors displace diesel in remote and resilient power applications.",
      baseCase:
        "Technical progress continues with licensing taking longer than planned and further financing required.",
      bearCase:
        "The test underperforms, or licensing timelines extend beyond the funding horizon, and the capital cannot be recovered.",
      catalysts: [
        "Results from the fuelled test",
        "Any licensing milestone with the Nuclear Regulatory Commission",
      ],
      risks: [
        "An unproven reactor design",
        "Constrained fuel supply",
        "Licensing timelines outside the company's control",
      ],
      invalidators: [
        "The fuelled test failing or being cancelled",
        "Fuel supply proving unavailable at the required enrichment",
      ],
      recommendedNextStep:
        "Establish the licensing pathway and its realistic timeline including a first rejection. The technology test is necessary and nowhere near sufficient.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What are the pass criteria for the fuelled test, and what happens if they are partially met?",
      ],
      product: [
        "What is the design life of a unit, and how is refuelling handled?",
      ],
      customers: [
        "Which prospective customers have signed anything beyond a letter of interest?",
      ],
      competition: [
        "How does the design compare with other microreactor developers on licensing readiness?",
      ],
      unitEconomics: [
        "What is the target cost per unit at volume, and against what diesel price?",
      ],
      capitalRequirements: [
        "What capital is required to reach a commercial licence?",
      ],
      regulation: [
        "What is the specific licensing pathway, and who on the team has walked one?",
      ],
      team: [
        "How much of the team has nuclear licensing experience as opposed to aerospace engineering experience?",
      ],
      financing: [
        "What is total capital raised, and what is the runway to the licensing milestone?",
      ],
      commercialization: [
        "What is the business model, given none is publicly stated?",
      ],
    },
    outreach:
      "I have been researching companies working on resilient off-grid power, and designing a reactor for factory production rather than site construction is the choice that makes the cost argument work if it holds. The DOME test slot is what made me want to reach out, because it is an externally administered gate rather than a company milestone. I would like to understand the pass criteria for that test and how you are thinking about the licensing path afterwards. Would you be open to a call?",
    factors: {
      technicalDifferentiation: fa(
        5,
        "judgment",
        "Medium",
        "A transportable one megawatt reactor designed for factory mass production.",
        "A genuinely different approach to nuclear economics.",
      ),
      technicalEvidence: fa(
        3,
        "verified",
        "High",
        "Selected for a fuelled prototype test at a Department of Energy demonstration facility, independently reported.",
        "The selection is strong external validation. The reactor has not yet operated with fuel, which caps this rating.",
        "radiant-wna",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Medium",
        "Nuclear licensing, once achieved, is an extremely high barrier to entry.",
        "Potentially very strong, and entirely prospective until a licence exists.",
      ),
      marketImportance: fa(
        4,
        "judgment",
        "Medium",
        "Remote and resilient power is a real need, made larger by data centre demand exceeding grid availability.",
        "Important, with the addressable size dependent on licensing outcomes.",
      ),
      commercialReadiness: fa(
        1,
        "verified",
        "High",
        "No licensed product, no commercial deployment, and no stated business model.",
        "Pre-commercial, stated plainly.",
      ),
      customerEvidence: fa(
        1,
        "judgment",
        "Medium",
        "No disclosed customer contracts or commitments.",
        "There is essentially nothing to assess.",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "Medium",
        "Founded in 2020 by Doug Bernauer, previously an engineer at SpaceX, with the company based in El Segundo.",
        "Strong engineering pedigree, with the nuclear licensing experience of the team not publicly established.",
        "radiant-seriesc",
      ),
      capitalEfficiency: fa(
        2,
        "judgment",
        "Medium",
        "More than 500 million dollars disclosed across recent rounds with no revenue and no licence.",
        "Low as measured, and inherent to nuclear development.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Medium",
        "Several microreactor developers exist, few with a fuelled test slot secured.",
        "The DOME selection is a meaningful competitive separation.",
      ),
      financingRisk: fa(
        2,
        "verified",
        "Medium",
        "Well funded currently, against a licensing path measured in years before revenue.",
        "The gap between funding horizon and licensing horizon is the central risk.",
        "radiant-seriesd",
      ),
      regulatoryRisk: fa(
        1,
        "verified",
        "High",
        "Nuclear licensing determines whether the product can be sold at all.",
        "The highest regulatory dependency in the universe.",
      ),
      sourcingOriginality: fa(
        4,
        "judgment",
        "Medium",
        "Nuclear attracts less venture attention than its potential market size would suggest, because of its history.",
        "Under-examined relative to the opportunity, with good reason historically.",
      ),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Founder, founding year, headquarters, financing, product, and the Department of Energy test scheduling are supported by the company's own announcements with independent nuclear trade press corroboration. Business model, pricing, revenue, and licensing timeline are not disclosed.",
    sourceIds: ["radiant-seriesc", "radiant-seriesd", "radiant-wna"],
    lastReviewed: REVIEWED,
  },

  /* -------------------------------------------------------------- K2 Space */
  {
    id: "k2-space",
    name: "K2 Space",
    website: "https://www.k2space.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series C announced December 2025 as a private financing, with no listing or acquisition notice.",
    headquarters: "Torrance, California, United States",
    region: "North America",
    foundedYear: NOT_DISCLOSED,
    founders: ["Karan Kunjur", "Neel Kunjur"],
    sector: "Space & Aerospace",
    subsector: "High-power satellite manufacturing",
    description:
      "Builds a class of satellite designed for much higher power and payload capability than conventional smallsats, manufactured in volume at its own Torrance factory.",
    targetCustomer:
      "National security agencies and commercial communications operators.",
    businessModel: "Satellite manufacturing and sale to government and commercial customers.",
    technicalDifferentiation:
      "Designing for high power at low cost per watt, which changes what a single satellite can do and reduces the number required for a given mission.",
    tractionSignal:
      "The company states 500 million dollars in signed contracts from commercial and US government customers.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2025-02-11",
    recentCatalyst:
      "Series C of 250 million dollars led by Redpoint at a stated 3 billion dollar valuation, announced December 2025, with the first production satellite planned for launch in March 2026.",
    primaryCompetitors: [
      "Established satellite primes",
      "Smallsat constellation manufacturers",
    ],
    mainTechnicalRisk:
      "No production satellite of this class has flown. The first launch is the test of the entire design premise.",
    mainCommercialRisk:
      "Contracted backlog is stated by the company and depends on successful flight demonstration.",
    mainFinancingRisk:
      "Factory capacity is being built ahead of demonstrated flight heritage.",
    sourcing: {
      discoveryChannel: "Product launch",
      signalDate: "2025-12-12",
      signal: "Manufacturing milestone",
      dateSourced: "2026-02-18",
      channel: "Space manufacturing capacity scan",
      whyEntered:
        "The company is building factory capacity for up to one hundred high-power satellites a year while stating a contracted backlog, which is an unusual sequencing. Committing manufacturing capital before flight heritage is either conviction backed by customer commitments or a serious overreach, and the first launch resolves which.",
      whyTimely:
        "National security demand for resilient space capability has risen sharply, and high-power satellites enable missions that constellations of small satellites cannot perform.",
      whyOverlooked:
        "Space manufacturing outside launch attracts relatively little attention, and the company is less covered than launch providers despite comparable capital raised.",
      whyNotObvious:
        "Space searches are dominated by launch companies, and satellite manufacturing is filed underneath them despite comparable capital intensity.",
      evidenceNeeded:
        "Confirmation that the first production satellite has flown and how it performed on orbit.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series C",
      disclosedRound: "Series C",
      latestRound:
        "250 million dollar Series C led by Redpoint at a stated 3 billion dollar valuation.",
      latestRoundDate: "2025-12-12",
      latestRoundSourceId: "k2-prnewswire",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "Redpoint",
        "Alpine Space Ventures",
        "Altimeter Capital",
        "Lightspeed",
        "T. Rowe Price Associates",
        "Hedosophia",
      ],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "High. Factory capacity and satellite production consume capital ahead of delivery revenue.",
      financingRisk:
        "Moderate after a large round, with a valuation set before flight demonstration.",
      missingInformation: [
        "Revenue",
        "Founding year",
        "Customer names behind the contracted backlog",
        "Total capital raised",
      ],
    },
    technology: {
      howItWorks:
        "The satellite is designed around a much larger power budget than conventional smallsats, enabling higher-capability payloads on a single spacecraft, and is built for volume manufacture rather than bespoke assembly.",
      coreAdvantage:
        "Power per unit cost. More power on one spacecraft reduces the number of spacecraft a mission requires, which changes total mission economics.",
      supportingEvidence: [
        {
          claim:
            "500 million dollars in signed contracts from commercial and US government customers, and a Torrance factory scaling to up to one hundred satellites per year.",
          sourceId: "k2-prnewswire",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Series C financing and the Mega Class satellite programme independently reported by space trade press.",
          sourceId: "k2-payload",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Launch vehicle availability and aerospace component supply chains.",
      milestoneForScale:
        "Successful operation of the first production satellite on orbit, which establishes flight heritage.",
      failurePoints: [
        "First flight failure, which would delay the entire programme",
        "Factory capacity built ahead of a backlog that does not convert",
        "Launch availability constraining deployment",
      ],
    },
    market: {
      painPoint:
        "Missions requiring high power on orbit are served by expensive bespoke spacecraft or not at all.",
      structure:
        "Government and large commercial buyers with long procurement cycles and stringent reliability requirements.",
      adoptionDrivers: [
        "National security demand for resilient space capability",
        "Missions requiring more power than smallsats provide",
      ],
      competitors: ["Established satellite primes", "Smallsat manufacturers"],
      substitutes: [
        "Large constellations of smaller satellites",
        "Conventional bespoke large satellites",
      ],
      regulatoryEnvironment:
        "Spectrum licensing, export control, and government security requirements apply.",
      maturity: "Emerging",
      currentCatalyst:
        "The first production satellite launch, which converts a design claim into flight heritage.",
    },
    commercial: {
      customerType: "National security agencies and commercial operators.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: "Government and large commercial procurement.",
      adoptionEvidence: [
        {
          claim:
            "500 million dollars in signed contracts stated at the time of the Series C.",
          sourceId: "k2-prnewswire",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "The customer integrates a payload and commits to a launch, which is a multi-year process.",
      expansionOpportunity:
        "Repeat orders once flight heritage is established.",
      goToMarketRisk:
        "Backlog stated by the company with no customer named and no flight heritage behind it.",
    },
    investment: {
      thesis:
        "A manufacturing-led approach to high-power satellites with a stated contracted backlog and factory capacity under construction, where the entire premise rests on a first flight that has not yet been demonstrated publicly.",
      bullCase:
        "The first satellite performs, flight heritage unlocks the backlog, and factory capacity turns satellite manufacturing into a volume business.",
      baseCase:
        "Flight succeeds and delivery ramps more slowly than the factory plan assumes.",
      bearCase:
        "First flight failure or delay, with factory capital committed against a backlog that cannot convert.",
      catalysts: [
        "First production satellite launch and on-orbit operation",
        "Disclosure of customers behind the contracted backlog",
      ],
      risks: [
        "No flight heritage",
        "Backlog stated only by the company",
        "Capital committed to factory capacity ahead of demonstration",
      ],
      invalidators: [
        "First flight failure",
        "Backlog not converting within twelve months of successful flight",
      ],
      recommendedNextStep:
        "Establish whether the first production satellite has flown and how it performed. Everything else in this record is contingent on that single event.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What power level does the production satellite deliver, and how was it validated before flight?",
      ],
      product: [
        "What is the manufacturing cycle time per satellite at current capacity?",
      ],
      customers: [
        "Which customers make up the stated contracted backlog, and what are the delivery milestones?",
      ],
      competition: [
        "How does cost per watt on orbit compare with established primes?",
      ],
      unitEconomics: [
        "What is the cost to build one satellite against its contracted price?",
      ],
      capitalRequirements: [
        "What does the factory cost to reach the stated annual capacity?",
      ],
      regulation: [
        "What export control and security requirements apply to the government contracts?",
      ],
      team: [
        "What is the founding year, and who has taken a spacecraft programme to flight before?",
      ],
      financing: [
        "What is total capital raised, and what is the runway past first flight?",
      ],
      commercialization: [
        "How does the backlog convert to revenue, and on what schedule?",
      ],
    },
    outreach:
      "I have been researching space manufacturing, and building factory capacity for high-power satellites before flight heritage is the decision I keep thinking about. It only makes sense if the customer commitments are real and specific. I would like to understand how the first production satellite performed and what the backlog conversion schedule looks like. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(
        4,
        "verified",
        "Medium",
        "A satellite class designed around a substantially larger power budget, built for volume manufacture.",
        "A real architectural difference, unproven on orbit.",
        "k2-prnewswire",
      ),
      technicalEvidence: fa(
        2,
        "judgment",
        "Medium",
        "Factory under construction and a stated backlog. No flight heritage and no published performance data.",
        "The design premise has not been demonstrated in the environment it is built for.",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Medium",
        "Manufacturing capability and government relationships, once established.",
        "Prospective. Satellite primes have deep incumbent advantages.",
      ),
      marketImportance: fa(
        4,
        "judgment",
        "Medium",
        "National security demand for resilient space capability is real and growing.",
        "Important, and heavily dependent on government budget cycles.",
      ),
      commercialReadiness: fa(
        2,
        "verified",
        "Medium",
        "Factory scaling with a first production launch planned. No delivered operational satellite disclosed.",
        "Pre-delivery.",
        "k2-prnewswire",
      ),
      customerEvidence: fa(
        3,
        "verified",
        "Low",
        "500 million dollars in signed contracts stated by the company, with no customer named.",
        "A large figure from a single interested source, which is why this is discounted.",
        "k2-prnewswire",
      ),
      teamCredibility: fa(
        3,
        "verified",
        "Low",
        "Led by co-founders Karan and Neel Kunjur as chief executive and chief technology officer. Founding year and prior track record are not established from primary sources.",
        "Rated on limited public information about the team's prior record.",
        "k2-prnewswire",
      ),
      capitalEfficiency: fa(
        2,
        "judgment",
        "Low",
        "A 250 million dollar round with factory capital committed before flight heritage.",
        "Aggressive sequencing, which is the defining characteristic of this position.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Medium",
        "Established primes are slow and expensive; smallsat manufacturers serve a different mission class.",
        "The specific niche is relatively uncontested.",
      ),
      financingRisk: fa(
        3,
        "verified",
        "Medium",
        "Large recent round at a stated 3 billion dollar valuation set before flight demonstration.",
        "Well funded, with the valuation reference point ahead of the evidence.",
        "k2-prnewswire",
      ),
      regulatoryRisk: fa(
        3,
        "judgment",
        "Medium",
        "Export control, spectrum, and government security requirements apply.",
        "Standard for the sector and manageable.",
      ),
      sourcingOriginality: fa(
        4,
        "judgment",
        "Medium",
        "Satellite manufacturing receives far less attention than launch despite comparable capital intensity.",
        "Under-examined relative to launch companies.",
      ),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Headquarters, leadership, financing, factory plans, and contracted backlog are supported by the company's own announcement with independent space trade press corroboration. Founding year, customer names, revenue, and total capital raised are not disclosed.",
    sourceIds: ["k2-prnewswire", "k2-payload"],
    lastReviewed: REVIEWED,
  },

  /* ----------------------------------------------------------- Stoke Space */
  {
    id: "stoke-space",
    name: "Stoke Space",
    website: "https://www.stokespace.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series D and its extension were announced as private financings, with no listing or acquisition notice.",
    headquarters: "Kent, Washington, United States",
    region: "North America",
    foundedYear: NOT_DISCLOSED,
    founders: ["Andy Lapsa"],
    sector: "Space & Aerospace",
    subsector: "Fully reusable launch vehicles",
    description:
      "Develops Nova, a launch vehicle designed for full reusability including the upper stage, which is the part of the vehicle no operational rocket currently recovers.",
    targetCustomer:
      "Commercial satellite operators and US government launch customers.",
    businessModel: NOT_DISCLOSED,
    technicalDifferentiation:
      "Upper stage reuse, attempted through an actively cooled heat shield and a novel engine configuration, which is the unsolved half of launch reusability.",
    tractionSignal:
      "Refurbishing Launch Complex 14 at Cape Canaveral Space Force Station, with activation scheduled for early 2026.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "Series D of 510 million dollars announced October 2025, extended to 860 million dollars in February 2026, more than doubling total capital raised.",
    primaryCompetitors: [
      "SpaceX",
      "Rocket Lab",
      "Blue Origin",
      "Other small and medium launch developers",
    ],
    mainTechnicalRisk:
      "Upper stage reuse has never been achieved operationally. The heat shield and engine architecture are unproven in flight.",
    mainCommercialRisk:
      "No orbital flight has occurred, so there is no demonstrated service to sell.",
    mainFinancingRisk:
      "Launch development consumes very large capital over many years before first revenue.",
    sourcing: {
      discoveryChannel: "Regulatory milestone",
      signalDate: "2026-02-10",
      signal: "New facility",
      dateSourced: "2026-03-02",
      channel: "Launch infrastructure and range activity tracking",
      whyEntered:
        "Securing and refurbishing a launch complex at Cape Canaveral is a commitment that is difficult to obtain and expensive to reverse. Range assignments are allocated by parties other than the company, which makes them a useful external signal of programme seriousness.",
      whyTimely:
        "Launch demand continues to exceed supply, and full reusability including the upper stage is the remaining structural cost reduction available in launch.",
      whyOverlooked:
        "Overshadowed by far larger launch providers, and located outside the traditional aerospace hubs, which reduces visibility relative to capital raised.",
      whyNotObvious:
        "Overshadowed by far larger launch providers in every search. The launch complex assignment is a range allocation record rather than a funding record.",
      evidenceNeeded:
        "The current first flight schedule and what has slipped against the original plan.",
      wellRecognised: false,
    },
    financing: {
      stage: "Later stage",
      disclosedRound: "Series D",
      latestRound:
        "Series D of 510 million dollars announced 8 October 2025 led by US Innovative Technology Fund, extended to 860 million dollars in February 2026.",
      latestRoundDate: "2026-02-10",
      latestRoundSourceId: "stoke-extension",
      totalDisclosedFunding:
        "More than 990 million dollars as of the original Series D announcement, before the extension",
      namedInvestors: [
        "US Innovative Technology Fund",
        "Breakthrough Energy",
        "Toyota Ventures",
        "NFX",
        "Woven Capital",
        "Glade Brook Capital",
      ],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "Very high. Launch development requires sustained capital through first flight and beyond.",
      financingRisk:
        "Moderate after a very large round explicitly sized to reach first flights.",
      missingInformation: [
        "Revenue",
        "Founding year",
        "Business model and launch pricing",
        "First orbital flight date",
      ],
    },
    technology: {
      howItWorks:
        "Both stages are designed to return and fly again. The upper stage uses an actively cooled heat shield integrated with the engine configuration, addressing the reentry heating that has prevented upper stage recovery.",
      coreAdvantage:
        "If upper stage reuse works, the marginal cost of a launch falls further than partial reusability allows, because the upper stage is the most expensive discarded component.",
      supportingEvidence: [
        {
          claim:
            "Series D of 510 million dollars raised to complete development and demonstrate Nova through first flights, with Launch Complex 14 refurbishment underway.",
          sourceId: "stoke-announcement",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Independent space trade press corroborated the financing, the debt facility, total capital raised, the Kent, Washington base, and the Nova programme.",
          sourceId: "stoke-spacenews",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Range access, regulatory launch licensing, and aerospace supply chains.",
      milestoneForScale:
        "First orbital flight, followed by recovery and reflight of both stages.",
      failurePoints: [
        "Upper stage reentry and recovery, which no operator has achieved",
        "First flight failure delaying the programme by years",
        "Launch licensing and range scheduling",
      ],
    },
    market: {
      painPoint:
        "Launch cost remains the constraint on what can be done in space, and partial reusability leaves the most expensive stage expendable.",
      structure:
        "A small number of launch providers, with one dominant incumbent and government demand for assured access.",
      adoptionDrivers: [
        "Launch demand exceeding available supply",
        "Government interest in multiple assured launch providers",
      ],
      competitors: ["SpaceX", "Rocket Lab", "Blue Origin"],
      substitutes: ["Existing expendable and partially reusable vehicles"],
      regulatoryEnvironment:
        "Launch licensing and range access are federally regulated and allocated.",
      maturity: "Emerging",
      currentCatalyst:
        "Launch Complex 14 activation and progress toward first flight.",
    },
    commercial: {
      customerType: "Commercial satellite operators and government customers.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: NOT_DISCLOSED,
      adoptionEvidence: [
        {
          claim:
            "Launch Complex 14 refurbishment at Cape Canaveral, scheduled for activation in early 2026.",
          sourceId: "stoke-announcement",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Not applicable until a launch service exists.",
      expansionOpportunity:
        "Contingent entirely on demonstrating flight and reuse.",
      goToMarketRisk:
        "There is no service to sell until the vehicle flies.",
    },
    investment: {
      thesis:
        "An attempt at the unsolved half of launch reusability, funded to reach first flights, competing against an incumbent with overwhelming scale advantages.",
      bullCase:
        "Full reusability works, marginal launch cost falls below what partial reusability allows, and a genuine second source emerges in a supply-constrained market.",
      baseCase:
        "Nova reaches orbit later than planned, reuse takes several more years, and the company becomes a credible secondary provider.",
      bearCase:
        "First flight fails or upper stage recovery proves impractical, and the capital raised cannot be recovered.",
      catalysts: [
        "Launch Complex 14 activation",
        "First orbital flight attempt",
      ],
      risks: [
        "Upper stage reuse is unproven by anyone",
        "Competing against an incumbent with enormous scale",
        "Very long capital cycle before revenue",
      ],
      invalidators: [
        "First flight failure with a multi-year recovery timeline",
        "Upper stage recovery proving thermally impractical",
      ],
      recommendedNextStep:
        "Establish the current first flight schedule and what has slipped against the original plan. Schedule adherence is the most informative available signal in launch development.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What ground testing has the actively cooled heat shield undergone, and at what conditions?",
      ],
      product: [
        "What is the target payload capacity and reflight turnaround?",
      ],
      customers: [
        "What launch contracts are signed, and are they contingent on first flight success?",
      ],
      competition: [
        "What marginal launch cost does full reusability target relative to current providers?",
      ],
      unitEconomics: [
        "What is the cost per launch assuming reuse works, and assuming it does not?",
      ],
      capitalRequirements: [
        "What capital is required from now to routine reflight?",
      ],
      regulation: [
        "What launch licences are in place, and what remains outstanding?",
      ],
      team: [
        "What is the founding year, and who on the team has taken a launch vehicle to orbit?",
      ],
      financing: [
        "What is total capital raised including the extension, and what is the runway past first flight?",
      ],
      commercialization: [
        "What is the launch pricing model, given none is publicly stated?",
      ],
    },
    outreach:
      "I have been researching launch, and full reusability including the upper stage is the part of the problem nobody has solved operationally, which is what makes your approach worth understanding rather than another vehicle programme. The Launch Complex 14 work suggests the schedule is real. I would like to understand what ground testing the heat shield has been through and how first flight is tracking. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(
        5,
        "verified",
        "Medium",
        "Full reusability including the upper stage, using an actively cooled heat shield.",
        "Attempting the specific problem that no operational launch provider has solved.",
        "stoke-announcement",
      ),
      technicalEvidence: fa(
        2,
        "judgment",
        "Medium",
        "Launch complex refurbishment and a large financing raised to reach first flights. No orbital flight has occurred.",
        "Infrastructure commitment is real evidence of seriousness, not of technical success.",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Medium",
        "Range access and, prospectively, reuse technology.",
        "Entirely prospective until the vehicle flies.",
      ),
      marketImportance: fa(
        4,
        "judgment",
        "Medium",
        "Launch cost remains the constraint on space activity, and demand exceeds supply.",
        "Important, in a market defined by one dominant provider.",
      ),
      commercialReadiness: fa(
        1,
        "verified",
        "High",
        "No orbital flight and no launch service in operation.",
        "Pre-revenue development stage.",
      ),
      customerEvidence: fa(
        1,
        "judgment",
        "Medium",
        "No launch contracts disclosed publicly.",
        "Nothing to assess on the commercial side.",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "Medium",
        "Co-founded and led by Andy Lapsa, with the company raising nearly a billion dollars from institutional investors.",
        "Credible, with the founding year and full team record not established publicly.",
        "stoke-announcement",
      ),
      capitalEfficiency: fa(
        1,
        "verified",
        "High",
        "Approaching a billion dollars raised before first orbital flight.",
        "Structurally low, as launch development requires.",
        "stoke-announcement",
      ),
      competitiveIntensity: fa(
        1,
        "judgment",
        "High",
        "Competing against a dominant incumbent with enormous flight cadence and cost advantages.",
        "One of the most adverse competitive positions available.",
      ),
      financingRisk: fa(
        3,
        "verified",
        "High",
        "Series D extended to 860 million dollars, explicitly sized to reach first flights.",
        "Well funded for the stated milestone, with everything beyond it requiring more.",
        "stoke-extension",
      ),
      regulatoryRisk: fa(
        3,
        "judgment",
        "Medium",
        "Launch licensing and range access are federally controlled and allocated.",
        "Standard for the sector, with range access already secured.",
      ),
      sourcingOriginality: fa(
        3,
        "judgment",
        "Medium",
        "Covered by space trade press but overshadowed by much larger launch providers.",
        "Moderately under-examined relative to capital raised.",
      ),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Headquarters, leadership, financing and its extension, and the launch complex refurbishment are supported by the company's own announcements with independent business press corroboration. Founding year, business model, launch pricing, and first flight date are not disclosed.",
    sourceIds: ["stoke-announcement", "stoke-extension", "stoke-spacenews"],
    lastReviewed: REVIEWED,
  },

  /* ------------------------------------------------------------ Cradle Bio */
  {
    id: "cradle-bio",
    name: "Cradle",
    website: "https://www.cradle.bio",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series B announced November 2024 as a private financing, with no listing or acquisition notice.",
    headquarters: "Amsterdam, Netherlands, with operations in Zurich",
    region: "Europe",
    foundedYear: NOT_DISCLOSED,
    founders: ["Stef van Grieken"],
    sector: "Biotechnology & Research Tools",
    subsector: "AI-guided protein engineering software",
    description:
      "Provides software that designs proteins for industrial and therapeutic applications, combining machine learning models with its own wet lab data generation to improve designs iteratively.",
    targetCustomer:
      "Protein engineering teams at pharmaceutical, industrial biotechnology, and food ingredient companies.",
    businessModel:
      "Software subscription sold to research teams, positioned to put protein engineering capability into laboratories that lack specialist computational staff.",
    technicalDifferentiation:
      "Coupling model predictions to its own wet lab data generation, so that the models improve on the specific protein families customers care about rather than only on public data.",
    tractionSignal:
      "The company names Novo Nordisk, Johnson & Johnson Innovative Medicine, Grifols, and Novozymes as users of its technology.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2025-11-19",
    recentCatalyst:
      "Series B of 73 million dollars led by IVP in November 2024, bringing total funding to more than 100 million dollars.",
    primaryCompetitors: [
      "In-house computational protein design groups",
      "Open source protein design models",
      "Other AI protein engineering companies",
    ],
    mainTechnicalRisk:
      "Open source protein models are improving quickly, which compresses the advantage of a proprietary model unless the wet lab data loop is decisive.",
    mainCommercialRisk:
      "Large pharmaceutical customers can build equivalent internal capability, and several have.",
    mainFinancingRisk:
      "Wet lab capacity is capital consuming alongside software development.",
    sourcing: {
      discoveryChannel: "Customer signal",
      signalDate: "2024-11-26",
      signal: "Customer announcement",
      dateSourced: "2026-04-08",
      channel: "Life sciences tooling adoption scan",
      whyEntered:
        "Four named enterprise customers across pharmaceutical, plasma, and industrial enzyme companies is unusually concrete disclosure for a protein design company, most of which describe capability rather than adoption. Named customers across different end markets suggest the tool generalises.",
      whyTimely:
        "Protein design models have improved enough to be useful outside specialist groups, and the constraint has shifted from model quality to the experimental data needed to fine-tune them.",
      whyOverlooked:
        "Based in Amsterdam and Zurich rather than in a major US biotechnology hub, and selling tooling rather than therapeutics, which attracts less attention despite lower risk.",
      whyNotObvious:
        "Based in Amsterdam and Zurich rather than a US biotechnology hub, and selling tooling rather than therapeutics, which most life sciences searches rank lower.",
      evidenceNeeded:
        "A prospective benchmark against current open source protein models, and whether a named customer has moved a designed protein into development.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series B",
      disclosedRound: "Series B",
      latestRound:
        "73 million dollar Series B led by IVP, with continued participation from Index Ventures and Kindred Capital, bringing total funding to more than 100 million dollars.",
      latestRoundDate: "2024-11-26",
      latestRoundSourceId: "cradle-seriesb",
      totalDisclosedFunding: "More than 100 million dollars",
      namedInvestors: ["IVP", "Index Ventures", "Kindred Capital"],
      capitalIntensity: "Moderate",
      futureCapitalRequirement:
        "Moderate. Wet lab expansion alongside software development.",
      financingRisk:
        "Moderate. The most recent disclosed financing is now more than eighteen months old.",
      missingInformation: [
        "Revenue",
        "Founding year",
        "Customer count beyond the four named",
        "Pricing model",
      ],
    },
    technology: {
      howItWorks:
        "Machine learning models propose protein sequence variants for a design objective. The company generates its own experimental data on those variants and uses the results to improve subsequent predictions.",
      coreAdvantage:
        "The wet lab loop. Public protein data is broadly available; experimental data on the specific families a customer cares about is not, and generating it is what makes predictions improve.",
      supportingEvidence: [
        {
          claim:
            "Named enterprise users including Novo Nordisk, Johnson & Johnson Innovative Medicine, Grifols, and Novozymes.",
          sourceId: "cradle-seriesb",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Series B financing and Amsterdam and Zurich operations independently reported.",
          sourceId: "cradle-siliconangle",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Laboratory instrumentation and reagent supply, plus compute for model training.",
      milestoneForScale:
        "Evidence that a customer moved a designed protein into production or clinical development.",
      failurePoints: [
        "Open source models closing the prediction gap",
        "Large customers internalising the capability",
        "Wet lab throughput limiting the data loop",
      ],
    },
    market: {
      painPoint:
        "Protein engineering is slow and expensive, and most laboratories lack the computational staff to use modern design methods.",
      structure:
        "Pharmaceutical, industrial biotechnology, and food ingredient companies with established research budgets.",
      adoptionDrivers: [
        "Protein design models becoming useful outside specialist groups",
        "Industrial enzyme and biologics demand",
      ],
      competitors: [
        "In-house computational groups",
        "Open source protein design models",
        "Other AI protein engineering companies",
      ],
      substitutes: [
        "Traditional directed evolution",
        "Open source models run internally",
      ],
      regulatoryEnvironment:
        "The software itself is unregulated. Downstream therapeutic applications face the full clinical approval process.",
      maturity: "Developing",
      currentCatalyst:
        "Named enterprise adoption across multiple end markets.",
    },
    commercial: {
      customerType:
        "Protein engineering teams at pharmaceutical and industrial biotechnology companies.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: "Enterprise software sales into research organisations.",
      adoptionEvidence: [
        {
          claim:
            "Four named global enterprise users across pharmaceutical, plasma, and enzyme markets.",
          sourceId: "cradle-seriesb",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Designed to be low, since the proposition is putting capability into laboratories without computational specialists.",
      expansionOpportunity:
        "Additional protein families and programmes within existing customers.",
      goToMarketRisk:
        "The largest customers have the resources to build internal alternatives.",
    },
    investment: {
      thesis:
        "A protein design tool with named enterprise adoption across several end markets, differentiated by an experimental data loop rather than by model architecture alone, outside the main biotechnology hubs.",
      bullCase:
        "The wet lab loop compounds into a durable data advantage, and the tool becomes standard infrastructure for protein engineering teams.",
      baseCase:
        "Steady enterprise adoption with the advantage narrowing as open models improve.",
      bearCase:
        "Open source models close the gap, large customers internalise the capability, and the tool becomes a commodity.",
      catalysts: [
        "A customer disclosing a designed protein entering development",
        "An updated financing or revenue disclosure",
      ],
      risks: [
        "Rapidly improving open source alternatives",
        "Customer internalisation",
        "A financing record that is now dated",
      ],
      invalidators: [
        "A named customer publicly moving to an internal or open source alternative",
        "Open benchmarks showing no advantage over public models",
      ],
      recommendedNextStep:
        "Ask a named customer what the tool replaced and whether they evaluated open source models directly. That comparison is the whole investment case.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "On prospective design tasks, how do predictions compare with current open source protein models?",
      ],
      product: [
        "How much wet lab data is required before predictions improve measurably for a new protein family?",
      ],
      customers: [
        "How many programmes are running at each named customer, and have any expanded?",
      ],
      competition: [
        "Which customers evaluated open source alternatives, and what decided it?",
      ],
      unitEconomics: [
        "What is the cost of the wet lab data generation relative to subscription revenue?",
      ],
      capitalRequirements: [
        "What does wet lab expansion cost, and what capacity does it add?",
      ],
      regulation: [
        "What regulatory considerations apply when designs enter therapeutic development?",
      ],
      team: [
        "What is the founding year, and who leads the wet lab organisation?",
      ],
      financing: [
        "Has any financing closed since November 2024?",
      ],
      commercialization: [
        "What is the pricing model, and what is the typical contract size?",
      ],
    },
    outreach:
      "I have been researching protein engineering tools, and coupling the models to your own wet lab data generation is the part that seems to me to matter, because public sequence data is available to everyone and experimental data on the specific families a customer cares about is not. I would like to understand how much data a new protein family needs before predictions improve measurably. Would you be open to a call?",
    factors: {
      technicalDifferentiation: fa(
        4,
        "verified",
        "Medium",
        "Machine learning protein design coupled to proprietary wet lab data generation.",
        "The data loop is the differentiator, more than the model architecture.",
        "cradle-seriesb",
      ),
      technicalEvidence: fa(
        3,
        "verified",
        "Medium",
        "Named enterprise users across several end markets, with no published benchmark against open models.",
        "Adoption by sophisticated buyers is meaningful evidence. A published comparison would be stronger.",
        "cradle-seriesb",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Medium",
        "Accumulated experimental data on customer protein families, against rapidly improving open models.",
        "Moderate, and dependent on whether the data loop outpaces public model progress.",
      ),
      marketImportance: fa(
        4,
        "judgment",
        "Medium",
        "Protein engineering underpins therapeutics, industrial enzymes, and food ingredients.",
        "Broad and established demand across several industries.",
      ),
      commercialReadiness: fa(
        4,
        "verified",
        "High",
        "Named global enterprise customers using the product across multiple end markets.",
        "Genuinely commercial with a repeatable enterprise motion.",
        "cradle-seriesb",
      ),
      customerEvidence: fa(
        4,
        "verified",
        "High",
        "Four named enterprise users, disclosed by the company and independently reported.",
        "Named customers are far stronger evidence than aggregate claims.",
        "cradle-siliconangle",
      ),
      teamCredibility: fa(
        3,
        "verified",
        "Low",
        "Stef van Grieken is chief executive and co-founder. Other founders and the founding year are not established from primary sources.",
        "Rated on incomplete public information.",
        "cradle-seriesb",
      ),
      capitalEfficiency: fa(
        4,
        "verified",
        "Medium",
        "Named global enterprise customers reached on just over 100 million dollars raised.",
        "Efficient relative to biotechnology tooling peers.",
        "cradle-seriesb",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Medium",
        "Open source protein models are free and improving, and large customers can build internally.",
        "Difficult, with the most dangerous competitor costing nothing.",
      ),
      financingRisk: fa(
        3,
        "judgment",
        "Low",
        "More than 100 million dollars raised, with the most recent disclosure from November 2024.",
        "The age of the last data point is itself a source of uncertainty.",
      ),
      regulatoryRisk: fa(
        4,
        "judgment",
        "Medium",
        "The software is unregulated; downstream therapeutic use is not the company's regulatory burden.",
        "Low direct exposure.",
      ),
      sourcingOriginality: fa(
        4,
        "judgment",
        "Medium",
        "Based outside the major biotechnology hubs and selling tooling rather than therapeutics.",
        "Under-examined relative to comparable US companies.",
      ),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Financing, lead investor, total funding, named customers, chief executive, and locations are supported by the company's own announcement with independent corroboration. Founding year, revenue, pricing, and any financing after November 2024 are not disclosed.",
    sourceIds: ["cradle-seriesb", "cradle-siliconangle"],
    lastReviewed: REVIEWED,
  },

  /* ---------------------------------------------------------- OpenEvidence */
  {
    id: "openevidence",
    name: "OpenEvidence",
    website: "https://www.openevidence.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series D reported January 2026 as a private financing, with no listing or acquisition notice.",
    headquarters: "Miami, Florida, United States",
    region: "North America",
    foundedYear: 2022,
    founders: ["Daniel Nadler"],
    sector: "Healthcare Technology",
    subsector: "Clinical decision support and medical search",
    description:
      "Provides a medical search and decision support application for physicians, answering clinical questions against the published medical literature at the point of care.",
    targetCustomer: "Practising physicians and the health systems they work in.",
    businessModel: NOT_DISCLOSED,
    technicalDifferentiation:
      "Licensed access to major medical journal content combined with retrieval over that literature, which is a content rights position as much as a technical one.",
    tractionSignal:
      "Reported to be used by a large share of United States physicians, with the company describing itself as the fastest-growing application for physicians.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2025-07-15",
    recentCatalyst:
      "Series D of 250 million dollars led by Thrive Capital and DST Global in January 2026, at a reported 12 billion dollar valuation, having relocated headquarters from Cambridge to Miami during 2025.",
    primaryCompetitors: [
      "Established clinical reference publishers",
      "General purpose large language model assistants",
      "Electronic health record vendor decision support",
    ],
    mainTechnicalRisk:
      "Clinical accuracy and hallucination risk carry consequences that ordinary software errors do not.",
    mainCommercialRisk:
      "The business model is not publicly stated, so how adoption converts to revenue cannot be assessed externally.",
    mainFinancingRisk:
      "A valuation that rose steeply within a single year, setting a demanding reference point.",
    sourcing: {
      discoveryChannel: "Funding announcement",
      signalDate: "2026-01-21",
      signal: "Recent financing",
      dateSourced: "2026-01-21",
      channel: "Healthcare application adoption scan",
      whyEntered:
        "Physician adoption at the reported scale is rare for any clinical tool, and it happened without an electronic health record integration requirement, which is normally the gate for clinical software. That distribution path is the interesting part rather than the model.",
      whyTimely:
        "Clinical literature volume has outgrown what physicians can track, and retrieval over licensed content has become good enough to be trusted at the point of care.",
      whyOverlooked:
        "Not overlooked. This is among the most widely covered healthcare technology companies, and its founder is publicly profiled. It is retained because the question of how adoption converts to durable revenue is much less examined than the growth is.",
      whyNotObvious:
        "Among the most covered healthcare companies in existence. The under-examined part is not the growth but the absence of any public business model.",
      evidenceNeeded:
        "The business model and the content licensing terms, neither of which is public.",
      wellRecognised: true,
    },
    financing: {
      stage: "Later stage",
      disclosedRound: "Series D",
      latestRound:
        "250 million dollar Series D led by Thrive Capital and DST Global, at a reported 12 billion dollar valuation.",
      latestRoundDate: "2026-01-21",
      latestRoundSourceId: "openevidence-cnbc",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "Thrive Capital",
        "DST Global",
        "Sequoia Capital",
        "Kleiner Perkins",
        "Blackstone",
        "NVIDIA",
        "Mayo Clinic",
      ],
      capitalIntensity: "Moderate",
      futureCapitalRequirement:
        "Moderate. Content licensing and compute are the recurring costs.",
      financingRisk:
        "Low on cash. High on valuation, which rose steeply within a single year.",
      missingInformation: [
        "Business model and how revenue is generated",
        "Gross margin after content licensing and inference costs",
        "Total capital raised across all rounds",
      ],
    },
    technology: {
      howItWorks:
        "Clinical questions are answered by retrieving and synthesising evidence from licensed medical literature, with citations back to the underlying sources so that a physician can check the basis of an answer.",
      coreAdvantage:
        "Licensed access to major journal content. The retrieval approach is reproducible; the content rights are not.",
      supportingEvidence: [
        {
          claim:
            "Series D financing, valuation, investor list, and headquarters relocation to Miami, independently reported.",
          sourceId: "openevidence-cnbc",
          basis: "verified",
          provenance: "Independently verified",
        },
        {
          claim:
            "The company's own announcement describes physician adoption and its financing history.",
          sourceId: "openevidence-site",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty:
        "Content licensing agreements with medical publishers are the material asset, per public reporting.",
      thirdPartyDependency:
        "Medical publisher content licences and foundation model providers.",
      milestoneForScale:
        "Disclosure of how physician adoption converts into durable revenue.",
      failurePoints: [
        "Content licensing terms changing or becoming more expensive",
        "Clinical accuracy incidents attracting regulatory attention",
        "General purpose assistants becoming adequate for the same questions",
      ],
    },
    market: {
      painPoint:
        "Clinical literature grows faster than any physician can track, and answering a specific question at the point of care is slow.",
      structure:
        "Individual physician adoption at scale, with health systems and publishers as influential third parties.",
      adoptionDrivers: [
        "Literature volume exceeding what physicians can follow",
        "Point-of-care time pressure",
      ],
      competitors: [
        "Established clinical reference publishers",
        "General purpose assistants",
        "Electronic health record decision support",
      ],
      substitutes: ["Traditional clinical reference tools", "Literature search directly"],
      regulatoryEnvironment:
        "Clinical decision support sits in a regulated area, and the boundary between reference material and regulated decision support depends on how the product presents its output.",
      maturity: "Developing",
      currentCatalyst:
        "The Series D and continued reported growth in physician adoption.",
    },
    commercial: {
      customerType: "Physicians, with health systems as an institutional layer.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: NOT_DISCLOSED,
      adoptionEvidence: [
        {
          claim:
            "Physician adoption at national scale, reported by independent business press but originating as a company figure with no published methodology. The Mayo Clinic being among the investors is independently established.",
          sourceId: "openevidence-cnbc",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Low, since adoption has occurred without requiring electronic health record integration.",
      expansionOpportunity:
        "Institutional relationships with health systems and adjacent clinical workflows.",
      goToMarketRisk:
        "Adoption without a publicly stated business model means the revenue mechanism cannot be evaluated from outside.",
    },
    investment: {
      thesis:
        "Exceptional physician adoption achieved without the usual integration gate, built on a content licensing position that is harder to replicate than the retrieval technology, at a valuation that has already priced a great deal of that.",
      bullCase:
        "Adoption converts into durable institutional revenue, and the content rights position proves to be the enduring moat.",
      baseCase:
        "Growth continues with monetisation lagging adoption, as it often does in clinician tools.",
      bearCase:
        "General purpose assistants become adequate, content licensing costs rise, and the valuation cannot be supported.",
      catalysts: [
        "Any disclosure of the business model or revenue",
        "Institutional health system agreements",
      ],
      risks: [
        "Undisclosed business model",
        "Content licensing dependency",
        "Clinical accuracy and regulatory exposure",
      ],
      invalidators: [
        "A major publisher withdrawing content licensing",
        "A regulatory determination reclassifying the product as regulated decision support",
      ],
      recommendedNextStep:
        "Establish the business model and the content licensing terms. Adoption is well documented and the mechanism that turns it into durable value is not.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What is the measured clinical accuracy rate, and how are errors detected and corrected?",
      ],
      product: [
        "How does the product avoid being classified as regulated clinical decision support?",
      ],
      customers: [
        "How is physician usage measured, and what does sustained weekly use look like?",
      ],
      competition: [
        "For the questions physicians actually ask, how does the product compare with a general purpose assistant?",
      ],
      unitEconomics: [
        "What is the cost per query after content licensing and inference, and who pays it?",
      ],
      capitalRequirements: [
        "What do content licensing commitments cost annually?",
      ],
      regulation: [
        "What is the regulatory position of the product, and has it been tested?",
      ],
      team: [
        "How deep is the clinical leadership relative to the technical leadership?",
      ],
      financing: [
        "What is total capital raised, and what does the valuation imply about required revenue?",
      ],
      commercialization: [
        "What is the business model, given none is publicly stated?",
      ],
    },
    outreach:
      "I have been researching clinical decision support, and what stands out about your adoption is that it happened without an electronic health record integration requirement, which is normally the gate everything in clinical software has to pass. That distribution path seems more interesting than the retrieval itself. I would like to understand how usage converts into a durable relationship with health systems. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(
        3,
        "judgment",
        "Medium",
        "Retrieval over licensed medical literature, where the licensing position matters more than the retrieval method.",
        "The technical approach is reproducible; the content rights are the real asset.",
      ),
      technicalEvidence: fa(
        3,
        "verified",
        "Medium",
        "Widely reported physician adoption at national scale, with no published clinical accuracy evaluation.",
        "Adoption is strong evidence of usefulness. The absence of a published accuracy study is a real gap in a clinical product.",
        "openevidence-cnbc",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Medium",
        "Publisher content licences and physician habit, against reproducible retrieval technology.",
        "The licensing position is the durable part and is genuinely hard to replicate.",
      ),
      marketImportance: fa(
        4,
        "judgment",
        "High",
        "Clinical decision support at the point of care affects a very large number of decisions daily.",
        "Important by any measure.",
      ),
      commercialReadiness: fa(
        4,
        "verified",
        "Medium",
        "A product in daily use at national scale, with no publicly stated business model.",
        "Commercially deployed, with the revenue mechanism undisclosed.",
        "openevidence-cnbc",
      ),
      customerEvidence: fa(
        5,
        "verified",
        "High",
        "Reported use by a large share of United States physicians, with a major clinical institution among investors.",
        "Adoption evidence at this scale is exceptional and independently reported.",
        "openevidence-cnbc",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "High",
        "Founded in 2022 by Daniel Nadler, who previously built and sold a financial data analysis company.",
        "A prior company taken to an exit, in a different domain.",
        "openevidence-cnbc",
      ),
      capitalEfficiency: fa(
        4,
        "judgment",
        "Low",
        "National physician adoption achieved within roughly four years of founding.",
        "Appears efficient on adoption, though it cannot be assessed properly without revenue or total capital raised.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Medium",
        "Established clinical reference publishers and general purpose assistants both compete for the same questions.",
        "Moderate, with the content licensing position providing genuine separation.",
      ),
      financingRisk: fa(
        2,
        "verified",
        "High",
        "A valuation that roughly doubled within three months and rose more than tenfold within a year.",
        "Rated on valuation risk. A reference point that moves this fast is difficult to grow into.",
        "openevidence-cnbc",
      ),
      regulatoryRisk: fa(
        2,
        "judgment",
        "Medium",
        "Clinical decision support sits close to a regulated boundary that depends on how output is presented.",
        "Material and untested, which is why this is rated low.",
      ),
      sourcingOriginality: fa(
        0,
        "verified",
        "High",
        "Among the most widely covered healthcare technology companies, with its founder publicly profiled.",
        "No sourcing edge exists here, and the model records that rather than crediting visibility.",
      ),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Founder, founding year, financing, valuation, investor list, and the headquarters relocation to Miami are supported by independent business press with the company's own announcement corroborating adoption. The business model, revenue, gross margin, and total capital raised are not disclosed, which is a material gap for a company at this valuation.",
    sourceIds: ["openevidence-cnbc", "openevidence-site"],
    lastReviewed: REVIEWED,
  },
];

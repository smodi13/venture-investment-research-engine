import { fa, NOT_DISCLOSED, type PrivateCompany } from "../types";

/** Verified private companies, part seven. See companies-a.ts for the data policy. */

const REVIEWED = "2026-07-30";

export const COMPANIES_G: PrivateCompany[] = [
  /* ---------------------------------------------------------------- Anterior */
  {
    id: "anterior",
    name: "Anterior",
    website: "https://anterior.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Most recent financing announced February 2026 as a private round, with no listing or acquisition notice.",
    headquarters: "New York, New York, United States",
    region: "North America",
    foundedYear: NOT_DISCLOSED,
    founders: [],
    sector: "Healthcare Technology",
    subsector: "Clinical reasoning for payer utilisation management",
    description:
      "Automates the clinical review step in prior authorisation, applying a payer's own medical policy to a patient's record and routing only the genuinely ambiguous cases to a human clinician.",
    targetCustomer:
      "Health plans and risk-bearing provider organisations running utilisation management at volume.",
    businessModel: NOT_DISCLOSED,
    technicalDifferentiation:
      "The output is a clinical determination traced to the specific policy criteria and the specific chart evidence, which is what makes the decision auditable and therefore usable by a regulated payer.",
    tractionSignal:
      "The company names Geisinger Health Plan among its customers and has an integration with a widely deployed care management platform.",
    recentCatalyst:
      "40 million dollar financing announced February 2026, bringing total funding to 64 million dollars, following a 20 million dollar Series A led by NEA in June 2024.",
    primaryCompetitors: [
      "Incumbent utilisation management software vendors",
      "Health plan internal automation programmes",
      "Clinical review outsourcing firms",
    ],
    mainTechnicalRisk:
      "A wrong denial in prior authorisation is a patient harm and a regulatory event, so the tolerance for error is far below what general language model performance delivers.",
    mainCommercialRisk:
      "Health plans buy slowly, in small numbers, and each one is a long enterprise sale.",
    mainFinancingRisk:
      "Modest. Well funded relative to a software cost base.",
    sourcing: {
      discoveryChannel: "Regulatory milestone",
      signalDate: "2026-02-01",
      signal: "Regulatory milestone",
      dateSourced: "2026-03-18",
      channel: "Prior authorisation rule implementation tracking",
      whyEntered:
        "Federal interoperability and prior authorisation requirements set decision timelines that most payers cannot meet with the staffing they have. That creates a compliance deadline rather than an efficiency pitch, and a company positioned against a deadline sells differently from one positioned against a cost line.",
      whyTimely:
        "Payer compliance dates fall in the current cycle, so the buying decision is being made now rather than at some future budget review.",
      whyOverlooked:
        "Health plan software is unglamorous and the buyer set is small, so healthcare attention concentrates on clinical AI and diagnostics instead.",
      whyNotObvious:
        "A funding record shows a healthcare AI company. It does not show that a named regional health plan is already a customer, or that an integration exists with a platform payers already run.",
      evidenceNeeded:
        "The clinician override rate on automated determinations, and revenue per health plan customer.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series A",
      disclosedRound: "Series A, with a further round announced February 2026",
      latestRound:
        "40 million dollar oversubscribed round announced February 2026 with continued participation from NEA and Sequoia Capital and new investors FPV and Kinnevik, bringing total funding to 64 million dollars. The June 2024 Series A was 20 million dollars led by NEA.",
      latestRoundDate: "2026-02-16",
      latestRoundSourceId: "anterior-raise",
      totalDisclosedFunding: "64 million dollars",
      namedInvestors: [
        "NEA",
        "Sequoia Capital",
        "FPV",
        "Kinnevik",
      ],
      capitalIntensity: "Low",
      futureCapitalRequirement: "Low. Software economics with a clinical review team.",
      financingRisk: "Low. Recently and adequately funded.",
      missingInformation: [
        "Revenue",
        "Customer count beyond the named reference",
        "Series designation of the February 2026 round",
        "Founders and founding year",
      ],
    },
    technology: {
      howItWorks:
        "A prior authorisation request and the associated chart are read against the payer's own medical policy, and the system produces a determination with the criteria met, the criteria unmet, and the chart evidence for each, escalating ambiguous cases to a clinician.",
      coreAdvantage:
        "Traceability. A determination that cites the policy criterion and the chart line is defensible in an appeal, which is the only form a payer can actually deploy.",
      supportingEvidence: [
        {
          claim:
            "The company announced a 40 million dollar financing and names a regional health plan among its customers.",
          sourceId: "anterior-raise",
          basis: "verified",
        },
        {
          claim:
            "The February 2026 round, its investors, and the expansion of production deployments across health plans were independently reported.",
          sourceId: "anterior-fierce",
          basis: "verified",
        },
      ],
      benchmarks:
        "The company states its dataset contains 100 times more advanced biological systems than the most-used public databases. That is a scale claim rather than a functional benchmark, and it has not been independently verified.",
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Payer care management platforms and health record systems for chart access.",
      milestoneForScale:
        "A published clinician override rate, which is the number that determines whether the automation is trusted or merely tolerated.",
      failurePoints: [
        "Determination errors producing regulatory exposure",
        "Override rates high enough that no labour is saved",
        "Care management platform vendors building equivalent automation",
      ],
    },
    market: {
      painPoint:
        "Prior authorisation review is manual, clinician-intensive, and now bound by regulatory decision timelines payers are not staffed to meet.",
      structure:
        "A small number of large buyers with long procurement cycles and heavy compliance requirements.",
      adoptionDrivers: [
        "Federal prior authorisation decision timelines",
        "Clinical staffing costs in utilisation management",
      ],
      competitors: [
        "Incumbent utilisation management vendors",
        "Internal payer automation",
      ],
      substitutes: ["Outsourced clinical review", "Hiring more review clinicians"],
      regulatoryEnvironment:
        "Prior authorisation is directly regulated. Interoperability and decision timeline rules apply, and determinations are appealable.",
      maturity: "Developing",
      currentCatalyst:
        "Compliance deadlines for payer prior authorisation timelines.",
    },
    commercial: {
      customerType: "Health plans and risk-bearing provider organisations.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: "Direct enterprise sales into health plan operations leadership.",
      adoptionEvidence: [
        {
          claim:
            "A named regional health plan customer and an integration with a widely deployed care management platform.",
          sourceId: "anterior-raise",
          basis: "verified",
        },
      ],
      implementationBurden:
        "High. Integration with payer systems and configuration against each plan's own medical policy.",
      expansionOpportunity:
        "Additional lines of business within an existing plan, where the policy configuration work is already done.",
      goToMarketRisk:
        "A small buyer universe means each lost deal is material.",
    },
    investment: {
      thesis:
        "A regulated workflow with a compliance deadline, a named health plan customer, and an auditable output design, in a category where the incumbent software was not built for the timelines now required.",
      bullCase:
        "Compliance deadlines force payer adoption, the named reference converts peers, and configured policy libraries become switching costs.",
      baseCase:
        "Steady health plan adoption at enterprise sales pace.",
      bearCase:
        "Override rates stay high, payers keep clinicians in the loop for everything, and the labour saving never materialises.",
      catalysts: [
        "A published clinician override rate",
        "Additional named health plan customers",
      ],
      risks: [
        "Regulatory exposure on incorrect determinations",
        "Small buyer universe",
        "Care management platform vendors building equivalent capability",
      ],
      invalidators: [
        "A regulatory action arising from automated determinations",
        "Evidence that clinician review is required on most cases anyway",
      ],
      recommendedNextStep:
        "Establish the clinician override rate on automated determinations. It decides whether this is automation or an expensive triage layer.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What is the clinician override rate, and how has it changed over deployment?",
      ],
      product: [
        "How is a payer's medical policy configured, and how long does that take per plan?",
      ],
      customers: ["How many health plans are live, and at what review volume?"],
      competition: [
        "What automation have the incumbent utilisation management vendors shipped?",
      ],
      unitEconomics: [
        "What is revenue per health plan, and what is the cost of the clinical review team?",
      ],
      capitalRequirements: ["What does the February 2026 round fund?"],
      regulation: [
        "What liability sits with the vendor versus the payer on an automated determination?",
      ],
      team: ["Who founded the company, and who leads clinical governance?"],
      financing: [
        "What series was the February 2026 round, and at what valuation?",
      ],
      commercialization: [
        "What is the sales cycle length from first contact to a live plan?",
      ],
    },
    outreach:
      "I have been researching prior authorisation automation, and what interests me about your approach is that the determination cites the specific policy criterion and the specific chart evidence. In a workflow where every decision is appealable, traceability is not a feature, it is the precondition for deployment at all. I would like to understand how the clinician override rate has moved as plans have gone live. Would you be open to a call?",
    factors: {
      technicalDifferentiation: fa(4, "judgment", "Medium",
        "Determinations traced to specific policy criteria and chart evidence, rather than a classification with a confidence score.",
        "The design constraint that makes the output usable in a regulated appealable process."),
      technicalEvidence: fa(3, "verified", "Medium",
        "A named health plan customer and a platform integration, with no accuracy or override figures published.",
        "Deployment evidence without performance evidence.", "anterior-raise"),
      defensibility: fa(3, "judgment", "Medium",
        "Configured policy libraries and payer integrations create switching costs once live.",
        "Real but built over time rather than inherent."),
      marketImportance: fa(4, "verified", "High",
        "Prior authorisation is a large regulated cost centre now bound by federal decision timelines.",
        "A compliance requirement rather than a discretionary purchase."),
      commercialReadiness: fa(4, "verified", "Medium",
        "Live with a named regional health plan and integrated with a deployed care management platform.",
        "Past pilot stage with a real payer.", "anterior-raise"),
      customerEvidence: fa(3, "verified", "Medium",
        "Production deployments across health plans with one named, and an integration with a widely deployed care management platform. No count, volume, or revenue disclosed.",
        "A named payer reference is meaningful; the aggregate remains unquantified.", "anterior-raise"),
      teamCredibility: fa(2, "judgment", "Low",
        "Founders and founding year are not established from a primary source, though the company operates with clinician involvement.",
        "Rated on incomplete public information rather than any negative finding."),
      capitalEfficiency: fa(4, "judgment", "Medium",
        "A live payer deployment reached on 64 million dollars total.",
        "Reasonable for enterprise healthcare software."),
      competitiveIntensity: fa(3, "judgment", "Medium",
        "Incumbent utilisation management vendors and internal payer programmes, none clearly ahead.",
        "Contested but not crowded."),
      financingRisk: fa(4, "verified", "Medium",
        "64 million dollars raised, most recently in February 2026, against a low capital requirement.",
        "Comfortable.", "anterior-raise"),
      regulatoryRisk: fa(2, "verified", "High",
        "Prior authorisation determinations are directly regulated and appealable, and errors create real exposure.",
        "Among the highest regulatory exposure in the universe."),
      sourcingOriginality: fa(4, "judgment", "Medium",
        "Payer operations software attracts far less attention than clinical AI, despite a clearer buyer.",
        "Under-examined relative to the size of the workflow."),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Financing, investors, the named health plan customer, and the platform integration are supported by the company's own announcement with independent reporting of the Series A. Founders, founding year, revenue, pricing, and the series designation of the most recent round are not disclosed.",
    sourceIds: ["anterior-raise", "anterior-fierce"],
    lastReviewed: REVIEWED,
  },

  /* ------------------------------------------------------------------ Tennr */
  {
    id: "tennr",
    name: "Tennr",
    website: "https://www.tennr.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series C announced June 2025 as a private financing, with no listing or acquisition notice.",
    headquarters: "New York, New York, United States",
    region: "North America",
    foundedYear: 2021,
    founders: ["Trey Holterman", "Tyler Johnson", "Diego Baugh"],
    sector: "Healthcare Technology",
    subsector: "Referral and document intake automation",
    description:
      "Reads the faxed and scanned documents that still carry most healthcare referrals, extracts the clinical and insurance detail, and turns an intake process that runs on paper into structured data a practice can act on.",
    targetCustomer:
      "Specialty practices, diagnostic providers, and durable medical equipment suppliers with high referral volume.",
    businessModel: NOT_DISCLOSED,
    technicalDifferentiation:
      "Building for the document as it actually arrives, degraded and unstructured, rather than assuming an interoperability standard that most of the referral chain does not use.",
    tractionSignal:
      "The company states it has helped process millions of patients across hundreds of providers and more than tripled revenue since the Series B eight months earlier, without disclosing the absolute figure.",
    recentCatalyst:
      "101 million dollar Series C at a 605 million dollar valuation led by IVP in June 2025, following a 37 million dollar Series B in October 2024.",
    primaryCompetitors: [
      "Referral management modules in health record systems",
      "Document processing vendors",
      "Offshore manual data entry services",
    ],
    mainTechnicalRisk:
      "Extraction from poor-quality scanned documents fails in long-tail cases, and in healthcare a missed clinical detail has consequences beyond a data error.",
    mainCommercialRisk:
      "A rapid valuation step-up sets a growth expectation that has to be sustained through the next round.",
    mainFinancingRisk:
      "Two rounds in eight months at a high multiple concentrates the risk in the next financing rather than in the operating business.",
    sourcing: {
      discoveryChannel: "Funding announcement",
      signalDate: "2025-06-18",
      signal: "Recent financing",
      dateSourced: "2026-04-09",
      channel: "Healthcare operations software financing cadence tracking",
      whyEntered:
        "A Series C roughly eight months after a Series B, with the company stating revenue had more than tripled in the interval. The cadence and the growth rate together say more than either round size does.",
      whyTimely:
        "Healthcare administrative cost remains under pressure and the fax-based referral chain has not gone away despite two decades of interoperability effort.",
      whyOverlooked:
        "The problem is unglamorous and sounds solved. Anyone who assumes referrals arrive as structured data underestimates the market entirely.",
      whyNotObvious:
        "A database records two rounds. It does not surface the eight month interval between them or the growth rate disclosed alongside, which is what changes the interpretation.",
      evidenceNeeded:
        "The absolute revenue base behind the stated tripling, net revenue retention, and the extraction accuracy rate on degraded documents.",
      wellRecognised: true,
    },
    financing: {
      stage: "Series C",
      disclosedRound: "Series C",
      latestRound:
        "101 million dollar Series C at a 605 million dollar valuation led by IVP, with new investors GV and ICONIQ and continued participation from Andreessen Horowitz and Lightspeed, following a 37 million dollar Series B in October 2024.",
      latestRoundDate: "2025-06-18",
      latestRoundSourceId: "tennr-seriesc",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "IVP",
        "GV",
        "ICONIQ",
        "Andreessen Horowitz",
        "Lightspeed Venture Partners",
      ],
      capitalIntensity: "Low",
      futureCapitalRequirement: "Low. Software economics.",
      financingRisk:
        "Moderate. Well capitalised, with a valuation that sets a demanding bar for the next round.",
      missingInformation: [
        "Absolute revenue figure",
        "Named customers",
        "Net revenue retention",
        "Total capital raised",
      ],
    },
    technology: {
      howItWorks:
        "Inbound referral documents, typically faxes and scans, are read to extract patient, clinical, and insurance detail, which is validated and pushed into the receiving practice's systems.",
      coreAdvantage:
        "Accuracy on documents that were never designed to be machine readable, which is where generic document processing degrades.",
      supportingEvidence: [
        {
          claim:
            "A 101 million dollar Series C at a 605 million dollar valuation led by IVP.",
          sourceId: "tennr-seriesc",
          basis: "verified",
        },
        {
          claim:
            "The company stated it had more than tripled revenue since the Series B, and the round was independently reported.",
          sourceId: "tennr-fortune",
          basis: "verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Health record systems for write-back, and fax infrastructure for intake.",
      milestoneForScale:
        "A published extraction accuracy rate on degraded documents, which is the claim the business rests on.",
      failurePoints: [
        "Long-tail extraction failures with clinical consequences",
        "Health record vendors improving native referral intake",
        "Interoperability adoption eventually reducing the paper volume",
      ],
    },
    market: {
      painPoint:
        "A large share of healthcare referrals still arrive as faxes, and staff retype them into systems, which is slow, expensive, and error-prone.",
      structure:
        "A wide base of specialty practices and suppliers, sold as operational software.",
      adoptionDrivers: [
        "Administrative cost pressure",
        "Staffing shortages in practice operations",
      ],
      competitors: [
        "Health record referral modules",
        "Document processing vendors",
      ],
      substitutes: ["Manual data entry", "Offshore processing services"],
      regulatoryEnvironment:
        "Patient data handling requirements apply to all processing.",
      maturity: "Developing",
      currentCatalyst:
        "The Series C funding expansion across referral-heavy specialties.",
    },
    commercial: {
      customerType:
        "Specialty practices, diagnostic providers, and equipment suppliers.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: "Direct sales into practice operations.",
      adoptionEvidence: [
        {
          claim:
            "The company stated revenue had more than tripled since the Series B eight months earlier. The absolute figure was not disclosed.",
          sourceId: "tennr-fortune",
          basis: "verified",
        },
      ],
      implementationBurden:
        "Moderate. Connecting intake channels and writing into existing systems.",
      expansionOpportunity:
        "Adjacent administrative workflows within existing customers.",
      goToMarketRisk:
        "A fragmented customer base requires sales efficiency to scale.",
    },
    investment: {
      thesis:
        "An unglamorous administrative workflow with genuine volume, addressed at the point where documents actually arrive rather than where standards say they should, with a financing cadence that implies growth the company has not disclosed.",
      bullCase:
        "Referral intake becomes the wedge into broader practice administration, and the extraction quality holds as volume scales.",
      baseCase:
        "Solid growth in a defined operational niche.",
      bearCase:
        "Extraction accuracy plateaus, health record vendors close the gap natively, and the valuation proves ahead of the business.",
      catalysts: [
        "Disclosed revenue or retention",
        "Expansion beyond referral intake",
      ],
      risks: [
        "A demanding valuation set in June 2025",
        "Health record vendor encroachment",
        "Long-tail extraction failures",
      ],
      invalidators: [
        "A flat or down round",
        "Health record vendors shipping equivalent intake automation",
      ],
      recommendedNextStep:
        "Establish the absolute revenue base behind the stated tripling. A growth multiple without a starting figure is the easiest number in venture to over-read.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What is extraction accuracy on the worst quality documents in production?",
      ],
      product: [
        "Which systems can the product write into, and how is that integration maintained?",
      ],
      customers: [
        "How is a provider counted, and what is the concentration among the largest?",
      ],
      competition: [
        "What referral intake automation have health record vendors shipped natively?",
      ],
      unitEconomics: ["What is gross margin after human review of low-confidence extractions?"],
      capitalRequirements: ["What does the Series C fund, and over what horizon?"],
      regulation: ["How is patient data handled and retained during processing?"],
      team: ["What is the founding year, and how large is the engineering team?"],
      financing: [
        "What absolute revenue underlies the stated tripling since the Series B?",
      ],
      commercialization: ["What is net revenue retention?"],
    },
    outreach:
      "I have been researching healthcare administrative workflows, and the observation that most referrals still arrive as faxes despite two decades of interoperability work is the one that made me look at Tennr properly. Building for the document as it actually arrives rather than as a standard says it should is the pragmatic choice and the harder engineering problem. I would like to understand how extraction accuracy holds on the worst quality inbound documents. Would you be open to a call?",
    factors: {
      technicalDifferentiation: fa(3, "judgment", "Medium",
        "Document extraction tuned for degraded healthcare referral documents rather than general document processing.",
        "A real specialisation in a category where general tools underperform."),
      technicalEvidence: fa(3, "verified", "Medium",
        "A stated revenue tripling over eight months, with no extraction accuracy figures published.",
        "Commercial evidence is real; technical performance is entirely unquantified.", "tennr-fortune"),
      defensibility: fa(3, "judgment", "Medium",
        "Accumulated extraction training data on healthcare document formats.",
        "Compounding, though the underlying capability is improving industry wide."),
      marketImportance: fa(3, "judgment", "Medium",
        "Referral intake is a large administrative cost across many practices.",
        "Substantial and unglamorous."),
      commercialReadiness: fa(4, "verified", "High",
        "Revenue stated to have more than tripled in eight months, supporting a Series C at a 605 million dollar valuation.",
        "A stated growth rate plus a priced round is solid commercial evidence.", "tennr-fortune"),
      customerEvidence: fa(3, "verified", "Low",
        "Hundreds of providers and millions of patients processed, stated by the company, with no named customer and no absolute revenue disclosed.",
        "Scale is claimed in aggregate; nothing is named or independently checkable.", "tennr-seriesc"),
      teamCredibility: fa(3, "verified", "Medium",
        "Three named co-founders and a 2021 founding year, with prior backgrounds not established from a primary source.",
        "Founders and founding confirmed; backgrounds not.", "tennr-fortune"),
      capitalEfficiency: fa(3, "judgment", "Medium",
        "Two large rounds in eight months, with a growth rate but no absolute revenue against which to assess efficiency.",
        "Partially assessable. Growth is fast; the base is unknown."),
      competitiveIntensity: fa(3, "judgment", "Medium",
        "Health record referral modules and document processing vendors, neither focused on this specific case.",
        "Contested at the edges rather than head on."),
      financingRisk: fa(3, "verified", "Medium",
        "Well capitalised at a 605 million dollar valuation that sets a demanding bar for the next round.",
        "Cash risk low, valuation risk real.", "tennr-seriesc"),
      regulatoryRisk: fa(3, "judgment", "Medium",
        "Patient data handling requirements apply throughout processing.",
        "Standard healthcare data exposure."),
      sourcingOriginality: fa(1, "judgment", "High",
        "Widely covered in business press following a 605 million dollar valuation, and backed by several well-known firms.",
        "No sourcing originality. The company is well recognised and the platform records that plainly."),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Financing rounds, valuation, investors, founder names, founding year, and the stated revenue growth rate are supported by the company's own announcement with independent business press corroboration. Absolute revenue, customer names, and total capital raised are not disclosed.",
    sourceIds: ["tennr-seriesc", "tennr-fortune"],
    lastReviewed: REVIEWED,
  },

  /* --------------------------------------------------------- Counsel Health */
  {
    id: "counsel-health",
    name: "Counsel Health",
    website: "https://www.counselhealth.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series A announced October 2025 as a private financing, with no listing or acquisition notice.",
    headquarters: "New York, New York, United States",
    region: "North America",
    foundedYear: NOT_DISCLOSED,
    founders: [],
    sector: "Healthcare Technology",
    subsector: "Physician-supervised asynchronous primary care",
    description:
      "Delivers primary care conversations asynchronously, with a language model handling the exchange and a licensed physician reviewing and signing every clinical decision before it reaches the patient.",
    targetCustomer:
      "Employers, health plans, and provider organisations seeking to expand primary care access without adding clinician hours proportionally.",
    businessModel: NOT_DISCLOSED,
    technicalDifferentiation:
      "The physician sign-off is the product architecture rather than a compliance wrapper, which sets a hard ceiling on automation and a hard floor on clinical accountability.",
    tractionSignal:
      "The company states it serves more than 100,000 members nationwide, with a 96 percent issue resolution rate, two minute physician response times, and 381 dollars in average annual savings per engaged member.",
    recentCatalyst:
      "25 million dollar Series A led by Andreessen Horowitz and GV announced 16 October 2025, bringing total funding to 36 million dollars.",
    primaryCompetitors: [
      "Telehealth providers",
      "Health system virtual care programmes",
      "Consumer symptom assessment applications",
    ],
    mainTechnicalRisk:
      "Every clinical output passes a physician, so the automation only pays if physician review time falls substantially, and there is no public evidence on that.",
    mainCommercialRisk:
      "Virtual primary care is a category with a long history of high acquisition cost and weak retention.",
    mainFinancingRisk:
      "Low relative to the raise, though scaling physician capacity is an operating cost rather than a software one.",
    sourcing: {
      discoveryChannel: "Founder research",
      signalDate: "2025-10-16",
      signal: "Founder background",
      dateSourced: "2026-06-25",
      channel: "Clinician-led company formation tracking",
      whyEntered:
        "The company chose a model where a physician signs every output, which caps the automation rate by design. Choosing a lower ceiling in exchange for clinical defensibility is a deliberate constraint, and companies that accept constraints early tend to survive regulatory attention better than those that discover them later.",
      whyTimely:
        "Primary care access is deteriorating while clinician supply is flat, so any model that increases throughput per physician hour has a structural tailwind.",
      whyOverlooked:
        "Virtual primary care carries a poor reputation from the previous cycle, which suppresses attention to companies attacking it differently.",
      whyNotObvious:
        "A funding record shows another digital health Series A. It does not convey that the automation ceiling is a design choice rather than a limitation.",
      evidenceNeeded:
        "Physician review time per encounter, member retention, and the methodology behind the stated savings figure. Without the first, the economics cannot be assessed at all.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series A",
      disclosedRound: "Series A",
      latestRound:
        "25 million dollar Series A led by Andreessen Horowitz and GV with Floodgate and Pear VC participating, bringing total funding to 36 million dollars, following an 11 million dollar seed round in October 2024.",
      latestRoundDate: "2025-10-16",
      latestRoundSourceId: "counsel-seriesa",
      totalDisclosedFunding: "36 million dollars",
      namedInvestors: [
        "Andreessen Horowitz",
        "GV",
        "Floodgate",
        "Pear VC",
      ],
      capitalIntensity: "Moderate",
      futureCapitalRequirement:
        "Moderate. Physician capacity scales with volume rather than with software.",
      financingRisk: "Low. Recently funded by established investors.",
      missingInformation: [
        "Revenue",
        "Physician review time per encounter",
        "Founders and founding year",
        "How the 381 dollar savings figure is calculated",
      ],
    },
    technology: {
      howItWorks:
        "A patient describes a concern asynchronously, a language model conducts the history and drafts an assessment and plan, and a licensed physician reviews, edits, and signs before anything is returned.",
      coreAdvantage:
        "Clinical accountability preserved at every output, which is what allows the service to operate as care rather than as information.",
      supportingEvidence: [
        {
          claim:
            "More than 100,000 members served nationwide, a 96 percent issue resolution rate, two minute physician response times, and 381 dollars average annual savings per engaged member.",
          sourceId: "counsel-hit",
          basis: "verified",
        },
        {
          claim:
            "The lead investor describes the chief executive as a Stanford-trained physician and AI researcher, previously chief medical officer at a health technology company.",
          sourceId: "counsel-a16z",
          basis: "verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Model providers, licensed physician supply, and state medical licensure.",
      milestoneForScale:
        "Evidence that physician review time per encounter falls as the model improves, since that ratio is the entire economic argument.",
      failurePoints: [
        "Physician review time not falling with model improvement",
        "State licensure constraints limiting geographic scale",
        "Patient retention following the pattern of previous virtual care models",
      ],
    },
    market: {
      painPoint:
        "Primary care access is constrained by clinician hours, and demand keeps rising against a flat supply.",
      structure:
        "Employer, plan, and provider channels, plus direct consumer access.",
      adoptionDrivers: [
        "Deteriorating primary care access",
        "Cost pressure on employer health spending",
      ],
      competitors: [
        "Telehealth providers",
        "Health system virtual care",
      ],
      substitutes: ["Conventional primary care visits", "Urgent care"],
      regulatoryEnvironment:
        "State medical licensure, scope of practice, and patient data requirements all apply.",
      maturity: "Developing",
      currentCatalyst:
        "The Series A funding expansion of the physician-supervised model.",
    },
    commercial: {
      customerType: "Employers, health plans, providers, and patients.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: NOT_DISCLOSED,
      adoptionEvidence: [
        {
          claim:
            "More than 100,000 members served nationwide. No institutional customer is named and no revenue is disclosed.",
          sourceId: "counsel-hit",
          basis: "verified",
        },
      ],
      implementationBurden: "Low for patients, moderate for institutional channels.",
      expansionOpportunity:
        "Additional clinical scope within the supervised model.",
      goToMarketRisk:
        "Virtual primary care has a poor historical record on acquisition cost and retention.",
    },
    investment: {
      thesis:
        "A deliberately constrained model that trades automation ceiling for clinical defensibility, already operating across more than 100,000 members, in a category where the constraint others skipped is what usually ends them.",
      bullCase:
        "Physician review time falls sharply with model improvement, and the same clinician serves many more patients without losing accountability.",
      baseCase:
        "A credible access product with economics bounded by physician time.",
      bearCase:
        "Review time does not fall, the model is a staffing business with software margins nowhere in sight.",
      catalysts: [
        "Disclosed physician review time per encounter",
        "A named institutional customer with contract terms",
      ],
      risks: [
        "Economics bounded by physician review time",
        "State licensure limiting scale",
        "Category history on retention",
      ],
      invalidators: [
        "Physician review time flat across successive model generations",
        "Retention consistent with prior virtual care models",
      ],
      recommendedNextStep:
        "Ask for physician review time per encounter over the last four quarters. If it is not falling, the model is a staffing business regardless of how good the drafting gets.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "How much has physician review time per encounter fallen as models have improved?",
      ],
      product: ["What clinical scope is in and out of bounds for the service?"],
      customers: [
        "Which channels do the 100,000 members come through, and how is a resolved issue defined?",
      ],
      competition: ["How does this differ from telehealth with a chat interface?"],
      unitEconomics: ["What is contribution margin per encounter after physician time?"],
      capitalRequirements: ["What does the Series A fund, and over what horizon?"],
      regulation: ["In how many states is the physician network licensed?"],
      team: ["Who founded the company, and who holds clinical leadership?"],
      financing: ["What is revenue per member, and what is current revenue?"],
      commercialization: ["What is patient retention at six and twelve months?"],
    },
    outreach:
      "I have been researching AI in primary care delivery, and the decision to have a physician sign every output is the part I keep coming back to. It caps how much you can automate, deliberately, in exchange for the accountability that lets the service count as care. Reaching more than 100,000 members under that constraint is the part I would not have predicted. I would like to understand how physician review time per encounter has moved as the models have improved, because that ratio seems to be the whole argument. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(3, "judgment", "Medium",
        "Physician sign-off built into the architecture rather than added as a compliance layer.",
        "A deliberate design constraint rather than a technical advantage."),
      technicalEvidence: fa(3, "verified", "Medium",
        "A stated 96 percent issue resolution rate and two minute physician response times across more than 100,000 members, with no clinical outcome data and no independent audit.",
        "Operating metrics at real scale, self-reported and not clinical endpoints.", "counsel-hit"),
      defensibility: fa(2, "judgment", "Low",
        "A licensed physician network and accumulated clinical workflow, both reproducible with capital.",
        "Weak. The model is describable and the components are purchasable."),
      marketImportance: fa(4, "judgment", "Medium",
        "Primary care access is a durable structural problem with rising demand and flat clinician supply.",
        "Genuinely important, and historically hard to monetise."),
      commercialReadiness: fa(3, "verified", "Medium",
        "More than 100,000 members served nationwide, with no named institutional customer, pricing, or revenue disclosed.",
        "Operating at real scale with the commercial structure undisclosed.", "counsel-hit"),
      customerEvidence: fa(3, "verified", "Medium",
        "More than 100,000 members served, stated by the company and independently reported. No institutional customer is named.",
        "Scale is evidenced; the buyer relationships behind it are not.", "counsel-hit"),
      teamCredibility: fa(3, "verified", "Medium",
        "Led by a Stanford-trained physician and AI researcher who was previously chief medical officer at a health technology company. Founder status and founding year are not established.",
        "Relevant clinical and operating background, with the wider founding record unclear.", "counsel-a16z"),
      capitalEfficiency: fa(4, "judgment", "Medium",
        "More than 100,000 members reached on 36 million dollars total, with no revenue disclosed.",
        "Efficient on the member measure; revenue efficiency cannot be assessed."),
      competitiveIntensity: fa(2, "judgment", "Medium",
        "Telehealth providers, health system virtual care, and consumer applications all overlap.",
        "A crowded category with a difficult history."),
      financingRisk: fa(4, "verified", "Medium",
        "36 million dollars raised, most recently October 2025, from established investors.",
        "Comfortable for the stage.", "counsel-seriesa"),
      regulatoryRisk: fa(2, "judgment", "High",
        "State medical licensure, scope of practice, and patient data requirements all bind directly.",
        "High and structural, though the physician sign-off design mitigates the sharpest version."),
      sourcingOriginality: fa(3, "judgment", "Medium",
        "Backed by well-known investors, in a category most observers have written off.",
        "The category neglect creates some originality; the investor list removes most of it."),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Financing rounds, lead investors, total funding, the physician-supervised model, and the operating metrics are supported by the company's own announcement with independent trade press corroboration. Founder status, founding year, revenue, pricing, and any clinical outcome data are not disclosed, and the resolution rate and savings figures are self-reported without a published methodology.",
    sourceIds: ["counsel-seriesa", "counsel-a16z", "counsel-hit"],
    lastReviewed: REVIEWED,
  },

  /* -------------------------------------------- Conceivable Life Sciences */
  {
    id: "conceivable-life-sciences",
    name: "Conceivable Life Sciences",
    website: "https://conceivable.life",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series A announced September 2025 as a private financing, with no listing or acquisition notice.",
    headquarters: "New York, New York, United States",
    region: "North America",
    foundedYear: NOT_DISCLOSED,
    founders: [],
    sector: "Healthcare Technology",
    subsector: "Automated in vitro fertilisation laboratory systems",
    description:
      "Automates the laboratory steps of in vitro fertilisation through a system called AURA, so that procedures depending on individual embryologist skill are performed by instrumentation instead.",
    targetCustomer:
      "Fertility clinics and laboratory networks constrained by embryologist availability.",
    businessModel: NOT_DISCLOSED,
    technicalDifferentiation:
      "Automating the laboratory procedure itself rather than adding decision support around it, which is the difference between relieving the constraint and observing it.",
    tractionSignal:
      "The company reports 18 healthy babies born from an earlier prototype study and an ongoing 100 patient pilot trial, with United States commercial availability planned for early 2026.",
    recentCatalyst:
      "50 million dollar Series A led by Advance Venture Partners announced 15 September 2025, bringing total funding to 70 million dollars including a 20 million dollar seed round closed in December 2022.",
    primaryCompetitors: [
      "Manual embryology laboratories",
      "Fertility laboratory equipment manufacturers",
      "Embryo selection software vendors",
    ],
    mainTechnicalRisk:
      "Automated procedures have to match or exceed skilled manual outcomes on a clinical endpoint, and while live births from a prototype are reported, no comparative rate has been published.",
    mainCommercialRisk:
      "Clinics buy on comparative outcome rates, and none has been published.",
    mainFinancingRisk:
      "Instrumentation development and clinical evidence generation both precede revenue.",
    sourcing: {
      discoveryChannel: "Product launch",
      signalDate: "2025-09-01",
      signal: "Product launch",
      dateSourced: "2026-07-14",
      channel: "Clinical laboratory automation tracking",
      whyEntered:
        "The binding constraint in fertility treatment is embryologist supply, not clinic capacity or demand. A company automating the laboratory procedure is attacking the actual constraint rather than the visible one, and it has already produced live births from a prototype, which is a far higher bar than a demonstration.",
      whyTimely:
        "Fertility treatment demand continues to rise while embryologist training pipelines have not expanded, so the gap widens every year regardless of investment in clinics.",
      whyOverlooked:
        "Fertility technology is treated as a consumer health category, and laboratory instrumentation sits outside where most healthcare investors look.",
      whyNotObvious:
        "A search returns a fertility company. It does not distinguish a laboratory automation system from the patient-facing services that dominate the category.",
      evidenceNeeded:
        "Outcome rates from the 100 patient pilot against a manual comparator, and regulatory clearance status. Neither is public, and the first is decisive.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series A",
      disclosedRound: "Series A",
      latestRound:
        "50 million dollar Series A led by Advance Venture Partners with existing investors ARTIS Ventures, Stride, and ACME participating, bringing total funding to 70 million dollars including a 20 million dollar seed round closed in December 2022.",
      latestRoundDate: "2025-09-15",
      latestRoundSourceId: "conceivable-seriesa",
      totalDisclosedFunding: "70 million dollars",
      namedInvestors: [
        "Advance Venture Partners",
        "ARTIS Ventures",
        "Stride",
        "ACME",
      ],
      capitalIntensity: "High",
      futureCapitalRequirement:
        "High. Instrumentation development and clinical evidence generation are both expensive and sequential.",
      financingRisk:
        "Moderate. A substantial Series A against a long path to clinical evidence.",
      missingInformation: [
        "Revenue and named clinic deployments",
        "Pilot trial outcome rates against a manual comparator",
        "Regulatory clearance status",
        "Founders and founding year",
      ],
    },
    technology: {
      howItWorks:
        "The AURA platform performs the laboratory steps of in vitro fertilisation under robotic and algorithmic control rather than by hand, with the company describing more than 200 intricate steps standardised to remove the variability that comes from individual embryologist technique.",
      coreAdvantage:
        "Consistency. If the procedure is instrument-controlled, outcome variance across operators and sites collapses, which is the argument the whole business rests on.",
      supportingEvidence: [
        {
          claim:
            "The AURA platform standardises more than 200 laboratory steps, and the Series A of 50 million dollars was led by Advance Venture Partners.",
          sourceId: "conceivable-seriesa",
          basis: "verified",
        },
        {
          claim:
            "18 healthy babies were born from an earlier prototype study, and a 100 patient pilot trial is under way.",
          sourceId: "conceivable-femtech",
          basis: "verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Precision instrumentation supply chains and clinical partner sites.",
      milestoneForScale:
        "Completion of the 100 patient pilot with outcome rates published against a manual comparator, since the prototype births establish feasibility but not comparative performance.",
      failurePoints: [
        "Automated outcomes below skilled manual outcomes",
        "Regulatory pathway longer than anticipated",
        "Clinics unwilling to change established laboratory practice",
      ],
    },
    market: {
      painPoint:
        "Fertility treatment capacity is limited by the number of trained embryologists, and outcomes vary with individual technique.",
      structure:
        "Fertility clinics and laboratory networks, an increasingly consolidated buyer set.",
      adoptionDrivers: [
        "Rising fertility treatment demand",
        "Embryologist shortage and outcome variability",
      ],
      competitors: [
        "Manual embryology",
        "Laboratory equipment manufacturers",
      ],
      substitutes: ["Training more embryologists", "Referring patients elsewhere"],
      regulatoryEnvironment:
        "Clinical laboratory and medical device requirements apply to instrumentation performing procedures.",
      maturity: "Emerging",
      currentCatalyst:
        "The Series A funding development and clinical validation.",
    },
    commercial: {
      customerType: "Fertility clinics and laboratory networks.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: NOT_DISCLOSED,
      adoptionEvidence: [
        {
          claim:
            "United States commercial availability planned for early 2026. No named clinic deployments or revenue are disclosed.",
          sourceId: "conceivable-femtech",
          basis: "verified",
        },
      ],
      implementationBurden:
        "High. Installing instrumentation into a clinical laboratory and revalidating procedures.",
      expansionOpportunity:
        "Additional laboratory procedures within the same instrumentation platform.",
      goToMarketRisk:
        "Clinics will not change laboratory practice without outcome data, and none is published.",
    },
    investment: {
      thesis:
        "Automation aimed at the actual constraint in fertility treatment rather than the visible one, at a stage where the clinical evidence that decides everything does not yet exist publicly.",
      bullCase:
        "Pilot outcomes match or beat skilled manual procedures, and laboratory capacity stops being bounded by embryologist supply.",
      baseCase:
        "A long clinical validation path with adoption following the data slowly.",
      bearCase:
        "Pilot outcomes fall short of skilled manual work and clinics have no reason to change.",
      catalysts: [
        "Published outcome rates from the 100 patient pilot",
        "Regulatory clearance",
        "A first named clinic deployment",
      ],
      risks: [
        "No comparative outcome data against skilled manual work",
        "Regulatory pathway uncertainty",
        "Clinical practice inertia",
      ],
      invalidators: [
        "Pilot outcome rates below those of skilled manual procedures",
        "A regulatory pathway materially longer than planned",
      ],
      recommendedNextStep:
        "Request the pilot trial outcome rates against a manual comparator. Live births from a prototype prove the system can work; only the comparator says whether it should replace an embryologist.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "Which of the more than 200 laboratory steps are fully automated, and which still require an embryologist?",
      ],
      product: [
        "What are the pilot trial outcome rates, and against what manual comparator?",
      ],
      customers: ["Which clinics have installed the system, and at what volume?"],
      competition: [
        "What automation do the established fertility equipment manufacturers offer?",
      ],
      unitEconomics: ["What is the system cost, and how is it priced to clinics?"],
      capitalRequirements: [
        "What does the Series A fund, and what is required to reach clinical evidence?",
      ],
      regulation: [
        "What regulatory classification applies, and what clearance has been obtained?",
      ],
      team: ["Who founded the company, and who leads clinical and regulatory work?"],
      financing: ["What is total capital raised, and what is the runway?"],
      commercialization: ["What is the sales cycle for a clinical laboratory installation?"],
    },
    outreach:
      "I have been researching capacity constraints in fertility treatment, and the observation that the limit is embryologist supply rather than clinic capacity is what led me to Conceivable. Automating the laboratory procedure itself is a much harder path than adding software around it, and it is the only one that actually relieves the constraint. Live births from the prototype study are a far higher bar than most automation companies clear. I would like to understand how the pilot outcome rates compare with skilled manual procedures. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(4, "judgment", "Medium",
        "Automating the laboratory procedure itself rather than providing decision support around it.",
        "A materially harder and more consequential approach than the category norm."),
      technicalEvidence: fa(3, "verified", "Medium",
        "18 healthy babies born from an earlier prototype study and a 100 patient pilot trial under way, with no outcome rates published against a manual comparator.",
        "Live births establish feasibility, which is far from nothing, but comparative performance is unpublished.", "conceivable-femtech"),
      defensibility: fa(3, "judgment", "Low",
        "Instrumentation design and eventual clinical evidence would both be hard to reproduce, and neither is established.",
        "Prospective."),
      marketImportance: fa(4, "judgment", "Medium",
        "Fertility treatment demand is rising against a fixed embryologist supply.",
        "A real and widening structural constraint."),
      commercialReadiness: fa(2, "verified", "Medium",
        "United States commercial availability planned for early 2026, with no disclosed deployments, revenue, pricing, or clearance status.",
        "Approaching commercial with the record still unproven.", "conceivable-femtech"),
      customerEvidence: fa(2, "verified", "Low",
        "A 100 patient pilot trial under way, with no named clinic partner or deployment disclosed.",
        "Patients in a trial are not customers, but they are more than nothing.", "conceivable-femtech"),
      teamCredibility: fa(2, "judgment", "Low",
        "Founders, founding year, and clinical leadership are not established from a primary source.",
        "Rated on incomplete public information."),
      capitalEfficiency: fa(3, "judgment", "Medium",
        "70 million dollars raised since 2022, reaching live births from a prototype and a 100 patient pilot.",
        "Reasonable for clinical instrumentation, which is capital hungry by nature."),
      competitiveIntensity: fa(4, "judgment", "Medium",
        "No direct competitor automating the procedure at this scope, though equipment manufacturers are adjacent.",
        "The specific position is largely uncontested."),
      financingRisk: fa(3, "verified", "Medium",
        "70 million dollars raised in total against a long clinical validation and instrumentation path.",
        "Adequate for now, with a demanding capital path ahead.", "conceivable-seriesa"),
      regulatoryRisk: fa(2, "judgment", "Medium",
        "Instrumentation performing clinical procedures faces device and laboratory requirements, with no clearance status disclosed.",
        "High, and made higher by the absence of public information about the pathway."),
      sourcingOriginality: fa(5, "judgment", "Medium",
        "Fertility laboratory instrumentation sits outside both consumer health and conventional medical device coverage.",
        "Genuinely under-examined."),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "The Series A, its investors, total funding, the AURA platform description, the prototype births, and the pilot trial are supported by the company's own announcement with independent trade press corroboration. Founders, founding year, named deployments, revenue, comparative outcome rates, and regulatory clearance status are not disclosed.",
    sourceIds: ["conceivable-seriesa", "conceivable-femtech"],
    lastReviewed: REVIEWED,
  },

  /* -------------------------------------------------------- Basecamp Research */
  {
    id: "basecamp-research",
    name: "Basecamp Research",
    website: "https://www.basecamp-research.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series B announced October 2024 as a private financing, with no listing or acquisition notice.",
    headquarters: "London, United Kingdom",
    region: "Europe",
    foundedYear: NOT_DISCLOSED,
    founders: ["Glen Gowers", "Oliver Vince"],
    sector: "Biotechnology & Research Tools",
    subsector: "Biodiversity-derived protein datasets",
    description:
      "Collects biological samples from extreme and under-sampled environments worldwide and builds a proprietary protein and genome dataset from them, on the argument that public sequence databases represent a narrow slice of actual biology.",
    targetCustomer:
      "Pharmaceutical, industrial biotechnology, and machine learning organisations training or searching over protein data.",
    businessModel:
      "Data licensing and partnership arrangements with organisations using the dataset.",
    technicalDifferentiation:
      "The dataset is the asset. Models are increasingly commoditised while novel sequence data from environments nobody has sampled is not reproducible without repeating the fieldwork.",
    tractionSignal:
      "A genetic medicine collaboration with an academic laboratory was announced alongside the Series B, and the company works with more than 100 biodiversity partners worldwide.",
    recentCatalyst:
      "60 million dollar Series B led by Singular announced 9 October 2024, alongside a genetic medicine research collaboration, followed by the BaseData product emerging from stealth in June 2025.",
    primaryCompetitors: [
      "Public sequence databases",
      "Protein structure prediction model providers",
      "Internal pharmaceutical discovery datasets",
    ],
    mainTechnicalRisk:
      "Novel sequences are only valuable if they produce functionally useful proteins, and novelty alone does not establish utility.",
    mainCommercialRisk:
      "Data licensing to a small number of large buyers concentrates revenue and gives each buyer significant leverage.",
    mainFinancingRisk:
      "Field collection is an ongoing operating cost rather than a one-time investment.",
    sourcing: {
      discoveryChannel: "Research publication",
      signalDate: "2025-06-01",
      signal: "Research publication",
      dateSourced: "2026-05-28",
      channel: "Biological dataset and sequence novelty tracking",
      whyEntered:
        "Almost every biological machine learning company is building models on the same public sequence databases. A company building a proprietary dataset from environments nobody has sampled, through partnerships with more than 100 biodiversity partners, is competing on the input rather than the architecture, which is the more durable position if the data genuinely differs.",
      whyTimely:
        "Protein model architectures are converging in performance, which shifts the advantage to whoever has data others cannot obtain.",
      whyOverlooked:
        "Field sample collection with partner nations is operationally unglamorous and slow, and looks like logistics rather than technology from the outside.",
      whyNotObvious:
        "A search files this as a biotechnology company. The interesting claim is about data acquisition strategy, which does not appear in a sector classification.",
      evidenceNeeded:
        "Independent evidence that the proprietary sequences yield functionally superior proteins, and disclosed licensing revenue.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series B",
      disclosedRound: "Series B",
      latestRound:
        "60 million dollar Series B led by Singular, with S32, redalpine, and existing investors True Ventures and Hummingbird Ventures participating alongside several individual investors.",
      latestRoundDate: "2024-10-09",
      latestRoundSourceId: "basecamp-release",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "Singular",
        "S32",
        "redalpine",
        "True Ventures",
        "Hummingbird Ventures",
      ],
      capitalIntensity: "High",
      futureCapitalRequirement:
        "High. Global field collection is a continuing operating cost, and the company has stated it intends to increase collection investment substantially.",
      financingRisk:
        "Moderate. Well funded, with the most recent disclosure now over eighteen months old.",
      missingInformation: [
        "Revenue and licensing terms",
        "Commercial customer names",
        "Founding year",
        "Total capital raised",
        "Any financing after October 2024",
      ],
    },
    technology: {
      howItWorks:
        "Samples are collected from extreme environments under agreements with the countries they come from, sequenced, and assembled into a protein and genome dataset with associated environmental context.",
      coreAdvantage:
        "Sequence data from environments that are not represented in public databases, which cannot be reproduced without repeating the collection.",
      supportingEvidence: [
        {
          claim:
            "A 60 million dollar Series B led by Singular, announced alongside a genetic medicine research collaboration with an academic laboratory.",
          sourceId: "basecamp-release",
          basis: "verified",
        },
        {
          claim:
            "The company states its foundational dataset contains 100 times more advanced biological systems than the public databases pharmaceutical researchers use most, and that it works with more than 100 biodiversity partners worldwide.",
          sourceId: "basecamp-sifted",
          basis: "verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty:
        "The dataset itself, held under collection agreements with sampled countries.",
      thirdPartyDependency:
        "National partner agreements for sample access, and sequencing capacity.",
      milestoneForScale:
        "Independent demonstration that proteins found only in this dataset outperform the best public alternative on a real application, since the scale claim is established and the functional claim is not.",
      failurePoints: [
        "Novel sequences proving functionally unremarkable",
        "Benefit-sharing or biodiversity access terms changing",
        "Public databases expanding into the same environments",
      ],
    },
    market: {
      painPoint:
        "Protein discovery and model training rest on public sequence databases that represent a small and biased sample of actual biological diversity.",
      structure:
        "A small number of large pharmaceutical, industrial, and machine learning buyers.",
      adoptionDrivers: [
        "Convergence in protein model performance shifting advantage to data",
        "Demand for novel functional proteins in industrial and therapeutic applications",
      ],
      competitors: [
        "Public sequence databases",
        "Internal pharmaceutical datasets",
      ],
      substitutes: ["Public data", "Computational protein generation"],
      regulatoryEnvironment:
        "International biodiversity access and benefit-sharing frameworks govern sample collection and use.",
      maturity: "Emerging",
      currentCatalyst:
        "Protein model architectures converging, which raises the value of proprietary data.",
    },
    commercial: {
      customerType:
        "Pharmaceutical, industrial biotechnology, and machine learning organisations.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: "Direct partnership and licensing negotiation.",
      adoptionEvidence: [
        {
          claim:
            "A genetic medicine research collaboration was announced with the Series B. No commercial customers, licensing terms, or revenue are disclosed.",
          sourceId: "basecamp-release",
          basis: "verified",
        },
      ],
      implementationBurden:
        "Low for the customer. The product is data.",
      expansionOpportunity:
        "Continued collection expanding the dataset's coverage and therefore its value.",
      goToMarketRisk:
        "Few buyers, each with substantial negotiating leverage.",
    },
    investment: {
      thesis:
        "Competing on the input rather than the model, in a field where architectures are converging and proprietary data is the remaining durable advantage, with the functional value of that data not yet independently demonstrated.",
      bullCase:
        "The dataset yields functionally superior proteins, and the collection agreements make the position genuinely hard to reproduce.",
      baseCase:
        "A valuable specialist dataset licensed to a handful of large partners.",
      bearCase:
        "Novelty does not translate into function, and public data plus better models close the gap.",
      catalysts: [
        "A published result showing functional advantage from the proprietary data",
        "A named licensing partnership with disclosed terms",
      ],
      risks: [
        "Novelty without demonstrated function",
        "Buyer concentration",
        "Biodiversity access frameworks changing",
      ],
      invalidators: [
        "Independent work showing no functional advantage over public data",
        "Loss of collection access in key territories",
      ],
      recommendedNextStep:
        "Seek evidence that a protein found only in this dataset outperformed the best public alternative on a real application. Novelty is measurable and function is what is being sold.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What proportion of collected sequences have no close homolog in public databases?",
      ],
      product: ["How is the dataset delivered and searched by a customer?"],
      customers: ["Which organisations have licensed the dataset, and on what terms?"],
      competition: [
        "How quickly are public databases expanding into similar environments?",
      ],
      unitEconomics: ["What does it cost to collect and sequence a new sample site?"],
      capitalRequirements: ["What is the annual field collection budget?"],
      regulation: [
        "What benefit-sharing obligations attach to samples, and how are they enforced?",
      ],
      team: ["What is the founding year, and how large is the field operation?"],
      financing: [
        "Has any financing closed since October 2024, and what is licensing revenue?",
      ],
      commercialization: ["What is the typical licensing deal size and duration?"],
    },
    outreach:
      "I have been researching where durable advantage sits in biological machine learning, and the argument that it is the data rather than the architecture seems increasingly right as model performance converges. Collecting from environments that are not in the public databases is a slow and operationally difficult way to build that advantage, which is presumably why few others are doing it. I would like to understand how you measure functional advantage rather than just novelty. Would you be open to a call?",
    factors: {
      technicalDifferentiation: fa(4, "verified", "Medium",
        "A proprietary dataset built from under-sampled environments, rather than models trained on public sequence data.",
        "A genuinely different strategic position in a field where most companies share inputs.", "basecamp-sifted"),
      technicalEvidence: fa(3, "verified", "Medium",
        "A stated 100 times scale advantage over the most-used public databases, more than 100 biodiversity partners, and a genetic medicine collaboration with an academic laboratory. No published evidence that the data yields functionally superior proteins.",
        "Scale and a research partner are evidenced; functional advantage is not.", "basecamp-sifted"),
      defensibility: fa(4, "judgment", "Medium",
        "Collection agreements and accumulated field operations that cannot be reproduced without repeating the work.",
        "Strong if the data proves functionally valuable, worth little if it does not."),
      marketImportance: fa(3, "judgment", "Medium",
        "Protein discovery matters across therapeutics and industrial biotechnology, with a small buyer set.",
        "Important scientifically, concentrated commercially."),
      commercialReadiness: fa(2, "verified", "Low",
        "A product out of stealth in June 2025 and a research collaboration, with no disclosed commercial customers or licensing revenue.",
        "Early commercially.", "basecamp-release"),
      customerEvidence: fa(2, "verified", "Low",
        "A named academic research collaboration and more than 100 biodiversity partners, with no commercial customer or licensing arrangement disclosed.",
        "Partnerships are not revenue, but a research collaboration is external validation.", "basecamp-release"),
      teamCredibility: fa(4, "verified", "Medium",
        "Two named co-founders with a field expedition background behind the collection strategy, and a genetic medicine collaboration with an academic laboratory. Founding year not established.",
        "Founders confirmed and relevant, with an academic partner as external endorsement.", "basecamp-sifted"),
      capitalEfficiency: fa(2, "judgment", "Low",
        "60 million dollars raised at Series B with no disclosed revenue, and a stated plan to increase collection investment tenfold.",
        "Cannot be assessed, and field collection is inherently capital hungry."),
      competitiveIntensity: fa(4, "judgment", "Medium",
        "No direct competitor pursuing proprietary biodiversity collection at this scale.",
        "The specific strategy is largely uncontested."),
      financingRisk: fa(3, "verified", "Medium",
        "60 million dollar Series B against continuing field collection costs and a stated tenfold increase in collection investment, with the last disclosure over eighteen months old.",
        "Moderate, with the age of the data point a real uncertainty.", "basecamp-release"),
      regulatoryRisk: fa(2, "verified", "Medium",
        "International biodiversity access and benefit-sharing frameworks govern the core asset directly.",
        "The regulatory framework applies to the asset itself, not to a product built from it."),
      sourcingOriginality: fa(4, "judgment", "Medium",
        "Field collection operations look like logistics from the outside, which keeps attention away.",
        "Under-examined relative to the strategic position."),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Founders, headquarters, financing, investors, the research collaboration, and the dataset strategy are supported by the company's own announcement with corroboration from two independent European technology publications. Founding year, revenue, commercial customers, licensing terms, total capital raised, and any evidence of functional advantage are not disclosed.",
    sourceIds: ["basecamp-release", "basecamp-sifted"],
    lastReviewed: REVIEWED,
  },
];

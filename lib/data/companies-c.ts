import { fa, NOT_DISCLOSED, type PrivateCompany } from "../types";

/** Verified private companies, part three. See companies-a.ts for the data policy. */

const REVIEWED = "2026-07-30";

export const COMPANIES_C: PrivateCompany[] = [
  /* ---------------------------------------------------------- Path Robotics */
  {
    id: "path-robotics",
    name: "Path Robotics",
    website: "https://www.path-robotics.com/about",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series D reported as a private financing, with no listing or acquisition notice.",
    headquarters: "Columbus, Ohio, United States",
    region: "North America",
    foundedYear: 2018,
    founders: ["Andy Lonsberry", "Alex Lonsberry"],
    sector: "Robotics & Autonomy",
    subsector: "Autonomous robotic welding",
    description:
      "Builds robotic welding cells that scan a part, plan the weld, and execute it without programming, aimed at fabricators who cannot hire enough welders.",
    targetCustomer:
      "Metal fabricators and manufacturers running high-mix, low-volume welding work.",
    businessModel: "Sale of robotic welding cells with accompanying software.",
    technicalDifferentiation:
      "Perception and planning that tolerate the part-to-part variation of real fabrication, which is what defeats conventional programmed welding robots.",
    tractionSignal:
      "Two products shipping, the AW-3 handling parts up to seventy feet and the AF-1 performing pick, fit, and weld without human intervention.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "Series D of 100 million dollars led by Matter Venture Partners and Drive Capital.",
    primaryCompetitors: [
      "Established industrial robot manufacturers",
      "Systems integrators building bespoke welding fixtures",
    ],
    mainTechnicalRisk:
      "Perception reliability across the full range of part geometry and surface condition found in real fabrication shops.",
    mainCommercialRisk:
      "Fabricators buy capital equipment slowly and in small increments, so revenue growth is structurally gradual.",
    mainFinancingRisk:
      "Hardware manufacturing capacity must be funded ahead of orders.",
    sourcing: {
      discoveryChannel: "Industry event",
      signalDate: "2025-03-04",
      signal: "Industry bottleneck",
      dateSourced: "2026-04-10",
      channel: "Manufacturing labour constraint scan",
      whyEntered:
        "The skilled welder shortage is a documented and worsening constraint on North American fabrication capacity, and this is one of very few companies attacking it with autonomy rather than with better programming tools. The founders welded before they built robots, which is an unusual and relevant background.",
      whyTimely:
        "Perception and planning have improved enough that high-mix welding is approachable, and the labour shortage has become severe enough that fabricators are willing to change how they work.",
      whyOverlooked:
        "Located outside the major venture hubs, selling into a slow-moving industry, and working on a category that is unglamorous relative to humanoid robotics, which absorbs most robotics attention.",
      whyNotObvious:
        "Columbus-based, selling into fabrication, in a robotics category that funding databases file alongside far more visible humanoid companies.",
      evidenceNeeded:
        "The deployment time for a second cell at an existing customer compared with the first, which distinguishes a product from a consultancy.",
      wellRecognised: false,
    },
    financing: {
      stage: "Later stage",
      disclosedRound: "Series D",
      latestRound:
        "100 million dollar Series D led by Matter Venture Partners and Drive Capital.",
      latestRoundDate: "2025-03-04",
      latestRoundSourceId: "path-robotreport",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "Matter Venture Partners",
        "Drive Capital",
        "Yamaha Ventures",
        "Taiwania Capital",
        "MediaTek",
        "Addition",
        "Tiger Global",
      ],
      capitalIntensity: "High",
      futureCapitalRequirement:
        "Manufacturing and field service capacity ahead of order growth.",
      financingRisk:
        "Moderate. Recently funded, in a category where customer purchasing is slow.",
      missingInformation: [
        "Revenue",
        "Unit shipments and installed base",
        "Total capital raised across all rounds",
      ],
    },
    technology: {
      howItWorks:
        "The cell scans the actual part in front of it, builds a model of the weld path from that scan rather than from a drawing, and executes the weld. Nothing is taught by an operator.",
      coreAdvantage:
        "Tolerating variation. Conventional welding robots require parts to arrive identically positioned, which high-mix fabrication does not provide.",
      supportingEvidence: [
        {
          claim:
            "Two robotic welding products in market, the AW-3 and AF-1, with the AF-1 performing pick, fit, and weld without human intervention.",
          sourceId: "path-robotreport",
          basis: "verified",
          provenance: "Independently verified",
        },
        {
          claim:
            "Founded in 2018 by brothers Andy and Alex Lonsberry, who welded before earning doctorates and building the company.",
          sourceId: "path-site",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Robot arms, sensors, and welding power sources sourced from third parties.",
      milestoneForScale:
        "Evidence that the second cell at a customer deploys materially faster than the first, which distinguishes a product from a project.",
      failurePoints: [
        "Perception failing on surface conditions or geometries outside the training distribution",
        "Deployment engineering cost per customer failing to fall",
        "Incumbent robot manufacturers adding adequate adaptive welding",
      ],
    },
    market: {
      painPoint:
        "Fabricators turn down work because they cannot hire welders, and conventional automation cannot handle high-mix parts.",
      structure:
        "Highly fragmented buyers with capital equipment budgets and long purchasing cycles.",
      adoptionDrivers: [
        "A documented and worsening skilled welder shortage",
        "High-mix production defeating conventional programmed automation",
      ],
      competitors: [
        "Established industrial robot manufacturers",
        "Systems integrators building bespoke fixtures",
      ],
      substitutes: ["Hiring more welders", "Declining work the shop cannot staff"],
      regulatoryEnvironment:
        "Machinery safety standards apply and are certified per configuration.",
      maturity: "Developing",
      currentCatalyst:
        "Series D funding aimed explicitly at scaling AI-enabled robotic welding.",
    },
    commercial: {
      customerType: "Manufacturing engineering leadership at fabricators.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Capital equipment sales with an engineering evaluation stage.",
      adoptionEvidence: [
        {
          claim: "Two products commercially available and in market.",
          sourceId: "path-robotreport",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      implementationBurden:
        "Substantial. Installing a welding cell changes shop floor workflow.",
      expansionOpportunity:
        "Additional cells within customers who have installed a first one.",
      goToMarketRisk:
        "Customers expect capital equipment suppliers to still exist in ten years, which disadvantages a venture-backed company.",
    },
    investment: {
      thesis:
        "A credible autonomy approach aimed at a documented labour constraint, from founders with direct trade experience, in a category and geography that attract little venture attention.",
      bullCase:
        "Deployment cost per cell falls sharply with the accumulated part library, and the company becomes the default answer to high-mix welding.",
      baseCase:
        "Steady capital equipment sales into a fragmented market, producing a solid outcome over a long period.",
      bearCase:
        "Each deployment stays bespoke, and incumbent robot manufacturers add sufficient adaptive capability to existing platforms.",
      catalysts: [
        "Evidence of falling deployment time per cell",
        "A multi-cell order from a single customer",
      ],
      risks: [
        "Slow industrial purchasing cycles",
        "Deployment engineering cost per customer",
        "Incumbent platform response",
      ],
      invalidators: [
        "Second-cell deployment time failing to improve on the first",
        "An incumbent shipping comparable adaptive welding as standard",
      ],
      recommendedNextStep:
        "Ask a customer, not the company, how long the second cell took to deploy against the first. That ratio determines whether this scales.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "On what part geometries or surface conditions does the perception system currently fail?",
      ],
      product: [
        "How long does a new part family take to become weldable without engineering support?",
      ],
      customers: [
        "How many customers have bought a second cell, and what triggered it?",
      ],
      competition: [
        "What adaptive welding capability do incumbent robot platforms offer today?",
      ],
      unitEconomics: [
        "What is the gross margin per cell after installation and commissioning?",
      ],
      capitalRequirements: [
        "What manufacturing capacity is required to meet current order growth?",
      ],
      regulation: [
        "What machinery safety certification is required per configuration, and how long does it take?",
      ],
      team: [
        "Who on the team has scaled industrial capital equipment manufacturing before?",
      ],
      financing: [
        "What is total capital raised, and what is the current runway?",
      ],
      commercialization: [
        "What is the time from first evaluation to purchase order?",
      ],
    },
    outreach:
      "I have been researching companies working on the skilled trades labour constraint, and the fact that you welded before you built welding robots is the detail that made me want to reach out. It shows in the decision to scan the actual part rather than trust the drawing, which is the assumption that breaks conventional automation on a real shop floor. I would like to understand how deployment time for a second cell compares with the first. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(
        4,
        "verified",
        "Medium",
        "Scan-and-plan welding that tolerates part variation, shipped as two distinct products.",
        "A real capability difference from programmed industrial welding.",
        "path-robotreport",
      ),
      technicalEvidence: fa(
        4,
        "verified",
        "Medium",
        "Two products commercially available and independently described by robotics trade press.",
        "Shipping product is strong evidence. No published performance data is available.",
        "path-robotreport",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Medium",
        "Accumulated part and weld data, against incumbents who own the robot platforms.",
        "Moderate. Controlling software but not the arm is a structural weakness.",
      ),
      marketImportance: fa(
        4,
        "verified",
        "High",
        "The welder shortage is a documented constraint on fabrication capacity.",
        "A genuine and worsening industrial bottleneck.",
      ),
      commercialReadiness: fa(
        4,
        "verified",
        "Medium",
        "Two products in market and a Series D raised to scale them.",
        "Genuinely commercial.",
        "path-robotreport",
      ),
      customerEvidence: fa(
        3,
        "judgment",
        "Low",
        "Products are in market, but no customer names, unit volumes, or revenue are disclosed.",
        "Rated on what is public. The commercial record is thinner than the product record.",
      ),
      teamCredibility: fa(
        5,
        "verified",
        "High",
        "Founded by brothers who welded in their youth and later earned doctorates in the relevant field.",
        "An unusually direct match between founder background and problem.",
        "path-site",
      ),
      capitalEfficiency: fa(
        3,
        "judgment",
        "Low",
        "Four rounds through Series D, with total raised not disclosed.",
        "Reasonable for hardware, not fully assessable.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Medium",
        "Incumbent robot manufacturers are adjacent but none focuses on autonomous high-mix welding.",
        "The specific position is currently uncontested.",
      ),
      financingRisk: fa(
        3,
        "verified",
        "Medium",
        "Recent Series D with named institutional and strategic investors.",
        "Comfortable near term, with manufacturing investment still ahead of orders.",
        "path-robotreport",
      ),
      regulatoryRisk: fa(
        4,
        "judgment",
        "Medium",
        "Machinery safety standards are well established and routinely met.",
        "Low and predictable.",
      ),
      sourcingOriginality: fa(
        5,
        "judgment",
        "High",
        "Columbus based, selling into fabrication, in a robotics category that attracts a fraction of the attention given to humanoids.",
        "Among the most genuinely under-examined positions in the universe.",
      ),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Founders, founding year, headquarters, products, and the Series D are supported by the company site and independent robotics trade press. Revenue, unit volumes, customer names, and total capital raised are not disclosed.",
    sourceIds: ["path-site", "path-robotreport"],
    lastReviewed: REVIEWED,
  },

  /* -------------------------------------------------- Collaborative Robotics */
  {
    id: "collaborative-robotics",
    name: "Collaborative Robotics",
    website: "https://www.co.bot/news",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series B announced April 2024 as a private financing, with no listing or acquisition notice.",
    headquarters: "Santa Clara, California, United States",
    region: "North America",
    foundedYear: 2022,
    founders: ["Brad Porter"],
    sector: "Robotics & Autonomy",
    subsector: "Mobile collaborative robots",
    description:
      "Builds a mobile collaborative robot designed to work alongside people in logistics and healthcare settings without the safety caging conventional industrial robots require.",
    targetCustomer:
      "Logistics operators and health systems moving material through shared human spaces.",
    businessModel: NOT_DISCLOSED,
    technicalDifferentiation:
      "A form factor and safety design intended for shared human environments rather than an industrial arm adapted to them.",
    tractionSignal: NOT_DISCLOSED,
    tractionProvenance: "Not sufficiently supported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "Series B of 100 million dollars led by General Catalyst in April 2024, bringing total capital raised to more than 140 million dollars in under two years.",
    primaryCompetitors: [
      "Established autonomous mobile robot vendors",
      "Humanoid robotics companies",
      "Incumbent material handling automation",
    ],
    mainTechnicalRisk:
      "Operating safely and reliably around people is a certification and reliability problem as much as an autonomy problem.",
    mainCommercialRisk:
      "No customer names, deployment counts, or revenue are publicly disclosed, so commercial progress cannot be assessed externally.",
    mainFinancingRisk:
      "Raised quickly at an early stage, which sets a high bar for the next round.",
    sourcing: {
      discoveryChannel: "Founder research",
      signalDate: "2024-04-16",
      signal: "Founder background",
      dateSourced: "2026-03-18",
      channel: "Robotics founder and operating background scan",
      whyEntered:
        "Founded by the former head of Amazon Robotics, who has operated one of the largest deployed robot fleets in existence. In a category where most failures are operational rather than technical, that specific background is the signal.",
      whyTimely:
        "Labour availability in logistics and healthcare material handling continues to tighten, and collaborative safety standards have matured enough to make shared-space deployment practical.",
      whyOverlooked:
        "Discloses very little publicly, and the robotics conversation is dominated by humanoid form factors, which draws attention away from purpose-built mobile robots.",
      whyNotObvious:
        "The company discloses almost nothing, so a database search returns a funding row and a two-year-old date with no way to tell whether anything has happened since.",
      evidenceNeeded:
        "Any financing after April 2024, and a named multi-site customer deployment.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series B",
      disclosedRound: "Series B",
      latestRound:
        "100 million dollar Series B led by General Catalyst, announced 16 April 2024, bringing total capital raised to more than 140 million dollars.",
      latestRoundDate: "2024-04-16",
      latestRoundSourceId: "cobot-prnewswire",
      totalDisclosedFunding: "More than 140 million dollars",
      namedInvestors: [
        "General Catalyst",
        "Sequoia Capital",
        "Khosla Ventures",
        "Bison Ventures",
        "Lux Capital",
        "Mayo Clinic",
        "Industry Ventures",
      ],
      capitalIntensity: "High",
      futureCapitalRequirement:
        "Manufacturing and field service capacity ahead of deployment growth.",
      financingRisk:
        "Moderate. Well funded for the stage, with the most recent disclosed round now more than two years old.",
      missingInformation: [
        "Revenue",
        "Customer names and deployment counts",
        "Any financing after April 2024",
        "Business model and pricing",
      ],
    },
    technology: {
      howItWorks:
        "A mobile robot navigates shared human environments and moves material between locations, designed from the outset for operation without safety caging.",
      coreAdvantage:
        "Designed for the environment rather than adapted to it, which affects safety certification, footprint, and how people around it behave.",
      supportingEvidence: [
        {
          claim:
            "Series B of 100 million dollars with named institutional investors and the Mayo Clinic participating.",
          sourceId: "cobot-prnewswire",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Founded in 2022 by Brad Porter, previously vice president of robotics at Amazon.",
          sourceId: "cobot-prnewswire",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Sensors, compute, and contract manufacturing sourced externally.",
      milestoneForScale:
        "A disclosed multi-site deployment at a named customer, which would move the record from funding to adoption.",
      failurePoints: [
        "Safety certification across varied deployment environments",
        "Reliability in unstructured shared spaces over long duty cycles",
        "Better-funded humanoid programmes absorbing the same budgets",
      ],
    },
    market: {
      painPoint:
        "Moving material through spaces occupied by people is labour intensive and poorly served by caged industrial automation.",
      structure:
        "Enterprise logistics and health system buyers with long procurement cycles.",
      adoptionDrivers: [
        "Labour availability in material handling",
        "Collaborative safety standards maturing",
      ],
      competitors: [
        "Established autonomous mobile robot vendors",
        "Humanoid robotics companies",
      ],
      substitutes: ["Human material handling", "Fixed conveyance automation"],
      regulatoryEnvironment:
        "Machinery and collaborative robot safety standards apply per deployment configuration.",
      maturity: "Emerging",
      currentCatalyst:
        "A strategic healthcare investor on the cap table, which suggests a defined clinical deployment path.",
    },
    commercial: {
      customerType: "Logistics operators and health systems.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: NOT_DISCLOSED,
      adoptionEvidence: [
        {
          claim:
            "The Mayo Clinic participated in the Series B as an investor, indicating a healthcare deployment interest.",
          sourceId: "cobot-prnewswire",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Moderate. Shared-space deployment requires site survey and safety assessment.",
      expansionOpportunity:
        "Fleet growth within sites that complete a first deployment.",
      goToMarketRisk:
        "Nothing about the commercial motion is public, so the outside view cannot separate progress from its absence.",
    },
    investment: {
      thesis:
        "An operator-founded robotics company attacking shared-space material handling, with a strategic healthcare investor and an unusually strong operating pedigree, and almost no public commercial disclosure.",
      bullCase:
        "The safety and form factor advantages convert into multi-site deployments, and the operating background shows up as deployment reliability rather than demonstrations.",
      baseCase:
        "Gradual adoption in defined verticals, with the company remaining well funded and quiet.",
      bearCase:
        "Deployment economics do not close, and humanoid programmes absorb both attention and budgets.",
      catalysts: [
        "A named multi-site customer deployment",
        "Any financing after April 2024, which would update a two-year-old reference point",
      ],
      risks: [
        "No public commercial evidence",
        "A disclosed funding record that is now dated",
        "Crowded and better-capitalised adjacent categories",
      ],
      invalidators: [
        "Another twelve months with no disclosed customer or financing",
        "A safety incident in a shared human environment",
      ],
      recommendedNextStep:
        "Establish whether any financing has occurred since April 2024. The most recent public data point is more than two years old, which is itself informative.",
      confidence: "Low",
    },
    diligence: {
      technology: [
        "What safety certification has been achieved, and for which deployment configurations?",
      ],
      product: [
        "What is the measured reliability over a full duty cycle in a live environment?",
      ],
      customers: [
        "Which customers are running deployments, at what scale, and for how long?",
      ],
      competition: [
        "How does the deployment economics compare with established autonomous mobile robot vendors?",
      ],
      unitEconomics: [
        "What is the cost per robot at current volume, and what is the pricing model?",
      ],
      capitalRequirements: [
        "What manufacturing capacity is in place, and what does scaling it cost?",
      ],
      regulation: [
        "What collaborative robot standards apply in healthcare settings specifically?",
      ],
      team: [
        "How much of the Amazon Robotics operating team came across, and in what roles?",
      ],
      financing: [
        "Has any round closed since April 2024, and on what terms?",
      ],
      commercialization: [
        "What is the business model, given none is publicly stated?",
      ],
    },
    outreach:
      "I have been researching robotics companies working on shared human environments rather than caged industrial cells, and your background running one of the largest deployed robot fleets anywhere is what made your approach interesting to me. Most failures in this category are operational rather than technical, and that is exactly the experience that is hardest to hire for. I would like to understand how the deployments are behaving over full duty cycles. Would you be open to a short call?",
    factors: {
      technicalDifferentiation: fa(
        3,
        "judgment",
        "Low",
        "A purpose-built collaborative mobile robot, with limited public technical detail available.",
        "Plausible differentiation that cannot be assessed properly from public information.",
      ),
      technicalEvidence: fa(
        2,
        "judgment",
        "Low",
        "No published benchmarks, deployment data, or safety certification detail.",
        "The evidence base is thin, and the rating says so rather than crediting the funding as proof.",
      ),
      defensibility: fa(
        2,
        "judgment",
        "Low",
        "No disclosed intellectual property or accumulated data asset.",
        "Cannot be substantiated from public sources.",
      ),
      marketImportance: fa(
        4,
        "judgment",
        "Medium",
        "Material handling in shared human spaces is a large and labour-constrained activity.",
        "The underlying need is real and well documented across logistics and healthcare.",
      ),
      commercialReadiness: fa(
        2,
        "judgment",
        "Low",
        "No disclosed customers, deployments, revenue, or pricing model.",
        "Rated on the public record only.",
      ),
      customerEvidence: fa(
        2,
        "verified",
        "Low",
        "A healthcare institution participated as an investor. No customer deployment is disclosed.",
        "Strategic investment signals interest, not adoption.",
        "cobot-prnewswire",
      ),
      teamCredibility: fa(
        5,
        "verified",
        "High",
        "Founded by the former vice president of robotics at Amazon, with backing from investors who know that record.",
        "One of the strongest operating pedigrees in the universe for this specific problem.",
        "cobot-prnewswire",
      ),
      capitalEfficiency: fa(
        3,
        "judgment",
        "Low",
        "More than 140 million dollars raised within two years of founding, with no disclosed commercial output.",
        "Cannot be judged without deployment data, so this is rated neutrally rather than favourably.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Medium",
        "Established mobile robot vendors on one side and heavily funded humanoid programmes on the other.",
        "Crowded from both directions.",
      ),
      financingRisk: fa(
        3,
        "judgment",
        "Low",
        "Well funded as of the last disclosure, which is now more than two years old.",
        "The age of the most recent data point is itself the risk.",
      ),
      regulatoryRisk: fa(
        3,
        "judgment",
        "Medium",
        "Collaborative robot safety standards apply, and healthcare settings add further requirements.",
        "Manageable but not trivial in clinical environments.",
      ),
      sourcingOriginality: fa(
        4,
        "judgment",
        "Medium",
        "Quiet company in a category overshadowed by humanoid robotics.",
        "Under-examined, partly by the company's own choice.",
      ),
    },
    dataConfidence: "Low",
    dataConfidenceNote:
      "Founder, founding year, headquarters, and the Series B are supported by the company's own announcement. Nothing commercial is disclosed, and the most recent public financing data point is from April 2024, so the record is marked low confidence.",
    sourceIds: ["cobot-prnewswire", "cobot-site"],
    lastReviewed: REVIEWED,
  },

  /* ---------------------------------------------------------------- Oxide */
  {
    id: "oxide-computer",
    name: "Oxide Computer Company",
    website: "https://oxide.computer",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series B announced July 2025 as a private financing, with no listing or acquisition notice.",
    headquarters: "Emeryville, California, United States",
    region: "North America",
    foundedYear: 2019,
    founders: ["Steve Tuck", "Bryan Cantrill"],
    sector: "Enterprise Infrastructure Software",
    subsector: "Integrated on-premise cloud infrastructure",
    description:
      "Builds a rack-scale computer that integrates compute, storage, networking, and control software, sold as a single system so that organisations can run cloud-style infrastructure they own.",
    targetCustomer:
      "Enterprises and research institutions with workloads that cannot or should not run in public cloud.",
    businessModel: "Sale of integrated rack-scale systems.",
    technicalDifferentiation:
      "Designing the hardware and the control plane together, including replacing the conventional server firmware stack, which no other vendor at this scale attempts.",
    tractionSignal:
      "Named customers displayed by the company include Lawrence Livermore National Laboratory, Idaho National Laboratory, Stoke Space, and Jump Trading.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "Series B of 100 million dollars led by Thomas Tull's US Innovative Technology Fund, announced 30 July 2025.",
    primaryCompetitors: [
      "Established server and converged infrastructure vendors",
      "Public cloud providers",
    ],
    mainTechnicalRisk:
      "Owning the entire stack including firmware means owning every defect in it, with no vendor to escalate to.",
    mainCommercialRisk:
      "A rack is a large, indivisible purchase, which lengthens sales cycles and concentrates revenue in few transactions.",
    mainFinancingRisk:
      "Hardware inventory and manufacturing working capital scale with orders.",
    sourcing: {
      discoveryChannel: "Customer signal",
      signalDate: "2025-07-30",
      signal: "Customer announcement",
      dateSourced: "2026-02-12",
      channel: "Enterprise infrastructure customer disclosure scan",
      whyEntered:
        "Two US national laboratories appear as named customers. Laboratory procurement is slow, technically adversarial, and hard to win, so a disclosed national laboratory customer is a much stronger signal than a typical enterprise logo.",
      whyTimely:
        "Data sovereignty requirements and the cost of sustained cloud workloads have made owned infrastructure a live consideration again, which was not true five years ago.",
      whyOverlooked:
        "Hardware companies selling to enterprises attract far less venture attention than software, and the company's technical audience is narrow even though the buyers are large.",
      whyNotObvious:
        "Databases classify this as a hardware company, which buries the more interesting fact that two US national laboratories chose it, and laboratory procurement is among the hardest to win.",
      evidenceNeeded:
        "Disclosed repeat rack orders from an existing customer, which would separate a product from a series of bespoke wins.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series B",
      disclosedRound: "Series B",
      latestRound:
        "100 million dollar Series B led by US Innovative Technology Fund, with participation from all existing investors.",
      latestRoundDate: "2025-07-30",
      latestRoundSourceId: "oxide-prnewswire",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: ["US Innovative Technology Fund"],
      capitalIntensity: "High",
      futureCapitalRequirement:
        "Working capital for manufacturing and inventory as order volume grows.",
      financingRisk:
        "Moderate. Recently funded with existing investors participating, which is a constructive signal.",
      missingInformation: [
        "Revenue",
        "Units shipped and installed base",
        "Total capital raised across all rounds",
      ],
    },
    technology: {
      howItWorks:
        "Compute, storage, networking, and a control plane are designed as one system. The conventional server firmware stack is replaced with the company's own, which removes a layer most vendors treat as fixed.",
      coreAdvantage:
        "Vertical integration down to firmware, which allows the control plane to make guarantees that a vendor assembling third-party servers cannot.",
      supportingEvidence: [
        {
          claim:
            "Named customers including Lawrence Livermore National Laboratory, Idaho National Laboratory, Stoke Space, and Jump Trading are displayed by the company.",
          sourceId: "oxide-site",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Series B of 100 million dollars with all existing investors participating.",
          sourceId: "oxide-prnewswire",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Processors, storage, and contract manufacturing, with the firmware and control plane built in house.",
      milestoneForScale:
        "Repeat rack orders from existing customers, which distinguishes a product from a series of bespoke wins.",
      failurePoints: [
        "Owning the full stack means owning every defect, with no upstream vendor",
        "Manufacturing and supply chain execution at rising volume",
        "Enterprise appetite for owned infrastructure reversing",
      ],
    },
    market: {
      painPoint:
        "Organisations that need to own their infrastructure are left assembling servers, storage, and networking from separate vendors and building the control plane themselves.",
      structure:
        "A defined set of large enterprises, laboratories, and research institutions with capital budgets and long procurement.",
      adoptionDrivers: [
        "Data sovereignty and regulatory requirements",
        "Sustained cloud costs for stable workloads",
      ],
      competitors: [
        "Established server and converged infrastructure vendors",
        "Public cloud providers",
      ],
      substitutes: [
        "Assembling infrastructure from separate vendors",
        "Continuing to run in public cloud",
      ],
      regulatoryEnvironment:
        "No direct product regulation. Customers in regulated and national security environments impose their own requirements.",
      maturity: "Developing",
      currentCatalyst:
        "Series B raised explicitly to scale manufacturing and customer support.",
    },
    commercial: {
      customerType:
        "Enterprises, national laboratories, and research institutions.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Direct enterprise sales with long technical evaluation cycles.",
      adoptionEvidence: [
        {
          claim:
            "Two US national laboratories are displayed as customers on the company site.",
          sourceId: "oxide-site",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "A rack is installed and integrated into existing operations, which is substantial but bounded.",
      expansionOpportunity:
        "Additional racks at customers who have deployed one.",
      goToMarketRisk:
        "Large indivisible purchases mean revenue is lumpy and concentrated in few decisions.",
    },
    investment: {
      thesis:
        "A technically uncompromising approach to owned infrastructure, validated by national laboratory customers who are among the hardest buyers to win, in a category that venture capital has largely abandoned.",
      bullCase:
        "Owned infrastructure demand persists, national laboratory references open the wider institutional market, and repeat orders make revenue predictable.",
      baseCase:
        "Steady growth among technically sophisticated buyers, producing a good business at moderate scale.",
      bearCase:
        "Enterprise appetite for owned hardware weakens, or manufacturing execution constrains growth.",
      catalysts: [
        "Disclosed repeat orders from existing customers",
        "Additional national laboratory or government wins",
      ],
      risks: [
        "Lumpy capital equipment revenue",
        "Full-stack ownership meaning full-stack defect ownership",
        "Manufacturing scale-up execution",
      ],
      invalidators: [
        "No disclosed repeat orders within twelve months",
        "A national laboratory customer publicly moving away",
      ],
      recommendedNextStep:
        "Ask the national laboratory customers what they evaluated against and why they chose this. Laboratory procurement records are unusually informative and partly public.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What is the defect escalation path when the firmware is the company's own?",
      ],
      product: [
        "How long does a rack take from delivery to production workload?",
      ],
      customers: [
        "How many customers have ordered a second rack?",
      ],
      competition: [
        "What did the national laboratories evaluate this against?",
      ],
      unitEconomics: [
        "What is the gross margin per rack, and how does it change with volume?",
      ],
      capitalRequirements: [
        "What working capital does the current order book require?",
      ],
      regulation: [
        "What certifications are required for national security environments?",
      ],
      team: [
        "How deep is the manufacturing and supply chain organisation relative to engineering?",
      ],
      financing: [
        "What is total capital raised, and what is the path to profitability?",
      ],
      commercialization: [
        "What is the typical sales cycle length, and has it shortened with references?",
      ],
    },
    outreach:
      "I have been researching companies building integrated infrastructure rather than assembling it, and the decision to replace the server firmware stack rather than accept it is the choice I keep returning to. It is a much harder path and it is the reason the control plane can make guarantees others cannot. I would like to understand how the national laboratory deployments have gone and what repeat ordering looks like. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(
        5,
        "verified",
        "High",
        "Full vertical integration including replacement of the conventional server firmware stack.",
        "Genuinely uncommon. Almost no company at this scale attempts it.",
        "oxide-site",
      ),
      technicalEvidence: fa(
        4,
        "verified",
        "High",
        "Shipping product with two national laboratories and a quantitative trading firm as named customers.",
        "National laboratory adoption is strong external validation for infrastructure of this kind.",
        "oxide-site",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Medium",
        "Years of firmware and control plane engineering that a competitor would have to reproduce wholesale.",
        "The integration depth is the moat and it is genuinely hard to copy.",
      ),
      marketImportance: fa(
        3,
        "judgment",
        "Medium",
        "Owned infrastructure is a real and defined market, smaller than public cloud and structurally durable.",
        "Important to a specific set of buyers rather than universally.",
      ),
      commercialReadiness: fa(
        4,
        "verified",
        "High",
        "Shipping racks to named customers with a Series B raised to scale support and manufacturing.",
        "Commercial and scaling.",
        "oxide-prnewswire",
      ),
      customerEvidence: fa(
        4,
        "verified",
        "High",
        "Named customers including two national laboratories, displayed publicly by the company.",
        "Named institutional customers are among the strongest evidence available at this stage.",
        "oxide-site",
      ),
      teamCredibility: fa(
        5,
        "verified",
        "High",
        "Founded by Steve Tuck and Bryan Cantrill, both with long operating and systems engineering records in server infrastructure.",
        "Deep and directly relevant.",
        "oxide-prnewswire",
      ),
      capitalEfficiency: fa(
        4,
        "judgment",
        "Medium",
        "Reached named national laboratory customers on a Series B, which is modest funding for a hardware company.",
        "Efficient for the category.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Medium",
        "Established infrastructure vendors are large but not focused on this integration depth.",
        "The specific position is relatively uncontested.",
      ),
      financingRisk: fa(
        4,
        "verified",
        "Medium",
        "Recent Series B with all existing investors participating.",
        "Insider participation is a constructive signal about private information.",
        "oxide-prnewswire",
      ),
      regulatoryRisk: fa(
        5,
        "judgment",
        "High",
        "No direct product regulation.",
        "Effectively none.",
      ),
      sourcingOriginality: fa(
        4,
        "judgment",
        "Medium",
        "Enterprise hardware attracts little venture attention relative to software, despite comparable buyer budgets.",
        "Under-examined relative to the quality of the customer list.",
      ),
    },
    dataConfidence: "High",
    dataConfidenceNote:
      "Founders, founding year, headquarters, financing, product, and named customers are supported by the company's own announcement and site. Revenue, units shipped, and total capital raised are not disclosed.",
    sourceIds: ["oxide-prnewswire", "oxide-site"],
    lastReviewed: REVIEWED,
  },
];

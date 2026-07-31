import { fa, NOT_DISCLOSED, type PrivateCompany } from "../types";

/** Verified private companies, part two. See companies-a.ts for the data policy. */

const REVIEWED = "2026-07-30";

export const COMPANIES_B: PrivateCompany[] = [
  /* ------------------------------------------------------------ Lightmatter */
  {
    id: "lightmatter",
    name: "Lightmatter",
    website: "https://lightmatter.co",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series D reported as a private financing, with no listing or acquisition notice.",
    headquarters: "Boston, Massachusetts, United States",
    region: "North America",
    foundedYear: 2017,
    founders: ["Nicholas Harris", "Darius Bunandar", "Thomas Graham"],
    sector: "Semiconductors & Advanced Computing",
    subsector: "Photonic interconnect and light engines",
    description:
      "Builds Passage, a photonic interconnect layer that sits underneath processor dies and routes data optically between them, together with Guide light engines that supply the optical power.",
    targetCustomer:
      "Accelerator and system designers building rack-scale AI machines where die-to-die bandwidth is the constraint.",
    businessModel:
      "Sale of photonic interconnect substrates and light engines designed into customer silicon.",
    technicalDifferentiation:
      "Routing optically underneath the dies rather than at the package edge removes the electrical bottleneck at the point where it actually occurs.",
    tractionSignal: NOT_DISCLOSED,
    tractionProvenance: "Not sufficiently supported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "Series D of 400 million dollars at a reported 4.4 billion dollar valuation, funding commercial rollout of Passage.",
    primaryCompetitors: ["Ayar Labs", "Broadcom", "Marvell Technology"],
    mainTechnicalRisk:
      "Photonic substrates must survive the thermal and mechanical conditions of a production package, which is where this category has historically failed.",
    mainCommercialRisk:
      "No customer, shipping platform, or revenue is publicly disclosed, so commercial progress cannot be assessed from outside.",
    mainFinancingRisk:
      "A 4.4 billion dollar valuation set before any public evidence of volume deployment.",
    sourcing: {
      discoveryChannel: "Funding announcement",
      signalDate: "2024-10-16",
      signal: "Recent financing",
      dateSourced: "2026-06-15",
      channel: "Frontier compute value-chain scan, interconnect layer",
      whyEntered:
        "One of very few companies attacking die-to-die bandwidth optically rather than at the faceplate, funded at a scale that implies investors have seen evidence that is not public.",
      whyTimely:
        "Rack-scale architectures have made die-to-die and tray-to-tray bandwidth the binding constraint on usable compute, which was not true when the company was founded.",
      whyOverlooked:
        "Photonics is technically harder for generalist investors to evaluate than accelerators, and the company discloses very little commercially, which suppresses coverage relative to its funding level.",
      whyNotObvious:
        "The funding is easy to find. What is missing everywhere, including in databases, is any commercial datapoint at all, which is precisely why the record is low confidence.",
      evidenceNeeded:
        "A single named design win, disclosed by the customer rather than the company.",
      wellRecognised: false,
    },
    financing: {
      stage: "Later stage",
      disclosedRound: "Series D",
      latestRound:
        "400 million dollar Series D at a reported 4.4 billion dollar valuation.",
      latestRoundDate: "2024-10-16",
      latestRoundSourceId: "lightmatter-dcd",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "T. Rowe Price Associates",
        "Fidelity Management & Research Company",
        "GV",
        "Viking Global Investors",
      ],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "High. Photonic fabrication and packaging capacity are committed well ahead of volume.",
      financingRisk:
        "Low near term after a large round, high on valuation relative to disclosed commercial progress.",
      missingInformation: [
        "Revenue",
        "Named customers or shipping platforms",
        "Total capital raised across all rounds",
        "Any published performance benchmark",
      ],
    },
    technology: {
      howItWorks:
        "A photonic layer beneath the processor dies carries data as light between them, with separate light engines supplying optical power. The electrical path is shortened to the distance between a die and the photonics directly under it.",
      coreAdvantage:
        "Attacking bandwidth at the die-to-die layer rather than at the rack edge, which is where the constraint appears first as accelerator counts rise.",
      supportingEvidence: [
        {
          claim:
            "The company describes the Passage interconnect and Guide light engine products and the silicon photonics approach behind them.",
          sourceId: "lightmatter-site",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Series D financing and valuation independently reported by technology press.",
          sourceId: "lightmatter-dcd",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Photonic foundry capacity and advanced packaging from a small number of suppliers.",
      milestoneForScale:
        "A customer product shipping with Passage designed in, disclosed by the customer.",
      failurePoints: [
        "Thermal and mechanical reliability of a photonic substrate in a production package",
        "Customer silicon roadmaps changing between generations",
        "Better capitalised connectivity vendors reaching volume first",
      ],
    },
    market: {
      painPoint:
        "Electrical die-to-die links limit how much compute can be aggregated before bandwidth, not silicon, becomes the constraint.",
      structure:
        "A handful of accelerator and system designers whose platform decisions determine the whole addressable volume.",
      adoptionDrivers: [
        "Rack-scale architectures replacing individual servers as the deployment unit",
        "Power budgets where interconnect is a rising share of consumption",
      ],
      competitors: ["Ayar Labs", "Broadcom", "Marvell Technology"],
      substitutes: [
        "Advanced electrical packaging and shorter reach copper",
        "Faceplate pluggable optics",
      ],
      regulatoryEnvironment:
        "General export controls on advanced datacentre components apply.",
      maturity: "Emerging",
      currentCatalyst:
        "Commercial rollout of Passage, which the Series D was explicitly raised to fund.",
    },
    commercial: {
      customerType: "Accelerator and system designers.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Multi-year design-in engagement with a small number of silicon designers.",
      adoptionEvidence: [
        {
          claim:
            "The Series D was raised to fund commercial rollout of Passage, per independent reporting.",
          sourceId: "lightmatter-dcd",
          basis: "verified",
          provenance: "Independently verified",
        },
      ],
      implementationBurden:
        "Very high. The customer designs a silicon generation around the interconnect.",
      expansionOpportunity:
        "Content per system rises if the interconnect holds position across generations.",
      goToMarketRisk:
        "With nothing disclosed commercially, the outside view cannot distinguish between confidential progress and none.",
    },
    investment: {
      thesis:
        "A technically serious attack on die-to-die bandwidth from a team with a long research pedigree, priced well ahead of any public commercial evidence.",
      bullCase:
        "Passage reaches volume in a customer platform and the company becomes structurally important to rack-scale AI systems.",
      baseCase:
        "Adoption arrives slowly, as photonics adoption repeatedly has, with the company remaining well funded and strategically relevant.",
      bearCase:
        "Reliability or yield problems appear at production scale, or customers standardise on an alternative, and the valuation cannot be supported.",
      catalysts: [
        "A customer disclosing a product with Passage designed in",
        "Any published performance or reliability data",
      ],
      risks: [
        "No public commercial evidence at all",
        "Valuation set far ahead of disclosed progress",
        "Category history of slipped adoption timelines",
      ],
      invalidators: [
        "A major customer publicly selecting a competing interconnect approach",
        "Another two years with no disclosed design win",
      ],
      recommendedNextStep:
        "Ask directly for a customer reference under confidentiality. Nothing in the public record distinguishes strong private progress from none, and that is the single largest gap.",
      confidence: "Low",
    },
    diligence: {
      technology: [
        "What is the measured reliability of the photonic substrate under production thermal cycling?",
      ],
      product: [
        "What does a customer have to change in their silicon design to adopt Passage?",
      ],
      customers: [
        "Which customers have Passage designed in, and what are their public ship dates?",
      ],
      competition: [
        "How does the approach compare with co-packaged optics on cost per bit at the same reach?",
      ],
      unitEconomics: [
        "What is the cost per interconnect substrate at target volume?",
      ],
      capitalRequirements: [
        "What photonic fabrication capacity is committed, and at what cost?",
      ],
      regulation: [
        "What export control classification applies to the interconnect?",
      ],
      team: [
        "How much of the founding research team remains in technical leadership?",
      ],
      financing: [
        "What is total capital raised, and what does the Series D preference structure look like?",
      ],
      commercialization: [
        "Has any revenue been recognised from Passage to date?",
      ],
    },
    outreach:
      "I have been researching photonic interconnect, and the choice to route optically underneath the dies rather than at the package edge is what drew me to your work. It addresses the bandwidth constraint at the point where it actually appears rather than where it is easiest to reach. I would like to understand how the photonic substrate is behaving under production thermal cycling, and what commercial rollout looks like in practice. Would you be open to a conversation?",
    factors: {
      technicalDifferentiation: fa(
        5,
        "verified",
        "Medium",
        "Die-to-die photonic routing beneath the package, distinct from both faceplate optics and co-packaged optics.",
        "A genuinely different architectural position in the interconnect stack.",
        "lightmatter-site",
      ),
      technicalEvidence: fa(
        2,
        "judgment",
        "Low",
        "Product descriptions and a large financing. No published benchmark, no disclosed design win, no independent validation.",
        "The weakest evidence base of any technically strong company in the universe, and the rating reflects that rather than the underlying science.",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Medium",
        "Nine years of accumulated photonics engineering and design-in lock-in once a customer commits.",
        "Strong in principle, unproven in practice.",
      ),
      marketImportance: fa(
        5,
        "verified",
        "High",
        "Die-to-die bandwidth is a first-order constraint in rack-scale AI systems.",
        "The bottleneck is real and worsening.",
      ),
      commercialReadiness: fa(
        1,
        "judgment",
        "Low",
        "No disclosed customer, shipping platform, or revenue.",
        "Rated on the public record. The company may be further along privately, and the platform does not assume so.",
      ),
      customerEvidence: fa(
        1,
        "judgment",
        "Low",
        "No named customer or disclosed adoption of any kind.",
        "There is essentially nothing to assess here.",
      ),
      teamCredibility: fa(
        5,
        "verified",
        "Medium",
        "Founded in 2017 by Nicholas Harris, Darius Bunandar, and Thomas Graham, with a research background in integrated photonics.",
        "Deep and directly relevant technical pedigree.",
        "lightmatter-dcd",
      ),
      capitalEfficiency: fa(
        1,
        "judgment",
        "Low",
        "400 million dollars raised in a single round with no disclosed revenue or design win.",
        "Low as measured. The absence of disclosure is why confidence is also low.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Medium",
        "Competes against co-packaged optics companies and two large connectivity vendors.",
        "Crowded at the interconnect layer, with better-capitalised competitors.",
      ),
      financingRisk: fa(
        3,
        "verified",
        "Medium",
        "Large recent round, offset by a valuation set well ahead of disclosed commercial progress.",
        "Comfortable on cash, exposed on the next round's reference point.",
        "lightmatter-dcd",
      ),
      regulatoryRisk: fa(
        4,
        "judgment",
        "Medium",
        "General export controls on advanced datacentre components apply, with no product-specific regulatory regime.",
        "Low. The company sells a component into systems rather than operating in a licensed or certified market.",
      ),
      sourcingOriginality: fa(
        4,
        "judgment",
        "Medium",
        "Well funded but lightly covered commercially, because there is little disclosed to cover.",
        "Under-examined relative to its position, which is itself a consequence of the disclosure gap.",
      ),
    },
    dataConfidence: "Low",
    dataConfidenceNote:
      "Founders, founding year, product line, and the Series D are supported by the company site and independent technology press. Nothing commercial is disclosed: no customer, revenue, benchmark, or total raised. The record is marked low confidence for that reason.",
    sourceIds: ["lightmatter-site", "lightmatter-dcd"],
    lastReviewed: REVIEWED,
  },

  /* ----------------------------------------------------------------- QuEra */
  {
    id: "quera",
    name: "QuEra Computing",
    website: "https://www.quera.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. The company site describes private financing and government programme participation, with no listing or acquisition notice.",
    headquarters: "Boston, Massachusetts, United States",
    region: "North America",
    foundedYear: 2021,
    founders: [],
    sector: "Quantum Computing",
    subsector: "Neutral-atom quantum computing",
    description:
      "Builds neutral-atom quantum computers, offering cloud access to its Aquila system and on-premise deployments, with a published roadmap toward fault tolerance.",
    targetCustomer:
      "National laboratories, government programmes, research institutions, and corporate research groups.",
    businessModel:
      "Cloud access to machine time, on-premise system sales, and government research contracts.",
    technicalDifferentiation:
      "Neutral atoms scale by expanding an optical trapping system rather than by fabricating more devices, which is a materially different cost curve from superconducting approaches.",
    tractionSignal:
      "Selected for Phase B of the DARPA Quantum Benchmarking Initiative and participating in a Japanese national programme, per the company.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2026-07-30",
    recentCatalyst:
      "Published a logical-level magic state distillation result in July 2025, a necessary component of fault-tolerant computation, following a financing of more than 230 million dollars in February 2025.",
    primaryCompetitors: [
      "Atom Computing",
      "Pasqal",
      "IonQ",
      "Superconducting programmes at large technology companies",
    ],
    mainTechnicalRisk:
      "Error correction overhead remains the unsolved problem for the entire category, and no company has demonstrated commercial advantage.",
    mainCommercialRisk:
      "Revenue is research and government funded. A commercial market for quantum computing does not yet exist.",
    mainFinancingRisk:
      "Continuous capital requirement with no path to operating profitability on any near-term plan.",
    sourcing: {
      discoveryChannel: "Government grant",
      signalDate: "2025-02-11",
      signal: "Government contract",
      dateSourced: "2026-05-20",
      channel: "Quantum programme and national laboratory award tracking",
      whyEntered:
        "Selection for Phase B of a DARPA benchmarking programme is a rare externally administered technical filter in a category where most claims are self-reported. It is one of the few quantum signals that does not originate with the company.",
      whyTimely:
        "Published error-correction milestones have moved from physical qubit counts to logical operations, which is the transition that determines whether the category ever becomes useful.",
      whyOverlooked:
        "Neutral-atom approaches receive less attention than superconducting ones, and the company is less widely covered than the listed quantum companies despite comparable technical standing.",
      whyNotObvious:
        "Database searches return the financing but not the DARPA programme progression, which is the only externally administered technical filter in this category and is published separately from any funding record.",
      evidenceNeeded:
        "Logical qubit counts measured against the published 2028 roadmap, and the conditions releasing the milestone-contingent portion of the financing.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series C",
      disclosedRound: "Series C",
      latestRound:
        "More than 230 million dollars announced 11 February 2025 with Google and SoftBank Vision Fund 2 among new investors. The company disclosed that 60 million dollars of the total is contingent on achieving technical milestones.",
      latestRoundDate: "2025-02-11",
      latestRoundSourceId: "quera-financing",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "Google",
        "SoftBank Vision Fund 2",
        "Valor Equity Partners",
        "QVT Family Office",
        "Safar Partners",
      ],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "Continuous. Fault tolerance is targeted for 2028 on the company roadmap and will require further financing.",
      financingRisk:
        "High. No commercial revenue path within the current funding horizon, and 60 million dollars of the announced financing is contingent on technical milestones rather than committed outright.",
      missingInformation: [
        "Total capital raised across all rounds",
        "Revenue and its split between government and commercial sources",
        "Founder names, which the company site does not list",
        "Which technical milestones release the contingent portion of the financing",
      ],
    },
    technology: {
      howItWorks:
        "Neutral atoms are held in optical tweezer arrays and manipulated with lasers. Qubit count grows by expanding the optical system rather than by fabricating additional physical devices.",
      coreAdvantage:
        "Scaling economics. Adding qubits is an optics problem rather than a fabrication problem, which changes the cost curve at the counts error correction requires.",
      supportingEvidence: [
        {
          claim:
            "Selected for Phase B of the DARPA Quantum Benchmarking Initiative, per the company site.",
          sourceId: "quera-site",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Published logical-level magic state distillation in July 2025 and error-corrected algorithm results on logical qubits.",
          sourceId: "quera-site",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      benchmarks:
        "The company publishes two-qubit gate fidelity and logical qubit counts. Cross-company comparison in quantum computing is genuinely difficult because metrics are defined differently by each group.",
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Specialist lasers, optics, and vacuum systems from a small number of suppliers with long lead times.",
      milestoneForScale:
        "Error-corrected logical qubits in sufficient number to run a commercially relevant algorithm. Unmet across the entire category.",
      failurePoints: [
        "Error correction overhead proving impractical at the required scale",
        "Atom loss limiting usable circuit depth",
        "A competing modality reaching useful scale first",
      ],
    },
    market: {
      painPoint:
        "Certain simulation and optimisation problems are intractable classically. Whether quantum hardware solves them at commercially relevant scale is unproven.",
      structure:
        "Government and research buyers almost exclusively. A commercial market does not yet exist.",
      adoptionDrivers: [
        "National quantum programmes funding capability for strategic reasons",
        "Cloud access lowering the cost of experimentation",
      ],
      competitors: [
        "Atom Computing",
        "Pasqal",
        "IonQ",
        "Superconducting programmes at large technology companies",
      ],
      substitutes: [
        "Classical high performance computing, which continues to improve",
        "Quantum-inspired classical algorithms",
      ],
      regulatoryEnvironment:
        "Export controls on quantum technology apply, and government procurement rules govern most demand.",
      maturity: "Emerging",
      currentCatalyst:
        "DARPA Phase B selection and the published fault-tolerance roadmap targeting 2028.",
    },
    commercial: {
      customerType:
        "National laboratories, government agencies, universities, and corporate research groups.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Government and institutional procurement on long cycles, plus cloud access through major platforms.",
      adoptionEvidence: [
        {
          claim:
            "Systems available through Amazon Braket and collaborations with national laboratories, per the company.",
          sourceId: "quera-site",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden:
        "Very high. Productive use requires specialist physics expertise.",
      expansionOpportunity:
        "Contingent entirely on technical thresholds no company in the category has reached.",
      goToMarketRisk:
        "Demand follows government funding cycles rather than product quality.",
    },
    investment: {
      thesis:
        "A research-stage option on neutral-atom scaling economics, validated by an externally administered government benchmarking programme rather than by self-reported milestones.",
      bullCase:
        "Error correction progresses on the published roadmap, and the scaling advantage of optical trapping proves decisive as logical qubit counts rise.",
      baseCase:
        "Continued government-funded technical progress with commercial usefulness remaining several years away and further dilution required.",
      bearCase:
        "Error correction overhead proves impractical for this modality, or a competing approach reaches useful scale first.",
      catalysts: [
        "Further DARPA programme progression",
        "Logical qubit milestones against the 2028 roadmap",
      ],
      risks: [
        "The category may never become commercially useful",
        "Continuous financing requirement",
        "Well-funded competitors in the same modality",
      ],
      invalidators: [
        "Removal from the DARPA programme at a later phase",
        "A competing modality demonstrating commercial advantage first",
      ],
      recommendedNextStep:
        "Track DARPA programme progression rather than qubit counts. It is the only externally administered filter in this category and it is public.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What is the current logical qubit count after error correction, and how does it track the published roadmap?",
      ],
      product: [
        "What can the Aquila system do today that classical hardware cannot?",
      ],
      customers: [
        "What share of revenue is government funded, and how durable is that funding?",
      ],
      competition: [
        "On error-correction metrics, how does the company rank within neutral-atom approaches specifically?",
      ],
      unitEconomics: [
        "What does it cost to build and operate a system for a year?",
      ],
      capitalRequirements: [
        "What capital is required to reach the 2028 fault-tolerance target?",
      ],
      regulation: [
        "How do quantum export controls affect the addressable customer base?",
      ],
      team: [
        "Who founded the company, and how does the scientific team compare with competing groups by publication record?",
      ],
      financing: [
        "What is total capital raised, and what dilution does the roadmap imply?",
      ],
      commercialization: [
        "Which problem is expected to show commercial advantage first, and who has committed to running it?",
      ],
    },
    outreach:
      "I have been researching neutral-atom quantum computing, and the DARPA benchmarking selection is what made me want to reach out, because it is one of very few externally administered filters in a field where most milestones are self-reported. I would like to understand how the logical qubit work is tracking against the 2028 roadmap, and where atom loss currently limits circuit depth. Would you be open to a short conversation?",
    factors: {
      technicalDifferentiation: fa(
        4,
        "verified",
        "High",
        "Neutral-atom architecture scaling through optics rather than fabrication.",
        "Scientifically distinct, in a category where distinctness has not yet produced commercial value.",
        "quera-site",
      ),
      technicalEvidence: fa(
        5,
        "verified",
        "High",
        "DARPA Quantum Benchmarking Initiative Phase B selection, published magic state distillation, and published error-corrected algorithm results.",
        "The strongest external technical validation in the universe, because a government benchmarking programme is administered by someone other than the company.",
        "quera-site",
      ),
      defensibility: fa(
        2,
        "judgment",
        "Medium",
        "Several well-funded groups pursue the same modality, and the underlying physics is published.",
        "Weak. Pre-commercial deep technology defensibility is largely theoretical.",
      ),
      marketImportance: fa(
        3,
        "judgment",
        "Medium",
        "The addressable market is enormous if the technology works and close to zero if it does not.",
        "Rated in the middle because the outcome distribution is genuinely bimodal.",
      ),
      commercialReadiness: fa(
        1,
        "verified",
        "High",
        "Revenue is research and government funded. No production commercial workload exists.",
        "Research stage, stated plainly.",
        "quera-site",
      ),
      customerEvidence: fa(
        3,
        "verified",
        "High",
        "DARPA programme participation, a Japanese national programme, national laboratory collaborations, and cloud availability.",
        "Real institutional demand, though it is research demand rather than commercial demand.",
        "quera-site",
      ),
      teamCredibility: fa(
        3,
        "judgment",
        "Low",
        "Founded in 2021 by scientists from Harvard and MIT per the company site, with individual founder names not listed.",
        "Institutional pedigree is clear; individual attribution is not, so this is rated on incomplete information.",
        "quera-site",
      ),
      capitalEfficiency: fa(
        2,
        "judgment",
        "Low",
        "Substantial capital consumed with no commercial revenue, and total raised not disclosed.",
        "Low as the category requires, and not fully assessable.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Medium",
        "Competes against other neutral-atom companies and research programmes at some of the largest technology companies.",
        "Outspent by several competitors.",
      ),
      financingRisk: fa(
        2,
        "verified",
        "High",
        "More than 230 million dollars announced in February 2025, of which 60 million dollars is contingent on achieving technical milestones.",
        "The milestone-contingent portion means the headline figure overstates committed capital, and the platform records that rather than repeating the headline.",
        "quera-financing",
      ),
      regulatoryRisk: fa(
        3,
        "verified",
        "Medium",
        "Quantum export controls apply and government procurement drives demand.",
        "Moderate, cutting both ways.",
      ),
      sourcingOriginality: fa(
        4,
        "judgment",
        "Medium",
        "Less covered than the listed quantum companies despite comparable technical standing and stronger external validation.",
        "Genuinely under-examined within a widely discussed field.",
      ),
    },
    dataConfidence: "High",
    dataConfidenceNote:
      "Technology, headquarters, founding year, government programme participation, and published technical milestones are supported by the company's own site, and the financing including its milestone-contingent portion is supported by the company's own press release with independent corroboration. Founder names, total capital raised, and revenue are not disclosed and are recorded as such.",
    sourceIds: ["quera-financing", "quera-tqi", "quera-site"],
    lastReviewed: REVIEWED,
  },

  /* -------------------------------------------------------- Atom Computing */
  {
    id: "atom-computing",
    name: "Atom Computing",
    website: "https://atom-computing.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series C announced June 2026 as a private financing, with no listing or acquisition notice.",
    headquarters: "Berkeley, California, United States",
    region: "North America",
    foundedYear: 2018,
    founders: ["Ben Bloom"],
    sector: "Quantum Computing",
    subsector: "Neutral-atom quantum computing",
    description:
      "Builds neutral-atom quantum computers and has sold an on-premise system to a national quantum initiative, with a published demonstration of error correction using a toric code.",
    targetCustomer:
      "National quantum initiatives, government agencies, and research institutions.",
    businessModel:
      "On-premise system sales and government-supported development contracts.",
    technicalDifferentiation:
      "Demonstrated that error rates fall as more qubits are added to a computation, which is the defining property error correction must have and the one most often asserted without evidence.",
    tractionSignal:
      "Sold its first commercial on-premise quantum computer to QuNorth, a Nordic quantum initiative, in 2025.",
    tractionProvenance: "Company-reported",
    tractionAsOf: "2025-06-24",
    recentCatalyst:
      "Announced more than 300 million dollars in June 2026, comprising a 100 million dollar Series C and a signed letter of intent with the US Department of Commerce for a further 100 million dollars.",
    primaryCompetitors: [
      "QuEra Computing",
      "Pasqal",
      "IonQ",
      "Superconducting programmes at large technology companies",
    ],
    mainTechnicalRisk:
      "Demonstrating error suppression at small scale does not guarantee it holds at the qubit counts a useful algorithm requires.",
    mainCommercialRisk:
      "One disclosed commercial system sale. Demand is government and research funded.",
    mainFinancingRisk:
      "A material share of the announced funding is a letter of intent with a government department rather than committed capital.",
    sourcing: {
      discoveryChannel: "Research publication",
      signalDate: "2026-06-17",
      signal: "Technical benchmark",
      dateSourced: "2026-06-17",
      channel: "Quantum error-correction publication tracking",
      whyEntered:
        "The company published a full toric code error-correction demonstration showing errors decreasing as qubit count rises. That is the specific property the entire category depends on, and demonstrating it is different from claiming a roadmap toward it.",
      whyTimely:
        "The industry has moved from physical qubit counts to logical error rates as the meaningful measure, and this result speaks directly to the new measure.",
      whyOverlooked:
        "Smaller and less covered than the listed quantum companies, and neutral-atom approaches receive less generalist attention than superconducting ones.",
      whyNotObvious:
        "The company is smaller and less covered than the listed quantum names, and the toric code result was published as a technical claim rather than as a funding event, so it does not surface in funding-led searches.",
      evidenceNeeded:
        "Independent replication of the error-correction result by another group, and the terms attached to the government letter of intent.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series C",
      disclosedRound: "Series C",
      latestRound:
        "More than 300 million dollars announced 17 June 2026, comprising a 100 million dollar Series C led by Third Point Ventures and a signed letter of intent with the US Department of Commerce for 100 million dollars.",
      latestRoundDate: "2026-06-17",
      latestRoundSourceId: "atom-prnewswire",
      totalDisclosedFunding: NOT_DISCLOSED,
      namedInvestors: [
        "Third Point Ventures",
        "DCVC",
        "Cisco Investments",
        "US Department of Commerce, by letter of intent",
      ],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "Continuous, and partly dependent on a government commitment that is not yet definitive.",
      financingRisk:
        "High. The headline figure combines committed equity with a letter of intent, and those are materially different instruments.",
      missingInformation: [
        "Total capital raised across all rounds",
        "Revenue",
        "Terms and conditions attached to the Department of Commerce letter of intent",
      ],
    },
    technology: {
      howItWorks:
        "Neutral atoms held in optical traps serve as qubits. A toric code arranges physical qubits so that errors can be detected and corrected, producing logical qubits more reliable than the physical ones beneath them.",
      coreAdvantage:
        "Demonstrated error suppression with scale. The company reports that adding qubits reduced computational errors, which is the property that makes fault tolerance possible.",
      supportingEvidence: [
        {
          claim:
            "First full demonstration of quantum error correction using a toric code, with errors reducing as more qubits are used.",
          sourceId: "atom-prnewswire",
          basis: "verified",
          provenance: "Company-reported",
        },
        {
          claim:
            "Independent technology press corroborated the financing and the fault-tolerance roadmap.",
          sourceId: "atom-hpcwire",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      benchmarks:
        "The toric code result is published by the company. Independent replication by another group has not been reported.",
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Specialist lasers, optics, and vacuum systems from a small number of suppliers.",
      milestoneForScale:
        "Logical qubits in sufficient number and fidelity to run an algorithm faster or cheaper than classical hardware.",
      failurePoints: [
        "Error suppression not holding at larger qubit counts",
        "The Department of Commerce commitment not converting to funding",
        "A competing modality reaching useful scale first",
      ],
    },
    market: {
      painPoint:
        "Problems in simulation and optimisation that are intractable classically, with commercial usefulness unproven.",
      structure:
        "National initiatives and research institutions, with procurement driven by strategic policy.",
      adoptionDrivers: [
        "National quantum programmes funding sovereign capability",
        "Error-correction progress moving the category toward usefulness",
      ],
      competitors: ["QuEra Computing", "Pasqal", "IonQ"],
      substitutes: ["Classical high performance computing", "Quantum-inspired classical algorithms"],
      regulatoryEnvironment:
        "Export controls on quantum technology apply, and government procurement governs most demand.",
      maturity: "Emerging",
      currentCatalyst:
        "The toric code demonstration and the associated financing announcement.",
    },
    commercial: {
      customerType: "National quantum initiatives and research institutions.",
      pricingModel: NOT_DISCLOSED,
      salesMotion: "Government and institutional procurement on long cycles.",
      adoptionEvidence: [
        {
          claim:
            "Sold its first commercial on-premise quantum computer to QuNorth, a Nordic quantum initiative, in 2025.",
          sourceId: "atom-prnewswire",
          basis: "verified",
          provenance: "Company-reported",
        },
      ],
      implementationBurden: "Very high. On-premise deployment requires specialist operation.",
      expansionOpportunity:
        "Additional sovereign quantum initiatives, each of which is a long procurement.",
      goToMarketRisk:
        "A single disclosed system sale is a thin commercial record on which to project a business.",
    },
    investment: {
      thesis:
        "A neutral-atom programme with the clearest published evidence of the one property fault tolerance requires, at a smaller scale and lower profile than the listed quantum companies.",
      bullCase:
        "Error suppression holds as qubit counts rise, sovereign initiatives buy systems, and the company becomes a credible contender in a market that finally develops.",
      baseCase:
        "Steady government-funded technical progress, further dilution, and commercial usefulness remaining distant.",
      bearCase:
        "Error suppression does not hold at scale, the government commitment does not convert, and a better-funded competitor reaches useful scale first.",
      catalysts: [
        "Independent replication of the toric code result",
        "Conversion of the Department of Commerce letter of intent into committed funding",
        "A second sovereign system sale",
      ],
      risks: [
        "Error suppression may not scale",
        "A headline funding figure that includes a non-binding instrument",
        "Category-wide uncertainty about commercial usefulness",
      ],
      invalidators: [
        "The Department of Commerce letter of intent lapsing without conversion",
        "A competing group publishing materially better logical error rates",
      ],
      recommendedNextStep:
        "Establish what conditions attach to the Department of Commerce letter of intent. A third of the announced figure rests on it and its terms are not public.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "At what qubit count does the observed error suppression stop holding?",
      ],
      product: [
        "What is the delivered specification of the QuNorth system, and how is it being used?",
      ],
      customers: [
        "Which other sovereign initiatives are in procurement, and at what stage?",
      ],
      competition: [
        "How do the published logical error rates compare with other neutral-atom groups?",
      ],
      unitEconomics: [
        "What does an on-premise system cost to build relative to its sale price?",
      ],
      capitalRequirements: [
        "What capital is required to reach the next logical qubit milestone?",
      ],
      regulation: [
        "What export restrictions apply to on-premise systems sold outside the United States?",
      ],
      team: [
        "How has the scientific team grown since the error-correction result?",
      ],
      financing: [
        "What are the conditions on the Department of Commerce letter of intent, and what happens if they are not met?",
      ],
      commercialization: [
        "What is the sales cycle for a sovereign quantum initiative, and how many are active?",
      ],
    },
    outreach:
      "I recently came across your toric code error-correction result, and the part that stood out was the demonstration that errors fall as qubits are added rather than a roadmap toward that property. Most of the field describes the destination. I have been researching neutral-atom approaches and would like to understand at what qubit count the suppression stops holding, and how the QuNorth system is being used in practice. Would you be open to a call?",
    factors: {
      technicalDifferentiation: fa(
        4,
        "verified",
        "High",
        "Neutral-atom architecture with a demonstrated toric code implementation.",
        "Scientifically distinct and well executed.",
        "atom-prnewswire",
      ),
      technicalEvidence: fa(
        5,
        "verified",
        "High",
        "Published full toric code error-correction demonstration showing error reduction with scale, plus a delivered commercial system.",
        "Among the strongest technical evidence in the universe. The absence of independent replication is the one qualification.",
        "atom-prnewswire",
      ),
      defensibility: fa(
        2,
        "judgment",
        "Medium",
        "Published physics in a field with several well-funded groups pursuing the same modality.",
        "Weak, as it is for every pre-commercial quantum company.",
      ),
      marketImportance: fa(
        3,
        "judgment",
        "Medium",
        "Enormous if the technology works, near zero if it does not.",
        "Bimodal outcome distribution.",
      ),
      commercialReadiness: fa(
        2,
        "verified",
        "High",
        "One disclosed commercial on-premise system sale, to a national initiative.",
        "A real sale, and a very thin commercial record.",
        "atom-prnewswire",
      ),
      customerEvidence: fa(
        3,
        "verified",
        "High",
        "QuNorth system sale plus a US Department of Commerce letter of intent.",
        "Government demand is real demand, though it responds to policy rather than to product.",
        "atom-prnewswire",
      ),
      teamCredibility: fa(
        5,
        "verified",
        "High",
        "Founded in 2018 by Ben Bloom, a researcher in atomic clocks and neutral atoms, who remains chief executive.",
        "Directly relevant scientific pedigree with continuity in leadership.",
        "atom-prnewswire",
      ),
      capitalEfficiency: fa(
        3,
        "judgment",
        "Low",
        "Reached a published error-correction milestone and a system sale, though total capital raised is not disclosed.",
        "Appears efficient relative to peers, but cannot be assessed properly without the total.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Medium",
        "Competes within neutral atoms and against much larger superconducting programmes.",
        "Outspent, in a field where capital tends to compound technical progress.",
      ),
      financingRisk: fa(
        2,
        "verified",
        "Medium",
        "A headline figure combining a 100 million dollar Series C with a 100 million dollar government letter of intent.",
        "Rated down deliberately: a letter of intent is not committed capital and the platform does not treat it as such.",
        "atom-prnewswire",
      ),
      regulatoryRisk: fa(
        3,
        "verified",
        "Medium",
        "Quantum export controls apply, and a government department is a prospective funder.",
        "Moderate, with policy exposure on both the demand and funding sides.",
      ),
      sourcingOriginality: fa(
        4,
        "judgment",
        "Medium",
        "Materially less covered than the listed quantum companies despite arguably stronger published error-correction evidence.",
        "A genuine gap between technical standing and attention.",
      ),
    },
    dataConfidence: "High",
    dataConfidenceNote:
      "Founder, founding year, headquarters, financing structure, the error-correction demonstration, and the QuNorth system sale are supported by the company's own announcement with independent corroboration from technology press. Total capital raised and revenue are not disclosed.",
    sourceIds: ["atom-prnewswire", "atom-hpcwire", "atom-site"],
    lastReviewed: REVIEWED,
  },
];

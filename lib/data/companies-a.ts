import { fa, NOT_DISCLOSED, type PrivateCompany } from "../types";

/**
 * Verified private companies, part one.
 *
 * Every record here describes a real company that was confirmed to be
 * independently private during research on 30 July 2026. Financing, founders,
 * headquarters, and product claims each carry a source in the registry.
 *
 * Fields that could not be verified from a primary or corroborating source are
 * set to NOT_DISCLOSED rather than estimated. Revenue, ARR, margins, customer
 * counts, contract values, valuations, ownership, burn, and runway are not
 * stated anywhere in this dataset unless a company disclosed them publicly and
 * a source is attached.
 */

const REVIEWED = "2026-07-30";

export const COMPANIES_A: PrivateCompany[] = [
  /* ------------------------------------------------------------------ Etched */
  {
    id: "etched",
    name: "Etched",
    website: "https://www.etched.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. The company site describes capital raised across private financings and shows no listing or acquisition notice.",
    headquarters: "San Jose, California, United States",
    region: "North America",
    foundedYear: 2022,
    founders: ["Gavin Uberti", "Chris Zhu", "Robert Wachen"],
    sector: "AI Infrastructure",
    subsector: "Transformer-specific inference silicon and rack systems",
    description:
      "Designs Sohu, an application-specific integrated circuit that implements the transformer architecture directly in hardware, and sells it as complete inference racks rather than as discrete chips.",
    targetCustomer:
      "Operators running large-scale transformer inference where cost and latency per token are the binding constraints.",
    businessModel:
      "Sale of integrated inference systems, with the company stating it co-designs chips, racks, software, and manufacturing together.",
    technicalDifferentiation:
      "Burning one model architecture into silicon removes the generality that costs a general-purpose accelerator area and power. The trade is severe and deliberate: the part is useless for anything that is not a transformer.",
    tractionSignal:
      "The company states more than one billion dollars in customer contracts and that first racks ship this summer.",
    recentCatalyst:
      "Exited stealth on 30 June 2026 disclosing capital raised, a working chip, and contracted demand, having previously operated with unannounced financings.",
    primaryCompetitors: [
      "NVIDIA",
      "Hyperscaler in-house inference accelerators",
      "d-Matrix",
      "Groq",
    ],
    mainTechnicalRisk:
      "A hardwired architecture cannot follow a change in model design. If the dominant architecture shifts away from the transformer, the silicon does not adapt.",
    mainCommercialRisk:
      "Contracted demand is stated by the company and not independently confirmed, and contracts are not revenue until racks are delivered and accepted.",
    mainFinancingRisk:
      "Each silicon generation costs more than the last, and the funding decision for the next one arrives before the current one has proven itself in production.",
    sourcing: {
      signal: "Product launch",
      dateSourced: "2026-07-01",
      channel: "Frontier compute value-chain scan, inference layer",
      whyEntered:
        "The company moved from an unannounced financing history to a public disclosure of working silicon and contracted demand within a single announcement. For a semiconductor company, the transition from tape-out to shipping racks is the moment the investment question changes from feasibility to execution, and that is the moment worth sourcing on.",
      whyTimely:
        "Inference is becoming the larger share of deployed AI compute, and inference is the workload where fixed-function silicon has the strongest economic argument. The window in which an architecture-specific part is both feasible and valuable is open now and closes if model architectures diversify.",
      whyOverlooked:
        "Not overlooked. This company is widely covered in technology press and has raised from well-known investors. It is retained in the universe because the specific question of whether hardwired transformer silicon survives an architecture shift is under-examined relative to the attention the company receives.",
      wellRecognised: true,
    },
    financing: {
      stage: "Later stage",
      latestRound:
        "The company states 800 million dollars raised across four private financings, with investors including Sequoia Capital, Andreessen Horowitz, SK Hynix, Jane Street, Two Sigma, and Jump Trading.",
      latestRoundDate: "2026-06-30",
      latestRoundSourceId: "etched-site",
      totalDisclosedFunding: "800 million dollars, as stated by the company",
      namedInvestors: [
        "Sequoia Capital",
        "Andreessen Horowitz",
        "SK Hynix",
        "Jane Street",
        "Two Sigma",
        "Jump Trading",
        "VentureTech Alliance",
      ],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "Substantial. Successive process nodes and advanced packaging commitments are funded ahead of the revenue that would justify them.",
      financingRisk:
        "Low in the near term given capital raised, high in structure. A company at this valuation has removed most of the return available to a new investor unless the outcome is exceptional.",
      missingInformation: [
        "Round-by-round breakdown, dates, and valuations are not individually disclosed",
        "Revenue recognised to date",
        "Customer names behind the stated contract figure",
        "Delivery schedule against the contracted backlog",
      ],
    },
    technology: {
      howItWorks:
        "The transformer architecture is implemented as fixed function blocks in the silicon rather than as software running on programmable units. Removing the scheduling, caching, and generality that a programmable accelerator needs frees area and power for the operations a transformer actually performs.",
      coreAdvantage:
        "Specialisation. A part that only runs one architecture can dedicate almost all of its area to that architecture, which is a structural advantage no general-purpose accelerator can match on the same process node.",
      supportingEvidence: [
        {
          claim:
            "The company states a working Sohu chip, first racks shipping, and more than one billion dollars in customer contracts.",
          sourceId: "etched-site",
          basis: "verified",
        },
        {
          claim:
            "Independent technology press covered the original transformer-only ASIC approach and the Series A financing that funded it.",
          sourceId: "etched-eenews",
          basis: "verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Leading-node foundry capacity and advanced packaging, plus high bandwidth memory supply, each competing for allocation against far larger buyers.",
      milestoneForScale:
        "Delivered and accepted racks in production at a named customer, sustained across a full deployment rather than an evaluation.",
      failurePoints: [
        "A shift in dominant model architecture that fixed-function silicon cannot follow",
        "Advanced packaging or memory allocation going to larger buyers during a supply squeeze",
        "Software maturity, which has ended more accelerator programmes than silicon has",
      ],
    },
    market: {
      painPoint:
        "Serving transformer inference on general-purpose accelerators spends area and power on generality the workload does not use.",
      structure:
        "A small number of very large buyers who care intensely about cost per token, and who are each capable of funding an alternative supplier or building one.",
      adoptionDrivers: [
        "Inference growing as a share of deployed AI compute",
        "Cost per token becoming a competitive variable for AI product companies",
        "Power constraints making performance per watt a deployment limit rather than a preference",
      ],
      competitors: [
        "NVIDIA",
        "Hyperscaler in-house inference accelerators",
        "d-Matrix",
        "Groq",
      ],
      substitutes: [
        "General-purpose accelerators used for both training and inference",
        "Model efficiency work that reduces compute per request",
      ],
      regulatoryEnvironment:
        "Export controls on advanced accelerators apply and have changed at short notice, restricting which markets can be served with which products.",
      maturity: "Emerging",
      currentCatalyst:
        "First rack shipments, which convert a contracted backlog into a delivery record that can be checked.",
    },
    commercial: {
      customerType:
        "Large-scale inference operators, with specific customers not disclosed.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Long, direct, technically led engagements with a small number of buyers, on multi-year commitments.",
      adoptionEvidence: [
        {
          claim:
            "The company states more than one billion dollars in signed customer contracts and that production is underway.",
          sourceId: "etched-site",
          basis: "verified",
        },
      ],
      implementationBurden:
        "High. A rack-scale deployment requires the customer to port serving infrastructure onto a new stack and to provision power and cooling around it.",
      expansionOpportunity:
        "Fleet growth at any customer that completes a first deployment, since the switching cost has already been paid.",
      goToMarketRisk:
        "The buyers who most need this product are also the buyers most able to design their own version of it.",
    },
    investment: {
      thesis:
        "The most aggressive expression of the specialisation trade in AI inference, now past the feasibility question and into delivery, at a valuation that has already priced a large amount of that delivery.",
      bullCase:
        "Transformer architectures remain dominant for long enough that fixed-function silicon captures a meaningful share of inference on cost per token, and the contracted backlog converts on schedule.",
      baseCase:
        "Racks ship to a small number of large customers, the technology works, and the company grows into a specialist supplier rather than a platform.",
      bearCase:
        "Model architectures diversify, or software maturity delays deployment past the point where the cost advantage matters, and capital raised cannot be recovered at this valuation.",
      catalysts: [
        "Delivery and acceptance of the first production racks",
        "A named customer confirming deployment independently",
        "Any published third-party benchmark on a production workload",
      ],
      risks: [
        "Architecture obsolescence risk that is structural rather than executional",
        "Contracted demand stated only by the company",
        "Valuation leaving little room for a new investor",
      ],
      invalidators: [
        "A material shift in dominant model architecture away from the transformer",
        "First racks slipping by more than two quarters against the stated schedule",
      ],
      recommendedNextStep:
        "Seek independent confirmation of a delivered and accepted rack from a named customer. The contracted figure is a company statement and the delivery record is the first externally checkable fact.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What happens to the silicon if attention mechanisms change materially in the next two model generations?",
      ],
      product: [
        "What is the software stack a customer must adopt, and how much of their existing serving code survives?",
      ],
      customers: [
        "Which customers stand behind the stated contract figure, and what are the delivery and acceptance terms?",
      ],
      competition: [
        "On a production workload rather than a reference model, what is the measured cost per token against a current general-purpose accelerator?",
      ],
      unitEconomics: [
        "What is the gross margin per rack at current volumes, and what volume is required for it to become attractive?",
      ],
      capitalRequirements: [
        "What does the next silicon generation cost, and when must that decision be made relative to first-rack acceptance?",
      ],
      regulation: [
        "Which markets are restricted under current export controls, and what share of the contracted backlog is affected?",
      ],
      team: [
        "How large is the software and compiler organisation relative to the silicon organisation?",
      ],
      financing: [
        "What does the preference structure look like across four private financings, and what does a moderate outcome return to a new investor?",
      ],
      commercialization: [
        "What is the time from rack delivery to production traffic at the first customer?",
      ],
    },
    outreach:
      "I have been researching companies working on inference-specific silicon, and the decision to specialise all the way down to one architecture is the most interesting version of that trade I have come across. Most people describe it as a performance choice. It is really a bet on architectural stability, and you have been more direct about that than most. I would like to understand how you think about the risk that attention mechanisms change, and what the first rack deliveries have taught you that the tape-out did not. Would you be open to a short conversation?",
    factors: {
      technicalDifferentiation: fa(
        5,
        "verified",
        "High",
        "A transformer-specific ASIC is a genuinely distinct architectural choice rather than an incremental improvement on a general-purpose part.",
        "Among the most differentiated approaches in inference silicon, precisely because the trade-off is so severe.",
        "etched-site",
      ),
      technicalEvidence: fa(
        3,
        "verified",
        "Medium",
        "The company states working silicon and shipping racks. No independent benchmark or third-party production result is public.",
        "Working silicon is real evidence. The absence of any external performance validation is the gap, and it is the reason this is rated three rather than five.",
        "etched-site",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Medium",
        "Specialisation is reproducible by a well-funded competitor. Defensibility rests on lead time and on customer switching costs once a rack is deployed.",
        "Moderate. The architecture is not a secret; executing it at this node and packaging it is the barrier.",
      ),
      marketImportance: fa(
        5,
        "verified",
        "High",
        "Cost and power per token are the binding constraints on scaled inference deployment.",
        "The bottleneck being addressed is real and is currently the central economic problem in AI infrastructure.",
      ),
      commercialReadiness: fa(
        3,
        "verified",
        "Medium",
        "Production underway with first racks shipping, per the company. No delivered and accepted deployment is publicly confirmed.",
        "Past prototype, not yet demonstrably repeatable.",
        "etched-site",
      ),
      customerEvidence: fa(
        3,
        "verified",
        "Low",
        "More than one billion dollars in contracts, stated by the company with no customer named and no independent confirmation.",
        "Discounted heavily because the company is the only source. A large number from a single interested party is weaker evidence than a small number from a named customer.",
        "etched-site",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "Medium",
        "Founding team with a leadership bench drawn from established accelerator and semiconductor programmes, per the company site.",
        "Strong technical assembly. No prior company has been taken through volume silicon production by this founding team.",
        "etched-site",
      ),
      capitalEfficiency: fa(
        2,
        "verified",
        "Medium",
        "800 million dollars raised before any publicly confirmed delivered deployment.",
        "Characteristic of the category rather than a failure, but low as measured. Raising more is not treated as an achievement by this model.",
        "etched-site",
      ),
      competitiveIntensity: fa(
        1,
        "judgment",
        "High",
        "Competing simultaneously against the dominant merchant accelerator supplier, several hyperscaler in-house programmes, and other funded inference silicon companies.",
        "One of the most adverse competitive positions in the universe.",
      ),
      financingRisk: fa(
        2,
        "judgment",
        "Medium",
        "Well capitalised today, with each successive silicon generation requiring a larger commitment made before the previous one has proven out.",
        "Rated on structure and on the valuation already achieved rather than on near-term solvency.",
      ),
      regulatoryRisk: fa(
        2,
        "verified",
        "High",
        "Advanced accelerators are subject to export controls that have changed at short notice.",
        "A live constraint entirely outside the company's control.",
      ),
      sourcingOriginality: fa(
        0,
        "verified",
        "High",
        "Extensively covered in technology and business press following the stealth exit.",
        "No sourcing edge is available here, and the model records that honestly rather than crediting the company for being well known.",
      ),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Founders, headquarters, product, and total capital raised are supported by the company's own site, with independent corroboration of the earlier financing. The contract figure and the shipping schedule are company statements with no independent confirmation, and no round-level detail or benchmark is public.",
    sourceIds: ["etched-site", "etched-eenews"],
    lastReviewed: REVIEWED,
  },

  /* ---------------------------------------------------------------- d-Matrix */
  {
    id: "d-matrix",
    name: "d-Matrix",
    website: "https://www.d-matrix.ai",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. Series C announced November 2025 as a private financing, with no listing or acquisition notice.",
    headquarters: "Santa Clara, California, United States",
    region: "North America",
    foundedYear: NOT_DISCLOSED,
    founders: ["Sid Sheth", "Sudeep Bhoja"],
    sector: "Semiconductors & Advanced Computing",
    subsector: "Digital in-memory compute for AI inference",
    description:
      "Builds inference accelerators built around digital in-memory compute, sold with a networking part and a software layer as a rack-scale system for datacentre inference.",
    targetCustomer:
      "Datacentre operators and enterprises serving large language model inference where tokens per second per watt determines the economics.",
    businessModel:
      "Sale of accelerator cards, networking silicon, and rack-scale systems, with an accompanying software stack.",
    technicalDifferentiation:
      "Performing multiplication inside the memory array attacks the movement of model weights, which is the dominant energy cost in inference, rather than the arithmetic, which is not.",
    tractionSignal:
      "The company states Corsair entered full production and announced a rack-scale system with named ecosystem partners including Supermicro, Arista Networks, and Broadcom.",
    recentCatalyst:
      "Closed a 275 million dollar Series C in November 2025 with participation from Microsoft's venture arm and Singapore's Temasek, bringing disclosed total funding to 450 million dollars.",
    primaryCompetitors: [
      "NVIDIA",
      "Etched",
      "Groq",
      "Hyperscaler in-house inference accelerators",
    ],
    mainTechnicalRisk:
      "In-memory compute has a long history of laboratory results that do not survive contact with production yield and thermal behaviour at scale.",
    mainCommercialRisk:
      "Ecosystem partnerships are announcements rather than deployments, and no named end customer running production traffic is public.",
    mainFinancingRisk:
      "450 million dollars disclosed against a category where the incumbent spends more than that on a single product generation.",
    sourcing: {
      signal: "Recent financing",
      dateSourced: "2025-11-12",
      channel: "Frontier compute value-chain scan, inference layer",
      whyEntered:
        "The Series C included a strategic investor from a hyperscaler venture arm alongside a sovereign fund. Strategic participation at this layer of the stack is a useful signal because those investors see internal demand data that is not public, and their participation is disclosed while their reasoning is not.",
      whyTimely:
        "Inference workloads are memory-bandwidth bound before they are arithmetic bound. An architecture that attacks weight movement directly is addressing the constraint that currently binds, which was not true when this company started.",
      whyOverlooked:
        "Covered by trade press but far less than the best-known inference silicon companies, and the in-memory compute approach is technically harder to evaluate than a conventional accelerator, which tends to reduce generalist investor attention.",
      wellRecognised: false,
    },
    financing: {
      stage: "Series C",
      latestRound:
        "275 million dollar Series C announced 12 November 2025, bringing disclosed total funding to 450 million dollars.",
      latestRoundDate: "2025-11-12",
      latestRoundSourceId: "dmatrix-announcement",
      totalDisclosedFunding: "450 million dollars",
      namedInvestors: [
        "Bullhound Capital",
        "M12, Microsoft's venture fund",
        "Temasek",
        "Qatar Investment Authority",
        "Playground Global",
      ],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "High. Each product generation requires a new tape-out and advanced packaging commitment ahead of revenue.",
      financingRisk:
        "Moderate. Recently and substantially funded, in a category where the competitive set is far better capitalised.",
      missingInformation: [
        "Revenue",
        "Named end customers running production traffic",
        "Unit shipment volumes",
        "Founding year, which the company does not state on its site",
      ],
    },
    technology: {
      howItWorks:
        "Multiplication is performed inside the memory array rather than moving weights to a separate compute unit. Around that sit a dedicated accelerator-to-accelerator networking part and a software layer, sold together as a rack.",
      coreAdvantage:
        "Attacking data movement rather than arithmetic. In inference on large models the energy cost of moving weights exceeds the cost of the operations performed on them, so this addresses the part of the problem that actually dominates.",
      supportingEvidence: [
        {
          claim:
            "The company states Corsair entered full production and describes the digital in-memory compute and stacked DRAM architecture.",
          sourceId: "dmatrix-site",
          basis: "verified",
        },
        {
          claim:
            "The Series C announcement names ecosystem partners for the rack-scale system including Supermicro, Arista Networks, and Broadcom.",
          sourceId: "dmatrix-announcement",
          basis: "verified",
        },
      ],
      benchmarks:
        "The company publishes a throughput and latency figure for a Llama 70B configuration in its own announcement. It is a vendor benchmark on a configuration the vendor selected and has not been independently reproduced.",
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Foundry capacity, stacked DRAM supply, and advanced packaging, all shared with much larger buyers.",
      milestoneForScale:
        "A named end customer running production inference traffic, disclosed with volume, rather than an ecosystem partnership announcement.",
      failurePoints: [
        "In-memory compute yield and thermal behaviour at production volume",
        "Software maturity across model architectures released after tape-out",
        "Memory and packaging allocation during a supply squeeze",
      ],
    },
    market: {
      painPoint:
        "Inference cost is dominated by moving model weights, and general-purpose accelerators spend their power budget accordingly.",
      structure:
        "Concentrated buyers, long qualification cycles, and a competitive set that includes the buyers themselves.",
      adoptionDrivers: [
        "Tokens per second per watt becoming the operative datacentre metric",
        "Power availability limiting deployment independently of chip supply",
        "Buyer preference for a second source on any strategically important component",
      ],
      competitors: [
        "NVIDIA",
        "Etched",
        "Groq",
        "Hyperscaler in-house inference accelerators",
      ],
      substitutes: [
        "General-purpose accelerators",
        "Model quantisation and compression reducing memory pressure in software",
      ],
      regulatoryEnvironment:
        "Subject to the same export control regime as other advanced accelerator suppliers.",
      maturity: "Emerging",
      currentCatalyst:
        "Corsair in full production and the rack-scale system announcement, which together move the company from component supplier to system supplier.",
    },
    commercial: {
      customerType:
        "Datacentre operators and enterprises deploying inference at rack scale.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Direct design-in engagement supported by system manufacturer partnerships, on multi-year qualification cycles.",
      adoptionEvidence: [
        {
          claim:
            "The company states Corsair is in full production to meet customer demand.",
          sourceId: "dmatrix-site",
          basis: "verified",
        },
        {
          claim:
            "Named ecosystem partners for the rack-scale product, disclosed in the financing announcement.",
          sourceId: "dmatrix-announcement",
          basis: "verified",
        },
      ],
      implementationBurden:
        "High. The customer adopts a new software stack and qualifies a new rack architecture.",
      expansionOpportunity:
        "Content per rack rises as the networking part and software attach alongside the accelerator.",
      goToMarketRisk:
        "Ecosystem partnerships are cheap to announce and expensive to convert. None is yet public as a deployment.",
    },
    investment: {
      thesis:
        "A technically sound attack on the correct bottleneck in inference economics, now in production, from a company small enough for the outcome to matter and large enough to have been validated by strategic capital.",
      bullCase:
        "In-memory compute holds its efficiency advantage at production yield, named customers deploy at volume, and the rack-scale system converts the ecosystem partnerships into shipments.",
      baseCase:
        "Steady design wins in a market with room for a credible second source, with the company reaching a solid outcome as a specialist supplier.",
      bearCase:
        "Yield or thermal behaviour erodes the theoretical advantage, software lags model architecture changes, and the incumbent's next generation closes the efficiency gap.",
      catalysts: [
        "A named end customer disclosed with deployment volume",
        "Independent reproduction of the published throughput figures",
        "Evidence that the networking part attaches alongside the accelerator",
      ],
      risks: [
        "In-memory compute at production yield",
        "A competitive set that is far better capitalised",
        "Vendor benchmarks with no independent reproduction",
      ],
      invalidators: [
        "No named production customer within twelve months of full production",
        "Independent benchmarking materially below the published figures",
      ],
      recommendedNextStep:
        "Ask the ecosystem partners, not the company, how far any joint deployment has progressed. Partnership announcements and shipped systems are different facts and only one of them is disclosed.",
      confidence: "Medium",
    },
    diligence: {
      technology: [
        "What is the production yield on the in-memory compute array, and how does it compare with the design assumption?",
      ],
      product: [
        "How long did software support take for the most recent significant model architecture, measured from public release?",
      ],
      customers: [
        "Which of the named ecosystem partners has shipped a joint system to an end customer?",
      ],
      competition: [
        "On a customer workload rather than a reference model, how does tokens per second per watt compare with a current general-purpose accelerator?",
      ],
      unitEconomics: [
        "What is the gross margin per Corsair card and per rack at current volumes?",
      ],
      capitalRequirements: [
        "What does the next generation cost, and is the 450 million dollars raised sufficient to reach it?",
      ],
      regulation: [
        "Which export control classifications apply to this part, and which markets are affected?",
      ],
      team: [
        "How has the software organisation grown relative to the silicon organisation since the Series C?",
      ],
      financing: [
        "What did the strategic investors receive in the way of information or commercial rights alongside their equity?",
      ],
      commercialization: [
        "What is the time from design-in to volume revenue, and what is currently in that pipeline?",
      ],
    },
    outreach:
      "I recently came across your work on digital in-memory compute, and the framing that inference is a data movement problem before it is an arithmetic problem is the part that made me want to reach out. Most companies in this category lead with peak throughput, which describes the part of the problem that is not binding. I have been researching the inference silicon layer and would like to understand how the in-memory array is behaving at production yield, and what the rack-scale partnerships look like in practice. Would you be open to a call?",
    factors: {
      technicalDifferentiation: fa(
        5,
        "verified",
        "High",
        "Digital in-memory compute with stacked DRAM is a genuinely distinct architecture, not a variation on a general-purpose accelerator.",
        "Attacks the dominant cost in inference directly. Among the most differentiated approaches in the universe.",
        "dmatrix-site",
      ),
      technicalEvidence: fa(
        4,
        "verified",
        "Medium",
        "Product in full production per the company, with published throughput figures for a named model configuration and named system partners.",
        "Stronger than a claim, weaker than an independent result. The benchmark is vendor-run and unreproduced.",
        "dmatrix-announcement",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Medium",
        "In-memory compute at production yield is a manufacturing and process achievement that took years and is not quickly copied.",
        "The difficulty of the manufacturing is the moat, more than the architectural idea.",
      ),
      marketImportance: fa(
        5,
        "verified",
        "High",
        "Inference efficiency is the central economic constraint in AI datacentre deployment.",
        "The bottleneck is real and currently binding.",
      ),
      commercialReadiness: fa(
        4,
        "verified",
        "Medium",
        "Corsair in full production with a rack-scale product announced alongside named system partners.",
        "Genuinely commercial, with the deployment record not yet public.",
        "dmatrix-site",
      ),
      customerEvidence: fa(
        2,
        "verified",
        "Low",
        "Named ecosystem partners but no named end customer and no disclosed shipment volume.",
        "Partnerships are not customers. Rated low deliberately, because this is the weakest part of the record.",
        "dmatrix-announcement",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "Medium",
        "Founded by Sid Sheth and Sudeep Bhoja, with the company describing a team that has shipped over one hundred million chips.",
        "Credible semiconductor operating background, corroborated by independent coverage of the financing.",
        "dmatrix-prnewswire",
      ),
      capitalEfficiency: fa(
        4,
        "verified",
        "Medium",
        "Reached full production on 450 million dollars disclosed, materially less than the best-funded competitors in the same category.",
        "Efficient by the standards of custom silicon.",
        "dmatrix-announcement",
      ),
      competitiveIntensity: fa(
        1,
        "judgment",
        "High",
        "Competes against the dominant merchant supplier, hyperscaler in-house programmes, and several funded inference silicon startups.",
        "Crowded and outspent, which is the defining difficulty of this position.",
      ),
      financingRisk: fa(
        3,
        "judgment",
        "Medium",
        "Recently raised 275 million dollars with strategic and sovereign participation.",
        "Comfortable near term. The next generation will require another large round before this one has proven out commercially.",
        "dmatrix-announcement",
      ),
      regulatoryRisk: fa(
        2,
        "verified",
        "High",
        "Advanced accelerator export controls apply.",
        "Outside the company's control and historically volatile.",
      ),
      sourcingOriginality: fa(
        3,
        "judgment",
        "Medium",
        "Covered by semiconductor and AI trade press, but well below the attention given to the best-known inference silicon companies.",
        "Some genuine analytical space remains, particularly on whether in-memory compute holds at yield.",
      ),
    },
    dataConfidence: "High",
    dataConfidenceNote:
      "Financing, investors, founders, product line, and production status are each supported by the company's own announcement and site, with independent distribution of the financing announcement. Founding year is not stated by the company and is recorded as not publicly disclosed rather than inferred.",
    sourceIds: ["dmatrix-announcement", "dmatrix-site", "dmatrix-prnewswire"],
    lastReviewed: REVIEWED,
  },

  /* --------------------------------------------------------------- Ayar Labs */
  {
    id: "ayar-labs",
    name: "Ayar Labs",
    website: "https://ayarlabs.com",
    currentlyPrivate: true,
    privateStatusNote:
      "Confirmed private on 30 July 2026. The company site describes a Series E financing and shows no listing or acquisition notice.",
    headquarters: "San Jose, California, United States",
    region: "North America",
    foundedYear: NOT_DISCLOSED,
    founders: [],
    sector: "Semiconductors & Advanced Computing",
    subsector: "Co-packaged optical input and output",
    description:
      "Builds optical input and output for accelerators, pairing an optical engine placed on the processor package with a separate remote light source, so that racks can be connected with light rather than copper.",
    targetCustomer:
      "Accelerator vendors, system manufacturers, and hyperscale operators building rack-scale AI systems.",
    businessModel:
      "Sale of optical engine and light source components designed into accelerator and switch packages, with revenue following the platforms they are designed into.",
    technicalDifferentiation:
      "Moving the optical conversion onto the package rather than the faceplate removes an electrical hop that costs power and limits reach, which is the constraint that binds as accelerator counts per rack rise.",
    tractionSignal:
      "The company lists AMD, NVIDIA, Alchip, GUC, MediaTek, and Wiwynn as investors and ecosystem partners, and states membership of the NVIDIA NVLink Fusion ecosystem.",
    recentCatalyst:
      "Closed a 500 million dollar Series E led by Neuberger Berman on 3 March 2026, bringing total capital raised to approximately 870 million dollars.",
    primaryCompetitors: [
      "Broadcom",
      "Marvell Technology, following its acquisition of Celestial AI",
      "Established optical module vendors",
    ],
    mainTechnicalRisk:
      "Co-packaged optics has defeated well-funded teams before, usually on thermal behaviour and field serviceability rather than on optical performance.",
    mainCommercialRisk:
      "Revenue depends on the platform decisions of a small number of accelerator vendors, several of whom are also investors and could change architecture.",
    mainFinancingRisk:
      "Low near term after a large round, with a valuation that requires the co-packaged optics transition to arrive on schedule.",
    sourcing: {
      signal: "Strategic investor participation",
      dateSourced: "2026-06-15",
      channel: "Frontier compute value-chain scan, interconnect layer",
      whyEntered:
        "Both of the largest merchant accelerator vendors appear on the same company's investor and partner list. Competing platform owners funding the same interconnect supplier is an unusual signal, and it suggests the component is being treated as infrastructure rather than as one vendor's differentiator.",
      whyTimely:
        "Electrical signalling reach shortens as data rates rise, which moves the crossover point where optics becomes necessary from between racks to inside them. That transition is underway now.",
      whyOverlooked:
        "The interconnect layer receives far less attention than accelerators despite growing faster than accelerator unit volumes, because content per rack rises with each generation. The category also became harder to read after a direct competitor was acquired by a public company, which removed the most obvious comparable.",
      wellRecognised: false,
    },
    financing: {
      stage: "Later stage",
      latestRound:
        "500 million dollar Series E led by Neuberger Berman, closed 3 March 2026, with strategic participation from AMD, NVIDIA, MediaTek, and Alchip.",
      latestRoundDate: "2026-03-03",
      latestRoundSourceId: "ayar-seriese",
      totalDisclosedFunding: "Approximately 870 million dollars",
      namedInvestors: [
        "Neuberger Berman",
        "AMD",
        "NVIDIA",
        "MediaTek",
        "Alchip",
        "ARK Invest",
        "Insight Partners",
        "Qatar Investment Authority",
      ],
      capitalIntensity: "Very High",
      futureCapitalRequirement:
        "High. Photonic foundry capacity and advanced packaging are committed ahead of volume.",
      financingRisk:
        "Low near term. The strategic investor base provides both capital and design-in access, which is an unusual combination.",
      missingInformation: [
        "Founding year and founder names are not stated on the company site",
        "Revenue and unit volumes",
        "Named customers or shipping platforms",
      ],
    },
    technology: {
      howItWorks:
        "An optical engine is placed on the same package as the processor, converting electrical signals to light at the die rather than at the faceplate. A separate remote light source supplies the laser power, keeping the heat-sensitive laser away from the hot package.",
      coreAdvantage:
        "Separating the light source from the optical engine addresses the thermal problem that has historically limited co-packaged optics, which is a design decision rather than a materials advantage.",
      supportingEvidence: [
        {
          claim:
            "The company describes the TeraPHY optical engine and SuperNova remote light source and states membership of the NVIDIA NVLink Fusion ecosystem.",
          sourceId: "ayar-site",
          basis: "verified",
        },
        {
          claim:
            "AMD and NVIDIA are both listed as investors and partners on the company site.",
          sourceId: "ayar-site",
          basis: "verified",
        },
      ],
      benchmarks: NOT_DISCLOSED,
      intellectualProperty: NOT_DISCLOSED,
      thirdPartyDependency:
        "Specialist photonic foundry capacity and advanced packaging slots, both from a small number of suppliers.",
      milestoneForScale:
        "A shipping accelerator platform with the optical engine designed in, disclosed by the platform vendor rather than by the component supplier.",
      failurePoints: [
        "Thermal behaviour inside a fully populated production rack",
        "Field serviceability, since an optical engine on a package cannot be swapped like a pluggable module",
        "A platform vendor changing interconnect architecture between generations",
      ],
    },
    market: {
      painPoint:
        "As accelerator counts per rack rise, copper links consume more power and reach less distance, and the interconnect becomes the constraint on usable compute.",
      structure:
        "A very small number of platform decisions determine the entire addressable volume, made by companies that are also investors here.",
      adoptionDrivers: [
        "Rack power budgets where interconnect is a growing share of consumption",
        "Accelerator counts per rack rising with each generation",
        "Reach requirements exceeding what copper supports at higher data rates",
      ],
      competitors: [
        "Broadcom",
        "Marvell Technology",
        "Established optical module vendors",
      ],
      substitutes: [
        "Pluggable optical modules at the faceplate",
        "Active electrical cables at shorter reaches",
      ],
      regulatoryEnvironment:
        "General export controls on advanced datacentre components apply. No product-specific regulation.",
      maturity: "Emerging",
      currentCatalyst:
        "The Series E and the consolidation of a direct competitor into a public company, which changes the competitive structure of the category.",
    },
    commercial: {
      customerType:
        "Accelerator vendors and system manufacturers, with the component reaching operators indirectly.",
      pricingModel: NOT_DISCLOSED,
      salesMotion:
        "Multi-year design-in engagement with platform vendors, on qualification cycles measured in years.",
      adoptionEvidence: [
        {
          claim:
            "Ecosystem membership and named partnerships with accelerator vendors and system manufacturers, stated by the company.",
          sourceId: "ayar-site",
          basis: "verified",
        },
      ],
      implementationBurden:
        "Very high. A platform vendor designs a generation of hardware around the component.",
      expansionOpportunity:
        "Content per rack rises with each data rate generation if the design-in position holds.",
      goToMarketRisk:
        "The investor list and the customer list are largely the same companies, which is helpful for access and unhelpful for negotiating leverage.",
    },
    investment: {
      thesis:
        "The interconnect layer grows faster than accelerator volumes because content per rack rises every generation, and this company holds an unusual position of being funded by both of the largest merchant platform owners at once.",
      bullCase:
        "Co-packaged optics reaches volume on schedule, the design-in position converts into shipping platforms, and the company becomes the default optical I/O supplier in a category with few alternatives.",
      baseCase:
        "Adoption arrives later than planned, as it repeatedly has, and the company remains strategically important at moderate volume.",
      bearCase:
        "Thermal or serviceability problems appear at production scale, or a platform vendor integrates the function, and the capital raised cannot be recovered at this valuation.",
      catalysts: [
        "A platform vendor disclosing a shipping product with the optical engine designed in",
        "Independent thermal validation inside a populated rack",
        "Disclosure of total capital raised and Series E terms",
      ],
      risks: [
        "Thermal and serviceability risk at production scale",
        "Concentration among platform vendors who are also investors",
        "A category history of repeated schedule slippage",
      ],
      invalidators: [
        "A major platform vendor announcing an integrated alternative",
        "Co-packaged optics slipping another full accelerator generation",
      ],
      recommendedNextStep:
        "Establish the founding team and total capital raised, neither of which the company states publicly, before treating the valuation as a reference point.",
      confidence: "Low",
    },
    diligence: {
      technology: [
        "What is the measured thermal behaviour of the optical engine inside a fully populated production rack rather than on a bench?",
      ],
      product: [
        "How is a failed optical engine serviced in the field, and what does that do to operator maintenance procedures?",
      ],
      customers: [
        "Which platform vendors have the component designed into a product that has a public ship date?",
      ],
      competition: [
        "How does the competitive position change now that a direct competitor sits inside a public company with a broader portfolio?",
      ],
      unitEconomics: [
        "At target volume, what is the cost per link relative to the pluggable optics it displaces?",
      ],
      capitalRequirements: [
        "What photonic foundry and packaging capacity is secured, and over what horizon?",
      ],
      regulation: [
        "What export control classification applies to this component?",
      ],
      team: [
        "Who founded the company, and who on the team has taken a photonics product through platform qualification before?",
      ],
      financing: [
        "What is total capital raised across all rounds, and what were the Series E terms?",
      ],
      commercialization: [
        "What revenue, if any, has been recognised from design-in positions to date?",
      ],
    },
    outreach:
      "I have been researching the interconnect layer of AI infrastructure, and the decision to separate the light source from the optical engine is the part of your architecture I keep coming back to. Thermal behaviour is where co-packaged optics has historically failed, and that design choice addresses it directly rather than working around it. I would like to understand how the engine behaves inside a fully populated rack, and how you think about serviceability once the optics are on the package. Would you be open to a short conversation?",
    factors: {
      technicalDifferentiation: fa(
        5,
        "verified",
        "Medium",
        "Co-packaged optical I/O with a separated remote light source, addressing the thermal constraint that has limited the category.",
        "Technically distinctive and difficult to reproduce quickly.",
        "ayar-site",
      ),
      technicalEvidence: fa(
        3,
        "verified",
        "Low",
        "Ecosystem membership and strategic partnerships are public. No published performance data, no independent validation, and no disclosed shipping platform.",
        "The partnerships are meaningful evidence of technical credibility. The absence of any published result is a real gap.",
        "ayar-site",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Medium",
        "Design-in positions lock a component for a platform generation, and the strategic investor base raises the cost of displacement.",
        "Strong while the design-in holds, with the qualification cycle itself as the barrier.",
      ),
      marketImportance: fa(
        5,
        "verified",
        "High",
        "Interconnect power and reach are worsening constraints in every accelerator generation.",
        "The bottleneck is real and structural.",
      ),
      commercialReadiness: fa(
        2,
        "judgment",
        "Low",
        "Design-in and ecosystem positions with no publicly disclosed shipping platform or revenue.",
        "Pre-volume. Rated on what is public rather than on what may exist privately.",
      ),
      customerEvidence: fa(
        3,
        "verified",
        "Medium",
        "Both major merchant accelerator vendors are listed as investors and partners, alongside named system manufacturers.",
        "Strategic investment from prospective customers is real evidence of intent, though not of purchase volume.",
        "ayar-site",
      ),
      teamCredibility: fa(
        2,
        "judgment",
        "Low",
        "The company does not publish founder names or founding year on its site, and none was confirmed from a primary source during this review.",
        "Rated low on evidence available rather than on any negative finding. This is a gap in the public record, and it is the first thing to close.",
      ),
      capitalEfficiency: fa(
        2,
        "verified",
        "Medium",
        "Approximately 870 million dollars raised in total with no disclosed revenue or shipping platform.",
        "Low as measured. Capital consumed is now known; commercial output is not.",
        "ayar-seriese",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Medium",
        "Competes against a very large connectivity vendor and against a competitor now inside another public company with a broader portfolio.",
        "Difficult, though the strategic investor base is a genuine structural mitigation.",
      ),
      financingRisk: fa(
        4,
        "verified",
        "High",
        "Closed a 500 million dollar Series E in March 2026 led by an institutional investor, with total capital raised of approximately 870 million dollars.",
        "Well funded for the current phase, with the round independently corroborated.",
        "ayar-seriese",
      ),
      regulatoryRisk: fa(
        3,
        "judgment",
        "Medium",
        "General datacentre component export controls apply, with no product-specific regime.",
        "Lower than accelerator suppliers face.",
      ),
      sourcingOriginality: fa(
        4,
        "judgment",
        "Medium",
        "The interconnect layer attracts far less investor attention than accelerators, and the recent consolidation of a competitor has made the category harder to read.",
        "Genuinely under-examined relative to its position in the value chain.",
      ),
    },
    dataConfidence: "Medium",
    dataConfidenceNote:
      "Product, headquarters, strategic investors, the Series E amount, its lead investor, its close date, and total capital raised are supported by the company's own announcement with independent corroboration from technology press. Founding year, founder names, revenue, and any named shipping platform are not publicly disclosed, which is why this is medium rather than high.",
    sourceIds: ["ayar-seriese", "ayar-dcd", "ayar-site"],
    lastReviewed: REVIEWED,
  },
];

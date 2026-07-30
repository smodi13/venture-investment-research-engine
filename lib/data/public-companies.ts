import {
  estimate,
  fa,
  reported,
  unverified,
  type Company,
} from "../types";

/**
 * Public companies in the research universe.
 *
 * These are real companies. Their qualitative profiles are drawn from widely
 * published information: what the company sells, how it makes money, what the
 * technical position rests on, and where the disclosed risk sits.
 *
 * The financial figures are deliberately expressed as dated ranges carrying an
 * "analyst estimate" label, never as point values. A static file cannot hold a
 * current market capitalisation or margin, and presenting one as though it
 * could would be the single most misleading thing this platform could do. Any
 * figure here is a starting point for verification against the filings linked
 * from the source registry, not a substitute for reading them.
 */

/** The date every public-market estimate in this file is expressed as of. */
const SNAPSHOT = "2026-03-31";

const VERIFY = "Approximate range. Reconcile against the latest filing.";

export const PUBLIC_COMPANIES: Company[] = [
  /* ---------------------------------------------------------------- NVIDIA */
  {
    id: "nvda",
    name: "NVIDIA",
    isDemonstration: false,
    marketType: "Public",
    hq: "Santa Clara, California",
    region: "North America",
    foundedYear: 1993,
    sector: "AI Infrastructure",
    subsector: "Accelerated computing platforms",
    stage: "Public",
    description:
      "Designs the accelerators, interconnect, and systems software that most large-scale AI training and inference currently runs on, and sells them increasingly as integrated rack-scale systems rather than as discrete chips.",
    businessModel:
      "Hardware sales through original equipment manufacturers, system integrators, and cloud providers, with a software and networking attach that raises the value of each deployed rack.",
    primaryCustomer:
      "Hyperscale cloud providers, AI laboratories, neocloud operators, and large enterprises building private clusters.",
    technicalDifferentiation:
      "The advantage is the full stack rather than any single component: accelerator architecture, NVLink and networking, and a mature software layer that most production AI code is already written against.",
    tractionSignal: estimate(
      "Data centre is by a wide margin the largest revenue segment, and has been the primary growth driver through the current AI capital cycle.",
      SNAPSHOT,
      "Directionally well established across recent reporting periods. Confirm the current segment split in the latest filing.",
      "nvda-ir",
    ),
    keyCatalyst:
      "Whether inference demand, which is recurring and tied to deployed applications, grows fast enough to offset any pause in one-off training cluster buildouts.",
    investmentRisk:
      "Revenue concentration in a small number of very large buyers whose capital expenditure decisions are made annually and can move sharply.",
    technicalRisk:
      "Competing accelerators and customer-designed silicon are aimed specifically at inference, the workload where the software moat is thinnest.",
    competitiveThreat:
      "Hyperscaler in-house accelerators, developed with the explicit goal of reducing dependence on a single supplier.",
    capitalIntensity: "Moderate",
    commercialReadiness: "Established",
    lastReviewed: "2026-07-24",
    sourceIds: ["nvda-ir", "edgar-nvidia", "sec-edgar"],
    financials: {
      kind: "public",
      ticker: "NVDA",
      marketCap: estimate(
        "Above one trillion dollars",
        SNAPSHOT,
        "Stated as a band on purpose. Market capitalisation moves daily and no static file should imply otherwise.",
        "nvda-ir",
      ),
      revenueGrowth: estimate(
        "Very high, decelerating from the peak year-over-year rates of the early cycle",
        SNAPSHOT,
        VERIFY,
        "edgar-nvidia",
      ),
      grossMargin: estimate(
        "Low to mid seventies percent",
        SNAPSHOT,
        VERIFY,
        "edgar-nvidia",
      ),
      operatingMargin: estimate(
        "Above fifty percent in recent periods",
        SNAPSHOT,
        VERIFY,
        "edgar-nvidia",
      ),
      cashPosition: estimate(
        "Substantial net cash position",
        SNAPSHOT,
        VERIFY,
        "edgar-nvidia",
      ),
      valuationMultiple: unverified(
        SNAPSHOT,
        "edgar-nvidia",
        "Forward multiples change with every print and every consensus revision. Pull the current figure rather than trusting a stored one.",
      ),
      marketExpectations:
        "The price embeds continued data centre growth and durable margins. The debate is not whether AI demand is real but whether the current margin structure survives customer-designed silicon.",
      earningsCatalysts: [
        "Quarterly data centre revenue and the split between training and inference workloads",
        "Hyperscaler capital expenditure guidance, which leads this revenue by roughly two to three quarters",
        "Supply commentary on advanced packaging and high bandwidth memory availability",
      ],
    },
    technology: {
      howItWorks:
        "Accelerators execute the dense linear algebra behind neural networks. Around them sits an interconnect layer that lets many accelerators behave as one machine, and a software layer that compiles common frameworks onto the hardware without the developer touching it.",
      coreAdvantage:
        "Most production AI code already targets this software layer. Competing on raw performance per watt is possible; competing on the accumulated weight of existing code, kernels, and operational tooling is considerably harder.",
      supportingEvidence: [
        {
          claim:
            "Data centre revenue has been the dominant segment through the current cycle.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-nvidia",
        },
        {
          claim:
            "Networking and interconnect are sold as part of the platform, raising content per rack beyond the accelerator itself.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "nvda-ir",
        },
        {
          claim:
            "The software ecosystem is the most frequently cited reason buyers give for staying, which is a durable but not permanent position.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      benchmarks:
        "Public accelerator comparisons exist through industry benchmark suites, but results depend heavily on software maturity and configuration. Treat any single benchmark number as a claim about a specific stack, not about silicon.",
      intellectualProperty:
        "Architecture patents, interconnect designs, and a large body of software. The practical protection is the ecosystem rather than any individual patent.",
      thirdPartyDependency:
        "Fabrication and advanced packaging capacity at external foundries, and high bandwidth memory from a small number of memory suppliers. Both have been genuine constraints on shipment volume.",
      milestoneForScale:
        "Already at scale. The relevant milestone is whether inference-specific products hold share as that workload becomes the larger share of deployed compute.",
      failurePoints: [
        "Customer-designed accelerators reaching good-enough inference performance at materially lower total cost",
        "Advanced packaging or memory supply constraining shipments below demand for an extended period",
        "Export control changes removing access to a significant market",
      ],
    },
    market: {
      painPoint:
        "Training and serving large models requires far more parallel compute, memory bandwidth, and interconnect than general-purpose servers provide.",
      structure:
        "Highly concentrated on the buy side. A small number of hyperscalers and AI laboratories account for a large share of demand, which makes revenue lumpy and negotiating leverage real.",
      adoptionDrivers: [
        "Model capability improvements that create new application demand",
        "Enterprise movement from pilots into production inference, which is recurring rather than one-off",
        "Sovereign and regional compute programmes adding a buyer class that did not exist five years ago",
      ],
      whyNow:
        "The workload mix is shifting from training toward inference. Inference is more price sensitive, more latency sensitive, and more amenable to specialised silicon, which is what makes the competitive question live rather than settled.",
      competitors: [
        "Advanced Micro Devices",
        "Hyperscaler in-house accelerator programmes",
        "Broadcom and other custom accelerator design partners",
        "Inference-specialised silicon startups",
      ],
      substitutes: [
        "General-purpose processors for smaller models and classical workloads",
        "Model efficiency work that reduces the compute required per unit of output",
      ],
      regulatoryEnvironment:
        "Export controls on advanced accelerators are an active and changing constraint on which markets can be served and with which products.",
      maturity: "Developing",
    },
    commercial: {
      pricingModel:
        "System and component pricing negotiated at volume, with software and networking raising realised value per rack.",
      salesMotion:
        "Direct engagement with the largest buyers, supported by original equipment manufacturers and system integrators for everyone else.",
      customerType:
        "Cloud providers, AI laboratories, neocloud operators, national programmes, and large enterprises.",
      adoptionEvidence: [
        {
          claim:
            "Sustained data centre revenue growth across multiple reporting periods.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-nvidia",
        },
        {
          claim:
            "Supply, rather than demand, has been described as the binding constraint during parts of the cycle.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      implementationBurden:
        "Substantial at rack scale: power, cooling, and networking all have to be provisioned around the deployment, which is why data centre readiness now gates delivery as much as chip supply does.",
      expansionOpportunity:
        "Software, networking content per rack, and inference-serving products aimed at enterprises that will never build a training cluster.",
      goToMarketRisk:
        "The largest customers are also the most credible potential competitors, which shapes every negotiation.",
    },
    investment: {
      thesis:
        "The most complete position in AI compute, protected less by any single chip than by the software and interconnect layers around it, facing a workload shift toward inference where that protection is weakest.",
      bullCase:
        "Inference demand grows into a larger and more recurring market than training ever was, and the platform holds share because operational maturity matters more at production scale than at experimental scale.",
      baseCase:
        "Share erodes gradually at the inference end while the training and high-end systems business stays defensible. Growth decelerates to something more normal and margins compress modestly.",
      bearCase:
        "Custom silicon takes the high-volume inference workloads, the buildout pauses for a year of digestion, and both growth and margin reset at the same time.",
      catalysts: [
        "Hyperscaler capital expenditure guidance",
        "Adoption rate of customer-designed accelerators in production inference",
        "Advanced packaging and memory supply commentary",
      ],
      risks: [
        "Customer concentration among buyers who are also building alternatives",
        "Export control changes",
        "A demand digestion period following a period of heavy buildout",
      ],
      invalidators: [
        "A major hyperscaler publicly moving the majority of its production inference to in-house silicon",
        "Gross margin falling durably below the sixties, indicating pricing power has broken",
      ],
      recommendedNextStep:
        "Track the disclosed split between training and inference workloads, and the share of inference running on non-merchant silicon, since that ratio is the thesis.",
    },
    diligence: {
      technology: [
        "How much of the software advantage survives if the dominant serving frameworks abstract the hardware layer completely?",
      ],
      product: [
        "What proportion of revenue now comes from full systems rather than discrete accelerators, and how does that change the competitive comparison?",
      ],
      customers: [
        "What share of revenue comes from the five largest customers, and how has that concentration moved over the last four quarters?",
      ],
      competition: [
        "For the workloads where custom accelerators are credible today, what is the actual total cost of ownership gap including software engineering time?",
      ],
      unitEconomics: [
        "How much of the gross margin is attributable to supply scarcity rather than to structural pricing power?",
      ],
      capitalRequirements: [
        "What prepayments or capacity commitments are outstanding to foundry and memory suppliers, and what happens to them if demand slows?",
      ],
      regulation: [
        "What revenue is at risk under the widest plausible tightening of export controls?",
      ],
      team: [
        "How deep is the bench below the founder-level leadership that has driven architectural direction for three decades?",
      ],
      financing: [
        "What does the current valuation imply about data centre revenue three years out, and is that implied figure larger than plausible total capital expenditure?",
      ],
      commercialization: [
        "How quickly is the enterprise inference business growing relative to the hyperscaler business, and does it carry different margins?",
      ],
    },
    outreach:
      "Not applicable. This is a public-market position rather than a sourced private opportunity, and it is tracked here as a comparison anchor for the private companies in the same value chain.",
    factors: {
      differentiation: fa(
        5,
        "verified",
        "Full-stack position across accelerator, interconnect, and software, sold increasingly as integrated systems.",
        "The differentiation is architectural and compounding rather than a single feature advantage.",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Software ecosystem and existing production code create real switching costs, but those costs are lowest exactly where the market is growing fastest.",
        "Strong today. Rated four rather than five because inference is where the moat is thinnest and inference is where the volume is going.",
      ),
      marketPotential: fa(
        5,
        "verified",
        "AI compute demand is drawing capital expenditure from hyperscalers, enterprises, and national programmes simultaneously.",
        "Few markets of this size are still growing at this rate.",
      ),
      commercialReadiness: fa(
        5,
        "verified",
        "Fully commercial at very large scale across every buyer class.",
        "No readiness question exists here.",
      ),
      customerEvidence: fa(
        5,
        "verified",
        "Sustained data centre revenue growth reported across multiple periods.",
        "Customer evidence is as strong as public markets provide.",
      ),
      teamCredibility: fa(
        5,
        "verified",
        "Long-tenured leadership with a demonstrated record of correctly anticipating the shift to accelerated computing.",
        "Strategic judgment here has been repeatedly validated over multiple architecture cycles.",
      ),
      capitalEfficiency: fa(
        5,
        "verified",
        "Fabless model, so scale is achieved without owning fabrication capacity.",
        "Returns on invested capital are exceptional for a business of this size.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Competition from a direct merchant rival, several hyperscaler in-house programmes, and a set of inference-specialised entrants.",
        "Rated low because the most motivated competitors are also the largest customers, which is an unusually adverse structure.",
      ),
      technicalRisk: fa(
        5,
        "verified",
        "Products ship at volume and perform as specified. Execution risk is supply, not feasibility.",
        "Technical risk in the ordinary sense is close to absent.",
      ),
      regulatoryRisk: fa(
        2,
        "verified",
        "Export controls on advanced accelerators have already restricted specific products and markets.",
        "This is a live constraint with a history of changing at short notice.",
      ),
      financingRisk: fa(
        2,
        "judgment",
        "Balance sheet risk is negligible. Valuation risk is not.",
        "Rated on valuation rather than solvency: the price assumes a growth path with little room for a digestion year.",
      ),
      overlooked: fa(
        0,
        "verified",
        "The most closely followed company in the sector.",
        "There is no informational edge available here, which the score reflects honestly.",
      ),
    },
  },

  /* ------------------------------------------------------------------- AMD */
  {
    id: "amd",
    name: "Advanced Micro Devices",
    isDemonstration: false,
    marketType: "Public",
    hq: "Santa Clara, California",
    region: "North America",
    foundedYear: 1969,
    sector: "Semiconductors",
    subsector: "Processors and data centre accelerators",
    stage: "Public",
    description:
      "Designs server and client processors alongside a data centre accelerator line positioned as the credible merchant alternative for AI inference workloads.",
    businessModel:
      "Fabless semiconductor design sold to cloud providers, server manufacturers, and consumer channels, with the data centre segment carrying the growth case.",
    primaryCustomer:
      "Cloud providers and server original equipment manufacturers, plus a substantial client computing channel.",
    technicalDifferentiation:
      "Competitive memory capacity and bandwidth per accelerator, which suits inference on large models, combined with an established server processor franchise that gives access to the same buyers.",
    tractionSignal: estimate(
      "Data centre has become the largest segment, with accelerator revenue growing from a standing start over recent years.",
      SNAPSHOT,
      "Directionally well established. Confirm the current segment split in the latest filing.",
      "amd-ir",
    ),
    keyCatalyst:
      "Whether the open software stack reaches the point where large deployments treat it as genuinely interchangeable with the incumbent stack.",
    investmentRisk:
      "The accelerator case depends on software maturity, which is harder to schedule than silicon.",
    technicalRisk:
      "Performance per watt at rack scale depends on interconnect and networking as much as on the accelerator die.",
    competitiveThreat:
      "The incumbent platform's software ecosystem, and customer-designed silicon competing for the same inference workloads.",
    capitalIntensity: "Moderate",
    commercialReadiness: "Established",
    lastReviewed: "2026-07-24",
    sourceIds: ["amd-ir", "edgar-advanced-micro-devices", "sec-edgar"],
    financials: {
      kind: "public",
      ticker: "AMD",
      marketCap: estimate(
        "Above one hundred billion dollars",
        SNAPSHOT,
        "Band rather than point value.",
        "amd-ir",
      ),
      revenueGrowth: estimate(
        "Strong in data centre, materially slower in the client and embedded segments",
        SNAPSHOT,
        VERIFY,
        "edgar-advanced-micro-devices",
      ),
      grossMargin: estimate(
        "Around fifty percent on a reported basis, higher on a non-GAAP basis",
        SNAPSHOT,
        VERIFY,
        "edgar-advanced-micro-devices",
      ),
      operatingMargin: estimate(
        "Materially below the segment leader, reflecting mix and amortisation",
        SNAPSHOT,
        VERIFY,
        "edgar-advanced-micro-devices",
      ),
      cashPosition: estimate(
        "Net cash positive",
        SNAPSHOT,
        VERIFY,
        "edgar-advanced-micro-devices",
      ),
      valuationMultiple: unverified(
        SNAPSHOT,
        "edgar-advanced-micro-devices",
        "Pull current consensus rather than relying on a stored multiple.",
      ),
      marketExpectations:
        "The price carries an expectation of continued accelerator share gains. Server processor share gains, which are more predictable, are treated almost as a given.",
      earningsCatalysts: [
        "Data centre segment revenue and any disclosed accelerator run rate",
        "Named large-scale accelerator deployments",
        "Server processor share commentary",
      ],
    },
    technology: {
      howItWorks:
        "Accelerators pair large high bandwidth memory capacity with a compute die complex, addressed through an open software stack rather than a proprietary one. Server processors use a chiplet approach that improves yield economics at high core counts.",
      coreAdvantage:
        "Memory capacity per accelerator is genuinely useful for serving large models without splitting them across as many devices, which simplifies inference deployment.",
      supportingEvidence: [
        {
          claim:
            "The data centre segment has grown to become the largest contributor to revenue.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-advanced-micro-devices",
        },
        {
          claim:
            "The accelerator software stack is open source, which lowers the barrier for customers wanting to avoid a single-vendor dependency.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "amd-ir",
        },
      ],
      benchmarks:
        "Accelerator comparisons are highly configuration dependent and move with each software release. Any comparison more than two quarters old should be treated as expired.",
      intellectualProperty:
        "Processor architecture, chiplet packaging, and interconnect patents accumulated over a long history in the category.",
      thirdPartyDependency:
        "External foundry capacity at leading nodes, advanced packaging, and high bandwidth memory supply, all of which are shared constraints with competitors.",
      milestoneForScale:
        "A publicly referenced production inference deployment at a major cloud provider, sustained across a full product generation rather than a single evaluation.",
      failurePoints: [
        "Software maturity failing to reach the point where migration cost drops below the price advantage",
        "Networking and interconnect limiting rack-scale performance regardless of per-accelerator specification",
        "Memory and packaging supply allocated preferentially to a larger buyer",
      ],
    },
    market: {
      painPoint:
        "Large buyers want a credible second source for AI compute, both for price leverage and for supply resilience.",
      structure:
        "Concentrated buyers with strong incentives to fund an alternative, which is a structural tailwind independent of product quality.",
      adoptionDrivers: [
        "Buyer preference for dual sourcing on any component this strategically important",
        "Memory capacity advantages that suit inference on large models",
        "Open software reducing the perceived risk of vendor lock-in",
      ],
      whyNow:
        "Inference is more portable between hardware platforms than training, so the workload mix is moving toward the part of the market where the incumbent advantage is smallest.",
      competitors: [
        "NVIDIA",
        "Hyperscaler in-house accelerator programmes",
        "Intel in the server processor market",
      ],
      substitutes: [
        "Custom accelerators designed by the customer",
        "General-purpose processors for smaller inference workloads",
      ],
      regulatoryEnvironment:
        "Subject to the same export control regime as other advanced accelerator suppliers.",
      maturity: "Developing",
    },
    commercial: {
      pricingModel:
        "Negotiated volume pricing, positioned at a discount to the incumbent on a total cost of ownership basis.",
      salesMotion:
        "Direct enterprise and cloud sales, with server manufacturers carrying the broader channel.",
      customerType:
        "Cloud providers, server manufacturers, enterprises, and consumer channels.",
      adoptionEvidence: [
        {
          claim:
            "Accelerator revenue has grown from effectively nothing to a material contributor within a small number of years.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-advanced-micro-devices",
        },
        {
          claim:
            "Server processor share has increased steadily over multiple generations.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      implementationBurden:
        "Migration cost is engineering time rather than licence cost. That is precisely the barrier the open software strategy is designed to lower.",
      expansionOpportunity:
        "Rack-scale systems and networking content, following the same logic that raised content per rack for the incumbent.",
      goToMarketRisk:
        "Winning evaluations is not the same as winning production deployments, and the gap between the two is where this thesis is decided.",
    },
    investment: {
      thesis:
        "The only merchant alternative with both the silicon and the customer relationships to take meaningful accelerator share, in a market whose largest buyers actively want that alternative to exist.",
      bullCase:
        "Software maturity crosses the threshold, inference share compounds, and the server processor franchise funds the effort throughout.",
      baseCase:
        "Steady accelerator revenue growth from a small base, with the server processor business providing the reliable earnings underneath.",
      bearCase:
        "Software never quite closes the gap, custom silicon takes the volume inference workloads instead, and the accelerator line settles as a niche second source.",
      catalysts: [
        "A named, sustained production inference deployment at a major cloud provider",
        "Disclosed accelerator run rate",
        "Server processor share milestones",
      ],
      risks: [
        "Software ecosystem maturity",
        "Supply allocation for memory and advanced packaging",
        "Custom silicon taking the workloads this product targets",
      ],
      invalidators: [
        "Two consecutive years without a referenceable large-scale production inference win",
        "Server processor share stalling, which would remove the funding base for the accelerator effort",
      ],
      recommendedNextStep:
        "Track named production deployments rather than benchmark results, since the benchmark gap has been narrower than the deployment gap for several years.",
    },
    diligence: {
      technology: [
        "What specific software gaps remain between the two stacks for production inference serving, and what is the engineering cost to close them for a typical deployment?",
      ],
      product: [
        "How does memory capacity per accelerator change the number of devices required to serve a given model, and what does that do to total cost?",
      ],
      customers: [
        "Which production inference deployments are referenceable, at what scale, and for how long have they been running?",
      ],
      competition: [
        "For a hyperscaler already designing its own accelerator, what workloads would still go to a merchant second source?",
      ],
      unitEconomics: [
        "What gross margin does the accelerator line carry relative to the corporate average?",
      ],
      capitalRequirements: [
        "What foundry and memory capacity has been secured, and on what commitment terms?",
      ],
      regulation: [
        "How does the export control regime apply to this specific product line?",
      ],
      team: [
        "How has the software organisation grown relative to the silicon organisation over the past two years?",
      ],
      financing: [
        "How much of the current valuation depends on accelerator share assumptions rather than on the server processor business?",
      ],
      commercialization: [
        "What is the conversion rate from evaluation to production deployment, and how long does that transition take?",
      ],
    },
    outreach:
      "Not applicable. Tracked as a public-market comparison anchor rather than as a sourced private opportunity.",
    factors: {
      differentiation: fa(
        4,
        "verified",
        "Competitive accelerator silicon with a genuine memory capacity advantage, plus an established server processor franchise.",
        "Strong engineering, but the differentiation is on specification rather than on the full stack.",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Server processor share is defensible. Accelerator position depends on software maturity that is still being built.",
        "Split rating. The durable part of the business is not the part carrying the growth expectation.",
      ),
      marketPotential: fa(
        5,
        "verified",
        "Addresses the same AI compute market as the segment leader, with buyers structurally motivated to fund a second source.",
        "Market size is not the constraint here.",
      ),
      commercialReadiness: fa(
        5,
        "verified",
        "Shipping at volume across every segment it serves.",
        "Fully commercial.",
      ),
      customerEvidence: fa(
        4,
        "verified",
        "Accelerator revenue growth from a standing start, alongside multi-generation server processor share gains.",
        "Real and reported, though production inference references remain thinner than evaluation activity.",
      ),
      teamCredibility: fa(
        5,
        "verified",
        "Leadership executed one of the more complete turnarounds in the semiconductor industry over the past decade.",
        "The record on difficult multi-year execution is unusually strong.",
      ),
      capitalEfficiency: fa(
        4,
        "verified",
        "Fabless model with disciplined capital allocation.",
        "Efficient, though margins sit below the segment leader.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Competing against a dominant incumbent platform and against customers designing their own silicon.",
        "A genuinely difficult competitive position, mitigated only by buyer motivation for an alternative.",
      ),
      technicalRisk: fa(
        4,
        "verified",
        "Silicon ships and performs. The open risk is software maturity, not feasibility.",
        "Low hardware risk, moderate software risk.",
      ),
      regulatoryRisk: fa(
        2,
        "verified",
        "Same export control exposure as other advanced accelerator suppliers.",
        "A live constraint outside the company's control.",
      ),
      financingRisk: fa(
        3,
        "judgment",
        "Solid balance sheet. Valuation embeds accelerator share gains that have not yet been demonstrated at production scale.",
        "Moderate valuation risk rather than any solvency concern.",
      ),
      overlooked: fa(
        1,
        "verified",
        "Extensively covered, though the server processor business receives less attention than the accelerator narrative.",
        "Almost no informational edge available.",
      ),
    },
  },

  /* -------------------------------------------------------------- Broadcom */
  {
    id: "avgo",
    name: "Broadcom",
    isDemonstration: false,
    marketType: "Public",
    hq: "Palo Alto, California",
    region: "North America",
    foundedYear: 1961,
    sector: "Semiconductors",
    subsector: "Custom accelerators and data centre networking",
    stage: "Public",
    description:
      "Designs custom accelerators for hyperscale customers and supplies much of the Ethernet switching silicon that connects large AI clusters, alongside a large infrastructure software business.",
    businessModel:
      "Custom silicon design engagements with a small number of very large customers, merchant networking silicon sold broadly, and enterprise software sold on long-term contracts.",
    primaryCustomer:
      "Hyperscale cloud providers for custom silicon and networking, large enterprises for infrastructure software.",
    technicalDifferentiation:
      "The combination is unusual: the design capability to build a customer's accelerator and the networking silicon that connects it, which means the company benefits whichever accelerator architecture wins.",
    tractionSignal: estimate(
      "AI-related semiconductor revenue has grown rapidly, driven by custom accelerator programmes and Ethernet switching for cluster networking.",
      SNAPSHOT,
      "Directionally well established. Confirm current disclosure in the latest filing.",
      "avgo-ir",
    ),
    keyCatalyst:
      "Whether additional hyperscale customers commit to multi-generation custom accelerator programmes.",
    investmentRisk:
      "Extreme customer concentration in the custom silicon business, where losing one programme is material.",
    technicalRisk:
      "Custom accelerator programmes run on multi-year cycles, so a design decision made today is not validated in revenue for years.",
    competitiveThreat:
      "Rival custom silicon design houses, and any move by hyperscalers to build design capability internally.",
    capitalIntensity: "Moderate",
    commercialReadiness: "Established",
    lastReviewed: "2026-07-24",
    sourceIds: ["avgo-ir", "edgar-broadcom", "sec-edgar"],
    financials: {
      kind: "public",
      ticker: "AVGO",
      marketCap: estimate(
        "Above five hundred billion dollars",
        SNAPSHOT,
        "Band rather than point value.",
        "avgo-ir",
      ),
      revenueGrowth: estimate(
        "Strong in AI-related semiconductors, slower in the non-AI semiconductor and software segments",
        SNAPSHOT,
        VERIFY,
        "edgar-broadcom",
      ),
      grossMargin: estimate(
        "High, reflecting a mix weighted toward software and custom silicon",
        SNAPSHOT,
        VERIFY,
        "edgar-broadcom",
      ),
      operatingMargin: estimate(
        "High on a non-GAAP basis, materially lower on a reported basis because of acquisition amortisation",
        SNAPSHOT,
        VERIFY,
        "edgar-broadcom",
      ),
      cashPosition: estimate(
        "Carries substantial acquisition-related debt alongside strong operating cash flow",
        SNAPSHOT,
        VERIFY,
        "edgar-broadcom",
      ),
      valuationMultiple: unverified(
        SNAPSHOT,
        "edgar-broadcom",
        "Reported and non-GAAP figures differ substantially here. Confirm which basis any quoted multiple uses.",
      ),
      marketExpectations:
        "The price embeds continued custom accelerator programme wins. The software business is treated as a stable cash generator rather than a growth driver.",
      earningsCatalysts: [
        "Disclosed AI revenue and any commentary on the number of custom silicon customers",
        "Ethernet switching share against competing cluster interconnect approaches",
        "Software segment renewal economics",
      ],
    },
    technology: {
      howItWorks:
        "Custom accelerator engagements take a customer's architectural intent and deliver a manufacturable design, including the packaging and interconnect work. Networking silicon moves traffic between accelerators, which at cluster scale determines whether the compute is usable.",
      coreAdvantage:
        "Very few organisations can execute a leading-node custom design with advanced packaging. That scarcity, rather than any single product, is the position.",
      supportingEvidence: [
        {
          claim:
            "Custom accelerator programmes with hyperscale customers are an established and disclosed part of the business.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "avgo-ir",
        },
        {
          claim:
            "Ethernet switching silicon is widely used in large cluster networking.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-broadcom",
        },
      ],
      benchmarks:
        "Custom silicon performance is generally not published, since the customer treats it as competitive information. This is a category where public benchmarking is structurally unavailable.",
      intellectualProperty:
        "Serialiser and deserialiser designs, packaging methods, networking architecture, and a very large accumulated patent portfolio.",
      thirdPartyDependency:
        "Leading-node foundry capacity and advanced packaging, the same constraint every accelerator supplier faces.",
      milestoneForScale:
        "Already at scale. The forward milestone is converting additional prospective custom silicon customers into committed multi-generation programmes.",
      failurePoints: [
        "A large custom programme cancelled or moved in-house by the customer",
        "Alternative cluster interconnect approaches displacing merchant Ethernet switching",
        "Advanced packaging capacity constraints delaying programme deliveries",
      ],
    },
    market: {
      painPoint:
        "Hyperscalers want accelerators tuned to their own workloads and their own cost structure, but very few can execute a leading-node design alone.",
      structure:
        "A small number of buyers, each capable of supporting a large programme, and a small number of vendors capable of delivering one.",
      adoptionDrivers: [
        "Hyperscaler determination to reduce dependence on a single merchant accelerator supplier",
        "Total cost of ownership advantages when silicon is tuned to a known internal workload",
        "Growth in cluster size, which raises networking content per deployment",
      ],
      whyNow:
        "Inference workloads at hyperscale are stable and well understood, which is exactly the condition under which custom silicon beats general-purpose silicon on cost.",
      competitors: [
        "Marvell Technology",
        "Alchip and other design service providers",
        "In-house hyperscaler design teams",
        "NVIDIA networking for cluster interconnect",
      ],
      substitutes: [
        "Merchant accelerators bought directly",
        "Proprietary interconnect fabrics in place of merchant Ethernet",
      ],
      regulatoryEnvironment:
        "Export controls apply to advanced designs. Large acquisitions attract antitrust scrutiny across multiple jurisdictions.",
      maturity: "Developing",
    },
    commercial: {
      pricingModel:
        "Non-recurring engineering fees plus per-unit pricing on custom programmes, standard component pricing on merchant networking, and multi-year contracts in software.",
      salesMotion:
        "Small number of very large, long-cycle direct relationships.",
      customerType:
        "Hyperscale cloud providers and large enterprises.",
      adoptionEvidence: [
        {
          claim:
            "Multiple hyperscale custom silicon programmes are in production.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "avgo-ir",
        },
        {
          claim:
            "Ethernet switching has retained a strong position as cluster sizes have grown.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      implementationBurden:
        "A custom programme is a multi-year commitment for both parties, which makes each win durable and each loss expensive.",
      expansionOpportunity:
        "Additional custom silicon customers, and rising networking content as clusters scale.",
      goToMarketRisk:
        "The customer list is short enough that the pipeline is measured in relationships rather than in deals.",
    },
    investment: {
      thesis:
        "A position that profits from AI infrastructure growth without depending on which accelerator architecture wins, since the company either builds the alternative or connects it.",
      bullCase:
        "Custom silicon becomes the default for hyperscale inference and the customer count grows, while networking content per cluster keeps rising.",
      baseCase:
        "Existing programmes scale steadily, networking holds share, and the software business funds the dividend and deleveraging.",
      bearCase:
        "A major customer takes design in-house, and proprietary interconnect displaces merchant Ethernet in the largest clusters.",
      catalysts: [
        "New custom silicon customer commitments",
        "Ethernet switching share in the largest deployments",
        "Software segment renewal rates",
      ],
      risks: [
        "Customer concentration",
        "Acquisition-related leverage",
        "Long design cycles that delay visibility into problems",
      ],
      invalidators: [
        "A flagship custom programme moving to a competitor or in-house",
        "Proprietary interconnect displacing merchant Ethernet at the largest cluster sizes",
      ],
      recommendedNextStep:
        "Track the disclosed count of committed custom silicon customers, which is the cleanest available proxy for the durability of this position.",
    },
    diligence: {
      technology: [
        "What proportion of the custom design work is genuinely differentiated versus available from other design service providers?",
      ],
      product: [
        "How does networking content per rack scale as cluster sizes grow, and does that ratio hold at the largest deployments?",
      ],
      customers: [
        "How many custom silicon customers are committed to a second or third generation, which is the real test of a programme?",
      ],
      competition: [
        "What would it cost a hyperscaler to bring this design capability fully in-house, and how many have started?",
      ],
      unitEconomics: [
        "How do custom silicon margins compare with merchant networking margins?",
      ],
      capitalRequirements: [
        "What advanced packaging capacity is committed, and over what horizon?",
      ],
      regulation: [
        "What export control exposure attaches to custom designs built for customers operating globally?",
      ],
      team: [
        "How much of the design capability is concentrated in teams acquired rather than built, and what is the retention picture?",
      ],
      financing: [
        "What is the deleveraging path, and how sensitive is it to a slowdown in AI-related revenue?",
      ],
      commercialization: [
        "What is the typical time from design win to volume revenue, and how has that changed?",
      ],
    },
    outreach:
      "Not applicable. Tracked as a public-market comparison anchor rather than as a sourced private opportunity.",
    factors: {
      differentiation: fa(
        5,
        "verified",
        "One of very few organisations able to deliver a leading-node custom accelerator design together with the networking silicon around it.",
        "The combination is genuinely scarce and hard to assemble.",
      ),
      defensibility: fa(
        5,
        "judgment",
        "Multi-year design programmes with deep customer integration create switching costs measured in years.",
        "Among the most defensible positions in the AI supply chain.",
      ),
      marketPotential: fa(
        5,
        "verified",
        "Exposure to both custom accelerators and cluster networking, two of the fastest growing parts of the buildout.",
        "Large and growing on both sides of the business.",
      ),
      commercialReadiness: fa(
        5,
        "verified",
        "Programmes in production at scale.",
        "Fully commercial.",
      ),
      customerEvidence: fa(
        5,
        "verified",
        "Multiple hyperscale programmes in production with disclosed AI revenue growth.",
        "As strong as this category allows.",
      ),
      teamCredibility: fa(
        5,
        "verified",
        "Long record of acquiring and operating semiconductor and software assets at high margin.",
        "Execution and capital allocation record is consistent over many years.",
      ),
      capitalEfficiency: fa(
        4,
        "verified",
        "High margins and strong cash generation, offset by substantial acquisition-related debt.",
        "Efficient operationally, leveraged financially.",
      ),
      competitiveIntensity: fa(
        4,
        "judgment",
        "Few credible competitors for leading-node custom design, though the customers themselves are the long-term threat.",
        "A relatively favourable competitive position by the standards of this sector.",
      ),
      technicalRisk: fa(
        4,
        "verified",
        "Proven execution across multiple programmes and process nodes.",
        "Low, with residual risk in advanced packaging availability.",
      ),
      regulatoryRisk: fa(
        3,
        "judgment",
        "Export control exposure on advanced designs, and antitrust scrutiny on large acquisitions.",
        "Moderate and manageable, but not absent.",
      ),
      financingRisk: fa(
        3,
        "judgment",
        "Meaningful leverage from acquisitions, serviced comfortably by current cash flow.",
        "Rated on the leverage rather than on any near-term concern.",
      ),
      overlooked: fa(
        1,
        "verified",
        "Widely covered, though the networking contribution is less well understood than the custom silicon story.",
        "Minimal informational edge.",
      ),
    },
  },

  /* ---------------------------------------------------------------- Micron */
  {
    id: "mu",
    name: "Micron Technology",
    isDemonstration: false,
    marketType: "Public",
    hq: "Boise, Idaho",
    region: "North America",
    foundedYear: 1978,
    sector: "Semiconductors",
    subsector: "Memory and high bandwidth memory",
    stage: "Public",
    description:
      "One of three companies in the world capable of manufacturing high bandwidth memory at volume, a component that has moved from commodity to allocated constraint in AI accelerator supply.",
    businessModel:
      "Capital-intensive memory manufacturing sold to accelerator vendors, server manufacturers, and consumer device makers, with high bandwidth memory increasingly sold on long-term contracted terms rather than at spot prices.",
    primaryCustomer:
      "Accelerator designers, cloud providers, server manufacturers, and mobile device makers.",
    technicalDifferentiation:
      "Process and packaging capability at a scale only two other companies possess. Stacking memory dies with acceptable yield and thermal behaviour is a manufacturing problem that resists shortcuts.",
    tractionSignal: estimate(
      "High bandwidth memory has become a supply-constrained product sold on long-term agreements, a structural change from the historical spot-priced memory cycle.",
      SNAPSHOT,
      "Directionally well established. Confirm current contracting disclosure in the latest filing.",
      "mu-ir",
    ),
    keyCatalyst:
      "Whether high bandwidth memory contracting holds through the next memory downcycle, which would confirm a genuine structural change rather than a cyclical peak.",
    investmentRisk:
      "Memory has been a deeply cyclical industry for forty years, and the argument that this time is structurally different has been made before.",
    technicalRisk:
      "Each high bandwidth memory generation raises stack height and thermal density, and yield on new generations has historically been the binding constraint.",
    competitiveThreat:
      "Two larger memory manufacturers with more capital and, historically, more willingness to add capacity into a downturn.",
    capitalIntensity: "Very High",
    commercialReadiness: "Established",
    lastReviewed: "2026-07-22",
    sourceIds: ["mu-ir", "edgar-micron-technology", "sec-edgar"],
    financials: {
      kind: "public",
      ticker: "MU",
      marketCap: estimate(
        "Above one hundred billion dollars",
        SNAPSHOT,
        "Band rather than point value.",
        "mu-ir",
      ),
      revenueGrowth: estimate(
        "Strong, driven by data centre memory, though the segment mix remains cyclical",
        SNAPSHOT,
        VERIFY,
        "edgar-micron-technology",
      ),
      grossMargin: estimate(
        "Highly cyclical, swinging materially between the trough and the peak of a memory cycle",
        SNAPSHOT,
        "Memory gross margin is the single most cycle-sensitive figure in this universe. A stored value would be actively misleading.",
        "edgar-micron-technology",
      ),
      operatingMargin: estimate(
        "Follows gross margin closely because the cost base is largely fixed",
        SNAPSHOT,
        VERIFY,
        "edgar-micron-technology",
      ),
      cashPosition: estimate(
        "Carries debt alongside a heavy ongoing capital expenditure commitment",
        SNAPSHOT,
        VERIFY,
        "edgar-micron-technology",
      ),
      valuationMultiple: unverified(
        SNAPSHOT,
        "edgar-micron-technology",
        "Earnings multiples on cyclical memory companies invert at the wrong moments. Price to book is usually the more informative measure.",
      ),
      marketExpectations:
        "The price reflects a debate about whether high bandwidth memory demand structurally dampens the memory cycle or merely delays it.",
      earningsCatalysts: [
        "High bandwidth memory capacity commitments and sold-out commentary",
        "Capital expenditure guidance, which signals industry supply discipline",
        "Conventional memory pricing, which still drives a large share of earnings",
      ],
    },
    technology: {
      howItWorks:
        "High bandwidth memory stacks multiple memory dies vertically and connects them with through-silicon vias, then places the stack beside the processor die on a shared package. The result is far greater bandwidth than memory placed on the board.",
      coreAdvantage:
        "Yield at high stack heights. The design is broadly understood across the industry; manufacturing it economically is not.",
      supportingEvidence: [
        {
          claim:
            "High bandwidth memory is sold under long-term agreements rather than at spot prices, unlike conventional memory.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "mu-ir",
        },
        {
          claim:
            "Memory has been described as a constraint on accelerator shipment volumes during parts of the current cycle.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      benchmarks:
        "Bandwidth per stack and capacity per stack are published per generation. Yield, which determines profitability, is not disclosed by any manufacturer.",
      intellectualProperty:
        "Process technology, stacking and through-silicon via methods, and a large manufacturing patent portfolio.",
      thirdPartyDependency:
        "Semiconductor manufacturing equipment from a small number of suppliers, with long lead times that make capacity decisions effectively irreversible for two to three years.",
      milestoneForScale:
        "Reaching volume yield on each successive high bandwidth memory generation on the schedule accelerator customers have designed around.",
      failurePoints: [
        "Yield on a new generation arriving late, which forfeits an entire product cycle to competitors",
        "Thermal limits at higher stack heights constraining usable capacity",
        "Capacity added across the industry at the same time, restoring the classic oversupply dynamic",
      ],
    },
    market: {
      painPoint:
        "Accelerator performance is limited by memory bandwidth long before it is limited by arithmetic throughput. Inference on large models is a memory problem before it is a compute problem.",
      structure:
        "Three suppliers globally. Concentrated on both sides, which is why long-term agreements have replaced spot pricing for the constrained product.",
      adoptionDrivers: [
        "Model sizes growing faster than memory capacity per package",
        "Inference workloads that are memory bandwidth bound by nature",
        "Accelerator roadmaps that design in specific memory generations years ahead",
      ],
      whyNow:
        "Memory has moved from a component bought on price to a component allocated on relationship. That has not been true in this industry for a very long time.",
      competitors: [
        "SK Hynix",
        "Samsung Electronics",
      ],
      substitutes: [
        "On-package cache and alternative memory architectures for specific workloads",
        "Model quantisation and compression that reduce memory required per unit of output",
      ],
      regulatoryEnvironment:
        "Manufacturing incentive programmes and export controls both apply. Fabrication location has become a policy question as well as an economic one.",
      maturity: "Developing",
    },
    commercial: {
      pricingModel:
        "Long-term contracted pricing for high bandwidth memory, spot and contract pricing for conventional memory.",
      salesMotion:
        "Direct engagement with a small number of accelerator designers, planned several years ahead of production.",
      customerType:
        "Accelerator vendors, cloud providers, server and device manufacturers.",
      adoptionEvidence: [
        {
          claim:
            "High bandwidth memory capacity has been described as committed well ahead of production.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "mu-ir",
        },
        {
          claim:
            "Data centre has grown as a share of total revenue relative to consumer segments.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      implementationBurden:
        "Qualification into an accelerator design takes years, which makes each design win durable and each miss costly.",
      expansionOpportunity:
        "Higher capacity stacks, custom memory configurations for specific accelerators, and content growth per accelerator generation.",
      goToMarketRisk:
        "Demand is derived from accelerator shipments, so the company inherits its customers' cycle without controlling it.",
    },
    investment: {
      thesis:
        "A structurally improved position in a historically brutal industry, where the constrained product is now contracted rather than spot priced and the buyer list is short enough to make supply discipline plausible.",
      bullCase:
        "High bandwidth memory demand grows faster than the industry adds capacity, contracting holds, and margin volatility genuinely narrows.",
      baseCase:
        "Strong data centre demand offsets softer consumer memory, with the cycle dampened but not eliminated.",
      bearCase:
        "All three manufacturers add capacity simultaneously, and the industry rediscovers oversupply exactly as accelerator demand pauses.",
      catalysts: [
        "Capacity commitments and sold-out commentary for the next memory generation",
        "Industry-wide capital expenditure discipline",
        "Yield milestones on the next generation",
      ],
      risks: [
        "The memory cycle reasserting itself",
        "Yield problems on a generation transition",
        "Capital expenditure requirements that continue regardless of the cycle position",
      ],
      invalidators: [
        "High bandwidth memory reverting to spot pricing, which would confirm the structural change was cyclical after all",
        "A competitor reaching volume yield on a generation a year ahead",
      ],
      recommendedNextStep:
        "Track industry capital expenditure across all three manufacturers rather than demand commentary, since supply discipline has always been the variable that decides memory returns.",
    },
    diligence: {
      technology: [
        "What is the yield trajectory on the current high bandwidth memory generation relative to the previous one at the same point?",
      ],
      product: [
        "How much of the capacity is qualified into designs that are already in volume production versus still in development?",
      ],
      customers: [
        "How concentrated is high bandwidth memory revenue among accelerator customers, and what are the contract terms?",
      ],
      competition: [
        "What capacity are the other two manufacturers adding, and on what timeline?",
      ],
      unitEconomics: [
        "What is the margin difference between high bandwidth memory and conventional memory at current pricing?",
      ],
      capitalRequirements: [
        "What capital expenditure is committed over the next three years, and how much of it is contractually irreversible?",
      ],
      regulation: [
        "How do manufacturing incentive programmes and export controls affect the fabrication footprint?",
      ],
      team: [
        "What is the record on hitting yield milestones for previous generation transitions?",
      ],
      financing: [
        "How is capital expenditure funded through a trough, and what does the balance sheet look like at the bottom of a cycle?",
      ],
      commercialization: [
        "How long are the long-term agreements, and what happens to pricing when they renew?",
      ],
    },
    outreach:
      "Not applicable. Tracked as a public-market comparison anchor rather than as a sourced private opportunity.",
    factors: {
      differentiation: fa(
        4,
        "verified",
        "One of three companies globally able to manufacture high bandwidth memory at volume.",
        "Genuine scarcity, though the scarcity is shared with two larger competitors.",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Capital intensity and multi-year design qualification cycles make entry effectively impossible.",
        "Very high barriers to entry, but only moderate protection against the two existing peers.",
      ),
      marketPotential: fa(
        5,
        "verified",
        "Memory content per accelerator rises with each generation, and inference is memory bound by nature.",
        "Demand growth is structurally tied to the fastest growing part of computing.",
      ),
      commercialReadiness: fa(
        5,
        "verified",
        "Manufacturing and shipping at very large scale.",
        "Fully commercial.",
      ),
      customerEvidence: fa(
        5,
        "verified",
        "Capacity committed ahead of production under long-term agreements.",
        "Unusually strong forward visibility for this industry.",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "Navigated multiple memory cycles and executed the transition into high bandwidth memory.",
        "Solid operational record in a category that punishes error severely.",
      ),
      capitalEfficiency: fa(
        2,
        "verified",
        "Capital expenditure runs at a very high proportion of revenue and continues through downturns.",
        "Structurally low by the nature of memory manufacturing, not through any failure of management.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Three-player oligopoly, with the other two both larger.",
        "Better than a fragmented market, worse than a duopoly with a clear leader.",
      ),
      technicalRisk: fa(
        3,
        "judgment",
        "Each generation raises stack height and thermal density, and yield is the recurring risk.",
        "Moderate and recurring rather than existential.",
      ),
      regulatoryRisk: fa(
        3,
        "verified",
        "Manufacturing incentives and export controls both apply to the fabrication footprint.",
        "Manageable, and currently more supportive than restrictive.",
      ),
      financingRisk: fa(
        3,
        "judgment",
        "Heavy ongoing capital commitments that do not pause when revenue does.",
        "The main financial risk is committing capacity into a cycle that turns.",
      ),
      overlooked: fa(
        2,
        "judgment",
        "Well covered, though the structural argument about contracted memory pricing is less settled than the accelerator narrative.",
        "Some genuine analytical disagreement remains available here.",
      ),
    },
  },

  /* ------------------------------------------------------------------- Arm */
  {
    id: "arm",
    name: "Arm Holdings",
    isDemonstration: false,
    marketType: "Public",
    hq: "Cambridge, United Kingdom",
    region: "Europe",
    foundedYear: 1990,
    sector: "Semiconductors",
    subsector: "Processor architecture and licensing",
    stage: "Public",
    description:
      "Licenses the processor architecture that most mobile devices and a growing share of data centre servers are built on, earning a royalty on chips it does not manufacture.",
    businessModel:
      "Upfront licence fees for access to the architecture and designs, followed by a per-unit royalty on every chip shipped, which produces revenue that compounds across decades of design wins.",
    primaryCustomer:
      "Semiconductor companies, hyperscale cloud providers designing their own processors, and device manufacturers.",
    technicalDifferentiation:
      "Power efficiency at the instruction set level, and an ecosystem of tooling and software support that a competing architecture would need decades to reproduce.",
    tractionSignal: estimate(
      "Data centre processors based on this architecture have been deployed at scale by multiple hyperscale cloud providers.",
      SNAPSHOT,
      "Well established publicly. Confirm current royalty disclosure in the latest filing.",
      "arm-ir",
    ),
    keyCatalyst:
      "Whether the move toward higher-value compute subsystems raises royalty rate per chip rather than merely royalty volume.",
    investmentRisk:
      "Royalty revenue lags design wins by years, so the reported figures describe decisions made well in the past.",
    technicalRisk:
      "An open competing instruction set architecture is improving and carries no licence fee, which pressures the low end first.",
    competitiveThreat:
      "RISC-V at the low end, and the risk that the largest licensees invest in alternatives to reduce dependency.",
    capitalIntensity: "Low",
    commercialReadiness: "Established",
    lastReviewed: "2026-07-21",
    sourceIds: ["arm-ir", "edgar-arm-holdings", "sec-edgar"],
    financials: {
      kind: "public",
      ticker: "ARM",
      marketCap: estimate(
        "Above one hundred billion dollars",
        SNAPSHOT,
        "Band rather than point value.",
        "arm-ir",
      ),
      revenueGrowth: estimate(
        "Solid, with royalty growth tracking both unit volumes and rising royalty rates on newer architecture versions",
        SNAPSHOT,
        VERIFY,
        "edgar-arm-holdings",
      ),
      grossMargin: estimate(
        "Very high, characteristic of an intellectual property licensing model",
        SNAPSHOT,
        VERIFY,
        "edgar-arm-holdings",
      ),
      operatingMargin: estimate(
        "Substantially lower than gross margin because of sustained research and development investment",
        SNAPSHOT,
        VERIFY,
        "edgar-arm-holdings",
      ),
      cashPosition: estimate(
        "Net cash positive with minimal capital requirements",
        SNAPSHOT,
        VERIFY,
        "edgar-arm-holdings",
      ),
      valuationMultiple: unverified(
        SNAPSHOT,
        "edgar-arm-holdings",
        "This company has traded at a substantial premium to the semiconductor sector. Confirm the current figure before drawing any conclusion.",
      ),
      marketExpectations:
        "The price assumes both continued data centre penetration and a rising royalty rate per chip. Volume growth alone is unlikely to be sufficient.",
      earningsCatalysts: [
        "Royalty rate per chip on newer architecture versions",
        "Data centre design wins at hyperscale customers",
        "Compute subsystem adoption, which raises value captured per device",
      ],
    },
    technology: {
      howItWorks:
        "The company designs instruction sets and processor cores, then licenses them. Customers either implement the architecture themselves or license a finished core design, and pay a royalty on each chip shipped.",
      coreAdvantage:
        "Power efficiency and, more importantly, the accumulated software ecosystem. Operating systems, compilers, and applications already target this architecture, which is a cost no competitor can simply spend past.",
      supportingEvidence: [
        {
          claim:
            "Multiple hyperscale cloud providers have deployed data centre processors based on this architecture at scale.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "arm-ir",
        },
        {
          claim:
            "The architecture holds a dominant position in mobile processors.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-arm-holdings",
        },
      ],
      benchmarks:
        "Performance depends entirely on the licensee's implementation, so architecture-level benchmarking is close to meaningless. Compare specific implementations only.",
      intellectualProperty:
        "The instruction set architecture itself, core designs, and the associated patent portfolio. Intellectual property is not a supporting asset here, it is the entire product.",
      thirdPartyDependency:
        "None in manufacturing. The dependency is on licensees continuing to choose this architecture for new designs.",
      milestoneForScale:
        "Already at scale. The forward milestone is raising value captured per device through complete compute subsystems rather than individual cores.",
      failurePoints: [
        "RISC-V adoption moving from embedded applications upward into higher value sockets",
        "A large licensee designing away from the architecture entirely",
        "Royalty rate increases meeting sustained resistance from the largest customers",
      ],
    },
    market: {
      painPoint:
        "Designing a processor from scratch is expensive and slow. Licensing a proven architecture with an existing software ecosystem removes most of that cost.",
      structure:
        "A very large number of licensees, with revenue concentrated among the largest device and cloud companies.",
      adoptionDrivers: [
        "Power efficiency becoming a binding constraint in data centres as well as in mobile devices",
        "Hyperscalers designing custom processors and preferring a proven architecture to start from",
        "Software ecosystem breadth that removes porting risk",
      ],
      whyNow:
        "Data centre power budgets are now the limiting factor on deployment, which turns a mobile-derived efficiency advantage into a data centre advantage.",
      competitors: [
        "RISC-V International and the open architecture ecosystem",
        "x86 architecture vendors in servers and clients",
      ],
      substitutes: [
        "Fully in-house instruction set architectures at the largest companies",
        "Open architectures with no licence fee",
      ],
      regulatoryEnvironment:
        "Export control and technology transfer rules apply to architecture licensing, and licensing to some jurisdictions has been restricted.",
      maturity: "Mature",
    },
    commercial: {
      pricingModel:
        "Upfront licence fee plus per-unit royalty, with royalty rates rising on newer architecture versions and on complete subsystems.",
      salesMotion:
        "Long-cycle direct licensing, with relationships measured in decades rather than contract terms.",
      customerType:
        "Semiconductor companies, hyperscale cloud providers, and device manufacturers.",
      adoptionEvidence: [
        {
          claim:
            "Data centre processors based on this architecture are deployed at scale by more than one hyperscale provider.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "arm-ir",
        },
        {
          claim:
            "Royalty revenue continues to accrue from designs licensed many years earlier.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-arm-holdings",
        },
      ],
      implementationBurden:
        "Low for the licensee relative to designing an architecture, which is the entire commercial proposition.",
      expansionOpportunity:
        "Complete compute subsystems rather than individual cores, which raises the royalty base per device substantially.",
      goToMarketRisk:
        "Raising royalty rates on customers who are large enough to fund an alternative is a delicate exercise with a real limit.",
    },
    investment: {
      thesis:
        "A royalty stream on a very large share of the world's processors, with an option on data centre penetration, priced as though both the volume growth and the rate increase are already secured.",
      bullCase:
        "Data centre share compounds, compute subsystems raise the royalty base per device, and the model captures far more value per chip than it does today.",
      baseCase:
        "Steady royalty growth from mobile and embedded, with data centre adding a slow and durable increment.",
      bearCase:
        "RISC-V erodes the low end while the largest customers resist rate increases, leaving volume growth without value growth.",
      catalysts: [
        "Royalty rate per chip disclosure",
        "New hyperscale data centre design wins",
        "Compute subsystem adoption rates",
      ],
      risks: [
        "Open architecture competition at the low end",
        "Customer concentration among licensees able to fund alternatives",
        "A valuation that assumes both volume and rate expansion",
      ],
      invalidators: [
        "Royalty rate per chip flattening across two or more years",
        "A major licensee announcing a migration away from the architecture for a high volume product line",
      ],
      recommendedNextStep:
        "Track royalty per chip rather than total royalty revenue, since volume growth alone does not support the current valuation.",
    },
    diligence: {
      technology: [
        "Where is RISC-V genuinely competitive today, and what is the highest value socket it has won?",
      ],
      product: [
        "What proportion of new design wins are complete subsystems rather than individual cores?",
      ],
      customers: [
        "How concentrated is royalty revenue among the top five licensees?",
      ],
      competition: [
        "What would it cost a top licensee to migrate a high volume product line to an open architecture, including software?",
      ],
      unitEconomics: [
        "What is the trend in average royalty per chip, separated from unit volume growth?",
      ],
      capitalRequirements: [
        "How much research and development is required to maintain architectural leadership, and is that figure growing faster than revenue?",
      ],
      regulation: [
        "Which jurisdictions face licensing restrictions, and what revenue is affected?",
      ],
      team: [
        "How stable is the architecture leadership team following the public listing?",
      ],
      financing: [
        "What does the current valuation imply about royalty per chip in five years, and is that implied rate one customers would accept?",
      ],
      commercialization: [
        "How long does a design win take to convert into royalty revenue, and what is currently in that pipeline?",
      ],
    },
    outreach:
      "Not applicable. Tracked as a public-market comparison anchor rather than as a sourced private opportunity.",
    factors: {
      differentiation: fa(
        4,
        "verified",
        "A dominant instruction set architecture with an ecosystem that took three decades to build.",
        "Extremely strong, though the architecture itself is increasingly replicable by open alternatives.",
      ),
      defensibility: fa(
        5,
        "judgment",
        "Software ecosystem and installed design base create switching costs measured in years per product line.",
        "Among the most defensible positions in semiconductors.",
      ),
      marketPotential: fa(
        4,
        "verified",
        "Mobile is mature, but data centre penetration and rising royalty rates provide two independent growth paths.",
        "Real growth available, though from a large and partly saturated base.",
      ),
      commercialReadiness: fa(
        5,
        "verified",
        "Licensing at scale across the entire industry.",
        "Fully commercial.",
      ),
      customerEvidence: fa(
        5,
        "verified",
        "Deployed at scale by multiple hyperscale providers and effectively every mobile device manufacturer.",
        "Evidence is about as complete as it gets.",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "Long institutional record of architecture stewardship across many generations.",
        "Strong, with some uncertainty following the change in ownership structure.",
      ),
      capitalEfficiency: fa(
        5,
        "verified",
        "Licensing model with minimal capital requirements and very high gross margin.",
        "Structurally one of the most capital efficient models in the sector.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "RISC-V is improving and free, and the largest licensees have the resources to fund alternatives.",
        "Currently comfortable, with a credible long-term challenger.",
      ),
      technicalRisk: fa(
        5,
        "verified",
        "No manufacturing risk and a proven architecture.",
        "Close to absent.",
      ),
      regulatoryRisk: fa(
        3,
        "verified",
        "Export control and technology transfer rules restrict licensing to some jurisdictions.",
        "Real but bounded.",
      ),
      financingRisk: fa(
        2,
        "judgment",
        "No balance sheet concern. The valuation embeds both volume and royalty rate expansion.",
        "Rated on valuation risk, which is the highest in this universe relative to demonstrated growth.",
      ),
      overlooked: fa(
        1,
        "verified",
        "Closely followed since the public listing.",
        "Minimal informational edge.",
      ),
    },
  },

  /* ---------------------------------------------------------- Astera Labs */
  {
    id: "alab",
    name: "Astera Labs",
    isDemonstration: false,
    marketType: "Public",
    hq: "Santa Clara, California",
    region: "North America",
    foundedYear: 2017,
    sector: "AI Infrastructure",
    subsector: "Connectivity silicon and rack-scale interconnect",
    stage: "Public",
    description:
      "Builds the connectivity silicon that moves data between accelerators, processors, and memory inside AI racks, a layer that becomes a bottleneck exactly as clusters grow.",
    businessModel:
      "Semiconductor products sold to cloud providers and system manufacturers, supported by a software layer for fleet-level diagnostics that raises switching costs beyond the component itself.",
    primaryCustomer:
      "Hyperscale cloud providers and the original equipment manufacturers building systems for them.",
    technicalDifferentiation:
      "Signal integrity engineering at the data rates modern accelerator interconnect requires, combined with diagnostic software that operators come to depend on for debugging fleets.",
    tractionSignal: estimate(
      "Revenue has grown rapidly alongside AI rack deployments, from a small base and with high customer concentration.",
      SNAPSHOT,
      "Directionally well established. Confirm current concentration disclosure in the latest filing.",
      "alab-ir",
    ),
    keyCatalyst:
      "Adoption of newer rack-scale interconnect standards, where content per rack rises materially if the company holds its position.",
    investmentRisk:
      "Revenue is concentrated in a very small number of customers, each large enough to develop or source alternatives.",
    technicalRisk:
      "Interconnect standards evolve quickly, and a missed generation transition removes the company from a full product cycle.",
    competitiveThreat:
      "Larger connectivity vendors with broader portfolios, and accelerator vendors integrating this function into their own platforms.",
    capitalIntensity: "Moderate",
    commercialReadiness: "Scaling",
    lastReviewed: "2026-07-20",
    sourceIds: ["alab-ir", "edgar-astera-labs", "sec-edgar"],
    financials: {
      kind: "public",
      ticker: "ALAB",
      marketCap: estimate(
        "In the tens of billions of dollars",
        SNAPSHOT,
        "Band rather than point value.",
        "alab-ir",
      ),
      revenueGrowth: estimate(
        "Very high, from a small base, tracking AI rack deployment volumes",
        SNAPSHOT,
        VERIFY,
        "edgar-astera-labs",
      ),
      grossMargin: estimate(
        "High, in the range typical of differentiated connectivity silicon",
        SNAPSHOT,
        VERIFY,
        "edgar-astera-labs",
      ),
      operatingMargin: estimate(
        "Positive on a non-GAAP basis, with reported figures affected by share-based compensation",
        SNAPSHOT,
        VERIFY,
        "edgar-astera-labs",
      ),
      cashPosition: estimate(
        "Net cash positive following the public listing",
        SNAPSHOT,
        VERIFY,
        "edgar-astera-labs",
      ),
      valuationMultiple: unverified(
        SNAPSHOT,
        "edgar-astera-labs",
        "Trades on revenue multiples rather than earnings. Confirm the current figure and the basis used.",
      ),
      marketExpectations:
        "The price assumes the company holds its position through the next interconnect generation and that content per rack keeps rising.",
      earningsCatalysts: [
        "Content per rack on newer interconnect standards",
        "Customer concentration disclosure",
        "Design wins at accelerator vendors beyond the current base",
      ],
    },
    technology: {
      howItWorks:
        "Products retime, switch, and extend high-speed signals so that data moves reliably between accelerators, processors, and memory at rates where ordinary board traces stop working. Software on top reports link health across a fleet.",
      coreAdvantage:
        "Signal integrity at the highest data rates is genuinely difficult analogue engineering, and the diagnostic software creates an operational dependency that outlasts any single component decision.",
      supportingEvidence: [
        {
          claim:
            "Revenue has grown rapidly in line with AI rack deployments.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-astera-labs",
        },
        {
          claim:
            "Products are designed into systems from multiple major system manufacturers.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      benchmarks:
        "Link reliability and reach at a given data rate are the meaningful measures. These are usually validated by customers during qualification rather than published.",
      intellectualProperty:
        "Analogue and mixed-signal design intellectual property, plus the diagnostic software layer.",
      thirdPartyDependency:
        "External foundry capacity, and dependence on the interconnect standards roadmap set by industry consortia and by accelerator vendors.",
      milestoneForScale:
        "Holding design-in position through the next interconnect generation transition, which is where connectivity vendors historically gain or lose entire cycles.",
      failurePoints: [
        "Missing a generation transition on the standards roadmap",
        "An accelerator vendor integrating this function directly into its platform",
        "Customer concentration turning into a single lost socket that removes a large share of revenue",
      ],
    },
    market: {
      painPoint:
        "As accelerator counts per rack rise, moving data between them reliably becomes harder than computing on it. Signal integrity is now a first-order deployment constraint.",
      structure:
        "Sells into a small number of very large buyers, with system manufacturers as an additional channel.",
      adoptionDrivers: [
        "Rack density increasing with each accelerator generation",
        "New interconnect standards raising the component count per system",
        "Operators wanting fleet-level diagnostics for links that fail intermittently",
      ],
      whyNow:
        "Rack-scale architectures have replaced individual servers as the unit of deployment, which turned interconnect from a board-level detail into a system-level product category.",
      competitors: [
        "Broadcom",
        "Marvell Technology",
        "Credo Technology",
        "Accelerator vendors integrating connectivity into their platforms",
      ],
      substitutes: [
        "Native connectivity built into accelerator or processor silicon",
        "Optical interconnect at longer reaches",
      ],
      regulatoryEnvironment:
        "Limited direct exposure beyond the general export control regime applying to data centre components.",
      maturity: "Emerging",
    },
    commercial: {
      pricingModel:
        "Per-component pricing, with content per rack the metric that actually matters.",
      salesMotion:
        "Direct design-in engagement with cloud providers and system manufacturers, on multi-year qualification cycles.",
      customerType:
        "Hyperscale cloud providers and system manufacturers.",
      adoptionEvidence: [
        {
          claim:
            "Rapid revenue growth tied to AI rack deployment volumes.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-astera-labs",
        },
        {
          claim:
            "Diagnostic software is deployed alongside the silicon at fleet scale.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      implementationBurden:
        "Qualification into a system design is demanding, which makes each win sticky for the life of that platform.",
      expansionOpportunity:
        "Higher content per rack on each successive interconnect generation, and expansion into adjacent connectivity functions.",
      goToMarketRisk:
        "A concentrated customer base means commercial performance is decided by a small number of platform decisions.",
    },
    investment: {
      thesis:
        "A focused position in the interconnect layer, which grows faster than accelerator unit volumes because content per rack rises with every generation, held by a company small enough for that growth to matter.",
      bullCase:
        "Content per rack keeps rising, the diagnostic software becomes genuinely embedded in operator workflow, and the company holds position through successive generations.",
      baseCase:
        "Strong growth tracking AI rack deployments, with gradual margin pressure as larger competitors focus on the category.",
      bearCase:
        "An accelerator vendor integrates the function, or a generation transition is missed, and a concentrated revenue base disappears quickly.",
      catalysts: [
        "Content per rack disclosure on newer interconnect standards",
        "Design wins outside the existing customer concentration",
        "Evidence the diagnostic software is retained across platform changes",
      ],
      risks: [
        "Customer concentration",
        "Integration by accelerator vendors",
        "Standards transition risk",
      ],
      invalidators: [
        "A major accelerator platform shipping with this function integrated",
        "Loss of design-in position at the largest customer",
      ],
      recommendedNextStep:
        "Track content per rack and customer concentration together, since growth in one while the other worsens is a materially different investment.",
    },
    diligence: {
      technology: [
        "What specifically prevents an accelerator vendor from integrating this function, and how long does that barrier hold?",
      ],
      product: [
        "How much of the value sits in the silicon versus the diagnostic software, and is the software retained when the silicon is replaced?",
      ],
      customers: [
        "What share of revenue comes from the largest two customers, and how has that moved?",
      ],
      competition: [
        "Where has the company won and lost sockets against larger connectivity vendors?",
      ],
      unitEconomics: [
        "How does gross margin differ between mature products and newly introduced ones?",
      ],
      capitalRequirements: [
        "What research and development investment is required per generation transition?",
      ],
      regulation: [
        "What export control exposure applies to these components?",
      ],
      team: [
        "How deep is the analogue design team, and what is retention like after the public listing?",
      ],
      financing: [
        "What revenue growth does the current multiple require, and for how many years?",
      ],
      commercialization: [
        "How long is the qualification cycle, and what is currently in the design-in pipeline?",
      ],
    },
    outreach:
      "Not applicable. Tracked as a public-market comparison anchor rather than as a sourced private opportunity.",
    factors: {
      differentiation: fa(
        4,
        "verified",
        "Signal integrity engineering at leading data rates, plus a diagnostic software layer competitors generally lack.",
        "Genuinely difficult engineering in a narrow but growing category.",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Design-in position is sticky for a platform lifetime, but the function is a candidate for integration by accelerator vendors.",
        "Moderate. Defensibility is per platform generation rather than structural.",
      ),
      marketPotential: fa(
        4,
        "verified",
        "Content per rack rises with each accelerator generation, so the market grows faster than unit volumes.",
        "Attractive growth, though the category is narrower than the accelerator market itself.",
      ),
      commercialReadiness: fa(
        4,
        "verified",
        "Shipping in volume and designed into systems from multiple manufacturers.",
        "Commercial, still scaling rather than established.",
      ),
      customerEvidence: fa(
        4,
        "verified",
        "Rapid reported revenue growth tied directly to deployment volumes.",
        "Strong, discounted for the concentration behind it.",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "Founding team with deep connectivity silicon backgrounds, having taken the company public.",
        "Demonstrated execution from founding through to a public listing.",
      ),
      capitalEfficiency: fa(
        4,
        "verified",
        "Fabless model reaching profitability relatively quickly after founding.",
        "Efficient relative to semiconductor norms.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Competing against substantially larger connectivity vendors and against integration by platform owners.",
        "A difficult field for a company of this size.",
      ),
      technicalRisk: fa(
        4,
        "verified",
        "Products ship and are qualified into production systems.",
        "Low, with residual risk concentrated at generation transitions.",
      ),
      regulatoryRisk: fa(
        4,
        "judgment",
        "Limited direct exposure beyond general data centre component controls.",
        "Among the lowest regulatory exposure in this universe.",
      ),
      financingRisk: fa(
        2,
        "judgment",
        "Net cash positive, but valued on revenue multiples that assume sustained high growth.",
        "Rated on valuation sensitivity rather than balance sheet risk.",
      ),
      overlooked: fa(
        2,
        "judgment",
        "Well covered as an AI infrastructure name, though the interconnect layer receives less scrutiny than accelerators.",
        "Some analytical space remains in the content-per-rack question.",
      ),
    },
  },

  /* ---------------------------------------------------------------- Credo */
  {
    id: "crdo",
    name: "Credo Technology",
    isDemonstration: false,
    marketType: "Public",
    hq: "San Jose, California",
    region: "North America",
    foundedYear: 2008,
    sector: "Semiconductors",
    subsector: "High-speed connectivity and active electrical cables",
    stage: "Public",
    description:
      "Supplies high-speed connectivity products, including active electrical cables that carry data between racks at lower power and lower cost than optical alternatives over short distances.",
    businessModel:
      "Semiconductor and cable products sold to cloud providers and system manufacturers, plus intellectual property licensing of serialiser and deserialiser designs.",
    primaryCustomer:
      "Hyperscale cloud providers and network equipment manufacturers.",
    technicalDifferentiation:
      "Serialiser and deserialiser design at very high data rates, applied to a product category where the alternative is more expensive optics that consume more power.",
    tractionSignal: estimate(
      "Revenue has grown rapidly with AI cluster deployment, concentrated in a small number of hyperscale customers.",
      SNAPSHOT,
      "Directionally well established. Confirm current concentration disclosure in the latest filing.",
      "crdo-ir",
    ),
    keyCatalyst:
      "Whether active electrical cables retain their cost and power advantage as data rates rise and the crossover distance to optics shortens.",
    investmentRisk:
      "Very high customer concentration, historically with a single customer representing a large share of revenue.",
    technicalRisk:
      "Electrical signalling faces a physical reach limit that shortens as data rates increase, which eventually favours optics.",
    competitiveThreat:
      "Optical interconnect vendors, and larger connectivity semiconductor companies entering the same sockets.",
    capitalIntensity: "Moderate",
    commercialReadiness: "Scaling",
    lastReviewed: "2026-07-20",
    sourceIds: ["crdo-ir", "edgar-credo-technology", "sec-edgar"],
    financials: {
      kind: "public",
      ticker: "CRDO",
      marketCap: estimate(
        "In the tens of billions of dollars",
        SNAPSHOT,
        "Band rather than point value.",
        "crdo-ir",
      ),
      revenueGrowth: estimate(
        "Very high, from a small base, with quarter-to-quarter variability driven by customer deployment schedules",
        SNAPSHOT,
        VERIFY,
        "edgar-credo-technology",
      ),
      grossMargin: estimate(
        "Healthy for a mixed silicon and cable product line, below pure silicon peers because of the cable content",
        SNAPSHOT,
        VERIFY,
        "edgar-credo-technology",
      ),
      operatingMargin: estimate(
        "Positive on a non-GAAP basis, with reported figures affected by share-based compensation",
        SNAPSHOT,
        VERIFY,
        "edgar-credo-technology",
      ),
      cashPosition: estimate(
        "Net cash positive",
        SNAPSHOT,
        VERIFY,
        "edgar-credo-technology",
      ),
      valuationMultiple: unverified(
        SNAPSHOT,
        "edgar-credo-technology",
        "Valued on revenue growth expectations. Confirm the current figure and basis.",
      ),
      marketExpectations:
        "The price assumes continued rapid growth and, implicitly, that customer concentration diversifies before it becomes a problem.",
      earningsCatalysts: [
        "Customer concentration disclosure and evidence of diversification",
        "Design wins at additional hyperscale customers",
        "Commentary on the electrical to optical crossover distance at higher data rates",
      ],
    },
    technology: {
      howItWorks:
        "Active electrical cables place signal conditioning silicon inside the cable assembly, which extends the usable reach of copper at high data rates. The alternative at those reaches is an optical transceiver, which costs more and consumes more power.",
      coreAdvantage:
        "A cost and power advantage over optics within a specific distance envelope, delivered through serialiser and deserialiser design quality.",
      supportingEvidence: [
        {
          claim:
            "Revenue has grown rapidly alongside AI cluster deployment.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-credo-technology",
        },
        {
          claim:
            "Customer concentration has been disclosed as a material risk factor.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-credo-technology",
        },
      ],
      benchmarks:
        "Bit error rate at a given reach and data rate is the operative measure, generally validated during customer qualification rather than published.",
      intellectualProperty:
        "Serialiser and deserialiser designs, licensed as well as embedded in products.",
      thirdPartyDependency:
        "External foundry capacity and cable assembly manufacturing.",
      milestoneForScale:
        "Diversifying revenue across several hyperscale customers, which is the difference between a durable business and a supplier relationship.",
      failurePoints: [
        "The crossover distance to optics shortening faster than expected at higher data rates",
        "The largest customer changing architecture or supplier",
        "Larger connectivity vendors targeting the same sockets with broader portfolios",
      ],
    },
    market: {
      painPoint:
        "Connecting thousands of accelerators requires enormous cabling. At scale, the power and cost of each link becomes a material part of the total system budget.",
      structure:
        "A small number of hyperscale buyers making architecture decisions that determine the entire addressable volume.",
      adoptionDrivers: [
        "Cluster sizes growing, which multiplies the number of links per deployment",
        "Power budgets making optics expensive at scale within short reaches",
        "Higher data rate transitions creating new qualification opportunities",
      ],
      whyNow:
        "Cluster networking has become a large enough line item that buyers optimise it separately, which creates room for a specialist supplier.",
      competitors: [
        "Broadcom",
        "Marvell Technology",
        "Optical transceiver vendors",
      ],
      substitutes: [
        "Optical interconnect at all reaches",
        "Passive copper at shorter reaches",
      ],
      regulatoryEnvironment:
        "Limited direct exposure beyond the general export control regime for data centre components.",
      maturity: "Emerging",
    },
    commercial: {
      pricingModel:
        "Per-unit pricing on cables and components, plus licensing revenue on connectivity intellectual property.",
      salesMotion:
        "Direct qualification-led engagement with hyperscale customers.",
      customerType:
        "Hyperscale cloud providers and network equipment manufacturers.",
      adoptionEvidence: [
        {
          claim:
            "Rapid revenue growth reported alongside AI cluster buildouts.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-credo-technology",
        },
        {
          claim:
            "Products are qualified into production deployments at hyperscale customers.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      implementationBurden:
        "Qualification is demanding and slow, which protects an incumbent supplier once qualified.",
      expansionOpportunity:
        "Additional hyperscale customers, higher data rate product generations, and expanded intellectual property licensing.",
      goToMarketRisk:
        "With this level of concentration, the commercial risk and the customer relationship are effectively the same thing.",
    },
    investment: {
      thesis:
        "A specialist supplier of a genuinely cost-advantaged interconnect product inside a fast-growing category, carrying customer concentration risk that the growth rate currently obscures.",
      bullCase:
        "Revenue diversifies across several hyperscale customers while cluster growth continues, turning a supplier relationship into a durable franchise.",
      baseCase:
        "Strong growth continues with concentration slowly improving, and margins hold as volume rises.",
      bearCase:
        "The largest customer shifts architecture, and a concentrated revenue base falls faster than the cost structure can adjust.",
      catalysts: [
        "Evidence of revenue diversification across customers",
        "Qualification wins at higher data rates",
        "Commentary on the electrical to optical crossover",
      ],
      risks: [
        "Extreme customer concentration",
        "Physical reach limits favouring optics over time",
        "Larger competitors with broader portfolios",
      ],
      invalidators: [
        "The largest customer moving to optics or to a competing supplier for its next platform",
        "Concentration failing to improve across two or more years of growth",
      ],
      recommendedNextStep:
        "Track the disclosed customer concentration percentage each quarter. It is the single number that decides this investment.",
    },
    diligence: {
      technology: [
        "At the next two data rate generations, what is the maximum reach for active electrical cables, and what share of links in a modern cluster fall inside it?",
      ],
      product: [
        "What is the revenue split between cables, components, and intellectual property licensing?",
      ],
      customers: [
        "What percentage of revenue came from the largest customer in each of the last eight quarters?",
      ],
      competition: [
        "Where has the company lost sockets, and to whom?",
      ],
      unitEconomics: [
        "How does gross margin differ between the cable business and the silicon business?",
      ],
      capitalRequirements: [
        "What manufacturing commitments exist for cable assembly?",
      ],
      regulation: [
        "What export control exposure applies to these products?",
      ],
      team: [
        "How deep is the serialiser and deserialiser design team relative to competitors?",
      ],
      financing: [
        "What does the current valuation assume about customer diversification?",
      ],
      commercialization: [
        "How many hyperscale customers are currently in qualification, and at what stage?",
      ],
    },
    outreach:
      "Not applicable. Tracked as a public-market comparison anchor rather than as a sourced private opportunity.",
    factors: {
      differentiation: fa(
        3,
        "verified",
        "Strong serialiser and deserialiser design applied to a cost-advantaged product category.",
        "Real engineering advantage, in a narrower category than the connectivity peers.",
      ),
      defensibility: fa(
        2,
        "judgment",
        "Qualification creates stickiness per platform, but the underlying physics advantage erodes as data rates rise.",
        "The moat has a known expiry mechanism, which is unusual and important.",
      ),
      marketPotential: fa(
        4,
        "verified",
        "Link counts scale superlinearly with cluster size.",
        "Strong growth within a defined envelope.",
      ),
      commercialReadiness: fa(
        4,
        "verified",
        "Qualified and shipping in production deployments.",
        "Commercial and scaling.",
      ),
      customerEvidence: fa(
        3,
        "verified",
        "Rapid revenue growth, heavily concentrated in a small number of customers.",
        "Discounted sharply for concentration despite the strong headline growth.",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "Experienced connectivity silicon team that took the company through a public listing.",
        "Solid domain execution record.",
      ),
      capitalEfficiency: fa(
        4,
        "verified",
        "Reached profitability without extraordinary capital consumption.",
        "Efficient for a semiconductor company.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Larger connectivity vendors and the optical ecosystem both target this space.",
        "Crowded, with better-capitalised competitors on both flanks.",
      ),
      technicalRisk: fa(
        3,
        "judgment",
        "Products work today, but the physical reach advantage narrows with each data rate generation.",
        "Moderate, with a structural rather than execution-driven source.",
      ),
      regulatoryRisk: fa(
        4,
        "judgment",
        "Limited exposure beyond general component controls.",
        "Low.",
      ),
      financingRisk: fa(
        2,
        "judgment",
        "Net cash positive, valued on sustained high growth from a concentrated base.",
        "Valuation risk compounded by concentration risk.",
      ),
      overlooked: fa(
        2,
        "judgment",
        "Covered as an AI infrastructure name, though the reach-limit question is under-discussed.",
        "Some genuine analytical space in the physics question.",
      ),
    },
  },

  /* ---------------------------------------------------------------- Vertiv */
  {
    id: "vrt",
    name: "Vertiv",
    isDemonstration: false,
    marketType: "Public",
    hq: "Westerville, Ohio",
    region: "North America",
    foundedYear: 2016,
    sector: "Energy & Advanced Materials",
    subsector: "Data centre power and thermal management",
    stage: "Public",
    description:
      "Supplies the power distribution and cooling equipment that AI data centres depend on, a category that moved from background infrastructure to a binding constraint as rack power densities rose.",
    businessModel:
      "Equipment sales on long lead times, backed by a substantial installed base that generates recurring service revenue at higher margin than the original equipment.",
    primaryCustomer:
      "Hyperscale cloud providers, colocation operators, and enterprise data centre owners.",
    technicalDifferentiation:
      "Thermal and power engineering at the densities modern accelerator racks require, combined with a global service organisation that competitors cannot assemble quickly.",
    tractionSignal: estimate(
      "Orders and backlog have grown substantially alongside AI data centre construction, with liquid cooling moving from a niche product to a mainstream requirement.",
      SNAPSHOT,
      "Directionally well established. Confirm current backlog and book-to-bill disclosure in the latest filing.",
      "vrt-ir",
    ),
    keyCatalyst:
      "Whether liquid cooling attach rates rise fast enough to offset the lower margin structure of large hyperscale orders.",
    investmentRisk:
      "Revenue is tied to a construction cycle, and construction cycles pause. Backlog provides visibility, not immunity.",
    technicalRisk:
      "Liquid cooling architectures are still converging, and standardising on the wrong approach would be expensive.",
    competitiveThreat:
      "Large industrial competitors in power and thermal equipment, plus hyperscalers designing cooling systems in-house.",
    capitalIntensity: "High",
    commercialReadiness: "Established",
    lastReviewed: "2026-07-23",
    sourceIds: ["vrt-ir", "edgar-vertiv", "sec-edgar"],
    financials: {
      kind: "public",
      ticker: "VRT",
      marketCap: estimate(
        "In the tens of billions of dollars",
        SNAPSHOT,
        "Band rather than point value.",
        "vrt-ir",
      ),
      revenueGrowth: estimate(
        "Strong, supported by a large reported backlog",
        SNAPSHOT,
        VERIFY,
        "edgar-vertiv",
      ),
      grossMargin: estimate(
        "Mid thirties percent, characteristic of industrial equipment rather than semiconductors",
        SNAPSHOT,
        VERIFY,
        "edgar-vertiv",
      ),
      operatingMargin: estimate(
        "Improving over recent years through pricing and mix, though well below semiconductor peers",
        SNAPSHOT,
        VERIFY,
        "edgar-vertiv",
      ),
      cashPosition: estimate(
        "Carries leverage from its origin as a carve-out transaction, with improving cash generation",
        SNAPSHOT,
        VERIFY,
        "edgar-vertiv",
      ),
      valuationMultiple: unverified(
        SNAPSHOT,
        "edgar-vertiv",
        "Has traded at a premium to industrial peers on AI exposure. Confirm the current figure.",
      ),
      marketExpectations:
        "The price treats this as an AI infrastructure company rather than an industrial equipment company, which is a meaningful multiple difference and the core of the debate.",
      earningsCatalysts: [
        "Book-to-bill ratio and backlog disclosure",
        "Liquid cooling attach rate commentary",
        "Operating margin progression against stated targets",
      ],
    },
    technology: {
      howItWorks:
        "Power equipment conditions and distributes electricity from the grid to the rack. Thermal equipment removes the heat that power creates, increasingly using liquid delivered directly to the chip rather than air moved through the room.",
      coreAdvantage:
        "Engineering and manufacturing at the densities AI racks require, plus a global service footprint. The service organisation is the part competitors find hardest to reproduce.",
      supportingEvidence: [
        {
          claim:
            "Backlog and orders have grown substantially alongside AI data centre construction.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "vrt-ir",
        },
        {
          claim:
            "Liquid cooling has moved from a specialist product to a mainstream requirement at high rack densities.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      benchmarks:
        "Power usage effectiveness and heat removal capacity per rack are the operative measures, generally specified per deployment rather than published as product benchmarks.",
      intellectualProperty:
        "Thermal and power engineering designs, with the practical advantage sitting in manufacturing scale and service reach rather than in patents.",
      thirdPartyDependency:
        "Industrial supply chains for power electronics components, transformers, and switchgear, several of which have had extended lead times.",
      milestoneForScale:
        "Already at scale. The forward milestone is converting a construction-driven order book into a durable service annuity as the installed base grows.",
      failurePoints: [
        "A pause in data centre construction, which would expose the fixed cost base",
        "Standardising on a liquid cooling architecture that the industry does not adopt",
        "Hyperscalers designing and sourcing cooling systems directly",
      ],
    },
    market: {
      painPoint:
        "Rack power density has risen faster than the surrounding infrastructure was designed to handle. Power and cooling now gate deployment schedules more often than chip supply does.",
      structure:
        "A small number of large buyers building very large facilities, served by a small number of vendors with global service capability.",
      adoptionDrivers: [
        "Rack densities exceeding what air cooling can remove",
        "Grid interconnection delays making on-site power management more valuable",
        "Data centre construction running at historically high levels",
      ],
      whyNow:
        "The constraint on AI deployment has moved from accelerator supply toward power availability and heat removal, which puts this category on the critical path.",
      competitors: [
        "Schneider Electric",
        "Eaton",
        "ABB",
        "Specialist liquid cooling suppliers",
      ],
      substitutes: [
        "In-house cooling designs at the largest operators",
        "Air cooling at lower rack densities",
      ],
      regulatoryEnvironment:
        "Local permitting, grid interconnection rules, and energy efficiency standards all affect the pace of the underlying construction.",
      maturity: "Developing",
    },
    commercial: {
      pricingModel:
        "Project-based equipment pricing with multi-year service contracts on the installed base.",
      salesMotion:
        "Direct engagement with operators and engineering firms, on long procurement cycles tied to construction schedules.",
      customerType:
        "Hyperscale operators, colocation providers, and enterprises.",
      adoptionEvidence: [
        {
          claim:
            "Reported backlog growth reflects committed customer orders rather than pipeline.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "vrt-ir",
        },
        {
          claim:
            "The installed base generates recurring service revenue at higher margin than equipment.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      implementationBurden:
        "Equipment is installed during construction, so the sales cycle is bound to the building programme and cannot be accelerated independently.",
      expansionOpportunity:
        "Liquid cooling attach rates, service revenue growth on an expanding installed base, and prefabricated modular deployments that shorten build times.",
      goToMarketRisk:
        "Large hyperscale orders carry lower margins than the enterprise business, so growth and margin can move in opposite directions.",
    },
    investment: {
      thesis:
        "The physical constraint layer of AI infrastructure, with a large backlog and a service annuity underneath, priced as an AI company rather than as the industrial equipment business it structurally is.",
      bullCase:
        "Liquid cooling attach rates rise, service revenue compounds on a much larger installed base, and margins converge toward semiconductor-like levels.",
      baseCase:
        "Backlog converts steadily, margins improve gradually, and the business grows with data centre construction.",
      bearCase:
        "Construction pauses for a digestion year, hyperscalers insource cooling design, and the multiple compresses back toward industrial peers.",
      catalysts: [
        "Book-to-bill and backlog disclosure",
        "Liquid cooling attach rate",
        "Service revenue as a share of the total",
      ],
      risks: [
        "Construction cycle exposure",
        "Margin dilution from hyperscale order mix",
        "Multiple compression toward industrial comparables",
      ],
      invalidators: [
        "Book-to-bill falling below one for two consecutive quarters",
        "A major operator announcing an in-house cooling programme at scale",
      ],
      recommendedNextStep:
        "Track book-to-bill and the service revenue share together, since the service annuity is what would justify a premium multiple through a construction pause.",
    },
    diligence: {
      technology: [
        "Which liquid cooling architecture is the product line standardised on, and what happens if the industry converges on a different one?",
      ],
      product: [
        "What is the revenue split between power, thermal, and services, and how do margins differ across the three?",
      ],
      customers: [
        "What share of backlog comes from the largest three customers?",
      ],
      competition: [
        "Where has the company won and lost against the large industrial competitors in the last two years?",
      ],
      unitEconomics: [
        "What is the margin difference between hyperscale orders and enterprise orders?",
      ],
      capitalRequirements: [
        "What manufacturing capacity investment is required to convert the current backlog?",
      ],
      regulation: [
        "How do grid interconnection delays affect the timing of backlog conversion?",
      ],
      team: [
        "What is the operational record on delivering large projects to schedule?",
      ],
      financing: [
        "What is the leverage position, and how does it behave through a construction slowdown?",
      ],
      commercialization: [
        "How long is the typical time from order to revenue recognition, and has it changed?",
      ],
    },
    outreach:
      "Not applicable. Tracked as a public-market comparison anchor rather than as a sourced private opportunity.",
    factors: {
      differentiation: fa(
        3,
        "verified",
        "Strong thermal and power engineering with a global service footprint, in a category where several large competitors are credible.",
        "Real capability, but less singular than the semiconductor positions in this universe.",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Installed base and service relationships create genuine stickiness; the equipment itself is more contestable.",
        "Moderate, resting more on service reach than on product uniqueness.",
      ),
      marketPotential: fa(
        5,
        "verified",
        "Power and cooling are now on the critical path for AI deployment.",
        "The constraint has moved into this category, which is the whole investment case.",
      ),
      commercialReadiness: fa(
        5,
        "verified",
        "Large installed base and a substantial reported backlog.",
        "Fully commercial.",
      ),
      customerEvidence: fa(
        5,
        "verified",
        "Reported backlog represents committed orders rather than pipeline.",
        "Backlog is among the highest quality customer evidence available.",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "Improved operating performance substantially since the carve-out and public listing.",
        "Demonstrated margin execution over several years.",
      ),
      capitalEfficiency: fa(
        3,
        "verified",
        "Manufacturing footprint and working capital requirements typical of industrial equipment.",
        "Reasonable for the category, well below the fabless semiconductor names here.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Competes against several very large industrial companies with comparable global reach.",
        "A genuinely crowded field of well-capitalised competitors.",
      ),
      technicalRisk: fa(
        4,
        "verified",
        "Proven equipment shipping at scale, with residual uncertainty on liquid cooling architecture convergence.",
        "Low.",
      ),
      regulatoryRisk: fa(
        3,
        "judgment",
        "Exposed to permitting and grid interconnection timing rather than to product regulation.",
        "Indirect but material to the timing of revenue.",
      ),
      financingRisk: fa(
        3,
        "judgment",
        "Leverage from the carve-out origin, improving with cash generation.",
        "Manageable, with sensitivity to a construction slowdown.",
      ),
      overlooked: fa(
        2,
        "judgment",
        "Well covered now, though the service annuity receives less attention than the AI order growth.",
        "Some analytical space remains in the durability question.",
      ),
    },
  },

  /* ------------------------------------------------------------------ IonQ */
  {
    id: "ionq",
    name: "IonQ",
    isDemonstration: false,
    marketType: "Public",
    hq: "College Park, Maryland",
    region: "North America",
    foundedYear: 2015,
    sector: "Quantum Technology",
    subsector: "Trapped-ion quantum computing",
    stage: "Public",
    description:
      "Builds trapped-ion quantum computers and sells access to them through cloud platforms and direct system sales, in a category where commercial value remains largely ahead of the technology.",
    businessModel:
      "Cloud access revenue, direct system sales to research institutions and governments, and contract research, none of which yet resembles a repeatable commercial product.",
    primaryCustomer:
      "Government laboratories, research institutions, national quantum programmes, and corporate research groups.",
    technicalDifferentiation:
      "Trapped-ion qubits offer high fidelity and all-to-all connectivity, and operate without the dilution refrigeration that superconducting approaches require.",
    tractionSignal: reported(
      "Revenue exists and is growing, but is dominated by research contracts and government programmes rather than by production commercial workloads.",
      SNAPSHOT,
      "ionq-ir",
      "Stated plainly because the distinction between research revenue and commercial revenue is the central question in this category.",
    ),
    keyCatalyst:
      "A demonstrated quantum advantage on a commercially meaningful problem, which no company in this category has yet shown.",
    investmentRisk:
      "The technology may not reach commercial usefulness within any investable horizon, and the current valuation does not reflect that possibility.",
    technicalRisk:
      "Error correction overhead remains enormous, and gate speeds for trapped ions are slower than competing modalities.",
    competitiveThreat:
      "Superconducting, neutral atom, and photonic approaches, several backed by companies with far larger research budgets.",
    capitalIntensity: "Very High",
    commercialReadiness: "Research",
    lastReviewed: "2026-07-18",
    sourceIds: ["ionq-ir", "edgar-ionq", "sec-edgar"],
    financials: {
      kind: "public",
      ticker: "IONQ",
      marketCap: estimate(
        "In the billions of dollars, at a very large multiple of revenue",
        SNAPSHOT,
        "The gap between market capitalisation and revenue is the defining financial characteristic here.",
        "ionq-ir",
      ),
      revenueGrowth: estimate(
        "Growing from a very small base, dominated by research and government contracts",
        SNAPSHOT,
        VERIFY,
        "edgar-ionq",
      ),
      grossMargin: estimate(
        "Variable and not meaningful at this revenue scale",
        SNAPSHOT,
        "Margin analysis on pre-commercial revenue tells you very little.",
        "edgar-ionq",
      ),
      operatingMargin: estimate(
        "Substantially negative, as expected for a research-stage company",
        SNAPSHOT,
        VERIFY,
        "edgar-ionq",
      ),
      cashPosition: estimate(
        "Funded by equity raises rather than by operations",
        SNAPSHOT,
        VERIFY,
        "edgar-ionq",
      ),
      valuationMultiple: unverified(
        SNAPSHOT,
        "edgar-ionq",
        "Revenue multiples in this category are extreme and not comparable to operating businesses.",
      ),
      marketExpectations:
        "The price is an option on quantum computing becoming commercially useful, not a claim about current earnings power. It should be analysed as such.",
      earningsCatalysts: [
        "Technical roadmap milestones on qubit count and fidelity",
        "Government and national quantum programme awards",
        "Any credible demonstration of advantage on a commercial problem",
      ],
    },
    technology: {
      howItWorks:
        "Individual ions are held in electromagnetic traps and manipulated with lasers. Each ion serves as a qubit, and because any ion can interact with any other, the connectivity is complete rather than nearest-neighbour.",
      coreAdvantage:
        "High gate fidelity and all-to-all connectivity, which reduces the number of operations needed to run a given algorithm compared with architectures that must shuttle information between neighbours.",
      supportingEvidence: [
        {
          claim:
            "Systems are accessible through major cloud platforms and are used by external researchers.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "ionq-ir",
        },
        {
          claim:
            "Revenue remains dominated by research and government contracts rather than production commercial use.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      benchmarks:
        "Companies in this category publish differing metrics, several of them defined in-house. Cross-company comparison is genuinely difficult and any single headline number should be treated sceptically.",
      intellectualProperty:
        "Ion trap designs, laser control systems, and photonic interconnect approaches, with a substantial patent portfolio and university-derived foundations.",
      thirdPartyDependency:
        "Specialised lasers, optics, vacuum systems, and control electronics from a small number of suppliers.",
      milestoneForScale:
        "Error-corrected logical qubits in sufficient number to run a commercially relevant algorithm faster or cheaper than classical hardware. This remains the unmet condition for the entire category.",
      failurePoints: [
        "Error correction overhead proving impractical at the required scale",
        "Gate speed limitations making trapped ions uncompetitive even if fidelity leads",
        "A competing modality reaching useful scale first",
      ],
    },
    market: {
      painPoint:
        "Certain problems in simulation, optimisation, and cryptography are intractable for classical computers. Whether quantum hardware will solve them at commercially relevant scale remains unproven.",
      structure:
        "Buyers are overwhelmingly governments and research institutions. A commercial market in the ordinary sense does not yet exist.",
      adoptionDrivers: [
        "National quantum programmes funding capability development for strategic reasons",
        "Corporate research groups maintaining an option on the technology",
        "Cloud access lowering the cost of experimentation",
      ],
      whyNow:
        "Government funding has increased substantially, which sustains the category through a period when commercial demand alone could not.",
      competitors: [
        "Superconducting qubit programmes at large technology companies",
        "Neutral atom quantum computing companies",
        "Photonic quantum computing companies",
      ],
      substitutes: [
        "Classical high performance computing, which continues to improve",
        "Quantum-inspired classical algorithms that capture part of the benefit",
      ],
      regulatoryEnvironment:
        "Export controls apply to quantum technology, and government procurement rules shape most of the current demand.",
      maturity: "Emerging",
    },
    commercial: {
      pricingModel:
        "Cloud access priced per unit of machine time, direct system sales, and contract research.",
      salesMotion:
        "Government and institutional procurement, on long cycles with political as well as technical drivers.",
      customerType:
        "National laboratories, universities, government agencies, and corporate research groups.",
      adoptionEvidence: [
        {
          claim:
            "Systems are available through major cloud platforms.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "ionq-ir",
        },
        {
          claim:
            "No production commercial workload has been demonstrated to run better here than on classical hardware.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      implementationBurden:
        "Very high. Using the systems productively requires specialist expertise that few organisations possess.",
      expansionOpportunity:
        "Entirely dependent on reaching technical thresholds that have not yet been met.",
      goToMarketRisk:
        "Demand is driven by government funding cycles, which respond to political conditions rather than to product quality.",
    },
    investment: {
      thesis:
        "A long-dated option on quantum computing becoming commercially useful, held through a technically credible team, and priced as though the option is closer to exercise than the evidence supports.",
      bullCase:
        "Error correction progresses faster than expected, a genuine advantage is demonstrated on a commercial problem, and the category attracts commercial rather than merely governmental demand.",
      baseCase:
        "Steady technical progress funded by government programmes, with commercial usefulness remaining several years away and further equity raises required.",
      bearCase:
        "Error correction overhead proves impractical for this modality, or a competing approach reaches useful scale first, and the option expires worthless.",
      catalysts: [
        "Logical qubit milestones",
        "National quantum programme awards",
        "Any peer-reviewed demonstration of commercial advantage",
      ],
      risks: [
        "The technology may never become commercially useful",
        "Continued dilution from equity funding",
        "Competing modalities with larger research budgets",
      ],
      invalidators: [
        "A competing modality demonstrating commercial advantage first",
        "Technical roadmap milestones missed across two consecutive years",
      ],
      recommendedNextStep:
        "Size any position as a research option rather than as an investment in an operating business, and monitor logical qubit progress rather than revenue.",
    },
    diligence: {
      technology: [
        "What is the current logical qubit count after error correction, and how does it compare with the roadmap published two years ago?",
      ],
      product: [
        "What proportion of machine time is used for genuine problem solving rather than for benchmarking and experimentation?",
      ],
      customers: [
        "What share of revenue is government funded, and what happens to that funding under a change in policy priorities?",
      ],
      competition: [
        "On the metrics that matter for error correction, where does this modality rank against superconducting and neutral atom approaches?",
      ],
      unitEconomics: [
        "What does it cost to operate a system for a year, and what would machine time need to be priced at to cover it?",
      ],
      capitalRequirements: [
        "How much capital is required to reach the next roadmap milestone, and how many further raises does that imply?",
      ],
      regulation: [
        "How do export controls on quantum technology affect the addressable customer base?",
      ],
      team: [
        "How stable is the scientific leadership, and what is the publication record relative to competing groups?",
      ],
      financing: [
        "What is the current cash runway, and what dilution is implied by funding the roadmap to its next milestone?",
      ],
      commercialization: [
        "What specific problem is expected to show commercial advantage first, and who has committed to running it?",
      ],
    },
    outreach:
      "Not applicable. Tracked as a public-market comparison anchor for the private quantum company in this universe.",
    factors: {
      differentiation: fa(
        4,
        "verified",
        "Trapped-ion architecture with high gate fidelity and all-to-all connectivity, a genuinely distinct technical approach.",
        "Scientifically differentiated, though differentiation without commercial usefulness has limited investment value.",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Patent portfolio and accumulated engineering, in a field where several well-funded groups are pursuing different modalities.",
        "Moderate. In pre-commercial deep technology, defensibility is largely theoretical.",
      ),
      marketPotential: fa(
        3,
        "judgment",
        "The addressable market is enormous if the technology works and close to zero if it does not.",
        "Rated in the middle because the distribution of outcomes is genuinely bimodal.",
      ),
      commercialReadiness: fa(
        1,
        "verified",
        "Revenue is dominated by research and government contracts. No production commercial workload has been demonstrated.",
        "This is a research-stage company that happens to be publicly listed.",
      ),
      customerEvidence: fa(
        2,
        "verified",
        "Real customers and real revenue, almost entirely research and government funded.",
        "Evidence of interest rather than of commercial demand.",
      ),
      teamCredibility: fa(
        5,
        "verified",
        "Founding science team with a leading academic record in trapped-ion quantum computing.",
        "Scientific credibility is genuinely high and is the strongest factor here.",
      ),
      capitalEfficiency: fa(
        1,
        "verified",
        "Substantially negative operating margin funded by equity issuance.",
        "Structurally low, as expected at this stage, but low nonetheless.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Competing against research programmes at some of the largest technology companies in the world.",
        "Outspent by several competitors by a wide margin.",
      ),
      technicalRisk: fa(
        1,
        "verified",
        "Error correction overhead remains the unsolved problem for the entire category.",
        "The highest technical risk in this universe, stated plainly rather than softened.",
      ),
      regulatoryRisk: fa(
        3,
        "verified",
        "Export controls apply, and government procurement drives most demand.",
        "Moderate, with policy exposure cutting both ways.",
      ),
      financingRisk: fa(
        1,
        "judgment",
        "Requires continued equity funding at a valuation that already embeds substantial future success.",
        "High dilution risk combined with high valuation risk.",
      ),
      overlooked: fa(
        1,
        "verified",
        "Heavily covered and widely discussed relative to its commercial substance.",
        "If anything, over-examined rather than overlooked.",
      ),
    },
  },

  /* ---------------------------------------------------------- Schrodinger */
  {
    id: "sdgr",
    name: "Schrodinger",
    isDemonstration: false,
    marketType: "Public",
    hq: "New York, New York",
    region: "North America",
    foundedYear: 1990,
    sector: "Biotechnology & Research Tools",
    subsector: "Computational chemistry and drug discovery software",
    stage: "Public",
    description:
      "Sells physics-based molecular simulation software to pharmaceutical and materials companies, and applies the same platform to its own drug discovery pipeline and to collaborations.",
    businessModel:
      "Recurring software licensing to pharmaceutical and materials customers, combined with drug discovery collaborations and a proprietary pipeline that convert software capability into milestone and royalty economics.",
    primaryCustomer:
      "Pharmaceutical and biotechnology companies, plus materials science and electronics research groups.",
    technicalDifferentiation:
      "Physics-based simulation refined over three decades, which predicts binding behaviour from first principles rather than from pattern matching over known compounds.",
    tractionSignal: reported(
      "Software revenue is recurring and grows steadily, while the drug discovery side produces variable milestone-driven revenue.",
      SNAPSHOT,
      "sdgr-ir",
      "The two segments have genuinely different economics and should be valued separately.",
    ),
    keyCatalyst:
      "Clinical progress in the proprietary and partnered pipeline, which is where the asymmetric value in this business sits.",
    investmentRisk:
      "The business combines a steady software company with a binary drug discovery company, and the combination is harder to value than either alone.",
    technicalRisk:
      "Machine learning approaches to molecular property prediction are improving quickly and may reduce the advantage of physics-based simulation.",
    competitiveThreat:
      "Open-source computational chemistry tools, machine learning first competitors, and in-house computational groups at large pharmaceutical companies.",
    capitalIntensity: "Moderate",
    commercialReadiness: "Established",
    lastReviewed: "2026-07-17",
    sourceIds: ["sdgr-ir", "edgar-schrodinger", "sec-edgar"],
    financials: {
      kind: "public",
      ticker: "SDGR",
      marketCap: estimate(
        "In the billions of dollars",
        SNAPSHOT,
        "Band rather than point value.",
        "sdgr-ir",
      ),
      revenueGrowth: estimate(
        "Steady in software, highly variable in drug discovery because milestone payments are lumpy",
        SNAPSHOT,
        VERIFY,
        "edgar-schrodinger",
      ),
      grossMargin: estimate(
        "High on the software segment, characteristic of licensed scientific software",
        SNAPSHOT,
        VERIFY,
        "edgar-schrodinger",
      ),
      operatingMargin: estimate(
        "Negative overall, because drug discovery investment exceeds software profitability",
        SNAPSHOT,
        VERIFY,
        "edgar-schrodinger",
      ),
      cashPosition: estimate(
        "Holds a substantial cash position, supported at times by equity stakes in partnered companies",
        SNAPSHOT,
        VERIFY,
        "edgar-schrodinger",
      ),
      valuationMultiple: unverified(
        SNAPSHOT,
        "edgar-schrodinger",
        "A sum-of-the-parts approach separating software from pipeline is more informative than any single multiple.",
      ),
      marketExpectations:
        "The price generally reflects software value plus some pipeline option value. Which component is driving the price at any moment is worth establishing before taking a position.",
      earningsCatalysts: [
        "Software revenue growth and customer renewal rates",
        "Clinical data from the proprietary pipeline",
        "New collaboration agreements and milestone achievements",
      ],
    },
    technology: {
      howItWorks:
        "The platform simulates how molecules physically interact, computing binding free energy from the underlying physics. This allows large numbers of candidate compounds to be evaluated computationally before any are synthesised.",
      coreAdvantage:
        "Accuracy at predicting binding affinity for compounds unlike anything in the training data, which is exactly where purely statistical methods are weakest.",
      supportingEvidence: [
        {
          claim:
            "Software is licensed by a large number of pharmaceutical and biotechnology organisations on a recurring basis.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "sdgr-ir",
        },
        {
          claim:
            "The platform underpins both partnered programmes and a proprietary pipeline.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-schrodinger",
        },
      ],
      benchmarks:
        "Retrospective accuracy on known compound sets is published in the scientific literature. Prospective accuracy on novel chemistry is the measure that matters commercially and is much harder to establish.",
      intellectualProperty:
        "Simulation methods, force fields developed over decades, and composition of matter patents on pipeline compounds.",
      thirdPartyDependency:
        "Computing capacity for large simulation workloads, and laboratory partners for synthesis and testing.",
      milestoneForScale:
        "A proprietary or partnered compound reaching late-stage clinical success, which would validate the platform commercially in a way software revenue alone cannot.",
      failurePoints: [
        "Machine learning methods matching physics-based accuracy at far lower computational cost",
        "Pipeline clinical failures, which are the base rate rather than the exception in drug development",
        "Large pharmaceutical customers building equivalent capability internally",
      ],
    },
    market: {
      painPoint:
        "Synthesising and testing compounds is slow and expensive. Predicting which compounds are worth making removes cost from the earliest and least efficient part of drug discovery.",
      structure:
        "A concentrated set of large pharmaceutical buyers, a long tail of biotechnology companies, and an adjacent materials science market.",
      adoptionDrivers: [
        "Computing cost falling, which makes larger simulation campaigns economically viable",
        "Pressure on pharmaceutical research productivity",
        "Growing acceptance of computational methods in regulated discovery workflows",
      ],
      whyNow:
        "Simulation campaigns that were computationally impossible a decade ago are now routine, which changes what the software can be used for rather than merely how fast it runs.",
      competitors: [
        "Open-source computational chemistry tools",
        "Machine learning first drug discovery companies",
        "In-house computational chemistry groups",
      ],
      substitutes: [
        "Experimental high throughput screening",
        "Purely machine learning based property prediction",
      ],
      regulatoryEnvironment:
        "The software itself is unregulated. The pipeline is subject to the full clinical approval process, which dominates the risk profile of that segment.",
      maturity: "Mature",
    },
    commercial: {
      pricingModel:
        "Annual software licences scaled by seats and compute, plus collaboration payments, milestones, and royalties on the discovery side.",
      salesMotion:
        "Direct enterprise sales into research organisations, with long relationships and high renewal rates.",
      customerType:
        "Pharmaceutical companies, biotechnology companies, and materials research groups.",
      adoptionEvidence: [
        {
          claim:
            "Recurring software revenue with an established customer base across the pharmaceutical industry.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "sdgr-ir",
        },
        {
          claim:
            "Multiple drug discovery collaborations have been entered into with established partners.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-schrodinger",
        },
      ],
      implementationBurden:
        "Requires trained computational chemists, which limits adoption to organisations that already employ them.",
      expansionOpportunity:
        "Materials science applications, and increasing the share of value captured through pipeline economics rather than licence fees.",
      goToMarketRisk:
        "The largest customers have the resources to build internal alternatives, and some have.",
    },
    investment: {
      thesis:
        "A durable scientific software franchise with high renewal rates, attached to a drug discovery pipeline that offers asymmetric upside and consumes the software profits to fund it.",
      bullCase:
        "Pipeline compounds succeed clinically, validating the platform and converting a software business into a royalty business with far higher economics.",
      baseCase:
        "Software grows steadily, the pipeline produces occasional milestones, and the combined entity remains difficult to value cleanly.",
      bearCase:
        "Machine learning approaches erode the software advantage while the pipeline fails clinically, leaving neither segment supporting the valuation.",
      catalysts: [
        "Clinical readouts from proprietary programmes",
        "New collaboration agreements",
        "Software revenue growth and renewal rates",
      ],
      risks: [
        "Clinical failure, which is the base rate in drug development",
        "Competition from machine learning approaches",
        "Cash consumption from pipeline investment",
      ],
      invalidators: [
        "Software revenue growth stalling, which would indicate the platform advantage is eroding",
        "Multiple pipeline failures at the same stage, suggesting a systematic prediction problem",
      ],
      recommendedNextStep:
        "Value the software business and the pipeline separately, then establish which one the current price is actually paying for.",
    },
    diligence: {
      technology: [
        "On prospective rather than retrospective tests, how does physics-based prediction accuracy compare with current machine learning methods?",
      ],
      product: [
        "What is the software renewal rate, and how has seat expansion trended within existing customers?",
      ],
      customers: [
        "How many of the largest pharmaceutical companies license the platform, and how has that list changed over five years?",
      ],
      competition: [
        "Which customers have built internal alternatives, and what triggered that decision?",
      ],
      unitEconomics: [
        "What is the software segment margin excluding all drug discovery investment?",
      ],
      capitalRequirements: [
        "What annual cash consumption does the pipeline require, and for how many years?",
      ],
      regulation: [
        "What is the clinical stage and regulatory pathway for each proprietary programme?",
      ],
      team: [
        "How stable is the scientific leadership, and what is the publication record?",
      ],
      financing: [
        "What is the runway, and does the pipeline require equity funding before the next major readout?",
      ],
      commercialization: [
        "What share of value is captured through licences versus milestones and royalties, and how is that shifting?",
      ],
    },
    outreach:
      "Not applicable. Tracked as a public-market comparison anchor for the private research tools company in this universe.",
    factors: {
      differentiation: fa(
        4,
        "verified",
        "Physics-based simulation refined over three decades, with genuine accuracy advantages on novel chemistry.",
        "Deep and hard to reproduce, though the advantage is narrowing in some applications.",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Accumulated force field development and embedded workflows create real switching costs.",
        "Strong, with erosion risk from a different methodological direction rather than from direct competitors.",
      ),
      marketPotential: fa(
        4,
        "verified",
        "Pharmaceutical research spending is large and durable, with materials science as an adjacent market.",
        "Substantial, though the software segment alone is not enormous.",
      ),
      commercialReadiness: fa(
        5,
        "verified",
        "Established recurring software business with a long customer history.",
        "Fully commercial on the software side.",
      ),
      customerEvidence: fa(
        5,
        "verified",
        "Recurring revenue from a broad pharmaceutical customer base with high renewal rates.",
        "Among the strongest customer evidence in this universe.",
      ),
      teamCredibility: fa(
        5,
        "verified",
        "Scientific leadership with a foundational record in computational chemistry.",
        "Exceptional domain credibility.",
      ),
      capitalEfficiency: fa(
        2,
        "verified",
        "Software profitability is consumed by pipeline investment, producing negative operating margins overall.",
        "Deliberate strategic choice, but capital efficiency is low as measured.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Open-source alternatives and machine learning entrants, alongside in-house groups at the largest customers.",
        "Moderate, with the competitive threat coming from a different methodology rather than a direct rival.",
      ),
      technicalRisk: fa(
        4,
        "verified",
        "The software works and is validated in the literature. Pipeline risk is clinical rather than technical.",
        "Low on the platform, high on the pipeline, rated here on the platform.",
      ),
      regulatoryRisk: fa(
        2,
        "verified",
        "Pipeline programmes face the full clinical approval process.",
        "High for the segment carrying most of the potential upside.",
      ),
      financingRisk: fa(
        3,
        "judgment",
        "Substantial cash position, offset by ongoing pipeline consumption.",
        "Moderate, dependent on clinical timelines.",
      ),
      overlooked: fa(
        3,
        "judgment",
        "Less closely followed than pure AI names, and the sum-of-the-parts structure means the software franchise is often overlooked.",
        "Genuine analytical space exists here, more than anywhere else in the public set.",
      ),
    },
  },

  /* ------------------------------------------------------------- Tempus AI */
  {
    id: "tem",
    name: "Tempus AI",
    isDemonstration: false,
    marketType: "Public",
    hq: "Chicago, Illinois",
    region: "North America",
    foundedYear: 2015,
    sector: "Healthcare Technology",
    subsector: "Precision medicine data and genomic sequencing",
    stage: "Public",
    description:
      "Runs clinical genomic sequencing and links the results to clinical records, building a dataset that is sold to pharmaceutical companies for research while the sequencing itself is billed to payers.",
    businessModel:
      "Reimbursed diagnostic sequencing generates volume, and the resulting linked clinical and molecular dataset is licensed to pharmaceutical customers at substantially higher margin.",
    primaryCustomer:
      "Oncologists and health systems for diagnostics, pharmaceutical companies for data licensing.",
    technicalDifferentiation:
      "The linkage between molecular data and longitudinal clinical outcomes at scale, which is difficult to assemble and becomes more valuable as it grows.",
    tractionSignal: reported(
      "Both the genomics and data segments generate revenue, with the data business carrying materially higher margins than sequencing.",
      SNAPSHOT,
      "tem-ir",
      "The interaction between the two segments is the business model and should be assessed as one system.",
    ),
    keyCatalyst:
      "Whether data licensing revenue grows fast enough to carry the company to profitability before further financing is required.",
    investmentRisk:
      "Diagnostic reimbursement rates are set by payers and can be reduced, which would compress the segment that generates the data.",
    technicalRisk:
      "Sequencing itself is increasingly commoditised, so the defensibility rests on the data linkage rather than on the laboratory.",
    competitiveThreat:
      "Established diagnostics companies with larger laboratory networks, and health systems retaining their own data.",
    capitalIntensity: "High",
    commercialReadiness: "Scaling",
    lastReviewed: "2026-07-16",
    sourceIds: ["tem-ir", "edgar-tempus-ai", "sec-edgar"],
    financials: {
      kind: "public",
      ticker: "TEM",
      marketCap: estimate(
        "In the billions of dollars",
        SNAPSHOT,
        "Band rather than point value.",
        "tem-ir",
      ),
      revenueGrowth: estimate(
        "Strong across both genomics and data segments",
        SNAPSHOT,
        VERIFY,
        "edgar-tempus-ai",
      ),
      grossMargin: estimate(
        "Moderate in genomics, substantially higher in data licensing",
        SNAPSHOT,
        VERIFY,
        "edgar-tempus-ai",
      ),
      operatingMargin: estimate(
        "Negative, with a stated path toward profitability",
        SNAPSHOT,
        VERIFY,
        "edgar-tempus-ai",
      ),
      cashPosition: estimate(
        "Funded by public listing proceeds and debt, with ongoing cash consumption",
        SNAPSHOT,
        VERIFY,
        "edgar-tempus-ai",
      ),
      valuationMultiple: unverified(
        SNAPSHOT,
        "edgar-tempus-ai",
        "Valued on revenue rather than earnings. Confirm the current basis.",
      ),
      marketExpectations:
        "The price assumes the data business scales into the margin structure of a software company while sequencing volume continues to grow.",
      earningsCatalysts: [
        "Data licensing revenue growth and pharmaceutical contract renewals",
        "Reimbursement rate decisions on key diagnostic tests",
        "Progress against the stated path to profitability",
      ],
    },
    technology: {
      howItWorks:
        "Tumour and normal tissue are sequenced in clinical laboratories. Results are returned to the treating physician, and the de-identified molecular data is linked to clinical records to build a longitudinal research dataset.",
      coreAdvantage:
        "Scale and linkage. Molecular data alone is widely available; molecular data connected to what actually happened to the patient over time is not.",
      supportingEvidence: [
        {
          claim:
            "The company operates both a clinical sequencing business and a data licensing business.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "tem-ir",
        },
        {
          claim:
            "Data licensing carries materially higher margins than sequencing.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-tempus-ai",
        },
      ],
      benchmarks:
        "Diagnostic accuracy is established through clinical validation studies. Dataset value is harder to benchmark and is best assessed through pharmaceutical customer renewal behaviour.",
      intellectualProperty:
        "Data assets, assay designs, and analytical methods. The dataset itself is the primary asset and is not protected by patent.",
      thirdPartyDependency:
        "Sequencing instruments and consumables from a small number of suppliers, and health system relationships for sample flow.",
      milestoneForScale:
        "Data licensing revenue growing large enough to carry corporate profitability independently of sequencing margins.",
      failurePoints: [
        "Reimbursement rate reductions compressing the segment that generates data volume",
        "Health systems retaining data rights and licensing directly to pharmaceutical customers",
        "Pharmaceutical research budgets contracting",
      ],
    },
    market: {
      painPoint:
        "Oncology treatment decisions increasingly depend on molecular profiling, and pharmaceutical research needs real-world evidence linking molecular characteristics to outcomes.",
      structure:
        "Two-sided. Clinical volume is reimbursed by payers at administered rates, while data is sold to a concentrated set of pharmaceutical buyers.",
      adoptionDrivers: [
        "Molecular profiling becoming standard of care in more cancer types",
        "Pharmaceutical demand for real-world evidence in trial design and regulatory submissions",
        "Falling sequencing costs expanding the addressable clinical population",
      ],
      whyNow:
        "Sequencing costs have fallen far enough that clinical volume can fund dataset construction, which was not economically possible when the sequencing itself was the expensive part.",
      competitors: [
        "Foundation Medicine",
        "Guardant Health",
        "Large reference laboratories",
      ],
      substitutes: [
        "In-house health system sequencing programmes",
        "Claims-based real-world evidence datasets",
      ],
      regulatoryEnvironment:
        "Laboratory certification requirements, diagnostic regulation, payer coverage decisions, and health data privacy rules all apply directly.",
      maturity: "Developing",
    },
    commercial: {
      pricingModel:
        "Reimbursed per-test pricing for diagnostics, and multi-year licensing agreements for data.",
      salesMotion:
        "Clinical sales into oncology practices and health systems, and enterprise sales into pharmaceutical research organisations.",
      customerType:
        "Oncologists, health systems, and pharmaceutical companies.",
      adoptionEvidence: [
        {
          claim:
            "Both segments generate revenue, with multi-year pharmaceutical data agreements in place.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "tem-ir",
        },
        {
          claim:
            "Sequencing volume growth supports continued dataset expansion.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      implementationBurden:
        "Clinical integration requires workflow changes at the health system, which lengthens the sales cycle considerably.",
      expansionOpportunity:
        "Additional disease areas beyond oncology, and deeper pharmaceutical relationships spanning trial design through post-market evidence.",
      goToMarketRisk:
        "The clinical business must keep growing for the data business to have anything to sell, which couples two very different commercial motions.",
    },
    investment: {
      thesis:
        "A dataset that compounds in value as clinical volume grows, funded by a reimbursed diagnostics business, where the investment question is whether the high-margin segment scales before the funding requirement bites.",
      bullCase:
        "Data licensing scales into software-like margins, pharmaceutical relationships deepen, and the combined business reaches profitability without further dilution.",
      baseCase:
        "Both segments grow steadily, profitability arrives later than guided, and one further financing is required.",
      bearCase:
        "Reimbursement rates fall, clinical volume growth slows, and the dataset stops compounding while cash consumption continues.",
      catalysts: [
        "Data licensing revenue growth",
        "Reimbursement coverage decisions",
        "Progress against the stated profitability path",
      ],
      risks: [
        "Reimbursement rate reductions",
        "Data rights contested by health systems",
        "Continued cash consumption",
      ],
      invalidators: [
        "Data segment growth falling below clinical segment growth for a sustained period",
        "A major reimbursement reduction on a high-volume test",
      ],
      recommendedNextStep:
        "Track data revenue as a share of total and gross margin by segment together, since the thesis depends entirely on that mix shifting.",
    },
    diligence: {
      technology: [
        "What specifically prevents a competitor with sequencing capability from assembling an equivalent linked dataset?",
      ],
      product: [
        "What is the revenue and margin split between genomics and data, and how has the mix moved over eight quarters?",
      ],
      customers: [
        "How many pharmaceutical customers are on multi-year agreements, and what are the renewal rates?",
      ],
      competition: [
        "How does dataset scale and depth compare with the closest competitors on the measures pharmaceutical buyers actually use?",
      ],
      unitEconomics: [
        "What is the contribution margin per sequenced case at current reimbursement rates?",
      ],
      capitalRequirements: [
        "What laboratory capacity investment is required to support the volume growth plan?",
      ],
      regulation: [
        "What data rights are held under health system agreements, and how durable are they under changing privacy rules?",
      ],
      team: [
        "What is the depth of commercial leadership in pharmaceutical data licensing specifically?",
      ],
      financing: [
        "What is the runway to the stated profitability point, and what happens if it slips by four quarters?",
      ],
      commercialization: [
        "How long is the sales cycle for a pharmaceutical data agreement, and what is currently in the pipeline?",
      ],
    },
    outreach:
      "Not applicable. Tracked as a public-market comparison anchor for the private healthcare company in this universe.",
    factors: {
      differentiation: fa(
        4,
        "verified",
        "Linked molecular and longitudinal clinical data at scale, which is genuinely difficult to assemble.",
        "The linkage rather than the sequencing is the differentiator, and it compounds.",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Dataset scale compounds and health system relationships take years to build.",
        "Strong, though data rights are contractual rather than proprietary, which is a real qualification.",
      ),
      marketPotential: fa(
        4,
        "verified",
        "Precision oncology and pharmaceutical real-world evidence are both large and growing markets.",
        "Substantial on both sides of the business.",
      ),
      commercialReadiness: fa(
        4,
        "verified",
        "Both segments generate meaningful revenue with established customers.",
        "Commercial and scaling, not yet profitable.",
      ),
      customerEvidence: fa(
        4,
        "verified",
        "Multi-year pharmaceutical agreements alongside growing clinical volume.",
        "Strong and reported on both sides.",
      ),
      teamCredibility: fa(
        4,
        "verified",
        "Founder with a prior record of building and scaling a technology company, supported by clinical leadership.",
        "Credible, with more commercial than clinical pedigree.",
      ),
      capitalEfficiency: fa(
        2,
        "verified",
        "Laboratory infrastructure and ongoing losses require substantial capital.",
        "Low, characteristic of building physical diagnostic capacity.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Established diagnostics competitors with larger laboratory networks.",
        "Moderate, differentiated more by dataset than by laboratory capability.",
      ),
      technicalRisk: fa(
        4,
        "verified",
        "Sequencing is a proven technology. The risk is commercial and regulatory rather than technical.",
        "Low technical risk.",
      ),
      regulatoryRisk: fa(
        2,
        "verified",
        "Reimbursement decisions, diagnostic regulation, and health data privacy rules all apply directly.",
        "High, and largely outside the company's control.",
      ),
      financingRisk: fa(
        2,
        "judgment",
        "Continued cash consumption with profitability still ahead.",
        "Meaningful, dependent on hitting the stated path.",
      ),
      overlooked: fa(
        2,
        "judgment",
        "Reasonably well covered, though the segment margin interaction is often discussed loosely.",
        "Some analytical space in the mix question.",
      ),
    },
  },

  /* ---------------------------------------------------------- Bloom Energy */
  {
    id: "be",
    name: "Bloom Energy",
    isDemonstration: false,
    marketType: "Public",
    hq: "San Jose, California",
    region: "North America",
    foundedYear: 2001,
    sector: "Energy & Advanced Materials",
    subsector: "Solid oxide fuel cells and on-site power generation",
    stage: "Public",
    description:
      "Manufactures solid oxide fuel cells that generate electricity on site from natural gas or hydrogen, a proposition that changed materially when data centre grid interconnection queues became measured in years.",
    businessModel:
      "Sells and leases fuel cell systems with long-term service agreements, so each installation produces both an equipment sale and a recurring service stream.",
    primaryCustomer:
      "Data centre operators, utilities, industrial facilities, and large commercial campuses.",
    technicalDifferentiation:
      "Solid oxide fuel cells run at high efficiency without combustion, and can be deployed in months rather than the years a grid interconnection now takes.",
    tractionSignal: estimate(
      "Data centre demand has become a significant driver of orders, reflecting grid interconnection delays rather than any change in the underlying technology.",
      SNAPSHOT,
      "Directionally well established. Confirm current acceptance volumes and segment commentary in the latest filing.",
      "be-ir",
    ),
    keyCatalyst:
      "Whether data centre operators adopt on-site generation as a standard part of the design rather than as a stopgap while waiting for grid capacity.",
    investmentRisk:
      "The company has a long history of losses and repeated financing, and the current demand surge is driven by a grid constraint that will eventually ease.",
    technicalRisk:
      "Fuel cell stack degradation and replacement economics determine whether the service agreements are profitable over their full term.",
    competitiveThreat:
      "Gas turbines, grid capacity expansion, and battery storage paired with renewable generation.",
    capitalIntensity: "Very High",
    commercialReadiness: "Scaling",
    lastReviewed: "2026-07-15",
    sourceIds: ["be-ir", "edgar-bloom-energy", "sec-edgar"],
    financials: {
      kind: "public",
      ticker: "BE",
      marketCap: estimate(
        "In the billions of dollars",
        SNAPSHOT,
        "Band rather than point value.",
        "be-ir",
      ),
      revenueGrowth: estimate(
        "Strong, driven by data centre and utility orders",
        SNAPSHOT,
        VERIFY,
        "edgar-bloom-energy",
      ),
      grossMargin: estimate(
        "Improving from a historically low base as manufacturing scale increases",
        SNAPSHOT,
        VERIFY,
        "edgar-bloom-energy",
      ),
      operatingMargin: estimate(
        "Around break-even after many years of losses, with quarter-to-quarter variability",
        SNAPSHOT,
        VERIFY,
        "edgar-bloom-energy",
      ),
      cashPosition: estimate(
        "Has raised equity and debt repeatedly through its history",
        SNAPSHOT,
        VERIFY,
        "edgar-bloom-energy",
      ),
      valuationMultiple: unverified(
        SNAPSHOT,
        "edgar-bloom-energy",
        "Valued on revenue and forward expectations rather than on established earnings.",
      ),
      marketExpectations:
        "The price treats data centre power demand as durable. Whether it survives grid capacity expansion is the central question.",
      earningsCatalysts: [
        "Product acceptance volumes and data centre order announcements",
        "Gross margin progression toward stated targets",
        "Service agreement profitability disclosure",
      ],
    },
    technology: {
      howItWorks:
        "Solid oxide fuel cells convert fuel to electricity electrochemically at high temperature, without combustion. Systems are modular, so capacity is added in increments rather than in a single large plant.",
      coreAdvantage:
        "Speed of deployment. Where grid interconnection takes years, on-site generation can be installed in months, which is worth a substantial premium to a data centre operator with equipment already ordered.",
      supportingEvidence: [
        {
          claim:
            "Data centre power applications have become a significant source of demand.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "be-ir",
        },
        {
          claim:
            "Systems are deployed and operating at commercial scale across multiple customer types.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "edgar-bloom-energy",
        },
      ],
      benchmarks:
        "Electrical efficiency and stack degradation rate are the operative measures. Degradation determines service agreement profitability and is the number most worth scrutinising.",
      intellectualProperty:
        "Solid oxide cell materials, stack design, and manufacturing process patents accumulated over two decades.",
      thirdPartyDependency:
        "Specialised ceramic materials and rare earth inputs, plus natural gas supply infrastructure at the installation site.",
      milestoneForScale:
        "Sustained positive gross margin on both equipment and service across a full product generation, which the company has pursued for a long time.",
      failurePoints: [
        "Stack degradation making long-term service agreements unprofitable",
        "Grid interconnection queues easing, which removes the primary reason for the current demand",
        "Natural gas price volatility or emissions rules undermining the operating economics",
      ],
    },
    market: {
      painPoint:
        "Data centre operators can obtain accelerators faster than they can obtain grid power. Electricity availability, not equipment, now sets the deployment schedule in many regions.",
      structure:
        "Concentrated buyers making large decisions, with utilities and regulators as influential third parties.",
      adoptionDrivers: [
        "Grid interconnection queues extending to multiple years in key regions",
        "Data centre power requirements rising faster than utilities can plan for",
        "Corporate emissions commitments favouring non-combustion generation",
      ],
      whyNow:
        "The bottleneck in AI infrastructure has moved to electricity. That is a genuine change in the market, though it may prove temporary.",
      competitors: [
        "Gas turbine manufacturers",
        "Grid capacity expansion by utilities",
        "Battery storage paired with renewable generation",
      ],
      substitutes: [
        "Waiting for grid interconnection",
        "Siting data centres where power is already available",
      ],
      regulatoryEnvironment:
        "Emissions rules, energy incentive programmes, and local permitting all bear directly on the economics. Policy support has been material historically.",
      maturity: "Developing",
    },
    commercial: {
      pricingModel:
        "Equipment sale or lease, plus long-term service agreements covering stack replacement.",
      salesMotion:
        "Direct enterprise and utility sales on long procurement cycles.",
      customerType:
        "Data centre operators, utilities, industrial facilities, and commercial campuses.",
      adoptionEvidence: [
        {
          claim:
            "Systems are deployed and operating at commercial scale.",
          provenance: "reported",
          asOf: SNAPSHOT,
          sourceId: "be-ir",
        },
        {
          claim:
            "Data centre orders have grown as grid constraints have tightened.",
          provenance: "estimate",
          asOf: SNAPSHOT,
        },
      ],
      implementationBurden:
        "Site preparation, fuel supply, and permitting are all required, which makes deployment faster than grid interconnection but not simple.",
      expansionOpportunity:
        "Hydrogen-fuelled operation, electrolyser products, and international markets with weaker grid infrastructure.",
      goToMarketRisk:
        "Demand rests on a grid constraint that utilities are actively working to remove.",
    },
    investment: {
      thesis:
        "A long-standing fuel cell business that found genuine product-market fit through an external constraint, where the investment question is whether the constraint outlasts the time needed to reach durable profitability.",
      bullCase:
        "On-site generation becomes standard in data centre design, service agreements prove profitable at scale, and the company reaches sustained profitability after two decades of trying.",
      baseCase:
        "Strong order growth through the current grid constraint, with margins improving but profitability remaining fragile.",
      bearCase:
        "Grid capacity expands, gas turbines take the large deployments on cost, and the company returns to its historical pattern of losses and financing.",
      catalysts: [
        "Data centre order announcements",
        "Gross margin progression",
        "Service agreement profitability disclosure",
      ],
      risks: [
        "Grid constraints easing",
        "Stack degradation economics",
        "A long history of losses and repeated financing",
      ],
      invalidators: [
        "Gross margin failing to improve despite volume growth",
        "Data centre operators standardising on gas turbines for large deployments",
      ],
      recommendedNextStep:
        "Examine service agreement profitability across a full stack replacement cycle, since that is where the historical losses in this business have originated.",
    },
    diligence: {
      technology: [
        "What is the current stack degradation rate, and what does it imply for service agreement profitability over a full term?",
      ],
      product: [
        "What is the revenue and margin split between equipment, installation, and service?",
      ],
      customers: [
        "What share of orders comes from data centre operators, and are those repeat customers?",
      ],
      competition: [
        "At the scale of a large data centre deployment, how does total cost compare with gas turbines?",
      ],
      unitEconomics: [
        "What is the gross margin per installed megawatt, and how has it moved with volume?",
      ],
      capitalRequirements: [
        "What manufacturing capacity investment is required to meet current order growth?",
      ],
      regulation: [
        "How dependent are the economics on energy incentive programmes, and what happens if they lapse?",
      ],
      team: [
        "What has changed operationally to explain improving margins after a long period of losses?",
      ],
      financing: [
        "What is the financing history, and what dilution has occurred over the past five years?",
      ],
      commercialization: [
        "How long from order to commissioning, and how does that compare with grid interconnection timelines in the same region?",
      ],
    },
    outreach:
      "Not applicable. Tracked as a public-market comparison anchor for the private energy company in this universe.",
    factors: {
      differentiation: fa(
        3,
        "verified",
        "High-efficiency non-combustion generation deployable in months rather than years.",
        "Genuine, though the advantage is deployment speed rather than cost.",
      ),
      defensibility: fa(
        2,
        "judgment",
        "Two decades of materials and manufacturing work, competing against mature gas turbine technology on cost.",
        "Weak on cost, moderate on speed, which is a fragile basis for a moat.",
      ),
      marketPotential: fa(
        4,
        "verified",
        "Data centre power demand is large and currently constrained by grid capacity.",
        "Large today, with real uncertainty about how long the constraint persists.",
      ),
      commercialReadiness: fa(
        4,
        "verified",
        "Systems deployed and operating at commercial scale across multiple customer types.",
        "Commercial and scaling, though profitability remains fragile.",
      ),
      customerEvidence: fa(
        4,
        "verified",
        "Reported product acceptances and growing data centre orders.",
        "Real and reported, with some question about repeat purchasing.",
      ),
      teamCredibility: fa(
        3,
        "judgment",
        "Long-tenured leadership that has sustained the company through two decades, without yet delivering durable profitability.",
        "Persistent rather than obviously successful, which is a real distinction.",
      ),
      capitalEfficiency: fa(
        1,
        "verified",
        "Substantial capital consumed over two decades with repeated financing rounds.",
        "The weakest capital efficiency record in this universe.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Competes against mature gas turbine technology and against grid expansion itself.",
        "Difficult, with the primary competitor being the removal of the constraint that creates demand.",
      ),
      technicalRisk: fa(
        3,
        "judgment",
        "Technology works in the field, with stack degradation as the recurring economic risk.",
        "Moderate, concentrated in long-term service economics rather than feasibility.",
      ),
      regulatoryRisk: fa(
        2,
        "verified",
        "Economics depend materially on emissions rules and energy incentive programmes.",
        "High policy sensitivity in both directions.",
      ),
      financingRisk: fa(
        2,
        "verified",
        "A long history of equity and debt raises to fund operations.",
        "Rated on the demonstrated financing history rather than on any single current metric.",
      ),
      overlooked: fa(
        3,
        "judgment",
        "Covered as an energy transition name rather than as AI infrastructure, which leaves some analytical space.",
        "The framing gap creates genuine room for a differentiated view.",
      ),
    },
  },
];

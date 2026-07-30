import { demo, fa, type Company } from "../types";

/**
 * Private companies in the research universe.
 *
 * Every company in this file is fictional. That is a deliberate integrity
 * decision rather than a shortcut. Private companies do not file, so any
 * "real" private record would consist of funding-database figures, press
 * coverage, and inference presented with a confidence the underlying evidence
 * cannot support. Writing invented revenue or invented customers onto the name
 * of a real private company would be the worst thing this platform could do.
 *
 * So the private set is illustrative and labelled as such everywhere it
 * appears. The companies are modelled on real archetypes in each value chain,
 * and the research structure applied to them is exactly the structure that
 * would be applied to a real one. Only the facts are synthetic.
 */

/** Every demonstration figure is dated so the interface can show its age. */
const D = "2026-06-30";

export const PRIVATE_COMPANIES: Company[] = [
  /* ------------------------------------------------------- Larkspur Systems */
  {
    id: "larkspur-systems",
    name: "Larkspur Systems",
    isDemonstration: true,
    marketType: "Private",
    hq: "Seattle, Washington",
    region: "North America",
    foundedYear: 2023,
    sector: "AI Infrastructure",
    subsector: "Inference serving and scheduling",
    stage: "Series A",
    description:
      "Serving layer that decides which accelerator runs which request, aimed at operators whose inference fleets sit half idle because scheduling was designed for training rather than for traffic that arrives unevenly.",
    businessModel:
      "Annual platform licence priced on accelerators under management, so revenue grows with the customer's fleet rather than with seat count.",
    primaryCustomer:
      "Companies operating between one hundred and several thousand accelerators for production inference, including neoclouds and large software companies.",
    technicalDifferentiation:
      "Batching and routing that account for the memory state already resident on each device, which avoids reloading model weights that are the dominant cost in mixed-model serving.",
    tractionSignal: demo(
      "Eleven paid deployments, with the three longest-running customers having expanded accelerator counts under management at renewal.",
      D,
      "Illustrative traction on a fictional company.",
    ),
    keyCatalyst:
      "Whether the serving layer stays valuable as accelerator vendors improve their own scheduling software, which is bundled at no additional cost.",
    investmentRisk:
      "The function is a plausible candidate for absorption into the platform layer beneath it.",
    technicalRisk:
      "Advantage depends on memory residency assumptions that could be invalidated by a change in accelerator memory architecture.",
    competitiveThreat:
      "Open-source serving frameworks that are free, improving quickly, and already deployed at most target customers.",
    capitalIntensity: "Low",
    commercialReadiness: "Early Deployment",
    lastReviewed: "2026-07-26",
    sourceIds: [],
    financials: {
      kind: "private",
      stage: "Series A",
      capitalRaised: demo(18_000_000, D, "Illustrative total raised."),
      latestRound: demo(
        "Series A, closed in the first quarter of 2026",
        D,
      ),
      capitalIntensity: "Low",
      futureFinancingNeed:
        "One further round before profitability on the current plan, most likely eighteen to twenty-four months out.",
      ownershipConsiderations:
        "Founder ownership remains high for the stage, which leaves room for a meaningful position without forcing an unusual structure.",
      financingRisk:
        "Low in absolute terms because burn is modest, but the category is crowded enough that a flat round is a realistic outcome if growth slows.",
    },
    technology: {
      howItWorks:
        "A router sits in front of the accelerator fleet and holds a live view of which model weights are resident where. Requests are batched by compatibility with that resident state rather than purely by arrival order.",
      coreAdvantage:
        "In mixed-model serving, loading weights dominates cost. Scheduling against memory residency addresses the expensive part of the problem rather than the visible part.",
      supportingEvidence: [
        {
          claim:
            "Customers report improved accelerator utilisation after deployment.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "The routing component is open source, and external contributors have submitted production fixes.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      benchmarks:
        "Published utilisation improvements are measured against a customer's prior configuration, which is a fair comparison only if that configuration was competently tuned. Independent replication has not been attempted.",
      intellectualProperty:
        "No patents filed. The defensibility argument rests on operational integration rather than on protected invention, which the team states directly.",
      thirdPartyDependency:
        "Depends on accelerator vendor runtime interfaces, which are controlled by the vendor and change between generations.",
      milestoneForScale:
        "A deployment above two thousand accelerators, which is where scheduling behaviour tends to change qualitatively rather than merely in degree.",
      failurePoints: [
        "Accelerator vendors improving bundled scheduling to the point where the gap no longer justifies a separate purchase",
        "Memory architecture changes that reduce the cost of weight loading and remove the core advantage",
        "Open-source serving frameworks closing the gap while remaining free",
      ],
    },
    market: {
      painPoint:
        "Inference traffic arrives unevenly and across many models. Schedulers built for training assume steady, homogeneous workloads, so utilisation falls well below what the hardware could deliver.",
      structure:
        "A growing set of operators large enough to care about utilisation but too small to build and maintain scheduling infrastructure themselves.",
      adoptionDrivers: [
        "Accelerator cost making utilisation a board-level line item rather than an engineering detail",
        "Growth in the number of distinct models served per organisation",
        "Difficulty hiring engineers who have operated inference fleets at scale",
      ],
      whyNow:
        "Two years ago most organisations served one model and utilisation barely mattered. Serving dozens turns scheduling into a genuine cost centre.",
      competitors: [
        "Open-source serving frameworks",
        "Accelerator vendor scheduling software",
        "Cloud provider managed inference services",
      ],
      substitutes: [
        "Internal engineering teams building equivalent routing",
        "Over-provisioning accelerators, which is expensive but simple",
      ],
      regulatoryEnvironment:
        "No direct regulatory exposure. Customers in regulated industries impose data residency requirements that shape deployment architecture.",
      maturity: "Emerging",
    },
    commercial: {
      pricingModel:
        "Annual licence scaled by accelerators under management, with a floor that makes small deployments uneconomic to serve.",
      salesMotion:
        "Technical, founder-led, generally beginning with an engineer who found the open-source component before any commercial conversation.",
      customerType:
        "Infrastructure and platform engineering teams at accelerator-operating companies.",
      adoptionEvidence: [
        {
          claim:
            "Eleven paid deployments, three of which have renewed with expanded scope.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Most commercial conversations begin inbound, following use of the open-source component.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      implementationBurden:
        "Two to four weeks, most of it spent understanding the customer's existing traffic patterns rather than installing anything.",
      expansionOpportunity:
        "Fleet growth at existing customers, plus adjacent capacity planning that uses the same telemetry already being collected.",
      goToMarketRisk:
        "Selling infrastructure software to engineering teams who could plausibly build it themselves, and who enjoy building it.",
    },
    investment: {
      thesis:
        "A narrow, real inefficiency in inference operations, addressed by a team that has operated fleets at scale, with the open question being whether the function stays independent or gets absorbed by the layer beneath it.",
      bullCase:
        "Becomes the default serving layer for organisations too large for naive scheduling and too small to build their own, with revenue compounding as customer fleets grow.",
      baseCase:
        "A useful product with steady growth in a defined niche, reaching a moderate outcome without becoming infrastructure everyone runs.",
      bearCase:
        "Accelerator vendors close the gap with bundled software, and the standalone product loses its reason to exist.",
      catalysts: [
        "A deployment above two thousand accelerators",
        "Independent replication of the utilisation improvements",
        "Evidence of retention after an accelerator vendor scheduling upgrade",
      ],
      risks: [
        "Absorption into the accelerator platform layer",
        "Free open-source alternatives improving quickly",
        "Benchmark claims resting on customer-specific baselines",
      ],
      invalidators: [
        "An accelerator vendor shipping equivalent residency-aware scheduling as standard",
        "A customer churning after a vendor software upgrade rather than for commercial reasons",
      ],
      recommendedNextStep:
        "Ask for a reference call with the customer who has run the product through an accelerator vendor software upgrade, because retention through that event is the whole thesis.",
    },
    diligence: {
      technology: [
        "What happens to the utilisation advantage when the accelerator vendor ships its next scheduling release?",
      ],
      product: [
        "How much of the deployed value comes from routing versus from the observability the product provides along the way?",
      ],
      customers: [
        "Of the eleven deployments, how many would describe this as production-critical rather than as an optimisation?",
      ],
      competition: [
        "Where has an open-source framework been chosen instead, and what was the deciding factor?",
      ],
      unitEconomics: [
        "What does it cost to support a customer in the first year relative to the licence fee?",
      ],
      capitalRequirements: [
        "What headcount is required to support a fleet ten times the current size?",
      ],
      regulation: [
        "What deployment architecture is required for customers with data residency requirements?",
      ],
      team: [
        "Which team members have personally operated inference fleets above one thousand accelerators?",
      ],
      financing: [
        "What milestones does the current plan reach before the next raise, and how much room is there if growth slows by a quarter?",
      ],
      commercialization: [
        "What proportion of open-source users convert to paid, and how long does that take?",
      ],
    },
    outreach:
      "Hi, I read the write-up on scheduling against resident memory state rather than arrival order, and the part that stayed with me was the admission that the effect mostly disappears below a certain fleet size. Publishing the boundary condition alongside the result is unusual. I spend most of my time on early-stage inference infrastructure. I would like to understand what changes in the scheduling behaviour above two thousand accelerators, and whether the customers who have been through a vendor software upgrade stayed. Would you be open to a short call?",
    factors: {
      differentiation: fa(
        3,
        "judgment",
        "Residency-aware scheduling is a real technical idea, though not an unreproducible one.",
        "A genuine insight rather than a defensible invention.",
      ),
      defensibility: fa(
        2,
        "judgment",
        "No patents, an open-source core, and a function that the platform below could absorb.",
        "The weakest part of the case, and the team says so themselves.",
      ),
      marketPotential: fa(
        4,
        "judgment",
        "Every organisation running production inference at moderate scale has this problem.",
        "Large and growing, though the willingness to pay is unproven above a certain fleet size.",
      ),
      commercialReadiness: fa(
        3,
        "judgment",
        "Eleven paid deployments with three expansions at renewal.",
        "Past prototype, not yet a repeatable sale.",
      ),
      customerEvidence: fa(
        3,
        "judgment",
        "Paid deployments with expansion, mostly sourced inbound from open-source use.",
        "Real evidence at small absolute numbers.",
      ),
      teamCredibility: fa(
        4,
        "judgment",
        "Founders operated large inference fleets before starting the company.",
        "Direct operating experience with the exact problem, which is the strongest signal available at this stage.",
      ),
      capitalEfficiency: fa(
        4,
        "judgment",
        "Eleven deployments reached on a modest raise with a small team.",
        "Efficient relative to the category.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Free open-source frameworks, vendor-bundled software, and cloud managed services all address adjacent parts of this.",
        "A crowded field where the main competitor costs nothing.",
      ),
      technicalRisk: fa(
        4,
        "judgment",
        "The product works in production today. The risk is strategic rather than technical.",
        "Low feasibility risk.",
      ),
      regulatoryRisk: fa(
        5,
        "judgment",
        "No direct regulatory exposure.",
        "Effectively none.",
      ),
      financingRisk: fa(
        3,
        "judgment",
        "Modest burn and a clear next milestone, in a category where a flat round is plausible.",
        "Moderate.",
      ),
      overlooked: fa(
        4,
        "judgment",
        "The serving layer receives far less attention than accelerators or models.",
        "Genuinely under-examined relative to the cost it controls.",
      ),
    },
  },

  /* --------------------------------------------------------- Meridian Fabric */
  {
    id: "meridian-fabric",
    name: "Meridian Fabric",
    isDemonstration: true,
    marketType: "Private",
    hq: "Austin, Texas",
    region: "North America",
    foundedYear: 2021,
    sector: "AI Infrastructure",
    subsector: "Optical interconnect for rack-scale systems",
    stage: "Series B",
    description:
      "Co-packaged optical interconnect intended to replace electrical links between accelerator trays, targeting the reach and power problems that appear as racks grow past what copper handles well.",
    businessModel:
      "Component sales to system manufacturers and directly to large operators, with pricing set against the total cost of the optical modules it displaces.",
    primaryCustomer:
      "System manufacturers building AI racks, and the largest operators who specify their own designs.",
    technicalDifferentiation:
      "Places the optical engine on the same substrate as the switch die, removing an electrical hop that consumes power and constrains reach.",
    tractionSignal: demo(
      "Two system manufacturers have the part in qualification. No production revenue yet, and qualification is where products in this category most often stop.",
      D,
      "Illustrative traction on a fictional company.",
    ),
    keyCatalyst:
      "Completing qualification at either manufacturer, which would convert an engineering programme into a business.",
    investmentRisk:
      "Substantial capital has been consumed to reach a stage where no revenue yet exists.",
    technicalRisk:
      "Co-packaged optics has defeated well-funded teams before, usually on thermal behaviour and on serviceability rather than on optical performance.",
    competitiveThreat:
      "Large connectivity vendors with their own co-packaged optics programmes and far greater resources.",
    capitalIntensity: "Very High",
    commercialReadiness: "Prototype",
    lastReviewed: "2026-07-25",
    sourceIds: [],
    financials: {
      kind: "private",
      stage: "Series B",
      capitalRaised: demo(94_000_000, D, "Illustrative total raised."),
      latestRound: demo("Series B, closed in mid 2025", D),
      capitalIntensity: "Very High",
      futureFinancingNeed:
        "A further substantial round is required before production revenue, and the amount depends on qualification outcomes the company does not control.",
      ownershipConsiderations:
        "Two prior rounds with participation from strategic investors, which may constrain acquisition options later.",
      financingRisk:
        "High. The company must raise again before it can demonstrate the milestone that would make raising straightforward.",
    },
    technology: {
      howItWorks:
        "Optical engines are placed on the switch package rather than at the faceplate, so signals convert to light immediately rather than travelling across the board electrically first.",
      coreAdvantage:
        "Removing the electrical hop saves power and extends reach, both of which become binding constraints as accelerator counts per rack increase.",
      supportingEvidence: [
        {
          claim:
            "Laboratory results show power per bit below current pluggable optical modules.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Two system manufacturers have the part in qualification.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      benchmarks:
        "Power per bit is measured under laboratory conditions. Behaviour inside a hot, vibrating, densely populated rack is a different question and the one that has historically decided this category.",
      intellectualProperty:
        "Fourteen filed patents covering packaging and thermal management of the optical engine.",
      thirdPartyDependency:
        "Specialist photonic foundry capacity and advanced packaging, both from a small number of suppliers with limited slots.",
      milestoneForScale:
        "Passing qualification at one manufacturer, then demonstrating field serviceability, which is where co-packaged optics has historically failed.",
      failurePoints: [
        "Thermal behaviour inside a production rack differing from laboratory conditions",
        "Serviceability problems, since a failed optical engine on a switch package cannot be swapped like a pluggable module",
        "A large connectivity vendor reaching qualification first with better supply assurance",
      ],
    },
    market: {
      painPoint:
        "As racks grow, electrical links between trays consume more power and reach less distance. Optics solves both but currently costs more and sits at the faceplate rather than at the die.",
      structure:
        "A very small number of buyers, each making platform decisions that determine several years of volume.",
      adoptionDrivers: [
        "Rack power budgets where interconnect is a growing share of total consumption",
        "Accelerator counts per rack rising with each generation",
        "Reach requirements exceeding what copper supports at higher data rates",
      ],
      whyNow:
        "Data rates have reached the point where the crossover from copper to optics is moving inside the rack rather than between racks.",
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
        "Export controls apply to advanced data centre components. No product-specific regulation.",
      maturity: "Emerging",
    },
    commercial: {
      pricingModel:
        "Per-component pricing benchmarked against the pluggable optical modules displaced, with volume commitments expected at qualification.",
      salesMotion:
        "Long qualification cycles with a handful of system manufacturers, measured in years rather than quarters.",
      customerType:
        "System manufacturers and the largest data centre operators.",
      adoptionEvidence: [
        {
          claim: "Two manufacturers have the part in active qualification.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "No production revenue has been recognised, and no volume commitment has been signed.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      implementationBurden:
        "Extremely high. The customer redesigns a platform around the component, which is why qualification takes years and why winning one is durable.",
      expansionOpportunity:
        "Additional data rate generations and adjacent switching applications, none of which matter before the first qualification completes.",
      goToMarketRisk:
        "With two prospects and no revenue, commercial risk and technical risk are the same risk.",
    },
    investment: {
      thesis:
        "A credible technical answer to a real and worsening constraint, at the stage where the entire outcome depends on qualification results that are eighteen months away and outside the company's control.",
      bullCase:
        "Qualification completes at one manufacturer, the platform ships, and the company becomes a strategically important supplier in a category with few alternatives.",
      baseCase:
        "Qualification takes longer than planned, a further dilutive round is required, and the company eventually reaches modest production volume.",
      bearCase:
        "Thermal or serviceability problems appear in qualification, a larger competitor arrives first, and the capital consumed cannot be recovered.",
      catalysts: [
        "Qualification completion at either manufacturer",
        "A signed volume commitment",
        "Independent thermal validation inside a production rack",
      ],
      risks: [
        "Qualification failure",
        "Financing required before the proving milestone",
        "Far better capitalised competitors",
      ],
      invalidators: [
        "Either qualification stopping for thermal or serviceability reasons",
        "A major connectivity vendor announcing production availability first",
      ],
      recommendedNextStep:
        "Request the thermal data from inside a populated rack rather than from the laboratory bench, since that gap is where this category usually fails.",
    },
    diligence: {
      technology: [
        "What is the measured thermal behaviour inside a fully populated production rack, as distinct from bench conditions?",
      ],
      product: [
        "How is a failed optical engine serviced in the field, and what does that do to operator maintenance procedures?",
      ],
      customers: [
        "What are the specific exit criteria for each qualification, and which criteria remain unmet?",
      ],
      competition: [
        "Where are the large connectivity vendors in their own co-packaged optics programmes?",
      ],
      unitEconomics: [
        "At target volume, what is the cost per component relative to the pluggable modules it displaces?",
      ],
      capitalRequirements: [
        "What capital is needed to reach production, and what photonic foundry capacity has been secured?",
      ],
      regulation: [
        "What export control exposure applies to this component?",
      ],
      team: [
        "Who on the team has taken a photonics product through manufacturer qualification before?",
      ],
      financing: [
        "How many months of runway remain, and does that extend past the qualification decision dates?",
      ],
      commercialization: [
        "What volume commitment, if any, follows a successful qualification?",
      ],
    },
    outreach:
      "Hi, I have been following the co-packaged optics work, and the thermal paper from earlier this year was the first one I have read that treated serviceability as a first-order design constraint rather than an afterthought. That framing is the reason I am writing. I spend most of my time on early-stage AI infrastructure. I would like to understand what the thermal behaviour looks like inside a populated rack rather than on the bench, and where each qualification currently stands against its exit criteria. Would you be open to a conversation?",
    factors: {
      differentiation: fa(
        5,
        "judgment",
        "Co-packaged optical engine with a genuine power per bit advantage over pluggable modules.",
        "Technically distinctive and difficult to reproduce quickly.",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Fourteen filed patents plus qualification lock-in once a platform is designed around the part.",
        "Strong if qualification completes, close to worthless if it does not.",
      ),
      marketPotential: fa(
        4,
        "judgment",
        "Interconnect power and reach are worsening constraints in every accelerator generation.",
        "Large, though gated by a very small number of buyers.",
      ),
      commercialReadiness: fa(
        1,
        "judgment",
        "No production revenue. Two qualifications in progress.",
        "Pre-commercial, stated plainly.",
      ),
      customerEvidence: fa(
        2,
        "judgment",
        "Qualification engagement from two manufacturers, no volume commitment.",
        "Interest rather than demand.",
      ),
      teamCredibility: fa(
        4,
        "judgment",
        "Photonics team with prior silicon photonics production experience.",
        "Credible for the problem, though none has completed this specific qualification path.",
      ),
      capitalEfficiency: fa(
        2,
        "judgment",
        "Ninety four million dollars consumed with no revenue yet.",
        "Characteristic of the category, but low as measured.",
      ),
      competitiveIntensity: fa(
        1,
        "judgment",
        "Competing against connectivity vendors with vastly greater resources and existing customer relationships.",
        "The most adverse competitive position in the private set.",
      ),
      technicalRisk: fa(
        2,
        "judgment",
        "Co-packaged optics has defeated well-funded teams before, usually on thermal and serviceability grounds.",
        "High, and concentrated in exactly the areas that laboratory results do not address.",
      ),
      regulatoryRisk: fa(
        4,
        "judgment",
        "General export control exposure only.",
        "Low.",
      ),
      financingRisk: fa(
        1,
        "judgment",
        "Must raise again before reaching the milestone that would make raising straightforward.",
        "The highest financing risk in this universe.",
      ),
      overlooked: fa(
        3,
        "judgment",
        "Co-packaged optics is widely discussed, though mostly at the level of the large vendors.",
        "Moderately under-examined at the startup layer.",
      ),
    },
  },

  /* -------------------------------------------------------- Coldbrook Thermal */
  {
    id: "coldbrook-thermal",
    name: "Coldbrook Thermal",
    isDemonstration: true,
    marketType: "Private",
    hq: "Delft, Netherlands",
    region: "Europe",
    foundedYear: 2020,
    sector: "Energy & Advanced Materials",
    subsector: "Direct-to-chip liquid cooling",
    stage: "Series B",
    description:
      "Direct-to-chip liquid cooling designed to be retrofitted into existing air-cooled halls, aimed at operators who need higher rack densities in buildings that were not designed for them.",
    businessModel:
      "Hardware sales through data centre engineering contractors, with multi-year service contracts on coolant chemistry and pump maintenance.",
    primaryCustomer:
      "Colocation operators and enterprises retrofitting existing facilities rather than building new ones.",
    technicalDifferentiation:
      "A cold plate and manifold design that fits standard rack dimensions and tolerates the water quality found in existing building loops, which most direct-to-chip systems do not.",
    tractionSignal: demo(
      "Nine facilities deployed across four operators, with two operators having repeated after the first installation.",
      D,
      "Illustrative traction on a fictional company.",
    ),
    keyCatalyst:
      "Whether retrofit remains a large market or whether operators simply build new facilities designed for liquid cooling from the start.",
    investmentRisk:
      "The retrofit market may prove to be a transitional category rather than a durable one.",
    technicalRisk:
      "Leak risk in a live data hall is the objection every customer raises, and one incident at a reference customer would be commercially severe.",
    competitiveThreat:
      "Large thermal management vendors with existing operator relationships and global service organisations.",
    capitalIntensity: "High",
    commercialReadiness: "Early Deployment",
    lastReviewed: "2026-07-24",
    sourceIds: [],
    financials: {
      kind: "private",
      stage: "Series B",
      capitalRaised: demo(52_000_000, D, "Illustrative total raised."),
      latestRound: demo("Series B, closed in late 2025", D),
      capitalIntensity: "High",
      futureFinancingNeed:
        "Working capital for manufacturing scale rather than research funding, which is a materially better reason to raise.",
      ownershipConsiderations:
        "A strategic investor from the engineering contractor channel holds a board observer seat, which helps distribution and complicates a future sale to a competitor.",
      financingRisk:
        "Moderate. Revenue exists and is growing, so the next round is a growth round rather than a survival round.",
    },
    technology: {
      howItWorks:
        "Cold plates mount directly onto processors and accelerators. Coolant circulates through a manifold to a heat exchanger that connects to the building's existing chilled water loop.",
      coreAdvantage:
        "Tolerance for imperfect water quality and standard rack dimensions, which is what makes retrofit practical rather than theoretical.",
      supportingEvidence: [
        {
          claim:
            "Nine facilities in production across four operators.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "No reported coolant leak incidents across deployed sites to date.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      benchmarks:
        "Heat removal per rack and pumping power are measured per installation. Results depend heavily on the host building, so cross-site comparison is limited.",
      intellectualProperty:
        "Six patents on manifold design and coolant chemistry, with the chemistry work the more difficult to reproduce.",
      thirdPartyDependency:
        "Precision manufacturing for cold plates and a specialist coolant supply chain.",
      milestoneForScale:
        "A deployment at a hyperscale operator, which would move the company from the retrofit niche into the main market.",
      failurePoints: [
        "A leak incident at a reference customer, which would be commercially severe regardless of cause",
        "Coolant chemistry degradation over multi-year operation in real building loops",
        "New facilities designed for liquid cooling removing the retrofit rationale",
      ],
    },
    market: {
      painPoint:
        "Existing data halls were designed for air cooling at densities far below what current accelerator racks produce. Rebuilding is slow and expensive; retrofitting is neither, if it can be done safely.",
      structure:
        "Fragmented on the buy side, with colocation operators and enterprises making facility-level decisions.",
      adoptionDrivers: [
        "Rack densities exceeding what air cooling can remove",
        "Existing facility leases with years remaining",
        "Construction timelines for new liquid-cooled facilities measured in years",
      ],
      whyNow:
        "The gap between the densities operators need and the densities their buildings support has widened sharply, and leases do not expire on demand.",
      competitors: [
        "Vertiv",
        "Schneider Electric",
        "Specialist liquid cooling suppliers",
      ],
      substitutes: [
        "Building new liquid-cooled facilities",
        "Accepting lower rack densities in existing halls",
      ],
      regulatoryEnvironment:
        "Building codes, coolant handling rules, and local environmental regulation apply to installations.",
      maturity: "Emerging",
    },
    commercial: {
      pricingModel:
        "Per-rack hardware pricing plus annual service contracts covering coolant and pump maintenance.",
      salesMotion:
        "Sold through data centre engineering contractors, which shortens the sales cycle and gives away some margin.",
      customerType:
        "Colocation operators and enterprise facility teams.",
      adoptionEvidence: [
        {
          claim:
            "Two of four operators have repeated after a first installation.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Service contract attach rate is high across deployed sites.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      implementationBurden:
        "Installation happens in a live facility, which requires careful scheduling and is the main reason the sales cycle is long.",
      expansionOpportunity:
        "Service revenue on a growing installed base, and additional racks within facilities already converted.",
      goToMarketRisk:
        "Channel dependence on engineering contractors who also carry competing products.",
    },
    investment: {
      thesis:
        "A practical answer to a constraint operators face today, differentiated by tolerance for real building conditions rather than by thermal performance, with a service annuity building underneath.",
      bullCase:
        "Retrofit proves a durable market, a hyperscale deployment lands, and the service base compounds into the more valuable half of the business.",
      baseCase:
        "Steady growth in the retrofit niche with good service economics, reaching a solid but not exceptional outcome.",
      bearCase:
        "New facility construction removes the retrofit rationale, or a leak incident damages the reference base.",
      catalysts: [
        "A hyperscale operator deployment",
        "Multi-year coolant chemistry data from the earliest sites",
        "Service revenue reaching a meaningful share of the total",
      ],
      risks: [
        "Leak risk and its commercial consequences",
        "Retrofit proving transitional",
        "Channel dependence",
      ],
      invalidators: [
        "A leak incident at a reference site",
        "Repeat purchase rate falling as operators shift to new construction",
      ],
      recommendedNextStep:
        "Request coolant chemistry data from the two oldest installations, since multi-year degradation is the risk that would show up long after the sale.",
    },
    diligence: {
      technology: [
        "What does coolant chemistry look like after three years in a real building loop rather than in test conditions?",
      ],
      product: [
        "How does installation time compare between the first and most recent deployments?",
      ],
      customers: [
        "Of the four operators, which have repeated, and what did the second purchase decision turn on?",
      ],
      competition: [
        "Where has the company lost against the large thermal vendors, and why?",
      ],
      unitEconomics: [
        "What is the margin split between hardware and service, and how does channel commission affect it?",
      ],
      capitalRequirements: [
        "What manufacturing investment is required to support the next order volume?",
      ],
      regulation: [
        "What coolant handling and building code requirements apply across target markets?",
      ],
      team: [
        "Who has taken a thermal product through hyperscale qualification before?",
      ],
      financing: [
        "How much of the next round is working capital rather than operating burn?",
      ],
      commercialization: [
        "What proportion of revenue comes through contractors versus direct, and how does that mix affect margin?",
      ],
    },
    outreach:
      "Hi, I read the installation notes on retrofitting into buildings with existing water quality problems, and the decision to design for imperfect loops rather than to specify them away is the interesting choice. Most direct-to-chip systems assume conditions that real buildings do not provide. I focus on early-stage infrastructure and materials companies. I would like to understand what the coolant chemistry looks like after three years at the oldest sites, and how the repeat purchase decisions have gone. Would you have twenty minutes?",
    factors: {
      differentiation: fa(
        3,
        "judgment",
        "Manifold design and coolant chemistry tolerant of real building conditions.",
        "A practical rather than a scientific differentiation, which is worth less but is real.",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Six patents plus a growing service relationship on the installed base.",
        "Moderate, with the service annuity the more durable part.",
      ),
      marketPotential: fa(
        3,
        "judgment",
        "Large today, with genuine uncertainty about whether retrofit persists as a category.",
        "Rated down for the possibility that this is a transitional market.",
      ),
      commercialReadiness: fa(
        4,
        "judgment",
        "Nine facilities in production with repeat purchases and high service attach.",
        "Genuinely commercial at small scale.",
      ),
      customerEvidence: fa(
        4,
        "judgment",
        "Repeat purchases from half the customer base, plus service contract attach.",
        "Repeat purchase is the strongest evidence available at this stage.",
      ),
      teamCredibility: fa(
        3,
        "judgment",
        "Thermal engineering team from a research university background with limited large-scale commercial history.",
        "Technically strong, commercially less proven.",
      ),
      capitalEfficiency: fa(
        3,
        "judgment",
        "Fifty two million dollars to reach nine deployed facilities.",
        "Reasonable for hardware, unremarkable in absolute terms.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Competing against very large thermal vendors with existing operator relationships.",
        "Difficult, mitigated by focusing on a segment the large vendors serve less well.",
      ),
      technicalRisk: fa(
        3,
        "judgment",
        "Systems work in production, with leak risk and long-term chemistry as open questions.",
        "Moderate, with the tail risk larger than the base rate suggests.",
      ),
      regulatoryRisk: fa(
        4,
        "judgment",
        "Building codes and coolant handling rules apply but are well understood.",
        "Low and manageable.",
      ),
      financingRisk: fa(
        4,
        "judgment",
        "Revenue growing, with the next raise for working capital rather than survival.",
        "Comparatively low for a hardware company at this stage.",
      ),
      overlooked: fa(
        4,
        "judgment",
        "Cooling receives far less investor attention than compute despite sitting on the same critical path.",
        "Under-examined relative to its importance.",
      ),
    },
  },

  /* ----------------------------------------------------------- Halden Compute */
  {
    id: "halden-compute",
    name: "Halden Compute",
    isDemonstration: true,
    marketType: "Private",
    hq: "Portland, Oregon",
    region: "North America",
    foundedYear: 2019,
    sector: "Semiconductors",
    subsector: "Inference-optimised accelerator silicon",
    stage: "Series C",
    description:
      "Designs an accelerator built only for inference, trading away training capability for memory bandwidth per watt, on the argument that the two workloads have diverged enough to justify separate silicon.",
    businessModel:
      "Chip and system sales to neocloud operators and enterprises running large inference fleets, with a compiler and runtime supplied at no additional cost because adoption depends on it.",
    primaryCustomer:
      "Neocloud operators and large enterprises serving high-volume inference where cost per token dominates the decision.",
    technicalDifferentiation:
      "A memory architecture that keeps model weights resident on-package, eliminating the off-package memory traffic that dominates energy consumption in inference.",
    tractionSignal: demo(
      "Three neocloud customers in paid pilot, one of which has deployed several hundred units. No multi-year volume commitment yet.",
      D,
      "Illustrative traction on a fictional company.",
    ),
    keyCatalyst:
      "Converting a pilot into a multi-year volume commitment, which is the only evidence that would distinguish this from the many inference silicon efforts that stalled at the pilot stage.",
    investmentRisk:
      "The company has raised heavily against a thesis that the incumbent can partly neutralise by shipping its own inference-optimised part.",
    technicalRisk:
      "The compiler must handle model architectures that did not exist when the silicon was taped out, and compiler maturity has killed more accelerator startups than silicon has.",
    competitiveThreat:
      "Incumbent accelerator vendors, hyperscaler custom silicon, and a well-funded field of inference silicon startups.",
    capitalIntensity: "Very High",
    commercialReadiness: "Early Deployment",
    lastReviewed: "2026-07-23",
    sourceIds: [],
    financials: {
      kind: "private",
      stage: "Series C",
      capitalRaised: demo(310_000_000, D, "Illustrative total raised."),
      latestRound: demo("Series C, closed in late 2025", D),
      capitalIntensity: "Very High",
      futureFinancingNeed:
        "A further large round is required to fund the next tape-out, which is committed spending regardless of how pilots convert.",
      ownershipConsiderations:
        "Three prior institutional rounds with meaningful preference stacked ahead of common, which materially changes the return profile at anything below an exceptional exit.",
      financingRisk:
        "High. Each generation costs more than the last, and the funding decision arrives before the commercial evidence does.",
    },
    technology: {
      howItWorks:
        "Model weights are held in large on-package memory rather than in external memory. The compiler partitions models to fit that memory, and the runtime schedules execution to keep weights resident across requests.",
      coreAdvantage:
        "Inference energy is dominated by moving weights rather than by arithmetic. Keeping them on-package attacks the dominant cost directly.",
      supportingEvidence: [
        {
          claim:
            "Published cost per token below merchant accelerators on the model families the compiler supports well.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "One customer has deployed several hundred units in production.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      benchmarks:
        "Cost per token is quoted on supported model families. Performance on unsupported architectures is substantially worse, which the company discloses but which is easy to miss in the headline figure.",
      intellectualProperty:
        "Twenty three patents covering the memory architecture and the compiler partitioning approach.",
      thirdPartyDependency:
        "Leading-node foundry capacity and advanced packaging, competing for the same allocation as much larger buyers.",
      milestoneForScale:
        "A multi-year volume commitment from a named customer, and compiler support for model architectures released after tape-out.",
      failurePoints: [
        "Compiler support lagging new model architectures, which arrive faster than silicon generations",
        "On-package memory capacity proving insufficient as model sizes grow",
        "Foundry and packaging allocation going to larger buyers during a supply squeeze",
      ],
    },
    market: {
      painPoint:
        "Serving inference on training-optimised hardware wastes energy and capital, because the workloads have genuinely different characteristics.",
      structure:
        "A moderate number of buyers who care intensely about cost per token, and a much larger number who do not yet care enough to change hardware.",
      adoptionDrivers: [
        "Inference becoming the dominant share of deployed AI compute",
        "Cost per token becoming a competitive variable for AI product companies",
        "Power constraints making performance per watt a deployment limit rather than a preference",
      ],
      whyNow:
        "Inference volume has grown to the point where specialised silicon can amortise its development cost, which was not true three years ago.",
      competitors: [
        "NVIDIA",
        "Advanced Micro Devices",
        "Hyperscaler custom inference silicon",
        "Other inference silicon startups",
      ],
      substitutes: [
        "Merchant accelerators used for both training and inference",
        "Model efficiency work that reduces compute per request",
      ],
      regulatoryEnvironment:
        "Export controls apply to advanced accelerators, restricting some markets.",
      maturity: "Emerging",
    },
    commercial: {
      pricingModel:
        "System pricing benchmarked on total cost per token rather than on hardware cost, which is the only comparison that favours the product.",
      salesMotion:
        "Long technical evaluations with a small number of sophisticated buyers, each running their own workloads before committing.",
      customerType:
        "Neocloud operators and large enterprises with high-volume inference.",
      adoptionEvidence: [
        {
          claim: "Three customers in paid pilot.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "No multi-year volume commitment has been signed to date.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      implementationBurden:
        "High. The customer must port workloads to a different compiler and accept a narrower set of supported model architectures.",
      expansionOpportunity:
        "Fleet expansion at pilot customers, and broader model architecture support widening the addressable workload set.",
      goToMarketRisk:
        "Buyers must bet on a startup's compiler roadmap keeping pace with model architecture changes they cannot predict either.",
    },
    investment: {
      thesis:
        "A well-executed attack on the correct bottleneck in inference economics, at a company that has raised enough to matter and now needs a volume commitment to prove the thesis before the next tape-out is funded.",
      bullCase:
        "Pilots convert to multi-year commitments, compiler support broadens, and the company establishes itself as the cost leader for high-volume inference.",
      baseCase:
        "Slow conversion, one further dilutive round, and eventual acquisition by a larger vendor wanting the memory architecture.",
      bearCase:
        "Compiler support falls behind model architecture changes, the incumbent ships an inference-optimised part, and the accumulated capital cannot be recovered.",
      catalysts: [
        "A signed multi-year volume commitment",
        "Compiler support for a major model architecture released after tape-out",
        "Independent cost per token validation on a customer workload",
      ],
      risks: [
        "Compiler roadmap risk",
        "Preference stack changing the return profile",
        "Incumbent response",
      ],
      invalidators: [
        "Pilots failing to convert within twelve months",
        "A major model architecture remaining unsupported for more than two quarters",
      ],
      recommendedNextStep:
        "Establish how long it took to add support for the most recent significant model architecture, since that interval is the real product roadmap.",
    },
    diligence: {
      technology: [
        "How long did compiler support for the most recent major model architecture take from release to production readiness?",
      ],
      product: [
        "What share of the customer's actual workload runs on supported architectures today?",
      ],
      customers: [
        "What are the specific criteria each pilot must meet to convert, and which remain unmet?",
      ],
      competition: [
        "How does cost per token compare against merchant accelerators on the customer's own workload rather than on a reference model?",
      ],
      unitEconomics: [
        "What is the gross margin per system at current volumes, and what volume is required for it to become attractive?",
      ],
      capitalRequirements: [
        "What does the next tape-out cost, and when must that decision be made relative to pilot conversion?",
      ],
      regulation: [
        "Which markets are restricted under export controls, and what share of the pipeline do they represent?",
      ],
      team: [
        "How large is the compiler team relative to the silicon team, and how has that ratio changed?",
      ],
      financing: [
        "What is the preference stack, and what does a five hundred million dollar exit return to common?",
      ],
      commercialization: [
        "What is the time from first pilot unit to a volume decision at the most advanced customer?",
      ],
    },
    outreach:
      "Hi, I went through the cost per token numbers and, more usefully, the note explaining how much they degrade on unsupported architectures. Publishing the degradation alongside the headline is not the norm in this category. I spend most of my time on early-stage compute infrastructure. The question I keep returning to is how quickly compiler support lands for architectures released after tape-out, since that interval seems to be the actual product. Would you be open to a call?",
    factors: {
      differentiation: fa(
        4,
        "judgment",
        "On-package memory architecture attacking the dominant energy cost in inference.",
        "Technically sound and aimed at the right bottleneck.",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Twenty three patents, offset by an incumbent that could ship an inference-optimised part.",
        "Moderate. Patents do not protect against a well-resourced fast follower.",
      ),
      marketPotential: fa(
        5,
        "judgment",
        "Inference is becoming the dominant share of deployed AI compute.",
        "As large a market as exists in this universe.",
      ),
      commercialReadiness: fa(
        2,
        "judgment",
        "Three paid pilots, one at several hundred units, no volume commitment.",
        "Past prototype, well short of repeatable.",
      ),
      customerEvidence: fa(
        2,
        "judgment",
        "Paid pilots with sophisticated buyers, none converted to committed volume.",
        "Encouraging but not yet demand.",
      ),
      teamCredibility: fa(
        4,
        "judgment",
        "Silicon leadership from established accelerator programmes, with a compiler team assembled more recently.",
        "Strong on silicon, less established on the part that decides the outcome.",
      ),
      capitalEfficiency: fa(
        1,
        "judgment",
        "Three hundred and ten million dollars consumed for pilot-stage revenue.",
        "Very low, characteristic of accelerator development but low nonetheless.",
      ),
      competitiveIntensity: fa(
        1,
        "judgment",
        "Competing against the incumbent, hyperscaler custom silicon, and several funded startups simultaneously.",
        "The most crowded competitive field in this universe.",
      ),
      technicalRisk: fa(
        2,
        "judgment",
        "Silicon works. Compiler coverage of future model architectures is unresolved and structurally unpredictable.",
        "High, concentrated in software rather than hardware.",
      ),
      regulatoryRisk: fa(
        3,
        "judgment",
        "Export controls restrict some markets.",
        "Moderate.",
      ),
      financingRisk: fa(
        1,
        "judgment",
        "A large tape-out must be funded before pilot conversion is known, on top of a substantial preference stack.",
        "High on both the funding requirement and the return profile.",
      ),
      overlooked: fa(
        2,
        "judgment",
        "Inference silicon is a well-covered category with many funded entrants.",
        "Not overlooked.",
      ),
    },
  },

  /* ---------------------------------------------------------------- Anvil Grid */
  {
    id: "anvil-grid",
    name: "Anvil Grid",
    isDemonstration: true,
    marketType: "Private",
    hq: "Denver, Colorado",
    region: "North America",
    foundedYear: 2022,
    sector: "Energy & Advanced Materials",
    subsector: "Behind-the-meter power orchestration",
    stage: "Series A",
    description:
      "Software and control hardware that lets a data centre operate across on-site generation, storage, and grid supply, so that a facility can be energised before its full grid interconnection is granted.",
    businessModel:
      "Annual software licence per megawatt under management, plus a control hardware component sold at low margin to secure the software position.",
    primaryCustomer:
      "Data centre developers and colocation operators building in regions with multi-year interconnection queues.",
    technicalDifferentiation:
      "Control logic that satisfies utility interconnection requirements while switching between sources fast enough to hold a data centre load, which is a regulatory problem as much as an engineering one.",
    tractionSignal: demo(
      "Four sites under management, with a fifth contracted. The two earliest sites have operated through a full year including summer peak conditions.",
      D,
      "Illustrative traction on a fictional company.",
    ),
    keyCatalyst:
      "Whether utilities continue to accept the control approach as interconnection standards are revised.",
    investmentRisk:
      "The market exists because interconnection queues are long, and utilities are actively working to shorten them.",
    technicalRisk:
      "A control failure during a source transition would take a data centre offline, which is the outcome the entire product exists to prevent.",
    competitiveThreat:
      "Large power equipment vendors bundling comparable control software with their hardware at no separate charge.",
    capitalIntensity: "Moderate",
    commercialReadiness: "Early Deployment",
    lastReviewed: "2026-07-22",
    sourceIds: [],
    financials: {
      kind: "private",
      stage: "Series A",
      capitalRaised: demo(24_000_000, D, "Illustrative total raised."),
      latestRound: demo("Series A, closed in mid 2025", D),
      capitalIntensity: "Moderate",
      futureFinancingNeed:
        "One further round to fund sales expansion into additional utility territories, each of which requires separate regulatory work.",
      ownershipConsiderations:
        "Clean capital structure with a single institutional lead and substantial founder ownership retained.",
      financingRisk:
        "Moderate. Revenue is contracted and recurring, though the customer count is small enough that one loss would be visible.",
    },
    technology: {
      howItWorks:
        "A controller monitors grid conditions, on-site generation, and storage state, then dispatches across them to hold the facility load within its interconnection limits while meeting utility protection requirements.",
      coreAdvantage:
        "The approach has been accepted by utilities in three territories, which is a slow, unglamorous asset that competitors cannot acquire quickly.",
      supportingEvidence: [
        {
          claim:
            "Approved for interconnection in three utility territories.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Two sites have operated through a full year including summer peak conditions.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      benchmarks:
        "Transition time between sources and uptime across the installed base are the operative measures. The installed base is small enough that the uptime figure is not yet statistically meaningful.",
      intellectualProperty:
        "Two patents on the control approach. The regulatory approvals are the more valuable asset and are not intellectual property in the ordinary sense.",
      thirdPartyDependency:
        "Generation and storage equipment from third parties, and utility cooperation in every new territory.",
      milestoneForScale:
        "Approval in a fourth and fifth utility territory, which would demonstrate that the regulatory work is repeatable rather than relationship-specific.",
      failurePoints: [
        "A control failure during a source transition taking a facility offline",
        "Interconnection standards revised in a way that invalidates the control approach",
        "Interconnection queues shortening, which removes the reason to buy",
      ],
    },
    market: {
      painPoint:
        "Data centre developers can obtain equipment faster than grid capacity. A facility that cannot be energised is worth nothing regardless of what is installed in it.",
      structure:
        "Concentrated among developers and operators, with utilities as the decisive third party in every transaction.",
      adoptionDrivers: [
        "Interconnection queues extending to several years in the most active regions",
        "On-site generation and storage costs falling",
        "Developers holding equipment orders that cannot be deployed",
      ],
      whyNow:
        "The constraint on data centre deployment has moved decisively to power availability, which created this category within roughly two years.",
      competitors: [
        "Power equipment vendors bundling control software",
        "Engineering firms building bespoke control systems",
        "Utility-offered flexible interconnection programmes",
      ],
      substitutes: [
        "Waiting in the interconnection queue",
        "Siting facilities where grid capacity already exists",
      ],
      regulatoryEnvironment:
        "Utility interconnection standards govern the product directly. Each territory is a separate approval process, which is both the barrier and the moat.",
      maturity: "Emerging",
    },
    commercial: {
      pricingModel:
        "Annual licence per megawatt under management, with control hardware sold near cost.",
      salesMotion:
        "Direct sales to developers, with a parallel regulatory engagement with the utility that often takes longer than the commercial negotiation.",
      customerType:
        "Data centre developers and colocation operators.",
      adoptionEvidence: [
        {
          claim: "Four sites under management with a fifth contracted.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Licence revenue is recurring and contracted on multi-year terms.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      implementationBurden:
        "Utility approval dominates the timeline. The software installation itself is straightforward by comparison.",
      expansionOpportunity:
        "Additional megawatts at existing sites, and new utility territories that open new addressable regions.",
      goToMarketRisk:
        "Every new territory requires regulatory work that cannot be accelerated by spending more on sales.",
    },
    investment: {
      thesis:
        "A software business whose real asset is a set of utility approvals, addressing a constraint that is severe today, with the central question being how long that constraint persists.",
      bullCase:
        "Interconnection queues stay long, approvals accumulate across territories, and the company becomes the standard control layer for behind-the-meter data centre power.",
      baseCase:
        "Steady growth in the regions where queues are worst, with a solid recurring revenue base and a moderate outcome.",
      bearCase:
        "Utilities shorten queues or offer their own flexible interconnection programmes, and the product loses its reason to exist.",
      catalysts: [
        "Approval in a fourth utility territory",
        "A full year of uptime data across the installed base",
        "Renewal of the earliest multi-year contracts",
      ],
      risks: [
        "Interconnection queues shortening",
        "Control failure risk",
        "Equipment vendors bundling comparable software",
      ],
      invalidators: [
        "A utility launching a flexible interconnection programme that removes the need for third-party control",
        "A control failure causing a customer outage",
      ],
      recommendedNextStep:
        "Speak to a utility engineer in one approved territory about how they view the approach and whether pending standard revisions would affect it.",
    },
    diligence: {
      technology: [
        "What is the measured transition time between sources, and what happens on a failure during transition?",
      ],
      product: [
        "How much of the deployment timeline is regulatory approval rather than installation?",
      ],
      customers: [
        "Have the earliest customers renewed, and did they expand megawatts under management?",
      ],
      competition: [
        "Where has a power equipment vendor bundled comparable control software, and how did that affect the deal?",
      ],
      unitEconomics: [
        "What is the licence revenue per megawatt, and what does it cost to support a site annually?",
      ],
      capitalRequirements: [
        "What does regulatory approval cost per new utility territory, in time and in money?",
      ],
      regulation: [
        "What interconnection standard revisions are pending in the approved territories, and how would they affect the approach?",
      ],
      team: [
        "Who on the team has worked inside a utility, and how did the first approval actually happen?",
      ],
      financing: [
        "How many territories does the current plan fund, and what is the payback period per territory?",
      ],
      commercialization: [
        "How long from first developer conversation to energised site, and how has that shortened?",
      ],
    },
    outreach:
      "Hi, I have been reading about the behind-the-meter control work, and the detail that stayed with me is that utility approval takes longer than the commercial negotiation in every deal. That inverts how most people describe this market. I focus on early-stage energy and infrastructure companies. I would like to understand how repeatable the approval process has been across the three territories, and what the pending standard revisions would mean. Would you be open to a short call?",
    factors: {
      differentiation: fa(
        3,
        "judgment",
        "Control logic accepted by utilities in three territories, which is a regulatory achievement more than a technical one.",
        "Modest technically, meaningful practically.",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Utility approvals take years to obtain and cannot be bought.",
        "Stronger than the patent position suggests, because the real barrier is regulatory time.",
      ),
      marketPotential: fa(
        3,
        "judgment",
        "Large in the regions with the worst queues, and structurally temporary if queues shorten.",
        "Rated down for the possibility that the constraint resolves.",
      ),
      commercialReadiness: fa(
        3,
        "judgment",
        "Four sites under management, contracted recurring revenue, small absolute base.",
        "Commercial at small scale.",
      ),
      customerEvidence: fa(
        3,
        "judgment",
        "Contracted multi-year revenue with a fifth site signed.",
        "Real, at a customer count small enough that concentration matters.",
      ),
      teamCredibility: fa(
        4,
        "judgment",
        "Founders came from utility interconnection engineering, which is exactly the required background.",
        "Unusually well matched to the actual bottleneck.",
      ),
      capitalEfficiency: fa(
        4,
        "judgment",
        "Four operating sites and three regulatory approvals on twenty four million dollars.",
        "Efficient for an infrastructure business.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Equipment vendors could bundle, but none has completed the regulatory work.",
        "Currently favourable, with a credible bundling threat.",
      ),
      technicalRisk: fa(
        3,
        "judgment",
        "Systems have operated through a full year including peak conditions, with tail risk on transition failures.",
        "Moderate, with severe consequences in the tail.",
      ),
      regulatoryRisk: fa(
        2,
        "judgment",
        "The product exists inside a regulatory framework that is actively being revised.",
        "High, and the same regulation that creates the moat creates the risk.",
      ),
      financingRisk: fa(
        4,
        "judgment",
        "Recurring contracted revenue with modest burn and a clean capital structure.",
        "Comparatively low.",
      ),
      overlooked: fa(
        5,
        "judgment",
        "Almost all attention in AI infrastructure goes to compute rather than to whether a facility can be energised at all.",
        "The most genuinely overlooked position in this universe.",
      ),
    },
  },

  /* ------------------------------------------------------- Wrenfield Robotics */
  {
    id: "wrenfield-robotics",
    name: "Wrenfield Robotics",
    isDemonstration: true,
    marketType: "Private",
    hq: "Zurich, Switzerland",
    region: "Europe",
    foundedYear: 2022,
    sector: "Robotics & Autonomy",
    subsector: "Contact-rich industrial manipulation",
    stage: "Series A",
    description:
      "Manipulation systems for assembly tasks requiring force control, such as seating connectors and threading fasteners, where position-controlled industrial robots have historically failed.",
    businessModel:
      "Robot cells sold with an annual software subscription covering skill updates, sold per production line rather than per robot.",
    primaryCustomer:
      "Tier one automotive and electronics manufacturers running mixed-model assembly lines.",
    technicalDifferentiation:
      "Force-controlled manipulation policies trained in simulation and adapted on the line, which tolerate the part variation that defeats position-controlled automation.",
    tractionSignal: demo(
      "Two paid pilots on production lines, one of which has run for eleven months across full shifts rather than in demonstration conditions.",
      D,
      "Illustrative traction on a fictional company.",
    ),
    keyCatalyst:
      "Whether the eleven-month pilot converts to a multi-line order, which would demonstrate the economics work outside a single favourable cell.",
    investmentRisk:
      "Manufacturing customers move slowly and buy in small increments, so revenue growth is structurally gradual regardless of product quality.",
    technicalRisk:
      "Cycle time is currently slower than a human operator on the same task, and the economics depend on closing that gap.",
    competitiveThreat:
      "Established industrial robot manufacturers adding force control, and well-funded general-purpose robotics companies.",
    capitalIntensity: "High",
    commercialReadiness: "Prototype",
    lastReviewed: "2026-07-21",
    sourceIds: [],
    financials: {
      kind: "private",
      stage: "Series A",
      capitalRaised: demo(31_000_000, D, "Illustrative total raised."),
      latestRound: demo("Series A, closed in early 2026", D),
      capitalIntensity: "High",
      futureFinancingNeed:
        "A further round is required to fund manufacturing capacity ahead of any multi-line order.",
      ownershipConsiderations:
        "Two institutional investors with standard terms, and a university technology transfer office holding a small equity position.",
      financingRisk:
        "Moderate to high. Revenue is pilot-stage and manufacturing investment must precede orders.",
    },
    technology: {
      howItWorks:
        "Policies are trained in simulation against randomised part tolerances, then fine-tuned on the production line using force feedback from the end effector rather than from vision alone.",
      coreAdvantage:
        "Tolerating part variation. Position-controlled robots require parts to arrive in the same place every time, which mixed-model assembly does not provide.",
      supportingEvidence: [
        {
          claim:
            "One pilot has run for eleven months across full production shifts.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Published success rates include the failure modes and the recovery times.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      benchmarks:
        "Success rate and cycle time are reported per task. Cycle time remains slower than a skilled human operator, which the company states directly.",
      intellectualProperty:
        "Four patents on the force control approach, with foundational work licensed from a university.",
      thirdPartyDependency:
        "Robot arms and force sensors sourced from third parties, so the company controls the software and the end effector but not the platform.",
      milestoneForScale:
        "Cycle time parity with a human operator on a representative task, which is the threshold at which the purchasing decision becomes straightforward.",
      failurePoints: [
        "Cycle time failing to reach parity, leaving the economics marginal",
        "Skill transfer between tasks proving weaker than pilots suggest, making each deployment bespoke",
        "Industrial robot manufacturers adding adequate force control to existing platforms",
      ],
    },
    market: {
      painPoint:
        "Assembly steps requiring feel rather than position have resisted automation for decades, and remain staffed by operators who are increasingly hard to hire.",
      structure:
        "Concentrated among large manufacturers, each with long qualification processes and strong preferences for incumbent suppliers.",
      adoptionDrivers: [
        "Labour availability for repetitive precision assembly work continuing to worsen",
        "Mixed-model production lines increasing part variation",
        "Simulation training reducing the cost of teaching a new task",
      ],
      whyNow:
        "Simulation and force control have improved enough that these tasks are approachable, having been out of reach for a long time.",
      competitors: [
        "Established industrial robot manufacturers",
        "General-purpose humanoid robotics companies",
        "Systems integrators building bespoke fixtures",
      ],
      substitutes: [
        "Human operators",
        "Redesigning the product so the difficult assembly step is unnecessary",
      ],
      regulatoryEnvironment:
        "Machinery safety standards apply to any system operating near people, and certification is required per deployment configuration.",
      maturity: "Emerging",
    },
    commercial: {
      pricingModel:
        "Cell price plus annual software subscription, quoted against the fully loaded cost of the operators displaced.",
      salesMotion:
        "Long industrial sales cycles beginning with an engineering evaluation and progressing through a paid pilot.",
      customerType:
        "Manufacturing engineering teams at tier one suppliers.",
      adoptionEvidence: [
        {
          claim: "Two paid pilots on production lines.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "The eleven-month pilot has not yet converted to a multi-line order.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      implementationBurden:
        "Substantial. Each new task requires simulation setup and on-line tuning, which is currently measured in weeks.",
      expansionOpportunity:
        "Additional tasks within the same customer, where the second deployment should be considerably faster than the first.",
      goToMarketRisk:
        "Manufacturing buyers expand slowly and expect a supplier to still exist in ten years, which disadvantages a Series A company.",
    },
    investment: {
      thesis:
        "A credible technical approach to a category of assembly work that has resisted automation for decades, held back by cycle time economics that are close but not yet compelling.",
      bullCase:
        "Cycle time reaches parity, the pilot converts to multiple lines, and skill transfer makes each subsequent deployment materially cheaper.",
      baseCase:
        "Steady pilot-to-production conversion at a small number of customers, with a moderate outcome over a long period.",
      bearCase:
        "Cycle time stalls short of parity, each deployment stays bespoke, and an incumbent adds adequate force control to a platform customers already own.",
      catalysts: [
        "Cycle time parity on a representative task",
        "Conversion of the eleven-month pilot to a multi-line order",
        "Evidence that the second task at a customer deploys faster than the first",
      ],
      risks: [
        "Cycle time economics",
        "Bespoke deployment cost per task",
        "Incumbent platform response",
      ],
      invalidators: [
        "The eleven-month pilot ending without a production order",
        "Second-task deployment time failing to improve on the first",
      ],
      recommendedNextStep:
        "Ask for the deployment time on the second task at the same customer compared with the first, since that ratio determines whether this is a product or a consultancy.",
    },
    diligence: {
      technology: [
        "What is the current cycle time relative to a skilled operator, and what is the specific engineering path to parity?",
      ],
      product: [
        "How long did the second task at an existing customer take to deploy compared with the first?",
      ],
      customers: [
        "What has prevented the eleven-month pilot from converting to a production order?",
      ],
      competition: [
        "What force control capability do the incumbent robot platforms offer today, and how close is it?",
      ],
      unitEconomics: [
        "What is the gross margin per cell, and how much engineering time is currently loaded into each deployment?",
      ],
      capitalRequirements: [
        "What manufacturing investment is required before a multi-line order can be fulfilled?",
      ],
      regulation: [
        "What machinery safety certification is required per configuration, and how long does it take?",
      ],
      team: [
        "Who has taken an industrial automation product from pilot to volume deployment before?",
      ],
      financing: [
        "How long is the runway, and does it extend past the pilot conversion decision?",
      ],
      commercialization: [
        "What is the typical time from first engineering conversation to paid pilot, and from pilot to order?",
      ],
    },
    outreach:
      "Hi, I watched the connector seating demonstration, including the failures you left in and the recovery times published alongside the success rate. Leaving those in is the reason I am writing rather than the success rate itself. I focus on early-stage robotics and physical systems. I would like to understand where cycle time sits against a skilled operator now, and how much faster the second task at a customer deployed than the first. Would you be open to a conversation?",
    factors: {
      differentiation: fa(
        4,
        "judgment",
        "Force-controlled manipulation tolerating part variation that defeats position-controlled systems.",
        "A genuine capability difference rather than an incremental improvement.",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Four patents plus accumulated task data, against incumbents who own the robot platforms.",
        "Moderate. Controlling software but not the platform is a structural weakness.",
      ),
      marketPotential: fa(
        4,
        "judgment",
        "Contact-rich assembly is widespread across manufacturing and largely unautomated.",
        "Large, though adoption is slow by the nature of the buyer.",
      ),
      commercialReadiness: fa(
        2,
        "judgment",
        "Two paid pilots, no production order.",
        "Prototype stage with real production exposure.",
      ),
      customerEvidence: fa(
        3,
        "judgment",
        "An eleven-month pilot across full shifts is meaningful evidence, though it has not converted.",
        "Duration under real conditions counts for a great deal at this stage.",
      ),
      teamCredibility: fa(
        4,
        "judgment",
        "Robotics research team from a leading university group with strong publications in manipulation.",
        "Technically excellent, commercially unproven.",
      ),
      capitalEfficiency: fa(
        3,
        "judgment",
        "Thirty one million dollars to reach two production pilots.",
        "Reasonable for hardware robotics.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Incumbent robot manufacturers and heavily funded general-purpose robotics companies both active.",
        "Crowded and well capitalised on both sides.",
      ),
      technicalRisk: fa(
        3,
        "judgment",
        "Systems work in production, with cycle time short of the level that makes the economics compelling.",
        "Moderate, with a clearly identified gap.",
      ),
      regulatoryRisk: fa(
        4,
        "judgment",
        "Machinery safety standards are well established and routinely met.",
        "Low and predictable.",
      ),
      financingRisk: fa(
        2,
        "judgment",
        "Manufacturing investment must precede orders, at pilot-stage revenue.",
        "Meaningful, with the timing working against the company.",
      ),
      overlooked: fa(
        4,
        "judgment",
        "Attention in robotics has concentrated on humanoids and warehouses rather than on precision assembly.",
        "Genuinely under-examined relative to the size of the task category.",
      ),
    },
  },

  /* ------------------------------------------------------- Tidewater Autonomy */
  {
    id: "tidewater-autonomy",
    name: "Tidewater Autonomy",
    isDemonstration: true,
    marketType: "Private",
    hq: "Gothenburg, Sweden",
    region: "Europe",
    foundedYear: 2019,
    sector: "Robotics & Autonomy",
    subsector: "Retrofit marine autonomy",
    stage: "Series B",
    description:
      "Retrofit autonomy for existing commercial vessels, focused on collision avoidance and passage optimisation rather than on removing the crew, which keeps the regulatory path far shorter.",
    businessModel:
      "Hardware retrofit plus annual per-vessel software subscription, sold to fleet operators rather than to shipbuilders.",
    primaryCustomer:
      "Short-sea shipping operators and coastal freight fleets in European waters.",
    technicalDifferentiation:
      "Sensor fusion tuned for sea state and poor visibility, validated against a large corpus of recorded bridge data from the operators themselves.",
    tractionSignal: demo(
      "Thirty one vessels under subscription across five operators, with the first installations having completed two full years of operation.",
      D,
      "Illustrative traction on a fictional company.",
    ),
    keyCatalyst:
      "Certification progress toward higher autonomy levels, which would expand what the product is permitted to do without a watchkeeper present.",
    investmentRisk:
      "Maritime regulation for autonomous operation is developing slowly and unevenly across jurisdictions.",
    technicalRisk:
      "Performance in heavy weather and poor visibility is where the system is least validated and where failure matters most.",
    competitiveThreat:
      "Marine electronics incumbents with existing fleet relationships and established certification experience.",
    capitalIntensity: "High",
    commercialReadiness: "Scaling",
    lastReviewed: "2026-07-19",
    sourceIds: [],
    financials: {
      kind: "private",
      stage: "Series B",
      capitalRaised: demo(67_000_000, D, "Illustrative total raised."),
      latestRound: demo("Series B, closed in late 2024", D),
      capitalIntensity: "High",
      futureFinancingNeed:
        "One further round to fund certification work and expansion beyond European waters.",
      ownershipConsiderations:
        "A shipping operator holds a strategic stake, which secures a reference customer and narrows the eventual buyer list.",
      financingRisk:
        "Moderate. Subscription revenue is recurring and growing, though certification spending is substantial and its timing is not controlled by the company.",
    },
    technology: {
      howItWorks:
        "Radar, camera, and automatic identification system data are fused into a single situational picture, which drives collision avoidance recommendations and passage optimisation with a watchkeeper retained on the bridge.",
      coreAdvantage:
        "Validation against a large corpus of real bridge data, including the poor visibility conditions that synthetic data does not represent well.",
      supportingEvidence: [
        {
          claim:
            "Thirty one vessels under subscription across five operators.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Two years of continuous operation on the earliest installations.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      benchmarks:
        "Collision avoidance recommendation accuracy is measured against recorded outcomes. Heavy weather performance is the least validated condition and is disclosed as such.",
      intellectualProperty:
        "Seven patents on sensor fusion, plus the recorded bridge data corpus, which is the genuinely scarce asset.",
      thirdPartyDependency:
        "Marine sensors from established suppliers, and classification society cooperation for certification.",
      milestoneForScale:
        "Certification for reduced watchkeeping, which would change the value proposition from an efficiency tool to a crewing decision.",
      failurePoints: [
        "Heavy weather performance falling short in an incident that attracts regulatory attention",
        "Certification for higher autonomy levels taking substantially longer than planned",
        "Marine electronics incumbents bundling comparable capability into equipment fleets already own",
      ],
    },
    market: {
      painPoint:
        "Coastal and short-sea operators face crew shortages, tight fuel margins, and a collision risk profile that has not improved much in decades.",
      structure:
        "Fragmented ownership with strong classification society influence and slow purchasing cycles.",
      adoptionDrivers: [
        "Crew availability worsening across European short-sea shipping",
        "Fuel efficiency gains from passage optimisation being directly measurable",
        "Insurance incentives for demonstrable collision risk reduction",
      ],
      whyNow:
        "Sensor costs have fallen far enough that retrofit is economic on vessels that will never justify a newbuild replacement.",
      competitors: [
        "Marine electronics incumbents",
        "Newbuild autonomous vessel programmes",
        "Classification society advisory services",
      ],
      substitutes: [
        "Existing bridge equipment and crew practice",
        "Waiting for autonomous newbuilds",
      ],
      regulatoryEnvironment:
        "Maritime autonomy regulation is developing through international bodies and classification societies, unevenly across jurisdictions. This governs the pace of the entire market.",
      maturity: "Emerging",
    },
    commercial: {
      pricingModel:
        "Retrofit hardware at installation plus annual per-vessel subscription.",
      salesMotion:
        "Fleet-level sales, typically beginning with a small number of vessels and expanding after a season of operation.",
      customerType:
        "Fleet technical managers and operations directors.",
      adoptionEvidence: [
        {
          claim:
            "Five operators, with expansion beyond initial vessels at four of them.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Subscription renewals have held across the installed base.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      implementationBurden:
        "Retrofit is performed during scheduled maintenance, so deployment timing is bound to the docking schedule.",
      expansionOpportunity:
        "Fleet-wide expansion at existing operators, and geographic expansion once certification transfers.",
      goToMarketRisk:
        "Purchasing decisions are slow and heavily influenced by classification societies rather than by the operator alone.",
    },
    investment: {
      thesis:
        "A retrofit-first approach that generates revenue today inside the existing regulatory framework, while accumulating the operational data that a higher autonomy certification would require.",
      bullCase:
        "Certification for reduced watchkeeping arrives, the value proposition shifts from efficiency to crewing cost, and the installed base converts at much higher revenue per vessel.",
      baseCase:
        "Steady fleet expansion on the efficiency case alone, producing a good but unspectacular subscription business.",
      bearCase:
        "Certification stalls, incumbents bundle comparable capability, and the product remains a modest efficiency tool.",
      catalysts: [
        "Classification society certification milestones",
        "Fleet-wide expansion at an existing operator",
        "Heavy weather validation data",
      ],
      risks: [
        "Regulatory pace outside the company's control",
        "Heavy weather performance",
        "Incumbent bundling",
      ],
      invalidators: [
        "An incident attributed to the system in poor visibility",
        "Certification timelines extending by more than two years",
      ],
      recommendedNextStep:
        "Review the heavy weather validation data directly, since that is both the least validated condition and the one that would attract regulatory attention after an incident.",
    },
    diligence: {
      technology: [
        "What does recommendation accuracy look like specifically in heavy weather and poor visibility, separated from the overall figure?",
      ],
      product: [
        "How much of the measured fuel saving is attributable to passage optimisation rather than to crew behaviour change?",
      ],
      customers: [
        "Which operators have expanded beyond their initial vessels, and what triggered the expansion?",
      ],
      competition: [
        "What comparable capability do the marine electronics incumbents offer, and at what price?",
      ],
      unitEconomics: [
        "What is the installed cost per vessel against the annual subscription, and what is the payback period?",
      ],
      capitalRequirements: [
        "What does certification for reduced watchkeeping cost, and over what timeline?",
      ],
      regulation: [
        "Which classification societies have engaged, and what is the realistic path to higher autonomy levels?",
      ],
      team: [
        "Who has taken a maritime product through classification society certification before?",
      ],
      financing: [
        "How much of the next round is certification spending rather than commercial expansion?",
      ],
      commercialization: [
        "What is the expansion rate from first vessel to fleet-wide, and how long does it take?",
      ],
    },
    outreach:
      "Hi, I have been following the retrofit approach, and the decision to target collision avoidance with a watchkeeper retained rather than to chase crewless operation is the part that made me want to reach out. It is a much harder thing to be disciplined about than to describe. I focus on early-stage autonomy companies. I would like to understand what the heavy weather validation data shows, and how the certification conversations with classification societies are progressing. Would you have twenty minutes?",
    factors: {
      differentiation: fa(
        4,
        "judgment",
        "Sensor fusion validated against a large corpus of real bridge data, including poor visibility conditions.",
        "The data corpus is the differentiator and it compounds with the installed base.",
      ),
      defensibility: fa(
        4,
        "judgment",
        "Seven patents plus a proprietary operational data corpus that grows with every vessel.",
        "Genuinely compounding, which is rare in this set.",
      ),
      marketPotential: fa(
        3,
        "judgment",
        "European short-sea shipping is a defined market, with geographic expansion gated by certification.",
        "Solid rather than large, with optionality on wider certification.",
      ),
      commercialReadiness: fa(
        4,
        "judgment",
        "Thirty one vessels under recurring subscription with expansion at four of five operators.",
        "Genuinely commercial and scaling.",
      ),
      customerEvidence: fa(
        4,
        "judgment",
        "Recurring subscription revenue with renewals holding and fleet expansion occurring.",
        "Strong for a company at this stage.",
      ),
      teamCredibility: fa(
        4,
        "judgment",
        "Founders from marine electronics and naval architecture backgrounds.",
        "Well matched to a market where domain credibility gates access.",
      ),
      capitalEfficiency: fa(
        3,
        "judgment",
        "Sixty seven million dollars to reach thirty one vessels under subscription.",
        "Reasonable for hardware plus certification spending.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Marine electronics incumbents are the main threat, and none has moved decisively.",
        "Moderate, with a slow-moving competitive set.",
      ),
      technicalRisk: fa(
        3,
        "judgment",
        "Two years of operation, with heavy weather the least validated condition.",
        "Moderate, concentrated in the conditions that matter most.",
      ),
      regulatoryRisk: fa(
        2,
        "judgment",
        "Higher autonomy levels depend on regulation developing at a pace the company does not control.",
        "High, and the main determinant of the upside case.",
      ),
      financingRisk: fa(
        3,
        "judgment",
        "Recurring revenue base, offset by substantial certification spending with uncertain timing.",
        "Moderate.",
      ),
      overlooked: fa(
        4,
        "judgment",
        "Maritime autonomy receives far less attention than road autonomy despite a clearer near-term economic case.",
        "Under-examined relative to the economics.",
      ),
    },
  },

  /* -------------------------------------------------------- Palisade Quantum */
  {
    id: "palisade-quantum",
    name: "Palisade Quantum",
    isDemonstration: true,
    marketType: "Private",
    hq: "Boulder, Colorado",
    region: "North America",
    foundedYear: 2020,
    sector: "Quantum Technology",
    subsector: "Neutral atom quantum computing",
    stage: "Series B",
    description:
      "Neutral atom quantum computers, pursuing scale through optically trapped atom arrays rather than through fabricated qubits, with revenue currently from research contracts rather than commercial workloads.",
    businessModel:
      "System sales and cloud access to research institutions and national programmes, alongside government research contracts.",
    primaryCustomer:
      "National laboratories, universities, and government quantum programmes.",
    technicalDifferentiation:
      "Atom arrays scale by adding optical trapping capacity rather than by fabricating more physical devices, which changes the cost curve for qubit count.",
    tractionSignal: demo(
      "Two systems delivered to national laboratories and one government research contract. No commercial workload has been demonstrated to outperform classical hardware.",
      D,
      "Illustrative traction on a fictional company. The absence of commercial advantage is the honest state of this entire category.",
    ),
    keyCatalyst:
      "Demonstrating error-corrected logical qubits at a count that makes a commercially relevant algorithm plausible.",
    investmentRisk:
      "The category may not produce commercial value within any investable horizon, and this company is smaller than several competitors.",
    technicalRisk:
      "Atom loss during long computations remains unsolved, and it is the specific problem that most limits this modality.",
    competitiveThreat:
      "Better funded neutral atom competitors, and superconducting programmes inside very large technology companies.",
    capitalIntensity: "Very High",
    commercialReadiness: "Research",
    lastReviewed: "2026-07-18",
    sourceIds: [],
    financials: {
      kind: "private",
      stage: "Series B",
      capitalRaised: demo(120_000_000, D, "Illustrative total raised."),
      latestRound: demo("Series B, closed in mid 2025", D),
      capitalIntensity: "Very High",
      futureFinancingNeed:
        "Continuous funding is required with no path to operating profitability on any near-term plan.",
      ownershipConsiderations:
        "Government research funding alongside institutional equity, which introduces reporting obligations and some constraints on eventual ownership.",
      financingRisk:
        "High. The company depends on continued equity and government funding through a period with no commercial revenue.",
    },
    technology: {
      howItWorks:
        "Neutral atoms are held in optical tweezer arrays and manipulated with lasers. Qubit count scales by expanding the optical system rather than by fabricating additional physical devices.",
      coreAdvantage:
        "Scaling economics. Adding qubits is an optics problem rather than a fabrication problem, which is a genuinely different cost curve from superconducting approaches.",
      supportingEvidence: [
        {
          claim: "Two systems delivered to national laboratories.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Peer-reviewed publications on atom array coherence times.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      benchmarks:
        "Qubit count, coherence time, and gate fidelity are published. None of these translates into a commercial capability claim, and the company does not suggest otherwise.",
      intellectualProperty:
        "Eleven patents on optical trapping and control, with foundational work licensed from a university.",
      thirdPartyDependency:
        "Specialist lasers, optics, and vacuum systems from a small number of suppliers with long lead times.",
      milestoneForScale:
        "Error-corrected logical qubits in sufficient number to run a commercially relevant algorithm. Unmet across the entire category.",
      failurePoints: [
        "Atom loss during long computations limiting usable circuit depth",
        "Error correction overhead proving impractical for this modality",
        "A competing approach reaching useful scale first",
      ],
    },
    market: {
      painPoint:
        "Certain simulation and optimisation problems are intractable classically. Whether quantum hardware solves them at commercially relevant scale is unproven.",
      structure:
        "Government and research buyers almost exclusively. A commercial market does not yet exist.",
      adoptionDrivers: [
        "National quantum programmes funding capability for strategic reasons",
        "Research institutions maintaining access to multiple modalities",
        "Corporate research groups holding an option on the technology",
      ],
      whyNow:
        "Government funding has expanded, which sustains development through a period when commercial demand could not.",
      competitors: [
        "Better funded neutral atom companies",
        "Superconducting programmes at large technology companies",
        "Trapped-ion companies including IonQ",
      ],
      substitutes: [
        "Classical high performance computing",
        "Quantum-inspired classical algorithms",
      ],
      regulatoryEnvironment:
        "Export controls apply to quantum technology, and government procurement rules govern most demand.",
      maturity: "Emerging",
    },
    commercial: {
      pricingModel:
        "System sales to institutions, cloud access priced per unit of machine time, and cost-plus research contracts.",
      salesMotion:
        "Government and institutional procurement on long cycles with political as well as technical drivers.",
      customerType:
        "National laboratories, universities, and government agencies.",
      adoptionEvidence: [
        {
          claim:
            "Two delivered systems and one government research contract.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "No commercial workload has been demonstrated to outperform classical hardware.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      implementationBurden:
        "Very high. Operating the systems productively requires specialist physics expertise.",
      expansionOpportunity:
        "Entirely contingent on technical thresholds that have not been reached by anyone.",
      goToMarketRisk:
        "Demand depends on government funding cycles that respond to policy rather than to product quality.",
    },
    investment: {
      thesis:
        "A research-stage option on a scaling approach with better cost dynamics than competing modalities, at a company smaller and less well funded than the leaders in its own category.",
      bullCase:
        "The scaling advantage proves decisive, error correction progresses, and the company becomes a credible contender in a market that finally develops.",
      baseCase:
        "Continued government-funded research progress, further dilutive rounds, and commercial usefulness remaining distant.",
      bearCase:
        "Atom loss limits circuit depth, a better funded competitor reaches useful scale first, and the capital is not recovered.",
      catalysts: [
        "Logical qubit milestones",
        "National quantum programme awards",
        "Peer-reviewed results on atom loss during long computations",
      ],
      risks: [
        "The category may never become commercially useful",
        "Better funded competitors within the same modality",
        "Continuous financing requirement",
      ],
      invalidators: [
        "A competitor demonstrating error-corrected logical qubits at meaningful scale first",
        "Atom loss proving to impose a hard limit on circuit depth",
      ],
      recommendedNextStep:
        "Treat any position as a research option rather than as an investment in a business, and track atom loss results rather than qubit count.",
    },
    diligence: {
      technology: [
        "What is the measured atom loss rate during long computations, and how does it compare with published results from competitors?",
      ],
      product: [
        "What can the delivered systems actually do that classical hardware cannot?",
      ],
      customers: [
        "What proportion of revenue is government funded, and how durable is that funding?",
      ],
      competition: [
        "On the metrics that matter for error correction, where does this company rank within neutral atom approaches?",
      ],
      unitEconomics: [
        "What does it cost to build and operate a system, and what would a commercial price need to be?",
      ],
      capitalRequirements: [
        "How much capital is required to reach the next roadmap milestone?",
      ],
      regulation: [
        "How do export controls affect the addressable customer base?",
      ],
      team: [
        "How does the scientific team compare with competing groups by publication record?",
      ],
      financing: [
        "What is the runway, and what dilution does the roadmap imply?",
      ],
      commercialization: [
        "What problem is expected to show commercial advantage first, and who would run it?",
      ],
    },
    outreach:
      "Hi, I read the paper on atom loss during extended computations, and the decision to publish the limiting case rather than the best case is what prompted me to write. Most of the material in this category does the opposite. I look at early-stage deep technology companies. I would like to understand how the atom loss results compare with other neutral atom groups, and what the realistic path to error-corrected logical qubits looks like from here. Would you be open to a conversation?",
    factors: {
      differentiation: fa(
        4,
        "judgment",
        "Neutral atom scaling through optics rather than fabrication, a genuinely different cost curve.",
        "Scientifically distinct, in a category where distinctness has not yet produced value.",
      ),
      defensibility: fa(
        2,
        "judgment",
        "Eleven patents in a field where several better funded groups pursue the same modality.",
        "Weak. Pre-commercial deep technology defensibility is largely theoretical.",
      ),
      marketPotential: fa(
        3,
        "judgment",
        "Enormous if the technology works, near zero if it does not.",
        "Rated mid because the outcome distribution is bimodal.",
      ),
      commercialReadiness: fa(
        1,
        "judgment",
        "Research contracts and system sales to laboratories. No commercial workload.",
        "Research stage, stated plainly.",
      ),
      customerEvidence: fa(
        2,
        "judgment",
        "Two delivered systems and a government contract.",
        "Evidence of research interest rather than commercial demand.",
      ),
      teamCredibility: fa(
        4,
        "judgment",
        "Strong academic physics team with a good publication record in atom array control.",
        "Scientifically credible, which is the main asset at this stage.",
      ),
      capitalEfficiency: fa(
        1,
        "judgment",
        "One hundred and twenty million dollars consumed with no commercial revenue.",
        "Low, as the category requires.",
      ),
      competitiveIntensity: fa(
        1,
        "judgment",
        "Better funded competitors within the same modality, plus superconducting programmes at very large companies.",
        "Outspent within its own niche, which is the worst version of this problem.",
      ),
      technicalRisk: fa(
        1,
        "judgment",
        "Atom loss during long computations is unsolved, on top of the unsolved error correction problem shared across the category.",
        "The highest technical risk in the private set.",
      ),
      regulatoryRisk: fa(
        3,
        "judgment",
        "Export controls apply and government procurement drives demand.",
        "Moderate, cutting both ways.",
      ),
      financingRisk: fa(
        1,
        "judgment",
        "Continuous funding requirement with no path to profitability on any near-term plan.",
        "High.",
      ),
      overlooked: fa(
        3,
        "judgment",
        "Quantum computing is heavily covered, though neutral atom approaches receive less attention than superconducting ones.",
        "Moderately under-examined within a widely covered field.",
      ),
    },
  },

  /* -------------------------------------------------------------- Kestrel Bio */
  {
    id: "kestrel-bio",
    name: "Kestrel Bio",
    isDemonstration: true,
    marketType: "Private",
    hq: "Cambridge, Massachusetts",
    region: "North America",
    foundedYear: 2021,
    sector: "Biotechnology & Research Tools",
    subsector: "Laboratory reproducibility infrastructure",
    stage: "Series A",
    description:
      "Instrumentation and software that captures the environmental and procedural conditions of wet-lab experiments automatically, so that a failed replication can be diagnosed rather than merely repeated.",
    businessModel:
      "Instrument sales with a per-seat software subscription, sold to individual laboratories rather than through institutional procurement.",
    primaryCustomer:
      "Academic research laboratories and small biotechnology companies running high volumes of cell-based assays.",
    technicalDifferentiation:
      "Passive capture of conditions that researchers do not record because recording them manually is impractical, combined with a comparison layer that surfaces which variable differed between runs.",
    tractionSignal: demo(
      "Forty seven laboratories on subscription, with expansion beyond a single instrument at nine of them.",
      D,
      "Illustrative traction on a fictional company.",
    ),
    keyCatalyst:
      "Whether a major journal or funder begins to expect this kind of condition capture, which would change adoption from optional to required.",
    investmentRisk:
      "Academic laboratories have small, grant-constrained budgets and slow purchasing cycles.",
    technicalRisk:
      "The value depends on capturing the variables that actually matter, and the set of variables differs by assay type.",
    competitiveThreat:
      "Laboratory instrument incumbents adding condition logging to equipment laboratories already own.",
    capitalIntensity: "Moderate",
    commercialReadiness: "Early Deployment",
    lastReviewed: "2026-07-20",
    sourceIds: [],
    financials: {
      kind: "private",
      stage: "Series A",
      capitalRaised: demo(21_000_000, D, "Illustrative total raised."),
      latestRound: demo("Series A, closed in late 2025", D),
      capitalIntensity: "Moderate",
      futureFinancingNeed:
        "One further round to fund a move from individual laboratory sales into institutional and pharmaceutical accounts.",
      ownershipConsiderations:
        "University technology transfer office holds a royalty interest on the underlying instrumentation patents.",
      financingRisk:
        "Moderate. Revenue is recurring but individually small, so scale depends on a sales motion that has not yet been proven.",
    },
    technology: {
      howItWorks:
        "Sensors on incubators, benches, and instruments record temperature, humidity, vibration, light exposure, reagent lot, and timing without researcher input. A comparison layer aligns runs and highlights which captured variable differed.",
      coreAdvantage:
        "Capturing what researchers cannot practically record by hand, which is precisely the set of variables most likely to explain an unexplained replication failure.",
      supportingEvidence: [
        {
          claim:
            "Forty seven laboratories on paid subscription.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Published case studies where a captured variable explained a replication failure.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      benchmarks:
        "The operative measure is the proportion of replication failures that the system can attribute to a captured variable. Current figures are drawn from self-selected case studies rather than from a controlled study.",
      intellectualProperty:
        "Three patents on the sensor integration, licensed from a university with a royalty attached.",
      thirdPartyDependency:
        "Sensor components and integration with third-party laboratory instruments, several of which expose limited data interfaces.",
      milestoneForScale:
        "An institutional purchase covering an entire department, which would demonstrate the product can be sold above the individual laboratory level.",
      failurePoints: [
        "The captured variable set not covering the variables that matter for a given assay type",
        "Instrument incumbents adding adequate logging to equipment already installed",
        "Academic budget cycles limiting the achievable price point",
      ],
    },
    market: {
      painPoint:
        "A large share of published biological results do not replicate cleanly, and when replication fails the reason is usually undiscoverable because the conditions were never recorded.",
      structure:
        "Highly fragmented. Thousands of individual laboratories with independent budgets, plus institutional and pharmaceutical buyers with different procurement processes entirely.",
      adoptionDrivers: [
        "Funder and journal attention to reproducibility increasing",
        "Sensor and storage costs falling to the point where passive capture is affordable",
        "Growing use of automated liquid handling that produces machine-readable process data",
      ],
      whyNow:
        "The cost of capturing everything has fallen below the cost of deciding what to capture, which reverses the historical constraint.",
      competitors: [
        "Electronic laboratory notebook vendors",
        "Laboratory instrument incumbents",
        "Laboratory information management system providers",
      ],
      substitutes: [
        "Manual record keeping",
        "Accepting unexplained replication failures",
      ],
      regulatoryEnvironment:
        "Research use only, so no direct product regulation. Regulated laboratories impose data integrity requirements that the product must satisfy.",
      maturity: "Emerging",
    },
    commercial: {
      pricingModel:
        "Instrument purchase plus annual per-seat software subscription.",
      salesMotion:
        "Direct sales to individual principal investigators, largely inbound following conference presentations and publications.",
      customerType:
        "Academic principal investigators and small biotechnology research teams.",
      adoptionEvidence: [
        {
          claim:
            "Nine laboratories have expanded beyond their first instrument.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Subscription renewal has held across the installed base to date.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      implementationBurden:
        "Low by design. Installation is intended to require no change to existing protocols, which is the main reason adoption has been possible at all.",
      expansionOpportunity:
        "Institutional and pharmaceutical accounts, where budgets are larger and reproducibility has direct financial consequences.",
      goToMarketRisk:
        "Selling one laboratory at a time does not scale, and the institutional motion is unproven.",
    },
    investment: {
      thesis:
        "A well-designed answer to a genuine and widely acknowledged problem, adopted by laboratories that chose it themselves, with the open question being whether it can be sold above the individual laboratory level.",
      bullCase:
        "Funders or journals begin expecting condition capture, institutional purchases follow, and the company becomes standard research infrastructure.",
      baseCase:
        "Steady laboratory-by-laboratory growth producing a good small business without an obvious path to scale.",
      bearCase:
        "Instrument incumbents add adequate logging, and academic budgets never support the price required to build a large company.",
      catalysts: [
        "A department-wide institutional purchase",
        "A funder or journal expectation around condition capture",
        "A controlled study on attribution of replication failures",
      ],
      risks: [
        "Academic budget constraints",
        "Instrument incumbent response",
        "Unproven institutional sales motion",
      ],
      invalidators: [
        "No institutional purchase within twelve months",
        "A major instrument vendor shipping comparable logging as standard",
      ],
      recommendedNextStep:
        "Ask what has stopped the nine expanding laboratories from becoming a departmental purchase, since that gap defines the ceiling.",
    },
    diligence: {
      technology: [
        "Which variables are captured, and how was that set chosen for each assay type?",
      ],
      product: [
        "In what proportion of investigated replication failures did a captured variable explain the result?",
      ],
      customers: [
        "Of the forty seven laboratories, how many would say the product changed a research decision?",
      ],
      competition: [
        "What condition logging do the major instrument vendors already provide?",
      ],
      unitEconomics: [
        "What is the instrument margin against the subscription revenue, and what is the payback per laboratory?",
      ],
      capitalRequirements: [
        "What does building an institutional sales motion cost, and how long does it take?",
      ],
      regulation: [
        "What data integrity requirements apply in regulated laboratory environments?",
      ],
      team: [
        "Who has sold research instrumentation into institutional accounts before?",
      ],
      financing: [
        "What does the current plan fund, and what evidence is needed for the next round?",
      ],
      commercialization: [
        "What is the conversion rate from conference contact to paid subscription?",
      ],
    },
    outreach:
      "Hi, I read the case study where a vibration signature from a nearby centrifuge explained a replication failure that had been attributed to reagent variability for months. That is a better argument for the product than any feature list. I spend most of my time on early-stage research tools. I would like to understand what has kept the expanding laboratories from becoming a departmental purchase, and how the captured variable set was chosen. Would you be open to a call?",
    factors: {
      differentiation: fa(
        4,
        "judgment",
        "Passive capture of variables researchers cannot practically record by hand, plus a comparison layer.",
        "A real insight about where the information gap actually sits.",
      ),
      defensibility: fa(
        2,
        "judgment",
        "Three licensed patents against instrument incumbents who own the equipment already installed.",
        "Weak. The incumbents have a structurally better position if they choose to use it.",
      ),
      marketPotential: fa(
        3,
        "judgment",
        "Thousands of laboratories, most with small budgets, plus larger institutional and pharmaceutical accounts.",
        "Moderate, with the size entirely dependent on moving upmarket.",
      ),
      commercialReadiness: fa(
        3,
        "judgment",
        "Forty seven paying laboratories with expansion at nine.",
        "Genuinely commercial at small unit sizes.",
      ),
      customerEvidence: fa(
        4,
        "judgment",
        "Paid subscriptions with renewals holding and expansion at nine accounts.",
        "Strong evidence of value at the individual laboratory level.",
      ),
      teamCredibility: fa(
        4,
        "judgment",
        "Founders came from bench research and experienced the problem directly.",
        "Well matched to the problem, less proven commercially.",
      ),
      capitalEfficiency: fa(
        4,
        "judgment",
        "Forty seven paying customers on twenty one million dollars.",
        "Efficient for a hardware and software combination.",
      ),
      competitiveIntensity: fa(
        3,
        "judgment",
        "Electronic notebook and instrument vendors are adjacent but none directly addresses passive condition capture.",
        "Currently uncontested in the specific niche.",
      ),
      technicalRisk: fa(
        4,
        "judgment",
        "The system works and is deployed. The risk is coverage of the right variables rather than feasibility.",
        "Low.",
      ),
      regulatoryRisk: fa(
        4,
        "judgment",
        "Research use only, with data integrity requirements in regulated settings.",
        "Low.",
      ),
      financingRisk: fa(
        3,
        "judgment",
        "Recurring revenue at small unit sizes, with the next round dependent on proving an institutional motion.",
        "Moderate.",
      ),
      overlooked: fa(
        4,
        "judgment",
        "Reproducibility infrastructure attracts far less investment attention than drug discovery platforms.",
        "Under-examined relative to how often the problem is discussed.",
      ),
    },
  },

  /* --------------------------------------------------------- Ferrule Photonics */
  {
    id: "ferrule-photonics",
    name: "Ferrule Photonics",
    isDemonstration: true,
    marketType: "Private",
    hq: "Singapore",
    region: "Asia Pacific",
    foundedYear: 2021,
    sector: "Semiconductors",
    subsector: "Photonic packaging and fibre alignment",
    stage: "Series A",
    description:
      "Automated fibre-to-chip alignment equipment for photonic packaging, addressing the assembly step that dominates cost and yield loss in optical components.",
    businessModel:
      "Capital equipment sold to photonic component manufacturers and packaging subcontractors, with recurring revenue from consumables and service.",
    primaryCustomer:
      "Photonic component manufacturers and outsourced assembly and test providers.",
    technicalDifferentiation:
      "Active alignment using a feedback loop that converges faster than the machine vision approaches used in existing equipment, which reduces the time per alignment substantially.",
    tractionSignal: demo(
      "Six systems installed across three customers, with one customer having ordered a second system after six months of production use.",
      D,
      "Illustrative traction on a fictional company.",
    ),
    keyCatalyst:
      "Whether co-packaged optics volumes materialise, since that is the demand scenario the business case depends on.",
    investmentRisk:
      "Demand is derived from a transition to co-packaged optics that has been predicted for longer than it has been delivered.",
    technicalRisk:
      "Alignment tolerance requirements tighten with each generation, and the current advantage may not extend to the next.",
    competitiveThreat:
      "Established semiconductor equipment manufacturers with global service organisations and existing customer relationships.",
    capitalIntensity: "High",
    commercialReadiness: "Early Deployment",
    lastReviewed: "2026-07-19",
    sourceIds: [],
    financials: {
      kind: "private",
      stage: "Series A",
      capitalRaised: demo(29_000_000, D, "Illustrative total raised."),
      latestRound: demo("Series A, closed in early 2025", D),
      capitalIntensity: "High",
      futureFinancingNeed:
        "A further round to fund manufacturing capacity and a service organisation, both required before larger customers will commit.",
      ownershipConsiderations:
        "A regional development fund participates alongside institutional investors, with associated local manufacturing expectations.",
      financingRisk:
        "Moderate to high. Equipment revenue is lumpy and each sale is large relative to total revenue.",
    },
    technology: {
      howItWorks:
        "The system positions an optical fibre against a photonic chip while monitoring coupled optical power, using that signal directly as feedback to converge on the optimal position rather than inferring position from images.",
      coreAdvantage:
        "Time per alignment. In photonic packaging, alignment time dominates assembly cost, so reducing it changes the unit economics of the whole component.",
      supportingEvidence: [
        {
          claim:
            "Six systems installed and in production use across three customers.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "One customer placed a repeat order after six months of production operation.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      benchmarks:
        "Alignment time and coupling efficiency are measured per system. Results vary by chip design, so customer-specific validation is required in every case.",
      intellectualProperty:
        "Five patents on the feedback control approach.",
      thirdPartyDependency:
        "Precision motion stages and optical components from specialist suppliers with long lead times.",
      milestoneForScale:
        "An order from a large outsourced assembly and test provider, which would move the company from serving specialists to serving the volume market.",
      failurePoints: [
        "Co-packaged optics volumes arriving later than the business plan assumes",
        "Alignment tolerance requirements tightening beyond what the current approach supports",
        "Established equipment vendors entering with better service coverage",
      ],
    },
    market: {
      painPoint:
        "Photonic packaging is manual, slow, and yield-limited. It is the reason optical components cost what they do, and everyone in the value chain knows it.",
      structure:
        "A small number of component manufacturers and packaging subcontractors, with purchasing driven by capacity expansion decisions.",
      adoptionDrivers: [
        "Optical interconnect volume growing with data centre buildouts",
        "Co-packaged optics requiring far more alignment operations per unit",
        "Labour cost and availability for skilled manual alignment work",
      ],
      whyNow:
        "Photonic volumes are approaching the point where automation pays back within a normal equipment cycle, which was not true when volumes were lower.",
      competitors: [
        "Established semiconductor packaging equipment manufacturers",
        "In-house automation built by large component manufacturers",
      ],
      substitutes: [
        "Manual alignment by skilled operators",
        "Chip designs that relax alignment tolerance at the cost of optical performance",
      ],
      regulatoryEnvironment:
        "Export controls apply to semiconductor manufacturing equipment, which affects which customers can be served in which jurisdictions.",
      maturity: "Emerging",
    },
    commercial: {
      pricingModel:
        "Capital equipment sale with recurring consumables and annual service contracts.",
      salesMotion:
        "Long technical evaluation with each customer running their own chip designs before purchase.",
      customerType:
        "Manufacturing engineering teams at photonic component manufacturers.",
      adoptionEvidence: [
        {
          claim:
            "A repeat order from one customer after six months of production use.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Three customers in total, with evaluation ongoing at two others.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      implementationBurden:
        "Each customer requires recipe development for their specific chip designs, which currently takes several weeks of application engineering.",
      expansionOpportunity:
        "Additional systems at existing customers, and consumables revenue that grows with installed base utilisation.",
      goToMarketRisk:
        "Capital equipment purchases are deferred first when customers become cautious, which makes revenue highly cycle-sensitive.",
    },
    investment: {
      thesis:
        "Equipment addressing the genuine bottleneck in photonic packaging cost, with early repeat purchase evidence, dependent on a co-packaged optics transition whose timing has repeatedly disappointed.",
      bullCase:
        "Co-packaged optics volumes arrive, a large assembly provider standardises on the equipment, and consumables build a recurring base underneath lumpy equipment sales.",
      baseCase:
        "Gradual adoption among specialist manufacturers, producing a solid equipment business at modest scale.",
      bearCase:
        "The optics transition slips again, and an established equipment vendor takes the volume market when it finally arrives.",
      catalysts: [
        "An order from a large outsourced assembly and test provider",
        "Co-packaged optics production announcements from major vendors",
        "Consumables revenue reaching a meaningful share of the total",
      ],
      risks: [
        "Timing of the co-packaged optics transition",
        "Established equipment vendor competition",
        "Lumpy, cycle-sensitive capital equipment revenue",
      ],
      invalidators: [
        "No new customer within twelve months",
        "A major equipment vendor launching a competitive alignment product",
      ],
      recommendedNextStep:
        "Establish what the repeat-order customer measured over six months of production, since that data is the only evidence the payback case is real.",
    },
    diligence: {
      technology: [
        "How does alignment time compare with existing equipment on the same chip design, measured by the customer rather than by the company?",
      ],
      product: [
        "How long does recipe development take for a new chip design, and is it getting faster?",
      ],
      customers: [
        "What did the repeat-order customer measure over six months that justified a second system?",
      ],
      competition: [
        "What are the established equipment vendors offering, and what is their service coverage in the target regions?",
      ],
      unitEconomics: [
        "What is the gross margin per system, and what does consumables revenue add per installed unit annually?",
      ],
      capitalRequirements: [
        "What manufacturing and service investment is required to support a large assembly provider?",
      ],
      regulation: [
        "What export control restrictions apply to this equipment, and which customers are affected?",
      ],
      team: [
        "Who has built and supported a semiconductor equipment service organisation before?",
      ],
      financing: [
        "How lumpy is revenue quarter to quarter, and how much runway does the plan assume?",
      ],
      commercialization: [
        "What is the time from first evaluation to purchase order, and how many evaluations are active?",
      ],
    },
    outreach:
      "Hi, I have been looking at photonic packaging, and the point that everyone funds photonic chips while almost nobody funds the alignment step that determines their cost is one I have not seen made as directly as you make it. I focus on early-stage deep technology and manufacturing equipment. I would like to understand what the repeat-order customer measured over six months, and how recipe development time has trended across chip designs. Would you be open to a short call?",
    factors: {
      differentiation: fa(
        4,
        "judgment",
        "Feedback-based active alignment converging faster than machine vision approaches.",
        "A real and measurable advantage on the step that dominates cost.",
      ),
      defensibility: fa(
        3,
        "judgment",
        "Five patents plus accumulated recipe knowledge per customer chip design.",
        "Moderate. The recipe library is the more durable asset.",
      ),
      marketPotential: fa(
        3,
        "judgment",
        "Sized by photonic packaging volume, which depends on a transition that has slipped repeatedly.",
        "Rated down for timing risk rather than for structural size.",
      ),
      commercialReadiness: fa(
        3,
        "judgment",
        "Six systems in production use with one repeat order.",
        "Commercial at small scale, with genuine production validation.",
      ),
      customerEvidence: fa(
        3,
        "judgment",
        "A repeat order after six months of production is meaningful at three customers.",
        "Quality of evidence is high, quantity is low.",
      ),
      teamCredibility: fa(
        3,
        "judgment",
        "Photonics and precision motion backgrounds, without prior experience building an equipment service organisation.",
        "Technically capable, with a known gap in the commercial skill set.",
      ),
      capitalEfficiency: fa(
        3,
        "judgment",
        "Six installed systems on twenty nine million dollars.",
        "Reasonable for capital equipment development.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Established semiconductor equipment vendors have far better service coverage and customer access.",
        "Difficult, particularly on service.",
      ),
      technicalRisk: fa(
        4,
        "judgment",
        "Systems work in production. Risk is whether the approach extends to tighter tolerances.",
        "Low near-term.",
      ),
      regulatoryRisk: fa(
        3,
        "judgment",
        "Export controls on semiconductor equipment restrict some customers.",
        "Moderate, relevant given the regional customer base.",
      ),
      financingRisk: fa(
        2,
        "judgment",
        "Lumpy equipment revenue with manufacturing and service investment required ahead of larger orders.",
        "Meaningful, driven by revenue shape rather than by burn.",
      ),
      overlooked: fa(
        5,
        "judgment",
        "Photonic packaging equipment receives almost no venture attention despite gating optical component cost.",
        "Among the most genuinely overlooked positions in this universe.",
      ),
    },
  },

  /* ------------------------------------------------------------- Ravelin Data */
  {
    id: "ravelin-data",
    name: "Ravelin Data",
    isDemonstration: true,
    marketType: "Private",
    hq: "Toronto, Ontario",
    region: "North America",
    foundedYear: 2022,
    sector: "Enterprise Software",
    subsector: "Data lineage and pipeline observability",
    stage: "Series A",
    description:
      "Lineage and drift detection for production data pipelines, built to answer which upstream change caused a downstream model or report to move, rather than simply alerting that it moved.",
    businessModel:
      "Annual subscription priced on the number of pipelines monitored, sold to data platform teams.",
    primaryCustomer:
      "Data platform and analytics engineering teams at mid-market and enterprise software companies.",
    technicalDifferentiation:
      "Column-level lineage inferred from query logs rather than declared in configuration, which means coverage does not depend on teams maintaining documentation they have never maintained.",
    tractionSignal: demo(
      "Sixty two paying customers with net revenue retention above one hundred and ten percent over the past year.",
      D,
      "Illustrative traction on a fictional company.",
    ),
    keyCatalyst:
      "Whether the product holds its position as data warehouse vendors add native lineage features at no additional cost.",
    investmentRisk:
      "The category has several well-funded competitors and a credible threat of absorption by the warehouse platforms.",
    technicalRisk:
      "Lineage inference accuracy degrades on dynamically generated queries, which are common in exactly the complex environments that most need the product.",
    competitiveThreat:
      "Data warehouse vendors bundling native lineage, and better-capitalised observability competitors.",
    capitalIntensity: "Low",
    commercialReadiness: "Scaling",
    lastReviewed: "2026-07-27",
    sourceIds: [],
    financials: {
      kind: "private",
      stage: "Series A",
      capitalRaised: demo(16_000_000, D, "Illustrative total raised."),
      latestRound: demo("Series A, closed in the first quarter of 2026", D),
      capitalIntensity: "Low",
      futureFinancingNeed:
        "One further round to fund enterprise sales expansion, on a plan that reaches profitability without it if growth is allowed to slow.",
      ownershipConsiderations:
        "Single institutional lead with clean terms and high founder ownership retained.",
      financingRisk:
        "Low. Efficient growth with a credible path to profitability provides genuine optionality on timing.",
    },
    technology: {
      howItWorks:
        "Query logs from the warehouse are parsed to build a column-level dependency graph. Statistical profiles of each column are tracked over time, and when a downstream value moves the graph identifies which upstream change preceded it.",
      coreAdvantage:
        "Coverage without configuration. Competing approaches require teams to declare lineage, and teams do not.",
      supportingEvidence: [
        {
          claim:
            "Sixty two paying customers with net revenue retention above one hundred and ten percent.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Most new customers arrive inbound following technical content rather than outbound sales.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      benchmarks:
        "Lineage coverage and attribution accuracy are measured per deployment. Accuracy on dynamically generated queries is materially lower and is disclosed.",
      intellectualProperty:
        "No patents. Defensibility rests on the accumulated lineage graph within each customer, which takes months to build and is lost on switching.",
      thirdPartyDependency:
        "Query log access from data warehouse platforms, which those platforms control and could restrict.",
      milestoneForScale:
        "A large enterprise deployment covering several thousand pipelines, which would demonstrate the inference approach holds at complexity.",
      failurePoints: [
        "Warehouse vendors restricting query log access or bundling native lineage",
        "Inference accuracy degrading in the most complex environments",
        "Better-funded competitors buying the category through sales spend",
      ],
    },
    market: {
      painPoint:
        "When a dashboard or model output moves unexpectedly, finding the upstream cause takes days of manual investigation across systems nobody fully understands.",
      structure:
        "Broad mid-market and enterprise demand, with purchasing controlled by data platform teams who evaluate technically before involving procurement.",
      adoptionDrivers: [
        "Data pipelines growing in number faster than the teams maintaining them",
        "Machine learning models in production creating downstream consequences for silent data changes",
        "Regulatory and audit pressure for demonstrable data provenance",
      ],
      whyNow:
        "Pipeline counts have grown past the point where any individual understands the whole graph, which is what turns lineage from documentation into infrastructure.",
      competitors: [
        "Data observability platforms",
        "Data warehouse native lineage features",
        "Open-source lineage projects",
      ],
      substitutes: [
        "Manual investigation",
        "Internal tooling built by the data platform team",
      ],
      regulatoryEnvironment:
        "No direct product regulation. Customers in regulated industries impose data residency and audit requirements.",
      maturity: "Developing",
    },
    commercial: {
      pricingModel:
        "Annual subscription scaled by pipelines monitored, with a mid-market entry point and enterprise tiers above it.",
      salesMotion:
        "Product-led with a sales-assisted enterprise motion, mostly inbound from technical content.",
      customerType:
        "Data platform and analytics engineering teams.",
      adoptionEvidence: [
        {
          claim:
            "Net revenue retention above one hundred and ten percent over the past year.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Sixty two paying customers, with the majority arriving inbound.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      implementationBurden:
        "Low. Connecting to the warehouse takes hours, and the lineage graph builds itself over the following weeks.",
      expansionOpportunity:
        "Pipeline growth within existing customers, plus adjacent data quality and cost attribution use cases from the same graph.",
      goToMarketRisk:
        "Competing against features that warehouse vendors can bundle at no marginal cost to the customer.",
    },
    investment: {
      thesis:
        "An efficiently built product solving a well-understood problem with genuine expansion evidence, in a category where the main risk is not competition but absorption by the platform underneath.",
      bullCase:
        "The lineage graph becomes the system of record for data dependencies, expansion continues, and the product becomes hard to remove.",
      baseCase:
        "Solid growth in the mid-market with good retention, reaching a respectable outcome without becoming a category leader.",
      bearCase:
        "Warehouse vendors ship adequate native lineage, and the standalone product loses its reason to be purchased separately.",
      catalysts: [
        "A large enterprise deployment at several thousand pipelines",
        "Retention holding after a warehouse vendor ships native lineage",
        "Expansion into adjacent use cases from the same graph",
      ],
      risks: [
        "Warehouse platform absorption",
        "Inference accuracy at high complexity",
        "Well-funded competitors",
      ],
      invalidators: [
        "Net revenue retention falling below one hundred percent",
        "Customer churn following a warehouse native lineage release",
      ],
      recommendedNextStep:
        "Ask for retention data specifically among customers whose warehouse vendor has already shipped native lineage, since that cohort is the forward-looking test.",
    },
    diligence: {
      technology: [
        "What is attribution accuracy on dynamically generated queries compared with static ones?",
      ],
      product: [
        "How long does the lineage graph take to reach useful coverage after connection?",
      ],
      customers: [
        "What is retention among customers whose warehouse vendor has shipped native lineage?",
      ],
      competition: [
        "Where has the company lost deals, and was the alternative a competitor or a native feature?",
      ],
      unitEconomics: [
        "What is gross margin, and what is the customer acquisition payback period?",
      ],
      capitalRequirements: [
        "What does the enterprise sales motion cost to build, and is it necessary?",
      ],
      regulation: [
        "What data residency requirements do regulated customers impose, and how are they met?",
      ],
      team: [
        "Who has taken a developer-oriented product from mid-market into enterprise before?",
      ],
      financing: [
        "At what growth rate does the current plan reach profitability without another round?",
      ],
      commercialization: [
        "What proportion of revenue is inbound, and how does that mix change as deal sizes grow?",
      ],
    },
    outreach:
      "Hi, the decision to infer column-level lineage from query logs rather than asking teams to declare it is the right call, and the write-up was honest about where inference accuracy drops on dynamically generated queries. That combination is unusual. I focus on early-stage data infrastructure. I would like to understand how retention has held among customers whose warehouse vendor has already shipped native lineage. Would you be up for a short call?",
    factors: {
      differentiation: fa(
        3,
        "judgment",
        "Lineage inferred from query logs rather than declared, giving coverage without configuration.",
        "A sound design choice rather than a deep technical moat.",
      ),
      defensibility: fa(
        3,
        "judgment",
        "The accumulated lineage graph takes months to rebuild, which creates real switching cost.",
        "Moderate, and stronger than the absence of patents suggests.",
      ),
      marketPotential: fa(
        4,
        "judgment",
        "Every organisation running production data pipelines has this problem.",
        "Broad and well understood by buyers.",
      ),
      commercialReadiness: fa(
        4,
        "judgment",
        "Sixty two paying customers with an established product-led motion.",
        "Genuinely commercial and repeatable.",
      ),
      customerEvidence: fa(
        5,
        "judgment",
        "Net revenue retention above one hundred and ten percent with mostly inbound acquisition.",
        "The strongest customer evidence in the private set.",
      ),
      teamCredibility: fa(
        4,
        "judgment",
        "Founders built data platform infrastructure at scale before starting the company.",
        "Direct experience with the problem they are selling into.",
      ),
      capitalEfficiency: fa(
        5,
        "judgment",
        "Sixty two customers and positive net expansion on sixteen million dollars raised.",
        "The most capital efficient company in this universe.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Well-funded observability competitors plus warehouse vendors able to bundle at no marginal cost.",
        "Crowded, with the most dangerous competitor being a free feature.",
      ),
      technicalRisk: fa(
        4,
        "judgment",
        "The product works in production, with known accuracy limits on dynamic queries.",
        "Low.",
      ),
      regulatoryRisk: fa(
        5,
        "judgment",
        "No direct product regulation.",
        "Effectively none.",
      ),
      financingRisk: fa(
        5,
        "judgment",
        "Efficient growth with a credible path to profitability without raising again.",
        "The lowest financing risk in the private set.",
      ),
      overlooked: fa(
        2,
        "judgment",
        "Data observability is a well-covered venture category.",
        "Not overlooked, though the inference approach is less discussed.",
      ),
    },
  },

  /* ------------------------------------------------------------- Sable Health */
  {
    id: "sable-health",
    name: "Sable Health",
    isDemonstration: true,
    marketType: "Private",
    hq: "Nashville, Tennessee",
    region: "North America",
    foundedYear: 2020,
    sector: "Healthcare Technology",
    subsector: "Revenue cycle and claim denial prevention",
    stage: "Series B",
    description:
      "Software that identifies why claims are denied and corrects the upstream documentation before submission, shifting revenue cycle work from appealing denials to preventing them.",
    businessModel:
      "Annual subscription scaled by claim volume, with a portion of pricing contingent on measured denial rate reduction.",
    primaryCustomer:
      "Hospital systems and large physician groups with high claim volumes.",
    technicalDifferentiation:
      "Root-cause classification across payer-specific denial patterns, built on a dataset spanning multiple health systems that no single system could assemble alone.",
    tractionSignal: demo(
      "Nineteen health system customers, with measured denial rate reduction sustained beyond the first year at the eight longest-running accounts.",
      D,
      "Illustrative traction on a fictional company.",
    ),
    keyCatalyst:
      "Whether denial rate improvements hold as payers adjust their own adjudication rules in response.",
    investmentRisk:
      "The improvement may prove adversarial, with payers adapting to changes in provider documentation behaviour.",
    technicalRisk:
      "Payer rules change without notice, so the model requires continuous retraining against a moving target.",
    competitiveThreat:
      "Established revenue cycle management vendors with deep hospital relationships, and electronic health record vendors adding native functionality.",
    capitalIntensity: "Moderate",
    commercialReadiness: "Scaling",
    lastReviewed: "2026-07-26",
    sourceIds: [],
    financials: {
      kind: "private",
      stage: "Series B",
      capitalRaised: demo(58_000_000, D, "Illustrative total raised."),
      latestRound: demo("Series B, closed in early 2026", D),
      capitalIntensity: "Moderate",
      futureFinancingNeed:
        "One further round to fund enterprise sales expansion, though the business is close to self-funding at current growth.",
      ownershipConsiderations:
        "A health system participates as a strategic investor, which provides reference value and creates some perception of bias among competing systems.",
      financingRisk:
        "Low to moderate. Contracted recurring revenue with long customer lifetimes.",
    },
    technology: {
      howItWorks:
        "Historical denials are classified by root cause rather than by denial code. Those patterns are applied to claims before submission, flagging the specific documentation gap likely to cause a denial for that payer.",
      coreAdvantage:
        "The cross-system dataset. Denial patterns are payer-specific and no single health system sees enough volume across payers to learn them reliably.",
      supportingEvidence: [
        {
          claim:
            "Denial rate reduction sustained beyond the first year at the eight longest-running accounts.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Nineteen health system customers under contract.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      benchmarks:
        "Denial rate reduction is measured against each customer's own baseline. Cross-customer comparison is limited because payer mix differs substantially.",
      intellectualProperty:
        "No patents. The dataset and the payer-specific rule library are the defensible assets.",
      thirdPartyDependency:
        "Integration with electronic health record and practice management systems, which the vendors control.",
      milestoneForScale:
        "Demonstrating that the improvement holds through a payer policy cycle, which is the test of whether this is durable or adversarial.",
      failurePoints: [
        "Payers adapting adjudication rules in response to changed provider behaviour",
        "Electronic health record vendors adding adequate native denial prediction",
        "Integration access being restricted by the record system vendors",
      ],
    },
    market: {
      painPoint:
        "A substantial share of claims are denied on first submission, and most revenue cycle effort goes into appealing denials rather than preventing them.",
      structure:
        "Concentrated among large health systems with long procurement cycles and strong incumbent vendor relationships.",
      adoptionDrivers: [
        "Margin pressure across hospital systems making revenue cycle recovery a priority",
        "Denial rates rising as payer adjudication becomes more automated",
        "Administrative staffing shortages in revenue cycle departments",
      ],
      whyNow:
        "Payer adjudication has become automated enough that denial patterns are consistent and learnable, which was less true when decisions were more manual.",
      competitors: [
        "Established revenue cycle management vendors",
        "Electronic health record native functionality",
        "Outsourced revenue cycle services",
      ],
      substitutes: [
        "Manual denial appeals",
        "Outsourcing the revenue cycle entirely",
      ],
      regulatoryEnvironment:
        "Health data privacy rules apply directly to every deployment, and billing compliance requirements govern what the software may recommend.",
      maturity: "Developing",
    },
    commercial: {
      pricingModel:
        "Annual subscription on claim volume, with a contingent component tied to measured denial reduction.",
      salesMotion:
        "Enterprise healthcare sales with long cycles, typically beginning with a paid pilot on a single service line.",
      customerType:
        "Revenue cycle leadership at hospital systems and large physician groups.",
      adoptionEvidence: [
        {
          claim:
            "Sustained denial rate reduction beyond the first year at eight accounts.",
          provenance: "demonstration",
          asOf: D,
        },
        {
          claim:
            "Contract renewals have held across the customer base.",
          provenance: "demonstration",
          asOf: D,
        },
      ],
      implementationBurden:
        "Substantial. Integration with the record system and workflow changes for coding staff both take months.",
      expansionOpportunity:
        "Additional service lines within existing systems, and adjacent prior authorisation workflows using the same payer rule library.",
      goToMarketRisk:
        "Long sales cycles against entrenched incumbents with existing enterprise agreements.",
    },
    investment: {
      thesis:
        "A measurable financial improvement for a buyer under real margin pressure, built on a cross-system dataset that individual customers cannot replicate, with the open question being whether the gains survive payer adaptation.",
      bullCase:
        "Improvements hold through payer policy cycles, the dataset compounds with each new system, and the product expands into adjacent authorisation workflows.",
      baseCase:
        "Steady enterprise growth with good retention, producing a solid healthcare software business.",
      bearCase:
        "Payers adapt, measured improvements decay, and contingent pricing turns from an advantage into a liability.",
      catalysts: [
        "Improvement sustained through a full payer policy cycle",
        "Expansion into prior authorisation workflows",
        "New health system contracts at larger scale",
      ],
      risks: [
        "Payer adaptation",
        "Record system vendor competition",
        "Long enterprise sales cycles",
      ],
      invalidators: [
        "Denial reduction decaying at the longest-running accounts",
        "A record system vendor shipping comparable native functionality",
      ],
      recommendedNextStep:
        "Examine the denial rate trend at the eight oldest accounts across the full period, since decay would appear there first.",
    },
    diligence: {
      technology: [
        "How quickly does the model adapt when a payer changes adjudication rules without notice?",
      ],
      product: [
        "What is the denial rate trend at the eight longest-running accounts across the full engagement?",
      ],
      customers: [
        "How many customers have expanded to additional service lines, and what triggered it?",
      ],
      competition: [
        "What denial prediction functionality do the major record system vendors offer today?",
      ],
      unitEconomics: [
        "What share of revenue is contingent on measured outcomes, and how has that share performed?",
      ],
      capitalRequirements: [
        "What does implementation cost per customer, and how does that affect first-year margin?",
      ],
      regulation: [
        "How is protected health information governed across the cross-system dataset?",
      ],
      team: [
        "Who has sold revenue cycle software into large health systems before?",
      ],
      financing: [
        "How close is the business to self-funding at current growth rates?",
      ],
      commercialization: [
        "What is the time from pilot to enterprise contract, and how has it changed?",
      ],
    },
    outreach:
      "Hi, the breakdown showing denial root causes rather than denial codes was the clearest description of that problem I have read, and treating it as a documentation problem upstream rather than an appeals problem downstream is the right framing. I focus on early-stage healthcare infrastructure. I would like to understand how the denial rate has trended at the eight longest-running accounts, particularly through payer policy changes. Would twenty minutes work?",
    factors: {
      differentiation: fa(
        3,
        "judgment",
        "Root-cause classification built on a cross-system dataset individual customers cannot assemble.",
        "The dataset is the differentiator rather than the model.",
      ),
      defensibility: fa(
        4,
        "judgment",
        "The dataset compounds with each health system added, and switching costs after integration are high.",
        "Genuinely compounding, which is the strongest structural feature here.",
      ),
      marketPotential: fa(
        4,
        "judgment",
        "Revenue cycle is a large and well-funded budget line under active margin pressure.",
        "Large and defined, with a clear buyer.",
      ),
      commercialReadiness: fa(
        4,
        "judgment",
        "Nineteen health system customers with renewals holding.",
        "Commercial and scaling in a market with slow procurement.",
      ),
      customerEvidence: fa(
        5,
        "judgment",
        "Measured, sustained denial rate reduction beyond the first year at eight accounts.",
        "Outcome-linked evidence is the strongest form available.",
      ),
      teamCredibility: fa(
        4,
        "judgment",
        "Founders came from hospital revenue cycle operations rather than from software alone.",
        "Operator credibility in a market that grants access on that basis.",
      ),
      capitalEfficiency: fa(
        3,
        "judgment",
        "Fifty eight million dollars to reach nineteen enterprise customers.",
        "Reasonable given healthcare sales cycles.",
      ),
      competitiveIntensity: fa(
        2,
        "judgment",
        "Entrenched revenue cycle vendors and record system vendors able to add native functionality.",
        "Crowded with well-established incumbents.",
      ),
      technicalRisk: fa(
        3,
        "judgment",
        "The system works, but payer rules change continuously and the model must keep pace.",
        "Moderate and ongoing rather than one-time.",
      ),
      regulatoryRisk: fa(
        2,
        "judgment",
        "Health data privacy and billing compliance requirements apply directly to every deployment.",
        "High, characteristic of the sector.",
      ),
      financingRisk: fa(
        4,
        "judgment",
        "Contracted recurring revenue with long customer lifetimes and near self-funding growth.",
        "Low.",
      ),
      overlooked: fa(
        3,
        "judgment",
        "Revenue cycle software is covered, though denial prevention receives less attention than denial recovery.",
        "Somewhat under-examined within a covered category.",
      ),
    },
  },
];

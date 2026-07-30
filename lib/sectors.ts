import type { MarketMaturity, Sector } from "./types";

/**
 * Sector research.
 *
 * Each sector is described through its value chain rather than through a
 * market-size figure. Top-down market sizing is the least reliable input
 * available at this stage of any technology cycle, and this platform
 * deliberately does not publish one. Where a layer of the value chain captures
 * margin and where it does not is a far more useful question, and it can be
 * answered from observable structure.
 */

export interface ValueChainLayer {
  name: string;
  description: string;
  /** Where economic value actually accrues at this layer, and why. */
  marginPosition: string;
  /** Company ids in the universe operating at this layer. */
  companyIds: string[];
}

export interface SectorResearch {
  slug: string;
  title: string;
  /** Sectors from the universe that this research page covers. */
  sectors: Sector[];
  summary: string;
  overview: string[];
  maturity: MarketMaturity;
  maturityNote: string;
  valueChain: ValueChainLayer[];
  technicalBottlenecks: string[];
  commercialisationBarriers: string[];
  capitalRequirements: string;
  regulatoryIssues: string[];
  catalysts: string[];
  risks: string[];
  publicSignals: string[];
  investorQuestions: string[];
}

export const SECTOR_RESEARCH: SectorResearch[] = [
  {
    slug: "ai-infrastructure",
    title: "AI infrastructure and advanced computing",
    sectors: ["AI Infrastructure", "Semiconductors"],
    summary:
      "The compute, memory, interconnect, and serving layers that AI workloads run on, where the binding constraint has moved several times in three years and is currently moving again.",
    overview: [
      "This sector is best understood as a stack in which the bottleneck migrates. In 2023 the constraint was accelerator supply. Through 2024 it moved to advanced packaging and high bandwidth memory. Through 2025 and into 2026 it has moved again, to power delivery and heat removal, and increasingly to the interconnect that lets many accelerators behave as one machine.",
      "Each migration relocates margin. When accelerators were scarce, the accelerator vendor captured nearly everything. As the constraint moved into memory and packaging, suppliers at those layers gained pricing power they had not held in decades. The current shift toward power and thermal has done the same for a set of industrial companies that were not previously considered technology investments at all.",
      "The most important structural fact is the identity of the buyers. A small number of hyperscale operators account for a large share of demand, and each is simultaneously the largest customer and the most credible potential competitor for several layers of the stack. That is an unusual and adverse structure for any supplier, and it shapes pricing, contract terms, and roadmap disclosure throughout the sector.",
      "The workload mix is the variable to watch. Training is concentrated, capital intensive, and tolerant of proprietary software. Inference is distributed, price sensitive, and far more portable between platforms. As inference becomes the larger share of deployed compute, the software advantages that protect the current leader matter less and cost per unit of output matters more.",
    ],
    maturity: "Developing",
    maturityNote:
      "Demand is well established, but the architecture is not settled. Rack-scale designs, interconnect standards, and cooling approaches are all still converging, which means position at any layer is contestable in a way it will not be in five years.",
    valueChain: [
      {
        name: "Accelerator silicon",
        description:
          "The processors that execute neural network computation, sold as chips, boards, or complete systems.",
        marginPosition:
          "Captures the largest share of value today, protected by software ecosystem rather than by silicon alone. Most exposed to customer-designed alternatives at the inference end.",
        companyIds: ["nvda", "amd", "avgo", "halden-compute"],
      },
      {
        name: "Memory",
        description:
          "High bandwidth memory stacked beside the processor, which sets the ceiling on model size and inference throughput.",
        marginPosition:
          "Moved from commodity pricing to allocated long-term contracts, which is a genuine structural change. Three suppliers globally, so discipline is possible but not guaranteed.",
        companyIds: ["mu"],
      },
      {
        name: "Interconnect and networking",
        description:
          "The links between accelerators, trays, and racks, which determine whether aggregated compute is usable.",
        marginPosition:
          "Content per rack rises with every accelerator generation, so this layer grows faster than unit volumes. Fragmented enough that specialists can hold position against larger vendors.",
        companyIds: ["alab", "crdo", "avgo", "meridian-fabric"],
      },
      {
        name: "Processor architecture",
        description:
          "The instruction set and core designs licensed to everyone building processors around the accelerators.",
        marginPosition:
          "Very high margin royalty economics, with value capture per device rising only if royalty rates rise. Volume growth alone does not move this layer much.",
        companyIds: ["arm"],
      },
      {
        name: "Power and thermal",
        description:
          "Electricity delivery to the rack and heat removal from it, now on the critical path for deployment.",
        marginPosition:
          "Industrial margins, improving with mix as liquid cooling attaches. The service annuity on the installed base is the more durable economic asset.",
        companyIds: ["vrt", "coldbrook-thermal", "anvil-grid", "be"],
      },
      {
        name: "Serving and orchestration software",
        description:
          "The layer deciding which accelerator runs which request, which determines realised utilisation.",
        marginPosition:
          "Software margins on a small base. The most contestable layer in the stack, because platform owners can bundle equivalent functionality at no marginal cost.",
        companyIds: ["larkspur-systems"],
      },
    ],
    technicalBottlenecks: [
      "Memory bandwidth rather than arithmetic throughput limits inference on large models",
      "Advanced packaging capacity constrains how many accelerators can be built regardless of wafer supply",
      "Electrical interconnect reach shortens as data rates rise, forcing an expensive move to optics",
      "Heat removal at current rack densities exceeds what air cooling can deliver",
    ],
    commercialisationBarriers: [
      "Qualification cycles at hyperscale customers run for years, so a missed generation forfeits a full product cycle",
      "Software maturity, not silicon performance, decides most accelerator purchasing decisions",
      "Grid interconnection timelines gate deployment independently of equipment availability",
    ],
    capitalRequirements:
      "Extremely uneven across the stack. Serving software can reach commercial traction on under twenty million dollars, while accelerator silicon requires several hundred million before meaningful revenue and memory manufacturing requires capital expenditure at a level only three companies in the world sustain. Any comparison across this sector that ignores capital intensity is comparing incomparable businesses.",
    regulatoryIssues: [
      "Export controls on advanced accelerators restrict which products may be sold into which markets, and have changed at short notice",
      "Manufacturing incentive programmes influence where fabrication capacity is built",
      "Grid interconnection rules and local permitting govern the pace of data centre construction",
    ],
    catalysts: [
      "Disclosed split between training and inference workloads at the major platforms",
      "Adoption rate of customer-designed accelerators in production inference",
      "Liquid cooling attach rates and book-to-bill at the power and thermal vendors",
      "Interconnect standard transitions, which reset competitive position at that layer",
    ],
    risks: [
      "A demand digestion period following heavy buildout, which would expose fixed cost bases across the stack",
      "Hyperscaler vertical integration removing merchant suppliers layer by layer",
      "Concentration of demand among buyers who are also competitors",
    ],
    publicSignals: [
      "Hyperscaler capital expenditure guidance, which leads component revenue by roughly two to three quarters",
      "Book-to-bill and backlog at power and thermal suppliers, which lead facility readiness",
      "Memory capital expenditure across all three manufacturers, which is the best available indicator of future supply discipline",
    ],
    investorQuestions: [
      "At which layer of this stack is the constraint likely to sit eighteen months from now, and who captures margin when it moves there?",
      "For any supplier, what proportion of revenue comes from customers who are also building an internal alternative?",
      "Does the company's advantage survive a change in the interconnect or memory architecture it currently assumes?",
      "How much of the current margin is scarcity rent rather than structural pricing power?",
    ],
  },

  {
    slug: "robotics-autonomy",
    title: "Robotics and autonomy",
    sectors: ["Robotics & Autonomy"],
    summary:
      "Physical systems that perceive and act in unstructured environments, where the gap between an impressive demonstration and a deployable product remains the defining commercial problem.",
    overview: [
      "Robotics has a persistent pattern that any investor in the sector should hold explicitly. Capability demonstrations improve steadily and generate attention, while deployment economics improve much more slowly and generate revenue. The two are often confused, and the confusion has been expensive.",
      "The variable that decides most outcomes is not whether the robot can perform the task. It is the cost of the second deployment relative to the first. A system that requires the same engineering effort for every new customer or task is a consultancy with hardware attached, regardless of how capable it is. A system where deployment cost falls sharply after the first installation is a product.",
      "The most investable positions currently sit in narrow, high-value tasks inside structured environments, rather than in general-purpose platforms. Contact-rich assembly and retrofit autonomy on existing equipment both share a useful property: they generate revenue inside the current regulatory and operational framework while accumulating the data that a broader capability would require.",
      "Regulation matters more in this sector than in software, and unevenly. Machinery safety standards for industrial systems are well established and routinely satisfied. Autonomy regulation in transport is developing slowly and differs by jurisdiction, which means the same technical capability can be commercially viable in one market and not in another.",
    ],
    maturity: "Emerging",
    maturityNote:
      "Component costs have fallen enough to make deployment economic in specific niches. Broad deployment remains gated by per-task engineering cost rather than by capability.",
    valueChain: [
      {
        name: "Sensing and perception",
        description:
          "Cameras, force sensors, radar, and the fusion layer that builds a usable picture of the environment.",
        marginPosition:
          "Component margins are thin and falling. Value accrues to whoever owns the validated data corpus rather than to whoever supplies the sensor.",
        companyIds: ["tidewater-autonomy"],
      },
      {
        name: "Manipulation and control",
        description:
          "The policies and control loops that turn perception into physical action under uncertainty.",
        marginPosition:
          "Where the genuine technical differentiation sits. Also where the per-task engineering cost is incurred, which is what determines whether margins scale.",
        companyIds: ["wrenfield-robotics"],
      },
      {
        name: "Platform hardware",
        description:
          "Arms, mobile bases, and vessels. Increasingly sourced rather than built by the companies adding autonomy.",
        marginPosition:
          "Commoditising. Buying the platform preserves capital but cedes control of the roadmap to the platform vendor, which is a real strategic weakness.",
        companyIds: [],
      },
      {
        name: "Deployment and integration",
        description:
          "Commissioning, safety certification, and the operational changes a customer makes around the system.",
        marginPosition:
          "Absorbs margin invisibly. The ratio of second-deployment cost to first-deployment cost is the single most informative number in this sector.",
        companyIds: ["wrenfield-robotics", "tidewater-autonomy"],
      },
    ],
    technicalBottlenecks: [
      "Cycle time parity with a skilled human operator on contact-rich tasks",
      "Skill transfer between tasks, which determines whether each deployment is bespoke",
      "Perception reliability in the conditions that occur rarely and matter most, such as poor visibility or heavy weather",
    ],
    commercialisationBarriers: [
      "Manufacturing and shipping customers buy in small increments and expect suppliers to survive for a decade",
      "Safety certification is required per deployment configuration, not per product",
      "Pilot-to-production conversion rates in this sector are low and slow, and pilots are frequently mistaken for demand",
    ],
    capitalRequirements:
      "High and front-loaded. Manufacturing capacity generally has to be funded before orders arrive, which puts the financing requirement and the commercial proof point in the wrong order. Companies that retrofit existing platforms rather than building their own consume materially less capital, at the cost of depending on a platform vendor.",
    regulatoryIssues: [
      "Machinery safety standards for systems operating near people, certified per configuration",
      "Maritime and transport autonomy rules, developing unevenly across jurisdictions",
      "Liability allocation when an autonomous system causes damage, which remains unsettled in most markets",
    ],
    catalysts: [
      "Pilot conversions to multi-line or fleet-wide production orders",
      "Certification milestones that expand what a system is permitted to do unsupervised",
      "Evidence that deployment time for the second task at a customer falls sharply against the first",
    ],
    risks: [
      "Capability demonstrations attracting capital that deployment economics cannot justify",
      "Incumbent platform vendors adding adequate versions of the differentiating capability",
      "An incident in a poorly validated condition attracting regulatory attention across the category",
    ],
    publicSignals: [
      "Industrial automation order books, which lead robotics adoption",
      "Labour availability and wage data in the specific tasks being automated",
      "Classification society and regulator publications on autonomy levels",
    ],
    investorQuestions: [
      "How long did the second task or second site take to deploy compared with the first?",
      "What is cycle time relative to a skilled human operator, and what is the specific engineering path to parity?",
      "Does the company control the platform, or only the software running on someone else's?",
      "Under what rare condition is the system least validated, and what happens if it fails there?",
    ],
  },

  {
    slug: "quantum-technology",
    title: "Quantum technology",
    sectors: ["Quantum Technology"],
    summary:
      "A pre-commercial category where no company has demonstrated advantage on a commercially relevant problem, funded largely by governments, and priced by markets as though that condition were closer to changing than the evidence supports.",
    overview: [
      "This platform takes an unusually direct position on quantum computing, because the alternative is to obscure the only fact that currently matters. No quantum computer has demonstrated a commercial advantage over classical hardware on a problem anyone needs solved. Every investment case in the category is a bet on that changing, and should be sized accordingly.",
      "The category is real and the science is serious. Error correction has progressed genuinely over the past five years, and several modalities have shown meaningful improvements in coherence and fidelity. What has not happened is the translation of any of that into a task where a customer would choose quantum hardware for economic reasons rather than for research or strategic ones.",
      "Modality choice matters more here than in most technology categories, because the modalities have genuinely different scaling economics. Superconducting approaches scale by fabrication and inherit semiconductor manufacturing dynamics. Trapped-ion approaches offer high fidelity and complete connectivity at slower gate speeds. Neutral atom approaches scale by expanding an optical system rather than by fabricating devices, which is a different cost curve entirely.",
      "Government funding is the reason the category is sustainable at all. That is not a criticism, but it does mean demand responds to policy cycles rather than to product quality, and an investor should model it that way.",
    ],
    maturity: "Emerging",
    maturityNote:
      "Pre-commercial across every modality. Revenue exists but is research and government funded, and should not be read as evidence of a developing commercial market.",
    valueChain: [
      {
        name: "Qubit modality and hardware",
        description:
          "The physical system holding quantum information: superconducting circuits, trapped ions, neutral atoms, or photons.",
        marginPosition:
          "Where all capital is currently consumed and no durable margin yet exists. Modality choice determines the scaling cost curve.",
        companyIds: ["ionq", "palisade-quantum"],
      },
      {
        name: "Control systems",
        description:
          "Lasers, cryogenics, vacuum systems, and control electronics that operate the qubits.",
        marginPosition:
          "Specialist suppliers earn real margins today, selling to research programmes regardless of whether any modality eventually wins.",
        companyIds: [],
      },
      {
        name: "Error correction and software",
        description:
          "The layer converting many noisy physical qubits into fewer reliable logical ones, plus the compilers above it.",
        marginPosition:
          "No margin yet. This is the layer where the commercial question is actually decided, and it remains unsolved.",
        companyIds: [],
      },
      {
        name: "Access and applications",
        description:
          "Cloud access to systems and the application work attempting to find problems worth running on them.",
        marginPosition:
          "Small revenue, mostly research budgets. Useful mainly as a signal of who is experimenting and on what.",
        companyIds: ["ionq", "palisade-quantum"],
      },
    ],
    technicalBottlenecks: [
      "Error correction overhead, which currently requires very large numbers of physical qubits per logical qubit",
      "Atom loss and decoherence during computations long enough to be useful",
      "Gate speed, which limits throughput even where fidelity is high",
    ],
    commercialisationBarriers: [
      "No demonstrated advantage on a problem with commercial value",
      "Operating the systems requires specialist physics expertise that few organisations employ",
      "Classical algorithms continue to improve, which raises the bar that quantum hardware must clear",
    ],
    capitalRequirements:
      "Very high and continuous, with no path to operating profitability on any near-term plan at any company in the category. Investors should expect repeated dilution and should treat positions as research options rather than as investments in operating businesses.",
    regulatoryIssues: [
      "Export controls on quantum technology restrict which customers may be served",
      "Government procurement rules govern most current demand",
      "National security classification affects what can be published about capability",
    ],
    catalysts: [
      "Error-corrected logical qubit milestones at counts that make an algorithm plausible",
      "National quantum programme awards, which sustain the category",
      "Any peer-reviewed demonstration of advantage on a commercially relevant problem",
    ],
    risks: [
      "The technology may not become commercially useful within any investable horizon",
      "Modality selection risk, where the wrong technical bet is unrecoverable",
      "Valuations across the category embedding success that has not been demonstrated",
    ],
    publicSignals: [
      "National quantum programme budgets and award announcements",
      "Peer-reviewed publications on logical qubit counts and error rates",
      "Cryogenics and specialist laser supplier order books, which lead system builds",
    ],
    investorQuestions: [
      "What specific problem is expected to demonstrate advantage first, and who has committed to running it?",
      "How does this modality's scaling cost curve compare with the alternatives at the qubit counts error correction requires?",
      "What proportion of revenue is government funded, and what happens under a change in policy priorities?",
      "What is the realistic dilution between now and the next meaningful technical milestone?",
    ],
  },

  {
    slug: "biotechnology-research-tools",
    title: "Biotechnology and research tools",
    sectors: ["Biotechnology & Research Tools", "Healthcare Technology"],
    summary:
      "The instrumentation, software, and data infrastructure underneath life sciences research and clinical care, where the buyer is often grant funded and the regulatory path frequently decides the outcome before the product does.",
    overview: [
      "Tools and infrastructure businesses in life sciences have a structural advantage over therapeutics: they generate revenue without carrying clinical risk. They also have a structural constraint, which is that their customers are frequently funded by grants or by reimbursement rates, neither of which responds to how good the product is.",
      "The most durable positions in this sector are built on datasets rather than on instruments. An instrument can be copied and undercut. A dataset linking molecular information to clinical outcomes over years, or denial patterns across many payers, compounds with scale and cannot be assembled quickly by a competitor no matter how well funded.",
      "Regulatory exposure varies enormously within the sector and should never be treated as a single variable. Research-use-only tools face essentially no product regulation. Clinical diagnostics face reimbursement decisions that can compress an entire business model. Software touching billing or clinical decisions faces compliance requirements that shape what the product is permitted to recommend.",
      "The commercial pattern worth watching is whether a company can sell above the level of the individual laboratory or department. Many good products in this sector reach a ceiling because they are bought by individual principal investigators from small discretionary budgets, and the institutional sales motion is a genuinely different and unproven capability.",
    ],
    maturity: "Developing",
    maturityNote:
      "Established buyers and budgets, with real growth driven by falling sequencing and computing costs. The constraint is procurement structure rather than demand.",
    valueChain: [
      {
        name: "Instrumentation and capture",
        description:
          "Sequencers, laboratory instruments, and the sensing layer that produces primary research or clinical data.",
        marginPosition:
          "Hardware margins with recurring consumables underneath. Increasingly commoditised as the underlying costs fall.",
        companyIds: ["kestrel-bio"],
      },
      {
        name: "Computational methods",
        description:
          "Simulation, prediction, and analysis software applied to molecular and clinical data.",
        marginPosition:
          "High software margins with strong renewal rates where the method is genuinely differentiated. Under pressure from open-source and machine learning alternatives.",
        companyIds: ["sdgr"],
      },
      {
        name: "Data assets",
        description:
          "Linked molecular, clinical, and operational datasets built over years of operation.",
        marginPosition:
          "The most defensible layer in the sector. Compounds with scale and cannot be reproduced quickly, though rights are usually contractual rather than proprietary.",
        companyIds: ["tem", "sable-health"],
      },
      {
        name: "Clinical and operational workflow",
        description:
          "Software embedded in care delivery, billing, and research operations.",
        marginPosition:
          "Sticky once integrated, with switching costs measured in months. Heavily exposed to record system vendors adding native functionality.",
        companyIds: ["sable-health"],
      },
    ],
    technicalBottlenecks: [
      "Prospective rather than retrospective prediction accuracy, which is where computational methods are weakest",
      "Capturing the variables that actually explain an experimental result rather than the ones that are easy to record",
      "Keeping models current against payer and protocol rules that change without notice",
    ],
    commercialisationBarriers: [
      "Grant-funded buyers with small discretionary budgets and annual cycles",
      "Institutional procurement processes that differ entirely from individual laboratory sales",
      "Reimbursement decisions that can compress a business model independently of product quality",
    ],
    capitalRequirements:
      "Moderate for software and instrumentation, high for anything requiring laboratory infrastructure or clinical validation. Companies building physical diagnostic capacity consume capital at a rate closer to industrial businesses than to software.",
    regulatoryIssues: [
      "Diagnostic regulation and laboratory certification requirements",
      "Payer coverage and reimbursement rate decisions",
      "Health data privacy rules governing what data may be linked, retained, and licensed",
      "Billing compliance requirements constraining what software may recommend",
    ],
    catalysts: [
      "Reimbursement coverage decisions on high-volume tests",
      "Institutional or departmental purchases that prove a sales motion above the individual laboratory",
      "Clinical readouts for companies carrying pipeline exposure",
    ],
    risks: [
      "Reimbursement rate reductions compressing the segment that generates data",
      "Record system and instrument vendors adding adequate native functionality",
      "Data rights proving contractual and revocable rather than owned",
    ],
    publicSignals: [
      "Public research funding budgets, which set the ceiling on academic tool spending",
      "Reimbursement rate schedules and coverage determinations",
      "Pharmaceutical research and development spending, which drives data licensing demand",
    ],
    investorQuestions: [
      "Is the defensible asset the instrument, the method, or the dataset, and does it compound?",
      "Can this be sold above the individual laboratory, and has that been demonstrated?",
      "What is the specific regulatory or reimbursement decision that could compress the model, and when is it due?",
      "Who owns the data rights, and what happens to them if the customer relationship ends?",
    ],
  },

  {
    slug: "energy-advanced-materials",
    title: "Energy and advanced materials",
    sectors: ["Energy & Advanced Materials"],
    summary:
      "Power generation, distribution, and thermal management, pulled unexpectedly onto the critical path of AI infrastructure by grid constraints that equipment supply cannot solve.",
    overview: [
      "This sector has been repriced by something outside it. Data centre operators can obtain accelerators faster than they can obtain grid capacity, which turned power availability and heat removal from background infrastructure into the binding constraint on AI deployment. Companies that were valued as industrial equipment businesses two years ago are now valued partly as AI infrastructure.",
      "That repricing deserves scrutiny rather than acceptance. The demand is genuine and currently large. Whether it is durable depends on whether the constraint persists, and utilities are actively working to remove it. An investor should be explicit about whether they are underwriting a structural change or a multi-year window.",
      "The more durable economics in this sector generally sit in service rather than in equipment. An installed base generating recurring maintenance revenue at higher margin than the original sale is what carries an industrial company through a construction pause. Order growth without a service annuity underneath is a cyclical exposure wearing a growth multiple.",
      "Regulation is unusually decisive here. Utility interconnection standards, permitting, emissions rules, and energy incentive programmes all bear directly on the economics, and in the behind-the-meter category the regulatory approval itself is the primary competitive asset. That is an unusual moat: slow to acquire, impossible to buy, and vulnerable to the standard being revised.",
    ],
    maturity: "Developing",
    maturityNote:
      "Mature underlying technologies meeting a genuinely new demand driver. The technical risk is low and the demand durability question is the whole investment case.",
    valueChain: [
      {
        name: "Generation",
        description:
          "On-site power generation, including fuel cells and turbines, deployed where grid capacity is unavailable.",
        marginPosition:
          "Historically poor economics, currently improved by scarcity. Service agreements determine whether the improvement is durable.",
        companyIds: ["be"],
      },
      {
        name: "Distribution and control",
        description:
          "Switchgear, power conditioning, and the control layer coordinating grid, generation, and storage.",
        marginPosition:
          "Equipment margins are industrial; the control software layer earns software margins but is contestable by equipment vendors bundling.",
        companyIds: ["vrt", "anvil-grid"],
      },
      {
        name: "Thermal management",
        description:
          "Removing heat from racks, moving from air cooling toward liquid delivered directly to the chip.",
        marginPosition:
          "Improving with liquid cooling mix. The installed base service annuity is the more valuable asset than the equipment sale.",
        companyIds: ["vrt", "coldbrook-thermal"],
      },
      {
        name: "Materials and components",
        description:
          "Ceramics, coolant chemistry, power electronics, and the specialist inputs underneath the equipment.",
        marginPosition:
          "Narrow but defensible where a specific formulation or process is genuinely difficult to reproduce.",
        companyIds: ["coldbrook-thermal"],
      },
    ],
    technicalBottlenecks: [
      "Heat removal at rack densities beyond what air cooling supports",
      "Stack degradation and long-term service economics in fuel cell systems",
      "Coolant chemistry stability over multi-year operation in real building conditions",
      "Fast, safe transition between power sources without interrupting a data centre load",
    ],
    commercialisationBarriers: [
      "Utility interconnection approval, which takes years and must be repeated per territory",
      "Installation into live facilities, which binds deployment to maintenance and construction schedules",
      "Long equipment lead times for transformers, switchgear, and power electronics",
    ],
    capitalRequirements:
      "High for manufacturing and generation, moderate for control software. Working capital rather than research funding is usually the binding requirement once a product is proven, which is a materially better reason to raise than the alternative.",
    regulatoryIssues: [
      "Utility interconnection standards, which are territory-specific and currently under revision in several markets",
      "Local permitting and building codes for installations",
      "Emissions rules and energy incentive programmes that materially affect operating economics",
      "Coolant handling and environmental regulation",
    ],
    catalysts: [
      "Book-to-bill and backlog disclosure at the equipment vendors",
      "Liquid cooling attach rates",
      "New utility territory approvals for behind-the-meter control",
      "Grid interconnection queue length in the most active regions",
    ],
    risks: [
      "Grid capacity expanding and removing the constraint that created the demand",
      "A construction pause exposing fixed cost bases",
      "Multiple compression back toward industrial comparables",
      "Policy changes to incentive programmes that underpin project economics",
    ],
    publicSignals: [
      "Interconnection queue length and wait times published by grid operators",
      "Data centre construction starts and permitting activity",
      "Book-to-bill at the large power and thermal equipment vendors",
    ],
    investorQuestions: [
      "Is the demand driver a structural change or a window created by a constraint someone is working to remove?",
      "How much of the economics sits in the service annuity rather than in the equipment sale?",
      "For behind-the-meter positions, how repeatable is the regulatory approval across territories?",
      "What happens to this business in a year where data centre construction pauses?",
    ],
  },
];

export const SECTOR_BY_SLUG: Record<string, SectorResearch> =
  Object.fromEntries(SECTOR_RESEARCH.map((s) => [s.slug, s]));

export function getSectorResearch(slug: string): SectorResearch | undefined {
  return SECTOR_BY_SLUG[slug];
}

/** The research page covering a given universe sector, where one exists. */
export function researchForSector(sector: Sector): SectorResearch | undefined {
  return SECTOR_RESEARCH.find((r) => r.sectors.includes(sector));
}

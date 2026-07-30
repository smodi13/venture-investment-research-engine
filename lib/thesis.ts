/**
 * The featured investment thesis.
 *
 * A thesis is only useful if it can be wrong. Every section here is written so
 * that a reader can identify what would falsify it, which is why the
 * disproving questions are given the same weight as the argument itself.
 */

export interface ThesisSection {
  heading: string;
  paragraphs: string[];
}

export interface ThesisLayer {
  layer: string;
  constraint: string;
  /** Who captures margin at this layer, stated plainly. */
  whoCaptures: string;
  publicIds: string[];
  privateIds: string[];
}

export const THESIS = {
  title: "The infrastructure required for scaled AI inference",
  subtitle:
    "Training built the current AI infrastructure market. Inference will decide who keeps it.",
  snapshotDate: "2026-03-31",
  lastReviewed: "2026-07-28",
  summary:
    "Inference and training are different workloads with different economics, and the infrastructure optimised for one is not optimised for the other. As deployed compute shifts toward inference, the constraints move from raw arithmetic throughput toward memory bandwidth, interconnect, power, and heat. That migration relocates margin down the stack, into layers that have historically been valued as industrial businesses rather than as technology ones.",

  sections: [
    {
      heading: "Training and inference are not the same problem",
      paragraphs: [
        "Training is a batch job. It runs on a dedicated cluster, tolerates high latency, saturates every accelerator continuously, and is performed by a small number of organisations. Its economics are those of a capital project: buy a cluster, run it hard, amortise it.",
        "Inference is a service. Traffic arrives unevenly, latency is visible to the end user, many different models are served from the same fleet, and the workload is run by a very large number of organisations rather than by a handful. Its economics are those of an operating business: cost per request matters continuously, and utilisation is a daily concern rather than a procurement decision.",
        "This difference has a direct consequence. Training rewards peak arithmetic throughput and tolerates proprietary software, because the small number of buyers will invest in whatever stack delivers the best cluster. Inference rewards memory bandwidth, low latency, and portability, because a large number of buyers care about cost per unit of output and have little appetite for lock-in.",
      ],
    },
    {
      heading: "Inference is a memory problem before it is a compute problem",
      paragraphs: [
        "Generating a token from a large model requires reading the model weights. For models of current size, moving those weights consumes more time and more energy than the arithmetic performed on them. Adding arithmetic capability to an accelerator that is already waiting on memory does not help.",
        "This is why high bandwidth memory has moved from a commodity component to an allocated one, sold on long-term agreements by three manufacturers globally. It is also why accelerator architectures aimed specifically at inference tend to make unusual memory choices, trading away training capability for bandwidth or on-package capacity.",
        "The practical test for any inference infrastructure claim is whether it addresses weight movement. Claims framed purely around arithmetic throughput are describing the part of the problem that is not currently binding.",
      ],
    },
    {
      heading: "Interconnect grows faster than accelerator volume",
      paragraphs: [
        "Serving a large model frequently requires several accelerators working as one machine, which makes the links between them part of the critical path rather than a peripheral concern. As accelerator counts per rack rise, the number of links rises faster, because connectivity scales more than linearly with the number of endpoints.",
        "That is the structural reason connectivity suppliers can grow faster than the accelerator market itself: content per rack increases with each generation even if unit volumes are flat. It is also why interconnect standard transitions are the moments when competitive position at this layer is won and lost.",
        "The physical limit is real and approaching. Electrical signalling reach shortens as data rates rise, which progressively moves the crossover point where optics becomes necessary from between racks to inside them. That transition is expensive, technically difficult, and has repeatedly arrived later than predicted.",
      ],
    },
    {
      heading: "Power and heat are now the binding constraint on deployment",
      paragraphs: [
        "The most consequential change of the past two years is that data centre operators can obtain accelerators faster than they can obtain electricity. Grid interconnection queues in the most active regions are measured in years, which means a facility can be fully equipped and unable to operate.",
        "Heat follows power directly. Rack densities have risen past what air cooling can remove, which forces liquid cooling into facilities that were not designed for it. This is a construction and retrofit problem as much as an engineering one, and it is bound to building schedules that cannot be accelerated by spending more.",
        "The result is that a set of industrial companies, and a small set of startups working on behind-the-meter power and direct-to-chip cooling, now sit on the critical path of AI deployment. Whether that is a structural change or a window depends entirely on how quickly grid capacity expands.",
      ],
    },
    {
      heading: "Where the margin goes",
      paragraphs: [
        "In a scarcity regime, the scarce layer captures the margin. Through the training buildout that layer was accelerator silicon, protected by a software ecosystem that made switching expensive. As the workload mix shifts toward inference, two things happen at once: the software moat matters less, because inference is more portable, and the scarce layer moves toward memory, interconnect, and power.",
        "The investable implication is not that the accelerator position collapses. It is that the ratio between what the accelerator layer captures and what the layers around it capture should compress. Positions in memory, interconnect, and thermal management are exposed to the same demand driver with less exposure to the specific competitive threat that inference creates.",
        "The offsetting risk is that these layers are also where hyperscaler vertical integration is most credible, and where industrial cyclicality is real. A position bought on AI exposure at an industrial company still owns an industrial company if construction pauses.",
      ],
    },
    {
      heading: "What this thesis is not claiming",
      paragraphs: [
        "It does not claim that the incumbent accelerator position is about to break. The software ecosystem is genuinely deep and the company has repeatedly extended its lead by moving up the stack into systems and networking.",
        "It does not claim that co-packaged optics or inference-specific silicon will succeed on any particular schedule. Both have been predicted as imminent for several years, and both have repeatedly slipped.",
        "It does not claim a market size. Top-down sizing of this category has been wrong in both directions repeatedly, and publishing a number would add false precision to an argument that stands on structure instead.",
      ],
    },
  ] satisfies ThesisSection[],

  valueChain: [
    {
      layer: "Accelerator silicon",
      constraint:
        "Arithmetic throughput is no longer the binding constraint for inference on large models.",
      whoCaptures:
        "Captures the largest share today, protected by software rather than silicon. Most exposed as workloads shift toward inference.",
      publicIds: ["nvda", "amd", "avgo"],
      privateIds: ["halden-compute"],
    },
    {
      layer: "High bandwidth memory",
      constraint:
        "Weight movement dominates inference energy and latency. Memory bandwidth sets the ceiling.",
      whoCaptures:
        "Three manufacturers globally, now selling on long-term agreements rather than at spot prices. Structurally improved position.",
      publicIds: ["mu"],
      privateIds: [],
    },
    {
      layer: "Interconnect and networking",
      constraint:
        "Electrical reach shortens as data rates rise, moving the optical crossover inside the rack.",
      whoCaptures:
        "Content per rack grows faster than unit volumes. Specialists can hold position between standard transitions.",
      publicIds: ["alab", "crdo", "avgo"],
      privateIds: ["meridian-fabric"],
    },
    {
      layer: "Power delivery",
      constraint:
        "Grid interconnection queues exceed equipment lead times in the most active regions.",
      whoCaptures:
        "Industrial margins, with regulatory approval as the real barrier in the behind-the-meter segment.",
      publicIds: ["vrt", "be"],
      privateIds: ["anvil-grid"],
    },
    {
      layer: "Thermal management",
      constraint:
        "Rack densities exceed what air cooling can remove, forcing liquid into facilities not designed for it.",
      whoCaptures:
        "Equipment margins improving with liquid attach. The installed base service annuity is the durable asset.",
      publicIds: ["vrt"],
      privateIds: ["coldbrook-thermal"],
    },
    {
      layer: "Serving and scheduling software",
      constraint:
        "Utilisation on mixed-model inference fleets falls well below hardware capability.",
      whoCaptures:
        "Software margins on a small base, and the most contestable layer, because platform owners can bundle at no marginal cost.",
      publicIds: [],
      privateIds: ["larkspur-systems"],
    },
  ] satisfies ThesisLayer[],

  bottlenecks: [
    "Memory bandwidth and capacity per accelerator package",
    "Advanced packaging capacity, which gates accelerator and memory output together",
    "Electrical interconnect reach at rising data rates",
    "Grid interconnection availability in the regions where operators want to build",
    "Heat removal at rack densities beyond air cooling",
  ],

  bullCase: [
    "Inference volume grows into a larger and more recurring market than training ever was, because it scales with deployed applications rather than with model development.",
    "Memory, interconnect, power, and thermal all capture a rising share of the total infrastructure dollar as the constraint moves down the stack.",
    "Enterprise inference adoption broadens the buyer base well beyond the current concentrated set, reducing the negotiating leverage that currently sits with a handful of customers.",
  ],

  bearCase: [
    "A digestion period follows the current buildout, and every layer with a fixed cost base is exposed simultaneously.",
    "Hyperscalers integrate vertically at several layers at once, taking accelerator, interconnect, and cooling design in-house.",
    "Model efficiency improvements reduce the compute required per unit of output faster than demand grows, which would soften the entire chain.",
    "Grid capacity expands faster than expected, removing the constraint that repriced the power and thermal layer.",
  ],

  investmentImplications: [
    "Prefer exposure to the layers where the constraint is moving rather than to the layer where it currently sits, since the current layer is where the most capital is already positioned.",
    "In private companies, weight the qualification and deployment evidence far above the technical specification, because this sector's history is full of technically superior products that never completed qualification.",
    "Treat any industrial company repriced on AI exposure as an industrial company first, and underwrite the construction cycle rather than the narrative.",
    "Size positions in pre-commercial layers as options, and be explicit about the financing required before the proving milestone arrives.",
  ],

  disprovingQuestions: [
    "If inference is memory bound, why has accelerator gross margin not compressed as memory suppliers gained pricing power?",
    "What would it take for the software ecosystem advantage to hold at the inference layer as firmly as it holds at the training layer?",
    "If the optical crossover has been predicted for five years and repeatedly slipped, what is different about the current prediction?",
    "How much of the power and thermal repricing survives a two-year expansion in grid interconnection capacity?",
    "If model efficiency improves faster than deployment grows, which layer suffers first, and is that visible in any current disclosure?",
  ],

  risks: [
    {
      risk: "Vertical integration",
      detail:
        "The largest customers at every layer are also the most credible competitors, and several have active internal programmes.",
    },
    {
      risk: "Technical obsolescence",
      detail:
        "Interconnect and memory architectures change between generations, and a supplier designed around the current assumption can lose an entire cycle.",
    },
    {
      risk: "Capital intensity",
      detail:
        "Accelerator silicon, memory manufacturing, and photonic packaging all require capital before commercial proof, which puts financing and evidence in the wrong order.",
    },
    {
      risk: "Supply chain constraint",
      detail:
        "Advanced packaging, high bandwidth memory, and heavy electrical equipment all have long lead times and few suppliers.",
    },
  ],
} as const;

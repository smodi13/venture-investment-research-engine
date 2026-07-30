/**
 * The featured frontier technology thesis.
 *
 * Public companies appear here only as market context. Every investment
 * opportunity named is a real private company from the verified sourcing
 * universe. No fictional company appears anywhere.
 */

export interface ThesisSection {
  heading: string;
  paragraphs: string[];
}

export interface ThesisLayer {
  layer: string;
  constraint: string;
  whoCaptures: string;
  /** Public companies, as market signal only. */
  publicSignalIds: string[];
  /** Private sourcing candidates operating at this layer. */
  privateIds: string[];
}

export const THESIS = {
  title: "The infrastructure required for scaled AI inference",
  subtitle:
    "Training built the current AI infrastructure market. Inference will decide who keeps it.",
  snapshotDate: "2026-07-30",
  summary:
    "Inference and training are different workloads with different economics, and the infrastructure optimised for one is not optimised for the other. As deployed compute shifts toward inference, the binding constraint moves from arithmetic throughput toward memory bandwidth, interconnect, power, and heat. That migration relocates margin down the stack, into layers where private companies can still take a position.",

  sections: [
    {
      heading: "Training and inference are not the same problem",
      paragraphs: [
        "Training is a batch job. It runs on a dedicated cluster, tolerates latency, saturates every accelerator continuously, and is performed by a small number of organisations. Its economics are those of a capital project.",
        "Inference is a service. Traffic arrives unevenly, latency is visible to the end user, many models are served from the same fleet, and the workload is run by a very large number of organisations. Its economics are those of an operating business, where cost per unit of output matters continuously.",
        "The consequence is direct. Training rewards peak arithmetic throughput and tolerates proprietary software, because the small number of buyers will invest in whatever stack delivers the best cluster. Inference rewards memory bandwidth, low latency, and portability, because a large number of buyers care about cost per token and have little appetite for lock-in.",
      ],
    },
    {
      heading: "Inference is a memory problem before it is a compute problem",
      paragraphs: [
        "Generating a token requires reading the model weights. For models of current size, moving those weights consumes more time and more energy than the arithmetic performed on them. Adding arithmetic capability to an accelerator that is already waiting on memory does not help.",
        "This is why memory bandwidth has become the operative constraint, and why the most interesting private architectures attack data movement rather than arithmetic. d-Matrix performs multiplication inside the memory array. Etched removes the generality that costs a programmable part its area and power. Both are addressing the part of the problem that actually binds.",
        "The practical test for any inference infrastructure claim is whether it addresses weight movement. Claims framed purely around peak throughput are describing the part of the problem that is not currently binding.",
      ],
    },
    {
      heading: "Interconnect grows faster than accelerator volume",
      paragraphs: [
        "Serving a large model frequently requires several accelerators working as one machine, which makes the links between them part of the critical path. As accelerator counts per rack rise, the number of links rises faster, because connectivity scales more than linearly with the number of endpoints.",
        "That is the structural reason interconnect suppliers can grow faster than the accelerator market itself: content per rack increases with each generation even if unit volumes are flat. Ayar Labs and Lightmatter are both private positions at this layer, taking different architectural approaches to the same physical constraint.",
        "The category also demonstrates why private status has to be re-verified rather than assumed. A directly comparable private company at this layer was acquired by a public semiconductor company in February 2026, which removed it from the sourcing universe entirely.",
      ],
    },
    {
      heading: "Power and heat are now the binding constraint on deployment",
      paragraphs: [
        "The most consequential change of the past two years is that data centre operators can obtain accelerators faster than they can obtain electricity. Interconnection queues in the most active regions are measured in years, which means a facility can be fully equipped and unable to operate.",
        "This pulls a set of energy companies onto the critical path of AI deployment. Base Power aggregates distributed batteries and holds a retail electricity licence. Antora Energy stores energy as high-temperature heat for industrial loads. Radiant Industries is developing transportable microreactors with a fuelled test scheduled at a Department of Energy facility.",
        "Whether this is a structural change or a window depends on how quickly grid capacity expands, and an investor should be explicit about which they are underwriting.",
      ],
    },
    {
      heading: "Where the margin goes",
      paragraphs: [
        "In a scarcity regime, the scarce layer captures the margin. Through the training buildout that layer was accelerator silicon, protected by a software ecosystem that made switching expensive. As the workload mix shifts toward inference, the software moat matters less, because inference is more portable, and the scarce layer moves toward memory, interconnect, and power.",
        "The investable implication is not that the incumbent accelerator position collapses. It is that the ratio between what the accelerator layer captures and what the layers around it capture should compress, and the layers around it are where private companies can still take meaningful positions.",
        "The offsetting risk is that these are also the layers where hyperscaler vertical integration is most credible, and where capital intensity is highest.",
      ],
    },
    {
      heading: "What this thesis is not claiming",
      paragraphs: [
        "It does not claim the incumbent accelerator position is about to break. The software ecosystem is genuinely deep and the company has repeatedly extended its lead by moving up the stack.",
        "It does not claim that co-packaged optics, photonic interconnect, or inference-specific silicon will succeed on any particular schedule. All three have been predicted as imminent for several years and all three have repeatedly slipped.",
        "It does not publish a market size. Top-down sizing of this category has been wrong in both directions repeatedly, and a number would add false precision to an argument that stands on structure instead.",
      ],
    },
  ] satisfies ThesisSection[],

  valueChain: [
    {
      layer: "Inference accelerator silicon",
      constraint:
        "Arithmetic throughput is no longer binding for inference on large models. Weight movement is.",
      whoCaptures:
        "Captures the largest share today, protected by software rather than silicon. Most exposed as workloads shift toward inference.",
      publicSignalIds: ["nvda", "amd", "avgo"],
      privateIds: ["etched", "d-matrix"],
    },
    {
      layer: "Memory",
      constraint:
        "Memory bandwidth and capacity set the ceiling on inference throughput.",
      whoCaptures:
        "Three manufacturers globally, selling on long-term agreements rather than at spot prices.",
      publicSignalIds: ["mu"],
      privateIds: [],
    },
    {
      layer: "Interconnect",
      constraint:
        "Electrical reach shortens as data rates rise, moving the optical crossover inside the rack.",
      whoCaptures:
        "Content per rack grows faster than unit volumes. Specialists can hold position between standard transitions.",
      publicSignalIds: ["avgo", "mrvl"],
      privateIds: ["ayar-labs", "lightmatter"],
    },
    {
      layer: "Power delivery and generation",
      constraint:
        "Grid interconnection queues exceed equipment lead times in the most active regions.",
      whoCaptures:
        "Industrial margins, with regulatory licensing as the real barrier in distributed generation.",
      publicSignalIds: ["vrt"],
      privateIds: ["base-power", "antora-energy", "radiant-industries"],
    },
    {
      layer: "Owned compute infrastructure",
      constraint:
        "Organisations that cannot use public cloud must assemble and operate infrastructure themselves.",
      whoCaptures:
        "Systems margins with a services attach, in a category most vendors have abandoned to hyperscalers.",
      publicSignalIds: [],
      privateIds: ["oxide-computer"],
    },
  ] satisfies ThesisLayer[],

  technicalBottlenecks: [
    "Memory bandwidth and capacity per accelerator package",
    "Advanced packaging capacity, which gates accelerator and memory output together",
    "Electrical interconnect reach at rising data rates",
    "Heat removal at rack densities beyond air cooling",
  ],

  commercialBottlenecks: [
    "Qualification cycles at hyperscale customers measured in years, which forfeit a full generation when missed",
    "Software maturity, which decides accelerator purchasing more often than silicon performance does",
    "Grid interconnection timelines, which gate deployment independently of equipment availability",
  ],

  bullCase: [
    "Inference volume grows into a larger and more recurring market than training ever was, because it scales with deployed applications rather than with model development.",
    "Memory, interconnect, and power each capture a rising share of the total infrastructure dollar as the constraint moves down the stack.",
    "Enterprise inference adoption broadens the buyer base well beyond the current concentrated set, reducing the negotiating leverage that sits with a handful of customers.",
  ],

  bearCase: [
    "A digestion period follows the current buildout, and every layer with a fixed cost base is exposed simultaneously.",
    "Hyperscalers integrate vertically at several layers at once, taking accelerator, interconnect, and cooling design in house.",
    "Model efficiency improvements reduce compute per unit of output faster than demand grows.",
    "Grid capacity expands faster than expected, removing the constraint that repriced the power layer.",
  ],

  investmentImplications: [
    "Prefer exposure to the layers where the constraint is moving rather than to the layer where it currently sits, since the current layer is where the most capital is already positioned.",
    "Weight qualification and deployment evidence far above technical specification. This sector's history is full of technically superior products that never completed qualification.",
    "Treat capital intensity as a first-order variable. Several of these positions require hundreds of millions of dollars before any externally checkable commercial evidence exists.",
    "Re-verify private status before every decision. One directly comparable company in this thesis was acquired by a public company mid-research.",
  ],

  disprovingQuestions: [
    "If inference is memory bound, why has accelerator gross margin not compressed as memory suppliers gained pricing power?",
    "What would it take for the software ecosystem advantage to hold at the inference layer as firmly as it holds at training?",
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
        "Interconnect and memory architectures change between generations, and a supplier designed around the current assumption can lose an entire cycle. Fixed-function silicon carries this risk most acutely.",
    },
    {
      risk: "Capital intensity",
      detail:
        "Accelerator silicon, photonics, and nuclear generation all require capital before commercial proof, which puts financing and evidence in the wrong order.",
    },
    {
      risk: "Supply chain constraint",
      detail:
        "Advanced packaging, high bandwidth memory, and heavy electrical equipment all have long lead times and few suppliers.",
    },
  ],
} as const;

import type { Company } from "./types";

/**
 * DEMONSTRATION DATASET
 * ---------------------
 * Every record below is a clearly labeled sample lead (isDemo: true). These are
 * illustrative profiles created to demonstrate the sourcing workflow across
 * early technical markets. They are NOT real companies. Founder names, company
 * names, X handles, funding figures, engagement counts, and scores are all
 * illustrative, and no factual claim is made about any real business, account,
 * or person.
 *
 * The dataset is intentionally diverse across category, region, stage, signal
 * type, database visibility, and pipeline status so the dashboard, filters,
 * scoring, and analytics can be evaluated end to end.
 */

export const COMPANIES: Company[] = [
  {
    id: "lead-01",
    name: "Solvent Labs",
    isDemo: true,
    founder: "Dana Reyes",
    founderTitle: "Co-founder & CEO",
    hq: "Boston, MA",
    region: "US Northeast",
    category: "AI Drug Discovery",
    stage: "Pre-Seed",
    fundingRaisedUSD: 900_000,
    foundedYear: 2026,
    website: "https://example.com/solvent-labs",
    linkedin: "https://example.com/linkedin/solvent-labs",
    description:
      "Learned force fields for solvation free energy, packaged so a medicinal chemistry team can rank compound series overnight instead of waiting on a queue for physics-based simulation.",
    thesisFit:
      "Infrastructure underneath drug discovery rather than a therapeutics bet: the company sells compute-time and accuracy back to every pharma team, so the outcome is not tied to one molecule succeeding in the clinic.",
    signal: {
      type: "Open-source release",
      handle: "@solventlabs",
      excerpt:
        "Released our solvation model and the full benchmark harness. We are 0.4 kcal/mol RMSE on the held-out FreeSolv split at roughly 1/300th the wall clock of the physics baseline. Weights, eval scripts, and the failure cases we could not fix are all in the repo.",
      observedAt: "2026-07-14",
      engagement: "2.4K likes, 610 reposts, 190 replies (illustrative)",
      whySurfaced:
        "Cleared the noise filter on three independent signals in one post: a quantitative benchmark against a named public split, published failure cases, and a repository under a new organization created six weeks earlier.",
      corroboration: [
        "GitHub organization created 2026-05-28; two contributors, both previously committing to an academic simulation package.",
        "A domain registration for the company name predating the post by five weeks.",
        "Reply thread includes two computational chemists at named pharma companies asking about an on-prem deployment.",
      ],
    },
    visibility: "Not listed",
    daysAheadOfDatabases: 96,
    dateDiscovered: "2026-07-15",
    scores: {
      founder: 17,
      signal: 13,
      earliness: 12,
      thesis: 11,
      demand: 8,
      technical: 10,
      market: 7,
      timing: 5,
      stage: 4,
    },
    founderBackground:
      "Inferred from public commit history and conference programs: roughly six years of computational chemistry research, with maintainer-level contributions to an open-source molecular simulation package. Treat the depth of industry experience as an open question until a direct conversation, since none of the public record shows time inside a pharma discovery team.",
    marketOpportunity:
      "Every discovery program runs solvation and binding calculations, and the physics-based tools that dominate today are accurate but slow and licensed per-seat at high cost. The opening is the mid-size biotech that cannot justify a full simulation group but still needs to triage a few thousand compounds a month.",
    whyNow:
      "Learned force fields only became credible for this endpoint in the last two years as training sets and equivariant architectures matured. Before that, accuracy loss versus physics was too large for a chemist to act on the ranking.",
    evidence: [
      {
        claim:
          "Public benchmark result on a named held-out split, with reproducible eval scripts in the repository.",
        confidence: "Observed",
      },
      {
        claim:
          "Two computational chemists at named pharma companies publicly asked about on-prem deployment.",
        confidence: "Observed",
      },
      {
        claim:
          "Founder mentions three design partners in a follow-up reply; none are named.",
        confidence: "Founder-reported",
      },
      {
        claim:
          "Commit cadence suggests two full-time engineers rather than a nights-and-weekends project.",
        confidence: "Inferred",
      },
    ],
    concerns: [
      "The benchmark is a public split the model may have been tuned against; an internal pharma test set is the only meaningful proof.",
      "Open-sourcing the weights makes the commercial wedge unclear. Support and on-prem deployment may not be defensible on their own.",
      "No evidence of anyone on the team having sold into pharma IT, which is a long and painful procurement cycle.",
    ],
    diligenceQuestions: [
      "What accuracy do you hold on a customer's internal, never-published compound set, and has any partner run that test?",
      "If the weights are public, what does a customer actually pay for in year two?",
      "Which specific decision inside a discovery program changes because the ranking arrived overnight instead of in a week?",
    ],
    outreach:
      "Hi Dana, I read the solvation release and spent an evening in the eval harness. Publishing the failure cases alongside the RMSE is the part that made me want to reach out; most releases in this space do not. I work with a venture fund, where we back technical founders at pre-seed and seed. Would you be open to a short call about what the on-prem conversations with the pharma teams in your replies have looked like?",
  },
  {
    id: "lead-02",
    name: "Rotamer",
    isDemo: true,
    founder: "Priya Menon",
    founderTitle: "Founder",
    hq: "San Francisco, CA",
    region: "US West Coast",
    category: "AI Drug Discovery",
    stage: "Stealth",
    fundingRaisedUSD: 0,
    foundedYear: 2026,
    website: "https://example.com/rotamer",
    linkedin: "https://example.com/linkedin/rotamer",
    description:
      "GPU-native conformational sampling for flexible protein targets, aimed at the cases where rigid-receptor docking quietly produces confident and wrong answers.",
    thesisFit:
      "A narrow, deeply technical wedge into a workflow every structure-based discovery team already runs. Stealth-stage and pre-institutional, which is exactly the window this engine is built to catch.",
    signal: {
      type: "Technical thread",
      handle: "@p_menon_bio",
      excerpt:
        "Unpopular opinion: most docking benchmarks are measuring how rigid your test set is. Ran the same 400 targets with induced-fit sampling and the ranking inverts for about a third of them. Thread with the numbers, and yes this is what I quit my job to work on.",
      observedAt: "2026-06-30",
      engagement: "1.8K likes, 340 reposts, 260 replies (illustrative)",
      whySurfaced:
        "Explicit quit-my-job disclosure paired with original quantitative work, from an account with a two-year history of technical posting and no prior promotion. The engine weights an unprompted career-change statement heavily.",
      corroboration: [
        "Account bio changed from a named research institute to 'building something' in the same week.",
        "No company registration, domain, or LinkedIn page found at time of scoring.",
        "Two follow-up posts describing GPU kernel work, consistent with a real implementation rather than a paper.",
      ],
    },
    visibility: "Not listed",
    daysAheadOfDatabases: 140,
    dateDiscovered: "2026-07-01",
    scores: {
      founder: 15,
      signal: 11,
      earliness: 13,
      thesis: 10,
      demand: 4,
      technical: 9,
      market: 5,
      timing: 4,
      stage: 3,
    },
    founderBackground:
      "Inferred from publication record and the account's own history: structural biology research background with a recent shift toward GPU implementation work. The bio change and the quit-my-job line are the strongest available evidence that this is now full-time, but nothing is confirmed. Assume solo until proven otherwise.",
    marketOpportunity:
      "Structure-based drug design is a mature spend line, but flexible and cryptic-pocket targets remain badly served. The addressable slice is smaller than 'docking' overall, which is a feature at this stage: it is a real, specific complaint from a defined set of users.",
    whyNow:
      "Consumer-grade GPU capacity and better sampling algorithms have moved induced-fit work from a supercomputer job to something a single workstation can do overnight.",
    evidence: [
      {
        claim:
          "Original benchmark across 400 targets shared publicly with methodology in-thread.",
        confidence: "Observed",
      },
      {
        claim:
          "Account bio changed away from a research institute in the same week as the post.",
        confidence: "Observed",
      },
      {
        claim:
          "Working full-time on this; no co-founder mentioned anywhere public.",
        confidence: "Inferred",
      },
    ],
    concerns: [
      "No company, no entity, no product. This is a person with a result, which is the earliest and riskiest point to engage.",
      "Solo technical founder with no commercial counterpart visible.",
      "The 400-target benchmark is self-reported and has not been independently reproduced.",
    ],
    diligenceQuestions: [
      "Is this a company or a paper? What would need to be true in ninety days for you to commit to the former?",
      "Which of the inverted rankings would a medicinal chemist have caught anyway, and which were genuinely new information?",
      "What is the first workflow you would sell, and to whom inside the organization?",
    ],
    outreach:
      "Hi Priya, the induced-fit thread was the most interesting thing I read that week, particularly the part about benchmarks measuring test-set rigidity. I noticed the bio change. I work with a venture fund and we spend most of our time with technical founders at exactly this point, often before there is a company. No pitch needed. Would you be up for a call about what you are building toward?",
  },
  {
    id: "lead-03",
    name: "Assay Loop",
    isDemo: true,
    founder: "Marcus Whitfield",
    founderTitle: "Co-founder & CTO",
    hq: "San Diego, CA",
    region: "US West Coast",
    category: "AI Drug Discovery",
    stage: "Pre-Seed",
    fundingRaisedUSD: 1_200_000,
    foundedYear: 2025,
    website: "https://example.com/assay-loop",
    linkedin: "https://example.com/linkedin/assay-loop",
    description:
      "Closes the design-make-test-analyze loop for small wet-lab teams by pulling assay results back into the next round of compound selection automatically, instead of through a chemist's spreadsheet.",
    thesisFit:
      "Workflow software with a proprietary data loop underneath: every cycle a customer runs makes the selection model better, which is the kind of compounding asset that is hard to replicate later.",
    signal: {
      type: "Customer pain point",
      handle: "@assayloop",
      excerpt:
        "Asked twelve discovery chemists how results get from the plate reader into the next design round. Eleven said a spreadsheet someone maintains by hand. One said a spreadsheet that broke last year and nobody fixed. We are building the boring fix.",
      observedAt: "2026-05-19",
      engagement: "740 likes, 120 reposts, 95 replies (illustrative)",
      whySurfaced:
        "Customer-discovery post with a specific sample size and a specific workflow, rather than a generic market claim. The replies contained four unprompted 'this is exactly my problem' responses from identifiable lab scientists.",
      corroboration: [
        "Four replies from accounts whose bios list wet-lab roles at named institutions, describing the same manual step.",
        "Company website live with two named team members at time of scoring.",
        "A local accelerator cohort page lists the company, which is why the earliness score is moderate rather than high.",
      ],
    },
    visibility: "Thin profile",
    daysAheadOfDatabases: 41,
    dateDiscovered: "2026-05-20",
    scores: {
      founder: 12,
      signal: 9,
      earliness: 9,
      thesis: 10,
      demand: 7,
      technical: 7,
      market: 6,
      timing: 3,
      stage: 3,
    },
    founderBackground:
      "Estimated: assay development background at a contract research organization, paired with a co-founder whose public history is software. The pairing is the right shape for this problem, but neither appears to have run a commercial team before.",
    marketOpportunity:
      "Small and mid-size discovery groups are the underserved segment. The large pharma equivalent of this is an internal platform built by a team of twenty, which is exactly why a self-serve version has room.",
    whyNow:
      "Instrument vendors have finally standardized enough on structured exports that reading plate data programmatically no longer requires a per-customer integration project.",
    evidence: [
      {
        claim:
          "Four independent wet-lab scientists publicly confirmed the manual workflow in the reply thread.",
        confidence: "Observed",
      },
      {
        claim: "Two paying pilots referenced on the company site, unnamed.",
        confidence: "Founder-reported",
      },
      {
        claim:
          "Listed in a regional accelerator cohort, so a mainstream database profile is likely imminent.",
        confidence: "Observed",
      },
    ],
    concerns: [
      "The technical moat is thin at the software layer; the defensibility argument rests entirely on accumulated assay data that does not exist yet.",
      "Instrument integration work tends to expand without bound and is not glamorous fundraising material.",
      "Accelerator listing means the sourcing edge here is small, and other funds will see this within weeks.",
    ],
    diligenceQuestions: [
      "How many distinct instrument models are supported today, and what did the twelfth integration cost you in engineering weeks?",
      "At what point does accumulated assay data actually improve selection, and can you show that curve on pilot data?",
      "What happens to your wedge if a major instrument vendor ships this natively?",
    ],
    outreach:
      "Hi Marcus, the twelve-chemist post was a better market map than most decks I see, especially the one where the spreadsheet broke and nobody fixed it. I work with a venture fund on early technical companies. I would like to understand where the integration work has been hardest and how the pilot data is trending. Any chance of twenty minutes?",
  },
  {
    id: "lead-04",
    name: "Tendon Robotics",
    isDemo: true,
    founder: "Ana Sørensen",
    founderTitle: "Co-founder & CEO",
    hq: "Pittsburgh, PA",
    region: "US Northeast",
    category: "Robotics & Physical AI",
    stage: "Pre-Seed",
    fundingRaisedUSD: 1_500_000,
    foundedYear: 2025,
    website: "https://example.com/tendon-robotics",
    linkedin: "https://example.com/linkedin/tendon-robotics",
    description:
      "Compliant manipulation for high-mix, low-volume assembly, where the part changes every few hundred units and reprogramming a rigid arm costs more than the labor it replaces.",
    thesisFit:
      "Physical AI with a real hardware component and a customer segment that has been structurally ignored because it is not automotive-scale. Hard to build, hard to copy, and the founders have the manipulation background to attempt it.",
    signal: {
      type: "Product demo",
      handle: "@tendonrobotics",
      excerpt:
        "Uncut, single take, no resets: the arm picks and seats twelve different connector types it has never seen, back to back. Failure at 0:47 is real and we left it in. Contact-rich insertion is the whole game and nobody wants to show the failures.",
      observedAt: "2026-06-08",
      engagement: "5.1K likes, 1.3K reposts, 380 replies (illustrative)",
      whySurfaced:
        "Uncut video with a visible failure left in is the highest-weight signal type in the model. It is the hardest class of post to fake and correlates strongly with a working system rather than a rendered one.",
      corroboration: [
        "Follow-up post shows the same rig from a different angle with a serial-numbered gripper.",
        "Two robotics researchers with no apparent relationship to the company publicly vouched for the difficulty of the task shown.",
        "Job posting for a controls engineer on the company site, listing a physical Pittsburgh address.",
      ],
    },
    visibility: "Not listed",
    daysAheadOfDatabases: 78,
    dateDiscovered: "2026-06-09",
    scores: {
      founder: 16,
      signal: 12,
      earliness: 11,
      thesis: 12,
      demand: 9,
      technical: 10,
      market: 6,
      timing: 4,
      stage: 4,
    },
    founderBackground:
      "Inferred: robotics manipulation research background with several years in a university lab known for contact-rich control, plus a co-founder with mechanical design experience at a robotics integrator. The integrator experience matters more than the research pedigree here, because this customer buys installed systems, not algorithms.",
    marketOpportunity:
      "High-mix assembly is a large share of manufacturing employment and almost none of it is automated, because fixed automation only pays back at volume. The prize is real but the sales motion is slow and site-by-site.",
    whyNow:
      "Force-torque sensing has become cheap enough to put on every joint, and learned contact policies have finally started to transfer across part geometries rather than being retrained per SKU.",
    evidence: [
      {
        claim:
          "Uncut demo video showing twelve unseen connector types, including a failure case.",
        confidence: "Observed",
      },
      {
        claim:
          "Two independent robotics researchers publicly attested to the difficulty of the demonstrated task.",
        confidence: "Observed",
      },
      {
        claim:
          "One paid pilot at a regional contract manufacturer mentioned in a reply.",
        confidence: "Founder-reported",
      },
      {
        claim:
          "Active controls engineer job posting implies funded runway beyond the founders.",
        confidence: "Inferred",
      },
    ],
    concerns: [
      "Hardware capital intensity at pre-seed; the round size implied by the hiring plan may exceed what the traction supports.",
      "The demo shows twelve connector types, not twelve thousand parts. Generalization beyond the demonstrated class is unproven.",
      "Contract manufacturers are slow, price-sensitive buyers with long procurement cycles.",
    ],
    diligenceQuestions: [
      "What is the failure rate across a full production shift, not a demo take, and how is it trending?",
      "How much per-site engineering does the first install require today, and what is your plan to get that to zero?",
      "What did the pilot customer pay, and would they buy a second cell today at list price?",
    ],
    outreach:
      "Hi Ana, I watched the twelve-connector take, including the failure at 0:47 that you left in. Leaving it in is why I am writing. I work with a venture fund, where we back technical founders at pre-seed and seed, and contact-rich manipulation is a space we spend real time on. Would you be open to a conversation about how the pilot is holding up over full shifts?",
  },
  {
    id: "lead-05",
    name: "Harborline Autonomy",
    isDemo: true,
    founder: "Tobias Lund",
    founderTitle: "Co-founder & CEO",
    hq: "Seattle, WA",
    region: "US West Coast",
    category: "Robotics & Physical AI",
    stage: "Seed",
    fundingRaisedUSD: 3_100_000,
    foundedYear: 2024,
    website: "https://example.com/harborline",
    linkedin: "https://example.com/linkedin/harborline",
    description:
      "Perception and autonomy retrofit for working marine vessels such as tugs, ferries, and survey boats, focused on collision avoidance and docking assist rather than full unmanned operation.",
    thesisFit:
      "Physical AI in a domain with clear regulatory gates and a customer that already buys expensive equipment. The retrofit framing avoids the trap of needing a new vessel to exist before revenue does.",
    signal: {
      type: "Hiring signal",
      handle: "@harborline_auto",
      excerpt:
        "Hiring a maritime certification lead. If you have taken a system through class society approval and want to do it again for autonomy, we should talk. This is the least glamorous and most important role we will fill this year.",
      observedAt: "2026-05-02",
      engagement: "410 likes, 88 reposts, 40 replies (illustrative)",
      whySurfaced:
        "A certification hire is a strong maturity signal. Companies do not staff class society approval until they have a system worth certifying and a customer waiting on it.",
      corroboration: [
        "Three additional engineering roles posted the same month, implying a funded round not yet announced.",
        "A port authority newsletter references an autonomy trial without naming the vendor; timing and location are consistent.",
        "Company has a thin database profile listing a 2024 founding but no funding data.",
      ],
    },
    visibility: "Thin profile",
    daysAheadOfDatabases: 34,
    dateDiscovered: "2026-05-04",
    scores: {
      founder: 14,
      signal: 11,
      earliness: 9,
      thesis: 11,
      demand: 10,
      technical: 9,
      market: 6,
      timing: 5,
      stage: 3,
    },
    founderBackground:
      "Estimated: maritime operations background paired with a technical co-founder from an autonomous vehicle perception team. The maritime side is the scarcer half and appears to be genuine, based on prior roles listed publicly.",
    marketOpportunity:
      "The global working-vessel fleet is large, aging, and under pressure on crew costs and insurance. Retrofit is the realistic path; newbuild autonomy is a decade-long story.",
    whyNow:
      "Class societies published autonomy guidance recently enough that a certification path exists at all, which was the blocker until now.",
    evidence: [
      {
        claim:
          "Certification lead role posted publicly, alongside three engineering roles in the same month.",
        confidence: "Observed",
      },
      {
        claim:
          "Port authority newsletter references an unnamed autonomy trial consistent in timing and location.",
        confidence: "Inferred",
      },
      {
        claim: "Two vessel operators in paid trials.",
        confidence: "Founder-reported",
      },
    ],
    concerns: [
      "Certification timelines are outside the company's control and can consume a full round of runway.",
      "Marine is a capital-heavy, relationship-driven sales environment with few buyers, each moving slowly.",
      "The hiring burst may indicate a round already closed, which would mean this signal arrived late relative to other investors.",
    ],
    diligenceQuestions: [
      "Where exactly are you in the class society process, and what is the realistic date for first approval?",
      "Are the two trials paid, and what is the contracted path from trial to fleet rollout?",
      "Has a round already closed? If so, what changed in the plan since it did?",
    ],
    outreach:
      "Hi Tobias, I noticed you are hiring a maritime certification lead, and the way you framed it as the least glamorous and most important role of the year is a good sign about how the team thinks. I work with a venture fund on early technical companies, and the retrofit-first approach to marine autonomy is one I would like to understand better. Would a short call work?",
  },
  {
    id: "lead-06",
    name: "Grasp Index",
    isDemo: true,
    founder: "Elena Vasquez",
    founderTitle: "Founder",
    hq: "Zurich, Switzerland",
    region: "Europe",
    category: "Robotics & Physical AI",
    stage: "Stealth",
    fundingRaisedUSD: 0,
    foundedYear: 2026,
    website: "https://example.com/grasp-index",
    linkedin: "https://example.com/linkedin/grasp-index",
    description:
      "A standardized evaluation harness and sim-to-real dataset for manipulation policies, so a robotics team can tell whether a new policy is actually better or just better on the demo shelf.",
    thesisFit:
      "Picks-and-shovels for the physical AI wave. Evaluation infrastructure tends to become a standard, and standards are durable, but the monetization path at this stage is genuinely unclear.",
    signal: {
      type: "Recurring problem discussion",
      handle: "@elena_grasps",
      excerpt:
        "Fourth time this month someone has DMed me asking how to compare two manipulation policies fairly. There is no answer. Every lab has its own shelf, its own objects, its own lighting. I am going to build the boring shared benchmark because apparently nobody else will.",
      observedAt: "2026-07-06",
      engagement: "1.2K likes, 290 reposts, 210 replies (illustrative)",
      whySurfaced:
        "The engine tracks repeated discussion of the same unsolved problem across an account's history. This account had posted about evaluation inconsistency five times in four months before announcing intent to build, a pattern the model weights above a single announcement.",
      corroboration: [
        "Five prior posts across four months on the same problem, from before any commercial intent was stated.",
        "Reply thread includes researchers from three separate robotics labs offering to contribute objects and scans.",
        "No entity, domain, or funding record found at time of scoring.",
      ],
    },
    visibility: "Not listed",
    daysAheadOfDatabases: 155,
    dateDiscovered: "2026-07-07",
    scores: {
      founder: 14,
      signal: 12,
      earliness: 12,
      thesis: 10,
      demand: 3,
      technical: 9,
      market: 4,
      timing: 4,
      stage: 3,
    },
    founderBackground:
      "Inferred: manipulation research background at a European institution, with a public history of open datasets. The credibility to convene a standard appears real; the appetite to run a company does not yet.",
    marketOpportunity:
      "Small today and hard to price. The bet is that manipulation evaluation becomes the layer every robot foundation-model team pays for, in the way that evaluation tooling became a real category in language models. That is a bet on the market forming, not on capturing one that exists.",
    whyNow:
      "Robot foundation models have proliferated fast enough that the lack of a shared benchmark has become an active, publicly voiced pain rather than a theoretical one.",
    evidence: [
      {
        claim:
          "Five posts across four months documenting the same problem before any commercial intent was stated.",
        confidence: "Observed",
      },
      {
        claim:
          "Researchers from three separate labs publicly offered to contribute data.",
        confidence: "Observed",
      },
      {
        claim: "No revenue, no entity, no product.",
        confidence: "Observed",
      },
    ],
    concerns: [
      "Benchmarks are famously hard to monetize; the most likely outcome is a widely used free standard with no business attached.",
      "The founder has stated an intent to build, not to found a company. Those are different decisions.",
      "Community contributions create governance questions early, and a benchmark that a consortium controls is not a venture asset.",
    ],
    diligenceQuestions: [
      "Do you want to run a company, or do you want this benchmark to exist? Both are legitimate; they lead to different conversations.",
      "If the benchmark becomes the standard, what is the paid product sitting next to it?",
      "How would you keep a large lab from forking it and declaring their version canonical?",
    ],
    outreach:
      "Hi Elena, I have been following your posts on manipulation evaluation since the one in March about lighting conditions, and the fourth-DM post made me want to reach out properly. I work with a venture fund. I am aware you may be building a standard rather than a company, and I am interested either way. Would you be open to a call about how you are thinking about it?",
  },
  {
    id: "lead-07",
    name: "Substrate Robotics",
    isDemo: true,
    founder: "Ray Okonkwo",
    founderTitle: "Co-founder & CEO",
    hq: "Detroit, MI",
    region: "US Midwest",
    category: "Robotics & Physical AI",
    stage: "Pre-Seed",
    fundingRaisedUSD: 750_000,
    foundedYear: 2025,
    website: "https://example.com/substrate-robotics",
    linkedin: "https://example.com/linkedin/substrate-robotics",
    description:
      "Retrofit vision and control kits for legacy press and CNC lines, giving twenty-year-old machines part-level quality inspection without replacing the machine.",
    thesisFit:
      "Sells into an existing capital base rather than asking a customer to replace it. Modest technical ambition, but the founder is embedded in a customer community that most investors never touch.",
    signal: {
      type: "Build-in-public update",
      handle: "@substrate_robo",
      excerpt:
        "Month seven. Third shop floor install done. The 1998 press is now catching bad blanks before the operator does. Total hardware BOM under $4K per line. Photos of the actual install, dust and all.",
      observedAt: "2026-04-22",
      engagement: "620 likes, 95 reposts, 70 replies (illustrative)",
      whySurfaced:
        "Sustained build-in-public cadence with install counts and a stated BOM cost. Specific numbers in a recurring update series are harder to inflate than a one-off launch post.",
      corroboration: [
        "Seven monthly updates with monotonically increasing install counts.",
        "Photos show a real, dirty shop floor rather than a staged lab.",
        "A regional manufacturing trade group newsletter mentions the company by name.",
      ],
    },
    visibility: "Thin profile",
    daysAheadOfDatabases: 22,
    dateDiscovered: "2026-04-23",
    scores: {
      founder: 11,
      signal: 8,
      earliness: 8,
      thesis: 10,
      demand: 8,
      technical: 6,
      market: 5,
      timing: 3,
      stage: 3,
    },
    founderBackground:
      "Estimated: manufacturing operations background, likely on the floor rather than in engineering management. That is an asset for trust with this buyer and a question mark for building a technical team.",
    marketOpportunity:
      "There is an enormous installed base of aging machines, but each install is small-dollar and locally sold. The market is real; whether it is venture-scale depends entirely on whether installs can become self-serve.",
    whyNow:
      "Edge vision hardware finally costs little enough that a sub-$4K BOM per line is possible, which is the threshold where a small shop will authorize the spend without a committee.",
    evidence: [
      {
        claim:
          "Seven consecutive monthly updates with increasing install counts and photos.",
        confidence: "Observed",
      },
      {
        claim: "Stated hardware BOM under $4K per line.",
        confidence: "Founder-reported",
      },
      {
        claim: "Named in a regional manufacturing trade newsletter.",
        confidence: "Observed",
      },
    ],
    concerns: [
      "Three installs in seven months is a services pace, not a product pace.",
      "The computer vision work is not differentiated; the differentiation is the relationship with the shop floor, which does not scale the way software does.",
      "Small deal sizes with high install labor make the unit economics fragile until installation is self-serve.",
    ],
    diligenceQuestions: [
      "How many engineering hours does install number three take versus install number one?",
      "What would have to be true for a shop to install this without you on site?",
      "What is the annual contract value, and is there a recurring component or is this one-time hardware?",
    ],
    outreach:
      "Hi Ray, I have been reading the monthly updates since around month four, and the 1998 press catching bad blanks before the operator is a great detail. I work with a venture fund on early technical companies. The question I keep coming back to is how install four gets easier than install three. Would you be open to talking through it?",
  },
  {
    id: "lead-08",
    name: "Ledgerline AI",
    isDemo: true,
    founder: "Sofia Bergman",
    founderTitle: "Co-founder & CEO",
    hq: "New York, NY",
    region: "US Northeast",
    category: "Enterprise AI Workflow",
    stage: "Seed",
    fundingRaisedUSD: 2_800_000,
    foundedYear: 2025,
    website: "https://example.com/ledgerline",
    linkedin: "https://example.com/linkedin/ledgerline",
    description:
      "Agentic reconciliation for insurance claims back-office work, handling the exception queue where a human currently opens four systems to resolve a single mismatched payment.",
    thesisFit:
      "Enterprise AI workflow against a quantifiable, headcount-denominated cost. The founder came out of the buyer's seat, which is the pattern that most reliably shortens enterprise sales cycles.",
    signal: {
      type: "Customer pain point",
      handle: "@sofiab_ops",
      excerpt:
        "I ran a claims ops team for six years. The exception queue is not an edge case, it is 30 to 40 percent of the work, and every carrier pretends otherwise in their automation numbers. That gap is the entire business I am building.",
      observedAt: "2026-04-11",
      engagement: "3.2K likes, 700 reposts, 420 replies (illustrative)",
      whySurfaced:
        "First-person operator credibility plus a specific, checkable claim about the buyer's own process. The engine weights insider pain-point posts above outsider market-opportunity posts.",
      corroboration: [
        "Reply thread contains eleven claims-operations professionals agreeing with the 30 to 40 percent figure.",
        "Two of those replies came from accounts at named carriers.",
        "Company had a thin database profile with founding year only; funding was not listed at time of scoring.",
      ],
    },
    visibility: "Thin profile",
    daysAheadOfDatabases: 29,
    dateDiscovered: "2026-04-12",
    scores: {
      founder: 15,
      signal: 11,
      earliness: 8,
      thesis: 10,
      demand: 12,
      technical: 8,
      market: 8,
      timing: 5,
      stage: 4,
    },
    founderBackground:
      "Stated publicly and consistent with prior roles: six years running claims operations at a carrier, now paired with a technical co-founder. This is domain-insider founder-market fit, the highest-confidence variety, though it still needs verification in conversation.",
    marketOpportunity:
      "Claims back-office is a large, well-defined cost center at every carrier, and the exception queue is the part existing automation vendors have not touched. Buyers are conservative but they have budget and a number they are measured on.",
    whyNow:
      "Models became reliable enough at multi-system, multi-step reasoning to attempt exception work, which rule-based automation could never handle because exceptions are by definition the cases the rules missed.",
    evidence: [
      {
        claim:
          "Eleven claims-operations professionals publicly corroborated the 30 to 40 percent exception-rate claim.",
        confidence: "Observed",
      },
      {
        claim:
          "Two corroborating replies came from accounts at named carriers.",
        confidence: "Observed",
      },
      {
        claim: "Three carriers in paid pilots, one expanding to a second line.",
        confidence: "Founder-reported",
      },
      {
        claim:
          "Hiring pace on the company site suggests a closed round not yet announced.",
        confidence: "Inferred",
      },
    ],
    concerns: [
      "Insurance procurement and security review can add nine months to a deal, independent of product quality.",
      "Exception handling touches money movement; a single wrong reconciliation is a much worse failure than a wrong summary.",
      "Well-capitalized incumbents in claims automation will move into this if it works.",
    ],
    diligenceQuestions: [
      "What is the accuracy on exception resolution, and what is the process when the agent is wrong about a payment?",
      "Which of the three pilots is contractually committed to expansion, and on what timeline?",
      "How long did the longest security review take, and what did it require?",
    ],
    outreach:
      "Hi Sofia, the post about the exception queue being 30 to 40 percent of the work rather than an edge case was the clearest description of that problem I have read, and the reply thread was almost as useful. I work with a venture fund, backing technical and operator founders at seed. I would like to hear how the carrier pilots are progressing through security review. Would twenty minutes work?",
  },
  {
    id: "lead-09",
    name: "Praxis Ops",
    isDemo: true,
    founder: "Danielle Kaur",
    founderTitle: "Founder & CEO",
    hq: "Chicago, IL",
    region: "US Midwest",
    category: "Enterprise AI Workflow",
    stage: "Pre-Seed",
    fundingRaisedUSD: 1_100_000,
    foundedYear: 2025,
    website: "https://example.com/praxis-ops",
    linkedin: "https://example.com/linkedin/praxis-ops",
    description:
      "Field-service scheduling for electric utilities, optimizing crew dispatch against weather, outage priority, and mutual-aid constraints that current systems handle with a whiteboard.",
    thesisFit:
      "Unglamorous enterprise AI with a regulated, budget-holding buyer. Long sales cycles, but the incumbents are genuinely old and the pain is measured in outage minutes.",
    signal: {
      type: "Technical thread",
      handle: "@dkaur_grid",
      excerpt:
        "Storm restoration scheduling is a constraint problem with a human in the loop who has better information than the solver, and every vendor builds it as if that human does not exist. Thread on why the optimal schedule is the wrong output.",
      observedAt: "2026-06-17",
      engagement: "890 likes, 160 reposts, 130 replies (illustrative)",
      whySurfaced:
        "A contrarian technical claim about a specific domain, from an account with a utility-adjacent posting history. The post argues against the obvious solution, which the model treats as a marker of real domain contact.",
      corroboration: [
        "Two utility operations managers replied describing the same whiteboard workaround.",
        "Prior posts over eight months consistently about grid operations, not general AI.",
        "Company website live with a single named founder.",
      ],
    },
    visibility: "Not listed",
    daysAheadOfDatabases: 63,
    dateDiscovered: "2026-06-18",
    scores: {
      founder: 13,
      signal: 9,
      earliness: 10,
      thesis: 9,
      demand: 8,
      technical: 7,
      market: 6,
      timing: 4,
      stage: 3,
    },
    founderBackground:
      "Inferred: grid operations or utility consulting background based on eight months of consistent domain posting. Solo founder at time of scoring, which is the main structural concern.",
    marketOpportunity:
      "Roughly three thousand utilities in the US, most running scheduling software from a prior decade, all under regulatory pressure on restoration times. Concentrated buyer list, high contract values, brutal sales cycles.",
    whyNow:
      "Outage-minute penalties have tightened in several jurisdictions, which turns restoration efficiency from an operations preference into a regulatory exposure with a budget line.",
    evidence: [
      {
        claim:
          "Two utility operations managers publicly confirmed the whiteboard workaround.",
        confidence: "Observed",
      },
      {
        claim: "Eight months of consistent domain-specific technical posting.",
        confidence: "Observed",
      },
      {
        claim: "One utility in an unpaid evaluation.",
        confidence: "Founder-reported",
      },
    ],
    concerns: [
      "Solo founder selling to one of the slowest enterprise buyers that exists.",
      "The evaluation is unpaid, which at this stage says interest rather than demand.",
      "Utility software procurement often runs through a systems integrator, which can capture most of the margin.",
    ],
    diligenceQuestions: [
      "What converts the unpaid evaluation into a contract, and who signs it?",
      "Are you selling direct or through an integrator, and how does that change your economics?",
      "What is your plan for a technical co-founder or first engineering hire?",
    ],
    outreach:
      "Hi Danielle, your thread on why the optimal schedule is the wrong output was the first thing I have read that treats the dispatcher as an information source rather than an obstacle. I work with a venture fund on early technical companies. I would like to understand how the utility evaluation is going and what the path to a paid contract looks like. Would you be open to a short call?",
  },
  {
    id: "lead-10",
    name: "Casefold",
    isDemo: true,
    founder: "Nadia Haddad",
    founderTitle: "Co-founder & CEO",
    hq: "Toronto, ON",
    region: "Canada",
    category: "Enterprise AI Workflow",
    stage: "Pre-Seed",
    fundingRaisedUSD: 600_000,
    foundedYear: 2026,
    website: "https://example.com/casefold",
    linkedin: "https://example.com/linkedin/casefold",
    description:
      "Document-heavy case assembly for immigration and administrative law practices, turning a client's scattered evidence into a structured, citation-checked filing package.",
    thesisFit:
      "Real workflow pain and a clear buyer, but the technical differentiation is thinner than the rest of this pipeline. Included because the founder signal is strong enough to warrant tracking.",
    signal: {
      type: "Customer pain point",
      handle: "@casefold_app",
      excerpt:
        "A paralegal spends nine hours assembling one immigration filing package and six of those hours are finding, renaming, and cross-referencing PDFs the client already sent. We timed it across four firms.",
      observedAt: "2026-07-21",
      engagement: "530 likes, 90 reposts, 60 replies (illustrative)",
      whySurfaced:
        "Quantified time study across a named number of firms. The engine scores measured claims above asserted ones, even when the underlying technology is unremarkable.",
      corroboration: [
        "Three paralegals replied with comparable time estimates.",
        "Domain registered five months before the post.",
        "No database profile, no funding record found at time of scoring.",
      ],
    },
    visibility: "Not listed",
    daysAheadOfDatabases: 110,
    dateDiscovered: "2026-07-22",
    scores: {
      founder: 10,
      signal: 8,
      earliness: 9,
      thesis: 8,
      demand: 7,
      technical: 5,
      market: 5,
      timing: 3,
      stage: 3,
    },
    founderBackground:
      "Estimated: immigration law practice background with a technical co-founder whose public history is thin. Domain credibility appears genuine; engineering depth is unverified.",
    marketOpportunity:
      "Many small firms, low individual contract values, high willingness to pay per seat if the time saving is real. This is a good small business and an uncertain venture outcome.",
    whyNow:
      "Document understanding got good enough to handle inconsistent client-supplied scans, which was the actual blocker rather than the legal reasoning.",
    evidence: [
      {
        claim: "Time study across four firms, with a stated nine-hour baseline.",
        confidence: "Observed",
      },
      {
        claim: "Three paralegals independently reported comparable times.",
        confidence: "Observed",
      },
      {
        claim: "Two firms using a prototype.",
        confidence: "Founder-reported",
      },
    ],
    concerns: [
      "Low technical differentiation; a general document-workflow product could absorb this use case.",
      "Immigration policy shifts can change filing requirements substantially and without warning.",
      "Small-firm buyers churn and are price-sensitive.",
    ],
    diligenceQuestions: [
      "What does the nine hours become with your product, measured rather than estimated?",
      "How much of the pipeline is immigration-specific versus generic document assembly?",
      "What is your co-founder's engineering background, and who has built the current system?",
    ],
    outreach:
      "Hi Nadia, the nine-hour time study across four firms is the kind of number most founders assert rather than measure, so it stood out. I work with a venture fund on early technical companies. I would like to hear what that number looks like with the product in place. Would you have twenty minutes?",
  },
  {
    id: "lead-11",
    name: "Meridian Intake",
    isDemo: true,
    founder: "Grace Oyelaran",
    founderTitle: "Co-founder & CEO",
    hq: "Austin, TX",
    region: "US South",
    category: "Enterprise AI Workflow",
    stage: "Seed",
    fundingRaisedUSD: 2_200_000,
    foundedYear: 2025,
    website: "https://example.com/meridian-intake",
    linkedin: "https://example.com/linkedin/meridian-intake",
    description:
      "Front-door triage for healthcare revenue cycle: catches eligibility and coding problems at patient intake rather than sixty days later when the claim is denied.",
    thesisFit:
      "Attacks a denial rate that every provider organization reports and is measured on. Enterprise AI workflow with an unusually direct line from product performance to a number on the customer's income statement.",
    signal: {
      type: "Technical thread",
      handle: "@meridianintake",
      excerpt:
        "We pulled 40,000 denied claims and traced each back to its root cause. 61 percent were decidable at intake with information the front desk already had on screen. Breakdown by denial code in the thread.",
      observedAt: "2026-05-28",
      engagement: "2.7K likes, 540 reposts, 300 replies (illustrative)",
      whySurfaced:
        "Original analysis on a large, specific dataset with a published breakdown. Volume and methodology detail put this near the top of the signal-quality band.",
      corroboration: [
        "Revenue cycle managers at two named health systems engaged substantively in the replies.",
        "Company site lists four team members with healthcare RCM backgrounds.",
        "Database profile exists with founding year and a partial funding record.",
      ],
    },
    visibility: "Listed",
    daysAheadOfDatabases: 12,
    dateDiscovered: "2026-05-29",
    scores: {
      founder: 13,
      signal: 10,
      earliness: 7,
      thesis: 10,
      demand: 11,
      technical: 7,
      market: 7,
      timing: 4,
      stage: 4,
    },
    founderBackground:
      "Estimated: revenue cycle management leadership at a provider organization, with a team drawn from the same world. Strong domain concentration, which helps with sales and may narrow the technical ceiling.",
    marketOpportunity:
      "Denial management is a large and growing spend across provider organizations, and the shift-left framing is differentiated from the crowded denial-appeals market.",
    whyNow:
      "Eligibility and coding data became accessible in real time at the point of intake through recent interoperability requirements, which is what makes decisions at the front desk possible at all.",
    evidence: [
      {
        claim:
          "Analysis of 40,000 denied claims with a published breakdown by denial code.",
        confidence: "Observed",
      },
      {
        claim:
          "Revenue cycle managers at two named health systems engaged substantively in public.",
        confidence: "Observed",
      },
      {
        claim: "Four provider organizations live, one at full deployment.",
        confidence: "Founder-reported",
      },
    ],
    concerns: [
      "Already listed in mainstream databases with a partial funding record, so this lead arrived with little timing advantage.",
      "The 40,000-claim dataset likely came from a single system; root causes may not generalize across payer mixes.",
      "Front-desk workflow change is an organizational problem more than a technical one, and adoption can stall on staffing.",
    ],
    diligenceQuestions: [
      "Does the 61 percent figure hold across a different payer mix, and have you tested it on a second system?",
      "What is the measured denial-rate change at the fully deployed customer?",
      "How much front-desk training does deployment require, and what happens when staff turn over?",
    ],
    outreach:
      "Hi Grace, the 40,000-claim root-cause breakdown was genuinely useful, and the shift-left framing is different from what most of the denial-management market is selling. I work with a venture fund at seed. I would like to know whether the 61 percent holds across payer mixes. Would you be open to a call?",
  },
  {
    id: "lead-12",
    name: "Cryoform",
    isDemo: true,
    founder: "Henrik Palmer",
    founderTitle: "Co-founder & CTO",
    hq: "Cambridge, MA",
    region: "US Northeast",
    category: "Biotech Tooling",
    stage: "Pre-Seed",
    fundingRaisedUSD: 1_400_000,
    foundedYear: 2025,
    website: "https://example.com/cryoform",
    linkedin: "https://example.com/linkedin/cryoform",
    description:
      "Automated cryo-EM sample vitrification with closed-loop grid quality feedback, aimed at the step where most structural biology projects lose weeks to unusable grids.",
    thesisFit:
      "Instrumentation with a proprietary process and a bottleneck that is universally acknowledged inside the field and invisible outside it. Exactly the kind of company that never trends and quietly becomes essential.",
    signal: {
      type: "Product demo",
      handle: "@cryoform_bio",
      excerpt:
        "Grid quality, 200 consecutive samples, no operator intervention. 84 percent usable versus roughly 30 percent for hand plunging in the same lab. Video of the run and the raw quality scores, including the bad batch at sample 140.",
      observedAt: "2026-06-24",
      engagement: "1.6K likes, 380 reposts, 150 replies (illustrative)",
      whySurfaced:
        "Quantified head-to-head against a stated in-lab baseline, with the bad batch disclosed. Volume of 200 consecutive samples makes cherry-picking implausible.",
      corroboration: [
        "Two structural biologists at named institutions replied confirming the 30 percent hand-plunging baseline is realistic.",
        "Company site shows a physical instrument with a serial plate.",
        "No funding record or database profile found at time of scoring.",
      ],
    },
    visibility: "Not listed",
    daysAheadOfDatabases: 88,
    dateDiscovered: "2026-06-25",
    scores: {
      founder: 16,
      signal: 11,
      earliness: 11,
      thesis: 11,
      demand: 7,
      technical: 10,
      market: 5,
      timing: 4,
      stage: 4,
    },
    founderBackground:
      "Inferred from publication and patent record: cryo-EM methods development background with several years of instrument building, paired with a co-founder whose history is in precision mechanical engineering. The instrumentation depth here is the strongest in this pipeline.",
    marketOpportunity:
      "Every cryo-EM facility is a potential buyer and there are only a few thousand worldwide. High instrument price, small buyer count, and long capital equipment cycles. This is a durable business rather than a fast-growing one.",
    whyNow:
      "Microscope time has become the scarce resource as instrument counts grew, which shifts the bottleneck onto sample preparation and makes facilities willing to pay to fix it.",
    evidence: [
      {
        claim:
          "200 consecutive automated samples at 84 percent usable versus a stated 30 percent manual baseline.",
        confidence: "Observed",
      },
      {
        claim:
          "Two structural biologists at named institutions publicly confirmed the manual baseline is realistic.",
        confidence: "Observed",
      },
      {
        claim: "Two academic facilities have placed conditional orders.",
        confidence: "Founder-reported",
      },
      {
        claim:
          "Physical instrument exists in hardware rather than as a rendering.",
        confidence: "Observed",
      },
    ],
    concerns: [
      "Small total buyer count caps the outcome unless the platform extends to other sample-prep modalities.",
      "Academic buyers are grant-funded, which makes purchase timing unpredictable and discount pressure constant.",
      "Capital equipment businesses need manufacturing capability the team has not demonstrated.",
    ],
    diligenceQuestions: [
      "How many buyers exist at your price point today, and what is the realistic annual unit volume?",
      "Are the conditional orders contingent on grant cycles, and when do those decide?",
      "Does the vitrification platform extend to other sample-prep steps, or is this a single-product company?",
    ],
    outreach:
      "Hi Henrik, the 200-sample run with the bad batch at 140 left in was more convincing than a clean number would have been. I work with a venture fund on early technical companies, and instrumentation with a real bottleneck behind it is something we look for. Would you be open to a conversation about the facility orders and where the platform goes after vitrification?",
  },
  {
    id: "lead-13",
    name: "Pipette Systems",
    isDemo: true,
    founder: "Yuki Tanaka",
    founderTitle: "Founder",
    hq: "South San Francisco, CA",
    region: "US West Coast",
    category: "Biotech Tooling",
    stage: "Stealth",
    fundingRaisedUSD: 0,
    foundedYear: 2026,
    website: "https://example.com/pipette-systems",
    linkedin: "https://example.com/linkedin/pipette-systems",
    description:
      "Protocol-as-code for wet labs: a versioned, diffable execution layer so a biological protocol can be reviewed, reproduced, and re-run the way software is.",
    thesisFit:
      "Developer-tools thinking applied to the lab bench. The founder signal is strong and the earliness is excellent, but the category has consumed several well-funded attempts already.",
    signal: {
      type: "Recurring problem discussion",
      handle: "@yuki_protocols",
      excerpt:
        "Reproducibility is a version control problem wearing a lab coat. Third lab this year that could not re-run its own protocol from six months ago because the change lived in someone's notebook margin. I am building the thing I keep describing.",
      observedAt: "2026-07-09",
      engagement: "1.4K likes, 310 reposts, 180 replies (illustrative)",
      whySurfaced:
        "Repeat-problem pattern across eleven months of posting, converting to a build statement. The model rates a long-documented obsession above a sudden announcement.",
      corroboration: [
        "Eleven months of posts on lab reproducibility predating any commercial intent.",
        "Bio updated to remove a named biotech employer in the same week.",
        "No entity, domain, or funding record found at time of scoring.",
      ],
    },
    visibility: "Not listed",
    daysAheadOfDatabases: 132,
    dateDiscovered: "2026-07-10",
    scores: {
      founder: 13,
      signal: 10,
      earliness: 12,
      thesis: 9,
      demand: 4,
      technical: 8,
      market: 5,
      timing: 4,
      stage: 3,
    },
    founderBackground:
      "Inferred: automation engineering at a biotech, with unusual fluency in software engineering practice for someone in a wet-lab role. That combination is rare and is the main reason this scores where it does despite having no product.",
    marketOpportunity:
      "Lab informatics is a large spend that is mostly captured by legacy vendors selling to procurement rather than to scientists. A bottoms-up, scientist-adopted tool is a credible wedge and has been attempted repeatedly.",
    whyNow:
      "Lab automation hardware finally has enough programmatic surface area that a protocol can be genuinely executable rather than a document a human follows.",
    evidence: [
      {
        claim:
          "Eleven months of consistent public posting on lab reproducibility before any commercial intent.",
        confidence: "Observed",
      },
      {
        claim:
          "Employer removed from bio in the same week as the build statement.",
        confidence: "Observed",
      },
      {
        claim: "No product, no users, no entity.",
        confidence: "Observed",
      },
    ],
    concerns: [
      "Several well-funded companies have attacked lab informatics and mostly stalled on scientist adoption.",
      "Solo, pre-product, pre-entity. Everything rests on the founder.",
      "Bottoms-up adoption in labs is slower than in software teams because the cost of changing a working protocol is a failed experiment.",
    ],
    diligenceQuestions: [
      "What did the previous generation of lab informatics companies get wrong, and what are you doing differently?",
      "Which single protocol in which single lab is your first user, and can you get it running in a month?",
      "Are you looking for a co-founder, and what profile?",
    ],
    outreach:
      "Hi Yuki, I have been reading your posts on lab reproducibility for a while, and 'a version control problem wearing a lab coat' is the right frame. I work with a venture fund, and we often talk to technical founders before there is a company or a product. Would you be open to a call about what you are building and what the first lab looks like?",
  },
  {
    id: "lead-14",
    name: "Strand Metrics",
    isDemo: true,
    founder: "Omar Farouk",
    founderTitle: "Co-founder & CEO",
    hq: "San Diego, CA",
    region: "US West Coast",
    category: "Biotech Tooling",
    stage: "Pre-Seed",
    fundingRaisedUSD: 500_000,
    foundedYear: 2025,
    website: "https://example.com/strand-metrics",
    linkedin: "https://example.com/linkedin/strand-metrics",
    description:
      "Quality control and methylation analysis for long-read sequencing runs, catching a failed run during the run rather than in the following week's analysis.",
    thesisFit:
      "Adjacent to a fast-growing sequencing modality, but the analysis layer is competitive and much of it is open source. Tracking rather than pursuing.",
    signal: {
      type: "Open-source release",
      handle: "@strandmetrics",
      excerpt:
        "Released our real-time QC tool for long-read runs. Flags a failing flow cell at the 20 percent mark instead of at completion. Free, open source, works with the standard output formats.",
      observedAt: "2026-04-30",
      engagement: "480 likes, 110 reposts, 55 replies (illustrative)",
      whySurfaced:
        "Open-source release with a concrete time-to-detection claim. Scored moderately because the tool is free and the differentiation from existing community tooling is not established in the post.",
      corroboration: [
        "Repository has modest but real external usage.",
        "Company has a thin database profile listing founding year only.",
        "One sequencing core facility replied positively.",
      ],
    },
    visibility: "Thin profile",
    daysAheadOfDatabases: 18,
    dateDiscovered: "2026-05-01",
    scores: {
      founder: 11,
      signal: 7,
      earliness: 7,
      thesis: 9,
      demand: 5,
      technical: 6,
      market: 4,
      timing: 3,
      stage: 3,
    },
    founderBackground:
      "Estimated: bioinformatics background with sequencing core experience. Competent and credible, without an obvious asymmetric advantage over the several academic groups working on the same problem.",
    marketOpportunity:
      "Long-read sequencing is growing, but analysis tooling is dominated by free academic software and by the instrument vendors themselves, both of which are difficult to price against.",
    whyNow:
      "Long-read run costs have fallen enough that runs are frequent, which makes catching a failure early worth paying for in a way it was not when runs were rare and precious.",
    evidence: [
      {
        claim: "Open-source repository with modest external usage.",
        confidence: "Observed",
      },
      {
        claim: "One sequencing core facility publicly responded positively.",
        confidence: "Observed",
      },
      {
        claim: "Commercial version in development.",
        confidence: "Founder-reported",
      },
    ],
    concerns: [
      "Competing against free academic tooling and against instrument vendors who can bundle this.",
      "No commercial product and no stated pricing model.",
      "The differentiation claim in the release post is not supported by a benchmark.",
    ],
    diligenceQuestions: [
      "What does the commercial version do that the open-source version does not?",
      "How does this compare against the vendor's own QC output, quantitatively?",
      "Who is the buyer, the core facility or the research group paying for the run?",
    ],
    outreach:
      "Hi Omar, I came across the real-time QC release and the 20 percent early-detection claim. I work with a venture fund on early technical companies. Before going further I would want to understand how it compares to the vendor's built-in QC. Would you be open to a short call?",
  },
  {
    id: "lead-15",
    name: "Interlock Grid",
    isDemo: true,
    founder: "Marisol Quintero",
    founderTitle: "Co-founder & CEO",
    hq: "Denver, CO",
    region: "US Mountain",
    category: "Deep Tech Infrastructure",
    stage: "Seed",
    fundingRaisedUSD: 3_400_000,
    foundedYear: 2024,
    website: "https://example.com/interlock-grid",
    linkedin: "https://example.com/linkedin/interlock-grid",
    description:
      "Interconnection queue modeling for renewable and storage developers, simulating how a proposed project moves through a regional queue and what upgrade costs it will be assigned.",
    thesisFit:
      "Software against a hard physical and regulatory bottleneck, where a wrong answer costs a developer millions in withdrawn deposits. Narrow buyer set, very high willingness to pay.",
    signal: {
      type: "Technical thread",
      handle: "@marisol_grid",
      excerpt:
        "Modeled 1,200 withdrawn interconnection requests. The single best predictor of a surprise network upgrade cost was not project size or location. It was how many neighboring projects withdrew after you filed. Thread on why the queue is a cascading system.",
      observedAt: "2026-04-08",
      engagement: "3.9K likes, 950 reposts, 340 replies (illustrative)",
      whySurfaced:
        "Original quantitative finding on a public dataset, with a non-obvious conclusion. The engine ranks counterintuitive results derived from real data at the top of the technical-thread band.",
      corroboration: [
        "Three named renewable developers engaged substantively in the replies.",
        "A grid consultancy referenced the analysis in a newsletter the following week.",
        "Company had a thin database profile with no funding listed at time of scoring.",
      ],
    },
    visibility: "Thin profile",
    daysAheadOfDatabases: 52,
    dateDiscovered: "2026-04-09",
    scores: {
      founder: 15,
      signal: 12,
      earliness: 10,
      thesis: 11,
      demand: 11,
      technical: 8,
      market: 8,
      timing: 5,
      stage: 3,
    },
    founderBackground:
      "Estimated: transmission planning background at a regional operator, paired with a co-founder in power systems modeling. Both halves of the required expertise appear present, which is unusual in this space.",
    marketOpportunity:
      "Interconnection delay is the binding constraint on renewable deployment, and developers carry large sums at risk in the queue. Few hundred serious buyers, high contract values, urgent problem.",
    whyNow:
      "Queue reform at several regional operators changed the rules recently enough that historical intuition is unreliable and a model has an edge over experience.",
    evidence: [
      {
        claim:
          "Original analysis of 1,200 withdrawn interconnection requests with a published methodology.",
        confidence: "Observed",
      },
      {
        claim:
          "Three named renewable developers engaged substantively in public.",
        confidence: "Observed",
      },
      {
        claim: "A grid consultancy cited the analysis independently.",
        confidence: "Observed",
      },
      {
        claim: "Five developers on paid annual contracts.",
        confidence: "Founder-reported",
      },
    ],
    concerns: [
      "Queue reform is ongoing; a rule change could invalidate parts of the model with little notice.",
      "The buyer set is small enough that a handful of losses meaningfully caps revenue.",
      "Consultancies already sell this as a service and will defend the account.",
    ],
    diligenceQuestions: [
      "How did the model perform against the most recent queue cluster results, out of sample?",
      "What happens to the model when a regional operator changes its cluster study rules?",
      "What are the five contracts worth annually, and what is the renewal picture?",
    ],
    outreach:
      "Hi Marisol, the finding that neighboring withdrawals predict upgrade cost better than project size was genuinely surprising, and the thread was the clearest explanation of queue cascades I have seen. I work with a venture fund at seed. I would like to hear how the model has held up against the most recent cluster results. Would you have time for a call?",
  },
  {
    id: "lead-16",
    name: "Waveguide Labs",
    isDemo: true,
    founder: "Ines Cardoso",
    founderTitle: "Co-founder & CTO",
    hq: "Boulder, CO",
    region: "US Mountain",
    category: "Deep Tech Infrastructure",
    stage: "Pre-Seed",
    fundingRaisedUSD: 1_800_000,
    foundedYear: 2025,
    website: "https://example.com/waveguide-labs",
    linkedin: "https://example.com/linkedin/waveguide-labs",
    description:
      "Test and packaging infrastructure for photonic integrated circuits, addressing the step where fiber alignment turns a promising chip into an unshippable one.",
    thesisFit:
      "Sells to everyone building photonics rather than betting on which photonics company wins. Capital-intensive and slow, but the bottleneck is structural and widely acknowledged.",
    signal: {
      type: "Technical thread",
      handle: "@ines_photonics",
      excerpt:
        "Everyone is funding photonic chip startups and nobody is funding the reason they cannot ship: packaging yield. Our alignment rig does passive coupling at sub-micron repeatability without active feedback. Numbers and the setup photo in-thread.",
      observedAt: "2026-05-13",
      engagement: "1.1K likes, 240 reposts, 140 replies (illustrative)",
      whySurfaced:
        "Names a specific bottleneck the rest of the market is ignoring and supports it with a measured specification. Bottleneck-naming posts from practitioners are a high-yield query in the engine.",
      corroboration: [
        "Two photonics researchers replied agreeing packaging is the yield-limiting step.",
        "Setup photo shows physical hardware on an optical table.",
        "Company site lists three team members with optics backgrounds; no funding record found.",
      ],
    },
    visibility: "Not listed",
    daysAheadOfDatabases: 71,
    dateDiscovered: "2026-05-14",
    scores: {
      founder: 14,
      signal: 10,
      earliness: 11,
      thesis: 10,
      demand: 5,
      technical: 9,
      market: 5,
      timing: 3,
      stage: 3,
    },
    founderBackground:
      "Inferred from a patent and publication trail: integrated photonics packaging background, likely from a national lab or a large optics manufacturer. Deep and narrow, with no visible commercial experience on the team.",
    marketOpportunity:
      "Photonics packaging is a genuine industry-wide constraint, but the customer base is small and consists largely of other early-stage companies, which is a fragile revenue base.",
    whyNow:
      "Photonic chip design has outpaced packaging capability, so the bottleneck has moved and there is now demand for someone to sit in it.",
    evidence: [
      {
        claim:
          "Stated sub-micron passive alignment repeatability with a photo of the physical rig.",
        confidence: "Observed",
      },
      {
        claim:
          "Two photonics researchers publicly agreed packaging is yield-limiting.",
        confidence: "Observed",
      },
      {
        claim: "Discussions with three potential customers.",
        confidence: "Founder-reported",
      },
    ],
    concerns: [
      "Customers are mostly other venture-funded startups, so revenue is correlated with the funding environment rather than with end demand.",
      "Capital equipment development at pre-seed is expensive and slow.",
      "No commercial operator on the team.",
    ],
    diligenceQuestions: [
      "Are your customers venture-funded startups or established manufacturers, and what is the mix you are targeting in two years?",
      "What does the alignment repeatability number mean in yield percentage terms for a customer?",
      "What is the capital required to reach a shippable production tool?",
    ],
    outreach:
      "Hi Ines, the point that everyone is funding photonic chips and nobody is funding packaging yield is one I have not seen made as directly. I work with a venture fund on early deep tech. I would like to understand what the alignment numbers translate to in customer yield. Would you be open to a call?",
  },
  {
    id: "lead-17",
    name: "Tessellate Compute",
    isDemo: true,
    founder: "Arjun Nair",
    founderTitle: "Co-founder & CEO",
    hq: "London, UK",
    region: "Europe",
    category: "Deep Tech Infrastructure",
    stage: "Pre-Seed",
    fundingRaisedUSD: 1_600_000,
    foundedYear: 2026,
    website: "https://example.com/tessellate-compute",
    linkedin: "https://example.com/linkedin/tessellate-compute",
    description:
      "Memory-bandwidth-aware kernel scheduling for inference, recovering throughput on existing accelerators by scheduling against the bottleneck that actually binds rather than against FLOPs.",
    thesisFit:
      "Deeply technical infrastructure with a measurable, immediately monetizable benefit, from founders with kernel-level credibility. The strongest combination of founder signal and technical difficulty in this pipeline.",
    signal: {
      type: "Open-source release",
      handle: "@tessellate_c",
      excerpt:
        "Published our scheduler and the full reproduction harness. 1.6 to 2.1x throughput on memory-bound inference workloads across three accelerator families, no model changes, no quantization. Here is the workload where we lose to the baseline and why.",
      observedAt: "2026-07-02",
      engagement: "6.8K likes, 1.9K reposts, 520 replies (illustrative)",
      whySurfaced:
        "Reproducible benchmark across three hardware families with a published regression case. Multi-platform results with a disclosed loss are the highest-confidence pattern in the entire signal taxonomy.",
      corroboration: [
        "Two independent engineers reproduced the speedup on their own hardware within a week and posted results.",
        "Repository stars grew from zero to a substantial count in nine days.",
        "No database profile at time of scoring; company entity registered six weeks earlier.",
      ],
    },
    visibility: "Not listed",
    daysAheadOfDatabases: 104,
    dateDiscovered: "2026-07-03",
    scores: {
      founder: 17,
      signal: 13,
      earliness: 12,
      thesis: 11,
      demand: 8,
      technical: 11,
      market: 7,
      timing: 4,
      stage: 3,
    },
    founderBackground:
      "Inferred from public commit history: substantial prior contributions to a widely used inference runtime, with a co-founder whose history is in compiler and kernel work. This is the rare case where the public record alone establishes the technical claim.",
    marketOpportunity:
      "Inference cost is the largest and fastest-growing line item for anyone serving models at scale, and a hardware-agnostic throughput gain is valuable to every one of them. The pricing question is harder than the demand question.",
    whyNow:
      "Accelerator memory bandwidth has fallen further behind compute with each generation, so the fraction of workloads that are memory-bound rather than compute-bound keeps rising.",
    evidence: [
      {
        claim:
          "1.6 to 2.1x throughput published across three accelerator families with a reproduction harness.",
        confidence: "Observed",
      },
      {
        claim:
          "Two independent engineers reproduced the results on their own hardware and posted them publicly.",
        confidence: "Observed",
      },
      {
        claim: "A regression case where the scheduler loses was disclosed.",
        confidence: "Observed",
      },
      {
        claim: "Inbound from four inference providers.",
        confidence: "Founder-reported",
      },
    ],
    concerns: [
      "Accelerator vendors have every incentive to absorb this into their own runtimes, and the resources to do it.",
      "Open-sourcing the scheduler means the commercial product still has to be defined.",
      "The speedup is workload-dependent; the average across a real customer's mix may be well below the headline range.",
    ],
    diligenceQuestions: [
      "What is the throughput gain on a realistic production workload mix rather than on the benchmark set?",
      "What is the product a customer pays for, given that the scheduler is public?",
      "What is your answer when an accelerator vendor ships an equivalent scheduler in their next runtime release?",
    ],
    outreach:
      "Hi Arjun, I went through the reproduction harness and, more usefully, the regression case you published. Two independent reproductions within a week is a strong signal. I work with a venture fund, backing technical founders at pre-seed and seed. I would like to understand how you are thinking about the commercial layer given the scheduler is open. Would you be up for a call?",
  },
  {
    id: "lead-18",
    name: "Driftwatch",
    isDemo: true,
    founder: "Lena Novak",
    founderTitle: "Founder",
    hq: "Lisbon, Portugal",
    region: "Europe",
    category: "Technical Software",
    stage: "Pre-Seed",
    fundingRaisedUSD: 400_000,
    foundedYear: 2025,
    website: "https://example.com/driftwatch",
    linkedin: "https://example.com/linkedin/driftwatch",
    description:
      "Schema and distribution drift detection for production machine learning, alerting on the upstream data change that will degrade a model before the metrics show it.",
    thesisFit:
      "A real problem in a category that already has several funded entrants. Included in the pipeline for completeness and to show what a mid-scoring lead looks like.",
    signal: {
      type: "Build-in-public update",
      handle: "@driftwatch_io",
      excerpt:
        "Shipped v0.4. Now catches upstream schema changes before they reach the feature store rather than after. Three users told me this exact failure cost them a week each.",
      observedAt: "2026-06-02",
      engagement: "290 likes, 45 reposts, 30 replies (illustrative)",
      whySurfaced:
        "Regular shipping cadence with named user feedback. Passed the filter but scored low on specificity, since no quantitative claim was made and the category is crowded.",
      corroboration: [
        "Consistent release notes across four versions.",
        "Small but real open-source usage.",
        "Thin database profile listing founding year only.",
      ],
    },
    visibility: "Thin profile",
    daysAheadOfDatabases: 15,
    dateDiscovered: "2026-06-03",
    scores: {
      founder: 11,
      signal: 9,
      earliness: 8,
      thesis: 8,
      demand: 7,
      technical: 6,
      market: 5,
      timing: 3,
      stage: 3,
    },
    founderBackground:
      "Estimated: data engineering background with production ML experience. Solid, without an obvious edge over the several teams building in this category.",
    marketOpportunity:
      "ML observability is a genuine need and an increasingly crowded market with well-funded incumbents. Differentiation on the upstream-schema angle is real but narrow.",
    whyNow:
      "More teams run models in production than have the platform maturity to monitor them, which sustains demand for a lighter-weight tool.",
    evidence: [
      {
        claim: "Four consecutive versioned releases with public release notes.",
        confidence: "Observed",
      },
      {
        claim: "Three users reported the failure mode cost them a week each.",
        confidence: "Founder-reported",
      },
      {
        claim: "Small open-source usage.",
        confidence: "Observed",
      },
    ],
    concerns: [
      "Crowded category with better-funded competitors already selling to the same buyer.",
      "The upstream-schema angle may be a feature rather than a company.",
      "Solo founder with no commercial traction stated.",
    ],
    diligenceQuestions: [
      "What do you do that the funded observability platforms do not, from the buyer's point of view?",
      "How many of the open-source users would pay, and have you asked?",
      "Is upstream schema detection a wedge into something larger, or the whole product?",
    ],
    outreach:
      "Hi Lena, I have been following the Driftwatch releases and the upstream-schema angle in v0.4 is the interesting part. I work with a venture fund on early technical companies. I would like to understand how you see it differentiating from the funded platforms in this space. Would you be open to a short call?",
  },
  {
    id: "lead-19",
    name: "Quorum State",
    isDemo: true,
    founder: "Theo Brennan",
    founderTitle: "Founder",
    hq: "Seattle, WA",
    region: "US West Coast",
    category: "Technical Software",
    stage: "Stealth",
    fundingRaisedUSD: 0,
    foundedYear: 2026,
    website: "https://example.com/quorum-state",
    linkedin: "https://example.com/linkedin/quorum-state",
    description:
      "Deterministic simulation testing for distributed systems, letting a team replay the exact interleaving that caused a production consensus bug instead of trying to reproduce it by luck.",
    thesisFit:
      "Extremely hard infrastructure with a small number of customers who will pay a great deal, and a founder whose public record establishes the capability. High conviction on the person, open question on the market.",
    signal: {
      type: "Technical thread",
      handle: "@theo_distsys",
      excerpt:
        "Spent four months building a deterministic scheduler to reproduce one consensus bug. Found it in eleven minutes once the scheduler worked. Then found six more nobody knew about. Writing up what deterministic simulation actually requires, because the existing literature skips the hard parts.",
      observedAt: "2026-06-20",
      engagement: "4.4K likes, 1.1K reposts, 310 replies (illustrative)",
      whySurfaced:
        "A four-month effort with a specific, verifiable outcome and six additional discovered bugs. Long-effort posts with concrete results are strongly correlated with founders who will actually finish something.",
      corroboration: [
        "Two distributed systems engineers with public reputations engaged in detail.",
        "Prior posting history shows two years of consistent distributed systems work.",
        "No entity, domain, funding, or company page found at time of scoring.",
      ],
    },
    visibility: "Not listed",
    daysAheadOfDatabases: 148,
    dateDiscovered: "2026-06-21",
    scores: {
      founder: 16,
      signal: 12,
      earliness: 12,
      thesis: 9,
      demand: 5,
      technical: 10,
      market: 5,
      timing: 4,
      stage: 3,
    },
    founderBackground:
      "Inferred: distributed systems engineering, most likely from an infrastructure team at a large operator, based on two years of specific and accurate public technical writing. Capability is well evidenced; commercial intent is not.",
    marketOpportunity:
      "The set of companies that both need this and know they need it is small: database vendors, infrastructure providers, and a handful of financial systems teams. Small buyer count, very high contract value if it lands.",
    whyNow:
      "Deterministic simulation has moved from a technique two companies used privately to something a broader set of infrastructure teams now know exists and want.",
    evidence: [
      {
        claim:
          "Four-month effort producing a working deterministic scheduler and seven total bugs found.",
        confidence: "Observed",
      },
      {
        claim:
          "Two well-known distributed systems engineers engaged substantively in public.",
        confidence: "Observed",
      },
      {
        claim: "No company, product, or customers exist.",
        confidence: "Observed",
      },
    ],
    concerns: [
      "The founder has not stated any intent to build a company; this may remain a technical write-up.",
      "The addressable buyer set is genuinely small and highly technical, with a strong build-it-ourselves instinct.",
      "Deterministic simulation is a known technique; the differentiation is execution quality, which is hard to underwrite pre-product.",
    ],
    diligenceQuestions: [
      "Is there a company here for you, or is this a write-up you wanted to exist?",
      "Which specific team would pay for this first, and have you talked to them?",
      "How much of the four months was the scheduler versus the integration with a real system?",
    ],
    outreach:
      "Hi Theo, the four-months-then-eleven-minutes framing, and the six additional bugs, made this the most memorable thing I read that month. I work with a venture fund and we spend a lot of time with technical founders before there is a company, which I gather may be the case here. No pitch. Would you be open to a conversation about whether there is a company in this?",
  },
  {
    id: "lead-20",
    name: "Sentinel Diff",
    isDemo: true,
    founder: "Camille Rousseau",
    founderTitle: "Co-founder & CEO",
    hq: "Brooklyn, NY",
    region: "US Northeast",
    category: "Technical Software",
    stage: "Seed",
    fundingRaisedUSD: 4_200_000,
    foundedYear: 2024,
    website: "https://example.com/sentinel-diff",
    linkedin: "https://example.com/linkedin/sentinel-diff",
    description:
      "Semantic diffing for infrastructure-as-code, showing what a change will actually do to a running environment rather than which lines of configuration moved.",
    thesisFit:
      "A good company that this engine surfaced too late to be useful. Kept in the pipeline as a worked example of what a low earliness score means and why it should change the decision.",
    signal: {
      type: "Product demo",
      handle: "@sentineldiff",
      excerpt:
        "New release: semantic plan diffing across three cloud providers. See the blast radius of a change before you apply it, not the text delta.",
      observedAt: "2026-04-15",
      engagement: "2.1K likes, 430 reposts, 190 replies (illustrative)",
      whySurfaced:
        "Strong product signal, but the engine flagged the lead as late: a full database profile, an announced Series-track round, and prior press all predated the post.",
      corroboration: [
        "Complete profiles in mainstream startup databases with funding history.",
        "Announced funding round covered in trade press four months before the post.",
        "Substantial existing user base referenced across multiple public sources.",
      ],
    },
    visibility: "Listed",
    daysAheadOfDatabases: -420,
    dateDiscovered: "2026-04-16",
    scores: {
      founder: 12,
      signal: 8,
      earliness: 2,
      thesis: 8,
      demand: 8,
      technical: 6,
      market: 5,
      timing: 2,
      stage: 1,
    },
    founderBackground:
      "Estimated: infrastructure engineering leadership background with a co-founder from a developer tools company. Credible team; nothing here is in question.",
    marketOpportunity:
      "Infrastructure-as-code tooling is an established market with real budget. Nothing wrong with the opportunity; the issue is entirely one of timing for a fund entering now.",
    whyNow:
      "The why-now passed roughly eighteen months ago, which is precisely the point of keeping this record in the pipeline.",
    evidence: [
      {
        claim:
          "Full profiles in mainstream startup databases with funding history.",
        confidence: "Observed",
      },
      {
        claim: "Funding round covered in trade press four months before the post.",
        confidence: "Observed",
      },
      {
        claim: "Substantial existing user base across multiple public sources.",
        confidence: "Observed",
      },
    ],
    concerns: [
      "Priced well past the entry point this engine is built to find; the earliness score of 2 out of 13 is the whole story.",
      "No sourcing edge, since every fund covering developer tools already knows this company.",
      "Entering here means competing on price and speed rather than on insight.",
    ],
    diligenceQuestions: [
      "Not applicable at this stage. The relevant question is for the engine, not the company: why did this clear the filter at all?",
      "Should the visibility filter hard-exclude fully listed companies, or keep surfacing them as calibration?",
      "Is there a later-stage relationship worth maintaining even though the entry point has passed?",
    ],
    outreach:
      "No outreach drafted. This lead was scored and passed on timing rather than quality. If the engine were tuned to exclude fully listed companies, it would not have surfaced at all, and it is retained here as a calibration example.",
  },
];

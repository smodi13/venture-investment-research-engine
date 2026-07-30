"""Master facts / evidence / scripts for the AOS / Unicity Labs package.
Single source of truth so every artifact stays consistent and honestly labelled.
No em dashes anywhere in any string. US English.
"""

OUTDIR = "data/output/final_aos_unicity_package"
ACCESS_DATE = "2026-07-20"

# ---------------------------------------------------------------------------
# Honest headline framing
# ---------------------------------------------------------------------------
TITLE = "Unicity Labs / AOS Thesis"
AOS_STATUS_LINE = ("AOS is the working product thesis identified through the engine, but the first "
                   "diligence requirement is confirming its current status and relationship to the "
                   "broader Unicity Protocol.")
AOS_DEFINITION = (
    "AOS (as used in this package) is a working thesis name for a secure execution, identity, policy, "
    "budget, and cryptographic-proof layer beneath autonomous agents. It is NOT currently a distinct, "
    "publicly branded Unicity product. The live Unicity site presents bearer tokens and peer-to-peer "
    "settlement (developer SDK named Sphere). The GitHub organization contains a Web3 agent, settlement, "
    "and identity stack plus an 'Unicity Execution Model' specification and a 'tx-flow runtime'. No "
    "repository named AOS or Astrid appears in the authoritative organization listing. Confirming what "
    "AOS is today is diligence question one.")

# ---------------------------------------------------------------------------
# Evidence ledger. Every claim carries an evidence class.
# classes: independently_reported, official_company_source, official_protocol_source,
# official_foundation_source, investor_reported, partner_reported, founder_reported,
# engine_derived, analyst_hypothesis, unresolved, contradictory
# ---------------------------------------------------------------------------
SOURCES = [
 dict(id="U1", topic="Unicity positioning", claim="Live site presents bearer tokens and P2P settlement ('An asset you hold, self-contained, self-proving, transferable peer-to-peer'; '3M+ TPS'; '<1s finality'; 'Money for machines'). Developer SDK named 'Sphere'. 'AOS' not mentioned.",
      title="Unicity official website", url="https://unicity.network/", date=ACCESS_DATE, cls="official_company_source"),
 dict(id="U2", topic="Agent Sphere", claim="'Unicity Agent Sphere' page exists; page content too sparse to confirm marketplace mechanics from the fetch. Sphere SDK handles agent payments (sphere.payments.send).",
      title="Unicity Agent Sphere", url="https://sphere.unicity.network/", date=ACCESS_DATE, cls="official_company_source"),
 dict(id="U3", topic="GitHub org", claim="79 repositories: consensus layer (alpha, alpha-miner, bft-core), state-transition-sdk-js/java/rust, unicity-yellowpaper-tex (formal spec), execution-model-tex ('Unicity Execution Model'), tx-flow runtime, Nostr identity + wallet + aggregator + agentic-hosting components. No repo named AOS or Astrid in the authoritative listing.",
      title="Unicity GitHub organization (gh, authoritative)", url="https://github.com/unicitynetwork", date=ACCESS_DATE, cls="official_protocol_source"),
 dict(id="U4", topic="Astrid runtime", claim="A WebFetch summary of the org page described 'Astrid: an open runtime for enterprise AI agents, enforcement at the kernel boundary, run AI agents and the tools they use without having to trust them.' This could NOT be confirmed as a repo in the authoritative gh listing. Treat as unresolved / contradictory and verify on diligence.",
      title="Astrid enterprise-runtime description (unconfirmed)", url="https://github.com/unicitynetwork", date=ACCESS_DATE, cls="contradictory"),
 dict(id="U5", topic="Execution model", claim="'execution-model-tex' repo ('Unicity Execution Model', updated 2026-05-22) and a 'tx-flow runtime' are referenced. These are the closest current artifacts to an agent execution layer, but are specification / protocol runtime, not a confirmed enterprise AOS product.",
      title="Unicity Execution Model repo", url="https://github.com/unicitynetwork", date=ACCESS_DATE, cls="official_protocol_source"),
 dict(id="F1", topic="Funding", claim="Unicity Labs announced a $3M seed on 2026-02-19, led by Blockchange Ventures, with Outlier Ventures and Tawasal participating. Zug, Switzerland. Unicity Foundation established in Switzerland for protocol governance, grants, and open-source. Mike Gault CEO. Source is a company-issued press release (PR Newswire), so this is company-reported, not independently verified.",
      title="Unicity Labs Raises $3M to Scale Autonomous Agentic Marketplaces (PR Newswire)", url="https://www.prnewswire.com/apac/news-releases/unicity-labs-raises-3m-to-scale-autonomous-agentic-marketplaces-302692740.html", date=ACCESS_DATE, cls="company_reported"),
 dict(id="F2", topic="Team", claim="Team described as previously having built and exited Guardtime (cybersecurity infrastructure), with PhD researchers in distributed systems, cryptography, and machine learning. Mike Gault CEO. Only source located is the company funding announcement, so this is company-reported, not founder-reported, unless a direct founder source is confirmed on the call.",
      title="Company funding announcement (PR Newswire)", url="https://www.prnewswire.com/apac/news-releases/unicity-labs-raises-3m-to-scale-autonomous-agentic-marketplaces-302692740.html", date=ACCESS_DATE, cls="company_reported"),
 dict(id="F3", topic="Blockchange", claim="Blockchange Ventures is an early-stage crypto/Web3 venture firm named as lead. Not separately confirmed by the investor's own site in this pass.",
      title="Blockchange Ventures (named as lead)", url="https://www.blockchange.vc/", date=ACCESS_DATE, cls="investor_reported"),
 dict(id="F4", topic="Outlier", claim="Outlier Ventures is a Web3 accelerator/early-stage investor named as a participant.",
      title="Outlier Ventures (named participant)", url="https://outlierventures.io/", date=ACCESS_DATE, cls="investor_reported"),
 dict(id="E1", topic="Engine selection", claim="Prior enrichment classified @mgault / Mike Gault as explicit_executive (CEO Unicity Labs), candidate_project_match 'likely', disposition retain_for_manual_research (executive, not confirmed founder of the specific AOS artifact).",
      title="Saved engine enrichment (targeted_enrichment)", url="data/output/targeted_enrichment/parsed_user_response_corrected.json", date=ACCESS_DATE, cls="engine_derived"),
 dict(id="H1", topic="Headline thesis", claim="Headline explicitly prioritizes agent infrastructure: 'Authentication, Integration with external apps and the MCP ecosystem, Runtimes and sandboxed environments, Orchestration' as areas with 'the greatest potential with today's most significant unsolved infrastructure problems.' Also: 'Product-market fit among developers does not equal product-market fit among enterprises.'",
      title="Headline: The Duality of Infrastructure Software Investing", url="https://headline.com/blog-latest/article-latest/the-duality-of-infrastructure-software-investing-i", date=ACCESS_DATE, cls="independently_reported"),
 dict(id="H2", topic="Headline thesis", claim="Headline calls spend rationalization 'one of the most defining trends... second only to AI adoption' and prizes 'clean, reliable abstractions of foundational but operationally complex problems'; capital-efficient cost-to-value.",
      title="Headline: The Infra Stack Reset", url="https://headline.com/blog-latest/article-latest/the-infra-stack-reset", date=ACCESS_DATE, cls="independently_reported"),
 dict(id="C1", topic="Comparison", claim="ScaleDown scored higher (5.95 corrected) than AOS/Unicity (5.55) in the standardized final scorecard; Vattara 5.20. AOS was selected by human judgment, not by ranking first.",
      title="Final candidate diligence (corrected_v2)", url="data/output/final_candidate_diligence/corrected_v2/corrected_final_candidate_scorecard.json", date=ACCESS_DATE, cls="engine_derived"),
 dict(id="J1", topic="Selection", claim="Sahil Modi selected AOS / Unicity Labs as the most interesting company for focused diligence from the expanded X sourcing process. This is analyst judgment, not a company fact.",
      title="Analyst selection", url="internal analyst judgment", date=ACCESS_DATE, cls="analyst_judgment"),
 dict(id="J2", topic="Thesis", claim="AOS platform potential as a horizontal control and proof layer beneath agents is an interesting investment thesis.",
      title="Analyst investment thesis", url="internal analyst judgment", date=ACCESS_DATE, cls="analyst_judgment"),
 dict(id="J3", topic="Recommendation", claim="Advance Unicity Labs into focused founder, product, enterprise-demand, and value-capture diligence.",
      title="Analyst recommendation", url="internal analyst judgment", date=ACCESS_DATE, cls="analyst_recommendation"),
 dict(id="J4", topic="Check decision", claim="Do not write a check now. The announced seed is not assumed to be open. Current check decision is no investment today.",
      title="Analyst recommendation based on unresolved evidence", url="internal analyst judgment", date=ACCESS_DATE, cls="analyst_recommendation_unresolved"),
 dict(id="J5", topic="Open questions", claim="Current product status, enterprise demand, equity value capture, and financing availability are each unresolved.",
      title="Diligence gate summary", url="internal analyst judgment", date=ACCESS_DATE, cls="unresolved"),
]

# ---------------------------------------------------------------------------
# Entity and product map (relationships input-driven; no invented legal ownership)
# ---------------------------------------------------------------------------
ENTITY_MAP = [
 ("Unicity Labs", "Operating company (Zug, Switzerland). Employer of the team; presumed holder of commercial/equity value. Legal ownership of specific IP UNRESOLVED.", "company_reported"),
 ("Unicity Foundation", "Swiss foundation established to oversee protocol governance, grant funding, and open-source development. Governance/economics may sit here, not in the company.", "company_reported"),
 ("Unicity Protocol", "The peer-to-peer, bearer-token settlement protocol (consensus layer 'alpha', BFT core, state-transition SDKs, yellowpaper). Web3 infrastructure.", "official_protocol_source"),
 ("AOS (working thesis)", "Secure agent execution / identity / policy / budget / proof layer. NOT a confirmed current product brand. Closest artifacts: 'execution-model-tex', 'tx-flow runtime'. Status is diligence question one.", "analyst_hypothesis"),
 ("Agent Sphere / Sphere SDK", "Developer SDK and agent surface (sphere.payments.send). Agent wallet + payments; marketplace mechanics unconfirmed from public fetch.", "official_company_source"),
 ("Sphere Quests", "quest.unicity.network. Community / ecosystem engagement surface (quests). Not enterprise product evidence.", "unresolved"),
 ("Bearer tokens", "The core current public positioning: self-contained, self-proving, transferable peer-to-peer assets ('money for machines').", "official_company_source"),
 ("GitHub org (unicitynetwork)", "79 repos. Consensus, SDKs, execution-model spec, agent + Nostr identity + wallet stack. Open-source; activity is not proof of commercial traction.", "official_protocol_source"),
 ("Investors", "Blockchange Ventures (lead), Outlier Ventures, Tawasal. Crypto/Web3-oriented.", "company_reported"),
]

# ---------------------------------------------------------------------------
# Engine metrics (verbatim from the user's prompt / saved runs)
# ---------------------------------------------------------------------------
PILOT = dict(query_families=6, lanes=3, returned=177, unique=176, authors=146, direct_builder=30,
             level_a=20, retained=29, keep_verified=7, keep_for_enrichment=22, enriched=11,
             comparison_set=4, cum_activity="1.085")
BROAD = dict(query_families=20, count_requests=20, agg_7day=1486, http_requests=25, returned=1279,
             net_new=1166, cross_dupe=26, within_dupe=70, multi_query=68, authors=967, direct_builder=190,
             level_a=851, actionable=187, consolidated=153, enriched=14, returned_profiles=14,
             cum_activity="7.720", allowance="25.000", remaining="17.280", tests=450)

COST_LEDGER = [
 ("Authentication preflight", 1, "0.010", "0.010"),
 ("Count preflight (initial)", 6, "0.005", "0.030"),
 ("Ten-Post canary", 10, "0.005", "0.050"),
 ("First three-profile enrichment", 3, "0.010", "0.030"),
 ("Six-query pilot", 177, "0.005", "0.885"),
 ("Second eight-profile enrichment", 8, "0.010", "0.080"),
 ("Broad 20-query count preflight", 20, "0.005", "0.100"),
 ("Broad Post retrieval", 1279, "0.005", "6.395"),
 ("Final 14-profile enrichment", 14, "0.010", "0.140"),
]
COST_INITIAL_TOTAL = "1.085"
COST_TOTAL = "7.720"
COST_ALLOWANCE = "25.000"
COST_REMAINING = "17.280"

# ---------------------------------------------------------------------------
# Candidate comparison (corrected scorecard totals)
# ---------------------------------------------------------------------------
CANDIDATES = {
 # name: (founder_team, product_maturity, tech_diff, customer_evidence, buyer_clarity,
 #        biz_model, market, defensibility, financing_actionability, headline_fit, asymmetric_upside)
 "AOS / Unicity Labs": (9,6,7,3,4,3,6,7,2,3,9),
 "ScaleDown":          (7,6,7,3,6,5,6,6,6,9,6),
 "Vattara":            (7,6,4,3,7,7,6,3,5,6,5),
 "Verifyr":            (2,4,3,1,5,4,5,2,3,5,4),
 "Plexor":             (4,3,2,3,5,3,3,2,2,2,3),
 "Synapse":            (5,3,4,2,4,3,4,3,3,5,4),
 "Mitsumono":          (4,3,3,2,4,3,4,3,3,4,4),
}
# Standardized 10-dim weights (the diligence framework; asymmetric_upside shown but not in the 10-dim total)
WEIGHTS10 = dict(founder_team=0.15, product_maturity=0.10, technical_differentiation=0.15,
                 customer_evidence=0.15, buyer_clarity=0.10, business_model_clarity=0.05,
                 market_potential=0.10, defensibility=0.10, financing_actionability=0.05,
                 headline_mandate_fit=0.05)
STANDARDIZED_TOTALS = {"AOS / Unicity Labs":5.55, "ScaleDown":5.95, "Vattara":5.20, "Verifyr":3.10, "Plexor":3.00}

# ---------------------------------------------------------------------------
# Competitive landscape (categories; no invented funding/pricing/customers)
# ---------------------------------------------------------------------------
COMPETITORS = {
 "Agent runtime and sandbox": ["E2B", "Modal", "Daytona", "Fly.io", "cloud sandbox products", "agent-framework native runtimes"],
 "Agent identity and authentication": ["Auth0", "Stytch", "Descope", "WorkOS", "agent-specific identity startups", "MCP authorization approaches"],
 "Agent governance, policy, security": ["Lakera", "Protect AI", "HiddenLayer", "Prompt Security", "CalypsoAI", "cloud-provider AI guardrails"],
 "Agent payments and commerce": ["Skyfire", "Coinbase x402", "Google AP2", "Nevermined", "Stripe agent commerce", "stablecoin payment infrastructure"],
 "Agent protocols and coordination": ["MCP", "A2A", "Fetch.ai", "decentralized agent networks", "marketplace protocols"],
 "Internal alternatives": ["custom enterprise policy engines", "cloud IAM", "service meshes", "API gateways", "transaction monitoring", "standard audit logging"],
}

# ---------------------------------------------------------------------------
# Risks (verbatim intent from prompt, no em dashes)
# ---------------------------------------------------------------------------
RISKS = [
 "AOS may no longer be a distinct actively marketed product.",
 "Current company positioning may center on bearer finance rather than enterprise agent governance.",
 "The product may be Web3 infrastructure described using AI terminology.",
 "Token or protocol value may not accrue to equity investors.",
 "Enterprise buyers may resist blockchain or protocol complexity.",
 "The company has already announced a seed round, reducing immediate financing actionability.",
 "Funding does not prove enterprise product demand.",
 "Public repositories and technical materials do not prove production usage.",
 "Agent frameworks and cloud providers can add policy and budget controls.",
 "Security vendors can build agent identity and runtime governance.",
 "Payment protocols can address agent settlement without requiring Unicity.",
 "The company may need to subsidize an ecosystem before meaningful revenue develops.",
 "Protocol governance through a foundation may complicate ownership and value capture.",
 "The platform may require tokens or network adoption before customers receive value.",
 "The enterprise buyer and budget owner remain unclear.",
 "Agent autonomy may develop more slowly than expected.",
 "Regulatory treatment of autonomous agent payments may delay adoption.",
 "Technical throughput claims may not translate into enterprise purchasing.",
 "Public claims may blur Unicity Labs, the Foundation, the Protocol, and the product.",
 "There is no independently verified paid-customer evidence in the saved diligence.",
]

# ---------------------------------------------------------------------------
# Verbatim scripts (must be inserted exactly; no em dashes present)
# ---------------------------------------------------------------------------
FULL_ENGINE_SCRIPT = (
"I built a lightweight, deterministic X sourcing engine around an AI infrastructure and developer-tools thesis that I selected.\n\n"
"I started with six query families across three sourcing lanes: product launches and open-source artifacts, founder-transition signals, and early customer or design-partner signals. That pilot reviewed 176 unique Posts from 146 authors, retained 29 leads, and enriched 11 profiles for approximately one dollar and nine cents in estimated API activity.\n\n"
"I then challenged the scope of my own result. The first search was concentrated in AI, so I expanded the system to 20 query families covering AI infrastructure, non-AI B2B software, cybersecurity, fintech, robotics, semiconductors, climate, medical devices, industrial technology, and physical products.\n\n"
"The broad run retrieved 1,279 Post resources and produced 1,166 net-new Posts after deduplication. The deterministic pipeline identified 190 direct-builder claims, 851 Posts with a Level A external artifact, 187 actionable Posts, and 153 consolidated companies or projects. I enriched only 14 profiles where identity could materially change the decision. All 14 returned. Total estimated API activity was approximately seven dollars and seventy-two cents.\n\n"
"The engine used the official X recent-search API, not scraping. It separated direct builders from third-party announcements, commentary, and established-company releases. GitHub repositories, product sites, documentation, and live demos counted as Level A artifacts, but an artifact alone never proved ownership.\n\n"
"No LLM made the classification or disposition decision. The same input and configuration produce the same result, and every decision can be traced to the evidence and rule that caused it.\n\n"
"The engine did not select AOS automatically. It organized the evidence. I selected AOS after comparing team quality, technical architecture, buyer clarity, value capture, financing timing, category fit, and asymmetric upside.\n\n"
"Every paid request was fingerprinted to an exact configuration, explicitly approved, budget-capped, and locked against accidental re-execution. The credentials and credits were not mine, so I treated someone else's capital differently.")

SHORT_ENGINE_SCRIPT = (
"I encoded an AI infrastructure thesis into a deterministic X sourcing engine, then expanded it into 20 query families across software, hardware, and physical products. The broad process produced 1,166 net-new Posts, 187 actionable Posts, 153 consolidated companies, and 14 targeted profile enrichments for approximately seven dollars and seventy-two cents in estimated API activity. The engine separated actual builders from reporters and commentary, verified external artifacts, and preserved every decision in an audit trail. No LLM made the classification decision, and I made the final company selection myself.")

ANCHOR_LINES = [
 "The thesis was mine, encoded in the query design.",
 "The engine's value was evidence separation and execution discipline.",
 "The final investment decision was human, not automated.",
]

AOS_PITCH_90S = (
"Autonomous agents are becoming systems of action, not just systems that generate text. When an agent calls tools, moves value, and coordinates with other agents, prompt-level guardrails are not enough, because the model can be convinced to bypass its own instructions.\n\n"
"Enterprises will require identity, policy, permissions, budgets, isolation, and tamper-evident audit that live in the execution path, below the model, where the model cannot override them. That is the AOS thesis: a control and proof layer beneath autonomous agents.\n\n"
"The Unicity team brings cryptography and distributed-systems experience, including a prior build and exit at Guardtime. The largest version of this is horizontal agent infrastructure, a control plane for agent autonomy rather than a single point solution.\n\n"
"I am honest about the largest risk. Today the public product is a bearer-token, peer-to-peer settlement protocol, which is Web3 infrastructure, and it is not yet clear that enterprise agent governance is a distinct product or that value accrues to equity rather than to a token or a foundation. The seed round has already been announced.\n\n"
"So my recommendation is not an immediate check. It is focused founder and product diligence and relationship development now, because the questions of what AOS is today, who the enterprise buyer is, and how equity captures value are important enough to resolve before the next round becomes competitive.")

WHY_AOS_OVER_SCALEDOWN = (
"ScaleDown scored higher in the standardized evidence framework because it had clearer current product documentation and more conventional AI infrastructure positioning. Vattara also had simpler pre-seed timing and a straightforward SaaS model. I selected AOS because the scorecard was a decision aid, not the decision. AOS had the strongest team signal, the deepest technical architecture, and the most asymmetric platform outcome. If agents become systems capable of acting and transacting, the execution and proof layer could become foundational. I accept that this choice carries more value-capture and Web3 risk, which is why my recommendation is a focused founder and product diligence process rather than an immediate investment.")

SCORECARD_EXPLANATION = (
"The standardized scorecard favored ScaleDown because it had clearer current product documentation, stronger "
"evidence completeness, and more conventional financing actionability. I selected AOS because the scorecard was a "
"decision aid, not the final investment judgment. AOS had the strongest team signal, the deepest technical "
"architecture, and the most asymmetric platform potential. Those qualities make it the most interesting company "
"for focused diligence, but they do not eliminate the need to verify product truth, customer demand, equity value "
"capture, and financing.")

# ---- Exact playbook answers (final posture) ----
WHY_INTERESTING_ANSWER = (
"I think AOS is an interesting investment because it addresses a problem that becomes increasingly important as "
"agents move from generating information to taking actions. Once agents can call tools, control budgets, access "
"sensitive systems, and transact, enterprises need identity, permissions, policy enforcement, execution controls, "
"and audit beneath the model. AOS could become that control and proof layer. The team appears unusually suited to "
"the problem through its cryptography and distributed-systems background, and the opportunity could be horizontal "
"across many agent applications. The risks are substantial, particularly around current product status, enterprise "
"adoption, protocol dependence, and equity value capture, but the potential platform outcome is large enough to "
"justify focused diligence.")
WOULD_YOU_INVEST_TODAY = (
"No. I would advance Unicity Labs into focused founder, product, enterprise-demand, and value-capture diligence, "
"but I would not write a check today. I first need to confirm that AOS remains an active product, establish paid "
"enterprise demand, understand how protocol success creates value for Unicity Labs equity, and identify a viable "
"financing opportunity. I think the upside is large enough to justify doing that work now, but the public evidence "
"is not sufficient for an investment decision.")
IS_THIS_A_RECOMMENDATION = (
"It is a recommendation to advance the company into serious investment diligence, not a recommendation to transfer "
"capital today. I believe AOS is the most interesting asymmetric opportunity in the final comparison, but the "
"central underwriting questions are still unresolved.")
SHORT_INTEREST_LINE = "Interesting enough to diligence seriously, not proven enough to fund today."
CLOSING_STATEMENT = (
"My recommendation is to advance Unicity Labs into focused diligence. The upside could be a foundational control "
"and proof layer beneath autonomous agents. The next step is to confirm product truth, enterprise demand, equity "
"value capture, and financing. Until those conditions are resolved, I would not write a check.")

WHY_ALREADY_RAISED = (
"The existing seed means AOS is not the earliest company in the funnel and may not be immediately actionable. I am not presenting it as an open transaction. I am presenting it as the company where the combination of technical quality, market importance, and potential next-round relevance most justifies building a relationship now. In venture sourcing, the work often begins before the next round is available.")

# ---- Exact recommendation language (final posture) ----
PRIMARY_REC = ("Advance Unicity Labs into focused founder, product, enterprise-demand, and value-capture "
               "diligence. Do not write a check now.")
EXPANDED_REC = (
"AOS / Unicity Labs is an interesting investment opportunity because it may address a foundational control "
"problem created by autonomous agents. If agents increasingly call tools, control budgets, access sensitive "
"systems, and transact, enterprises may require identity, policy enforcement, permissions, execution controls, "
"settlement, and audit beneath the model. AOS could become that control and proof layer. However, the public "
"evidence does not yet establish AOS as a distinct active enterprise product, demonstrate paid customer demand, "
"or explain how protocol success creates value for Unicity Labs equity. I would advance the company into focused "
"diligence and begin building the relationship, but I would not write a check until those questions are resolved.")
SHORT_REC = ("Recommendation: advance into focused diligence. Do not write a check until product status, customer "
             "demand, equity value capture, and financing are confirmed.")
TIMING_STMT = (
"The company has already announced a seed round, so I am not presenting that financing as an open transaction. "
"The appropriate next step is to begin the relationship and diligence process now, determine whether AOS supports "
"an investable enterprise thesis, and evaluate a future financing only if the central risks are resolved.")
MEMO_REC = (
"Advance Unicity Labs into focused founder, product, enterprise-demand, and value-capture diligence. Do not write "
"a check now. AOS may address a foundational infrastructure need as autonomous agents gain authority to act, "
"transact, and coordinate, but the company must first confirm what AOS is today, demonstrate urgent enterprise "
"demand, establish how value reaches Unicity Labs equity, and clarify future financing availability.")
RECOMMENDATION = EXPANDED_REC
TIMING_LANGUAGE = TIMING_STMT

# ---- Why this is an interesting investment (positive case, not a check) ----
WHY_INTERESTING = [
 "Autonomous agents are becoming systems of action: they call tools, access data, control resources, initiate transactions, and coordinate with other agents.",
 "Prompt-level controls may be insufficient. An agent that can act may require controls in the execution path that the model cannot bypass.",
 "AOS may occupy a foundational control point governing identity, permissions, policies, budgets, tool calls, isolated execution, proof of execution, tamper-evident audit, settlement, and agent-to-agent coordination.",
 "The opportunity could be horizontal: infrastructure beneath many agent applications rather than one workflow or industry.",
 "The technical-team signal is strong, with company-reported experience in cryptography, distributed systems, machine learning, and Guardtime.",
 "The technical approach could be defensible: an execution and proof layer beneath the model rather than another prompt filter, application framework, or observability dashboard. This is an investment hypothesis until independently confirmed.",
 "The problem may become important before enterprise budgets are fully established, as agents gain economic authority and need identity, governance, policy, budget control, execution proof, audit, and settlement.",
 "AOS has asymmetric platform potential: the downside includes substantial product-definition, customer, protocol, and value-capture uncertainty, while the upside is becoming part of the control plane for autonomous software.",
 "The thesis intersects with Headline's published infrastructure interests: agent authentication, runtimes, sandboxed environments, orchestration, developer infrastructure, agent security, and agent commerce. This does not imply Headline has expressed interest in Unicity.",
 "The current uncertainty may be part of the opportunity: resolving AOS's product status, ownership, enterprise demand, and value capture before a future financing could create an informational advantage.",
]
WHY_NOT_CHECK = [
 "AOS is not currently presented as a distinct publicly branded product in the official sources reviewed.",
 "The relationship between AOS, the Unicity Execution Model, tx-flow runtime, Sphere, bearer tokens, and the wider protocol is unresolved.",
 "No independently verified paid enterprise AOS customers have been identified.",
 "No public enterprise pricing or recurring revenue has been verified.",
 "The economic buyer and budget owner remain unclear.",
 "The legal and economic relationship between Unicity Labs and the Unicity Foundation requires diligence.",
 "It is unclear whether protocol or token success creates value for Unicity Labs shareholders.",
 "It is unclear whether enterprises can use the relevant product without adopting token or blockchain infrastructure.",
 "The announced seed reduces immediate financing actionability.",
 "Current public evidence does not establish the terms or timing of a future financing opportunity.",
]

# ---- Four diligence gates ----
FOUR_GATES = [
 ("Product truth", ["What AOS is today and whether it remains active",
   "Which code and documentation are specifically AOS",
   "Relationship to the Unicity Execution Model, tx-flow runtime, Sphere, bearer tokens, and Agent Sphere",
   "What currently ships, what is private, what is testnet-only, and what remains roadmap"]),
 ("Enterprise demand", ["Paid customers, active pilots, design partners, production deployments",
   "First economic buyer, budget owner, urgency, and willingness to pay",
   "A reference customer and a measurable business outcome",
   "Sales cycle and integration burden"]),
 ("Equity value capture", ["Which legal entity owns the intellectual property",
   "What Unicity Labs owns, what the Foundation governs, what belongs to the Protocol",
   "Whether a token is required and whether enterprises can adopt without token exposure",
   "How Unicity Labs generates revenue and how protocol success creates shareholder value"]),
 ("Financing availability", ["Legal entity that received the announced seed, current capitalization and runway",
   "Seed terms and current ownership structure",
   "Next financing milestone, expected timing, and amount likely required",
   "Whether a future investment opportunity is available and whether Headline could participate"]),
]
GATES_LINE = ("I think the potential outcome is strong enough to justify resolving these questions. I do not think "
              "the questions have already been resolved.")
INTEREST_VS_READY = (
"An interesting investment opportunity is not the same as a company ready to receive an investment today. AOS "
"qualifies as the first based on potential architecture, team, market importance, and asymmetric upside. The public "
"evidence does not yet support the second because product definition, enterprise demand, legal ownership, equity "
"value capture, and financing availability remain unresolved.")

FIRST_CALL_GATES = [
 "What exactly is AOS today?",
 "Which code, documentation, and live systems are specifically AOS?",
 "How does AOS relate to the current bearer-token product?",
 "Which legal entity owns the AOS intellectual property?",
 "What is owned by Unicity Labs versus the Foundation?",
 "Which customers or design partners are actively testing AOS?",
 "Is any deployment paid?",
 "Who is the first economic buyer?",
 "What problem causes that buyer to purchase now?",
 "Does enterprise adoption require a token?",
 "How does Unicity Labs capture revenue?",
 "How does protocol success create equity value?",
 "What product works without the broader protocol?",
 "What sits directly in the execution path?",
 "What can the system prevent that ordinary guardrails cannot?",
 "What benchmarks validate the architecture?",
 "What developer activity is retained rather than promotional?",
 "What milestones will the 3 million dollar seed finance?",
 "When is the next financing likely?",
 "What could Headline contribute before that round?",
]

NICOLAS_QA = [
 ("What exactly is AOS?", "A working thesis name for a secure execution, identity, policy, budget, and proof layer beneath autonomous agents. It is not a confirmed current product brand at Unicity; confirming its status is diligence question one."),
 ("Is AOS still an active product?", "Unresolved. The live site emphasizes bearer tokens and peer-to-peer settlement. The closest current artifacts are an execution-model specification and a tx-flow runtime in the GitHub organization."),
 ("Why does the current website emphasize bearer finance?", "Because the shipping product today is a peer-to-peer settlement protocol. The agent-governance framing is the thesis I am underwriting, not the current headline product."),
 ("What does Unicity Labs own?", "Presumably the commercial company and team output. Exact IP ownership between the company and the Foundation is unresolved and is a first-call question."),
 ("What does the Foundation own or govern?", "Protocol governance, grants, and open-source development, per the funding release. This can separate protocol value from company equity value."),
 ("How does equity value accrue?", "Unclear. That is the central value-capture question: if the protocol succeeds, which entity receives value and how does it reach an equity holder in Unicity Labs."),
 ("Does the product require a token?", "Unresolved. Enterprise buyers may resist token exposure, so whether AOS can be adopted without a token is a gating question."),
 ("Who is the enterprise buyer?", "Hypothesis: Head of AI Platform, CISO, or Head of Agent Infrastructure. No verified paid customer exists in the saved diligence."),
 ("Who is using this in production?", "No independently verified paid customer or production deployment was found. GitHub activity is not production usage."),
 ("Why does this need cryptography?", "The thesis is that enforcement and audit must be tamper-evident and in the execution path, which is a natural fit for cryptographic proofs and the team's Guardtime background."),
 ("Why can IAM or a cloud provider not solve this?", "They might. The bet is that agent-native identity, budgets, and proof at the execution boundary are different enough to warrant a new layer. Cloud absorption is a named risk."),
 ("Why can an agent framework not build this?", "They may add guardrails. The differentiation hypothesis is cryptographic, framework-neutral enforcement that the model cannot bypass. This must be validated."),
 ("Why select a company that already raised?", WHY_ALREADY_RAISED),
 ("Where is the sourcing alpha?", "In evidence separation and execution discipline: the engine distinguished real builders from reporters and commentary across 1,166 net-new Posts, then I applied human judgment."),
 ("Why AOS over ScaleDown?", WHY_AOS_OVER_SCALEDOWN),
 ("Why AOS over Vattara?", "Vattara has cleaner near-term SaaS mechanics, but AOS addresses a more foundational control problem with a stronger team and larger asymmetric outcome. I accept higher thesis risk in exchange."),
 ("What did the engine actually contribute?", "Deterministic evidence organization: attribution, artifact verification, deduplication, consolidation, and an auditable disposition for every candidate. It did not make the investment decision."),
 ("Why did you not let an LLM classify Posts?", "Determinism and auditability. The same input and configuration always produce the same result, and every decision traces to a rule and the evidence that triggered it."),
 ("Why did you spend so much time on approval controls?", "The credentials and credits were not mine. Fingerprinted, approved, budget-capped, one-time-locked requests treat someone else's capital with discipline."),
 ("How did the URL-parser error affect the first canary?", "An early t.co resolution defect was fixed using only saved data, with no additional API call, because raw responses were stored before any derived output."),
 ("What was the profile-enrichment classifier defect?", "The first pass did not pass post artifact domains and GitHub owners into the profile-to-company relation classifier, so all 14 defaulted to retain. It was re-derived offline from saved raw responses."),
 ("How did you fix it without another API call?", "Raw-before-derived storage meant the 14 profiles were already saved. I re-ran the deterministic classifier over saved data and versioned the corrected outputs."),
 ("How do you know the engine was deterministic?", "No LLM in the classification path, fixed rules and configuration, fingerprinted requests, and 450 passing tests after the final re-derivation."),
 ("What would version two add?", "Live count-informed query tuning, richer registry coverage, an optional human-in-the-loop review UI, and reconciliation against a real billing console."),
 ("Would you invest today?", WOULD_YOU_INVEST_TODAY),
 ("Why do you think this is an interesting investment?", WHY_INTERESTING_ANSWER),
 ("So is this actually an investment recommendation?", IS_THIS_A_RECOMMENDATION),
 ("What would make you walk away?", "If AOS is not a real distinct product, if enterprise adoption requires token exposure, or if protocol value cannot reach equity holders in Unicity Labs."),
]

# Founder call: 10 highest-priority questions (subset ordering)
FOUNDER_TOP10 = FIRST_CALL_GATES[:10]

# Buyers and go-to-market
BUYERS = ["Head of AI Platform", "Chief Information Security Officer", "VP Engineering",
          "Head of Developer Platform", "Head of Agent Infrastructure", "Chief Technology Officer",
          "Head of Payments", "Head of Digital Assets", "platform security team",
          "fintech infrastructure team", "autonomous-commerce developer"]
LAND_MOTIONS = ["secure runtime for a single high-risk agent", "identity and permission layer",
                "governed tool execution", "agent wallet or payment controls", "tamper-evident audit",
                "regulated agent workflow", "agent marketplace integration"]
EXPANSION_MOTIONS = ["more agents", "more governed actions", "more business units", "more transactions",
                     "more compliance policies", "settlement and payment volume", "developer ecosystem adoption"]

# Value capture paths
VALUE_PATHS = [
 ("Enterprise software license", "Annual platform fee for governance, runtime, policy, identity, audit, and support. Conventional recurring revenue."),
 ("Usage-based infrastructure", "Fee per agent action, per execution, per proof, per settlement event, or per governed tool call."),
 ("Developer platform", "Free developer tier, paid production usage, enterprise security and compliance controls, managed deployment."),
 ("Protocol and token economics", "Network or settlement fees, token-related value, foundation-controlled economics, with a potential mismatch between protocol success and equity value."),
]
VALUE_CAPTURE_QUESTION = ("If Unicity becomes successful, which entity receives the economic value, and how "
                          "does that value reach an equity investor in Unicity Labs?")

COMPANY_REPORTED_CLAIMS = [
 "The $3M seed round, its date, the lead (Blockchange), and participants (Outlier, Tawasal) come from a company-issued press release and are labelled founder/company-reported until an investor confirms independently.",
 "The team's Guardtime build-and-exit history and PhD composition are founder/company-reported.",
 "Throughput and finality figures (3M+ TPS, <1s finality) are official-company-source performance claims, not independently reproduced.",
 "Any AOS enterprise-governance capability is an analyst thesis; it is not an independently verified shipping product.",
]
UNRESOLVED_ISSUES = [
 "Whether AOS is a distinct, currently active product (vs. a historical or thesis name).",
 "The relationship between AOS, the Unicity Execution Model, tx-flow runtime, and the bearer-token protocol.",
 "The 'Astrid' enterprise-runtime description surfaced by a web fetch but not confirmed in the authoritative GitHub listing.",
 "Legal IP ownership split between Unicity Labs and the Unicity Foundation.",
 "Whether enterprise adoption requires token or protocol exposure.",
 "The enterprise buyer, budget owner, and any paid customer or production deployment.",
 "How protocol or token value reaches an equity investor in Unicity Labs.",
 "Exact next-round timing and whether Headline could participate later.",
]

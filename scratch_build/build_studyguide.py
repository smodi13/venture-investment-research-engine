"""Builds AOS_Engine_Study_Guide.pdf (15-25 pages). Reads exact query strings from config."""
import sys, os, yaml, json
sys.path.insert(0, os.path.dirname(__file__))
import facts as F
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable)

OUT=F.OUTDIR; NAVY=colors.HexColor("#1F2A44"); GOLD=colors.HexColor("#B8860B"); LGREY=colors.HexColor("#F2F3F5"); MGREY=colors.HexColor("#8A8F98")
ss=getSampleStyleSheet()
def stx(n,**k): return ParagraphStyle(n,parent=ss["Normal"],**k)
H1=stx("H1",fontName="Helvetica-Bold",fontSize=15,textColor=NAVY,spaceBefore=14,spaceAfter=7,leading=18)
H2=stx("H2",fontName="Helvetica-Bold",fontSize=11.5,textColor=NAVY,spaceBefore=11,spaceAfter=4,leading=14)
BODY=stx("BODY",fontName="Helvetica",fontSize=10,leading=14.5,alignment=TA_JUSTIFY,spaceAfter=7)
BULL=stx("BULL",fontName="Helvetica",fontSize=10,leading=14,leftIndent=14,spaceAfter=4)
MONO=stx("MONO",fontName="Courier",fontSize=7.6,leading=10,leftIndent=8,textColor=colors.HexColor("#333333"),spaceAfter=4)
CAP=stx("CAP",fontName="Helvetica",fontSize=8,textColor=MGREY,leading=10,spaceAfter=4)

def para(t): return Paragraph(t,BODY)
def h1(t): return Paragraph(t,H1)
def h2(t): return Paragraph(t,H2)
def bl(items): return [Paragraph(f"&bull;&nbsp; {x}",BULL) for x in items]

pilot=yaml.safe_load(open("config/queries.yaml"))
broad=yaml.safe_load(open("config/broad_market_queries.yaml"))

def esc(s): return (s or "").replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

E=[]
E.append(h1("AOS Engine Study Guide"))
E.append(Paragraph("Internal study document. Everything needed to explain the engine without the code. Prepared by Sahil Modi. July 2026. All figures USD. No em dashes.",CAP))
E.append(HRFlowable(width="100%",thickness=1,color=GOLD,spaceAfter=4))

E.append(h2("1. Executive summary"))
E.append(para("A deterministic X sourcing engine encodes an AI infrastructure and developer-tools thesis into curated queries, retrieves Posts from the official X recent-search API, and classifies each Post with rule-based logic. It separates real builders from reporters and commentary, verifies external artifacts, deduplicates, consolidates companies, and enriches a small number of profiles. It selected nothing on its own. It organized evidence, and the human made the final decision. The broad run processed 1,166 net-new Posts into 153 consolidated companies for about 7.72 dollars of estimated activity against a 25 dollar allowance, with 450 passing tests."))
E.append(h2("2. Assignment objective"))
E.append(para("Source and evaluate an early-stage company for Headline's AI infrastructure and software focus, using X as the primary signal, within a 25 dollar API allowance, and produce an investment recommendation with an auditable process."))
E.append(h2("3. Why X was used"))
E.append(para("Founders announce launches, open-source releases, and early traction on X before it reaches databases. The recent-search window captures builders at the moment of shipping."))
E.append(h2("4. Why the official X API rather than scraping"))
E.append(para("The official API is compliant, stable, and returns structured fields (entities, referenced_tweets, public_metrics) that make deterministic classification possible. Scraping is brittle, non-compliant, and lacks reliable structured URL entities."))

E.append(PageBreak())
E.append(h2("5. Initial six-query thesis"))
E.append(para(f"Six query families across three lanes. Config version {pilot.get('config_version')}. The literal text follows, read directly from config/queries.yaml and not paraphrased."))
E.append(h2("6. Exact literal text of all six initial queries"))
for q in pilot.get("queries",[]):
    E.append(Paragraph(f"<b>{esc(q.get('id'))}</b>",BULL))
    E.append(Paragraph(esc(q.get("query","")),MONO))
E.append(h2("7. The three initial sourcing lanes"))
E += bl(["Product launches and open-source artifacts.","Founder-transition signals.","Early customer or design-partner signals."])
E.append(h2("8. Per-query pilot results"))
p=F.PILOT
E.append(para(f"Pilot totals: {p['returned']} returned Posts, {p['unique']} unique after dedup, {p['authors']} authors, {p['direct_builder']} direct-builder claims, {p['level_a']} Level A artifact Posts, {p['retained']} retained ({p['keep_verified']} keep_verified, {p['keep_for_enrichment']} keep_for_enrichment), {p['enriched']} enriched, {p['comparison_set']}-company comparison set, about {p['cum_activity']} dollars cumulative activity."))
E.append(h2("9. Why the scope was expanded"))
E.append(para("The pilot concentrated in AI. To avoid a narrow result and test the thesis against the broader market, the system expanded to twenty query families across software, hardware, and physical products."))

E.append(PageBreak())
E.append(h2("10. Exact literal text of all 20 broad-market queries"))
E.append(Paragraph("Read directly from config/broad_market_queries.yaml. Not paraphrased.",CAP))
for q in broad.get("queries",[]):
    E.append(Paragraph(f"<b>{esc(q.get('id'))}</b> &nbsp; sector: {esc(q.get('sector_bucket'))} &nbsp; lane: {esc(q.get('discovery_lane'))} &nbsp; group: {esc(q.get('broad_group'))}",BULL))
    E.append(Paragraph(esc(q.get("query","")),MONO))
E.append(h2("11 and 12. Sector and discovery lane per query"))
data=[["Query","Sector","Lane"]]+[[q.get("id"),q.get("sector_bucket"),q.get("discovery_lane")] for q in broad.get("queries",[])]
t=Table(data,colWidths=[2.7*inch,2.0*inch,1.6*inch]); t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),colors.white),("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),7),("GRID",(0,0),(-1,-1),0.3,colors.HexColor("#CCCCCC")),("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,LGREY])]))
E.append(t)

E.append(PageBreak())
E.append(h2("13. Count-preflight results"))
b=F.BROAD
E.append(para(f"Twenty count requests over a shared seven-day window returned an aggregate count of {b['agg_7day']} across all queries. The aggregate is not a unique-Post total. It informed retrieval sizing and cost."))
E.append(h2("14. Retrieval resources and pages by query"))
E.append(para(f"The broad retrieval used {b['http_requests']} HTTP requests, at most two pages per query and at most 200 Posts per query, returning {b['returned']} Post resources under a 4,000-Post ceiling."))
E.append(h2("15. Complete cost ledger"))
data=[["Line item","Qty","Unit USD","Cost USD"]]+[[n,q,u,c] for n,q,u,c in F.COST_LEDGER]
data += [["Initial cumulative","","",F.COST_INITIAL_TOTAL],["Total estimated activity","","",F.COST_TOTAL],["Original allowance","","",F.COST_ALLOWANCE],["Estimated remaining","","",F.COST_REMAINING]]
t=Table(data,colWidths=[3.0*inch,0.7*inch,0.9*inch,0.9*inch]); t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),colors.white),("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),7.5),("GRID",(0,0),(-1,-1),0.3,colors.HexColor("#CCCCCC")),("ROWBACKGROUNDS",(0,1),(-1,-5),[colors.white,LGREY]),("FONTNAME",(0,-4),(-1,-1),"Helvetica-Bold")]))
E.append(t)
E.append(Paragraph("Billing was estimated only. The developer console belonged to an external project and was never accessible. Cost accounting used actual returned billable resources.",CAP))

E.append(PageBreak())
E.append(h2("16 to 19. Deduplication and provenance"))
E += bl([f"Cross-run deduplication removed {b['cross_dupe']} Posts already seen in prior runs.",
 f"Within-run deduplication removed {b['within_dupe']} duplicate records surfaced by more than one query.",
 f"{b['multi_query']} Posts were surfaced by more than one query and kept once, with provenance preserved.",
 "Every Post retained a record of which query and page produced it."])
E.append(h2("20 to 24. URL parsing and artifacts"))
E += bl(["Artifact URL resolution order: unwound_url, then expanded_url, then original URL.",
 "t.co links were resolved to their unwound or expanded targets before classification.",
 "unwound_url is the fully resolved destination; expanded_url is the display target; original is the raw t.co.",
 "X-only URLs (x.com, twitter.com, t.co, X images, X videos, profile links, quoted-Post links) were excluded as external artifacts.",
 "GitHub owner and repository were extracted from resolved GitHub URLs for identity and consolidation."])
E.append(h2("25. Evidence Levels A, B, C, D"))
E += bl(["A: a directly verifiable non-X artifact (product site, GitHub repo, docs, API page, live demo, changelog, spec). Proves existence, not ownership, formation, traction, revenue, or venture quality.",
 "B: a direct founder or builder claim without independent support.","C: a third-party signal from a reporter, customer, investor, or market participant.","D: a deterministic engine inference."])
E.append(h2("26 to 28. Attribution and identity"))
E += bl(["Announcement attribution: direct_builder_claim, third_party_announcement, industry_commentary, unclear.",
 "Actor-project relation: self, self_organization, third_party, unclear.",
 "A direct-builder claim required grammatical ownership of the building, launching, shipping, deploying, or piloting action.",
 "Claimed versus verified project identity were tracked separately; a name was never invented from a generic description."])

E.append(PageBreak())
E.append(h2("29 to 31. Organization registry"))
E += bl(["A registry of known organizations scoped artifact ownership.",
 "Domain matching was exact or dot-boundary subdomain only, never substring, to avoid false positives.",
 "Unregistered did not mean startup. It meant not present in the registry, which is a separate question from company stage."])
E.append(h2("32 to 33. Lead dispositions and precedence"))
E += bl(["Initial dispositions: keep_verified, keep_for_enrichment, archive_third_party, archive_commentary, archive_established_org, manual_review.",
 "Precedence ran commentary, then third-party, then established organization, then services, then marketplace, then out of scope, then keep_verified, then keep_for_enrichment, then manual_review, then archive_low_quality.",
 "Archived records were preserved, never deleted."])
E.append(PageBreak())
E.append(h2("34 to 37. Broad-market relevance, sector, fit, attractiveness"))
E += bl(["broad_market_relevance was a separate field so non-AI candidates were not archived by an AI-only rule.",
 "sector_bucket classified each candidate by product evidence, not only by the query that surfaced it.",
 "headline_mandate_fit was separate from general venture attractiveness.",
 "A low Headline fit never automatically archived an otherwise compelling company."])
E.append(h2("38 to 40. Scoring and consolidation"))
E += bl(["A 100-point research score summed category fit, ownership and identity, team signal, product evidence, customer evidence, recurring potential, differentiation, execution momentum, and financing timing.",
 "Engagement counts, likes, reposts, and badges did not add points.",
 "Companies were consolidated on exact product domain, exact GitHub owner and repository, or exact normalized project name plus author.",
 "Duplicate evidence did not increase scores because consolidation deduplicated artifacts by canonical URL and used the best record, not the sum."])
E.append(h2("41 to 46. Profile enrichment"))
E += bl(["Enrichment selected only profiles where identity could materially change the decision, capped at a small set.",
 "User endpoint: GET https://api.x.com/2/users.",
 "Requested fields: id, name, username, description, url, entities, location, created_at, public_metrics, verified, protected, pinned_tweet_id.",
 "Role classifications separated founder, cofounder, executive, builder, engineer, employee, organization, analyst or reviewer, services operator, independent hobby builder, and student builder.",
 "A profile username matching the Post author was circular self-identity, not independent corroboration.",
 "A different current employer plus a personal repository was treated as an independent side project, not an automatic archive."])
E.append(PageBreak())
E.append(h2("47 to 49. The classifier defect and offline correction"))
E += bl(["The first enrichment pass did not pass post artifact domains and GitHub owners into the profile-to-company relation classifier, so all fourteen defaulted to retain.",
 "Because raw responses were stored before any derived output, the fourteen profiles were already saved.",
 "The classifier was re-run offline over the saved raw responses, with no additional API call, and the corrected outputs were versioned. The corrected pass produced advances, watchlist items, and archives."])

E.append(PageBreak())
E.append(h2("50 to 61. Approval architecture and governance"))
E += bl(["Every paid request built a canonical request describing the exact operation, fields, caps, budget, and endpoint.",
 "A SHA-256 fingerprint over that canonical request gated approval and execution.",
 "Approval required typed confirmation of the exact operation name.",
 "Approvals expired after a 15-minute time to live.",
 "Budgets used exact decimal arithmetic, never floating point.",
 "An atomic one-time execution lock prevented accidental re-execution.",
 "A failed request still consumed its approval, so a failure could not silently retry.",
 "Raw responses were written before any derived output, which enabled later offline correction.",
 "Fail-closed conditions blocked execution on any fingerprint mismatch, expiry, budget breach, or missing approval.",
 "Billing was estimated only.",
 "The external developer console could not be reconciled because the token belonged to an external project.",
 "The final test suite had 450 passing tests after the enrichment re-derivation."])
E.append(PageBreak())
E.append(h2("62. Full test history and final test count"))
E.append(para("The suite grew with each phase and finished at 450 passing tests after the offline enrichment re-derivation, covering money arithmetic, timezones, rate limiting, URL parsing, ownership, registry matching, enrichment, approval gates, locks, and the broad-market and re-derivation logic."))
E.append(h2("63 and 64. What the engine deliberately does not do, and known limitations"))
E += bl(["It does not use an LLM in the classification or disposition path.",
 "It does not retrieve timelines, followers, following, Lists, memberships, replies, quote expansions, or pinned Posts.",
 "It does not browse websites or GitHub during classification.",
 "It searches only X's recent seven-day window with approved queries, so it does not review the entire startup market.",
 "It cannot confirm ownership, revenue, or production usage from a Post alone."])
E.append(h2("65. What version two should add"))
E += bl(["Count-informed adaptive query tuning.","Richer organization registry coverage.","An optional human-in-the-loop review interface.","Reconciliation against a real billing console.","Longer historical windows through the full-archive endpoint where budget allows."])
E.append(PageBreak())
E.append(h1("HOW THE ENGINE LED TO A FOCUSED DILIGENCE RECOMMENDATION"))
E.append(para("This describes how the process reached a focused diligence recommendation, which is distinct from a decision to write a check. The engine organized evidence; the human made the selection; and the recommendation is to advance into diligence, not to fund today."))
E += bl([
 "1. The engine generated and organized the candidate universe.",
 "2. Deterministic rules separated builders from reporters and noise.",
 "3. Profile enrichment clarified identity.",
 "4. Public diligence tested company quality.",
 "5. The standardized scorecard measured current evidence completeness.",
 "6. Human judgment considered team quality, technical depth, and asymmetric upside.",
 "7. ScaleDown scored higher on evidence completeness (5.95 versus 5.55).",
 "8. AOS was selected as the most interesting company for further investment diligence.",
 "9. The final recommendation is to advance into diligence.",
 "10. The public evidence does not support writing a check today.",
])
E.append(para(F.SCORECARD_EXPLANATION))
E.append(PageBreak())
E.append(h2("66. Glossary"))
E += bl(["Level A artifact: verifiable non-X artifact.","Direct-builder claim: grammatical ownership of a build or launch action.","Consolidation: deterministic company merge.","Fingerprint: SHA-256 over the canonical request.","Bearer token: self-proving asset transferable peer to peer.","AOS: working thesis name for a secure agent execution and proof layer."])

E.append(PageBreak())
E.append(h2("67 and 68. Likely technical questions from Nicolas, with concise answers"))
for q,a in F.NICOLAS_QA[16:24]:
    E.append(Paragraph(f"<b>{esc(q)}</b>",stx("q",fontName="Helvetica-Bold",fontSize=8.6,textColor=NAVY,spaceBefore=2,spaceAfter=1,leading=10)))
    E.append(para(esc(a)))
E.append(PageBreak())
E.append(h2("69. Twenty flashcards"))
fc=[
 "Engine picked AOS? No. It organized evidence; the human chose.",
 "Live Unicity product? Bearer-token peer-to-peer settlement.",
 "Is AOS confirmed? No. Status is diligence question one.",
 "Search endpoint? GET /2/tweets/search/recent.",
 "Count endpoint? GET /2/tweets/counts/recent.",
 "User endpoint? GET /2/users.",
 "Artifact order? unwound, expanded, original.",
 "Level A proves? Existence, not ownership.",
 "Level B? Founder or builder claim.",
 "Level C? Third-party signal.",
 "Level D? Engine inference.",
 "Net-new broad Posts? 1,166.",
 "Actionable Posts? 187.",
 "Consolidated companies? 153.",
 "Profiles enriched? 14, all returned.",
 "Total estimated activity? About 7.72 dollars.",
 "Allowance? 25 dollars.",
 "Tests passing? 450.",
 "Seed lead? Blockchange, reported, Feb 2026.",
 "Recommendation? Focused diligence, not a check.",
]
E += bl(fc)
E.append(h2("70. Ten self-test questions with answers"))
st10=[
 "Why no LLM in classification? For determinism and auditability.",
 "Why fingerprint requests? To bind approval to an exact configuration.",
 "Why does a failed request consume approval? To prevent silent retries of someone else's capital.",
 "Why store raw before derived? To allow offline correction without new API calls.",
 "What did the URL defect affect? Early t.co resolution in the first canary, fixed from saved data.",
 "What did the enrichment defect cause? All fourteen defaulted to retain; fixed offline.",
 "Why is unregistered not startup? Registry absence is not company stage.",
 "Why does duplicate evidence not raise scores? Consolidation dedupes artifacts and uses the best record.",
 "Why did AOS not win the scorecard? ScaleDown scored higher; AOS was a human judgment.",
 "What is the central AOS question? Whether it is a distinct product with equity value capture.",
]
E += bl(st10)

doc=SimpleDocTemplate(os.path.join(OUT,"AOS_Engine_Study_Guide.pdf"),pagesize=letter,leftMargin=0.7*inch,rightMargin=0.7*inch,topMargin=0.6*inch,bottomMargin=0.5*inch,title="AOS Engine Study Guide")
doc.build(E)
print("study guide built")

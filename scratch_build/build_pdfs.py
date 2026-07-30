"""Builds the one-page memo, call playbook, and engine study guide PDFs (reportlab)."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import facts as F
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                PageBreak, HRFlowable, KeepTogether, Frame, PageTemplate, BaseDocTemplate)

OUT = F.OUTDIR
NAVY = colors.HexColor("#1F2A44")
GOLD = colors.HexColor("#B8860B")
LGREY = colors.HexColor("#F2F3F5")
MGREY = colors.HexColor("#8A8F98")

ss = getSampleStyleSheet()
def st(name, **kw):
    base = kw.pop("parent", ss["Normal"])
    return ParagraphStyle(name, parent=base, **kw)

# ---------------------------------------------------------------- ONE PAGER
def build_one_pager():
    path = os.path.join(OUT, "AOS_Unicity_One_Page_Investment_Memo.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter, leftMargin=0.5*inch, rightMargin=0.5*inch,
                            topMargin=0.42*inch, bottomMargin=0.4*inch, title="Unicity Labs / AOS Thesis One-Pager")
    title = st("t", fontName="Helvetica-Bold", fontSize=14, textColor=NAVY, spaceAfter=1, leading=15)
    sub = st("s", fontName="Helvetica", fontSize=8, textColor=MGREY, spaceAfter=3, leading=9)
    h = st("h", fontName="Helvetica-Bold", fontSize=7.6, textColor=colors.white, backColor=NAVY,
           leading=10, spaceBefore=3, spaceAfter=2, leftIndent=2, borderPadding=(1.5,2,1.5,2))
    body = st("b", fontName="Helvetica", fontSize=7.3, leading=8.6, alignment=TA_JUSTIFY, spaceAfter=2)
    small = st("sm", fontName="Helvetica", fontSize=6.6, leading=7.6, textColor=MGREY)
    E = []
    E.append(Paragraph("AOS / Unicity Labs Investment Thesis", title))
    E.append(Paragraph("Headline take-home. Selected company for focused investment diligence. Sahil Modi for Nicolas von Blottnitz. July 2026. All figures USD.", sub))
    E.append(HRFlowable(width="100%", thickness=1.1, color=GOLD, spaceAfter=3))

    def sec(t): return Paragraph(t, h)
    def bp(t): return Paragraph(t, body)

    left, right = [], []
    left.append(sec("ONE-LINE PITCH"))
    left.append(bp("As AI agents become systems of action that call tools, move value, and coordinate, enterprises may need identity, policy, budgets, isolation, and tamper-evident audit <b>in the execution path, below the model</b>. AOS is the working thesis for that control and proof layer. This is an interesting investment opportunity selected through human judgment, not the top standardized score."))
    left.append(sec("WHY THIS IS AN INTERESTING INVESTMENT"))
    left.append(bp("<b>Foundational control problem:</b> an agent that can act may need controls the model cannot bypass. <b>Horizontal infrastructure:</b> AOS could sit beneath many agent applications, not one workflow. <b>Team signal (company-reported):</b> cryptography, distributed systems, and a Guardtime build and exit. <b>Potential moat:</b> an execution and proof layer, not another prompt filter or dashboard. <b>Category timing:</b> the need grows as agents gain economic authority. <b>Asymmetric upside:</b> becoming part of the control plane for autonomous software. <b>Headline fit:</b> agent authentication, runtimes, sandboxes, orchestration, and agent security."))
    left.append(sec("COMPANY AND ENTITY MAP"))
    left.append(bp("<b>Unicity Labs</b> (Zug): operating company and team. <b>Unicity Foundation</b> (Switzerland): protocol governance, grants, open source. <b>Unicity Protocol</b>: bearer-token, peer-to-peer settlement, the live product today. <b>AOS</b>: working thesis for a secure agent execution and proof layer; the official sources reviewed did not present it as a distinct publicly branded product. <b>Agent Sphere / Sphere SDK</b>: agent wallet and payments. Distinguishing these is diligence gate one."))
    left.append(sec("TEAM AND EVIDENCE"))
    left.append(bp("Mike Gault, CEO, is reported to have built and exited <b>Guardtime</b> (cryptographic infrastructure). Company-reported experience in distributed systems, cryptography, and machine learning. <b>Verified direction:</b> live bearer-token protocol and open-source stack. <b>Unresolved:</b> any AOS enterprise product, paid customers, or production deployments. GitHub activity is not commercial traction."))

    right.append(sec("WHY I WOULD NOT WRITE A CHECK YET"))
    right.append(bp("<b>Product ambiguity:</b> AOS is not presented as a distinct branded product in official sources reviewed. <b>No verified paid demand:</b> no independently verified paid enterprise customer, pricing, or recurring revenue. <b>Unclear entity ownership:</b> the Labs and Foundation relationship needs diligence. <b>Unclear equity value capture:</b> it is unclear how protocol or token success reaches Unicity Labs shareholders. <b>Token and protocol dependence:</b> enterprise adoption may require token or blockchain exposure. <b>Financing evidence:</b> the announced seed reduces immediate actionability and future terms are not established."))
    right.append(sec("COMPETITION"))
    right.append(bp("Runtime and sandbox (E2B, Modal, Daytona, Fly.io). Identity (Auth0, Stytch, Descope, WorkOS, MCP auth). Governance and security (Lakera, Protect AI, HiddenLayer, Prompt Security, CalypsoAI). Payments (Skyfire, Coinbase x402, Google AP2, Nevermined, stablecoin rails). Protocols (MCP, A2A, Fetch.ai). Internal build with cloud IAM and gateways. Overlap with AOS is a hypothesis; no invented funding or customers."))
    right.append(sec("RECOMMENDATION"))
    right.append(bp("<b>Advance Unicity Labs into focused founder, product, enterprise-demand, and value-capture diligence. Do not write a check now.</b> AOS may address a foundational infrastructure need as autonomous agents gain authority to act, transact, and coordinate, but the company must first confirm what AOS is today, demonstrate urgent enterprise demand, establish how value reaches Unicity Labs equity, and clarify future financing availability."))
    right.append(sec("FOUR DILIGENCE GATES"))
    right.append(bp("<b>1) Product truth:</b> what AOS is today and how it relates to the Execution Model, tx-flow runtime, Sphere, and bearer tokens. <b>2) Enterprise demand:</b> paid customers, pilots, buyer, and willingness to pay. <b>3) Equity value capture:</b> which entity owns the IP and how protocol success reaches Labs equity. <b>4) Financing availability:</b> capitalization, next-round timing, and whether Headline could participate. The standardized scorecard favored ScaleDown (5.95 vs 5.55); I selected AOS as the most interesting company for diligence, not the highest-evidence one."))

    ltab = Table([[left]], colWidths=[3.62*inch]); ltab.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),6)]))
    rtab = Table([[right]], colWidths=[3.62*inch]); rtab.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),0)]))
    cols = Table([[ltab, rtab]], colWidths=[3.72*inch, 3.72*inch])
    cols.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LINEBEFORE",(1,0),(1,0),0.5,colors.HexColor("#D0D3D8")),("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0)]))
    E.append(cols)
    E.append(Spacer(1,3))
    # compact funnel strip + legend
    funnel = [["ENGINE FUNNEL (broad run)","1,279 returned","1,166 net-new","187 actionable","153 companies","14 enriched","$7.72 of $25 est."]]
    ft = Table(funnel, colWidths=[1.62*inch]+[0.97*inch]*6)
    ft.setStyle(TableStyle([("BACKGROUND",(0,0),(0,0),NAVY),("TEXTCOLOR",(0,0),(0,0),colors.white),
        ("BACKGROUND",(1,0),(-1,0),LGREY),("FONTNAME",(0,0),(-1,-1),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),6),
        ("ALIGN",(0,0),(-1,-1),"CENTER"),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("GRID",(0,0),(-1,-1),0.4,colors.white),("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3)]))
    E.append(ft)
    E.append(Spacer(1,2))
    E.append(Paragraph("Evidence legend: Confirmed public source | Official company source | Company-reported | Founder-reported | Investor-reported | Engine-derived | Analyst hypothesis | Unresolved. Honesty note: ScaleDown scored higher on the standardized scorecard (5.95 vs 5.55). AOS was selected by human judgment. No public Headline investment or interest in Unicity was identified; that is not the same as confirming none exists.", small))
    doc.build(E)
    return path

# ---------------------------------------------------------------- shared multipage doc
def multipage(path, title):
    doc = SimpleDocTemplate(path, pagesize=letter, leftMargin=0.7*inch, rightMargin=0.7*inch,
                            topMargin=0.7*inch, bottomMargin=0.6*inch, title=title)
    return doc

H1 = st("H1", fontName="Helvetica-Bold", fontSize=16, textColor=NAVY, spaceBefore=8, spaceAfter=6, leading=18)
H2 = st("H2", fontName="Helvetica-Bold", fontSize=11.5, textColor=NAVY, spaceBefore=11, spaceAfter=4, leading=13)
BODY = st("BODY", fontName="Helvetica", fontSize=10, leading=14, alignment=TA_JUSTIFY, spaceAfter=6)
BULL = st("BULL", fontName="Helvetica", fontSize=10, leading=13.5, leftIndent=12, spaceAfter=4, bulletIndent=2)
SCRIPT = st("SCRIPT", fontName="Helvetica-Oblique", fontSize=10, leading=14.5, alignment=TA_JUSTIFY,
            leftIndent=10, rightIndent=10, spaceBefore=12, spaceAfter=8, backColor=LGREY, borderPadding=(7,8,7,8))
CAP = st("CAP", fontName="Helvetica", fontSize=7.5, textColor=MGREY, leading=9)

def para(t): return Paragraph(t, BODY)
def h1(t): return Paragraph(t, H1)
def h2(t): return Paragraph(t, H2)
def bullets(items): return [Paragraph(f"&bull;&nbsp; {x}", BULL) for x in items]
def script_block(t): return Paragraph(t.replace("\n\n","<br/><br/>"), SCRIPT)

# ---------------------------------------------------------------- CALL PLAYBOOK
def build_playbook():
    path = os.path.join(OUT, "AOS_Unicity_Call_Playbook.pdf")
    doc = multipage(path, "AOS / Unicity Labs Call Playbook (internal)")
    E=[]
    E.append(h1("AOS / Unicity Labs Call Playbook"))
    E.append(Paragraph("Internal only. Do not send. Prepared by Sahil Modi. July 2026. All figures USD. No em dashes.", CAP))
    E.append(HRFlowable(width="100%", thickness=1, color=GOLD, spaceAfter=4))

    E.append(h2("1. Thirty-minute meeting plan"))
    E += bullets([
      "0 to 2 min: Open. State the honest headline: the engine also surfaced a higher-scoring, more conventional company (ScaleDown), and I did not pick it.",
      "2 to 5 min: Sixty-second engine story. Establish sourcing discipline.",
      "5 to 12 min: AOS thesis and the entity map. Be explicit that AOS status is diligence question one.",
      "12 to 20 min: Team, architecture, funding, competition, and value capture.",
      "20 to 27 min: Risks and the diligence plan. Lead with the risks I already see.",
      "27 to 30 min: Recommendation. Advance to focused diligence and relationship development, not a check.",
    ])
    E.append(h2("2. Sixty-second opener"))
    E.append(script_block("I built a deterministic X sourcing engine around an AI infrastructure thesis, expanded it to twenty query families, and processed 1,166 net-new Posts into 153 consolidated companies for about seven dollars and seventy-two cents of estimated API activity. The engine organized evidence. It did not choose. It surfaced a higher-scoring, more conventional company, ScaleDown, which I did not select. I chose Unicity Labs and its AOS thesis for team, architecture, and asymmetric upside, and I want to walk you through that judgment, including its risks."))
    E.append(h2("3. Thirty-second AOS pitch"))
    E.append(script_block("Agents are becoming systems of action. Prompt guardrails do not bind a model that can be talked out of its instructions. Enterprises will need identity, budgets, policy, and audit in the execution path, below the model. AOS is the thesis for that control and proof layer. The team came out of Guardtime. The risk is that the current product is a Web3 settlement protocol and value capture for equity is unproven, so I recommend focused diligence, not a check."))
    E.append(h2("4. Ninety-second AOS pitch"))
    E.append(script_block(F.AOS_PITCH_90S))
    E.append(h2("5. Three-minute AOS discussion structure"))
    E += bullets([
      "Frame the shift from agents that generate to agents that act.",
      "Name the control gap: the model cannot be its own enforcement boundary.",
      "Position AOS as identity, policy, budget, isolation, settlement, and proof at the execution layer.",
      "Credit the team: Guardtime build and exit, cryptography and distributed systems.",
      "State the honest status: bearer-token protocol is the live product; AOS as a distinct enterprise product is unresolved.",
      "Close on posture: focused diligence and relationship development, not an immediate check.",
    ])
    E.append(h2("5b. Investment posture: exact answers"))
    E.append(Paragraph("<b>Q: Why do you think this is an interesting investment?</b>", st("q1", fontName="Helvetica-Bold", fontSize=10, textColor=NAVY, spaceBefore=3, spaceAfter=2, leading=12)))
    E.append(script_block(F.WHY_INTERESTING_ANSWER))
    E.append(Paragraph("<b>Q: Would you invest today?</b>", st("q2", fontName="Helvetica-Bold", fontSize=10, textColor=NAVY, spaceBefore=3, spaceAfter=2, leading=12)))
    E.append(script_block(F.WOULD_YOU_INVEST_TODAY))
    E.append(Paragraph("<b>Q: So is this actually an investment recommendation?</b>", st("q3", fontName="Helvetica-Bold", fontSize=10, textColor=NAVY, spaceBefore=3, spaceAfter=2, leading=12)))
    E.append(script_block(F.IS_THIS_A_RECOMMENDATION))
    E.append(Paragraph(f"<b>Short version:</b> {F.SHORT_INTEREST_LINE}", BODY))
    E.append(h2("5c. The four diligence gates"))
    for gname, items in F.FOUR_GATES:
        E.append(Paragraph(f"<b>{gname}</b>", st("g", fontName="Helvetica-Bold", fontSize=10, textColor=NAVY, spaceBefore=2, spaceAfter=1, leading=12)))
        E += bullets(items)
    E.append(para(F.GATES_LINE))
    E.append(PageBreak())
    E.append(h2("6. Word for Word: The Full Engine Story, Approximately 90 to 110 Seconds"))
    E.append(script_block(F.FULL_ENGINE_SCRIPT))
    E.append(h2("7. Shorter engine script"))
    E.append(script_block(F.SHORT_ENGINE_SCRIPT))
    E.append(h2("8. Three anchor lines"))
    E += bullets(F.ANCHOR_LINES)
    E.append(PageBreak())
    E.append(h2("9. Why AOS over ScaleDown"))
    E.append(script_block(F.WHY_AOS_OVER_SCALEDOWN))
    E.append(h2("10. Why AOS over Vattara"))
    E.append(script_block("Vattara has cleaner near-term SaaS mechanics, a live product, and public pricing. I still chose AOS because it addresses a more foundational control problem, has a stronger team, and offers a larger asymmetric outcome. I accept more thesis and value-capture risk in exchange, which is why the recommendation is diligence, not a check."))
    E.append(h2("11. Why select an already-funded company"))
    E.append(script_block(F.WHY_ALREADY_RAISED))
    E.append(h2("12. Strongest reason to invest"))
    E.append(para("If agents gain economic authority, a cryptographic, model-agnostic execution and proof layer could become horizontal infrastructure. The team has done cryptographic infrastructure before and exited. Headline has publicly named runtimes, sandboxes, authentication, MCP, and orchestration as priority agent-infrastructure problems."))
    E.append(h2("13. Strongest reason not to invest"))
    E.append(para("The live product is a Web3 settlement protocol, AOS as a distinct enterprise product is unconfirmed, value may accrue to a token or the Foundation rather than equity, and the seed is already closed."))
    E.append(h2("14. What would change my mind"))
    E += bullets([
      "Confirmation that AOS is a real, distinct product with code and docs.",
      "A named enterprise design partner or paid pilot.",
      "A credible path where equity, not just a token, captures value.",
      "Evidence that adoption does not require token exposure.",
    ])
    E.append(h2("15. Ten highest-priority founder questions"))
    E += bullets(F.FOUNDER_TOP10)
    E.append(PageBreak())
    E.append(h2("16 and 17. Likely questions from Nicolas, with concise answers"))
    for q,a in F.NICOLAS_QA:
        E.append(Paragraph(f"<b>{q}</b>", st("q", fontName="Helvetica-Bold", fontSize=9, textColor=NAVY, spaceBefore=3, spaceAfter=1, leading=11)))
        E.append(para(a))
    E.append(PageBreak())
    E.append(h2("18. Objection handling"))
    E += bullets([
      "This is just crypto: Concede the current product is Web3 settlement, then separate the AOS enterprise-governance thesis and make it a diligence gate.",
      "Cloud providers will add this: Agree they can add guardrails, then argue cryptographic, model-agnostic enforcement at the execution boundary is different and must be validated.",
      "They already raised: Agree it is not an open transaction, position as relationship and next-round work.",
      "No customers: Agree, state that no paid customer is verified, and make customer pull the first diligence gate.",
    ])
    E.append(h2("19. Evidence language to use"))
    E += bullets(["Company-reported for the round, team history, and stage.",
      "Official company source for the live protocol and site claims.",
      "Analyst hypothesis for buyer, moat, and value capture.",
      "Unresolved for AOS status and equity value capture."])
    E.append(h2("20. Evidence language to avoid"))
    E += bullets(["Do not say AOS is a live enterprise product.",
      "Do not say funding proves demand.",
      "Do not say token value accrues to equity.",
      "Do not say Headline can invest in the current round.",
      "Do not present hypothetical unit economics or valuations as facts."])
    E.append(h2("21. Closing statement"))
    E.append(script_block(F.CLOSING_STATEMENT))
    E.append(h2("22. Send checklist"))
    E += bullets(["Send one-pager and deck PDF 45 to 60 minutes before the call.",
      "Keep the workbook, editable deck, source ledger, and study guide in reserve.",
      "Never send this playbook, raw outputs, approvals, locks, or credentials."])
    E.append(PageBreak())
    E.append(h2("23. Full engine technical reference"))
    E += bullets([
      "Search endpoint: GET https://api.x.com/2/tweets/search/recent.",
      "Count endpoint: GET https://api.x.com/2/tweets/counts/recent.",
      "User endpoint: GET https://api.x.com/2/users.",
      "Broad Post fields: id, created_at, author_id, lang, public_metrics, entities, referenced_tweets.",
      "Final User fields: id, name, username, description, url, entities, location, created_at, public_metrics, verified, protected, pinned_tweet_id.",
      "No timelines, followers, following, Lists, memberships, replies, quote expansions, or pinned Posts were retrieved.",
      "Engagement was stored for audit but did not qualify a lead.",
      "Artifact URL resolution order: unwound_url, then expanded_url, then original URL.",
      "Excluded artifact domains: x.com, twitter.com, t.co, X images, X videos, profile links, quoted-Post links.",
      "Level A: a directly verifiable non-X artifact (product site, GitHub repo, docs, API page, live demo, changelog, spec). It proves the artifact exists, not ownership, company formation, traction, revenue, or venture quality.",
      "Level B: a direct founder or builder claim without independent support. Level C: a third-party signal. Level D: a deterministic engine inference.",
      "Attribution: direct_builder_claim, third_party_announcement, industry_commentary, unclear. Actor relation: self, self_organization, third_party, unclear.",
      "No LLM made classification or disposition decisions. Same input and config yield the same result.",
    ])
    E.append(h2("24. Complete cost ledger (estimated only)"))
    data=[["Line item","Qty","Unit USD","Cost USD"]]+[[n,q,u,c] for n,q,u,c in F.COST_LEDGER]
    data.append(["Total estimated activity","","",F.COST_TOTAL])
    data.append(["Original allowance","","",F.COST_ALLOWANCE])
    data.append(["Estimated remaining","","",F.COST_REMAINING])
    t=Table(data, colWidths=[2.9*inch,0.7*inch,0.9*inch,0.9*inch])
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),colors.white),
      ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),8),("GRID",(0,0),(-1,-1),0.4,colors.HexColor("#CCCCCC")),
      ("ROWBACKGROUNDS",(0,1),(-1,-4),[colors.white,LGREY]),("FONTNAME",(0,-3),(-1,-1),"Helvetica-Bold"),
      ("BACKGROUND",(0,-3),(-1,-1),colors.HexColor("#EDE7D4"))]))
    E.append(t)
    E.append(Paragraph("Billing was estimated only. The developer console belonged to an external project and was never accessible. Safety budgets did not authorize additional resources.", CAP))
    E.append(h2("25. Exact query appendix"))
    E.append(para("The six pilot queries and the twenty broad-market queries are reproduced verbatim in the Engine Study Guide, read directly from the saved configuration files. They are not paraphrased."))
    E.append(h2("26. Glossary"))
    E += bullets([
      "Bearer token: a self-contained, self-proving asset transferable peer to peer without a shared ledger.",
      "AOS: working thesis name for a secure agent execution and proof layer.",
      "Level A artifact: a verifiable non-X artifact such as a repo, site, docs, or demo.",
      "Direct-builder claim: grammatical ownership of a build, launch, ship, deploy, or pilot action.",
      "Consolidation: deterministic merge on exact repo, domain, or project plus author.",
      "Fingerprint: a SHA-256 over the exact canonical request that gates approval and execution.",
    ])
    E.append(h2("27. Flashcards"))
    E += bullets([
      "Q: Did the engine pick AOS? A: No. It organized evidence. I chose AOS.",
      "Q: What is the live Unicity product? A: A bearer-token peer-to-peer settlement protocol.",
      "Q: Is AOS a confirmed product? A: No. Status is diligence question one.",
      "Q: Estimated total activity? A: About 7.72 dollars of a 25 dollar allowance.",
      "Q: Who led the seed? A: Blockchange Ventures, reported, February 2026.",
      "Q: Recommendation? A: Focused diligence and relationship development, not a check.",
    ])
    E.append(h2("28. Self-test quiz"))
    E += bullets([
      "Name the three risks you would raise before Nicolas does.",
      "State the value-capture question in one sentence.",
      "Explain why funding does not prove demand.",
      "Give the artifact resolution order.",
      "Explain why no LLM was in the classification path.",
    ])
    doc.build(E)
    return path

if __name__ == "__main__":
    p1 = build_one_pager(); print("one-pager:", p1)
    p2 = build_playbook(); print("playbook:", p2)

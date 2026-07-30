"""Rebuilds AOS_Unicity_One_Page_Investment_Memo.pdf in the Vattara one-pager format.
Dense, single full page: big header, two-column top (prose + sidebar), full-width
business model, competitor table, engine-metrics strip, investment-view box, sources.
No em dashes anywhere.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import facts as F
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepInFrame

BLUE = colors.HexColor("#2E5A9E")
DKBLUE = colors.HexColor("#1F3B66")
GOLD = colors.HexColor("#B8860B")
SBBG = colors.HexColor("#EAF0F8")
SBBORD = colors.HexColor("#B9CCE6")
GREEN = colors.HexColor("#2E7D32")
TAN = colors.HexColor("#8A6D1A")
GREY = colors.HexColor("#5A5F68")
DKG = colors.HexColor("#232323")

def S(name, **kw):
    return ParagraphStyle(name, **kw)

NAME = S("name", fontName="Helvetica-Bold", fontSize=25, textColor=BLUE, leading=26)
SUBT = S("subt", fontName="Helvetica", fontSize=7.8, textColor=GREY, leading=9.4)
WS = S("ws", fontName="Helvetica-Bold", fontSize=7.6, textColor=GREY, leading=10, alignment=TA_RIGHT)
BODY = S("body", fontName="Helvetica", fontSize=7.4, leading=8.5, alignment=TA_JUSTIFY, textColor=DKG, spaceAfter=2.1)
SBH = S("sbh", fontName="Helvetica-Bold", fontSize=9, textColor=BLUE, leading=10.5, spaceBefore=1.5, spaceAfter=1.5)
SB = S("sb", fontName="Helvetica", fontSize=7.2, leading=8.5, textColor=DKG, spaceAfter=0.5)
SBI = S("sbi", fontName="Helvetica-Oblique", fontSize=6.6, leading=7.8, textColor=GREY, spaceBefore=1.5)
FWH = S("fwh", fontName="Helvetica-Bold", fontSize=9, textColor=BLUE, leading=11, spaceBefore=3, spaceAfter=1)
FOOT = S("foot", fontName="Helvetica", fontSize=5.9, leading=6.9, textColor=GREY, alignment=TA_JUSTIFY)
IVH = S("ivh", fontName="Helvetica-Bold", fontSize=8.2, textColor=BLUE, leading=9.6)
IVB = S("ivb", fontName="Helvetica", fontSize=7.5, leading=9.0, textColor=DKG, alignment=TA_JUSTIFY, spaceAfter=1.5)

GREEN_HEX="#2E7D32"; TAN_HEX="#8A6D1A"; GREY_HEX="#5A5F68"; BLUE_HEX="#2E5A9E"
def tag(text, hexcolor):
    return f' <b><font size=6.5 color="{hexcolor}">[ {text} ]</font></b>'

def P(t, st=BODY): return Paragraph(t, st)

def build():
    path = os.path.join(F.OUTDIR, "AOS_Unicity_One_Page_Investment_Memo.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter, leftMargin=0.5*inch, rightMargin=0.5*inch,
                            topMargin=0.42*inch, bottomMargin=0.34*inch,
                            title="AOS / Unicity Labs Investment Thesis")
    E = []
    # ---- header ----
    hdr = Table([[
        [Paragraph("Unicity Labs", NAME),
         Paragraph("AOS thesis. Selected company for focused diligence from the X sourcing engine  |  Sahil Modi for Nicolas von Blottnitz", SUBT)],
        Paragraph("HEADLINE WORK SAMPLE<br/>AI INFRASTRUCTURE<br/>JULY 2026", WS)
    ]], colWidths=[5.05*inch, 2.45*inch])
    hdr.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),("TOPPADDING",(0,0),(-1,-1),0)]))
    E.append(hdr)
    E.append(HRFlowable(width="100%", thickness=1.3, color=GOLD, spaceBefore=3, spaceAfter=5))

    # ---- left prose ----
    left = []
    left.append(P(f"<b>One Line Pitch:</b> As AI agents become systems of action that call tools, move value, and coordinate, enterprises may need identity, policy, budgets, isolation, and tamper-evident audit in the execution path, below the model. AOS is the working thesis for that control and proof layer, selected through human judgment, not the top standardized score."))
    left.append(P(f"<b>Business Summary:</b> Prompt-level guardrails do not bind an agent that can be talked out of its instructions. Once agents hold economic authority, enterprises need controls the model cannot override: identity, permissions, policy, budgets, isolated execution, settlement, and proof. The largest version is horizontal infrastructure, a control plane for autonomous software. The live public product today is a bearer-token, peer-to-peer settlement protocol.{tag('VERIFIED', GREEN_HEX)}"))
    left.append(P(f"<b>Management Team:</b> Mike Gault, CEO, is reported to have built and exited Guardtime, a cryptographic-infrastructure company. The team is reported to include PhD researchers in distributed systems, cryptography, and machine learning. This is the strongest team signal in the finalist set.{tag('COMPANY-REPORTED', TAN_HEX)}"))
    left.append(P(f"<b>Customer Problem:</b> Most agent controls live at the prompt layer, which an adversarial input can bypass. Enterprises whose agents spend money and touch sensitive systems will want enforcement and audit in the execution path."))
    left.append(P(f"<b>Products and Services:</b> The Unicity Protocol (bearer-token settlement) is live. A distinct enterprise AOS product is not presented in the official sources reviewed. The closest current artifacts are an Unicity Execution Model specification and a tx-flow runtime in a 79-repo GitHub organization, and no repository named AOS or Astrid appears in the authoritative listing. Confirming AOS's status is diligence gate one.{tag('UNRESOLVED', GREY_HEX)}"))
    left.append(P(f"<b>Target Market:</b> Enterprises and platforms deploying high-authority agents, where a wrong action carries financial, security, or compliance consequence. Buyer hypothesis: Head of AI Platform, CISO, or Head of Agent Infrastructure."))
    left.append(P(f"<b>Customers:</b> No independently verified paid enterprise customer, pilot, or production deployment is disclosed. GitHub activity across 79 repositories is not commercial traction, and funding does not prove demand.{tag('UNRESOLVED', GREY_HEX)}"))

    # ---- right sidebar ----
    def sbrow(label, val):
        return Paragraph(f"<b>{label}</b> {val}", SB)
    sb = []
    sb.append(Paragraph("Company Profile", SBH))
    sb += [sbrow("URL:", "unicity.network"),
           sbrow("Industry:", "AI and agent infrastructure; Web3 settlement"),
           sbrow("Category:", "Agent execution and proof layer (thesis); bearer-token settlement (live)"),
           sbrow("Founded:", "Unicity Labs; Foundation established 2026"),
           sbrow("Headquarters:", "Zug, Switzerland")]
    sb.append(Paragraph("Management Team", SBH))
    sb += [Paragraph("Mike Gault, CEO, formerly Guardtime", SB),
           Paragraph("PhD team: distributed systems, cryptography, ML", SB)]
    sb.append(Paragraph("Financial Summary (USD)", SBH))
    sb += [sbrow("Stage:", "Seed announced February 2026; current financing unresolved"),
           sbrow("Announced seed amount:", "USD 3.0 million, company-reported"),
           sbrow("Lead investor:", "Blockchange Ventures"),
           sbrow("Other investors:", "Outlier Ventures, Tawasal"),
           sbrow("Valuation:", "Undisclosed"),
           sbrow("Revenue:", "None disclosed"),
           Paragraph("Round figures are from a company-issued press release; treat as company-reported until an investor confirms independently.", SBI)]
    sb.append(Paragraph("Sourcing Provenance", SBH))
    sb += [sbrow("Surfaced by:", "AI-infra and founder-transition queries"),
           sbrow("Signal:", "Executive (CEO) identity, project match likely"),
           sbrow("Engine disposition:", "retain_for_manual_research"),
           sbrow("Headline check:", "No public investment identified; internal confirmation required")]
    sb_tbl = Table([[sb]], colWidths=[2.32*inch])
    sb_tbl.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),SBBG),("BOX",(0,0),(-1,-1),0.8,SBBORD),
        ("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6),("VALIGN",(0,0),(-1,-1),"TOP")]))

    two = Table([[left, sb_tbl]], colWidths=[4.86*inch, 2.5*inch])
    two.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(0,0),0),("RIGHTPADDING",(0,0),(0,0),10),
        ("LEFTPADDING",(1,0),(1,0),0),("RIGHTPADDING",(1,0),(1,0),0),("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
    E.append(two)
    E.append(Spacer(1, 3))

    # ---- full width business model + competitors ----
    E.append(P(f"<b>Business Model:</b> Four value-capture hypotheses, none confirmed active: an enterprise license for governance, runtime, policy, identity, and audit; usage-based fees per agent action, execution, proof, or settlement; a developer platform with paid production; and protocol or token economics. The central question: if Unicity succeeds, which entity receives the value, and how does it reach an equity holder in Unicity Labs rather than a token or the Foundation.{tag('HYPOTHESIS', TAN_HEX)}"))
    E.append(P("<b>Competitors:</b> The agent-infrastructure stack is active and partly funded, which raises the bar rather than lowering it. No invented funding, pricing, or customers appear below, and overlap with AOS is a hypothesis until the product is confirmed."))

    # competitor table
    ch = ParagraphStyle("ch", fontName="Helvetica-Bold", fontSize=6.6, textColor=colors.white, leading=8.5)
    cc = ParagraphStyle("cc", fontName="Helvetica", fontSize=6.8, textColor=DKG, leading=8.6)
    cb = ParagraphStyle("cb", fontName="Helvetica-Bold", fontSize=6.8, textColor=DKG, leading=8.6)
    comp = [[Paragraph("LAYER", ch), Paragraph("REPRESENTATIVE PLAYERS (illustrative, not exhaustive)", ch), Paragraph("LIKELY OVERLAP WITH AOS", ch)],
            [Paragraph("Runtime and sandbox", cb), Paragraph("E2B, Modal, Daytona, Fly.io", cc), Paragraph("Isolated execution", cc)],
            [Paragraph("Identity and authentication", cb), Paragraph("Auth0, Stytch, Descope, WorkOS, MCP auth", cc), Paragraph("Agent identity and permissions", cc)],
            [Paragraph("Governance and security", cb), Paragraph("Lakera, Protect AI, HiddenLayer, Prompt Security, CalypsoAI", cc), Paragraph("Policy and guardrails", cc)],
            [Paragraph("Payments and commerce", cb), Paragraph("Skyfire, Coinbase x402, Google AP2, Nevermined, stablecoin rails", cc), Paragraph("Settlement", cc)],
            [Paragraph("Protocols and coordination", cb), Paragraph("MCP, A2A, Fetch.ai", cc), Paragraph("Interop and coordination", cc)],
            [Paragraph("Internal build", cb), Paragraph("Cloud IAM, service meshes, API gateways, audit logging", cc), Paragraph("Enterprise-built controls", cc)]]
    ct = Table(comp, colWidths=[1.55*inch, 3.7*inch, 2.1*inch])
    ct.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),BLUE),("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white, colors.HexColor("#F1F5FA")]),
        ("LINEBELOW",(0,0),(-1,-1),0.4,colors.HexColor("#D5DEEA")),("TOPPADDING",(0,0),(-1,-1),1.8),("BOTTOMPADDING",(0,0),(-1,-1),1.8),
        ("LEFTPADDING",(0,0),(-1,-1),4),("VALIGN",(0,0),(-1,-1),"MIDDLE")]))
    E.append(Spacer(1,2)); E.append(ct); E.append(Spacer(1,3))

    E.append(P(f"<b>Competitive Advantage:</b> The differentiation hypothesis is a cryptographic, model-agnostic execution and proof layer beneath the model, harder to reproduce than a prompt filter or an observability dashboard, and a natural fit for the team's Guardtime background. The risk is that cloud providers, agent frameworks, security vendors, or payment protocols absorb the function.{tag('HYPOTHESIS', TAN_HEX)}"))

    # ---- engine metrics strip ----
    mh = Table([[Paragraph("THE PROJECT: DETERMINISTIC X SOURCING ENGINE, BROAD-MARKET RUN", ParagraphStyle("mh", fontName="Helvetica-Bold", fontSize=7.2, textColor=colors.white))]], colWidths=[7.36*inch])
    mh.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),DKBLUE),("LEFTPADDING",(0,0),(-1,-1),6),("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3)]))
    ml = ParagraphStyle("ml", fontName="Helvetica-Bold", fontSize=6.9, textColor=DKG, leading=9)
    mv = ParagraphStyle("mv", fontName="Helvetica", fontSize=6.9, textColor=BLUE, leading=9, alignment=TA_RIGHT)
    def mc(l): return Paragraph(l, ml)
    def mvc(v): return Paragraph(f"<b>{v}</b>", mv)
    mrows = [
      [mc("Posts returned"), mvc("1,279"), mc("Actionable Posts"), mvc("187"), mc("Profiles enriched"), mvc("14")],
      [mc("Net-new Posts"), mvc("1,166"), mc("Consolidated companies"), mvc("153"), mc("Est. API activity (USD)"), mvc("7.720")],
      [mc("Direct-builder claims"), mvc("190"), mc("Level A artifacts"), mvc("851"), mc("Remaining allowance (USD)"), mvc("17.280")],
      [mc("Unique authors"), mvc("967"), mc("Passing tests"), mvc("450"), mc("LLM calls in classification"), mvc("0")],
    ]
    mt = Table(mrows, colWidths=[1.35*inch,0.75*inch,1.55*inch,0.55*inch,1.75*inch,0.62*inch])
    mt.setStyle(TableStyle([("ROWBACKGROUNDS",(0,0),(-1,-1),[colors.white, colors.HexColor("#F1F5FA")]),
        ("TOPPADDING",(0,0),(-1,-1),2),("BOTTOMPADDING",(0,0),(-1,-1),2),("LEFTPADDING",(0,0),(-1,-1),5),("RIGHTPADDING",(0,0),(-1,-1),5),
        ("LINEBELOW",(0,0),(-1,-1),0.3,colors.HexColor("#E0E6EF")),("VALIGN",(0,0),(-1,-1),"MIDDLE")]))
    E.append(Spacer(1,2)); E.append(mh); E.append(mt); E.append(Spacer(1,4))

    # ---- investment view box ----
    iv = [Paragraph("INVESTMENT VIEW", IVH),
          Paragraph("Advance Unicity Labs into focused founder, product, enterprise-demand, and value-capture diligence. <b>Do not write a check now.</b> AOS may address a foundational infrastructure need as autonomous agents gain authority to act, transact, and coordinate, but the company must first confirm what AOS is today, demonstrate urgent enterprise demand, establish how value reaches Unicity Labs equity, and clarify future financing availability. ScaleDown scored higher on the standardized scorecard (5.95 versus 5.55); AOS was selected by human judgment for team, architecture, and asymmetric upside. This is an interesting opportunity, not a company ready for a check today.", IVB),
          Paragraph("<b><font color='#2E5A9E'>First-call gates:</font></b>  1. Product truth: what AOS is today and how it relates to the Execution Model, tx-flow runtime, Sphere, and bearer tokens.  2. Enterprise demand: paid customers, the economic buyer, and willingness to pay.  3. Equity value capture: which entity owns the IP and how protocol success reaches Labs equity.  4. Financing: next-round timing and whether Headline could participate.", ParagraphStyle("ivg", fontName="Helvetica", fontSize=7.2, leading=8.7, textColor=DKG, alignment=TA_JUSTIFY))]
    ivt = Table([[iv]], colWidths=[7.34*inch])
    ivt.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),SBBG),("BOX",(0,0),(-1,-1),0.8,SBBORD),("LINEBEFORE",(0,0),(0,0),3,BLUE),
        ("LEFTPADDING",(0,0),(-1,-1),9),("RIGHTPADDING",(0,0),(-1,-1),9),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5)]))
    E.append(ivt); E.append(Spacer(1,3))

    # ---- sources footer ----
    E.append(Paragraph(
      "<b>Sources and discipline.</b> [1] unicity.network, accessed July 2026, official company source: bearer-token, peer-to-peer settlement; developer SDK named Sphere; AOS not mentioned. "
      "[2] Unicity GitHub organization (github.com/unicitynetwork), 79 repositories, official protocol source; activity is not commercial traction. "
      "[3] Unicity Labs 3,000,000 USD seed, PR Newswire, February 19, 2026, company-reported until an investor confirms independently; led by Blockchange Ventures with Outlier Ventures and Tawasal; Unicity Foundation established in Switzerland. "
      "[4] Headline infrastructure thesis (The Duality of Infrastructure Software Investing; The Infra Stack Reset), independently reported. "
      "[5] Local sourcing engine outputs, broad-market run and enrichment, July 2026, engine-derived. "
      "All monetary figures are USD. API spend is estimated using configured per-resource pricing; the developer console belongs to an external project and was not accessible. No public Headline investment in Unicity was identified, which is not the same as confirming none exists.", FOOT))

    frame = KeepInFrame(7.5*inch, 10.28*inch, E, mode="shrink", hAlign="LEFT", vAlign="TOP")
    doc.build([frame])
    return path

if __name__ == "__main__":
    print("one-pager:", build())

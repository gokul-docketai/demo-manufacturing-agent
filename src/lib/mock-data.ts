export type Stage = "prospecting" | "technical" | "quoting" | "negotiation";

export type ArtifactType =
  | "email"
  | "spreadsheet"
  | "slides"
  | "checklist"
  | "comparison"
  | "document"
  | "timeline"
  | "canvas";

export interface EmailData {
  from: { name: string; email: string };
  to: { name: string; email: string }[];
  cc?: { name: string; email: string }[];
  subject: string;
  body: string;
  attachments?: string[];
}

export interface SpreadsheetData {
  headers: string[];
  rows: (string | number)[][];
  footerRow?: (string | number)[];
  highlightColumn?: number;
  aiColumns?: number[]; // indices of AI-generated columns
}

export interface SlideData {
  slides: { title: string; bullets: string[]; note?: string }[];
}

export interface ChecklistData {
  sections: {
    title: string;
    items: { label: string; checked: boolean; detail?: string }[];
  }[];
}

export interface ComparisonData {
  columns: string[];
  rows: { label: string; values: string[]; highlight?: boolean }[];
  verdict?: string;
  aiColumns?: number[];
}

export interface TimelineData {
  events: {
    date: string;
    title: string;
    description: string;
    status: "done" | "current" | "upcoming";
  }[];
}

export interface CanvasData {
  drawingTitle: string;
  partNumber: string;
  material: string;
  dimensions: { label: string; value: string }[];
  tolerances: { feature: string; spec: string; actual?: string }[];
  notes: string[];
  revisionHistory: { rev: string; date: string; change: string }[];
}

export interface Artifact {
  type: ArtifactType;
  title: string;
  content: string;
  status: "draft" | "ready" | "needs-review";
  data?:
    | EmailData
    | SpreadsheetData
    | SlideData
    | ChecklistData
    | ComparisonData
    | TimelineData
    | CanvasData;
}

export interface DealCard {
  id: string;
  title: string;
  company: string;
  contactName: string;
  tldr: string;
  stage: Stage;
  priority: boolean;
  value: string;
  lastActivity: string;
  artifact: Artifact;
  aiNotes: string[];
  aiRiskScore?: number; // 0-100, AI column data
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  website: string;
  phone: string;
  primaryContact: string;
  email: string;
  accountOwner: string;
  annualRevenue: string;
  employees: number;
  dealCount: number;
  totalValue: string;
  health: "strong" | "at-risk" | "new";
  stage: string;
  lastTouch: string;
  nextAction: string;
  region: string;
  createdDate: string;
}

export type DealStage =
  | "Prospecting"
  | "Qualification"
  | "Proposal"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export type DealType = "New Business" | "Existing Business" | "Renewal";

export interface Deal {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  contactName: string;
  email: string;
  dealOwner: string;
  stage: DealStage;
  value: string;
  probability: number;
  closeDate: string;
  createdDate: string;
  lastActivity: string;
  source: string;
  product: string;
  nextStep: string;
  type: DealType;
}

export interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: string;
}

export const stageConfig: Record<Stage, { label: string; color: string; description: string }> = {
  prospecting: {
    label: "Prospecting & RFQ",
    color: "bg-stage-early",
    description: "Incoming RFQs, initial outreach, trade show leads",
  },
  technical: {
    label: "Technical Review",
    color: "bg-stage-internal",
    description: "Engineering specs, material selection, DFM analysis, CAD review",
  },
  quoting: {
    label: "Quoting & Proposal",
    color: "bg-stage-quote",
    description: "BOM costing, tooling quotes, lead time estimates",
  },
  negotiation: {
    label: "Negotiation & Close",
    color: "bg-stage-late",
    description: "Contract terms, PO processing, payment & delivery schedules",
  },
};

export const stageColors: Record<Stage, string> = {
  prospecting: "#c4956a",
  technical: "#8b7ec8",
  quoting: "#6a9e8f",
  negotiation: "#c27171",
};

export const mockAccounts: Account[] = [
  {
    id: "acc-1",
    name: "Northrop Dynamics",
    industry: "Aerospace & Defense",
    website: "northropdyn.com",
    phone: "(310) 555-0142",
    primaryContact: "Col. James Whitfield",
    email: "j.whitfield@northropdyn.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$2.1B",
    employees: 8400,
    dealCount: 3,
    totalValue: "$2.4M",
    health: "strong",
    stage: "Negotiation",
    lastTouch: "Today",
    nextAction: "Review RFQ response for titanium brackets",
    region: "West Coast",
    createdDate: "Sep 2024",
  },
  {
    id: "acc-2",
    name: "MedCore Devices",
    industry: "Medical Devices",
    website: "medcoredevices.com",
    phone: "(612) 555-0198",
    primaryContact: "Dr. Priya Sharma",
    email: "p.sharma@medcore.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$340M",
    employees: 1200,
    dealCount: 2,
    totalValue: "$890K",
    health: "at-risk",
    stage: "Technical Review",
    lastTouch: "3 days ago",
    nextAction: "FAI report overdue — follow up with QA",
    region: "Midwest",
    createdDate: "Jan 2025",
  },
  {
    id: "acc-3",
    name: "AutoPrime Systems",
    industry: "Automotive OEM",
    website: "autoprime.com",
    phone: "(313) 555-0267",
    primaryContact: "Mike Tanaka",
    email: "m.tanaka@autoprime.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$890M",
    employees: 3200,
    dealCount: 4,
    totalValue: "$1.6M",
    health: "strong",
    stage: "Quoting",
    lastTouch: "Yesterday",
    nextAction: "Submit revised tooling quote",
    region: "Midwest",
    createdDate: "Mar 2024",
  },
  {
    id: "acc-4",
    name: "TerraCore Industries",
    industry: "Heavy Equipment",
    website: "terracore.com",
    phone: "(414) 555-0331",
    primaryContact: "Bill Hendricks",
    email: "b.hendricks@terracore.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$1.8B",
    employees: 5600,
    dealCount: 1,
    totalValue: "$420K",
    health: "new",
    stage: "Prospecting",
    lastTouch: "2 days ago",
    nextAction: "Schedule plant tour for procurement team",
    region: "Midwest",
    createdDate: "Jan 2026",
  },
  {
    id: "acc-5",
    name: "Pacific Aero Corp",
    industry: "Aerospace & Defense",
    website: "pacificaero.com",
    phone: "(206) 555-0419",
    primaryContact: "Greg Holloway",
    email: "g.holloway@pacificaero.com",
    accountOwner: "Sarah Kim",
    annualRevenue: "$620M",
    employees: 2100,
    dealCount: 1,
    totalValue: "$1.2M",
    health: "new",
    stage: "Prospecting",
    lastTouch: "1 week ago",
    nextAction: "Send capability deck after IMTS follow-up",
    region: "West Coast",
    createdDate: "Feb 2026",
  },
  {
    id: "acc-6",
    name: "Summit Precision",
    industry: "Industrial Machinery",
    website: "summitprecision.com",
    phone: "(440) 555-0587",
    primaryContact: "Dave Kowalski",
    email: "d.kowalski@summitprecision.com",
    accountOwner: "Sarah Kim",
    annualRevenue: "$95M",
    employees: 380,
    dealCount: 2,
    totalValue: "$310K",
    health: "strong",
    stage: "Quoting",
    lastTouch: "Yesterday",
    nextAction: "Finalize BOM for hydraulic manifold",
    region: "Northeast",
    createdDate: "Nov 2024",
  },
  {
    id: "acc-7",
    name: "Vanguard Electronics",
    industry: "Consumer Electronics",
    website: "vanguardelec.com",
    phone: "(408) 555-0723",
    primaryContact: "Lisa Tran",
    email: "l.tran@vanguardelec.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$1.4B",
    employees: 4500,
    dealCount: 3,
    totalValue: "$780K",
    health: "strong",
    stage: "Technical Review",
    lastTouch: "Today",
    nextAction: "Review DFM on aluminum heat sink casting",
    region: "West Coast",
    createdDate: "Jun 2024",
  },
  {
    id: "acc-8",
    name: "Redline Motorsport",
    industry: "Automotive Aftermarket",
    website: "redlinemotorsport.com",
    phone: "(704) 555-0856",
    primaryContact: "Tony Marchetti",
    email: "t.marchetti@redlinemotor.com",
    accountOwner: "Sarah Kim",
    annualRevenue: "$45M",
    employees: 160,
    dealCount: 1,
    totalValue: "$85K",
    health: "new",
    stage: "Prospecting",
    lastTouch: "5 days ago",
    nextAction: "Quote CNC billet intake manifold prototype",
    region: "Southeast",
    createdDate: "Feb 2026",
  },
  {
    id: "acc-9",
    name: "BioSynth Labs",
    industry: "Pharmaceuticals",
    website: "biosynthlabs.com",
    phone: "(858) 555-0944",
    primaryContact: "Dr. Karen Obi",
    email: "k.obi@biosynthlabs.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$2.8B",
    employees: 9200,
    dealCount: 2,
    totalValue: "$540K",
    health: "at-risk",
    stage: "Technical Review",
    lastTouch: "4 days ago",
    nextAction: "Resolve surface finish spec disagreement",
    region: "West Coast",
    createdDate: "Aug 2025",
  },
  {
    id: "acc-10",
    name: "Atlas Heavy Industries",
    industry: "Mining & Construction",
    website: "atlasheavy.com",
    phone: "(412) 555-1032",
    primaryContact: "Frank DeLuca",
    email: "f.deluca@atlasheavy.com",
    accountOwner: "Sarah Kim",
    annualRevenue: "$3.2B",
    employees: 11000,
    dealCount: 2,
    totalValue: "$1.1M",
    health: "strong",
    stage: "Negotiation",
    lastTouch: "Today",
    nextAction: "Review blanket PO terms for wear plates",
    region: "Northeast",
    createdDate: "May 2024",
  },
  {
    id: "acc-11",
    name: "ClearPath Robotics",
    industry: "Robotics & Automation",
    website: "clearpathrobotics.io",
    phone: "(512) 555-1178",
    primaryContact: "Anika Patel",
    email: "a.patel@clearpathrobotics.io",
    accountOwner: "Derek Morrison",
    annualRevenue: "$180M",
    employees: 620,
    dealCount: 1,
    totalValue: "$220K",
    health: "new",
    stage: "Technical Review",
    lastTouch: "3 days ago",
    nextAction: "Send material cert samples for gripper arms",
    region: "South Central",
    createdDate: "Dec 2025",
  },
  {
    id: "acc-12",
    name: "Horizon Energy Systems",
    industry: "Renewable Energy",
    website: "horizonenergy.com",
    phone: "(303) 555-1294",
    primaryContact: "Mark Sullivan",
    email: "m.sullivan@horizonenergy.com",
    accountOwner: "Sarah Kim",
    annualRevenue: "$750M",
    employees: 2800,
    dealCount: 3,
    totalValue: "$960K",
    health: "strong",
    stage: "Quoting",
    lastTouch: "Yesterday",
    nextAction: "Finalize wind turbine bracket quote",
    region: "Mountain West",
    createdDate: "Jul 2024",
  },
  {
    id: "acc-13",
    name: "Stellar Microelectronics",
    industry: "Semiconductors",
    website: "stellarmicro.com",
    phone: "(503) 555-1387",
    primaryContact: "Jennifer Wu",
    email: "j.wu@stellarmicro.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$4.1B",
    employees: 15000,
    dealCount: 1,
    totalValue: "$350K",
    health: "at-risk",
    stage: "Prospecting",
    lastTouch: "1 week ago",
    nextAction: "Re-engage after lost RFQ — new program starting",
    region: "Pacific Northwest",
    createdDate: "Oct 2025",
  },
  {
    id: "acc-14",
    name: "Ironclad Defense",
    industry: "Aerospace & Defense",
    website: "ironcladdef.com",
    phone: "(571) 555-1456",
    primaryContact: "Maj. Robert Torres",
    email: "r.torres@ironcladdef.com",
    accountOwner: "Sarah Kim",
    annualRevenue: "$560M",
    employees: 1800,
    dealCount: 2,
    totalValue: "$680K",
    health: "strong",
    stage: "Negotiation",
    lastTouch: "2 days ago",
    nextAction: "Finalize ITAR compliance docs for contract",
    region: "Mid-Atlantic",
    createdDate: "Apr 2025",
  },
  {
    id: "acc-15",
    name: "Cascade Fluid Power",
    industry: "Hydraulics & Pneumatics",
    website: "cascadefluid.com",
    phone: "(216) 555-1543",
    primaryContact: "Ray Mendez",
    email: "r.mendez@cascadefluid.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$120M",
    employees: 450,
    dealCount: 1,
    totalValue: "$175K",
    health: "new",
    stage: "Prospecting",
    lastTouch: "6 days ago",
    nextAction: "Follow up on hydraulic valve body sample request",
    region: "Northeast",
    createdDate: "Jan 2026",
  },
];

export const mockDeals: DealCard[] = [
  // === PRIORITY ===
  {
    id: "deal-1",
    title: "RFQ response — Titanium mounting brackets",
    company: "Northrop Dynamics",
    contactName: "Col. James Whitfield",
    tldr: "RFQ for 2,400 titanium Ti-6Al-4V brackets. Response drafted with 5-axis CNC pricing. Due Friday.",
    stage: "prospecting",
    priority: true,
    value: "$840K",
    lastActivity: "1 hour ago",
    aiRiskScore: 15,
    artifact: {
      type: "email",
      title: "RFQ Response — Northrop Dynamics",
      content: "",
      status: "ready",
      data: {
        from: { name: "Derek Morrison", email: "derek@precisionmfg.com" },
        to: [{ name: "Col. James Whitfield", email: "j.whitfield@northropdyn.com" }],
        cc: [{ name: "Laura Chen", email: "l.chen@northropdyn.com" }],
        subject: "RE: RFQ-ND-2026-0847 — Ti-6Al-4V Mounting Brackets (Qty 2,400)",
        body: `Col. Whitfield,

Thank you for the opportunity to quote on RFQ-ND-2026-0847. We're pleased to submit our response for the Ti-6Al-4V mounting brackets.

PRICING SUMMARY:
• Unit price: $312/ea (qty 2,400)
• Tooling/fixturing: $18,500 (one-time)
• First article inspection: Included
• Total program value: $767,300

LEAD TIME:
• First articles: 4 weeks ARO
• Production: 8 weeks ARO (200 units/week capacity)

CERTIFICATIONS:
• AS9100D certified facility
• ITAR registered
• Nadcap accredited (NDT & Heat Treat)

We've attached our capability statement and recent aerospace case studies. Our 5-axis Makino a500Z cells are ideally suited for this geometry — we can hold the ±0.001" true position callout on the mounting holes without secondary ops.

Happy to schedule a technical review call at your convenience.

Best regards,
Derek Morrison
VP Sales — Precision Manufacturing Group`,
        attachments: ["PMG_Capability_Statement.pdf", "Aerospace_Case_Studies.pdf"],
      } as EmailData,
    },
    aiNotes: [
      "Northrop Dynamics awarded $2.1B defense contract last month — budget is confirmed",
      "Competitor quote from Pacific Machining came in at $340/ea — we're 8% lower",
      "Col. Whitfield prefers suppliers with Nadcap accreditation — highlight this",
    ],
  },
  {
    id: "deal-2",
    title: "DFM review — Injection molded sensor housing",
    company: "MedCore Devices",
    contactName: "Dr. Priya Sharma",
    tldr: "Engineering flagged 3 wall thickness issues on the sensor housing. CAD annotated with DFM recommendations.",
    stage: "technical",
    priority: true,
    value: "$560K",
    lastActivity: "30 min ago",
    aiRiskScore: 45,
    artifact: {
      type: "canvas",
      title: "DFM Analysis — MC-SH-440 Sensor Housing",
      content: "",
      status: "needs-review",
      data: {
        drawingTitle: "MC-SH-440 Sensor Housing — Rev C",
        partNumber: "MC-SH-440-RevC",
        material: "PEEK (Victrex 450G) — Medical Grade",
        dimensions: [
          { label: "Overall Length", value: "84.5mm ± 0.1mm" },
          { label: "Overall Width", value: "42.0mm ± 0.1mm" },
          { label: "Wall Thickness (nominal)", value: "2.5mm" },
          { label: "Boss OD / ID", value: "8.0mm / 4.2mm" },
          { label: "Draft Angle", value: "1.5° (all faces)" },
          { label: "Gate Location", value: "Edge gate — parting line" },
        ],
        tolerances: [
          { feature: "Sensor cavity depth", spec: "12.00 ±0.02mm", actual: "Achievable" },
          { feature: "Mounting hole true position", spec: "±0.05mm", actual: "Achievable" },
          { feature: "Wall thickness (Section A-A)", spec: "2.5 ±0.1mm", actual: "⚠ 1.8mm min — sink risk" },
          { feature: "Wall thickness (Section B-B)", spec: "2.5 ±0.1mm", actual: "⚠ 1.6mm min — short shot risk" },
          { feature: "Wall thickness (rib intersection)", spec: "2.5 ±0.1mm", actual: "⚠ 3.8mm max — void risk" },
          { feature: "Surface finish (cavity side)", spec: "SPI A-2", actual: "Achievable" },
        ],
        notes: [
          "CRITICAL: Three wall thickness violations identified in moldflow analysis",
          "Section A-A: Thin wall near snap-fit feature — recommend adding 0.7mm to nominal",
          "Section B-B: Flow path too long for 1.6mm wall — increase to 2.2mm or add flow leader",
          "Rib intersection: 3.8mm effective thickness will cause sink marks — core out to 2.5mm max",
          "PEEK 450G requires mold temp of 180°C — hot runner system recommended",
          "Estimated cycle time: 45 seconds (with recommended wall changes)",
        ],
        revisionHistory: [
          { rev: "A", date: "Jan 10, 2026", change: "Initial release" },
          { rev: "B", date: "Jan 28, 2026", change: "Added sensor cavity detail" },
          { rev: "C", date: "Feb 12, 2026", change: "Updated wall thickness per DFM feedback" },
        ],
      } as CanvasData,
    },
    aiNotes: [
      "MedCore's FDA submission deadline is April 1 — delays here cascade to regulatory timeline",
      "PEEK 450G has a 6-week lead time from Victrex — material order should go out this week",
      "Dr. Sharma approved Rev B changes in 24 hours last time — she's responsive",
    ],
  },
  {
    id: "deal-3",
    title: "BOM pricing — Sheet metal control panel enclosures",
    company: "AutoPrime Systems",
    contactName: "Mike Tanaka",
    tldr: "Full BOM costed for 16-gauge steel enclosures. 5,000 unit run. Waiting on your sign-off before sending.",
    stage: "quoting",
    priority: true,
    value: "$420K",
    lastActivity: "2 hours ago",
    aiRiskScore: 20,
    artifact: {
      type: "spreadsheet",
      title: "BOM Pricing — AP-ENC-200 Control Panel Enclosure",
      content: "",
      status: "ready",
      data: {
        headers: ["Part #", "Description", "Material", "Qty/Assy", "Unit Cost", "Ext. Cost", "✦ AI Margin"],
        rows: [
          ["AP-ENC-200-01", "Main body — 16ga CRS", "ASTM A1008", "1", "$24.80", "$24.80", "34%"],
          ["AP-ENC-200-02", "Front door panel", "ASTM A1008", "1", "$18.50", "$18.50", "31%"],
          ["AP-ENC-200-03", "Hinge set (pair)", "304 SS", "1", "$6.20", "$6.20", "42%"],
          ["AP-ENC-200-04", "Latch assembly", "Zinc die-cast", "2", "$3.80", "$7.60", "38%"],
          ["AP-ENC-200-05", "Gasket — EPDM", "EPDM rubber", "1", "$4.50", "$4.50", "28%"],
          ["AP-ENC-200-06", "Mounting bracket", "ASTM A36", "4", "$2.10", "$8.40", "45%"],
          ["AP-ENC-200-07", "Hardware kit", "Zinc plated", "1", "$3.20", "$3.20", "52%"],
          ["AP-ENC-200-08", "Powder coat — RAL 7035", "Polyester", "1", "$8.60", "$8.60", "22%"],
          ["—", "Assembly labor", "—", "—", "—", "$12.00", "—"],
          ["—", "QC & packaging", "—", "—", "—", "$4.20", "—"],
        ],
        footerRow: ["", "", "", "", "UNIT TOTAL", "$98.00", "Avg 34%"],
        highlightColumn: 5,
        aiColumns: [6],
      } as SpreadsheetData,
    },
    aiNotes: [
      "Mike's target price was $95/unit — we're at $98 but margin is healthy at 34%",
      "Steel prices dropped 4% this month — we could offer $95 and still hold 31% margin",
      "AutoPrime's current supplier (MidWest Metal) has had 3 quality escapes this year — leverage this",
    ],
  },
  {
    id: "deal-4",
    title: "MSA final terms — Multi-year supply agreement",
    company: "Northrop Dynamics",
    contactName: "Laura Chen",
    tldr: "3-year supply agreement for precision components. $2.4M TCV. Legal redlines on liability and IP clauses.",
    stage: "negotiation",
    priority: true,
    value: "$2.4M",
    lastActivity: "45 min ago",
    aiRiskScore: 35,
    artifact: {
      type: "timeline",
      title: "Northrop Dynamics — Deal Timeline",
      content: "",
      status: "needs-review",
      data: {
        events: [
          { date: "Oct 2025", title: "Initial RFQ Received", description: "First RFQ for titanium brackets. Won competitive bid against 4 suppliers.", status: "done" },
          { date: "Nov 2025", title: "First Articles Approved", description: "All 12 first article dimensions passed. FAIR submitted and accepted.", status: "done" },
          { date: "Dec 2025", title: "Production Run #1", description: "500 units delivered on-time. Zero defects. Customer satisfaction survey: 9.2/10.", status: "done" },
          { date: "Jan 2026", title: "LTA Discussion Initiated", description: "Laura Chen (Procurement Director) proposed 3-year Long Term Agreement.", status: "done" },
          { date: "Feb 10", title: "MSA Draft Submitted", description: "Sent master supply agreement draft with pricing tiers and capacity guarantees.", status: "done" },
          { date: "Feb 14", title: "Legal Redlines Received", description: "Northrop legal returned redlines: IP ownership (§7), liability cap (§11), termination clause (§14). Two are standard, IP clause needs negotiation.", status: "current" },
          { date: "Feb 19", title: "Negotiation Call", description: "Scheduled call with Laura and Northrop legal to resolve IP ownership clause.", status: "upcoming" },
          { date: "Feb 28", title: "Target Signature", description: "Board approval window closes Feb 28. Must have signed MSA by this date.", status: "upcoming" },
        ],
      } as TimelineData,
    },
    aiNotes: [
      "Laura mentioned the IP clause is coming from their new General Counsel — standard for defense contractors",
      "Northrop's fiscal year ends March 31 — they have incentive to close this quarter",
      "This LTA would make them our largest aerospace account",
    ],
  },

  // === NON-PRIORITY ===
  {
    id: "deal-5",
    title: "Trade show follow-up — IMTS leads",
    company: "Multiple (8 accounts)",
    contactName: "Various",
    tldr: "8 qualified leads from IMTS Chicago. Personalized follow-up emails drafted. Batch approve or review.",
    stage: "prospecting",
    priority: false,
    value: "Pipeline",
    lastActivity: "3 hours ago",
    aiRiskScore: 10,
    artifact: {
      type: "email",
      title: "IMTS Follow-up — Sample (1 of 8)",
      content: "",
      status: "ready",
      data: {
        from: { name: "Derek Morrison", email: "derek@precisionmfg.com" },
        to: [{ name: "Greg Holloway", email: "g.holloway@pacificaero.com" }],
        subject: "Great meeting at IMTS — precision machining for aerospace",
        body: `Hi Greg,

It was great connecting at the IMTS show in Chicago last week. Our conversation about your team's challenges with tight-tolerance titanium machining really resonated — it's exactly the kind of work we specialize in.

As I mentioned, we recently invested in two new Makino a500Z 5-axis machining centers specifically for aerospace titanium work. We're holding ±0.0005" on similar parts for other defense contractors.

I'd love to show you some of our recent aerospace case studies and discuss how we might support Pacific Aero's upcoming programs.

Would a 20-minute call next Tuesday or Wednesday work for you?

Best,
Derek Morrison
VP Sales — Precision Manufacturing Group

P.S. — Attached our IMTS capability one-pager with the titanium machining specs we discussed.`,
        attachments: ["PMG_IMTS_Titanium_Capabilities.pdf"],
      } as EmailData,
    },
    aiNotes: [
      "8 leads scored from IMTS — 3 are high-intent based on booth dwell time and questions asked",
      "Pacific Aero (Greg) mentioned a $1.2M program starting Q3 — high priority follow-up",
    ],
  },
  {
    id: "deal-6",
    title: "Supplier qualification audit — Automotive",
    company: "AutoPrime Systems",
    contactName: "Sandra Lee",
    tldr: "IATF 16949 supplier audit checklist completed. 2 minor findings need resolution before approval.",
    stage: "prospecting",
    priority: false,
    value: "$1.6M",
    lastActivity: "Yesterday",
    aiRiskScore: 30,
    artifact: {
      type: "checklist",
      title: "IATF 16949 Supplier Qualification — AutoPrime Systems",
      content: "",
      status: "needs-review",
      data: {
        sections: [
          {
            title: "Quality Management System",
            items: [
              { label: "IATF 16949:2016 certification current", checked: true, detail: "Certificate #QMS-2025-4471, valid through Dec 2027" },
              { label: "Management review records (last 12 months)", checked: true, detail: "Quarterly reviews documented, last: Jan 2026" },
              { label: "Internal audit schedule and results", checked: true, detail: "Zero major findings in 2025" },
              { label: "Customer-specific requirements documented", checked: false, detail: "⚠ AutoPrime CSR package not yet integrated into QMS — Minor Finding #1" },
            ],
          },
          {
            title: "Process Controls",
            items: [
              { label: "Control plans for quoted part families", checked: true, detail: "CP-200 series covers all sheet metal enclosures" },
              { label: "SPC on critical dimensions", checked: true, detail: "Cpk > 1.67 on all CTQ characteristics" },
              { label: "Measurement system analysis (GR&R)", checked: true, detail: "All gages < 10% GR&R" },
              { label: "Preventive maintenance program", checked: false, detail: "⚠ PM schedule for powder coat line is 2 months overdue — Minor Finding #2" },
            ],
          },
          {
            title: "Supply Chain & Logistics",
            items: [
              { label: "Sub-tier supplier management", checked: true, detail: "Approved supplier list maintained, annual reviews" },
              { label: "Material traceability system", checked: true, detail: "Full lot traceability from raw material to ship" },
              { label: "Capacity assessment for quoted volumes", checked: true, detail: "Can support 5,000 units/month with current staffing" },
            ],
          },
        ],
      } as ChecklistData,
    },
    aiNotes: [
      "Both findings are minor — typical for new supplier qualifications",
      "Sandra Lee (Quality Director) said they need resolution within 30 days",
    ],
  },
  {
    id: "deal-7",
    title: "Material cert package — Defense contract",
    company: "Northrop Dynamics",
    contactName: "Laura Chen",
    tldr: "Full material compliance package assembled for DFARS/ITAR requirements. Ready to submit.",
    stage: "technical",
    priority: false,
    value: "$840K",
    lastActivity: "4 hours ago",
    aiRiskScore: 10,
    artifact: {
      type: "checklist",
      title: "Material Compliance Package — Northrop Dynamics",
      content: "",
      status: "ready",
      data: {
        sections: [
          {
            title: "Material Certifications",
            items: [
              { label: "Ti-6Al-4V mill certs (AMS 4928)", checked: true, detail: "Heat lot #TI-2026-0892, from Arconic" },
              { label: "DFARS 252.225-7014 compliance", checked: true, detail: "All titanium melted in USA, documentation on file" },
              { label: "Conflict minerals declaration", checked: true, detail: "CMRT v6.22 filed" },
            ],
          },
          {
            title: "Process Certifications",
            items: [
              { label: "Nadcap Heat Treat (AC7102)", checked: true, detail: "Accreditation #HT-44218, valid through Sept 2027" },
              { label: "Nadcap NDT (AC7114)", checked: true, detail: "FPI & X-ray, accreditation current" },
              { label: "AS9100D quality system", checked: true, detail: "Certificate #AS-2025-1107" },
              { label: "ITAR registration", checked: true, detail: "Registration #M-29441" },
            ],
          },
        ],
      } as ChecklistData,
    },
    aiNotes: [
      "This package satisfies all Northrop Tier 1 supplier requirements",
      "Laura confirmed this is the last item before adding us to their approved vendor list",
    ],
  },
  {
    id: "deal-8",
    title: "Competitive analysis — vs. offshore quote",
    company: "AutoPrime Systems",
    contactName: "Mike Tanaka",
    tldr: "AutoPrime got a 30% cheaper quote from a Chinese supplier. Battlecard with quality & risk counter-positioning.",
    stage: "technical",
    priority: false,
    value: "$420K",
    lastActivity: "5 hours ago",
    aiRiskScore: 65,
    artifact: {
      type: "comparison",
      title: "Competitive Battlecard — Us vs. Offshore (Shenzhen MetalWorks)",
      content: "",
      status: "ready",
      data: {
        columns: ["Factor", "Precision Mfg (Us)", "Shenzhen MetalWorks", "✦ AI Risk Assessment"],
        rows: [
          { label: "Unit price", values: ["$98.00", "$68.50", "Price gap is real but…"], highlight: true },
          { label: "Tooling cost", values: ["$22,000", "$14,000", "Lower upfront, but retool risk"], highlight: false },
          { label: "Lead time (production)", values: ["4 weeks", "10-12 weeks + 4 wks ocean", "16 weeks total — 4x longer"], highlight: true },
          { label: "Quality (historical PPM)", values: ["120 PPM", "~2,800 PPM (industry avg)", "23x higher defect rate"], highlight: true },
          { label: "IATF 16949 certified", values: ["Yes", "ISO 9001 only", "Does not meet AutoPrime CSR"], highlight: true },
          { label: "Material traceability", values: ["Full lot trace", "Heat lot only", "Cannot trace to sub-lot"], highlight: false },
          { label: "IP protection", values: ["NDA + US jurisdiction", "Limited enforceability", "High risk for proprietary designs"], highlight: true },
          { label: "Total cost of ownership (3yr)", values: ["$1.47M", "$1.82M", "Offshore is 24% MORE expensive"], highlight: true },
        ],
        verdict: "Despite 30% lower unit price, offshore TCO is 24% higher when factoring quality costs, freight, inventory carrying, and rework. Lead with the TCO analysis and their own quality escape history.",
        aiColumns: [3],
      } as ComparisonData,
    },
    aiNotes: [
      "AutoPrime had 3 quality escapes from their current offshore supplier in 2025 — $180K in warranty costs",
      "Mike Tanaka personally dealt with a 6-week delayed shipment last quarter — this is a pain point",
      "Their plant manager (Jim Torres) is pushing for domestic sourcing after the supply chain disruptions",
    ],
  },
  {
    id: "deal-9",
    title: "Tooling quote — Plastic injection mold",
    company: "MedCore Devices",
    contactName: "Dr. Priya Sharma",
    tldr: "Quoted single-cavity production mold for sensor housing. Hot runner, hardened P20. 100K shot life.",
    stage: "quoting",
    priority: false,
    value: "$180K",
    lastActivity: "Yesterday",
    aiRiskScore: 25,
    artifact: {
      type: "spreadsheet",
      title: "Tooling Quote — MC-SH-440 Injection Mold",
      content: "",
      status: "ready",
      data: {
        headers: ["Line Item", "Description", "Spec", "Cost", "✦ AI Benchmark"],
        rows: [
          ["MOLD-01", "Mold base — DME standard", "P20 hardened, 420 SS inserts", "$28,000", "Market avg: $26-32K"],
          ["MOLD-02", "Cavity & core machining", "5-axis CNC + EDM sinker", "$42,000", "Complex geometry premium"],
          ["MOLD-03", "Hot runner system", "Synventive 4-drop valve gate", "$18,500", "Market avg: $16-20K"],
          ["MOLD-04", "Cooling system", "Conformal cooling (3D printed)", "$8,200", "15% faster cycle vs conventional"],
          ["MOLD-05", "Mold flow analysis", "Moldex3D simulation", "$4,500", "Identified 3 DFM issues ✓"],
          ["MOLD-06", "Texture / polish", "SPI A-2 cavity, SPI B-1 core", "$6,800", "Medical grade finish"],
          ["MOLD-07", "First article run (T1)", "50 shots + FAI report", "$3,500", "Includes dimensional report"],
        ],
        footerRow: ["", "", "", "$111,500", "Within benchmark range"],
        highlightColumn: 3,
        aiColumns: [4],
      } as SpreadsheetData,
    },
    aiNotes: [
      "Dr. Sharma's budget for tooling was $120K — we're at $111.5K, under budget",
      "Conformal cooling will save them ~$0.15/part in cycle time over the mold's life (100K shots)",
      "MedCore requires IQ/OQ/PQ validation — factor into timeline",
    ],
  },
  {
    id: "deal-10",
    title: "PO negotiation — Annual blanket order",
    company: "AutoPrime Systems",
    contactName: "Mike Tanaka",
    tldr: "Annual blanket PO for 60,000 enclosures. Negotiating release schedule and price escalation clause.",
    stage: "negotiation",
    priority: false,
    value: "$780K",
    lastActivity: "3 hours ago",
    aiRiskScore: 20,
    artifact: {
      type: "slides",
      title: "Negotiation Playbook — AutoPrime Blanket PO",
      content: "",
      status: "ready",
      data: {
        slides: [
          {
            title: "Deal Overview",
            bullets: [
              "Annual blanket PO: 60,000 units (5,000/month)",
              "Current unit price: $98 → Target: $95 (volume commitment)",
              "Contract term: 12 months with auto-renewal",
              "Total annual value: $5.7M (at $95/unit)",
            ],
            note: "Mike has budget authority up to $6M. We have room.",
          },
          {
            title: "Their Asks",
            bullets: [
              "Price reduction to $92/unit (6% below current)",
              "Net 60 payment terms (our standard is Net 30)",
              "Consignment inventory at their plant (2 weeks)",
              "Steel price index adjustment clause",
            ],
            note: "Don't concede on all four. Trade consignment for better payment terms.",
          },
          {
            title: "Our Counter ★ Recommended",
            bullets: [
              "Unit price: $95 (3% reduction for volume commitment)",
              "Net 45 payment terms (compromise from Net 60)",
              "No consignment — but guaranteed 2-week lead time",
              "Steel escalation: Yes, but with 5% collar (±5% band)",
            ],
            note: "Jim Torres (plant manager) supports domestic sourcing. Use this.",
          },
          {
            title: "Closing Timeline",
            bullets: [
              "Mon: Call with Mike + procurement team",
              "Wed: Revised terms to legal",
              "Fri Feb 21: Target PO issuance",
              "Mar 1: First release shipment",
            ],
          },
        ],
      } as SlideData,
    },
    aiNotes: [
      "AutoPrime's current supplier contract expires March 15 — natural switching point",
      "Mike mentioned their CFO approved the domestic sourcing initiative last board meeting",
      "If we close this, it would be our largest automotive blanket order",
    ],
  },
  {
    id: "deal-11",
    title: "Discovery call prep — Heavy equipment OEM",
    company: "TerraCore Industries",
    contactName: "Bill Hendricks",
    tldr: "First meeting with TerraCore's VP of Supply Chain. Deck prepped on our heavy equipment capabilities.",
    stage: "prospecting",
    priority: false,
    value: "$420K",
    lastActivity: "6 hours ago",
    aiRiskScore: 10,
    artifact: {
      type: "slides",
      title: "Discovery Deck — TerraCore Industries",
      content: "",
      status: "ready",
      data: {
        slides: [
          {
            title: "TerraCore Industries",
            bullets: [
              "$1.8B revenue — mining & construction equipment",
              "HQ: Milwaukee, WI — 4 manufacturing plants",
              "Acquiring 30% of components externally (trend: increasing)",
              "Recent initiative: 'Supply Chain Resilience 2026'",
            ],
            note: "They're actively looking to diversify their supplier base.",
          },
          {
            title: "Key Contact: Bill Hendricks",
            bullets: [
              "VP Supply Chain — reports directly to COO",
              "20 years in heavy equipment manufacturing",
              "Previously at Caterpillar (procurement)",
              "Focus areas: cost reduction, domestic sourcing, quality",
            ],
          },
          {
            title: "Our Fit",
            bullets: [
              "Heavy plate fabrication (up to 2\" thick A36/AR400)",
              "Large CNC machining (120\" x 60\" travel)",
              "Welding: AWS D1.1 & D14.1 certified",
              "Paint: up to 20' parts, industrial epoxy systems",
            ],
          },
          {
            title: "Questions to Ask",
            bullets: [
              "What commodities are you looking to source externally?",
              "What does your current supplier scorecard look like?",
              "Any upcoming programs that need new supplier qualification?",
              "What's the timeline for the resilience initiative?",
            ],
            note: "Goal: understand their sourcing roadmap and get on their AVL.",
          },
        ],
      } as SlideData,
    },
    aiNotes: [
      "TerraCore posted 3 procurement job openings last month — their supply chain team is growing",
      "Bill Hendricks connected with our CEO on LinkedIn after the IMTS show",
    ],
  },
  {
    id: "deal-12",
    title: "Final inspection sign-off — Delivery batch #3",
    company: "Northrop Dynamics",
    contactName: "Col. James Whitfield",
    tldr: "600 brackets passed final inspection. CMM reports and certs ready for your release authorization.",
    stage: "negotiation",
    priority: false,
    value: "$187K",
    lastActivity: "1 hour ago",
    aiRiskScore: 5,
    artifact: {
      type: "checklist",
      title: "Shipment Release Checklist — Batch #3 (600 units)",
      content: "",
      status: "ready",
      data: {
        sections: [
          {
            title: "Dimensional Inspection",
            items: [
              { label: "CMM report — all CTQ dims within spec", checked: true, detail: "100% inspection on first 50, AQL Level II thereafter" },
              { label: "True position on mounting holes: ±0.001\"", checked: true, detail: "Actual: ±0.0006\" — well within spec" },
              { label: "Surface finish Ra ≤ 32μin", checked: true, detail: "Measured: 22-28μin across sample" },
            ],
          },
          {
            title: "Material & Process Certs",
            items: [
              { label: "Ti-6Al-4V mill cert (AMS 4928)", checked: true },
              { label: "Heat treat cert (AMS 2801)", checked: true },
              { label: "FPI report (no indications)", checked: true },
              { label: "FAIR (AS9102) — all characteristics", checked: true },
            ],
          },
          {
            title: "Shipping",
            items: [
              { label: "Parts packaged per Northrop spec MIL-STD-2073", checked: true },
              { label: "Packing slip generated", checked: true },
              { label: "Derek: Authorize shipment release", checked: false, detail: "Awaiting your approval" },
            ],
          },
        ],
      } as ChecklistData,
    },
    aiNotes: [
      "This is our 3rd consecutive on-time delivery — builds case for the LTA",
      "Zero defects across all 3 batches (1,500 total units)",
      "Laura Chen mentioned this delivery performance in the LTA discussion as a positive",
    ],
  },
];

export const mockDealsTable: Deal[] = [
  {
    id: "dtl-1",
    name: "Ti-6Al-4V Mounting Brackets — 2,400 units",
    accountId: "acc-1",
    accountName: "Northrop Dynamics",
    contactName: "Col. James Whitfield",
    email: "j.whitfield@northropdyn.com",
    dealOwner: "Derek Morrison",
    stage: "Negotiation",
    value: "$840K",
    probability: 85,
    closeDate: "Feb 28, 2026",
    createdDate: "Oct 15, 2025",
    lastActivity: "1 hour ago",
    source: "Inbound RFQ",
    product: "5-Axis CNC Machining",
    nextStep: "Review RFQ response and send to customer",
    type: "New Business",
  },
  {
    id: "dtl-2",
    name: "PEEK Sensor Housing — Injection Mold Tooling",
    accountId: "acc-2",
    accountName: "MedCore Devices",
    contactName: "Dr. Priya Sharma",
    email: "p.sharma@medcore.com",
    dealOwner: "Derek Morrison",
    stage: "Proposal",
    value: "$560K",
    probability: 60,
    closeDate: "Mar 15, 2026",
    createdDate: "Jan 10, 2026",
    lastActivity: "30 min ago",
    source: "Referral",
    product: "Injection Molding",
    nextStep: "Resolve DFM wall thickness issues",
    type: "New Business",
  },
  {
    id: "dtl-3",
    name: "Sheet Metal Enclosures — Annual Blanket PO",
    accountId: "acc-3",
    accountName: "AutoPrime Systems",
    contactName: "Mike Tanaka",
    email: "m.tanaka@autoprime.com",
    dealOwner: "Derek Morrison",
    stage: "Negotiation",
    value: "$780K",
    probability: 75,
    closeDate: "Feb 21, 2026",
    createdDate: "Mar 20, 2024",
    lastActivity: "3 hours ago",
    source: "Existing Relationship",
    product: "Sheet Metal Fabrication",
    nextStep: "Finalize blanket PO payment terms",
    type: "Existing Business",
  },
  {
    id: "dtl-4",
    name: "MSA — 3-Year Supply Agreement",
    accountId: "acc-1",
    accountName: "Northrop Dynamics",
    contactName: "Laura Chen",
    email: "l.chen@northropdyn.com",
    dealOwner: "Derek Morrison",
    stage: "Negotiation",
    value: "$2.4M",
    probability: 70,
    closeDate: "Feb 28, 2026",
    createdDate: "Jan 15, 2026",
    lastActivity: "45 min ago",
    source: "Inbound RFQ",
    product: "Multi-Category",
    nextStep: "Resolve IP ownership clause with legal",
    type: "New Business",
  },
  {
    id: "dtl-5",
    name: "CNC Billet Intake Manifold Prototype",
    accountId: "acc-8",
    accountName: "Redline Motorsport",
    contactName: "Tony Marchetti",
    email: "t.marchetti@redlinemotor.com",
    dealOwner: "Sarah Kim",
    stage: "Prospecting",
    value: "$85K",
    probability: 20,
    closeDate: "Apr 30, 2026",
    createdDate: "Feb 5, 2026",
    lastActivity: "5 days ago",
    source: "Trade Show",
    product: "CNC Machining",
    nextStep: "Send prototype quote and capability deck",
    type: "New Business",
  },
  {
    id: "dtl-6",
    name: "Hydraulic Manifold — BOM Costing",
    accountId: "acc-6",
    accountName: "Summit Precision",
    contactName: "Dave Kowalski",
    email: "d.kowalski@summitprecision.com",
    dealOwner: "Sarah Kim",
    stage: "Proposal",
    value: "$310K",
    probability: 55,
    closeDate: "Mar 30, 2026",
    createdDate: "Nov 12, 2024",
    lastActivity: "Yesterday",
    source: "Referral",
    product: "CNC Machining",
    nextStep: "Finalize BOM and submit quote",
    type: "Existing Business",
  },
  {
    id: "dtl-7",
    name: "Aluminum Heat Sink Casting — DFM Review",
    accountId: "acc-7",
    accountName: "Vanguard Electronics",
    contactName: "Lisa Tran",
    email: "l.tran@vanguardelec.com",
    dealOwner: "Derek Morrison",
    stage: "Qualification",
    value: "$780K",
    probability: 45,
    closeDate: "May 15, 2026",
    createdDate: "Jun 22, 2024",
    lastActivity: "Today",
    source: "Inbound RFQ",
    product: "Die Casting",
    nextStep: "Complete DFM on aluminum casting design",
    type: "New Business",
  },
  {
    id: "dtl-8",
    name: "Wind Turbine Bracket — Production Run",
    accountId: "acc-12",
    accountName: "Horizon Energy Systems",
    contactName: "Mark Sullivan",
    email: "m.sullivan@horizonenergy.com",
    dealOwner: "Sarah Kim",
    stage: "Proposal",
    value: "$960K",
    probability: 65,
    closeDate: "Apr 10, 2026",
    createdDate: "Jul 18, 2024",
    lastActivity: "Yesterday",
    source: "Existing Relationship",
    product: "Heavy Fabrication",
    nextStep: "Finalize wind turbine bracket quote",
    type: "Existing Business",
  },
  {
    id: "dtl-9",
    name: "Wear Plates — Blanket PO",
    accountId: "acc-10",
    accountName: "Atlas Heavy Industries",
    contactName: "Frank DeLuca",
    email: "f.deluca@atlasheavy.com",
    dealOwner: "Sarah Kim",
    stage: "Negotiation",
    value: "$1.1M",
    probability: 80,
    closeDate: "Mar 5, 2026",
    createdDate: "May 10, 2024",
    lastActivity: "Today",
    source: "Existing Relationship",
    product: "Plate Fabrication",
    nextStep: "Review blanket PO terms for wear plates",
    type: "Renewal",
  },
  {
    id: "dtl-10",
    name: "Gripper Arm Components — Material Qualification",
    accountId: "acc-11",
    accountName: "ClearPath Robotics",
    contactName: "Anika Patel",
    email: "a.patel@clearpathrobotics.io",
    dealOwner: "Derek Morrison",
    stage: "Qualification",
    value: "$220K",
    probability: 35,
    closeDate: "Jun 1, 2026",
    createdDate: "Dec 8, 2025",
    lastActivity: "3 days ago",
    source: "Trade Show",
    product: "CNC Machining",
    nextStep: "Send material cert samples for review",
    type: "New Business",
  },
  {
    id: "dtl-11",
    name: "ITAR Contract — Precision Components",
    accountId: "acc-14",
    accountName: "Ironclad Defense",
    contactName: "Maj. Robert Torres",
    email: "r.torres@ironcladdef.com",
    dealOwner: "Sarah Kim",
    stage: "Negotiation",
    value: "$680K",
    probability: 75,
    closeDate: "Mar 20, 2026",
    createdDate: "Apr 5, 2025",
    lastActivity: "2 days ago",
    source: "Inbound RFQ",
    product: "5-Axis CNC Machining",
    nextStep: "Finalize ITAR compliance documentation",
    type: "New Business",
  },
  {
    id: "dtl-12",
    name: "Heavy Equipment Fabrication — Discovery",
    accountId: "acc-4",
    accountName: "TerraCore Industries",
    contactName: "Bill Hendricks",
    email: "b.hendricks@terracore.com",
    dealOwner: "Derek Morrison",
    stage: "Prospecting",
    value: "$420K",
    probability: 15,
    closeDate: "Jul 1, 2026",
    createdDate: "Jan 28, 2026",
    lastActivity: "2 days ago",
    source: "Trade Show",
    product: "Heavy Fabrication",
    nextStep: "Schedule plant tour for procurement team",
    type: "New Business",
  },
  {
    id: "dtl-13",
    name: "Semiconductor Fixture — Re-engagement",
    accountId: "acc-13",
    accountName: "Stellar Microelectronics",
    contactName: "Jennifer Wu",
    email: "j.wu@stellarmicro.com",
    dealOwner: "Derek Morrison",
    stage: "Prospecting",
    value: "$350K",
    probability: 10,
    closeDate: "Aug 15, 2026",
    createdDate: "Oct 20, 2025",
    lastActivity: "1 week ago",
    source: "Outbound",
    product: "Precision Machining",
    nextStep: "Re-engage after lost RFQ — new program",
    type: "New Business",
  },
  {
    id: "dtl-14",
    name: "Hydraulic Valve Body — Sample Run",
    accountId: "acc-15",
    accountName: "Cascade Fluid Power",
    contactName: "Ray Mendez",
    email: "r.mendez@cascadefluid.com",
    dealOwner: "Derek Morrison",
    stage: "Prospecting",
    value: "$175K",
    probability: 20,
    closeDate: "May 30, 2026",
    createdDate: "Jan 14, 2026",
    lastActivity: "6 days ago",
    source: "Inbound RFQ",
    product: "CNC Machining",
    nextStep: "Follow up on sample request",
    type: "New Business",
  },
  {
    id: "dtl-15",
    name: "Tooling Quote — Sensor Housing Mold",
    accountId: "acc-2",
    accountName: "MedCore Devices",
    contactName: "Dr. Priya Sharma",
    email: "p.sharma@medcore.com",
    dealOwner: "Derek Morrison",
    stage: "Proposal",
    value: "$180K",
    probability: 70,
    closeDate: "Mar 10, 2026",
    createdDate: "Jan 25, 2026",
    lastActivity: "Yesterday",
    source: "Existing Relationship",
    product: "Injection Molding",
    nextStep: "Submit tooling quote for approval",
    type: "Existing Business",
  },
  {
    id: "dtl-16",
    name: "Aerospace Capability Qualification",
    accountId: "acc-5",
    accountName: "Pacific Aero Corp",
    contactName: "Greg Holloway",
    email: "g.holloway@pacificaero.com",
    dealOwner: "Sarah Kim",
    stage: "Prospecting",
    value: "$1.2M",
    probability: 15,
    closeDate: "Sep 1, 2026",
    createdDate: "Feb 8, 2026",
    lastActivity: "1 week ago",
    source: "Trade Show",
    product: "5-Axis CNC Machining",
    nextStep: "Send capability deck after IMTS follow-up",
    type: "New Business",
  },
  {
    id: "dtl-17",
    name: "Surface Finish Spec Resolution — Lab Equipment",
    accountId: "acc-9",
    accountName: "BioSynth Labs",
    contactName: "Dr. Karen Obi",
    email: "k.obi@biosynthlabs.com",
    dealOwner: "Derek Morrison",
    stage: "Qualification",
    value: "$540K",
    probability: 40,
    closeDate: "May 1, 2026",
    createdDate: "Aug 15, 2025",
    lastActivity: "4 days ago",
    source: "Referral",
    product: "Precision Machining",
    nextStep: "Resolve surface finish spec disagreement",
    type: "New Business",
  },
];

export const defaultChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    role: "ai",
    content: "Good morning, Derek. You have 4 high-priority items today. The MedCore DFM review has 3 critical wall thickness issues that need engineering sign-off, and the Northrop MSA redlines just came in — the IP clause needs attention before the Feb 28 board window.",
    timestamp: "9:00 AM",
  },
  {
    id: "msg-2",
    role: "ai",
    content: "I've also finished costing the AutoPrime BOM — we're at $98/unit with a 34% margin. Mike's target was $95, so I've flagged an option to drop 3% given this month's steel price dip.",
    timestamp: "9:01 AM",
  },
];

export const coworkChatMessages: ChatMessage[] = [
  {
    id: "cw-1",
    role: "ai",
    content: "I've prepared this based on the information we have. Let me know what you'd like to adjust — I can modify specs, update pricing, or restructure any section.",
    timestamp: "Now",
  },
];

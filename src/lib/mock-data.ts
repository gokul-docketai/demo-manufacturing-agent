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
  {
    id: "acc-16",
    name: "Apex Turbine Technologies",
    industry: "Power Generation",
    website: "apexturbine.com",
    phone: "(713) 555-1601",
    primaryContact: "Carlos Reyes",
    email: "c.reyes@apexturbine.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$920M",
    employees: 3100,
    dealCount: 2,
    totalValue: "$1.3M",
    health: "strong",
    stage: "Quoting",
    lastTouch: "Today",
    nextAction: "Submit turbine blade fixture quote",
    region: "South Central",
    createdDate: "Mar 2025",
  },
  {
    id: "acc-17",
    name: "Pinnacle Composites",
    industry: "Advanced Materials",
    website: "pinnaclecomp.com",
    phone: "(480) 555-1722",
    primaryContact: "Sandra Navarro",
    email: "s.navarro@pinnaclecomp.com",
    accountOwner: "Sarah Kim",
    annualRevenue: "$210M",
    employees: 740,
    dealCount: 1,
    totalValue: "$290K",
    health: "new",
    stage: "Prospecting",
    lastTouch: "4 days ago",
    nextAction: "Send composite tooling capability overview",
    region: "Southwest",
    createdDate: "Jan 2026",
  },
  {
    id: "acc-18",
    name: "Great Lakes Stamping",
    industry: "Metal Stamping",
    website: "greatlakesstamping.com",
    phone: "(419) 555-1834",
    primaryContact: "Ed Brannigan",
    email: "e.brannigan@glstamping.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$68M",
    employees: 290,
    dealCount: 2,
    totalValue: "$195K",
    health: "strong",
    stage: "Technical Review",
    lastTouch: "Yesterday",
    nextAction: "Review progressive die design for bracket run",
    region: "Midwest",
    createdDate: "Sep 2025",
  },
  {
    id: "acc-19",
    name: "Quantum Photonics",
    industry: "Optics & Photonics",
    website: "quantumphotonics.com",
    phone: "(520) 555-1948",
    primaryContact: "Dr. Helen Park",
    email: "h.park@quantumphotonics.com",
    accountOwner: "Sarah Kim",
    annualRevenue: "$1.6B",
    employees: 5200,
    dealCount: 1,
    totalValue: "$450K",
    health: "at-risk",
    stage: "Technical Review",
    lastTouch: "1 week ago",
    nextAction: "Address surface roughness concerns on lens housing",
    region: "Southwest",
    createdDate: "Nov 2025",
  },
  {
    id: "acc-20",
    name: "Wolverine Forge",
    industry: "Forging & Casting",
    website: "wolverineforge.com",
    phone: "(248) 555-2051",
    primaryContact: "Tom Bridwell",
    email: "t.bridwell@wolverineforge.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$140M",
    employees: 520,
    dealCount: 3,
    totalValue: "$620K",
    health: "strong",
    stage: "Negotiation",
    lastTouch: "Today",
    nextAction: "Finalize annual supply agreement for forgings",
    region: "Midwest",
    createdDate: "Feb 2024",
  },
  {
    id: "acc-21",
    name: "Sentinel Security Systems",
    industry: "Defense Electronics",
    website: "sentinelsec.com",
    phone: "(703) 555-2167",
    primaryContact: "Patricia Dunn",
    email: "p.dunn@sentinelsec.com",
    accountOwner: "Sarah Kim",
    annualRevenue: "$480M",
    employees: 1600,
    dealCount: 2,
    totalValue: "$710K",
    health: "strong",
    stage: "Quoting",
    lastTouch: "2 days ago",
    nextAction: "Quote EMI shielding enclosure batch",
    region: "Mid-Atlantic",
    createdDate: "Jun 2025",
  },
  {
    id: "acc-22",
    name: "Trident Marine Fabrication",
    industry: "Shipbuilding",
    website: "tridentmarine.com",
    phone: "(757) 555-2283",
    primaryContact: "Capt. Ryan Novak",
    email: "r.novak@tridentmarine.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$2.3B",
    employees: 7400,
    dealCount: 1,
    totalValue: "$980K",
    health: "new",
    stage: "Prospecting",
    lastTouch: "3 days ago",
    nextAction: "Schedule initial capabilities presentation",
    region: "Southeast",
    createdDate: "Feb 2026",
  },
  {
    id: "acc-23",
    name: "NovaTech Instruments",
    industry: "Test & Measurement",
    website: "novatech-inst.com",
    phone: "(503) 555-2394",
    primaryContact: "Amy Sato",
    email: "a.sato@novatech-inst.com",
    accountOwner: "Sarah Kim",
    annualRevenue: "$310M",
    employees: 950,
    dealCount: 2,
    totalValue: "$430K",
    health: "strong",
    stage: "Technical Review",
    lastTouch: "Yesterday",
    nextAction: "Review precision housing tolerances",
    region: "Pacific Northwest",
    createdDate: "Aug 2025",
  },
  {
    id: "acc-24",
    name: "Heartland Ag Equipment",
    industry: "Agricultural Machinery",
    website: "heartlandag.com",
    phone: "(515) 555-2506",
    primaryContact: "Wayne Peterson",
    email: "w.peterson@heartlandag.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$580M",
    employees: 2200,
    dealCount: 2,
    totalValue: "$340K",
    health: "at-risk",
    stage: "Quoting",
    lastTouch: "5 days ago",
    nextAction: "Revise quote after material cost increase",
    region: "Midwest",
    createdDate: "Oct 2024",
  },
  {
    id: "acc-25",
    name: "Cobalt Aerospace",
    industry: "Aerospace & Defense",
    website: "cobaltaero.com",
    phone: "(316) 555-2618",
    primaryContact: "Lt. Diana Brooks",
    email: "d.brooks@cobaltaero.com",
    accountOwner: "Sarah Kim",
    annualRevenue: "$1.1B",
    employees: 3800,
    dealCount: 3,
    totalValue: "$1.8M",
    health: "strong",
    stage: "Negotiation",
    lastTouch: "Today",
    nextAction: "Sign LTA for landing gear components",
    region: "South Central",
    createdDate: "Apr 2024",
  },
  {
    id: "acc-26",
    name: "Duraform Plastics",
    industry: "Injection Molding",
    website: "duraformplastics.com",
    phone: "(616) 555-2730",
    primaryContact: "Nick Voronov",
    email: "n.voronov@duraform.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$76M",
    employees: 310,
    dealCount: 1,
    totalValue: "$125K",
    health: "new",
    stage: "Prospecting",
    lastTouch: "6 days ago",
    nextAction: "Send over-mold insert machining samples",
    region: "Midwest",
    createdDate: "Jan 2026",
  },
  {
    id: "acc-27",
    name: "Sierra Power Solutions",
    industry: "Electrical Equipment",
    website: "sierrapower.com",
    phone: "(775) 555-2845",
    primaryContact: "Maria Gonzalez",
    email: "m.gonzalez@sierrapower.com",
    accountOwner: "Sarah Kim",
    annualRevenue: "$430M",
    employees: 1400,
    dealCount: 2,
    totalValue: "$560K",
    health: "strong",
    stage: "Quoting",
    lastTouch: "2 days ago",
    nextAction: "Finalize bus bar copper machining quote",
    region: "Mountain West",
    createdDate: "Jul 2025",
  },
  {
    id: "acc-28",
    name: "ProFab Welding Solutions",
    industry: "Welding & Fabrication",
    website: "profabweld.com",
    phone: "(281) 555-2956",
    primaryContact: "Jim Calloway",
    email: "j.calloway@profabweld.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$52M",
    employees: 200,
    dealCount: 1,
    totalValue: "$88K",
    health: "new",
    stage: "Technical Review",
    lastTouch: "4 days ago",
    nextAction: "Review weld fixture design specs",
    region: "South Central",
    createdDate: "Dec 2025",
  },
  {
    id: "acc-29",
    name: "Orion Rail Systems",
    industry: "Rail & Transit",
    website: "orionrail.com",
    phone: "(312) 555-3068",
    primaryContact: "Liam Gallagher",
    email: "l.gallagher@orionrail.com",
    accountOwner: "Sarah Kim",
    annualRevenue: "$1.9B",
    employees: 6300,
    dealCount: 2,
    totalValue: "$1.4M",
    health: "strong",
    stage: "Negotiation",
    lastTouch: "Today",
    nextAction: "Negotiate multi-year bogie frame contract",
    region: "Midwest",
    createdDate: "May 2025",
  },
  {
    id: "acc-30",
    name: "Eclipse Semiconductor",
    industry: "Semiconductors",
    website: "eclipsesemi.com",
    phone: "(408) 555-3179",
    primaryContact: "Kevin Tao",
    email: "k.tao@eclipsesemi.com",
    accountOwner: "Derek Morrison",
    annualRevenue: "$5.6B",
    employees: 18000,
    dealCount: 1,
    totalValue: "$520K",
    health: "at-risk",
    stage: "Prospecting",
    lastTouch: "1 week ago",
    nextAction: "Re-submit cleanroom fixture proposal",
    region: "West Coast",
    createdDate: "Nov 2025",
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
  {
    id: "dtl-18",
    name: "Turbine Blade Fixture — Production Tooling",
    accountId: "acc-16",
    accountName: "Apex Turbine Technologies",
    contactName: "Carlos Reyes",
    email: "c.reyes@apexturbine.com",
    dealOwner: "Derek Morrison",
    stage: "Proposal",
    value: "$720K",
    probability: 60,
    closeDate: "Apr 15, 2026",
    createdDate: "Mar 10, 2025",
    lastActivity: "Today",
    source: "Inbound RFQ",
    product: "5-Axis CNC Machining",
    nextStep: "Submit turbine blade fixture quote",
    type: "New Business",
  },
  {
    id: "dtl-19",
    name: "Composite Tooling Panels — First Article",
    accountId: "acc-17",
    accountName: "Pinnacle Composites",
    contactName: "Sandra Navarro",
    email: "s.navarro@pinnaclecomp.com",
    dealOwner: "Sarah Kim",
    stage: "Prospecting",
    value: "$290K",
    probability: 15,
    closeDate: "Jul 30, 2026",
    createdDate: "Jan 20, 2026",
    lastActivity: "4 days ago",
    source: "Trade Show",
    product: "CNC Machining",
    nextStep: "Send composite tooling capability overview",
    type: "New Business",
  },
  {
    id: "dtl-20",
    name: "Progressive Die Bracket — Annual Run",
    accountId: "acc-18",
    accountName: "Great Lakes Stamping",
    contactName: "Ed Brannigan",
    email: "e.brannigan@glstamping.com",
    dealOwner: "Derek Morrison",
    stage: "Qualification",
    value: "$195K",
    probability: 45,
    closeDate: "May 20, 2026",
    createdDate: "Sep 5, 2025",
    lastActivity: "Yesterday",
    source: "Existing Relationship",
    product: "Stamping & Forming",
    nextStep: "Review progressive die design for bracket",
    type: "Existing Business",
  },
  {
    id: "dtl-21",
    name: "Precision Lens Housing — Tight Tolerance",
    accountId: "acc-19",
    accountName: "Quantum Photonics",
    contactName: "Dr. Helen Park",
    email: "h.park@quantumphotonics.com",
    dealOwner: "Sarah Kim",
    stage: "Qualification",
    value: "$450K",
    probability: 35,
    closeDate: "Jun 15, 2026",
    createdDate: "Nov 12, 2025",
    lastActivity: "1 week ago",
    source: "Referral",
    product: "Precision Machining",
    nextStep: "Address surface roughness concerns on housing",
    type: "New Business",
  },
  {
    id: "dtl-22",
    name: "Forging Supply Agreement — Multi-Year",
    accountId: "acc-20",
    accountName: "Wolverine Forge",
    contactName: "Tom Bridwell",
    email: "t.bridwell@wolverineforge.com",
    dealOwner: "Derek Morrison",
    stage: "Negotiation",
    value: "$620K",
    probability: 80,
    closeDate: "Mar 1, 2026",
    createdDate: "Feb 15, 2024",
    lastActivity: "Today",
    source: "Existing Relationship",
    product: "Forging & Machining",
    nextStep: "Finalize annual supply agreement terms",
    type: "Renewal",
  },
  {
    id: "dtl-23",
    name: "EMI Shielding Enclosures — Batch Order",
    accountId: "acc-21",
    accountName: "Sentinel Security Systems",
    contactName: "Patricia Dunn",
    email: "p.dunn@sentinelsec.com",
    dealOwner: "Sarah Kim",
    stage: "Proposal",
    value: "$710K",
    probability: 55,
    closeDate: "Apr 25, 2026",
    createdDate: "Jun 8, 2025",
    lastActivity: "2 days ago",
    source: "Inbound RFQ",
    product: "Sheet Metal Fabrication",
    nextStep: "Quote EMI shielding enclosure batch",
    type: "New Business",
  },
  {
    id: "dtl-24",
    name: "Marine Structural Components — Initial Quote",
    accountId: "acc-22",
    accountName: "Trident Marine Fabrication",
    contactName: "Capt. Ryan Novak",
    email: "r.novak@tridentmarine.com",
    dealOwner: "Derek Morrison",
    stage: "Prospecting",
    value: "$980K",
    probability: 10,
    closeDate: "Sep 30, 2026",
    createdDate: "Feb 3, 2026",
    lastActivity: "3 days ago",
    source: "Outbound",
    product: "Heavy Fabrication",
    nextStep: "Schedule initial capabilities presentation",
    type: "New Business",
  },
  {
    id: "dtl-25",
    name: "Precision Instrument Housing — DFM Review",
    accountId: "acc-23",
    accountName: "NovaTech Instruments",
    contactName: "Amy Sato",
    email: "a.sato@novatech-inst.com",
    dealOwner: "Sarah Kim",
    stage: "Qualification",
    value: "$430K",
    probability: 50,
    closeDate: "May 10, 2026",
    createdDate: "Aug 20, 2025",
    lastActivity: "Yesterday",
    source: "Referral",
    product: "Precision Machining",
    nextStep: "Review precision housing tolerances",
    type: "New Business",
  },
  {
    id: "dtl-26",
    name: "Harvester Frame Brackets — Revised Quote",
    accountId: "acc-24",
    accountName: "Heartland Ag Equipment",
    contactName: "Wayne Peterson",
    email: "w.peterson@heartlandag.com",
    dealOwner: "Derek Morrison",
    stage: "Proposal",
    value: "$340K",
    probability: 40,
    closeDate: "Apr 30, 2026",
    createdDate: "Oct 10, 2024",
    lastActivity: "5 days ago",
    source: "Existing Relationship",
    product: "Heavy Fabrication",
    nextStep: "Revise quote after material cost increase",
    type: "Existing Business",
  },
  {
    id: "dtl-27",
    name: "Landing Gear Components — LTA Signing",
    accountId: "acc-25",
    accountName: "Cobalt Aerospace",
    contactName: "Lt. Diana Brooks",
    email: "d.brooks@cobaltaero.com",
    dealOwner: "Sarah Kim",
    stage: "Negotiation",
    value: "$1.8M",
    probability: 85,
    closeDate: "Feb 28, 2026",
    createdDate: "Apr 15, 2024",
    lastActivity: "Today",
    source: "Inbound RFQ",
    product: "5-Axis CNC Machining",
    nextStep: "Sign LTA for landing gear components",
    type: "New Business",
  },
  {
    id: "dtl-28",
    name: "Over-Mold Insert Machining — Samples",
    accountId: "acc-26",
    accountName: "Duraform Plastics",
    contactName: "Nick Voronov",
    email: "n.voronov@duraform.com",
    dealOwner: "Derek Morrison",
    stage: "Prospecting",
    value: "$125K",
    probability: 15,
    closeDate: "Jul 15, 2026",
    createdDate: "Jan 22, 2026",
    lastActivity: "6 days ago",
    source: "Trade Show",
    product: "CNC Machining",
    nextStep: "Send over-mold insert machining samples",
    type: "New Business",
  },
  {
    id: "dtl-29",
    name: "Copper Bus Bar Machining — Production Quote",
    accountId: "acc-27",
    accountName: "Sierra Power Solutions",
    contactName: "Maria Gonzalez",
    email: "m.gonzalez@sierrapower.com",
    dealOwner: "Sarah Kim",
    stage: "Proposal",
    value: "$560K",
    probability: 60,
    closeDate: "Apr 5, 2026",
    createdDate: "Jul 10, 2025",
    lastActivity: "2 days ago",
    source: "Inbound RFQ",
    product: "CNC Machining",
    nextStep: "Finalize bus bar copper machining quote",
    type: "Existing Business",
  },
  {
    id: "dtl-30",
    name: "Bogie Frame Contract — Multi-Year Negotiation",
    accountId: "acc-29",
    accountName: "Orion Rail Systems",
    contactName: "Liam Gallagher",
    email: "l.gallagher@orionrail.com",
    dealOwner: "Sarah Kim",
    stage: "Negotiation",
    value: "$1.4M",
    probability: 75,
    closeDate: "Mar 15, 2026",
    createdDate: "May 20, 2025",
    lastActivity: "Today",
    source: "Existing Relationship",
    product: "Heavy Fabrication",
    nextStep: "Negotiate multi-year bogie frame contract",
    type: "Renewal",
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

// ─── ERP / Account Intelligence Data ──────────────────────────────────────

export interface ERPLineItem {
  partNumber: string;
  description: string;
  qty: number;
  unitPrice: string;
  process: string;
}

export interface ERPOrder {
  id: string;
  poNumber: string;
  orderDate: string;
  deliveryDate: string;
  status: "Delivered" | "In Production" | "Invoiced";
  totalValue: string;
  items: ERPLineItem[];
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  receivedDate: string;
  respondedDate: string | null;
  status: "Won" | "Lost" | "Pending" | "No Bid";
  quotedValue: string;
  lostReason?: string;
  process: string;
}

export interface AccountContact {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  lastInteraction: string;
  influence: "Decision Maker" | "Champion" | "Influencer" | "End User";
}

export interface ActivityEvent {
  id: string;
  date: string;
  type: "email" | "call" | "meeting" | "quote_sent" | "po_received" | "site_visit" | "nda_signed";
  title: string;
  description: string;
  contact?: string;
}

export interface QualityMetrics {
  onTimeDeliveryPct: number;
  rejectionRatePct: number;
  ncrCount: number;
  openCapas: number;
  avgLeadTimeDays: number;
  customerSatisfaction: number;
  certifications: string[];
}

export interface AccountInsight {
  type: "upsell" | "cross-sell" | "reorder" | "trend" | "risk";
  title: string;
  description: string;
}

export interface AccountERPProfile {
  accountId: string;
  lifetimeValue: string;
  orderCount: number;
  avgOrderValue: string;
  firstOrderDate: string;
  topProcesses: string[];
  reorderCycleDays: number;
  orders: ERPOrder[];
  rfqs: RFQ[];
  contacts: AccountContact[];
  activities: ActivityEvent[];
  quality: QualityMetrics;
  insights: AccountInsight[];
}

export const mockAccountERP: Record<string, AccountERPProfile> = {
  "acc-1": {
    accountId: "acc-1",
    lifetimeValue: "$3.2M",
    orderCount: 18,
    avgOrderValue: "$178K",
    firstOrderDate: "Sep 2022",
    topProcesses: ["5-Axis CNC", "Wire EDM", "Surface Treatment"],
    reorderCycleDays: 180,
    orders: [
      {
        id: "ord-101",
        poNumber: "PO-ND-2025-0847",
        orderDate: "Oct 12, 2025",
        deliveryDate: "Dec 20, 2025",
        status: "Delivered",
        totalValue: "$214K",
        items: [
          { partNumber: "ND-7741-A", description: "Ti-6Al-4V Mounting Bracket (Left)", qty: 1200, unitPrice: "$89", process: "5-Axis CNC" },
          { partNumber: "ND-7741-B", description: "Ti-6Al-4V Mounting Bracket (Right)", qty: 1200, unitPrice: "$89", process: "5-Axis CNC" },
        ],
      },
      {
        id: "ord-102",
        poNumber: "PO-ND-2025-0631",
        orderDate: "Jun 5, 2025",
        deliveryDate: "Aug 15, 2025",
        status: "Delivered",
        totalValue: "$342K",
        items: [
          { partNumber: "ND-5590-C", description: "Inconel 718 Turbine Shroud", qty: 80, unitPrice: "$3,200", process: "5-Axis CNC" },
          { partNumber: "ND-5590-D", description: "Inconel 718 Nozzle Guide Vane", qty: 160, unitPrice: "$540", process: "Wire EDM" },
        ],
      },
      {
        id: "ord-103",
        poNumber: "PO-ND-2024-0412",
        orderDate: "Nov 3, 2024",
        deliveryDate: "Jan 18, 2025",
        status: "Delivered",
        totalValue: "$156K",
        items: [
          { partNumber: "ND-3310-A", description: "Aluminum 7075 Avionics Chassis", qty: 50, unitPrice: "$2,400", process: "5-Axis CNC" },
          { partNumber: "ND-3310-B", description: "EMI Shield Gasket Frame", qty: 50, unitPrice: "$720", process: "Wire EDM" },
        ],
      },
      {
        id: "ord-104",
        poNumber: "PO-ND-2024-0198",
        orderDate: "May 22, 2024",
        deliveryDate: "Jul 30, 2024",
        status: "Delivered",
        totalValue: "$89K",
        items: [
          { partNumber: "ND-2210-A", description: "Ti-6Al-4V Sensor Mount", qty: 600, unitPrice: "$148", process: "5-Axis CNC" },
        ],
      },
    ],
    rfqs: [
      { id: "rfq-101", rfqNumber: "RFQ-ND-2026-012", title: "Ti-6Al-4V Mounting Brackets — 2,400 units", receivedDate: "Jan 8, 2026", respondedDate: "Jan 15, 2026", status: "Pending", quotedValue: "$840K", process: "5-Axis CNC" },
      { id: "rfq-102", rfqNumber: "RFQ-ND-2025-089", title: "Inconel Turbine Shroud — Annual Blanket", receivedDate: "Sep 20, 2025", respondedDate: "Oct 1, 2025", status: "Won", quotedValue: "$1.1M", process: "5-Axis CNC" },
      { id: "rfq-103", rfqNumber: "RFQ-ND-2025-054", title: "Titanium Landing Gear Pin Set", receivedDate: "May 10, 2025", respondedDate: "May 22, 2025", status: "Lost", quotedValue: "$420K", lostReason: "Lead Time", process: "5-Axis CNC" },
      { id: "rfq-104", rfqNumber: "RFQ-ND-2025-031", title: "Wire EDM Fuel Nozzle Slots", receivedDate: "Mar 5, 2025", respondedDate: "Mar 12, 2025", status: "Won", quotedValue: "$185K", process: "Wire EDM" },
      { id: "rfq-105", rfqNumber: "RFQ-ND-2024-078", title: "Avionics Chassis — Qualification Run", receivedDate: "Oct 1, 2024", respondedDate: "Oct 10, 2024", status: "Won", quotedValue: "$156K", process: "5-Axis CNC" },
    ],
    contacts: [
      { id: "ct-101", name: "Col. James Whitfield", role: "VP Supply Chain", department: "Procurement", email: "j.whitfield@northropdyn.com", phone: "(310) 555-0142", lastInteraction: "Today", influence: "Decision Maker" },
      { id: "ct-102", name: "Laura Chen", role: "Senior Buyer", department: "Procurement", email: "l.chen@northropdyn.com", phone: "(310) 555-0155", lastInteraction: "2 days ago", influence: "Champion" },
      { id: "ct-103", name: "Dr. Alan Rourke", role: "Chief Engineer — Structures", department: "Engineering", email: "a.rourke@northropdyn.com", phone: "(310) 555-0168", lastInteraction: "1 week ago", influence: "Influencer" },
      { id: "ct-104", name: "Sgt. Mark Davis", role: "Quality Inspector", department: "Quality", email: "m.davis@northropdyn.com", phone: "(310) 555-0171", lastInteraction: "3 weeks ago", influence: "End User" },
    ],
    activities: [
      { id: "act-101", date: "Feb 14, 2026", type: "email", title: "RFQ Response Sent", description: "Sent detailed quote for Ti-6Al-4V mounting brackets — 2,400 units with tooling breakdown.", contact: "Laura Chen" },
      { id: "act-102", date: "Feb 10, 2026", type: "call", title: "Pricing Discussion", description: "Call with Col. Whitfield re: volume discount tiers for FY26 blanket PO.", contact: "Col. James Whitfield" },
      { id: "act-103", date: "Jan 22, 2026", type: "meeting", title: "Quarterly Business Review", description: "QBR at Northrop facility — reviewed delivery performance, discussed FY26 forecast.", contact: "Col. James Whitfield" },
      { id: "act-104", date: "Jan 8, 2026", type: "po_received", title: "New RFQ Received", description: "Received RFQ-ND-2026-012 for Ti bracket production run — 2,400 units.", contact: "Laura Chen" },
      { id: "act-105", date: "Dec 20, 2025", type: "po_received", title: "PO-ND-2025-0847 Delivered", description: "Delivered 2,400 Ti brackets on schedule. Received positive feedback from QA.", contact: "Sgt. Mark Davis" },
      { id: "act-106", date: "Oct 12, 2025", type: "po_received", title: "PO-ND-2025-0847 Received", description: "New PO for 2,400 Ti-6Al-4V mounting brackets. 10-week lead time confirmed.", contact: "Laura Chen" },
      { id: "act-107", date: "Sep 15, 2025", type: "site_visit", title: "Plant Tour — Engineering Team", description: "Hosted Dr. Rourke and 3 engineers for facility tour. Showed new 5-axis cell.", contact: "Dr. Alan Rourke" },
    ],
    quality: {
      onTimeDeliveryPct: 97,
      rejectionRatePct: 0.4,
      ncrCount: 1,
      openCapas: 0,
      avgLeadTimeDays: 52,
      customerSatisfaction: 5,
      certifications: ["AS9100D", "ITAR", "NADCAP"],
    },
    insights: [
      { type: "reorder", title: "Ti Bracket Reorder Overdue", description: "Last Ti bracket order was 8 months ago — typical reorder cycle is 6 months. Current RFQ pending response." },
      { type: "cross-sell", title: "Surface Treatment Opportunity", description: "Currently buys CNC-only. Surface treatment (anodize, passivation) and kitting are expansion opportunities worth ~$120K/yr." },
      { type: "upsell", title: "MSA Blanket PO Expansion", description: "3-year MSA under negotiation. Opportunity to bundle Inconel and Ti programs into single agreement at 15% higher volume." },
    ],
  },

  "acc-2": {
    accountId: "acc-2",
    lifetimeValue: "$890K",
    orderCount: 6,
    avgOrderValue: "$148K",
    firstOrderDate: "Mar 2025",
    topProcesses: ["Injection Molding", "CNC Machining"],
    reorderCycleDays: 120,
    orders: [
      {
        id: "ord-201",
        poNumber: "PO-MC-2025-0322",
        orderDate: "Aug 18, 2025",
        deliveryDate: "Nov 5, 2025",
        status: "Delivered",
        totalValue: "$186K",
        items: [
          { partNumber: "MC-4410-A", description: "PEEK Sensor Housing — Production Mold", qty: 1, unitPrice: "$86,000", process: "Injection Molding" },
          { partNumber: "MC-4410-B", description: "PEEK Sensor Housing — 5K units", qty: 5000, unitPrice: "$20", process: "Injection Molding" },
        ],
      },
      {
        id: "ord-202",
        poNumber: "PO-MC-2025-0189",
        orderDate: "May 3, 2025",
        deliveryDate: "Jun 20, 2025",
        status: "Delivered",
        totalValue: "$42K",
        items: [
          { partNumber: "MC-3301-A", description: "316L SS Catheter Guide Sleeve", qty: 2000, unitPrice: "$21", process: "CNC Machining" },
        ],
      },
    ],
    rfqs: [
      { id: "rfq-201", rfqNumber: "RFQ-MC-2026-008", title: "PEEK Sensor Housing — Injection Mold Tooling", receivedDate: "Jan 5, 2026", respondedDate: "Jan 18, 2026", status: "Pending", quotedValue: "$560K", process: "Injection Molding" },
      { id: "rfq-202", rfqNumber: "RFQ-MC-2025-041", title: "Tooling Quote — Sensor Housing Mold", receivedDate: "Nov 12, 2025", respondedDate: "Nov 20, 2025", status: "Won", quotedValue: "$186K", process: "Injection Molding" },
      { id: "rfq-203", rfqNumber: "RFQ-MC-2025-019", title: "Titanium Bone Screw Prototype", receivedDate: "Apr 8, 2025", respondedDate: null, status: "No Bid", quotedValue: "$0", process: "Swiss CNC" },
    ],
    contacts: [
      { id: "ct-201", name: "Dr. Priya Sharma", role: "Director of R&D", department: "Engineering", email: "p.sharma@medcore.com", phone: "(612) 555-0198", lastInteraction: "3 days ago", influence: "Decision Maker" },
      { id: "ct-202", name: "Tom Krueger", role: "Procurement Manager", department: "Procurement", email: "t.krueger@medcore.com", phone: "(612) 555-0211", lastInteraction: "1 week ago", influence: "Champion" },
      { id: "ct-203", name: "Nancy Liu", role: "Quality Assurance Lead", department: "Quality", email: "n.liu@medcore.com", phone: "(612) 555-0224", lastInteraction: "2 weeks ago", influence: "Influencer" },
    ],
    activities: [
      { id: "act-201", date: "Feb 12, 2026", type: "email", title: "DFM Feedback Sent", description: "Sent DFM analysis for PEEK sensor housing — flagged wall thickness issues on Rev C drawing.", contact: "Dr. Priya Sharma" },
      { id: "act-202", date: "Feb 5, 2026", type: "call", title: "FAI Status Update", description: "Discussed overdue FAI report with QA lead. Committed to delivery by Feb 18.", contact: "Nancy Liu" },
      { id: "act-203", date: "Jan 18, 2026", type: "quote_sent", title: "Quote Submitted — Mold Tooling", description: "Submitted $560K quote for new injection mold tooling program.", contact: "Tom Krueger" },
      { id: "act-204", date: "Jan 5, 2026", type: "po_received", title: "New RFQ Received", description: "Received RFQ for PEEK sensor housing mold tooling — 2nd generation design.", contact: "Dr. Priya Sharma" },
      { id: "act-205", date: "Nov 5, 2025", type: "po_received", title: "PO-MC-2025-0322 Delivered", description: "Delivered production mold and initial 5K units. First article inspection passed.", contact: "Nancy Liu" },
    ],
    quality: {
      onTimeDeliveryPct: 88,
      rejectionRatePct: 2.1,
      ncrCount: 3,
      openCapas: 1,
      avgLeadTimeDays: 45,
      customerSatisfaction: 3,
      certifications: ["ISO 13485", "FDA Registered"],
    },
    insights: [
      { type: "risk", title: "FAI Report Overdue — 3 Weeks", description: "First Article Inspection report for PEEK housing is overdue. Delays risk losing the $560K tooling program." },
      { type: "upsell", title: "2nd Gen Mold Program", description: "Current RFQ for 2nd gen PEEK housing is 3x volume of initial order. Win probability improves if FAI is resolved quickly." },
      { type: "cross-sell", title: "Catheter Guide Expansion", description: "Current SS catheter sleeves are CNC only. Assembly and packaging services could add $80K/yr." },
    ],
  },

  "acc-3": {
    accountId: "acc-3",
    lifetimeValue: "$2.8M",
    orderCount: 24,
    avgOrderValue: "$117K",
    firstOrderDate: "Mar 2023",
    topProcesses: ["Sheet Metal", "Stamping", "Welding/Fab"],
    reorderCycleDays: 90,
    orders: [
      {
        id: "ord-301",
        poNumber: "PO-AP-2025-1204",
        orderDate: "Dec 4, 2025",
        deliveryDate: "Feb 15, 2026",
        status: "In Production",
        totalValue: "$298K",
        items: [
          { partNumber: "AP-8812-A", description: "Steel Enclosure — Battery Module", qty: 4000, unitPrice: "$52", process: "Sheet Metal" },
          { partNumber: "AP-8812-B", description: "Enclosure Lid — Stamped", qty: 4000, unitPrice: "$22.50", process: "Stamping" },
        ],
      },
      {
        id: "ord-302",
        poNumber: "PO-AP-2025-0998",
        orderDate: "Sep 15, 2025",
        deliveryDate: "Nov 28, 2025",
        status: "Delivered",
        totalValue: "$184K",
        items: [
          { partNumber: "AP-6630-A", description: "Weldment — Subframe Assembly", qty: 800, unitPrice: "$230", process: "Welding/Fab" },
        ],
      },
      {
        id: "ord-303",
        poNumber: "PO-AP-2025-0741",
        orderDate: "Jun 22, 2025",
        deliveryDate: "Aug 30, 2025",
        status: "Delivered",
        totalValue: "$156K",
        items: [
          { partNumber: "AP-8812-A", description: "Steel Enclosure — Battery Module", qty: 3000, unitPrice: "$52", process: "Sheet Metal" },
        ],
      },
    ],
    rfqs: [
      { id: "rfq-301", rfqNumber: "RFQ-AP-2026-004", title: "Sheet Metal Enclosures — Annual Blanket PO", receivedDate: "Jan 12, 2026", respondedDate: "Jan 22, 2026", status: "Pending", quotedValue: "$1.2M", process: "Sheet Metal" },
      { id: "rfq-302", rfqNumber: "RFQ-AP-2025-067", title: "EV Battery Tray — New Program", receivedDate: "Aug 5, 2025", respondedDate: "Aug 15, 2025", status: "Won", quotedValue: "$890K", process: "Sheet Metal" },
      { id: "rfq-303", rfqNumber: "RFQ-AP-2025-034", title: "Stamped Brackets — 50K Volume", receivedDate: "Apr 18, 2025", respondedDate: "Apr 28, 2025", status: "Won", quotedValue: "$340K", process: "Stamping" },
      { id: "rfq-304", rfqNumber: "RFQ-AP-2025-011", title: "Aluminum Heat Shield", receivedDate: "Feb 1, 2025", respondedDate: "Feb 12, 2025", status: "Lost", quotedValue: "$210K", lostReason: "Price", process: "Sheet Metal" },
    ],
    contacts: [
      { id: "ct-301", name: "Mike Tanaka", role: "Director of Procurement", department: "Procurement", email: "m.tanaka@autoprime.com", phone: "(313) 555-0267", lastInteraction: "Yesterday", influence: "Decision Maker" },
      { id: "ct-302", name: "Sarah Okonkwo", role: "Manufacturing Engineer", department: "Engineering", email: "s.okonkwo@autoprime.com", phone: "(313) 555-0280", lastInteraction: "3 days ago", influence: "Champion" },
      { id: "ct-303", name: "Jim Patel", role: "VP Operations", department: "Executive", email: "j.patel@autoprime.com", phone: "(313) 555-0293", lastInteraction: "2 weeks ago", influence: "Decision Maker" },
    ],
    activities: [
      { id: "act-301", date: "Feb 15, 2026", type: "email", title: "Blanket PO Quote Follow-up", description: "Sent revised pricing for FY26 blanket PO — 20% volume increase baked in.", contact: "Mike Tanaka" },
      { id: "act-302", date: "Feb 8, 2026", type: "meeting", title: "Annual Pricing Review", description: "On-site meeting with procurement to negotiate FY26 pricing. Agreed on 3% escalation.", contact: "Mike Tanaka" },
      { id: "act-303", date: "Jan 22, 2026", type: "quote_sent", title: "Annual Blanket PO Quote", description: "Submitted $1.2M blanket PO quote for sheet metal enclosures — covers 48K units.", contact: "Mike Tanaka" },
      { id: "act-304", date: "Dec 4, 2025", type: "po_received", title: "PO-AP-2025-1204 Received", description: "New PO for 4,000 battery module enclosures + lids. Currently in production.", contact: "Sarah Okonkwo" },
      { id: "act-305", date: "Nov 28, 2025", type: "po_received", title: "PO-AP-2025-0998 Delivered", description: "800 subframe weldments delivered on schedule.", contact: "Sarah Okonkwo" },
      { id: "act-306", date: "Oct 15, 2025", type: "site_visit", title: "Plant Tour — VP Operations", description: "Jim Patel visited to review new sheet metal line. Discussed capacity for EV tray program.", contact: "Jim Patel" },
    ],
    quality: {
      onTimeDeliveryPct: 96,
      rejectionRatePct: 0.8,
      ncrCount: 2,
      openCapas: 0,
      avgLeadTimeDays: 38,
      customerSatisfaction: 4,
      certifications: ["IATF 16949", "ISO 9001"],
    },
    insights: [
      { type: "trend", title: "Order Volume Up 40% YoY", description: "AutoPrime order volume increased 40% year-over-year. Approaching capacity threshold on sheet metal line." },
      { type: "upsell", title: "Blanket PO Renewal — Bundle Tooling", description: "Annual blanket PO renewal due Q2. Opportunity to bundle tooling amortization for $1.2M deal." },
      { type: "cross-sell", title: "EV Battery Tray Assembly", description: "Currently buys formed parts only. Assembly and spot-welding services could add $400K/yr to the relationship." },
    ],
  },

  "acc-4": {
    accountId: "acc-4",
    lifetimeValue: "$0",
    orderCount: 0,
    avgOrderValue: "$0",
    firstOrderDate: "—",
    topProcesses: [],
    reorderCycleDays: 0,
    orders: [],
    rfqs: [
      { id: "rfq-401", rfqNumber: "RFQ-TC-2026-003", title: "Heavy Equipment Fabrication — Discovery", receivedDate: "Jan 20, 2026", respondedDate: null, status: "Pending", quotedValue: "$420K", process: "Welding/Fab" },
    ],
    contacts: [
      { id: "ct-401", name: "Bill Hendricks", role: "Procurement Director", department: "Procurement", email: "b.hendricks@terracore.com", phone: "(414) 555-0331", lastInteraction: "2 days ago", influence: "Decision Maker" },
      { id: "ct-402", name: "Rita Gonzalez", role: "Plant Manager", department: "Executive", email: "r.gonzalez@terracore.com", phone: "(414) 555-0344", lastInteraction: "1 week ago", influence: "Influencer" },
    ],
    activities: [
      { id: "act-401", date: "Feb 14, 2026", type: "email", title: "Capability Deck Sent", description: "Sent heavy fabrication capability deck and case studies from mining sector.", contact: "Bill Hendricks" },
      { id: "act-402", date: "Feb 7, 2026", type: "call", title: "Discovery Call", description: "Initial call with Bill — discussed fabrication needs for new excavator line.", contact: "Bill Hendricks" },
      { id: "act-403", date: "Jan 28, 2026", type: "meeting", title: "IMTS Follow-up", description: "Met at IMTS booth. Exchanged cards, discussed heavy fab capabilities.", contact: "Rita Gonzalez" },
    ],
    quality: {
      onTimeDeliveryPct: 0,
      rejectionRatePct: 0,
      ncrCount: 0,
      openCapas: 0,
      avgLeadTimeDays: 0,
      customerSatisfaction: 0,
      certifications: [],
    },
    insights: [
      { type: "trend", title: "New Account — High Potential", description: "TerraCore is a $1.8B heavy equipment company. First RFQ in pipeline worth $420K." },
      { type: "upsell", title: "Schedule Plant Tour", description: "Procurement team interested in facility tour. Converting this visit could unlock multi-year fab program." },
    ],
  },

  "acc-5": {
    accountId: "acc-5",
    lifetimeValue: "$0",
    orderCount: 0,
    avgOrderValue: "$0",
    firstOrderDate: "—",
    topProcesses: [],
    reorderCycleDays: 0,
    orders: [],
    rfqs: [
      { id: "rfq-501", rfqNumber: "RFQ-PA-2026-001", title: "Aerospace Capability Qualification", receivedDate: "Feb 3, 2026", respondedDate: null, status: "Pending", quotedValue: "$1.2M", process: "5-Axis CNC" },
    ],
    contacts: [
      { id: "ct-501", name: "Greg Holloway", role: "Supply Chain Manager", department: "Procurement", email: "g.holloway@pacificaero.com", phone: "(206) 555-0419", lastInteraction: "1 week ago", influence: "Champion" },
      { id: "ct-502", name: "Dr. Irene Park", role: "Chief Engineer", department: "Engineering", email: "i.park@pacificaero.com", phone: "(206) 555-0432", lastInteraction: "2 weeks ago", influence: "Decision Maker" },
    ],
    activities: [
      { id: "act-501", date: "Feb 10, 2026", type: "email", title: "Capability Deck Follow-up", description: "Sent updated 5-axis capability deck with AS9100D cert details.", contact: "Greg Holloway" },
      { id: "act-502", date: "Feb 3, 2026", type: "po_received", title: "RFQ Received", description: "Received aerospace capability qualification RFQ — potential $1.2M program.", contact: "Greg Holloway" },
      { id: "act-503", date: "Jan 25, 2026", type: "meeting", title: "IMTS Follow-up Meeting", description: "Met at IMTS. Discussed Pacific Aero's need for second-source 5-axis supplier.", contact: "Dr. Irene Park" },
    ],
    quality: {
      onTimeDeliveryPct: 0,
      rejectionRatePct: 0,
      ncrCount: 0,
      openCapas: 0,
      avgLeadTimeDays: 0,
      customerSatisfaction: 0,
      certifications: [],
    },
    insights: [
      { type: "trend", title: "New Account — Second-Source Opportunity", description: "Pacific Aero seeks a second-source for 5-axis CNC. Winning qualification could open $1.2M/yr program." },
      { type: "cross-sell", title: "NDT & Inspection Services", description: "If qualified, NDT and CMM inspection add-ons could increase deal value by 20%." },
    ],
  },

  "acc-6": {
    accountId: "acc-6",
    lifetimeValue: "$1.4M",
    orderCount: 12,
    avgOrderValue: "$117K",
    firstOrderDate: "Nov 2023",
    topProcesses: ["CNC Machining", "Honing", "Assembly"],
    reorderCycleDays: 150,
    orders: [
      {
        id: "ord-601",
        poNumber: "PO-SP-2025-0445",
        orderDate: "Sep 8, 2025",
        deliveryDate: "Nov 20, 2025",
        status: "Delivered",
        totalValue: "$134K",
        items: [
          { partNumber: "SP-2200-A", description: "Hydraulic Manifold Block — 4-Station", qty: 200, unitPrice: "$520", process: "CNC Machining" },
          { partNumber: "SP-2200-B", description: "Manifold Port Honing", qty: 200, unitPrice: "$150", process: "Honing" },
        ],
      },
      {
        id: "ord-602",
        poNumber: "PO-SP-2025-0281",
        orderDate: "Apr 15, 2025",
        deliveryDate: "Jun 22, 2025",
        status: "Delivered",
        totalValue: "$98K",
        items: [
          { partNumber: "SP-1100-A", description: "Valve Body — Ductile Iron", qty: 500, unitPrice: "$196", process: "CNC Machining" },
        ],
      },
    ],
    rfqs: [
      { id: "rfq-601", rfqNumber: "RFQ-SP-2026-005", title: "Hydraulic Manifold — BOM Costing", receivedDate: "Jan 15, 2026", respondedDate: "Jan 28, 2026", status: "Pending", quotedValue: "$310K", process: "CNC Machining" },
      { id: "rfq-602", rfqNumber: "RFQ-SP-2025-048", title: "Valve Body Annual PO", receivedDate: "Aug 20, 2025", respondedDate: "Sep 1, 2025", status: "Won", quotedValue: "$420K", process: "CNC Machining" },
      { id: "rfq-603", rfqNumber: "RFQ-SP-2025-022", title: "Custom Hydraulic Block — Prototype", receivedDate: "Mar 10, 2025", respondedDate: "Mar 18, 2025", status: "Won", quotedValue: "$45K", process: "CNC Machining" },
    ],
    contacts: [
      { id: "ct-601", name: "Dave Kowalski", role: "Engineering Manager", department: "Engineering", email: "d.kowalski@summitprecision.com", phone: "(440) 555-0587", lastInteraction: "Yesterday", influence: "Champion" },
      { id: "ct-602", name: "Linda Torres", role: "Buyer", department: "Procurement", email: "l.torres@summitprecision.com", phone: "(440) 555-0594", lastInteraction: "4 days ago", influence: "Influencer" },
    ],
    activities: [
      { id: "act-601", date: "Feb 14, 2026", type: "email", title: "BOM Costing Update", description: "Sent updated BOM costing for hydraulic manifold — revised material pricing.", contact: "Dave Kowalski" },
      { id: "act-602", date: "Feb 2, 2026", type: "call", title: "Technical Review", description: "Reviewed manifold port tolerances with Dave. Agreed on ±0.001\" spec.", contact: "Dave Kowalski" },
      { id: "act-603", date: "Jan 28, 2026", type: "quote_sent", title: "Quote Submitted", description: "Submitted $310K quote for hydraulic manifold BOM program.", contact: "Linda Torres" },
      { id: "act-604", date: "Jan 15, 2026", type: "po_received", title: "RFQ Received", description: "Received RFQ for hydraulic manifold BOM costing.", contact: "Dave Kowalski" },
      { id: "act-605", date: "Nov 20, 2025", type: "po_received", title: "PO-SP-2025-0445 Delivered", description: "200 manifold blocks delivered + honing. All passed inspection.", contact: "Linda Torres" },
    ],
    quality: {
      onTimeDeliveryPct: 94,
      rejectionRatePct: 1.2,
      ncrCount: 2,
      openCapas: 1,
      avgLeadTimeDays: 42,
      customerSatisfaction: 4,
      certifications: ["ISO 9001"],
    },
    insights: [
      { type: "reorder", title: "Valve Body Reorder Due", description: "Annual valve body PO typically renews in Q1. Current contract expires in 6 weeks." },
      { type: "upsell", title: "Assembly Services Opportunity", description: "Summit currently sends manifolds to a 3rd party for assembly. In-house assembly could add $80K/yr." },
    ],
  },

  "acc-7": {
    accountId: "acc-7",
    lifetimeValue: "$1.9M",
    orderCount: 15,
    avgOrderValue: "$127K",
    firstOrderDate: "Jun 2023",
    topProcesses: ["Die Casting", "CNC Machining", "Anodizing"],
    reorderCycleDays: 60,
    orders: [
      {
        id: "ord-701",
        poNumber: "PO-VE-2025-0892",
        orderDate: "Nov 1, 2025",
        deliveryDate: "Jan 10, 2026",
        status: "Delivered",
        totalValue: "$220K",
        items: [
          { partNumber: "VE-6650-A", description: "Aluminum Heat Sink — Die Cast", qty: 10000, unitPrice: "$14", process: "Die Casting" },
          { partNumber: "VE-6650-B", description: "Heat Sink — CNC Fin Machining", qty: 10000, unitPrice: "$8", process: "CNC Machining" },
        ],
      },
      {
        id: "ord-702",
        poNumber: "PO-VE-2025-0654",
        orderDate: "Jul 12, 2025",
        deliveryDate: "Sep 5, 2025",
        status: "Delivered",
        totalValue: "$165K",
        items: [
          { partNumber: "VE-5540-A", description: "Magnesium Laptop Chassis — Cast", qty: 5000, unitPrice: "$22", process: "Die Casting" },
          { partNumber: "VE-5540-B", description: "Chassis — Anodize Black", qty: 5000, unitPrice: "$11", process: "Anodizing" },
        ],
      },
    ],
    rfqs: [
      { id: "rfq-701", rfqNumber: "RFQ-VE-2026-009", title: "Aluminum Heat Sink Casting — DFM Review", receivedDate: "Jan 20, 2026", respondedDate: "Feb 1, 2026", status: "Pending", quotedValue: "$780K", process: "Die Casting" },
      { id: "rfq-702", rfqNumber: "RFQ-VE-2025-072", title: "Magnesium Chassis — Volume Run", receivedDate: "Oct 5, 2025", respondedDate: "Oct 15, 2025", status: "Won", quotedValue: "$520K", process: "Die Casting" },
      { id: "rfq-703", rfqNumber: "RFQ-VE-2025-038", title: "Tablet Enclosure — Prototype", receivedDate: "May 1, 2025", respondedDate: "May 12, 2025", status: "Lost", quotedValue: "$95K", lostReason: "Capability", process: "Injection Molding" },
    ],
    contacts: [
      { id: "ct-701", name: "Lisa Tran", role: "VP Hardware Engineering", department: "Engineering", email: "l.tran@vanguardelec.com", phone: "(408) 555-0723", lastInteraction: "Today", influence: "Decision Maker" },
      { id: "ct-702", name: "Kevin Zhao", role: "Commodity Manager — Metals", department: "Procurement", email: "k.zhao@vanguardelec.com", phone: "(408) 555-0736", lastInteraction: "3 days ago", influence: "Champion" },
      { id: "ct-703", name: "Amy Brennan", role: "Thermal Design Engineer", department: "Engineering", email: "a.brennan@vanguardelec.com", phone: "(408) 555-0749", lastInteraction: "1 week ago", influence: "Influencer" },
    ],
    activities: [
      { id: "act-701", date: "Feb 15, 2026", type: "email", title: "DFM Review Sent", description: "Sent DFM analysis on aluminum heat sink casting — identified draft angle issue on Rev B.", contact: "Amy Brennan" },
      { id: "act-702", date: "Feb 8, 2026", type: "meeting", title: "Thermal Design Collaboration", description: "Video call with Amy to optimize fin geometry for thermal performance.", contact: "Amy Brennan" },
      { id: "act-703", date: "Feb 1, 2026", type: "quote_sent", title: "Heat Sink Quote Submitted", description: "Submitted $780K quote for next-gen heat sink casting program.", contact: "Kevin Zhao" },
      { id: "act-704", date: "Jan 20, 2026", type: "po_received", title: "RFQ Received", description: "Received RFQ for aluminum heat sink casting — DFM review requested.", contact: "Lisa Tran" },
      { id: "act-705", date: "Jan 10, 2026", type: "po_received", title: "PO-VE-2025-0892 Delivered", description: "10K heat sinks delivered. Customer accepted with minor cosmetic note.", contact: "Kevin Zhao" },
    ],
    quality: {
      onTimeDeliveryPct: 95,
      rejectionRatePct: 1.5,
      ncrCount: 3,
      openCapas: 1,
      avgLeadTimeDays: 35,
      customerSatisfaction: 4,
      certifications: ["ISO 9001", "ISO 14001"],
    },
    insights: [
      { type: "upsell", title: "Next-Gen Heat Sink Program", description: "DFM review in progress for $780K casting program. Win could establish us as primary thermal solutions vendor." },
      { type: "cross-sell", title: "Add CNC Post-Machining", description: "Currently outsources fin machining. Offering integrated cast + machine + anodize could save 15% lead time." },
      { type: "reorder", title: "Laptop Chassis Reorder Approaching", description: "Mg chassis order cycles every 60 days. Next reorder expected within 3 weeks." },
    ],
  },

  "acc-8": {
    accountId: "acc-8",
    lifetimeValue: "$0",
    orderCount: 0,
    avgOrderValue: "$0",
    firstOrderDate: "—",
    topProcesses: [],
    reorderCycleDays: 0,
    orders: [],
    rfqs: [
      { id: "rfq-801", rfqNumber: "RFQ-RM-2026-002", title: "CNC Billet Intake Manifold Prototype", receivedDate: "Feb 5, 2026", respondedDate: null, status: "Pending", quotedValue: "$85K", process: "5-Axis CNC" },
    ],
    contacts: [
      { id: "ct-801", name: "Tony Marchetti", role: "Owner / CEO", department: "Executive", email: "t.marchetti@redlinemotor.com", phone: "(704) 555-0856", lastInteraction: "5 days ago", influence: "Decision Maker" },
      { id: "ct-802", name: "Jake Rollins", role: "Lead Fabricator", department: "Engineering", email: "j.rollins@redlinemotor.com", phone: "(704) 555-0869", lastInteraction: "5 days ago", influence: "End User" },
    ],
    activities: [
      { id: "act-801", date: "Feb 11, 2026", type: "email", title: "Prototype Quote Preparation", description: "Requested 3D model files for billet intake manifold to begin quoting.", contact: "Tony Marchetti" },
      { id: "act-802", date: "Feb 5, 2026", type: "po_received", title: "RFQ Received", description: "Received RFQ for CNC billet intake manifold prototype — 10 units.", contact: "Tony Marchetti" },
      { id: "act-803", date: "Jan 30, 2026", type: "call", title: "Introduction Call", description: "Initial call with Tony. Discussed CNC capabilities for performance automotive parts.", contact: "Tony Marchetti" },
    ],
    quality: {
      onTimeDeliveryPct: 0,
      rejectionRatePct: 0,
      ncrCount: 0,
      openCapas: 0,
      avgLeadTimeDays: 0,
      customerSatisfaction: 0,
      certifications: [],
    },
    insights: [
      { type: "trend", title: "New Prototype Customer", description: "Small motorsport company but high-margin prototype work. If manifold succeeds, could lead to recurring limited-run production." },
    ],
  },

  "acc-9": {
    accountId: "acc-9",
    lifetimeValue: "$680K",
    orderCount: 5,
    avgOrderValue: "$136K",
    firstOrderDate: "Oct 2024",
    topProcesses: ["CNC Machining", "Electropolish"],
    reorderCycleDays: 120,
    orders: [
      {
        id: "ord-901",
        poNumber: "PO-BL-2025-0334",
        orderDate: "Jul 20, 2025",
        deliveryDate: "Sep 15, 2025",
        status: "Delivered",
        totalValue: "$178K",
        items: [
          { partNumber: "BL-3300-A", description: "316L SS Reactor Vessel Cap", qty: 40, unitPrice: "$3,200", process: "CNC Machining" },
          { partNumber: "BL-3300-B", description: "Electropolish — Ra 0.4µm", qty: 40, unitPrice: "$1,250", process: "Electropolish" },
        ],
      },
      {
        id: "ord-902",
        poNumber: "PO-BL-2025-0112",
        orderDate: "Feb 10, 2025",
        deliveryDate: "Apr 5, 2025",
        status: "Delivered",
        totalValue: "$92K",
        items: [
          { partNumber: "BL-2200-A", description: "Lab Equipment Mounting Plate — 304 SS", qty: 200, unitPrice: "$460", process: "CNC Machining" },
        ],
      },
    ],
    rfqs: [
      { id: "rfq-901", rfqNumber: "RFQ-BL-2026-006", title: "Surface Finish Spec Resolution — Lab Equipment", receivedDate: "Jan 28, 2026", respondedDate: "Feb 8, 2026", status: "Pending", quotedValue: "$540K", process: "CNC Machining" },
      { id: "rfq-902", rfqNumber: "RFQ-BL-2025-055", title: "Reactor Vessel Components — Reorder", receivedDate: "Jun 15, 2025", respondedDate: "Jun 25, 2025", status: "Won", quotedValue: "$178K", process: "CNC Machining" },
    ],
    contacts: [
      { id: "ct-901", name: "Dr. Karen Obi", role: "Director of Lab Operations", department: "Engineering", email: "k.obi@biosynthlabs.com", phone: "(858) 555-0944", lastInteraction: "4 days ago", influence: "Decision Maker" },
      { id: "ct-902", name: "Marcus Webb", role: "Facilities Buyer", department: "Procurement", email: "m.webb@biosynthlabs.com", phone: "(858) 555-0957", lastInteraction: "1 week ago", influence: "Influencer" },
    ],
    activities: [
      { id: "act-901", date: "Feb 12, 2026", type: "email", title: "Surface Finish Spec Clarification", description: "Sent Ra comparison samples and measurement report to resolve finish spec disagreement.", contact: "Dr. Karen Obi" },
      { id: "act-902", date: "Feb 5, 2026", type: "call", title: "Technical Discussion", description: "Discussed electropolish finish requirements. Disagreement on Ra 0.4 vs 0.2 µm spec.", contact: "Dr. Karen Obi" },
      { id: "act-903", date: "Jan 28, 2026", type: "po_received", title: "RFQ Received", description: "Received RFQ for lab equipment surface finish program.", contact: "Marcus Webb" },
      { id: "act-904", date: "Sep 15, 2025", type: "po_received", title: "PO-BL-2025-0334 Delivered", description: "40 reactor vessel caps delivered with electropolish. Finish spec met.", contact: "Dr. Karen Obi" },
    ],
    quality: {
      onTimeDeliveryPct: 91,
      rejectionRatePct: 2.8,
      ncrCount: 4,
      openCapas: 2,
      avgLeadTimeDays: 48,
      customerSatisfaction: 3,
      certifications: ["ISO 9001"],
    },
    insights: [
      { type: "risk", title: "Surface Finish Dispute Active", description: "Ongoing disagreement on electropolish spec. Unresolved issue could block $540K program and erode trust." },
      { type: "upsell", title: "Reactor Vessel Reorder Cycle", description: "Reactor caps reorder every 120 days. Next cycle approaching — proactive outreach recommended." },
    ],
  },

  "acc-10": {
    accountId: "acc-10",
    lifetimeValue: "$4.1M",
    orderCount: 32,
    avgOrderValue: "$128K",
    firstOrderDate: "May 2022",
    topProcesses: ["Plasma Cutting", "CNC Machining", "Welding/Fab"],
    reorderCycleDays: 45,
    orders: [
      {
        id: "ord-1001",
        poNumber: "PO-AH-2025-1102",
        orderDate: "Nov 10, 2025",
        deliveryDate: "Jan 5, 2026",
        status: "Delivered",
        totalValue: "$245K",
        items: [
          { partNumber: "AH-9900-A", description: "AR400 Wear Plate — 1\" Thick", qty: 500, unitPrice: "$340", process: "Plasma Cutting" },
          { partNumber: "AH-9900-B", description: "Wear Plate — CNC Bolt Hole Pattern", qty: 500, unitPrice: "$150", process: "CNC Machining" },
        ],
      },
      {
        id: "ord-1002",
        poNumber: "PO-AH-2025-0876",
        orderDate: "Aug 22, 2025",
        deliveryDate: "Oct 10, 2025",
        status: "Delivered",
        totalValue: "$189K",
        items: [
          { partNumber: "AH-8800-A", description: "Excavator Bucket Tooth — Cast + Machine", qty: 2000, unitPrice: "$94.50", process: "CNC Machining" },
        ],
      },
    ],
    rfqs: [
      { id: "rfq-1001", rfqNumber: "RFQ-AH-2026-007", title: "Wear Plates — Blanket PO", receivedDate: "Jan 10, 2026", respondedDate: "Jan 22, 2026", status: "Pending", quotedValue: "$1.1M", process: "Plasma Cutting" },
      { id: "rfq-1002", rfqNumber: "RFQ-AH-2025-081", title: "Bucket Teeth — Annual Supply", receivedDate: "Jul 15, 2025", respondedDate: "Jul 25, 2025", status: "Won", quotedValue: "$760K", process: "CNC Machining" },
      { id: "rfq-1003", rfqNumber: "RFQ-AH-2025-044", title: "Conveyor Roller Shafts", receivedDate: "May 5, 2025", respondedDate: "May 15, 2025", status: "Lost", quotedValue: "$180K", lostReason: "Price", process: "CNC Machining" },
    ],
    contacts: [
      { id: "ct-1001", name: "Frank DeLuca", role: "VP Procurement", department: "Procurement", email: "f.deluca@atlasheavy.com", phone: "(412) 555-1032", lastInteraction: "Today", influence: "Decision Maker" },
      { id: "ct-1002", name: "Steve Martinez", role: "Maintenance Engineer", department: "Engineering", email: "s.martinez@atlasheavy.com", phone: "(412) 555-1045", lastInteraction: "3 days ago", influence: "End User" },
      { id: "ct-1003", name: "Carol Reeves", role: "CFO", department: "Executive", email: "c.reeves@atlasheavy.com", phone: "(412) 555-1058", lastInteraction: "1 month ago", influence: "Decision Maker" },
    ],
    activities: [
      { id: "act-1001", date: "Feb 15, 2026", type: "meeting", title: "Blanket PO Negotiation", description: "On-site meeting with Frank to negotiate FY26 wear plate blanket PO terms.", contact: "Frank DeLuca" },
      { id: "act-1002", date: "Feb 3, 2026", type: "quote_sent", title: "Blanket PO Quote Submitted", description: "Submitted $1.1M blanket PO quote for wear plates — 12-month supply.", contact: "Frank DeLuca" },
      { id: "act-1003", date: "Jan 22, 2026", type: "email", title: "Quote Follow-up", description: "Sent pricing comparison vs. competitor for wear plate program.", contact: "Frank DeLuca" },
      { id: "act-1004", date: "Jan 10, 2026", type: "po_received", title: "RFQ Received", description: "Received annual blanket PO RFQ for wear plates.", contact: "Steve Martinez" },
      { id: "act-1005", date: "Jan 5, 2026", type: "po_received", title: "PO-AH-2025-1102 Delivered", description: "500 wear plates delivered on schedule. Zero defects.", contact: "Steve Martinez" },
    ],
    quality: {
      onTimeDeliveryPct: 98,
      rejectionRatePct: 0.2,
      ncrCount: 0,
      openCapas: 0,
      avgLeadTimeDays: 30,
      customerSatisfaction: 5,
      certifications: ["ISO 9001"],
    },
    insights: [
      { type: "upsell", title: "Blanket PO Expansion — $1.1M", description: "Wear plate blanket PO under negotiation. Strong quality record (98% OTD, 0.2% rejection) gives leverage for premium pricing." },
      { type: "cross-sell", title: "Welding & Fabrication Services", description: "Atlas outsources bucket assembly. Our fab capabilities could capture $300K/yr in welded assemblies." },
      { type: "trend", title: "Top Account by Lifetime Value", description: "Highest-value account at $4.1M lifetime. 32 orders in 3.5 years. Protect and grow." },
    ],
  },

  "acc-11": {
    accountId: "acc-11",
    lifetimeValue: "$0",
    orderCount: 0,
    avgOrderValue: "$0",
    firstOrderDate: "—",
    topProcesses: [],
    reorderCycleDays: 0,
    orders: [],
    rfqs: [
      { id: "rfq-1101", rfqNumber: "RFQ-CR-2026-001", title: "Gripper Arm Components — Material Qualification", receivedDate: "Jan 18, 2026", respondedDate: "Feb 1, 2026", status: "Pending", quotedValue: "$220K", process: "CNC Machining" },
    ],
    contacts: [
      { id: "ct-1101", name: "Anika Patel", role: "Mechanical Design Lead", department: "Engineering", email: "a.patel@clearpathrobotics.io", phone: "(512) 555-1178", lastInteraction: "3 days ago", influence: "Champion" },
      { id: "ct-1102", name: "Bryan Kowalczyk", role: "Procurement Specialist", department: "Procurement", email: "b.kowalczyk@clearpathrobotics.io", phone: "(512) 555-1191", lastInteraction: "1 week ago", influence: "Influencer" },
    ],
    activities: [
      { id: "act-1101", date: "Feb 13, 2026", type: "email", title: "Material Cert Samples Shipped", description: "Shipped 7075-T6 and 17-4PH material cert samples for gripper arm qualification.", contact: "Anika Patel" },
      { id: "act-1102", date: "Feb 1, 2026", type: "quote_sent", title: "Quote Submitted", description: "Submitted $220K quote for gripper arm component program.", contact: "Bryan Kowalczyk" },
      { id: "act-1103", date: "Jan 18, 2026", type: "po_received", title: "RFQ Received", description: "Received RFQ for gripper arm components — material qualification required.", contact: "Anika Patel" },
      { id: "act-1104", date: "Dec 15, 2025", type: "nda_signed", title: "NDA Executed", description: "Mutual NDA signed. Cleared to receive proprietary drawings.", contact: "Bryan Kowalczyk" },
    ],
    quality: {
      onTimeDeliveryPct: 0,
      rejectionRatePct: 0,
      ncrCount: 0,
      openCapas: 0,
      avgLeadTimeDays: 0,
      customerSatisfaction: 0,
      certifications: [],
    },
    insights: [
      { type: "trend", title: "Robotics Sector Entry", description: "First robotics customer. If gripper arm program succeeds, ClearPath's growing product line could become a recurring revenue stream." },
      { type: "cross-sell", title: "Assembly & Kitting Potential", description: "Robotic gripper assemblies typically need kitting. Offering sub-assembly could increase order value by 35%." },
    ],
  },

  "acc-12": {
    accountId: "acc-12",
    lifetimeValue: "$1.6M",
    orderCount: 10,
    avgOrderValue: "$160K",
    firstOrderDate: "Jul 2023",
    topProcesses: ["CNC Machining", "Welding/Fab", "Powder Coating"],
    reorderCycleDays: 90,
    orders: [
      {
        id: "ord-1201",
        poNumber: "PO-HE-2025-0667",
        orderDate: "Oct 8, 2025",
        deliveryDate: "Dec 20, 2025",
        status: "Delivered",
        totalValue: "$310K",
        items: [
          { partNumber: "HE-4400-A", description: "Wind Turbine Mounting Bracket — A36 Steel", qty: 600, unitPrice: "$380", process: "CNC Machining" },
          { partNumber: "HE-4400-B", description: "Bracket Weldment Assembly", qty: 600, unitPrice: "$136", process: "Welding/Fab" },
        ],
      },
      {
        id: "ord-1202",
        poNumber: "PO-HE-2025-0432",
        orderDate: "Jun 15, 2025",
        deliveryDate: "Aug 20, 2025",
        status: "Delivered",
        totalValue: "$185K",
        items: [
          { partNumber: "HE-3300-A", description: "Solar Tracker Pivot Arm", qty: 1000, unitPrice: "$145", process: "CNC Machining" },
          { partNumber: "HE-3300-B", description: "Pivot Arm — Powder Coat", qty: 1000, unitPrice: "$40", process: "Powder Coating" },
        ],
      },
    ],
    rfqs: [
      { id: "rfq-1201", rfqNumber: "RFQ-HE-2026-003", title: "Wind Turbine Bracket — Production Run", receivedDate: "Jan 5, 2026", respondedDate: "Jan 18, 2026", status: "Pending", quotedValue: "$960K", process: "CNC Machining" },
      { id: "rfq-1202", rfqNumber: "RFQ-HE-2025-059", title: "Solar Tracker Pivot — Annual", receivedDate: "Sep 1, 2025", respondedDate: "Sep 12, 2025", status: "Won", quotedValue: "$540K", process: "CNC Machining" },
      { id: "rfq-1203", rfqNumber: "RFQ-HE-2025-028", title: "Battery Storage Rack Fabrication", receivedDate: "Apr 15, 2025", respondedDate: "Apr 28, 2025", status: "Lost", quotedValue: "$320K", lostReason: "Lead Time", process: "Welding/Fab" },
    ],
    contacts: [
      { id: "ct-1201", name: "Mark Sullivan", role: "Director of Supply Chain", department: "Procurement", email: "m.sullivan@horizonenergy.com", phone: "(303) 555-1294", lastInteraction: "Yesterday", influence: "Decision Maker" },
      { id: "ct-1202", name: "Joanna Kim", role: "Structural Engineer", department: "Engineering", email: "j.kim@horizonenergy.com", phone: "(303) 555-1307", lastInteraction: "4 days ago", influence: "Champion" },
      { id: "ct-1203", name: "Pete O'Brien", role: "Quality Manager", department: "Quality", email: "p.obrien@horizonenergy.com", phone: "(303) 555-1320", lastInteraction: "2 weeks ago", influence: "Influencer" },
    ],
    activities: [
      { id: "act-1201", date: "Feb 14, 2026", type: "email", title: "Production Run Quote Follow-up", description: "Sent tooling amortization breakdown for wind turbine bracket production run.", contact: "Mark Sullivan" },
      { id: "act-1202", date: "Jan 18, 2026", type: "quote_sent", title: "Quote Submitted", description: "Submitted $960K quote for wind turbine bracket production program.", contact: "Mark Sullivan" },
      { id: "act-1203", date: "Jan 5, 2026", type: "po_received", title: "RFQ Received", description: "Received RFQ for wind turbine bracket production run — 3,000 units.", contact: "Joanna Kim" },
      { id: "act-1204", date: "Dec 20, 2025", type: "po_received", title: "PO-HE-2025-0667 Delivered", description: "600 turbine brackets + weldments delivered on schedule.", contact: "Pete O'Brien" },
      { id: "act-1205", date: "Nov 1, 2025", type: "site_visit", title: "Horizon Wind Farm Visit", description: "Visited installation site to understand end-use environment for bracket design.", contact: "Joanna Kim" },
    ],
    quality: {
      onTimeDeliveryPct: 93,
      rejectionRatePct: 1.1,
      ncrCount: 2,
      openCapas: 0,
      avgLeadTimeDays: 40,
      customerSatisfaction: 4,
      certifications: ["ISO 9001", "ISO 14001"],
    },
    insights: [
      { type: "upsell", title: "Wind Turbine Production Run — $960K", description: "Production run quote pending. 5x volume vs. last order. Win probability is high given existing relationship." },
      { type: "cross-sell", title: "Powder Coating for Brackets", description: "Current orders ship uncoated. Adding powder coating to bracket program could add $80K per production run." },
      { type: "reorder", title: "Solar Tracker Pivot Reorder Due", description: "Annual solar tracker pivot PO typically renews in Q1. Proactive outreach recommended." },
    ],
  },

  "acc-13": {
    accountId: "acc-13",
    lifetimeValue: "$420K",
    orderCount: 3,
    avgOrderValue: "$140K",
    firstOrderDate: "Jan 2024",
    topProcesses: ["CNC Machining", "Wire EDM"],
    reorderCycleDays: 0,
    orders: [
      {
        id: "ord-1301",
        poNumber: "PO-SM-2024-0245",
        orderDate: "Jun 10, 2024",
        deliveryDate: "Aug 25, 2024",
        status: "Delivered",
        totalValue: "$210K",
        items: [
          { partNumber: "SM-1100-A", description: "Silicon Wafer Chuck — Invar", qty: 20, unitPrice: "$8,500", process: "CNC Machining" },
          { partNumber: "SM-1100-B", description: "Chuck Pocket — Wire EDM", qty: 20, unitPrice: "$2,000", process: "Wire EDM" },
        ],
      },
      {
        id: "ord-1302",
        poNumber: "PO-SM-2024-0098",
        orderDate: "Jan 22, 2024",
        deliveryDate: "Mar 15, 2024",
        status: "Delivered",
        totalValue: "$145K",
        items: [
          { partNumber: "SM-0900-A", description: "Semiconductor Test Fixture — 6061-T6", qty: 50, unitPrice: "$2,900", process: "CNC Machining" },
        ],
      },
    ],
    rfqs: [
      { id: "rfq-1301", rfqNumber: "RFQ-SM-2026-002", title: "Semiconductor Fixture — Re-engagement", receivedDate: "Jan 22, 2026", respondedDate: "Feb 5, 2026", status: "Pending", quotedValue: "$350K", process: "CNC Machining" },
      { id: "rfq-1302", rfqNumber: "RFQ-SM-2024-067", title: "Wafer Handler Arm — Ceramic Composite", receivedDate: "Sep 5, 2024", respondedDate: "Sep 15, 2024", status: "Lost", quotedValue: "$280K", lostReason: "Capability", process: "CNC Machining" },
      { id: "rfq-1303", rfqNumber: "RFQ-SM-2024-034", title: "Wafer Chuck — Production Run", receivedDate: "May 1, 2024", respondedDate: "May 12, 2024", status: "Won", quotedValue: "$210K", process: "CNC Machining" },
    ],
    contacts: [
      { id: "ct-1301", name: "Jennifer Wu", role: "Director of Equipment Engineering", department: "Engineering", email: "j.wu@stellarmicro.com", phone: "(503) 555-1387", lastInteraction: "1 week ago", influence: "Decision Maker" },
      { id: "ct-1302", name: "David Chen", role: "Procurement Lead", department: "Procurement", email: "d.chen@stellarmicro.com", phone: "(503) 555-1394", lastInteraction: "2 weeks ago", influence: "Influencer" },
    ],
    activities: [
      { id: "act-1301", date: "Feb 5, 2026", type: "quote_sent", title: "Re-engagement Quote Submitted", description: "Submitted $350K quote for semiconductor fixture program — updated capabilities since 2024.", contact: "David Chen" },
      { id: "act-1302", date: "Jan 22, 2026", type: "po_received", title: "RFQ Received — Re-engagement", description: "Jennifer reached out with new RFQ after 14-month gap. New program starting.", contact: "Jennifer Wu" },
      { id: "act-1303", date: "Jan 15, 2026", type: "email", title: "Capability Update Sent", description: "Sent updated capability deck highlighting new Wire EDM capacity.", contact: "Jennifer Wu" },
      { id: "act-1304", date: "Sep 15, 2024", type: "quote_sent", title: "Ceramic Composite Quote — Lost", description: "Lost wafer handler arm RFQ to competitor with ceramic machining capability.", contact: "David Chen" },
    ],
    quality: {
      onTimeDeliveryPct: 92,
      rejectionRatePct: 1.8,
      ncrCount: 2,
      openCapas: 0,
      avgLeadTimeDays: 55,
      customerSatisfaction: 3,
      certifications: ["ISO 9001"],
    },
    insights: [
      { type: "risk", title: "14-Month Order Gap", description: "No orders since Aug 2024 after losing ceramic composite RFQ. Re-engagement RFQ is critical to win back." },
      { type: "upsell", title: "New Program — $350K Opportunity", description: "Jennifer Wu re-engaged with new fixture program. Updated Wire EDM capability may address previous shortfall." },
      { type: "cross-sell", title: "Add Wire EDM to Fixture Program", description: "Previous wafer chuck orders were CNC-only. New Wire EDM capacity could expand scope by 25%." },
    ],
  },

  "acc-14": {
    accountId: "acc-14",
    lifetimeValue: "$1.8M",
    orderCount: 14,
    avgOrderValue: "$129K",
    firstOrderDate: "Apr 2023",
    topProcesses: ["5-Axis CNC", "EDM", "Passivation"],
    reorderCycleDays: 120,
    orders: [
      {
        id: "ord-1401",
        poNumber: "PO-ID-2025-0556",
        orderDate: "Sep 18, 2025",
        deliveryDate: "Dec 1, 2025",
        status: "Delivered",
        totalValue: "$286K",
        items: [
          { partNumber: "ID-7700-A", description: "ITAR Controlled Housing — 15-5PH SS", qty: 100, unitPrice: "$2,100", process: "5-Axis CNC" },
          { partNumber: "ID-7700-B", description: "Housing Passivation — Citric Acid", qty: 100, unitPrice: "$760", process: "Passivation" },
        ],
      },
      {
        id: "ord-1402",
        poNumber: "PO-ID-2025-0312",
        orderDate: "May 5, 2025",
        deliveryDate: "Jul 18, 2025",
        status: "Delivered",
        totalValue: "$134K",
        items: [
          { partNumber: "ID-5500-A", description: "Precision Guide Rail — Hardened 4140", qty: 200, unitPrice: "$670", process: "CNC Machining" },
        ],
      },
    ],
    rfqs: [
      { id: "rfq-1401", rfqNumber: "RFQ-ID-2026-004", title: "ITAR Contract — Precision Components", receivedDate: "Jan 8, 2026", respondedDate: "Jan 25, 2026", status: "Pending", quotedValue: "$680K", process: "5-Axis CNC" },
      { id: "rfq-1402", rfqNumber: "RFQ-ID-2025-071", title: "ITAR Housing — Annual PO", receivedDate: "Aug 20, 2025", respondedDate: "Sep 5, 2025", status: "Won", quotedValue: "$520K", process: "5-Axis CNC" },
      { id: "rfq-1403", rfqNumber: "RFQ-ID-2025-029", title: "Optical Mount — Beryllium Copper", receivedDate: "Mar 15, 2025", respondedDate: "Mar 28, 2025", status: "Lost", quotedValue: "$95K", lostReason: "Lead Time", process: "5-Axis CNC" },
    ],
    contacts: [
      { id: "ct-1401", name: "Maj. Robert Torres", role: "Program Manager", department: "Engineering", email: "r.torres@ironcladdef.com", phone: "(571) 555-1456", lastInteraction: "2 days ago", influence: "Decision Maker" },
      { id: "ct-1402", name: "Denise Harmon", role: "Contracts Administrator", department: "Procurement", email: "d.harmon@ironcladdef.com", phone: "(571) 555-1469", lastInteraction: "5 days ago", influence: "Champion" },
      { id: "ct-1403", name: "Lt. Ray Nguyen", role: "Quality Assurance Officer", department: "Quality", email: "r.nguyen@ironcladdef.com", phone: "(571) 555-1482", lastInteraction: "2 weeks ago", influence: "Influencer" },
    ],
    activities: [
      { id: "act-1401", date: "Feb 13, 2026", type: "email", title: "ITAR Compliance Docs Submitted", description: "Submitted updated ITAR compliance documentation for FY26 contract.", contact: "Denise Harmon" },
      { id: "act-1402", date: "Feb 5, 2026", type: "call", title: "Contract Review Call", description: "Reviewed ITAR contract terms with Maj. Torres and contracts team.", contact: "Maj. Robert Torres" },
      { id: "act-1403", date: "Jan 25, 2026", type: "quote_sent", title: "ITAR Contract Quote Submitted", description: "Submitted $680K quote for precision ITAR-controlled components.", contact: "Denise Harmon" },
      { id: "act-1404", date: "Jan 8, 2026", type: "po_received", title: "RFQ Received", description: "Received RFQ for ITAR precision components program.", contact: "Maj. Robert Torres" },
      { id: "act-1405", date: "Dec 1, 2025", type: "po_received", title: "PO-ID-2025-0556 Delivered", description: "100 ITAR housings delivered. All units passed source inspection.", contact: "Lt. Ray Nguyen" },
    ],
    quality: {
      onTimeDeliveryPct: 96,
      rejectionRatePct: 0.5,
      ncrCount: 1,
      openCapas: 0,
      avgLeadTimeDays: 50,
      customerSatisfaction: 5,
      certifications: ["AS9100D", "ITAR", "NADCAP"],
    },
    insights: [
      { type: "upsell", title: "ITAR Contract Expansion — $680K", description: "FY26 ITAR contract under negotiation. Strong quality record and certs give competitive advantage." },
      { type: "cross-sell", title: "EDM Services Expansion", description: "Currently buys CNC + passivation. EDM capabilities for tight-tolerance features could add $120K/yr." },
      { type: "reorder", title: "Guide Rail Reorder Approaching", description: "Precision guide rail PO typically renews every 120 days. Next cycle due within 4 weeks." },
    ],
  },

  "acc-15": {
    accountId: "acc-15",
    lifetimeValue: "$0",
    orderCount: 0,
    avgOrderValue: "$0",
    firstOrderDate: "—",
    topProcesses: [],
    reorderCycleDays: 0,
    orders: [],
    rfqs: [
      { id: "rfq-1501", rfqNumber: "RFQ-CF-2026-001", title: "Hydraulic Valve Body — Sample Run", receivedDate: "Jan 28, 2026", respondedDate: null, status: "Pending", quotedValue: "$175K", process: "CNC Machining" },
    ],
    contacts: [
      { id: "ct-1501", name: "Ray Mendez", role: "Chief Engineer", department: "Engineering", email: "r.mendez@cascadefluid.com", phone: "(216) 555-1543", lastInteraction: "6 days ago", influence: "Decision Maker" },
      { id: "ct-1502", name: "Holly Jensen", role: "Buyer", department: "Procurement", email: "h.jensen@cascadefluid.com", phone: "(216) 555-1556", lastInteraction: "1 week ago", influence: "Influencer" },
    ],
    activities: [
      { id: "act-1501", date: "Feb 10, 2026", type: "email", title: "Sample Request Follow-up", description: "Sent follow-up on hydraulic valve body sample request with preliminary timeline.", contact: "Ray Mendez" },
      { id: "act-1502", date: "Jan 28, 2026", type: "po_received", title: "RFQ Received", description: "Received RFQ for hydraulic valve body sample run — 50 units.", contact: "Ray Mendez" },
      { id: "act-1503", date: "Jan 20, 2026", type: "call", title: "Introduction Call", description: "Initial call with Ray to discuss CNC capabilities for hydraulic components.", contact: "Ray Mendez" },
    ],
    quality: {
      onTimeDeliveryPct: 0,
      rejectionRatePct: 0,
      ncrCount: 0,
      openCapas: 0,
      avgLeadTimeDays: 0,
      customerSatisfaction: 0,
      certifications: [],
    },
    insights: [
      { type: "trend", title: "New Account — Hydraulics Sector", description: "First hydraulics customer. If sample run succeeds, Cascade's $120M revenue base could become a significant recurring account." },
      { type: "cross-sell", title: "Honing & Assembly Opportunity", description: "Hydraulic valve bodies typically need honing and assembly. Offering full service could increase initial order by 40%." },
    ],
  },
};

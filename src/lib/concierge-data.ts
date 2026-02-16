// ─── Concierge RFQ Data & Types ─────────────────────────────────────────────

export interface RFQAttachment {
  name: string;
  type: "questions" | "specs" | "drawing";
  content: string;
}

export interface RFQ {
  id: string;
  title: string;
  description: string;
  accountName: string;
  contactName: string;
  contactEmail: string;
  dealTitle: string;
  dealValue: string;
  status: "new" | "in-progress" | "quoted";
  receivedAt: string;
  attachments: RFQAttachment[];
}

export interface ConciergeMessage {
  id: string;
  role: "rfq" | "agent" | "user";
  content: string;
  timestamp: string;
  isLoading?: boolean;
}

// ─── Mock RFQs ──────────────────────────────────────────────────────────────

export const mockRFQs: RFQ[] = [
  {
    id: "rfq-1",
    title: "Electric Power Steering Column Brackets",
    description:
      "Tesla is requesting a quote for 10,000 units of electric power steering column brackets machined from Ti-6Al-4V (Grade 5 titanium). These brackets mount the EPS motor assembly to the steering column housing in the Model Y refresh program. Parts require 5-axis CNC machining with tight tolerances on the mounting bore and locating features. Tesla expects IATF 16949 compliance and full PPAP Level 3 documentation.",
    accountName: "Tesla Motors",
    contactName: "Sarah Chen",
    contactEmail: "s.chen@tesla.com",
    dealTitle: "Tesla EPS Bracket Program — Model Y",
    dealValue: "$1.2M",
    status: "new",
    receivedAt: "2 hours ago",
    attachments: [
      {
        name: "Technical_Requirements.pdf",
        type: "questions",
        content: `1. Can you hold ±0.0005" true position on the 4x mounting bores (Ø12mm)?
2. What is your experience with Ti-6Al-4V aerospace-grade titanium machining?
3. Are you IATF 16949:2016 certified? Please provide certificate number.
4. What is your projected lead time for first articles (50 units)?
5. Can you support a production rate of 2,500 units/month starting Q3 2026?
6. What NDT methods do you use for titanium parts (FPI, X-ray)?
7. Do you have Nadcap accreditation for heat treatment of titanium?`,
      },
      {
        name: "EPS_Bracket_Drawing_RevB.pdf",
        type: "drawing",
        content:
          "Drawing reference: TSL-EPS-BRK-2026-001 Rev B. Material: Ti-6Al-4V per AMS 4928. Overall dimensions: 145mm x 68mm x 32mm. Critical features: 4x Ø12mm mounting bores with ±0.0005\" true position, M8 threaded inserts (6x), surface finish Ra 0.8μm on mating surfaces.",
      },
    ],
  },
  {
    id: "rfq-2",
    title: "Steering Knuckle Forgings — R1T Platform",
    description:
      "Rivian requires a quotation for 5,000 steering knuckle forgings in 4140 alloy steel for their R1T truck platform. The knuckles are a safety-critical suspension component connecting the wheel hub to the control arms. Parts require closed-die forging followed by CNC finish machining, heat treatment (quench & temper to 28-32 HRC), and 100% magnetic particle inspection.",
    accountName: "Rivian Automotive",
    contactName: "James Park",
    contactEmail: "j.park@rivian.com",
    dealTitle: "Rivian R1T Steering Knuckle Supply",
    dealValue: "$890K",
    status: "new",
    receivedAt: "5 hours ago",
    attachments: [
      {
        name: "Supplier_Questionnaire.pdf",
        type: "questions",
        content: `1. Do you have closed-die forging capability for parts up to 8kg net weight?
2. What is your heat treatment capacity (batch furnace size and throughput)?
3. Can you achieve 28-32 HRC consistently across the full cross-section?
4. What surface finish can you guarantee on the machined bearing surfaces?
5. Do you perform 100% MPI (magnetic particle inspection) in-house?
6. What is your prototype timeline for 10 sample units?
7. Can you provide a Kanban-based delivery schedule (weekly releases)?
8. Are you willing to hold 2 weeks of safety stock at your facility?`,
      },
      {
        name: "Knuckle_Forging_Spec.pdf",
        type: "specs",
        content:
          "Part: RVN-SK-4140-R1T. Material: AISI 4140 per ASTM A29. Forging weight: 6.2kg (finished: 4.8kg). Key dimensions: ball joint bore Ø48mm +0/-0.025mm, wheel bearing bore Ø72mm ±0.015mm, caliper mounting face flatness 0.05mm. Heat treat: Q&T to 28-32 HRC. Surface: Ra 1.6μm on bearing bores, Ra 3.2μm general.",
      },
    ],
  },
  {
    id: "rfq-3",
    title: "Steering Rack Housing — Lucid Air",
    description:
      "Lucid Motors is sourcing a precision CNC-machined steering rack housing in aluminum 6061-T6 for the Lucid Air luxury EV. Quantity: 8,000 units annually. The housing is a long, complex part (580mm) requiring deep-bore machining, tight bore concentricity, and Type III hard anodizing. Lucid requires full PPAP Level 3 and ongoing SPC reporting on critical dimensions.",
    accountName: "Lucid Motors",
    contactName: "Maria Gonzalez",
    contactEmail: "m.gonzalez@lucidmotors.com",
    dealTitle: "Lucid Air Steering Rack Housing",
    dealValue: "$1.8M",
    status: "in-progress",
    receivedAt: "1 day ago",
    attachments: [
      {
        name: "RFQ_Questions.pdf",
        type: "questions",
        content: `1. What is the maximum part length your CNC horizontal machining centers can handle?
2. Can you hold ±0.01mm bore concentricity over a 520mm span?
3. Do you perform Type III hard anodizing (MIL-A-8625 Type III) in-house or outsourced?
4. What is your annual CNC machining capacity (spindle hours available)?
5. Can you provide PPAP Level 3 documentation within 8 weeks of PO?
6. Do you have experience with automotive-grade aluminum housings?
7. What SPC software do you use for ongoing dimensional reporting?`,
      },
    ],
  },
  {
    id: "rfq-4",
    title: "Steering Sensor Mounting Plate — 3 Series",
    description:
      "BMW Group is requesting a quote for 15,000 units/year of a precision stainless steel (303 SS) steering torque sensor mounting plate. The part requires ultra-tight flatness (0.02mm over 80mm), sub-micron surface finish on the sensor interface, and cleanroom-grade packaging to prevent contamination. BMW requires IMDS (International Material Data System) compliance and VDA 6.3 process audit readiness.",
    accountName: "BMW Group",
    contactName: "Klaus Richter",
    contactEmail: "k.richter@bmw.de",
    dealTitle: "BMW 3-Series Torque Sensor Plate",
    dealValue: "$2.1M",
    status: "in-progress",
    receivedAt: "2 days ago",
    attachments: [
      {
        name: "BMW_Supplier_Requirements.pdf",
        type: "questions",
        content: `1. Can you achieve 0.02mm flatness over the 80mm sensor mounting face?
2. What surface finish capability do you have? We require Ra ≤ 0.2μm on the sensor interface.
3. Do you have cleanroom or controlled-environment packaging capability (ISO Class 7 or better)?
4. Are you registered in IMDS (International Material Data System)?
5. Are you prepared for a VDA 6.3 process audit within 90 days of award?
6. What is your capacity for 303 SS Swiss-type or CNC turning?
7. Can you support JIT delivery to our Spartanburg, SC plant with 3-day lead time from release?`,
      },
      {
        name: "Sensor_Plate_Drawing.pdf",
        type: "drawing",
        content:
          "Part: BMW-STP-303-2026. Material: AISI 303 per ASTM A582. Dimensions: Ø82mm x 8.5mm. Critical features: sensor face flatness 0.02mm, 6x Ø4.5mm mounting holes at ±0.025mm true position, center bore Ø22mm H7, Ra ≤ 0.2μm on sensor face. Edge break 0.1-0.3mm all edges.",
      },
    ],
  },
  {
    id: "rfq-5",
    title: "Universal Joint Yoke — Driveline Program",
    description:
      "Magna International is requesting pricing for 20,000 units/year of a universal joint yoke machined from 8620 alloy steel. The yoke is part of a steering intermediate shaft assembly for multiple OEM platforms. Parts require CNC machining from forgings, case carburizing to 58-62 HRC (0.8-1.2mm case depth), and 100% dimensional inspection on critical spline features. Magna needs volume pricing at 3 tier levels and Kanban delivery capability.",
    accountName: "Magna International",
    contactName: "Robert Nowak",
    contactEmail: "r.nowak@magna.com",
    dealTitle: "Magna Driveline U-Joint Yoke Supply",
    dealValue: "$950K",
    status: "new",
    receivedAt: "3 hours ago",
    attachments: [
      {
        name: "Magna_RFQ_Questionnaire.pdf",
        type: "questions",
        content: `1. Do you have experience machining 8620 alloy steel forgings for automotive driveline components?
2. Can you perform case carburizing in-house to achieve 58-62 HRC with 0.8-1.2mm case depth?
3. What is your spline cutting capability (gear hobbing or broaching)?
4. Can you provide volume pricing at 3 tiers: 10K, 20K, and 30K units/year?
5. Do you support Kanban-based delivery with EDI (830/862) integration?
6. What is your PPM target and current quality performance?
7. Are you open to a consignment inventory model at our Graz, Austria facility?
8. What is the estimated tooling cost and amortization schedule?`,
      },
      {
        name: "UJ_Yoke_Specification.pdf",
        type: "specs",
        content:
          "Part: MGN-UJY-8620-V2. Material: AISI 8620 per ASTM A29, forging supplied by Magna. Finished weight: 0.42kg. Key features: 26-tooth involute spline (Module 1.25, DIN 5480), cross-bore Ø22mm ±0.01mm, yoke ears parallelism 0.03mm. Case carburize: 58-62 HRC, case depth 0.8-1.2mm. Surface: Ra 0.8μm on spline, Ra 1.6μm general.",
      },
    ],
  },
];

// ─── System Prompt for OpenAI ───────────────────────────────────────────────

export const CONCIERGE_SYSTEM_PROMPT = `You are an AI sales engineering assistant at **Precision Steering Components (PSC)**, a Tier 1 automotive supplier specializing in precision-machined steering and driveline components.

## Your Company Profile
- **Name**: Precision Steering Components (PSC)
- **Specialties**: 5-axis CNC machining, closed-die forging, Swiss turning, CNC turning/milling
- **Materials**: Titanium (Ti-6Al-4V), aluminum (6061-T6, 7075), alloy steels (4140, 4340, 8620), stainless steels (303, 304, 17-4PH)
- **Certifications**: IATF 16949:2016, AS9100D, ISO 14001, Nadcap (Heat Treat & NDT), ITAR registered
- **Capacity**: 18 CNC machining centers (incl. 6x 5-axis), 2 forging presses (up to 10kg), 4 Swiss-type lathes
- **Quality**: Current PPM rate: 85 PPM, Cpk > 1.67 on all CTQ characteristics
- **Lead Times**: First articles: 3-5 weeks. Production: 6-10 weeks depending on complexity.
- **Location**: Milwaukee, WI, USA with regional warehouse in Greenville, SC

## Your Inventory & Material Stock
- Ti-6Al-4V bar stock: 12,000 lbs (AMS 4928, multiple diameters)
- 6061-T6 aluminum plate: 8,000 lbs (various thicknesses up to 4")
- 4140 steel bar: 15,000 lbs (hot-rolled, annealed)
- 8620 steel bar: 6,000 lbs
- 303 SS bar: 4,500 lbs (free-machining grade)
- All materials domestically sourced with full traceability

## Your Role
You are helping the internal sales engineering team process incoming RFQs (Requests for Quote). When a new RFQ arrives:

1. **Analyze the RFQ** against PSC's capabilities, certifications, and inventory
2. **Identify strengths**: What we can do well and where we have a competitive advantage
3. **Identify gaps or risks**: Anything we can't do in-house, capacity concerns, or certification gaps
4. **Ask clarifying questions**: Generate 3-5 focused questions that our sales engineer should investigate or clarify with the customer before we can finalize a quote
5. **When the sales engineer provides answers**, incorporate them and either:
   - Ask follow-up questions if critical info is still missing, OR
   - Generate a **preliminary quote** with estimated pricing, lead times, tooling costs, and terms

## Quote Format (when ready)
When generating a quote, structure it as:
- **Unit pricing** (with quantity breaks if applicable)
- **Tooling/fixturing costs** (one-time, NRE)
- **Lead times** (first article + production)
- **Certifications included**
- **Assumptions & exclusions**
- **Recommended next steps**

## Communication Style
- Be concise, professional, and manufacturing-savvy
- Use specific technical terminology appropriate for the industry
- Reference PSC's actual capabilities and inventory when making assessments
- Flag risks clearly but constructively
- When asking questions, explain WHY each question matters for the quote`;

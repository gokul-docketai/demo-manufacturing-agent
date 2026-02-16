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
      `Hi Derek,

We're kicking off supplier sourcing for the Model Y refresh EPS bracket program and would like to include Precision Steering Components in our bid process.

We need 10,000 electric power steering column brackets machined from Ti-6Al-4V (Grade 5 titanium). These mount the EPS motor assembly to the steering column housing — tight tolerances on the mounting bore and locating features are critical. We'll need 5-axis CNC machining capability for this geometry.

I've attached the part drawing (Rev B) and our technical requirements document with specific questions we need answered. We require IATF 16949 compliance and full PPAP Level 3 documentation from all bidders.

Please review and let us know your lead time for first articles and production pricing at 10K units. We'd like quotes back by end of next week if possible.

Thanks,
Sarah Chen
Senior Procurement Engineer, Tesla Motors`,
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
      `Hello team,

Rivian is expanding our domestic supplier base for the R1T truck platform and we're looking for a qualified forging partner for steering knuckles.

We need 5,000 units in 4140 alloy steel — these are safety-critical suspension components connecting the wheel hub to the control arms. The process involves closed-die forging, CNC finish machining, heat treatment (quench & temper to 28-32 HRC), and 100% magnetic particle inspection. No shortcuts on the MPI — this is a safety part.

I've attached our supplier questionnaire and the forging specification document. Please fill out the questionnaire as completely as possible — our engineering team uses it for the formal supplier evaluation.

We're targeting a prototype run of 10 sample units first, then ramping to production. Let me know if this is something PSC can support.

Best,
James Park
Supply Chain Manager, Rivian Automotive`,
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
      `Hi Derek,

We spoke briefly at IMTS last year about your aluminum machining capabilities — I'm following up because we have an active sourcing need.

Lucid Motors needs a supplier for our steering rack housing on the Lucid Air platform. It's 6061-T6 aluminum, 8,000 units annually. Fair warning — it's a long part (580mm) with deep-bore machining and tight bore concentricity requirements. We also need Type III hard anodizing per MIL-A-8625.

I've attached our RFQ questions document. We require full PPAP Level 3 and ongoing SPC reporting on critical dimensions — our quality team is pretty rigorous on this.

If your capacity and capability line up, I'd love to schedule a call to walk through the drawing in detail. Let me know your availability.

Regards,
Maria Gonzalez
Director of Powertrain Procurement, Lucid Motors`,
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
      `Dear Mr. Morrison,

BMW Group is inviting Precision Steering Components to participate in a formal RFQ for the 3-Series torque sensor mounting plate program.

We require 15,000 units per year of a precision 303 stainless steel mounting plate. This is a high-precision application — the sensor interface requires 0.02mm flatness over 80mm and sub-micron surface finish (Ra ≤ 0.2μm). Cleanroom-grade packaging is mandatory to prevent particle contamination of the sensor assembly.

Attached you will find our supplier requirements document and the part drawing. Please note that IMDS registration is required for all BMW production suppliers, and we will conduct a VDA 6.3 process audit within 90 days of any award.

We would appreciate your response within 10 business days. Please direct any technical questions to my attention.

Mit freundlichen Grüßen,
Klaus Richter
Senior Buyer — Chassis & Steering, BMW Group`,
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
      `Hi there,

We're reaching out on behalf of Magna's Driveline division. We have a high-volume opportunity for a universal joint yoke that we're sourcing across multiple OEM platforms.

Volume is 20,000 units/year in 8620 alloy steel — we supply the forgings, you machine them. Key processes include CNC machining of the spline and cross-bore features, case carburizing to 58-62 HRC with 0.8-1.2mm case depth, and 100% dimensional inspection on the spline.

We need volume pricing at three tier levels (10K, 20K, 30K) and the ability to support Kanban-based delivery with EDI integration. I've attached our RFQ questionnaire and the part specification — please review and let us know if this fits your wheelhouse.

One note: we'd prefer a supplier willing to discuss consignment inventory at our Graz facility. Not a dealbreaker, but it's a plus.

Cheers,
Robert Nowak
Commodity Manager — Driveline, Magna International`,
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

export const CONCIERGE_SYSTEM_PROMPT = `You are an AI sales engineering assistant at **Precision Steering Components (PSC)**, helping our internal sales reps process RFQs faster and win more deals.

## Company Profile
- **Name**: Precision Steering Components (PSC)
- **Capabilities**: 5-axis CNC machining, closed-die forging, Swiss turning, CNC turning/milling
- **Materials**: Ti-6Al-4V, Al 6061-T6/7075, steels (4140, 4340, 8620), SS (303, 304, 17-4PH)
- **Certs**: IATF 16949, AS9100D, ISO 14001, Nadcap (Heat Treat & NDT), ITAR
- **Capacity**: 18 CNC centers (6x 5-axis), 2 forging presses (≤10kg), 4 Swiss lathes
- **Quality**: 85 PPM, Cpk > 1.67 on all CTQs
- **Lead Times**: First articles 3-5 wks, production 6-10 wks
- **Location**: Milwaukee, WI + warehouse in Greenville, SC

## Inventory
- Ti-6Al-4V: 12,000 lbs (AMS 4928) | 6061-T6 Al: 8,000 lbs | 4140 steel: 15,000 lbs
- 8620 steel: 6,000 lbs | 303 SS: 4,500 lbs | All US-sourced, full traceability

## Your Behavior
You are the sales rep's assistant. Your job is to:
1. Quickly analyze RFQs and surface what matters
2. Draft ready-to-send email replies to the customer
3. Provide actionable insights the rep can use immediately

## Response Format
ALL responses must be in **markdown**. Keep them concise — reps are busy.

### When analyzing a new RFQ, structure your response as:

**Section 1 — Quick Assessment** (3-4 bullet points max)
A brief capability match: what we can do, key risks, and our competitive edge.

**Section 2 — Actionable Insights** (2-3 bullet points)
Specific things the rep should know or leverage — e.g., competitor intel, customer pain points, timing advantages, inventory readiness.

**Section 3 — Draft Email Reply**
Write a professional email reply to the customer's contact. The email should:
- Acknowledge the RFQ
- Address what we can confirm immediately
- Ask 3-5 clarifying questions (with brief reasoning for each)
- Be warm but professional

**CRITICAL**: You MUST wrap the email draft in these exact delimiters:
\`\`\`
<!-- EMAIL_DRAFT -->
**To:** [contact email]
**Subject:** [appropriate subject line]

[email body here]
<!-- /EMAIL_DRAFT -->
\`\`\`

### When the rep provides answers/context:
- If you have enough info: generate a **quote email draft** (also wrapped in EMAIL_DRAFT delimiters) with pricing, lead times, tooling, and terms
- If not: ask focused follow-ups and explain why each matters
- Always include 1-2 actionable insights

### When generating a quote email, include:
- Unit pricing (with quantity breaks if applicable)
- Tooling/NRE costs
- Lead times (FA + production)
- Certs included
- Key assumptions
- Clear next steps / call-to-action

## Style Rules
- Markdown formatting always (headers, bold, bullets, tables where useful)
- Be concise — no fluff, no filler paragraphs
- Sound like a knowledgeable manufacturing insider, not a chatbot
- Actionable insights should feel like insider tips from a veteran sales engineer`;

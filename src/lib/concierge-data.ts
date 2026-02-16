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
7. Do you have Nadcap accreditation for heat treatment of titanium?
8. What coolant strategy do you use for Ti-6Al-4V (flood, through-spindle, MQL)?
9. Provide Cpk data from a recent titanium job with similar bore tolerances.
10. What is your scrap rate on titanium 5-axis work (last 12 months)?`,
      },
      {
        name: "EPS_Bracket_Drawing_RevB.pdf",
        type: "drawing",
        content: `TITLE BLOCK
Drawing No: TSL-EPS-BRK-2026-001  |  Rev: B  |  Sheet: 1 of 2
Title: EPS Motor Mounting Bracket — Model Y
Drawn by: J. Liu  |  Checked: S. Chen  |  Approved: M. Torres
Date: 2026-01-15  |  Scale: 2:1  |  Units: mm
Classification: Tesla Proprietary — ITAR N/A

MATERIAL SPECIFICATION
Material: Ti-6Al-4V (Grade 5 Titanium)
Spec: AMS 4928 (bar) or AMS 4911 (sheet/plate)
Condition: Annealed, mill cert required per EN 10204 3.1
Hardness: 30-36 HRC (post-machining verification required)
Grain flow: Longitudinal, parallel to mounting bore axis

OVERALL DIMENSIONS
Envelope: 145.00mm x 68.00mm x 32.00mm
Net weight: 0.285 kg ± 0.010 kg
Bounding stock: 155mm x 75mm x 38mm (min blank)

CRITICAL FEATURES & GD&T
1. 4x Ø12.000mm +0.005/-0.000 Mounting Bores
   - True Position: Ø0.013mm (±0.0005") at MMC, Datum A|B|C
   - Cylindricity: 0.005mm
   - Surface finish: Ra 0.4μm (bore interior)
   - Depth: 28.00mm ± 0.05mm (through)
   - Bolt circle: Ø52.00mm ± 0.01mm

2. 6x M8 x 1.25 Threaded Inserts (Helicoil)
   - Tap drill: Ø8.917mm, depth 18mm min
   - Thread class: 6H
   - Insert: MS124821 cadmium-free per Tesla TS-0042
   - Installation torque: 4.5 Nm ± 0.5 Nm
   - Pull-out strength: ≥ 22 kN per insert

3. EPS Motor Locating Bore
   - Ø38.000mm H7 (+0.025/+0.000)
   - Concentricity to Datum A: Ø0.010mm
   - Surface finish: Ra 0.4μm
   - Perpendicularity to Datum B: 0.008mm

4. Datum Surfaces
   - Datum A: Bottom mounting face — Flatness 0.015mm over full 145mm span
   - Datum B: Left reference edge — Perpendicularity to A within 0.010mm
   - Datum C: Front locating face — Parallelism to rear within 0.012mm

SURFACE FINISH REQUIREMENTS
| Zone | Finish | Method |
|------|--------|--------|
| Mating faces (Datum A, C) | Ra 0.8μm | Mill / grind |
| Bore interiors (mounting & locating) | Ra 0.4μm | Ream / hone |
| Threaded insert pockets | Ra 3.2μm | Tap drill |
| Non-functional surfaces | Ra 6.3μm | As-machined |
| All edges & corners | 0.2mm-0.5mm break | Deburr / tumble |

NOTES
1. All dimensions per ASME Y14.5-2018.
2. Remove all burrs, sharp edges per Tesla TS-0061 Rev C.
3. Part marking: Laser etch P/N, Rev, date code, lot # on non-datum surface (zone D4). Character height 1.5mm min. Depth ≤ 0.05mm.
4. Passivation per AMS 2700 Method 1 (citric acid) after final machining.
5. No EDM, grinding burn, or re-cast layer permitted on critical surfaces.
6. FPI (fluorescent penetrant inspection) per ASTM E1417, accept/reject per ASTM E433 Level 2 on all machined surfaces.

REVISION HISTORY
| Rev | Date | ECN | Description |
|-----|------|-----|-------------|
| A | 2025-11-02 | ECN-44821 | Initial release for prototype |
| B | 2026-01-15 | ECN-45103 | Updated bore TP from ±0.001" to ±0.0005", added Helicoil inserts, revised Datum scheme |`,
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
        content: `PART IDENTIFICATION
Part Number: RVN-SK-4140-R1T  |  Rev: 3
Description: Front Steering Knuckle — R1T Platform
Application: Safety-critical suspension component (FMVSS 126)
PPAP Level: 3 required  |  Control Plan: Yes

MATERIAL REQUIREMENTS
Base material: AISI 4140 per ASTM A29/A29M
Chemistry (wt%): C 0.38-0.43 | Mn 0.75-1.00 | Cr 0.80-1.10 | Mo 0.15-0.25
Forging billet source: Domestic US mill only (DFARS compliant)
Mill cert: EN 10204 Type 3.1 — full chemistry + mechanical props
Inclusion rating: ASTM E45 Method A, max D-type thin 1.5

FORGING SPECIFICATION
Process: Closed-die forging, single heat
Forging temperature: 1150-1230°C
Forging weight (gross): 6.2 kg ± 0.15 kg
Finished weight (machined): 4.8 kg ± 0.08 kg
Draft angle: 5° max on all die surfaces
Flash allowance: ≤ 2.0mm trimmed flush
Grain flow: Must follow contour of knuckle arms — macro etch required per ASTM E381

CRITICAL DIMENSIONS
| Feature | Dimension | Tolerance | GD&T |
|---------|-----------|-----------|------|
| Ball joint bore | Ø48.000mm | +0.000/-0.025mm | Cylindricity 0.008mm |
| Wheel bearing bore | Ø72.000mm | ±0.015mm | True position Ø0.020mm to A|B |
| Caliper mtg face | 62.5mm x 45.0mm | ±0.10mm | Flatness 0.05mm |
| Strut mount bolt holes | 2x Ø14.00mm | ±0.025mm | True position Ø0.05mm |
| Control arm pivot bore | Ø22.000mm | H7 (+0.021/+0.000) | Perpendicularity 0.015mm to A |
| Overall height | 285.0mm | ±0.50mm | — |

HEAT TREATMENT
Process: Quench & Temper (Q&T)
Austenitize: 845°C ± 10°C, hold 60 min minimum
Quench: Oil quench, agitation required
Temper: 480-540°C, air cool
Target hardness: 28-32 HRC (100% verification)
Hardness traverse: Max 3 HRC variation across cross-section
Decarburization: ≤ 0.15mm per side (ASTM E1077)

NDT & INSPECTION
1. 100% Magnetic Particle Inspection (MPI) per ASTM E1444
   - Method: Wet fluorescent, AC or HWDC
   - Accept/Reject: ASTM E125 Degree 3 max
   - Frequency: Every part — no sampling
2. Hardness: 100% Rockwell C, 3 locations per part
3. Dimensional: CMM per PPAP, then AQL 1.0 for production
4. Grain flow: 1 per lot, macro etch per ASTM E381

SURFACE FINISH
| Zone | Finish | Notes |
|------|--------|-------|
| Bearing bores | Ra 1.6μm | Honed |
| Caliper mounting face | Ra 1.6μm | Ground or precision milled |
| Ball joint taper | Ra 0.8μm | Ground |
| As-forged surfaces | Ra 6.3μm | Shot-blasted |
| General machined | Ra 3.2μm | Standard |`,
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
7. What SPC software do you use for ongoing dimensional reporting?
8. What is your deep-bore machining strategy (gun drill vs. BTA vs. boring bar)?
9. Can you maintain chip evacuation on 520mm+ bore depth in 6061-T6?
10. What fixturing approach will you use for a 580mm long thin-wall housing?`,
      },
      {
        name: "Rack_Housing_Drawing_RevA.pdf",
        type: "drawing",
        content: `TITLE BLOCK
Drawing No: LMC-SRH-6061-2026-001  |  Rev: A  |  Sheet: 1 of 3
Title: Steering Rack Housing Assembly — Lucid Air
Drawn by: R. Patel  |  Checked: M. Gonzalez  |  Approved: D. Kim
Date: 2025-12-10  |  Scale: 1:2  |  Units: mm

MATERIAL SPECIFICATION
Material: Aluminum 6061-T6 per AMS-QQ-A-225/8 or ASTM B221
Condition: T6 temper, solution heat treated & artificially aged
UTS: ≥ 290 MPa  |  Yield: ≥ 241 MPa  |  Elongation: ≥ 10%
Conductivity: 40-50% IACS (temper verification)

OVERALL DIMENSIONS
Length: 580.00mm  |  OD: Ø68.00mm  |  Wall thickness: 4.5mm min
Net weight: 1.82 kg ± 0.05 kg
Bounding stock: Ø76mm x 600mm extruded tube or solid bar

CRITICAL FEATURES & GD&T
1. Main Rack Bore
   - Ø58.000mm H7 (+0.030/+0.000), length 520mm
   - Concentricity: Ø0.010mm over full 520mm span
   - Cylindricity: 0.015mm
   - Surface finish: Ra 0.4μm (honed)
   - Straightness: 0.020mm over full length

2. Tie Rod Seal Bores (2x, each end)
   - Ø42.000mm H8 (+0.039/+0.000), depth 22mm
   - Concentricity to main bore: Ø0.015mm
   - Surface finish: Ra 0.8μm

3. Pinion Input Bore
   - Ø32.000mm H7 (+0.025/+0.000)
   - Perpendicularity to main bore axis: 0.010mm
   - Angular position: 23.5° ± 0.25° from vertical datum

4. Mounting Lug Features
   - 4x Ø12.00mm ±0.025mm through holes
   - True position: Ø0.05mm at MMC, Datum A|B|C

SURFACE TREATMENT
Coating: Type III Hard Anodize per MIL-A-8625
Thickness: 50-65μm (0.050-0.065mm)
Color: Black dye per customer spec LMC-CS-009
Masking: Seal bores and pinion bore must be masked prior to anodize
Post-anodize seal: Hot DI water seal, 96-100°C, 20 min

NOTES
1. All dimensions per ASME Y14.5-2018.
2. Deburr all edges 0.2-0.5mm per Lucid spec LMC-QS-003.
3. Cleanliness: Residual particle count ≤ 500μm max size, ≤ 6mg/part (VDA 19).
4. 100% leak test at 3.0 bar, 30 sec hold, zero bubble acceptance.
5. Part marking: Laser etch on mounting lug flat, 2D data matrix per AIAG B-17.`,
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
        content: `TITLE BLOCK
Drawing No: BMW-STP-303-2026-001  |  Rev: C  |  Sheet: 1 of 1
Title: Torque Sensor Mounting Plate — 3 Series (G20/G28)
Drawn by: F. Weber  |  Checked: K. Richter  |  Approved: H. Braun
Date: 2025-11-28  |  Scale: 5:1  |  Units: mm
Standard: ISO 2768-mK (general tolerances)

MATERIAL SPECIFICATION
Material: AISI 303 (X8CrNiS18-9) per ASTM A582 / EN 10088-3
Condition: Cold-drawn, bright bar
UTS: ≥ 500 MPa  |  Yield: ≥ 190 MPa  |  Elongation: ≥ 35%
Magnetic permeability: μr ≤ 1.05 (non-magnetic verification required)
Bar stock: Ø85mm bright drawn, centerless ground

OVERALL DIMENSIONS
Outer diameter: Ø82.00mm ± 0.02mm
Thickness: 8.50mm ± 0.03mm
Net weight: 0.340 kg ± 0.005 kg

CRITICAL FEATURES & GD&T
1. Sensor Interface Face (Top)
   - Flatness: 0.020mm over full Ø80mm zone
   - Surface finish: Ra ≤ 0.2μm (lapped or superfinished)
   - Parallelism to Datum A (bottom): 0.010mm
   - No tool marks visible at 10x magnification

2. 6x Ø4.500mm Mounting Holes
   - Tolerance: ±0.012mm
   - True position: Ø0.025mm at MMC, Datum A|B|C
   - Bolt circle: Ø68.00mm ± 0.01mm
   - Angular spacing: 60.00° ± 0.05°
   - Countersink: 90° x Ø7.0mm ± 0.1mm, both sides

3. Center Bore
   - Ø22.000mm H7 (+0.021/+0.000)
   - Cylindricity: 0.005mm
   - Perpendicularity to Datum A: 0.008mm
   - Surface finish: Ra ≤ 0.4μm

4. Datum Definitions
   - Datum A: Bottom face (primary seating surface)
   - Datum B: Center bore axis
   - Datum C: Alignment notch (angular orientation)

SURFACE FINISH TABLE
| Zone | Finish | Method |
|------|--------|--------|
| Sensor face (top) | Ra ≤ 0.2μm | Lapping / superfinish |
| Bottom seating face | Ra 0.4μm | Precision face turning |
| Center bore | Ra 0.4μm | Reaming + honing |
| Mounting holes | Ra 1.6μm | Drilling + reaming |
| OD periphery | Ra 0.8μm | Turning |

CLEANLINESS & PACKAGING
1. Ultrasonic clean per BMW WS-0005, Level A (particle sensitive)
2. Max particle size: 200μm  |  Max particle count: ≤ 50 per part
3. Cleanroom packaging: ISO Class 7 environment minimum
4. Individual ESD-safe trays, sealed bags with desiccant
5. Shelf life: 12 months from packaging date

NOTES
1. All dimensions per ISO 1101:2017 and BMW GS 95003-3.
2. No burrs permitted — edge break 0.1-0.3mm all edges, tumble deburr.
3. Passivation per ASTM A967, Citric Acid Method.
4. IMDS entry required (MDS ID to be assigned by BMW).
5. Part marking: Laser etch on OD periphery only — no marks on functional faces. Data Matrix per BMW GS 95048.
6. SPC: Cpk ≥ 1.67 on all CTQ dimensions, monthly reports.

REVISION HISTORY
| Rev | Date | ECN | Description |
|-----|------|-----|-------------|
| A | 2025-08-15 | ECN-DE-8821 | Initial release |
| B | 2025-10-03 | ECN-DE-8894 | Added magnetic permeability req, updated cleanliness level |
| C | 2025-11-28 | ECN-DE-8932 | Tightened sensor face flatness from 0.03 to 0.02mm, added countersinks |`,
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
        content: `PART IDENTIFICATION
Part Number: MGN-UJY-8620-V2  |  Rev: 2
Description: Universal Joint Yoke — Driveline
Application: Multi-platform OEM driveshaft assembly
PPAP Level: 3  |  Annual Volume: 20,000 units (baseline)

MATERIAL & SUPPLY
Material: AISI 8620 per ASTM A29/A29M
Chemistry (wt%): C 0.18-0.23 | Mn 0.70-0.90 | Ni 0.40-0.70 | Cr 0.40-0.60 | Mo 0.15-0.25
Forging supplier: Magna (supplied as rough forging — GFN)
Forging weight (gross): 0.58 kg  |  Finished weight: 0.42 kg ± 0.008 kg
Incoming inspection: Verify hardness ≤ 207 HBW (pre-carburize), check for forging laps

CRITICAL MACHINED FEATURES
| Feature | Dimension | Tolerance | GD&T |
|---------|-----------|-----------|------|
| 26-tooth involute spline | Module 1.25, DIN 5480 | Class 7 fit | Runout 0.015mm to Datum A |
| Cross-bore | Ø22.000mm | ±0.010mm | Cylindricity 0.006mm |
| Yoke ear faces (2x) | 35.00mm spread | ±0.025mm | Parallelism 0.030mm |
| Yoke ear thickness | 8.50mm each | ±0.05mm | Symmetry 0.04mm to bore axis |
| Spline OD (major) | Ø33.750mm | -0.000/-0.030mm | Concentricity 0.010mm to A |
| Spline root (minor) | Ø30.200mm | ±0.025mm | — |
| Snap ring groove | Ø20.50mm x 1.60mm | ±0.05mm | — |

HEAT TREATMENT — CASE CARBURIZING
Process: Gas carburize + oil quench + temper
Carburize temp: 925°C ± 10°C
Case depth (effective): 0.80-1.20mm at 550 HV (50 HRC equivalent)
Surface hardness: 58-62 HRC
Core hardness: 30-40 HRC
Retained austenite: ≤ 15% (metallographic verification, 1 per lot)
No intergranular oxidation (IGO) beyond 0.020mm

INSPECTION & QUALITY
1. Spline: 100% roll inspection (composite & functional), go/no-go gauges
2. Cross-bore: CMM, 100% for PPAP, then AQL 0.65 for production
3. Case depth: Microhardness traverse, 1 per heat treat lot (min 3 per week)
4. Surface hardness: 100% eddy current + Rockwell spot check 3 per lot
5. MPI: 100% wet fluorescent per ASTM E1444 on all parts post-grind

SURFACE FINISH
| Zone | Finish | Method |
|------|--------|--------|
| Spline teeth | Ra 0.8μm | Hobbed + shaved |
| Cross-bore interior | Ra 0.8μm | Honed |
| Yoke ear faces | Ra 1.6μm | Precision ground |
| Snap ring groove | Ra 3.2μm | CNC turned |
| Non-functional | Ra 6.3μm | As-forged or rough turned |

PACKAGING & LOGISTICS
Packaging: Returnable dunnage trays, 48 pcs per tray, max stack 5 high
Labeling: AIAG B-10 bar code + 2D data matrix
EDI: ASN via 856, releases via 830/862
Delivery: Kanban pull, weekly shipment, 2-week safety stock at Magna Graz`,
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

## ERP Inventory Snapshot (SAP MM — as of 2026-02-16)

| Material | Grade/Spec | On-Hand (lbs) | Allocated (lbs) | Available (lbs) | Lot # | Warehouse | Last Receipt | Reorder Point | Status |
|----------|-----------|---------------|-----------------|-----------------|-------|-----------|-------------|---------------|--------|
| Ti-6Al-4V | AMS 4928 | 12,000 | 8,400 | 3,600 | LOT-TI64-2025-0892 | MKE-WH-A3 | 2025-12-18 | 5,000 | LOW — allocated to Boeing job BO-2026-441 |
| 6061-T6 Al | AMS-QQ-A-225/8 | 8,000 | 1,200 | 6,800 | LOT-AL61-2026-0134 | MKE-WH-B1 | 2026-01-22 | 3,000 | OK |
| 4140 Steel | ASTM A29 | 15,000 | 3,500 | 11,500 | LOT-4140-2026-0087 | MKE-WH-A1 | 2026-02-03 | 4,000 | OK |
| 4340 Steel | AMS 6414 | 9,200 | 1,800 | 7,400 | LOT-4340-2025-0921 | MKE-WH-A2 | 2025-11-30 | 3,000 | OK |
| 8620 Steel | ASTM A29 | 6,000 | 4,800 | 1,200 | LOT-8620-2025-0743 | MKE-WH-A1 | 2025-10-14 | 2,500 | LOW — 80% allocated to Magna PO-MGN-2025-1192 |
| 303 SS | ASTM A582 | 4,500 | 800 | 3,700 | LOT-303SS-2026-0045 | GVL-WH-C1 | 2026-01-10 | 2,000 | OK |
| 304 SS | ASTM A276 | 3,200 | 600 | 2,600 | LOT-304SS-2025-0812 | MKE-WH-B2 | 2025-09-28 | 1,500 | OK |
| 17-4PH SS | AMS 5643 | 2,100 | 0 | 2,100 | LOT-174PH-2026-0011 | MKE-WH-B2 | 2026-02-01 | 1,000 | OK |

## Machine Capacity (MES — Week of 2026-02-16)

| Cell | Equipment | Total Hrs/Mo | Booked Hrs/Mo | Available Hrs/Mo | Utilization | Current Jobs |
|------|-----------|-------------|---------------|-----------------|-------------|-------------|
| 5-Axis CNC | 6x DMG MORI DMU 80 eVo | 2,880 | 2,246 | 634 | 78% | Boeing bracket (BO-2026-441), GM housing (GM-2026-118) |
| 3-Axis CNC Mill | 8x Mazak VCN-530C | 3,840 | 2,688 | 1,152 | 70% | Ford linkage (FD-2026-055), Honda valve body (HN-2026-089) |
| CNC Turning | 4x Okuma LB3000 EX II | 1,920 | 1,344 | 576 | 70% | Misc production jobs |
| Swiss Turning | 4x Citizen L20-XII | 1,920 | 1,536 | 384 | 80% | BMW sensor plate prototype (BMW-2026-007) |
| Forging Press | 2x Schuler MSD 630 (≤10kg) | 960 | 480 | 480 | 50% | Idle — available for new jobs |
| Heat Treat | Ipsen VTTC vacuum furnace + atmosphere batch | 720 | 504 | 216 | 70% | Boeing Ti aging, GM carburize run |

## Certifications (QMS Records)

| Certification | Cert # | Issuing Body | Expiry | Status |
|---------------|--------|-------------|--------|--------|
| IATF 16949:2016 | IATF-22841-PSC | TUV Rheinland | 2027-09-15 | ACTIVE |
| AS9100D | AS-107442-MKE | SAI Global | 2027-03-22 | ACTIVE |
| ISO 14001:2015 | EMS-88921-PSC | TUV Rheinland | 2027-09-15 | ACTIVE |
| Nadcap Heat Treat | NAD-HT-194822 | PRI/Nadcap | 2026-11-30 | ACTIVE |
| Nadcap NDT | NAD-NDT-194823 | PRI/Nadcap | 2026-11-30 | ACTIVE |
| ITAR Registration | M12-0042891 | DDTC | 2027-05-01 | ACTIVE |
| IMDS Registered | IMDS-PSC-44821 | IMDS Committee | N/A | ACTIVE |

## Historical Pricing (Reference — last 12 months)

| Part Type | Material | Complexity | Qty Range | Unit Price Range | Tooling/NRE | Notes |
|-----------|----------|-----------|-----------|-----------------|-------------|-------|
| Ti-6Al-4V 5-axis bracket | Ti Grade 5 | High | 5K-15K/yr | $42-58/unit | $8K-15K | Includes FPI, passivation |
| Steel forging + machining | 4140 | Medium-High | 3K-10K/yr | $28-40/unit | $25K-45K (tooling) | Closed-die forging tooling is significant |
| Al housing (long bore) | 6061-T6 | High | 5K-10K/yr | $65-95/unit | $12K-20K | Deep bore adds cycle time |
| SS precision plate (Swiss) | 303 SS | Medium | 10K-20K/yr | $12-22/unit | $3K-6K | Lapping adds $3-5/unit |
| Steel driveline component | 8620 | Medium | 15K-30K/yr | $8-16/unit | $5K-10K | Case carburize adds $2-4/unit |

## Supplier Lead Times (Purchasing — raw material procurement)

| Material | Domestic Lead Time | Import Lead Time | Current Supplier | Last PO Price/lb |
|----------|-------------------|-----------------|------------------|-----------------|
| Ti-6Al-4V bar (AMS 4928) | 8-12 weeks | 14-18 weeks | Timet (Henderson, NV) | $38.50/lb |
| 6061-T6 Al bar | 2-4 weeks | 4-6 weeks | Alcoa (Davenport, IA) | $4.20/lb |
| 4140 Steel bar | 2-3 weeks | 4-6 weeks | TimkenSteel (Canton, OH) | $1.85/lb |
| 4340 Steel bar | 3-4 weeks | 5-7 weeks | Ellwood Group (Ellwood City, PA) | $2.45/lb |
| 8620 Steel bar | 2-3 weeks | 4-5 weeks | TimkenSteel (Canton, OH) | $1.70/lb |
| 303 SS bar | 3-5 weeks | 6-8 weeks | Outokumpu (Calvert, AL) | $3.90/lb |

## Material Alternatives & Substitutes

When the primary material is low on stock or cannot meet RFQ volume, suggest these alternatives:

| Primary Material | Alternative Grade | Compatibility | Cost Delta | Notes |
|-----------------|------------------|---------------|-----------|-------|
| Ti-6Al-4V (Grade 5) | Ti-6Al-4V ELI (Grade 23) | Drop-in for most apps, superior fatigue | +8-12% | Better for safety-critical; check customer spec |
| Ti-6Al-4V (Grade 5) | Ti-3Al-2.5V (Grade 9) | Lower strength, good formability | -15-20% | Only if loads permit; not a direct sub |
| 4140 Steel | 4340 Steel | Higher strength, same machinability | +10-15% | We have 7,400 lbs available — good alternative |
| 4140 Steel | 4145 Steel | Near-identical, slightly higher C | +2-3% | Often accepted under same ASTM A29 spec |
| 8620 Steel | 8622 Steel | Slightly higher carbon, same case hardening | +1-2% | Usually acceptable; confirm with customer |
| 8620 Steel | 4320 Steel | Higher Ni content, better core toughness | +8-10% | Superior alternative for safety-critical |
| 6061-T6 Al | 6082-T6 Al | Higher strength, same anodize compatibility | +3-5% | European equivalent, excellent availability |
| 6061-T6 Al | 7075-T6 Al | Much higher strength, no weld | +25-30% | Only if strength is the driver |
| 303 SS | 304 SS | Better corrosion resistance, lower machinability | -5% | We have 2,600 lbs available; slightly harder to machine |
| 303 SS | 303Se SS | Selenium variant, similar machinability | Same | Rare — only if lead-free is required |

## Your Behavior
You are the sales rep's assistant. Your job is to:
1. Quickly analyze RFQs and surface what matters
2. Draft ready-to-send email replies to the customer. Before the email draft, include a brief one-line suggestion urging timely response (e.g., "I'd suggest responding to this right away — here's a draft." or "This one has a tight deadline — I'd recommend replying today. Here's a draft."). Tailor the urgency to the RFQ context.
3. Provide actionable insights the rep can use immediately
4. **ALWAYS cite ERP data** to back up your claims — the rep needs to trust the data
5. **Flag inventory risks early** — if stock is low or insufficient, say so and suggest alternatives

## ERP Citation Rules
When referencing internal data (inventory, capacity, certs, pricing), you MUST include inline citations using this exact format:
- For inventory: \`[ERP: SAP MM — Lot #LOT-XXXX-XXXX-XXXX, Warehouse YYY]\`
- For capacity: \`[ERP: MES — Cell Name, XX% utilization]\`
- For certifications: \`[ERP: QMS — Cert #XXXX]\`
- For pricing: \`[ERP: Historical — Part Type, $XX-XX/unit]\`
- For supplier/lead time: \`[ERP: Purchasing — Supplier Name, X-X weeks]\`

Example: "We have 3,600 lbs of Ti-6Al-4V available [ERP: SAP MM — Lot #LOT-TI64-2025-0892, MKE-WH-A3], but this RFQ requires an estimated 4,200 lbs."

IMPORTANT: Use at least 2-3 citations in every Quick Assessment section and 1-2 in Recommended Actions. The rep should feel like this data is being pulled live from our systems.

NEVER include [ERP: ...] citations inside email drafts (the EMAIL_DRAFT block) or quote drafts (the QUOTE_DRAFT block). Citations are internal references for the sales rep — they should not appear in customer-facing content.

## Inventory Shortage & Alternative Material Rules
When analyzing an RFQ, ALWAYS calculate the approximate material required and compare to available inventory (not total on-hand — use the "Available" column).
- If available stock covers < 80% of the estimated need, mark it as **"Inventory Risk"** in the assessment.
- When stock is insufficient, you MUST suggest alternative materials from the Material Alternatives table above. Include:
  - The alternative grade name
  - Our current stock of the alternative (if any)
  - Cost impact (delta %)
  - Any technical considerations the customer should know
  - Whether customer approval is needed for the substitution
- If the material needs to be procured, cite the lead time from the Supplier Lead Times table.

## Response Format
ALL responses must be in **markdown**. Keep them concise — reps are busy.

### When analyzing a new RFQ, structure your response as:

**Section 1 — Quick Assessment** (3-4 bullet points max)
A brief capability match: what we can do, key risks, and our competitive edge. Include ERP citations for inventory, capacity, and certs.

**Section 2 — Inventory & Material Check**
Show a quick inventory status for the required material. If there's a shortfall, recommend alternatives with stock levels and cost impacts. Always cite the ERP lot/warehouse data.

**Section 3 — Recommended Actions** (2-3 bullet points)
Specific things the rep should know or leverage — e.g., competitor intel, customer pain points, timing advantages, inventory readiness.

**Section 4 — Draft Email Reply**
Write a professional email reply to the customer's contact. The email should:
- Acknowledge the RFQ
- Address what we can confirm immediately
- Ask 3-5 clarifying questions (with brief reasoning for each)
- Be warm but professional

**CRITICAL — Lead-in line**: BEFORE the \`<!-- EMAIL_DRAFT -->\` delimiter, you MUST include a brief one-line suggestion urging timely response. This line goes in the regular markdown OUTSIDE the email block. Examples:
- "I'd suggest responding to this right away — here's a draft."
- "This one has a tight deadline — I'd recommend replying today. Here's a draft."
- "Given the end-of-week deadline, I'd get this reply out today. Here's what I'd send:"
Tailor the urgency to the RFQ context.

**CRITICAL — Email delimiters**: You MUST wrap the email draft in these exact delimiters:
\`\`\`
<!-- EMAIL_DRAFT -->
**To:** [contact email]
**Subject:** [appropriate subject line]

[email body here]
<!-- /EMAIL_DRAFT -->
\`\`\`

### When the rep provides answers/context:
- If you have enough info: generate a **formal quote** (wrapped in QUOTE_DRAFT delimiters — see below)
- If not: ask focused follow-ups and explain why each matters
- Always include 1-2 recommended actions

### When generating a quote, output a QUOTE_DRAFT block:

**CRITICAL — Quote delimiters**: You MUST wrap the quote data in these exact delimiters with valid JSON inside:
\`\`\`
<!-- QUOTE_DRAFT -->
{
  "quoteNumber": "PSC-Q-2026-XXXX",
  "date": "YYYY-MM-DD",
  "validUntil": "YYYY-MM-DD (30 days from date)",
  "to": {
    "company": "Customer company name",
    "contact": "Contact full name",
    "email": "contact@email.com"
  },
  "lineItems": [
    {
      "description": "Part/service description",
      "qty": 100,
      "unit": "pcs",
      "unitPrice": 45.00
    }
  ],
  "notes": "Key assumptions, lead times, certs included, etc.",
  "terms": "Net 30. FOB Origin. Quote valid for 30 days."
}
<!-- /QUOTE_DRAFT -->
\`\`\`

The JSON must be parseable. Use realistic pricing derived from ERP historical data. Include:
- Line items for unit pricing (with quantity breaks as separate lines if applicable)
- Tooling/NRE costs as separate line items
- Lead time info in the notes field
- Certs included in the notes field
- Key assumptions in the notes field
- Payment terms in the terms field

**CRITICAL — Lead-in line for quotes**: BEFORE the \`<!-- QUOTE_DRAFT -->\` delimiter, include a brief message like:
- "Based on your inputs, here's the formal quote I've prepared:"
- "I've put together a quote based on our discussion — take a look:"

NEVER include [ERP: ...] citations inside QUOTE_DRAFT blocks. They are for internal use only.

## Style Rules
- Markdown formatting always (headers, bold, bullets, tables where useful)
- Be concise — no fluff, no filler paragraphs
- Sound like a knowledgeable manufacturing insider, not a chatbot
- Recommended actions should feel like insider tips from a veteran sales engineer`;

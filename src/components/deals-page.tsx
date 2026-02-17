"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { mockDealsTable, Deal } from "@/lib/mock-data";
import { DealDetailDrawer } from "@/components/deal-detail-drawer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Handshake,
  Sparkles,
  WandSparkles,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface CRMColumn {
  key: string;
  label: string;
  isAI?: boolean;
}

const defaultColumns: CRMColumn[] = [
  { key: "name", label: "Deal Name" },
  { key: "accountName", label: "Account" },
  { key: "stage", label: "Stage" },
  { key: "ai_companyRelevance", label: "Company Relevance", isAI: true },
  { key: "ai_complianceImpact", label: "Compliance Impact", isAI: true },
  { key: "ai_upsellCrossSell", label: "Upsell / Cross-sell", isAI: true },
  { key: "contactName", label: "Contact" },
  { key: "value", label: "Value" },
  { key: "probability", label: "Probability" },
  { key: "closeDate", label: "Close Date" },
  { key: "nextStep", label: "Next Step" },
];

const stageColorMap: Record<string, { bg: string; text: string; dot: string }> = {
  Prospecting: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Qualification: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  Proposal: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Negotiation: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  "Closed Won": { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  "Closed Lost": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const builtInAiData: Record<string, string[]> = {
  ai_companyRelevance: [
    "Defense prime with $8B annual procurement — our ITAR cert and 5-axis Ti capacity are a direct match",
    "FDA-regulated medical device OEM — PEEK molding is a niche we dominate vs. commodity shops",
    "Tier-1 auto supplier with 3 existing POs — expanding sheet metal scope locks in wallet share",
    "Same account as dtl-1 — MSA cements us as sole-source across multiple Northrop programs",
    "Boutique motorsport — low volume but high margin; showcases our prototype-to-production capability",
    "Mid-market fluid power OEM — referral from existing customer gives us inside track on pricing",
    "High-growth electronics OEM exploring domestic die-casting — first-mover advantage if we win DFM",
    "Renewable energy leader doubling bracket volumes — aligns with our heavy fab idle capacity",
    "Long-standing mining/heavy industry account — blanket PO renewal protects $1.1M recurring revenue",
    "Emerging robotics company — early win here seeds a high-growth account for repeat precision work",
    "ITAR-only defense contractor — our M12 registration is a hard gate competitors can't easily clear",
    "Heavy equipment manufacturer exploring new supplier — plant tour could convert to multi-year deal",
    "Lost previous RFQ on cleanroom cert — re-engagement signals they still see us as viable for semi",
    "Regional fluid power OEM — low entry cost, but opens door to valve body platform business",
    "Same account as dtl-2 (MedCore) — tooling quote is a gateway to production-volume injection work",
    "Tier-2 aerospace with AS9100 requirement — our cert and IMTS relationship give us a warm intro",
    "Biotech lab equipment OEM — precision machining + surface finish is our sweet spot vs. generalists",
    "Gas turbine MRO with active fixture spend — our 5-axis cell is already running similar Inconel work",
    "Composite tooling startup — small initial order but rapid growth trajectory in aerospace composites",
    "Legacy stamping customer needing overflow — easy capacity fill with existing tooling relationships",
    "Photonics OEM requiring sub-micron surface finish — only 2-3 shops in the Midwest can compete",
    "Repeat forging customer — multi-year renewal is low risk and stabilizes base-load shop revenue",
    "Defense/security integrator — EMI shielding is a growing niche; MIL-STD compliance sets us apart",
    "New marine fabrication prospect — large program size but long sales cycle; outbound-sourced lead",
    "Precision instrument OEM via referral — tolerance profile matches our Swiss turning sweet spot",
    "Agricultural OEM with seasonal demand — existing relationship de-risks the revised quote cycle",
    "Aerospace prime on multi-year LTA — landing gear is high-value, high-barrier, sticky revenue",
    "Plastics company exploring metal insert machining — cross-industry opportunity to showcase CNC",
    "EV charging infrastructure OEM — copper bus bar demand surging 40% YoY; capacity is available",
    "Rail transit OEM with multi-year bogie frame need — heavy fab presses are at 50% utilization",
  ],
  ai_complianceImpact: [
    "ITAR-controlled — verify DDTC registration (M12-0042891) is current; restrict shop floor access to US persons only",
    "FDA 21 CFR 820 applies — ensure QMS traceability covers device-grade PEEK; validate injection parameters",
    "IATF 16949 required for blanket PO — confirm annual surveillance audit passed; update control plan",
    "ITAR + DFARS flow-down — MSA must include DFARS 252.225-7001 clause; legal review of IP terms needed",
    "No specific compliance gate — standard commercial terms; ensure material certs accompany shipment",
    "No regulatory mandate — standard ISO 9001 QMS sufficient; customer may request PPAP Level 2",
    "RoHS/REACH applicable for electronics enclosures — verify die-cast alloy compliance; no restricted substances",
    "No special compliance — standard commercial fabrication; ensure weld certs (AWS D1.1) are current",
    "No regulatory gate — standard supply agreement; ensure AR500 wear plate mill certs per ASTM A514",
    "ISO 13482 (service robots) may apply — confirm material certs meet robot safety component requirements",
    "ITAR-controlled defense program — full DDTC compliance required; segregate parts in secure storage area",
    "MSHA (Mine Safety) standards may apply — verify fabrication meets structural integrity requirements",
    "ITAR N/A but EAR may apply — check ECCN classification for semiconductor-grade fixtures; re-export risk",
    "No special compliance — standard hydraulic industry specs; PPAP Level 1 likely sufficient for samples",
    "FDA 21 CFR 820 — tooling qualification must align with customer's validated manufacturing process",
    "AS9100D mandatory — ensure Nadcap certs (HT & NDT) are current; customer will audit within 90 days",
    "FDA GMP may apply to lab equipment — confirm surface finish validation meets cleanliness requirements",
    "Nadcap heat treat required for turbine-grade Inconel — verify NAD-HT-194822 scope covers this alloy",
    "No specific compliance — standard commercial machining; material certs for aluminum tooling plate sufficient",
    "IATF 16949 applies — progressive die must follow existing PPAP; update FMEA if design has changed",
    "No export control concern — commercial optics; but customer may require ISO 14644 cleanroom handling",
    "No regulatory gate — standard forging supply agreement; ensure heat treatment per ASTM A388",
    "MIL-STD-461 (EMI/EMC) compliance required — shielding effectiveness testing must be documented",
    "ABS/DNV marine classification may apply — verify welding procedures meet marine structural standards",
    "ISO 17025 calibration traceability required — ensure CMM certs are current for instrument-grade parts",
    "No special compliance — standard agricultural equipment specs; seasonal delivery schedule is key risk",
    "AS9100D + Nadcap NDT mandatory — landing gear is safety-critical; 100% FPI/MPI per ASTM E1444",
    "No regulatory mandate — standard CNC machining for plastic insert; material cert for 6061-T6 sufficient",
    "UL/CSA listing for EV charging components — verify copper alloy meets UL 2251 conductor requirements",
    "EN 15085 (railway welding) may apply — confirm welding procedures meet European rail safety standards",
  ],
  ai_upsellCrossSell: [
    "Pitch additive Ti-6Al-4V service for complex bracket geometries — reduces lead time by 30%",
    "Introduce PEEK injection molding — they currently machine from stock at 3x our projected unit cost",
    "Offer powder-coat finishing in-house to eliminate their secondary vendor and cut 5 days from cycle",
    "Bundle turn-mill services with MSA — consolidating suppliers saves Northrop $200K+/yr in overhead",
    "Cross-sell carbon fiber composite options for weight reduction on intake manifold design",
    "Upsell anodized aluminum covers as value-add — their current vendor charges 20% more for finishing",
    "Propose die-cast prototyping service before production tooling — reduces DFM risk and wins trust",
    "Cross-sell galvanized steel mounting hardware with bracket orders — natural add-on at 15% margin",
    "Offer plasma-cut liner plates as add-on to machined wear parts — we have AR500 in stock",
    "Introduce precision grinding for shaft components they currently buy from a separate vendor in Ontario",
    "Bundle nickel-plated connector housings with their defense orders — ITAR-cleared, higher margin",
    "Pitch laser cutting capability for prototype wear-resistant plates — faster than plasma at their scale",
    "Upsell ultra-clean passivation service for semiconductor fixtures — differentiator vs. lost-bid competitor",
    "Offer chrome-plated spool valves as upgrade to standard finish — improves service life 2x",
    "Cross-sell multi-cavity mold design — scaling from single to 4-cavity drops their per-part cost 40%",
    "Pitch Inconel investment castings for high-temp turbine components once qualification is complete",
    "Offer electropolishing as finishing service for their stainless steel lab assemblies — Ra < 0.2μm",
    "Introduce autoclave-rated mold tooling for their composite program — natural extension of fixture work",
    "Cross-sell CNC-machined alignment jigs for composite layup — they currently use 3D-printed tooling",
    "Upsell zinc-plated stampings for corrosion-prone outdoor applications — low cost, high perceived value",
    "Pitch diamond-turned optics inserts — higher margin, fewer competitors in the Midwest region",
    "Offer heat-treated ring blanks to vertically integrate their supply — removes a sub-tier vendor",
    "Propose conformal-coated PCB enclosures for outdoor radar units — MIL-STD compliance adds margin",
    "Pitch cathodic protection anodes — they currently import from overseas at longer lead times",
    "Bundle hard-anodized enclosures with instrument chassis orders — single PO simplifies their procurement",
    "Cross-sell PTO shaft assemblies — they source from 2 vendors today; we can consolidate",
    "Introduce nitrided actuator rods for landing gear — 3x longer service life, justifies premium pricing",
    "Offer multi-shot molded seals alongside their insert molding orders — captures downstream revenue",
    "Upsell silver-plated contacts for higher conductivity EV charging applications — premium but justified",
    "Cross-sell machined wheel hubs — natural extension of bogie frame casting/machining relationship",
  ],
};

function generateAIValues(prompt: string, deals: Deal[]): string[] {
  const lower = prompt.toLowerCase();

  if (lower.includes("risk") || lower.includes("score")) {
    const scores = ["Low", "Medium", "High", "Low", "Medium-High", "Low", "High", "Medium", "Low", "Medium", "High", "Medium-High", "Low", "Medium", "High", "Low", "Medium", "Medium-High", "Low", "High", "Medium", "Low", "High", "Low", "Medium", "High", "Low", "Medium-High", "Low", "High"];
    return deals.map((_, i) => scores[i % scores.length]);
  }

  if (lower.includes("competitor") || lower.includes("competition")) {
    const vals = ["Pacific Machining", "MidWest Metal", "Shenzhen MetalWorks", "None identified", "GlobalParts Inc", "None identified", "TechCast Co", "WindFab LLC", "SteelCo", "RoboSupply", "DefenseTech", "HeavyMfg Inc", "ChipFab Co", "FluidTech", "MoldMasters", "AeroParts Ltd", "LabSupply Co", "TurboParts Inc", "CompositeCo", "StampTech Ltd", "OptiMfg Co", "ForgeMaster", "ShieldTech", "MarineFab Corp", "InstruParts", "AgriMetal Co", "AeroForge LLC", "MoldWorks Inc", "PowerFab Ltd", "RailTech Co"];
    return deals.map((_, i) => vals[i % vals.length]);
  }

  const templates = [
    ["High", "Medium", "Low", "Medium-High", "Low", "High", "Medium", "Low", "Medium", "High", "Medium-High", "Low", "Medium", "High", "Low", "High", "Medium", "Low", "Medium-High", "High", "Low", "Medium", "High", "Low", "Medium", "High", "Medium-High", "Low", "High", "Medium"],
    ["92%", "67%", "88%", "45%", "71%", "83%", "79%", "34%", "56%", "91%", "62%", "85%", "41%", "87%", "58%", "73%", "50%", "78%", "39%", "94%", "55%", "81%", "66%", "43%", "89%", "52%", "76%", "61%", "84%", "48%"],
    ["Strong fit", "Moderate fit", "Strong fit", "Exploring", "New lead", "Strong fit", "Moderate fit", "Exploring", "Moderate fit", "Strong fit", "New lead", "Strong fit", "Re-engage", "Strong fit", "New lead", "Strong fit", "Moderate fit", "Strong fit", "Exploring", "New lead", "Moderate fit", "Strong fit", "Re-engage", "New lead", "Strong fit", "Moderate fit", "Strong fit", "Exploring", "Strong fit", "Re-engage"],
  ];
  const chosen = templates[Math.floor(Math.random() * templates.length)];
  return deals.map((_, i) => chosen[i % chosen.length]);
}

function getCellValue(deal: Deal, key: string): string | number {
  const val = (deal as unknown as Record<string, unknown>)[key];
  if (val === undefined || val === null) return "";
  return val as string | number;
}

function StageBadge({ stage }: { stage: string }) {
  const colors = stageColorMap[stage] || { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full shrink-0", colors.dot)} />
      <span className={cn("text-[11px] font-medium", colors.text)}>{stage}</span>
    </div>
  );
}

function ProbabilityCell({ value }: { value: number }) {
  const color = value >= 70 ? "text-green-700 bg-green-50" : value >= 40 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50";
  return (
    <span className={cn("text-[11px] font-semibold px-1.5 py-0.5 rounded", color)}>
      {value}%
    </span>
  );
}

function AccountTag({ name, onClick }: { name: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-warm-100 text-warm-700 border border-warm-200/60",
        onClick && "cursor-pointer hover:bg-warm-200/80 hover:border-warm-300/60 transition-colors"
      )}
    >
      {name}
    </button>
  );
}

interface DealsPageProps {
  onAccountClick?: (accountId: string) => void;
}

const TOTAL_PAGES = 31;

export function DealsPage({ onAccountClick }: DealsPageProps) {
  const [columns, setColumns] = useState<CRMColumn[]>(defaultColumns);
  const [aiData, setAiData] = useState<Record<string, string[]>>(builtInAiData);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedDeal = useMemo(
    () => mockDealsTable.find((d) => d.id === selectedDealId) ?? null,
    [selectedDealId]
  );

  const drawerOpen = selectedDeal !== null;

  const handleDrawerOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSelectedDealId(null);
    }
  }, []);

  useEffect(() => {
    if (popoverOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [popoverOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
        setPrompt("");
      }
    }
    if (popoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [popoverOpen]);

  const handleAddColumn = useCallback(() => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const colKey = `ai_${Date.now()}`;
      const label = prompt.trim().length > 30
        ? prompt.trim().slice(0, 28) + "..."
        : prompt.trim();
      const values = generateAIValues(prompt, mockDealsTable);

      setAiData((prev) => ({ ...prev, [colKey]: values }));
      setColumns((prev) => [...prev, { key: colKey, label, isAI: true }]);
      setPrompt("");
      setPopoverOpen(false);
      setIsGenerating(false);
    }, 800);
  }, [prompt]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-warm-200/40 px-6 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Handshake className="h-5 w-5 text-warm-500" />
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Deals
              </h1>
              {/* <p className="text-xs text-muted-foreground">
                CRM deals pipeline
              </p> */}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5 font-semibold bg-warm-100 text-warm-600 border-warm-200"
            >
              924 deals
            </Badge>
          </div>
        </div>
      </header>

      {/* Table */}
      <div className="px-6 py-4">
        <div className="rounded-xl border border-warm-200/60 overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] border-collapse" style={{ minWidth: `${columns.length * 140}px` }}>
              <thead>
                <tr className="bg-warm-50/60 border-b border-warm-200/60">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        "px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap",
                        col.isAI
                          ? "text-warm-500 bg-purple-100/70"
                          : "text-warm-500"
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {col.isAI && (
                          <WandSparkles className="h-2.5 w-2.5 text-purple-500" />
                        )}
                        {col.label}
                      </div>
                    </th>
                  ))}
                  {/* Add column button */}
                  <th className="px-2 py-2.5 text-left w-10">
                    <div className="relative" ref={popoverRef}>
                      <button
                        onClick={() => setPopoverOpen(!popoverOpen)}
                        className={cn(
                          "h-6 w-6 rounded-md flex items-center justify-center transition-colors",
                          popoverOpen
                            ? "bg-warm-200 text-warm-700"
                            : "bg-warm-100 text-warm-400 hover:bg-warm-200 hover:text-warm-600"
                        )}
                      >
                        {popoverOpen ? (
                          <X className="h-3 w-3" />
                        ) : (
                          <WandSparkles className="h-3 w-3" />
                        )}
                      </button>

                      {/* Popover */}
                      {popoverOpen && (
                        <div className="absolute top-8 right-0 z-50 w-72 rounded-lg border border-warm-200 bg-card shadow-lg p-3 animate-in fade-in-0 zoom-in-95 duration-150">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Sparkles className="h-3 w-3 text-purple-500" />
                            <span className="text-[11px] font-semibold text-foreground">
                              Add AI Column
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mb-2">
                            Describe the field and AI will populate values for all deals.
                          </p>
                          <div className="flex gap-1.5">
                            <input
                              ref={inputRef}
                              type="text"
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddColumn();
                                if (e.key === "Escape") {
                                  setPopoverOpen(false);
                                  setPrompt("");
                                }
                              }}
                              placeholder="e.g. Competitor threat level..."
                              className="flex-1 h-7 px-2 text-[11px] rounded-md border border-warm-200 bg-background placeholder:text-warm-400 focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300"
                            />
                            <button
                              onClick={handleAddColumn}
                              disabled={!prompt.trim() || isGenerating}
                              className={cn(
                                "h-7 w-7 rounded-md flex items-center justify-center transition-colors shrink-0",
                                prompt.trim() && !isGenerating
                                  ? "bg-purple-600 text-white hover:bg-purple-700"
                                  : "bg-warm-100 text-warm-300 cursor-not-allowed"
                              )}
                            >
                              {isGenerating ? (
                                <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <Send className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-200/40">
                {mockDealsTable.map((deal, rowIdx) => (
                  <tr
                    key={deal.id}
                    className="hover:bg-warm-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedDealId(deal.id)}
                  >
                    {columns.map((col) => {
                      if (col.isAI) {
                        const vals = aiData[col.key];
                        const val = vals ? vals[rowIdx] || "" : "";
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-3.5 bg-purple-100/50 text-foreground font-medium min-w-[220px] max-w-[300px]"
                          >
                            {val}
                          </td>
                        );
                      }

                      if (col.key === "name") {
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-3.5 whitespace-nowrap"
                          >
                            <div className="font-medium text-foreground leading-tight">{deal.name}</div>
                            <div className="flex items-center gap-1.5 text-[10px] text-warm-500 mt-0.5">
                              <span>{deal.dealOwner}</span>
                              <span className="text-warm-300">|</span>
                              <span className="text-warm-400">Last Activity: {deal.lastActivity}</span>
                            </div>
                          </td>
                        );
                      }

                      if (col.key === "accountName") {
                        return (
                          <td key={col.key} className="px-3 py-3.5 whitespace-nowrap">
                            <AccountTag
                              name={deal.accountName}
                              onClick={onAccountClick ? () => onAccountClick(deal.accountId) : undefined}
                            />
                          </td>
                        );
                      }

                      if (col.key === "stage") {
                        return (
                          <td key={col.key} className="px-3 py-3.5 whitespace-nowrap">
                            <StageBadge stage={deal.stage} />
                          </td>
                        );
                      }

                      if (col.key === "probability") {
                        return (
                          <td key={col.key} className="px-3 py-3.5 whitespace-nowrap">
                            <ProbabilityCell value={deal.probability} />
                          </td>
                        );
                      }

                      if (col.key === "value") {
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-3.5 font-medium text-foreground whitespace-nowrap"
                          >
                            {deal.value}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={col.key}
                          className="px-3 py-3.5 text-warm-600 whitespace-nowrap"
                        >
                          {String(getCellValue(deal, col.key))}
                        </td>
                      );
                    })}
                    {/* Empty cell for add-column column */}
                    <td className="px-2 py-3.5 w-10" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-warm-200/60">
          <p className="text-[11px] text-muted-foreground">
            Showing <span className="font-medium text-foreground">1–30</span> of{" "}
            <span className="font-medium text-foreground">924</span> deals
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={cn(
                "h-7 w-7 rounded-md flex items-center justify-center text-[11px] transition-colors",
                currentPage === 1
                  ? "text-warm-300 cursor-not-allowed"
                  : "text-warm-500 hover:bg-warm-100 hover:text-warm-700"
              )}
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={cn(
                "h-7 w-7 rounded-md flex items-center justify-center text-[11px] transition-colors",
                currentPage === 1
                  ? "text-warm-300 cursor-not-allowed"
                  : "text-warm-500 hover:bg-warm-100 hover:text-warm-700"
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {(() => {
              const pages: (number | string)[] = [];
              if (TOTAL_PAGES <= 7) {
                for (let i = 1; i <= TOTAL_PAGES; i++) pages.push(i);
              } else {
                pages.push(1);
                if (currentPage > 3) pages.push("...");
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(TOTAL_PAGES - 1, currentPage + 1);
                for (let i = start; i <= end; i++) pages.push(i);
                if (currentPage < TOTAL_PAGES - 2) pages.push("...");
                pages.push(TOTAL_PAGES);
              }
              return pages.map((p, idx) =>
                typeof p === "string" ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="h-7 w-7 flex items-center justify-center text-[11px] text-warm-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={cn(
                      "h-7 min-w-[28px] px-1 rounded-md flex items-center justify-center text-[11px] font-medium transition-colors",
                      currentPage === p
                        ? "bg-warm-800 text-white"
                        : "text-warm-600 hover:bg-warm-100 hover:text-warm-800"
                    )}
                  >
                    {p}
                  </button>
                )
              );
            })()}

            <button
              onClick={() => setCurrentPage(Math.min(TOTAL_PAGES, currentPage + 1))}
              disabled={currentPage === TOTAL_PAGES}
              className={cn(
                "h-7 w-7 rounded-md flex items-center justify-center text-[11px] transition-colors",
                currentPage === TOTAL_PAGES
                  ? "text-warm-300 cursor-not-allowed"
                  : "text-warm-500 hover:bg-warm-100 hover:text-warm-700"
              )}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(TOTAL_PAGES)}
              disabled={currentPage === TOTAL_PAGES}
              className={cn(
                "h-7 w-7 rounded-md flex items-center justify-center text-[11px] transition-colors",
                currentPage === TOTAL_PAGES
                  ? "text-warm-300 cursor-not-allowed"
                  : "text-warm-500 hover:bg-warm-100 hover:text-warm-700"
              )}
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
            <span className="font-medium text-foreground">{TOTAL_PAGES}</span>
          </p>
        </div>
      </div>

      <DealDetailDrawer
        deal={selectedDeal}
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
      />
    </div>
  );
}

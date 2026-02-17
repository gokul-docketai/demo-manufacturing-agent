"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { mockAccounts, Account } from "@/lib/mock-data";
import { AccountDetailDrawer } from "@/components/account-detail-drawer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Building2,
  Plus,
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
  { key: "name", label: "Account Name" },
  { key: "ai_sellOpportunities", label: "Sell Opportunities", isAI: true },
  { key: "ai_upsellCrossSell", label: "Upsell / Cross-sell", isAI: true },
  { key: "ai_similarEnquiries", label: "Similar Enquiries", isAI: true },
  { key: "industry", label: "Industry" },
  { key: "primaryContact", label: "Primary Contact" },
  { key: "annualRevenue", label: "Annual Revenue" },
  { key: "dealCount", label: "Deals" },
  { key: "totalValue", label: "Pipeline Value" },
  { key: "health", label: "Health" },
  { key: "stage", label: "Stage" },
  { key: "nextAction", label: "Next Step" },
];

const aiColumnResponses: Record<string, (acc: Account) => string> = {
  "credit risk": (acc) => {
    const map: Record<string, string> = {
      "acc-1": "Low", "acc-2": "Medium", "acc-3": "Low", "acc-4": "Pending",
      "acc-5": "Pending", "acc-6": "Low", "acc-7": "Low", "acc-8": "High",
      "acc-9": "Medium", "acc-10": "Low", "acc-11": "Pending", "acc-12": "Low",
      "acc-13": "High", "acc-14": "Low", "acc-15": "Medium",
      "acc-16": "Low", "acc-17": "Pending", "acc-18": "Low", "acc-19": "Medium",
      "acc-20": "Low", "acc-21": "Low", "acc-22": "Pending", "acc-23": "Low",
      "acc-24": "High", "acc-25": "Low", "acc-26": "Pending", "acc-27": "Low",
      "acc-28": "Medium", "acc-29": "Low", "acc-30": "High",
    };
    return map[acc.id] || "N/A";
  },
};

function generateAIValues(prompt: string, accounts: Account[]): string[] {
  const lower = prompt.toLowerCase();
  for (const [key, fn] of Object.entries(aiColumnResponses)) {
    if (lower.includes(key)) {
      return accounts.map(fn);
    }
  }

  const templates = [
    ["High", "Medium", "Low", "Medium-High", "Low", "High", "Medium", "Low", "Medium", "High", "Medium-High", "Low", "Medium", "High", "Low", "High", "Low", "Medium", "Medium-High", "Low", "High", "Medium", "Low", "High", "Low", "Medium", "High", "Low", "Medium-High", "High"],
    ["92%", "67%", "88%", "45%", "71%", "83%", "79%", "34%", "56%", "91%", "62%", "85%", "41%", "87%", "58%", "76%", "49%", "88%", "63%", "92%", "81%", "55%", "73%", "39%", "94%", "47%", "86%", "68%", "90%", "52%"],
    ["Strong fit", "Moderate fit", "Strong fit", "Exploring", "New lead", "Strong fit", "Moderate fit", "Exploring", "Moderate fit", "Strong fit", "New lead", "Strong fit", "Re-engage", "Strong fit", "New lead", "Strong fit", "Exploring", "Moderate fit", "Strong fit", "New lead", "Strong fit", "Re-engage", "Moderate fit", "Exploring", "Strong fit", "New lead", "Strong fit", "Moderate fit", "Strong fit", "Re-engage"],
  ];
  const chosen = templates[Math.floor(Math.random() * templates.length)];
  return accounts.map((_, i) => chosen[i % chosen.length]);
}

const builtInAiData: Record<string, string[]> = {
  ai_sellOpportunities: [
    "They source Ti brackets externally — our 5-axis line is a perfect fit",
    "Currently using a competitor for sensor housings with QA delays",
    "Expanding EV line next quarter — need stamped battery enclosures",
    "New plant build starting — high demand for wear-resistant plates",
    "Lost their turbine shroud supplier — actively seeking a replacement",
    "Ordering manifolds from 3 vendors — we can consolidate supply",
    "Switching from machined to die-cast enclosures to cut costs",
    "Prototype phase for performance intake — low volume, high margin",
    "FDA audit drove need for validated SS reactor vessel supplier",
    "Current wear liners failing early — our manganese grade lasts 2x",
    "Building new robotic arm — need precision joint components",
    "Awarded 200MW wind farm — bracket volumes doubling this year",
    "New fab line requires ultra-clean wafer fixtures we specialize in",
    "ITAR program kicked off — they need a certified housing supplier",
    "Testing new hydraulic system — valve bodies are a key bottleneck",
    "Turbine overhaul program needs custom blade fixturing urgently",
    "Developing next-gen composite wing — tooling RFQ coming in Q2",
    "Running progressive die brackets at capacity — need overflow partner",
    "Tighter lens housing tolerances pushed out of current supplier's range",
    "Annual forging contract up for renewal — we can undercut by 12%",
    "New radar platform needs EMI enclosures with MIL-STD compliance",
    "Expanding fleet with new vessel class — propeller shaft volumes up 3x",
    "Redesigned instrument chassis needs tighter tolerances than before",
    "Precision planter launch requires gearbox housings at scale",
    "Multi-year landing gear program — they're qualifying new suppliers",
    "Transitioning to over-molded inserts — their current vendor can't do it",
    "EV charging expansion driving 40% more bus bar demand this year",
    "New weld fixture project with 8-week deadline — we can fast-track",
    "Bogie frame redesign for next-gen trains — casting RFQ imminent",
    "Cleanroom wafer handler upgrade — need tighter flatness specs",
  ],
  ai_upsellCrossSell: [
    "Pitch our new additive Ti-6Al-4V service for complex bracket geometries",
    "Introduce PEEK injection molding — they currently machine from stock",
    "Offer powder-coat finishing in-house to eliminate their secondary vendor",
    "Propose laser-cut AR500 panels — faster turnaround than plasma",
    "Show additive prototyping capability for rapid design iterations",
    "Bundle turn-mill services with manifolds to reduce their lead time",
    "Upsell anodized aluminum covers as value-add to current enclosures",
    "Cross-sell carbon fiber composite options for weight reduction",
    "Offer electropolishing as a finishing service for their SS assemblies",
    "Propose plasma-cut liner plates as add-on to machined wear parts",
    "Introduce precision grinding for shaft components they buy elsewhere",
    "Cross-sell galvanized steel mounting hardware with bracket orders",
    "Upsell ultra-clean passivation service for their semiconductor parts",
    "Bundle nickel-plated connector housings with their defense orders",
    "Offer chrome-plated spool valves as upgrade to standard finish",
    "Pitch Inconel investment castings for high-temp turbine components",
    "Introduce autoclave-rated mold tooling for their composite program",
    "Cross-sell zinc-plated stampings for corrosion-prone applications",
    "Upsell diamond-turned optics — higher margin, fewer competitors",
    "Offer heat-treated ring blanks to vertically integrate their supply",
    "Propose conformal-coated PCB enclosures for outdoor radar units",
    "Pitch cathodic protection anodes — they currently import from overseas",
    "Bundle hard-anodized enclosures with their instrument chassis orders",
    "Cross-sell PTO shaft assemblies — they source from 2 separate vendors",
    "Introduce nitrided actuator rods — 3x longer service life",
    "Offer multi-shot molded seals alongside their insert molding orders",
    "Upsell silver-plated contacts for higher conductivity applications",
    "Propose robotic weld cell integration with their fixture assemblies",
    "Cross-sell machined wheel hubs — natural extension of bogie work",
    "Pitch ceramic wafer chucks — higher precision than their current metal ones",
  ],
  ai_similarEnquiries: [
    "RFQ-2026-0847 from Pacific Aero for similar Ti brackets — won at $312/ea",
    "RFQ-2025-1134 from BioSynth for PEEK housings — pending technical review",
    "RFQ-2025-0982 from Heartland Ag for stamped chassis — quoted last month",
    "No similar enquiries found in the last 12 months",
    "RFQ-2026-0091 from Northrop for aero shrouds — same alloy specs",
    "RFQ-2024-1188 from Cascade Fluid for manifold blocks — closed won at $175K",
    "RFQ-2025-0773 from Eclipse Semi for die-cast heat sinks — lost on lead time",
    "No similar enquiries found in the last 12 months",
    "RFQ-2025-0654 from MedCore for SS vessel components — in negotiation",
    "RFQ-2024-1042 from TerraCore for wear plates — repeat order likely in Q2",
    "RFQ-2025-1201 from NovaTech for precision arm joints — spec review ongoing",
    "RFQ-2024-0891 from Apex Turbine for turbine mounts — won at $960K",
    "No similar enquiries found in the last 12 months",
    "RFQ-2025-0467 from Sentinel for defense housings — ITAR-cleared, quoting",
    "No similar enquiries found in the last 12 months",
    "RFQ-2025-0312 from Cobalt Aero for turbine fixtures — in final negotiation",
    "No similar enquiries found in the last 12 months",
    "RFQ-2025-0889 from AutoPrime for progressive die brackets — won at $195K",
    "RFQ-2025-1067 from Vanguard for optics housings — lost on surface finish",
    "RFQ-2024-0756 from Atlas Heavy for forged flanges — repeat order placed",
    "RFQ-2025-0534 from Ironclad for EMI enclosures — MIL-STD qualified",
    "No similar enquiries found in the last 12 months",
    "RFQ-2025-0923 from ClearPath for instrument chassis — awaiting feedback",
    "RFQ-2024-1155 from Wolverine for gearbox housings — closed won at $340K",
    "RFQ-2024-0621 from Northrop for landing gear parts — multi-year LTA signed",
    "No similar enquiries found in the last 12 months",
    "RFQ-2025-0745 from Sierra Power for bus bar machining — quoting phase",
    "No similar enquiries found in the last 12 months",
    "RFQ-2025-0398 from Orion Rail for bogie castings — negotiating volume pricing",
    "RFQ-2025-1089 from Stellar Micro for wafer fixtures — lost on cleanroom cert",
  ],
};

function getCellValue(acc: Account, key: string): string | number {
  const val = (acc as unknown as Record<string, unknown>)[key];
  if (val === undefined || val === null) return "";
  return val as string | number;
}

function HealthDot({ health }: { health: Account["health"] }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "h-2 w-2 rounded-full shrink-0",
          health === "strong" && "bg-green-500",
          health === "at-risk" && "bg-amber-500",
          health === "new" && "bg-blue-400"
        )}
      />
      <span className="capitalize">{health === "at-risk" ? "At Risk" : health}</span>
    </div>
  );
}

interface AccountsPageProps {
  selectedAccountId?: string | null;
  onAccountSelect?: (accountId: string | null) => void;
}

const TOTAL_PAGES = 34;

export function AccountsPage({ selectedAccountId, onAccountSelect }: AccountsPageProps) {
  const [columns, setColumns] = useState<CRMColumn[]>(defaultColumns);
  const [aiData, setAiData] = useState<Record<string, string[]>>(builtInAiData);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedAccount = useMemo(
    () => mockAccounts.find((a) => a.id === selectedAccountId) ?? null,
    [selectedAccountId]
  );

  const drawerOpen = selectedAccount !== null;

  const handleDrawerOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onAccountSelect?.(null);
      }
    },
    [onAccountSelect]
  );

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
      const values = generateAIValues(prompt, mockAccounts);

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
            <Building2 className="h-5 w-5 text-warm-500" />
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Accounts
              </h1>
              {/* <p className="text-xs text-muted-foreground">
                CRM accounts overview
              </p> */}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5 font-semibold bg-warm-100 text-warm-600 border-warm-200"
            >
              1,012 accounts
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
                          ? "text-purple-600 bg-purple-50/60"
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
                            Describe the field and AI will populate values for all accounts.
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
                              placeholder="e.g. Credit risk score..."
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
                {mockAccounts.map((acc, rowIdx) => (
                  <tr
                    key={acc.id}
                    onClick={() => onAccountSelect?.(acc.id)}
                    className={cn(
                      "hover:bg-warm-50/50 transition-colors cursor-pointer",
                      selectedAccountId === acc.id && "bg-warm-100/70"
                    )}
                  >
                    {columns.map((col) => {
                      if (col.isAI) {
                        const vals = aiData[col.key];
                        const val = vals ? vals[rowIdx] || "" : "";
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-3.5 bg-purple-50/40 text-purple-700 font-medium min-w-[220px] max-w-[300px]"
                          >
                            {val}
                          </td>
                        );
                      }

                      if (col.key === "health") {
                        return (
                          <td key={col.key} className="px-3 py-3.5 whitespace-nowrap">
                            <HealthDot health={acc.health} />
                          </td>
                        );
                      }

                      if (col.key === "name") {
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-3.5 whitespace-nowrap"
                          >
                            <div className="font-medium text-foreground leading-tight">{acc.name}</div>
                            <div className="text-[10px] text-warm-500 mt-0.5">Owner: {acc.accountOwner}</div>
                          </td>
                        );
                      }

                      if (col.key === "totalValue" || col.key === "annualRevenue") {
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-3.5 font-medium text-foreground whitespace-nowrap"
                          >
                            {getCellValue(acc, col.key)}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={col.key}
                          className="px-3 py-3.5 text-warm-600 whitespace-nowrap"
                        >
                          {String(getCellValue(acc, col.key))}
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
            <span className="font-medium text-foreground">1,012</span> accounts
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

      <AccountDetailDrawer
        account={selectedAccount}
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
      />
    </div>
  );
}

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { mockDealsTable, Deal } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Handshake,
  Plus,
  Sparkles,
  Send,
  X,
} from "lucide-react";

interface CRMColumn {
  key: string;
  label: string;
  isAI?: boolean;
}

const defaultColumns: CRMColumn[] = [
  { key: "name", label: "Deal Name" },
  { key: "accountName", label: "Account" },
  { key: "contactName", label: "Contact" },
  { key: "dealOwner", label: "Owner" },
  { key: "stage", label: "Stage" },
  { key: "value", label: "Value" },
  { key: "probability", label: "Probability" },
  { key: "closeDate", label: "Close Date" },
  { key: "source", label: "Source" },
  { key: "product", label: "Product" },
  { key: "type", label: "Type" },
  { key: "lastActivity", label: "Last Activity" },
  { key: "nextStep", label: "Next Step" },
  { key: "createdDate", label: "Created" },
];

const stageColorMap: Record<string, { bg: string; text: string; dot: string }> = {
  Prospecting: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Qualification: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  Proposal: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Negotiation: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  "Closed Won": { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  "Closed Lost": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

function generateAIValues(prompt: string, deals: Deal[]): string[] {
  const lower = prompt.toLowerCase();

  if (lower.includes("risk") || lower.includes("score")) {
    const scores = ["Low", "Medium", "High", "Low", "Medium-High", "Low", "High", "Medium", "Low", "Medium", "High", "Medium-High", "Low", "Medium", "High", "Low", "Medium"];
    return deals.map((_, i) => scores[i % scores.length]);
  }

  if (lower.includes("competitor") || lower.includes("competition")) {
    const vals = ["Pacific Machining", "MidWest Metal", "Shenzhen MetalWorks", "None identified", "GlobalParts Inc", "None identified", "TechCast Co", "WindFab LLC", "SteelCo", "RoboSupply", "DefenseTech", "HeavyMfg Inc", "ChipFab Co", "FluidTech", "MoldMasters", "AeroParts Ltd", "LabSupply Co"];
    return deals.map((_, i) => vals[i % vals.length]);
  }

  const templates = [
    ["High", "Medium", "Low", "Medium-High", "Low", "High", "Medium", "Low", "Medium", "High", "Medium-High", "Low", "Medium", "High", "Low", "High", "Medium"],
    ["92%", "67%", "88%", "45%", "71%", "83%", "79%", "34%", "56%", "91%", "62%", "85%", "41%", "87%", "58%", "73%", "50%"],
    ["Strong fit", "Moderate fit", "Strong fit", "Exploring", "New lead", "Strong fit", "Moderate fit", "Exploring", "Moderate fit", "Strong fit", "New lead", "Strong fit", "Re-engage", "Strong fit", "New lead", "Strong fit", "Moderate fit"],
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

export function DealsPage({ onAccountClick }: DealsPageProps) {
  const [columns, setColumns] = useState<CRMColumn[]>(defaultColumns);
  const [aiData, setAiData] = useState<Record<string, string[]>>({});
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
              <p className="text-xs text-muted-foreground">
                CRM deals pipeline
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5 font-semibold bg-warm-100 text-warm-600 border-warm-200"
            >
              {mockDealsTable.length} deals
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
                          <Sparkles className="h-2.5 w-2.5 text-purple-500" />
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
                          <Plus className="h-3 w-3" />
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
                  >
                    {columns.map((col) => {
                      if (col.isAI) {
                        const vals = aiData[col.key];
                        const val = vals ? vals[rowIdx] || "" : "";
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-2.5 bg-purple-50/40 text-purple-700 font-medium whitespace-nowrap"
                          >
                            {val}
                          </td>
                        );
                      }

                      if (col.key === "name") {
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap"
                          >
                            {deal.name}
                          </td>
                        );
                      }

                      if (col.key === "accountName") {
                        return (
                          <td key={col.key} className="px-3 py-2.5 whitespace-nowrap">
                            <AccountTag
                              name={deal.accountName}
                              onClick={onAccountClick ? () => onAccountClick(deal.accountId) : undefined}
                            />
                          </td>
                        );
                      }

                      if (col.key === "stage") {
                        return (
                          <td key={col.key} className="px-3 py-2.5 whitespace-nowrap">
                            <StageBadge stage={deal.stage} />
                          </td>
                        );
                      }

                      if (col.key === "probability") {
                        return (
                          <td key={col.key} className="px-3 py-2.5 whitespace-nowrap">
                            <ProbabilityCell value={deal.probability} />
                          </td>
                        );
                      }

                      if (col.key === "value") {
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap"
                          >
                            {deal.value}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={col.key}
                          className="px-3 py-2.5 text-warm-600 whitespace-nowrap"
                        >
                          {String(getCellValue(deal, col.key))}
                        </td>
                      );
                    })}
                    {/* Empty cell for add-column column */}
                    <td className="px-2 py-2.5 w-10" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

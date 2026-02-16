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
  Send,
  X,
} from "lucide-react";

interface CRMColumn {
  key: string;
  label: string;
  isAI?: boolean;
}

const defaultColumns: CRMColumn[] = [
  { key: "name", label: "Account Name" },
  { key: "industry", label: "Industry" },
  { key: "primaryContact", label: "Primary Contact" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "accountOwner", label: "Owner" },
  { key: "annualRevenue", label: "Annual Revenue" },
  { key: "employees", label: "Employees" },
  { key: "dealCount", label: "Deals" },
  { key: "totalValue", label: "Pipeline Value" },
  { key: "health", label: "Health" },
  { key: "stage", label: "Stage" },
  { key: "region", label: "Region" },
  { key: "lastTouch", label: "Last Activity" },
  { key: "nextAction", label: "Next Step" },
  { key: "createdDate", label: "Created" },
];

const aiColumnResponses: Record<string, (acc: Account) => string> = {
  "credit risk": (acc) => {
    const map: Record<string, string> = {
      "acc-1": "Low", "acc-2": "Medium", "acc-3": "Low", "acc-4": "Pending",
      "acc-5": "Pending", "acc-6": "Low", "acc-7": "Low", "acc-8": "High",
      "acc-9": "Medium", "acc-10": "Low", "acc-11": "Pending", "acc-12": "Low",
      "acc-13": "High", "acc-14": "Low", "acc-15": "Medium",
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
    ["High", "Medium", "Low", "Medium-High", "Low", "High", "Medium", "Low", "Medium", "High", "Medium-High", "Low", "Medium", "High", "Low"],
    ["92%", "67%", "88%", "45%", "71%", "83%", "79%", "34%", "56%", "91%", "62%", "85%", "41%", "87%", "58%"],
    ["Strong fit", "Moderate fit", "Strong fit", "Exploring", "New lead", "Strong fit", "Moderate fit", "Exploring", "Moderate fit", "Strong fit", "New lead", "Strong fit", "Re-engage", "Strong fit", "New lead"],
  ];
  const chosen = templates[Math.floor(Math.random() * templates.length)];
  return accounts.map((_, i) => chosen[i % chosen.length]);
}

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

export function AccountsPage({ selectedAccountId, onAccountSelect }: AccountsPageProps) {
  const [columns, setColumns] = useState<CRMColumn[]>(defaultColumns);
  const [aiData, setAiData] = useState<Record<string, string[]>>({});
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
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
              <p className="text-xs text-muted-foreground">
                CRM accounts overview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5 font-semibold bg-warm-100 text-warm-600 border-warm-200"
            >
              {mockAccounts.length} accounts
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
                            className="px-3 py-2.5 bg-purple-50/40 text-purple-700 font-medium whitespace-nowrap"
                          >
                            {val}
                          </td>
                        );
                      }

                      if (col.key === "health") {
                        return (
                          <td key={col.key} className="px-3 py-2.5 whitespace-nowrap">
                            <HealthDot health={acc.health} />
                          </td>
                        );
                      }

                      if (col.key === "name") {
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap"
                          >
                            {acc.name}
                          </td>
                        );
                      }

                      if (col.key === "employees") {
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-2.5 text-warm-600 whitespace-nowrap"
                          >
                            {acc.employees.toLocaleString()}
                          </td>
                        );
                      }

                      if (col.key === "totalValue" || col.key === "annualRevenue") {
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap"
                          >
                            {getCellValue(acc, col.key)}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={col.key}
                          className="px-3 py-2.5 text-warm-600 whitespace-nowrap"
                        >
                          {String(getCellValue(acc, col.key))}
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

      <AccountDetailDrawer
        account={selectedAccount}
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
      />
    </div>
  );
}

"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  mockDeals,
  mockAccounts,
  DealCard,
  Stage,
  stageConfig,
  stageColors,
} from "@/lib/mock-data";
import { NavSidebar, Page } from "@/components/nav-sidebar";
import { StageNavigator } from "@/components/stage-navigator";
import { AISidebar } from "@/components/ai-sidebar";
import { AccountsPage } from "@/components/accounts-page";
import { DealsPage } from "@/components/deals-page";
import { ConciergePage } from "@/components/concierge-page";
import { CoworkMode } from "@/components/cowork-mode";
import { SettingsPage } from "@/components/settings-page";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Flame,
  Sparkles,
  Zap,
  CheckCircle,
  LayoutGrid,
  TrendingUp,
  Building2,
  Clock,
  ChevronRight,
  GitMerge,
  RotateCcw,
  AlertCircle,
  ArrowUpRight,
  Target,
} from "lucide-react";

type AppMode = "action" | "detail" | "cowork";

export function Workspace() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mode, setMode] = useState<AppMode>("action");
  const [activePage, setActivePage] = useState<Page>(() => {
    const p = searchParams.get("page");
    if (p === "accounts" || p === "deals" || p === "concierge" || p === "home" || p === "settings") return p;
    return "home";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeStage, setActiveStage] = useState<Stage | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    () => searchParams.get("accountId")
  );
  const [approvedDeals, setApprovedDeals] = useState<Set<string>>(new Set());

  useEffect(() => {
    const params = new URLSearchParams();
    if (activePage !== "home") {
      params.set("page", activePage);
    }
    if (selectedAccountId) {
      params.set("accountId", selectedAccountId);
    }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "/", { scroll: false });
  }, [activePage, selectedAccountId, router]);

  const priorityDeals = useMemo(
    () => mockDeals.filter((d) => d.priority && !approvedDeals.has(d.id)),
    [approvedDeals]
  );

  const stageDeals = useMemo(() => {
    if (!activeStage) return mockDeals.filter((d) => !d.priority && !approvedDeals.has(d.id));
    return mockDeals.filter(
      (d) => d.stage === activeStage && !d.priority && !approvedDeals.has(d.id)
    );
  }, [activeStage, approvedDeals]);

  const dealCounts = useMemo(() => {
    const counts: Record<Stage, number> = { prospecting: 0, technical: 0, quoting: 0, negotiation: 0 };
    mockDeals.filter((d) => !approvedDeals.has(d.id)).forEach((d) => counts[d.stage]++);
    return counts;
  }, [approvedDeals]);

  const selectedDeal = useMemo(
    () => mockDeals.find((d) => d.id === selectedDealId) || null,
    [selectedDealId]
  );

  const handleApprove = useCallback((dealId: string) => {
    const deal = mockDeals.find((d) => d.id === dealId);
    setApprovedDeals((prev) => new Set([...prev, dealId]));
    setSelectedDealId(null);
    setMode("action");
    if (deal) {
      toast.success(`Approved: ${deal.title}`, { description: `${deal.company} — moved forward` });
    }
  }, []);

  const handleRework = useCallback((dealId: string) => {
    const deal = mockDeals.find((d) => d.id === dealId);
    setSelectedDealId(null);
    setMode("action");
    if (deal) {
      toast.info(`Sent back for rework: ${deal.title}`, { description: "AI will revise and notify you when ready" });
    }
  }, []);

  const handleCowork = useCallback((dealId: string) => {
    setSelectedDealId(dealId);
    setMode("cowork");
  }, []);

  const handleItemClick = useCallback((dealId: string) => {
    setSelectedDealId(dealId);
    setMode("detail");
  }, []);

  const handleBack = useCallback(() => {
    setMode("action");
    setSelectedDealId(null);
  }, []);

  const handleNavigate = useCallback((page: Page) => {
    setActivePage(page);
    setMode("action");
    setSelectedDealId(null);
    setSelectedAccountId(null);
  }, []);

  const handleAccountClickFromDeals = useCallback((accountId: string) => {
    setActivePage("accounts");
    setSelectedAccountId(accountId);
    setMode("action");
    setSelectedDealId(null);
  }, []);

  // Cowork mode — full screen
  if (mode === "cowork" && selectedDeal) {
    return (
      <>
        <NavSidebar activePage={activePage} onNavigate={handleNavigate} />
        <div className="ml-12">
          <CoworkMode deal={selectedDeal} onBack={handleBack} onApprove={handleApprove} />
        </div>
      </>
    );
  }

  // Detail mode — full screen view of a deal (replaces modal)
  if (mode === "detail" && selectedDeal) {
    return (
      <>
        <NavSidebar activePage={activePage} onNavigate={handleNavigate} />
        <div className="ml-12">
          <CoworkMode
            deal={selectedDeal}
            onBack={handleBack}
            onApprove={handleApprove}
            readOnly
            onCowork={() => setMode("cowork")}
            onRework={() => handleRework(selectedDeal.id)}
          />
        </div>
      </>
    );
  }

  // Accounts page
  if (activePage === "accounts") {
    return (
      <div className="min-h-screen bg-background">
        <NavSidebar activePage={activePage} onNavigate={handleNavigate} />
        <div className="ml-12">
          <AccountsPage
            selectedAccountId={selectedAccountId}
            onAccountSelect={setSelectedAccountId}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    );
  }

  // Deals page
  if (activePage === "deals") {
    return (
      <div className="min-h-screen bg-background">
        <NavSidebar activePage={activePage} onNavigate={handleNavigate} />
        <div className="ml-12">
          <DealsPage onAccountClick={handleAccountClickFromDeals} />
        </div>
      </div>
    );
  }

  // Concierge page
  if (activePage === "concierge") {
    return (
      <div className="min-h-screen bg-background">
        <NavSidebar activePage={activePage} onNavigate={handleNavigate} />
        <div className="ml-12">
          <ConciergePage />
        </div>
      </div>
    );
  }

  // Settings page
  if (activePage === "settings") {
    return (
      <div className="min-h-screen bg-background">
        <NavSidebar activePage={activePage} onNavigate={handleNavigate} />
        <div className="ml-12">
          <SettingsPage />
        </div>
      </div>
    );
  }

  // Action mode — main dashboard
  return (
    <div className="min-h-screen bg-background">
      <NavSidebar activePage={activePage} onNavigate={handleNavigate} />
      <AISidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div
        className="ml-12 transition-all duration-300"
        style={{ marginRight: sidebarOpen ? "340px" : "0px" }}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-warm-200/40 px-6 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  Hey Derek
                </h1>
                <p className="text-xs text-muted-foreground">
                  here&apos;s what needs to move today
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <LayoutGrid className="h-3 w-3" />
                <span className="font-medium">{mockDeals.filter((d) => !approvedDeals.has(d.id)).length}</span>
                <span>active</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="font-medium">{approvedDeals.size}</span>
                <span>approved</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-warm-600" />
                <span className="font-medium">$7.2M</span>
                <span>pipeline</span>
              </div>
            </div>
          </div>
        </header>

        {/* Top split pane: Priority list + Accounts */}
        <div className="px-6 pt-4 pb-3 flex gap-4" style={{ minHeight: "320px" }}>
          {/* Left: Priority list */}
          <div className="flex-[3] min-w-0 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-3.5 w-3.5 text-amber-600" />
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Needs your attention
              </h2>
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-semibold bg-amber-50 text-amber-700 border-amber-200">
                {priorityDeals.length}
              </Badge>
            </div>
            <div className="flex-1 rounded-xl border border-warm-200/60 overflow-hidden bg-card">
              <div className="divide-y divide-warm-200/40">
                {priorityDeals.map((deal) => (
                  <ListRow
                    key={deal.id}
                    deal={deal}
                    onClick={() => handleItemClick(deal.id)}
                    onApprove={() => handleApprove(deal.id)}
                    onCowork={() => handleCowork(deal.id)}
                    onRework={() => handleRework(deal.id)}
                  />
                ))}
                {priorityDeals.length === 0 && (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1.5" />
                    All clear — nothing urgent right now.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Accounts to look at */}
          <div className="flex-[2] min-w-0 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-3.5 w-3.5 text-warm-500" />
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Accounts to look at
              </h2>
            </div>
            <div className="flex-1 rounded-xl border border-warm-200/60 overflow-hidden bg-card">
              <div className="divide-y divide-warm-200/40">
                {mockAccounts.slice(0, 4).map((acc) => (
                  <div key={acc.id} className="px-4 py-3 hover:bg-warm-50/50 cursor-pointer transition-colors group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "h-2 w-2 rounded-full",
                          acc.health === "strong" && "bg-green-500",
                          acc.health === "at-risk" && "bg-amber-500",
                          acc.health === "new" && "bg-blue-400",
                        )} />
                        <span className="text-sm font-medium text-foreground">{acc.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-warm-600">{acc.totalValue}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>{acc.industry}</span>
                      <span className="text-warm-300">·</span>
                      <span>{acc.dealCount} deals</span>
                      <span className="text-warm-300">·</span>
                      <Clock className="h-2.5 w-2.5" />
                      <span>{acc.lastTouch}</span>
                    </div>
                    <p className="text-[11px] text-warm-500 mt-1 flex items-center gap-1">
                      <ArrowUpRight className="h-2.5 w-2.5" />
                      {acc.nextAction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stage navigator */}
        <div className="sticky top-[68px] z-20 bg-background/80 backdrop-blur-md px-6 py-2.5 border-b border-warm-200/40">
          <StageNavigator activeStage={activeStage} onStageSelect={setActiveStage} dealCounts={dealCounts} />
        </div>

        {/* Bottom list with AI Columns */}
        <section className="px-6 py-4 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-warm-500" />
            <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              {activeStage ? stageConfig[activeStage].label : "All stages"}
            </h2>
            {activeStage && (
              <span className="text-[11px] text-muted-foreground">— {stageConfig[activeStage].description}</span>
            )}
          </div>

          {/* List table with AI column */}
          <div className="rounded-xl border border-warm-200/60 overflow-hidden bg-card">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_140px_100px_100px_80px_120px_180px] gap-0 bg-warm-50/60 border-b border-warm-200/60 text-[10px] font-semibold text-warm-500 uppercase tracking-wider">
              <div className="px-4 py-2">Title</div>
              <div className="px-3 py-2">Company</div>
              <div className="px-3 py-2">Stage</div>
              <div className="px-3 py-2">Value</div>
              <div className="px-3 py-2 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-purple-500" />
                Risk
              </div>
              <div className="px-3 py-2">Last Activity</div>
              <div className="px-3 py-2 text-right">Actions</div>
            </div>
            {/* Table rows */}
            <div className="divide-y divide-warm-200/40">
              {stageDeals.map((deal) => (
                <StageListRow
                  key={deal.id}
                  deal={deal}
                  onClick={() => handleItemClick(deal.id)}
                  onApprove={() => handleApprove(deal.id)}
                  onCowork={() => handleCowork(deal.id)}
                  onRework={() => handleRework(deal.id)}
                />
              ))}
              {stageDeals.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No items in this stage.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── List Row (Priority section) ──────────────────────────────────────────

function ListRow({
  deal,
  onClick,
  onApprove,
  onCowork,
  onRework,
}: {
  deal: DealCard;
  onClick: () => void;
  onApprove: () => void;
  onCowork: () => void;
  onRework: () => void;
}) {
  const stageColor = stageColors[deal.stage];
  return (
    <div
      onClick={onClick}
      className="px-4 py-3 hover:bg-warm-50/50 cursor-pointer transition-colors group flex items-center gap-3"
    >
      {/* Stage dot */}
      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: stageColor }} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">{deal.title}</span>
          {deal.artifact.status === "needs-review" && (
            <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
          <Building2 className="h-2.5 w-2.5" />
          <span>{deal.company}</span>
          <span className="text-warm-300">·</span>
          <span>{deal.value}</span>
          <span className="text-warm-300">·</span>
          <Clock className="h-2.5 w-2.5" />
          <span>{deal.lastActivity}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onRework(); }}
          className="h-6 px-2 text-[10px] font-medium rounded-md border border-warm-200 text-warm-500 hover:bg-warm-100 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="h-2.5 w-2.5" />
          Rework
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onCowork(); }}
          className="h-6 px-2 text-[10px] font-medium rounded-md border border-warm-200 text-warm-600 hover:bg-warm-100 transition-colors flex items-center gap-1"
        >
          <GitMerge className="h-2.5 w-2.5" />
          Cowork
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onApprove(); }}
          className="h-6 px-2.5 text-[10px] font-medium rounded-md bg-warm-800 text-warm-50 hover:bg-warm-700 transition-colors flex items-center gap-1"
        >
          <CheckCircle className="h-2.5 w-2.5" />
          Approve
        </button>
      </div>

      <ChevronRight className="h-3.5 w-3.5 text-warm-300 shrink-0" />
    </div>
  );
}

// ─── Stage List Row (Bottom table with AI column) ─────────────────────────

function StageListRow({
  deal,
  onClick,
  onApprove,
  onCowork,
  onRework,
}: {
  deal: DealCard;
  onClick: () => void;
  onApprove: () => void;
  onCowork: () => void;
  onRework: () => void;
}) {
  const stageColor = stageColors[deal.stage];
  const riskScore = deal.aiRiskScore ?? 0;
  const riskColor = riskScore > 50 ? "text-red-600" : riskScore > 25 ? "text-amber-600" : "text-green-600";
  const riskBg = riskScore > 50 ? "bg-red-50" : riskScore > 25 ? "bg-amber-50" : "bg-green-50";

  return (
    <div
      onClick={onClick}
      className="grid grid-cols-[1fr_140px_100px_100px_80px_120px_180px] gap-0 hover:bg-warm-50/50 cursor-pointer transition-colors group items-center"
    >
      <div className="px-4 py-2.5 flex items-center gap-2 min-w-0">
        <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: stageColor }} />
        <span className="text-[13px] font-medium text-foreground truncate">{deal.title}</span>
        {deal.artifact.status === "needs-review" && (
          <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
        )}
      </div>
      <div className="px-3 py-2.5 text-[12px] text-warm-600 truncate">{deal.company}</div>
      <div className="px-3 py-2.5">
        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium" style={{ backgroundColor: `${stageColor}15`, color: stageColor, borderColor: `${stageColor}30` }}>
          {stageConfig[deal.stage].label.split(" ")[0]}
        </Badge>
      </div>
      <div className="px-3 py-2.5 text-[12px] font-medium text-foreground">{deal.value}</div>
      <div className="px-3 py-2.5">
        <span className={cn("text-[11px] font-semibold px-1.5 py-0.5 rounded", riskColor, riskBg)}>
          {riskScore}%
        </span>
      </div>
      <div className="px-3 py-2.5 text-[11px] text-muted-foreground">{deal.lastActivity}</div>
      <div className="px-3 py-2.5 flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onRework(); }}
          className="h-6 px-2 text-[10px] font-medium rounded-md border border-warm-200 text-warm-500 hover:bg-warm-100 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="h-2.5 w-2.5" />
          Rework
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onCowork(); }}
          className="h-6 px-2 text-[10px] font-medium rounded-md border border-warm-200 text-warm-600 hover:bg-warm-100 transition-colors flex items-center gap-1"
        >
          <GitMerge className="h-2.5 w-2.5" />
          Cowork
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onApprove(); }}
          className="h-6 px-2.5 text-[10px] font-medium rounded-md bg-warm-800 text-warm-50 hover:bg-warm-700 transition-colors flex items-center gap-1"
        >
          <CheckCircle className="h-2.5 w-2.5" />
          Approve
        </button>
      </div>
    </div>
  );
}

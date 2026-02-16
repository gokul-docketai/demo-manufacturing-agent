"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  RFQ,
  RFQSource,
  ConciergeMessage,
  MaterialAlternative,
  MaterialThreadMessage,
  MaterialPickInfo,
  mockRFQs,
} from "@/lib/concierge-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { QuoteCanvasDrawer, QuoteData } from "@/components/quote-canvas-drawer";
import { MaterialExplorerPanel } from "@/components/material-thread-drawer";
import {
  Inbox,
  Send,
  Bot,
  User,
  Paperclip,
  FileText,
  ChevronDown,
  ChevronRight,
  Clock,
  Building2,
  DollarSign,
  Search,
  MessageSquare,
  Mail,
  Pencil,
  CheckCircle,
  X,
  Ruler,
  ClipboardList,
  HelpCircle,
  Database,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Phone,
  Globe,
  PenLine,
  FlaskConical,
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  AlertTriangle,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

// ─── Main Concierge Page ────────────────────────────────────────────────────

export function ConciergePage() {
  const [selectedRFQId, setSelectedRFQId] = useState<string | null>(
    mockRFQs[0]?.id || null
  );
  const [conversations, setConversations] = useState<
    Record<string, ConciergeMessage[]>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [quoteDrawerOpen, setQuoteDrawerOpen] = useState(false);
  const [quoteDrawerData, setQuoteDrawerData] = useState<QuoteData | null>(null);

  // Material thread state
  const [materialDrawerOpen, setMaterialDrawerOpen] = useState(false);
  const [activeMaterial, setActiveMaterial] = useState<MaterialAlternative | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, MaterialPickInfo>>({});
  const [materialThreads, setMaterialThreads] = useState<Record<string, MaterialThreadMessage[]>>({});

  const selectedRFQ = mockRFQs.find((r) => r.id === selectedRFQId) || null;

  const filteredRFQs = mockRFQs.filter(
    (rfq) =>
      rfq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfq.accountName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMessages = useCallback(
    (rfqId: string): ConciergeMessage[] => {
      return conversations[rfqId] || [];
    },
    [conversations]
  );

  const setMessages = useCallback(
    (rfqId: string, msgs: ConciergeMessage[] | ((prev: ConciergeMessage[]) => ConciergeMessage[])) => {
      setConversations((prev) => {
        const current = prev[rfqId] || [];
        const next = typeof msgs === "function" ? msgs(current) : msgs;
        return { ...prev, [rfqId]: next };
      });
    },
    []
  );

  const handleOpenQuote = useCallback((data: QuoteData) => {
    setQuoteDrawerData(data);
    setQuoteDrawerOpen(true);
  }, []);

  const handleExploreMaterial = useCallback(
    (material: MaterialAlternative, messageId: string) => {
      setActiveMaterial(material);
      setActiveMessageId(messageId);
      setMaterialDrawerOpen(true);
    },
    []
  );

  const handleSelectMaterial = useCallback(
    (pick: MaterialPickInfo) => {
      if (!activeMessageId || !selectedRFQId) return;

      setSelectedMaterials((prev) => ({
        ...prev,
        [activeMessageId]: pick,
      }));

      // Inject a confirmation message into the main conversation
      const primaryName = activeMaterial?.primaryMaterial || "the original material";
      const confirmMsg: ConciergeMessage = {
        id: `material-confirm-${Date.now()}`,
        role: "user",
        content: `I've selected **${pick.grade}** as the alternative for ${primaryName}. Cost impact: ${pick.costDelta}. Stock: ${pick.availableStock}.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages(selectedRFQId, (prev) => [...prev, confirmMsg]);
    },
    [activeMessageId, selectedRFQId, activeMaterial, setMessages]
  );

  const handleMaterialThreadMessagesChange = useCallback(
    (msgs: MaterialThreadMessage[]) => {
      if (!activeMaterial) return;
      setMaterialThreads((prev) => ({
        ...prev,
        [activeMaterial.id]: msgs,
      }));
    },
    [activeMaterial]
  );

  // Build a brief RFQ summary for the material sub-agent
  const rfqSummary = useMemo(() => {
    if (!selectedRFQ) return "";
    return `RFQ: ${selectedRFQ.title}\nAccount: ${selectedRFQ.accountName}\nContact: ${selectedRFQ.contactName}\nValue: ${selectedRFQ.dealValue}\nDescription: ${selectedRFQ.description.slice(0, 500)}`;
  }, [selectedRFQ]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 z-30 bg-background/80 backdrop-blur-md border-b border-warm-200/40 px-6 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Inbox className="h-5 w-5 text-warm-500" />
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Concierge
              </h1>
              <p className="text-xs text-muted-foreground">
                RFQ processing &amp; quoting assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5 font-semibold bg-warm-100 text-warm-600 border-warm-200"
            >
              {mockRFQs.length} RFQs
            </Badge>
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5 font-semibold bg-amber-50 text-amber-700 border-amber-200"
            >
              {mockRFQs.filter((r) => r.status === "new").length} new
            </Badge>
          </div>
        </div>
      </header>

      {/* Two-panel layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left sidebar — RFQ list */}
        <div className="w-[320px] shrink-0 border-r border-warm-200/60 flex flex-col min-h-0 bg-card">
          {/* Search */}
          <div className="p-3 border-b border-warm-200/40">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-warm-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search RFQs..."
                className="h-8 pl-8 text-xs bg-warm-50 border-warm-200 placeholder:text-warm-400 focus-visible:ring-warm-300"
              />
            </div>
          </div>

          {/* RFQ List */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-warm-200/40">
              {filteredRFQs.map((rfq) => (
                <RFQListItem
                  key={rfq.id}
                  rfq={rfq}
                  isActive={rfq.id === selectedRFQId}
                  hasMessages={(conversations[rfq.id]?.length || 0) > 0}
                  onClick={() => setSelectedRFQId(rfq.id)}
                />
              ))}
              {filteredRFQs.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No RFQs match your search.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Center panel — Conversation */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-background">
          {selectedRFQ ? (
            <ConversationPanel
              rfq={selectedRFQ}
              messages={getMessages(selectedRFQ.id)}
              setMessages={(msgs) => setMessages(selectedRFQ.id, msgs)}
              onOpenQuote={handleOpenQuote}
              onExploreMaterial={handleExploreMaterial}
              selectedMaterials={selectedMaterials}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Inbox className="h-10 w-10 mx-auto mb-3 text-warm-300" />
                <p className="text-sm font-medium">Select an RFQ to begin</p>
                <p className="text-xs mt-1">
                  Choose from the list on the left to start processing
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right panel — Material Explorer (conditional) */}
        {materialDrawerOpen && activeMaterial && (
          <div className="w-[420px] shrink-0 border-l border-warm-200/60 flex flex-col min-h-0 bg-card">
            <MaterialExplorerPanel
              material={activeMaterial}
              rfqSummary={rfqSummary}
              messages={materialThreads[activeMaterial.id] || []}
              onMessagesChange={handleMaterialThreadMessagesChange}
              onSelectMaterial={handleSelectMaterial}
              selectedPick={activeMessageId ? (selectedMaterials[activeMessageId] || null) : null}
              onClose={() => setMaterialDrawerOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Quote Canvas Drawer */}
      <QuoteCanvasDrawer
        open={quoteDrawerOpen}
        onOpenChange={setQuoteDrawerOpen}
        quoteData={quoteDrawerData}
      />
    </div>
  );
}

// ─── Source Config ───────────────────────────────────────────────────────────

const sourceConfig: Record<RFQSource, { icon: typeof Mail; label: string; className: string }> = {
  email: {
    icon: Mail,
    label: "Email",
    className: "bg-blue-50 text-blue-600 border-blue-200",
  },
  call: {
    icon: Phone,
    label: "Call",
    className: "bg-violet-50 text-violet-600 border-violet-200",
  },
  manual: {
    icon: PenLine,
    label: "Manual",
    className: "bg-warm-50 text-warm-600 border-warm-200",
  },
  "web-form": {
    icon: Globe,
    label: "Web Form",
    className: "bg-teal-50 text-teal-600 border-teal-200",
  },
};

// ─── RFQ List Item ──────────────────────────────────────────────────────────

function RFQListItem({
  rfq,
  isActive,
  hasMessages,
  onClick,
}: {
  rfq: RFQ;
  isActive: boolean;
  hasMessages: boolean;
  onClick: () => void;
}) {
  const statusConfig = {
    new: {
      label: "New",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    "in-progress": {
      label: "In Progress",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    quoted: {
      label: "Quoted",
      className: "bg-green-50 text-green-700 border-green-200",
    },
  };

  const status = statusConfig[rfq.status];
  const source = sourceConfig[rfq.source];
  const SourceIcon = source.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 transition-colors hover:bg-warm-50/50",
        isActive && "bg-warm-100/70 border-l-2 border-l-warm-600"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-[13px] font-medium text-foreground leading-tight line-clamp-2">
          {rfq.title}
        </span>
        <Badge
          variant="secondary"
          className={cn("text-[9px] px-1.5 py-0 font-semibold shrink-0", status.className)}
        >
          {status.label}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
        <Building2 className="h-2.5 w-2.5 shrink-0" />
        <span className="truncate">{rfq.accountName}</span>
        <span className="text-warm-300">|</span>
        <DollarSign className="h-2.5 w-2.5 shrink-0" />
        <span>{rfq.dealValue}</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-warm-400 mt-1">
        <Clock className="h-2.5 w-2.5 shrink-0" />
        <span>{rfq.receivedAt}</span>
        <span className="text-warm-300">|</span>
        <span className={cn("inline-flex items-center gap-1 px-1.5 py-0 rounded-full border text-[9px] font-semibold", source.className)}>
          <SourceIcon className="h-2.5 w-2.5" />
          {source.label}
        </span>
        {hasMessages && (
          <>
            <span className="text-warm-300">|</span>
            <MessageSquare className="h-2.5 w-2.5 shrink-0" />
            <span>Active</span>
          </>
        )}
      </div>
    </button>
  );
}

// ─── Conversation Panel ─────────────────────────────────────────────────────

function ConversationPanel({
  rfq,
  messages,
  setMessages,
  onOpenQuote,
  onExploreMaterial,
  selectedMaterials,
}: {
  rfq: RFQ;
  messages: ConciergeMessage[];
  setMessages: (msgs: ConciergeMessage[] | ((prev: ConciergeMessage[]) => ConciergeMessage[])) => void;
  onOpenQuote: (data: QuoteData) => void;
  onExploreMaterial: (material: MaterialAlternative, messageId: string) => void;
  selectedMaterials: Record<string, MaterialPickInfo>;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitializedRef = useRef<string | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-trigger agent analysis when an RFQ is first opened
  useEffect(() => {
    if (hasInitializedRef.current === rfq.id) return;
    if (messages.length > 0) {
      hasInitializedRef.current = rfq.id;
      return;
    }

    hasInitializedRef.current = rfq.id;
    triggerAgentAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rfq.id]);

  const triggerAgentAnalysis = async () => {
    setIsLoading(true);

    // Add a loading message for the agent
    const loadingMsg: ConciergeMessage = {
      id: `agent-loading-${Date.now()}`,
      role: "agent",
      content: "",
      timestamp: "Now",
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      const response = await fetch("/api/concierge/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfqId: rfq.id,
          messages: messages.filter((m) => !m.isLoading),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const agentMsg: ConciergeMessage = {
        id: `agent-${Date.now()}`,
        role: "agent",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Replace the loading message with the real one
      setMessages((prev) => prev.filter((m) => !m.isLoading).concat(agentMsg));
    } catch (error) {
      console.error("Agent analysis error:", error);
      const errorMsg: ConciergeMessage = {
        id: `agent-error-${Date.now()}`,
        role: "agent",
        content:
          "I encountered an error processing this RFQ. Please check the OpenAI API key configuration and try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => prev.filter((m) => !m.isLoading).concat(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ConciergeMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    // Add loading message
    const loadingMsg: ConciergeMessage = {
      id: `agent-loading-${Date.now()}`,
      role: "agent",
      content: "",
      timestamp: "Now",
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      const response = await fetch("/api/concierge/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfqId: rfq.id,
          messages: updatedMessages.filter((m) => !m.isLoading),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const agentMsg: ConciergeMessage = {
        id: `agent-${Date.now()}`,
        role: "agent",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => prev.filter((m) => !m.isLoading).concat(agentMsg));
    } catch (error) {
      console.error("Send message error:", error);
      const errorMsg: ConciergeMessage = {
        id: `agent-error-${Date.now()}`,
        role: "agent",
        content:
          "I encountered an error generating a response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => prev.filter((m) => !m.isLoading).concat(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Conversation header — fixed at top */}
      <div className="shrink-0 px-5 py-3 border-b border-warm-200/60 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {rfq.title}
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {rfq.accountName} &middot; {rfq.contactName} &middot;{" "}
              {rfq.dealValue}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(() => {
              const src = sourceConfig[rfq.source];
              const SrcIcon = src.icon;
              return (
                <Badge
                  variant="secondary"
                  className={cn("text-[10px] px-2 py-0.5 font-semibold gap-1", src.className)}
                >
                  <SrcIcon className="h-3 w-3" />
                  {src.label}
                </Badge>
              );
            })()}
            <Badge
              variant="secondary"
              className={cn(
                "text-[10px] px-2 py-0.5 font-semibold",
                rfq.status === "new" &&
                  "bg-blue-50 text-blue-700 border-blue-200",
                rfq.status === "in-progress" &&
                  "bg-amber-50 text-amber-700 border-amber-200",
                rfq.status === "quoted" &&
                  "bg-green-50 text-green-700 border-green-200"
              )}
            >
              {rfq.status === "new"
                ? "New"
                : rfq.status === "in-progress"
                  ? "In Progress"
                  : "Quoted"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages area — scrollable middle section */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* RFQ card — always the first "message" */}
          <RFQCard rfq={rfq} />

          {/* Conversation messages */}
          {messages.map((msg) =>
            msg.isLoading ? (
              <TypingIndicator key={msg.id} />
            ) : (
              <MessageBubble
                key={msg.id}
                message={msg}
                onOpenQuote={onOpenQuote}
                onExploreMaterial={onExploreMaterial}
                selectedMaterialPick={selectedMaterials[msg.id] || null}
              />
            )
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar — pinned at bottom */}
      <div className="shrink-0 p-4 border-t border-warm-200/60 bg-card/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Reply..."
            disabled={isLoading}
            className="h-10 text-sm bg-warm-50 border-warm-200 placeholder:text-warm-400 focus-visible:ring-warm-300"
          />
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="h-10 w-10 p-0 bg-warm-800 hover:bg-warm-700 text-warm-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── RFQ Card (First message) ───────────────────────────────────────────────

const attachmentTypeConfig = {
  drawing: {
    icon: Ruler,
    label: "Engineering Drawing",
    headerBg: "bg-indigo-50/80",
    headerBorder: "border-indigo-200/60",
    headerText: "text-indigo-700",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    badgeBg: "bg-indigo-100 text-indigo-700 border-indigo-200",
    contentBorder: "border-indigo-100/60",
  },
  specs: {
    icon: ClipboardList,
    label: "Technical Specification",
    headerBg: "bg-emerald-50/80",
    headerBorder: "border-emerald-200/60",
    headerText: "text-emerald-700",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badgeBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
    contentBorder: "border-emerald-100/60",
  },
  questions: {
    icon: HelpCircle,
    label: "Supplier Questions",
    headerBg: "bg-amber-50/80",
    headerBorder: "border-amber-200/60",
    headerText: "text-amber-700",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badgeBg: "bg-amber-100 text-amber-700 border-amber-200",
    contentBorder: "border-amber-100/60",
  },
};

function AttachmentContentRenderer({ content, type }: { content: string; type: "questions" | "specs" | "drawing" }) {
  if (type === "questions") {
    const lines = content.split("\n").filter((l) => l.trim());
    return (
      <div className="space-y-2 py-1">
        {lines.map((line, i) => {
          const match = line.match(/^(\d+)\.\s*(.*)/);
          if (!match) return <p key={i} className="text-[13px] text-foreground/70">{line}</p>;
          return (
            <div key={i} className="flex gap-2.5 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold flex items-center justify-center mt-0.5">
                {match[1]}
              </span>
              <p className="text-[13px] text-foreground/80 leading-relaxed pt-0.5">{match[2]}</p>
            </div>
          );
        })}
      </div>
    );
  }

  const sections = content.split("\n\n").filter((s) => s.trim());
  return (
    <div className="space-y-3 py-1">
      {sections.map((section, i) => {
        const lines = section.split("\n");
        const firstLine = lines[0]?.trim() || "";
        const isHeader = /^[A-Z][A-Z &\-/]+$/.test(firstLine) || /^[A-Z][A-Z ]+[—–-]/.test(firstLine);

        if (isHeader && lines.length > 1) {
          const bodyLines = lines.slice(1);
          const isTable = bodyLines.some((l) => l.includes("|"));

          if (isTable) {
            const tableLines = bodyLines.filter((l) => l.trim().startsWith("|"));
            const headerRow = tableLines[0];
            const dataRows = tableLines.slice(2);
            if (headerRow) {
              const headers = headerRow.split("|").map((h) => h.trim()).filter(Boolean);
              const rows = dataRows.map((r) => r.split("|").map((c) => c.trim()).filter(Boolean));
              return (
                <div key={i}>
                  <h4 className="text-[11px] font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className={cn("w-1 h-3.5 rounded-full", type === "drawing" ? "bg-indigo-400" : type === "specs" ? "bg-emerald-400" : "bg-amber-400")} />
                    {firstLine}
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-warm-200/60">
                    <table className="text-[12px] w-full border-collapse">
                      <thead>
                        <tr className="bg-warm-100/80">
                          {headers.map((h, hi) => (
                            <th key={hi} className="px-3 py-1.5 text-left font-semibold text-foreground/90 border-b border-warm-200/60 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, ri) => (
                          <tr key={ri} className={ri % 2 === 0 ? "bg-white/50" : "bg-warm-50/30"}>
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-3 py-1.5 text-foreground/75 border-b border-warm-200/20 whitespace-nowrap">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }
          }

          const keyValueLines = bodyLines.filter((l) => l.includes(":") || l.includes("|"));
          const isKeyValue = keyValueLines.length >= bodyLines.length * 0.5;

          if (isKeyValue) {
            return (
              <div key={i}>
                <h4 className="text-[11px] font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className={cn("w-1 h-3.5 rounded-full", type === "drawing" ? "bg-indigo-400" : type === "specs" ? "bg-emerald-400" : "bg-amber-400")} />
                  {firstLine}
                </h4>
                <div className="space-y-0.5 rounded-lg border border-warm-200/40 overflow-hidden">
                  {bodyLines.map((line, li) => {
                    const pipeFields = line.split("|").map((f) => f.trim()).filter(Boolean);
                    if (pipeFields.length >= 2) {
                      return (
                        <div key={li} className={cn("flex flex-wrap gap-x-4 gap-y-0.5 px-3 py-1.5 text-[12px]", li % 2 === 0 ? "bg-warm-50/40" : "")}>
                          {pipeFields.map((field, fi) => {
                            const colonIdx = field.indexOf(":");
                            if (colonIdx > 0) {
                              return (
                                <span key={fi}>
                                  <span className="font-semibold text-foreground/80">{field.slice(0, colonIdx + 1)}</span>
                                  <span className="text-foreground/65">{field.slice(colonIdx + 1)}</span>
                                </span>
                              );
                            }
                            return <span key={fi} className="text-foreground/70">{field}</span>;
                          })}
                        </div>
                      );
                    }
                    const colonIdx = line.indexOf(":");
                    if (colonIdx > 0) {
                      return (
                        <div key={li} className={cn("px-3 py-1.5 text-[12px]", li % 2 === 0 ? "bg-warm-50/40" : "")}>
                          <span className="font-semibold text-foreground/80">{line.slice(0, colonIdx + 1)}</span>
                          <span className="text-foreground/65">{line.slice(colonIdx + 1)}</span>
                        </div>
                      );
                    }
                    return (
                      <div key={li} className={cn("px-3 py-1.5 text-[12px] text-foreground/70", li % 2 === 0 ? "bg-warm-50/40" : "")}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          return (
            <div key={i}>
              <h4 className="text-[11px] font-bold text-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span className={cn("w-1 h-3.5 rounded-full", type === "drawing" ? "bg-indigo-400" : type === "specs" ? "bg-emerald-400" : "bg-amber-400")} />
                {firstLine}
              </h4>
              <div className="text-[12px] text-foreground/70 leading-relaxed space-y-1 pl-3">
                {bodyLines.map((line, li) => (
                  <p key={li}>{line}</p>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={i} className="text-[12px] text-foreground/70 leading-relaxed pl-3">
            {lines.map((line, li) => (
              <p key={li}>{line}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function RFQCard({ rfq }: { rfq: RFQ }) {
  const [expandedAttachments, setExpandedAttachments] = useState<Set<number>>(
    new Set()
  );

  const toggleAttachment = (index: number) => {
    setExpandedAttachments((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="rounded-xl border border-warm-200/80 bg-card shadow-sm overflow-hidden">
      {/* RFQ header bar */}
      <div className="px-4 py-2.5 bg-warm-50/80 border-b border-warm-200/60 flex items-center gap-2">
        <div className="h-6 w-6 rounded-md bg-blue-100 flex items-center justify-center">
          <Inbox className="h-3 w-3 text-blue-600" />
        </div>
        <span className="text-[11px] font-semibold text-warm-500 uppercase tracking-wider">
          Incoming RFQ
        </span>
        <span className="text-[10px] text-warm-400 ml-auto">
          {rfq.receivedAt}
        </span>
      </div>

      {/* RFQ body */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-foreground mb-1">
          {rfq.title}
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {rfq.accountName}
          </span>
          <span className="text-warm-300">|</span>
          <span>{rfq.contactName}</span>
          <span className="text-warm-300">|</span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {rfq.dealValue}
          </span>
        </div>

        <p className="text-[13px] text-foreground/80 leading-relaxed whitespace-pre-wrap mb-4">
          {rfq.description}
        </p>

        {/* Attachments */}
        {rfq.attachments.length > 0 && (
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-warm-500 uppercase tracking-wider flex items-center gap-1.5">
              <Paperclip className="h-3 w-3" />
              Attachments ({rfq.attachments.length})
            </span>
            {rfq.attachments.map((att, idx) => {
              const config = attachmentTypeConfig[att.type];
              const TypeIcon = config.icon;
              const isExpanded = expandedAttachments.has(idx);

              return (
                <div
                  key={idx}
                  className={cn("rounded-lg border overflow-hidden", config.contentBorder)}
                >
                  <button
                    onClick={() => toggleAttachment(idx)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3.5 py-2.5 transition-colors text-left",
                      isExpanded ? config.headerBg : "hover:bg-warm-50/50"
                    )}
                  >
                    <div className={cn("h-7 w-7 rounded-md flex items-center justify-center shrink-0", config.iconBg)}>
                      <TypeIcon className={cn("h-3.5 w-3.5", config.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] font-medium text-foreground block truncate">
                        {att.name}
                      </span>
                      <span className={cn("text-[10px]", config.headerText)}>
                        {config.label}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn("text-[9px] px-1.5 py-0 font-semibold shrink-0", config.badgeBg)}
                    >
                      {att.type.toUpperCase()}
                    </Badge>
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-warm-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-warm-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className={cn("px-4 pb-4 pt-2 border-t", config.headerBorder)}>
                      <AttachmentContentRenderer content={att.content} type={att.type} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Email / Quote Draft Parser ──────────────────────────────────────────────

interface ParsedContent {
  type: "markdown" | "email_draft" | "quote_draft" | "material_alternatives";
  content: string;
}

function parseAgentMessage(content: string): ParsedContent[] {
  const parts: ParsedContent[] = [];
  const blockRegex = /<!-- (EMAIL_DRAFT|QUOTE_DRAFT|MATERIAL_ALTERNATIVES) -->([\s\S]*?)<!-- \/\1 -->/g;
  let lastIndex = 0;
  let match;

  while ((match = blockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const before = content.slice(lastIndex, match.index).trim();
      if (before) parts.push({ type: "markdown", content: before });
    }
    const blockType =
      match[1] === "QUOTE_DRAFT"
        ? "quote_draft"
        : match[1] === "MATERIAL_ALTERNATIVES"
          ? "material_alternatives"
          : "email_draft";
    parts.push({ type: blockType, content: match[2].trim() });
    lastIndex = match.index + match[0].length;
  }

  const remaining = content.slice(lastIndex).trim();
  if (remaining) parts.push({ type: "markdown", content: remaining });

  if (parts.length === 0) {
    parts.push({ type: "markdown", content });
  }

  return parts;
}

// ─── ERP Citation Renderer ───────────────────────────────────────────────────

const ERP_CITATION_REGEX = /\[ERP:\s*([^\]]+)\]/g;

function renderTextWithCitations(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  const regex = new RegExp(ERP_CITATION_REGEX.source, "g");

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const citationText = match[1].trim();
    parts.push(
      <span
        key={`cite-${match.index}`}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded-md bg-violet-100/80 border border-violet-200/60 text-[10px] font-medium text-violet-700 align-middle whitespace-nowrap"
        title={citationText}
      >
        <Database className="h-2.5 w-2.5 shrink-0" />
        <span className="max-w-[220px] truncate">{citationText}</span>
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function CitationAwareText({ children }: { children: React.ReactNode }) {
  if (typeof children === "string") {
    return <>{renderTextWithCitations(children)}</>;
  }

  if (Array.isArray(children)) {
    return (
      <>
        {children.map((child, i) => {
          if (typeof child === "string") {
            return <span key={i}>{renderTextWithCitations(child)}</span>;
          }
          return child;
        })}
      </>
    );
  }

  return <>{children}</>;
}

// ─── Recommended Actions Block ───────────────────────────────────────────────

function RecommendedActionsBlock({ items }: { items: string[] }) {
  const [feedback, setFeedback] = useState<Record<number, "up" | "down" | null>>({});

  const handleFeedback = (index: number, type: "up" | "down") => {
    setFeedback((prev) => ({
      ...prev,
      [index]: prev[index] === type ? null : type,
    }));
  };

  return (
    <div className="mb-2">
      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 group rounded-lg border border-warm-200/40 bg-warm-50/30 px-3 py-2"
          >
            <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-warm-400" />
            <div className="flex-1 min-w-0 text-[13px] leading-relaxed text-foreground/85 break-words">
              <CitationAwareText>{item}</CitationAwareText>
            </div>
            <div className="shrink-0 flex items-center gap-1 ml-2">
              <button
                onClick={() => handleFeedback(idx, "up")}
                className={cn(
                  "p-1 rounded-md transition-colors",
                  feedback[idx] === "up"
                    ? "bg-green-100 text-green-600"
                    : "text-warm-300 hover:text-green-500 hover:bg-green-50"
                )}
                title="Helpful"
              >
                <ThumbsUp className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleFeedback(idx, "down")}
                className={cn(
                  "p-1 rounded-md transition-colors",
                  feedback[idx] === "down"
                    ? "bg-red-100 text-red-500"
                    : "text-warm-300 hover:text-red-400 hover:bg-red-50"
                )}
                title="Not helpful"
              >
                <ThumbsDown className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Markdown Section Splitter ───────────────────────────────────────────────

interface MarkdownSection {
  type: "markdown" | "recommended_actions";
  content: string;
  items?: string[];
}

function splitRecommendedActions(content: string): MarkdownSection[] {
  const headingRegex = /^(#{1,3})\s+.*Recommended\s+(?:Actions|[Nn]ext\s+[Ss]teps|[Ss]teps).*/im;
  const boldHeadingRegex = /^\*\*.*Recommended\s+(?:Actions|[Nn]ext\s+[Ss]teps|[Ss]teps).*\*\*/im;
  const colonHeadingRegex = /^Recommended\s+(?:actions|next\s+steps|steps)[^:]*:/im;

  const match = content.match(headingRegex) || content.match(boldHeadingRegex) || content.match(colonHeadingRegex);
  if (!match || match.index === undefined) {
    return [{ type: "markdown", content }];
  }

  const sections: MarkdownSection[] = [];
  const beforeSection = content.slice(0, match.index).trim();
  if (beforeSection) {
    sections.push({ type: "markdown", content: beforeSection });
  }

  const afterHeading = content.slice(match.index + match[0].length);

  const nextHeadingMatch = afterHeading.match(/\n(?=#{1,3}\s|\*\*Section)/m);
  const sectionBody = nextHeadingMatch && nextHeadingMatch.index !== undefined
    ? afterHeading.slice(0, nextHeadingMatch.index)
    : afterHeading;

  const remainder = nextHeadingMatch && nextHeadingMatch.index !== undefined
    ? afterHeading.slice(nextHeadingMatch.index).trim()
    : "";

  const bulletLines = sectionBody
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^[-*]\s+/.test(l) || /^\d+\.\s+/.test(l))
    .map((l) => l.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""));

  if (bulletLines.length > 0) {
    sections.push({
      type: "recommended_actions",
      content: match[0],
      items: bulletLines,
    });
  } else {
    sections.push({ type: "markdown", content: match[0] + sectionBody });
  }

  if (remainder) {
    sections.push({ type: "markdown", content: remainder });
  }

  return sections;
}

// ─── Markdown Renderer ──────────────────────────────────────────────────────

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-base font-bold text-foreground mt-3 mb-1.5 first:mt-0">
      <CitationAwareText>{children}</CitationAwareText>
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-sm font-bold text-foreground mt-3 mb-1 first:mt-0">
      <CitationAwareText>{children}</CitationAwareText>
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-[13px] font-semibold text-foreground mt-2 mb-1 first:mt-0">
      <CitationAwareText>{children}</CitationAwareText>
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-[13px] leading-relaxed text-foreground/85 mb-2 last:mb-0">
      <CitationAwareText>{children}</CitationAwareText>
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="text-[13px] leading-relaxed space-y-1 mb-2 ml-4 list-disc marker:text-warm-400">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="text-[13px] leading-relaxed space-y-1 mb-2 ml-4 list-decimal marker:text-warm-400">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-foreground/85"><CitationAwareText>{children}</CitationAwareText></li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground"><CitationAwareText>{children}</CitationAwareText></strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-foreground/75"><CitationAwareText>{children}</CitationAwareText></em>
  ),
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    const isInline = !className;
    if (isInline) {
      const text = String(children);
      if (ERP_CITATION_REGEX.test(text)) {
        ERP_CITATION_REGEX.lastIndex = 0;
        return <CitationAwareText>{text}</CitationAwareText>;
      }
    }
    return isInline ? (
      <code className="text-[12px] bg-warm-200/50 px-1 py-0.5 rounded text-foreground font-mono">
        {children}
      </code>
    ) : (
      <code className="block text-[12px] bg-warm-200/30 px-3 py-2 rounded-lg text-foreground/85 font-mono whitespace-pre-wrap mb-2">
        {children}
      </code>
    );
  },
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto mb-2">
      <table className="text-[12px] w-full border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-warm-100/60 text-left">{children}</thead>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-2 py-1.5 font-semibold text-foreground border-b border-warm-200/60">
      <CitationAwareText>{children}</CitationAwareText>
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-2 py-1.5 text-foreground/85 border-b border-warm-200/30">
      <CitationAwareText>{children}</CitationAwareText>
    </td>
  ),
  hr: () => <hr className="my-3 border-warm-200/50" />,
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-2 border-warm-400 pl-3 my-2 text-foreground/70 italic">
      {children}
    </blockquote>
  ),
};

const emailMarkdownComponents = {
  ...markdownComponents,
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-[12px] leading-relaxed text-foreground/80 mb-1 last:mb-0">
      {children}
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="text-[12px] leading-relaxed space-y-0.5 mb-1 ml-4 list-disc marker:text-warm-400">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="text-[12px] leading-relaxed space-y-0.5 mb-1 ml-4 list-decimal marker:text-warm-400">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-foreground/80">{children}</li>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-[13px] font-semibold text-foreground mt-2 mb-0.5 first:mt-0">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-[12px] font-semibold text-foreground mt-2 mb-0.5 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-[12px] font-semibold text-foreground mt-1.5 mb-0.5 first:mt-0">{children}</h3>
  ),
};

function EmailBodyMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={emailMarkdownComponents as never}
    >
      {content}
    </ReactMarkdown>
  );
}

function AgentMarkdown({ content }: { content: string }) {
  const sections = useMemo(() => splitRecommendedActions(content), [content]);

  return (
    <div>
      {sections.map((section, idx) => {
        if (section.type === "recommended_actions" && section.items) {
          return (
            <div key={idx}>
              <h3 className="text-[13px] font-semibold text-foreground mt-2 mb-1.5">
                Recommended Actions
              </h3>
              <RecommendedActionsBlock items={section.items} />
            </div>
          );
        }
        return (
          <ReactMarkdown
            key={idx}
            remarkPlugins={[remarkGfm]}
            components={markdownComponents as never}
          >
            {section.content}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}

// ─── Email Draft Card ───────────────────────────────────────────────────────

function EmailDraftCard({ draftContent }: { draftContent: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(draftContent);

  const { to, subject, body } = useMemo(() => {
    const lines = draftContent.split("\n");
    let to = "";
    let subject = "";
    const bodyLines: string[] = [];
    let pastHeaders = false;

    for (const line of lines) {
      if (!pastHeaders && line.match(/^\*?\*?To:\*?\*?\s*/i)) {
        to = line.replace(/^\*?\*?To:\*?\*?\s*/i, "").trim();
      } else if (!pastHeaders && line.match(/^\*?\*?Subject:\*?\*?\s*/i)) {
        subject = line.replace(/^\*?\*?Subject:\*?\*?\s*/i, "").trim();
      } else if (!pastHeaders && line.trim() === "") {
        if (to || subject) pastHeaders = true;
      } else if (pastHeaders || (!to && !subject)) {
        pastHeaders = true;
        bodyLines.push(line);
      }
    }

    return {
      to,
      subject,
      body: bodyLines.join("\n").trim(),
    };
  }, [draftContent]);

  return (
    <>
      <div className="rounded-lg border border-blue-200/60 bg-blue-50/30 overflow-hidden mt-2 mb-1">
        {/* Email header */}
        <div className="px-3 py-2 bg-blue-50/60 border-b border-blue-200/40 flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
            Draft Email
          </span>
        </div>

        {/* Email content */}
        <div className="px-3 py-2.5">
          {to && (
            <div className="text-[11px] text-muted-foreground mb-0.5">
              <span className="font-semibold text-foreground/70">To:</span> {to}
            </div>
          )}
          {subject && (
            <div className="text-[11px] text-muted-foreground mb-2">
              <span className="font-semibold text-foreground/70">Subject:</span>{" "}
              {subject}
            </div>
          )}
          <div className="text-[12px] text-foreground/80 leading-relaxed border-t border-blue-200/30 pt-2">
            <EmailBodyMarkdown content={body} />
          </div>
        </div>

        {/* CTA buttons */}
        <div className="px-3 py-2.5 border-t border-blue-200/40 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditedContent(draftContent);
              setModalOpen(true);
            }}
            className="h-7 px-3 text-[11px] font-medium border-warm-300 text-warm-700 hover:bg-warm-100 gap-1.5"
          >
            <Pencil className="h-3 w-3" />
            Edit &amp; Send
          </Button>
          <Button
            size="sm"
            className="h-7 px-3 text-[11px] font-medium bg-warm-800 hover:bg-warm-700 text-warm-50 gap-1.5"
          >
            <CheckCircle className="h-3 w-3" />
            Approve &amp; Send
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <EmailDraftModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        content={editedContent}
        onContentChange={setEditedContent}
        to={to}
        subject={subject}
      />
    </>
  );
}

// ─── Email Draft Modal ──────────────────────────────────────────────────────

function EmailDraftModal({
  open,
  onClose,
  content,
  onContentChange,
  to,
  subject,
}: {
  open: boolean;
  onClose: () => void;
  content: string;
  onContentChange: (val: string) => void;
  to: string;
  subject: string;
}) {
  const [editTo, setEditTo] = useState(to);
  const [editSubject, setEditSubject] = useState(subject);
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    if (open) {
      setEditTo(to);
      setEditSubject(subject);
      const lines = content.split("\n");
      const bodyLines: string[] = [];
      let pastHeaders = false;
      for (const line of lines) {
        if (!pastHeaders && line.match(/^\*?\*?To:\*?\*?\s*/i)) continue;
        if (!pastHeaders && line.match(/^\*?\*?Subject:\*?\*?\s*/i)) continue;
        if (!pastHeaders && line.trim() === "" && bodyLines.length === 0) {
          pastHeaders = true;
          continue;
        }
        pastHeaders = true;
        bodyLines.push(line);
      }
      setEditBody(bodyLines.join("\n").trim());
    }
  }, [open, content, to, subject]);

  const handleSave = () => {
    const updated = `**To:** ${editTo}\n**Subject:** ${editSubject}\n\n${editBody}`;
    onContentChange(updated);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Mail className="h-4 w-4 text-warm-600" />
            Edit Email Draft
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 py-2">
          {/* To field */}
          <div>
            <label className="text-[11px] font-semibold text-warm-500 uppercase tracking-wider mb-1 block">
              To
            </label>
            <Input
              value={editTo}
              onChange={(e) => setEditTo(e.target.value)}
              className="h-9 text-sm bg-warm-50 border-warm-200"
            />
          </div>

          {/* Subject field */}
          <div>
            <label className="text-[11px] font-semibold text-warm-500 uppercase tracking-wider mb-1 block">
              Subject
            </label>
            <Input
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              className="h-9 text-sm bg-warm-50 border-warm-200"
            />
          </div>

          {/* Body field */}
          <div>
            <label className="text-[11px] font-semibold text-warm-500 uppercase tracking-wider mb-1 block">
              Body
            </label>
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={14}
              className="w-full rounded-md border border-warm-200 bg-warm-50 px-3 py-2 text-sm text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-warm-300 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-8 px-4 text-xs font-medium border-warm-300 text-warm-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="h-8 px-4 text-xs font-medium bg-warm-800 hover:bg-warm-700 text-warm-50 gap-1.5"
          >
            <Send className="h-3 w-3" />
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Quote Preview Card ─────────────────────────────────────────────────────

function QuotePreviewCard({
  jsonContent,
  onOpenQuote,
}: {
  jsonContent: string;
  onOpenQuote: (data: QuoteData) => void;
}) {
  const quoteData = useMemo<QuoteData | null>(() => {
    try {
      return JSON.parse(jsonContent);
    } catch {
      return null;
    }
  }, [jsonContent]);

  if (!quoteData) {
    return (
      <div className="rounded-lg border border-red-200/60 bg-red-50/30 px-3 py-2 mt-2 mb-1 text-[12px] text-red-600">
        Failed to parse quote data.
      </div>
    );
  }

  const total = quoteData.lineItems.reduce(
    (sum, li) => sum + li.qty * li.unitPrice,
    0
  );

  return (
    <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/30 overflow-hidden mt-2 mb-1">
      <div className="px-3 py-2 bg-emerald-50/60 border-b border-emerald-200/40 flex items-center gap-2">
        <FileText className="h-3.5 w-3.5 text-emerald-600" />
        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
          Quote Generated
        </span>
      </div>
      <div className="px-3 py-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[13px] font-semibold text-foreground block">
              {quoteData.quoteNumber}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {quoteData.to.company} &middot; {quoteData.lineItems.length} line item{quoteData.lineItems.length !== 1 ? "s" : ""}
            </span>
          </div>
          <span className="text-sm font-bold text-foreground">
            {total.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>
        <Button
          size="sm"
          onClick={() => onOpenQuote(quoteData)}
          className="w-full h-8 text-[11px] font-medium bg-emerald-700 hover:bg-emerald-600 text-white gap-1.5"
        >
          <ExternalLink className="h-3 w-3" />
          Open Quote
        </Button>
      </div>
    </div>
  );
}

// ─── Material Alternatives Card ──────────────────────────────────────────────

function MaterialAlternativeCostBadge({ delta }: { delta: string }) {
  const isPositive = delta.startsWith("+");
  const isNegative = delta.startsWith("-");
  const isSame = delta.toLowerCase() === "same";

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const colorClass = isPositive
    ? "bg-amber-100 text-amber-700 border-amber-200"
    : isNegative
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-warm-100 text-warm-600 border-warm-200";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border text-[9px] font-semibold",
        colorClass
      )}
    >
      <Icon className="h-2.5 w-2.5" />
      {isSame ? "Same" : delta}
    </span>
  );
}

function MaterialAlternativesCard({
  jsonContent,
  messageId,
  selectedMaterialPick,
  onExploreMaterial,
}: {
  jsonContent: string;
  messageId: string;
  selectedMaterialPick: MaterialPickInfo | null;
  onExploreMaterial: (material: MaterialAlternative, messageId: string) => void;
}) {
  const alternatives = useMemo<MaterialAlternative[]>(() => {
    try {
      const parsed = JSON.parse(jsonContent);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [jsonContent]);

  if (alternatives.length === 0) {
    return (
      <div className="rounded-lg border border-red-200/60 bg-red-50/30 px-3 py-2 mt-2 mb-1 text-[12px] text-red-600">
        Failed to parse material alternatives data.
      </div>
    );
  }

  const hasSelection = selectedMaterialPick !== null;

  return (
    <div className="rounded-lg border border-orange-200/60 bg-orange-50/20 overflow-hidden mt-2 mb-1">
      {/* Header */}
      <div className="px-3 py-2 bg-orange-50/60 border-b border-orange-200/40 flex items-center gap-2">
        <FlaskConical className="h-3.5 w-3.5 text-orange-600" />
        <span className="text-[11px] font-semibold text-orange-700 uppercase tracking-wider">
          Material Alternatives
        </span>
        {hasSelection && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-semibold border border-green-200 ml-1">
            <CheckCircle className="h-2.5 w-2.5" />
            Selected: {selectedMaterialPick.grade}
          </span>
        )}
        <span className="text-[10px] text-orange-500 ml-auto">
          {alternatives.length} option{alternatives.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Alternatives list */}
      <div className="divide-y divide-orange-200/30">
        {alternatives.map((alt) => {
          return (
            <div
              key={alt.id}
              className="px-3 py-2.5 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-semibold text-foreground">
                      {alt.alternativeGrade}
                    </span>
                    <MaterialAlternativeCostBadge delta={alt.costDelta} />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
                    <span className="flex items-center gap-1">
                      <ArrowRight className="h-2.5 w-2.5" />
                      replaces {alt.primaryMaterial}
                    </span>
                    <span className="text-warm-300">|</span>
                    <span className="flex items-center gap-1">
                      <Package className="h-2.5 w-2.5" />
                      {alt.availableStock}
                    </span>
                    {alt.requiresApproval && (
                      <>
                        <span className="text-warm-300">|</span>
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          Approval needed
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-foreground/60 leading-relaxed">
                    {alt.compatibility}
                    {alt.notes ? ` — ${alt.notes}` : ""}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onExploreMaterial(alt, messageId)}
                  className="h-7 px-3 text-[10px] font-medium gap-1.5 shrink-0 bg-orange-600 hover:bg-orange-500 text-white"
                >
                  <MessageCircle className="h-3 w-3" />
                  Explore
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Message Bubble ─────────────────────────────────────────────────────────

function MessageBubble({
  message,
  onOpenQuote,
  onExploreMaterial,
  selectedMaterialPick,
}: {
  message: ConciergeMessage;
  onOpenQuote: (data: QuoteData) => void;
  onExploreMaterial: (material: MaterialAlternative, messageId: string) => void;
  selectedMaterialPick: MaterialPickInfo | null;
}) {
  const isAgent = message.role === "agent";

  const parsedParts = useMemo(
    () => (isAgent ? parseAgentMessage(message.content) : null),
    [isAgent, message.content]
  );

  return (
    <div className={cn("flex gap-3", !isAgent && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
          isAgent
            ? "bg-warm-800 text-warm-50"
            : "bg-warm-200 text-warm-600"
        )}
      >
        {isAgent ? (
          <Bot className="h-3.5 w-3.5" />
        ) : (
          <User className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "rounded-xl px-4 py-3",
          isAgent
            ? "bg-warm-100/60 text-foreground max-w-[90%]"
            : "bg-warm-800 text-warm-50 max-w-[85%]"
        )}
      >
        {isAgent && parsedParts ? (
          <div>
            {parsedParts.map((part, idx) =>
              part.type === "quote_draft" ? (
                <QuotePreviewCard
                  key={idx}
                  jsonContent={part.content}
                  onOpenQuote={onOpenQuote}
                />
              ) : part.type === "email_draft" ? (
                <EmailDraftCard key={idx} draftContent={part.content} />
              ) : part.type === "material_alternatives" ? (
                <MaterialAlternativesCard
                  key={idx}
                  jsonContent={part.content}
                  messageId={message.id}
                  selectedMaterialPick={selectedMaterialPick}
                  onExploreMaterial={onExploreMaterial}
                />
              ) : (
                <AgentMarkdown key={idx} content={part.content} />
              )
            )}
          </div>
        ) : (
          <div className="text-[13px] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        )}
        <span
          className={cn(
            "text-[10px] mt-1.5 block",
            isAgent ? "text-muted-foreground" : "text-warm-300"
          )}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}

// ─── Typing Indicator ───────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="h-7 w-7 rounded-lg bg-warm-800 text-warm-50 flex items-center justify-center shrink-0">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="bg-warm-100/60 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-bounce" />
            <span
              className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
          <span className="text-[11px] text-warm-400 ml-1">
            Analyzing RFQ...
          </span>
        </div>
      </div>
    </div>
  );
}

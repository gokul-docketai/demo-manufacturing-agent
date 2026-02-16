"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  RFQ,
  ConciergeMessage,
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

        {/* Right panel — Conversation */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-background">
          {selectedRFQ ? (
            <ConversationPanel
              rfq={selectedRFQ}
              messages={getMessages(selectedRFQ.id)}
              setMessages={(msgs) => setMessages(selectedRFQ.id, msgs)}
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
      </div>
    </div>
  );
}

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
}: {
  rfq: RFQ;
  messages: ConciergeMessage[];
  setMessages: (msgs: ConciergeMessage[] | ((prev: ConciergeMessage[]) => ConciergeMessage[])) => void;
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
              <MessageBubble key={msg.id} message={msg} />
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
            placeholder="Reply as sales engineer..."
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

        <p className="text-[13px] text-foreground/80 leading-relaxed mb-4">
          {rfq.description}
        </p>

        {/* Attachments */}
        {rfq.attachments.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-warm-500 uppercase tracking-wider flex items-center gap-1.5">
              <Paperclip className="h-3 w-3" />
              Attachments ({rfq.attachments.length})
            </span>
            {rfq.attachments.map((att, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-warm-200/60 overflow-hidden"
              >
                <button
                  onClick={() => toggleAttachment(idx)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-warm-50/50 transition-colors text-left"
                >
                  <FileText className="h-3.5 w-3.5 text-warm-500 shrink-0" />
                  <span className="text-[12px] font-medium text-foreground flex-1">
                    {att.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[9px] px-1.5 py-0 font-medium bg-warm-100 text-warm-500 border-warm-200"
                  >
                    {att.type}
                  </Badge>
                  {expandedAttachments.has(idx) ? (
                    <ChevronDown className="h-3 w-3 text-warm-400" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-warm-400" />
                  )}
                </button>
                {expandedAttachments.has(idx) && (
                  <div className="px-3 pb-3 pt-1 border-t border-warm-200/40">
                    <pre className="text-[12px] text-foreground/70 leading-relaxed whitespace-pre-wrap font-sans">
                      {att.content}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Email Draft Parser ─────────────────────────────────────────────────────

interface ParsedContent {
  type: "markdown" | "email_draft";
  content: string;
}

function parseAgentMessage(content: string): ParsedContent[] {
  const parts: ParsedContent[] = [];
  const emailRegex = /<!-- EMAIL_DRAFT -->([\s\S]*?)<!-- \/EMAIL_DRAFT -->/g;
  let lastIndex = 0;
  let match;

  while ((match = emailRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const before = content.slice(lastIndex, match.index).trim();
      if (before) parts.push({ type: "markdown", content: before });
    }
    parts.push({ type: "email_draft", content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  const remaining = content.slice(lastIndex).trim();
  if (remaining) parts.push({ type: "markdown", content: remaining });

  if (parts.length === 0) {
    parts.push({ type: "markdown", content });
  }

  return parts;
}

// ─── Markdown Renderer ──────────────────────────────────────────────────────

function AgentMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-base font-bold text-foreground mt-3 mb-1.5 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-sm font-bold text-foreground mt-3 mb-1 first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-[13px] font-semibold text-foreground mt-2 mb-1 first:mt-0">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-[13px] leading-relaxed text-foreground/85 mb-2 last:mb-0">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="text-[13px] leading-relaxed space-y-1 mb-2 ml-4 list-disc marker:text-warm-400">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="text-[13px] leading-relaxed space-y-1 mb-2 ml-4 list-decimal marker:text-warm-400">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-foreground/85">{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-foreground/75">{children}</em>
        ),
        code: ({ children, className }) => {
          const isInline = !className;
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
        table: ({ children }) => (
          <div className="overflow-x-auto mb-2">
            <table className="text-[12px] w-full border-collapse">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-warm-100/60 text-left">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-2 py-1.5 font-semibold text-foreground border-b border-warm-200/60">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-2 py-1.5 text-foreground/85 border-b border-warm-200/30">
            {children}
          </td>
        ),
        hr: () => <hr className="my-3 border-warm-200/50" />,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-warm-400 pl-3 my-2 text-foreground/70 italic">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
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
          <div className="text-[12px] text-foreground/80 leading-relaxed whitespace-pre-wrap border-t border-blue-200/30 pt-2">
            <AgentMarkdown content={body} />
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

// ─── Message Bubble ─────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: ConciergeMessage }) {
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
              part.type === "email_draft" ? (
                <EmailDraftCard key={idx} draftContent={part.content} />
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

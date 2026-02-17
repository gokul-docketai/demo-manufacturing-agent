"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MaterialAlternative,
  MaterialThreadMessage,
  MaterialPickInfo,
} from "@/lib/concierge-data";
import {
  FlaskConical,
  Send,
  User,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  AlertTriangle,
  Database,
  X,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface MaterialExplorerPanelProps {
  material: MaterialAlternative;
  enquirySummary: string;
  messages: MaterialThreadMessage[];
  onMessagesChange: (msgs: MaterialThreadMessage[]) => void;
  onSelectMaterial: (pick: MaterialPickInfo) => void;
  selectedPick: MaterialPickInfo | null;
  onClose: () => void;
}

// ─── ERP Citation Renderer (shared logic) ────────────────────────────────────

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
        <span className="max-w-[180px] truncate">{citationText}</span>
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
        {children.map((child, i) =>
          typeof child === "string" ? (
            <span key={i}>{renderTextWithCitations(child)}</span>
          ) : (
            child
          )
        )}
      </>
    );
  }
  return <>{children}</>;
}

// ─── Thread Markdown Components ──────────────────────────────────────────────

const threadMarkdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-sm font-bold text-foreground mt-2 mb-1 first:mt-0">
      <CitationAwareText>{children}</CitationAwareText>
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-[13px] font-bold text-foreground mt-2 mb-1 first:mt-0">
      <CitationAwareText>{children}</CitationAwareText>
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-[12px] font-semibold text-foreground mt-1.5 mb-0.5 first:mt-0">
      <CitationAwareText>{children}</CitationAwareText>
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-[12px] leading-relaxed text-foreground/85 mb-1.5 last:mb-0">
      <CitationAwareText>{children}</CitationAwareText>
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="text-[12px] leading-relaxed space-y-0.5 mb-1.5 ml-3.5 list-disc marker:text-warm-400">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="text-[12px] leading-relaxed space-y-0.5 mb-1.5 ml-3.5 list-decimal marker:text-warm-400">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-foreground/85">
      <CitationAwareText>{children}</CitationAwareText>
    </li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">
      <CitationAwareText>{children}</CitationAwareText>
    </strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-foreground/75">
      <CitationAwareText>{children}</CitationAwareText>
    </em>
  ),
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    const isInline = !className;
    return isInline ? (
      <code className="text-[11px] bg-warm-200/50 px-1 py-0.5 rounded text-foreground font-mono">
        {children}
      </code>
    ) : (
      <code className="block text-[11px] bg-warm-200/30 px-2.5 py-1.5 rounded-lg text-foreground/85 font-mono whitespace-pre-wrap mb-1.5">
        {children}
      </code>
    );
  },
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto mb-1.5">
      <table className="text-[11px] w-full border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-warm-100/60 text-left">{children}</thead>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-2 py-1 font-semibold text-foreground border-b border-warm-200/60 text-[11px]">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-2 py-1 text-foreground/85 border-b border-warm-200/30 text-[11px]">
      <CitationAwareText>{children}</CitationAwareText>
    </td>
  ),
};

// ─── MATERIAL_PICK Parsing ───────────────────────────────────────────────────

interface ParsedThreadPart {
  type: "markdown" | "material_pick";
  content: string;
}

function parseThreadMessage(content: string): ParsedThreadPart[] {
  const parts: ParsedThreadPart[] = [];
  const blockRegex = /<!-- MATERIAL_PICK -->([\s\S]*?)<!-- \/MATERIAL_PICK -->/g;
  let lastIndex = 0;
  let match;

  while ((match = blockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const before = content.slice(lastIndex, match.index).trim();
      if (before) parts.push({ type: "markdown", content: before });
    }
    parts.push({ type: "material_pick", content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  const remaining = content.slice(lastIndex).trim();
  if (remaining) parts.push({ type: "markdown", content: remaining });

  if (parts.length === 0) {
    parts.push({ type: "markdown", content });
  }

  return parts;
}

// ─── Material Pick Card (inline in chat) ─────────────────────────────────────

function MaterialPickCard({
  jsonContent,
  onSelect,
  isSelected,
}: {
  jsonContent: string;
  onSelect: (pick: MaterialPickInfo) => void;
  isSelected: boolean;
}) {
  const pickInfo = useMemo<MaterialPickInfo | null>(() => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed && parsed.grade) return parsed as MaterialPickInfo;
      return null;
    } catch {
      return null;
    }
  }, [jsonContent]);

  if (!pickInfo) return null;

  return (
    <div
      className={cn(
        "rounded-lg border overflow-hidden my-2",
        isSelected
          ? "border-green-300 bg-green-50/40"
          : "border-orange-200/60 bg-orange-50/30"
      )}
    >
      <div className="px-3 py-2.5 flex items-start gap-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[12px] font-semibold text-foreground">
              {pickInfo.grade}
            </span>
            <CostDeltaBadge delta={pickInfo.costDelta} />
            {isSelected && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-semibold border border-green-200">
                <CheckCircle className="h-2.5 w-2.5" />
                Selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
            <span className="flex items-center gap-1">
              <Package className="h-2.5 w-2.5" />
              {pickInfo.availableStock}
            </span>
          </div>
          <p className="text-[10px] text-foreground/60 leading-relaxed">
            {pickInfo.reason}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => onSelect(pickInfo)}
          disabled={isSelected}
          className={cn(
            "h-7 px-3 text-[10px] font-medium gap-1 shrink-0",
            isSelected
              ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-100 cursor-default"
              : "bg-orange-600 hover:bg-orange-500 text-white"
          )}
        >
          <CheckCircle className="h-3 w-3" />
          {isSelected ? "Selected" : "Use This Material"}
        </Button>
      </div>
    </div>
  );
}

// ─── Thread Message Bubble ───────────────────────────────────────────────────

function ThreadMessageBubble({
  message,
  onSelectMaterial,
  selectedPick,
}: {
  message: MaterialThreadMessage;
  onSelectMaterial: (pick: MaterialPickInfo) => void;
  selectedPick: MaterialPickInfo | null;
}) {
  const isAssistant = message.role === "assistant";

  const parsedParts = useMemo(
    () => (isAssistant ? parseThreadMessage(message.content) : null),
    [isAssistant, message.content]
  );

  return (
    <div className={cn("flex gap-2.5", !isAssistant && "flex-row-reverse")}>
      <div
        className={cn(
          "h-6 w-6 rounded-md flex items-center justify-center shrink-0 mt-0.5",
          isAssistant
            ? "bg-orange-100 text-orange-600"
            : "bg-warm-200 text-warm-600"
        )}
      >
        {isAssistant ? (
          <FlaskConical className="h-3 w-3" />
        ) : (
          <User className="h-3 w-3" />
        )}
      </div>
      <div
        className={cn(
          "rounded-lg px-3 py-2 max-w-[88%]",
          isAssistant
            ? "bg-orange-50/60 text-foreground border border-orange-200/40"
            : "bg-warm-800 text-warm-50"
        )}
      >
        {isAssistant && parsedParts ? (
          <div>
            {parsedParts.map((part, idx) =>
              part.type === "material_pick" ? (
                <MaterialPickCard
                  key={idx}
                  jsonContent={part.content}
                  onSelect={onSelectMaterial}
                  isSelected={
                    selectedPick !== null &&
                    (() => {
                      try {
                        const parsed = JSON.parse(part.content);
                        return parsed.grade === selectedPick.grade;
                      } catch {
                        return false;
                      }
                    })()
                  }
                />
              ) : (
                <ReactMarkdown
                  key={idx}
                  remarkPlugins={[remarkGfm]}
                  components={threadMarkdownComponents as never}
                >
                  {part.content}
                </ReactMarkdown>
              )
            )}
          </div>
        ) : (
          <div className="text-[12px] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        )}
        <span
          className={cn(
            "text-[9px] mt-1 block",
            isAssistant ? "text-muted-foreground" : "text-warm-300"
          )}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}

// ─── Thread Typing Indicator ─────────────────────────────────────────────────

function ThreadTypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="h-6 w-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
        <FlaskConical className="h-3 w-3" />
      </div>
      <div className="bg-orange-50/60 border border-orange-200/40 rounded-lg px-3 py-2">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-orange-400 animate-bounce" />
            <span
              className="w-1 h-1 rounded-full bg-orange-400 animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <span
              className="w-1 h-1 rounded-full bg-orange-400 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
          <span className="text-[10px] text-orange-400 ml-1">
            Analyzing material...
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Cost Delta Badge ────────────────────────────────────────────────────────

function CostDeltaBadge({ delta }: { delta: string }) {
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
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-semibold",
        colorClass
      )}
    >
      <Icon className="h-2.5 w-2.5" />
      {isSame ? "Same cost" : delta}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function MaterialExplorerPanel({
  material,
  enquirySummary,
  messages,
  onMessagesChange,
  onSelectMaterial,
  selectedPick,
  onClose,
}: MaterialExplorerPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitializedRef = useRef<string | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-trigger the sub-agent when the panel mounts with a new material
  useEffect(() => {
    if (hasInitializedRef.current === material.id) return;
    if (messages.length > 0) {
      hasInitializedRef.current = material.id;
      return;
    }

    hasInitializedRef.current = material.id;
    triggerSubAgent([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material.id]);

  // Focus input when panel mounts
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const triggerSubAgent = async (
    conversationMessages: MaterialThreadMessage[]
  ) => {
    if (!material) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/concierge/material-thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material,
          enquirySummary,
          messages: conversationMessages
            .filter((m) => !m.isLoading)
            .map((m) => ({
              role: m.role,
              content: m.content,
            })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMsg: MaterialThreadMessage = {
        id: `mat-assistant-${Date.now()}`,
        role: "assistant",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      onMessagesChange([
        ...conversationMessages.filter((m) => !m.isLoading),
        assistantMsg,
      ]);
    } catch (error) {
      console.error("Material thread error:", error);
      const errorMsg: MaterialThreadMessage = {
        id: `mat-error-${Date.now()}`,
        role: "assistant",
        content:
          "I encountered an error analyzing this material. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      onMessagesChange([
        ...conversationMessages.filter((m) => !m.isLoading),
        errorMsg,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || !material) return;

    const userMsg: MaterialThreadMessage = {
      id: `mat-user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, userMsg];
    onMessagesChange(updatedMessages);
    setInputValue("");

    await triggerSubAgent(updatedMessages);
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Material Header ──────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-orange-200/60 bg-gradient-to-b from-orange-50/80 to-card">
        <div className="px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                  Material Explorer
                </span>
                {selectedPick && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-semibold border border-green-200">
                    <CheckCircle className="h-2.5 w-2.5" />
                    {selectedPick.grade}
                  </span>
                )}
              </div>
              <h3 className="text-[13px] font-bold text-foreground leading-tight">
                {material.alternativeGrade}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <ArrowRight className="h-2.5 w-2.5" />
                  replaces {material.primaryMaterial}
                </span>
                <CostDeltaBadge delta={material.costDelta} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-7 w-7 rounded-md flex items-center justify-center text-warm-400 hover:text-foreground hover:bg-warm-100 transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Material quick-facts bar */}
          <div className="mt-2 flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-foreground/70">
              <Package className="h-2.5 w-2.5 text-warm-400" />
              <span className="font-medium">{material.availableStock}</span>
            </span>
            <span className="text-warm-300">|</span>
            <span className="text-foreground/70">{material.compatibility}</span>
            {material.requiresApproval && (
              <>
                <span className="text-warm-300">|</span>
                <span className="flex items-center gap-1 text-amber-600">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  Approval needed
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Chat Area ────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
        <div className="space-y-3">
          {messages.map((msg) =>
            msg.isLoading ? (
              <ThreadTypingIndicator key={msg.id} />
            ) : (
              <ThreadMessageBubble
                key={msg.id}
                message={msg}
                onSelectMaterial={onSelectMaterial}
                selectedPick={selectedPick}
              />
            )
          )}
          {isLoading && messages.every((m) => !m.isLoading) && (
            <ThreadTypingIndicator />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input Footer ──────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-warm-200/60 bg-card/80 backdrop-blur-sm">
        <div className="px-3 py-2.5 flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSend()
            }
            placeholder="Ask about materials..."
            disabled={isLoading}
            className="h-9 text-[12px] bg-warm-50 border-warm-200 placeholder:text-warm-400 focus-visible:ring-orange-300"
          />
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="h-9 w-9 p-0 bg-orange-600 hover:bg-orange-500 text-white"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

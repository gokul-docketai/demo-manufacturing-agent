"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  RecommendedAction,
  ActionThreadMessage,
  ActionResultInfo,
} from "@/lib/concierge-data";
import {
  Zap,
  Send,
  User,
  CheckCircle,
  Database,
  X,
  FileText,
  ListChecks,
  BarChart3,
  Mail,
  ClipboardList,
  Circle,
  CircleDot,
  CircleCheck,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ActionExplorerPanelProps {
  action: RecommendedAction;
  enquirySummary: string;
  messages: ActionThreadMessage[];
  onMessagesChange: (msgs: ActionThreadMessage[]) => void;
  onCompleteAction: (result: ActionResultInfo) => void;
  completedResult: ActionResultInfo | null;
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
  code: ({
    children,
    className,
  }: {
    children?: React.ReactNode;
    className?: string;
  }) => {
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

// ─── ACTION_RESULT Parsing ───────────────────────────────────────────────────

interface ParsedActionThreadPart {
  type: "markdown" | "action_result";
  content: string;
}

function parseActionThreadMessage(content: string): ParsedActionThreadPart[] {
  const parts: ParsedActionThreadPart[] = [];
  const blockRegex =
    /<!-- ACTION_RESULT -->([\s\S]*?)<!-- \/ACTION_RESULT -->/g;
  let lastIndex = 0;
  let match;

  while ((match = blockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const before = content.slice(lastIndex, match.index).trim();
      if (before) parts.push({ type: "markdown", content: before });
    }
    parts.push({ type: "action_result", content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  const remaining = content.slice(lastIndex).trim();
  if (remaining) parts.push({ type: "markdown", content: remaining });

  if (parts.length === 0) {
    parts.push({ type: "markdown", content });
  }

  return parts;
}

// ─── Output Type Icon ────────────────────────────────────────────────────────

function OutputTypeIcon({
  outputType,
}: {
  outputType: ActionResultInfo["outputType"];
}) {
  switch (outputType) {
    case "email_draft":
      return <Mail className="h-3 w-3" />;
    case "talking_points":
      return <ListChecks className="h-3 w-3" />;
    case "analysis":
      return <BarChart3 className="h-3 w-3" />;
    case "checklist":
      return <ClipboardList className="h-3 w-3" />;
    default:
      return <FileText className="h-3 w-3" />;
  }
}

function outputTypeLabel(outputType: ActionResultInfo["outputType"]): string {
  switch (outputType) {
    case "email_draft":
      return "Email Draft";
    case "talking_points":
      return "Talking Points";
    case "analysis":
      return "Analysis";
    case "checklist":
      return "Checklist";
    default:
      return "Output";
  }
}

// ─── Action Result Card (inline in chat) ─────────────────────────────────────

function ActionResultCard({
  jsonContent,
  onApprove,
  isApproved,
}: {
  jsonContent: string;
  onApprove: (result: ActionResultInfo) => void;
  isApproved: boolean;
}) {
  const resultInfo = useMemo<ActionResultInfo | null>(() => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed && parsed.title && parsed.content) return parsed as ActionResultInfo;
      return null;
    } catch {
      return null;
    }
  }, [jsonContent]);

  if (!resultInfo) return null;

  return (
    <div
      className={cn(
        "rounded-lg border overflow-hidden my-2",
        isApproved
          ? "border-green-300 bg-green-50/40"
          : "border-indigo-200/60 bg-indigo-50/30"
      )}
    >
      <div
        className={cn(
          "px-3 py-2 border-b flex items-center gap-2",
          isApproved
            ? "bg-green-50/60 border-green-200/40"
            : "bg-indigo-50/60 border-indigo-200/40"
        )}
      >
        <OutputTypeIcon outputType={resultInfo.outputType} />
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider",
            isApproved ? "text-green-700" : "text-indigo-700"
          )}
        >
          {outputTypeLabel(resultInfo.outputType)}
        </span>
        {isApproved && (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-semibold border border-green-200 ml-auto">
            <CheckCircle className="h-2.5 w-2.5" />
            Approved
          </span>
        )}
      </div>
      <div className="px-3 py-2.5">
        <div className="mb-1.5">
          <span className="text-[12px] font-semibold text-foreground">
            {resultInfo.title}
          </span>
          <p className="text-[10px] text-foreground/60 mt-0.5">
            {resultInfo.summary}
          </p>
        </div>
        <div className="text-[11px] text-foreground/80 leading-relaxed bg-white/60 rounded-md border border-warm-200/30 px-2.5 py-2 max-h-[200px] overflow-y-auto whitespace-pre-wrap">
          {resultInfo.content}
        </div>
      </div>
      <div className="px-3 py-2 border-t border-warm-200/30">
        <Button
          size="sm"
          onClick={() => onApprove(resultInfo)}
          disabled={isApproved}
          className={cn(
            "h-7 px-3 text-[10px] font-medium gap-1 w-full",
            isApproved
              ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-100 cursor-default"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          )}
        >
          <CheckCircle className="h-3 w-3" />
          {isApproved ? "Approved" : "Approve & Use"}
        </Button>
      </div>
    </div>
  );
}

// ─── Thread Message Bubble ───────────────────────────────────────────────────

function ActionThreadMessageBubble({
  message,
  onApproveResult,
  completedResult,
}: {
  message: ActionThreadMessage;
  onApproveResult: (result: ActionResultInfo) => void;
  completedResult: ActionResultInfo | null;
}) {
  const isAssistant = message.role === "assistant";

  const parsedParts = useMemo(
    () => (isAssistant ? parseActionThreadMessage(message.content) : null),
    [isAssistant, message.content]
  );

  return (
    <div className={cn("flex gap-2.5", !isAssistant && "flex-row-reverse")}>
      <div
        className={cn(
          "h-6 w-6 rounded-md flex items-center justify-center shrink-0 mt-0.5",
          isAssistant
            ? "bg-indigo-100 text-indigo-600"
            : "bg-warm-200 text-warm-600"
        )}
      >
        {isAssistant ? (
          <Zap className="h-3 w-3" />
        ) : (
          <User className="h-3 w-3" />
        )}
      </div>
      <div
        className={cn(
          "rounded-lg px-3 py-2 max-w-[88%]",
          isAssistant
            ? "bg-indigo-50/60 text-foreground border border-indigo-200/40"
            : "bg-warm-800 text-warm-50"
        )}
      >
        {isAssistant && parsedParts ? (
          <div>
            {parsedParts.map((part, idx) =>
              part.type === "action_result" ? (
                <ActionResultCard
                  key={idx}
                  jsonContent={part.content}
                  onApprove={onApproveResult}
                  isApproved={
                    completedResult !== null &&
                    (() => {
                      try {
                        const parsed = JSON.parse(part.content);
                        return parsed.title === completedResult.title;
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

function ActionThreadTypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="h-6 w-6 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
        <Zap className="h-3 w-3" />
      </div>
      <div className="bg-indigo-50/60 border border-indigo-200/40 rounded-lg px-3 py-2">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" />
            <span
              className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <span
              className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
          <span className="text-[10px] text-indigo-400 ml-1">
            Analyzing action...
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Phase Indicator ─────────────────────────────────────────────────────────

function PhaseIndicator({
  messages,
  completedResult,
}: {
  messages: ActionThreadMessage[];
  completedResult: ActionResultInfo | null;
}) {
  const hasAssistantMessage = messages.some((m) => m.role === "assistant");
  const hasUserMessage = messages.some((m) => m.role === "user");

  let phase: "verify" | "instruct" | "approve" = "verify";
  if (completedResult) {
    phase = "approve";
  } else if (hasUserMessage && hasAssistantMessage) {
    phase = "instruct";
  } else if (hasAssistantMessage) {
    phase = "verify";
  }

  const phases = [
    { key: "verify" as const, label: "Verify" },
    { key: "instruct" as const, label: "Instruct" },
    { key: "approve" as const, label: "Approve" },
  ];

  const phaseIndex = phases.findIndex((p) => p.key === phase);

  return (
    <div className="flex items-center gap-1.5 px-4 py-2 border-b border-indigo-200/30 bg-indigo-50/20">
      {phases.map((p, idx) => {
        const isActive = idx === phaseIndex;
        const isCompleted = idx < phaseIndex;
        const Icon = isCompleted
          ? CircleCheck
          : isActive
            ? CircleDot
            : Circle;

        return (
          <div key={p.key} className="flex items-center gap-1.5">
            {idx > 0 && (
              <div
                className={cn(
                  "w-4 h-px",
                  isCompleted ? "bg-indigo-400" : "bg-warm-200"
                )}
              />
            )}
            <div
              className={cn(
                "flex items-center gap-1",
                isActive
                  ? "text-indigo-600"
                  : isCompleted
                    ? "text-indigo-400"
                    : "text-warm-300"
              )}
            >
              <Icon className="h-3 w-3" />
              <span
                className={cn(
                  "text-[10px]",
                  isActive ? "font-semibold" : "font-medium"
                )}
              >
                {p.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Category Badge ──────────────────────────────────────────────────────────

function CategoryBadge({
  category,
}: {
  category: RecommendedAction["category"];
}) {
  const config: Record<
    RecommendedAction["category"],
    { label: string; className: string }
  > = {
    email: {
      label: "Email",
      className: "bg-blue-50 text-blue-600 border-blue-200",
    },
    analysis: {
      label: "Analysis",
      className: "bg-violet-50 text-violet-600 border-violet-200",
    },
    "follow-up": {
      label: "Follow-up",
      className: "bg-amber-50 text-amber-600 border-amber-200",
    },
    internal: {
      label: "Internal",
      className: "bg-warm-50 text-warm-600 border-warm-200",
    },
    strategic: {
      label: "Strategic",
      className: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
  };

  const c = config[category];
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded-md border text-[9px] font-semibold",
        c.className
      )}
    >
      {c.label}
    </span>
  );
}

function PriorityDot({ priority }: { priority: RecommendedAction["priority"] }) {
  const colorClass =
    priority === "high"
      ? "bg-red-400"
      : priority === "medium"
        ? "bg-amber-400"
        : "bg-warm-300";

  return (
    <span
      className={cn("w-1.5 h-1.5 rounded-full shrink-0", colorClass)}
      title={`${priority} priority`}
    />
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ActionExplorerPanel({
  action,
  enquirySummary,
  messages,
  onMessagesChange,
  onCompleteAction,
  completedResult,
  onClose,
}: ActionExplorerPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitializedRef = useRef<string | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-trigger the sub-agent when the panel mounts with a new action
  useEffect(() => {
    if (hasInitializedRef.current === action.id) return;
    if (messages.length > 0) {
      hasInitializedRef.current = action.id;
      return;
    }

    hasInitializedRef.current = action.id;
    triggerSubAgent([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action.id]);

  // Focus input when panel mounts
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const triggerSubAgent = async (
    conversationMessages: ActionThreadMessage[]
  ) => {
    if (!action) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/concierge/action-thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
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

      const assistantMsg: ActionThreadMessage = {
        id: `action-assistant-${Date.now()}`,
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
      console.error("Action thread error:", error);
      const errorMsg: ActionThreadMessage = {
        id: `action-error-${Date.now()}`,
        role: "assistant",
        content:
          "I encountered an error processing this action. Please try again.",
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
    if (!inputValue.trim() || isLoading || !action) return;

    const userMsg: ActionThreadMessage = {
      id: `action-user-${Date.now()}`,
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
      {/* ── Action Header ──────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-indigo-200/60 bg-gradient-to-b from-indigo-50/80 to-card">
        <div className="px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Action Explorer
                </span>
                {completedResult && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-semibold border border-green-200">
                    <CheckCircle className="h-2.5 w-2.5" />
                    Completed
                  </span>
                )}
              </div>
              <h3 className="text-[13px] font-bold text-foreground leading-tight">
                {action.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <CategoryBadge category={action.category} />
                <PriorityDot priority={action.priority} />
                <span className="text-[10px] text-muted-foreground capitalize">
                  {action.priority} priority
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-7 w-7 rounded-md flex items-center justify-center text-warm-400 hover:text-foreground hover:bg-warm-100 transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Action description */}
          <p className="mt-2 text-[11px] text-foreground/60 leading-relaxed">
            {action.description}
          </p>
        </div>
      </div>

      {/* ── Phase Indicator ──────────────────────────────────────── */}
      <PhaseIndicator messages={messages} completedResult={completedResult} />

      {/* ── Chat Area ────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
        <div className="space-y-3">
          {messages.map((msg) =>
            msg.isLoading ? (
              <ActionThreadTypingIndicator key={msg.id} />
            ) : (
              <ActionThreadMessageBubble
                key={msg.id}
                message={msg}
                onApproveResult={onCompleteAction}
                completedResult={completedResult}
              />
            )
          )}
          {isLoading && messages.every((m) => !m.isLoading) && (
            <ActionThreadTypingIndicator />
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
            placeholder="Give instructions or ask questions..."
            disabled={isLoading}
            className="h-9 text-[12px] bg-warm-50 border-warm-200 placeholder:text-warm-400 focus-visible:ring-indigo-300"
          />
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="h-9 w-9 p-0 bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { DealCard, stageColors, stageConfig, coworkChatMessages, ChatMessage } from "@/lib/mock-data";
import { ArtifactRenderer } from "@/components/artifact-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Bot,
  User,
  Send,
  FileText,
  Mail,
  Table2,
  Presentation,
  CheckSquare,
  GitCompare,
  CalendarClock,
  PenTool,
  Lightbulb,
  RotateCcw,
  GitMerge,
} from "lucide-react";

interface CoworkModeProps {
  deal: DealCard;
  onBack: () => void;
  onApprove: (dealId: string) => void;
  readOnly?: boolean;
  onCowork?: () => void;
  onRework?: () => void;
}

const artifactIcons: Record<string, typeof FileText> = {
  email: Mail,
  document: FileText,
  spreadsheet: Table2,
  slides: Presentation,
  checklist: CheckSquare,
  comparison: GitCompare,
  timeline: CalendarClock,
  canvas: PenTool,
};

export function CoworkMode({ deal, onBack, onApprove, readOnly = false, onCowork, onRework }: CoworkModeProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(coworkChatMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stageColor = stageColors[deal.stage];
  const ArtifactIcon = artifactIcons[deal.artifact.type] || FileText;

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: inputValue, timestamp: "Now" };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "I've made that change. The updated version is now showing on the left.",
        "Good catch — I've revised that section. Take a look.",
        "Done. I've restructured it as you suggested.",
        "Updated. Numbers are consistent with last call data.",
        "I've adjusted the tolerances per your input. DFM analysis is clean now.",
        "Pricing updated. Margin improved by 2 points with the material substitution.",
      ];
      setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, role: "ai", content: responses[Math.floor(Math.random() * responses.length)], timestamp: "Now" }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="h-12 border-b border-warm-200/80 px-4 flex items-center justify-between bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={onBack}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back
          </Button>
          <Separator orientation="vertical" className="h-4 bg-warm-200" />
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium" style={{ backgroundColor: `${stageColor}18`, color: stageColor, borderColor: `${stageColor}30` }}>
            {stageConfig[deal.stage].label}
          </Badge>
          <span className="text-sm font-medium text-foreground truncate max-w-md">{deal.title}</span>
          <span className="text-xs text-muted-foreground">{deal.company}</span>
        </div>
        <div className="flex items-center gap-2">
          {readOnly && onRework && (
            <Button variant="outline" size="sm" className="h-7 text-[11px] rounded-lg border-warm-200" onClick={onRework}>
              <RotateCcw className="h-3 w-3 mr-1" />
              Rework
            </Button>
          )}
          {readOnly && onCowork && (
            <Button variant="outline" size="sm" className="h-7 text-[11px] rounded-lg border-warm-200" onClick={onCowork}>
              <GitMerge className="h-3 w-3 mr-1" />
              Cowork
            </Button>
          )}
          <Button size="sm" className="h-7 text-[11px] rounded-lg bg-warm-800 hover:bg-warm-700 text-warm-50" onClick={() => onApprove(deal.id)}>
            <CheckCircle className="h-3 w-3 mr-1" />
            Approve{readOnly ? "" : " & Exit"}
          </Button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Artifact */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-warm-200/80">
          <div className="px-4 py-2 border-b border-warm-200/60 flex items-center gap-2 bg-warm-50/30">
            <ArtifactIcon className="h-3.5 w-3.5 text-warm-500" />
            <span className="text-xs font-medium text-foreground">{deal.artifact.title}</span>
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium capitalize">{deal.artifact.type}</Badge>
            {!readOnly && <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium bg-green-50 text-green-700 border-green-200">Editable</Badge>}
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <div className="mb-4 p-3 rounded-xl bg-warm-50 border border-warm-200/60">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-3 w-3 text-amber-600" />
                <span className="text-[11px] font-semibold text-warm-700">Context from AI</span>
              </div>
              <ul className="space-y-1">
                {deal.aiNotes.map((note, i) => (
                  <li key={i} className="text-[11px] text-muted-foreground leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:h-1 before:w-1 before:rounded-full before:bg-warm-300">{note}</li>
                ))}
              </ul>
            </div>
            <ArtifactRenderer artifact={deal.artifact} editable={!readOnly} />
          </div>
        </div>

        {/* Right: Copilot */}
        <div className="w-[360px] flex flex-col shrink-0 bg-card">
          <div className="px-4 py-2.5 border-b border-warm-200/80 flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-warm-800 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-warm-50" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-foreground">Copilot</h3>
              <p className="text-[10px] text-muted-foreground">{readOnly ? "Reviewing this with you" : "Working on this with you"}</p>
            </div>
          </div>

          <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "ai" ? "bg-warm-800 text-warm-50" : "bg-warm-200 text-warm-600"}`}>
                    {msg.role === "ai" ? <Bot className="h-2.5 w-2.5" /> : <User className="h-2.5 w-2.5" />}
                  </div>
                  <div className={`rounded-xl px-3 py-2 max-w-[85%] ${msg.role === "ai" ? "bg-warm-100/60 text-foreground" : "bg-warm-800 text-warm-50"}`}>
                    <p className="text-[12px] leading-relaxed">{msg.content}</p>
                    <span className={`text-[9px] mt-1 block ${msg.role === "ai" ? "text-muted-foreground" : "text-warm-300"}`}>{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="h-5 w-5 rounded-md bg-warm-800 text-warm-50 flex items-center justify-center shrink-0">
                    <Bot className="h-2.5 w-2.5" />
                  </div>
                  <div className="bg-warm-100/60 rounded-xl px-3 py-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick actions */}
          <div className="px-4 py-2 border-t border-warm-200/40">
            <div className="flex gap-1 flex-wrap">
              {(deal.artifact.type === "canvas"
                ? ["Fix wall thickness", "Update tolerances", "Add revision note", "Run moldflow"]
                : deal.artifact.type === "spreadsheet"
                ? ["Reduce unit cost", "Add line item", "Recalculate margins", "Apply volume discount"]
                : ["Make it more concise", "Adjust the numbers", "Change the tone", "Add more detail"]
              ).map((action) => (
                <button key={action} onClick={() => setInputValue(action)} className="text-[10px] px-2 py-0.5 rounded-md bg-warm-100/80 text-warm-600 hover:bg-warm-200 transition-colors">
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-warm-200/80">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={readOnly ? "Ask about this..." : "Tell me what to change..."}
                className="h-8 text-xs bg-warm-50 border-warm-200 placeholder:text-warm-400 focus-visible:ring-warm-300"
              />
              <Button size="sm" onClick={handleSend} disabled={!inputValue.trim()} className="h-8 w-8 p-0 bg-warm-800 hover:bg-warm-700 text-warm-50">
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, defaultChatMessages } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PanelRightClose,
  PanelRightOpen,
  Send,
  Sparkles,
  Bot,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AISidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  messages?: ChatMessage[];
  isCoworkMode?: boolean;
}

export function AISidebar({
  isOpen,
  onToggle,
  messages: externalMessages,
  isCoworkMode = false,
}: AISidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    externalMessages || defaultChatMessages
  );
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (externalMessages) {
      setMessages(externalMessages);
    }
  }, [externalMessages]);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: "Now",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = isCoworkMode
        ? [
            "Got it. I've updated the document with your changes. Take a look at the revised version on the left.",
            "I see what you mean. Let me restructure that section — I'll keep the data points but reframe the narrative.",
            "Done. I've also adjusted the supporting figures to be consistent with the change you requested.",
            "Good call. I've updated this and also flagged two other sections that might need the same treatment.",
          ]
        : [
            "I'll look into that for you. Give me a moment to pull the relevant data.",
            "Based on what I'm seeing in the CRM, here's what I'd recommend for your next step.",
            "I've updated the dashboard with that information. You should see the changes reflected now.",
            "That's a solid approach. I've drafted a few options for you to consider — check the priority section.",
          ];
      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: randomResponse,
        timestamp: "Now",
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={onToggle}
        className={cn(
          "fixed top-4 right-4 z-50 p-2 rounded-lg border border-warm-200 bg-card shadow-sm hover:bg-warm-100 transition-all duration-200",
          isOpen && "right-[340px]"
        )}
      >
        {isOpen ? (
          <PanelRightClose className="h-4 w-4 text-warm-600" />
        ) : (
          <PanelRightOpen className="h-4 w-4 text-warm-600" />
        )}
      </button>

      {/* Sidebar panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[340px] bg-card border-l border-warm-200 shadow-xl z-40 transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-warm-200/80 flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="h-7 w-7 rounded-lg bg-warm-800 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-warm-50" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {isCoworkMode ? "Copilot" : "Forge AI"}
              </h3>
              <p className="text-[10px] text-muted-foreground">
                {isCoworkMode
                  ? "Working on this artifact with you"
                  : "Your sales workspace assistant"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2.5",
                  msg.role === "user" && "flex-row-reverse"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "h-6 w-6 rounded-md flex items-center justify-center shrink-0 mt-0.5",
                    msg.role === "ai"
                      ? "bg-warm-800 text-warm-50"
                      : "bg-warm-200 text-warm-600"
                  )}
                >
                  {msg.role === "ai" ? (
                    <Bot className="h-3 w-3" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                </div>
                {/* Message bubble */}
                <div
                  className={cn(
                    "rounded-xl px-3 py-2 max-w-[85%]",
                    msg.role === "ai"
                      ? "bg-warm-100/60 text-foreground"
                      : "bg-warm-800 text-warm-50"
                  )}
                >
                  <p className="text-[13px] leading-relaxed">{msg.content}</p>
                  <span
                    className={cn(
                      "text-[10px] mt-1 block",
                      msg.role === "ai"
                        ? "text-muted-foreground"
                        : "text-warm-300"
                    )}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2.5">
                <div className="h-6 w-6 rounded-md bg-warm-800 text-warm-50 flex items-center justify-center shrink-0">
                  <Bot className="h-3 w-3" />
                </div>
                <div className="bg-warm-100/60 rounded-xl px-3 py-2">
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
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-3 border-t border-warm-200/80">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                isCoworkMode
                  ? "Tell me what to change..."
                  : "Ask anything..."
              }
              className="h-9 text-sm bg-warm-50 border-warm-200 placeholder:text-warm-400 focus-visible:ring-warm-300"
            />
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="h-9 w-9 p-0 bg-warm-800 hover:bg-warm-700 text-warm-50"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

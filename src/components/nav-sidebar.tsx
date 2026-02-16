"use client";

import { useState } from "react";
import { Home, Building2, Handshake, Settings, User, Zap, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export type Page = "home" | "accounts" | "deals" | "concierge";

const topItems: { icon: typeof Home; label: string; page: Page }[] = [
  { icon: Home, label: "Home", page: "home" },
  { icon: Inbox, label: "Concierge", page: "concierge" },
  { icon: Handshake, label: "Deals", page: "deals" },
  { icon: Building2, label: "Accounts", page: "accounts" },
];

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: User, label: "Profile" },
];

interface NavSidebarProps {
  activePage?: Page;
  onNavigate?: (page: Page) => void;
}

export function NavSidebar({ activePage = "home", onNavigate }: NavSidebarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full z-40 bg-warm-900 border-r border-warm-800 flex flex-col justify-between py-4 transition-all duration-200 ease-in-out",
        expanded ? "w-44" : "w-12"
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Top section */}
      <div className="space-y-1 px-2">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-1.5 py-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-warm-700 flex items-center justify-center shrink-0">
            <Zap className="h-3.5 w-3.5 text-warm-200" />
          </div>
          <span
            className={cn(
              "text-sm font-bold text-warm-100 whitespace-nowrap transition-opacity duration-200",
              expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}
          >
            Forge
          </span>
        </div>

        {topItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate?.(item.page)}
            className={cn(
              "flex items-center gap-2.5 w-full px-2 py-2 rounded-lg transition-colors",
              activePage === item.page
                ? "bg-warm-800 text-warm-100"
                : "text-warm-400 hover:text-warm-200 hover:bg-warm-800/50"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span
              className={cn(
                "text-[13px] font-medium whitespace-nowrap transition-opacity duration-200",
                expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              )}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Bottom section */}
      <div className="space-y-1 px-2">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-warm-400 hover:text-warm-200 hover:bg-warm-800/50 transition-colors"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span
              className={cn(
                "text-[13px] font-medium whitespace-nowrap transition-opacity duration-200",
                expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              )}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

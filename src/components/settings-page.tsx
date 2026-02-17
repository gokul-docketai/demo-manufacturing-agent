"use client";

import { useState } from "react";
import { Search, Plug, BookOpen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type SettingsTab = "integrations" | "knowledge-base";

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  abbr: string;
}

const integrations: Integration[] = [
  {
    id: "sap",
    name: "SAP S/4HANA",
    category: "ERP",
    description: "Enterprise resource planning and manufacturing",
    color: "bg-blue-600",
    abbr: "SAP",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    description: "Customer relationship management",
    color: "bg-sky-500",
    abbr: "SF",
  },
  {
    id: "oracle",
    name: "Oracle ERP Cloud",
    category: "ERP",
    description: "Cloud-based enterprise resource planning",
    color: "bg-red-600",
    abbr: "ORC",
  },
  {
    id: "dynamics",
    name: "Microsoft Dynamics 365",
    category: "CRM/ERP",
    description: "Unified business applications platform",
    color: "bg-indigo-600",
    abbr: "D365",
  },
  {
    id: "netsuite",
    name: "NetSuite",
    category: "ERP",
    description: "Cloud ERP for financials and operations",
    color: "bg-gray-700",
    abbr: "NS",
  },
  {
    id: "workday",
    name: "Workday",
    category: "HCM/Finance",
    description: "Human capital and financial management",
    color: "bg-orange-500",
    abbr: "WD",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "Marketing",
    description: "Inbound marketing and sales platform",
    color: "bg-orange-600",
    abbr: "HS",
  },
  {
    id: "servicenow",
    name: "ServiceNow",
    category: "ITSM",
    description: "IT service and workflow management",
    color: "bg-green-600",
    abbr: "SN",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    category: "Data",
    description: "Cloud data warehouse and analytics",
    color: "bg-cyan-500",
    abbr: "SF",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Team messaging and collaboration",
    color: "bg-purple-600",
    abbr: "SL",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    category: "Communication",
    description: "Enterprise communication platform",
    color: "bg-violet-600",
    abbr: "MT",
  },
  {
    id: "jira",
    name: "Jira",
    category: "Project Mgmt",
    description: "Issue tracking and project management",
    color: "bg-blue-500",
    abbr: "JR",
  },
  {
    id: "docusign",
    name: "DocuSign",
    category: "E-Signature",
    description: "Electronic signature and agreements",
    color: "bg-yellow-600",
    abbr: "DS",
  },
  {
    id: "tableau",
    name: "Tableau",
    category: "Analytics",
    description: "Business intelligence and visualization",
    color: "bg-blue-700",
    abbr: "TB",
  },
  {
    id: "zuora",
    name: "Zuora",
    category: "Billing",
    description: "Subscription billing and revenue",
    color: "bg-teal-600",
    abbr: "ZR",
  },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("integrations");
  const [search, setSearch] = useState("");
  const [connectedIds, setConnectedIds] = useState<Set<string>>(
    new Set(["sap", "salesforce"])
  );

  const filtered = integrations.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleConnection = (id: string) => {
    setConnectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const tabs: { id: SettingsTab; label: string; icon: typeof Plug }[] = [
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "knowledge-base", label: "Knowledge Base", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-warm-200/40 px-6 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-warm-500" />
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Settings
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage your integrations and configuration
            </p>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar tabs */}
        <nav className="w-56 shrink-0 border-r border-warm-200/40 min-h-[calc(100vh-68px)] bg-warm-50/30 p-3">
          <div className="space-y-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-warm-800 text-warm-50"
                    : "text-warm-600 hover:text-warm-800 hover:bg-warm-100"
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {activeTab === "integrations" && (
            <div className="p-6">
              {/* Integrations header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Integrations
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Connect your enterprise tools to sync data and automate workflows.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 border border-green-200 font-medium">
                    {connectedIds.size} connected
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-warm-100 text-warm-600 border border-warm-200 font-medium">
                    {integrations.length - connectedIds.size} available
                  </span>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                <Input
                  placeholder="Search integrations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-white border-warm-200 text-warm-900 placeholder:text-warm-400 focus-visible:ring-warm-300 max-w-sm"
                />
              </div>

              {/* Integration cards grid */}
              {filtered.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-warm-400 text-sm">
                  No integrations match your search.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filtered.map((integration) => {
                    const isConnected = connectedIds.has(integration.id);
                    return (
                      <div
                        key={integration.id}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-xl border transition-all",
                          isConnected
                            ? "bg-white border-green-200 shadow-sm"
                            : "bg-white border-warm-200 hover:border-warm-300 hover:shadow-sm"
                        )}
                      >
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 text-white text-[11px] font-bold tracking-wide",
                            integration.color
                          )}
                        >
                          {integration.abbr}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-warm-900 truncate">
                              {integration.name}
                            </span>
                            <span className="text-[10px] font-medium text-warm-500 bg-warm-100 px-1.5 py-0.5 rounded shrink-0">
                              {integration.category}
                            </span>
                          </div>
                          <p className="text-[12px] text-warm-500 mt-0.5 leading-relaxed">
                            {integration.description}
                          </p>
                          <button
                            onClick={() => toggleConnection(integration.id)}
                            className={cn(
                              "mt-2.5 text-[11px] font-semibold px-3 py-1 rounded-md transition-colors",
                              isConnected
                                ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                                : "bg-warm-100 text-warm-600 border border-warm-200 hover:bg-warm-200 hover:text-warm-700"
                            )}
                          >
                            {isConnected ? "Connected" : "Connect"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "knowledge-base" && (
            <div className="p-6">
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="h-14 w-14 rounded-2xl bg-warm-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-7 w-7 text-warm-400" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  Knowledge Base
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Upload documents, product catalogs, and training materials to enhance AI-powered responses. Coming soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

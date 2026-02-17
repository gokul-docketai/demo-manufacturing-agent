"use client";

import { useState, useRef, useCallback } from "react";
import {
  Search,
  Plug,
  BookOpen,
  Settings,
  FileText,
  FileSpreadsheet,
  Globe,
  ImageIcon,
  Upload,
  Trash2,
  Plus,
  Link,
  File,
} from "lucide-react";
import {
  SiSap,
  SiSalesforce,
  SiOracle,
  SiHubspot,
  SiSnowflake,
  SiJira,
  SiTableau,
  SiSage,
} from "react-icons/si";
import { BsMicrosoftTeams } from "react-icons/bs";
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type SettingsTab = "integrations" | "knowledge-base";
type AddDocumentMode = "upload" | "url";

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  iconColor: string;
}

interface KnowledgeBaseDocument {
  id: string;
  name: string;
  type: "pdf" | "docx" | "xlsx" | "csv" | "txt" | "image" | "url" | "other";
  source: "upload" | "url";
  url?: string;
  size?: string;
  addedAt: string;
}

function getDocType(
  filename: string
): KnowledgeBaseDocument["type"] {
  const ext = filename.toLowerCase().split(".").pop();
  switch (ext) {
    case "pdf":
      return "pdf";
    case "doc":
    case "docx":
      return "docx";
    case "xls":
    case "xlsx":
      return "xlsx";
    case "csv":
      return "csv";
    case "txt":
      return "txt";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return "image";
    default:
      return "other";
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocTypeIcon({ type }: { type: KnowledgeBaseDocument["type"] }) {
  const iconClass = "h-5 w-5";
  switch (type) {
    case "pdf":
      return <FileText className={cn(iconClass, "text-red-500")} />;
    case "docx":
      return <FileText className={cn(iconClass, "text-blue-500")} />;
    case "xlsx":
    case "csv":
      return <FileSpreadsheet className={cn(iconClass, "text-green-600")} />;
    case "image":
      return <ImageIcon className={cn(iconClass, "text-purple-500")} />;
    case "url":
      return <Globe className={cn(iconClass, "text-cyan-600")} />;
    case "txt":
      return <FileText className={cn(iconClass, "text-warm-500")} />;
    default:
      return <File className={cn(iconClass, "text-warm-400")} />;
  }
}

function IntegrationIcon({ id, className }: { id: string; className?: string }) {
  const iconClass = className || "h-5 w-5";

  switch (id) {
    case "sap":
      return <SiSap className={iconClass} />;
    case "salesforce":
      return <SiSalesforce className={iconClass} />;
    case "oracle":
      return <SiOracle className={iconClass} />;
    case "dynamics":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18L18.36 7.5 12 10.82 5.64 7.5 12 4.18zM5 8.82l6 3.32v6.36l-6-3.32V8.82zm8 9.68V12.14l6-3.32v6.36l-6 3.32z" />
        </svg>
      );
    case "netsuite":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
          <path d="M4 4h5v16H4V4zm11 0h5v16h-5V4zM9 4h6l-6 16h6" />
        </svg>
      );
    case "workday":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
          <circle cx="12" cy="8" r="3" />
          <circle cx="6" cy="14" r="2.5" />
          <circle cx="18" cy="14" r="2.5" />
          <circle cx="12" cy="18" r="2" />
        </svg>
      );
    case "hubspot":
      return <SiHubspot className={iconClass} />;
    case "servicenow":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.14-7-7 3.14-7 7-7zm0 2.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
        </svg>
      );
    case "snowflake":
      return <SiSnowflake className={iconClass} />;
    case "slack":
      return (
        <svg viewBox="0 0 128 128" className={iconClass}>
          <path d="M27.255 80.719c0 7.33-5.978 13.317-13.309 13.317C6.616 94.036.63 88.049.63 80.719s5.987-13.317 13.317-13.317h13.309zm6.709 0c0-7.33 5.987-13.317 13.317-13.317s13.317 5.986 13.317 13.317v33.335c0 7.33-5.986 13.317-13.317 13.317-7.33 0-13.317-5.987-13.317-13.317zm0 0" fill="#e01e5a"/>
          <path d="M47.281 27.255c-7.33 0-13.317-5.978-13.317-13.309C33.964 6.616 39.951.63 47.281.63s13.317 5.987 13.317 13.317v13.309zm0 6.709c7.33 0 13.317 5.987 13.317 13.317s-5.986 13.317-13.317 13.317H13.946C6.616 60.598.63 54.612.63 47.281c0-7.33 5.987-13.317 13.317-13.317zm0 0" fill="#36c5f0"/>
          <path d="M100.745 47.281c0-7.33 5.978-13.317 13.309-13.317 7.33 0 13.317 5.987 13.317 13.317s-5.987 13.317-13.317 13.317h-13.309zm-6.709 0c0 7.33-5.987 13.317-13.317 13.317s-13.317-5.986-13.317-13.317V13.946C67.402 6.616 73.388.63 80.719.63c7.33 0 13.317 5.987 13.317 13.317zm0 0" fill="#2eb67d"/>
          <path d="M80.719 100.745c7.33 0 13.317 5.978 13.317 13.309 0 7.33-5.987 13.317-13.317 13.317s-13.317-5.987-13.317-13.317v-13.309zm0-6.709c-7.33 0-13.317-5.987-13.317-13.317s5.986-13.317 13.317-13.317h33.335c7.33 0 13.317 5.986 13.317 13.317 0 7.33-5.987 13.317-13.317 13.317zm0 0" fill="#ecb22e"/>
        </svg>
      );
    case "teams":
      return <BsMicrosoftTeams className={iconClass} />;
    case "jira":
      return <SiJira className={iconClass} />;
    case "docusign":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
          <path d="M3 17.5l4.5-4.5L12 17.5l-4.5 4.5L3 17.5zm6-6L13.5 7 18 11.5 13.5 16 9 11.5zM15 5.5L17.5 3 22 7.5 19.5 10 15 5.5z" />
        </svg>
      );
    case "tableau":
      return <SiTableau className={iconClass} />;
    case "zuora":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
          <path d="M4 5h16v3H9.5L20 16v3H4v-3h10.5L4 8V5z" />
        </svg>
      );
    case "gdrive":
      return (
        <svg viewBox="0 0 87.3 78" className={iconClass}>
          <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L29 52.2H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
          <path d="M43.65 25.15L29.05 0c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A9.06 9.06 0 000 52.2h29z" fill="#00ac47"/>
          <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H58.3l6.7 11.9z" fill="#ea4335"/>
          <path d="M43.65 25.15L58.25 0H29.05l-14.6 25.15z" fill="#00832d"/>
          <path d="M58.3 52.2H29l-15.25 24.6c1.35.8 2.85 1.2 4.45 1.2h50.7c1.6 0 3.1-.45 4.45-1.2z" fill="#2684fc"/>
          <path d="M73.4 26.5L58.25 0c-1.35.8-2.5 1.9-3.3 3.3L29.55 47.3c-.4.7-.65 1.4-.8 2.2h58.55c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
        </svg>
      );
    case "outlook":
      return <PiMicrosoftOutlookLogoFill className={iconClass} />;
    case "sap-ariba":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
          <path d="M4 4h16v4H4V4zm0 6h10v10H4V10zm12 0h4v10h-4V10z" />
        </svg>
      );
    case "coupa":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14.5a4.5 4.5 0 010-9v2a2.5 2.5 0 100 5v2zm2-4a4.5 4.5 0 010-9v2a2.5 2.5 0 100 5v2z" />
        </svg>
      );
    case "epicor":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
          <path d="M3 4h18v3H7v3h12v3H7v3h14v3H3V4z" />
        </svg>
      );
    case "infor":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
          <circle cx="12" cy="5" r="2.5" />
          <rect x="10" y="9" width="4" height="12" rx="1" />
        </svg>
      );
    case "sage":
      return <SiSage className={iconClass} />;
    default:
      return <Plug className={iconClass} />;
  }
}

const mockDocuments: KnowledgeBaseDocument[] = [
  {
    id: "doc-1",
    name: "Product Catalog Q4 2025.pdf",
    type: "pdf",
    source: "upload",
    size: "4.2 MB",
    addedAt: "2025-11-12T10:30:00Z",
  },
  {
    id: "doc-2",
    name: "Material Specifications - Aluminum Alloys.xlsx",
    type: "xlsx",
    source: "upload",
    size: "1.8 MB",
    addedAt: "2025-11-05T14:15:00Z",
  },
  {
    id: "doc-3",
    name: "CNC Machining Tolerances Guide.pdf",
    type: "pdf",
    source: "upload",
    size: "2.1 MB",
    addedAt: "2025-10-28T09:00:00Z",
  },
  {
    id: "doc-4",
    name: "https://www.iso.org/standard/45001",
    type: "url",
    source: "url",
    url: "https://www.iso.org/standard/45001",
    addedAt: "2025-10-20T16:45:00Z",
  },
  {
    id: "doc-5",
    name: "Supplier Qualification Checklist.docx",
    type: "docx",
    source: "upload",
    size: "540 KB",
    addedAt: "2025-10-15T11:20:00Z",
  },
  {
    id: "doc-6",
    name: "https://engineeringtoolbox.com/metal-alloys-densities",
    type: "url",
    source: "url",
    url: "https://engineeringtoolbox.com/metal-alloys-densities",
    addedAt: "2025-09-30T08:10:00Z",
  },
];

const integrations: Integration[] = [
  {
    id: "sap",
    name: "SAP S/4HANA",
    category: "ERP",
    description: "Enterprise resource planning and manufacturing",
    iconColor: "text-[#0070F2]",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    description: "Customer relationship management",
    iconColor: "text-[#00A1E0]",
  },
  {
    id: "oracle",
    name: "Oracle ERP Cloud",
    category: "ERP",
    description: "Cloud-based enterprise resource planning",
    iconColor: "text-[#C74634]",
  },
  {
    id: "dynamics",
    name: "Microsoft Dynamics 365",
    category: "CRM/ERP",
    description: "Unified business applications platform",
    iconColor: "text-[#002050]",
  },
  {
    id: "netsuite",
    name: "NetSuite",
    category: "ERP",
    description: "Cloud ERP for financials and operations",
    iconColor: "text-[#1A1A1A]",
  },
  {
    id: "workday",
    name: "Workday",
    category: "HCM/Finance",
    description: "Human capital and financial management",
    iconColor: "text-[#F68D2E]",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "Marketing",
    description: "Inbound marketing and sales platform",
    iconColor: "text-[#FF7A59]",
  },
  {
    id: "servicenow",
    name: "ServiceNow",
    category: "ITSM",
    description: "IT service and workflow management",
    iconColor: "text-[#81B5A1]",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    category: "Data",
    description: "Cloud data warehouse and analytics",
    iconColor: "text-[#29B5E8]",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Team messaging and collaboration",
    iconColor: "text-[#611F69]",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    category: "Communication",
    description: "Enterprise communication platform",
    iconColor: "text-[#6264A7]",
  },
  {
    id: "jira",
    name: "Jira",
    category: "Project Mgmt",
    description: "Issue tracking and project management",
    iconColor: "text-[#0052CC]",
  },
  {
    id: "docusign",
    name: "DocuSign",
    category: "E-Signature",
    description: "Electronic signature and agreements",
    iconColor: "text-[#FFCC22]",
  },
  {
    id: "tableau",
    name: "Tableau",
    category: "Analytics",
    description: "Business intelligence and visualization",
    iconColor: "text-[#E97627]",
  },
  {
    id: "zuora",
    name: "Zuora",
    category: "Billing",
    description: "Subscription billing and revenue",
    iconColor: "text-[#2E6599]",
  },
  {
    id: "gdrive",
    name: "Google Drive",
    category: "Document",
    description: "Cloud document storage and collaboration",
    iconColor: "text-[#4285F4]",
  },
  {
    id: "outlook",
    name: "Outlook",
    category: "Email",
    description: "Email and calendar integration",
    iconColor: "text-[#0078D4]",
  },
  {
    id: "sap-ariba",
    name: "SAP Ariba",
    category: "Procurement",
    description: "Supplier management and procurement network",
    iconColor: "text-[#F0AB00]",
  },
  {
    id: "coupa",
    name: "Coupa",
    category: "Procurement",
    description: "Business spend management platform",
    iconColor: "text-[#E4002B]",
  },
  {
    id: "epicor",
    name: "Epicor",
    category: "ERP",
    description: "Manufacturing ERP and supply chain management",
    iconColor: "text-[#ED1C24]",
  },
  {
    id: "infor",
    name: "Infor",
    category: "ERP",
    description: "Industry-specific cloud ERP solutions",
    iconColor: "text-[#007DC3]",
  },
  {
    id: "sage",
    name: "Sage",
    category: "Finance",
    description: "Accounting and financial management",
    iconColor: "text-[#00D639]",
  },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("integrations");
  const [search, setSearch] = useState("");
  const [connectedIds, setConnectedIds] = useState<Set<string>>(
    new Set(["sap", "salesforce", "snowflake", "slack", "docusign", "jira", "tableau", "gdrive", "outlook", "sap-ariba"])
  );

  // Knowledge Base state
  const [documents, setDocuments] = useState<KnowledgeBaseDocument[]>(mockDocuments);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addMode, setAddMode] = useState<AddDocumentMode>("upload");
  const [urlInput, setUrlInput] = useState("");
  const [urlNameInput, setUrlNameInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [kbSearch, setKbSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(kbSearch.toLowerCase())
  );

  const handleFileUpload = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newDocs: KnowledgeBaseDocument[] = fileArray.map((file) => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        type: getDocType(file.name),
        source: "upload" as const,
        size: formatFileSize(file.size),
        addedAt: new Date().toISOString(),
      }));
      setDocuments((prev) => [...newDocs, ...prev]);
      setShowAddDialog(false);
    },
    []
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      handleFileUpload(files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFileUpload]
  );

  const handleAddUrl = useCallback(() => {
    const url = urlInput.trim();
    if (!url) return;
    const newDoc: KnowledgeBaseDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: urlNameInput.trim() || url,
      type: "url",
      source: "url",
      url,
      addedAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setUrlInput("");
    setUrlNameInput("");
    setShowAddDialog(false);
  }, [urlInput, urlNameInput]);

  const handleDeleteDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
      }
    },
    [handleFileUpload]
  );

  const openAddDialog = useCallback((mode: AddDocumentMode = "upload") => {
    setAddMode(mode);
    setUrlInput("");
    setUrlNameInput("");
    setShowAddDialog(true);
  }, []);

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
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 bg-warm-50 border border-warm-200/60">
                          <IntegrationIcon id={integration.id} className={cn("h-6 w-6", integration.iconColor)} />
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
              {/* Knowledge Base header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Knowledge Base
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Upload documents, product catalogs, and training materials to enhance AI-powered responses.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-warm-100 text-warm-600 border border-warm-200 text-xs font-medium">
                    {documents.length} {documents.length === 1 ? "document" : "documents"}
                  </span>
                  <button
                    onClick={() => openAddDialog("upload")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warm-800 text-warm-50 text-[12px] font-semibold hover:bg-warm-900 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Document
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                <Input
                  placeholder="Search documents..."
                  value={kbSearch}
                  onChange={(e) => setKbSearch(e.target.value)}
                  className="pl-9 bg-white border-warm-200 text-warm-900 placeholder:text-warm-400 focus-visible:ring-warm-300 max-w-sm"
                />
              </div>

              {/* Document list */}
              {filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-warm-100 flex items-center justify-center mb-4">
                    <BookOpen className="h-7 w-7 text-warm-400" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-foreground mb-1">
                    {kbSearch ? "No documents match your search" : "No documents yet"}
                  </h3>
                  <p className="text-[13px] text-muted-foreground max-w-sm mb-4">
                    {kbSearch
                      ? "Try a different search term."
                      : "Upload files or add URLs to build your knowledge base."}
                  </p>
                  {!kbSearch && (
                    <button
                      onClick={() => openAddDialog("upload")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-warm-800 text-warm-50 text-[13px] font-semibold hover:bg-warm-900 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Your First Document
                    </button>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-warm-200 bg-white overflow-hidden">
                  {/* Table header */}
                  <div className="grid grid-cols-[1fr_100px_100px_80px_48px] items-center gap-3 px-4 py-2.5 bg-warm-50/60 border-b border-warm-200/60">
                    <span className="text-[11px] font-semibold text-warm-500 uppercase tracking-wider">Name</span>
                    <span className="text-[11px] font-semibold text-warm-500 uppercase tracking-wider">Source</span>
                    <span className="text-[11px] font-semibold text-warm-500 uppercase tracking-wider">Size</span>
                    <span className="text-[11px] font-semibold text-warm-500 uppercase tracking-wider">Added</span>
                    <span />
                  </div>

                  {/* Rows */}
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="grid grid-cols-[1fr_100px_100px_80px_48px] items-center gap-3 px-4 py-3 border-b border-warm-100 last:border-b-0 hover:bg-warm-50/40 transition-colors group"
                    >
                      {/* Name + icon */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-lg bg-warm-50 border border-warm-200/60 flex items-center justify-center shrink-0">
                          <DocTypeIcon type={doc.type} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-warm-900 truncate">
                            {doc.source === "url" && doc.url ? (
                              <span className="flex items-center gap-1.5">
                                {doc.name === doc.url ? doc.url : doc.name}
                              </span>
                            ) : (
                              doc.name
                            )}
                          </p>
                          {doc.source === "url" && doc.url && doc.name !== doc.url && (
                            <p className="text-[11px] text-warm-400 truncate mt-0.5">
                              {doc.url}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Source badge */}
                      <div>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium",
                            doc.source === "upload"
                              ? "bg-blue-50 text-blue-600 border border-blue-200"
                              : "bg-cyan-50 text-cyan-700 border border-cyan-200"
                          )}
                        >
                          {doc.source === "upload" ? (
                            <Upload className="h-2.5 w-2.5" />
                          ) : (
                            <Link className="h-2.5 w-2.5" />
                          )}
                          {doc.source === "upload" ? "Upload" : "URL"}
                        </span>
                      </div>

                      {/* Size */}
                      <span className="text-[12px] text-warm-500">
                        {doc.size || "—"}
                      </span>

                      {/* Date */}
                      <span className="text-[12px] text-warm-500">
                        {new Date(doc.addedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="h-8 w-8 rounded-md flex items-center justify-center text-warm-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove document"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Document Dialog */}
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="sm:max-w-lg bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-warm-900">Add Document</DialogTitle>
                    <DialogDescription>
                      Upload files or add a URL to your knowledge base.
                    </DialogDescription>
                  </DialogHeader>

                  {/* Mode tabs */}
                  <div className="flex gap-1 p-1 rounded-lg bg-warm-100 mb-2">
                    <button
                      onClick={() => setAddMode("upload")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
                        addMode === "upload"
                          ? "bg-white text-warm-900 shadow-sm"
                          : "text-warm-500 hover:text-warm-700"
                      )}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Files
                    </button>
                    <button
                      onClick={() => setAddMode("url")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
                        addMode === "url"
                          ? "bg-white text-warm-900 shadow-sm"
                          : "text-warm-500 hover:text-warm-700"
                      )}
                    >
                      <Link className="h-4 w-4" />
                      Add URL
                    </button>
                  </div>

                  {/* Upload mode */}
                  {addMode === "upload" && (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.gif,.webp"
                        onChange={handleFileInputChange}
                      />
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                          isDragging
                            ? "border-warm-500 bg-warm-50"
                            : "border-warm-200 hover:border-warm-400 hover:bg-warm-50/50"
                        )}
                      >
                        <div className="h-12 w-12 rounded-2xl bg-warm-100 flex items-center justify-center mx-auto mb-3">
                          <Upload className="h-6 w-6 text-warm-400" />
                        </div>
                        <p className="text-[13px] font-medium text-warm-700 mb-1">
                          {isDragging ? "Drop files here" : "Click to browse or drag files here"}
                        </p>
                        <p className="text-[11px] text-warm-400">
                          PDF, DOCX, XLSX, CSV, TXT, or images
                        </p>
                      </div>
                    </div>
                  )}

                  {/* URL mode */}
                  {addMode === "url" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[12px] font-medium text-warm-700 mb-1.5 block">
                          URL
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                          <Input
                            placeholder="https://example.com/document"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddUrl();
                            }}
                            className="pl-9 bg-white border-warm-200 text-warm-900 placeholder:text-warm-400 focus-visible:ring-warm-300"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[12px] font-medium text-warm-700 mb-1.5 block">
                          Display Name <span className="text-warm-400 font-normal">(optional)</span>
                        </label>
                        <Input
                          placeholder="e.g. ISO 45001 Standard Reference"
                          value={urlNameInput}
                          onChange={(e) => setUrlNameInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddUrl();
                          }}
                          className="bg-white border-warm-200 text-warm-900 placeholder:text-warm-400 focus-visible:ring-warm-300"
                        />
                      </div>
                      <button
                        onClick={handleAddUrl}
                        disabled={!urlInput.trim()}
                        className={cn(
                          "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors",
                          urlInput.trim()
                            ? "bg-warm-800 text-warm-50 hover:bg-warm-900"
                            : "bg-warm-200 text-warm-400 cursor-not-allowed"
                        )}
                      >
                        <Plus className="h-4 w-4" />
                        Add URL
                      </button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

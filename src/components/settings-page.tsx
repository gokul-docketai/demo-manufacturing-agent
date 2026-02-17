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
  color: string;
  abbr: string;
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

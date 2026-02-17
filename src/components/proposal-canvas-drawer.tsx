"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Share2,
  Download,
  Send,
  Plus,
  Trash2,
  FileText,
  Building2,
  Calendar,
  Hash,
  Target,
  Clock,
  CheckSquare,
  ListChecks,
  X,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ProposalTimelineItem {
  phase: string;
  duration: string;
  description: string;
}

export interface ProposalInvestmentItem {
  description: string;
  amount: number;
}

export interface ProposalData {
  proposalNumber: string;
  date: string;
  validUntil: string;
  to: {
    company: string;
    contact: string;
    email: string;
  };
  projectTitle: string;
  executiveSummary: string;
  scope: string[];
  deliverables: string[];
  timeline: ProposalTimelineItem[];
  investment: ProposalInvestmentItem[];
  terms: string;
}

interface ProposalCanvasDrawerProps {
  proposalData: ProposalData | null;
  onClose: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ProposalCanvasDrawer({
  proposalData,
  onClose,
}: ProposalCanvasDrawerProps) {
  const [proposal, setProposal] = useState<ProposalData | null>(null);

  useEffect(() => {
    if (proposalData) {
      setProposal(structuredClone(proposalData));
    }
  }, [proposalData]);

  const totalInvestment = proposal
    ? proposal.investment.reduce((sum, item) => sum + item.amount, 0)
    : 0;

  // ─── Investment helpers ───────────────────────────────────────
  const updateInvestmentItem = useCallback(
    (index: number, field: keyof ProposalInvestmentItem, value: string | number) => {
      setProposal((prev) => {
        if (!prev) return prev;
        const next = structuredClone(prev);
        if (field === "amount") {
          next.investment[index].amount = Number(value) || 0;
        } else {
          next.investment[index].description = String(value);
        }
        return next;
      });
    },
    []
  );

  const addInvestmentItem = useCallback(() => {
    setProposal((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      next.investment.push({ description: "", amount: 0 });
      return next;
    });
  }, []);

  const removeInvestmentItem = useCallback((index: number) => {
    setProposal((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      next.investment.splice(index, 1);
      return next;
    });
  }, []);

  // ─── Timeline helpers ─────────────────────────────────────────
  const updateTimelineItem = useCallback(
    (index: number, field: keyof ProposalTimelineItem, value: string) => {
      setProposal((prev) => {
        if (!prev) return prev;
        const next = structuredClone(prev);
        next.timeline[index][field] = value;
        return next;
      });
    },
    []
  );

  const addTimelineItem = useCallback(() => {
    setProposal((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      next.timeline.push({ phase: "", duration: "", description: "" });
      return next;
    });
  }, []);

  const removeTimelineItem = useCallback((index: number) => {
    setProposal((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      next.timeline.splice(index, 1);
      return next;
    });
  }, []);

  // ─── Scope / Deliverables helpers ─────────────────────────────
  const updateListItem = useCallback(
    (listKey: "scope" | "deliverables", index: number, value: string) => {
      setProposal((prev) => {
        if (!prev) return prev;
        const next = structuredClone(prev);
        next[listKey][index] = value;
        return next;
      });
    },
    []
  );

  const addListItem = useCallback((listKey: "scope" | "deliverables") => {
    setProposal((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      next[listKey].push("");
      return next;
    });
  }, []);

  const removeListItem = useCallback(
    (listKey: "scope" | "deliverables", index: number) => {
      setProposal((prev) => {
        if (!prev) return prev;
        const next = structuredClone(prev);
        next[listKey].splice(index, 1);
        return next;
      });
    },
    []
  );

  // ─── Actions ──────────────────────────────────────────────────
  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(
      `https://app.psc-sales.com/proposals/${proposal?.proposalNumber || "draft"}`
    );
    toast.success("Link copied to clipboard");
  }, [proposal?.proposalNumber]);

  const handleDownload = useCallback(async () => {
    if (!proposal) return;
    toast.info("Generating PDF…");

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const pw = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;
    const cw = pw - margin * 2;
    let y = 0;

    const fmt = (v: number) =>
      v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });

    const textLineH = 11;

    const renderWrappedText = (
      text: string,
      x: number,
      startY: number,
      maxW: number
    ): number => {
      const lines: string[] = doc.splitTextToSize(text, maxW);
      let cy = startY;
      for (const line of lines) {
        if (cy + textLineH > pageH - margin) {
          doc.addPage();
          cy = margin;
        }
        doc.text(line, x, cy);
        cy += textLineH;
      }
      return cy;
    };

    const ensureSpace = (needed: number) => {
      if (y + needed > pageH - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // ── Header bar ───────────────────────────────────────────────
    doc.setFillColor(30, 41, 82);
    doc.rect(0, 0, pw, 80, "F");

    doc.setTextColor(250, 248, 245);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Precision Steering Components", margin, 30);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("5200 Industrial Parkway, Milwaukee, WI 53223", margin, 45);
    doc.text("sales@psc-mfg.com · (414) 555-0192", margin, 56);

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("PROPOSAL", pw - margin, 40, { align: "right" });

    y = 100;

    // ── Metadata + Prepared For ──────────────────────────────────
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");

    const metaLabelX = margin;
    const metaValX = margin + 75;

    doc.text("Proposal #", metaLabelX, y);
    doc.setFont("helvetica", "normal");
    doc.text(proposal.proposalNumber, metaValX, y);
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.text("Date", metaLabelX, y);
    doc.setFont("helvetica", "normal");
    doc.text(proposal.date, metaValX, y);
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.text("Valid Until", metaLabelX, y);
    doc.setFont("helvetica", "normal");
    doc.text(proposal.validUntil, metaValX, y);

    const billX = pw / 2 + 20;
    let billY = 100;
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(140, 130, 120);
    doc.text("PREPARED FOR", billX, billY);
    billY += 14;
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(9);
    doc.text(proposal.to.company, billX, billY);
    billY += 13;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(proposal.to.contact, billX, billY);
    billY += 12;
    doc.setTextColor(100, 100, 100);
    doc.text(proposal.to.email, billX, billY);

    y = Math.max(y, billY) + 24;

    // ── Project Title ────────────────────────────────────────────
    doc.setDrawColor(210, 200, 190);
    doc.line(margin, y, pw - margin, y);
    y += 20;

    doc.setTextColor(30, 41, 82);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(proposal.projectTitle, margin, y);
    y += 20;

    // ── Executive Summary ────────────────────────────────────────
    ensureSpace(40);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(140, 130, 120);
    doc.text("EXECUTIVE SUMMARY", margin, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    y = renderWrappedText(proposal.executiveSummary, margin, y, cw);
    y += 16;

    // ── Scope of Work ────────────────────────────────────────────
    ensureSpace(40);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(140, 130, 120);
    doc.text("SCOPE OF WORK", margin, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    for (const item of proposal.scope) {
      ensureSpace(14);
      doc.text(`•  ${item}`, margin + 8, y);
      y += 12;
    }
    y += 8;

    // ── Deliverables ─────────────────────────────────────────────
    ensureSpace(40);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(140, 130, 120);
    doc.text("DELIVERABLES", margin, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    for (const item of proposal.deliverables) {
      ensureSpace(14);
      doc.text(`•  ${item}`, margin + 8, y);
      y += 12;
    }
    y += 8;

    // ── Timeline ─────────────────────────────────────────────────
    ensureSpace(50);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(140, 130, 120);
    doc.text("TIMELINE", margin, y);
    y += 14;

    // Table header
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("PHASE", margin, y);
    doc.text("DURATION", margin + cw * 0.35, y);
    doc.text("DESCRIPTION", margin + cw * 0.52, y);
    y += 6;
    doc.setDrawColor(30, 41, 82);
    doc.setLineWidth(1.2);
    doc.line(margin, y, pw - margin, y);
    y += 12;
    doc.setLineWidth(0.3);

    doc.setFontSize(8);
    for (let i = 0; i < proposal.timeline.length; i++) {
      const t = proposal.timeline[i];
      ensureSpace(20);
      if (i % 2 === 1) {
        doc.setFillColor(245, 245, 252);
        doc.rect(margin, y - 4, cw, 16, "F");
      }
      doc.setFont("helvetica", "bold");
      doc.setTextColor(50, 50, 50);
      doc.text(t.phase, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(t.duration, margin + cw * 0.35, y);
      doc.setTextColor(80, 80, 80);
      doc.text(t.description, margin + cw * 0.52, y);
      y += 16;
    }
    y += 8;

    // ── Investment ───────────────────────────────────────────────
    ensureSpace(50);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(140, 130, 120);
    doc.text("INVESTMENT", margin, y);
    y += 14;

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("DESCRIPTION", margin, y);
    doc.text("AMOUNT", pw - margin, y, { align: "right" });
    y += 6;
    doc.setDrawColor(30, 41, 82);
    doc.setLineWidth(1.2);
    doc.line(margin, y, pw - margin, y);
    y += 12;
    doc.setLineWidth(0.3);

    doc.setFontSize(8);
    let invTotal = 0;
    for (let i = 0; i < proposal.investment.length; i++) {
      const inv = proposal.investment[i];
      invTotal += inv.amount;
      ensureSpace(20);
      if (i % 2 === 1) {
        doc.setFillColor(245, 245, 252);
        doc.rect(margin, y - 4, cw, 16, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      doc.text(inv.description, margin, y);
      doc.setFont("helvetica", "bold");
      doc.text(fmt(inv.amount), pw - margin, y, { align: "right" });
      y += 16;
    }

    y += 4;
    doc.setDrawColor(30, 41, 82);
    doc.setLineWidth(1.2);
    const totLabelX = pw - margin - 160;
    doc.line(totLabelX, y, pw - margin, y);
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text("Total Investment", totLabelX, y);
    doc.text(fmt(invTotal), pw - margin, y, { align: "right" });
    doc.setLineWidth(0.3);
    y += 24;

    // ── Terms ────────────────────────────────────────────────────
    if (proposal.terms) {
      ensureSpace(30);
      doc.setDrawColor(210, 200, 190);
      doc.line(margin, y, pw - margin, y);
      y += 14;
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(140, 130, 120);
      doc.text("TERMS & CONDITIONS", margin, y);
      y += 12;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      y = renderWrappedText(proposal.terms, margin, y, cw);
    }

    doc.save(`${proposal.proposalNumber || "proposal"}.pdf`);
    toast.success("PDF downloaded");
  }, [proposal]);

  const handleSend = useCallback(() => {
    toast.success(`Proposal sent to ${proposal?.to.email || "customer"}`);
  }, [proposal?.to.email]);

  const formatCurrency = (val: number) =>
    val.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  if (!proposal) return null;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ── Action Bar ─────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-warm-200/60 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-indigo-700 text-white flex items-center justify-center shrink-0">
            <FileText className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-sm font-semibold text-foreground truncate block">
              {proposal.proposalNumber}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Draft
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-7 px-2 text-[10px] font-medium border-warm-300 text-warm-700 hover:bg-warm-100 gap-1"
          >
            <Share2 className="h-3 w-3" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="h-7 px-2 text-[10px] font-medium border-warm-300 text-warm-700 hover:bg-warm-100 gap-1"
          >
            <Download className="h-3 w-3" />
            Download
          </Button>
          <Button
            size="sm"
            onClick={handleSend}
            className="h-7 px-2 text-[10px] font-medium bg-indigo-700 hover:bg-indigo-600 text-white gap-1"
          >
            <Send className="h-3 w-3" />
            Send
          </Button>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-md flex items-center justify-center text-warm-400 hover:text-foreground hover:bg-warm-100 transition-colors shrink-0 ml-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Proposal Document Body ─────────────────────────────────── */}
      <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="bg-white rounded-xl border border-warm-200/80 shadow-sm overflow-hidden">
              {/* Company Header */}
              <div className="px-8 py-6 bg-indigo-800 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">
                      Precision Steering Components
                    </h1>
                    <p className="text-indigo-200 text-[12px] mt-1">
                      5200 Industrial Parkway, Milwaukee, WI 53223
                    </p>
                    <p className="text-indigo-200 text-[12px]">
                      sales@psc-mfg.com &middot; (414) 555-0192
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold tracking-tight text-white uppercase">
                      Proposal
                    </span>
                  </div>
                </div>
              </div>

              {/* Proposal Metadata + Prepared For */}
              <div className="px-8 py-5 grid grid-cols-2 gap-6 border-b border-warm-200/60">
                {/* Left — Proposal Details */}
                <div className="space-y-2.5">
                  <MetadataField
                    icon={Hash}
                    label="Proposal #"
                    value={proposal.proposalNumber}
                    onChange={(v) =>
                      setProposal((p) =>
                        p ? { ...p, proposalNumber: v } : p
                      )
                    }
                  />
                  <MetadataField
                    icon={Calendar}
                    label="Date"
                    value={proposal.date}
                    onChange={(v) =>
                      setProposal((p) => (p ? { ...p, date: v } : p))
                    }
                  />
                  <MetadataField
                    icon={Calendar}
                    label="Valid Until"
                    value={proposal.validUntil}
                    onChange={(v) =>
                      setProposal((p) => (p ? { ...p, validUntil: v } : p))
                    }
                  />
                </div>

                {/* Right — Prepared For */}
                <div>
                  <span className="text-[10px] font-bold text-warm-400 uppercase tracking-widest mb-2 block">
                    Prepared For
                  </span>
                  <div className="space-y-1">
                    <EditableText
                      value={proposal.to.company}
                      onChange={(v) =>
                        setProposal((p) =>
                          p ? { ...p, to: { ...p.to, company: v } } : p
                        )
                      }
                      className="text-sm font-semibold text-foreground"
                      icon={Building2}
                    />
                    <EditableText
                      value={proposal.to.contact}
                      onChange={(v) =>
                        setProposal((p) =>
                          p ? { ...p, to: { ...p.to, contact: v } } : p
                        )
                      }
                      className="text-[13px] text-foreground/80"
                    />
                    <EditableText
                      value={proposal.to.email}
                      onChange={(v) =>
                        setProposal((p) =>
                          p ? { ...p, to: { ...p.to, email: v } } : p
                        )
                      }
                      className="text-[12px] text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Project Title */}
              <div className="px-8 py-4 border-b border-warm-200/60">
                <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest mb-1.5 block">
                  Project Title
                </label>
                <input
                  type="text"
                  value={proposal.projectTitle}
                  onChange={(e) =>
                    setProposal((p) =>
                      p ? { ...p, projectTitle: e.target.value } : p
                    )
                  }
                  className="w-full bg-transparent border-none outline-none text-base font-bold text-indigo-800 focus:bg-warm-50 focus:ring-1 focus:ring-indigo-300 rounded px-1 -ml-1"
                />
              </div>

              {/* Executive Summary */}
              <div className="px-8 py-4 border-b border-warm-200/60">
                <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest mb-1.5 block">
                  Executive Summary
                </label>
                <textarea
                  value={proposal.executiveSummary}
                  onChange={(e) =>
                    setProposal((p) =>
                      p ? { ...p, executiveSummary: e.target.value } : p
                    )
                  }
                  rows={4}
                  className="w-full text-[12px] text-foreground/80 leading-relaxed bg-transparent border border-warm-200/40 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-300 resize-none"
                />
              </div>

              {/* Scope of Work */}
              <div className="px-8 py-4 border-b border-warm-200/60">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-3.5 w-3.5 text-indigo-500" />
                  <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest">
                    Scope of Work
                  </label>
                </div>
                <div className="space-y-1.5">
                  {proposal.scope.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 group">
                      <span className="text-[11px] text-indigo-400 mt-1.5 shrink-0">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          updateListItem("scope", idx, e.target.value)
                        }
                        className="flex-1 bg-transparent border-none outline-none text-[12px] text-foreground/80 focus:bg-warm-50 focus:ring-1 focus:ring-indigo-300 rounded px-1"
                      />
                      <button
                        onClick={() => removeListItem("scope", idx)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-50 text-warm-400 hover:text-red-500 mt-0.5"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addListItem("scope")}
                  className="mt-2 flex items-center gap-1.5 text-[11px] text-indigo-500 hover:text-indigo-700 transition-colors font-medium"
                >
                  <Plus className="h-3 w-3" />
                  Add scope item
                </button>
              </div>

              {/* Deliverables */}
              <div className="px-8 py-4 border-b border-warm-200/60">
                <div className="flex items-center gap-2 mb-3">
                  <CheckSquare className="h-3.5 w-3.5 text-indigo-500" />
                  <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest">
                    Deliverables
                  </label>
                </div>
                <div className="space-y-1.5">
                  {proposal.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 group">
                      <ListChecks className="h-3 w-3 text-indigo-400 mt-1.5 shrink-0" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          updateListItem("deliverables", idx, e.target.value)
                        }
                        className="flex-1 bg-transparent border-none outline-none text-[12px] text-foreground/80 focus:bg-warm-50 focus:ring-1 focus:ring-indigo-300 rounded px-1"
                      />
                      <button
                        onClick={() => removeListItem("deliverables", idx)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-50 text-warm-400 hover:text-red-500 mt-0.5"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addListItem("deliverables")}
                  className="mt-2 flex items-center gap-1.5 text-[11px] text-indigo-500 hover:text-indigo-700 transition-colors font-medium"
                >
                  <Plus className="h-3 w-3" />
                  Add deliverable
                </button>
              </div>

              {/* Timeline */}
              <div className="px-8 py-5 border-b border-warm-200/60">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-3.5 w-3.5 text-indigo-500" />
                  <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest">
                    Timeline
                  </label>
                </div>
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b-2 border-indigo-800">
                      <th className="text-left py-2 font-bold text-foreground uppercase tracking-wider text-[10px] w-[25%]">
                        Phase
                      </th>
                      <th className="text-left py-2 font-bold text-foreground uppercase tracking-wider text-[10px] w-[20%]">
                        Duration
                      </th>
                      <th className="text-left py-2 font-bold text-foreground uppercase tracking-wider text-[10px] w-[50%]">
                        Description
                      </th>
                      <th className="w-[5%]" />
                    </tr>
                  </thead>
                  <tbody>
                    {proposal.timeline.map((t, idx) => (
                      <tr
                        key={idx}
                        className={cn(
                          "border-b border-warm-200/40 group",
                          idx % 2 === 0 ? "bg-white" : "bg-indigo-50/20"
                        )}
                      >
                        <td className="py-2 pr-2">
                          <input
                            type="text"
                            value={t.phase}
                            onChange={(e) =>
                              updateTimelineItem(idx, "phase", e.target.value)
                            }
                            className="w-full bg-transparent border-none outline-none text-[12px] text-foreground/90 font-semibold focus:bg-warm-50 focus:ring-1 focus:ring-indigo-300 rounded px-1 -ml-1"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            type="text"
                            value={t.duration}
                            onChange={(e) =>
                              updateTimelineItem(
                                idx,
                                "duration",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-none outline-none text-[12px] text-foreground/90 focus:bg-warm-50 focus:ring-1 focus:ring-indigo-300 rounded px-1"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            type="text"
                            value={t.description}
                            onChange={(e) =>
                              updateTimelineItem(
                                idx,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-none outline-none text-[12px] text-foreground/80 focus:bg-warm-50 focus:ring-1 focus:ring-indigo-300 rounded px-1"
                          />
                        </td>
                        <td className="py-2 text-center">
                          <button
                            onClick={() => removeTimelineItem(idx)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-50 text-warm-400 hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={addTimelineItem}
                  className="mt-2 flex items-center gap-1.5 text-[11px] text-indigo-500 hover:text-indigo-700 transition-colors font-medium"
                >
                  <Plus className="h-3 w-3" />
                  Add phase
                </button>
              </div>

              {/* Investment Table */}
              <div className="px-8 py-5">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b-2 border-indigo-800">
                      <th className="text-left py-2 font-bold text-foreground uppercase tracking-wider text-[10px] w-[75%]">
                        Description
                      </th>
                      <th className="text-right py-2 font-bold text-foreground uppercase tracking-wider text-[10px] w-[20%]">
                        Amount
                      </th>
                      <th className="w-[5%]" />
                    </tr>
                  </thead>
                  <tbody>
                    {proposal.investment.map((inv, idx) => (
                      <tr
                        key={idx}
                        className={cn(
                          "border-b border-warm-200/40 group",
                          idx % 2 === 0 ? "bg-white" : "bg-indigo-50/20"
                        )}
                      >
                        <td className="py-2 pr-2">
                          <input
                            type="text"
                            value={inv.description}
                            onChange={(e) =>
                              updateInvestmentItem(
                                idx,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-none outline-none text-[12px] text-foreground/90 focus:bg-warm-50 focus:ring-1 focus:ring-indigo-300 rounded px-1 -ml-1"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={inv.amount}
                            onChange={(e) =>
                              updateInvestmentItem(
                                idx,
                                "amount",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-none outline-none text-[12px] text-foreground/90 text-right focus:bg-warm-50 focus:ring-1 focus:ring-indigo-300 rounded px-1"
                          />
                        </td>
                        <td className="py-2 text-center">
                          <button
                            onClick={() => removeInvestmentItem(idx)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-50 text-warm-400 hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button
                  onClick={addInvestmentItem}
                  className="mt-2 flex items-center gap-1.5 text-[11px] text-indigo-500 hover:text-indigo-700 transition-colors font-medium"
                >
                  <Plus className="h-3 w-3" />
                  Add investment item
                </button>

                {/* Total */}
                <div className="mt-4 flex justify-end">
                  <div className="w-[250px] space-y-1.5">
                    <div className="border-t-2 border-indigo-800 pt-1.5 flex justify-between text-sm font-bold text-foreground">
                      <span>Total Investment</span>
                      <span>{formatCurrency(totalInvestment)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="px-8 py-4 border-t border-warm-200/60 bg-indigo-50/20">
                <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest mb-1.5 block">
                  Terms &amp; Conditions
                </label>
                <textarea
                  value={proposal.terms}
                  onChange={(e) =>
                    setProposal((p) =>
                      p ? { ...p, terms: e.target.value } : p
                    )
                  }
                  rows={3}
                  className="w-full text-[12px] text-foreground/70 leading-relaxed bg-transparent border border-warm-200/40 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-300 resize-none"
                />
              </div>
            </div>
          </div>
      </ScrollArea>
    </div>
  );
}

// ─── Inline Editable Helpers ────────────────────────────────────────────────

function MetadataField({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3 w-3 text-warm-400 shrink-0" />
      <span className="text-[10px] font-bold text-warm-400 uppercase tracking-wider w-[72px] shrink-0">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-[13px] text-foreground font-medium focus:bg-warm-50 focus:ring-1 focus:ring-indigo-300 rounded px-1 -ml-1"
      />
    </div>
  );
}

function EditableText({
  value,
  onChange,
  className,
  icon: Icon,
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Icon && <Icon className="h-3 w-3 text-warm-400 shrink-0" />}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "bg-transparent border-none outline-none focus:bg-warm-50 focus:ring-1 focus:ring-indigo-300 rounded px-1 -ml-1 w-full",
          className
        )}
      />
    </div>
  );
}

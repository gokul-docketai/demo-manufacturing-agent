"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
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
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface QuoteLineItem {
  description: string;
  qty: number;
  unit: string;
  unitPrice: number;
}

export interface QuoteData {
  quoteNumber: string;
  date: string;
  validUntil: string;
  to: {
    company: string;
    contact: string;
    email: string;
  };
  lineItems: QuoteLineItem[];
  notes: string;
  terms: string;
}

interface QuoteCanvasDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteData: QuoteData | null;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function QuoteCanvasDrawer({
  open,
  onOpenChange,
  quoteData,
}: QuoteCanvasDrawerProps) {
  const [quote, setQuote] = useState<QuoteData | null>(null);

  useEffect(() => {
    if (quoteData) {
      setQuote(structuredClone(quoteData));
    }
  }, [quoteData]);

  const subtotal = quote
    ? quote.lineItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
    : 0;

  const updateLineItem = useCallback(
    (index: number, field: keyof QuoteLineItem, value: string | number) => {
      setQuote((prev) => {
        if (!prev) return prev;
        const next = structuredClone(prev);
        const item = next.lineItems[index];
        if (field === "qty" || field === "unitPrice") {
          item[field] = Number(value) || 0;
        } else if (field === "description" || field === "unit") {
          item[field] = String(value);
        }
        return next;
      });
    },
    []
  );

  const addLineItem = useCallback(() => {
    setQuote((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      next.lineItems.push({
        description: "",
        qty: 1,
        unit: "pcs",
        unitPrice: 0,
      });
      return next;
    });
  }, []);

  const removeLineItem = useCallback((index: number) => {
    setQuote((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      next.lineItems.splice(index, 1);
      return next;
    });
  }, []);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(
      `https://app.psc-sales.com/quotes/${quote?.quoteNumber || "draft"}`
    );
    toast.success("Link copied to clipboard");
  }, [quote?.quoteNumber]);

  const handleDownload = useCallback(async () => {
    if (!quote) return;
    toast.info("Generating PDF…");

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const pw = doc.internal.pageSize.getWidth();
    const margin = 40;
    const cw = pw - margin * 2; // content width
    let y = 0;

    const fmt = (v: number) =>
      v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });

    // ── Header bar ───────────────────────────────────────────────
    doc.setFillColor(62, 51, 40); // warm-800
    doc.rect(0, 0, pw, 80, "F");

    doc.setTextColor(250, 248, 245); // warm-50
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Precision Steering Components", margin, 30);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("5200 Industrial Parkway, Milwaukee, WI 53223", margin, 45);
    doc.text("sales@psc-mfg.com · (414) 555-0192", margin, 56);

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("QUOTE", pw - margin, 40, { align: "right" });

    y = 100;

    // ── Metadata + Bill To ───────────────────────────────────────
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");

    const metaLabelX = margin;
    const metaValX = margin + 65;

    doc.text("Quote #", metaLabelX, y);
    doc.setFont("helvetica", "normal");
    doc.text(quote.quoteNumber, metaValX, y);
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.text("Date", metaLabelX, y);
    doc.setFont("helvetica", "normal");
    doc.text(quote.date, metaValX, y);
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.text("Valid Until", metaLabelX, y);
    doc.setFont("helvetica", "normal");
    doc.text(quote.validUntil, metaValX, y);

    // Bill To (right column)
    const billX = pw / 2 + 20;
    let billY = 100;
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(140, 130, 120);
    doc.text("BILL TO", billX, billY);
    billY += 14;
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(9);
    doc.text(quote.to.company, billX, billY);
    billY += 13;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(quote.to.contact, billX, billY);
    billY += 12;
    doc.setTextColor(100, 100, 100);
    doc.text(quote.to.email, billX, billY);

    y = Math.max(y, billY) + 24;

    // ── Divider ──────────────────────────────────────────────────
    doc.setDrawColor(210, 200, 190);
    doc.line(margin, y, pw - margin, y);
    y += 16;

    // ── Table Header ─────────────────────────────────────────────
    const descMaxW = cw * 0.42;
    const colX = {
      desc: margin,
      qty: margin + cw * 0.47,
      unit: margin + cw * 0.56,
      price: margin + cw * 0.72,
      amount: pw - margin,
    };

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("DESCRIPTION", colX.desc, y);
    doc.text("QTY", colX.qty, y, { align: "right" });
    doc.text("UNIT", colX.unit, y, { align: "center" });
    doc.text("UNIT PRICE", colX.price, y, { align: "right" });
    doc.text("AMOUNT", colX.amount, y, { align: "right" });

    y += 6;
    doc.setDrawColor(62, 51, 40);
    doc.setLineWidth(1.2);
    doc.line(margin, y, pw - margin, y);
    y += 14;
    doc.setLineWidth(0.3);

    // ── Line Items ───────────────────────────────────────────────
    const fontSize = 8;
    const lineHeight = fontSize * 1.4; // pt per text line
    const rowPadTop = 6;
    const rowPadBot = 8;
    doc.setFontSize(fontSize);
    let itemSubtotal = 0;

    for (let i = 0; i < quote.lineItems.length; i++) {
      const item = quote.lineItems[i];
      const lineAmt = item.qty * item.unitPrice;
      itemSubtotal += lineAmt;

      // Pre-calculate wrapped description lines
      doc.setFont("helvetica", "normal");
      const descLines: string[] = doc.splitTextToSize(
        item.description,
        descMaxW
      );
      const textBlockH = descLines.length * lineHeight;
      const rowH = rowPadTop + textBlockH + rowPadBot;

      // Page break guard (check BEFORE drawing)
      if (y + rowH > doc.internal.pageSize.getHeight() - 100) {
        doc.addPage();
        y = margin;
      }

      // Alternating row background
      if (i % 2 === 1) {
        doc.setFillColor(250, 248, 245);
        doc.rect(margin, y - 2, cw, rowH, "F");
      }

      // Row separator line
      doc.setDrawColor(230, 225, 218);
      doc.setLineWidth(0.3);
      doc.line(margin, y - 2, pw - margin, y - 2);

      const textY = y + rowPadTop;

      // Description (multi-line)
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      doc.text(descLines, colX.desc, textY);

      // Qty, Unit, Price, Amount (aligned to first text line)
      doc.text(String(item.qty), colX.qty, textY, { align: "right" });
      doc.text(item.unit, colX.unit, textY, { align: "center" });
      doc.text(fmt(item.unitPrice), colX.price, textY, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.text(fmt(lineAmt), colX.amount, textY, { align: "right" });

      y += rowH;
    }

    // Final row separator
    doc.setDrawColor(230, 225, 218);
    doc.line(margin, y - 2, pw - margin, y - 2);

    // ── Totals ───────────────────────────────────────────────────
    y += 8;
    const totLabelX = pw - margin - 160;
    const totValX = pw - margin;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text("Subtotal", totLabelX, y);
    doc.text(fmt(itemSubtotal), totValX, y, { align: "right" });
    y += 14;
    doc.text("Tax", totLabelX, y);
    doc.text("--", totValX, y, { align: "right" });
    y += 8;
    doc.setDrawColor(62, 51, 40);
    doc.setLineWidth(1.2);
    doc.line(totLabelX, y, pw - margin, y);
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text("Total", totLabelX, y);
    doc.text(fmt(itemSubtotal), totValX, y, { align: "right" });
    doc.setLineWidth(0.3);

    y += 30;

    // Helper: render wrapped text with automatic page breaks
    const pageH = doc.internal.pageSize.getHeight();
    const textLineH = 11; // pt per line of body text

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

    // ── Notes ────────────────────────────────────────────────────
    if (quote.notes) {
      if (y + 30 > pageH - margin) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(140, 130, 120);
      doc.text("NOTES", margin, y);
      y += 12;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(70, 70, 70);
      y = renderWrappedText(quote.notes, margin, y, cw);
      y += 16;
    }

    // ── Terms ────────────────────────────────────────────────────
    if (quote.terms) {
      if (y + 30 > pageH - margin) {
        doc.addPage();
        y = margin;
      }
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
      y = renderWrappedText(quote.terms, margin, y, cw);
    }

    doc.save(`${quote.quoteNumber || "quote"}.pdf`);
    toast.success("PDF downloaded");
  }, [quote]);

  const handleSend = useCallback(() => {
    toast.success(`Quote sent to ${quote?.to.email || "customer"}`);
  }, [quote?.to.email]);

  const formatCurrency = (val: number) =>
    val.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  if (!quote) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[700px] p-0 flex flex-col"
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">Quote {quote.quoteNumber}</SheetTitle>

        {/* ── Action Bar ─────────────────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-warm-200/60 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-warm-800 text-warm-50 flex items-center justify-center">
              <FileText className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground">
                {quote.quoteNumber}
              </span>
              <span className="text-[11px] text-muted-foreground ml-2">
                Draft
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8 px-3 text-[11px] font-medium border-warm-300 text-warm-700 hover:bg-warm-100 gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-3 text-[11px] font-medium border-warm-300 text-warm-700 hover:bg-warm-100 gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              className="h-8 px-3 text-[11px] font-medium bg-warm-800 hover:bg-warm-700 text-warm-50 gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              Send
            </Button>
          </div>
        </div>

        {/* ── Quote Document Body ────────────────────────────────────── */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="bg-white rounded-xl border border-warm-200/80 shadow-sm overflow-hidden">
              {/* Company Header */}
              <div className="px-8 py-6 bg-warm-800 text-warm-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">
                      Precision Steering Components
                    </h1>
                    <p className="text-warm-300 text-[12px] mt-1">
                      5200 Industrial Parkway, Milwaukee, WI 53223
                    </p>
                    <p className="text-warm-300 text-[12px]">
                      sales@psc-mfg.com &middot; (414) 555-0192
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold tracking-tight text-warm-50 uppercase">
                      Quote
                    </span>
                  </div>
                </div>
              </div>

              {/* Quote Metadata + Bill To */}
              <div className="px-8 py-5 grid grid-cols-2 gap-6 border-b border-warm-200/60">
                {/* Left — Quote Details */}
                <div className="space-y-2.5">
                  <MetadataField
                    icon={Hash}
                    label="Quote #"
                    value={quote.quoteNumber}
                    onChange={(v) =>
                      setQuote((p) => (p ? { ...p, quoteNumber: v } : p))
                    }
                  />
                  <MetadataField
                    icon={Calendar}
                    label="Date"
                    value={quote.date}
                    onChange={(v) =>
                      setQuote((p) => (p ? { ...p, date: v } : p))
                    }
                  />
                  <MetadataField
                    icon={Calendar}
                    label="Valid Until"
                    value={quote.validUntil}
                    onChange={(v) =>
                      setQuote((p) => (p ? { ...p, validUntil: v } : p))
                    }
                  />
                </div>

                {/* Right — Bill To */}
                <div>
                  <span className="text-[10px] font-bold text-warm-400 uppercase tracking-widest mb-2 block">
                    Bill To
                  </span>
                  <div className="space-y-1">
                    <EditableText
                      value={quote.to.company}
                      onChange={(v) =>
                        setQuote((p) =>
                          p ? { ...p, to: { ...p.to, company: v } } : p
                        )
                      }
                      className="text-sm font-semibold text-foreground"
                      icon={Building2}
                    />
                    <EditableText
                      value={quote.to.contact}
                      onChange={(v) =>
                        setQuote((p) =>
                          p ? { ...p, to: { ...p.to, contact: v } } : p
                        )
                      }
                      className="text-[13px] text-foreground/80"
                    />
                    <EditableText
                      value={quote.to.email}
                      onChange={(v) =>
                        setQuote((p) =>
                          p ? { ...p, to: { ...p.to, email: v } } : p
                        )
                      }
                      className="text-[12px] text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="px-8 py-5">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b-2 border-warm-800">
                      <th className="text-left py-2 font-bold text-foreground uppercase tracking-wider text-[10px] w-[40%]">
                        Description
                      </th>
                      <th className="text-right py-2 font-bold text-foreground uppercase tracking-wider text-[10px] w-[12%]">
                        Qty
                      </th>
                      <th className="text-center py-2 font-bold text-foreground uppercase tracking-wider text-[10px] w-[12%]">
                        Unit
                      </th>
                      <th className="text-right py-2 font-bold text-foreground uppercase tracking-wider text-[10px] w-[16%]">
                        Unit Price
                      </th>
                      <th className="text-right py-2 font-bold text-foreground uppercase tracking-wider text-[10px] w-[16%]">
                        Amount
                      </th>
                      <th className="w-[4%]" />
                    </tr>
                  </thead>
                  <tbody>
                    {quote.lineItems.map((item, idx) => (
                      <tr
                        key={idx}
                        className={cn(
                          "border-b border-warm-200/40 group",
                          idx % 2 === 0 ? "bg-white" : "bg-warm-50/30"
                        )}
                      >
                        <td className="py-2 pr-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              updateLineItem(idx, "description", e.target.value)
                            }
                            className="w-full bg-transparent border-none outline-none text-[12px] text-foreground/90 focus:bg-warm-50 focus:ring-1 focus:ring-warm-300 rounded px-1 -ml-1"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              updateLineItem(idx, "qty", e.target.value)
                            }
                            className="w-full bg-transparent border-none outline-none text-[12px] text-foreground/90 text-right focus:bg-warm-50 focus:ring-1 focus:ring-warm-300 rounded px-1"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) =>
                              updateLineItem(idx, "unit", e.target.value)
                            }
                            className="w-full bg-transparent border-none outline-none text-[12px] text-foreground/90 text-center focus:bg-warm-50 focus:ring-1 focus:ring-warm-300 rounded px-1"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateLineItem(idx, "unitPrice", e.target.value)
                            }
                            className="w-full bg-transparent border-none outline-none text-[12px] text-foreground/90 text-right focus:bg-warm-50 focus:ring-1 focus:ring-warm-300 rounded px-1"
                          />
                        </td>
                        <td className="py-2 text-right text-[12px] text-foreground/90 font-medium pr-1">
                          {formatCurrency(item.qty * item.unitPrice)}
                        </td>
                        <td className="py-2 text-center">
                          <button
                            onClick={() => removeLineItem(idx)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-50 text-warm-400 hover:text-red-500"
                            title="Remove line item"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Add Line Item */}
                <button
                  onClick={addLineItem}
                  className="mt-2 flex items-center gap-1.5 text-[11px] text-warm-500 hover:text-warm-700 transition-colors font-medium"
                >
                  <Plus className="h-3 w-3" />
                  Add line item
                </button>

                {/* Totals */}
                <div className="mt-4 flex justify-end">
                  <div className="w-[250px] space-y-1.5">
                    <div className="flex justify-between text-[12px] text-foreground/70">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[12px] text-foreground/70">
                      <span>Tax</span>
                      <span>--</span>
                    </div>
                    <div className="border-t-2 border-warm-800 pt-1.5 flex justify-between text-sm font-bold text-foreground">
                      <span>Total</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="px-8 py-4 border-t border-warm-200/60">
                <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest mb-1.5 block">
                  Notes
                </label>
                <textarea
                  value={quote.notes}
                  onChange={(e) =>
                    setQuote((p) => (p ? { ...p, notes: e.target.value } : p))
                  }
                  rows={4}
                  className="w-full text-[12px] text-foreground/80 leading-relaxed bg-transparent border border-warm-200/40 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-warm-300 resize-none"
                />
              </div>

              {/* Terms */}
              <div className="px-8 py-4 border-t border-warm-200/60 bg-warm-50/30">
                <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest mb-1.5 block">
                  Terms &amp; Conditions
                </label>
                <textarea
                  value={quote.terms}
                  onChange={(e) =>
                    setQuote((p) => (p ? { ...p, terms: e.target.value } : p))
                  }
                  rows={2}
                  className="w-full text-[12px] text-foreground/70 leading-relaxed bg-transparent border border-warm-200/40 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-warm-300 resize-none"
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
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
        className="flex-1 bg-transparent border-none outline-none text-[13px] text-foreground font-medium focus:bg-warm-50 focus:ring-1 focus:ring-warm-300 rounded px-1 -ml-1"
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
          "bg-transparent border-none outline-none focus:bg-warm-50 focus:ring-1 focus:ring-warm-300 rounded px-1 -ml-1 w-full",
          className
        )}
      />
    </div>
  );
}

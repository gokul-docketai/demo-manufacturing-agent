"use client";

import { useState } from "react";
import {
  Artifact,
  EmailData,
  SpreadsheetData,
  SlideData,
  ChecklistData,
  ComparisonData,
  TimelineData,
  CanvasData,
} from "@/lib/mock-data";
import {
  Mail,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  StickyNote,
  Check,
  Circle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trophy,
  Sparkles,
  Ruler,
  AlertTriangle,
  FileText,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtifactRendererProps {
  artifact: Artifact;
  compact?: boolean;
  editable?: boolean;
}

export function ArtifactRenderer({ artifact, compact = false, editable = false }: ArtifactRendererProps) {
  if (!artifact.data) {
    return (
      <div className="rounded-xl border border-warm-200/80 bg-warm-50/50 p-4">
        <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
          {artifact.content}
        </pre>
      </div>
    );
  }

  switch (artifact.type) {
    case "email":
      return <EmailRenderer data={artifact.data as EmailData} compact={compact} />;
    case "spreadsheet":
      return <SpreadsheetRenderer data={artifact.data as SpreadsheetData} compact={compact} editable={editable} />;
    case "slides":
      return <SlidesRenderer data={artifact.data as SlideData} compact={compact} />;
    case "checklist":
      return <ChecklistRenderer data={artifact.data as ChecklistData} compact={compact} />;
    case "comparison":
      return <ComparisonRenderer data={artifact.data as ComparisonData} compact={compact} />;
    case "timeline":
      return <TimelineRenderer data={artifact.data as TimelineData} compact={compact} />;
    case "canvas":
      return <CanvasRenderer data={artifact.data as CanvasData} compact={compact} />;
    default:
      return (
        <div className="rounded-xl border border-warm-200/80 bg-warm-50/50 p-4">
          <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
            {artifact.content}
          </pre>
        </div>
      );
  }
}

// ─── EMAIL RENDERER ────────────────────────────────────────────────────────

function EmailRenderer({ data, compact }: { data: EmailData; compact: boolean }) {
  return (
    <div className="rounded-xl border border-warm-200/80 bg-white overflow-hidden">
      {/* Email chrome header */}
      <div className="bg-warm-50 border-b border-warm-200/60 px-4 py-3 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-warm-500 w-12 shrink-0">From</span>
          <span className="text-[13px] text-foreground">{data.from.name}</span>
          <span className="text-[11px] text-warm-400">&lt;{data.from.email}&gt;</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-warm-500 w-12 shrink-0">To</span>
          {data.to.map((r, i) => (
            <span key={i} className="text-[13px] text-foreground">
              {r.name} <span className="text-[11px] text-warm-400">&lt;{r.email}&gt;</span>
              {i < data.to.length - 1 && ", "}
            </span>
          ))}
        </div>
        {data.cc && data.cc.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-warm-500 w-12 shrink-0">CC</span>
            {data.cc.map((r, i) => (
              <span key={i} className="text-[13px] text-warm-600">
                {r.name}
                {i < (data.cc?.length ?? 0) - 1 && ", "}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 pt-1 border-t border-warm-200/40">
          <Mail className="h-3.5 w-3.5 text-warm-400" />
          <span className="text-[13px] font-medium text-foreground">{data.subject}</span>
        </div>
      </div>

      {/* Email body */}
      <div className={cn("px-5 py-4", compact && "max-h-64 overflow-y-auto")}>
        <div className="text-[13px] text-foreground leading-relaxed whitespace-pre-wrap">
          {data.body}
        </div>
      </div>

      {/* Attachments */}
      {data.attachments && data.attachments.length > 0 && (
        <div className="px-4 py-2.5 border-t border-warm-200/60 bg-warm-50/50 flex items-center gap-2">
          <Paperclip className="h-3 w-3 text-warm-400" />
          {data.attachments.map((a, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded-md bg-warm-100 text-warm-600 border border-warm-200/60"
            >
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SPREADSHEET RENDERER ──────────────────────────────────────────────────

function SpreadsheetRenderer({
  data,
  compact,
  editable = false,
}: {
  data: SpreadsheetData;
  compact: boolean;
  editable?: boolean;
}) {
  return (
    <div className="rounded-xl border border-warm-200/80 overflow-hidden">
      {/* Spreadsheet toolbar mock */}
      <div className="bg-warm-100/60 border-b border-warm-200/60 px-3 py-1.5 flex items-center gap-2">
        <div className="flex gap-1">
          {["B", "I", "U"].map((btn) => (
            <span
              key={btn}
              className="w-6 h-6 flex items-center justify-center text-[11px] font-bold text-warm-500 rounded hover:bg-warm-200/60"
            >
              {btn}
            </span>
          ))}
        </div>
        <div className="h-4 w-px bg-warm-200" />
        <span className="text-[10px] text-warm-400">fx</span>
        <div className="flex-1 h-5 rounded bg-white border border-warm-200/60 px-2 flex items-center">
          <span className="text-[10px] text-warm-400">Select a cell...</span>
        </div>
      </div>

      {/* Table */}
      <div className={cn("overflow-x-auto", compact && "max-h-72 overflow-y-auto")}>
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr>
              {/* Row number column */}
              <th className="w-8 bg-warm-100/60 border-b border-r border-warm-200/60 text-center text-warm-400 font-normal py-1.5" />
              {data.headers.map((h, i) => (
                <th
                  key={i}
                  className={cn(
                    "bg-warm-100/60 border-b border-r border-warm-200/60 px-3 py-1.5 text-left font-semibold text-warm-700",
                    data.highlightColumn === i && "bg-warm-200/40",
                    data.aiColumns?.includes(i) && "bg-purple-100/45"
                  )}
                >
                  <span className="flex items-center gap-1">
                    {data.aiColumns?.includes(i) && <Sparkles className="h-3 w-3 text-purple-500" />}
                    {h}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={ri} className="hover:bg-warm-50/50">
                <td className="bg-warm-100/40 border-b border-r border-warm-200/60 text-center text-[10px] text-warm-400 py-1.5">
                  {ri + 1}
                </td>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "border-b border-r border-warm-200/60 px-3 py-2 text-foreground",
                      data.highlightColumn === ci && "bg-warm-50/60 font-semibold",
                      data.aiColumns?.includes(ci) && "bg-purple-100/20 italic text-[11px]",
                      typeof cell === "number" && "text-right font-mono",
                      editable && "cursor-text hover:bg-warm-50"
                    )}
                    contentEditable={editable && !data.aiColumns?.includes(ci)}
                    suppressContentEditableWarning
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {data.footerRow && (
            <tfoot>
              <tr className="bg-warm-100/40 font-semibold">
                <td className="bg-warm-100/60 border-b border-r border-warm-200/60" />
                {data.footerRow.map((cell, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "border-b border-r border-warm-200/60 px-3 py-2 text-foreground",
                      data.highlightColumn === ci && "bg-warm-200/40 text-warm-900"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

// ─── SLIDES RENDERER ───────────────────────────────────────────────────────

function SlidesRenderer({ data }: { data: SlideData; compact: boolean }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = data.slides[currentSlide];

  return (
    <div className="rounded-xl border border-warm-200/80 overflow-hidden">
      {/* Slide area */}
      <div className="bg-gradient-to-br from-warm-800 to-warm-900 px-8 py-8 min-h-[240px] flex flex-col justify-center relative">
        <h3 className="text-xl font-bold text-warm-50 mb-4">{slide.title}</h3>
        <ul className="space-y-2.5">
          {slide.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-warm-200 text-[13px] leading-relaxed">
              <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-warm-400" />
              {b}
            </li>
          ))}
        </ul>
        {/* Slide number */}
        <div className="absolute bottom-3 right-4 text-[10px] text-warm-500">
          {currentSlide + 1} / {data.slides.length}
        </div>
      </div>

      {/* Speaker notes */}
      {slide.note && (
        <div className="px-4 py-2.5 bg-warm-50 border-t border-warm-200/60 flex items-start gap-2">
          <StickyNote className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
          <span className="text-[11px] text-warm-600 italic leading-relaxed">{slide.note}</span>
        </div>
      )}

      {/* Navigation */}
      <div className="px-3 py-2 bg-warm-100/40 border-t border-warm-200/60 flex items-center justify-between">
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="p-1.5 rounded-lg hover:bg-warm-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-warm-600" />
        </button>
        {/* Slide dots */}
        <div className="flex gap-1.5">
          {data.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-200",
                i === currentSlide ? "w-4 bg-warm-800" : "w-1.5 bg-warm-300 hover:bg-warm-400"
              )}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentSlide(Math.min(data.slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === data.slides.length - 1}
          className="p-1.5 rounded-lg hover:bg-warm-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-warm-600" />
        </button>
      </div>
    </div>
  );
}

// ─── CHECKLIST RENDERER ────────────────────────────────────────────────────

function ChecklistRenderer({
  data,
  compact,
}: {
  data: ChecklistData;
  compact: boolean;
}) {
  const [checks, setChecks] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    data.sections.forEach((s) =>
      s.items.forEach((item) => {
        initial[item.label] = item.checked;
      })
    );
    return initial;
  });

  const totalItems = data.sections.reduce((a, s) => a + s.items.length, 0);
  const checkedItems = Object.values(checks).filter(Boolean).length;
  const pct = Math.round((checkedItems / totalItems) * 100);

  return (
    <div className="rounded-xl border border-warm-200/80 overflow-hidden">
      {/* Progress bar */}
      <div className="bg-warm-50 px-4 py-3 border-b border-warm-200/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] font-semibold text-warm-700">
            {checkedItems} of {totalItems} complete
          </span>
          <span className="text-[11px] font-medium text-warm-500">{pct}%</span>
        </div>
        <div className="h-1.5 bg-warm-200/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: pct === 100 ? "#6a9e8f" : "#c4956a",
            }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className={cn("divide-y divide-warm-200/40", compact && "max-h-80 overflow-y-auto")}>
        {data.sections.map((section, si) => (
          <div key={si} className="px-4 py-3">
            <h4 className="text-[11px] font-semibold text-warm-500 uppercase tracking-wider mb-2">
              {section.title}
            </h4>
            <div className="space-y-1">
              {section.items.map((item, ii) => {
                const isChecked = checks[item.label];
                return (
                  <div
                    key={ii}
                    className="flex items-start gap-2.5 group"
                  >
                    <button
                      onClick={() =>
                        setChecks((prev) => ({
                          ...prev,
                          [item.label]: !prev[item.label],
                        }))
                      }
                      className="mt-0.5 shrink-0"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-warm-300 group-hover:text-warm-400 transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          "text-[13px] leading-snug",
                          isChecked
                            ? "text-warm-400 line-through"
                            : "text-foreground"
                        )}
                      >
                        {item.label}
                      </span>
                      {item.detail && (
                        <p className="text-[11px] text-warm-400 leading-relaxed mt-0.5">
                          {item.detail}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMPARISON RENDERER ───────────────────────────────────────────────────

function ComparisonRenderer({
  data,
  compact,
}: {
  data: ComparisonData;
  compact: boolean;
}) {
  return (
    <div className="rounded-xl border border-warm-200/80 overflow-hidden">
      <div className={cn("overflow-x-auto", compact && "max-h-80 overflow-y-auto")}>
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr>
              {data.columns.map((col, i) => (
                <th
                  key={i}
                  className={cn(
                    "border-b border-warm-200/60 px-4 py-2.5 text-left font-semibold",
                    i === 0
                      ? "bg-warm-100/40 text-warm-600 w-[28%]"
                      : "bg-warm-50 text-warm-800",
                    data.aiColumns?.includes(i) && "bg-purple-100/45"
                  )}
                >
                  <span className="flex items-center gap-1">
                    {data.aiColumns?.includes(i) && <Sparkles className="h-3 w-3 text-purple-500" />}
                    {col}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr
                key={ri}
                className={cn(
                  "hover:bg-warm-50/50",
                  row.highlight && "bg-amber-50/30"
                )}
              >
                <td className="border-b border-r border-warm-200/60 px-4 py-2.5 font-medium text-warm-700 bg-warm-50/30">
                  {row.label}
                  {row.highlight && (
                    <span className="ml-1.5 inline-block w-1 h-1 rounded-full bg-amber-500" />
                  )}
                </td>
                {row.values.map((val, vi) => (
                  <td
                    key={vi}
                    className={cn(
                      "border-b border-warm-200/60 px-4 py-2.5 text-foreground",
                      vi < row.values.length - 1 && "border-r",
                      data.aiColumns?.includes(vi + 1) && "bg-purple-100/20 text-purple-700 italic text-[11px]"
                    )}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.verdict && (
        <div className="px-4 py-3 bg-warm-50 border-t border-warm-200/60 flex items-start gap-2">
          <Trophy className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
          <span className="text-[12px] text-warm-700 leading-relaxed font-medium">
            {data.verdict}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── TIMELINE RENDERER ─────────────────────────────────────────────────────

function TimelineRenderer({
  data,
  compact,
}: {
  data: TimelineData;
  compact: boolean;
}) {
  return (
    <div className={cn("rounded-xl border border-warm-200/80 overflow-hidden", compact && "max-h-96 overflow-y-auto")}>
      <div className="px-4 py-3">
        <div className="relative">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-warm-200" />
          <div className="space-y-0.5">
            {data.events.map((event, i) => (
              <div key={i} className="relative flex gap-4 py-2.5">
                <div className="shrink-0 z-10 mt-0.5">
                  {event.status === "done" ? (
                    <div className="w-[30px] flex justify-center">
                      <Check className="h-4 w-4 text-green-600 bg-white rounded-full" />
                    </div>
                  ) : event.status === "current" ? (
                    <div className="w-[30px] flex justify-center">
                      <div className="h-4 w-4 rounded-full bg-amber-500 ring-4 ring-amber-100 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-[30px] flex justify-center">
                      <Clock className="h-4 w-4 text-warm-300 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <div className={cn(
                  "flex-1 min-w-0 rounded-lg px-3 py-2 -mt-0.5",
                  event.status === "current" && "bg-amber-50/60 border border-amber-200/40",
                  event.status === "done" && "opacity-80",
                )}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider",
                      event.status === "current" ? "text-amber-600" :
                      event.status === "done" ? "text-green-600" : "text-warm-400"
                    )}>{event.date}</span>
                    {event.status === "current" && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-white font-semibold">NOW</span>
                    )}
                  </div>
                  <h4 className={cn("text-[13px] font-semibold leading-snug", event.status === "upcoming" ? "text-warm-500" : "text-foreground")}>{event.title}</h4>
                  <p className={cn("text-[11px] leading-relaxed mt-0.5", event.status === "upcoming" ? "text-warm-400" : "text-warm-500")}>{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CANVAS / CAD RENDERER ─────────────────────────────────────────────────

function CanvasRenderer({ data, compact }: { data: CanvasData; compact: boolean }) {
  return (
    <div className="rounded-xl border border-warm-200/80 overflow-hidden">
      {/* CAD viewer header */}
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          </div>
          <span className="text-[11px] text-slate-400 font-mono ml-2">{data.partNumber}.SLDPRT</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span>Zoom: 100%</span>
          <span>|</span>
          <span>Isometric View</span>
        </div>
      </div>

      {/* CAD canvas mock */}
      <div className="bg-slate-800 relative" style={{ minHeight: compact ? "200px" : "280px" }}>
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        {/* Mock engineering drawing */}
        <svg viewBox="0 0 600 280" className="w-full h-full relative z-10" style={{ minHeight: compact ? "200px" : "280px" }}>
          {/* Part outline */}
          <rect x="120" y="50" width="360" height="180" rx="12" fill="none" stroke="#64748b" strokeWidth="2" />
          <rect x="150" y="70" width="120" height="80" rx="4" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />
          <rect x="330" y="70" width="120" height="80" rx="4" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />
          {/* Center cavity */}
          <ellipse cx="300" cy="140" rx="50" ry="30" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
          <line x1="300" y1="108" x2="300" y2="172" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="248" y1="140" x2="352" y2="140" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="3 3" />
          {/* Mounting holes */}
          <circle cx="160" cy="190" r="8" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="440" cy="190" r="8" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="160" cy="90" r="8" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="440" cy="90" r="8" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Dimension lines */}
          <line x1="120" y1="250" x2="480" y2="250" stroke="#fbbf24" strokeWidth="1" />
          <line x1="120" y1="245" x2="120" y2="255" stroke="#fbbf24" strokeWidth="1" />
          <line x1="480" y1="245" x2="480" y2="255" stroke="#fbbf24" strokeWidth="1" />
          <text x="300" y="265" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="monospace">{data.dimensions[0]?.value}</text>
          {/* Warning annotations */}
          <rect x="140" y="100" width="40" height="20" rx="3" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1" />
          <text x="160" y="114" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="monospace">⚠ A-A</text>
          <rect x="320" y="100" width="40" height="20" rx="3" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1" />
          <text x="340" y="114" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="monospace">⚠ B-B</text>
          {/* Title block */}
          <rect x="400" y="240" width="180" height="35" fill="rgba(15,23,42,0.8)" stroke="#475569" strokeWidth="1" />
          <text x="410" y="255" fill="#94a3b8" fontSize="8" fontFamily="monospace">{data.drawingTitle}</text>
          <text x="410" y="268" fill="#64748b" fontSize="7" fontFamily="monospace">{data.material}</text>
        </svg>
      </div>

      {/* Engineering spec panel */}
      <div className={cn("bg-card divide-y divide-warm-200/40", compact && "max-h-80 overflow-y-auto")}>
        {/* Dimensions */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Ruler className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-[11px] font-semibold text-warm-700 uppercase tracking-wider">Key Dimensions</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {data.dimensions.map((d, i) => (
              <div key={i} className="flex justify-between text-[12px]">
                <span className="text-warm-500">{d.label}</span>
                <span className="font-mono text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tolerances */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[11px] font-semibold text-warm-700 uppercase tracking-wider">Tolerance Analysis</span>
          </div>
          <div className="space-y-1.5">
            {data.tolerances.map((t, i) => (
              <div key={i} className={cn("flex items-center gap-3 text-[12px] px-2 py-1 rounded", t.actual?.startsWith("⚠") && "bg-red-50/60")}>
                <span className="text-warm-600 flex-1 min-w-0">{t.feature}</span>
                <span className="font-mono text-warm-500 shrink-0">{t.spec}</span>
                {t.actual && (
                  <span className={cn("font-mono shrink-0 text-[11px]", t.actual.startsWith("⚠") ? "text-red-600 font-semibold" : "text-green-600")}>{t.actual}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* DFM Notes */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <FileText className="h-3.5 w-3.5 text-warm-500" />
            <span className="text-[11px] font-semibold text-warm-700 uppercase tracking-wider">DFM Notes</span>
          </div>
          <ul className="space-y-1">
            {data.notes.map((n, i) => (
              <li key={i} className={cn("text-[11px] leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:h-1 before:w-1 before:rounded-full", n.startsWith("CRITICAL") ? "text-red-600 font-medium before:bg-red-500" : "text-warm-500 before:bg-warm-300")}>{n}</li>
            ))}
          </ul>
        </div>

        {/* Revision History */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <History className="h-3.5 w-3.5 text-warm-400" />
            <span className="text-[11px] font-semibold text-warm-700 uppercase tracking-wider">Revision History</span>
          </div>
          <div className="space-y-1">
            {data.revisionHistory.map((r, i) => (
              <div key={i} className="flex items-center gap-3 text-[11px]">
                <span className="font-mono font-semibold text-warm-600 w-8">Rev {r.rev}</span>
                <span className="text-warm-400 w-20">{r.date}</span>
                <span className="text-warm-500">{r.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { DealCard, stageColors, stageConfig } from "@/lib/mock-data";
import { ArtifactRenderer } from "@/components/artifact-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  X,
  CheckCircle,
  GitMerge,
  Building2,
  User,
  Clock,
  FileText,
  Mail,
  Table2,
  FileSpreadsheet,
  Lightbulb,
  DollarSign,
  Presentation,
  CheckSquare,
  GitCompare,
  CalendarClock,
} from "lucide-react";

interface CardExpandedProps {
  deal: DealCard;
  onClose: () => void;
  onApprove: (dealId: string) => void;
  onCowork: (dealId: string) => void;
}

const artifactIcons: Record<string, typeof FileText> = {
  email: Mail,
  document: FileText,
  spreadsheet: Table2,
  slides: Presentation,
  checklist: CheckSquare,
  comparison: GitCompare,
  timeline: CalendarClock,
};

export function CardExpanded({
  deal,
  onClose,
  onApprove,
  onCowork,
}: CardExpandedProps) {
  const stageColor = stageColors[deal.stage];
  const stageLabel = stageConfig[deal.stage].label;
  const ArtifactIcon = artifactIcons[deal.artifact.type] || FileText;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-warm-900/20 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-3xl max-h-[85vh] bg-card rounded-2xl border border-warm-200 shadow-2xl shadow-warm-900/10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-warm-200/80 flex items-start justify-between shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className="text-[11px] px-2 py-0.5 font-medium"
                style={{
                  backgroundColor: `${stageColor}18`,
                  color: stageColor,
                  borderColor: `${stageColor}30`,
                }}
              >
                {stageLabel}
              </Badge>
              <Badge
                variant="secondary"
                className="text-[11px] px-2 py-0.5 font-medium"
              >
                <DollarSign className="h-3 w-3 mr-1" />
                {deal.value}
              </Badge>
              {deal.artifact.status === "needs-review" && (
                <Badge
                  variant="secondary"
                  className="text-[11px] px-2 py-0.5 font-medium bg-amber-50 text-amber-700 border-amber-200"
                >
                  Needs Review
                </Badge>
              )}
            </div>
            <h2 className="text-lg font-semibold text-foreground leading-tight">
              {deal.title}
            </h2>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                {deal.company}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                {deal.contactName}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {deal.lastActivity}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-warm-100 transition-colors shrink-0 ml-4"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
          {/* TLDR Section */}
          <div className="mb-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {deal.tldr}
            </p>
          </div>

          {/* AI Notes */}
          <div className="mb-5 p-3 rounded-xl bg-warm-50 border border-warm-200/60">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-warm-700">
                AI Intelligence Notes
              </span>
            </div>
            <ul className="space-y-1.5">
              {deal.aiNotes.map((note, i) => (
                <li
                  key={i}
                  className="text-xs text-muted-foreground leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:h-1 before:w-1 before:rounded-full before:bg-warm-300"
                >
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <Separator className="my-4 bg-warm-200/60" />

          {/* Artifact */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArtifactIcon className="h-4 w-4 text-warm-500" />
              <span className="text-sm font-semibold text-foreground">
                {deal.artifact.title}
              </span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium capitalize">
                {deal.artifact.type}
              </Badge>
            </div>
            <ArtifactRenderer artifact={deal.artifact} />
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3 border-t border-warm-200/80 flex items-center justify-end gap-3 bg-warm-50/30 shrink-0">
          <Button
            variant="outline"
            className="h-9 text-sm px-4 rounded-xl border-warm-200 hover:bg-warm-100 hover:border-warm-300"
            onClick={() => onCowork(deal.id)}
          >
            <GitMerge className="h-3.5 w-3.5 mr-2" />
            Open in Cowork
          </Button>
          <Button
            className="h-9 text-sm px-4 rounded-xl bg-warm-800 hover:bg-warm-700 text-warm-50"
            onClick={() => onApprove(deal.id)}
          >
            <CheckCircle className="h-3.5 w-3.5 mr-2" />
            Approve & Move Forward
          </Button>
        </div>
      </div>
    </div>
  );
}

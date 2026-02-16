"use client";

import { DealCard, stageColors, stageConfig } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, GitMerge, Building2, Clock } from "lucide-react";

interface DealCardProps {
  deal: DealCard;
  onApprove: (dealId: string) => void;
  onCowork: (dealId: string) => void;
  onClick: (dealId: string) => void;
  compact?: boolean;
}

export function DealCardComponent({
  deal,
  onApprove,
  onCowork,
  onClick,
  compact = false,
}: DealCardProps) {
  const stageColor = stageColors[deal.stage];
  const stageLabel = stageConfig[deal.stage].label;

  return (
    <div
      onClick={() => onClick(deal.id)}
      className="group relative cursor-pointer rounded-xl border border-warm-200/80 bg-card p-4 transition-all duration-200 hover:border-warm-300 hover:shadow-md hover:shadow-warm-200/50 hover:-translate-y-0.5 active:translate-y-0"
    >
      {/* Stage indicator bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
        style={{ backgroundColor: stageColor }}
      />

      <div className="pl-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 font-medium shrink-0"
              style={{
                backgroundColor: `${stageColor}18`,
                color: stageColor,
                borderColor: `${stageColor}30`,
              }}
            >
              {stageLabel}
            </Badge>
            {deal.priority && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            )}
          </div>
          <span className="text-[11px] text-muted-foreground font-medium shrink-0">
            {deal.value}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground leading-snug mb-1 line-clamp-2 group-hover:text-warm-800">
          {deal.title}
        </h3>

        {/* Company */}
        <div className="flex items-center gap-1.5 mb-2">
          <Building2 className="h-3 w-3 text-muted-foreground/60" />
          <span className="text-xs text-muted-foreground">
            {deal.company}
          </span>
          {!compact && (
            <>
              <span className="text-muted-foreground/30 mx-0.5">·</span>
              <Clock className="h-3 w-3 text-muted-foreground/60" />
              <span className="text-xs text-muted-foreground">
                {deal.lastActivity}
              </span>
            </>
          )}
        </div>

        {/* TLDR */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {deal.tldr}
        </p>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs px-3 rounded-lg border-warm-200 hover:bg-warm-100 hover:border-warm-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onCowork(deal.id);
            }}
          >
            <GitMerge className="h-3 w-3 mr-1.5" />
            Cowork
          </Button>
          <Button
            size="sm"
            className="h-7 text-xs px-3 rounded-lg bg-warm-800 hover:bg-warm-700 text-warm-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onApprove(deal.id);
            }}
          >
            <CheckCircle className="h-3 w-3 mr-1.5" />
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}

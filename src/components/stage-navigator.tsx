"use client";

import { Stage, stageConfig, stageColors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface StageNavigatorProps {
  activeStage: Stage | null;
  onStageSelect: (stage: Stage | null) => void;
  dealCounts: Record<Stage, number>;
}

const stages: Stage[] = ["prospecting", "technical", "quoting", "negotiation"];

export function StageNavigator({
  activeStage,
  onStageSelect,
  dealCounts,
}: StageNavigatorProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-warm-100/60 border border-warm-200/60">
      {stages.map((stage, index) => {
        const config = stageConfig[stage];
        const color = stageColors[stage];
        const isActive = activeStage === stage;
        const count = dealCounts[stage];

        return (
          <button
            key={stage}
            onClick={() => onStageSelect(isActive ? null : stage)}
            className={cn(
              "relative flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
              isActive
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-warm-100"
            )}
          >
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="hidden sm:inline truncate">{config.label}</span>
            <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full", isActive ? "bg-warm-800 text-warm-50" : "bg-warm-200/80 text-warm-600")}>
              {count}
            </span>
            {index < stages.length - 1 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-warm-200/60" />
            )}
          </button>
        );
      })}
    </div>
  );
}

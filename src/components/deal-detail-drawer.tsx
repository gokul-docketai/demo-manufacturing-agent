"use client";

import {
  Deal,
  DealDetailProfile,
  IntentSignal,
  IntentSignalType,
  IntentStrength,
  TechnicalRequirement,
  DealStakeholder,
  CompetitorIntel,
  WinLossFactor,
  DealQuote,
  ActivityEvent,
  mockDealDetails,
} from "@/lib/mock-data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Building2,
  Globe,
  Phone,
  Mail,
  User,
  DollarSign,
  Users,
  Clock,
  ArrowUpRight,
  Handshake,
  Sparkles,
  FileText,
  Shield,
  AlertTriangle,
  TrendingUp,
  Eye,
  Download,
  MailOpen,
  Search,
  Swords,
  Wallet,
  Cpu,
  Target,
  Wrench,
  FileWarning,
  Flame,
  Thermometer,
  Snowflake,
  CalendarDays,
  Package,
  Percent,
  Layers,
  CircleDollarSign,
  ScrollText,
  CheckCircle,
  XCircle,
  Minus,
  BookOpen,
  Tag,
} from "lucide-react";

// ─── Shared Maps ──────────────────────────────────────────────────────────

const stageColorMap: Record<string, { bg: string; text: string; dot: string }> = {
  Prospecting: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Qualification: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  Proposal: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Negotiation: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  "Closed Won": { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  "Closed Lost": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const intentSignalIconMap: Record<IntentSignalType, typeof Eye> = {
  website_visit: Eye,
  content_download: Download,
  email_engagement: MailOpen,
  search_activity: Search,
  competitor_activity: Swords,
  budget_signal: Wallet,
  technology_evaluation: Cpu,
};

const intentSignalLabel: Record<IntentSignalType, string> = {
  website_visit: "Website Visit",
  content_download: "Content Download",
  email_engagement: "Email Engagement",
  search_activity: "Search Activity",
  competitor_activity: "Competitor Activity",
  budget_signal: "Budget Signal",
  technology_evaluation: "Technology Evaluation",
};

const strengthColors: Record<IntentStrength, { bg: string; text: string; dot: string }> = {
  high: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  low: { bg: "bg-warm-100", text: "text-warm-600", dot: "bg-warm-400" },
};

const engagementColors: Record<DealStakeholder["engagement"], { bg: string; text: string; dot: string }> = {
  hot: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  warm: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  cold: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
};

const engagementIcons: Record<DealStakeholder["engagement"], typeof Flame> = {
  hot: Flame,
  warm: Thermometer,
  cold: Snowflake,
};

const influenceColors: Record<DealStakeholder["influence"], string> = {
  "Decision Maker": "bg-red-50 text-red-700 border-red-200",
  Champion: "bg-green-50 text-green-700 border-green-200",
  "Technical Evaluator": "bg-indigo-50 text-indigo-700 border-indigo-200",
  Procurement: "bg-amber-50 text-amber-700 border-amber-200",
  "End User": "bg-warm-100 text-warm-600 border-warm-200",
};

const threatColors: Record<CompetitorIntel["threatLevel"], { bg: string; text: string; dot: string }> = {
  high: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  low: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
};

const positionColors: Record<WinLossFactor["ourPosition"], { icon: typeof CheckCircle; color: string }> = {
  strong: { icon: CheckCircle, color: "text-green-600" },
  neutral: { icon: Minus, color: "text-amber-500" },
  weak: { icon: XCircle, color: "text-red-500" },
};

const activityIconMap: Record<ActivityEvent["type"], typeof Mail> = {
  email: Mail,
  call: Phone,
  meeting: Users,
  quote_sent: FileText,
  po_received: Package,
  site_visit: Building2,
  nda_signed: ScrollText,
};

// ─── Props ────────────────────────────────────────────────────────────────

interface DealDetailDrawerProps {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Shared Sub-components ────────────────────────────────────────────────

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="h-3.5 w-3.5 text-warm-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-warm-400 uppercase tracking-wider">{label}</p>
        <p className="text-[13px] text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function StageBadge({ stage }: { stage: Deal["stage"] }) {
  const colors = stageColorMap[stage] || { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border",
        colors.bg,
        colors.text,
        colors.bg.replace("bg-", "border-").replace("-50", "-200")
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", colors.dot)} />
      {stage}
    </span>
  );
}

function TabBadge({ count }: { count: number }) {
  return (
    <Badge
      variant="secondary"
      className="ml-1 text-[9px] px-1.5 py-0 font-semibold bg-warm-100 text-warm-600 border-warm-200"
    >
      {count}
    </Badge>
  );
}

function EmptyState({ icon: Icon, message }: { icon: typeof Handshake; message: string }) {
  return (
    <div className="py-10 text-center">
      <Icon className="h-8 w-8 text-warm-300 mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-warm-200/60 bg-card px-2.5 py-2 text-center">
      <p className="text-[10px] font-medium text-warm-400 uppercase tracking-wider">{label}</p>
      <p className="text-[14px] font-bold text-foreground mt-0.5">{value}</p>
    </div>
  );
}

// ─── Deal Health Section ─────────────────────────────────────────────────

function IntentScoreBadge({ score }: { score: number }) {
  const color =
    score >= 75
      ? "bg-green-50 text-green-700 border-green-200"
      : score >= 50
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-red-50 text-red-700 border-red-200";
  return (
    <div className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border", color)}>
      <Target className="h-3 w-3" />
      <span>Intent Score: {score}/100</span>
    </div>
  );
}

function DealHealthSection({ profile }: { profile: DealDetailProfile }) {
  return (
    <div className="mx-4 mb-3 space-y-2">
      <div className="grid grid-cols-4 gap-2">
        <StatCard label="Deal Value" value={profile.quote?.totalValue || "TBD"} />
        <StatCard label="Intent Score" value={`${profile.intentScore}/100`} />
        <StatCard label="Days in Stage" value={String(profile.daysInStage)} />
        <StatCard label="Stakeholders" value={String(profile.stakeholders.length)} />
      </div>
      <div className="rounded-md border border-warm-200/60 border-l-[3px] border-l-purple-500 bg-card px-3 py-2">
        <div className="flex items-start gap-2">
          <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0 text-purple-600" />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-foreground">AI Deal Summary</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              {profile.aiSummary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Intent Signals Tab ──────────────────────────────────────────────────

function IntentSignalCard({ signal }: { signal: IntentSignal }) {
  const Icon = intentSignalIconMap[signal.type];
  const strength = strengthColors[signal.strength];
  return (
    <div className="px-3 py-3 hover:bg-warm-50/50 transition-colors border-b border-warm-200/40 last:border-b-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-full bg-warm-100 flex items-center justify-center shrink-0">
            <Icon className="h-3 w-3 text-warm-600" />
          </div>
          <span className="text-[12px] font-medium text-foreground truncate">{signal.title}</span>
        </div>
        <Badge
          variant="secondary"
          className={cn("text-[9px] px-1.5 py-0 font-semibold border shrink-0 capitalize", strength.bg, strength.text, strength.bg.replace("bg-", "border-").replace("-50", "-200").replace("-100", "-200"))}
        >
          <span className={cn("h-1 w-1 rounded-full mr-1 inline-block", strength.dot)} />
          {signal.strength}
        </Badge>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed ml-8">{signal.description}</p>
      <div className="flex items-center gap-3 mt-1.5 ml-8 text-[10px] text-warm-500">
        <span>{signal.timestamp}</span>
        <span className="text-warm-300">·</span>
        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium bg-warm-50 text-warm-600 border-warm-200">
          {intentSignalLabel[signal.type]}
        </Badge>
        <span className="text-warm-300">·</span>
        <span className="text-warm-400">{signal.source}</span>
      </div>
    </div>
  );
}

// ─── Technical Requirements Tab ──────────────────────────────────────────

function TechRequirementCard({ req }: { req: TechnicalRequirement }) {
  return (
    <div className="rounded-lg border border-warm-200/60 bg-card overflow-hidden">
      <div className="px-3 py-2.5 flex items-center justify-between border-b border-warm-200/40 bg-warm-50/40">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-mono font-semibold text-foreground">{req.partNumber}</span>
          <span className="text-[11px] text-muted-foreground truncate">{req.partName}</span>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            "text-[9px] px-1.5 py-0 font-medium border shrink-0",
            req.materialAvailable
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          )}
        >
          {req.materialAvailable ? "Material In Stock" : "Material Needed"}
        </Badge>
      </div>
      <div className="px-3 py-2.5 space-y-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          <TechField label="Material" value={req.material} />
          <TechField label="Process" value={req.process} />
          <TechField label="Dimensions" value={req.dimensions} />
          <TechField label="Tolerances" value={req.tolerances} />
          <TechField label="Surface Finish" value={req.surfaceFinish} />
          <TechField label="Heat Treatment" value={req.heatTreatment} />
          <TechField label="Coatings" value={req.coatings} />
          <TechField label="NDT Required" value={req.ndtRequired} />
        </div>
        {req.materialStock && (
          <div className="text-[10px] text-muted-foreground bg-warm-50/50 rounded px-2 py-1.5">
            <Package className="h-2.5 w-2.5 inline mr-1" />
            Stock: {req.materialStock}
          </div>
        )}
        {req.dfmNotes.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-1 mb-1">
              <FileWarning className="h-3 w-3 text-amber-500" />
              <p className="text-[10px] font-medium text-amber-700 uppercase tracking-wider">DFM Notes</p>
            </div>
            <div className="space-y-1">
              {req.dfmNotes.map((note, i) => (
                <p key={i} className="text-[11px] text-muted-foreground leading-relaxed pl-4 border-l-2 border-amber-200">
                  {note}
                </p>
              ))}
            </div>
          </div>
        )}
        {req.drawings.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {req.drawings.map((d, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-[9px] px-2 py-0.5 font-medium bg-indigo-50 text-indigo-700 border-indigo-200"
              >
                <FileText className="h-2.5 w-2.5 mr-1" />
                {d.name} ({d.revision})
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TechField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-medium text-warm-400 uppercase tracking-wider">{label}</p>
      <p className="text-[11px] text-foreground mt-0.5 leading-snug">{value}</p>
    </div>
  );
}

// ─── Stakeholders Tab ────────────────────────────────────────────────────

function StakeholderCard({ stakeholder }: { stakeholder: DealStakeholder }) {
  const engColors = engagementColors[stakeholder.engagement];
  const EngIcon = engagementIcons[stakeholder.engagement];
  return (
    <div className="px-3 py-3 hover:bg-warm-50/50 transition-colors border-b border-warm-200/40 last:border-b-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] font-medium text-foreground">{stakeholder.name}</span>
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className={cn("text-[9px] px-1.5 py-0 font-medium border", influenceColors[stakeholder.influence])}>
            {stakeholder.influence}
          </Badge>
          <Badge variant="secondary" className={cn("text-[9px] px-1.5 py-0 font-semibold border capitalize", engColors.bg, engColors.text, engColors.bg.replace("bg-", "border-").replace("-50", "-200"))}>
            <EngIcon className="h-2.5 w-2.5 mr-0.5" />
            {stakeholder.engagement}
          </Badge>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground mb-1.5">{stakeholder.title}</p>
      <div className="flex items-center gap-4 text-[10px] text-warm-500">
        <div className="flex items-center gap-1">
          <Mail className="h-2.5 w-2.5" />
          <span>{stakeholder.email}</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="h-2.5 w-2.5" />
          <span>{stakeholder.phone}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5" />
          <span>Last: {stakeholder.lastInteraction}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-1 w-16 bg-warm-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                stakeholder.engagementScore >= 70
                  ? "bg-green-500"
                  : stakeholder.engagementScore >= 40
                    ? "bg-amber-500"
                    : "bg-red-400"
              )}
              style={{ width: `${stakeholder.engagementScore}%` }}
            />
          </div>
          <span className="text-[9px] text-warm-500 font-medium">{stakeholder.engagementScore}%</span>
        </div>
      </div>
      {stakeholder.notes && (
        <p className="text-[10px] text-warm-500 mt-1 italic">{stakeholder.notes}</p>
      )}
    </div>
  );
}

function MissingStakeholderBanner({ missing }: { missing: string[] }) {
  if (missing.length === 0) return null;
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50/60 px-3 py-2 mb-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-600" />
        <div>
          <p className="text-[11px] font-semibold text-amber-700">Missing Stakeholders</p>
          {missing.map((m, i) => (
            <p key={i} className="text-[10px] text-amber-600 mt-0.5">{m}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Activity Tab ────────────────────────────────────────────────────────

function ActivityRow({ event }: { event: ActivityEvent }) {
  const Icon = activityIconMap[event.type] || FileText;
  return (
    <div className="flex gap-3 py-2.5">
      <div className="flex flex-col items-center pt-0.5">
        <div className="h-6 w-6 rounded-full bg-warm-100 flex items-center justify-center shrink-0">
          <Icon className="h-3 w-3 text-warm-500" />
        </div>
        <div className="w-px flex-1 bg-warm-200/60 mt-1" />
      </div>
      <div className="min-w-0 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-foreground">{event.title}</span>
          <span className="text-[10px] text-muted-foreground shrink-0">{event.date}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{event.description}</p>
        {event.contact && (
          <div className="flex items-center gap-1 mt-1 text-[10px] text-warm-500">
            <User className="h-2.5 w-2.5" />
            <span>{event.contact}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Competitive Tab ─────────────────────────────────────────────────────

function CompetitorCard({ competitor }: { competitor: CompetitorIntel }) {
  const threat = threatColors[competitor.threatLevel];
  return (
    <div className="rounded-lg border border-warm-200/60 bg-card overflow-hidden">
      <div className="px-3 py-2.5 flex items-center justify-between border-b border-warm-200/40 bg-warm-50/40">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-foreground">{competitor.name}</span>
          {competitor.incumbent && (
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium bg-purple-50 text-purple-700 border-purple-200">
              Incumbent
            </Badge>
          )}
        </div>
        <Badge variant="secondary" className={cn("text-[9px] px-1.5 py-0 font-semibold border capitalize", threat.bg, threat.text, threat.bg.replace("bg-", "border-").replace("-50", "-200"))}>
          <span className={cn("h-1 w-1 rounded-full mr-1 inline-block", threat.dot)} />
          {competitor.threatLevel} threat
        </Badge>
      </div>
      <div className="px-3 py-2.5 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-medium text-green-600 uppercase tracking-wider mb-1">Strengths</p>
          {competitor.strengths.map((s, i) => (
            <p key={i} className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1.5">
              <CheckCircle className="h-2.5 w-2.5 text-green-500 mt-0.5 shrink-0" />
              {s}
            </p>
          ))}
        </div>
        <div>
          <p className="text-[10px] font-medium text-red-600 uppercase tracking-wider mb-1">Weaknesses</p>
          {competitor.weaknesses.map((w, i) => (
            <p key={i} className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1.5">
              <XCircle className="h-2.5 w-2.5 text-red-400 mt-0.5 shrink-0" />
              {w}
            </p>
          ))}
        </div>
      </div>
      {competitor.estimatedPrice && competitor.estimatedPrice !== "N/A" && (
        <div className="px-3 py-1.5 text-[10px] text-muted-foreground bg-warm-50/30 border-t border-warm-200/40">
          <DollarSign className="h-2.5 w-2.5 inline mr-1" />
          Estimated price: {competitor.estimatedPrice}
        </div>
      )}
    </div>
  );
}

function WinLossFactorRow({ factor }: { factor: WinLossFactor }) {
  const pos = positionColors[factor.ourPosition];
  const PosIcon = pos.icon;
  return (
    <div className="px-3 py-2.5 hover:bg-warm-50/50 transition-colors border-b border-warm-200/40 last:border-b-0">
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <PosIcon className={cn("h-3.5 w-3.5 shrink-0", pos.color)} />
          <span className="text-[12px] font-medium text-foreground">{factor.factor}</span>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            "text-[9px] px-1.5 py-0 font-medium border capitalize shrink-0",
            factor.importance === "critical"
              ? "bg-red-50 text-red-700 border-red-200"
              : factor.importance === "important"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-warm-100 text-warm-600 border-warm-200"
          )}
        >
          {factor.importance}
        </Badge>
      </div>
      <p className="text-[10px] text-muted-foreground ml-5.5 pl-[22px]">{factor.notes}</p>
    </div>
  );
}

// ─── Financials Tab ──────────────────────────────────────────────────────

function QuoteSection({ quote }: { quote: DealQuote }) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-warm-200/60 bg-card overflow-hidden">
        <div className="px-3 py-2.5 flex items-center justify-between border-b border-warm-200/40 bg-warm-50/40">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold text-foreground">{quote.quoteNumber}</span>
            <span className="text-[10px] text-muted-foreground">{quote.quoteDate}</span>
          </div>
          <span className="text-[12px] font-bold text-foreground">{quote.totalValue}</span>
        </div>
        <div className="divide-y divide-warm-200/30">
          {quote.lineItems.map((item, i) => (
            <div key={i} className="px-3 py-2 flex items-center gap-3 text-[11px]">
              <span className="font-mono text-warm-500 w-24 shrink-0">{item.partNumber}</span>
              <span className="text-foreground flex-1 truncate">{item.description}</span>
              <span className="text-warm-500 shrink-0">x{item.qty}</span>
              <span className="text-foreground font-medium shrink-0 w-20 text-right">{item.unitPrice}</span>
              <span className="text-foreground font-bold shrink-0 w-24 text-right">{item.extendedPrice}</span>
            </div>
          ))}
        </div>
        <div className="px-3 py-2 border-t border-warm-200/40 space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-warm-500">Tooling</span>
            <span className="text-foreground font-medium">{quote.toolingCost}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-warm-500">NRE</span>
            <span className="text-foreground font-medium">{quote.nreCost}</span>
          </div>
        </div>
        <div className="px-3 py-1.5 text-[10px] text-muted-foreground bg-warm-50/30 border-t border-warm-200/40">
          Valid until: {quote.validUntil}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border border-warm-200/60 bg-card px-3 py-2.5">
          <p className="text-[10px] font-medium text-warm-400 uppercase tracking-wider mb-1.5">Margin Analysis</p>
          <p className={cn(
            "text-[18px] font-bold",
            quote.estimatedMarginPct >= 30
              ? "text-green-700"
              : quote.estimatedMarginPct >= 20
                ? "text-amber-700"
                : "text-red-700"
          )}>
            {quote.estimatedMarginPct}%
          </p>
          <p className="text-[10px] text-muted-foreground">Estimated margin</p>
        </div>
        <div className="rounded-md border border-warm-200/60 bg-card px-3 py-2.5">
          <p className="text-[10px] font-medium text-warm-400 uppercase tracking-wider mb-1.5">Cost Breakdown</p>
          <div className="space-y-1">
            {quote.costBreakdown.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-warm-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-warm-400"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
                <span className="text-[9px] text-warm-500 w-20 shrink-0">{c.category} {c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-md border border-warm-200/60 bg-card px-3 py-2.5">
        <p className="text-[10px] font-medium text-warm-400 uppercase tracking-wider mb-1">Payment Terms</p>
        <p className="text-[11px] text-foreground">{quote.paymentTerms}</p>
      </div>

      <div className="rounded-md border border-warm-200/60 bg-card px-3 py-2.5">
        <p className="text-[10px] font-medium text-warm-400 uppercase tracking-wider mb-1">Pricing Benchmark</p>
        <p className="text-[11px] text-foreground">{quote.pricingBenchmark}</p>
      </div>
    </div>
  );
}

// ─── Main Drawer ──────────────────────────────────────────────────────────

export function DealDetailDrawer({ deal, open, onOpenChange }: DealDetailDrawerProps) {
  const profile = deal ? mockDealDetails[deal.id] : undefined;

  if (!deal) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[620px] overflow-y-auto overflow-x-hidden p-0">
        <SheetHeader className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <StageBadge stage={deal.stage} />
            {profile && <IntentScoreBadge score={profile.intentScore} />}
          </div>
          <SheetTitle className="text-lg">{deal.name}</SheetTitle>
          <SheetDescription className="text-[12px]">
            {deal.accountName} · {deal.contactName} · {deal.dealOwner}
          </SheetDescription>
        </SheetHeader>

        {/* Deal Health section */}
        {profile ? (
          <DealHealthSection profile={profile} />
        ) : (
          <div className="mx-4 mb-3 rounded-lg border border-warm-200/60 bg-warm-50/40 px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] text-warm-500">
              <Sparkles className="h-3 w-3" />
              <span className="font-medium">No enriched data available for this deal yet.</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="overview" className="px-4 pb-4 min-w-0">
          <TabsList variant="line" className="mb-3 overflow-x-auto no-scrollbar w-full">
            <TabsTrigger value="overview" className="text-[11px] px-2 shrink-0 flex-none">
              Overview
            </TabsTrigger>
            <TabsTrigger value="intent" className="text-[11px] px-2 shrink-0 flex-none">
              Intent Signals
              {profile && <TabBadge count={profile.intentSignals.length} />}
            </TabsTrigger>
            <TabsTrigger value="technical" className="text-[11px] px-2 shrink-0 flex-none">
              Technical
              {profile && <TabBadge count={profile.technicalRequirements.length} />}
            </TabsTrigger>
            <TabsTrigger value="stakeholders" className="text-[11px] px-2 shrink-0 flex-none">
              Stakeholders
              {profile && <TabBadge count={profile.stakeholders.length} />}
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-[11px] px-2 shrink-0 flex-none">
              Activity
              {profile && <TabBadge count={profile.activities.length} />}
            </TabsTrigger>
            <TabsTrigger value="competitive" className="text-[11px] px-2 shrink-0 flex-none">
              Competitive
            </TabsTrigger>
            <TabsTrigger value="financials" className="text-[11px] px-2 shrink-0 flex-none">
              Financials
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-0 divide-y divide-warm-200/40">
              <DetailRow icon={Building2} label="Account" value={deal.accountName} />
              <DetailRow icon={User} label="Contact" value={deal.contactName} />
              <DetailRow icon={Mail} label="Email" value={deal.email} />
              <DetailRow icon={User} label="Deal Owner" value={deal.dealOwner} />
              <DetailRow icon={Handshake} label="Stage" value={deal.stage} />
              <DetailRow icon={DollarSign} label="Value" value={deal.value} />
              <DetailRow icon={Percent} label="Probability" value={`${deal.probability}%`} />
              <DetailRow icon={CalendarDays} label="Close Date" value={deal.closeDate} />
              <DetailRow icon={Clock} label="Created" value={deal.createdDate} />
              <DetailRow icon={Globe} label="Source" value={deal.source} />
              <DetailRow icon={Wrench} label="Product" value={deal.product} />
              <DetailRow icon={Tag} label="Type" value={deal.type} />
              <DetailRow icon={Clock} label="Last Activity" value={deal.lastActivity} />
              <DetailRow icon={ArrowUpRight} label="Next Step" value={deal.nextStep} />
            </div>
          </TabsContent>

          {/* Intent Signals Tab */}
          <TabsContent value="intent">
            {!profile || profile.intentSignals.length === 0 ? (
              <EmptyState icon={Target} message="No intent signals detected yet." />
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3 px-1">
                  <IntentScoreBadge score={profile.intentScore} />
                  <span className="text-[11px] text-muted-foreground">
                    {profile.intentSignals.filter((s) => s.strength === "high").length} high-strength signals
                  </span>
                </div>
                <div className="rounded-lg border border-warm-200/60 overflow-hidden bg-card">
                  {profile.intentSignals.map((signal) => (
                    <IntentSignalCard key={signal.id} signal={signal} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Technical Requirements Tab */}
          <TabsContent value="technical">
            {!profile || profile.technicalRequirements.length === 0 ? (
              <EmptyState icon={Wrench} message="No technical requirements documented." />
            ) : (
              <div className="space-y-3">
                {profile.technicalRequirements.map((req, i) => (
                  <TechRequirementCard key={i} req={req} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Stakeholders Tab */}
          <TabsContent value="stakeholders">
            {!profile || profile.stakeholders.length === 0 ? (
              <EmptyState icon={Users} message="No stakeholders identified." />
            ) : (
              <>
                {profile.missingStakeholders.length > 0 && (
                  <MissingStakeholderBanner missing={profile.missingStakeholders} />
                )}
                <div className="rounded-lg border border-warm-200/60 overflow-hidden bg-card">
                  {profile.stakeholders.map((s) => (
                    <StakeholderCard key={s.id} stakeholder={s} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            {!profile || profile.activities.length === 0 ? (
              <EmptyState icon={Clock} message="No activity recorded for this deal." />
            ) : (
              <div className="pl-1">
                {profile.activities.map((event) => (
                  <ActivityRow key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Competitive Tab */}
          <TabsContent value="competitive">
            {!profile ? (
              <EmptyState icon={Swords} message="No competitive intelligence available." />
            ) : (
              <div className="space-y-4">
                {/* Competitors */}
                {profile.competitors.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-warm-400 uppercase tracking-wider mb-2">Competitors</p>
                    <div className="space-y-3">
                      {profile.competitors.map((c) => (
                        <CompetitorCard key={c.id} competitor={c} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Win/Loss Factors */}
                {profile.winLossFactors.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-warm-400 uppercase tracking-wider mb-2">Win / Loss Factors</p>
                    <div className="rounded-lg border border-warm-200/60 overflow-hidden bg-card">
                      {profile.winLossFactors.map((f, i) => (
                        <WinLossFactorRow key={i} factor={f} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Our Differentiators */}
                {profile.ourDifferentiators.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-warm-400 uppercase tracking-wider mb-2">Our Differentiators</p>
                    <div className="rounded-md border border-green-200 bg-green-50/40 px-3 py-2.5">
                      {profile.ourDifferentiators.map((d, i) => (
                        <div key={i} className="flex items-start gap-2 py-1">
                          <Shield className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                          <p className="text-[11px] text-foreground leading-relaxed">{d}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk Flags */}
                {profile.riskFlags.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-warm-400 uppercase tracking-wider mb-2">Risk Flags</p>
                    <div className="rounded-md border border-red-200 bg-red-50/40 px-3 py-2.5">
                      {profile.riskFlags.map((r, i) => (
                        <div key={i} className="flex items-start gap-2 py-1">
                          <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />
                          <p className="text-[11px] text-foreground leading-relaxed">{r}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials">
            {!profile || !profile.quote ? (
              <EmptyState icon={CircleDollarSign} message="No quote generated yet." />
            ) : (
              <QuoteSection quote={profile.quote} />
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

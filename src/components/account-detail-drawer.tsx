"use client";

import { useMemo } from "react";
import {
  Account,
  mockDealsTable,
  Deal,
  mockAccountERP,
  AccountERPProfile,
  ERPOrder,
  RFQ,
  AccountContact,
  ActivityEvent,
  AccountInsight,
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
  MapPin,
  Clock,
  ArrowUpRight,
  Handshake,
  TrendingUp,
  GitBranch,
  RotateCcw,
  BarChart3,
  AlertTriangle,
  Sparkles,
  Package,
  FileText,
  MapPin as MapPinIcon,
  FileCheck,
  Star,
  CheckCircle,
  XCircle,
  ShieldCheck,
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

const insightConfig: Record<
  AccountInsight["type"],
  { icon: typeof TrendingUp; border: string; iconColor: string }
> = {
  upsell: { icon: TrendingUp, border: "border-l-green-500", iconColor: "text-green-600" },
  "cross-sell": { icon: GitBranch, border: "border-l-blue-500", iconColor: "text-blue-600" },
  reorder: { icon: RotateCcw, border: "border-l-amber-500", iconColor: "text-amber-600" },
  trend: { icon: BarChart3, border: "border-l-purple-500", iconColor: "text-purple-600" },
  risk: { icon: AlertTriangle, border: "border-l-red-500", iconColor: "text-red-600" },
};

const activityIconMap: Record<ActivityEvent["type"], typeof Mail> = {
  email: Mail,
  call: Phone,
  meeting: Users,
  quote_sent: FileText,
  po_received: Package,
  site_visit: MapPinIcon,
  nda_signed: FileCheck,
};

const influenceColors: Record<AccountContact["influence"], string> = {
  "Decision Maker": "bg-red-50 text-red-700 border-red-200",
  Champion: "bg-green-50 text-green-700 border-green-200",
  Influencer: "bg-blue-50 text-blue-700 border-blue-200",
  "End User": "bg-warm-100 text-warm-600 border-warm-200",
};

const deptColors: Record<string, string> = {
  Engineering: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Procurement: "bg-amber-50 text-amber-700 border-amber-200",
  Quality: "bg-teal-50 text-teal-700 border-teal-200",
  Executive: "bg-purple-50 text-purple-700 border-purple-200",
};

// ─── Props ────────────────────────────────────────────────────────────────

interface AccountDetailDrawerProps {
  account: Account | null;
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

function HealthBadge({ health }: { health: Account["health"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full",
        health === "strong" && "bg-green-50 text-green-700 border border-green-200",
        health === "at-risk" && "bg-amber-50 text-amber-700 border border-amber-200",
        health === "new" && "bg-blue-50 text-blue-700 border border-blue-200"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          health === "strong" && "bg-green-500",
          health === "at-risk" && "bg-amber-500",
          health === "new" && "bg-blue-400"
        )}
      />
      {health === "at-risk" ? "At Risk" : health.charAt(0).toUpperCase() + health.slice(1)}
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

// ─── Insights Section ─────────────────────────────────────────────────────

function InsightsSection({ erp }: { erp: AccountERPProfile | undefined }) {
  if (!erp || erp.orderCount === 0) {
    return (
      <div className="mx-4 mb-3 rounded-lg border border-warm-200/60 bg-warm-50/40 px-4 py-3">
        <div className="flex items-center gap-2 text-[11px] text-warm-500">
          <Sparkles className="h-3 w-3" />
          <span className="font-medium">New account — no purchase history yet</span>
        </div>
        {erp && erp.insights.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {erp.insights.map((insight, i) => (
              <InsightCard key={i} insight={insight} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-4 mb-3 space-y-2">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard label="Lifetime Value" value={erp.lifetimeValue} />
        <StatCard label="Total Orders" value={String(erp.orderCount)} />
        <StatCard label="Avg Order" value={erp.avgOrderValue} />
        <StatCard label="Customer Since" value={erp.firstOrderDate} />
      </div>
      {/* Insight cards */}
      {erp.insights.length > 0 && (
        <div className="space-y-1.5">
          {erp.insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
          ))}
        </div>
      )}
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

function InsightCard({ insight }: { insight: AccountInsight }) {
  const config = insightConfig[insight.type];
  const Icon = config.icon;
  return (
    <div
      className={cn(
        "rounded-md border border-warm-200/60 border-l-[3px] bg-card px-3 py-2",
        config.border
      )}
    >
      <div className="flex items-start gap-2">
        <Icon className={cn("h-3.5 w-3.5 mt-0.5 shrink-0", config.iconColor)} />
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-foreground">{insight.title}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
            {insight.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Deals Tab ────────────────────────────────────────────────────────────

function DealRow({ deal }: { deal: Deal }) {
  const colors = stageColorMap[deal.stage] || { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };
  return (
    <div className="px-4 py-3 hover:bg-warm-50/50 transition-colors border-b border-warm-200/40 last:border-b-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] font-medium text-foreground truncate pr-3">{deal.name}</span>
        <span className="text-[12px] font-semibold text-foreground shrink-0">{deal.value}</span>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", colors.dot)} />
          <span className={colors.text}>{deal.stage}</span>
        </div>
        <span className="text-warm-300">·</span>
        <span>{deal.probability}% probability</span>
        <span className="text-warm-300">·</span>
        <span>Close {deal.closeDate}</span>
      </div>
      <div className="flex items-center gap-2 mt-1 text-[11px] text-warm-500">
        <User className="h-2.5 w-2.5" />
        <span>{deal.contactName}</span>
        <span className="text-warm-300">·</span>
        <span>{deal.dealOwner}</span>
      </div>
    </div>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────

function OrderCard({ order }: { order: ERPOrder }) {
  const statusColor =
    order.status === "Delivered"
      ? "bg-green-50 text-green-700 border-green-200"
      : order.status === "In Production"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-warm-100 text-warm-700 border-warm-200";

  return (
    <div className="rounded-lg border border-warm-200/60 bg-card overflow-hidden">
      <div className="px-3 py-2.5 flex items-center justify-between border-b border-warm-200/40 bg-warm-50/40">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold text-foreground">{order.poNumber}</span>
          <span className="text-[10px] text-muted-foreground">{order.orderDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={cn("text-[9px] px-1.5 py-0 font-medium border", statusColor)}>
            {order.status}
          </Badge>
          <span className="text-[12px] font-bold text-foreground">{order.totalValue}</span>
        </div>
      </div>
      <div className="divide-y divide-warm-200/30">
        {order.items.map((item, i) => (
          <div key={i} className="px-3 py-2 flex items-center gap-3 text-[11px]">
            <span className="font-mono text-warm-500 w-20 shrink-0">{item.partNumber}</span>
            <span className="text-foreground flex-1 truncate">{item.description}</span>
            <span className="text-warm-500 shrink-0">×{item.qty}</span>
            <span className="text-foreground font-medium shrink-0 w-16 text-right">{item.unitPrice}</span>
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium bg-indigo-50 text-indigo-700 border-indigo-200 shrink-0">
              {item.process}
            </Badge>
          </div>
        ))}
      </div>
      <div className="px-3 py-1.5 text-[10px] text-muted-foreground bg-warm-50/30 border-t border-warm-200/40">
        Delivery: {order.deliveryDate}
      </div>
    </div>
  );
}

// ─── RFQs Tab ─────────────────────────────────────────────────────────────

function RFQCard({ rfq }: { rfq: RFQ }) {
  const statusColor =
    rfq.status === "Won"
      ? "bg-green-50 text-green-700 border-green-200"
      : rfq.status === "Lost"
        ? "bg-red-50 text-red-700 border-red-200"
        : rfq.status === "Pending"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-warm-100 text-warm-500 border-warm-200";

  return (
    <div className="px-3 py-2.5 hover:bg-warm-50/50 transition-colors border-b border-warm-200/40 last:border-b-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-mono font-semibold text-warm-500">{rfq.rfqNumber}</span>
          <Badge variant="secondary" className={cn("text-[9px] px-1.5 py-0 font-medium border shrink-0", statusColor)}>
            {rfq.status}
          </Badge>
        </div>
        <span className="text-[12px] font-bold text-foreground shrink-0">{rfq.quotedValue}</span>
      </div>
      <p className="text-[12px] text-foreground truncate">{rfq.title}</p>
      <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
        <span>Received {rfq.receivedDate}</span>
        {rfq.respondedDate && (
          <>
            <span className="text-warm-300">·</span>
            <span>Responded {rfq.respondedDate}</span>
          </>
        )}
        <span className="text-warm-300">·</span>
        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium bg-indigo-50 text-indigo-700 border-indigo-200">
          {rfq.process}
        </Badge>
        {rfq.lostReason && (
          <>
            <span className="text-warm-300">·</span>
            <span className="text-red-600 font-medium">Lost: {rfq.lostReason}</span>
          </>
        )}
      </div>
    </div>
  );
}

function RFQSummary({ rfqs }: { rfqs: RFQ[] }) {
  const won = rfqs.filter((r) => r.status === "Won").length;
  const total = rfqs.filter((r) => r.status !== "Pending").length;
  const winRate = total > 0 ? Math.round((won / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4 mb-3 px-1">
      <div className="flex items-center gap-1.5 text-[11px]">
        <CheckCircle className="h-3 w-3 text-green-600" />
        <span className="text-foreground font-medium">
          {won}/{total} won — {winRate}%
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[11px]">
        <FileText className="h-3 w-3 text-warm-400" />
        <span className="text-muted-foreground">{rfqs.length} total RFQs</span>
      </div>
    </div>
  );
}

// ─── Contacts Tab ─────────────────────────────────────────────────────────

function ContactCard({ contact }: { contact: AccountContact }) {
  return (
    <div className="px-3 py-3 hover:bg-warm-50/50 transition-colors border-b border-warm-200/40 last:border-b-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] font-medium text-foreground">{contact.name}</span>
        <Badge variant="secondary" className={cn("text-[9px] px-1.5 py-0 font-medium border", influenceColors[contact.influence])}>
          {contact.influence}
        </Badge>
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] text-muted-foreground">{contact.role}</span>
        <Badge variant="secondary" className={cn("text-[9px] px-1.5 py-0 font-medium border", deptColors[contact.department] || "bg-warm-100 text-warm-600 border-warm-200")}>
          {contact.department}
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-[10px] text-warm-500">
        <div className="flex items-center gap-1">
          <Mail className="h-2.5 w-2.5" />
          <span>{contact.email}</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="h-2.5 w-2.5" />
          <span>{contact.phone}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
        <Clock className="h-2.5 w-2.5" />
        <span>Last interaction: {contact.lastInteraction}</span>
      </div>
    </div>
  );
}

// ─── Activity Tab ─────────────────────────────────────────────────────────

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

// ─── Quality Tab ──────────────────────────────────────────────────────────

function QualitySection({ erp }: { erp: AccountERPProfile }) {
  const q = erp.quality;
  const isNew = erp.orderCount === 0;

  if (isNew) {
    return <EmptyState icon={ShieldCheck} message="No quality data yet — new account." />;
  }

  const otdColor = q.onTimeDeliveryPct >= 95 ? "text-green-700" : q.onTimeDeliveryPct >= 90 ? "text-amber-700" : "text-red-700";
  const rejColor = q.rejectionRatePct < 1 ? "text-green-700" : q.rejectionRatePct < 3 ? "text-amber-700" : "text-red-700";

  return (
    <div className="space-y-3">
      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-2">
        <QualityCard label="On-Time Delivery" value={`${q.onTimeDeliveryPct}%`} color={otdColor} />
        <QualityCard label="Rejection Rate" value={`${q.rejectionRatePct}%`} color={rejColor} />
        <QualityCard label="Avg Lead Time" value={`${q.avgLeadTimeDays}d`} color="text-foreground" />
        <QualityCard label="Open NCRs" value={String(q.ncrCount)} color={q.ncrCount > 0 ? "text-amber-700" : "text-green-700"} />
        <QualityCard label="Open CAPAs" value={String(q.openCapas)} color={q.openCapas > 0 ? "text-red-700" : "text-green-700"} />
        <div className="rounded-md border border-warm-200/60 bg-card px-2.5 py-2 text-center">
          <p className="text-[10px] font-medium text-warm-400 uppercase tracking-wider">Satisfaction</p>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < q.customerSatisfaction ? "text-amber-400 fill-amber-400" : "text-warm-200"
                )}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Certifications */}
      {q.certifications.length > 0 && (
        <div>
          <p className="text-[10px] font-medium text-warm-400 uppercase tracking-wider mb-1.5">Certifications</p>
          <div className="flex flex-wrap gap-1.5">
            {q.certifications.map((cert) => (
              <Badge
                key={cert}
                variant="secondary"
                className="text-[10px] px-2 py-0.5 font-medium bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                <ShieldCheck className="h-2.5 w-2.5 mr-1" />
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QualityCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-md border border-warm-200/60 bg-card px-2.5 py-2 text-center">
      <p className="text-[10px] font-medium text-warm-400 uppercase tracking-wider">{label}</p>
      <p className={cn("text-[16px] font-bold mt-0.5", color)}>{value}</p>
    </div>
  );
}

// ─── Main Drawer ──────────────────────────────────────────────────────────

export function AccountDetailDrawer({ account, open, onOpenChange }: AccountDetailDrawerProps) {
  const accountDeals = useMemo(() => {
    if (!account) return [];
    return mockDealsTable.filter((d) => d.accountId === account.id);
  }, [account]);

  const erp = account ? mockAccountERP[account.id] : undefined;

  if (!account) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[620px] overflow-y-auto p-0">
        <SheetHeader className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <HealthBadge health={account.health} />
          </div>
          <SheetTitle className="text-lg">{account.name}</SheetTitle>
          <SheetDescription className="text-[12px]">
            {account.industry} · {account.region}
          </SheetDescription>
        </SheetHeader>

        {/* Insights section */}
        <InsightsSection erp={erp} />

        {/* Tabs */}
        <Tabs defaultValue="details" className="px-4 pb-4">
          <TabsList variant="line" className="mb-3 overflow-x-auto">
            <TabsTrigger value="details" className="text-[11px] px-2">
              Details
            </TabsTrigger>
            <TabsTrigger value="deals" className="text-[11px] px-2">
              Deals
              <TabBadge count={accountDeals.length} />
            </TabsTrigger>
            <TabsTrigger value="history" className="text-[11px] px-2">
              History
              <TabBadge count={erp?.orders.length ?? 0} />
            </TabsTrigger>
            <TabsTrigger value="rfqs" className="text-[11px] px-2">
              RFQs
              <TabBadge count={erp?.rfqs.length ?? 0} />
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-[11px] px-2">
              Contacts
              <TabBadge count={erp?.contacts.length ?? 0} />
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-[11px] px-2">
              Activity
            </TabsTrigger>
            <TabsTrigger value="quality" className="text-[11px] px-2">
              Quality
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            <div className="space-y-0 divide-y divide-warm-200/40">
              <DetailRow icon={Building2} label="Industry" value={account.industry} />
              <DetailRow icon={User} label="Primary Contact" value={account.primaryContact} />
              <DetailRow icon={Mail} label="Email" value={account.email} />
              <DetailRow icon={Phone} label="Phone" value={account.phone} />
              <DetailRow icon={Globe} label="Website" value={account.website} />
              <DetailRow icon={User} label="Account Owner" value={account.accountOwner} />
              <DetailRow icon={DollarSign} label="Annual Revenue" value={account.annualRevenue} />
              <DetailRow icon={Users} label="Employees" value={account.employees.toLocaleString()} />
              <DetailRow icon={DollarSign} label="Pipeline Value" value={account.totalValue} />
              <DetailRow icon={MapPin} label="Region" value={account.region} />
              <DetailRow icon={Clock} label="Last Activity" value={account.lastTouch} />
              <DetailRow icon={ArrowUpRight} label="Next Step" value={account.nextAction} />
              <DetailRow icon={Building2} label="Stage" value={account.stage} />
              <DetailRow icon={Clock} label="Created" value={account.createdDate} />
            </div>
          </TabsContent>

          {/* Deals Tab */}
          <TabsContent value="deals">
            {accountDeals.length === 0 ? (
              <EmptyState icon={Handshake} message="No deals associated with this account." />
            ) : (
              <div className="rounded-lg border border-warm-200/60 overflow-hidden bg-card">
                {accountDeals.map((deal) => (
                  <DealRow key={deal.id} deal={deal} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            {!erp || erp.orders.length === 0 ? (
              <EmptyState icon={Package} message="No purchase history yet." />
            ) : (
              <div className="space-y-3">
                {erp.orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* RFQs Tab */}
          <TabsContent value="rfqs">
            {!erp || erp.rfqs.length === 0 ? (
              <EmptyState icon={FileText} message="No RFQs on file." />
            ) : (
              <>
                <RFQSummary rfqs={erp.rfqs} />
                <div className="rounded-lg border border-warm-200/60 overflow-hidden bg-card">
                  {erp.rfqs.map((rfq) => (
                    <RFQCard key={rfq.id} rfq={rfq} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            {!erp || erp.contacts.length === 0 ? (
              <EmptyState icon={Users} message="No contacts on file." />
            ) : (
              <div className="rounded-lg border border-warm-200/60 overflow-hidden bg-card">
                {erp.contacts.map((contact) => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            {!erp || erp.activities.length === 0 ? (
              <EmptyState icon={Clock} message="No activity recorded." />
            ) : (
              <div className="pl-1">
                {erp.activities.map((event) => (
                  <ActivityRow key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Quality Tab */}
          <TabsContent value="quality">
            {erp ? (
              <QualitySection erp={erp} />
            ) : (
              <EmptyState icon={ShieldCheck} message="No quality data available." />
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

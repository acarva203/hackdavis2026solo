import {
  Activity,
  BadgeCheck,
  Bell,
  FileText,
  Fingerprint,
  Gavel,
  HeartHandshake,
  Link2,
  Loader2,
  LockKeyhole,
  Scale,
  Search,
  Sparkles,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSurvivorHistory } from "@/hooks/useUserSafetyContext";
import { generateAdvocacyReport } from "@/lib/geminiLegalAgent";
import { sha256Hex } from "@/lib/hash";
import { registerHarmSignature } from "@/lib/justiceLedger";
import type { AdvocacyReport, DetectionData, JusticeLedgerEntry } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const placeholderDetection: DetectionData = {
  id: "scan-7834",
  survivorAlias: "Maya C.",
  jurisdiction: "California, United States",
  platform: "VideoShare",
  sourceUrl: "https://videoshare.example/deepfake/activist-targeting-441",
  detectedAt: new Date().toISOString(),
  confidence: 0.943,
  threatLevel: "critical",
  profileProtectedTraits: ["AAPI woman", "public-interest activist"],
  metadata: {
    perceptualHash: "phash:9f2c-a1e4-77bd-40aa",
    faceMatchScore: 0.917,
    syntheticScore: 0.962,
    exifSummary: "Missing camera EXIF, GAN compression artifacts, edited audio/video cadence",
    modelSignals: ["coordinated repost spike", "public meeting timing", "identity-targeted comments"],
  },
};

type WorkflowState = "idle" | "reporting" | "logging" | "sent";

export function ProtectionDashboard() {
  const { history, memoryStatus, targetedCampaignScore, addIncident, updateIncident } =
    useSurvivorHistory();
  const [report, setReport] = useState<AdvocacyReport | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<JusticeLedgerEntry[]>([]);
  const [workflowState, setWorkflowState] = useState<WorkflowState>("idle");
  const [platformStatus, setPlatformStatus] = useState("Ready for survivor approval");

  const currentIncidentId = useMemo(() => `inc-${placeholderDetection.id}`, []);
  const isWorking = workflowState === "reporting" || workflowState === "logging";
  const latestLedger = ledgerEntries[0];

  async function runOneClickTakedown() {
    setWorkflowState("reporting");
    setPlatformStatus("Drafting survivor-centered escalation");
    addIncident({
      id: currentIncidentId,
      date: placeholderDetection.detectedAt,
      platform: placeholderDetection.platform,
      sourceUrl: placeholderDetection.sourceUrl,
      status: "detected",
    });

    const advocacyReport = await generateAdvocacyReport(placeholderDetection);
    setReport(advocacyReport);
    updateIncident(currentIncidentId, {
      status: "notice_generated",
      harmCategory: advocacyReport.harmCategory,
      reportHash: advocacyReport.reportHash,
    });

    setWorkflowState("logging");
    setPlatformStatus("Registering hash-only proof of existence");
    const contentHash = await sha256Hex(placeholderDetection.metadata.perceptualHash);
    const ledgerEntry = await registerHarmSignature(contentHash);
    setLedgerEntries((entries) => [ledgerEntry, ...entries]);
    updateIncident(currentIncidentId, {
      status: "ledger_logged",
      contentHash,
      transactionSignature: ledgerEntry.signature,
    });

    setWorkflowState("sent");
    setPlatformStatus("Escalation package prepared");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-card/80 px-6 backdrop-blur">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search incidents, hashes, platforms..."
            className="h-9 pl-9 bg-background"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <Button onClick={runOneClickTakedown} disabled={isWorking} className="gap-2">
            {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gavel className="h-4 w-4" />}
            One-Click Takedown
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Page heading */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Survivor advocacy</p>
            <h1 className="text-3xl font-semibold tracking-tight">Protection Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Calm evidence preservation, takedown preparation, and pattern tracking for targeted synthetic abuse.
            </p>
          </div>
          <StatusPill label={platformStatus} tone={workflowState === "sent" ? "green" : "amber"} />
        </div>

        {/* KPI row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            label="Active confidence"
            value={`${Math.round(placeholderDetection.confidence * 100)}%`}
            hint="Synthetic detection model"
            tone="primary"
            icon={<Sparkles className="h-4 w-4" />}
          />
          <Kpi
            label="Campaign signal"
            value={`${targetedCampaignScore}%`}
            hint="Across last 30 days"
            tone="warning"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <Kpi
            label="Open incidents"
            value={String(history.incidents.length)}
            hint="Survivor-tracked cases"
            tone="default"
            icon={<ShieldDot />}
          />
          <Kpi
            label="Ledger entries"
            value={String(ledgerEntries.length || 1)}
            hint="Hash-only confirmations"
            tone="success"
            icon={<BadgeCheck className="h-4 w-4" />}
          />
        </div>

        {/* Main grid */}
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            {/* Active review */}
            <Card className="overflow-hidden border-border shadow-[var(--shadow-card)]">
              <div className="bg-[var(--gradient-surface)] px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Active harm review · {placeholderDetection.id}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      Synthetic impersonation with campaign indicators
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {placeholderDetection.platform} · {placeholderDetection.jurisdiction}
                    </p>
                  </div>
                  <Badge variant="destructive" className="uppercase tracking-wide">
                    {placeholderDetection.threatLevel}
                  </Badge>
                </div>
              </div>
              <Separator />
              <CardContent className="grid gap-4 p-6 lg:grid-cols-2">
                <SignalPanel
                  icon={<Fingerprint className="h-4 w-4 text-primary" />}
                  title="Hash-Only Evidence"
                  items={[
                    placeholderDetection.metadata.perceptualHash,
                    `Face match ${Math.round(placeholderDetection.metadata.faceMatchScore * 100)}%`,
                    placeholderDetection.metadata.exifSummary,
                  ]}
                />
                <SignalPanel
                  icon={<Scale className="h-4 w-4 text-destructive" />}
                  title="Pattern Indicators"
                  items={placeholderDetection.metadata.modelSignals}
                />
              </CardContent>
            </Card>

            {/* Rights summary */}
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-base">Survivor Rights Summary</CardTitle>
                </div>
                <Badge variant="outline" className="uppercase">
                  {report?.generatedBy ?? "ready"}
                </Badge>
              </CardHeader>
              <CardContent>
                <TextPanel
                  text={
                    report?.victimRightsSummary ??
                    "Press One-Click Takedown to prepare an empathetic rights summary without exposing the underlying harmful media."
                  }
                />
              </CardContent>
            </Card>

            {/* Platform notice */}
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader className="flex-row items-center gap-2 space-y-0 pb-3">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Platform Escalation Notice</CardTitle>
              </CardHeader>
              <CardContent>
                <TextPanel
                  text={
                    report?.platformEscalationNotice ??
                    "The platform notice will cite relevant AI safety, NCII, and civil-rights accountability hooks after the survivor initiates the workflow."
                  }
                />
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            {/* Progress */}
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Justice Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Workflow completion</span>
                    <span>{progressValue(workflowState, !!report, !!latestLedger)}%</span>
                  </div>
                  <Progress value={progressValue(workflowState, !!report, !!latestLedger)} />
                </div>
                <div className="space-y-1">
                  <ProgressStep icon={<Sparkles className="h-4 w-4" />} label="Advocacy report" done={Boolean(report)} />
                  <ProgressStep icon={<UploadCloud className="h-4 w-4" />} label="Platform escalation" done={workflowState === "sent"} />
                  <ProgressStep icon={<BadgeCheck className="h-4 w-4" />} label="Solana harm signature" done={Boolean(latestLedger)} />
                </div>
              </CardContent>
            </Card>

            {/* Survivor context */}
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
                <LockKeyhole className="h-5 w-5 text-destructive" />
                <CardTitle className="text-base">Secure Survivor Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{memoryStatus}</p>
                <div className="mt-4 space-y-1">
                  <MemoryRow label="Survivor alias" value={history.profile.survivorAlias} />
                  <MemoryRow label="Advocacy role" value={history.profile.publicRole} />
                  <MemoryRow label="Jurisdiction" value={history.profile.primaryJurisdiction} />
                  <MemoryRow label="Prior cases" value={String(history.incidents.length)} />
                </div>
              </CardContent>
            </Card>

            {/* Ledger */}
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">Accountability Ledger</CardTitle>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--success)]" />
                  live
                </span>
              </CardHeader>
              <CardContent className="space-y-3">
                {ledgerEntries.map((entry) => (
                  <a
                    key={entry.id}
                    href={entry.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg border border-border bg-muted/40 p-3 transition hover:border-primary hover:bg-muted"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold">
                        {entry.status === "confirmed" ? "Confirmed" : "Demo confirmed"}
                      </span>
                      <Link2 className="h-4 w-4 text-primary" />
                    </div>
                    <p className="mt-2 break-all font-mono text-[11px] text-muted-foreground">
                      {entry.contentHash}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(entry.confirmedAt).toLocaleString()}
                    </p>
                  </a>
                ))}
                {!latestLedger && (
                  <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                    Hash-only Solana confirmations will appear here.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prior cases */}
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Prior Case Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-64 pr-2">
                  <div className="space-y-2">
                    {history.incidents.map((incident) => (
                      <div
                        key={incident.id}
                        className="rounded-lg border border-border bg-muted/30 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold">{incident.platform}</p>
                          <StatusPill label={incident.status.replace(/_/g, " ")} tone="neutral" />
                        </div>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{incident.sourceUrl}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {new Date(incident.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}

function ShieldDot() {
  return <span className="block h-2 w-2 rounded-full bg-primary" />;
}

function progressValue(state: WorkflowState, hasReport: boolean, hasLedger: boolean) {
  let v = 0;
  if (hasReport) v += 50;
  else if (state === "reporting") v += 20;
  if (state === "logging") v = Math.max(v, 70);
  if (hasLedger) v = 100;
  return v;
}

function Kpi({
  label,
  value,
  hint,
  tone,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "primary" | "warning" | "success" | "default";
  icon: React.ReactNode;
}) {
  const ring =
    tone === "primary"
      ? "bg-primary/10 text-primary"
      : tone === "warning"
        ? "bg-[color-mix(in oklab, var(--warning) 15%, transparent)] text-[var(--warning)]"
        : tone === "success"
          ? "bg-[color-mix(in oklab, var(--success) 15%, transparent)] text-[var(--success)]"
          : "bg-muted text-muted-foreground";
  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </div>
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${ring}`}>{icon}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function SignalPanel({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <ul className="space-y-1.5 text-sm text-foreground/80">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
            <span className="font-mono text-[12px] leading-5">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TextPanel({ text }: { text: string }) {
  return (
    <ScrollArea className="h-64 rounded-lg border border-border bg-muted/30">
      <pre className="whitespace-pre-wrap p-4 font-sans text-sm leading-6 text-foreground/85">{text}</pre>
    </ScrollArea>
  );
}

function ProgressStep({
  icon,
  label,
  done,
}: {
  icon: React.ReactNode;
  label: string;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
          done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </span>
      <span className={`text-sm ${done ? "font-medium text-foreground" : "text-muted-foreground"}`}>{label}</span>
      {done && <BadgeCheck className="ml-auto h-4 w-4 text-[var(--success)]" />}
    </div>
  );
}

function MemoryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border py-2 first:border-t-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "amber" | "green" | "neutral" }) {
  const toneClass =
    tone === "green"
      ? "border-[color-mix(in oklab, var(--success) 30%, transparent)] bg-[color-mix(in oklab, var(--success) 12%, transparent)] text-[var(--success)]"
      : tone === "amber"
        ? "border-[color-mix(in oklab, var(--warning) 30%, transparent)] bg-[color-mix(in oklab, var(--warning) 12%, transparent)] text-[oklch(0.45 0.12 75)]"
        : "border-border bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${toneClass}`}
    >
      {label}
    </span>
  );
}
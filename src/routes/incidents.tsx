import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ShieldCheck, FileText, Filter, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/incidents")({
  head: () => ({
    meta: [
      { title: "Incidents — Aegis Deepfake Defense" },
      {
        name: "description",
        content: "Survivor-centered case log of synthetic media incidents and takedown status.",
      },
    ],
  }),
  component: IncidentsPage,
});

type Status = "detected" | "notice_generated" | "ledger_logged" | "removed";

const incidents: {
  id: string;
  date: string;
  platform: string;
  category: string;
  jurisdiction: string;
  status: Status;
  confidence: number;
}[] = [
  {
    id: "INC-2026-0143",
    date: "2026-05-09",
    platform: "VideoShare",
    category: "Synthetic political harassment",
    jurisdiction: "California, US",
    status: "ledger_logged",
    confidence: 0.94,
  },
  {
    id: "INC-2026-0138",
    date: "2026-05-04",
    platform: "ChatterNet",
    category: "Identity-based harassment",
    jurisdiction: "California, US",
    status: "notice_generated",
    confidence: 0.82,
  },
  {
    id: "INC-2026-0129",
    date: "2026-04-21",
    platform: "ImageBoard",
    category: "NCII - Non-Consensual Intimate Imagery",
    jurisdiction: "Oregon, US",
    status: "removed",
    confidence: 0.97,
  },
  {
    id: "INC-2026-0118",
    date: "2026-04-12",
    platform: "VideoShare",
    category: "Doxxing or coordinated intimidation",
    jurisdiction: "California, US",
    status: "detected",
    confidence: 0.71,
  },
];

const statusTone: Record<Status, { label: string; cls: string }> = {
  detected: { label: "Detected", cls: "bg-muted text-muted-foreground" },
  notice_generated: {
    label: "Notice sent",
    cls: "bg-[color-mix(in_oklab,var(--warning)_15%,transparent)] text-[oklch(0.45_0.12_75)]",
  },
  ledger_logged: {
    label: "Ledger logged",
    cls: "bg-primary/10 text-primary",
  },
  removed: {
    label: "Removed",
    cls: "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[var(--success)]",
  },
};

function IncidentsPage() {
  const open = incidents.filter((i) => i.status !== "removed").length;
  const removed = incidents.filter((i) => i.status === "removed").length;
  const critical = incidents.filter((i) => i.confidence >= 0.9).length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        eyebrow="Survivor casework"
        title="Incidents"
        description="Each row is a survivor-tracked case. Hash-only evidence preserves dignity while keeping a defensible audit trail."
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New incident
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open cases" value={open} icon={<AlertTriangle className="h-4 w-4" />} tone="warning" />
        <StatCard label="Removed" value={removed} icon={<ShieldCheck className="h-4 w-4" />} tone="success" />
        <StatCard label="Critical confidence" value={critical} icon={<FileText className="h-4 w-4" />} tone="primary" />
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle className="text-base">All incidents</CardTitle>
          <div className="flex items-center gap-2">
            <Input placeholder="Filter by platform or ID..." className="h-9 w-64" />
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Harm category</TableHead>
                <TableHead>Jurisdiction</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell className="font-medium">{i.platform}</TableCell>
                  <TableCell className="text-muted-foreground">{i.category}</TableCell>
                  <TableCell className="text-muted-foreground">{i.jurisdiction}</TableCell>
                  <TableCell>{Math.round(i.confidence * 100)}%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-transparent ${statusTone[i.status].cls}`}>
                      {statusTone[i.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{i.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "primary" | "warning" | "success";
}) {
  const cls =
    tone === "primary"
      ? "bg-primary/10 text-primary"
      : tone === "warning"
        ? "bg-[color-mix(in_oklab,var(--warning)_15%,transparent)] text-[oklch(0.45_0.12_75)]"
        : "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[var(--success)]";
  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${cls}`}>{icon}</span>
      </CardContent>
    </Card>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Mail, Sparkles, Eye } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Aegis Deepfake Defense" },
      {
        name: "description",
        content: "Trauma-informed advocacy reports and platform escalation notices for survivors.",
      },
    ],
  }),
  component: ReportsPage,
});

const reports = [
  {
    id: "RPT-2026-0143",
    title: "Synthetic political harassment — VideoShare",
    survivor: "Maya C.",
    generatedAt: "2026-05-09 14:22",
    status: "Ready to send",
    pages: 4,
    citations: 6,
  },
  {
    id: "RPT-2026-0138",
    title: "Identity-based harassment — ChatterNet",
    survivor: "Maya C.",
    generatedAt: "2026-05-04 09:11",
    status: "Sent to platform",
    pages: 3,
    citations: 4,
  },
  {
    id: "RPT-2026-0129",
    title: "NCII takedown — ImageBoard",
    survivor: "Anonymous-A19",
    generatedAt: "2026-04-21 18:05",
    status: "Removed",
    pages: 5,
    citations: 8,
  },
];

function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        eyebrow="Trauma-informed advocacy"
        title="Reports"
        description="AI-generated rights summaries and platform escalation notices. Survivors review and approve before anything is sent."
        actions={
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" /> Generate report
          </Button>
        }
      />

      <Card className="border-primary/20 bg-primary/5 shadow-[var(--shadow-card)]">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Two report templates power every case</p>
              <p className="text-xs text-muted-foreground">
                A <strong>Survivor Rights Summary</strong> for the person harmed, and a <strong>Platform Escalation Notice</strong> citing
                2026 AI Safety Regulations and Civil Rights protections.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">View templates</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.id} className="shadow-[var(--shadow-card)]">
            <CardHeader className="space-y-1 pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-[10px]">{r.id}</Badge>
                <Badge
                  variant="outline"
                  className={
                    r.status === "Removed"
                      ? "border-transparent bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[var(--success)]"
                      : r.status === "Sent to platform"
                        ? "border-transparent bg-primary/10 text-primary"
                        : "border-transparent bg-[color-mix(in_oklab,var(--warning)_15%,transparent)] text-[oklch(0.45_0.12_75)]"
                  }
                >
                  {r.status}
                </Badge>
              </div>
              <CardTitle className="text-base leading-snug">{r.title}</CardTitle>
              <p className="text-xs text-muted-foreground">
                Survivor: <span className="font-medium text-foreground">{r.survivor}</span> · {r.generatedAt}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Pages</p>
                  <p className="text-lg font-semibold">{r.pages}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Citations</p>
                  <p className="text-lg font-semibold">{r.citations}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                  <Eye className="h-3.5 w-3.5" /> Preview
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" className="gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Send
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
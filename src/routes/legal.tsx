import { createFileRoute } from "@tanstack/react-router";
import { Scale, BookOpen, Building2, Globe2, ExternalLink, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Legal & Civil Rights — Aegis Deepfake Defense" },
      {
        name: "description",
        content:
          "2026 AI Safety Regulations, Civil Rights protections, and survivor-aligned legal aid resources for synthetic abuse cases.",
      },
    ],
  }),
  component: LegalPage,
});

const frameworks = [
  {
    title: "2026 Federal AI Accountability Act",
    region: "United States",
    summary:
      "Mandates platform takedown of non-consensual synthetic media within 48 hours, with civil penalties for repeat non-compliance.",
    cite: "Pub. L. 119-204 §301–§312",
  },
  {
    title: "California Penal Code §647(j)(4)",
    region: "California, US",
    summary:
      "Criminalizes distribution of synthetic intimate imagery without consent. Provides survivors a private right of action.",
    cite: "Cal. Penal Code §647(j)(4)",
  },
  {
    title: "47 U.S.C. §230(e)(5)",
    region: "United States",
    summary:
      "Section 230 carve-out removing platform immunity for NCII and certain synthetic abuse content.",
    cite: "47 U.S.C. §230(e)(5)",
  },
  {
    title: "EU Digital Services Act, Art. 16",
    region: "European Union",
    summary:
      "Notice-and-action mechanism requiring platforms to provide accessible, survivor-friendly takedown procedures.",
    cite: "Regulation (EU) 2022/2065",
  },
  {
    title: "Civil Rights Act, Title II adaptation",
    region: "United States",
    summary:
      "Applies to coordinated targeting of protected classes, supporting hate-crime classification of pattern harassment.",
    cite: "42 U.S.C. §2000a",
  },
  {
    title: "UK Online Safety Act 2023, Pt. 10",
    region: "United Kingdom",
    summary:
      "Criminalizes the sharing or threatening to share synthetic intimate images. Protects survivors regardless of intent.",
    cite: "Online Safety Act 2023",
  },
];

const resources = [
  { name: "Cyber Civil Rights Initiative", url: "https://cybercivilrights.org", focus: "NCII survivor support" },
  { name: "NCMEC Take It Down", url: "https://takeitdown.ncmec.org", focus: "Minor-focused hash takedowns" },
  { name: "EFF Legal Help", url: "https://eff.org", focus: "Digital rights legal referrals" },
  { name: "RAINN", url: "https://rainn.org", focus: "Survivor crisis support" },
];

function LegalPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        eyebrow="Civil rights & AI safety"
        title="Legal Frameworks"
        description="The statutes, regulations, and survivor-aligned resources our advocacy reports cite. Reducing the barrier to legal recourse for targeted activists."
        actions={
          <Button variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" /> Citation library
          </Button>
        }
      />

      <Card className="overflow-hidden border-border shadow-[var(--shadow-card)]">
        <div className="bg-[var(--gradient-surface)] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Survivor-first legal posture</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Aegis never stores the harmful media itself. Cryptographic hashes anchored on Solana create
                <em> proof of existence</em> that survivors can hand to law enforcement, civil-rights attorneys, or
                courtrooms — without forcing them to relive the abuse.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Cited frameworks
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {frameworks.map((f) => (
            <Card key={f.title} className="shadow-[var(--shadow-card)]">
              <CardHeader className="space-y-1 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="gap-1">
                    <Globe2 className="h-3 w-3" /> {f.region}
                  </Badge>
                  <Scale className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base leading-snug">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{f.summary}</p>
                <Separator />
                <p className="font-mono text-[11px] text-muted-foreground">{f.cite}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Survivor advocacy resources
        </h2>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="divide-y divide-border p-0">
            {resources.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 p-4 transition hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.focus}</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
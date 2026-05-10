import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Link2, Activity, Fingerprint } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/ledger")({
  head: () => ({
    meta: [
      { title: "Accountability Ledger — Aegis Deepfake Defense" },
      {
        name: "description",
        content:
          "Hash-only Solana proof-of-existence entries. Permanent, auditable evidence of systemic harassment without exposing harmful media.",
      },
    ],
  }),
  component: LedgerPage,
});

const entries = [
  {
    id: "led-9f2c",
    contentHash: "9f2ca1e477bd40aa6b34c81f2e0b9d5311af772e09c3b4a8d6e7f1c2b5a83019",
    signature: "5N8z...QpXa",
    confirmedAt: "2026-05-09 14:24",
    status: "confirmed",
    cluster: "mainnet",
  },
  {
    id: "led-44b8",
    contentHash: "44b80f1a2c3d4e5f6071829304a5b6c7d8e9f0010203040506070809a0b1c2d3",
    signature: "Aq7r...Lm2T",
    confirmedAt: "2026-05-04 09:13",
    status: "confirmed",
    cluster: "mainnet",
  },
  {
    id: "led-a91d",
    contentHash: "a91d2c0e7f8a9b0c1d2e3f405162738495a6b7c8d9e0f10212223242526272829",
    signature: "7yKp...bV4n",
    confirmedAt: "2026-04-21 18:07",
    status: "confirmed",
    cluster: "mainnet",
  },
  {
    id: "led-e203",
    contentHash: "e203bb45c6d7e8f9001122334455667788990aabbccddeeff00112233445566",
    signature: "demo-3xQ9...kT",
    confirmedAt: "2026-04-12 11:02",
    status: "simulated",
    cluster: "devnet",
  },
];

function LedgerPage() {
  const confirmed = entries.filter((e) => e.status === "confirmed").length;
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        eyebrow="Proof of existence"
        title="Accountability Ledger"
        description="Cryptographic fingerprints anchored on Solana. The harmful content is never stored — only the hash, the time, and the signature that proves a pattern."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total entries</p>
            <p className="mt-2 text-3xl font-semibold">{entries.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Across all survivor cases</p>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Confirmed</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--success)]">{confirmed}</p>
            <p className="mt-1 text-xs text-muted-foreground">Anchored on Solana mainnet</p>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Last anchor</p>
            <p className="mt-2 text-3xl font-semibold">14m</p>
            <p className="mt-1 text-xs text-muted-foreground">ago · Maya C. case</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Anchored hashes</CardTitle>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--success)]" /> live
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          {entries.map((e) => (
            <div
              key={e.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Fingerprint className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">
                      {e.status === "confirmed" ? "Confirmed" : "Demo confirmed"}
                    </p>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {e.cluster}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{e.confirmedAt}</span>
                  </div>
                  <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
                    {e.contentHash}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    sig {e.signature}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <BadgeCheck className="h-4 w-4 text-[var(--success)]" />
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Link2 className="h-3.5 w-3.5" /> Explorer
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { IncidentRecord, SurvivorHistory } from "@/types";

const initialHistory: SurvivorHistory = {
  profile: {
    survivorAlias: "Maya C.",
    publicRole: "Climate justice organizer",
    protectedTraits: ["public-interest activist", "community organizer", "AAPI woman"],
    primaryJurisdiction: "California, United States",
    trustedReferenceHashes: ["ref-a91d2c", "ref-44b80f", "ref-e203bb"],
  },
  incidents: [
    {
      id: "inc-001",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      platform: "VideoShare",
      sourceUrl: "https://videoshare.example/repost/89ab",
      status: "ledger_logged",
      harmCategory: "Synthetic political harassment",
      contentHash: "5a8d1b7fd4f1d51f",
      transactionSignature: "demo-5a8d1b7fd4",
    },
    {
      id: "inc-002",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      platform: "ChatterNet",
      sourceUrl: "https://chatternet.example/post/aa12",
      status: "notice_generated",
      harmCategory: "Identity-based harassment",
    },
  ],
};

export function useSurvivorHistory() {
  const [history, setHistory] = useState<SurvivorHistory>(initialHistory);
  const [memoryStatus, setMemoryStatus] = useState("Encrypted survivor history ready");

  useEffect(() => {
    const t = setTimeout(() => setMemoryStatus("Encrypted survivor history restored"), 500);
    return () => clearTimeout(t);
  }, []);

  const targetedCampaignScore = useMemo(() => {
    const repeatedPlatforms = new Set(history.incidents.map((i) => i.platform)).size;
    const recent = history.incidents.filter(
      (i) => Date.now() - new Date(i.date).getTime() < 1000 * 60 * 60 * 24 * 30
    ).length;
    return Math.min(100, recent * 25 + Math.max(0, history.incidents.length - repeatedPlatforms) * 15);
  }, [history.incidents]);

  const actions = useMemo(
    () => ({
      addIncident: (incident: IncidentRecord) => {
        setHistory((c) => ({
          ...c,
          incidents: [incident, ...c.incidents.filter((e) => e.id !== incident.id)].slice(0, 12),
        }));
      },
      updateIncident: (id: string, patch: Partial<IncidentRecord>) => {
        setHistory((c) => ({
          ...c,
          incidents: c.incidents.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        }));
      },
    }),
    []
  );

  return { history, memoryStatus, targetedCampaignScore, ...actions };
}
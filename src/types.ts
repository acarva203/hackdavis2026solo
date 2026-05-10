export type ThreatLevel = "elevated" | "critical";
export type HarmCategory =
  | "NCII - Non-Consensual Intimate Imagery"
  | "Synthetic political harassment"
  | "Identity-based harassment"
  | "Doxxing or coordinated intimidation"
  | "Unknown synthetic abuse";

export interface DetectionData {
  id: string;
  survivorAlias: string;
  jurisdiction: string;
  platform: string;
  sourceUrl: string;
  detectedAt: string;
  confidence: number;
  threatLevel: ThreatLevel;
  profileProtectedTraits?: string[];
  metadata: {
    perceptualHash: string;
    faceMatchScore: number;
    syntheticScore: number;
    exifSummary: string;
    modelSignals: string[];
  };
}

export interface AdvocacyReport {
  harmCategory: HarmCategory;
  victimRightsSummary: string;
  platformEscalationNotice: string;
  citations: string[];
  targetedCampaignSignals: string[];
  reportHash: string;
  generatedBy: "gemini" | "fallback";
}

export interface JusticeLedgerEntry {
  id: string;
  contentHash: string;
  signature: string;
  explorerUrl: string;
  confirmedAt: string;
  status: "confirmed" | "simulated";
}

export interface SurvivorProfile {
  survivorAlias: string;
  publicRole: string;
  protectedTraits: string[];
  primaryJurisdiction: string;
  trustedReferenceHashes: string[];
}

export interface IncidentRecord {
  id: string;
  date: string;
  platform: string;
  sourceUrl: string;
  status: "detected" | "notice_generated" | "ledger_logged";
  harmCategory?: HarmCategory;
  contentHash?: string;
  reportHash?: string;
  transactionSignature?: string;
}

export interface SurvivorHistory {
  profile: SurvivorProfile;
  incidents: IncidentRecord[];
}
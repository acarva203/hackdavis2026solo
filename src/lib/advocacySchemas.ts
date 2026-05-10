import { z } from "zod";

export const detectionDataSchema = z.object({
  id: z.string(),
  survivorAlias: z.string(),
  jurisdiction: z.string(),
  platform: z.string(),
  sourceUrl: z.string().url(),
  detectedAt: z.string(),
  confidence: z.number().min(0).max(1),
  threatLevel: z.enum(["elevated", "critical"]),
  profileProtectedTraits: z.array(z.string()).optional(),
  metadata: z.object({
    perceptualHash: z.string(),
    faceMatchScore: z.number().min(0).max(1),
    syntheticScore: z.number().min(0).max(1),
    exifSummary: z.string(),
    modelSignals: z.array(z.string()),
  }),
});

export const advocacyReportSchema = z.object({
  harmCategory: z.enum([
    "NCII - Non-Consensual Intimate Imagery",
    "Synthetic political harassment",
    "Identity-based harassment",
    "Doxxing or coordinated intimidation",
    "Unknown synthetic abuse",
  ]),
  victimRightsSummary: z.string(),
  platformEscalationNotice: z.string(),
  citations: z.array(z.string()),
  targetedCampaignSignals: z.array(z.string()),
  reportHash: z.string(),
  generatedBy: z.enum(["gemini", "fallback"]),
});

export type DetectionDataInput = z.infer<typeof detectionDataSchema>;
export type AdvocacyReportOutput = z.infer<typeof advocacyReportSchema>;

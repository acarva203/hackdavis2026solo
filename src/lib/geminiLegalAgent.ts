import { AdvocacyReport, DetectionData } from "@/types";
import { sha256Hex } from "./hash";

export async function generateAdvocacyReport(detection: DetectionData): Promise<AdvocacyReport> {
  await new Promise((r) => setTimeout(r, 900));

  const victimRightsSummary = `You are not alone, ${detection.survivorAlias}. A synthetic media incident has been detected on ${detection.platform} with ${Math.round(
    detection.confidence * 100
  )}% confidence. Under ${detection.jurisdiction} law and emerging federal AI accountability frameworks, you have the right to:

• Demand expedited removal of non-consensual synthetic content
• Preserve hash-only evidence for civil and criminal proceedings
• Request platform transparency reports about distribution patterns
• Access survivor advocacy resources and legal aid networks

No copy of the harmful media is stored. Only cryptographic fingerprints are retained, protecting your dignity while preserving accountability.`;

  const platformEscalationNotice = `TO: Trust & Safety, ${detection.platform}
RE: Urgent removal request — Reference ${detection.id}

This notice formally requests immediate takedown of synthetic media targeting a public-interest individual under the following frameworks:

1. NCII protections (state and federal)
2. Section 230(e) carve-outs for non-consensual intimate imagery
3. Platform Terms of Service prohibitions on impersonation
4. Emerging AI Safety commitments (White House voluntary framework)

Evidence package (hash-only):
  • Perceptual hash: ${detection.metadata.perceptualHash}
  • Synthetic likelihood: ${Math.round(detection.metadata.syntheticScore * 100)}%
  • Coordinated signals: ${detection.metadata.modelSignals.join(", ")}

We request acknowledgement within 24 hours and removal within 48 hours, consistent with industry best practice for survivor-centered response.`;

  const reportHash = (await sha256Hex(victimRightsSummary + platformEscalationNotice)).slice(0, 32);

  return {
    harmCategory: "Synthetic political harassment",
    victimRightsSummary,
    platformEscalationNotice,
    citations: [
      "California Penal Code §647(j)(4)",
      "47 U.S.C. §230(e)(5)",
      "EU Digital Services Act Art. 16",
    ],
    targetedCampaignSignals: detection.metadata.modelSignals,
    reportHash,
    generatedBy: "fallback",
  };
}
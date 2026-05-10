import "./lib/error-capture";

import { GoogleGenAI } from "@google/genai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { advocacyReportSchema, detectionDataSchema } from "./lib/advocacySchemas";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { sha256Hex } from "./lib/hash";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function jsonResponse(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function generateFallbackReport(detection: {
  survivorAlias: string;
  platform: string;
  confidence: number;
  jurisdiction: string;
  id: string;
  metadata: { perceptualHash: string; syntheticScore: number; modelSignals: string[] };
}) {
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
    harmCategory: "Synthetic political harassment" as const,
    victimRightsSummary,
    platformEscalationNotice,
    citations: [
      "California Penal Code §647(j)(4)",
      "47 U.S.C. §230(e)(5)",
      "EU Digital Services Act Art. 16",
    ],
    targetedCampaignSignals: detection.metadata.modelSignals,
    reportHash,
    generatedBy: "fallback" as const,
  };
}

async function handleGenerateAdvocacyReport(request: Request, env: unknown): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body" });
  }

  const parsed = detectionDataSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse(400, { error: "Invalid detection payload" });
  }

  const apiKey =
    (env as { GEMINI_API_KEY?: string } | undefined)?.GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  if (!apiKey) {
    const fallback = await generateFallbackReport(parsed.data);
    return jsonResponse(200, fallback);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a legal advocacy drafting assistant for survivor-centered trust and safety workflows.

Given this detection object, produce only valid JSON that follows the provided schema exactly.
Do not include markdown fences or extra commentary.

Detection data:
${JSON.stringify(parsed.data, null, 2)}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(advocacyReportSchema),
      },
    });

    const candidateText = response.text ?? "";
    const modelPayload = JSON.parse(candidateText);
    const validated = advocacyReportSchema.parse(modelPayload);
    return jsonResponse(200, validated);
  } catch (error) {
    console.error("Gemini generation failed", error);
    const fallback = await generateFallbackReport(parsed.data);
    return jsonResponse(200, fallback);
  }
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);
    if (url.pathname === "/api/generate-advocacy-report") {
      if (request.method !== "POST") {
        return jsonResponse(405, { error: "Method not allowed" });
      }
      return handleGenerateAdvocacyReport(request, env);
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};

import { JusticeLedgerEntry } from "@/types";
import { sha256Hex } from "./hash";

export async function registerHarmSignature(contentHash: string): Promise<JusticeLedgerEntry> {
  await new Promise((r) => setTimeout(r, 600));
  const signature = (await sha256Hex(contentHash + Date.now())).slice(0, 44);
  return {
    id: `ledger-${signature.slice(0, 8)}`,
    contentHash,
    signature,
    explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    confirmedAt: new Date().toISOString(),
    status: "simulated",
  };
}
import { JusticeLedgerEntry } from "@/types";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { sha256Hex } from "./hash";

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

export class LedgerRegistrationError extends Error {
  constructor(
    public readonly code: "wallet_not_connected" | "signature_rejected" | "rpc_failed",
    message: string,
  ) {
    super(message);
    this.name = "LedgerRegistrationError";
  }
}

export type WalletSigner = {
  publicKey: PublicKey | null;
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>;
};

type RegisterHarmSignatureOptions =
  | { mode: "demo" }
  | {
      mode: "live";
      wallet: WalletSigner;
    };

function clusterConfig() {
  const cluster = import.meta.env.VITE_SOLANA_CLUSTER ?? "devnet";
  const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
  return { cluster, rpcUrl };
}

export async function registerHarmSignature(
  contentHash: string,
  options: RegisterHarmSignatureOptions,
): Promise<JusticeLedgerEntry> {
  await new Promise((r) => setTimeout(r, 600));

  if (options.mode === "demo") {
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

  if (!options.wallet.publicKey) {
    throw new LedgerRegistrationError("wallet_not_connected", "Wallet not connected.");
  }

  const { cluster, rpcUrl } = clusterConfig();
  const connection = new Connection(rpcUrl, "confirmed");
  const memoPayload = JSON.stringify({
    v: 1,
    contentHash,
    generatedAt: new Date().toISOString(),
  });

  const transaction = new Transaction().add(
    new TransactionInstruction({
      keys: [],
      programId: MEMO_PROGRAM_ID,
      data: new TextEncoder().encode(memoPayload),
    }),
  );
  transaction.feePayer = options.wallet.publicKey;
  const latestBlockhash = await connection.getLatestBlockhash("confirmed");
  transaction.recentBlockhash = latestBlockhash.blockhash;

  let signature = "";
  try {
    signature = await options.wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(
      {
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature,
      },
      "confirmed",
    );
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("reject") || message.includes("declin") || message.includes("cancel")) {
      throw new LedgerRegistrationError("signature_rejected", "Wallet signature was rejected.");
    }
    throw new LedgerRegistrationError("rpc_failed", "Failed to submit Solana transaction.");
  }

  return {
    id: `ledger-${signature.slice(0, 8)}`,
    contentHash,
    signature,
    explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`,
    confirmedAt: new Date().toISOString(),
    status: "confirmed",
  };
}
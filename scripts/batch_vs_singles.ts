import "dotenv/config";
import { artifacts } from "hardhat";
import { createWalletClient, createPublicClient, http, parseUnits, getAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const { RPC_URL, CHAIN_ID, PRIVATE_KEY, TOKEN_ADDRESS, AIRDROP_RECIPIENTS, AIRDROP_AMOUNTS } = process.env;
const DECIMALS = 18;

function pctSaved(batch: bigint, singles: bigint) {
  if (singles === 0n) return "0%";
  const saved = (singles - batch) * 10000n / singles;
  return `${Number(saved) / 100}%`;
}

async function main() {
  if (!RPC_URL || !CHAIN_ID || !PRIVATE_KEY || !TOKEN_ADDRESS) throw new Error("Missing envs");

  const chainId = Number(CHAIN_ID);
  const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
  const chain = { id: chainId, name: `local-${chainId}`, nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }, rpcUrls: { default: { http: [RPC_URL] } } } as const;

  const wallet = createWalletClient({ account, chain, transport: http(RPC_URL) });
  const pub    = createPublicClient({ chain, transport: http(RPC_URL) });

  const { abi } = await artifacts.readArtifact("ProdToken");
  const token = getAddress(TOKEN_ADDRESS);

  const rec = (AIRDROP_RECIPIENTS ?? "").split(",").map(s => s.trim()).filter(Boolean).map(getAddress);
  const amtHuman = (AIRDROP_AMOUNTS ?? "").split(",").map(s => s.trim()).filter(Boolean);
  if (rec.length === 0 || rec.length !== amtHuman.length) {
    throw new Error("Provide AIRDROP_RECIPIENTS & AIRDROP_AMOUNTS (comma-separated, same length)");
  }
  const amounts = amtHuman.map(a => parseUnits(a, DECIMALS));

  const txB = await wallet.writeContract({
    address: token, abi, functionName: "airdrop",
    args: [rec, amounts],
    maxPriorityFeePerGas: 2_000_000_000n,
    maxFeePerGas:        20_000_000_000n,
  });
  const rB = await pub.waitForTransactionReceipt({ hash: txB });
  const gasBatch = rB.gasUsed ?? 0n;
  console.log("Batch airdrop:", txB, "| gasUsed:", gasBatch.toString());

  let gasSingles = 0n;
  for (let i = 0; i < rec.length; i++) {
    const tx = await wallet.writeContract({
      address: token, abi, functionName: "transfer",
      args: [rec[i], amounts[i]],
      maxPriorityFeePerGas: 2_000_000_000n,
      maxFeePerGas:        20_000_000_000n,
    });
    const r = await pub.waitForTransactionReceipt({ hash: tx });
    gasSingles += r.gasUsed ?? 0n;
  }
  console.log("Singles total gasUsed:", gasSingles.toString());
  console.log(`Summary | batch: ${gasBatch} | singles: ${gasSingles} | % saved: ${pctSaved(gasBatch, gasSingles)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

import "dotenv/config";
import { artifacts } from "hardhat";
import { createPublicClient, http, decodeEventLog } from "viem";

const { RPC_URL, CHAIN_ID, TOKEN_ADDRESS } = process.env;

async function main() {
  if (!RPC_URL || !CHAIN_ID || !TOKEN_ADDRESS) throw new Error("Missing RPC/CHAIN/TOKEN_ADDRESS");
  const chainId = Number(CHAIN_ID);

  const chain = { id: chainId, name: `local-${chainId}`, nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }, rpcUrls: { default: { http: [RPC_URL] } } } as const;
  const pc = createPublicClient({ chain, transport: http(RPC_URL) });
  const { abi } = await artifacts.readArtifact("ProdToken");

  const latest = await pc.getBlockNumber();
  const from = latest > 2000n ? latest - 2000n : 0n;

  const logs = await pc.getLogs({ address: TOKEN_ADDRESS as `0x${string}`, fromBlock: from, toBlock: latest });

  for (const log of logs) {
    try {
      const parsed = decodeEventLog({ abi, data: log.data, topics: log.topics });
      if (parsed.eventName === "Transfer") {
        const { from: f, to, value } = parsed.args as any;
        console.log(`Transfer  | block ${log.blockNumber} | from ${f} -> ${to} | value ${value}`);
      } else if (parsed.eventName === "Approval") {
        const { owner, spender, value } = parsed.args as any;
        console.log(`Approval  | block ${log.blockNumber} | owner ${owner} -> spender ${spender} | value ${value}`);
      }
    } catch { /* ignore */ }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

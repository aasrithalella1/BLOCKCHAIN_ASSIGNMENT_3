import "dotenv/config";
import { artifacts } from "hardhat";
import {
  createWalletClient, createPublicClient, http,
  parseUnits, formatUnits, getAddress
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { writeFileSync } from "fs";

const { RPC_URL, CHAIN_ID, PRIVATE_KEY, TOKEN_ADDRESS, ACCT2 } = process.env;
const DECIMALS = 18;

async function main() {
  if (!RPC_URL || !CHAIN_ID || !PRIVATE_KEY) throw new Error("Missing RPC/CHAIN/PK");
  if (!TOKEN_ADDRESS) throw new Error("Set TOKEN_ADDRESS in .env");

  const chainId = Number(CHAIN_ID);
  const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
  const chain = { id: chainId, name: `local-${chainId}`, nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }, rpcUrls: { default: { http: [RPC_URL] } } } as const;

  const wallet = createWalletClient({ account, chain, transport: http(RPC_URL) });
  const pub    = createPublicClient({ chain, transport: http(RPC_URL) });

  const { abi } = await artifacts.readArtifact("ProdToken");
  const token = getAddress(TOKEN_ADDRESS);
  const other = ACCT2 ? getAddress(ACCT2) : account.address;

  const bal = async (label: string) => {
    const b1 = await pub.readContract({ address: token, abi, functionName: "balanceOf", args: [account.address] }) as bigint;
    const b2 = await pub.readContract({ address: token, abi, functionName: "balanceOf", args: [other] }) as bigint;
    console.log(`${label} | Deployer: ${formatUnits(b1, DECIMALS)} CAMP | Other: ${formatUnits(b2, DECIMALS)} CAMP`);
  };

  await bal("Before");

  // Tx1 — transfer (lower tip)
  const tx1 = await wallet.writeContract({
    address: token, abi, functionName: "transfer",
    args: [other, parseUnits("25", DECIMALS)],
    maxPriorityFeePerGas: 1_000_000_000n,
    maxFeePerGas:        20_000_000_000n,
  });
  const r1 = await pub.waitForTransactionReceipt({ hash: tx1 });
  console.log("Transfer#1:", tx1, "| block:", r1.blockNumber?.toString(), "| gasUsed:", r1.gasUsed?.toString(), "| effGasPrice:", r1.effectiveGasPrice?.toString());

  // Tx2 — transfer (higher tip)
  const tx2 = await wallet.writeContract({
    address: token, abi, functionName: "transfer",
    args: [other, parseUnits("10", DECIMALS)],
    maxPriorityFeePerGas: 3_000_000_000n,
    maxFeePerGas:        22_000_000_000n,
  });
  const r2 = await pub.waitForTransactionReceipt({ hash: tx2 });
  console.log("Transfer#2:", tx2, "| block:", r2.blockNumber?.toString(), "| gasUsed:", r2.gasUsed?.toString(), "| effGasPrice:", r2.effectiveGasPrice?.toString());

  // Tx3 — approve
  const tx3 = await wallet.writeContract({
    address: token, abi, functionName: "approve",
    args: [other, parseUnits("15", DECIMALS)],
    maxPriorityFeePerGas: 2_000_000_000n,
    maxFeePerGas:        21_000_000_000n,
  });
  const r3 = await pub.waitForTransactionReceipt({ hash: tx3 });
  console.log("Approve:", tx3, "| block:", r3.blockNumber?.toString(), "| gasUsed:", r3.gasUsed?.toString(), "| effGasPrice:", r3.effectiveGasPrice?.toString());

  await bal("After");

  writeFileSync("txhashes.json", JSON.stringify({ tx1, tx2, tx3 }, null, 2));
  console.log("HASHES saved to txhashes.json");
}

main().catch((e) => { console.error(e); process.exit(1); });

import "dotenv/config";
import { artifacts } from "hardhat";
import { createWalletClient, createPublicClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const {
  RPC_URL, CHAIN_ID, PRIVATE_KEY,
  TOKEN_NAME, TOKEN_SYMBOL, TOKEN_CAP, TOKEN_INITIAL
} = process.env;

async function main() {
  if (!RPC_URL || !CHAIN_ID || !PRIVATE_KEY) throw new Error("Missing RPC_URL/CHAIN_ID/PRIVATE_KEY");
  if (!TOKEN_NAME || !TOKEN_SYMBOL || !TOKEN_CAP || !TOKEN_INITIAL) throw new Error("Missing TOKEN_* envs");

  const chainId = Number(CHAIN_ID);
  const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

  const chain = {
    id: chainId,
    name: `local-${chainId}`,
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } },
  } as const;

  const wallet = createWalletClient({ account, chain, transport: http(RPC_URL) });
  const pub    = createPublicClient({ chain, transport: http(RPC_URL) });

  const { abi, bytecode } = await artifacts.readArtifact("ProdToken");

  const capWei     = parseUnits(String(TOKEN_CAP), 18);
  const initialWei = parseUnits(String(TOKEN_INITIAL), 18);

  const hash = await wallet.deployContract({
    abi, bytecode,
    args: [TOKEN_NAME, TOKEN_SYMBOL, capWei, account.address, initialWei],
    maxPriorityFeePerGas: 2_000_000_000n,
    maxFeePerGas:        20_000_000_000n,
  });
  console.log("Deploy tx:", hash);

  const rcpt = await pub.waitForTransactionReceipt({ hash });
  if (rcpt.status !== "success") throw new Error("Deploy failed");
  console.log("Deployed at:", rcpt.contractAddress);
  console.log("Block:", rcpt.blockNumber);
  console.log("Deployer:", account.address);
}

main().catch((e) => { console.error(e); process.exit(1); });


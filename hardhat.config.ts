// hardhat.config.ts (v3)
import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const CHAIN_ID = Number(process.env.CHAIN_ID || "31337");

export default {
  solidity: {
    version: "0.8.24", // or 0.8.28 if your contracts require it
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    localhost: {
      url: RPC_URL,
      chainId: CHAIN_ID,
      type: "http",              // v3 feature
    },
    hardhat: {
      type: "edr-simulated",     // v3 feature
      initialBaseFeePerGas: 1_000_000_000,
    },
  },
};


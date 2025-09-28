**Assignment 3 — Production-Style ERC-20 (Team 06)

Objective

The goal of this assignment was to design, deploy, and test a production-ready ERC-20 token (CampusCredit – symbol: CAMP) on the DIDLab private blockchain using Hardhat v3 (ESM) and Viem scripts. The token needed to support:

Cap enforcement (max supply limit)
Burnable tokens
Pausable transfers

Role-based access (DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE)

Batch airdrop with error check**


What I Did

Project Setup

Created project folder, installed Hardhat v3, Viem, OpenZeppelin v5, dotenv.
Initialized Hardhat in ESM mode.
Configured hardhat.config.js with Team 06 RPC (https://hh-06.didlab.org, Chain ID 31342).

Contract Development
Wrote CampusCredit.sol extending OpenZeppelin ERC-20 with cap, burn, pause, and roles.
Added custom airdrop function with error handling.

Compiled successfully.


Deployment

Wrote deploy.js with Viem.
Deployed contract to DIDLab chain.
Captured tx hash, deployed address, and block number.
Saved deployed address into .env.


Interaction Scripts
transferApprove.js → executed transfer and approve. Verified balances before/after and allowance.

batchVsSingles.js → compared gas for batch airdrop vs N single transfers. Saw batch saved gas.
logsEvents.js → pulled Transfer and Approval logs from last ~2000 blocks. 

MetaMask Proof
Added DIDLab network (RPC + Chain ID 31342). 
Imported account with faucet key and token with deployed address. 
Sent one CAMP transfer and verified on MetaMask. 


Packaging

Collected all console outputs into text files (out-deploy.txt, etc.).
Added README and .env.example.
Collected screenshots


Conclusion

I successfully completed Assignment 3 by creating and deploying the CampusCredit ERC-20 token with all required features. I verified its behavior through Hardhat + Viem scripts and MetaMask proof, documented outputs in text files + screenshots, and packaged everything into the final repo.

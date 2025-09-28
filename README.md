# Assignment 3 — Team 06  
**CampusCredit (CAMP) ERC-20 Token**

## Network Details
- **RPC URL**: https://hh-06.didlab.org  
- **Chain ID**: 31342  
- **Token Address**

---

## Setup
```bash
# install dependencies
npm install

# compile the contract
npm run compile

# deploy contract (prints tx hash, address, block number)
node scripts/deploy.js

# test transfer + approve (prints before/after balances & allowance)
node scripts/transferApprove.js

# compare gas for batch airdrop vs N singles
node scripts/batchVsSingles.js

# fetch Transfer & Approval logs (last ~2000 blocks)
node scripts/logsEvents.js

Features

Cap enforced (ERC20Capped + airdrop precheck).

Burnable and Pausable (OZ v5).

Role-based control:

DEFAULT_ADMIN_ROLE

MINTER_ROLE

PAUSER_ROLE

Custom errors for airdrop (AirdropLengthMismatch, AirdropCapExceeded).

Evidence to Submit

Console outputs:

out-deploy.txt

out-transfer-approve.txt

out-batch-vs-singles.txt

out-logs.txt

Screenshots 

Node version, project tree, config, compile, deploy, balances, gas, logs, MetaMask network/token/tx.

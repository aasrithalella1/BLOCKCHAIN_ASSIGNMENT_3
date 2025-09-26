# Assignment 3 – Production-Style ERC-20 Token (Hardhat v3 + Viem)

This project implements a production-style ERC-20 token using Hardhat v3 and Viem. The token is **capped**, **burnable**, **pausable**, and supports **batch airdrops** and **role-based access control**.

---

## 📦 Prerequisites
- Node.js v18+ and npm  
- Hardhat v3.x (installed as a dev dependency)  
- Local Hardhat node running on `http://127.0.0.1:9545`

---

## ⚙️ Environment Setup
Create a `.env` file in the project root (never commit private keys):

# Local Hardhat node  
RPC_URL=http://127.0.0.1:9545  
CHAIN_ID=31337  
PRIVATE_KEY=0x<deployer-private-key>  

# Token config  
TOKEN_NAME=CampusCredit  
TOKEN_SYMBOL=CAMP  
TOKEN_CAP=2000000  
TOKEN_INITIAL=1000000  

# Paste deployed address after running deploy  
TOKEN_ADDRESS=0x<deployed-contract-address>  

# Extra accounts for scripts  
ACCT2=0x<second-hardhat-account>  

# Airdrop config  
AIRDROP_RECIPIENTS=0x<acct1>,0x<acct2>  
AIRDROP_AMOUNTS=10,20  

---

## 🛠 Installation & Compilation
Run:  
npm install  
npm run compile  

---

## 🚀 Running a Local Node
Start a local Hardhat node on port 9545 and leave it running:  
npx hardhat node --port 9545  

---

## 📤 Deployment
Deploy the token contract:  
npm run deploy  

Example output:  
Deploy tx: 0x...  
Deployed at: 0x5fbdb2315678afecb367f032d93f642f64180aa3  
Block: 1  
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266  

Copy the deployed address into TOKEN_ADDRESS in `.env`.

---

## 🧪 Interaction & Testing
### 1️⃣ Transfers & Approvals  
Run the transfer and approve script:  
npm run xfer  

Outputs:  
- Balances before/after  
- Two transfer transactions  
- One approval transaction  
- `txhashes.json` written for proof  

### 2️⃣ Batch vs. Singles Gas Comparison  
Run the airdrop script to compare gas usage:  
npm run airdrop  

Outputs:  
- Gas for individual mints  
- Gas for single batch airdrop  
- Percentage gas savings  

### 3️⃣ Event Logs  
Collect Transfer and Approval events:  
npm run logs  

Displays:  
- `from`, `to`, `value` for transfers  
- `owner`, `spender`, `value` for approvals  

### 4️⃣ (Optional) Pause/Unpause  
If implemented, test pause/unpause:  
npx hardhat run scripts/pause.ts --network localhost  
# Try a transfer (should fail)  
npx hardhat run scripts/unpause.ts --network localhost  
# Try transfer again (should succeed)  

---


## 📊 Sample Results Table

| Action              | Tx Hash / Block | Gas Used | Notes |
|--------------------|----------------|---------|-------|
| Deploy             | 0x...          | —       | Contract address: 0x... |
| Transfer #1        | 0x...          | 53,924  | Sent 20 CAMP to ACCT2 |
| Transfer #2        | 0x...          | 36,812  | Sent 15 CAMP to ACCT3 |
| Approve            | 0x...          | 46,397  | Approved spender 100 CAMP |
| Singles Total (3x) | —              | 1xx,xxx | Gas for 3 individual mints |
| Batch Airdrop      | 0x...          | xx,xxx  | Saved ~YY% gas |

---


---

## ✅ Features Implemented
- Capped supply (ERC20Capped)  
- Burnable tokens (ERC20Burnable)  
- Pausable transfers (ERC20Pausable)  
- Role-based access control (MINTER_ROLE, PAUSER_ROLE)  
- Batch airdrop function with gas savings  
- Verified event emission (Transfer + Approval)  

---

## 🏁 Conclusion
This project demonstrates a full production-style ERC-20 token workflow:  
- Deployment to a local network  
- Interaction via scripted transactions  
- Gas optimization measurement  
- Role-based control and pausability  

This README serves as documentation and a reproducible guide for anyone running the project.

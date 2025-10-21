# ⚠️ OUTDATED - See ENV_SETUP.md Instead

**NEW APPROACH**: We now use a single `.env` file at the root.

👉 **See `ENV_SETUP.md` or `ENV_QUICK_START.md` for current instructions.**

---

# Environment Variables - Quick Summary (OLD)

## What You Need

### 2 Wallets
1. **Deployer Wallet** - Deploys the contract (needs ~0.01 ETH)
2. **Agent Wallet** - Runs the Pet Sitter Agent (needs ~0.1 ETH)

### 3 Configuration Files
1. `packages/contracts/.env` - Contract deployment config
2. `packages/agent/.env` - Agent configuration
3. `packages/frontend/.env` - Frontend configuration

---

## Files Already Created ✅

All `.env` files have been created with detailed comments:
- ✅ `packages/contracts/.env`
- ✅ `packages/agent/.env`
- ✅ `packages/frontend/.env`
- ✅ `e2e-config.json`

**You just need to fill in the values!**

---

## What to Fill In

### 1. packages/contracts/.env

```bash
MONAD_RPC_URL=https://testnet.monad.xyz  # ✅ Already set
PRIVATE_KEY=0x...                         # ⚠️ ADD YOUR DEPLOYER KEY
CONTRACT_ADDRESS=                         # ⏳ Filled after deployment
```

### 2. packages/agent/.env

```bash
MONAD_RPC_URL=https://testnet.monad.xyz  # ✅ Already set
CONTRACT_ADDRESS=0x...                    # ⏳ From deployment
AGENT_PRIVATE_KEY=0x...                   # ⚠️ ADD YOUR AGENT KEY
ENVIO_ENDPOINT=https://...                # ⏳ From Envio deployment
POLL_INTERVAL_MS=60000                    # ✅ Already set
MIN_HUNGER_THRESHOLD=90                   # ✅ Already set
MAX_RETRIES=3                             # ✅ Already set
MAX_CONCURRENT_FEEDS=5                    # ✅ Already set
LOG_LEVEL=info                            # ✅ Already set
HEALTH_CHECK_PORT=3000                    # ✅ Already set
```

### 3. packages/frontend/.env

```bash
VITE_CONTRACT_ADDRESS=0x...               # ⏳ From deployment
VITE_MONAD_RPC_URL=https://testnet.monad.xyz  # ✅ Already set
VITE_CHAIN_ID=41454                       # ✅ Already set
VITE_ENVIO_ENDPOINT=https://...           # ⏳ From Envio deployment
VITE_AGENT_ADDRESS=0x...                  # ⚠️ ADD AGENT ADDRESS
```

---

## Step-by-Step

### Step 1: Get Private Keys (5 min)

1. Create/use two MetaMask wallets
2. Export private keys from MetaMask
3. Paste into `.env` files

**Deployer Key** → `packages/contracts/.env`
**Agent Key** → `packages/agent/.env`

### Step 2: Get Testnet ETH (5 min)

1. Visit Monad testnet faucet
2. Request ETH for both wallet addresses
3. Wait for confirmation

### Step 3: Deploy Contract (2 min)

```bash
cd packages/contracts
npm run deploy:monad
npm run update-configs  # Auto-fills contract address everywhere!
```

### Step 4: Deploy Envio (3 min)

```bash
cd ../../envio
envio deploy
# Copy the GraphQL endpoint URL
```

### Step 5: Update Remaining Values (2 min)

**In `packages/agent/.env`:**
- Paste Envio endpoint

**In `packages/frontend/.env`:**
- Paste Envio endpoint
- Add agent wallet address (not private key!)

### Step 6: Done! ✅

All environment variables are now configured!

---

## How to Get Each Value

| Variable | How to Get It |
|----------|---------------|
| **PRIVATE_KEY** | MetaMask → Account → Export Private Key |
| **AGENT_PRIVATE_KEY** | MetaMask → Account → Export Private Key |
| **CONTRACT_ADDRESS** | From deployment output or `deployments/monad-testnet.json` |
| **ENVIO_ENDPOINT** | From `envio deploy` output |
| **AGENT_ADDRESS** | The address of the agent wallet (visible in MetaMask) |

---

## Verification Commands

### Check if values are set correctly:

```bash
# Check contracts config
cat packages/contracts/.env | grep -v "^#" | grep -v "^$"

# Check agent config
cat packages/agent/.env | grep -v "^#" | grep -v "^$"

# Check frontend config
cat packages/frontend/.env | grep -v "^#" | grep -v "^$"
```

### Test connections:

```bash
# Test contract
cd packages/contracts
npx hardhat console --network monad

# Test Envio
curl -X POST <ENVIO_ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{"query": "{ pets { id } }"}'

# Test agent
cd packages/agent
npm run build
npm start
```

---

## Common Mistakes

❌ **Using the same wallet for deployer and agent**
✅ Use two separate wallets

❌ **Forgetting to add 0x prefix to private keys**
✅ Private keys must start with `0x`

❌ **Using agent private key in frontend**
✅ Frontend needs agent ADDRESS, not private key

❌ **Not getting testnet ETH**
✅ Both wallets need testnet ETH

❌ **Committing .env files to git**
✅ .env files are already in .gitignore

---

## Need More Help?

📖 **Detailed Guide**: `ENV_SETUP_GUIDE.md`
✅ **Checklist**: `ENV_CHECKLIST.md`
🚀 **Deployment**: `DEPLOYMENT_GUIDE.md`
⚡ **Quick Deploy**: `QUICK_DEPLOY.md`

---

## Security Reminders

🔒 **Never share private keys**
🔒 **Never commit .env files**
🔒 **Use test wallets only**
🔒 **Keep private keys secure**

---

**Ready to start? Open the .env files and fill in your values!** 🎉

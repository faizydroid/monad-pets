# .env Quick Start

## One File, All Configuration ✨

Everything is in `.env` at the root of the project.

---

## Step 1: Fill in Your Keys (2 min)

Open `.env` and add:

```bash
# Your deployer wallet private key (from MetaMask)
PRIVATE_KEY=0xYOUR_KEY_HERE

# Your agent wallet private key (from MetaMask)
AGENT_PRIVATE_KEY=0xYOUR_KEY_HERE

# Your agent wallet address (public address, not private key!)
AGENT_ADDRESS=0xYOUR_ADDRESS_HERE
```

---

## Step 2: Get Testnet ETH (5 min)

Visit Monad faucet and get ETH for:
- Deployer wallet address
- Agent wallet address

---

## Step 3: Deploy Contract (1 min)

```bash
npm run contracts:deploy:monad
npm run contracts:update-configs
```

✅ This auto-fills `CONTRACT_ADDRESS` in `.env`

---

## Step 4: Deploy Envio (2 min)

```bash
cd envio
envio deploy
```

Copy the GraphQL endpoint URL.

---

## Step 5: Update .env (30 sec)

Open `.env` and paste the Envio endpoint:

```bash
ENVIO_ENDPOINT=https://indexer.envio.dev/YOUR_ID/graphql
```

---

## Done! 🎉

Now deploy:

```bash
# Agent
cd packages/agent
docker-compose up -d

# Frontend
cd ../frontend
npm run build
npm run deploy:vercel
```

---

## What You Need

| What | Where to Get It | Where It Goes |
|------|----------------|---------------|
| Deployer Private Key | MetaMask → Export Key | `PRIVATE_KEY` |
| Agent Private Key | MetaMask → Export Key | `AGENT_PRIVATE_KEY` |
| Agent Address | MetaMask (public address) | `AGENT_ADDRESS` |
| Contract Address | Auto-filled after deploy | `CONTRACT_ADDRESS` |
| Envio Endpoint | `envio deploy` output | `ENVIO_ENDPOINT` |

---

## Verify It's Working

```bash
# Check .env has values
cat .env | grep -v "^#" | grep "="

# Test contract
cd packages/contracts && npm run compile

# Test agent
cd packages/agent && npm run build

# Test frontend
cd packages/frontend && npm run build
```

---

**Need help?** See `ENV_SETUP.md` for detailed instructions.

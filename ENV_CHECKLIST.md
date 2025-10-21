# ⚠️ OUTDATED - See ENV_SETUP.md Instead

**NEW APPROACH**: We now use a single `.env` file at the root.

👉 **See `ENV_SETUP.md` or `ENV_QUICK_START.md` for current instructions.**

---

# Environment Setup Checklist (OLD)

Quick checklist for setting up all environment variables.

## Preparation

- [ ] Node.js 18+ installed
- [ ] Git repository cloned
- [ ] All dependencies installed (`npm install`)

## Wallet Setup

- [ ] Created deployer wallet in MetaMask
- [ ] Created agent wallet in MetaMask
- [ ] Exported deployer private key
- [ ] Exported agent private key
- [ ] Got testnet ETH for deployer wallet (0.01-0.05 ETH)
- [ ] Got testnet ETH for agent wallet (0.1-0.5 ETH)
- [ ] Recorded agent wallet address

## Smart Contract Configuration

- [ ] Created `packages/contracts/.env`
- [ ] Set `MONAD_RPC_URL`
- [ ] Set `PRIVATE_KEY` (deployer)
- [ ] Verified deployer has testnet ETH

## Smart Contract Deployment

- [ ] Compiled contracts (`npm run contracts:compile`)
- [ ] Deployed contract (`npm run contracts:deploy:monad`)
- [ ] Recorded contract address
- [ ] Recorded deployment block
- [ ] Ran `npm run contracts:update-configs`

## Envio Indexer Configuration

- [ ] Verified `envio/config.yaml` has contract address
- [ ] Verified `envio/config.yaml` has deployment block
- [ ] Installed Envio CLI (`npm install -g envio`)

## Envio Indexer Deployment

- [ ] Validated config (`cd envio && npm run validate`)
- [ ] Generated types (`envio codegen`)
- [ ] Deployed indexer (`envio deploy`)
- [ ] Recorded GraphQL endpoint URL
- [ ] Tested endpoint with curl

## Agent Configuration

- [ ] Created `packages/agent/.env`
- [ ] Set `MONAD_RPC_URL`
- [ ] Set `CONTRACT_ADDRESS` (from deployment)
- [ ] Set `AGENT_PRIVATE_KEY`
- [ ] Set `ENVIO_ENDPOINT` (from Envio deployment)
- [ ] Set `POLL_INTERVAL_MS` (default: 60000)
- [ ] Set `MIN_HUNGER_THRESHOLD` (default: 90)
- [ ] Set `MAX_RETRIES` (default: 3)
- [ ] Set `MAX_CONCURRENT_FEEDS` (default: 5)
- [ ] Set `LOG_LEVEL` (default: info)
- [ ] Set `HEALTH_CHECK_PORT` (default: 3000)
- [ ] Verified agent has testnet ETH

## Frontend Configuration

- [ ] Created `packages/frontend/.env`
- [ ] Set `VITE_CONTRACT_ADDRESS` (from deployment)
- [ ] Set `VITE_MONAD_RPC_URL`
- [ ] Set `VITE_CHAIN_ID` (41454)
- [ ] Set `VITE_ENVIO_ENDPOINT` (from Envio deployment)
- [ ] Set `VITE_AGENT_ADDRESS` (agent wallet address)

## E2E Test Configuration (Optional)

- [ ] Created `e2e-config.json`
- [ ] Set `contractAddress`
- [ ] Set `envioEndpoint`
- [ ] Set `agentAddress`
- [ ] Set `frontendUrl` (after frontend deployment)
- [ ] Set `monadRpcUrl`
- [ ] Set `chainId`

## Verification

- [ ] Contract address matches in all configs
- [ ] Envio endpoint matches in agent and frontend
- [ ] Agent address matches in frontend
- [ ] All private keys are 66 characters (0x + 64 hex)
- [ ] All addresses are 42 characters (0x + 40 hex)
- [ ] No placeholder values remain (0x000...)

## Testing

- [ ] Tested contract connection
- [ ] Tested Envio endpoint
- [ ] Built agent successfully
- [ ] Built frontend successfully
- [ ] Validated frontend build

## Security Check

- [ ] `.env` files are in `.gitignore`
- [ ] No private keys committed to git
- [ ] Using test wallets only
- [ ] Private keys stored securely

## Ready to Deploy!

Once all items are checked, you're ready to deploy:

```bash
# Deploy agent
cd packages/agent
npm run build
docker-compose up -d

# Deploy frontend
cd ../frontend
npm run build
npm run deploy:vercel

# Run E2E tests
cd ../..
npm run e2e
```

---

## Quick Values Reference

Record your values here for easy reference:

**Deployer Wallet:**
- Address: `_________________________________`
- Private Key: `_________________________________` (keep secure!)

**Agent Wallet:**
- Address: `_________________________________`
- Private Key: `_________________________________` (keep secure!)

**Deployed Contract:**
- Address: `_________________________________`
- Deployment Block: `_________________________________`

**Envio Indexer:**
- GraphQL Endpoint: `_________________________________`
- Deployment ID: `_________________________________`

**Frontend:**
- Deployment URL: `_________________________________`

---

## Need Help?

- See `ENV_SETUP_GUIDE.md` for detailed instructions
- See `DEPLOYMENT_GUIDE.md` for deployment steps
- See `QUICK_DEPLOY.md` for quick reference

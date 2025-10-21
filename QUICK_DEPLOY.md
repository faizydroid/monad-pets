# Monadgotchi Quick Deploy Reference

One-page reference for deploying Monadgotchi.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Git repository cloned
- [ ] Monad testnet RPC URL
- [ ] Test wallet with testnet ETH
- [ ] Envio account created
- [ ] Vercel/Netlify account (for frontend)

## 5-Step Deployment

### 1️⃣ Deploy Smart Contract (5 min)

```bash
cd packages/contracts
cp .env.example .env
# Edit .env: Add PRIVATE_KEY and MONAD_RPC_URL
npm run deploy:monad
npm run update-configs
```

**Output**: Contract address saved to `deployments/monad-testnet.json`

---

### 2️⃣ Deploy Envio Indexer (5 min)

```bash
cd ../../envio
npm install -g envio  # If not installed
npm run validate
envio codegen
envio deploy
```

**Output**: GraphQL endpoint URL

**Update**: Add endpoint to `packages/agent/.env` and `packages/frontend/.env`

---

### 3️⃣ Deploy Pet Sitter Agent (5 min)

```bash
cd ../packages/agent
cp .env.example .env
# Edit .env: Add AGENT_PRIVATE_KEY, CONTRACT_ADDRESS, ENVIO_ENDPOINT
npm run build
docker-compose up -d
```

**Verify**: `curl http://localhost:3000/health`

---

### 4️⃣ Deploy Frontend (5 min)

```bash
cd ../frontend
cp .env.example .env
# Edit .env: Add all addresses and endpoints
npm run build
npm run validate
vercel --prod  # Or: npm run deploy:vercel
```

**Output**: Frontend URL

---

### 5️⃣ Run E2E Tests (5 min)

```bash
cd ../..
cp e2e-config.example.json e2e-config.json
# Edit e2e-config.json with your deployment values
npm run e2e
```

**Expected**: All tests pass ✅

---

## Environment Variables Quick Reference

### packages/contracts/.env
```bash
MONAD_RPC_URL=https://testnet.monad.xyz
PRIVATE_KEY=0x...
```

### packages/agent/.env
```bash
MONAD_RPC_URL=https://testnet.monad.xyz
CONTRACT_ADDRESS=0x...
AGENT_PRIVATE_KEY=0x...
ENVIO_ENDPOINT=https://indexer.envio.dev/.../graphql
POLL_INTERVAL_MS=60000
MIN_HUNGER_THRESHOLD=90
```

### packages/frontend/.env
```bash
VITE_CONTRACT_ADDRESS=0x...
VITE_MONAD_RPC_URL=https://testnet.monad.xyz
VITE_CHAIN_ID=41454
VITE_ENVIO_ENDPOINT=https://indexer.envio.dev/.../graphql
VITE_AGENT_ADDRESS=0x...
```

---

## Quick Verification Commands

### Contract
```bash
# Check contract exists
cast code <CONTRACT_ADDRESS> --rpc-url https://testnet.monad.xyz
```

### Envio
```bash
# Test GraphQL endpoint
curl -X POST <ENVIO_ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{"query": "{ pets { id } }"}'
```

### Agent
```bash
# Health check
curl http://localhost:3000/health

# Status
curl http://localhost:3000/status

# Logs
docker logs -f monadgotchi-agent
```

### Frontend
```bash
# Test locally
npm run preview

# Check deployed site
curl -I <FRONTEND_URL>
```

---

## Common Issues & Quick Fixes

### Contract deployment fails
```bash
# Check balance
cast balance <YOUR_ADDRESS> --rpc-url https://testnet.monad.xyz

# Get testnet ETH from faucet
```

### Envio not syncing
```bash
# Check config
npm run validate

# View logs
envio logs
```

### Agent not feeding
```bash
# Check logs
docker logs monadgotchi-agent

# Check balance
cast balance <AGENT_ADDRESS> --rpc-url https://testnet.monad.xyz

# Restart agent
docker-compose restart
```

### Frontend not loading
```bash
# Check build
npm run validate

# Check env vars
cat .env

# Rebuild
npm run build
```

---

## Deployment Checklist

- [ ] 1. Contract deployed ✅
- [ ] 2. Envio deployed ✅
- [ ] 3. Agent deployed ✅
- [ ] 4. Frontend deployed ✅
- [ ] 5. E2E tests pass ✅
- [ ] 6. Monitoring configured
- [ ] 7. Documentation reviewed

---

## Key Addresses to Record

| Component | Address/URL | Notes |
|-----------|-------------|-------|
| Contract | `0x...` | From deployment |
| Agent | `0x...` | Agent wallet |
| Envio | `https://...` | GraphQL endpoint |
| Frontend | `https://...` | Deployment URL |

---

## Support Resources

- **Full Guide**: `DEPLOYMENT_GUIDE.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **E2E Tests**: `E2E_TESTING.md`
- **Component Guides**: See `*/DEPLOYMENT.md` in each package

---

## Estimated Total Time

- **Preparation**: 10 minutes
- **Deployment**: 25 minutes
- **Testing**: 10 minutes
- **Total**: ~45 minutes

---

## Success Indicators

✅ Contract is deployed and verified
✅ Envio is syncing and returning data
✅ Agent is running and polling
✅ Frontend loads without errors
✅ Can connect wallet
✅ Can mint pet
✅ Can feed pet
✅ Delegation works
✅ Agent feeds automatically

---

**Ready to deploy? Start with Step 1! 🚀**

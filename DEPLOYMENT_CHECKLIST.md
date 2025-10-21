# Monadgotchi Deployment Checklist

Use this checklist to ensure all components are properly deployed and configured.

## Pre-Deployment

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] Git repository cloned
- [ ] All dependencies installed (`npm install` in all packages)
- [ ] Monad testnet RPC URL obtained
- [ ] Test wallets created with testnet ETH

### Configuration Files
- [ ] `.env` files created in all packages (contracts, agent, frontend)
- [ ] Private keys securely stored (never committed to git)
- [ ] RPC URLs configured
- [ ] All placeholder values replaced

## Phase 1: Smart Contract Deployment

### Build and Test
- [ ] Contracts compiled successfully (`npm run compile`)
- [ ] All contract tests pass (`npm test`)
- [ ] No compilation warnings or errors

### Deployment
- [ ] Contract deployed to Monad testnet
- [ ] Deployment transaction confirmed
- [ ] Contract address recorded
- [ ] Deployment block number recorded
- [ ] Contract verified on block explorer (if available)

### Verification
- [ ] Contract is accessible at deployed address
- [ ] Can read contract state (nextTokenId, constants)
- [ ] Contract events are being emitted
- [ ] Deployment info saved to `deployments/monad-testnet.json`

**Deployment Command:**
```bash
cd packages/contracts
npm run deploy:monad
```

**Record Values:**
- Contract Address: `_________________`
- Deployment Block: `_________________`
- Deployer Address: `_________________`

---

## Phase 2: Envio Indexer Deployment

### Configuration
- [ ] `config.yaml` updated with contract address
- [ ] Start block set to deployment block
- [ ] Event definitions match contract events
- [ ] RPC endpoint configured

### Deployment
- [ ] Envio CLI installed (`npm install -g envio`)
- [ ] Types generated (`envio codegen`)
- [ ] Indexer deployed (`envio deploy`)
- [ ] GraphQL endpoint URL obtained
- [ ] Indexer is syncing blocks

### Verification
- [ ] GraphQL endpoint is accessible
- [ ] Can query pets (even if empty)
- [ ] Schema matches expected structure
- [ ] Event handlers are processing events
- [ ] Indexer status shows "syncing" or "synced"

**Deployment Commands:**
```bash
cd envio
npm run validate
envio codegen
envio deploy
```

**Record Values:**
- GraphQL Endpoint: `_________________`
- Deployment ID: `_________________`

---

## Phase 3: Pet Sitter Agent Deployment

### Build and Test
- [ ] Agent code compiled (`npm run build`)
- [ ] All agent tests pass (`npm test`)
- [ ] Configuration validated

### Configuration
- [ ] Agent wallet created with testnet ETH
- [ ] Private key securely stored
- [ ] Contract address configured
- [ ] Envio endpoint configured
- [ ] Polling interval set (default: 60000ms)
- [ ] Hunger threshold set (default: 90)

### Deployment
- [ ] Deployment method chosen (Docker/PM2/Systemd/Cloud)
- [ ] Agent deployed to infrastructure
- [ ] Agent is running and polling
- [ ] Health check endpoint accessible
- [ ] Logs are being generated

### Verification
- [ ] Agent can connect to Monad RPC
- [ ] Agent can query Envio indexer
- [ ] Agent can read contract state
- [ ] Health endpoint returns 200 OK
- [ ] Status endpoint shows correct info
- [ ] Agent logs show polling activity

**Deployment Commands:**
```bash
cd packages/agent
npm run build

# Docker
docker-compose up -d

# Or PM2
pm2 start ecosystem.config.js
```

**Record Values:**
- Agent Address: `_________________`
- Deployment URL: `_________________`
- Health Check URL: `_________________`

---

## Phase 4: Frontend Deployment

### Build and Test
- [ ] Frontend builds successfully (`npm run build`)
- [ ] All frontend tests pass (`npm test`)
- [ ] Build validated (`npm run validate`)

### Configuration
- [ ] Contract address configured
- [ ] Envio endpoint configured
- [ ] Agent address configured
- [ ] Chain ID set to 41454
- [ ] RPC URL configured

### Deployment
- [ ] Deployment platform chosen (Vercel/Netlify/IPFS)
- [ ] Environment variables set on platform
- [ ] Frontend deployed
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled

### Verification
- [ ] Frontend is accessible at deployment URL
- [ ] All assets load correctly
- [ ] No console errors
- [ ] Wallet connection works
- [ ] Contract interactions work
- [ ] Envio queries return data

**Deployment Commands:**
```bash
cd packages/frontend
npm run build
npm run validate

# Vercel
npm run deploy:vercel

# Or Netlify
npm run deploy:netlify
```

**Record Values:**
- Frontend URL: `_________________`
- Deployment Platform: `_________________`

---

## Phase 5: Integration Testing

### Component Integration
- [ ] Contract → Envio: Events are indexed
- [ ] Envio → Frontend: Queries return data
- [ ] Envio → Agent: Agent can query hungry pets
- [ ] Agent → Contract: Agent can feed pets
- [ ] Frontend → Contract: Users can mint and feed

### End-to-End Flows
- [ ] User can connect wallet
- [ ] User can mint pet
- [ ] Pet appears in UI with correct data
- [ ] User can manually feed pet
- [ ] Hunger increases over time
- [ ] User can grant delegation
- [ ] Agent automatically feeds hungry pets
- [ ] User can revoke delegation
- [ ] Transaction history displays correctly

### Automated Tests
- [ ] Run automated E2E tests (`npm run e2e`)
- [ ] All automated tests pass
- [ ] No critical errors in logs

**Testing Commands:**
```bash
# Create config
cp e2e-config.example.json e2e-config.json
# Edit e2e-config.json with your values

# Run tests
npm run e2e
```

---

## Phase 6: Monitoring Setup

### Agent Monitoring
- [ ] Health check endpoint monitored (UptimeRobot, Pingdom)
- [ ] Log aggregation configured (CloudWatch, Datadog)
- [ ] Alerts set up for:
  - [ ] Agent downtime
  - [ ] Failed transactions
  - [ ] Low ETH balance
  - [ ] High error rate

### Frontend Monitoring
- [ ] Analytics configured (Google Analytics, Plausible)
- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured

### Contract Monitoring
- [ ] Block explorer bookmarked
- [ ] Event monitoring set up
- [ ] Gas usage tracked

---

## Phase 7: Documentation

### User Documentation
- [ ] README updated with deployment URLs
- [ ] User guide created
- [ ] FAQ documented
- [ ] Troubleshooting guide available

### Developer Documentation
- [ ] Deployment guides reviewed
- [ ] API documentation complete
- [ ] Architecture diagrams updated
- [ ] Code comments reviewed

### Operational Documentation
- [ ] Runbooks created for common issues
- [ ] Incident response procedures documented
- [ ] Backup and recovery procedures documented
- [ ] Maintenance procedures documented

---

## Phase 8: Security Review

### Smart Contract Security
- [ ] Access controls verified
- [ ] No obvious vulnerabilities
- [ ] Events properly emitted
- [ ] Gas optimization reviewed

### Agent Security
- [ ] Private key securely stored
- [ ] No keys in code or logs
- [ ] Rate limiting configured
- [ ] Gas spending limits set

### Frontend Security
- [ ] No sensitive data exposed
- [ ] HTTPS enforced
- [ ] Content Security Policy configured
- [ ] Dependencies audited (`npm audit`)

---

## Phase 9: Performance Optimization

### Contract Performance
- [ ] Gas costs optimized
- [ ] No unnecessary storage operations
- [ ] Efficient data structures used

### Indexer Performance
- [ ] Start block set correctly (not 0)
- [ ] Queries optimized
- [ ] Pagination implemented

### Agent Performance
- [ ] Polling interval optimized
- [ ] Concurrent feeding configured
- [ ] Retry logic tuned

### Frontend Performance
- [ ] Build size optimized
- [ ] Images compressed
- [ ] Code splitting enabled
- [ ] Caching configured

---

## Phase 10: Launch Preparation

### Pre-Launch Checklist
- [ ] All components deployed and verified
- [ ] All tests passing
- [ ] Monitoring configured
- [ ] Documentation complete
- [ ] Team trained on operations

### Launch Day
- [ ] Final smoke test completed
- [ ] Monitoring dashboards open
- [ ] Team on standby
- [ ] Communication channels ready
- [ ] Rollback plan prepared

### Post-Launch
- [ ] Monitor for first 24 hours
- [ ] Gather user feedback
- [ ] Address any issues quickly
- [ ] Document lessons learned

---

## Deployment Summary

### Deployed Components

| Component | Status | URL/Address | Notes |
|-----------|--------|-------------|-------|
| Smart Contract | ⬜ | | |
| Envio Indexer | ⬜ | | |
| Pet Sitter Agent | ⬜ | | |
| Frontend dApp | ⬜ | | |

### Key Addresses

- **Contract Address**: `_________________`
- **Agent Address**: `_________________`
- **Deployer Address**: `_________________`

### Key URLs

- **Frontend**: `_________________`
- **Envio GraphQL**: `_________________`
- **Agent Health Check**: `_________________`
- **Block Explorer**: `_________________`

### Configuration Values

- **Chain ID**: 41454 (Monad Testnet)
- **Start Block**: `_________________`
- **Polling Interval**: 60000ms
- **Hunger Threshold**: 90

---

## Troubleshooting

### Common Issues

**Contract not found**
- Verify contract address is correct
- Check deployment transaction was confirmed
- Ensure correct network (Monad testnet)

**Envio not syncing**
- Check start block is correct
- Verify contract address in config
- Check RPC endpoint is accessible

**Agent not feeding**
- Verify agent has ETH for gas
- Check delegation is granted
- Review agent logs for errors
- Verify Envio endpoint is accessible

**Frontend not loading**
- Check all environment variables are set
- Verify build completed successfully
- Check browser console for errors
- Verify deployment platform is working

---

## Sign-Off

### Deployment Team

- [ ] Smart Contract Developer: _________________ Date: _______
- [ ] Backend Developer: _________________ Date: _______
- [ ] Frontend Developer: _________________ Date: _______
- [ ] DevOps Engineer: _________________ Date: _______
- [ ] QA Engineer: _________________ Date: _______
- [ ] Project Manager: _________________ Date: _______

### Approval

- [ ] Technical Lead: _________________ Date: _______
- [ ] Product Owner: _________________ Date: _______

---

## Notes

Use this section to record any deployment-specific notes, issues encountered, or deviations from the standard process:

```
[Add notes here]
```

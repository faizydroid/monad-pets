# Monadgotchi Deployment Guide

Complete guide for deploying all components of the Monadgotchi virtual pet game.

## Overview

Monadgotchi consists of four main components that need to be deployed in sequence:

1. **Smart Contract** - Solidity contract on Monad testnet
2. **Envio Indexer** - Event indexing service with GraphQL API
3. **Pet Sitter Agent** - Automated feeding service
4. **Frontend dApp** - React web application

## Quick Start

For experienced developers who want to deploy quickly:

```bash
# 1. Deploy smart contract
cd packages/contracts
npm run deploy:monad
npm run update-configs

# 2. Deploy Envio indexer
cd ../../envio
npm run validate
envio codegen
envio deploy

# 3. Deploy Pet Sitter Agent
cd ../packages/agent
npm run build
docker-compose up -d

# 4. Deploy frontend
cd ../frontend
npm run build
npm run deploy:vercel

# 5. Run E2E tests
cd ../..
npm run e2e
```

## Detailed Deployment Steps

### Prerequisites

- Node.js 18+
- Git
- Monad testnet RPC access
- Test wallets with testnet ETH
- Accounts on deployment platforms (Vercel, Envio, etc.)

### Step 1: Smart Contract Deployment

Deploy the Monadgotchi contract to Monad testnet.

**Documentation**: `packages/contracts/DEPLOYMENT.md`

**Commands**:
```bash
cd packages/contracts
cp .env.example .env
# Edit .env with your private key and RPC URL
npm run deploy:monad
```

**Outputs**:
- Contract address
- Deployment block number
- Saved to `deployments/monad-testnet.json`

**Verification**:
- Contract is accessible on-chain
- Can read contract state
- Events are being emitted

**Next**: Update all configuration files with contract address:
```bash
npm run update-configs
```

---

### Step 2: Envio Indexer Deployment

Deploy the event indexer to track pet hunger levels.

**Documentation**: `envio/DEPLOYMENT.md`

**Commands**:
```bash
cd envio
npm run validate  # Verify configuration
envio codegen     # Generate types
envio deploy      # Deploy to Envio Cloud
```

**Outputs**:
- GraphQL endpoint URL
- Deployment ID

**Verification**:
- GraphQL endpoint is accessible
- Can query pets (even if empty)
- Indexer is syncing blocks

**Next**: Update agent and frontend with Envio endpoint URL

---

### Step 3: Pet Sitter Agent Deployment

Deploy the automated feeding service.

**Documentation**: `packages/agent/DEPLOYMENT.md`

**Deployment Options**:
- Docker (recommended)
- PM2
- Systemd
- AWS Lambda

**Docker Deployment**:
```bash
cd packages/agent
cp .env.example .env
# Edit .env with configuration
npm run build
docker-compose up -d
```

**Verification**:
```bash
# Check health
curl http://localhost:3000/health

# Check status
curl http://localhost:3000/status

# View logs
docker logs -f monadgotchi-agent
```

**Next**: Record agent wallet address for frontend configuration

---

### Step 4: Frontend Deployment

Deploy the web application.

**Documentation**: `packages/frontend/DEPLOYMENT.md`

**Deployment Options**:
- Vercel (recommended)
- Netlify
- IPFS
- AWS S3 + CloudFront

**Vercel Deployment**:
```bash
cd packages/frontend
cp .env.example .env
# Edit .env with all addresses and endpoints
npm run build
npm run validate
vercel --prod
```

**Verification**:
- Frontend loads without errors
- Wallet connection works
- Contract interactions work
- Envio queries return data

---

### Step 5: End-to-End Testing

Verify all components work together.

**Documentation**: `E2E_TESTING.md`

**Automated Tests**:
```bash
# Create config
cp e2e-config.example.json e2e-config.json
# Edit with your deployment values

# Run tests
npm run e2e
```

**Manual Tests**:
Follow the test scenarios in `E2E_TESTING.md`:
1. Wallet connection
2. Mint pet
3. Manual feeding
4. Hunger increase
5. Delegation setup
6. Automated feeding
7. Delegation revocation
8. Pet fainting
9. Transaction history
10. Real-time updates
11. Multiple pets
12. Error handling

---

## Configuration Summary

After deployment, you should have the following values:

### Smart Contract
- **Address**: `0x...`
- **Deployment Block**: `12345`
- **Network**: Monad Testnet (Chain ID: 41454)

### Envio Indexer
- **GraphQL Endpoint**: `https://indexer.envio.dev/.../graphql`
- **Deployment ID**: `...`

### Pet Sitter Agent
- **Agent Address**: `0x...`
- **Health Check URL**: `http://your-server:3000/health`
- **Deployment**: Docker/PM2/Cloud

### Frontend
- **URL**: `https://your-app.vercel.app`
- **Platform**: Vercel/Netlify/IPFS

---

## Deployment Checklist

Use `DEPLOYMENT_CHECKLIST.md` to track your deployment progress:

- [ ] Smart contract deployed
- [ ] Envio indexer deployed
- [ ] Pet Sitter Agent deployed
- [ ] Frontend deployed
- [ ] All configurations updated
- [ ] E2E tests passing
- [ ] Monitoring configured
- [ ] Documentation complete

---

## Monitoring

### Agent Monitoring
- Health check: `http://your-server:3000/health`
- Status endpoint: `http://your-server:3000/status`
- Logs: Docker logs or PM2 logs

### Frontend Monitoring
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Analytics (Google Analytics, Plausible)

### Contract Monitoring
- Block explorer: Monad testnet explorer
- Event monitoring
- Gas usage tracking

---

## Troubleshooting

### Common Issues

**Contract deployment fails**
- Check wallet has sufficient ETH
- Verify RPC URL is correct
- Check network connectivity

**Envio not syncing**
- Verify contract address is correct
- Check start block is set to deployment block
- Ensure RPC endpoint is accessible

**Agent not feeding pets**
- Check agent has ETH for gas
- Verify delegation is granted
- Review agent logs for errors
- Check Envio endpoint is accessible

**Frontend not loading**
- Verify all environment variables are set
- Check build completed successfully
- Review browser console for errors

---

## Security Considerations

### Private Keys
- Never commit private keys to version control
- Use environment variables or secrets managers
- Rotate keys periodically

### Access Control
- Restrict SSH access to servers
- Use firewall rules
- Enable 2FA on cloud accounts

### Monitoring
- Set up alerts for unusual activity
- Monitor transaction patterns
- Review logs regularly

### Gas Management
- Set daily spending limits
- Monitor gas prices
- Pause during high-fee periods

---

## Maintenance

### Regular Tasks
- Check agent ETH balance weekly
- Review logs for errors
- Update dependencies monthly
- Monitor gas costs

### Updates
- Test updates in staging environment
- Deploy during low-traffic periods
- Have rollback plan ready
- Monitor closely after updates

---

## Support

### Documentation
- Smart Contract: `packages/contracts/DEPLOYMENT.md`
- Envio Indexer: `envio/DEPLOYMENT.md`
- Pet Sitter Agent: `packages/agent/DEPLOYMENT.md`
- Frontend: `packages/frontend/DEPLOYMENT.md`
- E2E Testing: `E2E_TESTING.md`
- Deployment Checklist: `DEPLOYMENT_CHECKLIST.md`

### Resources
- Monad Documentation: https://docs.monad.xyz
- Envio Documentation: https://docs.envio.dev
- Hardhat Documentation: https://hardhat.org/docs
- Vite Documentation: https://vitejs.dev

---

## Next Steps

After successful deployment:

1. ✅ Complete all E2E tests
2. ✅ Set up monitoring and alerts
3. ✅ Document any deployment-specific notes
4. ✅ Train team on operations
5. ✅ Prepare user documentation
6. ✅ Plan for user onboarding
7. ✅ Consider mainnet deployment (if applicable)

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Frontend dApp (Vercel/Netlify)             │    │
│  │  - React + TypeScript                              │    │
│  │  - Wallet connection (wagmi)                       │    │
│  │  - Contract interactions                           │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ GraphQL Queries
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Envio Indexer (Cloud)                     │
│  - Indexes blockchain events                                │
│  - Provides GraphQL API                                     │
│  - Real-time pet hunger data                                │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Subscribes to Events
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Monad Testnet (Blockchain)                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │      Monadgotchi Smart Contract                    │    │
│  │  - ERC721 NFT                                      │    │
│  │  - Hunger mechanics                                │    │
│  │  - Delegation system                               │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │ Feed Transactions
                           │
┌─────────────────────────────────────────────────────────────┐
│         Pet Sitter Agent (Docker/PM2/Cloud)                  │
│  - Polls Envio for hungry pets                              │
│  - Feeds pets using delegation                              │
│  - Retry logic and error handling                           │
│  - Health monitoring                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Success Criteria

Deployment is successful when:

- ✅ All components are deployed and accessible
- ✅ Users can connect wallet and mint pets
- ✅ Hunger increases automatically over time
- ✅ Users can manually feed their pets
- ✅ Users can grant delegation to the agent
- ✅ Agent automatically feeds hungry pets
- ✅ Users can revoke delegation
- ✅ All E2E tests pass
- ✅ Monitoring is configured
- ✅ No critical errors in logs

Congratulations on deploying Monadgotchi! 🎉

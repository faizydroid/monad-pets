# Monad Pets

A virtual pet game (inspired by Tamagotchi) deployed on the Monad testnet. Players must automate their pet's care using MetaMask Smart Accounts and delegation, or their pet will "faint" from hunger.

## Project Structure

This is a monorepo containing three main packages:

```
monadgotchi/
├── packages/
│   ├── contracts/       # Smart contracts (Hardhat + TypeScript)
│   ├── agent/          # Pet Sitter Agent (Node.js)
│   ├── frontend/       # React dApp (Vite + React + TypeScript)
│   └── types/          # Shared TypeScript types
├── package.json        # Root package with workspace configuration
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- MetaMask wallet with Smart Account support
- Monad testnet access

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces.

### 2. Build Shared Types

```bash
cd packages/types
npm run build
```

### 3. Set Up Environment Variables

**Simple!** Just one `.env` file at the root for everything.

See **`ENV_SETUP.md`** for complete instructions.

**Quick setup:**
1. Open `.env` at the root
2. Add your deployer private key
3. Add your agent private key and address
4. Get testnet ETH for both wallets
5. Deploy contract (auto-fills contract address)
6. Deploy Envio (copy endpoint to `.env`)
7. Done!

## Development

### Smart Contracts

```bash
# Compile contracts
npm run contracts:compile

# Run tests
npm run contracts:test

# Deploy to Monad testnet
npm run contracts:deploy
```

### Pet Sitter Agent

```bash
# Development mode with hot reload
npm run agent:dev

# Production mode
npm run agent:start
```

### Frontend dApp

```bash
# Development server
npm run frontend:dev

# Build for production
npm run frontend:build
```

## Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Architecture

### Smart Contract Layer

- Solidity contracts on Monad testnet
- ERC721 NFT for pets
- Hunger mechanics based on block time
- Delegation support via MSA

### Indexing Layer

- Envio indexer for real-time event tracking
- GraphQL API for querying pet data
- Efficient hungry pet detection

### Application Layer

- React frontend for user interaction
- Node.js agent for automated feeding
- Delegation-based automation

## Features

- **Mint Virtual Pets**: Create your own Monadgotchi NFT
- **Hunger Mechanics**: Pets get hungry over time (1 hunger per 10 minutes)
- **Manual Feeding**: Feed your pet to reset hunger to 0
- **Automated Care**: Delegate feeding to the Pet Sitter Agent
- **Real-time Updates**: Monitor pet status via Envio indexer

## Deployment

For complete deployment instructions, see:

- **Quick Start**: `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- **Checklist**: `DEPLOYMENT_CHECKLIST.md` - Track deployment progress
- **E2E Testing**: `E2E_TESTING.md` - End-to-end testing guide

### Component-Specific Guides

- **Smart Contract**: `packages/contracts/DEPLOYMENT.md`
- **Envio Indexer**: `envio/DEPLOYMENT.md`
- **Pet Sitter Agent**: `packages/agent/DEPLOYMENT.md`
- **Frontend dApp**: `packages/frontend/DEPLOYMENT.md`

### Quick Deployment

```bash
# 1. Deploy smart contract
npm run contracts:deploy:monad
npm run contracts:update-configs

# 2. Deploy Envio indexer
cd envio && envio deploy

# 3. Deploy Pet Sitter Agent
cd packages/agent && docker-compose up -d

# 4. Deploy frontend
cd packages/frontend && npm run deploy:vercel

# 5. Run E2E tests
npm run e2e
```

## Testing

### Unit Tests

```bash
# Test all packages
npm run contracts:test
npm run agent:test
npm run frontend:test
```

### End-to-End Tests

```bash
# Create config
cp e2e-config.example.json e2e-config.json
# Edit with your deployment values

# Run automated E2E tests
npm run e2e
```

## Documentation

- `SETUP.md` - Initial setup instructions
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Deployment tracking checklist
- `E2E_TESTING.md` - End-to-end testing guide
- Component READMEs in each package directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

For issues and questions:
- Check the documentation in each package
- Review the deployment guides
- Check the troubleshooting sections

## License

MIT

# Monadgotchi Contract Deployment Guide

## Prerequisites

1. Node.js and npm installed
2. Monad testnet RPC URL
3. Private key with testnet tokens for gas fees
4. Environment variables configured

## Setup

1. Create a `.env` file in `packages/contracts/`:

```bash
MONAD_RPC_URL=https://testnet.monad.xyz
PRIVATE_KEY=your_private_key_here
```

⚠️ **Never commit your `.env` file or private key to version control!**

## Deployment Steps

### 1. Install Dependencies

```bash
cd packages/contracts
npm install
```

### 2. Compile Contracts

```bash
npx hardhat compile
```

### 3. Run Tests (Optional but Recommended)

```bash
npx hardhat test
```

### 4. Deploy to Monad Testnet

```bash
npx hardhat run scripts/deploy.ts --network monad
```

The deployment script will:
- Deploy the Monadgotchi contract
- Display the contract address and deployment block
- Save deployment info to `deployments/monad-testnet.json`

### 5. Verify Contract (Optional)

```bash
npx hardhat run scripts/verify.ts --network monad
```

Note: Verification may not be available on all testnets. Check Monad documentation for block explorer support.

## Post-Deployment Configuration

After successful deployment, update the following files with the contract address and deployment block:

### 1. Envio Indexer Configuration

Update `envio/config.yaml`:

```yaml
networks:
  - id: 41454
    start_block: <DEPLOYMENT_BLOCK>
    contracts:
      - name: Monadgotchi
        address:
          - "<CONTRACT_ADDRESS>"
```

### 2. Agent Configuration

Update `packages/agent/.env`:

```bash
CONTRACT_ADDRESS=<CONTRACT_ADDRESS>
```

### 3. Frontend Configuration

Update `packages/frontend/.env`:

```bash
VITE_CONTRACT_ADDRESS=<CONTRACT_ADDRESS>
```

## Deployment Info

The deployment script saves information to `deployments/monad-testnet.json`:

```json
{
  "contractAddress": "0x...",
  "deploymentBlock": 12345,
  "network": "monad",
  "chainId": 41454,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### Insufficient Funds

If you get an "insufficient funds" error:
- Ensure your wallet has enough testnet tokens
- Get testnet tokens from the Monad faucet

### Network Connection Issues

If deployment fails with network errors:
- Verify the RPC URL is correct
- Check your internet connection
- Try again after a few minutes

### Contract Already Deployed

If you need to redeploy:
- The script will deploy a new instance each time
- Update all configuration files with the new address

## Next Steps

After deployment:
1. ✅ Configure Envio indexer (Task 6.2)
2. ✅ Deploy Pet Sitter Agent (Task 6.3)
3. ✅ Build and deploy frontend (Task 6.4)
4. ✅ Run end-to-end tests (Task 6.5)

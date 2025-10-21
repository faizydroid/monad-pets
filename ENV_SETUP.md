# Environment Setup - Single .env File

All configuration is now in **one file**: `.env` at the root of the project.

## Quick Setup (5 minutes)

### 1. Open the .env file

The file is already created at the root: `.env`

### 2. Fill in these 3 values:

```bash
# Your deployer wallet private key
PRIVATE_KEY=0xYOUR_DEPLOYER_PRIVATE_KEY_HERE

# Your agent wallet private key  
AGENT_PRIVATE_KEY=0xYOUR_AGENT_PRIVATE_KEY_HERE

# Your agent wallet address (NOT private key!)
AGENT_ADDRESS=0xYOUR_AGENT_WALLET_ADDRESS_HERE
```

### 3. Get testnet ETH

- Visit Monad testnet faucet
- Get ETH for both wallet addresses
- Deployer needs ~0.01 ETH
- Agent needs ~0.1 ETH

### 4. Deploy and auto-configure

```bash
# Deploy contract (auto-fills CONTRACT_ADDRESS in .env)
npm run contracts:deploy:monad
npm run contracts:update-configs

# Deploy Envio indexer
cd envio
envio deploy
# Copy the GraphQL endpoint URL

# Update .env with Envio endpoint
# Edit .env and paste the endpoint into ENVIO_ENDPOINT=...
```

### 5. Done! ✅

All packages now use the same `.env` file automatically.

---

## How to Get Values

### Private Keys (from MetaMask)

1. Click account menu → Account details
2. Export Private Key
3. Enter password
4. Copy the key (starts with `0x`)

### Agent Address

The agent address is the **public address** of the agent wallet (visible in MetaMask when you select that account).

**OR** use this command:
```bash
cast wallet address --private-key YOUR_AGENT_PRIVATE_KEY
```

---

## What Gets Auto-Filled

After deployment, these are automatically filled:

- ✅ `CONTRACT_ADDRESS` - From contract deployment
- ✅ `DEPLOYMENT_BLOCK` - From contract deployment

You just need to manually add:

- ⚠️ `ENVIO_ENDPOINT` - From Envio deployment

---

## Verification

Check your .env file has these filled:

```bash
# Should be filled by you
PRIVATE_KEY=0x... (64 hex chars)
AGENT_PRIVATE_KEY=0x... (64 hex chars)
AGENT_ADDRESS=0x... (40 hex chars)

# Auto-filled after contract deployment
CONTRACT_ADDRESS=0x... (40 hex chars)
DEPLOYMENT_BLOCK=12345

# Fill after Envio deployment
ENVIO_ENDPOINT=https://indexer.envio.dev/.../graphql
```

---

## Test It Works

### Test contract deployment:
```bash
cd packages/contracts
npm run compile
npm run deploy:monad
```

### Test agent:
```bash
cd packages/agent
npm run build
npm start
```

### Test frontend:
```bash
cd packages/frontend
npm run build
```

---

## Common Issues

**"Missing required environment variables"**
- Make sure `.env` is at the root of the project
- Check all required values are filled in

**"Invalid private key format"**
- Private keys must start with `0x`
- Must be exactly 66 characters (0x + 64 hex)

**"Contract not found"**
- Deploy the contract first
- Run `npm run contracts:update-configs`

---

## Security

- ✅ `.env` is in `.gitignore` (never committed)
- ✅ Use test wallets only
- ✅ Keep private keys secure
- ✅ Never share your `.env` file

---

**That's it! One file, simple setup.** 🎉

# ⚠️ OUTDATED - See ENV_SETUP.md Instead

This guide described the old multi-file approach. 

**NEW APPROACH**: We now use a single `.env` file at the root.

👉 **See `ENV_SETUP.md` or `ENV_QUICK_START.md` for current instructions.**

---

# Environment Variables Setup Guide (OLD)

Complete guide for setting up all environment variables for Monadgotchi deployment.

## Overview

The Monadgotchi project requires environment variables in three locations:
1. **packages/contracts/.env** - For smart contract deployment
2. **packages/agent/.env** - For the Pet Sitter Agent
3. **packages/frontend/.env** - For the frontend dApp

## Quick Setup Checklist

- [ ] Create wallet for contract deployment
- [ ] Create wallet for Pet Sitter Agent
- [ ] Get testnet ETH for both wallets
- [ ] Configure contracts/.env
- [ ] Deploy contract
- [ ] Deploy Envio indexer
- [ ] Configure agent/.env
- [ ] Configure frontend/.env
- [ ] Verify all configurations

---

## Step-by-Step Setup

### Step 1: Create Wallets

You need **two separate wallets**:

#### Wallet 1: Contract Deployer
- Used to deploy the smart contract
- Needs testnet ETH for deployment gas (~0.01 ETH)
- Can be your personal test wallet

#### Wallet 2: Pet Sitter Agent
- Used by the agent to feed pets
- Needs testnet ETH for ongoing gas fees (~0.1 ETH recommended)
- Should be a dedicated wallet (not your personal wallet)

**Creating Wallets in MetaMask:**

1. Open MetaMask
2. Click your account icon → "Create Account"
3. Name it (e.g., "Monadgotchi Deployer" or "Pet Sitter Agent")
4. Repeat for the second wallet

**Getting Private Keys:**

1. Click the three dots menu on the account
2. Account details → Export Private Key
3. Enter your MetaMask password
4. Copy the private key (starts with `0x`)
5. **IMPORTANT**: Keep these private keys secure!

---

### Step 2: Get Testnet ETH

Both wallets need testnet ETH from the Monad faucet.

**For Monad Testnet:**

1. Visit the Monad testnet faucet (check Monad documentation for URL)
2. Enter your wallet address
3. Request testnet ETH
4. Wait for confirmation
5. Repeat for both wallets

**Recommended Amounts:**
- Deployer wallet: 0.01-0.05 ETH (one-time deployment)
- Agent wallet: 0.1-0.5 ETH (ongoing operations)

**Verify Balance:**
```bash
# Check deployer balance
cast balance <DEPLOYER_ADDRESS> --rpc-url https://testnet.monad.xyz

# Check agent balance
cast balance <AGENT_ADDRESS> --rpc-url https://testnet.monad.xyz
```

---

### Step 3: Configure packages/contracts/.env

The `.env` file has already been created at `packages/contracts/.env`.

**Edit the file and update:**

```bash
# 1. RPC URL (usually no change needed)
MONAD_RPC_URL=https://testnet.monad.xyz

# 2. Your deployer wallet's private key
PRIVATE_KEY=0xYOUR_DEPLOYER_PRIVATE_KEY_HERE

# 3. Leave CONTRACT_ADDRESS empty (filled after deployment)
CONTRACT_ADDRESS=
```

**Example:**
```bash
MONAD_RPC_URL=https://testnet.monad.xyz
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CONTRACT_ADDRESS=
```

---

### Step 4: Deploy Smart Contract

Now deploy the contract:

```bash
cd packages/contracts
npm install
npm run compile
npm run deploy:monad
```

**Expected Output:**
```
✅ Monadgotchi deployed successfully!
Contract address: 0x1234567890abcdef1234567890abcdef12345678
Deployment block: 12345
```

**Important**: Save these values:
- Contract Address: `0x...`
- Deployment Block: `12345`

**Update All Configs Automatically:**
```bash
npm run update-configs
```

This will automatically update:
- `envio/config.yaml`
- `packages/agent/.env.example`
- `packages/frontend/.env.example`

---

### Step 5: Deploy Envio Indexer

**Update Envio Configuration:**

The `update-configs` script should have already updated `envio/config.yaml`. Verify it:

```bash
cd ../../envio
cat config.yaml
```

Look for:
```yaml
contracts:
  - name: Monadgotchi
    address:
      - "0xYOUR_CONTRACT_ADDRESS"  # Should be filled
start_block: 12345  # Should be your deployment block
```

**Deploy to Envio:**

```bash
# Install Envio CLI if not already installed
npm install -g envio

# Validate configuration
npm run validate

# Generate types
envio codegen

# Deploy
envio deploy
```

**Expected Output:**
```
✅ Deployment successful!
GraphQL Endpoint: https://indexer.envio.dev/abc123/graphql
```

**Save this endpoint URL** - you'll need it for agent and frontend!

---

### Step 6: Configure packages/agent/.env

The `.env` file has already been created at `packages/agent/.env`.

**Edit the file and update:**

```bash
# 1. RPC URL (usually no change needed)
MONAD_RPC_URL=https://testnet.monad.xyz

# 2. Contract address (from deployment)
CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS_FROM_STEP_4

# 3. Agent wallet's private key
AGENT_PRIVATE_KEY=0xYOUR_AGENT_PRIVATE_KEY_HERE

# 4. Envio endpoint (from Step 5)
ENVIO_ENDPOINT=https://indexer.envio.dev/abc123/graphql

# 5. Configuration (defaults are usually fine)
POLL_INTERVAL_MS=60000
MIN_HUNGER_THRESHOLD=90
MAX_RETRIES=3
MAX_CONCURRENT_FEEDS=5
LOG_LEVEL=info
HEALTH_CHECK_PORT=3000
```

**Example:**
```bash
MONAD_RPC_URL=https://testnet.monad.xyz
CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
AGENT_PRIVATE_KEY=0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e
ENVIO_ENDPOINT=https://indexer.envio.dev/abc123/graphql
POLL_INTERVAL_MS=60000
MIN_HUNGER_THRESHOLD=90
MAX_RETRIES=3
MAX_CONCURRENT_FEEDS=5
LOG_LEVEL=info
HEALTH_CHECK_PORT=3000
```

---

### Step 7: Get Agent Address

You need the **address** (not private key) of the agent wallet for the frontend.

**Method 1: Using Cast (if you have Foundry installed):**
```bash
cast wallet address --private-key <AGENT_PRIVATE_KEY>
```

**Method 2: Using MetaMask:**
1. Import the agent private key into MetaMask temporarily
2. Copy the address shown
3. Remove the account from MetaMask after (for security)

**Method 3: Using ethers.js:**
```bash
node -e "console.log(require('ethers').Wallet.fromPhrase('0xYOUR_AGENT_PRIVATE_KEY').address)"
```

**Save this address** - you'll need it for the frontend!

---

### Step 8: Configure packages/frontend/.env

The `.env` file has already been created at `packages/frontend/.env`.

**Edit the file and update:**

```bash
# 1. Contract address (from Step 4)
VITE_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS

# 2. RPC URL (usually no change needed)
VITE_MONAD_RPC_URL=https://testnet.monad.xyz

# 3. Chain ID (DO NOT CHANGE)
VITE_CHAIN_ID=41454

# 4. Envio endpoint (from Step 5)
VITE_ENVIO_ENDPOINT=https://indexer.envio.dev/abc123/graphql

# 5. Agent address (from Step 7)
VITE_AGENT_ADDRESS=0xYOUR_AGENT_ADDRESS
```

**Example:**
```bash
VITE_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
VITE_MONAD_RPC_URL=https://testnet.monad.xyz
VITE_CHAIN_ID=41454
VITE_ENVIO_ENDPOINT=https://indexer.envio.dev/abc123/graphql
VITE_AGENT_ADDRESS=0xabcdef1234567890abcdef1234567890abcdef12
```

---

### Step 9: Configure e2e-config.json (Optional)

For running E2E tests, update `e2e-config.json`:

```json
{
  "contractAddress": "0xYOUR_CONTRACT_ADDRESS",
  "envioEndpoint": "https://indexer.envio.dev/abc123/graphql",
  "agentAddress": "0xYOUR_AGENT_ADDRESS",
  "frontendUrl": "https://your-deployment.vercel.app",
  "monadRpcUrl": "https://testnet.monad.xyz",
  "chainId": 41454,
  "testWalletPrivateKey": "0xOPTIONAL_TEST_WALLET_KEY"
}
```

---

## Verification Checklist

### Verify Contracts Configuration

```bash
cd packages/contracts
cat .env
```

Check:
- [ ] `MONAD_RPC_URL` is set
- [ ] `PRIVATE_KEY` is set (64 hex characters after 0x)
- [ ] `CONTRACT_ADDRESS` is filled (after deployment)

### Verify Agent Configuration

```bash
cd packages/agent
cat .env
```

Check:
- [ ] `MONAD_RPC_URL` is set
- [ ] `CONTRACT_ADDRESS` matches deployed contract
- [ ] `AGENT_PRIVATE_KEY` is set (64 hex characters after 0x)
- [ ] `ENVIO_ENDPOINT` is set and accessible
- [ ] Configuration values are reasonable

### Verify Frontend Configuration

```bash
cd packages/frontend
cat .env
```

Check:
- [ ] `VITE_CONTRACT_ADDRESS` matches deployed contract
- [ ] `VITE_MONAD_RPC_URL` is set
- [ ] `VITE_CHAIN_ID` is 41454
- [ ] `VITE_ENVIO_ENDPOINT` is set and accessible
- [ ] `VITE_AGENT_ADDRESS` is set (40 hex characters after 0x)

---

## Testing Your Configuration

### Test Contract Connection

```bash
cd packages/contracts
npx hardhat console --network monad
```

In the console:
```javascript
const contract = await ethers.getContractAt("Monadgotchi", "YOUR_CONTRACT_ADDRESS");
const nextTokenId = await contract.nextTokenId();
console.log("Next Token ID:", nextTokenId.toString());
```

### Test Envio Endpoint

```bash
curl -X POST YOUR_ENVIO_ENDPOINT \
  -H "Content-Type: application/json" \
  -d '{"query": "{ pets { id } }"}'
```

Expected: JSON response with pets array (may be empty)

### Test Agent Configuration

```bash
cd packages/agent
npm run build
npm run start
```

Check logs for:
- ✅ "Initializing Pet Sitter Agent..."
- ✅ "Pet Sitter Agent started successfully"
- ❌ No connection errors

### Test Frontend Configuration

```bash
cd packages/frontend
npm run build
npm run validate
```

Expected: All validation checks pass

---

## Common Issues

### Issue: "Insufficient funds for gas"

**Solution**: Add more testnet ETH to your wallet
```bash
# Check balance
cast balance YOUR_ADDRESS --rpc-url https://testnet.monad.xyz

# Get more from faucet
```

### Issue: "Invalid private key"

**Solution**: Ensure private key:
- Starts with `0x`
- Has exactly 64 hexadecimal characters after `0x`
- No spaces or extra characters

### Issue: "Cannot connect to Envio endpoint"

**Solution**: 
- Verify endpoint URL is correct
- Check Envio deployment status: `envio status`
- Test endpoint with curl (see above)

### Issue: "Contract not found at address"

**Solution**:
- Verify contract address is correct
- Check deployment was successful
- Ensure you're on the correct network (Monad testnet)

---

## Security Best Practices

### DO:
- ✅ Use separate wallets for deployer and agent
- ✅ Keep private keys secure and never share them
- ✅ Add `.env` files to `.gitignore`
- ✅ Use test wallets, not your main wallet
- ✅ Regularly monitor gas spending
- ✅ Rotate keys periodically

### DON'T:
- ❌ Commit `.env` files to git
- ❌ Share private keys with anyone
- ❌ Use production wallets for testing
- ❌ Store private keys in plain text files
- ❌ Reuse the same private key across projects

---

## Environment Variables Summary

### packages/contracts/.env
```bash
MONAD_RPC_URL=https://testnet.monad.xyz
PRIVATE_KEY=0x...
CONTRACT_ADDRESS=  # Filled after deployment
```

### packages/agent/.env
```bash
MONAD_RPC_URL=https://testnet.monad.xyz
CONTRACT_ADDRESS=0x...
AGENT_PRIVATE_KEY=0x...
ENVIO_ENDPOINT=https://indexer.envio.dev/.../graphql
POLL_INTERVAL_MS=60000
MIN_HUNGER_THRESHOLD=90
MAX_RETRIES=3
MAX_CONCURRENT_FEEDS=5
LOG_LEVEL=info
HEALTH_CHECK_PORT=3000
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

## Next Steps

After setting up all environment variables:

1. ✅ Deploy the smart contract
2. ✅ Deploy the Envio indexer
3. ✅ Deploy the Pet Sitter Agent
4. ✅ Deploy the frontend
5. ✅ Run E2E tests

See `DEPLOYMENT_GUIDE.md` for complete deployment instructions.

---

## Quick Reference Card

| Variable | Location | Source | Example |
|----------|----------|--------|---------|
| PRIVATE_KEY | contracts/.env | MetaMask export | 0xac09... |
| CONTRACT_ADDRESS | All | Deployment output | 0x1234... |
| AGENT_PRIVATE_KEY | agent/.env | MetaMask export | 0xdf57... |
| AGENT_ADDRESS | frontend/.env | Derived from key | 0xabcd... |
| ENVIO_ENDPOINT | agent & frontend | Envio deploy | https://... |
| MONAD_RPC_URL | All | Monad docs | https://testnet... |

---

**Ready to deploy? Follow the steps above and you'll have everything configured! 🚀**

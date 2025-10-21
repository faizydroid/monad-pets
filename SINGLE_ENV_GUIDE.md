# Single .env File Setup ✨

## Why One File?

**Simpler!** Instead of managing 3 separate `.env` files, everything is in one place:

```
.env  ← All configuration here!
```

All packages (contracts, agent, frontend) automatically read from this single file.

---

## The .env File

Located at the root of the project: `.env`

### What You Need to Fill In

Only **3 values** to start:

```bash
PRIVATE_KEY=0x...              # Your deployer wallet private key
AGENT_PRIVATE_KEY=0x...        # Your agent wallet private key
AGENT_ADDRESS=0x...            # Your agent wallet address
```

### What Gets Auto-Filled

After deployment:

```bash
CONTRACT_ADDRESS=0x...         # Auto-filled by deployment script
DEPLOYMENT_BLOCK=12345         # Auto-filled by deployment script
```

### What You Add After Envio

After deploying Envio indexer:

```bash
ENVIO_ENDPOINT=https://...     # From envio deploy output
```

---

## How It Works

### Contracts Package
- Reads from `../../.env` (root)
- Uses `dotenv` in `hardhat.config.ts`

### Agent Package
- Reads from `../../../.env` (root)
- Uses `dotenv` in `config.ts`

### Frontend Package
- Reads from `../../.env` (root)
- Uses Vite's `loadEnv` in `vite.config.ts`
- Automatically maps variables to `VITE_` prefixed versions

---

## Variable Mapping

The frontend automatically maps these:

| Root Variable | Frontend Variable |
|--------------|-------------------|
| `CONTRACT_ADDRESS` | `VITE_CONTRACT_ADDRESS` |
| `MONAD_RPC_URL` | `VITE_MONAD_RPC_URL` |
| `CHAIN_ID` | `VITE_CHAIN_ID` |
| `ENVIO_ENDPOINT` | `VITE_ENVIO_ENDPOINT` |
| `AGENT_ADDRESS` | `VITE_AGENT_ADDRESS` |

You don't need to set both! Just set the root variable.

---

## Complete Setup Flow

### 1. Initial Setup
```bash
# Open .env and add:
PRIVATE_KEY=0xYOUR_DEPLOYER_KEY
AGENT_PRIVATE_KEY=0xYOUR_AGENT_KEY
AGENT_ADDRESS=0xYOUR_AGENT_ADDRESS
```

### 2. Deploy Contract
```bash
npm run contracts:deploy:monad
npm run contracts:update-configs
```

✅ `CONTRACT_ADDRESS` and `DEPLOYMENT_BLOCK` are now filled in `.env`

### 3. Deploy Envio
```bash
cd envio
envio deploy
```

Copy the GraphQL endpoint URL.

### 4. Update .env
```bash
# Add to .env:
ENVIO_ENDPOINT=https://indexer.envio.dev/YOUR_ID/graphql
```

### 5. Deploy Everything
```bash
# Agent
cd packages/agent
docker-compose up -d

# Frontend
cd ../frontend
npm run deploy:vercel
```

---

## Benefits

✅ **One file to manage** - No confusion about which .env to edit
✅ **No duplication** - Contract address only defined once
✅ **Auto-sync** - All packages always use the same values
✅ **Simpler** - Less room for configuration errors
✅ **Cleaner** - No need to copy values between files

---

## File Structure

```
monadgotchi/
├── .env                          ← Single source of truth
├── packages/
│   ├── contracts/
│   │   └── hardhat.config.ts    ← Reads from ../../.env
│   ├── agent/
│   │   └── src/config.ts        ← Reads from ../../../.env
│   └── frontend/
│       └── vite.config.ts       ← Reads from ../../.env
```

---

## Verification

Check your setup:

```bash
# View non-comment lines
cat .env | grep -v "^#" | grep "="

# Should see:
# MONAD_RPC_URL=https://testnet.monad.xyz
# PRIVATE_KEY=0x...
# AGENT_PRIVATE_KEY=0x...
# AGENT_ADDRESS=0x...
# CONTRACT_ADDRESS=0x...
# DEPLOYMENT_BLOCK=12345
# ENVIO_ENDPOINT=https://...
```

---

## Troubleshooting

### "Cannot find .env file"

Make sure `.env` is at the root of the project, not in a subdirectory.

```bash
# Should be here:
ls -la .env

# Not here:
ls -la packages/contracts/.env  # ❌
```

### "Environment variable not found"

Make sure you're running commands from the correct directory:

```bash
# For contracts:
cd packages/contracts
npm run deploy:monad

# For agent:
cd packages/agent
npm start

# For frontend:
cd packages/frontend
npm run build
```

### "Values not updating"

After changing `.env`:
- Restart the agent
- Rebuild the frontend: `npm run build`
- Recompile contracts if needed

---

## Security

The `.env` file is in `.gitignore` and will never be committed to git.

**Never:**
- ❌ Commit `.env` to git
- ❌ Share your `.env` file
- ❌ Put private keys in code

**Always:**
- ✅ Keep `.env` secure
- ✅ Use test wallets only
- ✅ Back up your `.env` safely

---

## Quick Reference

| Variable | Required | When | Example |
|----------|----------|------|---------|
| `PRIVATE_KEY` | ✅ | Before deploy | `0xac09...` |
| `AGENT_PRIVATE_KEY` | ✅ | Before deploy | `0xdf57...` |
| `AGENT_ADDRESS` | ✅ | Before deploy | `0xabcd...` |
| `CONTRACT_ADDRESS` | Auto | After deploy | `0x1234...` |
| `DEPLOYMENT_BLOCK` | Auto | After deploy | `12345` |
| `ENVIO_ENDPOINT` | ✅ | After Envio | `https://...` |

---

**That's it! One file, simple setup, everything works.** 🚀

See also:
- `ENV_SETUP.md` - Detailed setup instructions
- `ENV_QUICK_START.md` - Quick visual guide
- `DEPLOYMENT_GUIDE.md` - Full deployment process

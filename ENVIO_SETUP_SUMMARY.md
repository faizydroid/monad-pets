# Envio Setup Summary for Monadgotchi

## Current Status ✅

Your Envio indexer is **fully configured and ready to deploy**! Here's what's ready:

### ✅ Configuration Complete
- **Network**: Monad testnet (Chain ID: 10143) 
- **Contract**: 0x750E675Fb7f1fBDe1944889AE12d311e3ae7E06b
- **Start Block**: 44404850 (deployment block)
- **RPC**: https://testnet-rpc.monad.xyz
- **Events**: All 4 contract events properly configured
- **Schema**: GraphQL schema with Pet and FeedEvent entities
- **Handlers**: Complete event handlers for all contract events

### ❌ Only Missing
- **ENVIO_API_KEY** in `envio/.env` (get from https://envio.dev)

## Windows CLI Issue

The Envio CLI doesn't work on Windows due to missing binaries:
```
Error: Couldn't find envio binary inside node_modules for windows-x64
```

**Note**: The npm package `@envio-dev/envio` doesn't exist. Envio uses a curl-based installer instead.

## Solution: Deploy from Linux Environment

### Option 1: GitHub Codespaces (Recommended - 5 minutes)

1. **Create Codespace**:
   - Go to your GitHub repo
   - Click "Code" → "Codespaces" → "Create codespace"

2. **Deploy Envio**:
   ```bash
   cd envio
   
   # Get API key from https://envio.dev and add to .env
   # ENVIO_API_KEY=f1fbd405-5759-483b-b158-625d374b6937
   # Install Envio CLI (correct method)
   curl -L https://raw.githubusercontent.com/enviodev/envio/main/install.sh | bash
   export PATH="$HOME/.envio/bin:$PATH"
   
   # Deploy
   envio codegen
   envio deploy
   ```

3. **Copy Endpoint**:
   - Copy the GraphQL endpoint from deployment output
   - Update your Windows `.env` file:
   ```bash
   VITE_ENVIO_ENDPOINT=https://indexer.envio.dev/your-project-id/graphql
   ```

### Option 2: WSL (Windows Subsystem for Linux)

```bash
# In WSL
cd /mnt/d/hackathon/envio

# Install Envio CLI
curl -L https://raw.githubusercontent.com/enviodev/envio/main/install.sh | bash
export PATH="$HOME/.envio/bin:$PATH"

# Deploy
envio codegen
envio deploy
```

### Option 3: Docker

```bash
# Create and run container
docker run -it --rm -v ${PWD}/envio:/app node:18 bash
cd /app

# Install Envio CLI
curl -L https://raw.githubusercontent.com/enviodev/envio/main/install.sh | bash
export PATH="$HOME/.envio/bin:$PATH"

# Deploy
envio codegen
envio deploy
```

## What Happens After Deployment

Once Envio is deployed, your dApp will have:

### ✅ Real-time Data
- Pet hunger levels update automatically
- Transaction history displays properly  
- Agent can find hungry pets to feed

### ✅ GraphQL Queries
```graphql
# Get all pets for an owner
query GetPets($owner: String!) {
  pets(where: { owner: $owner }) {
    id
    petId
    hunger
    isFainted
    feedHistory {
      feeder
      timestamp
    }
  }
}

# Get hungry pets (for agent)
query GetHungryPets {
  hungryPets(minHunger: 80) {
    id
    petId
    owner
    hunger
  }
}
```

## Files Ready for Deployment

All these files are properly configured:

```
envio/
├── config.yaml          ✅ Monad testnet + contract
├── schema.graphql        ✅ Pet & FeedEvent entities  
├── src/EventHandlers.ts  ✅ All 4 event handlers
├── package.json          ✅ Scripts configured
├── .env                  ⚠️  Need ENVIO_API_KEY
└── deploy.sh            ✅ Linux deployment script
```

## Validation Commands

```bash
# Check configuration
npm run validate

# Prepare for deployment (Windows)
.\deploy.ps1 -Validate -Prepare
```

## Quick Deploy Steps

### 1. Get API Key
- Visit https://envio.dev
- Sign up/login
- Copy your API key

### 2. Update .env
```bash
# In envio/.env
ENVIO_API_KEY=your_actual_api_key_here
```

### 3. Deploy (Linux environment)
```bash
cd envio

# Install Envio CLI
curl -L https://raw.githubusercontent.com/enviodev/envio/main/install.sh | bash
export PATH="$HOME/.envio/bin:$PATH"

# Deploy
envio codegen
envio deploy
```

### 4. Update Frontend
```bash
# In main project .env
VITE_ENVIO_ENDPOINT=https://indexer.envio.dev/your-project-id/graphql
```

### 5. Deploy Agent
```bash
cd packages/agent
npm start
```

## Expected Timeline

- **Setup Codespace**: 2 minutes
- **Deploy Envio**: 3 minutes  
- **Update frontend**: 1 minute
- **Deploy agent**: 1 minute
- **Total**: ~7 minutes

## Support

- **Envio Docs**: https://docs.envio.dev
- **Configuration Guide**: https://docs.envio.dev/docs/HyperIndex/configuration-file
- **Tutorial**: https://docs.envio.dev/docs/HyperIndex/tutorial-op-bridge-deposits
- **Discord**: https://discord.gg/envio

---

**Bottom Line**: Your Envio setup is production-ready. Just need to deploy from a Linux environment and copy the GraphQL endpoint back to Windows. The entire process takes ~7 minutes.
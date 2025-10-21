# Envio Setup Guide for Monadgotchi

## Current Status
- ✅ Configuration files ready
- ✅ Event handlers implemented  
- ✅ Schema defined
- ❌ CLI deployment blocked on Windows

## Windows Workaround: GitHub Codespaces

### Step 1: Create Codespace

1. Go to your GitHub repository
2. Click "Code" → "Codespaces" → "Create codespace on main"
3. Wait for environment to load

### Step 2: Setup Environment in Codespace

```bash
# Install Envio CLI
npm install -g @envio-dev/envio

# Navigate to envio directory
cd envio

# Create .env file
cp .env.example .env
```

### Step 3: Update Configuration

Edit `.env` with your actual values:
```bash
# Your deployed contract address
CONTRACT_ADDRESS=0x750E675Fb7f1fBDe1944889AE12d311e3ae7E06b

# Monad testnet RPC
RPC_URL=https://testnet-rpc.monad.xyz

# Contract deployment block
START_BLOCK=44404850

# Get API key from https://envio.dev
ENVIO_API_KEY=your_actual_api_key
```

### Step 4: Generate Code and Deploy

```bash
# Generate TypeScript types
envio codegen

# Test locally (optional)
envio dev

# Deploy to Envio cloud
envio deploy
```

### Step 5: Update Your Windows Project

After successful deployment, copy the GraphQL endpoint back to your Windows `.env`:

```bash
# In your main project .env
VITE_ENVIO_ENDPOINT=https://indexer.envio.dev/your-project-id/graphql
```

## Alternative: Docker Setup

If you prefer Docker:

### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY envio/ .

RUN npm install -g @envio-dev/envio
RUN npm install

CMD ["envio", "deploy"]
```

### Step 2: Build and Run

```bash
# Build Docker image
docker build -t monadgotchi-envio .

# Run deployment
docker run -e ENVIO_API_KEY=your_key monadgotchi-envio
```

## Configuration Details

### Network Configuration (config.yaml)

Your current config is correct for Monad testnet:

```yaml
networks:
  - id: 10143 # Monad testnet
    start_block: 44404850 # Your deployment block
    contracts:
      - name: Monadgotchi
        address: ["0x750E675Fb7f1fBDe1944889AE12d311e3ae7E06b"]
```

### Event Handlers

All required events are properly handled:
- ✅ PetMinted - Creates new pet records
- ✅ PetHungerUpdated - Updates hunger levels  
- ✅ PetFainted - Marks pets as fainted
- ✅ PetFed - Records feeding history

### Schema Design

Your GraphQL schema follows best practices:
- Proper entity relationships
- Derived fields for feed history
- Query filters and ordering
- Custom queries for hungry pets

## Testing Your Setup

### 1. Validate Configuration

```bash
# In envio directory
npm run validate
```

### 2. Test Event Handling

```bash
# Start local development
envio dev

# In another terminal, trigger contract events
# (mint pets, feed them, etc.)
```

### 3. Query Data

```graphql
# Test query
query {
  pets(limit: 10) {
    id
    petId
    owner
    hunger
    isFainted
    feedHistory {
      feeder
      timestamp
    }
  }
}
```

## Production Deployment Checklist

- [ ] Get Envio API key from https://envio.dev
- [ ] Update .env with real values
- [ ] Run `envio codegen` 
- [ ] Test with `envio dev`
- [ ] Deploy with `envio deploy`
- [ ] Update frontend .env with GraphQL endpoint
- [ ] Test end-to-end functionality

## Troubleshooting

### Common Issues

1. **"Binary not found"** - Use Linux/Mac environment
2. **RPC errors** - Verify Monad testnet RPC URL
3. **Contract not found** - Check contract address and start block
4. **API key invalid** - Get new key from Envio dashboard

### Debug Commands

```bash
# Check deployment status
envio status

# View logs
envio logs

# Restart indexer
envio restart
```

## Next Steps

1. **Immediate**: Use GitHub Codespaces to deploy Envio
2. **Update**: Copy GraphQL endpoint to Windows project
3. **Test**: Verify frontend can query indexed data
4. **Deploy**: Launch agent with working Envio endpoint

## Support Resources

- [Envio Documentation](https://docs.envio.dev)
- [HyperIndex Tutorial](https://docs.envio.dev/docs/HyperIndex/tutorial-op-bridge-deposits)
- [Configuration Reference](https://docs.envio.dev/docs/HyperIndex/configuration-file)
- [Envio Discord](https://discord.gg/envio)

---

**Bottom Line**: Your Envio setup is ready. Just need to deploy from a Linux environment (Codespaces) and copy the endpoint back to Windows.
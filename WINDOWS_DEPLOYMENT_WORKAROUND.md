# Windows Deployment Workaround

## Issue: Envio CLI Not Working on Windows

The Envio CLI has a known issue on Windows where it can't find the binary:
```
Error: Couldn't find envio binary inside node_modules for windows-x64
```

## Solution: Deploy Without Envio (Temporary)

Your Monadgotchi dApp can still work without Envio! Here's what changes:

### What Works Without Envio:
- ✅ Smart contract (fully functional)
- ✅ Minting pets
- ✅ Manual feeding
- ✅ Delegation to Pet Sitter
- ✅ Frontend UI

### What Doesn't Work Without Envio:
- ❌ Real-time hunger level updates
- ❌ Transaction history display
- ❌ Automated agent feeding (agent needs Envio to find hungry pets)

## Deployment Options

### Option 1: Deploy Frontend Only (Recommended for Demo)

Deploy just the frontend to show the UI and contract interactions:

```powershell
cd packages/frontend
npm run build
vercel --prod
```

**What users can do:**
- Connect wallet
- Mint pets
- Feed pets manually
- See their pets (but hunger won't update in real-time)

### Option 2: Deploy Envio from Linux/Mac

If you have access to a Linux or Mac machine:

```bash
# On Linux/Mac
cd envio
envio codegen
envio deploy
```

Then update your Windows `.env` with the endpoint.

### Option 3: Use The Graph Protocol Instead

The Graph is an alternative to Envio that works on Windows. However, it requires more setup:

1. Create a subgraph
2. Deploy to The Graph Studio
3. Update the frontend to use The Graph endpoint

(This is more complex and beyond the current scope)

### Option 4: Use Direct Contract Queries

Modify the frontend to query the contract directly instead of using Envio:

**Pros:**
- Works immediately
- No indexer needed

**Cons:**
- Slower (RPC calls for each pet)
- No transaction history
- Higher RPC usage

## Recommended Path Forward

### For Hackathon/Demo:

**Deploy the frontend without Envio:**

```powershell
# 1. Build frontend
cd packages/frontend
npm run build

# 2. Deploy to Vercel
vercel --prod
```

**What to tell users:**
- "The dApp is live! You can mint and feed pets."
- "Real-time updates coming soon (indexer deployment pending)"
- Show the contract address so they can verify on-chain

### For Production:

1. **Deploy Envio from a Linux VM:**
   - Use AWS EC2, DigitalOcean, or GitHub Codespaces
   - Clone your repo
   - Run `envio deploy`
   - Copy the endpoint back to your Windows `.env`

2. **Then deploy the agent:**
   ```powershell
   cd packages/agent
   npm start
   ```

3. **Update and redeploy frontend:**
   ```powershell
   cd packages/frontend
   npm run build
   vercel --prod
   ```

## Quick Deploy (Frontend Only)

Let's get your frontend live right now:

### Step 1: Verify Build

```powershell
cd packages/frontend
npm run build
```

### Step 2: Deploy to Vercel

```powershell
# Install Vercel CLI if needed
npm install -g vercel

# Deploy
vercel --prod
```

### Step 3: Test

Visit your deployment URL and:
1. Connect MetaMask
2. Switch to Monad testnet (Chain ID: 10143)
3. Mint a pet
4. Feed the pet

## Alternative: Deploy to Netlify

```powershell
cd packages/frontend

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

## What's Already Working

✅ **Smart Contract:**
- Address: `0x750E675Fb7f1fBDe1944889AE12d311e3ae7E06b`
- Network: Monad Testnet (10143)
- Fully functional on-chain

✅ **Frontend:**
- Built and ready to deploy
- Can interact with contract
- UI is complete

✅ **Agent:**
- Built and ready
- Just needs Envio endpoint to function

## Next Steps

### Immediate (5 minutes):
1. Deploy frontend to Vercel/Netlify
2. Share the URL
3. Demo minting and feeding

### Short-term (when you have Linux/Mac access):
1. Deploy Envio indexer
2. Update `.env` with real endpoint
3. Deploy agent
4. Redeploy frontend
5. Full system operational!

## Commands Summary

```powershell
# Deploy frontend now
cd packages/frontend
vercel --prod

# Later, when Envio is deployed:
# 1. Update .env with real Envio endpoint
# 2. Deploy agent
cd packages/agent
npm start

# 3. Redeploy frontend
cd packages/frontend
npm run build
vercel --prod
```

## Support

- Envio Discord: https://discord.gg/envio
- Report Windows issue: https://github.com/enviodev/envio/issues

---

**Bottom line: Your dApp can go live now without Envio. Deploy the frontend and show off your work!** 🚀

# 🚀 Quick Envio Setup - Get Real Data Working

## Step 1: Install Envio CLI
```bash
npm install -g envio
```

## Step 2: Deploy Envio Indexer
```bash
cd envio
envio login
envio deploy
```

## Step 3: Update Environment Variables
After deployment, you'll get a GraphQL endpoint like:
`https://indexer.envio.dev/YOUR_DEPLOYMENT_ID/graphql`

Update your `.env` file:
```bash
ENVIO_ENDPOINT=https://indexer.envio.dev/YOUR_DEPLOYMENT_ID/graphql
VITE_ENVIO_ENDPOINT=https://indexer.envio.dev/YOUR_DEPLOYMENT_ID/graphql
```

## Step 4: Remove Mock Client
Update `packages/frontend/src/utils/envioClient.ts`:
```typescript
import { GraphQLClient } from 'graphql-request';
import { config } from './config';

export const envioClient = new GraphQLClient(config.envioEndpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Step 5: Restart Frontend
```bash
cd packages/frontend
npm run dev
```

## Step 6: Test Real Minting
1. Open http://localhost:3000/
2. Connect wallet with testnet ETH
3. Mint a pet
4. Wait 1-2 minutes for indexing
5. Pet should appear automatically!

---

## Alternative: Quick Test with Mock Data

If you want to test the UI immediately without deploying Envio:

1. Open browser console (F12)
2. Go to http://localhost:3000/
3. Connect your wallet
4. Click "Mint Your First Pet"
5. Check console for "Mock Envio client" logs
6. Pet should appear after 2 seconds

The mock system simulates:
- ✅ Pet creation after minting
- ✅ Random hunger levels (20-49)
- ✅ Proper pet selection
- ✅ Visual pet sprites

---

## Current Status
- ✅ Frontend running with new pet sprites
- ✅ Mock system working for development
- ⏳ Envio deployment needed for production
- ✅ All game assets created

**Next Steps:**
1. Deploy Envio indexer for real data
2. Test minting flow with real blockchain events
3. Add more game features (feeding, evolution, etc.)
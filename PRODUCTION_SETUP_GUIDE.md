# 🎮 Monadgotchi Production Setup Guide

This guide will help you set up Monadgotchi with real data, proper indexing, and game assets.

## 📋 Overview

To get Monadgotchi working with real data, you need:
1. **Envio Indexer** - To index blockchain events and provide GraphQL API
2. **Game Assets** - Images, sprites, and visual elements
3. **Environment Variables** - Proper configuration
4. **Real Blockchain Data** - Connect to actual contract events

---

## 🚀 Step 1: Deploy Envio Indexer

### Prerequisites
- Node.js 18+ installed
- Envio CLI installed: `npm install -g envio`

### 1.1 Install Envio CLI
```bash
npm install -g envio
```

### 1.2 Configure Envio
```bash
cd envio
```

Check your current configuration:
```bash
cat config.yaml
```

### 1.3 Deploy to Envio Cloud
```bash
# Login to Envio (first time only)
envio login

# Deploy the indexer
envio deploy
```

**Expected Output:**
```
✅ Deployment successful!
🌐 GraphQL Endpoint: https://indexer.envio.dev/YOUR_DEPLOYMENT_ID/graphql
📊 Dashboard: https://envio.dev/app/YOUR_DEPLOYMENT_ID
```

### 1.4 Update Environment Variables
Copy the GraphQL endpoint and update your `.env` file:
```bash
ENVIO_ENDPOINT=https://indexer.envio.dev/YOUR_DEPLOYMENT_ID/graphql
VITE_ENVIO_ENDPOINT=https://indexer.envio.dev/YOUR_DEPLOYMENT_ID/graphql
```

---

## 🎨 Step 2: Add Game Assets

### 2.1 Create Assets Directory Structure
```
packages/frontend/public/
├── assets/
│   ├── pets/
│   │   ├── happy/
│   │   ├── hungry/
│   │   ├── very-hungry/
│   │   └── fainted/
│   ├── ui/
│   │   ├── hunger-bar/
│   │   ├── buttons/
│   │   └── backgrounds/
│   └── sounds/
│       ├── feed.mp3
│       ├── mint.mp3
│       └── background.mp3
```

### 2.2 Pet Sprites (Recommended Sizes)
- **Pet Images**: 128x128px PNG with transparency
- **Animations**: 4-8 frame sprite sheets
- **File Format**: PNG for images, GIF for simple animations

**Required Pet States:**
- `happy.png` - Content pet (hunger 0-49)
- `hungry.png` - Slightly worried (hunger 50-89)  
- `very-hungry.png` - Very worried (hunger 90-99)
- `fainted.png` - Unconscious (hunger 100)

### 2.3 UI Elements
- **Hunger Bar**: 
  - `hunger-empty.png` (200x20px)
  - `hunger-fill-green.png`
  - `hunger-fill-yellow.png` 
  - `hunger-fill-red.png`
- **Buttons**:
  - `feed-button.png` (120x40px)
  - `mint-button.png` (150x50px)
- **Backgrounds**:
  - `game-bg.jpg` (1920x1080px)
  - `pet-area-bg.png` (400x300px)

---

## 🔧 Step 3: Environment Configuration

### 3.1 Complete .env Setup
```bash
# ============================================
# NETWORK CONFIGURATION  
# ============================================
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
CHAIN_ID=10143

# ============================================
# WALLETS (FILL THESE IN)
# ============================================
PRIVATE_KEY=0x[YOUR_DEPLOYER_PRIVATE_KEY]
AGENT_PRIVATE_KEY=0x[YOUR_AGENT_PRIVATE_KEY]  
AGENT_ADDRESS=0x[YOUR_AGENT_ADDRESS]

# ============================================
# DEPLOYED CONTRACT (ALREADY SET)
# ============================================
CONTRACT_ADDRESS=0x750E675Fb7f1fBDe1944889AE12d311e3ae7E06b
DEPLOYMENT_BLOCK=44404850

# ============================================
# ENVIO INDEXER (UPDATE AFTER DEPLOYMENT)
# ============================================
ENVIO_ENDPOINT=https://indexer.envio.dev/YOUR_DEPLOYMENT_ID/graphql

# ============================================
# AGENT CONFIGURATION
# ============================================
POLL_INTERVAL_MS=60000
MIN_HUNGER_THRESHOLD=90
MAX_RETRIES=3
MAX_CONCURRENT_FEEDS=5
LOG_LEVEL=info
HEALTH_CHECK_PORT=3001

# ============================================
# FRONTEND CONFIGURATION
# ============================================
VITE_CONTRACT_ADDRESS=0x750E675Fb7f1fBDe1944889AE12d311e3ae7E06b
VITE_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
VITE_CHAIN_ID=10143
VITE_ENVIO_ENDPOINT=https://indexer.envio.dev/YOUR_DEPLOYMENT_ID/graphql
VITE_AGENT_ADDRESS=0x[YOUR_AGENT_ADDRESS]
```

### 3.2 Wallet Setup
You need two wallets with Monad testnet ETH:

**Deployer Wallet:**
- Used for contract deployment (already done)
- Needs ~0.01-0.05 ETH

**Agent Wallet:**  
- Used by Pet Sitter Agent to feed pets
- Needs ~0.1-0.5 ETH for ongoing operations

**Get Testnet ETH:**
- Visit Monad faucet: https://faucet.testnet.monad.xyz/
- Connect both wallets and request ETH

---

## 🎯 Step 4: Update Frontend for Real Data

### 4.1 Remove Mock Client
Update `packages/frontend/src/utils/envioClient.ts`:
```typescript
import { GraphQLClient } from 'graphql-request';
import { config } from './config';

/**
 * GraphQL client for Envio indexer
 */
export const envioClient = new GraphQLClient(config.envioEndpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// Remove all mock client code
```

### 4.2 Add Asset Loading
Create `packages/frontend/src/utils/assets.ts`:
```typescript
export const ASSETS = {
  pets: {
    happy: '/assets/pets/happy.png',
    hungry: '/assets/pets/hungry.png', 
    veryHungry: '/assets/pets/very-hungry.png',
    fainted: '/assets/pets/fainted.png',
  },
  ui: {
    hungerBarEmpty: '/assets/ui/hunger-bar/empty.png',
    hungerBarFill: '/assets/ui/hunger-bar/fill.png',
    feedButton: '/assets/ui/buttons/feed.png',
    mintButton: '/assets/ui/buttons/mint.png',
  },
  sounds: {
    feed: '/assets/sounds/feed.mp3',
    mint: '/assets/sounds/mint.mp3',
    background: '/assets/sounds/background.mp3',
  }
};
```

### 4.3 Update PetDisplay Component
```typescript
import { ASSETS } from '../utils/assets';

export function PetDisplay({ hunger, isFainted }: PetDisplayProps) {
  const getAsset = () => {
    if (isFainted || hunger >= 100) return ASSETS.pets.fainted;
    if (hunger >= 90) return ASSETS.pets.veryHungry;
    if (hunger > 49) return ASSETS.pets.hungry;
    return ASSETS.pets.happy;
  };

  return (
    <div className="pet-display">
      <img 
        src={getAsset()} 
        alt="Pet" 
        className="pet-sprite"
      />
    </div>
  );
}
```

---

## 🔄 Step 5: Test Real Data Flow

### 5.1 Start All Services
```bash
# Terminal 1: Start Agent
cd packages/agent
npm run build
npm start

# Terminal 2: Start Frontend  
cd packages/frontend
npm run dev

# Terminal 3: Check Envio Status
curl https://indexer.envio.dev/YOUR_DEPLOYMENT_ID/graphql
```

### 5.2 Test Minting Flow
1. Open http://localhost:3000/
2. Connect wallet with testnet ETH
3. Click "Mint Your First Pet"
4. Wait for transaction confirmation
5. Pet should appear automatically

### 5.3 Verify Data Flow
Check Envio dashboard:
- Visit: https://envio.dev/app/YOUR_DEPLOYMENT_ID
- Verify events are being indexed
- Check GraphQL queries work

---

## 🎨 Step 6: Asset Creation Guide

### 6.1 Pet Sprite Requirements
**Style Guide:**
- Pixel art style (16x16 to 128x128)
- Consistent color palette
- Transparent backgrounds
- 4 distinct emotional states

**Recommended Tools:**
- Aseprite (pixel art)
- GIMP (free alternative)
- Photoshop
- Online: Piskel.app

### 6.2 Animation Frames
For animated pets, create sprite sheets:
```
happy-idle.png    (4 frames, breathing animation)
hungry-worry.png  (2 frames, slight movement)
very-hungry.png   (4 frames, shaking animation)
fainted.png       (1 frame, static)
```

### 6.3 UI Color Scheme
```css
:root {
  --primary: #646cff;
  --success: #4caf50;
  --warning: #ff9800;
  --danger: #f44336;
  --background: #242424;
  --surface: rgba(255, 255, 255, 0.05);
}
```

---

## 🚨 Troubleshooting

### Common Issues:

**"Failed to load pets"**
- Check Envio endpoint is correct
- Verify indexer is running
- Check network connectivity

**"Transaction failed"**
- Ensure wallet has enough ETH
- Check gas limits
- Verify contract address

**"Agent not feeding"**
- Check agent wallet has ETH
- Verify AGENT_PRIVATE_KEY is correct
- Check health endpoint: http://localhost:3001/health

### Debug Commands:
```bash
# Check Envio status
curl https://indexer.envio.dev/YOUR_DEPLOYMENT_ID/health

# Test GraphQL query
curl -X POST https://indexer.envio.dev/YOUR_DEPLOYMENT_ID/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ pets { id petId owner hunger } }"}'

# Check agent logs
cd packages/agent && npm start
```

---

## 📦 Quick Asset Pack

I'll create a basic asset pack for you to get started quickly. These will be simple but functional placeholders you can replace later.

Would you like me to:
1. Create the basic asset files?
2. Deploy the Envio indexer?
3. Update the frontend to use real data?

Let me know which step you'd like to start with!
# Monad Pets Frontend

React-based frontend application for the Monad Pets virtual pet game on Monad testnet.

## Features

- 🎮 Connect MetaMask wallet to Monad testnet
- ✨ Mint new Monad Pets NFT pets
- 🍖 Manually feed your pets
- 🤖 Hire Pet Sitter Agent for automated feeding via delegation
- 📊 Real-time hunger monitoring with 30-second polling
- 📜 Transaction history showing manual and automated feeds
- 🎨 Pixel-art pet display with animations based on hunger state

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `VITE_CONTRACT_ADDRESS`: Deployed Monadgotchi contract address
- `VITE_MONAD_RPC_URL`: Monad testnet RPC URL
- `VITE_CHAIN_ID`: Chain ID (41454 for Monad testnet)
- `VITE_ENVIO_ENDPOINT`: Envio GraphQL endpoint URL
- `VITE_AGENT_ADDRESS`: Pet Sitter Agent wallet address

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Testing

Run tests:
```bash
npm test
```

## Project Structure

```
src/
├── components/          # React components
│   ├── WalletConnect.tsx       # Wallet connection
│   ├── PetDisplay.tsx          # Pet sprite with animations
│   ├── HungerBar.tsx           # Hunger progress bar
│   ├── FeedButton.tsx          # Manual feed button
│   ├── DelegationButton.tsx    # Pet Sitter delegation
│   ├── PetStatus.tsx           # Real-time status display
│   ├── PetOwnership.tsx        # Pet list and minting
│   └── TransactionHistory.tsx  # Feed event history
├── hooks/               # Custom React hooks
│   ├── useContract.ts          # Contract interactions
│   ├── useEnvio.ts             # Envio GraphQL queries
│   └── useDelegation.ts        # Delegation management
├── utils/               # Utilities
│   ├── config.ts               # App configuration
│   ├── contractABI.ts          # Contract ABI
│   └── envioClient.ts          # GraphQL client
├── App.tsx              # Main app component
└── main.tsx             # App entry point with providers
```

## Key Components

### WalletConnect
Handles MetaMask wallet connection and network switching to Monad testnet.

### PetDisplay
Displays pixel-art pet with animations:
- Happy (0-49 hunger): 😊 bouncing
- Hungry (50-89 hunger): 😐 shaking
- Very Hungry (90-99 hunger): 😟 shaking fast
- Fainted (100 hunger): 😵 static

### HungerBar
Visual progress bar with color coding:
- Green (0-49): Healthy
- Yellow (50-89): Getting hungry
- Red (90-100): Critical

### DelegationButton
"Hire a Pet Sitter" button that grants delegation to the agent for automated feeding.

### PetStatus
Real-time monitoring showing:
- Pet ID
- Last feed timestamp
- Automation status (active/inactive)
- Health status with warnings

### TransactionHistory
Lists recent feed events with:
- Manual vs automated badge
- Feeder address
- Timestamp
- Link to block explorer

## Usage Flow

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Mint Pet**: Click "Mint Your First Pet" to create a new Monadgotchi NFT
3. **Monitor Hunger**: Watch the hunger bar increase over time (1 point per 10 minutes)
4. **Manual Feed**: Click "Feed Pet" to reset hunger to 0
5. **Hire Pet Sitter**: Click "Hire a Pet Sitter" to enable automation
6. **Automated Care**: Agent will automatically feed when hunger reaches 90

## Technologies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **wagmi**: Ethereum React hooks
- **viem**: Ethereum library
- **TanStack Query**: Data fetching and caching
- **graphql-request**: GraphQL client for Envio
- **Vitest**: Testing framework
- **Testing Library**: Component testing

## Notes

- Hunger increases by 1 every 10 minutes (100 blocks on Monad)
- Pet faints when hunger reaches 100
- Agent feeds pets when hunger >= 90 (if delegation is active)
- All data is fetched from Envio indexer with 30-second polling
- Transactions are confirmed on Monad testnet

import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Chain } from 'viem';
import App from './App';
import './index.css';

// Define Monad testnet chain
const monadTestnet: Chain = {
  id: 41454,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_MONAD_RPC_URL || 'https://testnet.monad.xyz'],
    },
    public: {
      http: [import.meta.env.VITE_MONAD_RPC_URL || 'https://testnet.monad.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://explorer.testnet.monad.xyz' },
  },
  testnet: true,
};

// Configure chains and providers
const { publicClient, webSocketPublicClient } = configureChains(
  [monadTestnet],
  [publicProvider()]
);

// Create wagmi config
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>
);

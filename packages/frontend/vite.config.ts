import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from root directory
  const env = loadEnv(mode, '../../', '');
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
    },
    build: {
      outDir: 'dist',
    },
    // Make VITE_ prefixed variables available
    define: {
      'import.meta.env.VITE_CONTRACT_ADDRESS': JSON.stringify(env.CONTRACT_ADDRESS || env.VITE_CONTRACT_ADDRESS),
      'import.meta.env.VITE_MONAD_RPC_URL': JSON.stringify(env.MONAD_RPC_URL || env.VITE_MONAD_RPC_URL),
      'import.meta.env.VITE_CHAIN_ID': JSON.stringify(env.CHAIN_ID || env.VITE_CHAIN_ID),
      'import.meta.env.VITE_ENVIO_ENDPOINT': JSON.stringify(env.ENVIO_ENDPOINT || env.VITE_ENVIO_ENDPOINT),
      'import.meta.env.VITE_AGENT_ADDRESS': JSON.stringify(env.AGENT_ADDRESS || env.VITE_AGENT_ADDRESS),
    },
  };
});

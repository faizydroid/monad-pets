/**
 * Application configuration
 */

export const config = {
  // Contract configuration
  contractAddress: (import.meta.env.VITE_CONTRACT_ADDRESS || '') as `0x${string}`,
  
  // Network configuration
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '41454'),
  rpcUrl: import.meta.env.VITE_MONAD_RPC_URL || 'https://testnet.monad.xyz',
  
  // Envio configuration
  envioEndpoint: import.meta.env.VITE_ENVIO_ENDPOINT || '',
  
  // Agent configuration
  agentAddress: (import.meta.env.VITE_AGENT_ADDRESS || '') as `0x${string}`,
  
  // Polling intervals
  petStatusPollInterval: 30000, // 30 seconds
  
  // Hunger thresholds
  hungerThresholds: {
    happy: 49,
    hungry: 89,
    veryHungry: 99,
    fainted: 100,
  },
} as const;

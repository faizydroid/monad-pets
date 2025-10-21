import dotenv from 'dotenv';
import { AgentConfig, ContractConfig, EnvioConfig } from '@monadgotchi/types';
import * as path from 'path';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export interface Config {
  contract: ContractConfig;
  envio: EnvioConfig;
  agent: AgentConfig;
  privateKey: string;
  logLevel: string;
}

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): Config {
  const requiredEnvVars = [
    'MONAD_RPC_URL',
    'CONTRACT_ADDRESS',
    'AGENT_PRIVATE_KEY',
    'ENVIO_ENDPOINT',
  ];

  // Check for required environment variables
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  // Validate contract address format
  const contractAddress = process.env.CONTRACT_ADDRESS!;
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    throw new Error('Invalid CONTRACT_ADDRESS format');
  }

  // Validate private key format
  const privateKey = process.env.AGENT_PRIVATE_KEY!;
  if (!/^(0x)?[a-fA-F0-9]{64}$/.test(privateKey)) {
    throw new Error('Invalid AGENT_PRIVATE_KEY format');
  }

  return {
    contract: {
      address: contractAddress,
      chainId: 10143, // Monad testnet chain ID
      rpcUrl: process.env.MONAD_RPC_URL!,
    },
    envio: {
      endpoint: process.env.ENVIO_ENDPOINT!,
    },
    agent: {
      pollIntervalMs: parseInt(process.env.POLL_INTERVAL_MS || '60000', 10),
      minHungerThreshold: parseInt(process.env.MIN_HUNGER_THRESHOLD || '90', 10),
      maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
      maxConcurrentFeeds: parseInt(process.env.MAX_CONCURRENT_FEEDS || '5', 10),
    },
    privateKey: privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`,
    logLevel: process.env.LOG_LEVEL || 'info',
  };
}

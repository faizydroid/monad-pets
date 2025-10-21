// Shared type definitions for Monadgotchi project

export interface Pet {
  tokenId: bigint;
  owner: string;
  hunger: number;
  lastFeedBlock: bigint;
  isFainted: boolean;
}

export interface IndexedPet {
  id: string;
  petId: bigint;
  owner: string;
  hunger: number;
  lastFeedBlock: bigint;
  lastFeedTimestamp: bigint;
  isFainted: boolean;
  createdAt: bigint;
  feedHistory?: FeedEvent[];
}

export interface FeedEvent {
  id: string;
  petId: bigint;
  feeder: string;
  timestamp: bigint;
  transactionHash: string;
}

export interface PetState {
  petId: number;
  owner: string;
  hunger: number;
  lastFed: Date;
  isFainted: boolean;
  isDelegated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ContractConfig {
  address: string;
  chainId: number;
  rpcUrl: string;
}

export interface EnvioConfig {
  endpoint: string;
}

export interface AgentConfig {
  pollIntervalMs: number;
  minHungerThreshold: number;
  maxRetries: number;
  maxConcurrentFeeds: number;
}

// Event types
export interface PetMintedEvent {
  petId: bigint;
  owner: string;
  timestamp: bigint;
}

export interface PetHungerUpdatedEvent {
  petId: bigint;
  newHungerLevel: number;
  timestamp: bigint;
}

export interface PetFaintedEvent {
  petId: bigint;
  timestamp: bigint;
}

export interface PetFedEvent {
  petId: bigint;
  feeder: string;
  timestamp: bigint;
}

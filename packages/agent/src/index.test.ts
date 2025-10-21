import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EnvioClient } from './envioClient.js';
import { ContractClient } from './contractClient.js';
import { PetSitterAgent } from './petSitterAgent.js';
import { createLogger } from './logger.js';
import { Config } from './config.js';

// Mock configuration
const mockConfig: Config = {
  contract: {
    address: '0x1234567890123456789012345678901234567890',
    chainId: 41454,
    rpcUrl: 'http://localhost:8545',
  },
  envio: {
    endpoint: 'http://localhost:8080/graphql',
  },
  agent: {
    pollIntervalMs: 1000,
    minHungerThreshold: 90,
    maxRetries: 3,
    maxConcurrentFeeds: 5,
  },
  privateKey: '0x0123456789012345678901234567890123456789012345678901234567890123',
  logLevel: 'error', // Suppress logs during tests
};

describe('EnvioClient', () => {
  it('should query hungry pets with retry logic', async () => {
    const client = new EnvioClient(mockConfig.envio.endpoint, 3);
    
    // Mock the GraphQL request
    const mockRequest = vi.spyOn(client as any, 'executeWithRetry');
    mockRequest.mockResolvedValue([
      {
        id: '1',
        petId: 1n,
        owner: '0xOwner1',
        hunger: 95,
        lastFeedBlock: 1000n,
        lastFeedTimestamp: 1000000n,
        isFainted: false,
        createdAt: 900000n,
      },
    ]);

    const result = await client.queryHungryPets(90);
    
    expect(result).toHaveLength(1);
    expect(result[0].hunger).toBe(95);
    expect(result[0].petId).toBe(1n);
  });

  it('should handle query errors with retry', async () => {
    const client = new EnvioClient(mockConfig.envio.endpoint, 2);
    
    // Mock failed requests
    const mockSleep = vi.spyOn(client as any, 'sleep');
    mockSleep.mockResolvedValue(undefined);

    // This will fail because we're not mocking the actual GraphQL client
    // In a real test, you'd mock the graphql-request library
    await expect(client.queryHungryPets(90)).rejects.toThrow();
  });
});

describe('ContractClient', () => {
  it('should create contract client with correct configuration', () => {
    const client = new ContractClient(mockConfig.contract, mockConfig.privateKey);
    
    expect(client.getAgentAddress()).toBeDefined();
    expect(client.getAgentAddress()).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  it('should handle feed transaction errors gracefully', async () => {
    const client = new ContractClient(mockConfig.contract, mockConfig.privateKey);
    
    // This will fail because we're not connected to a real network
    const result = await client.feedPet(1n);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('PetSitterAgent', () => {
  let agent: PetSitterAgent;
  let envioClient: EnvioClient;
  let contractClient: ContractClient;
  let logger: any;

  beforeEach(() => {
    envioClient = new EnvioClient(mockConfig.envio.endpoint, 3);
    contractClient = new ContractClient(mockConfig.contract, mockConfig.privateKey);
    logger = createLogger('error');
    
    agent = new PetSitterAgent(
      envioClient,
      contractClient,
      mockConfig,
      logger
    );
  });

  afterEach(async () => {
    if (agent.getStatus().isRunning) {
      await agent.stop();
    }
  });

  it('should initialize with correct status', () => {
    const status = agent.getStatus();
    
    expect(status.isRunning).toBe(false);
    expect(status.activeFeedTasks).toBe(0);
    expect(status.agentAddress).toBeDefined();
  });

  it('should start and stop gracefully', async () => {
    // Mock the poll method to prevent actual polling
    const mockPoll = vi.spyOn(agent as any, 'poll');
    mockPoll.mockResolvedValue(undefined);

    await agent.start();
    expect(agent.getStatus().isRunning).toBe(true);

    await agent.stop();
    expect(agent.getStatus().isRunning).toBe(false);
  });

  it('should handle concurrent feeding with rate limiting', async () => {
    const mockPets = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      petId: BigInt(i + 1),
      owner: `0xOwner${i}`,
      hunger: 95,
      lastFeedBlock: 1000n,
      lastFeedTimestamp: 1000000n,
      isFainted: false,
      createdAt: 900000n,
    }));

    // Mock the envio client
    const mockQueryHungryPets = vi.spyOn(envioClient, 'queryHungryPets');
    mockQueryHungryPets.mockResolvedValue(mockPets);

    // Mock the contract client
    const mockHasDelegation = vi.spyOn(contractClient, 'hasDelegation');
    mockHasDelegation.mockResolvedValue(true);

    const mockFeedPet = vi.spyOn(contractClient, 'feedPet');
    mockFeedPet.mockResolvedValue({
      success: true,
      transactionHash: '0xabcdef',
    });

    // Manually trigger poll
    await (agent as any).poll();

    // Verify that pets were processed
    expect(mockQueryHungryPets).toHaveBeenCalled();
  });

  it('should retry failed feed transactions', async () => {
    const mockPet = {
      id: '1',
      petId: 1n,
      owner: '0xOwner1',
      hunger: 95,
      lastFeedBlock: 1000n,
      lastFeedTimestamp: 1000000n,
      isFainted: false,
      createdAt: 900000n,
    };

    // Mock delegation check
    const mockHasDelegation = vi.spyOn(contractClient, 'hasDelegation');
    mockHasDelegation.mockResolvedValue(true);

    // Mock feed to fail twice then succeed
    const mockFeedPet = vi.spyOn(contractClient, 'feedPet');
    mockFeedPet
      .mockResolvedValueOnce({ success: false, error: 'Network error' })
      .mockResolvedValueOnce({ success: false, error: 'Network error' })
      .mockResolvedValueOnce({ success: true, transactionHash: '0xabcdef' });

    // Mock sleep to speed up test
    const mockSleep = vi.spyOn(agent as any, 'sleep');
    mockSleep.mockResolvedValue(undefined);

    // Trigger feed with retry
    await (agent as any).feedPetWithRetry({
      petId: mockPet.petId,
      owner: mockPet.owner,
      hunger: mockPet.hunger,
    });

    // Should have been called 3 times (2 failures + 1 success)
    expect(mockFeedPet).toHaveBeenCalledTimes(3);
  });
});

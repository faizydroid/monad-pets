import { Logger } from 'winston';
import { EnvioClient } from './envioClient.js';
import { ContractClient } from './contractClient.js';
import { Config } from './config.js';
import { IndexedPet } from '@monadgotchi/types';

interface FeedTask {
  petId: bigint;
  owner: string;
  hunger: number;
}

/**
 * Pet Sitter Agent - Automated pet feeding service
 */
export class PetSitterAgent {
  private envioClient: EnvioClient;
  private contractClient: ContractClient;
  private config: Config;
  private logger: Logger;
  private isRunning: boolean = false;
  private pollInterval: NodeJS.Timeout | null = null;
  private activeFeedTasks: Set<string> = new Set();

  constructor(
    envioClient: EnvioClient,
    contractClient: ContractClient,
    config: Config,
    logger: Logger
  ) {
    this.envioClient = envioClient;
    this.contractClient = contractClient;
    this.config = config;
    this.logger = logger;
  }

  /**
   * Start the agent polling loop
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('Agent is already running');
      return;
    }

    this.isRunning = true;
    this.logger.info('Pet Sitter Agent starting...', {
      agentAddress: this.contractClient.getAgentAddress(),
      pollIntervalMs: this.config.agent.pollIntervalMs,
      minHungerThreshold: this.config.agent.minHungerThreshold,
    });

    // Run initial poll immediately
    await this.poll();

    // Set up recurring poll
    this.pollInterval = setInterval(async () => {
      await this.poll();
    }, this.config.agent.pollIntervalMs);

    this.logger.info('Pet Sitter Agent started successfully');
  }

  /**
   * Stop the agent polling loop
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('Agent is not running');
      return;
    }

    this.logger.info('Pet Sitter Agent stopping...');
    this.isRunning = false;

    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }

    // Wait for active feed tasks to complete
    const maxWaitTime = 30000; // 30 seconds
    const startTime = Date.now();
    while (this.activeFeedTasks.size > 0 && Date.now() - startTime < maxWaitTime) {
      this.logger.info(`Waiting for ${this.activeFeedTasks.size} active feed tasks to complete...`);
      await this.sleep(1000);
    }

    this.logger.info('Pet Sitter Agent stopped');
  }

  /**
   * Execute one polling cycle
   */
  private async poll(): Promise<void> {
    try {
      this.logger.debug('Starting poll cycle');

      // Query hungry pets from Envio
      const hungryPets = await this.envioClient.queryHungryPets(
        this.config.agent.minHungerThreshold
      );

      if (hungryPets.length === 0) {
        this.logger.debug('No hungry pets found');
        return;
      }

      this.logger.info(`Found ${hungryPets.length} hungry pets`, {
        petIds: hungryPets.map((p) => p.petId.toString()),
      });

      // Filter out pets that are already being fed
      const petsToFeed = hungryPets.filter(
        (pet) => !this.activeFeedTasks.has(pet.petId.toString())
      );

      if (petsToFeed.length === 0) {
        this.logger.debug('All hungry pets are already being processed');
        return;
      }

      // Feed pets with concurrency limit
      await this.feedPetsConcurrently(petsToFeed);
    } catch (error) {
      this.logger.error('Error during poll cycle', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }

  /**
   * Feed multiple pets concurrently with rate limiting
   */
  private async feedPetsConcurrently(pets: IndexedPet[]): Promise<void> {
    const tasks: FeedTask[] = pets.map((pet) => ({
      petId: pet.petId,
      owner: pet.owner,
      hunger: pet.hunger,
    }));

    // Process tasks in batches to respect concurrency limit
    for (let i = 0; i < tasks.length; i += this.config.agent.maxConcurrentFeeds) {
      const batch = tasks.slice(i, i + this.config.agent.maxConcurrentFeeds);
      await Promise.all(batch.map((task) => this.feedPetWithRetry(task)));
    }
  }

  /**
   * Feed a pet with retry logic
   */
  private async feedPetWithRetry(task: FeedTask): Promise<void> {
    const petIdStr = task.petId.toString();
    this.activeFeedTasks.add(petIdStr);

    try {
      // Check if agent has delegation
      const hasDelegation = await this.contractClient.hasDelegation(
        task.owner,
        task.petId
      );

      if (!hasDelegation) {
        this.logger.warn('No delegation for pet', {
          petId: petIdStr,
          owner: task.owner,
        });
        return;
      }

      // Attempt to feed with retry logic
      let lastError: string | undefined;
      for (let attempt = 1; attempt <= this.config.agent.maxRetries; attempt++) {
        this.logger.info(`Feeding pet (attempt ${attempt}/${this.config.agent.maxRetries})`, {
          petId: petIdStr,
          hunger: task.hunger,
          owner: task.owner,
        });

        const result = await this.contractClient.feedPet(task.petId);

        if (result.success) {
          this.logger.info('Successfully fed pet', {
            petId: petIdStr,
            transactionHash: result.transactionHash,
            attempt,
          });
          return;
        }

        lastError = result.error;
        this.logger.warn(`Failed to feed pet (attempt ${attempt}/${this.config.agent.maxRetries})`, {
          petId: petIdStr,
          error: result.error,
        });

        // Don't wait after the last attempt
        if (attempt < this.config.agent.maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delayMs = Math.pow(2, attempt - 1) * 1000;
          await this.sleep(delayMs);
        }
      }

      // All retries failed
      this.logger.error('Failed to feed pet after all retries', {
        petId: petIdStr,
        maxRetries: this.config.agent.maxRetries,
        lastError,
      });
    } catch (error) {
      this.logger.error('Unexpected error while feeding pet', {
        petId: petIdStr,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      this.activeFeedTasks.delete(petIdStr);
    }
  }

  /**
   * Sleep for a specified duration
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get agent status
   */
  getStatus(): {
    isRunning: boolean;
    activeFeedTasks: number;
    agentAddress: string;
  } {
    return {
      isRunning: this.isRunning,
      activeFeedTasks: this.activeFeedTasks.size,
      agentAddress: this.contractClient.getAgentAddress(),
    };
  }
}

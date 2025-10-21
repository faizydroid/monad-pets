import { GraphQLClient, gql } from 'graphql-request';
import { IndexedPet } from '@monadgotchi/types';

export interface HungryPetsQueryResult {
  pets: IndexedPet[];
}

/**
 * Envio GraphQL client wrapper for querying pet data
 */
export class EnvioClient {
  private client: GraphQLClient;
  private maxRetries: number;

  constructor(endpoint: string, maxRetries: number = 3) {
    this.client = new GraphQLClient(endpoint);
    this.maxRetries = maxRetries;
  }

  /**
   * Query pets with hunger level >= threshold
   * @param minHunger Minimum hunger threshold (default: 90)
   * @returns Array of hungry pets
   */
  async queryHungryPets(minHunger: number = 90): Promise<IndexedPet[]> {
    const query = gql`
      query GetHungryPets($minHunger: Int!) {
        pets(where: { hunger_gte: $minHunger, isFainted: false }, limit: 100) {
          id
          petId
          owner
          hunger
          lastFeedBlock
          lastFeedTimestamp
          isFainted
          createdAt
        }
      }
    `;

    return this.executeWithRetry(async () => {
      const result = await this.client.request<HungryPetsQueryResult>(query, {
        minHunger,
      });
      return result.pets;
    });
  }

  /**
   * Query a specific pet by ID
   * @param petId The pet ID to query
   * @returns Pet data or null if not found
   */
  async queryPet(petId: bigint): Promise<IndexedPet | null> {
    const query = gql`
      query GetPet($petId: BigInt!) {
        pet(petId: $petId) {
          id
          petId
          owner
          hunger
          lastFeedBlock
          lastFeedTimestamp
          isFainted
          createdAt
        }
      }
    `;

    return this.executeWithRetry(async () => {
      const result = await this.client.request<{ pet: IndexedPet | null }>(
        query,
        { petId: petId.toString() }
      );
      return result.pet;
    });
  }

  /**
   * Execute a query with retry logic and exponential backoff
   * @param fn The async function to execute
   * @returns The result of the function
   */
  private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on the last attempt
        if (attempt < this.maxRetries - 1) {
          // Exponential backoff: 1s, 2s, 4s
          const delayMs = Math.pow(2, attempt) * 1000;
          await this.sleep(delayMs);
        }
      }
    }

    throw new Error(
      `Failed after ${this.maxRetries} attempts: ${lastError?.message || 'Unknown error'}`
    );
  }

  /**
   * Sleep for a specified duration
   * @param ms Milliseconds to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

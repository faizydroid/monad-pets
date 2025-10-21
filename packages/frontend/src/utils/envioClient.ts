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

/**
 * GraphQL queries for pet data
 */
export const queries = {
  getPet: `
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
  `,
  
  getPetsByOwner: `
    query GetPetsByOwner($owner: String!) {
      pets(where: { owner: $owner }) {
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
  `,
  
  getFeedEvents: `
    query GetFeedEvents($petId: BigInt!) {
      feedEvents(where: { petId: $petId }, orderBy: timestamp, orderDirection: desc, limit: 10) {
        id
        petId
        feeder
        timestamp
        transactionHash
      }
    }
  `,
};

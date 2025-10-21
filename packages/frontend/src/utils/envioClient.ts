import { GraphQLClient } from 'graphql-request';
import { config } from './config';

/**
 * GraphQL client for Envio indexer with fallback for development
 */
const isPlaceholderEndpoint = config.envioEndpoint.includes('placeholder');

export const envioClient = isPlaceholderEndpoint 
  ? createMockClient()
  : new GraphQLClient(config.envioEndpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

/**
 * Create a mock client for development when Envio is not deployed
 */
function createMockClient() {
  // Simple in-memory storage for mock pets
  let mockPets: any[] = [];
  let nextPetId = 1n;
  
  // Listen for mint events from localStorage to simulate blockchain events
  const checkForNewMints = (owner: string) => {
    const mintKey = `mock_mint_${owner.toLowerCase()}`;
    const shouldCreatePet = localStorage.getItem(mintKey);
    
    if (shouldCreatePet && !mockPets.find(p => p.owner === owner.toLowerCase())) {
      // Create a mock pet for this owner
      const mockPet = {
        id: `pet-${nextPetId}`,
        petId: nextPetId,
        owner: owner.toLowerCase(),
        hunger: Math.floor(Math.random() * 30) + 20, // Random hunger 20-49 (happy)
        lastFeedBlock: 44404850n,
        lastFeedTimestamp: BigInt(Date.now() - Math.random() * 1800000), // Random time in last 30 min
        isFainted: false,
        createdAt: BigInt(Date.now())
      };
      mockPets.push(mockPet);
      nextPetId++;
      console.log('Created mock pet for', owner, ':', mockPet);
      
      // Clear the mint flag
      localStorage.removeItem(mintKey);
      
      return true;
    }
    return false;
  };

  return {
    request: async (query: string, variables?: any) => {
      console.log('Mock Envio client - query:', query.split('\n')[1]?.trim(), variables);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (query.includes('GetPet(')) {
        const petId = variables?.petId;
        const pet = mockPets.find(p => p.petId.toString() === petId);
        return { pet: pet || null };
      }
      
      if (query.includes('GetPetsByOwner')) {
        const owner = variables?.owner?.toLowerCase();
        
        if (owner) {
          // Check for new mints
          checkForNewMints(owner);
          
          const ownerPets = mockPets.filter(p => p.owner === owner);
          return { pets: ownerPets };
        }
        
        return { pets: [] };
      }
      
      if (query.includes('GetFeedEvents')) {
        // Return empty feed events for now
        return { feedEvents: [] };
      }
      
      return {};
    }
  };
}

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

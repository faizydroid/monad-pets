# Monadgotchi Envio Indexer

This directory contains the Envio indexer configuration for the Monadgotchi virtual pet game.

## Overview

The Envio indexer tracks on-chain events from the Monadgotchi smart contract and provides a GraphQL API for querying pet data, hunger levels, and feed history.

## Prerequisites

- Node.js 18+ installed
- Envio CLI installed: `npm install -g envio`
- Deployed Monadgotchi contract on Monad testnet

## Configuration Files

- `config.yaml` - Envio indexer configuration with contract address and event definitions
- `schema.graphql` - GraphQL schema defining Pet and FeedEvent entities
- `src/EventHandlers.ts` - Event handler implementations for indexing

## Setup Instructions

### 1. Install Envio CLI

```bash
npm install -g envio
```

### 2. Update Configuration

Before deploying, update the following in `config.yaml`:

- Replace the contract address placeholder with the deployed Monadgotchi contract address
- Update `start_block` to the block number where the contract was deployed

```yaml
contracts:
  - name: Monadgotchi
    address:
      - "0xYourDeployedContractAddress" # Update this
```

### 3. Initialize Envio Project

```bash
cd envio
envio init
```

### 4. Generate Types

Generate TypeScript types from the GraphQL schema:

```bash
envio codegen
```

### 5. Test Locally (Optional)

Run the indexer locally against Monad testnet:

```bash
envio dev
```

This will start a local GraphQL endpoint at `http://localhost:8080/graphql`

### 6. Deploy to Envio Cloud

Deploy the indexer to Envio's hosted infrastructure:

```bash
envio deploy
```

Follow the prompts to authenticate and deploy. You'll receive a GraphQL endpoint URL.

## GraphQL Queries

### Get a Single Pet

```graphql
query GetPet($petId: BigInt!) {
  pet(petId: $petId) {
    id
    petId
    owner
    hunger
    lastFeedTimestamp
    isFainted
    createdAt
  }
}
```

### Get All Pets for an Owner

```graphql
query GetOwnerPets($owner: String!) {
  pets(where: { owner: $owner }) {
    id
    petId
    owner
    hunger
    lastFeedTimestamp
    isFainted
  }
}
```

### Get Hungry Pets (for Pet Sitter Agent)

```graphql
query GetHungryPets($minHunger: Int!) {
  hungryPets(minHunger: $minHunger) {
    id
    petId
    owner
    hunger
    lastFeedTimestamp
    isFainted
  }
}
```

### Get Feed History for a Pet

```graphql
query GetFeedHistory($petId: BigInt!) {
  feedEvents(petId: $petId, limit: 10) {
    id
    petId
    feeder
    timestamp
    transactionHash
    blockNumber
  }
}
```

## Event Handlers

The indexer implements handlers for four events:

1. **PetMinted** - Creates new pet records when pets are minted
2. **PetHungerUpdated** - Updates hunger levels when pets are fed
3. **PetFainted** - Marks pets as fainted when hunger reaches 100
4. **PetFed** - Records feed actions in transaction history

All handlers are designed to update the database within 5 seconds of event emission.

## Monitoring

After deployment, monitor your indexer:

- Check indexer status: `envio status`
- View logs: `envio logs`
- Access GraphQL playground at your deployed endpoint

## Troubleshooting

### Indexer Not Syncing

- Verify the contract address is correct in `config.yaml`
- Check that the start block is set to the deployment block
- Ensure the RPC endpoint is accessible

### Missing Events

- Verify events are being emitted by the contract
- Check that event signatures match the contract ABI
- Review indexer logs for errors

### GraphQL Query Errors

- Ensure types are generated: `envio codegen`
- Verify schema matches the entity definitions
- Check that relationships are properly defined

## Next Steps

After deploying the indexer:

1. Update the frontend `.env` file with the GraphQL endpoint URL
2. Update the Pet Sitter Agent configuration with the endpoint URL
3. Test queries using the GraphQL playground
4. Verify that hungry pets query returns correct results

# Envio Indexer Deployment Guide

## Prerequisites

- Envio CLI installed: `npm install -g envio`
- Deployed Monadgotchi contract on Monad testnet
- Contract address and deployment block number

## Deployment Steps

### 1. Update Configuration

After deploying the smart contract, update `config.yaml` with the contract address and deployment block:

```yaml
networks:
  - id: 41454
    start_block: <DEPLOYMENT_BLOCK> # Update this
    contracts:
      - name: Monadgotchi
        address:
          - "<CONTRACT_ADDRESS>" # Update this
```

You can use the automated script from the contracts package:

```bash
cd packages/contracts
npm run update-configs
```

This will automatically update the Envio configuration with the deployed contract address and block number.

### 2. Install Envio CLI

If you haven't already, install the Envio CLI globally:

```bash
npm install -g envio
```

### 3. Initialize Envio Project

Navigate to the envio directory and initialize:

```bash
cd envio
envio init
```

### 4. Generate TypeScript Types

Generate types from the GraphQL schema:

```bash
envio codegen
```

This creates TypeScript types in `src/generated/` based on your schema.

### 5. Test Locally (Optional)

Before deploying to production, test the indexer locally:

```bash
envio dev
```

This starts a local GraphQL endpoint at `http://localhost:8080/graphql`

Test queries in the GraphQL playground:
- Navigate to `http://localhost:8080/graphql`
- Try the sample queries from `queries.graphql`

### 6. Deploy to Envio Cloud

Deploy the indexer to Envio's hosted infrastructure:

```bash
envio deploy
```

Follow the prompts:
1. Authenticate with your Envio account (create one if needed)
2. Choose a deployment name (e.g., "monadgotchi-testnet")
3. Confirm deployment

The CLI will output your GraphQL endpoint URL:
```
✅ Deployment successful!
GraphQL Endpoint: https://indexer.envio.dev/your-deployment-id/graphql
```

### 7. Verify Deployment

Test the deployed endpoint:

```bash
curl -X POST https://indexer.envio.dev/your-deployment-id/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ pets { id petId owner hunger } }"}'
```

Or visit the GraphQL playground in your browser:
```
https://indexer.envio.dev/your-deployment-id/graphql
```

### 8. Update Application Configurations

Update the GraphQL endpoint in your application configurations:

#### Agent Configuration

Update `packages/agent/.env`:

```bash
ENVIO_ENDPOINT=https://indexer.envio.dev/your-deployment-id/graphql
```

#### Frontend Configuration

Update `packages/frontend/.env`:

```bash
VITE_ENVIO_ENDPOINT=https://indexer.envio.dev/your-deployment-id/graphql
```

## Monitoring and Management

### Check Indexer Status

```bash
envio status
```

### View Logs

```bash
envio logs
```

### Update Indexer

If you make changes to event handlers or schema:

```bash
envio codegen
envio deploy
```

### Restart Indexer

```bash
envio restart
```

## Testing Queries

Use the provided sample queries in `queries.graphql`:

### Test Pet Query

```graphql
query GetPet {
  pet(petId: "1") {
    id
    petId
    owner
    hunger
    lastFeedTimestamp
    isFainted
  }
}
```

### Test Hungry Pets Query (for Agent)

```graphql
query GetHungryPets {
  hungryPets(minHunger: 90) {
    id
    petId
    owner
    hunger
    lastFeedTimestamp
  }
}
```

### Test Feed History

```graphql
query GetFeedHistory {
  feedEvents(petId: "1", limit: 10) {
    id
    feeder
    timestamp
    transactionHash
  }
}
```

## Troubleshooting

### Indexer Not Syncing

**Problem:** Indexer shows 0 entities or isn't updating

**Solutions:**
- Verify contract address in `config.yaml` matches deployed contract
- Check `start_block` is set to deployment block (not 0)
- Ensure RPC endpoint is accessible: `https://testnet.monad.xyz`
- Check indexer logs: `envio logs`

### Missing Events

**Problem:** Some events aren't being indexed

**Solutions:**
- Verify events are being emitted by the contract
- Check event signatures match exactly (including parameter names)
- Review handler implementations in `src/EventHandlers.ts`
- Check for errors in indexer logs

### GraphQL Query Errors

**Problem:** Queries return errors or unexpected results

**Solutions:**
- Regenerate types: `envio codegen`
- Verify schema matches entity definitions
- Check that relationships are properly defined
- Test queries in GraphQL playground

### Deployment Fails

**Problem:** `envio deploy` command fails

**Solutions:**
- Ensure you're authenticated: `envio login`
- Check your internet connection
- Verify all configuration files are valid
- Try deploying with verbose logging: `envio deploy --verbose`

### High Latency

**Problem:** Queries are slow or timing out

**Solutions:**
- Add indexes to frequently queried fields
- Limit query results with pagination
- Use specific queries instead of fetching all data
- Consider caching frequently accessed data

## Performance Optimization

### Indexing Performance

- Set `start_block` to deployment block (not 0) to avoid indexing unnecessary blocks
- Use batch processing for multiple events in the same block
- Optimize handler logic to minimize database operations

### Query Performance

- Use pagination for large result sets
- Add filters to narrow down results
- Cache frequently accessed data on the client side
- Use specific field selections instead of fetching all fields

## Next Steps

After successful deployment:

1. ✅ Test all GraphQL queries in the playground
2. ✅ Verify hungry pets query returns correct results
3. ✅ Update agent and frontend configurations with endpoint URL
4. ✅ Deploy Pet Sitter Agent (Task 6.3)
5. ✅ Build and deploy frontend (Task 6.4)

## Additional Resources

- [Envio Documentation](https://docs.envio.dev)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Monad Testnet Documentation](https://docs.monad.xyz)

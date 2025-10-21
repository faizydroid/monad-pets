# Pet Sitter Agent

Automated service that monitors and feeds hungry Monadgotchi pets using delegated permissions.

## Features

- **Automated Feeding**: Continuously monitors pets and feeds them when hunger reaches threshold
- **Delegation Support**: Uses MetaMask Smart Account delegation to feed pets on behalf of owners
- **Retry Logic**: Implements exponential backoff for failed transactions (3 attempts: 1s, 2s, 4s)
- **Concurrency Control**: Rate-limited concurrent feeding (max 5 simultaneous transactions)
- **Health Monitoring**: HTTP endpoints for health checks and status monitoring
- **Structured Logging**: Winston-based logging with file and console outputs

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONAD_RPC_URL=https://testnet.monad.xyz
CONTRACT_ADDRESS=0x...
AGENT_PRIVATE_KEY=0x...
ENVIO_ENDPOINT=https://indexer.envio.dev/...
POLL_INTERVAL_MS=60000
MIN_HUNGER_THRESHOLD=90
MAX_RETRIES=3
MAX_CONCURRENT_FEEDS=5
LOG_LEVEL=info
HEALTH_CHECK_PORT=3000
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Run Tests
```bash
npm test
```

## Architecture

### Components

- **EnvioClient**: GraphQL client for querying hungry pets from Envio indexer
- **ContractClient**: Ethers.js wrapper for interacting with Monadgotchi contract
- **PetSitterAgent**: Main agent logic with polling loop and retry mechanism
- **HealthCheckServer**: HTTP server for monitoring agent status
- **Logger**: Winston-based structured logging

### Flow

1. Agent polls Envio indexer every 60 seconds (configurable)
2. Queries pets with hunger >= 90 (configurable threshold)
3. Checks delegation permissions for each hungry pet
4. Feeds pets concurrently with rate limiting (max 5 simultaneous)
5. Retries failed transactions with exponential backoff
6. Logs all feed transactions and errors

## Monitoring

### Health Check Endpoint
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Status Endpoint
```bash
curl http://localhost:3000/status
```

Response:
```json
{
  "isRunning": true,
  "activeFeedTasks": 2,
  "agentAddress": "0x...",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "memoryUsage": {...}
}
```

## Logs

Logs are written to:
- `agent.log` - All logs
- `agent-error.log` - Error logs only
- Console output with colorized formatting

## Deployment

### Docker (Recommended)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist ./dist
CMD ["node", "dist/index.js"]
```

### PM2
```bash
pm2 start dist/index.js --name monadgotchi-agent
```

### Systemd
Create `/etc/systemd/system/monadgotchi-agent.service`:
```ini
[Unit]
Description=Monadgotchi Pet Sitter Agent
After=network.target

[Service]
Type=simple
User=monadgotchi
WorkingDirectory=/opt/monadgotchi-agent
ExecStart=/usr/bin/node dist/index.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

## Requirements

- Node.js 18+
- Access to Monad testnet RPC
- Envio indexer endpoint
- Agent wallet with ETH for gas fees
- Delegation permissions from pet owners

## Security

- Store `AGENT_PRIVATE_KEY` securely (use environment variables or secrets manager)
- Ensure agent wallet has sufficient ETH for gas fees
- Monitor gas spending and set daily limits
- Use health check endpoints for uptime monitoring
- Review logs regularly for unauthorized access attempts

## Troubleshooting

### Agent not feeding pets
- Check delegation permissions: `delegations[owner][agent][petId]`
- Verify agent wallet has sufficient ETH
- Check Envio indexer is returning hungry pets
- Review logs for transaction errors

### High gas costs
- Adjust `MIN_HUNGER_THRESHOLD` to feed less frequently
- Reduce `MAX_CONCURRENT_FEEDS` to lower transaction volume
- Monitor gas prices and pause during high-fee periods

### Connection errors
- Verify `MONAD_RPC_URL` is accessible
- Check `ENVIO_ENDPOINT` is responding
- Ensure network connectivity
- Review retry logic in logs

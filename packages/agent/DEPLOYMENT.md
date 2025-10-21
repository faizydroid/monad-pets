# Pet Sitter Agent Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Deployed Monadgotchi contract on Monad testnet
- Envio indexer deployed and accessible
- Agent wallet with testnet ETH for gas fees
- Cloud infrastructure account (AWS, DigitalOcean, etc.) or local server

## Deployment Options

Choose one of the following deployment methods:

1. **Docker** (Recommended for production)
2. **PM2** (Simple process manager)
3. **Systemd** (Linux service)
4. **Cloud Functions** (AWS Lambda, Google Cloud Functions)

## Pre-Deployment Setup

### 1. Build the Agent

```bash
cd packages/agent
npm install
npm run build
```

This creates the `dist/` directory with compiled JavaScript.

### 2. Configure Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Update with your configuration:

```env
# Monad Network
MONAD_RPC_URL=https://testnet.monad.xyz
CONTRACT_ADDRESS=0x... # From contract deployment

# Agent Configuration
AGENT_PRIVATE_KEY=0x... # Agent wallet private key
ENVIO_ENDPOINT=https://indexer.envio.dev/your-deployment-id/graphql
POLL_INTERVAL_MS=60000
MIN_HUNGER_THRESHOLD=90
MAX_RETRIES=3
MAX_CONCURRENT_FEEDS=5

# Logging
LOG_LEVEL=info
HEALTH_CHECK_PORT=3000
```

⚠️ **Security Note**: Never commit `.env` files or private keys to version control!

### 3. Test Locally

Before deploying, test the agent locally:

```bash
npm run dev
```

Verify:
- Agent connects to Envio indexer
- Agent can query hungry pets
- Agent has delegation permissions
- Agent can send feed transactions

## Deployment Method 1: Docker (Recommended)

### Create Dockerfile

Create `packages/agent/Dockerfile`:

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy built application
COPY dist ./dist

# Expose health check port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the agent
CMD ["node", "dist/index.js"]
```

### Build Docker Image

```bash
cd packages/agent
docker build -t monadgotchi-agent:latest .
```

### Run Docker Container

```bash
docker run -d \
  --name monadgotchi-agent \
  --restart unless-stopped \
  -p 3000:3000 \
  -e MONAD_RPC_URL=https://testnet.monad.xyz \
  -e CONTRACT_ADDRESS=0x... \
  -e AGENT_PRIVATE_KEY=0x... \
  -e ENVIO_ENDPOINT=https://indexer.envio.dev/... \
  -e POLL_INTERVAL_MS=60000 \
  -e MIN_HUNGER_THRESHOLD=90 \
  -e MAX_RETRIES=3 \
  -e MAX_CONCURRENT_FEEDS=5 \
  -e LOG_LEVEL=info \
  -e HEALTH_CHECK_PORT=3000 \
  monadgotchi-agent:latest
```

### Docker Compose (Alternative)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  agent:
    build: .
    container_name: monadgotchi-agent
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - MONAD_RPC_URL=${MONAD_RPC_URL}
      - CONTRACT_ADDRESS=${CONTRACT_ADDRESS}
      - AGENT_PRIVATE_KEY=${AGENT_PRIVATE_KEY}
      - ENVIO_ENDPOINT=${ENVIO_ENDPOINT}
      - POLL_INTERVAL_MS=60000
      - MIN_HUNGER_THRESHOLD=90
      - MAX_RETRIES=3
      - MAX_CONCURRENT_FEEDS=5
      - LOG_LEVEL=info
      - HEALTH_CHECK_PORT=3000
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Run with:

```bash
docker-compose up -d
```

## Deployment Method 2: PM2

PM2 is a production process manager for Node.js applications.

### Install PM2

```bash
npm install -g pm2
```

### Create PM2 Ecosystem File

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'monadgotchi-agent',
    script: './dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      MONAD_RPC_URL: 'https://testnet.monad.xyz',
      CONTRACT_ADDRESS: '0x...',
      AGENT_PRIVATE_KEY: '0x...',
      ENVIO_ENDPOINT: 'https://indexer.envio.dev/...',
      POLL_INTERVAL_MS: '60000',
      MIN_HUNGER_THRESHOLD: '90',
      MAX_RETRIES: '3',
      MAX_CONCURRENT_FEEDS: '5',
      LOG_LEVEL: 'info',
      HEALTH_CHECK_PORT: '3000'
    }
  }]
};
```

### Start with PM2

```bash
pm2 start ecosystem.config.js
```

### PM2 Commands

```bash
# View logs
pm2 logs monadgotchi-agent

# Monitor
pm2 monit

# Restart
pm2 restart monadgotchi-agent

# Stop
pm2 stop monadgotchi-agent

# Delete
pm2 delete monadgotchi-agent

# Save configuration
pm2 save

# Setup startup script
pm2 startup
```

## Deployment Method 3: Systemd (Linux)

### Create Service File

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
RestartSec=10

# Environment variables
Environment=NODE_ENV=production
Environment=MONAD_RPC_URL=https://testnet.monad.xyz
Environment=CONTRACT_ADDRESS=0x...
Environment=AGENT_PRIVATE_KEY=0x...
Environment=ENVIO_ENDPOINT=https://indexer.envio.dev/...
Environment=POLL_INTERVAL_MS=60000
Environment=MIN_HUNGER_THRESHOLD=90
Environment=MAX_RETRIES=3
Environment=MAX_CONCURRENT_FEEDS=5
Environment=LOG_LEVEL=info
Environment=HEALTH_CHECK_PORT=3000

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/monadgotchi-agent/logs

[Install]
WantedBy=multi-user.target
```

### Setup and Start Service

```bash
# Create user
sudo useradd -r -s /bin/false monadgotchi

# Copy files
sudo mkdir -p /opt/monadgotchi-agent
sudo cp -r dist package*.json /opt/monadgotchi-agent/
sudo chown -R monadgotchi:monadgotchi /opt/monadgotchi-agent

# Install dependencies
cd /opt/monadgotchi-agent
sudo -u monadgotchi npm ci --production

# Reload systemd
sudo systemctl daemon-reload

# Enable and start service
sudo systemctl enable monadgotchi-agent
sudo systemctl start monadgotchi-agent

# Check status
sudo systemctl status monadgotchi-agent

# View logs
sudo journalctl -u monadgotchi-agent -f
```

## Deployment Method 4: AWS Lambda (Serverless)

For serverless deployment, the agent needs to be modified to run as a single execution rather than a continuous loop.

### Create Lambda Handler

Create `packages/agent/src/lambda.ts`:

```typescript
import { loadConfig } from './config.js';
import { createLogger } from './logger.js';
import { EnvioClient } from './envioClient.js';
import { ContractClient } from './contractClient.js';

export const handler = async (event: any) => {
  const config = loadConfig();
  const logger = createLogger(config.logLevel);

  try {
    const envioClient = new EnvioClient(config.envio.endpoint, config.agent.maxRetries);
    const contractClient = new ContractClient(config.contract, config.privateKey);

    // Query hungry pets
    const hungryPets = await envioClient.queryHungryPets(config.agent.minHungerThreshold);

    logger.info(`Found ${hungryPets.length} hungry pets`);

    // Feed pets
    for (const pet of hungryPets) {
      const hasDelegation = await contractClient.hasDelegation(pet.owner, pet.petId);
      
      if (hasDelegation) {
        const result = await contractClient.feedPet(pet.petId);
        logger.info('Feed result', { petId: pet.petId.toString(), success: result.success });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ fed: hungryPets.length })
    };
  } catch (error) {
    logger.error('Lambda execution failed', { error });
    throw error;
  }
};
```

### Deploy to AWS Lambda

1. Build and package:
```bash
npm run build
zip -r function.zip dist node_modules package.json
```

2. Create Lambda function via AWS Console or CLI
3. Set environment variables in Lambda configuration
4. Create EventBridge rule to trigger every minute

## Cloud Platform Deployment

### AWS EC2

1. Launch EC2 instance (t2.micro or larger)
2. SSH into instance
3. Install Node.js 18+
4. Clone repository or copy built files
5. Use PM2 or systemd method above

### DigitalOcean Droplet

1. Create Droplet (Ubuntu 22.04)
2. SSH into droplet
3. Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -`
4. Install Node.js: `sudo apt-get install -y nodejs`
5. Use PM2 or systemd method above

### Google Cloud Run

1. Build Docker image
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Set environment variables
5. Configure Cloud Scheduler to keep instance warm

## Post-Deployment Verification

### 1. Check Health Endpoint

```bash
curl http://your-server:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Check Status Endpoint

```bash
curl http://your-server:3000/status
```

Expected response:
```json
{
  "isRunning": true,
  "activeFeedTasks": 0,
  "agentAddress": "0x...",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 120,
  "memoryUsage": {...}
}
```

### 3. Monitor Logs

Check logs for successful feeding:

```bash
# Docker
docker logs -f monadgotchi-agent

# PM2
pm2 logs monadgotchi-agent

# Systemd
sudo journalctl -u monadgotchi-agent -f
```

Look for log entries like:
```
info: Successfully fed pet {"petId":"1","transactionHash":"0x...","attempt":1}
```

### 4. Verify On-Chain Activity

Check the contract on Monad block explorer for recent `PetFed` events from the agent address.

## Monitoring and Maintenance

### Set Up Monitoring

1. **Uptime Monitoring**: Use UptimeRobot, Pingdom, or similar to monitor health endpoint
2. **Log Aggregation**: Use CloudWatch, Datadog, or similar for centralized logging
3. **Alerts**: Set up alerts for:
   - Agent downtime
   - Failed transactions
   - Low ETH balance
   - High error rates

### Regular Maintenance

1. **Check ETH Balance**: Ensure agent wallet has sufficient funds
2. **Review Logs**: Check for errors or unusual activity
3. **Update Dependencies**: Keep packages up to date
4. **Monitor Gas Costs**: Track spending and adjust thresholds if needed

## Troubleshooting

### Agent Not Starting

- Check environment variables are set correctly
- Verify Node.js version (18+)
- Check logs for error messages
- Ensure all dependencies are installed

### Agent Not Feeding Pets

- Verify delegation permissions on-chain
- Check agent wallet has sufficient ETH
- Verify Envio endpoint is accessible
- Check contract address is correct
- Review logs for transaction errors

### High Memory Usage

- Reduce `MAX_CONCURRENT_FEEDS`
- Increase `POLL_INTERVAL_MS`
- Restart agent periodically
- Check for memory leaks in logs

### Connection Errors

- Verify RPC URL is accessible
- Check Envio endpoint is responding
- Ensure network connectivity
- Try alternative RPC endpoints

## Security Best Practices

1. **Private Key Management**
   - Use environment variables or secrets manager
   - Never commit private keys to version control
   - Rotate keys periodically

2. **Access Control**
   - Restrict SSH access to deployment server
   - Use firewall rules to limit exposed ports
   - Enable 2FA on cloud accounts

3. **Monitoring**
   - Set up alerts for unusual activity
   - Monitor transaction patterns
   - Review logs regularly

4. **Gas Management**
   - Set daily spending limits
   - Monitor gas prices
   - Pause during high-fee periods

## Next Steps

After successful deployment:

1. ✅ Verify agent is feeding pets automatically
2. ✅ Update frontend with agent address
3. ✅ Build and deploy frontend (Task 6.4)
4. ✅ Run end-to-end tests (Task 6.5)

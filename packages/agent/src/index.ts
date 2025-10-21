import { loadConfig } from './config.js';
import { createLogger } from './logger.js';
import { EnvioClient } from './envioClient.js';
import { ContractClient } from './contractClient.js';
import { PetSitterAgent } from './petSitterAgent.js';
import { HealthCheckServer } from './healthCheck.js';

/**
 * Main entry point for the Pet Sitter Agent
 */
async function main() {
  // Load configuration
  const config = loadConfig();
  
  // Create logger
  const logger = createLogger(config.logLevel);
  
  logger.info('Initializing Pet Sitter Agent...', {
    contractAddress: config.contract.address,
    envioEndpoint: config.envio.endpoint,
    chainId: config.contract.chainId,
  });

  try {
    // Initialize clients
    const envioClient = new EnvioClient(
      config.envio.endpoint,
      config.agent.maxRetries
    );
    
    const contractClient = new ContractClient(
      config.contract,
      config.privateKey
    );

    // Create agent
    const agent = new PetSitterAgent(
      envioClient,
      contractClient,
      config,
      logger
    );

    // Create health check server
    const healthCheckPort = parseInt(process.env.HEALTH_CHECK_PORT || '3000', 10);
    const healthCheckServer = new HealthCheckServer(agent, logger, healthCheckPort);

    // Set up graceful shutdown
    const shutdown = async () => {
      logger.info('Received shutdown signal');
      healthCheckServer.stop();
      await agent.stop();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    // Start health check server
    healthCheckServer.start();

    // Start agent
    await agent.start();
  } catch (error) {
    logger.error('Failed to start Pet Sitter Agent', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
}

// Run the agent
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export { PetSitterAgent } from './petSitterAgent.js';
export { EnvioClient } from './envioClient.js';
export { ContractClient } from './contractClient.js';
export { loadConfig } from './config.js';
export { createLogger } from './logger.js';

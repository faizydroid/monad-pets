import http from 'http';
import { PetSitterAgent } from './petSitterAgent.js';
import { Logger } from 'winston';

/**
 * Health check HTTP server for monitoring
 */
export class HealthCheckServer {
  private server: http.Server | null = null;
  private agent: PetSitterAgent;
  private logger: Logger;
  private port: number;

  constructor(agent: PetSitterAgent, logger: Logger, port: number = 3000) {
    this.agent = agent;
    this.logger = logger;
    this.port = port;
  }

  /**
   * Start the health check server
   */
  start(): void {
    this.server = http.createServer((req, res) => {
      if (req.url === '/health' && req.method === 'GET') {
        this.handleHealthCheck(req, res);
      } else if (req.url === '/status' && req.method === 'GET') {
        this.handleStatus(req, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    });

    this.server.listen(this.port, () => {
      this.logger.info(`Health check server listening on port ${this.port}`);
    });
  }

  /**
   * Stop the health check server
   */
  stop(): void {
    if (this.server) {
      this.server.close(() => {
        this.logger.info('Health check server stopped');
      });
    }
  }

  /**
   * Handle /health endpoint - simple liveness check
   */
  private handleHealthCheck(req: http.IncomingMessage, res: http.ServerResponse): void {
    const status = this.agent.getStatus();
    const isHealthy = status.isRunning;

    res.writeHead(isHealthy ? 200 : 503, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
      })
    );
  }

  /**
   * Handle /status endpoint - detailed status information
   */
  private handleStatus(req: http.IncomingMessage, res: http.ServerResponse): void {
    const status = this.agent.getStatus();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        ...status,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      })
    );
  }
}

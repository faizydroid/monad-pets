import winston from 'winston';

/**
 * Create a Winston logger instance with structured logging
 */
export function createLogger(logLevel: string = 'info'): winston.Logger {
  return winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports: [
      // Console transport with colorized output
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length
              ? ` ${JSON.stringify(meta)}`
              : '';
            return `${timestamp} [${level}]: ${message}${metaStr}`;
          })
        ),
      }),
      // File transport for all logs
      new winston.transports.File({
        filename: 'agent.log',
        format: winston.format.json(),
      }),
      // File transport for errors only
      new winston.transports.File({
        filename: 'agent-error.log',
        level: 'error',
        format: winston.format.json(),
      }),
    ],
  });
}

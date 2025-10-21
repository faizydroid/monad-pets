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
      MONAD_RPC_URL: process.env.MONAD_RPC_URL || 'https://testnet.monad.xyz',
      CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || '',
      AGENT_PRIVATE_KEY: process.env.AGENT_PRIVATE_KEY || '',
      ENVIO_ENDPOINT: process.env.ENVIO_ENDPOINT || '',
      POLL_INTERVAL_MS: process.env.POLL_INTERVAL_MS || '60000',
      MIN_HUNGER_THRESHOLD: process.env.MIN_HUNGER_THRESHOLD || '90',
      MAX_RETRIES: process.env.MAX_RETRIES || '3',
      MAX_CONCURRENT_FEEDS: process.env.MAX_CONCURRENT_FEEDS || '5',
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
      HEALTH_CHECK_PORT: process.env.HEALTH_CHECK_PORT || '3000'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000
  }]
};

#!/bin/bash

# Envio Deployment Script for Monadgotchi
# Run this in a Linux environment (GitHub Codespaces, WSL, etc.)

set -e

echo "🚀 Starting Envio deployment for Monadgotchi..."

# Check if we're in the right directory
if [ ! -f "config.yaml" ]; then
    echo "❌ Error: config.yaml not found. Make sure you're in the envio directory."
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual values:"
    echo "   - ENVIO_API_KEY (get from https://envio.dev)"
    echo "   - CONTRACT_ADDRESS (your deployed contract)"
    echo "   - START_BLOCK (deployment block number)"
    read -p "Press Enter when .env is updated..."
fi

# Install Envio CLI if not present
if ! command -v envio &> /dev/null; then
    echo "📦 Installing Envio CLI..."
    npm install -g @envio-dev/envio
fi

# Load environment variables
source .env

# Validate required variables
if [ -z "$ENVIO_API_KEY" ] || [ "$ENVIO_API_KEY" = "your_api_key_here" ]; then
    echo "❌ Error: ENVIO_API_KEY not set in .env"
    echo "Get your API key from: https://envio.dev"
    exit 1
fi

if [ -z "$CONTRACT_ADDRESS" ] || [ "$CONTRACT_ADDRESS" = "0x0000000000000000000000000000000000000000" ]; then
    echo "❌ Error: CONTRACT_ADDRESS not set in .env"
    echo "Use your deployed Monadgotchi contract address"
    exit 1
fi

echo "✅ Environment validated"

# Generate TypeScript code
echo "🔧 Generating TypeScript code..."
envio codegen

# Validate configuration
echo "🔍 Validating configuration..."
if [ -f "scripts/validate-config.ts" ]; then
    npm run validate
fi

# Deploy to Envio cloud
echo "🚀 Deploying to Envio cloud..."
envio deploy

# Get deployment info
echo "📊 Getting deployment status..."
envio status

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the GraphQL endpoint from the output above"
echo "2. Update your Windows project .env file:"
echo "   VITE_ENVIO_ENDPOINT=https://indexer.envio.dev/your-project-id/graphql"
echo "3. Restart your frontend and agent"
echo ""
echo "🔗 Useful commands:"
echo "   envio status  - Check deployment status"
echo "   envio logs    - View indexer logs"
echo "   envio restart - Restart indexer"
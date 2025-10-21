#!/bin/bash

# Monadgotchi Frontend Deployment Script
# This script helps deploy the frontend to various platforms

set -e

echo "🚀 Monadgotchi Frontend Deployment"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create a .env file with the required environment variables"
    echo "You can copy .env.example and fill in the values"
    exit 1
fi

# Source environment variables
source .env

# Validate required environment variables
required_vars=("VITE_CONTRACT_ADDRESS" "VITE_MONAD_RPC_URL" "VITE_CHAIN_ID" "VITE_ENVIO_ENDPOINT" "VITE_AGENT_ADDRESS")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Error: Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

echo "✅ Environment variables validated"
echo ""

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Ask user which platform to deploy to
echo "Select deployment platform:"
echo "1) Vercel"
echo "2) Netlify"
echo "3) IPFS (via Fleek)"
echo "4) AWS S3"
echo "5) Skip deployment (build only)"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "❌ Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo ""
        echo "🚀 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "❌ Netlify CLI not found. Installing..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod
        ;;
    3)
        echo ""
        echo "🚀 Deploying to IPFS via Fleek..."
        echo "Please visit https://fleek.co and connect your repository"
        echo "Or use IPFS CLI to upload the dist/ directory"
        ;;
    4)
        echo ""
        echo "🚀 Deploying to AWS S3..."
        read -p "Enter S3 bucket name: " bucket_name
        if [ -z "$bucket_name" ]; then
            echo "❌ Bucket name is required"
            exit 1
        fi
        aws s3 sync dist/ s3://$bucket_name --delete
        echo "✅ Deployed to S3: s3://$bucket_name"
        ;;
    5)
        echo ""
        echo "✅ Build complete. Skipping deployment."
        echo "Build output is in the dist/ directory"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Test the deployed application"
echo "2. Verify wallet connection works"
echo "3. Test contract interactions"
echo "4. Run end-to-end tests"

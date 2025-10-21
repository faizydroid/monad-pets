# Envio Deployment in GitHub Codespaces

## Current Issue
The npm package `@envio-dev/envio` doesn't exist. Envio uses a different installation method.

## Correct Installation Method

### Option 1: Install via curl (Recommended)

```bash
# Install Envio CLI
curl -L https://raw.githubusercontent.com/enviodev/envio/main/install.sh | bash

# Add to PATH (restart terminal or run this)
export PATH="$HOME/.envio/bin:$PATH"

# Verify installation
envio --version
```

### Option 2: Download Binary Directly

```bash
# Create envio directory
mkdir -p ~/.envio/bin

# Download latest binary (replace VERSION with latest)
wget https://github.com/enviodev/envio/releases/latest/download/envio-linux-x64 -O ~/.envio/bin/envio

# Make executable
chmod +x ~/.envio/bin/envio

# Add to PATH
export PATH="$HOME/.envio/bin:$PATH"
echo 'export PATH="$HOME/.envio/bin:$PATH"' >> ~/.bashrc
```

### Option 3: Use pnpm (Alternative)

```bash
# Install pnpm if not available
npm install -g pnpm

# Install envio
pnpm add -g envio

# Or try with npm using the correct package
npm install -g envio-cli
```

## Deployment Steps

Once Envio is installed:

### 1. Navigate to envio directory
```bash
cd envio
```

### 2. Update .env with your API key
```bash
# Edit .env file
nano .env

# Add your API key from https://envio.dev
ENVIO_API_KEY=your_actual_api_key_here
```

### 3. Generate code and deploy
```bash
# Generate TypeScript types
envio codegen

# Deploy to Envio cloud
envio deploy
```

## If Installation Still Fails

### Alternative: Use Docker

```bash
# Pull Envio Docker image
docker pull envio/envio:latest

# Run deployment in container
docker run -it --rm \
  -v $(pwd):/workspace \
  -w /workspace \
  envio/envio:latest \
  sh -c "envio codegen && envio deploy"
```

### Alternative: Manual Setup

If all else fails, you can set up the indexer manually:

1. **Create account at https://envio.dev**
2. **Upload your config files through the web interface**
3. **Deploy via dashboard**

## Troubleshooting

### Check if envio is in PATH
```bash
which envio
echo $PATH
```

### Reinstall if needed
```bash
# Remove old installation
rm -rf ~/.envio

# Reinstall
curl -L https://raw.githubusercontent.com/enviodev/envio/main/install.sh | bash
```

### Check system requirements
```bash
# Check if you have required dependencies
node --version  # Should be >= 16
npm --version
```

## Expected Output After Successful Deployment

```
✅ Deployment successful!
📊 Indexer URL: https://indexer.envio.dev/your-project-id
🔗 GraphQL Endpoint: https://indexer.envio.dev/your-project-id/graphql
📈 Dashboard: https://envio.dev/app/your-project-id
```

## Next Steps After Deployment

1. **Copy the GraphQL endpoint**
2. **Update your main project .env file:**
   ```bash
   VITE_ENVIO_ENDPOINT=https://indexer.envio.dev/your-project-id/graphql
   ```
3. **Test the endpoint:**
   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"query":"{ pets { id petId owner hunger } }"}' \
     https://indexer.envio.dev/your-project-id/graphql
   ```

## Commands to Run in Codespace

```bash
# 1. Install Envio
curl -L https://raw.githubusercontent.com/enviodev/envio/main/install.sh | bash
export PATH="$HOME/.envio/bin:$PATH"

# 2. Navigate to project
cd envio

# 3. Update .env with API key from https://envio.dev
# ENVIO_API_KEY=your_key_here

# 4. Deploy
envio codegen
envio deploy
```

That's it! Your indexer should be live in ~3 minutes.
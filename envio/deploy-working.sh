#!/bin/bash

# Working Envio Deployment Script
# Based on official Envio documentation

set -e

echo "🚀 Deploying Monadgotchi Envio Indexer..."

# Method 1: Try pnpm (recommended by Envio)
echo "📦 Attempting pnpm installation..."
if command -v pnpm &> /dev/null; then
    echo "✅ pnpm found, installing Envio..."
    pnpm install -g envio
    if command -v envio &> /dev/null; then
        echo "✅ Envio installed via pnpm"
        envio --version
        envio codegen
        envio deploy
        exit 0
    fi
fi

# Method 2: Try npx (no installation required)
echo "📦 Trying npx method..."
if npx envio@latest --version &> /dev/null; then
    echo "✅ Using npx envio..."
    npx envio@latest codegen
    npx envio@latest deploy
    exit 0
fi

# Method 3: Try npm global install
echo "📦 Trying npm global install..."
npm install -g envio
if command -v envio &> /dev/null; then
    echo "✅ Envio installed via npm"
    envio --version
    envio codegen
    envio deploy
    exit 0
fi

# Method 4: Manual binary download
echo "📦 Trying manual binary download..."
mkdir -p ~/.local/bin

# Try different binary names
BINARIES=(
    "envio-v2.0.0-linux-x64.tar.gz"
    "envio-linux-x64.tar.gz"
    "envio-linux.tar.gz"
    "envio"
)

for binary in "${BINARIES[@]}"; do
    echo "Trying to download: $binary"
    if curl -L "https://github.com/enviodev/envio/releases/latest/download/$binary" -o "/tmp/envio-download" 2>/dev/null; then
        if [[ "$binary" == *.tar.gz ]]; then
            tar -xzf /tmp/envio-download -C ~/.local/bin 2>/dev/null || continue
        else
            cp /tmp/envio-download ~/.local/bin/envio
        fi
        chmod +x ~/.local/bin/envio
        export PATH="$HOME/.local/bin:$PATH"
        if ~/.local/bin/envio --version &> /dev/null; then
            echo "✅ Manual binary installation successful"
            ~/.local/bin/envio codegen
            ~/.local/bin/envio deploy
            exit 0
        fi
    fi
done

echo "❌ All installation methods failed"
echo "💡 Try using the Envio web dashboard at https://envio.dev"
exit 1
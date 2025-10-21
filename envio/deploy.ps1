# Envio Deployment Script for Monadgotchi (PowerShell version)
# This script helps prepare for deployment but actual deployment needs Linux

param(
    [switch]$Validate,
    [switch]$Prepare
)

Write-Host "🚀 Monadgotchi Envio Setup (Windows)" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "config.yaml")) {
    Write-Host "❌ Error: config.yaml not found. Make sure you're in the envio directory." -ForegroundColor Red
    exit 1
}

# Create .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please update .env with your actual values:" -ForegroundColor Yellow
    Write-Host "   - ENVIO_API_KEY (get from https://envio.dev)" -ForegroundColor Cyan
    Write-Host "   - CONTRACT_ADDRESS (your deployed contract)" -ForegroundColor Cyan
    Write-Host "   - START_BLOCK (44404850)" -ForegroundColor Cyan
}

if ($Validate) {
    Write-Host "🔍 Validating configuration..." -ForegroundColor Blue
    
    # Check if .env has required values
    $envContent = Get-Content ".env" -Raw
    
    if ($envContent -match "ENVIO_API_KEY=your_api_key_here" -or $envContent -notmatch "ENVIO_API_KEY=") {
        Write-Host "❌ ENVIO_API_KEY not set in .env" -ForegroundColor Red
        Write-Host "Get your API key from: https://envio.dev" -ForegroundColor Cyan
    } else {
        Write-Host "✅ ENVIO_API_KEY configured" -ForegroundColor Green
    }
    
    if ($envContent -match "CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000") {
        Write-Host "❌ CONTRACT_ADDRESS not updated in .env" -ForegroundColor Red
        Write-Host "Use your deployed contract address" -ForegroundColor Cyan
    } else {
        Write-Host "✅ CONTRACT_ADDRESS configured" -ForegroundColor Green
    }
    
    # Run TypeScript validation if available
    if (Test-Path "scripts/validate-config.ts") {
        Write-Host "🔧 Running TypeScript validation..." -ForegroundColor Blue
        npm run validate
    }
}

if ($Prepare) {
    Write-Host "📦 Preparing deployment files..." -ForegroundColor Blue
    
    # Create deployment package
    $deployFiles = @(
        "config.yaml",
        "schema.graphql", 
        "package.json",
        "tsconfig.json",
        ".env",
        "src/"
    )
    
    Write-Host "📋 Files ready for deployment:" -ForegroundColor Green
    foreach ($file in $deployFiles) {
        if (Test-Path $file) {
            Write-Host "  ✅ $file" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $file (missing)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "🐧 To deploy Envio, use a Linux environment:" -ForegroundColor Yellow
Write-Host "1. GitHub Codespaces (recommended)" -ForegroundColor Cyan
Write-Host "2. WSL (Windows Subsystem for Linux)" -ForegroundColor Cyan
Write-Host "3. Docker container" -ForegroundColor Cyan
Write-Host "4. Cloud VM" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Deployment commands (run in Linux):" -ForegroundColor Yellow
Write-Host "  npm install -g @envio-dev/envio" -ForegroundColor Cyan
Write-Host "  envio codegen" -ForegroundColor Cyan
Write-Host "  envio deploy" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 Useful links:" -ForegroundColor Yellow
Write-Host "  Envio Dashboard: https://envio.dev" -ForegroundColor Cyan
Write-Host "  Documentation: https://docs.envio.dev" -ForegroundColor Cyan
Write-Host "  GitHub Codespaces: https://github.com/codespaces" -ForegroundColor Cyan
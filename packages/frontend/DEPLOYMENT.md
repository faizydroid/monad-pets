# Frontend Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Deployed Monadgotchi contract on Monad testnet
- Envio indexer deployed and accessible
- Pet Sitter Agent deployed (for automation features)

## Pre-Deployment Setup

### 1. Install Dependencies

```bash
cd packages/frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Update with your configuration:

```env
# Contract Configuration
VITE_CONTRACT_ADDRESS=0x... # From contract deployment
VITE_MONAD_RPC_URL=https://testnet.monad.xyz
VITE_CHAIN_ID=41454

# Envio Configuration
VITE_ENVIO_ENDPOINT=https://indexer.envio.dev/your-deployment-id/graphql

# Agent Configuration
VITE_AGENT_ADDRESS=0x... # Pet Sitter Agent wallet address
```

### 3. Test Locally

Before deploying, test the application locally:

```bash
npm run dev
```

Visit `http://localhost:3000` and verify:
- Wallet connection works
- Contract interactions work (mint, feed)
- Envio queries return data
- Delegation flow works
- All components render correctly

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

Test the production build locally before deploying.

## Deployment Options

Choose one of the following deployment platforms:

1. **Vercel** (Recommended - easiest)
2. **Netlify** (Easy with great features)
3. **IPFS** (Decentralized hosting)
4. **AWS S3 + CloudFront** (Scalable)
5. **GitHub Pages** (Free for public repos)

## Deployment Method 1: Vercel (Recommended)

Vercel provides the easiest deployment with automatic builds and previews.

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **monadgotchi**
   - Directory? **./packages/frontend**
   - Override settings? **N**

5. Set environment variables:
```bash
vercel env add VITE_CONTRACT_ADDRESS
vercel env add VITE_MONAD_RPC_URL
vercel env add VITE_CHAIN_ID
vercel env add VITE_ENVIO_ENDPOINT
vercel env add VITE_AGENT_ADDRESS
```

6. Deploy to production:
```bash
vercel --prod
```

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: **Vite**
   - Root Directory: **packages/frontend**
   - Build Command: **npm run build**
   - Output Directory: **dist**
5. Add environment variables in project settings
6. Click "Deploy"

### Vercel Configuration File

Create `vercel.json` in `packages/frontend/`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Deployment Method 2: Netlify

### Option A: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize site:
```bash
netlify init
```

4. Deploy:
```bash
netlify deploy --prod
```

### Option B: Deploy via Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure:
   - Base directory: **packages/frontend**
   - Build command: **npm run build**
   - Publish directory: **packages/frontend/dist**
5. Add environment variables in site settings
6. Click "Deploy site"

### Netlify Configuration File

Create `netlify.toml` in `packages/frontend/`:

```toml
[build]
  base = "packages/frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## Deployment Method 3: IPFS (Decentralized)

Deploy to IPFS for fully decentralized hosting.

### Using Fleek

1. Go to [fleek.co](https://fleek.co)
2. Sign up and connect your Git repository
3. Configure:
   - Framework: **Vite**
   - Build command: **npm run build**
   - Publish directory: **dist**
   - Base directory: **packages/frontend**
4. Add environment variables
5. Deploy

### Using IPFS CLI

1. Install IPFS:
```bash
npm install -g ipfs
```

2. Initialize IPFS:
```bash
ipfs init
```

3. Start IPFS daemon:
```bash
ipfs daemon
```

4. Add build directory to IPFS:
```bash
cd packages/frontend
npm run build
ipfs add -r dist
```

5. Pin the content:
```bash
ipfs pin add <CID>
```

6. Access via IPFS gateway:
```
https://ipfs.io/ipfs/<CID>
```

### Using Pinata

1. Go to [pinata.cloud](https://pinata.cloud)
2. Sign up for an account
3. Upload the `dist` folder
4. Get the IPFS CID
5. Access via: `https://gateway.pinata.cloud/ipfs/<CID>`

## Deployment Method 4: AWS S3 + CloudFront

### 1. Create S3 Bucket

```bash
aws s3 mb s3://monadgotchi-frontend
```

### 2. Configure Bucket for Static Hosting

```bash
aws s3 website s3://monadgotchi-frontend \
  --index-document index.html \
  --error-document index.html
```

### 3. Upload Build Files

```bash
cd packages/frontend
npm run build
aws s3 sync dist/ s3://monadgotchi-frontend --delete
```

### 4. Set Bucket Policy

Create `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::monadgotchi-frontend/*"
    }
  ]
}
```

Apply policy:
```bash
aws s3api put-bucket-policy \
  --bucket monadgotchi-frontend \
  --policy file://bucket-policy.json
```

### 5. Create CloudFront Distribution

```bash
aws cloudfront create-distribution \
  --origin-domain-name monadgotchi-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

### 6. Configure Custom Error Pages

Set 404 errors to return `index.html` for client-side routing.

## Deployment Method 5: GitHub Pages

### 1. Install gh-pages

```bash
npm install --save-dev gh-pages
```

### 2. Update package.json

Add to `packages/frontend/package.json`:

```json
{
  "homepage": "https://yourusername.github.io/monadgotchi",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 3. Update Vite Config

Update `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/monadgotchi/', // Your repo name
  build: {
    outDir: 'dist',
  },
});
```

### 4. Deploy

```bash
npm run deploy
```

## Post-Deployment Configuration

### 1. Update Environment Variables

Ensure all environment variables are set in your hosting platform:

- `VITE_CONTRACT_ADDRESS`
- `VITE_MONAD_RPC_URL`
- `VITE_CHAIN_ID`
- `VITE_ENVIO_ENDPOINT`
- `VITE_AGENT_ADDRESS`

### 2. Configure Custom Domain (Optional)

#### Vercel
1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

#### Netlify
1. Go to site settings → Domain management
2. Add custom domain
3. Update DNS records

#### IPFS with ENS
1. Register ENS domain
2. Set content hash to IPFS CID
3. Access via `yourdomain.eth.link`

### 3. Enable HTTPS

Most platforms enable HTTPS automatically. For custom setups:

- Use Let's Encrypt for free SSL certificates
- Configure SSL in CloudFront or your CDN
- Ensure all API calls use HTTPS

## Verification

### 1. Test Wallet Connection

1. Visit your deployed site
2. Click "Connect Wallet"
3. Approve MetaMask connection
4. Verify correct network (Monad testnet)

### 2. Test Contract Interactions

1. Try minting a pet
2. Try feeding a pet
3. Verify transactions on Monad block explorer

### 3. Test Envio Integration

1. Check that pet data loads
2. Verify hunger updates every 30 seconds
3. Check transaction history displays

### 4. Test Delegation Flow

1. Click "Hire a Pet Sitter"
2. Sign delegation message
3. Verify "Pet Sitter Active" indicator appears

### 5. Cross-Browser Testing

Test on:
- Chrome
- Firefox
- Safari
- Brave
- Mobile browsers

## Monitoring and Analytics

### Add Analytics

#### Google Analytics

1. Create GA4 property
2. Add tracking code to `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### Plausible Analytics (Privacy-friendly)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### Error Tracking

#### Sentry

1. Install Sentry:
```bash
npm install @sentry/react
```

2. Initialize in `main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

## Performance Optimization

### 1. Enable Compression

Most platforms enable gzip/brotli automatically. For custom setups, configure your server.

### 2. Configure Caching

Set cache headers for static assets:

```
Cache-Control: public, max-age=31536000, immutable
```

### 3. Optimize Images

- Use WebP format
- Compress images
- Use responsive images

### 4. Code Splitting

Vite handles this automatically, but verify:

```bash
npm run build -- --report
```

### 5. CDN Configuration

Use CDN for faster global delivery:
- Vercel and Netlify include CDN
- For custom setups, use CloudFront or Cloudflare

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'packages/frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd packages/frontend
          npm ci
      
      - name: Build
        run: |
          cd packages/frontend
          npm run build
        env:
          VITE_CONTRACT_ADDRESS: ${{ secrets.VITE_CONTRACT_ADDRESS }}
          VITE_MONAD_RPC_URL: ${{ secrets.VITE_MONAD_RPC_URL }}
          VITE_CHAIN_ID: ${{ secrets.VITE_CHAIN_ID }}
          VITE_ENVIO_ENDPOINT: ${{ secrets.VITE_ENVIO_ENDPOINT }}
          VITE_AGENT_ADDRESS: ${{ secrets.VITE_AGENT_ADDRESS }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: packages/frontend
```

## Troubleshooting

### Build Fails

- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check for TypeScript errors
- Verify all dependencies are installed

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Rebuild after changing variables
- Check platform-specific env var configuration

### Wallet Connection Issues

- Verify MetaMask is installed
- Check network configuration
- Ensure RPC URL is correct
- Test with different wallets

### Contract Interaction Fails

- Verify contract address is correct
- Check wallet has testnet ETH
- Ensure correct network (Monad testnet)
- Check contract ABI matches deployed contract

### Envio Queries Fail

- Verify endpoint URL is correct
- Check CORS configuration
- Test endpoint with GraphQL playground
- Ensure indexer is synced

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use platform secrets management
   - Rotate sensitive values regularly

2. **Content Security Policy**
   - Add CSP headers to prevent XSS
   - Whitelist trusted domains

3. **HTTPS Only**
   - Always use HTTPS in production
   - Set secure cookie flags

4. **Dependency Security**
   - Run `npm audit` regularly
   - Keep dependencies updated
   - Use Dependabot or Renovate

## Next Steps

After successful deployment:

1. ✅ Test all user flows in production
2. ✅ Share deployment URL with team
3. ✅ Run end-to-end tests (Task 6.5)
4. ✅ Monitor for errors and performance issues
5. ✅ Gather user feedback

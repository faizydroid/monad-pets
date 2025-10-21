import * as fs from 'fs';
import * as path from 'path';

function validateBuild() {
  console.log('🔍 Validating frontend build...\n');

  let hasErrors = false;
  let hasWarnings = false;

  // Check if .env file exists
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found');
    console.log('   Please create a .env file with required environment variables');
    hasErrors = true;
  } else {
    console.log('✅ .env file exists');

    // Read and validate environment variables
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
      'VITE_CONTRACT_ADDRESS',
      'VITE_MONAD_RPC_URL',
      'VITE_CHAIN_ID',
      'VITE_ENVIO_ENDPOINT',
      'VITE_AGENT_ADDRESS'
    ];

    console.log('\n📋 Checking environment variables:');
    for (const varName of requiredVars) {
      const regex = new RegExp(`${varName}=(.+)`);
      const match = envContent.match(regex);
      
      if (!match || !match[1] || match[1].trim() === '') {
        console.error(`❌ ${varName} is not set or empty`);
        hasErrors = true;
      } else {
        const value = match[1].trim();
        
        // Validate specific formats
        if (varName === 'VITE_CONTRACT_ADDRESS' || varName === 'VITE_AGENT_ADDRESS') {
          if (!value.match(/^0x[a-fA-F0-9]{40}$/)) {
            console.error(`❌ ${varName} is not a valid Ethereum address: ${value}`);
            hasErrors = true;
          } else {
            console.log(`✅ ${varName} is set`);
          }
        } else if (varName === 'VITE_CHAIN_ID') {
          if (value !== '41454') {
            console.warn(`⚠️  ${varName} is ${value}, expected 41454 for Monad testnet`);
            hasWarnings = true;
          } else {
            console.log(`✅ ${varName} is set to 41454 (Monad testnet)`);
          }
        } else if (varName === 'VITE_ENVIO_ENDPOINT') {
          if (!value.startsWith('http')) {
            console.error(`❌ ${varName} should be a valid URL: ${value}`);
            hasErrors = true;
          } else {
            console.log(`✅ ${varName} is set`);
          }
        } else {
          console.log(`✅ ${varName} is set`);
        }
      }
    }
  }

  // Check if dist directory exists
  console.log('\n📦 Checking build output:');
  const distPath = path.join(__dirname, '../dist');
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist/ directory not found');
    console.log('   Run "npm run build" to create the production build');
    hasErrors = true;
  } else {
    console.log('✅ dist/ directory exists');

    // Check for index.html
    const indexPath = path.join(distPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      console.error('❌ dist/index.html not found');
      hasErrors = true;
    } else {
      console.log('✅ dist/index.html exists');
    }

    // Check for assets directory
    const assetsPath = path.join(distPath, 'assets');
    if (!fs.existsSync(assetsPath)) {
      console.warn('⚠️  dist/assets/ directory not found');
      hasWarnings = true;
    } else {
      console.log('✅ dist/assets/ directory exists');

      // Count files in assets
      const assetFiles = fs.readdirSync(assetsPath);
      console.log(`   Found ${assetFiles.length} asset files`);
    }
  }

  // Check package.json scripts
  console.log('\n📋 Checking package.json scripts:');
  const packagePath = path.join(__dirname, '../package.json');
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const requiredScripts = ['dev', 'build', 'preview'];
    
    for (const script of requiredScripts) {
      if (packageJson.scripts && packageJson.scripts[script]) {
        console.log(`✅ Script "${script}" is defined`);
      } else {
        console.error(`❌ Script "${script}" is missing`);
        hasErrors = true;
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    console.log('❌ Validation failed with errors');
    console.log('\nPlease fix the errors above before deploying.');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('⚠️  Validation passed with warnings');
    console.log('\nYou can proceed with deployment, but review the warnings.');
  } else {
    console.log('✅ Validation passed');
    console.log('\nYou can now deploy the application:');
    console.log('  npm run deploy (if configured)');
    console.log('  vercel --prod');
    console.log('  netlify deploy --prod');
  }
}

validateBuild();

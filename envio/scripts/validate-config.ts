import * as fs from 'fs';
import * as path from 'path';

function validateConfig() {
  console.log('🔍 Validating Envio configuration for Monadgotchi...\n');

  let hasErrors = false;
  let warnings = 0;

  // Check if config.yaml exists
  const configPath = path.join(__dirname, '../config.yaml');
  if (!fs.existsSync(configPath)) {
    console.error('❌ config.yaml not found');
    hasErrors = true;
    return;
  }

  // Read and validate config.yaml
  const configContent = fs.readFileSync(configPath, 'utf8');

  // Check network configuration
  console.log('🌐 Validating network configuration:');
  if (configContent.includes('id: 10143')) {
    console.log('✅ Monad testnet chain ID (10143) configured');
  } else {
    console.error('❌ Monad testnet chain ID (10143) not found');
    hasErrors = true;
  }

  // Check RPC configuration
  if (configContent.includes('https://testnet-rpc.monad.xyz')) {
    console.log('✅ Monad testnet RPC URL configured');
  } else {
    console.warn('⚠️  Monad testnet RPC URL not found or different');
    warnings++;
  }

  // Check contract address
  console.log('\n📋 Validating contract configuration:');
  const expectedAddress = '0x750E675Fb7f1fBDe1944889AE12d311e3ae7E06b';
  
  if (configContent.includes('0x0000000000000000000000000000000000000000')) {
    console.error('❌ Contract address is still placeholder (0x0000...)');
    console.log(`   Please update config.yaml with: ${expectedAddress}`);
    hasErrors = true;
  } else if (configContent.includes(expectedAddress)) {
    console.log('✅ Monadgotchi contract address configured:', expectedAddress);
  } else {
    const match = configContent.match(/address:\s*-\s*"(0x[a-fA-F0-9]{40})"/);
    if (match) {
      console.warn('⚠️  Contract address configured but different from expected:');
      console.log(`   Found: ${match[1]}`);
      console.log(`   Expected: ${expectedAddress}`);
      warnings++;
    } else {
      console.error('❌ Contract address format invalid or missing');
      hasErrors = true;
    }
  }

  // Check start_block
  const expectedStartBlock = 44404850;
  const startBlockMatch = configContent.match(/start_block:\s*(\d+)/);
  if (startBlockMatch) {
    const startBlock = parseInt(startBlockMatch[1]);
    if (startBlock === 0) {
      console.warn('⚠️  start_block is set to 0 (will index from genesis - very slow!)');
      console.log(`   Recommended: ${expectedStartBlock} (deployment block)`);
      warnings++;
    } else if (startBlock === expectedStartBlock) {
      console.log('✅ start_block configured correctly:', startBlock);
    } else {
      console.log(`✅ start_block configured: ${startBlock}`);
      if (startBlock < expectedStartBlock) {
        console.warn(`⚠️  start_block (${startBlock}) is before deployment (${expectedStartBlock})`);
        warnings++;
      }
    }
  } else {
    console.error('❌ start_block not found in config');
    hasErrors = true;
  }

  // Check for required event definitions
  const requiredEvents = [
    'PetMinted',
    'PetHungerUpdated',
    'PetFainted',
    'PetFed'
  ];

  console.log('\n📋 Checking event definitions:');
  for (const event of requiredEvents) {
    if (configContent.includes(event)) {
      console.log(`✅ ${event} event configured`);
    } else {
      console.error(`❌ ${event} event missing`);
      hasErrors = true;
    }
  }

  // Check if schema.graphql exists
  console.log('\n📋 Checking schema files:');
  const schemaPath = path.join(__dirname, '../schema.graphql');
  if (fs.existsSync(schemaPath)) {
    console.log('✅ schema.graphql exists');
  } else {
    console.error('❌ schema.graphql not found');
    hasErrors = true;
  }

  // Check if event handlers exist
  const handlersPath = path.join(__dirname, '../src/EventHandlers.ts');
  if (fs.existsSync(handlersPath)) {
    console.log('✅ EventHandlers.ts exists');
  } else {
    console.error('❌ EventHandlers.ts not found');
    hasErrors = true;
  }

  // Check .env file
  console.log('\n🔧 Checking environment configuration:');
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file exists');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('ENVIO_API_KEY=your_api_key_here') || !envContent.includes('ENVIO_API_KEY=')) {
      console.error('❌ ENVIO_API_KEY not configured in .env');
      console.log('   Get your API key from: https://envio.dev');
      hasErrors = true;
    } else {
      console.log('✅ ENVIO_API_KEY configured');
    }
  } else {
    console.warn('⚠️  .env file not found (copy from .env.example)');
    warnings++;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  if (hasErrors) {
    console.log('❌ Configuration validation failed');
    console.log('\n🔧 Please fix the errors above before deploying.');
    console.log('\n📋 Quick fixes:');
    console.log('  1. Update contract address in config.yaml');
    console.log('  2. Set proper start_block in config.yaml');
    console.log('  3. Create .env file with ENVIO_API_KEY');
    process.exit(1);
  } else {
    console.log('✅ Configuration validation passed');
    if (warnings > 0) {
      console.log(`⚠️  ${warnings} warning(s) found (non-blocking)`);
    }
    console.log('\n🚀 Ready to deploy! Next steps:');
    console.log('  1. Use Linux environment (GitHub Codespaces recommended)');
    console.log('  2. Run: npm install -g @envio-dev/envio');
    console.log('  3. Run: envio codegen');
    console.log('  4. Run: envio deploy');
    console.log('\n🔗 Deployment guide: ./ENVIO_SETUP_GUIDE.md');
  }
}

validateConfig();

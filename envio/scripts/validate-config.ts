import * as fs from 'fs';
import * as path from 'path';

function validateConfig() {
  console.log('🔍 Validating Envio configuration...\n');

  let hasErrors = false;

  // Check if config.yaml exists
  const configPath = path.join(__dirname, '../config.yaml');
  if (!fs.existsSync(configPath)) {
    console.error('❌ config.yaml not found');
    hasErrors = true;
    return;
  }

  // Read and validate config.yaml
  const configContent = fs.readFileSync(configPath, 'utf8');

  // Check for placeholder contract address
  if (configContent.includes('0x0000000000000000000000000000000000000000')) {
    console.error('❌ Contract address is still placeholder (0x0000...)');
    console.log('   Please update config.yaml with the deployed contract address');
    hasErrors = true;
  } else if (configContent.match(/address:\s*-\s*"(0x[a-fA-F0-9]{40})"/)) {
    const match = configContent.match(/address:\s*-\s*"(0x[a-fA-F0-9]{40})"/);
    console.log('✅ Contract address configured:', match![1]);
  } else {
    console.error('❌ Contract address format invalid');
    hasErrors = true;
  }

  // Check start_block
  const startBlockMatch = configContent.match(/start_block:\s*(\d+)/);
  if (startBlockMatch) {
    const startBlock = parseInt(startBlockMatch[1]);
    if (startBlock === 0) {
      console.warn('⚠️  start_block is set to 0 (will index from genesis)');
      console.log('   Consider setting it to the deployment block for faster syncing');
    } else {
      console.log('✅ start_block configured:', startBlock);
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

  // Summary
  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    console.log('❌ Configuration validation failed');
    console.log('\nPlease fix the errors above before deploying.');
    process.exit(1);
  } else {
    console.log('✅ Configuration validation passed');
    console.log('\nYou can now deploy the indexer:');
    console.log('  envio codegen');
    console.log('  envio deploy');
  }
}

validateConfig();

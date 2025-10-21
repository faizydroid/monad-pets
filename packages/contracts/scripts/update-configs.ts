import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('Updating configuration files with deployment info...');

  // Read deployment info
  const deploymentFile = path.join(__dirname, '../deployments/monad-testnet.json');
  
  if (!fs.existsSync(deploymentFile)) {
    console.error('❌ Deployment file not found. Please deploy the contract first.');
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  const { contractAddress, deploymentBlock } = deploymentInfo;

  console.log('Contract Address:', contractAddress);
  console.log('Deployment Block:', deploymentBlock);

  // Update Envio config.yaml
  console.log('\n📝 Updating envio/config.yaml...');
  const envioConfigPath = path.join(__dirname, '../../../envio/config.yaml');
  
  if (fs.existsSync(envioConfigPath)) {
    let envioConfig = fs.readFileSync(envioConfigPath, 'utf8');
    
    // Replace placeholder address
    envioConfig = envioConfig.replace(
      /address:\s*-\s*"0x0+"/,
      `address:\n          - "${contractAddress}"`
    );
    
    // Replace start_block
    envioConfig = envioConfig.replace(
      /start_block:\s*\d+/,
      `start_block: ${deploymentBlock}`
    );
    
    fs.writeFileSync(envioConfigPath, envioConfig);
    console.log('✅ Updated envio/config.yaml');
  } else {
    console.log('⚠️  envio/config.yaml not found, skipping...');
  }

  // Update agent .env.example
  console.log('\n📝 Updating packages/agent/.env.example...');
  const agentEnvPath = path.join(__dirname, '../../agent/.env.example');
  
  if (fs.existsSync(agentEnvPath)) {
    let agentEnv = fs.readFileSync(agentEnvPath, 'utf8');
    agentEnv = agentEnv.replace(
      /CONTRACT_ADDRESS=.*/,
      `CONTRACT_ADDRESS=${contractAddress}`
    );
    fs.writeFileSync(agentEnvPath, agentEnv);
    console.log('✅ Updated packages/agent/.env.example');
  }

  // Update frontend .env.example
  console.log('\n📝 Updating packages/frontend/.env.example...');
  const frontendEnvPath = path.join(__dirname, '../../frontend/.env.example');
  
  if (fs.existsSync(frontendEnvPath)) {
    let frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
    frontendEnv = frontendEnv.replace(
      /VITE_CONTRACT_ADDRESS=.*/,
      `VITE_CONTRACT_ADDRESS=${contractAddress}`
    );
    fs.writeFileSync(frontendEnvPath, frontendEnv);
    console.log('✅ Updated packages/frontend/.env.example');
  }

  console.log('\n✅ All configuration files updated!');
  console.log('\n📋 Next steps:');
  console.log('1. Copy .env.example files to .env in agent and frontend packages');
  console.log('2. Fill in remaining environment variables (private keys, endpoints)');
  console.log('3. Deploy Envio indexer (Task 6.2)');
  console.log('4. Deploy Pet Sitter Agent (Task 6.3)');
  console.log('5. Build and deploy frontend (Task 6.4)');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

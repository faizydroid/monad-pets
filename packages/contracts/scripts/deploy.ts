import { ethers } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('Deploying Monadgotchi contract...');

  // Get the contract factory
  const Monadgotchi = await ethers.getContractFactory('Monadgotchi');
  
  // Deploy the contract
  console.log('Deploying contract...');
  const monadgotchi = await Monadgotchi.deploy();
  
  // Wait for deployment to complete
  await monadgotchi.waitForDeployment();
  
  const contractAddress = await monadgotchi.getAddress();
  const deploymentBlock = await ethers.provider.getBlockNumber();
  
  console.log('✅ Monadgotchi deployed successfully!');
  console.log('Contract address:', contractAddress);
  console.log('Deployment block:', deploymentBlock);
  console.log('Network:', (await ethers.provider.getNetwork()).name);
  console.log('Chain ID:', (await ethers.provider.getNetwork()).chainId);
  
  // Save deployment info to a file
  const deploymentInfo = {
    contractAddress,
    deploymentBlock,
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    timestamp: new Date().toISOString(),
  };
  
  const deploymentPath = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentPath, 'monad-testnet.json');
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log('\n📝 Deployment info saved to:', deploymentFile);
  console.log('\n📋 Next steps:');
  console.log('1. Update envio/config.yaml with contract address and start block');
  console.log('2. Update packages/agent/.env with CONTRACT_ADDRESS');
  console.log('3. Update packages/frontend/.env with VITE_CONTRACT_ADDRESS');
  console.log('\nContract Address:', contractAddress);
  console.log('Start Block:', deploymentBlock);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

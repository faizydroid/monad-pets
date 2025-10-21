import { run } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('Verifying Monadgotchi contract on Monad block explorer...');

  // Read deployment info
  const deploymentFile = path.join(__dirname, '../deployments/monad-testnet.json');
  
  if (!fs.existsSync(deploymentFile)) {
    console.error('❌ Deployment file not found. Please deploy the contract first.');
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  const { contractAddress } = deploymentInfo;

  console.log('Contract address:', contractAddress);
  console.log('Verifying...');

  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: [],
    });
    
    console.log('✅ Contract verified successfully!');
  } catch (error: any) {
    if (error.message.includes('Already Verified')) {
      console.log('✅ Contract is already verified!');
    } else {
      console.error('❌ Verification failed:', error.message);
      throw error;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

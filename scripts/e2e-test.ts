import { ethers } from 'ethers';
import { GraphQLClient, gql } from 'graphql-request';
import * as fs from 'fs';
import * as path from 'path';

interface E2EConfig {
  contractAddress: string;
  envioEndpoint: string;
  agentAddress: string;
  monadRpcUrl: string;
  chainId: number;
  testWalletPrivateKey?: string;
}

class E2ETestRunner {
  private config: E2EConfig;
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private envioClient: GraphQLClient;
  private testWallet?: ethers.Wallet;

  constructor(configPath: string) {
    // Load configuration
    const configContent = fs.readFileSync(configPath, 'utf8');
    this.config = JSON.parse(configContent);

    // Initialize provider
    this.provider = new ethers.JsonRpcProvider(this.config.monadRpcUrl);

    // Initialize Envio client
    this.envioClient = new GraphQLClient(this.config.envioEndpoint);

    // Load contract ABI
    const contractABI = this.loadContractABI();
    this.contract = new ethers.Contract(
      this.config.contractAddress,
      contractABI,
      this.provider
    );

    // Initialize test wallet if private key provided
    if (this.config.testWalletPrivateKey) {
      this.testWallet = new ethers.Wallet(
        this.config.testWalletPrivateKey,
        this.provider
      );
    }
  }

  private loadContractABI(): any[] {
    // Load ABI from artifacts
    const artifactPath = path.join(
      __dirname,
      '../packages/contracts/artifacts/contracts/Monadgotchi.sol/Monadgotchi.json'
    );
    
    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
      return artifact.abi;
    }

    // Fallback to minimal ABI
    return [
      'function mint() external returns (uint256)',
      'function feed(uint256 petId) external',
      'function getCurrentHunger(uint256 petId) public view returns (uint256)',
      'function getPetStatus(uint256 petId) public view returns (tuple(uint256 tokenId, address owner, uint256 hunger, uint256 lastFeedBlock, bool isFainted))',
      'function grantDelegation(address delegate, uint256 petId) external',
      'function revokeDelegation(address delegate, uint256 petId) external',
      'function delegations(address owner, address delegate, uint256 petId) public view returns (bool)',
      'event PetMinted(uint256 indexed petId, address indexed owner, uint256 timestamp)',
      'event PetFed(uint256 indexed petId, address indexed feeder, uint256 timestamp)'
    ];
  }

  async runTests(): Promise<void> {
    console.log('🧪 Starting E2E Tests\n');
    console.log('Configuration:');
    console.log(`  Contract: ${this.config.contractAddress}`);
    console.log(`  Envio: ${this.config.envioEndpoint}`);
    console.log(`  Agent: ${this.config.agentAddress}`);
    console.log(`  Chain ID: ${this.config.chainId}\n`);

    let passedTests = 0;
    let failedTests = 0;

    // Test 1: Contract Deployment Verification
    try {
      await this.testContractDeployment();
      console.log('✅ Test 1: Contract Deployment - PASSED\n');
      passedTests++;
    } catch (error) {
      console.error('❌ Test 1: Contract Deployment - FAILED');
      console.error(`   Error: ${error}\n`);
      failedTests++;
    }

    // Test 2: Envio Indexer Connectivity
    try {
      await this.testEnvioConnectivity();
      console.log('✅ Test 2: Envio Connectivity - PASSED\n');
      passedTests++;
    } catch (error) {
      console.error('❌ Test 2: Envio Connectivity - FAILED');
      console.error(`   Error: ${error}\n`);
      failedTests++;
    }

    // Test 3: Query Pets from Envio
    try {
      await this.testQueryPets();
      console.log('✅ Test 3: Query Pets - PASSED\n');
      passedTests++;
    } catch (error) {
      console.error('❌ Test 3: Query Pets - FAILED');
      console.error(`   Error: ${error}\n`);
      failedTests++;
    }

    // Test 4: Agent Address Verification
    try {
      await this.testAgentAddress();
      console.log('✅ Test 4: Agent Address - PASSED\n');
      passedTests++;
    } catch (error) {
      console.error('❌ Test 4: Agent Address - FAILED');
      console.error(`   Error: ${error}\n`);
      failedTests++;
    }

    // Test 5: Contract Read Functions
    try {
      await this.testContractReadFunctions();
      console.log('✅ Test 5: Contract Read Functions - PASSED\n');
      passedTests++;
    } catch (error) {
      console.error('❌ Test 5: Contract Read Functions - FAILED');
      console.error(`   Error: ${error}\n`);
      failedTests++;
    }

    // Summary
    console.log('='.repeat(50));
    console.log(`\n📊 Test Summary:`);
    console.log(`   Passed: ${passedTests}`);
    console.log(`   Failed: ${failedTests}`);
    console.log(`   Total: ${passedTests + failedTests}\n`);

    if (failedTests === 0) {
      console.log('✅ All automated tests passed!');
      console.log('\n📋 Next steps:');
      console.log('1. Run manual E2E tests (see E2E_TESTING.md)');
      console.log('2. Test wallet connection in frontend');
      console.log('3. Test minting and feeding flows');
      console.log('4. Test delegation and automation');
    } else {
      console.log('❌ Some tests failed. Please review and fix issues.');
      process.exit(1);
    }
  }

  private async testContractDeployment(): Promise<void> {
    console.log('Testing contract deployment...');
    
    // Check if contract exists at address
    const code = await this.provider.getCode(this.config.contractAddress);
    
    if (code === '0x') {
      throw new Error('No contract found at address');
    }

    console.log(`  Contract code size: ${code.length} bytes`);
    
    // Try to read nextTokenId
    try {
      const nextTokenId = await this.contract.nextTokenId();
      console.log(`  Next token ID: ${nextTokenId}`);
    } catch (error) {
      throw new Error('Failed to read contract state');
    }
  }

  private async testEnvioConnectivity(): Promise<void> {
    console.log('Testing Envio indexer connectivity...');
    
    const query = gql`
      query {
        pets(limit: 1) {
          id
        }
      }
    `;

    try {
      const data = await this.envioClient.request(query);
      console.log(`  Envio is accessible`);
      console.log(`  Response: ${JSON.stringify(data)}`);
    } catch (error: any) {
      throw new Error(`Failed to connect to Envio: ${error.message}`);
    }
  }

  private async testQueryPets(): Promise<void> {
    console.log('Testing pet queries...');
    
    const query = gql`
      query {
        pets(limit: 10) {
          id
          petId
          owner
          hunger
          isFainted
        }
      }
    `;

    const data: any = await this.envioClient.request(query);
    
    if (!data.pets) {
      throw new Error('No pets field in response');
    }

    console.log(`  Found ${data.pets.length} pets`);
    
    if (data.pets.length > 0) {
      const pet = data.pets[0];
      console.log(`  Sample pet: ID=${pet.petId}, Owner=${pet.owner}, Hunger=${pet.hunger}`);
    }
  }

  private async testAgentAddress(): Promise<void> {
    console.log('Testing agent address...');
    
    // Verify agent address is valid Ethereum address
    if (!ethers.isAddress(this.config.agentAddress)) {
      throw new Error('Invalid agent address format');
    }

    console.log(`  Agent address is valid: ${this.config.agentAddress}`);
    
    // Check agent balance
    const balance = await this.provider.getBalance(this.config.agentAddress);
    console.log(`  Agent balance: ${ethers.formatEther(balance)} ETH`);
    
    if (balance === 0n) {
      console.warn('  ⚠️  Warning: Agent has zero balance');
    }
  }

  private async testContractReadFunctions(): Promise<void> {
    console.log('Testing contract read functions...');
    
    // Test constants
    try {
      const maxHunger = await this.contract.MAX_HUNGER();
      console.log(`  MAX_HUNGER: ${maxHunger}`);
      
      const blocksPerTenMin = await this.contract.BLOCKS_PER_10_MIN();
      console.log(`  BLOCKS_PER_10_MIN: ${blocksPerTenMin}`);
      
      const nextTokenId = await this.contract.nextTokenId();
      console.log(`  nextTokenId: ${nextTokenId}`);
    } catch (error: any) {
      throw new Error(`Failed to read contract constants: ${error.message}`);
    }
  }
}

// Main execution
async function main() {
  const configPath = process.argv[2] || './e2e-config.json';
  
  if (!fs.existsSync(configPath)) {
    console.error('❌ Configuration file not found:', configPath);
    console.log('\nPlease create e2e-config.json with the following structure:');
    console.log(JSON.stringify({
      contractAddress: '0x...',
      envioEndpoint: 'https://indexer.envio.dev/...',
      agentAddress: '0x...',
      monadRpcUrl: 'https://testnet.monad.xyz',
      chainId: 41454
    }, null, 2));
    process.exit(1);
  }

  const runner = new E2ETestRunner(configPath);
  await runner.runTests();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

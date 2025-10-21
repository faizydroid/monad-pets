import { ethers, Contract, Wallet, JsonRpcProvider } from 'ethers';
import { MONADGOTCHI_ABI } from './contractABI.js';
import { ContractConfig } from '@monadgotchi/types';

export interface FeedResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Contract client for interacting with the Monadgotchi contract
 */
export class ContractClient {
  private contract: Contract;
  private wallet: Wallet;
  private provider: JsonRpcProvider;

  constructor(config: ContractConfig, privateKey: string) {
    // Create provider
    this.provider = new JsonRpcProvider(config.rpcUrl);

    // Create wallet
    this.wallet = new Wallet(privateKey, this.provider);

    // Create contract instance
    this.contract = new Contract(
      config.address,
      MONADGOTCHI_ABI,
      this.wallet
    );
  }

  /**
   * Get the agent's wallet address
   */
  getAgentAddress(): string {
    return this.wallet.address;
  }

  /**
   * Feed a pet using delegated permissions
   * @param petId The ID of the pet to feed
   * @returns Feed result with transaction hash or error
   */
  async feedPet(petId: bigint): Promise<FeedResult> {
    try {
      // Estimate gas for the transaction
      const gasEstimate = await this.contract.feed.estimateGas(petId);

      // Get current gas price with a 10% buffer
      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice
        ? (feeData.gasPrice * 110n) / 100n
        : undefined;

      // Send the transaction
      const tx = await this.contract.feed(petId, {
        gasLimit: (gasEstimate * 120n) / 100n, // Add 20% buffer to gas estimate
        gasPrice,
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        return {
          success: true,
          transactionHash: receipt.hash,
        };
      } else {
        return {
          success: false,
          error: 'Transaction failed',
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Check if the agent has delegation to feed a specific pet
   * @param owner The owner's address
   * @param petId The pet ID
   * @returns True if delegation exists
   */
  async hasDelegation(owner: string, petId: bigint): Promise<boolean> {
    try {
      const hasDelegation = await this.contract.delegations(
        owner,
        this.wallet.address,
        petId
      );
      return hasDelegation;
    } catch (error) {
      console.error('Error checking delegation:', error);
      return false;
    }
  }

  /**
   * Get the current hunger level of a pet
   * @param petId The pet ID
   * @returns Current hunger level (0-100)
   */
  async getCurrentHunger(petId: bigint): Promise<number> {
    try {
      const hunger = await this.contract.getCurrentHunger(petId);
      return Number(hunger);
    } catch (error) {
      throw new Error(
        `Failed to get hunger for pet ${petId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get the complete status of a pet
   * @param petId The pet ID
   * @returns Pet status
   */
  async getPetStatus(petId: bigint): Promise<{
    tokenId: bigint;
    owner: string;
    hunger: bigint;
    lastFeedBlock: bigint;
    isFainted: boolean;
  }> {
    try {
      const status = await this.contract.getPetStatus(petId);
      return {
        tokenId: status[0],
        owner: status[1],
        hunger: status[2],
        lastFeedBlock: status[3],
        isFainted: status[4],
      };
    } catch (error) {
      throw new Error(
        `Failed to get status for pet ${petId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

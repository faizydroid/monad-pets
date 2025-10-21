import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Monadgotchi } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('Monadgotchi', function () {
  let monadgotchi: Monadgotchi;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let agent: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, agent] = await ethers.getSigners();
    
    const MonadgotchiFactory = await ethers.getContractFactory('Monadgotchi');
    monadgotchi = await MonadgotchiFactory.deploy();
    await monadgotchi.waitForDeployment();
  });

  describe('Minting', function () {
    it('should mint a pet with correct initial state', async function () {
      const tx = await monadgotchi.connect(user1).mint();
      const receipt = await tx.wait();
      
      // Check event emission
      const event = receipt?.logs.find(
        (log: any) => log.fragment?.name === 'PetMinted'
      );
      expect(event).to.not.be.undefined;
      
      // Get pet status
      const pet = await monadgotchi.getPetStatus(1);
      expect(pet.tokenId).to.equal(1);
      expect(pet.owner).to.equal(user1.address);
      expect(pet.hunger).to.equal(0);
      expect(pet.isFainted).to.equal(false);
      expect(pet.lastFeedBlock).to.be.gt(0);
    });

    it('should increment nextTokenId after minting', async function () {
      await monadgotchi.connect(user1).mint();
      expect(await monadgotchi.nextTokenId()).to.equal(2);
      
      await monadgotchi.connect(user1).mint();
      expect(await monadgotchi.nextTokenId()).to.equal(3);
    });
  });

  describe('Hunger Calculation', function () {
    it('should calculate hunger correctly over time', async function () {
      await monadgotchi.connect(user1).mint();
      
      // Initial hunger should be 0
      let hunger = await monadgotchi.getCurrentHunger(1);
      expect(hunger).to.equal(0);
      
      // Mine blocks to simulate time passing
      const blocksToMine = 100; // 10 minutes worth
      for (let i = 0; i < blocksToMine; i++) {
        await ethers.provider.send('evm_mine', []);
      }
      
      // Hunger should have increased by 1
      hunger = await monadgotchi.getCurrentHunger(1);
      expect(hunger).to.equal(1);
    });

    it('should cap hunger at MAX_HUNGER', async function () {
      await monadgotchi.connect(user1).mint();
      
      // Mine enough blocks to exceed max hunger
      const blocksToMine = 10100; // More than 100 * 100 blocks
      for (let i = 0; i < blocksToMine; i++) {
        await ethers.provider.send('evm_mine', []);
      }
      
      const hunger = await monadgotchi.getCurrentHunger(1);
      expect(hunger).to.equal(100);
    });

    it('should revert when checking hunger of non-existent pet', async function () {
      await expect(monadgotchi.getCurrentHunger(999))
        .to.be.revertedWithCustomError(monadgotchi, 'PetNotFound');
    });
  });

  describe('Feeding', function () {
    it('should reset hunger to 0 when fed by owner', async function () {
      await monadgotchi.connect(user1).mint();
      
      // Mine blocks to increase hunger
      for (let i = 0; i < 500; i++) {
        await ethers.provider.send('evm_mine', []);
      }
      
      // Feed the pet
      const tx = await monadgotchi.connect(user1).feed(1);
      const receipt = await tx.wait();
      
      // Check events
      const hungerEvent = receipt?.logs.find(
        (log: any) => log.fragment?.name === 'PetHungerUpdated'
      );
      expect(hungerEvent).to.not.be.undefined;
      
      const fedEvent = receipt?.logs.find(
        (log: any) => log.fragment?.name === 'PetFed'
      );
      expect(fedEvent).to.not.be.undefined;
      
      // Verify hunger is reset
      const pet = await monadgotchi.getPetStatus(1);
      expect(pet.hunger).to.equal(0);
    });

    it('should prevent unauthorized feeding', async function () {
      await monadgotchi.connect(user1).mint();
      
      // Try to feed with different account without delegation
      await expect(monadgotchi.connect(agent).feed(1))
        .to.be.revertedWithCustomError(monadgotchi, 'NotAuthorized');
    });

    it('should allow feeding with delegation', async function () {
      await monadgotchi.connect(user1).mint();
      
      // Grant delegation to agent
      await monadgotchi.connect(user1).grantDelegation(agent.address, 1);
      
      // Mine blocks to increase hunger
      for (let i = 0; i < 500; i++) {
        await ethers.provider.send('evm_mine', []);
      }
      
      // Agent should be able to feed
      await expect(monadgotchi.connect(agent).feed(1))
        .to.not.be.reverted;
      
      const pet = await monadgotchi.getPetStatus(1);
      expect(pet.hunger).to.equal(0);
    });

    it('should mark pet as fainted when hunger reaches 100', async function () {
      await monadgotchi.connect(user1).mint();
      
      // Mine enough blocks to reach max hunger
      for (let i = 0; i < 10100; i++) {
        await ethers.provider.send('evm_mine', []);
      }
      
      // Feed the pet (should trigger faint)
      const tx = await monadgotchi.connect(user1).feed(1);
      const receipt = await tx.wait();
      
      // Check for PetFainted event
      const faintEvent = receipt?.logs.find(
        (log: any) => log.fragment?.name === 'PetFainted'
      );
      expect(faintEvent).to.not.be.undefined;
      
      // Verify pet is marked as fainted
      const pet = await monadgotchi.getPetStatus(1);
      expect(pet.isFainted).to.equal(true);
    });
  });

  describe('Delegation', function () {
    it('should grant delegation correctly', async function () {
      await monadgotchi.connect(user1).mint();
      
      await monadgotchi.connect(user1).grantDelegation(agent.address, 1);
      
      const hasDelegation = await monadgotchi.delegations(
        user1.address,
        agent.address,
        1
      );
      expect(hasDelegation).to.equal(true);
    });

    it('should revoke delegation correctly', async function () {
      await monadgotchi.connect(user1).mint();
      
      await monadgotchi.connect(user1).grantDelegation(agent.address, 1);
      await monadgotchi.connect(user1).revokeDelegation(agent.address, 1);
      
      const hasDelegation = await monadgotchi.delegations(
        user1.address,
        agent.address,
        1
      );
      expect(hasDelegation).to.equal(false);
    });

    it('should prevent non-owner from granting delegation', async function () {
      await monadgotchi.connect(user1).mint();
      
      await expect(
        monadgotchi.connect(agent).grantDelegation(agent.address, 1)
      ).to.be.revertedWithCustomError(monadgotchi, 'NotAuthorized');
    });
  });
});

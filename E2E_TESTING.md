# End-to-End Testing Guide

This guide provides comprehensive instructions for testing the complete Monadgotchi system after deployment.

## Overview

End-to-end testing verifies that all components work together correctly:
- Smart contract on Monad testnet
- Envio indexer
- Pet Sitter Agent
- Frontend dApp

## Prerequisites

Before running E2E tests, ensure all components are deployed:

- ✅ Smart contract deployed to Monad testnet
- ✅ Envio indexer deployed and syncing
- ✅ Pet Sitter Agent deployed and running
- ✅ Frontend deployed and accessible

## Test Environment Setup

### 1. Prepare Test Wallet

You'll need a MetaMask wallet with:
- Monad testnet configured
- Testnet ETH for gas fees
- No existing Monadgotchi pets (for clean testing)

### 2. Record Deployment Information

Create a test configuration file `e2e-config.json`:

```json
{
  "contractAddress": "0x...",
  "envioEndpoint": "https://indexer.envio.dev/...",
  "agentAddress": "0x...",
  "frontendUrl": "https://your-deployment.vercel.app",
  "monadRpcUrl": "https://testnet.monad.xyz",
  "chainId": 41454
}
```

## Manual E2E Test Suite

### Test 1: Wallet Connection Flow

**Objective**: Verify users can connect their wallet to the dApp

**Steps**:
1. Navigate to the deployed frontend URL
2. Click "Connect Wallet" button
3. Approve MetaMask connection
4. Verify wallet address is displayed
5. Check that the correct network (Monad testnet) is shown

**Expected Results**:
- ✅ Wallet connects successfully
- ✅ Wallet address is displayed in the UI
- ✅ Network indicator shows "Monad Testnet"
- ✅ If on wrong network, user is prompted to switch

**Failure Scenarios**:
- ❌ MetaMask not installed → User sees installation prompt
- ❌ Wrong network → User sees network switch prompt
- ❌ Connection rejected → User can retry connection

---

### Test 2: Mint Pet Flow

**Objective**: Verify users can mint a new Monadgotchi NFT

**Steps**:
1. Ensure wallet is connected
2. Click "Mint Your First Pet" button
3. Approve transaction in MetaMask
4. Wait for transaction confirmation
5. Verify pet appears in the UI

**Expected Results**:
- ✅ Mint button is clickable
- ✅ MetaMask prompts for transaction approval
- ✅ Transaction is submitted to Monad testnet
- ✅ Transaction confirms within reasonable time (< 30 seconds)
- ✅ Pet appears with ID, hunger bar, and sprite
- ✅ Initial hunger is 0
- ✅ Pet status shows "Happy"

**Verification**:
- Check transaction on Monad block explorer
- Verify `PetMinted` event was emitted
- Query Envio indexer for the new pet:
  ```graphql
  query {
    pet(petId: "1") {
      petId
      owner
      hunger
      isFainted
    }
  }
  ```

---

### Test 3: Manual Feeding Flow

**Objective**: Verify users can manually feed their pet

**Steps**:
1. Wait for hunger to increase (or use time manipulation if available)
2. Note current hunger level
3. Click "Feed Pet" button
4. Approve transaction in MetaMask
5. Wait for transaction confirmation
6. Verify hunger resets to 0

**Expected Results**:
- ✅ Feed button is enabled when pet exists
- ✅ Transaction is submitted successfully
- ✅ Hunger resets to 0 after confirmation
- ✅ `PetFed` event is emitted
- ✅ Transaction appears in history
- ✅ Last feed timestamp is updated

**Verification**:
- Check transaction on block explorer
- Verify `PetHungerUpdated` and `PetFed` events
- Query Envio for updated hunger:
  ```graphql
  query {
    pet(petId: "1") {
      hunger
      lastFeedTimestamp
    }
  }
  ```

---

### Test 4: Hunger Increase Over Time

**Objective**: Verify hunger increases automatically based on block time

**Steps**:
1. Note current hunger level and block number
2. Wait 10 minutes (or equivalent blocks)
3. Refresh the page or wait for auto-update
4. Verify hunger has increased

**Expected Results**:
- ✅ Hunger increases by 1 every 10 minutes (100 blocks)
- ✅ UI updates automatically every 30 seconds
- ✅ Hunger bar color changes based on level:
  - Green (0-49)
  - Yellow (50-89)
  - Red (90-100)
- ✅ Pet sprite animation changes based on hunger state

**Calculation**:
```
Expected Hunger = Previous Hunger + (Blocks Passed / 100)
```

---

### Test 5: Delegation Setup Flow

**Objective**: Verify users can grant delegation to the Pet Sitter Agent

**Steps**:
1. Ensure pet is minted and visible
2. Click "Hire a Pet Sitter" button
3. Review delegation details in the modal
4. Click "Sign Delegation"
5. Sign the delegation message in MetaMask
6. Wait for transaction confirmation
7. Verify "Pet Sitter Active" indicator appears

**Expected Results**:
- ✅ Delegation button is visible
- ✅ Modal explains delegation clearly
- ✅ MetaMask prompts for signature (not transaction)
- ✅ Delegation is granted on-chain
- ✅ UI shows "Pet Sitter Active" status
- ✅ "Revoke Delegation" button appears

**Verification**:
- Check delegation on-chain:
  ```javascript
  const hasDelegation = await contract.delegations(
    ownerAddress,
    agentAddress,
    petId
  );
  // Should return true
  ```

---

### Test 6: Automated Feeding by Agent

**Objective**: Verify Pet Sitter Agent automatically feeds hungry pets

**Steps**:
1. Ensure delegation is active
2. Wait for hunger to reach 90 or above
3. Wait for agent polling cycle (up to 60 seconds)
4. Verify pet is fed automatically
5. Check transaction history

**Expected Results**:
- ✅ Agent detects hungry pet (hunger >= 90)
- ✅ Agent calls feed() function using delegation
- ✅ Transaction is submitted and confirmed
- ✅ Hunger resets to 0
- ✅ Transaction history shows automated feed
- ✅ Feeder address is the agent address

**Verification**:
- Check agent logs for feed transaction:
  ```
  info: Successfully fed pet {"petId":"1","transactionHash":"0x..."}
  ```
- Verify transaction on block explorer
- Check Envio for feed event:
  ```graphql
  query {
    feedEvents(petId: "1", limit: 1) {
      feeder
      timestamp
      transactionHash
    }
  }
  ```

---

### Test 7: Delegation Revocation Flow

**Objective**: Verify users can revoke delegation and stop automation

**Steps**:
1. Ensure delegation is active
2. Click "Revoke Delegation" button
3. Approve transaction in MetaMask
4. Wait for confirmation
5. Verify "Pet Sitter Active" indicator disappears
6. Wait for hunger to reach 90+
7. Verify agent does NOT feed the pet

**Expected Results**:
- ✅ Revoke button is visible when delegation is active
- ✅ Transaction is submitted successfully
- ✅ Delegation is revoked on-chain
- ✅ UI updates to show delegation is inactive
- ✅ "Hire a Pet Sitter" button reappears
- ✅ Agent stops feeding the pet

**Verification**:
- Check delegation on-chain (should be false)
- Monitor agent logs (should skip this pet)
- Verify pet hunger continues to increase without feeding

---

### Test 8: Pet Fainting Scenario

**Objective**: Verify pet faints when hunger reaches 100

**Steps**:
1. Ensure delegation is NOT active
2. Wait for hunger to reach 100
3. Verify pet status changes to "Fainted"
4. Attempt to feed the pet
5. Verify feed button behavior

**Expected Results**:
- ✅ Pet sprite changes to fainted animation
- ✅ Status shows "Fainted"
- ✅ `PetFainted` event is emitted
- ✅ Feed button may be disabled or show warning
- ✅ Hunger remains at 100

**Note**: Check contract implementation for fainted pet behavior. Some implementations may allow feeding fainted pets to revive them.

---

### Test 9: Transaction History Display

**Objective**: Verify transaction history shows all feed events

**Steps**:
1. Perform multiple feed actions (manual and automated)
2. Scroll to transaction history section
3. Verify all feeds are listed
4. Check feed type indicators (manual vs automated)
5. Click on transaction hash links

**Expected Results**:
- ✅ All feed events are displayed
- ✅ Manual feeds show owner address
- ✅ Automated feeds show agent address
- ✅ Timestamps are accurate
- ✅ Transaction hashes link to block explorer
- ✅ Events are sorted by timestamp (newest first)

---

### Test 10: Real-Time Status Updates

**Objective**: Verify UI updates automatically without page refresh

**Steps**:
1. Open the dApp in browser
2. Note current hunger level
3. Wait 30 seconds (polling interval)
4. Verify hunger updates automatically
5. Perform a feed action in another tab/wallet
6. Verify UI updates in original tab

**Expected Results**:
- ✅ Hunger updates every 30 seconds
- ✅ No page refresh required
- ✅ Status indicators update automatically
- ✅ Transaction history updates automatically
- ✅ Delegation status updates automatically

---

### Test 11: Multiple Pets Scenario

**Objective**: Verify system handles multiple pets correctly

**Steps**:
1. Mint a second pet
2. Verify both pets are displayed
3. Grant delegation for both pets
4. Wait for both to get hungry
5. Verify agent feeds both pets

**Expected Results**:
- ✅ Multiple pets can be minted
- ✅ Each pet has independent hunger
- ✅ Delegation can be granted per pet
- ✅ Agent feeds all hungry pets with delegation
- ✅ UI shows all owned pets

---

### Test 12: Error Handling

**Objective**: Verify system handles errors gracefully

**Test Scenarios**:

**A. Insufficient Gas**:
1. Reduce wallet balance to very low amount
2. Attempt to feed pet
3. Verify error message is displayed

**B. Network Disconnection**:
1. Disconnect from internet
2. Attempt to interact with dApp
3. Verify appropriate error message

**C. Wrong Network**:
1. Switch MetaMask to different network
2. Verify dApp prompts to switch back

**D. Unauthorized Feed Attempt**:
1. Try to feed someone else's pet (if possible)
2. Verify transaction is rejected

**Expected Results**:
- ✅ Clear error messages for all scenarios
- ✅ User can retry after fixing issue
- ✅ No crashes or blank screens
- ✅ Helpful guidance for resolution

---

## Automated E2E Testing

For automated testing, consider using:

### Playwright Tests

Create `e2e/tests/monadgotchi.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Monadgotchi E2E Tests', () => {
  test('should connect wallet and mint pet', async ({ page }) => {
    await page.goto('https://your-deployment.vercel.app');
    
    // Connect wallet
    await page.click('button:has-text("Connect Wallet")');
    // Handle MetaMask popup...
    
    // Mint pet
    await page.click('button:has-text("Mint Your First Pet")');
    // Wait for transaction...
    
    // Verify pet appears
    await expect(page.locator('.pet-display')).toBeVisible();
  });
});
```

### Hardhat Tests for Contract Integration

Create `test/integration/e2e.test.ts`:

```typescript
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('E2E Integration Tests', () => {
  it('should complete full user flow', async () => {
    // Deploy contract
    // Mint pet
    // Feed pet
    // Grant delegation
    // Simulate agent feeding
    // Verify all events
  });
});
```

## Performance Testing

### Load Testing

Test system under load:
- Multiple users minting pets simultaneously
- Agent feeding many pets at once
- High query volume to Envio indexer

### Metrics to Monitor

- Transaction confirmation time
- Envio indexer latency
- Frontend load time
- Agent response time

## Test Checklist

Use this checklist to track test completion:

- [ ] Test 1: Wallet Connection Flow
- [ ] Test 2: Mint Pet Flow
- [ ] Test 3: Manual Feeding Flow
- [ ] Test 4: Hunger Increase Over Time
- [ ] Test 5: Delegation Setup Flow
- [ ] Test 6: Automated Feeding by Agent
- [ ] Test 7: Delegation Revocation Flow
- [ ] Test 8: Pet Fainting Scenario
- [ ] Test 9: Transaction History Display
- [ ] Test 10: Real-Time Status Updates
- [ ] Test 11: Multiple Pets Scenario
- [ ] Test 12: Error Handling

## Reporting Issues

When reporting issues, include:

1. **Test Name**: Which test failed
2. **Steps to Reproduce**: Exact steps taken
3. **Expected Result**: What should have happened
4. **Actual Result**: What actually happened
5. **Screenshots**: Visual evidence
6. **Transaction Hashes**: For on-chain issues
7. **Browser/Wallet**: Environment details
8. **Logs**: Agent logs, browser console, etc.

## Success Criteria

The system passes E2E testing when:

- ✅ All 12 manual tests pass
- ✅ No critical bugs found
- ✅ Performance meets requirements
- ✅ Error handling is robust
- ✅ User experience is smooth

## Next Steps

After successful E2E testing:

1. Document any issues found
2. Fix critical bugs
3. Optimize performance bottlenecks
4. Prepare for user acceptance testing
5. Create user documentation
6. Plan for mainnet deployment (if applicable)

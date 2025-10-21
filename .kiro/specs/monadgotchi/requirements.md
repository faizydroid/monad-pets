# Requirements Document

## Introduction

Monadgotchi is an on-chain virtual pet game (inspired by Tamagotchi) deployed on the Monad testnet. The core mechanic revolves around automation: players must automate their pet's care using MetaMask Smart Accounts and delegation, or their pet will "faint" from hunger. The game demonstrates consumer application design, on-chain automation via a "Pet Sitter" agent, and real-time event indexing through Envio.

## Glossary

- **Monadgotchi**: The virtual pet NFT that players mint and care for
- **Game Contract**: The smart contract deployed on Monad testnet that manages pet state and actions
- **Pet Sitter Agent**: An automated service that feeds pets on behalf of users via delegated permissions
- **MSA**: MetaMask Smart Account, the wallet infrastructure enabling delegation
- **Envio Indexer**: The event indexing service that tracks pet hunger levels via GraphQL API
- **Hunger Stat**: An on-chain integer value (0-100) representing the pet's hunger level
- **Feed Action**: The on-chain function call that resets a pet's hunger to 0
- **Delegation**: The permission granted by a user to the Pet Sitter Agent to call feed() on their behalf
- **Frontend dApp**: The web application UI where users interact with their Monadgotchi

## Requirements

### Requirement 1: Pet NFT Minting

**User Story:** As a player, I want to mint a unique Monadgotchi NFT, so that I have my own virtual pet to care for

#### Acceptance Criteria

1. WHEN a user connects their MSA wallet to the Frontend dApp, THE Game Contract SHALL provide a mint function accessible through the UI
2. WHEN a user successfully mints a Monadgotchi, THE Game Contract SHALL create an NFT with a unique petId and initialize the Hunger Stat to 0
3. WHEN a user mints a Monadgotchi, THE Game Contract SHALL emit a PetMinted event containing the petId and owner address
4. THE Frontend dApp SHALL display the newly minted pet with pixel-art graphics and its current Hunger Stat

### Requirement 2: Hunger Mechanics

**User Story:** As a game designer, I want the pet's hunger to increase automatically over time, so that players must take action to keep their pet healthy

#### Acceptance Criteria

1. THE Game Contract SHALL increase the Hunger Stat by 1 for each pet every 10 minutes based on block time
2. WHEN the Hunger Stat reaches 100, THE Game Contract SHALL mark the pet status as "fainted"
3. WHEN a pet's Hunger Stat changes, THE Game Contract SHALL emit a PetHungerUpdated event containing the petId and newHungerLevel
4. THE Game Contract SHALL store the Hunger Stat value on-chain for each petId
5. THE Frontend dApp SHALL display the Hunger Stat as a visual hunger bar showing values from 0 to 100

### Requirement 3: Manual Feeding

**User Story:** As a player, I want to manually feed my pet, so that I can reduce its hunger and prevent it from fainting

#### Acceptance Criteria

1. THE Game Contract SHALL provide a feed function that accepts a petId parameter
2. WHEN a user calls the feed function for their pet, THE Game Contract SHALL reset the Hunger Stat to 0
3. WHEN the feed function is called, THE Game Contract SHALL verify that the caller is either the pet owner or has delegated permission
4. WHEN a pet is fed, THE Game Contract SHALL emit a PetHungerUpdated event with the new hunger level of 0
5. THE Frontend dApp SHALL provide a "Feed" button that calls the feed function when clicked

### Requirement 4: Delegation Setup

**User Story:** As a player, I want to hire a Pet Sitter by granting delegation, so that my pet can be fed automatically without me being online

#### Acceptance Criteria

1. THE Frontend dApp SHALL provide a "Hire a Pet Sitter" button that initiates the delegation flow
2. WHEN a user clicks "Hire a Pet Sitter", THE Frontend dApp SHALL prompt the user to sign a delegation signature via their MSA wallet
3. THE Frontend dApp SHALL configure the delegation to permit only the feed function on the Game Contract for the user's specific petId
4. WHEN delegation is granted, THE Frontend dApp SHALL display confirmation that the Pet Sitter is active
5. THE Frontend dApp SHALL allow users to revoke delegation at any time

### Requirement 5: Automated Pet Sitter Agent

**User Story:** As a player, I want the Pet Sitter Agent to automatically feed my pet when it gets hungry, so that I don't have to monitor it constantly

#### Acceptance Criteria

1. THE Pet Sitter Agent SHALL run as a continuous background service
2. WHEN the Pet Sitter Agent detects a hungry pet (hunger >= 90), THE Pet Sitter Agent SHALL call the feed function using delegated permissions
3. THE Pet Sitter Agent SHALL query the Envio Indexer API every minute to identify hungry pets
4. WHEN the Pet Sitter Agent successfully feeds a pet, THE Pet Sitter Agent SHALL log the transaction hash and petId
5. IF a feed transaction fails, THEN THE Pet Sitter Agent SHALL retry up to 3 times with exponential backoff

### Requirement 6: Envio Event Indexing

**User Story:** As a system operator, I want to index PetHungerUpdated events in real-time, so that the Pet Sitter Agent can efficiently identify hungry pets

#### Acceptance Criteria

1. THE Envio Indexer SHALL subscribe to PetHungerUpdated events emitted by the Game Contract
2. WHEN a PetHungerUpdated event is detected, THE Envio Indexer SHALL store the petId and newHungerLevel in its database
3. THE Envio Indexer SHALL expose a GraphQL API endpoint for querying pet hunger data
4. THE Envio Indexer SHALL support filtering queries such as "hunger_gte: 90" to return only hungry pets
5. THE Envio Indexer SHALL update pet records within 5 seconds of event emission

### Requirement 7: Frontend User Experience

**User Story:** As a player, I want a simple and intuitive UI, so that I can easily understand my pet's status and automate its care

#### Acceptance Criteria

1. THE Frontend dApp SHALL display a pixel-art representation of the Monadgotchi pet
2. THE Frontend dApp SHALL show the current Hunger Stat as a visual progress bar
3. WHEN the Hunger Stat is below 50, THE Frontend dApp SHALL display the pet as "happy"
4. WHEN the Hunger Stat is between 50 and 89, THE Frontend dApp SHALL display the pet as "hungry"
5. WHEN the Hunger Stat reaches 90 or above, THE Frontend dApp SHALL display the pet as "very hungry" with visual warnings
6. WHEN the pet has fainted, THE Frontend dApp SHALL display the pet as "fainted" and disable the feed button
7. THE Frontend dApp SHALL prominently feature the "Hire a Pet Sitter" call-to-action for users who have not yet delegated

### Requirement 8: Wallet Integration

**User Story:** As a player, I want to connect my MetaMask Smart Account wallet, so that I can interact with the game on Monad testnet

#### Acceptance Criteria

1. THE Frontend dApp SHALL support MetaMask Smart Account wallet connections
2. WHEN a user connects their wallet, THE Frontend dApp SHALL verify the connection is on Monad testnet
3. IF the user is on the wrong network, THEN THE Frontend dApp SHALL prompt them to switch to Monad testnet
4. THE Frontend dApp SHALL display the connected wallet address
5. THE Frontend dApp SHALL load and display all Monadgotchi pets owned by the connected wallet

### Requirement 9: Pet Status Monitoring

**User Story:** As a player, I want to see real-time updates of my pet's status, so that I know if the automation is working correctly

#### Acceptance Criteria

1. THE Frontend dApp SHALL refresh the pet's Hunger Stat every 30 seconds
2. WHEN the Hunger Stat changes, THE Frontend dApp SHALL update the visual display without requiring a page refresh
3. THE Frontend dApp SHALL display the timestamp of the last feed action
4. WHERE the Pet Sitter Agent is active, THE Frontend dApp SHALL show an indicator that automation is enabled
5. THE Frontend dApp SHALL display a transaction history showing recent feed actions and who performed them

### Requirement 10: Smart Contract Security

**User Story:** As a system operator, I want the Game Contract to enforce proper access controls, so that only authorized parties can feed pets

#### Acceptance Criteria

1. THE Game Contract SHALL verify that feed function callers are either the pet owner or have valid delegation
2. THE Game Contract SHALL reject feed calls from unauthorized addresses
3. THE Game Contract SHALL validate that petId exists before processing feed calls
4. THE Game Contract SHALL prevent integer overflow in Hunger Stat calculations
5. THE Game Contract SHALL emit events for all state-changing operations for transparency and auditability

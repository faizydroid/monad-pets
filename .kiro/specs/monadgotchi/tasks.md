# Implementation Plan

- [x] 1. Set up project structure and development environment
  - Initialize monorepo with contracts, agent, and frontend workspaces
  - Configure Hardhat for Monad testnet with TypeScript support
  - Set up Vite + React project with TypeScript
  - Create Node.js agent project structure
  - Add shared types package for cross-workspace type definitions
  - Configure ESLint and Prettier for code consistency
  - _Requirements: All requirements depend on proper project setup_

- [x] 2. Implement core smart contract
- [x] 2.1 Create Monadgotchi.sol with ERC721 base and Pet struct
  - Implement ERC721 NFT functionality using OpenZeppelin
  - Define Pet struct with tokenId, owner, hunger, lastFeedBlock, isFainted fields
  - Add state variables: pets mapping, nextTokenId counter, constants for hunger mechanics
  - _Requirements: 1.2, 2.4, 10.3_

- [x] 2.2 Implement mint() function with event emission
  - Write mint() function that creates new Pet with initial state (hunger=0)
  - Emit PetMinted event with petId, owner, and timestamp
  - Increment nextTokenId counter
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2.3 Implement hunger calculation logic in getCurrentHunger()
  - Write view function that calculates current hunger based on blocks elapsed
  - Formula: min(lastHunger + (blocksPassed / BLOCKS_PER_10_MIN), MAX_HUNGER)
  - Handle edge case where pet hasn't been fed yet
  - _Requirements: 2.1, 2.4_

- [x] 2.4 Implement feed() function with access control
  - Write feed() function that resets hunger to 0 and updates lastFeedBlock
  - Add access control check: require owner or delegated permission
  - Emit PetHungerUpdated and PetFed events
  - Handle fainted pets (mark isFainted when hunger reaches 100)
  - _Requirements: 3.2, 3.3, 3.4, 10.1, 10.2_

- [x] 2.5 Add delegation verification logic
  - Implement hasDelegation() internal function for MSA delegation checks
  - Integrate with MetaMask Smart Account delegation framework
  - _Requirements: 4.3, 10.1_

- [x] 2.6 Write smart contract unit tests
  - Test mint() creates pet with correct initial state
  - Test getCurrentHunger() calculates hunger over time correctly
  - Test feed() resets hunger and emits events
  - Test access control prevents unauthorized feeding
  - Test faint condition when hunger reaches 100
  - _Requirements: 1.2, 2.1, 2.2, 3.2, 3.3_

- [x] 3. Configure and deploy Envio indexer
- [x] 3.1 Create Envio configuration file
  - Write envio/config.yaml with contract address and event definitions
  - Define handlers for PetMinted, PetHungerUpdated, PetFainted, PetFed events
  - Configure Monad testnet RPC endpoint and start block
  - _Requirements: 6.1_

- [x] 3.2 Define GraphQL schema for pet data
  - Create Pet type with all required fields (petId, owner, hunger, etc.)
  - Define Query type with pet(), pets(), and hungryPets() queries
  - Create PetFilter input type for filtering queries
  - Add FeedEvent type for transaction history
  - _Requirements: 6.3, 6.4_

- [x] 3.3 Implement event handlers for indexing
  - Write handler for PetMinted to create new pet records
  - Write handler for PetHungerUpdated to update hunger values
  - Write handler for PetFed to record feed events in history
  - Ensure handlers update database within 5 seconds of event emission
  - _Requirements: 6.1, 6.2, 6.5_

- [x] 3.4 Deploy indexer and verify GraphQL endpoint
  - Deploy Envio indexer to Envio Cloud or self-hosted infrastructure
  - Test GraphQL queries against indexed data
  - Verify hungryPets query returns correct results
  - _Requirements: 6.3, 6.4, 6.5_

- [x] 4. Build Pet Sitter Agent
- [x] 4.1 Set up agent project with dependencies
  - Initialize Node.js project with TypeScript
  - Install ethers.js, graphql-request, dotenv, winston for logging
  - Create configuration loader for environment variables
  - _Requirements: 5.1_

- [x] 4.2 Implement Envio GraphQL client
  - Create GraphQLClient wrapper for Envio endpoint
  - Write queryHungryPets() function that queries pets with hunger >= threshold
  - Add error handling and retry logic for network failures
  - _Requirements: 5.3, 6.4_

- [x] 4.3 Implement feed transaction logic with delegation
  - Create contract instance with agent wallet
  - Write feedPet() function that calls feed() using delegated permissions
  - Add gas estimation and dynamic gas pricing
  - Implement transaction confirmation waiting
  - _Requirements: 5.2, 5.4_

- [x] 4.4 Add polling loop and retry mechanism
  - Implement main polling loop that runs every 60 seconds
  - Add retry logic: 3 attempts with exponential backoff (1s, 2s, 4s)
  - Implement concurrent feeding with rate limiting (max 5 simultaneous)
  - Add graceful shutdown handling
  - _Requirements: 5.1, 5.3, 5.5_

- [x] 4.5 Add logging and monitoring
  - Configure Winston logger with structured logging
  - Log all feed transactions with petId and transaction hash
  - Add error logging for failed transactions
  - Implement health check endpoint for monitoring
  - _Requirements: 5.4, 5.5_

- [x] 4.6 Write agent integration tests
  - Test queryHungryPets() against mock Envio endpoint
  - Test feedPet() against local Hardhat node
  - Test retry logic with simulated failures
  - Test concurrent feeding of multiple pets
  - _Requirements: 5.2, 5.3, 5.5_

- [x] 5. Build frontend dApp
- [x] 5.1 Set up React project with routing and state management
  - Initialize Vite + React + TypeScript project
  - Install wagmi, viem, @tanstack/react-query for Web3 integration
  - Install graphql-request for Envio queries
  - Set up React Router for navigation (if multi-page)
  - _Requirements: 7.1, 8.1_

- [x] 5.2 Implement wallet connection component
  - Create WalletConnect component using wagmi hooks
  - Add MetaMask Smart Account wallet connector
  - Implement network detection and Monad testnet switching
  - Display connected wallet address
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 5.3 Create useContract hook for contract interactions
  - Write custom hook that wraps wagmi's useContract
  - Implement mint() function call
  - Implement feed() function call
  - Add transaction status tracking (pending, success, failed)
  - _Requirements: 1.1, 3.1, 3.2_

- [x] 5.4 Create useEnvio hook for GraphQL queries
  - Write custom hook that queries Envio endpoint
  - Implement pet data fetching with 30-second polling
  - Add loading and error states
  - Cache query results to prevent excessive requests
  - _Requirements: 6.3, 9.1, 9.2_

- [x] 5.5 Implement PetDisplay component with animations
  - Create pixel-art sprite component with CSS or SVG
  - Implement animations for different hunger states: happy (0-49), hungry (50-89), very hungry (90-99), fainted (100)
  - Add smooth transitions between states
  - Update display based on real-time hunger data
  - _Requirements: 7.1, 7.3, 7.4, 7.5, 7.6_

- [x] 5.6 Implement HungerBar component
  - Create visual progress bar component (0-100 scale)
  - Add color coding: green (0-49), yellow (50-89), red (90-100)
  - Display numeric value and percentage
  - Implement smooth transitions on updates
  - _Requirements: 7.2, 7.5_

- [x] 5.7 Implement FeedButton component
  - Create button that calls feed() function from useContract hook
  - Show loading state during transaction
  - Display transaction status (pending, success, failed)
  - Disable button when pet is fainted or transaction is pending
  - _Requirements: 3.1, 7.6_

- [x] 5.8 Implement delegation flow with DelegationButton
  - Create "Hire a Pet Sitter" button component
  - Implement MSA delegation signature request
  - Configure delegation scope: only feed() function for user's petId
  - Show "Pet Sitter Active" indicator when delegation exists
  - Add "Revoke Delegation" functionality
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 5.9 Create TransactionHistory component
  - Query feed events from Envio for current pet
  - Display list of recent feed actions with timestamp and feeder address
  - Show whether feed was manual (owner) or automated (agent)
  - Add link to block explorer for each transaction
  - _Requirements: 9.3, 9.5_

- [x] 5.10 Implement pet loading and ownership display
  - Query all pets owned by connected wallet from Envio
  - Display list of owned pets (if user has multiple)
  - Show "Mint Your First Pet" CTA if user has no pets
  - Add pet selection if user owns multiple pets
  - _Requirements: 8.5, 1.4_

- [x] 5.11 Add real-time status updates and monitoring
  - Implement 30-second polling for pet status updates
  - Display last feed timestamp
  - Show automation status indicator (Pet Sitter active/inactive)
  - Add visual warnings when hunger is critical (>= 90)
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 5.12 Write frontend component tests
  - Test PetDisplay renders correct sprite for each hunger level
  - Test HungerBar displays correct color and value
  - Test FeedButton triggers transaction
  - Test DelegationButton triggers signature flow
  - Test WalletConnect handles connection states
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 6. Deploy and integrate all components
- [x] 6.1 Deploy smart contract to Monad testnet
  - Configure Hardhat deployment script with Monad testnet RPC
  - Deploy Monadgotchi.sol contract
  - Verify contract on Monad block explorer
  - Record contract address for frontend and agent configuration
  - _Requirements: All contract requirements_

- [x] 6.2 Configure and start Envio indexer
  - Update config.yaml with deployed contract address
  - Set start block to contract deployment block
  - Deploy indexer to Envio platform
  - Verify GraphQL endpoint is accessible and returning data
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6.3 Deploy Pet Sitter Agent to cloud infrastructure
  - Set up cloud VM (AWS EC2, DigitalOcean) or serverless function
  - Configure environment variables (RPC URL, contract address, Envio endpoint, private key)
  - Deploy agent code and install dependencies
  - Start agent as background service (PM2 or systemd)
  - Verify agent is polling and feeding pets correctly
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 6.4 Build and deploy frontend to hosting platform
  - Configure environment variables for production (contract address, Envio endpoint, chain ID)
  - Build production bundle with Vite
  - Deploy to Vercel, Netlify, or IPFS
  - Test wallet connection and all user flows in production
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 6.5 Run end-to-end tests on deployed system
  - Test complete user flow: connect wallet → mint pet → verify pet appears
  - Test manual feeding: click feed → verify hunger resets
  - Test automation: hire Pet Sitter → wait for hunger to increase → verify auto-feed
  - Test delegation revocation: revoke → verify agent stops feeding
  - _Requirements: All requirements_

- [ ] 7. Create demo and documentation
- [ ] 7.1 Record demo video showing all three tracks
  - Record consumer app: show cute pet UI, hunger bar, minting flow
  - Record automation: show delegation signature, Pet Sitter activation, auto-feeding
  - Record Envio: show Envio dashboard with events, GraphQL queries, agent logs
  - Show side-by-side view of hunger increasing and agent automatically feeding
  - _Requirements: All requirements (demo purposes)_

- [ ] 7.2 Write README with setup instructions
  - Document project structure and architecture
  - Provide setup instructions for local development
  - Include deployment instructions for each component
  - Add troubleshooting section for common issues
  - _Requirements: All requirements (documentation)_

- [ ] 7.3 Create user guide for players
  - Write guide on how to mint a pet
  - Explain hunger mechanics and feeding
  - Provide step-by-step delegation setup instructions
  - Explain how to monitor pet status and automation
  - _Requirements: 1.1, 3.1, 4.1, 4.2, 9.1, 9.2_

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title Monadgotchi
 * @notice Virtual pet NFT game with hunger mechanics and automated feeding via delegation
 */
contract Monadgotchi is ERC721 {
    // Pet struct representing the state of each virtual pet
    struct Pet {
        uint256 tokenId;
        address owner;
        uint256 hunger;
        uint256 lastFeedBlock;
        bool isFainted;
    }

    // State variables
    mapping(uint256 => Pet) public pets;
    uint256 public nextTokenId;

    // Constants for hunger mechanics
    uint256 public constant HUNGER_INCREASE_RATE = 1;
    uint256 public constant BLOCKS_PER_10_MIN = 100; // Adjust based on Monad block time
    uint256 public constant MAX_HUNGER = 100;

    // Events
    event PetMinted(uint256 indexed petId, address indexed owner, uint256 timestamp);
    event PetHungerUpdated(uint256 indexed petId, uint256 newHungerLevel, uint256 timestamp);
    event PetFainted(uint256 indexed petId, uint256 timestamp);
    event PetFed(uint256 indexed petId, address indexed feeder, uint256 timestamp);

    // Custom errors
    error PetNotFound(uint256 petId);
    error NotAuthorized(address caller, uint256 petId);
    error PetAlreadyFainted(uint256 petId);
    error InvalidPetId(uint256 petId);

    // Delegation mapping: owner => delegate => petId => isAllowed
    mapping(address => mapping(address => mapping(uint256 => bool))) public delegations;

    constructor() ERC721("Monadgotchi", "MGOTCHI") {
        nextTokenId = 1;
    }

    /**
     * @notice Grant delegation to an address to feed a specific pet
     * @param delegate The address to grant delegation to
     * @param petId The pet ID to allow feeding for
     */
    function grantDelegation(address delegate, uint256 petId) external {
        Pet memory pet = pets[petId];
        if (pet.tokenId == 0) {
            revert PetNotFound(petId);
        }
        if (msg.sender != pet.owner) {
            revert NotAuthorized(msg.sender, petId);
        }
        
        delegations[msg.sender][delegate][petId] = true;
    }

    /**
     * @notice Revoke delegation from an address for a specific pet
     * @param delegate The address to revoke delegation from
     * @param petId The pet ID to revoke feeding permission for
     */
    function revokeDelegation(address delegate, uint256 petId) external {
        Pet memory pet = pets[petId];
        if (pet.tokenId == 0) {
            revert PetNotFound(petId);
        }
        if (msg.sender != pet.owner) {
            revert NotAuthorized(msg.sender, petId);
        }
        
        delegations[msg.sender][delegate][petId] = false;
    }

    /**
     * @notice Check if an address has delegation to feed a pet
     * @param delegate The address to check
     * @param petId The pet ID to check
     * @return True if the address has delegation
     */
    function hasDelegation(address delegate, uint256 petId) internal view returns (bool) {
        Pet memory pet = pets[petId];
        if (pet.tokenId == 0) {
            return false;
        }
        
        return delegations[pet.owner][delegate][petId];
    }

    /**
     * @notice Mint a new Monadgotchi pet NFT
     * @return petId The ID of the newly minted pet
     */
    function mint() external returns (uint256) {
        uint256 petId = nextTokenId;
        
        // Mint the NFT
        _safeMint(msg.sender, petId);
        
        // Create the pet with initial state
        pets[petId] = Pet({
            tokenId: petId,
            owner: msg.sender,
            hunger: 0,
            lastFeedBlock: block.number,
            isFainted: false
        });
        
        // Increment the token ID counter
        nextTokenId++;
        
        // Emit event
        emit PetMinted(petId, msg.sender, block.timestamp);
        
        return petId;
    }

    /**
     * @notice Calculate the current hunger level of a pet based on blocks elapsed
     * @param petId The ID of the pet to check
     * @return Current hunger level (0-100)
     */
    function getCurrentHunger(uint256 petId) public view returns (uint256) {
        Pet memory pet = pets[petId];
        
        // Check if pet exists
        if (pet.tokenId == 0) {
            revert PetNotFound(petId);
        }
        
        // If pet is already fainted, return max hunger
        if (pet.isFainted) {
            return MAX_HUNGER;
        }
        
        // Calculate blocks passed since last feed
        uint256 blocksPassed = block.number - pet.lastFeedBlock;
        
        // Calculate hunger increase based on blocks passed
        uint256 hungerIncrease = (blocksPassed * HUNGER_INCREASE_RATE) / BLOCKS_PER_10_MIN;
        
        // Calculate current hunger, capped at MAX_HUNGER
        uint256 currentHunger = pet.hunger + hungerIncrease;
        if (currentHunger > MAX_HUNGER) {
            currentHunger = MAX_HUNGER;
        }
        
        return currentHunger;
    }

    /**
     * @notice Feed a pet to reset its hunger to 0
     * @param petId The ID of the pet to feed
     */
    function feed(uint256 petId) external {
        Pet storage pet = pets[petId];
        
        // Check if pet exists
        if (pet.tokenId == 0) {
            revert PetNotFound(petId);
        }
        
        // Check access control: must be owner or have delegation
        if (msg.sender != pet.owner && !hasDelegation(msg.sender, petId)) {
            revert NotAuthorized(msg.sender, petId);
        }
        
        // Get current hunger before feeding
        uint256 currentHunger = getCurrentHunger(petId);
        
        // Check if pet has fainted (hunger reached 100)
        if (currentHunger >= MAX_HUNGER && !pet.isFainted) {
            pet.isFainted = true;
            emit PetFainted(petId, block.timestamp);
        }
        
        // Reset hunger to 0 and update last feed block
        pet.hunger = 0;
        pet.lastFeedBlock = block.number;
        
        // Emit events
        emit PetHungerUpdated(petId, 0, block.timestamp);
        emit PetFed(petId, msg.sender, block.timestamp);
    }

    /**
     * @notice Get the complete status of a pet
     * @param petId The ID of the pet to query
     * @return Pet struct with current state
     */
    function getPetStatus(uint256 petId) public view returns (Pet memory) {
        Pet memory pet = pets[petId];
        if (pet.tokenId == 0) {
            revert PetNotFound(petId);
        }
        return pet;
    }
}

import {
    Monadgotchi,
    Pet,
    FeedEvent,
} from "./generated";

/**
 * Handler for PetMinted event
 * Creates a new pet record when a pet is minted
 */
Monadgotchi.PetMinted.handler(async ({ event, context }: any) => {
    const { petId, owner, timestamp } = event.params;

    // Create new pet entity
    const pet: Pet = {
        id: petId.toString(),
        petId: petId,
        owner: owner,
        hunger: 0,
        lastFeedBlock: event.block.number,
        lastFeedTimestamp: timestamp,
        isFainted: false,
        createdAt: timestamp,
    };

    // Save pet to database
    context.Pet.set(pet);
});

/**
 * Handler for PetHungerUpdated event
 * Updates the hunger level of a pet
 */
Monadgotchi.PetHungerUpdated.handler(async ({ event, context }: any) => {
    const { petId, newHungerLevel, timestamp } = event.params;

    // Load existing pet
    const pet = await context.Pet.get(petId.toString());

    if (pet) {
        // Update hunger level
        pet.hunger = Number(newHungerLevel);
        pet.lastFeedTimestamp = timestamp;
        pet.lastFeedBlock = event.block.number;

        // Save updated pet
        context.Pet.set(pet);
    }
});

/**
 * Handler for PetFainted event
 * Marks a pet as fainted when hunger reaches 100
 */
Monadgotchi.PetFainted.handler(async ({ event, context }: any) => {
    const { petId, timestamp } = event.params;

    // Load existing pet
    const pet = await context.Pet.get(petId.toString());

    if (pet) {
        // Mark pet as fainted
        pet.isFainted = true;
        pet.hunger = 100;
        pet.lastFeedTimestamp = timestamp;

        // Save updated pet
        context.Pet.set(pet);
    }
});

/**
 * Handler for PetFed event
 * Records a feed action in the feed history
 */
Monadgotchi.PetFed.handler(async ({ event, context }: any) => {
    const { petId, feeder, timestamp } = event.params;

    // Create unique ID for feed event using transaction hash and log index
    const feedEventId = `${event.transaction.hash}-${event.logIndex}`;

    // Create feed event entity
    const feedEvent: FeedEvent = {
        id: feedEventId,
        petId: petId,
        feeder: feeder,
        timestamp: timestamp,
        transactionHash: event.transaction.hash,
        blockNumber: event.block.number,
    };

    // Save feed event to database
    context.FeedEvent.set(feedEvent);

    // Update pet's last feed timestamp
    const pet = await context.Pet.get(petId.toString());
    if (pet) {
        pet.lastFeedTimestamp = timestamp;
        pet.lastFeedBlock = event.block.number;
        context.Pet.set(pet);
    }
});

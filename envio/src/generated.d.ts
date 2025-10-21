/**
 * Type declarations for Envio generated types
 * 
 * NOTE: This is a temporary type declaration file for development.
 * When you run `envio codegen`, Envio will generate the actual types
 * in a `generated` directory. You should then update the import in
 * EventHandlers.ts from "./generated" to "generated".
 * 
 * This file can be deleted after running `envio codegen`.
 */

export interface Pet {
    id: string;
    petId: bigint;
    owner: string;
    hunger: number;
    lastFeedBlock: bigint;
    lastFeedTimestamp: bigint;
    isFainted: boolean;
    createdAt: bigint;
}

export interface FeedEvent {
    id: string;
    petId: bigint;
    feeder: string;
    timestamp: bigint;
    transactionHash: string;
    blockNumber: bigint;
}

export interface EventContext {
    Pet: {
        get(id: string): Promise<Pet | undefined>;
        set(entity: Pet): void;
    };
    FeedEvent: {
        get(id: string): Promise<FeedEvent | undefined>;
        set(entity: FeedEvent): void;
    };
}

export interface EventParams {
    petId: bigint;
    owner?: string;
    feeder?: string;
    timestamp: bigint;
    newHungerLevel?: bigint;
}

export interface EventData {
    params: EventParams;
    block: {
        number: bigint;
        timestamp: bigint;
    };
    transaction: {
        hash: string;
    };
    logIndex: number;
}

export interface EventHandler {
    handler(fn: (args: { event: EventData; context: EventContext }) => Promise<void>): void;
}

export namespace Monadgotchi {
    export const PetMinted: EventHandler;
    export const PetHungerUpdated: EventHandler;
    export const PetFainted: EventHandler;
    export const PetFed: EventHandler;
}

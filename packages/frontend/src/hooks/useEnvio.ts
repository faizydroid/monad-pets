import { useState, useEffect, useCallback } from 'react';
import { envioClient, queries } from '../utils/envioClient';
import { config } from '../utils/config';

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
}

interface EnvioState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch a single pet's data from Envio with polling
 */
export function usePet(petId: bigint | undefined) {
  const [state, setState] = useState<EnvioState<Pet>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchPet = useCallback(async () => {
    if (petId === undefined) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await envioClient.request<{ pet: Pet }>(queries.getPet, {
        petId: petId.toString(),
      });

      setState({
        data: response.pet,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        data: null,
        isLoading: false,
        error: error.message || 'Failed to fetch pet data',
      });
    }
  }, [petId]);

  useEffect(() => {
    fetchPet();

    // Poll every 30 seconds
    const interval = setInterval(fetchPet, config.petStatusPollInterval);

    return () => clearInterval(interval);
  }, [fetchPet]);

  return {
    ...state,
    refetch: fetchPet,
  };
}

/**
 * Hook to fetch all pets owned by an address
 */
export function usePetsByOwner(owner: string | undefined) {
  const [state, setState] = useState<EnvioState<Pet[]>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchPets = useCallback(async () => {
    if (!owner) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await envioClient.request<{ pets: Pet[] }>(queries.getPetsByOwner, {
        owner: owner.toLowerCase(),
      });

      setState({
        data: response.pets || null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        data: null,
        isLoading: false,
        error: error.message || 'Failed to fetch pets',
      });
    }
  }, [owner]);

  useEffect(() => {
    fetchPets();

    // Poll every 30 seconds
    const interval = setInterval(fetchPets, config.petStatusPollInterval);

    return () => clearInterval(interval);
  }, [fetchPets]);

  return {
    ...state,
    refetch: fetchPets,
  };
}

/**
 * Hook to fetch feed events for a pet
 */
export function useFeedEvents(petId: bigint | undefined) {
  const [state, setState] = useState<EnvioState<FeedEvent[]>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchEvents = useCallback(async () => {
    if (petId === undefined) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await envioClient.request<{ feedEvents: FeedEvent[] }>(
        queries.getFeedEvents,
        {
          petId: petId.toString(),
        }
      );

      setState({
        data: response.feedEvents || null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        data: null,
        isLoading: false,
        error: error.message || 'Failed to fetch feed events',
      });
    }
  }, [petId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    ...state,
    refetch: fetchEvents,
  };
}

import { useEffect, useRef } from 'react';
import { usePetsByOwner } from '../hooks/useEnvio';
import { useMint } from '../hooks/useContract';

interface PetOwnershipProps {
  ownerAddress: string;
  onPetSelect: (petId: bigint) => void;
  selectedPetId?: bigint;
}

/**
 * PetOwnership component for displaying owned pets and minting new ones
 */
export function PetOwnership({ ownerAddress, onPetSelect, selectedPetId }: PetOwnershipProps) {
  const { data: pets, isLoading, error, refetch } = usePetsByOwner(ownerAddress);
  const { mint, isLoading: isMinting, isSuccess: mintSuccess, txHash } = useMint();
  const previousPetCount = useRef<number>(0);
  const hasMintedRef = useRef<boolean>(false);

  const handleMint = () => {
    if (mint) {
      hasMintedRef.current = true;
      mint();
    }
  };

  // Refetch pets after successful mint and auto-select the new pet
  useEffect(() => {
    if (mintSuccess && txHash) {
      // For mock mode, trigger pet creation
      const mintKey = `mock_mint_${ownerAddress.toLowerCase()}`;
      localStorage.setItem(mintKey, 'true');
      
      const timer = setTimeout(() => {
        refetch();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mintSuccess, txHash, refetch, ownerAddress]);

  // Auto-select the newly minted pet or first pet if none selected
  useEffect(() => {
    if (pets && pets.length > 0) {
      // If we just minted a pet and the count increased, select the newest pet
      if (hasMintedRef.current && pets.length > previousPetCount.current) {
        // Find the pet with the highest ID (newest)
        const newestPet = pets.reduce((newest, current) => 
          current.petId > newest.petId ? current : newest
        );
        onPetSelect(newestPet.petId);
        hasMintedRef.current = false;
      }
      // If no pet is selected and we have pets, select the first one
      else if (selectedPetId === undefined) {
        onPetSelect(pets[0].petId);
      }
      
      previousPetCount.current = pets.length;
    }
  }, [pets, selectedPetId, onPetSelect]);

  if (isLoading) {
    return (
      <div className="pet-ownership">
        <div className="loading">Loading your pets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pet-ownership">
        <div className="error">Failed to load pets</div>
      </div>
    );
  }

  if (!pets || pets.length === 0) {
    return (
      <div className="pet-ownership">
        <div className="no-pets">
          <h2>Welcome to Monadgotchi!</h2>
          <p>You don't have any pets yet. Mint your first Monadgotchi to get started!</p>
          <button
            onClick={handleMint}
            disabled={isMinting || !mint}
            className={`mint-button ${isMinting ? 'loading' : ''}`}
          >
            {isMinting ? 'Minting...' : '✨ Mint Your First Pet'}
          </button>

          {mintSuccess && txHash && (
            <div className="transaction-status status-success">
              Pet minted successfully! Loading your new pet...{' '}
              <a
                href={`https://explorer.testnet.monad.xyz/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tx-link"
              >
                View transaction
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pet-ownership">
      <div className="pets-header">
        <h2>Your Pets ({pets.length})</h2>
        <button
          onClick={handleMint}
          disabled={isMinting || !mint}
          className={`mint-button-small ${isMinting ? 'loading' : ''}`}
        >
          {isMinting ? 'Minting...' : '+ Mint Another'}
        </button>
      </div>

      {mintSuccess && txHash && (
        <div className="transaction-status status-success">
          New pet minted! Your newest pet has been automatically selected.{' '}
          <a
            href={`https://explorer.testnet.monad.xyz/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View transaction
          </a>
        </div>
      )}

      <div className="pets-list">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className={`pet-card ${selectedPetId === pet.petId ? 'selected' : ''}`}
            onClick={() => onPetSelect(pet.petId)}
          >
            <div className="pet-card-id">Pet #{pet.petId.toString()}</div>
            <div className="pet-card-hunger">
              Hunger: {pet.hunger}
              {pet.isFainted && <span className="fainted-badge">Fainted</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

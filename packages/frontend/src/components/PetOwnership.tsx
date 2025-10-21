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

  const handleMint = () => {
    if (mint) {
      mint();
    }
  };

  // Refetch pets after successful mint
  if (mintSuccess && txHash) {
    setTimeout(() => refetch(), 2000);
  }

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
              Pet minted successfully!{' '}
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
          New pet minted!{' '}
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

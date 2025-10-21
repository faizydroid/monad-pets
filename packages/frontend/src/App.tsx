import { useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnect } from './components/WalletConnect';
import { PetOwnership } from './components/PetOwnership';
import { PetDisplay } from './components/PetDisplay';
import { HungerBar } from './components/HungerBar';
import { FeedButton } from './components/FeedButton';
import { DelegationButton } from './components/DelegationButton';
import { PetStatus } from './components/PetStatus';
import { TransactionHistory } from './components/TransactionHistory';
import { usePet } from './hooks/useEnvio';

function App() {
  const { address, isConnected } = useAccount();
  const [selectedPetId, setSelectedPetId] = useState<bigint | undefined>(undefined);
  const { data: pet } = usePet(selectedPetId);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎮 Monadgotchi</h1>
        <p className="tagline">Your Virtual Pet on Monad Testnet</p>
        <WalletConnect />
      </header>

      <main className="app-main">
        {!isConnected ? (
          <div className="welcome-screen">
            <h2>Welcome to Monadgotchi!</h2>
            <p>Connect your wallet to start playing</p>
          </div>
        ) : (
          <>
            <PetOwnership
              ownerAddress={address!}
              onPetSelect={setSelectedPetId}
              selectedPetId={selectedPetId}
            />

            {selectedPetId !== undefined && pet && (
              <div className="pet-container">
                <div className="pet-main">
                  <PetDisplay hunger={pet.hunger} isFainted={pet.isFainted} />
                  <HungerBar hunger={pet.hunger} />
                  <PetStatus petId={selectedPetId} />
                </div>

                <div className="pet-actions">
                  <FeedButton
                    petId={selectedPetId}
                    isFainted={pet.isFainted}
                  />
                  <DelegationButton petId={selectedPetId} />
                </div>

                <TransactionHistory petId={selectedPetId} ownerAddress={address!} />
              </div>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ on Monad Testnet</p>
      </footer>
    </div>
  );
}

export default App;

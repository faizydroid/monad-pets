import { useFeed } from '../hooks/useContract';

interface FeedButtonProps {
  petId: bigint;
  isFainted: boolean;
  disabled?: boolean;
}

/**
 * FeedButton component for manually feeding a pet
 */
export function FeedButton({ petId, isFainted, disabled }: FeedButtonProps) {
  const { feed, isLoading, isSuccess, error, txHash } = useFeed(petId);

  const handleFeed = () => {
    if (feed) {
      feed();
    }
  };

  const isDisabled = disabled || isFainted || isLoading || !feed;

  return (
    <div className="feed-button-container">
      <button
        onClick={handleFeed}
        disabled={isDisabled}
        className={`feed-button ${isLoading ? 'loading' : ''}`}
      >
        {isLoading ? 'Feeding...' : 'Feed Pet 🍖'}
      </button>

      {isLoading && (
        <div className="transaction-status status-pending">
          Transaction pending...
        </div>
      )}

      {isSuccess && txHash && (
        <div className="transaction-status status-success">
          Fed successfully! 
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

      {error && (
        <div className="transaction-status status-error">
          Error: {error.message || 'Failed to feed pet'}
        </div>
      )}

      {isFainted && (
        <div className="feed-warning">
          Your pet has fainted and cannot be fed anymore.
        </div>
      )}
    </div>
  );
}

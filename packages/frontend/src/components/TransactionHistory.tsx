import { useFeedEvents } from '../hooks/useEnvio';
import { config } from '../utils/config';

interface TransactionHistoryProps {
  petId: bigint;
  ownerAddress: string;
}

/**
 * TransactionHistory component displaying recent feed events
 */
export function TransactionHistory({ petId }: TransactionHistoryProps) {
  const { data: feedEvents, isLoading, error } = useFeedEvents(petId);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isAutomated = (feederAddress: string) => {
    return feederAddress.toLowerCase() === config.agentAddress.toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="transaction-history">
        <h3>Feed History</h3>
        <div className="loading">Loading feed history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history">
        <h3>Feed History</h3>
        <div className="error">Failed to load feed history</div>
      </div>
    );
  }

  if (!feedEvents || feedEvents.length === 0) {
    return (
      <div className="transaction-history">
        <h3>Feed History</h3>
        <div className="empty">No feed events yet</div>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <h3>Feed History</h3>
      <div className="feed-events-list">
        {feedEvents.map((event) => (
          <div key={event.id} className="feed-event">
            <div className="event-info">
              <div className="event-type">
                {isAutomated(event.feeder) ? (
                  <span className="automated-badge">🤖 Automated</span>
                ) : (
                  <span className="manual-badge">👤 Manual</span>
                )}
              </div>
              <div className="event-details">
                <span className="event-feeder">
                  Fed by: {formatAddress(event.feeder)}
                </span>
                <span className="event-time">{formatTimestamp(event.timestamp)}</span>
              </div>
            </div>
            <a
              href={`https://explorer.testnet.monad.xyz/tx/${event.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="event-link"
            >
              View →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

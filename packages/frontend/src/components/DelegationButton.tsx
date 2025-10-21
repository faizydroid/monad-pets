import { useDelegation } from '../hooks/useDelegation';
import { config } from '../utils/config';

interface DelegationButtonProps {
  petId: bigint;
}

/**
 * DelegationButton component for hiring/revoking the Pet Sitter Agent
 */
export function DelegationButton({ petId }: DelegationButtonProps) {
  const {
    isDelegated,
    grantDelegation,
    revokeDelegation,
    isGranting,
    isRevoking,
    grantError,
    revokeError,
    grantTxHash,
    revokeTxHash,
  } = useDelegation(petId);

  if (!config.agentAddress) {
    return (
      <div className="delegation-container">
        <div className="delegation-warning">
          Pet Sitter Agent address not configured
        </div>
      </div>
    );
  }

  const handleGrant = () => {
    if (grantDelegation) {
      grantDelegation();
    }
  };

  const handleRevoke = () => {
    if (revokeDelegation) {
      revokeDelegation();
    }
  };

  return (
    <div className="delegation-container">
      {!isDelegated ? (
        <>
          <button
            onClick={handleGrant}
            disabled={isGranting || !grantDelegation}
            className={`delegation-button hire-button ${isGranting ? 'loading' : ''}`}
          >
            {isGranting ? 'Hiring Pet Sitter...' : '🤖 Hire a Pet Sitter'}
          </button>
          <p className="delegation-description">
            Automate your pet's care! The Pet Sitter will feed your pet when hunger reaches 90.
          </p>
        </>
      ) : (
        <>
          <div className="delegation-status active">
            <span className="status-icon">✅</span>
            <span className="status-text">Pet Sitter Active</span>
          </div>
          <button
            onClick={handleRevoke}
            disabled={isRevoking || !revokeDelegation}
            className={`delegation-button revoke-button ${isRevoking ? 'loading' : ''}`}
          >
            {isRevoking ? 'Revoking...' : 'Revoke Pet Sitter'}
          </button>
        </>
      )}

      {isGranting && (
        <div className="transaction-status status-pending">
          Granting delegation...
        </div>
      )}

      {isRevoking && (
        <div className="transaction-status status-pending">
          Revoking delegation...
        </div>
      )}

      {grantTxHash && (
        <div className="transaction-status status-success">
          Pet Sitter hired!{' '}
          <a
            href={`https://explorer.testnet.monad.xyz/tx/${grantTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View transaction
          </a>
        </div>
      )}

      {revokeTxHash && (
        <div className="transaction-status status-success">
          Pet Sitter revoked.{' '}
          <a
            href={`https://explorer.testnet.monad.xyz/tx/${revokeTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View transaction
          </a>
        </div>
      )}

      {grantError && (
        <div className="transaction-status status-error">
          Error: {grantError.message || 'Failed to grant delegation'}
        </div>
      )}

      {revokeError && (
        <div className="transaction-status status-error">
          Error: {revokeError.message || 'Failed to revoke delegation'}
        </div>
      )}
    </div>
  );
}

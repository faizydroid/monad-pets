import { usePet } from '../hooks/useEnvio';
import { useDelegation } from '../hooks/useDelegation';
import { config } from '../utils/config';

interface PetStatusProps {
  petId: bigint;
}

/**
 * PetStatus component for displaying real-time pet status and monitoring
 */
export function PetStatus({ petId }: PetStatusProps) {
  const { data: pet, isLoading } = usePet(petId);
  const { isDelegated } = useDelegation(petId);

  if (isLoading || !pet) {
    return (
      <div className="pet-status">
        <div className="loading">Loading pet status...</div>
      </div>
    );
  }

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleString();
    }
  };

  const isCritical = pet.hunger >= config.hungerThresholds.hungry + 1;

  return (
    <div className="pet-status">
      <div className="status-grid">
        <div className="status-item">
          <span className="status-label">Pet ID</span>
          <span className="status-value">#{pet.petId.toString()}</span>
        </div>

        <div className="status-item">
          <span className="status-label">Last Fed</span>
          <span className="status-value">{formatTimestamp(pet.lastFeedTimestamp)}</span>
        </div>

        <div className="status-item">
          <span className="status-label">Automation</span>
          <span className={`status-value automation-${isDelegated ? 'active' : 'inactive'}`}>
            {isDelegated ? (
              <>
                <span className="status-icon">✅</span> Active
              </>
            ) : (
              <>
                <span className="status-icon">⭕</span> Inactive
              </>
            )}
          </span>
        </div>

        <div className="status-item">
          <span className="status-label">Status</span>
          <span className="status-value">
            {pet.isFainted ? (
              <span className="status-fainted">😵 Fainted</span>
            ) : isCritical ? (
              <span className="status-critical">⚠️ Critical</span>
            ) : (
              <span className="status-healthy">✅ Healthy</span>
            )}
          </span>
        </div>
      </div>

      {isCritical && !pet.isFainted && !isDelegated && (
        <div className="critical-warning">
          <strong>⚠️ Warning:</strong> Your pet's hunger is critical! Feed it now or hire a Pet
          Sitter to automate feeding.
        </div>
      )}

      {isCritical && !pet.isFainted && isDelegated && (
        <div className="automation-notice">
          <strong>🤖 Pet Sitter Active:</strong> Your pet will be automatically fed when hunger
          reaches 90.
        </div>
      )}
    </div>
  );
}

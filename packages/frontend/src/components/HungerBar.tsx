import { useMemo } from 'react';
import { config } from '../utils/config';

interface HungerBarProps {
  hunger: number;
}

/**
 * HungerBar component displaying hunger level with color coding
 */
export function HungerBar({ hunger }: HungerBarProps) {
  const barColor = useMemo(() => {
    if (hunger <= config.hungerThresholds.happy) {
      return 'green';
    }
    if (hunger <= config.hungerThresholds.hungry) {
      return 'yellow';
    }
    return 'red';
  }, [hunger]);

  const percentage = Math.min(hunger, 100);

  return (
    <div className="hunger-bar-container">
      <div className="hunger-bar-label">
        <span>Hunger</span>
        <span className="hunger-value">
          {hunger}/100 ({percentage}%)
        </span>
      </div>
      <div className="hunger-bar-track">
        <div
          className={`hunger-bar-fill hunger-bar-${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

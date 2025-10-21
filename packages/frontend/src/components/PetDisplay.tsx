import { useMemo } from 'react';
import { config } from '../utils/config';

interface PetDisplayProps {
  hunger: number;
  isFainted: boolean;
}

type PetState = 'happy' | 'hungry' | 'very-hungry' | 'fainted';

/**
 * PetDisplay component showing pixel-art pet with animations based on hunger state
 */
export function PetDisplay({ hunger, isFainted }: PetDisplayProps) {
  const petState: PetState = useMemo(() => {
    if (isFainted || hunger >= config.hungerThresholds.fainted) {
      return 'fainted';
    }
    if (hunger >= config.hungerThresholds.hungry + 1) {
      return 'very-hungry';
    }
    if (hunger > config.hungerThresholds.happy) {
      return 'hungry';
    }
    return 'happy';
  }, [hunger, isFainted]);

  const getEmoji = () => {
    switch (petState) {
      case 'happy':
        return '😊';
      case 'hungry':
        return '😐';
      case 'very-hungry':
        return '😟';
      case 'fainted':
        return '😵';
    }
  };

  const getStateLabel = () => {
    switch (petState) {
      case 'happy':
        return 'Happy';
      case 'hungry':
        return 'Hungry';
      case 'very-hungry':
        return 'Very Hungry!';
      case 'fainted':
        return 'Fainted';
    }
  };

  return (
    <div className={`pet-display pet-state-${petState}`}>
      <div className="pet-sprite">
        <div className="pet-emoji">{getEmoji()}</div>
      </div>
      <div className="pet-state-label">{getStateLabel()}</div>
    </div>
  );
}

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

  const getAssetPath = () => {
    switch (petState) {
      case 'happy':
        return '/assets/pets/happy.svg';
      case 'hungry':
        return '/assets/pets/hungry.svg';
      case 'very-hungry':
        return '/assets/pets/very-hungry.svg';
      case 'fainted':
        return '/assets/pets/fainted.svg';
    }
  };

  const getStateLabel = () => {
    switch (petState) {
      case 'happy':
        return 'Happy & Content';
      case 'hungry':
        return 'Getting Hungry';
      case 'very-hungry':
        return 'Very Hungry!';
      case 'fainted':
        return 'Fainted from Hunger';
    }
  };

  return (
    <div className={`pet-display pet-state-${petState}`}>
      <div className="pet-sprite">
        <img 
          src={getAssetPath()} 
          alt={`Pet is ${petState}`}
          className="pet-image"
        />
      </div>
      <div className="pet-state-label">{getStateLabel()}</div>
    </div>
  );
}

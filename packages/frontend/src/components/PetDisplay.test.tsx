import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PetDisplay } from './PetDisplay';

describe('PetDisplay', () => {
  it('renders happy state for low hunger', () => {
    render(<PetDisplay hunger={30} isFainted={false} />);
    expect(screen.getByText('Happy')).toBeInTheDocument();
    expect(screen.getByText('😊')).toBeInTheDocument();
  });

  it('renders hungry state for medium hunger', () => {
    render(<PetDisplay hunger={60} isFainted={false} />);
    expect(screen.getByText('Hungry')).toBeInTheDocument();
    expect(screen.getByText('😐')).toBeInTheDocument();
  });

  it('renders very hungry state for high hunger', () => {
    render(<PetDisplay hunger={95} isFainted={false} />);
    expect(screen.getByText('Very Hungry!')).toBeInTheDocument();
    expect(screen.getByText('😟')).toBeInTheDocument();
  });

  it('renders fainted state when pet is fainted', () => {
    render(<PetDisplay hunger={100} isFainted={true} />);
    expect(screen.getByText('Fainted')).toBeInTheDocument();
    expect(screen.getByText('😵')).toBeInTheDocument();
  });
});

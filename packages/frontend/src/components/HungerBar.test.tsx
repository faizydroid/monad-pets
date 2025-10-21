import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HungerBar } from './HungerBar';

describe('HungerBar', () => {
  it('displays correct hunger value', () => {
    render(<HungerBar hunger={45} />);
    expect(screen.getByText(/45\/100/)).toBeInTheDocument();
    expect(screen.getByText(/45%/)).toBeInTheDocument();
  });

  it('applies green color for low hunger', () => {
    const { container } = render(<HungerBar hunger={30} />);
    const fill = container.querySelector('.hunger-bar-green');
    expect(fill).toBeInTheDocument();
  });

  it('applies yellow color for medium hunger', () => {
    const { container } = render(<HungerBar hunger={70} />);
    const fill = container.querySelector('.hunger-bar-yellow');
    expect(fill).toBeInTheDocument();
  });

  it('applies red color for high hunger', () => {
    const { container } = render(<HungerBar hunger={95} />);
    const fill = container.querySelector('.hunger-bar-red');
    expect(fill).toBeInTheDocument();
  });
});

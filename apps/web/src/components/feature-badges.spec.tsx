import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  RiskBadge,
  StageBadge,
  TrackBadge,
} from '@web/components/feature-badges';

describe('feature badges (RTL)', () => {
  it('renders stage text', () => {
    render(<StageBadge stage="RACI" />);
    expect(screen.getByText('RACI')).toBeInTheDocument();
  });

  it('renders risk tier', () => {
    render(<RiskBadge tier="P1" />);
    expect(screen.getByText('P1')).toBeInTheDocument();
  });

  it('renders light track label', () => {
    render(<TrackBadge track="LIGHT" />);
    expect(screen.getByText('Light')).toBeInTheDocument();
  });
});

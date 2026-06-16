import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Typography } from './Typography';

describe('Typography', () => {
  it('uses semantic default elements for heading variants', () => {
    render(<Typography variant="h2">Section title</Typography>);

    expect(screen.getByRole('heading', { level: 2, name: 'Section title' })).toBeInTheDocument();
  });

  it('allows overriding the rendered element', () => {
    render(
      <Typography as="span" variant="h3">
        Inline heading style
      </Typography>,
    );

    expect(screen.getByText('Inline heading style').tagName).toBe('SPAN');
  });

  it('applies alignment, weight, spacing, and clamp classes', () => {
    render(
      <Typography align="center" gutterBottom lineClamp={2} weight="bold">
        Wrapped text
      </Typography>,
    );

    expect(screen.getByText('Wrapped text')).toHaveClass(
      'text-center',
      'font-bold',
      'mb-2',
      'line-clamp-2',
    );
  });

  it('prefers noWrap over lineClamp when both are provided', () => {
    render(
      <Typography lineClamp={3} noWrap>
        One line text
      </Typography>,
    );

    expect(screen.getByText('One line text')).toHaveClass('truncate');
    expect(screen.getByText('One line text')).not.toHaveClass('line-clamp-3');
  });
});

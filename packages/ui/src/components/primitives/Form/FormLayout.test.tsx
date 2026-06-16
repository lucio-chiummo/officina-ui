import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../Button';
import { Fieldset, FormActions, FormGrid } from './FormLayout';

describe('form layout primitives', () => {
  it('renders a semantic fieldset with legend and description', () => {
    render(
      <Fieldset legend="Workspace" description="Configure workspace defaults.">
        <input aria-label="Workspace name" />
      </Fieldset>,
    );

    expect(screen.getByRole('group', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.getByText('Configure workspace defaults.')).toBeInTheDocument();
    expect(screen.getByLabelText('Workspace name')).toBeInTheDocument();
  });

  it('applies responsive grid column classes', () => {
    render(
      <FormGrid columns={3} data-testid="form-grid">
        <input aria-label="One" />
        <input aria-label="Two" />
      </FormGrid>,
    );

    expect(screen.getByTestId('form-grid')).toHaveClass('grid-cols-1', 'md:grid-cols-3');
  });

  it('aligns actions and supports sticky mode', () => {
    render(
      <FormActions align="between" sticky data-testid="form-actions">
        <Button>Cancel</Button>
        <Button>Save</Button>
      </FormActions>,
    );

    expect(screen.getByTestId('form-actions')).toHaveClass('justify-between', 'sticky');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});

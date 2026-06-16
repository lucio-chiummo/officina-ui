import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { Stepper } from './Stepper';

const steps = [
  { id: 'details', label: 'Details' },
  { id: 'billing', label: 'Billing' },
  { id: 'review', label: 'Review' },
];

function WizardHarness({ valid = true }: { valid?: boolean }) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (!valid) return;
    setCurrent((step) => Math.min(step + 1, steps.length - 1));
  };

  return (
    <section>
      <Stepper current={current} steps={steps} />
      <h2>{steps[current]!.label}</h2>
      <button type="button" disabled={current === 0} onClick={() => setCurrent((step) => step - 1)}>
        Back
      </button>
      {current === steps.length - 1 ? (
        <button type="button">Submit</button>
      ) : (
        <button type="button" onClick={next}>
          Next
        </button>
      )}
      {!valid ? <p role="alert">Complete required fields</p> : null}
    </section>
  );
}

describe('Stepper', () => {
  it('renders the active step indicator', () => {
    render(<Stepper current={1} steps={steps} />);

    expect(screen.getByRole('button', { current: 'step' })).toHaveTextContent('2');
    expect(screen.getByText('Billing')).toBeInTheDocument();
  });

  it('supports next and back navigation through a wizard', async () => {
    const user = userEvent.setup();
    render(<WizardHarness />);

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByRole('heading', { name: /billing/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByRole('heading', { name: /details/i })).toBeInTheDocument();
  });

  it('blocks advance when validation fails', async () => {
    const user = userEvent.setup();
    render(<WizardHarness valid={false} />);

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByRole('heading', { name: /details/i })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Complete required fields');
  });

  it('shows submit on the last step', async () => {
    const user = userEvent.setup();
    render(<WizardHarness />);

    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByRole('heading', { name: /review/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import type { FilterFieldDef } from '@/lib/filters';

import { FilterBar } from './FilterBar';
import { FiltersProvider } from './FiltersContext';
import { useFilters } from './useFilters';

type Row = { name: string; age: number; active: boolean; plan: 'free' | 'pro' };

const fields: FilterFieldDef<Row>[] = [
  { id: 'name', label: 'Name', type: 'string' },
  { id: 'age', label: 'Age', type: 'number' },
  { id: 'active', label: 'Active', type: 'boolean' },
  {
    id: 'plan',
    label: 'Plan',
    type: 'enum',
    options: [
      { label: 'Free', value: 'free' },
      { label: 'Pro', value: 'pro' },
    ],
  },
];

function FilterHarness() {
  const filters = useFilters<Row>({ fields, mode: 'client' });
  return (
    <FiltersProvider value={filters}>
      <FilterBar />
    </FiltersProvider>
  );
}

describe('FilterBar', () => {
  it('adds a field, edits value, and renders a removable chip', async () => {
    const user = userEvent.setup();
    render(<FilterHarness />);

    await user.click(screen.getByRole('button', { name: /add filter/i }));
    await user.click(screen.getByRole('button', { name: 'Name' }));
    await user.type(screen.getByLabelText('Name value'), 'ali');

    const chipRemove = await screen.findByRole('button', {
      name: /remove filter: name contains ali/i,
    });
    await user.click(chipRemove);

    await waitFor(() => expect(screen.getByRole('button', { name: /add filter/i })).toHaveFocus());
  });

  it('supports advanced grouped rules', async () => {
    const user = userEvent.setup();
    render(<FilterHarness />);

    await user.click(screen.getByRole('button', { name: /add filter/i }));
    await user.click(screen.getByRole('button', { name: /advanced/i }));
    await user.click(await screen.findByRole('button', { name: /add group/i }));

    expect(await screen.findAllByRole('combobox', { name: /filter combinator/i })).toHaveLength(2);
  });
});

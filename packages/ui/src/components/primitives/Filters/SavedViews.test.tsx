import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { FilterFieldDef } from '@/lib/filters';

import { FilterBar } from './FilterBar';
import { FiltersProvider } from './FiltersContext';
import { SavedViews } from './SavedViews';
import { useFilters } from './useFilters';

type Row = { name: string; plan: 'free' | 'pro' };

const fields: FilterFieldDef<Row>[] = [
  { id: 'name', label: 'Name', type: 'string' },
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

function SavedViewsHarness({ onShare }: { onShare?: (url: string) => void }) {
  const filters = useFilters<Row>({ fields, mode: 'client', urlKey: 'f' });
  return (
    <FiltersProvider value={filters}>
      <SavedViews urlKey="f" {...(onShare ? { onShare } : {})} />
      <FilterBar />
    </FiltersProvider>
  );
}

async function addNameFilter(value: string) {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: /add filter/i }));
  await user.click(screen.getByRole('button', { name: 'Name' }));
  await user.type(screen.getByLabelText('Name value'), value);
  await user.keyboard('{Escape}');
  return user;
}

describe('SavedViews', () => {
  afterEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/');
    vi.restoreAllMocks();
  });

  it('saves pinned views to scoped localStorage and restores them from tabs', async () => {
    const user = await addNameFilterWithHarness('ali');
    vi.spyOn(window, 'prompt').mockReturnValue('Ali accounts');

    await user.click(screen.getByRole('button', { name: /save as/i }));

    const raw = localStorage.getItem('officina.filters.views.f');
    expect(raw).toContain('Ali accounts');
    expect(screen.getByRole('tab', { name: 'Ali accounts', selected: true })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear all/i }));
    expect(screen.queryByRole('button', { name: /remove filter: name contains ali/i })).toBeNull();

    await user.click(screen.getByRole('tab', { name: 'Ali accounts' }));
    expect(
      screen.getByRole('button', { name: /remove filter: name contains ali/i }),
    ).toBeInTheDocument();
  });

  it('copies a share URL with the filter url key', async () => {
    const onShare = vi.fn();

    await addNameFilterWithHarness('pro', onShare);
    fireEvent.click(screen.getByRole('button', { name: /share view/i }));

    await waitFor(() => {
      expect(onShare).toHaveBeenCalledWith(expect.stringContaining('f='));
    });
  });
});

async function addNameFilterWithHarness(value: string, onShare?: (url: string) => void) {
  render(<SavedViewsHarness {...(onShare ? { onShare } : {})} />);
  return addNameFilter(value);
}

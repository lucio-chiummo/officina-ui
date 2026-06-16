import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { registerCommands, useCommandStore } from './CommandPalette';
import { DateRangePicker } from './DatePicker';
import { SearchFilter } from './Filters';
import { Stepper } from './Stepper';

describe('commercial primitive behaviors', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
    useCommandStore.setState({ actions: [], open: false });
  });

  it('registers CommandPalette actions and runs commands', () => {
    const perform = vi.fn();
    const unregister = registerCommands([
      { id: 'new-user', label: 'Invite user', perform, section: 'actions' },
    ]);

    const action = useCommandStore.getState().actions[0];
    expect(action?.label).toBe('Invite user');
    action?.perform();

    expect(perform).toHaveBeenCalledTimes(1);
    unregister();
    expect(useCommandStore.getState().actions).toEqual([]);
  });

  it('Stepper exposes active state and step clicks', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();

    render(
      <Stepper
        current={1}
        onStepClick={onStepClick}
        steps={[
          { id: 'details', label: 'Details' },
          { id: 'review', label: 'Review' },
        ]}
      />,
    );

    expect(screen.getByRole('button', { current: 'step' })).toHaveTextContent('2');
    await user.click(screen.getAllByRole('button')[0]!);
    expect(onStepClick).toHaveBeenCalledWith(0);
  });

  it('DateRangePicker applies presets', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const range = { from: new Date(2026, 4, 1), to: new Date(2026, 4, 10) };

    render(
      <DateRangePicker
        value={{ from: undefined, to: undefined }}
        onChange={onChange}
        placeholder="Pick dates"
        presets={[{ label: 'This month', range }]}
      />,
    );

    await user.click(screen.getByRole('button', { name: /pick dates/i }));
    await user.click(screen.getByRole('button', { name: /this month/i }));
    expect(onChange).toHaveBeenCalledWith(range);
  });

  it('SearchFilter reports typed values', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchFilter value="" onChange={onChange} placeholder="Search records" />);

    await user.type(screen.getByPlaceholderText('Search records'), 'abc');
    expect(onChange).toHaveBeenLastCalledWith('c');
  });
});

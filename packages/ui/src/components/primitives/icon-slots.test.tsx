/**
 * Icon slots must constrain the SVG they are handed.
 *
 * Consumers pass icons straight from an icon library, and those render at their
 * own intrinsic size — lucide defaults to 24px. A slot that is `size-4` without
 * a descendant rule sizes the box but not the icon inside it, so the icon
 * overflows and pushes the row's text out of alignment.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BottomNavigation } from './BottomNavigation';
import { Chip } from './Chip';
import { Dropdown } from './Dropdown';
import { RadioGroup } from './RadioGroup';
import { SpeedDial } from './SpeedDial';

/** Stands in for a lucide icon: an SVG carrying its own 24px intrinsic size. */
function UnsizedIcon() {
  return <svg data-testid="icon" width="24" height="24" />;
}

/** The wrapper must size the SVG, not just its own box. */
function expectSlotConstrainsIcon(testId = 'icon') {
  const slot = screen.getAllByTestId(testId)[0]?.parentElement;
  expect(slot).not.toBeNull();
  expect(slot?.className).toMatch(/\[&>svg\]:size-/);
}

describe('icon slots constrain their SVG', () => {
  it('Dropdown menu items', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    render(
      <Dropdown
        trigger={<button type="button">Open</button>}
        sections={[{ items: [{ label: 'Edit', icon: <UnsizedIcon /> }] }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expectSlotConstrainsIcon();
  });

  it('Chip', () => {
    render(<Chip label="Draft" icon={<UnsizedIcon />} />);
    expectSlotConstrainsIcon();
  });

  it('RadioGroup options', () => {
    render(
      <RadioGroup
        value="a"
        onChange={() => undefined}
        options={[{ value: 'a', label: 'A', icon: <UnsizedIcon /> }]}
      />,
    );
    expectSlotConstrainsIcon();
  });

  it('SpeedDial actions', () => {
    render(<SpeedDial actions={[{ label: 'Add', icon: <UnsizedIcon /> }]} open />);
    expectSlotConstrainsIcon();
  });

  it('BottomNavigation items', () => {
    render(
      <BottomNavigation
        value="home"
        onChange={() => undefined}
        items={[{ value: 'home', label: 'Home', icon: <UnsizedIcon /> }]}
      />,
    );
    expectSlotConstrainsIcon();
  });
});

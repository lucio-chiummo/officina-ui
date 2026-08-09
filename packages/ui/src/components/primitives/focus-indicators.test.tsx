/**
 * Every control a keyboard user can reach must show where focus is (WCAG 2.4.7).
 *
 * Components that delegate to Button/IconButton or Headless UI inherit an
 * indicator. The ones here render a raw <button> and have to opt in, and a
 * component that forgets is invisible to keyboard navigation without any test
 * or type error failing.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Alert } from './Alert';
import { Banner } from './Banner';
import { Chip } from './Chip';
import { Pagination } from './Pagination';
import { Stepper } from './Stepper';
import { TreeView } from './TreeView';
import { Wizard } from './Wizard';

/** Matches the ring the library uses for keyboard focus. */
const FOCUS_INDICATOR = /focus-visible:(ring|outline)|data-\[focus\]:ring/;

function expectFocusIndicator(button: HTMLElement) {
  expect(button.className).toMatch(FOCUS_INDICATOR);
}

describe('keyboard focus indicators', () => {
  it('Pagination page buttons', () => {
    render(<Pagination page={2} totalPages={5} onPageChange={() => undefined} />);
    for (const button of screen.getAllByRole('button')) expectFocusIndicator(button);
  });

  it('Alert dismiss button', () => {
    render(
      <Alert title="Heads up" dismissible>
        Body
      </Alert>,
    );
    expectFocusIndicator(screen.getByRole('button'));
  });

  it('Banner dismiss button', () => {
    render(<Banner onDismiss={() => undefined}>Notice</Banner>);
    expectFocusIndicator(screen.getByRole('button'));
  });

  it('Chip remove button', () => {
    render(<Chip label="Draft" onRemove={() => undefined} />);
    expectFocusIndicator(screen.getByRole('button'));
  });

  it('Wizard navigation buttons', () => {
    render(
      <Wizard
        steps={[
          { id: 'one', title: 'One', content: <p>1</p> },
          { id: 'two', title: 'Two', content: <p>2</p> },
        ]}
      />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) expectFocusIndicator(button);
  });

  it('Stepper clickable steps', () => {
    render(
      <Stepper
        steps={[
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ]}
        current={1}
        onStepClick={() => undefined}
      />,
    );
    for (const button of screen.getAllByRole('button')) expectFocusIndicator(button);
  });

  it('TreeView nodes', () => {
    render(<TreeView nodes={[{ id: 'root', label: 'Root', children: [] }]} />);
    for (const button of screen.getAllByRole('button')) expectFocusIndicator(button);
  });
});

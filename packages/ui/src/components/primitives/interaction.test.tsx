import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Combobox } from './Combobox';
import { ContextMenu } from './ContextMenu';
import { SavedViews } from './Filters';
import { MentionInput } from './MentionInput';
import { MultiSelect } from './MultiSelect';
import { Popover } from './Popover';
import { Rating } from './Rating';
import { ToggleGroup } from './ToggleGroup';

describe('primitive interactions', () => {
  it('ToggleGroup single uses radio semantics only', () => {
    render(
      <ToggleGroup
        type="single"
        value="a"
        onChange={() => undefined}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
      />,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    expect(radios[0]).not.toHaveAttribute('aria-pressed');
  });

  it('MentionInput supports arrow and enter mention selection', () => {
    const onChange = vi.fn();
    render(
      <MentionInput
        value="@l"
        onChange={onChange}
        options={[
          { id: '1', label: 'Lucio' },
          { id: '2', label: 'Luna' },
        ]}
      />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalled();
  });

  it('SavedViews reuses existing filters instead of duplicating', () => {
    const onChange = vi.fn();
    const replaceState = vi.spyOn(window.history, 'replaceState');
    const setItem = vi.spyOn(window.localStorage.__proto__, 'setItem');
    localStorage.setItem(
      'sv-test',
      JSON.stringify([{ id: 'one', label: 'Save 1', filters: { a: 1 } }]),
    );

    render(
      <SavedViews
        storageKey="sv-test"
        value={null}
        onChange={onChange}
        currentFilters={{ a: 1 }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(onChange).toHaveBeenCalledWith({ id: 'one', label: 'Save 1', filters: { a: 1 } });
    expect(setItem).not.toHaveBeenCalledWith('sv-test', expect.stringContaining('Save 2'));
    expect(replaceState).not.toHaveBeenCalled();
  });

  it('MultiSelect toggles active option with keyboard enter', () => {
    const onChange = vi.fn();
    render(
      <MultiSelect
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'live', label: 'Live' },
        ]}
        value={[]}
        onChange={onChange}
        placeholder="Statuses"
      />,
    );
    const trigger = screen.getByRole('button', { name: /statuses/i });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(['draft']);
  });

  it('ContextMenu clamps rendered position within viewport', () => {
    render(
      <ContextMenu items={[{ label: 'Open' }]}>
        <div>Target</div>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Target'), { clientX: 10_000, clientY: 10_000 });
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveStyle({ left: `${window.innerWidth - 228}px` });
  });

  it('Popover closes on Escape', () => {
    render(
      <Popover trigger={<button type="button">Open popover</button>}>
        <div>Popover body</div>
      </Popover>,
    );
    fireEvent.click(screen.getByRole('button', { name: /open popover/i }));
    expect(screen.getByText('Popover body')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
  });

  it('Rating supports read-only display mode', () => {
    const onChange = vi.fn();
    render(<Rating value={4} readOnly size="sm" onChange={onChange} label="Product rating" />);

    expect(screen.getByRole('slider', { name: /product rating/i })).toHaveAttribute(
      'aria-readonly',
      'true',
    );
    const firstStar = screen.getAllByRole('button', { hidden: true })[0];
    if (!firstStar) throw new Error('Expected rating star button');
    fireEvent.click(firstStar);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Popover anchors to trigger even when the trigger owns a ref', async () => {
    const readReferenceRect = vi.fn();
    const rect = {
      bottom: 112,
      height: 32,
      left: 120,
      right: 200,
      top: 80,
      width: 80,
      x: 120,
      y: 80,
      toJSON: () => undefined,
    };
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.textContent === 'Open popover') {
        readReferenceRect();
        return rect;
      }
      return {
        bottom: 80,
        height: 80,
        left: 0,
        right: 240,
        top: 0,
        width: 240,
        x: 0,
        y: 0,
        toJSON: () => undefined,
      };
    });

    function RefTriggerPopover() {
      const buttonRef = useRef<HTMLButtonElement>(null);
      return (
        <Popover trigger={<button ref={buttonRef}>Open popover</button>}>
          <div>Anchored body</div>
        </Popover>
      );
    }

    render(<RefTriggerPopover />);
    fireEvent.click(screen.getByRole('button', { name: /open popover/i }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
    await waitFor(() => expect(readReferenceRect).toHaveBeenCalled());
  });

  it('Combobox supports keyboard active descendant and escape close', () => {
    const onChange = vi.fn();
    render(
      <Combobox
        id="status"
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'live', label: 'Live' },
        ]}
        value={null}
        onChange={onChange}
        placeholder="Status"
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-activedescendant', 'status-option-0');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('draft');

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

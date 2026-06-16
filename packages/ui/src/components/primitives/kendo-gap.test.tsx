import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  if (!('IntersectionObserver' in globalThis)) {
    globalThis.IntersectionObserver = class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = () => [];
      root = null;
      rootMargin = '';
      thresholds = [];
    };
  }
});

import { ActionSheet } from './ActionSheet';
import { AIPrompt } from './AIPrompt';
import { MultiColumnCombobox } from './Combobox';
import { MultiViewCalendar } from './DatePicker';
import { DropDownTree } from './DropDownTree';
import { Gauge } from './Gauge';
import { applyMask, MaskedInput } from './MaskedInput';
import { Scheduler, type SchedulerEvent } from './Scheduler';
import { ScrollSpy } from './ScrollSpy';
import { RangeSlider } from './Slider';
import { Sparkline } from './Sparkline';
import { TreeList, type TreeListColumn, type TreeListRow } from './TreeList';
import { Window } from './Window';

// ── Sparkline ─────────────────────────────────────────────────────────────────

describe('Sparkline', () => {
  it('renders an svg line with role img', () => {
    render(<Sparkline data={[1, 5, 3, 8]} aria-label="Revenue trend" />);
    expect(screen.getByRole('img', { name: 'Revenue trend' })).toBeInTheDocument();
  });

  it('renders bars variant with one bar per point', () => {
    render(<Sparkline data={[2, 4, 6]} variant="bars" />);
    const wrapper = screen.getByRole('img');
    expect(wrapper.childElementCount).toBe(3);
  });

  it('renders nothing for empty data', () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

// ── RangeSlider ───────────────────────────────────────────────────────────────

describe('RangeSlider', () => {
  it('renders two thumbs as sliders', () => {
    render(<RangeSlider value={[20, 80]} onValueChange={vi.fn()} label="Price" />);
    expect(screen.getAllByRole('slider')).toHaveLength(2);
  });

  it('moves the lower thumb with arrow keys', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RangeSlider value={[20, 80]} onValueChange={onValueChange} label="Price" />);
    const [low] = screen.getAllByRole('slider');
    low?.focus();
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalledWith([21, 80]);
  });
});

// ── MaskedInput / applyMask ───────────────────────────────────────────────────

describe('applyMask', () => {
  it('formats digits into a phone mask', () => {
    expect(applyMask('5551234567', '(999) 999-9999')).toBe('(555) 123-4567');
  });

  it('skips characters that do not match the token', () => {
    expect(applyMask('ab12cd34', '9999')).toBe('1234');
  });

  it('handles letter and alphanumeric tokens', () => {
    expect(applyMask('AB1234', 'aa-9999')).toBe('AB-1234');
  });
});

describe('MaskedInput', () => {
  it('masks typed input', async () => {
    const user = userEvent.setup();
    let value = '';
    const onChange = vi.fn((v: string) => {
      value = v;
    });
    const { rerender } = render(
      <MaskedInput mask="99/99" value={value} onChange={onChange} label="Expiry" />,
    );
    const input = screen.getByLabelText('Expiry');
    await user.type(input, '1');
    rerender(<MaskedInput mask="99/99" value={value} onChange={onChange} label="Expiry" />);
    expect(onChange).toHaveBeenCalledWith('1');
  });
});

// ── MultiViewCalendar ─────────────────────────────────────────────────────────

describe('MultiViewCalendar', () => {
  it('renders multiple month grids', () => {
    render(<MultiViewCalendar months={2} value={undefined} onChange={vi.fn()} />);
    expect(screen.getAllByRole('grid').length).toBeGreaterThanOrEqual(2);
  });
});

// ── ScrollSpy ─────────────────────────────────────────────────────────────────

describe('ScrollSpy', () => {
  it('renders a nav link per item', () => {
    render(
      <ScrollSpy
        items={[
          { id: 'intro', label: 'Intro' },
          { id: 'usage', label: 'Usage' },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Intro' })).toHaveAttribute('href', '#intro');
    expect(screen.getByRole('link', { name: 'Usage' })).toHaveAttribute('href', '#usage');
  });
});

// ── Gauge ─────────────────────────────────────────────────────────────────────

describe('Gauge', () => {
  it('renders arc variant with formatted value', () => {
    render(<Gauge value={72} label="CPU" />);
    expect(screen.getByText('72')).toBeInTheDocument();
    expect(screen.getByText('CPU')).toBeInTheDocument();
  });

  it('renders linear variant', () => {
    render(<Gauge value={40} variant="linear" label="Disk" />);
    expect(screen.getByText('Disk')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('clamps value to max', () => {
    render(<Gauge value={250} max={100} formatValue={(v) => `${v}%`} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});

// ── Window ────────────────────────────────────────────────────────────────────

describe('Window', () => {
  it('renders a non-modal dialog with title and content', () => {
    render(
      <Window open onClose={vi.fn()} title="Inspector">
        <p>Window body</p>
      </Window>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Inspector' });
    expect(dialog).toHaveAttribute('aria-modal', 'false');
    expect(screen.getByText('Window body')).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    render(
      <Window open={false} onClose={vi.fn()} title="Hidden">
        <p>nope</p>
      </Window>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose on Escape and close button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Window open onClose={onClose} title="Closable">
        body
      </Window>,
    );
    await user.click(screen.getByRole('button', { name: 'Close window' }));
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

// ── ActionSheet ───────────────────────────────────────────────────────────────

describe('ActionSheet', () => {
  it('fires action then closes via cancel', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSelect = vi.fn();
    render(
      <ActionSheet
        open
        onClose={onClose}
        title="Share"
        actions={[{ label: 'Copy link', onSelect }]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Copy link' }));
    expect(onSelect).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalled();
  });
});

// ── AIPrompt ──────────────────────────────────────────────────────────────────

describe('AIPrompt', () => {
  it('submits trimmed prompt and clears input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AIPrompt onSubmit={onSubmit} />);
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '  summarize this  ');
    await user.keyboard('{Meta>}{Enter}{/Meta}');
    expect(onSubmit).toHaveBeenCalledWith('summarize this');
    expect(textarea).toHaveValue('');
  });

  it('fills input from suggestion chip', async () => {
    const user = userEvent.setup();
    render(<AIPrompt onSubmit={vi.fn()} suggestions={['Draft an email']} />);
    await user.click(screen.getByRole('button', { name: 'Draft an email' }));
    expect(screen.getByRole('textbox')).toHaveValue('Draft an email');
  });

  it('does not submit while busy', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AIPrompt onSubmit={onSubmit} busy onStop={vi.fn()} />);
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'hello');
    await user.keyboard('{Meta>}{Enter}{/Meta}');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

// ── DropDownTree ──────────────────────────────────────────────────────────────

describe('DropDownTree', () => {
  const nodes = [
    {
      id: 'eng',
      label: 'Engineering',
      children: [
        { id: 'fe', label: 'Frontend' },
        { id: 'be', label: 'Backend' },
      ],
    },
  ];

  it('opens tree and selects a leaf', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DropDownTree
        nodes={nodes}
        value={undefined}
        onChange={onChange}
        label="Team"
        defaultExpandedIds={['eng']}
      />,
    );
    await user.click(screen.getByRole('button', { name: /team/i }));
    await user.click(await screen.findByText('Frontend'));
    expect(onChange).toHaveBeenCalledWith('fe');
  });
});

// ── MultiColumnCombobox ───────────────────────────────────────────────────────

describe('MultiColumnCombobox', () => {
  const columns = [
    { key: 'sku', header: 'SKU' },
    { key: 'name', header: 'Name' },
  ];
  const items = [
    { id: '1', sku: 'A-100', name: 'Widget' },
    { id: '2', sku: 'B-200', name: 'Gadget' },
  ];

  it('filters across columns and selects a row', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiColumnCombobox
        items={items}
        columns={columns}
        value={null}
        onChange={onChange}
        label="Product"
      />,
    );
    const input = screen.getByRole('combobox');
    await user.type(input, 'Gad');
    expect(screen.queryByText('A-100')).not.toBeInTheDocument();
    await user.click(screen.getByText('B-200'));
    expect(onChange).toHaveBeenCalledWith('2');
  });
});

// ── TreeList ──────────────────────────────────────────────────────────────────

describe('TreeList', () => {
  const columns: TreeListColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'size', header: 'Size', align: 'right' },
  ];
  const rows: TreeListRow[] = [
    {
      id: 'root',
      name: 'src',
      size: '—',
      children: [
        { id: 'a', name: 'index.ts', size: '2 KB' },
        { id: 'b', name: 'utils.ts', size: '4 KB' },
      ],
    },
  ];

  it('hides children until expanded', async () => {
    const user = userEvent.setup();
    render(<TreeList rows={rows} columns={columns} />);
    expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Expand row' }));
    expect(screen.getByText('index.ts')).toBeInTheDocument();
    expect(screen.getByText('utils.ts')).toBeInTheDocument();
  });

  it('shows all rows with defaultExpandAll', () => {
    render(<TreeList rows={rows} columns={columns} defaultExpandAll />);
    expect(screen.getByText('index.ts')).toBeInTheDocument();
  });

  it('sets treegrid aria attributes', () => {
    render(<TreeList rows={rows} columns={columns} defaultExpandAll />);
    expect(screen.getByRole('treegrid')).toBeInTheDocument();
    const childRow = screen.getByText('index.ts').closest('tr');
    expect(childRow).toHaveAttribute('aria-level', '2');
  });

  it('shows empty message for no rows', () => {
    render(<TreeList rows={[]} columns={columns} emptyMessage="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});

// ── Scheduler ─────────────────────────────────────────────────────────────────

describe('Scheduler', () => {
  const events: SchedulerEvent[] = [
    {
      id: 'e1',
      title: 'Design review',
      start: new Date(2026, 5, 10, 10, 0),
      end: new Date(2026, 5, 10, 11, 0),
    },
  ];

  it('renders the calendar with the event', () => {
    render(
      <Scheduler
        events={events}
        onEventsChange={vi.fn()}
        defaultView="week"
        defaultDate={new Date(2026, 5, 10)}
      />,
    );
    expect(screen.getByText('Design review')).toBeInTheDocument();
  });

  it('renders month view toolbar buttons', () => {
    render(
      <Scheduler
        events={[]}
        onEventsChange={vi.fn()}
        defaultView="month"
        defaultDate={new Date(2026, 5, 10)}
      />,
    );
    expect(screen.getByRole('button', { name: /today/i })).toBeInTheDocument();
  });
});

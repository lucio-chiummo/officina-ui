import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import type { FilterFieldDef } from '@/lib/filters';

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

import { Chat, type ChatMessage } from './Chat';
import { DataGrid, type DataGridColumn } from './DataGrid';
import { NotificationCenter } from './NotificationCenter';
import { Wizard } from './Wizard';

// ── Chat ──────────────────────────────────────────────────────────────────────

describe('Chat', () => {
  const messages: ChatMessage[] = [
    { id: '1', sender: 'other', senderName: 'Support', content: 'Hello!' },
    { id: '2', sender: 'user', senderName: 'You', content: 'Hi there.' },
  ];

  it('renders all messages', () => {
    render(<Chat messages={messages} onSend={vi.fn()} />);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('Hi there.')).toBeInTheDocument();
  });

  it('calls onSend with trimmed value on Enter', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByRole('textbox', { name: /message/i });
    await user.type(input, 'test message{Enter}');
    expect(onSend).toHaveBeenCalledWith('test message');
  });

  it('does not call onSend for blank input', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByRole('textbox', { name: /message/i });
    await user.type(input, '   {Enter}');
    expect(onSend).not.toHaveBeenCalled();
  });

  it('shows empty state when no messages', () => {
    render(<Chat messages={[]} onSend={vi.fn()} />);
    expect(screen.getByText(/no messages/i)).toBeInTheDocument();
  });

  it('shows typing indicator when typingIndicator=true', () => {
    render(<Chat messages={[]} onSend={vi.fn()} typingIndicator />);
    const dots = document.querySelectorAll('.animate-bounce');
    expect(dots.length).toBe(3);
  });
});

// ── DataGrid ──────────────────────────────────────────────────────────────────

describe('DataGrid', () => {
  type Row = { id: number; name: string; role: string };
  const columns: DataGridColumn<Row>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'role', header: 'Role' },
  ];
  const data: Row[] = [
    { id: 1, name: 'Alice', role: 'Engineer' },
    { id: 2, name: 'Bob', role: 'Designer' },
  ];
  const filterFields: FilterFieldDef<Row>[] = [{ id: 'role', label: 'Role', type: 'string' }];

  it('renders all rows and headers', () => {
    render(<DataGrid data={data} columns={columns} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('sorts by column on header click', async () => {
    const user = userEvent.setup();
    render(<DataGrid data={data} columns={columns} />);
    const nameHeader = screen.getByText('Name');
    await user.click(nameHeader);
    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Alice');
  });

  it('applies universal filters in client mode', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid data={data} columns={columns} filters={{ fields: filterFields, mode: 'client' }} />,
    );

    await user.click(screen.getByRole('button', { name: /add filter/i }));
    await user.click(screen.getByRole('button', { name: 'Role' }));
    await user.type(screen.getByLabelText('Role value'), 'Design');

    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });
});

// ── NotificationCenter ────────────────────────────────────────────────────────

describe('NotificationCenter', () => {
  const notifications = [
    { id: '1', title: 'Alert one', unread: true, timestamp: new Date(Date.now() - 1000) },
    { id: '2', title: 'Alert two', unread: false, timestamp: new Date(Date.now() - 5000) },
  ];

  it('shows unread badge count', () => {
    render(<NotificationCenter notifications={notifications} />);
    expect(screen.getByLabelText(/1 unread/i)).toBeInTheDocument();
  });

  it('opens panel and shows notifications on click', async () => {
    const user = userEvent.setup();
    render(<NotificationCenter notifications={notifications} />);
    await user.click(screen.getByRole('button', { name: /notifications/i }));
    expect(screen.getByText('Alert one')).toBeInTheDocument();
    expect(screen.getByText('Alert two')).toBeInTheDocument();
  });

  it('shows latest notification first (sorted by timestamp)', async () => {
    const user = userEvent.setup();
    render(<NotificationCenter notifications={notifications} />);
    await user.click(screen.getByRole('button', { name: /notifications/i }));
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Alert one');
  });

  it('calls onMarkAllRead', async () => {
    const user = userEvent.setup();
    const onMarkAllRead = vi.fn();
    render(<NotificationCenter notifications={notifications} onMarkAllRead={onMarkAllRead} />);
    await user.click(screen.getByRole('button', { name: /notifications/i }));
    await user.click(screen.getByRole('button', { name: /mark all read/i }));
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
  });

  it('shows empty state when no notifications', async () => {
    const user = userEvent.setup();
    render(<NotificationCenter notifications={[]} />);
    await user.click(screen.getByRole('button', { name: /notifications/i }));
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument();
  });
});

// ── Wizard ────────────────────────────────────────────────────────────────────

describe('Wizard', () => {
  const steps = [
    { id: 'step1', label: 'Step 1', content: <p>Content one</p> },
    { id: 'step2', label: 'Step 2', content: <p>Content two</p> },
    { id: 'step3', label: 'Step 3', content: <p>Content three</p> },
  ];

  it('renders first step content', () => {
    render(<Wizard steps={steps} />);
    expect(screen.getByText('Content one')).toBeInTheDocument();
    expect(screen.queryByText('Content two')).not.toBeInTheDocument();
  });

  it('advances to next step on Next click', async () => {
    const user = userEvent.setup();
    render(<Wizard steps={steps} />);
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Content two')).toBeInTheDocument();
  });

  it('goes back on Back click', async () => {
    const user = userEvent.setup();
    render(<Wizard steps={steps} />);
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText('Content one')).toBeInTheDocument();
  });

  it('Back disabled on first step', () => {
    render(<Wizard steps={steps} />);
    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();
  });

  it('last step shows Finish label', async () => {
    const user = userEvent.setup();
    render(<Wizard steps={steps} />);
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument();
  });

  it('calls onComplete on last step Finish', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<Wizard steps={steps} onComplete={onComplete} />);
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /finish/i }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('blocks advance when onNext returns false', async () => {
    const user = userEvent.setup();
    const blockingSteps = [
      { id: 's1', label: 'S1', content: <p>Step A</p>, onNext: () => Promise.resolve(false) },
      { id: 's2', label: 'S2', content: <p>Step B</p> },
    ];
    render(<Wizard steps={blockingSteps} />);
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Step A')).toBeInTheDocument();
  });
});

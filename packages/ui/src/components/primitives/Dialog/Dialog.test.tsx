import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from './ConfirmDialog';
import { Drawer } from './Drawer';

function DrawerHarness() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open drawer
      </button>
      <button type="button">Outside action</button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Account drawer">
        <button type="button">First action</button>
        <button type="button">Second action</button>
      </Drawer>
    </>
  );
}

function ConfirmHarness({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [open, setOpen] = useState(true);

  return (
    <ConfirmDialog
      open={open}
      onClose={() => {
        onClose();
        setOpen(false);
      }}
      onConfirm={onConfirm}
      title="Delete project"
      description="This action cannot be undone."
      confirmLabel="Delete"
    />
  );
}

describe('Dialog primitives', () => {
  it('opens from a trigger and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);

    await user.click(screen.getByRole('button', { name: /open drawer/i }));
    expect(screen.getByRole('dialog', { name: /account drawer/i })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('keeps focus trapped inside an open dialog', async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);

    await user.click(screen.getByRole('button', { name: /open drawer/i }));
    await screen.findByRole('dialog', { name: /account drawer/i });
    const firstAction = await screen.findByRole('button', { name: /first action/i });
    await user.tab();
    expect(firstAction).toHaveFocus();
    expect(screen.getByRole('dialog', { name: /account drawer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /outside action/i })).not.toHaveFocus();
  });

  it('runs ConfirmDialog cancel and confirm callbacks', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    const { unmount } = render(<ConfirmHarness onClose={onClose} onConfirm={onConfirm} />);

    const closeCallsBeforeCancel = onClose.mock.calls.length;
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(closeCallsBeforeCancel + 1);
    expect(onConfirm).not.toHaveBeenCalled();

    unmount();
    render(<ConfirmHarness onClose={onClose} onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});

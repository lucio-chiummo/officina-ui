import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('disables confirm until typed value matches', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        open
        onClose={() => undefined}
        onConfirm={onConfirm}
        title="Delete team"
        description="This cannot be undone."
        confirmLabel="Delete"
        typeToConfirm="acme"
        destructive
      />,
    );
    const confirm = screen.getByRole('button', { name: /delete/i });
    expect(confirm).toBeDisabled();
    await user.type(screen.getByRole('textbox'), 'acme');
    expect(confirm).not.toBeDisabled();
    await user.click(confirm);
    expect(onConfirm).toHaveBeenCalled();
  });
});

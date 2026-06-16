import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { Button } from '../Button';
import { Field } from './Field';
import { Form } from './Form';
import { Input } from './Input';

const Schema = z.object({ email: z.string().email('Bad email') });
type Values = z.infer<typeof Schema>;

function Demo({ onSubmit }: { onSubmit: (v: Values) => void }) {
  const form = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { email: '' },
    mode: 'onSubmit',
  });
  return (
    <Form form={form} onSubmit={onSubmit}>
      <Field name="email" label="Email" required>
        {(p) => <Input type="email" {...p} {...form.register('email')} />}
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
}

describe('Form + Field + Input', () => {
  it('shows zod error and blocks submit on invalid input', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<Demo onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/email/i), 'not-email');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Bad email');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits when valid', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<Demo onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/email/i), 'a@b.co');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.co' }, expect.anything());
  });
});

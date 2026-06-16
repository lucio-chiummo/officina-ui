import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { CheckboxGroup, RadioCardGroup, SwitchGroup } from './FieldGroup';
import { FormControl, FormError, FormHelperText, FormLabel, useFormControl } from './FormControl';

function TextField() {
  const field = useFormControl();
  return <input type="text" {...field} />;
}

describe('FormControl', () => {
  it('wires label, description, and error through ARIA', () => {
    render(
      <FormControl invalid required>
        <FormLabel>Email</FormLabel>
        <TextField />
        <FormHelperText>We never share it.</FormHelperText>
        <FormError>Email is required.</FormError>
      </FormControl>,
    );

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Email').closest('label');

    expect(input.id).toBeTruthy();
    expect(label).toHaveAttribute('for', input.id);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toBeRequired();

    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(`${input.id}-error`);
    expect(describedBy).toContain(`${input.id}-description`);

    expect(screen.getByText('Email is required.')).toBeInTheDocument();
  });

  it('hides FormError until the control is invalid', () => {
    const { rerender } = render(
      <FormControl>
        <FormError>Bad value.</FormError>
      </FormControl>,
    );
    expect(screen.queryByText('Bad value.')).not.toBeInTheDocument();

    rerender(
      <FormControl invalid>
        <FormError>Bad value.</FormError>
      </FormControl>,
    );
    expect(screen.getByText('Bad value.')).toBeInTheDocument();
  });

  it('supports a render-prop child receiving field props', () => {
    render(
      <FormControl id="custom">
        {(field) => <input aria-label="rendered" id={field.id} required={field.required} />}
      </FormControl>,
    );
    expect(screen.getByLabelText('rendered')).toHaveAttribute('id', 'custom');
  });
});

describe('CheckboxGroup', () => {
  it('adds and removes values on toggle', () => {
    function Harness() {
      const [value, setValue] = useState<string[]>([]);
      return (
        <CheckboxGroup
          value={value}
          onChange={setValue}
          options={[
            { value: 'a', label: 'Apples' },
            { value: 'b', label: 'Bananas', disabled: true },
          ]}
        />
      );
    }
    render(<Harness />);
    const apples = screen.getByRole('checkbox', { name: 'Apples' });
    fireEvent.click(apples);
    expect(apples).toBeChecked();

    const bananas = screen.getByRole('checkbox', { name: 'Bananas' });
    expect(bananas).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('SwitchGroup', () => {
  it('toggles switch membership', () => {
    function Harness() {
      const [value, setValue] = useState<string[]>(['email']);
      return (
        <SwitchGroup
          value={value}
          onChange={setValue}
          options={[
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS' },
          ]}
        />
      );
    }
    render(<Harness />);
    const switches = screen.getAllByRole('switch');
    expect(switches).toHaveLength(2);
    expect(switches[0]).toBeChecked();
    fireEvent.click(switches[1]!);
    expect(switches[1]).toBeChecked();
  });
});

describe('RadioCardGroup', () => {
  it('selects a single card', () => {
    function Harness() {
      const [value, setValue] = useState('growth');
      return (
        <RadioCardGroup
          value={value}
          onChange={setValue}
          options={[
            { value: 'starter', label: 'Starter' },
            { value: 'growth', label: 'Growth' },
          ]}
        />
      );
    }
    render(<Harness />);
    const starter = screen.getByRole('radio', { name: /Starter/ });
    fireEvent.click(starter);
    expect(starter).toBeChecked();
  });
});

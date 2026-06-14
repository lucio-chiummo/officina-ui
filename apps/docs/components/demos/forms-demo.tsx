'use client';

import {
  Button,
  Field,
  Fieldset,
  Form,
  FormActions,
  FormControl,
  FormError,
  FormGrid,
  FormHelperText,
  FormLabel,
  Input,
  Select,
} from '@officina/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function FormDemo() {
  const form = useForm({ defaultValues: { workspace: '', plan: 'starter' } });
  return (
    <Form form={form} onSubmit={() => {}} className="grid w-full gap-3">
      <Field name="workspace" label="Workspace" hint="RHF-backed field wrapper">
        <Input {...form.register('workspace')} />
      </Field>
      <Field name="plan" label="Plan">
        <Select {...form.register('plan')}>
          <option value="starter">Starter</option>
          <option value="growth">Growth</option>
        </Select>
      </Field>
      <Button size="sm" type="submit">
        Save
      </Button>
    </Form>
  );
}

export function FieldDemo() {
  return (
    <div className="grid w-full gap-3">
      <Field
        label="Workspace slug"
        hint="Field wires label, hint, invalid state, and describedby IDs."
        required
      >
        <Input placeholder="officina-growth" />
      </Field>
      <Field label="Workspace slug" error="Slug is already taken." required>
        <Input defaultValue="acme" aria-invalid />
      </Field>
    </div>
  );
}

export function FieldsetDemo() {
  return (
    <Fieldset
      legend="Workspace details"
      description="Group related fields with semantic fieldset structure."
      columns={2}
    >
      <Field label="Name">
        <Input placeholder="Officina Growth" />
      </Field>
      <Field label="Region">
        <Select defaultValue="eu">
          <option value="eu">Europe</option>
          <option value="us">United States</option>
        </Select>
      </Field>
    </Fieldset>
  );
}

export function FormGridDemo() {
  return (
    <FormGrid columns={3}>
      <Input placeholder="First name" />
      <Input placeholder="Last name" />
      <Input placeholder="Role" />
    </FormGrid>
  );
}

export function FormActionsDemo() {
  return (
    <FormActions align="between">
      <Button size="sm" variant="ghost">
        Cancel
      </Button>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary">
          Save draft
        </Button>
        <Button size="sm">Publish</Button>
      </div>
    </FormActions>
  );
}

export function FormControlDemo() {
  const [value, setValue] = useState('');
  return (
    <FormControl invalid={value.trim().length === 0} required>
      <FormLabel>Workspace name</FormLabel>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Acme Operations"
      />
      <FormHelperText>Shown across the workspace switcher.</FormHelperText>
      <FormError>Workspace name is required.</FormError>
    </FormControl>
  );
}

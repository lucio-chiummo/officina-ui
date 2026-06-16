import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import {
  ActionMenu,
  AnimatedNumber,
  AvatarStack,
  BentoCard,
  BentoGrid,
  BorderBeam,
  CheckboxGroup,
  CopyField,
  FileItem,
  FormControl,
  FormError,
  FormHelperText,
  FormLabel,
  GradientText,
  IconButton,
  ImagePreview,
  Input,
  InlineNotice,
  LoadingOverlay,
  MetadataList,
  Meter,
  PropertyList,
  RadioCardGroup,
  Ripple,
  RowActions,
  Shortcut,
  SpotlightCard,
  StatusLabel,
  SwitchGroup,
  Tilt,
} from './index';

async function expectNoViolations(ui: React.ReactElement) {
  const { container } = render(ui);
  expect(await axe(container)).toHaveNoViolations();
}

describe('composite primitive accessibility', () => {
  it('FormControl wires label/helper/error without violations', async () => {
    function Field() {
      return (
        <FormControl invalid required>
          <FormLabel>Email</FormLabel>
          <Input defaultValue="" aria-label="Email" />
          <FormHelperText>We never share it.</FormHelperText>
          <FormError>Email is required.</FormError>
        </FormControl>
      );
    }
    await expectNoViolations(<Field />);
  });

  it('CheckboxGroup', async () => {
    function H() {
      const [v, setV] = useState<string[]>(['a']);
      return (
        <CheckboxGroup
          aria-label="Channels"
          value={v}
          onChange={setV}
          options={[
            { value: 'a', label: 'Email' },
            { value: 'b', label: 'SMS' },
          ]}
        />
      );
    }
    await expectNoViolations(<H />);
  });

  it('SwitchGroup', async () => {
    function H() {
      const [v, setV] = useState<string[]>(['weekly']);
      return (
        <SwitchGroup
          aria-label="Notifications"
          value={v}
          onChange={setV}
          options={[
            { value: 'weekly', label: 'Weekly digest' },
            { value: 'product', label: 'Product updates' },
          ]}
        />
      );
    }
    await expectNoViolations(<H />);
  });

  it('RadioCardGroup', async () => {
    function H() {
      const [v, setV] = useState('growth');
      return (
        <RadioCardGroup
          value={v}
          onChange={setV}
          options={[
            { value: 'starter', label: 'Starter' },
            { value: 'growth', label: 'Growth' },
          ]}
        />
      );
    }
    await expectNoViolations(<H />);
  });

  it('IconButton has an accessible name', async () => {
    await expectNoViolations(<IconButton aria-label="Edit" icon={<Pencil />} />);
  });

  it('PropertyList / MetadataList', async () => {
    await expectNoViolations(
      <>
        <PropertyList items={[{ label: 'Plan', value: 'Growth' }]} />
        <MetadataList items={[{ label: 'ID', value: 'ws_1', copyValue: 'ws_1' }]} />
      </>,
    );
  });

  it('StatusLabel / Meter', async () => {
    await expectNoViolations(
      <>
        <StatusLabel tone="success">Active</StatusLabel>
        <Meter value={40} max={100} label="Storage" valueLabel="40 of 100 GB" />
      </>,
    );
  });

  it('CopyField', async () => {
    await expectNoViolations(<CopyField label="API key" value="sk_live_1" />);
  });

  it('InlineNotice (dismissible)', async () => {
    await expectNoViolations(
      <InlineNotice tone="warning" dismissible>
        Unsaved changes
      </InlineNotice>,
    );
  });

  it('GradientText / BentoGrid / AvatarStack', async () => {
    await expectNoViolations(
      <>
        <GradientText as="h2">Officina Admin</GradientText>
        <BentoGrid columns={2}>
          <BentoCard>Cell</BentoCard>
          <BentoCard>Cell</BentoCard>
        </BentoGrid>
        <AvatarStack max={2} avatars={[{ name: 'Ada Lovelace' }, { name: 'Alan Turing' }]} />
      </>,
    );
  });

  it('ActionMenu / RowActions (closed)', async () => {
    await expectNoViolations(
      <>
        <ActionMenu
          label="Record actions"
          items={[{ label: 'Edit' }, { label: 'Delete', danger: true }]}
        />
        <RowActions
          max={2}
          actions={[
            { label: 'Edit', icon: <Pencil /> },
            { label: 'Archive', icon: <Pencil /> },
            { label: 'Delete', icon: <Pencil />, danger: true },
          ]}
        />
      </>,
    );
  });

  it('FileItem / ImagePreview', async () => {
    await expectNoViolations(
      <>
        <FileItem
          name="report.pdf"
          size={2400}
          status="error"
          error="Failed"
          onRemove={() => {}}
          onRetry={() => {}}
        />
        <ImagePreview src="blob:x" alt="Cover" name="cover.jpg" onRemove={() => {}} />
      </>,
    );
  });

  it('Shortcut / premium surfaces', async () => {
    await expectNoViolations(
      <>
        <Shortcut keys="mod+k" />
        <SpotlightCard>
          <p>Glow</p>
        </SpotlightCard>
        <BorderBeam>
          <p>Upgrade</p>
        </BorderBeam>
        <Tilt>
          <p>Tilt</p>
        </Tilt>
        <Ripple>
          <button type="button">Press</button>
        </Ripple>
        <AnimatedNumber value={1234} />
      </>,
    );
  });

  it('LoadingOverlay (visible)', async () => {
    await expectNoViolations(
      <LoadingOverlay visible label="Saving">
        <p>Panel content</p>
      </LoadingOverlay>,
    );
  });
});

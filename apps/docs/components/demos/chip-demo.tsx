'use client';

import { Chip } from '@officina/ui';

export function ChipTones() {
  return (
    <>
      <Chip tone="neutral">Neutral</Chip>
      <Chip tone="info">Info</Chip>
      <Chip tone="success" variant="solid">
        Success
      </Chip>
      <Chip tone="warning" variant="outline">
        Warning
      </Chip>
      <Chip tone="danger" onRemove={() => {}}>
        Removable
      </Chip>
    </>
  );
}

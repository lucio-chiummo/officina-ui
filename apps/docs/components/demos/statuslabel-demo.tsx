'use client';

import { StatusLabel } from '@officina/ui';

export function StatusLabelTones() {
  return (
    <>
      <StatusLabel tone="success" pulse>
        Online
      </StatusLabel>
      <StatusLabel tone="warning">Degraded</StatusLabel>
      <StatusLabel tone="danger" variant="soft">
        Offline
      </StatusLabel>
      <StatusLabel tone="neutral">Idle</StatusLabel>
    </>
  );
}

'use client';

import { StatusDot } from '@officina/ui';

export function StatusDotTones() {
  return (
    <>
      <StatusDot tone="success" pulse />
      <StatusDot tone="warning" />
      <StatusDot tone="danger" />
      <StatusDot tone="neutral" />
    </>
  );
}

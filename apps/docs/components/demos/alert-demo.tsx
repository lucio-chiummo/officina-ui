'use client';

import { Alert } from '@officina/ui';

export function AlertVariants() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Alert variant="info">Heads up — a new version is available.</Alert>
      <Alert variant="success">Your changes were saved.</Alert>
      <Alert variant="warning">Your trial ends in 3 days.</Alert>
      <Alert variant="danger" dismissible>
        Payment failed. Update your card to continue.
      </Alert>
    </div>
  );
}

'use client';

import { Progress } from '@officina/ui';

export function ProgressVariants() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Progress value={30} label="Uploading" showValue />
      <Progress value={60} variant="accent" />
      <Progress value={80} variant="success" />
      <Progress value={95} variant="warning" />
    </div>
  );
}

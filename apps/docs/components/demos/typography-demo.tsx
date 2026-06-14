'use client';

import { Typography } from '@officina/ui';

export function TypographyScale() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Typography variant="h2">Heading</Typography>
      <Typography variant="body">
        Body text in the base tone, set at a comfortable reading measure.
      </Typography>
      <Typography variant="body" tone="muted">
        Muted secondary text.
      </Typography>
      <Typography variant="caption" tone="subtle">
        Caption / metadata
      </Typography>
    </div>
  );
}

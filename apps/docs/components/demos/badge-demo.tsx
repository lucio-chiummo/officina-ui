'use client';

import { Badge } from '@officina/ui';

export function BadgeTones() {
  return (
    <>
      <Badge tone="neutral">Neutral</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="danger">Danger</Badge>
      <Badge tone="info">Info</Badge>
      <Badge tone="success" dot>
        With dot
      </Badge>
    </>
  );
}

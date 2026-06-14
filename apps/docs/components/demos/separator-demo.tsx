'use client';

import { Separator } from '@officina/ui';

export function SeparatorDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <span>Above</span>
      <Separator />
      <Separator label="OR" />
      <span>Below</span>
    </div>
  );
}

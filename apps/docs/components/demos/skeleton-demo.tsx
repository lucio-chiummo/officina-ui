'use client';

import { Skeleton } from '@officina/ui';

export function SkeletonShapes() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Skeleton height={32} width="60%" />
      <Skeleton variant="text" lines={3} />
    </div>
  );
}

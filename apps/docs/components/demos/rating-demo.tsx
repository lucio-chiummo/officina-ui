'use client';

import { Rating } from '@officina/ui';

export function RatingDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Rating value={4} readOnly size="sm" label="Small readonly rating" />
      <Rating value={3.5} readOnly size="md" label="Medium readonly rating" />
      <Rating value={5} readOnly size="lg" label="Large readonly rating" />
    </div>
  );
}

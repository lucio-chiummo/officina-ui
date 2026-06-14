'use client';

import { EmptyState } from '@officina/ui';

export function EmptyStateDemo() {
  return (
    <EmptyState
      title="No results found"
      description="Try adjusting your filters or search terms."
    />
  );
}

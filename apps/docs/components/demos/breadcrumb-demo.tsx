'use client';

import { Breadcrumb } from '@officina/ui';

export function BreadcrumbDemo() {
  return (
    <Breadcrumb
      items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Projects', href: '/dashboard/projects' },
        { label: 'Officina' },
      ]}
    />
  );
}

'use client';

import { Tabs } from '@officina/ui';

export function TabsDemo() {
  return (
    <div className="w-full">
      <Tabs
        items={[
          { label: 'Overview', content: 'Account overview and recent activity.' },
          { label: 'Usage', content: 'Usage metrics for the current period.' },
          { label: 'Settings', content: 'Manage workspace settings.' },
        ]}
      />
    </div>
  );
}

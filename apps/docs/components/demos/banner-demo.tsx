'use client';

import { Banner } from '@officina/ui';

export function BannerDemo() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Banner tone="info" title="New workspace features">
        Boards, automations, and saved views are now available to everyone.
      </Banner>
      <Banner tone="warning" title="Scheduled maintenance" onDismiss={() => {}}>
        We&apos;ll be offline Sunday 02:00–03:00 UTC.
      </Banner>
    </div>
  );
}

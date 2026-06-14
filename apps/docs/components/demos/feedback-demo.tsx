'use client';

import {
  Button,
  ErrorState,
  InlineNotice,
  LoadingOverlay,
  LoadingState,
  Meter,
  NotificationCard,
  NotificationCenter,
  PropertyList,
} from '@officina/ui';
import { useState } from 'react';

export function InlineNoticeDemo() {
  return (
    <div className="grid w-full gap-2">
      <InlineNotice tone="info">Changes apply to all workspace members.</InlineNotice>
      <InlineNotice tone="success">Saved 2 seconds ago.</InlineNotice>
      <InlineNotice tone="warning" dismissible>
        You have unsaved changes.
      </InlineNotice>
      <InlineNotice
        tone="danger"
        action={
          <Button size="xs" variant="ghost">
            Retry
          </Button>
        }
      >
        Sync failed.
      </InlineNotice>
    </div>
  );
}

export function NotificationCardDemo() {
  return (
    <div className="grid w-full gap-2">
      <NotificationCard
        title="New invoice"
        description="Invoice #1024 is ready"
        unread
        meta="2m ago"
      />
      <NotificationCard
        title="Deploy complete"
        description="Production build finished successfully"
        meta="18m ago"
      />
    </div>
  );
}

export function NotificationCenterDemo() {
  const [notifications, setNotifications] = useState([
    {
      id: 'invoice',
      title: 'Invoice ready',
      description: 'May invoice is available for review.',
      unread: true,
      timestamp: new Date(),
    },
    {
      id: 'deploy',
      title: 'Deploy complete',
      description: 'Production build finished successfully.',
      unread: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 18),
    },
  ]);
  return (
    <NotificationCenter
      notifications={notifications}
      onMarkAllRead={() =>
        setNotifications((items) => items.map((item) => ({ ...item, unread: false })))
      }
      onMarkRead={(id) =>
        setNotifications((items) =>
          items.map((item) => (item.id === id ? { ...item, unread: false } : item)),
        )
      }
      onClear={() => setNotifications([])}
    />
  );
}

export function LoadingOverlayDemo() {
  const [busy, setBusy] = useState(false);
  return (
    <div className="w-full space-y-2">
      <Button size="sm" variant="secondary" onClick={() => setBusy((v) => !v)}>
        {busy ? 'Hide overlay' : 'Show overlay'}
      </Button>
      <LoadingOverlay visible={busy} label="Saving changes" blur>
        <PropertyList
          items={[
            { label: 'Plan', value: 'Growth' },
            { label: 'Seats', value: '12 of 25' },
          ]}
        />
      </LoadingOverlay>
    </div>
  );
}

export function LoadingStateDemo() {
  return (
    <div className="grid w-full gap-4">
      <LoadingState label="Loading customers" />
      <LoadingState label="Fetching invoices" />
    </div>
  );
}

export function ErrorStateDemo() {
  return (
    <div className="grid w-full gap-4">
      <ErrorState message="Could not load preview data." />
      <ErrorState
        message="Request timed out."
        retry={
          <Button size="sm" variant="secondary">
            Retry
          </Button>
        }
      />
    </div>
  );
}

export function MeterDemo() {
  return (
    <div className="w-full space-y-4">
      <Meter value={68} max={100} tone="accent" label="Seats used" valueLabel="17 of 25" />
      <Meter
        max={100}
        segments={[
          { value: 42, tone: 'accent', label: 'Images' },
          { value: 23, tone: 'info', label: 'Documents' },
          { value: 11, tone: 'warning', label: 'Other' },
        ]}
        label="Storage"
        valueLabel="76 of 100 GB"
        showLegend
      />
    </div>
  );
}

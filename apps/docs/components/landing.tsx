'use client';

import {
  AIPrompt,
  AnimatedNumber,
  AvatarStack,
  Badge,
  BentoCard,
  BentoGrid,
  BorderBeam,
  Checkbox,
  Chip,
  CircularProgress,
  GradientText,
  Marquee,
  Progress,
  SpotlightCard,
  StatCard,
  Switch,
  Tabs,
} from '@officina/ui';
import Link from 'next/link';
import { type ReactNode, useEffect, useState } from 'react';

function CtaLink({
  href,
  variant = 'primary',
  children,
}: {
  href: string;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        variant === 'primary'
          ? 'inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[var(--color-accent-hover)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-accent-contrast)] transition-colors hover:bg-[var(--color-accent-hover)]'
          : 'inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-base)] px-5 text-sm font-semibold text-[var(--color-fg-base)] transition-colors hover:bg-[var(--color-bg-muted)]'
      }
    >
      {children}
    </Link>
  );
}

const team = [
  { name: 'Ada Lovelace' },
  { name: 'Grace Hopper' },
  { name: 'Radia Perlman' },
  { name: 'Margaret Hamilton' },
];

const componentNames = [
  'Button',
  'DataGrid',
  'Calendar',
  'Combobox',
  'CommandPalette',
  'KanbanBoard',
  'Chart',
  'DatePicker',
  'Dialog',
  'Tabs',
  'Toast',
  'Tooltip',
  'TreeView',
  'VirtualList',
  'Stepper',
  'Scheduler',
  'OrgChart',
  'GanttChart',
  'CodeEditor',
  'AIPrompt',
];

function LiveStat({
  value,
  suffix = '',
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setDisplay(value), 150);
    return () => clearTimeout(id);
  }, [value]);

  return (
    <div className="text-center">
      <p className="text-3xl font-bold tracking-tight">
        <AnimatedNumber value={display} duration={1.4} />
        {suffix}
      </p>
      <p className="text-fd-muted-foreground mt-1 text-xs">{label}</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="flex flex-col items-center px-4 pb-16 pt-20 text-center">
      <Badge variant="accent" dot>
        Open source · 250+ components
      </Badge>
      <h1 className="mt-5 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
        The most complete{' '}
        <GradientText as="span" animate>
          open-source
        </GradientText>{' '}
        React component library
      </h1>
      <p className="text-fd-muted-foreground mt-4 max-w-xl text-balance">
        Officina UI ships forms, data grids, overlays, charts, scheduling, and AI surfaces —
        token-driven, accessible, and fully typed.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <CtaLink href="/docs">Get started</CtaLink>
        <CtaLink href="/docs/components/button" variant="secondary">
          Browse components
        </CtaLink>
      </div>

      <BorderBeam duration={10} className="mt-14 w-full max-w-md text-left">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AvatarStack avatars={team} size="sm" max={4} />
            <div>
              <p className="text-sm font-semibold">Acme Workspace</p>
              <p className="text-fd-muted-foreground text-xs">4 members online</p>
            </div>
          </div>
          <Badge variant="success" size="sm" dot>
            Live
          </Badge>
        </div>
        <div className="mt-4 space-y-4">
          <Progress value={72} label="Sprint progress" showValue size="sm" />
          <div className="flex items-center justify-between gap-3">
            <CircularProgress value={86} size={56} thickness={5} label="Uptime" />
            <StatCard
              className="w-44 border-none p-0 shadow-none"
              label="Revenue"
              value="$48.2k"
              delta={12.4}
              deltaLabel="vs last week"
              sparkline={[8, 12, 9, 14, 18, 16, 22]}
            />
          </div>
        </div>
      </BorderBeam>
    </section>
  );
}

function StatsRow() {
  return (
    <section className="border-fd-border border-b border-t">
      <div className="mx-auto grid max-w-2xl grid-cols-3 gap-6 px-4 py-10">
        <LiveStat value={250} suffix="+" label="Components" />
        <LiveStat value={34} label="Hooks" />
        <LiveStat value={100} suffix="%" label="TypeScript" />
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Everything your product needs, already built
        </h2>
        <p className="text-fd-muted-foreground mx-auto mt-2 max-w-xl text-center text-sm">
          A sample of the 250+ primitives — forms, data, feedback, navigation, and AI surfaces, all
          sharing the same design tokens.
        </p>

        <BentoGrid columns={3} className="mt-10">
          <BentoCard>
            <p className="text-fd-muted-foreground text-xs font-semibold uppercase tracking-wide">
              Forms
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Switch label="Email notifications" defaultChecked />
              <Checkbox label="Auto-save drafts" defaultChecked />
            </div>
          </BentoCard>

          <BentoCard>
            <p className="text-fd-muted-foreground text-xs font-semibold uppercase tracking-wide">
              Data
            </p>
            <StatCard
              className="mt-4 border-none p-0 shadow-none"
              label="Active users"
              value="2,384"
              delta={8.2}
              deltaLabel="this week"
              sparkline={[4, 7, 6, 9, 8, 12, 14]}
            />
          </BentoCard>

          <BentoCard>
            <p className="text-fd-muted-foreground text-xs font-semibold uppercase tracking-wide">
              Feedback
            </p>
            <div className="mt-4 flex items-center gap-4">
              <CircularProgress value={68} size={56} thickness={5} label="Storage used" />
              <div className="flex flex-col gap-1.5">
                <Badge variant="success" size="sm">
                  Synced
                </Badge>
                <Badge variant="warning" size="sm">
                  2 pending
                </Badge>
              </div>
            </div>
          </BentoCard>

          <BentoCard colSpan={2}>
            <p className="text-fd-muted-foreground text-xs font-semibold uppercase tracking-wide">
              Navigation
            </p>
            <Tabs
              className="mt-4"
              variant="pills"
              items={[
                {
                  label: 'Overview',
                  content: (
                    <p className="text-fd-muted-foreground text-sm">
                      Snapshot of today&apos;s activity.
                    </p>
                  ),
                },
                {
                  label: 'Reports',
                  content: (
                    <p className="text-fd-muted-foreground text-sm">
                      Export weekly and monthly summaries.
                    </p>
                  ),
                },
                {
                  label: 'Settings',
                  content: (
                    <p className="text-fd-muted-foreground text-sm">
                      Manage workspace preferences.
                    </p>
                  ),
                },
              ]}
            />
          </BentoCard>

          <SpotlightCard className="flex flex-col justify-center">
            <p className="text-fd-muted-foreground text-xs font-semibold uppercase tracking-wide">
              Hover me
            </p>
            <p className="mt-2 text-sm font-medium">Cursor-tracking glow, zero JS config.</p>
          </SpotlightCard>

          <BentoCard colSpan={3}>
            <p className="text-fd-muted-foreground text-xs font-semibold uppercase tracking-wide">
              AI surfaces
            </p>
            <AIPrompt
              className="mt-4"
              suggestions={['Summarize this thread', 'Draft a reply']}
              onSubmit={() => {}}
              hint="Transport-free — wire your own model call"
            />
          </BentoCard>
        </BentoGrid>
      </div>
    </section>
  );
}

function ComponentStrip() {
  return (
    <section className="border-fd-border border-t py-10">
      <Marquee speedSeconds={32}>
        {componentNames.map((name) => (
          <Chip key={name} variant="outline" tone="neutral">
            {name}
          </Chip>
        ))}
      </Marquee>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 py-20 text-center">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Ready to build with <GradientText as="span">Officina UI</GradientText>?
      </h2>
      <p className="text-fd-muted-foreground mx-auto mt-2 max-w-md text-sm">
        Install the package, drop in the tokens, and start composing — every component ships with
        live, editable examples.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <CtaLink href="/docs">Read the docs</CtaLink>
        <CtaLink href="/docs/components/button" variant="secondary">
          Explore components
        </CtaLink>
      </div>
    </section>
  );
}

export function Landing() {
  return (
    <div className="officina-ui">
      <Hero />
      <StatsRow />
      <Showcase />
      <ComponentStrip />
      <FinalCta />
    </div>
  );
}

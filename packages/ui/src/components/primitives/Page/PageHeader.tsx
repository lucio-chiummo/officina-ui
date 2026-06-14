import type { ReactNode } from 'react';

import { cn } from '@lib/utils/cn';

import { Breadcrumb } from '../Breadcrumb';

type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  /** Page title shown as the heading. */
  title: string;
  /** Supporting text below the title. */
  description?: string;
  /** Breadcrumb trail rendered above the title. */
  breadcrumbs?: Crumb[];
  /** Action controls pinned to the right of the header. */
  actions?: ReactNode;
  /** Extra classes for the header container. */
  className?: string;
};

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-3 pb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? <Breadcrumb items={breadcrumbs} /> : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-fg-base)]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}

import type { ReactNode } from 'react';

import { cn } from '@lib/utils/cn';

type ErrorStateProps = {
  title?: string;
  message?: string;
  retry?: ReactNode;
  className?: string;
};

export function ErrorState({
  title = 'Something went wrong',
  message,
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] p-8 text-center',
        className,
      )}
    >
      <h3 className="text-sm font-semibold text-[var(--color-danger-fg)]">{title}</h3>
      {message ? <p className="max-w-md text-sm text-[var(--color-danger)]">{message}</p> : null}
      {retry}
    </div>
  );
}

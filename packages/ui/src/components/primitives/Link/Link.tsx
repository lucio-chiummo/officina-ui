import { cn } from '@lib/utils/cn';
import { ExternalLink } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

export type PrimitiveLinkProps = ComponentPropsWithoutRef<'a'> & {
  /** Open in a new tab with safe rel attributes and an external icon. */
  external?: boolean;
  /** Use muted foreground colour instead of the accent. */
  muted?: boolean;
};

export const PrimitiveLink = forwardRef<HTMLAnchorElement, PrimitiveLinkProps>(function Link(
  { children, className, external, muted, rel, target, ...props },
  ref,
) {
  const nextTarget = external ? (target ?? '_blank') : target;
  const nextRel = external ? (rel ?? 'noreferrer') : rel;

  return (
    <a
      ref={ref}
      rel={nextRel}
      target={nextTarget}
      {...props}
      className={cn(
        'inline-flex min-w-0 items-center gap-1 rounded-sm font-medium underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
        muted
          ? 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-base)]'
          : 'text-[var(--color-accent-fg)] hover:underline',
        className,
      )}
    >
      <span className="min-w-0 truncate">{children}</span>
      {external ? <ExternalLink className="size-3 shrink-0" aria-hidden="true" /> : null}
    </a>
  );
});

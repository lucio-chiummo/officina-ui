import { cn } from '@lib/utils/cn';
import { X } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';

type ChipTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type ChipVariant = 'solid' | 'soft' | 'outline';

export type ChipProps = {
  /** Chip label content. */
  children: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** When provided, renders a remove (×) button that calls this handler. */
  onRemove?: () => void;
  /** Semantic colour. */
  tone?: ChipTone;
  /** Chip size. */
  size?: 'sm' | 'md';
  /** Fill style: solid, soft, or outline. */
  variant?: ChipVariant;
  /** Render as a button (clickable/selectable) rather than a static span. */
  interactive?: boolean;
  /** Accessible label for the remove button. */
  removeLabel?: string;
} & (HTMLAttributes<HTMLSpanElement> | ButtonHTMLAttributes<HTMLButtonElement>);

const toneClasses: Record<ChipTone, Record<ChipVariant, string>> = {
  neutral: {
    solid: 'bg-[var(--color-fg-base)] text-[var(--color-bg-base)]',
    soft: 'bg-[var(--color-bg-muted)] text-[var(--color-fg-base)]',
    outline: 'border-[var(--color-border)] text-[var(--color-fg-base)]',
  },
  info: {
    solid: 'bg-[var(--color-info)] text-[var(--color-info-contrast)]',
    soft: 'bg-[var(--color-info-muted)] text-[var(--color-info-fg)]',
    outline: 'border-[var(--color-info)] text-[var(--color-info-fg)]',
  },
  success: {
    solid: 'bg-[var(--color-success)] text-[var(--color-success-contrast)]',
    soft: 'bg-[var(--color-success-muted)] text-[var(--color-success-fg)]',
    outline: 'border-[var(--color-success)] text-[var(--color-success-fg)]',
  },
  warning: {
    solid: 'bg-[var(--color-warning)] text-[var(--color-warning-contrast)]',
    soft: 'bg-[var(--color-warning-muted)] text-[var(--color-warning-fg)]',
    outline: 'border-[var(--color-warning)] text-[var(--color-warning-fg)]',
  },
  danger: {
    solid: 'bg-[var(--color-danger)] text-[var(--color-danger-contrast)]',
    soft: 'bg-[var(--color-danger-muted)] text-[var(--color-danger-fg)]',
    outline: 'border-[var(--color-danger)] text-[var(--color-danger-fg)]',
  },
};

export const Chip = forwardRef<HTMLSpanElement | HTMLButtonElement, ChipProps>(function Chip(
  {
    children,
    icon,
    onRemove,
    tone = 'neutral',
    size = 'md',
    variant = 'soft',
    interactive,
    removeLabel = 'Remove',
    className,
    ...props
  },
  ref,
) {
  const classes = cn(
    'inline-flex max-w-full items-center gap-1.5 rounded-[var(--radius-full)] border border-transparent font-medium',
    size === 'sm' ? 'h-6 px-2 text-xs' : 'h-7 px-2.5 text-sm',
    toneClasses[tone][variant],
    variant === 'outline' && 'bg-transparent',
    (interactive || onRemove) &&
      'transition-[background-color,color,border-color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-bg-muted)] active:scale-[0.985]',
    className,
  );
  const content = (
    <>
      {icon ? <span className="size-3.5 shrink-0">{icon}</span> : null}
      <span className="truncate">{children}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="-mr-1 inline-flex size-4 items-center justify-center rounded-full transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-black/10"
        >
          <X className="size-3" />
        </button>
      ) : null}
    </>
  );
  return interactive ? (
    <button ref={ref as React.Ref<HTMLButtonElement>} type="button" className={classes} {...props}>
      {content}
    </button>
  ) : (
    <span ref={ref} className={classes} {...props}>
      {content}
    </span>
  );
});

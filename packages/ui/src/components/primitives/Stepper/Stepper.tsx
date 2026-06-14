import { cn } from '@lib/utils/cn';

type Step = { id: string; label: string; description?: string };

type StepperProps = {
  /** Ordered steps to render. */
  steps: Step[];
  /** Zero-based index of the active step. */
  current: number;
  /** Called with the step index when a step is clicked. */
  onStepClick?: (index: number) => void;
  /** Layout direction. Defaults to `'horizontal'`. */
  orientation?: 'horizontal' | 'vertical';
  /** Extra classes for the stepper container. */
  className?: string;
};

export function Stepper({
  steps,
  current,
  onStepClick,
  orientation = 'horizontal',
  className,
}: StepperProps) {
  const vertical = orientation === 'vertical';

  if (vertical) {
    return (
      <ol className={cn('relative flex flex-col gap-5 ps-7', className)}>
        <span
          aria-hidden="true"
          className="absolute inset-y-4 start-[15px] w-px bg-[var(--color-bg-muted)]"
        />
        {steps.map((step, i) => {
          const state = i < current ? 'done' : i === current ? 'active' : 'todo';
          const clickable = onStepClick !== undefined;
          return (
            <li key={step.id} className="relative flex items-start gap-3">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onStepClick?.(i)}
                aria-current={state === 'active' ? 'step' : undefined}
                className={cn(
                  'absolute -start-7 flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium ring-4 ring-[var(--color-bg-base)] transition-colors',
                  state === 'done' &&
                    'border-[var(--color-success)] bg-[var(--color-success)] text-[var(--color-success-contrast)]',
                  state === 'active' &&
                    'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]',
                  state === 'todo' &&
                    'border-[var(--color-border-strong)] bg-[var(--color-bg-base)] text-[var(--color-fg-muted)]',
                  clickable && 'cursor-pointer',
                )}
              >
                {state === 'done' ? '✓' : i + 1}
              </button>
              <div className="min-h-8 ps-3">
                <span
                  className={cn(
                    'text-sm font-medium',
                    state === 'todo'
                      ? 'text-[var(--color-fg-muted)]'
                      : 'text-[var(--color-fg-base)]',
                  )}
                >
                  {step.label}
                </span>
                {step.description ? (
                  <span className="block text-xs text-[var(--color-fg-muted)]">
                    {step.description}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol className={cn('flex flex-row items-center gap-3', className)}>
      {steps.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'todo';
        const clickable = onStepClick !== undefined;
        return (
          <li key={step.id} className="flex items-center gap-3">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => onStepClick?.(i)}
              aria-current={state === 'active' ? 'step' : undefined}
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors',
                state === 'done' &&
                  'border-[var(--color-success)] bg-[var(--color-success)] text-[var(--color-success-contrast)]',
                state === 'active' &&
                  'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]',
                state === 'todo' &&
                  'border-[var(--color-border-strong)] bg-[var(--color-bg-base)] text-[var(--color-fg-muted)]',
                clickable && 'cursor-pointer',
              )}
            >
              {state === 'done' ? '✓' : i + 1}
            </button>
            <div className="flex flex-col">
              <span
                className={cn(
                  'text-sm font-medium',
                  state === 'todo' ? 'text-[var(--color-fg-muted)]' : 'text-[var(--color-fg-base)]',
                )}
              >
                {step.label}
              </span>
              {step.description ? (
                <span className="text-xs text-[var(--color-fg-muted)]">{step.description}</span>
              ) : null}
            </div>
            {i < steps.length - 1 ? (
              <span aria-hidden="true" className="h-px w-6 bg-[var(--color-bg-muted)]" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

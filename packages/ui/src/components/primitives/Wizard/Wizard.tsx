import { cn } from '@lib/utils/cn';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import { Stepper } from '../Stepper';

export type WizardStep = {
  id: string;
  label: string;
  description?: string;
  content: ReactNode | ((api: WizardStepApi) => ReactNode);
  onNext?: () => boolean | Promise<boolean>;
  onBack?: () => void;
};

export type WizardStepApi = {
  next: () => Promise<void>;
  back: () => void;
  goTo: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
  currentIndex: number;
  totalSteps: number;
};

export type WizardProps = {
  /** Ordered steps with their content and validation. */
  steps: WizardStep[];
  /** Called when the final step is completed. */
  onComplete?: () => void;
  /** Layout of the step indicator. */
  orientation?: 'horizontal' | 'vertical';
  /** Label for the next button. */
  nextLabel?: string;
  /** Label for the back button. */
  backLabel?: string;
  /** Label for the final/complete button. */
  completeLabel?: string;
  className?: string;
};

const WizardContext = createContext<WizardStepApi | null>(null);

export function useWizard(): WizardStepApi {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used inside <Wizard>');
  return ctx;
}

export function Wizard({
  steps,
  onComplete,
  orientation = 'horizontal',
  nextLabel = 'Next',
  backLabel = 'Back',
  completeLabel = 'Finish',
  className,
}: WizardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [busy, setBusy] = useState(false);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < steps.length) setCurrentIndex(index);
    },
    [steps.length],
  );

  const back = useCallback(() => {
    steps[currentIndex]?.onBack?.();
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, [currentIndex, steps]);

  const next = useCallback(async () => {
    const step = steps[currentIndex];
    if (step?.onNext) {
      setBusy(true);
      try {
        const ok = await step.onNext();
        if (!ok) return;
      } finally {
        setBusy(false);
      }
    }
    if (isLast) {
      onComplete?.();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, isLast, onComplete, steps]);

  const api: WizardStepApi = {
    next,
    back,
    goTo,
    isFirst,
    isLast,
    currentIndex,
    totalSteps: steps.length,
  };

  const stepperSteps = steps.map(({ id, label, description }) => ({
    id,
    label,
    ...(description !== undefined ? { description } : {}),
  }));
  const currentStep = steps[currentIndex];

  const content =
    typeof currentStep?.content === 'function' ? currentStep.content(api) : currentStep?.content;

  return (
    <WizardContext.Provider value={api}>
      <div
        className={cn(
          'flex gap-6',
          orientation === 'vertical' ? 'flex-row' : 'flex-col',
          className,
        )}
      >
        <Stepper steps={stepperSteps} current={currentIndex} orientation={orientation} />

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex-1">{content}</div>

          <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
            <button
              type="button"
              onClick={back}
              disabled={isFirst || busy}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-fg-base)] transition-colors hover:bg-[var(--color-bg-muted)] disabled:opacity-40"
            >
              {backLabel}
            </button>

            <div className="text-xs text-[var(--color-fg-muted)]">
              {currentIndex + 1} / {steps.length}
            </div>

            <button
              type="button"
              onClick={() => {
                void next();
              }}
              disabled={busy}
              className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-contrast)] transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {busy ? 'Please wait…' : isLast ? completeLabel : nextLabel}
            </button>
          </div>
        </div>
      </div>
    </WizardContext.Provider>
  );
}

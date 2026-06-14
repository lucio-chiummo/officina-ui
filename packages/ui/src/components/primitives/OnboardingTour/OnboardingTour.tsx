import { driver, type Config, type DriveStep } from 'driver.js';
import { useEffect } from 'react';
import 'driver.js/dist/driver.css';

export interface OnboardingTourProps {
  /** Ordered tour steps, each targeting an element with content. */
  steps: DriveStep[];
  /** Start the tour when true; stops/resets when false. */
  run?: boolean;
  /** Driver.js config overrides (animation, labels, behavior). */
  options?: Config;
  /** Called when the tour is closed or completed. */
  onClose?: () => void;
}

export function OnboardingTour({ steps, run = true, options, onClose }: OnboardingTourProps) {
  useEffect(() => {
    if (!run || steps.length === 0) return;
    const config: Config = { steps, ...options };
    if (onClose) config.onDestroyed = onClose;
    const instance = driver(config);
    instance.drive();
    return () => instance.destroy();
  }, [onClose, options, run, steps]);

  return null;
}

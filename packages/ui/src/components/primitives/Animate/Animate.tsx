/**
 * Animate — framer-motion wrappers for common page/element transitions.
 * Why: PLAN-MINIMAL §1.6. Respects prefers-reduced-motion via the
 * MotionConfig consumer; consumers should wrap the app in
 * <MotionConfig reducedMotion="user"> at the root.
 */
import { motion, type HTMLMotionProps } from 'framer-motion';

const PRESETS = {
  fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  fadeInUp: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  },
} as const;

export type MotionPresetName = keyof typeof PRESETS;

type MotionPresetProps = HTMLMotionProps<'div'> & {
  /** Named animation preset (fadeIn, slideUp, …). Defaults to "fadeIn". */
  preset?: MotionPresetName;
  /** Animation duration in seconds. Defaults to 0.25. */
  duration?: number;
};

export function MotionPreset({ preset = 'fadeIn', duration = 0.25, ...rest }: MotionPresetProps) {
  const variant = PRESETS[preset];
  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{ duration, ease: 'easeOut' }}
      {...rest}
    />
  );
}

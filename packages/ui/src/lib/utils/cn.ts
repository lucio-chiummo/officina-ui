/**
 * cn — class-name composition.
 *
 * Why: PLAN.md §6.5 mandates a single helper combining clsx + tailwind-merge so
 * later utility classes win over earlier ones. Consume from anywhere via `@lib/utils/cn`.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

import type { ClassNames } from 'react-day-picker';

export const dayPickerClassNames: Partial<ClassNames> = {
  root: 'relative w-full text-[var(--color-fg-base)]',
  months: 'pt-9 flex flex-col gap-4 sm:flex-row sm:gap-5',
  month: 'w-full space-y-3',
  month_caption: 'flex h-8 items-center justify-center',
  caption_label: 'text-base font-semibold tracking-tight text-[var(--color-fg-base)]',
  nav: 'absolute right-0 top-0 flex items-center gap-1',
  button_previous:
    'inline-flex size-8 items-center justify-center rounded-md border border-transparent text-[var(--color-accent)] transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-bg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/30',
  button_next:
    'inline-flex size-8 items-center justify-center rounded-md border border-transparent text-[var(--color-accent)] transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-bg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/30',
  month_grid: 'w-full border-collapse',
  weekdays: 'mt-2 grid grid-cols-7',
  weekday: 'py-1 text-center text-xs font-medium text-[var(--color-fg-muted)]',
  weeks: 'block',
  week: 'mt-1 grid grid-cols-7',
  day: 'flex items-center justify-center p-0',
  day_button:
    'inline-flex size-9 items-center justify-center rounded-full text-sm text-[var(--color-fg-base)] transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-[var(--color-bg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/30',
  selected:
    'bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent)] focus-visible:ring-[var(--color-accent)]/40',
  today: 'font-semibold ring-1 ring-[var(--color-accent)]/45',
  outside: 'text-[var(--color-fg-muted)]/45',
  disabled: 'cursor-not-allowed text-[var(--color-fg-muted)]/30 hover:bg-transparent',
  range_middle:
    'bg-[var(--color-accent)]/14 [&>.rdp-day_button]:rounded-none [&>.rdp-day_button]:bg-transparent [&>.rdp-day_button]:text-[var(--color-fg-base)]',
  range_start:
    'bg-[var(--color-accent)]/14 [&>.rdp-day_button]:rounded-full [&>.rdp-day_button]:bg-[var(--color-accent)] [&>.rdp-day_button]:text-[var(--color-accent-contrast)]',
  range_end:
    'bg-[var(--color-accent)]/14 [&>.rdp-day_button]:rounded-full [&>.rdp-day_button]:bg-[var(--color-accent)] [&>.rdp-day_button]:text-[var(--color-accent-contrast)]',
};

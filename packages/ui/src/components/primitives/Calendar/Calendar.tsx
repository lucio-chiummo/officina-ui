import { cn } from '@lib/utils/cn';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  type CalendarProps as BigCalendarProps,
  type Event,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

export type CalendarEvent = Event & { id?: string };
export type CalendarProps = Omit<BigCalendarProps<CalendarEvent>, 'localizer'> & {
  className?: string;
};

export function Calendar({ className, style, ...props }: CalendarProps) {
  return (
    <div
      className={cn(
        'min-h-[520px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-3',
        className,
      )}
      style={style}
    >
      <BigCalendar localizer={localizer} style={{ minHeight: 500 }} {...props} />
    </div>
  );
}

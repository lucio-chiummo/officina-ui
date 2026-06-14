import { cn } from '@lib/utils/cn';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { useCallback, useMemo, useState } from 'react';
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  type View,
  type Event,
} from 'react-big-calendar';
import withDragAndDrop, {
  type withDragAndDropProps,
} from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

export type SchedulerEvent = Event & {
  id: string;
  /** Token-driven color accent for the event chip. */
  color?: string;
  resourceId?: string;
};

export type SchedulerResource = {
  id: string;
  title: string;
};

export type SchedulerProps = {
  /** Events to render on the calendar (controlled). */
  events: SchedulerEvent[];
  /** Called with the next events array after a drag, resize, or edit. */
  onEventsChange: (events: SchedulerEvent[]) => void;
  /** Resource lanes (people, rooms, machines) — enables resource view columns. */
  resources?: SchedulerResource[];
  /** Called when user selects an empty slot — create-event hook. */
  onSlotSelect?: (slot: { start: Date; end: Date; resourceId?: string }) => void;
  /** Called when an existing event is clicked. */
  onEventClick?: (event: SchedulerEvent) => void;
  /** Calendar view shown on first render. */
  defaultView?: View;
  /** Views the user can switch between. */
  views?: View[];
  /** Date the calendar opens on. */
  defaultDate?: Date;
  /** Disable drag/resize editing. */
  readOnly?: boolean;
  /** Minimum height of the calendar viewport in px. */
  minHeight?: number;
  /** Extra classes for the calendar container. */
  className?: string;
};

const DnDCalendar = withDragAndDrop<SchedulerEvent, SchedulerResource>(
  BigCalendar as Parameters<typeof withDragAndDrop<SchedulerEvent, SchedulerResource>>[0],
);

/**
 * Full event scheduler: day/week/month/agenda views, drag to move, drag edges
 * to resize, slot selection to create, optional resource lanes. Controlled —
 * pass events and apply changes in onEventsChange.
 */
export function Scheduler({
  events,
  onEventsChange,
  resources,
  onSlotSelect,
  onEventClick,
  defaultView = 'week',
  views = ['day', 'week', 'month', 'agenda'],
  defaultDate,
  readOnly = false,
  minHeight = 560,
  className,
}: SchedulerProps) {
  const [view, setView] = useState<View>(defaultView);
  const [date, setDate] = useState<Date>(defaultDate ?? new Date());

  const moveOrResize = useCallback<
    NonNullable<withDragAndDropProps<SchedulerEvent, SchedulerResource>['onEventDrop']>
  >(
    ({ event, start, end, resourceId }) => {
      onEventsChange(
        events.map((existing) =>
          existing.id === event.id
            ? {
                ...existing,
                start: new Date(start),
                end: new Date(end),
                ...(resourceId != null ? { resourceId: String(resourceId) } : {}),
              }
            : existing,
        ),
      );
    },
    [events, onEventsChange],
  );

  const eventPropGetter = useCallback((event: SchedulerEvent) => {
    if (!event.color) return {};
    return {
      style: {
        backgroundColor: event.color,
        borderColor: event.color,
      },
    };
  }, []);

  const resourceProps = useMemo(() => {
    if (!resources || resources.length === 0) return {};
    return {
      resources,
      resourceIdAccessor: (r: SchedulerResource) => r.id,
      resourceTitleAccessor: (r: SchedulerResource) => r.title,
    };
  }, [resources]);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-3',
        className,
      )}
      style={{ minHeight }}
    >
      <DnDCalendar
        localizer={localizer}
        events={events}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        views={views}
        selectable={!readOnly && Boolean(onSlotSelect)}
        resizable={!readOnly}
        draggableAccessor={() => !readOnly}
        onEventDrop={moveOrResize}
        onEventResize={moveOrResize}
        onSelectSlot={
          onSlotSelect
            ? (slot) => {
                onSlotSelect({
                  start: new Date(slot.start),
                  end: new Date(slot.end),
                  ...(slot.resourceId != null ? { resourceId: String(slot.resourceId) } : {}),
                });
              }
            : undefined
        }
        onSelectEvent={onEventClick}
        eventPropGetter={eventPropGetter}
        popup
        style={{ minHeight: minHeight - 24 }}
        {...resourceProps}
      />
    </div>
  );
}

import { cn } from '@lib/utils/cn';
import { MapPin } from 'lucide-react';

export interface MapMarker {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface MapProps {
  /** Pins to render on the map. */
  markers?: MapMarker[];
  /** Map height in px. */
  height?: number;
  /** Extra classes for the map container. */
  className?: string;
}

export function Map({ markers = [], height = 320, className }: MapProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-bg-muted)_25%,transparent_25%),linear-gradient(225deg,var(--color-bg-muted)_25%,transparent_25%),linear-gradient(45deg,var(--color-bg-muted)_25%,transparent_25%),linear-gradient(315deg,var(--color-bg-muted)_25%,var(--color-bg-base)_25%)] bg-[length:32px_32px] bg-[position:16px_0,16px_0,0_0,0_0]',
        className,
      )}
      style={{ height }}
      role="img"
      aria-label="Map"
    >
      {markers.map((marker) => (
        <span
          key={marker.id}
          className="absolute flex -translate-x-1/2 -translate-y-full items-center gap-1 rounded-full bg-[var(--color-accent)] px-2 py-1 text-xs font-medium text-[var(--color-accent-contrast)] shadow-[var(--shadow-md)]"
          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        >
          <span
            aria-hidden="true"
            className="absolute top-full left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-[var(--color-accent)]/30"
          />
          <MapPin className="size-3" aria-hidden />
          {marker.label}
        </span>
      ))}
    </div>
  );
}

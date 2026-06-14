import { cn } from '@lib/utils/cn';
import { lazy, Suspense } from 'react';

const ReactPlayer = lazy(() => import('react-player'));

type PlayerProps = {
  /** Media source URL. */
  src: string;
  /** Poster image shown before playback. */
  poster?: string;
  /** Show native playback controls. Defaults to `true`. */
  controls?: boolean;
  /** Extra classes for the player element. */
  className?: string;
};

export function Player({ src, poster, controls = true, className }: PlayerProps) {
  return (
    <div className={cn('aspect-video w-full overflow-hidden rounded-lg bg-black', className)}>
      <Suspense fallback={null}>
        <ReactPlayer
          src={src}
          playing={false}
          controls={controls}
          width="100%"
          height="100%"
          poster={poster}
        />
      </Suspense>
    </div>
  );
}

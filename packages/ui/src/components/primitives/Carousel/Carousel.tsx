import { cn } from '@lib/utils/cn';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { useCallback, useEffect, useState, type ReactNode } from 'react';

type CarouselProps = {
  /** Slides to render, one per child. */
  children: ReactNode[];
  /** Embla carousel options (loop, align, drag, etc.). */
  options?: Parameters<typeof useEmblaCarousel>[0];
  /** Extra classes for the carousel container. */
  className?: string;
  /** Show the dot pagination indicators. */
  showDots?: boolean;
  /** Show the previous/next arrow controls. */
  showArrows?: boolean;
};

export function Carousel({
  children,
  options,
  className,
  showDots = true,
  showArrows = true,
}: CarouselProps) {
  const [emblaRef, emblaApi]: UseEmblaCarouselType = useEmblaCarousel({ loop: true, ...options });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className={cn('relative', className)}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {children.map((child, i) => (
            // eslint-disable-next-line react/no-array-index-key -- carousel slide order is stable per parent
            <div key={i} className="min-w-0 shrink-0 grow basis-full">
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows ? (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-[var(--color-bg-base)]/80 p-2 text-[var(--color-fg-muted)] shadow hover:bg-[var(--color-bg-base)]/80"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-[var(--color-bg-base)]/80 p-2 text-[var(--color-fg-muted)] shadow hover:bg-[var(--color-bg-base)]/80"
          >
            ›
          </button>
        </>
      ) : null}

      {showDots ? (
        <div className="mt-3 flex justify-center gap-1">
          {children.map((_, i) => (
            <button
              // eslint-disable-next-line react/no-array-index-key -- dot index matches slide index
              key={i}
              type="button"
              aria-label={`Go to slide ${String(i + 1)}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'size-2 rounded-full transition-colors',
                i === selected ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border-strong)]',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

import { cn } from '@lib/utils/cn';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import { type ComponentPropsWithoutRef } from 'react';

export type AspectRatioProps = ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>;

export function AspectRatio({ className, ...props }: AspectRatioProps) {
  return (
    <AspectRatioPrimitive.Root
      {...props}
      className={cn('overflow-hidden rounded-md bg-[var(--color-bg-muted)]', className)}
    />
  );
}

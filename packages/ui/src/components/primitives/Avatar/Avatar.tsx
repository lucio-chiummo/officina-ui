import { cn } from '@lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { Children, type ComponentPropsWithoutRef, type ReactElement } from 'react';

const AVATAR_COLORS = [
  'bg-indigo-700',
  'bg-emerald-700',
  'bg-amber-800',
  'bg-rose-700',
  'bg-sky-700',
  'bg-violet-700',
  'bg-teal-700',
  'bg-orange-700',
];

function getColorClass(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] ?? AVATAR_COLORS[0]!;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0] ?? '';
  const last = parts.at(-1) ?? '';
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

const avatarVariants = cva(
  'inline-flex shrink-0 items-center justify-center overflow-hidden font-semibold text-white',
  {
    variants: {
      size: {
        xs: 'size-5 text-[9px]',
        sm: 'size-7 text-[11px]',
        md: 'size-9 text-sm',
        lg: 'size-12 text-base',
        xl: 'size-16 text-xl',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-[22%]',
      },
    },
    defaultVariants: { size: 'md', shape: 'circle' },
  },
);

export type AvatarProps = ComponentPropsWithoutRef<'span'> &
  VariantProps<typeof avatarVariants> & {
    /** Image URL. Falls back to initials when absent or it fails to load. */
    src?: string | undefined;
    /** Full name used to derive initials and the alt text. */
    name?: string | undefined;
    /** Explicit initials override (otherwise derived from `name`). */
    initials?: string | undefined;
    /** Image alt text (defaults to `name`). */
    alt?: string | undefined;
  };

export function Avatar({
  className,
  size,
  shape,
  src,
  name,
  initials,
  alt,
  ...props
}: AvatarProps) {
  const label = alt ?? name ?? initials ?? '';
  const fallback = initials ?? getInitials(name ?? label);

  return (
    <span
      {...props}
      className={cn(avatarVariants({ size, shape }), !src && getColorClass(label), className)}
    >
      {src ? (
        <img
          src={src}
          alt={label}
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <span aria-label={label}>{fallback || '?'}</span>
      )}
    </span>
  );
}

const ringSizeMap: Record<string, string> = {
  xs: 'ring-[1.5px]',
  sm: 'ring-2',
  md: 'ring-2',
  lg: 'ring-[3px]',
  xl: 'ring-[3px]',
};

export type AvatarStackItem = {
  src?: string | undefined;
  name?: string | undefined;
  alt?: string | undefined;
};

export type AvatarStackProps = ComponentPropsWithoutRef<'div'> & {
  /** Avatar data to render in the stack. */
  avatars: AvatarStackItem[];
  /** Max avatars shown before collapsing the rest into a `+N` chip. Defaults to `4`. */
  max?: number;
  /** Size applied to every avatar in the stack. Defaults to `'md'`. */
  size?: AvatarProps['size'];
  /** Shape applied to every avatar in the stack. Defaults to `'circle'`. */
  shape?: AvatarProps['shape'];
};

/**
 * Overflow-aware grouped avatars driven by data instead of children.
 * Renders a `+N` chip once the count exceeds `max`.
 */
export function AvatarStack({
  avatars,
  max = 4,
  size = 'md',
  shape = 'circle',
  className,
  ...props
}: AvatarStackProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;
  const ring = ringSizeMap[size ?? 'md'];

  return (
    <div {...props} className={cn('flex items-center', className)}>
      {visible.map((avatar, index) => (
        <span
          // eslint-disable-next-line react/no-array-index-key -- avatar stack order is caller-controlled and stable
          key={index}
          className={cn('-ml-2 rounded-full first:ml-0', ring, 'ring-[var(--color-bg-base)]')}
        >
          <Avatar size={size} shape={shape} src={avatar.src} name={avatar.name} alt={avatar.alt} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            '-ml-2 inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-muted)] font-semibold text-[var(--color-fg-muted)]',
            ring,
            'ring-[var(--color-bg-base)]',
            avatarVariants({ size }),
            'text-[10px]',
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}

export type AvatarGroupProps = ComponentPropsWithoutRef<'div'> & {
  max?: number;
  size?: AvatarProps['size'];
};

export function AvatarGroup({
  children,
  max = 4,
  size = 'md',
  className,
  ...props
}: AvatarGroupProps) {
  const childArray = Children.toArray(children);
  const visible = childArray.slice(0, max);
  const overflow = childArray.length - max;

  const ringSize: Record<string, string> = {
    xs: 'ring-[1.5px]',
    sm: 'ring-2',
    md: 'ring-2',
    lg: 'ring-[3px]',
    xl: 'ring-[3px]',
  };
  const ring = ringSize[size ?? 'md'];

  return (
    <div {...props} className={cn('flex items-center', className)}>
      {visible.map((child) => (
        <span
          key={String((child as ReactElement).key)}
          className={cn('-ml-2 first:ml-0', ring, 'rounded-full ring-[var(--color-bg-base)]')}
        >
          {child}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            '-ml-2 inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-muted)] font-semibold text-[var(--color-fg-muted)]',
            ring,
            'ring-[var(--color-bg-base)]',
            avatarVariants({ size }),
            'text-[10px]',
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}

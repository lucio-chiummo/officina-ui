import { cn } from '@lib/utils/cn';
import { useThemeStore } from '@stores/theme.store';
// CSS must be imported in the app entry: import 'overlayscrollbars/overlayscrollbars.css'
import {
  OverlayScrollbarsComponent,
  type OverlayScrollbarsComponentProps,
} from 'overlayscrollbars-react';

type ScrollbarProps = OverlayScrollbarsComponentProps & { className?: string };

export function Scrollbar({ className, ...rest }: ScrollbarProps) {
  const mode = useThemeStore((s) => s.mode);
  const osTheme = mode === 'dark' ? 'os-theme-dark' : 'os-theme-light';
  return (
    <OverlayScrollbarsComponent
      defer
      options={{ scrollbars: { autoHide: 'leave', theme: osTheme } }}
      className={cn(className)}
      {...rest}
    />
  );
}

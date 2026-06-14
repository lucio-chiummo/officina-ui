import { useEffect, useState } from 'react';

const MODERN_HSL_RE =
  /^hsla?\(\s*([+-]?(?:\d+|\d*\.\d+))\s+([+-]?(?:\d+|\d*\.\d+)%?)\s+([+-]?(?:\d+|\d*\.\d+)%?)(?:\s*\/\s*([^)]+?))?\s*\)$/i;
const MODERN_RGB_RE =
  /^rgba?\(\s*([+-]?(?:\d+|\d*\.\d+)%?)\s+([+-]?(?:\d+|\d*\.\d+)%?)\s+([+-]?(?:\d+|\d*\.\d+)%?)(?:\s*\/\s*([^)]+?))?\s*\)$/i;
const LEGACY_HSL_RE = /^hsla?\(\s*([^,]+),\s*([^,]+),\s*([^,)]+)(?:,\s*([^)]+))?\s*\)$/i;
const LEGACY_RGB_RE = /^rgba?\(\s*([^,]+),\s*([^,]+),\s*([^,)]+)(?:,\s*([^)]+))?\s*\)$/i;

function normalizeAlpha(alpha: string) {
  const clean = alpha.trim();
  if (clean.endsWith('%')) return String(Number.parseFloat(clean) / 100);
  return clean;
}

function hexToRgb(color: string): [number, number, number] | null {
  const hex = color.trim();
  const short = /^#([0-9a-f]{3})$/i.exec(hex);
  if (short) {
    const [r, g, b] = short[1]!.split('').map((part) => Number.parseInt(part + part, 16));
    return [r!, g!, b!];
  }

  const full = /^#([0-9a-f]{6})(?:[0-9a-f]{2})?$/i.exec(hex);
  if (!full) return null;
  const value = full[1]!;
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

export function toEChartsColor(color: string) {
  const value = color.trim();
  const hsl = MODERN_HSL_RE.exec(value);
  if (hsl) {
    const [, h, s, l, a] = hsl;
    return a ? `hsla(${h}, ${s}, ${l}, ${normalizeAlpha(a)})` : `hsl(${h}, ${s}, ${l})`;
  }

  const rgb = MODERN_RGB_RE.exec(value);
  if (rgb) {
    const [, r, g, b, a] = rgb;
    return a ? `rgba(${r}, ${g}, ${b}, ${normalizeAlpha(a)})` : `rgb(${r}, ${g}, ${b})`;
  }

  return value;
}

export function colorWithAlpha(color: string, alpha: number) {
  const safeColor = toEChartsColor(color);
  const normalizedAlpha = String(Math.max(0, Math.min(1, alpha)));
  const rgb = hexToRgb(safeColor);
  if (rgb) return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${normalizedAlpha})`;

  const legacyRgb = LEGACY_RGB_RE.exec(safeColor);
  if (legacyRgb) {
    const [, r, g, b] = legacyRgb;
    return `rgba(${r}, ${g}, ${b}, ${normalizedAlpha})`;
  }

  const legacyHsl = LEGACY_HSL_RE.exec(safeColor);
  if (legacyHsl) {
    const [, h, s, l] = legacyHsl;
    return `hsla(${h}, ${s}, ${l}, ${normalizedAlpha})`;
  }

  return safeColor;
}

export function buildTheme() {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string) => s.getPropertyValue(name).trim();
  const color = (name: string) => toEChartsColor(v(name));
  return {
    bg: color('--color-bg-base'),
    border: color('--color-border'),
    fgMuted: color('--color-fg-muted'),
    fg: color('--color-fg-base'),
    shadow: v('--shadow-lg'),
    accent: color('--color-accent'),
    success: color('--color-success'),
    danger: color('--color-danger'),
    palette: [
      color('--color-accent'),
      color('--color-success'),
      color('--color-warning'),
      color('--color-danger'),
      color('--color-info'),
    ],
  };
}

export type Theme = ReturnType<typeof buildTheme>;

export function useChartTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(buildTheme);

  useEffect(() => {
    setTheme(buildTheme());
    const handler = () => setTheme(buildTheme());
    document.addEventListener('officina-theme-updated', handler);
    return () => document.removeEventListener('officina-theme-updated', handler);
  }, []);

  return theme;
}

export function sharedTooltip(t: Theme) {
  return {
    backgroundColor: t.bg,
    borderColor: t.border,
    borderRadius: 8,
    textStyle: { color: t.fg, fontSize: 12 },
    extraCssText: `box-shadow: ${t.shadow}`,
  };
}

export function sharedLegend(t: Theme) {
  return {
    bottom: 0,
    textStyle: { color: t.fgMuted, fontSize: 12 },
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
  };
}

export function sharedCartesianAxes(xData: string[], t: Theme, showLegend: boolean) {
  return {
    xAxis: {
      type: 'category' as const,
      data: xData,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: t.fgMuted, fontSize: 12, margin: 10 },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: t.border } },
      axisLabel: { color: t.fgMuted, fontSize: 12, margin: 10 },
    },
    grid: { top: 12, right: 18, bottom: showLegend ? 40 : 8, left: 44 },
  };
}

import { describe, expect, it } from 'vitest';

import { colorWithAlpha, toEChartsColor } from './theme';

describe('chart theme colors', () => {
  it('normalizes modern CSS colors for ECharts hover parsing', () => {
    expect(toEChartsColor('hsl(245 75% 59%)')).toBe('hsl(245, 75%, 59%)');
    expect(toEChartsColor('rgb(79 70 229 / 0.2)')).toBe('rgba(79, 70, 229, 0.2)');
  });

  it('builds parseable translucent colors', () => {
    expect(colorWithAlpha('#4f46e5', 0.13)).toBe('rgba(79, 70, 229, 0.13)');
    expect(colorWithAlpha('hsl(245 75% 59%)', 0.13)).toBe('hsla(245, 75%, 59%, 0.13)');
  });
});

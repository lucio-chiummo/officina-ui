import { cn } from '@lib/utils/cn';
import { lazy, Suspense, type ReactNode } from 'react';

import { echarts } from './echarts-init';
import {
  colorWithAlpha,
  useChartTheme,
  sharedTooltip,
  sharedLegend,
  sharedCartesianAxes,
} from './theme';

type Datum = Record<string, string | number>;

export interface ChartSeries {
  dataKey: string;
  name?: string;
  color?: string;
}

export interface CartesianChartProps {
  /** Row data; each object holds the x value and every series value. */
  data: Datum[];
  /** Key in each datum used for the x axis. */
  xKey: string;
  /** Series to plot, each mapping a data key to a label/colour. */
  series: ChartSeries[];
  /** Chart height in pixels. */
  height?: number;
  /** Show the series legend. */
  showLegend?: boolean;
  className?: string;
}

export interface PieChartProps {
  /** Slice data. */
  data: Datum[];
  /** Key in each datum used for the slice label. */
  nameKey: string;
  /** Key in each datum used for the slice value. */
  valueKey: string;
  /** Chart height in pixels. */
  height?: number;
  /** Render as a donut (hollow centre) instead of a full pie. */
  donut?: boolean;
  className?: string;
}

export interface RadarChartProps {
  /** Axis labels around the radar. */
  categories: string[];
  /** Series, each a value per category with an optional colour. */
  series: { name: string; data: number[]; color?: string }[];
  /** Chart height in pixels. */
  height?: number;
  className?: string;
}

export interface GaugeChartProps {
  /** Current value to display. */
  value: number;
  /** Lower bound of the scale. Defaults to 0. */
  min?: number;
  /** Upper bound of the scale. Defaults to 100. */
  max?: number;
  /** Caption shown with the value. */
  label?: string;
  /** Fill colour of the gauge arc. */
  color?: string;
  /** Chart height in pixels. */
  height?: number;
  className?: string;
}

export interface HeatmapChartProps {
  /** Cells as [xIndex, yIndex, value] tuples. */
  data: [number, number, number][];
  /** Column labels along the x axis. */
  xLabels: string[];
  /** Row labels along the y axis. */
  yLabels: string[];
  /** Chart height in pixels. */
  height?: number;
  className?: string;
}

export interface ScatterChartProps {
  /** Points, each with x/y and optional name and bubble size. */
  data: { x: number; y: number; name?: string; size?: number }[];
  /** Axis title for x. */
  xLabel?: string;
  /** Axis title for y. */
  yLabel?: string;
  /** Chart height in pixels. */
  height?: number;
  className?: string;
}

export interface FunnelChartProps {
  /** Stages from widest to narrowest. */
  data: { name: string; value: number }[];
  /** Chart height in pixels. */
  height?: number;
  className?: string;
}

export interface TreemapChartProps {
  /** Hierarchical nodes; size is proportional to `value`. */
  data: { name: string; value: number; children?: TreemapNode[] }[];
  /** Chart height in pixels. */
  height?: number;
  className?: string;
}

export interface TreemapNode {
  name: string;
  value: number;
  children?: TreemapNode[];
}

export interface WaterfallChartProps {
  /** Steps; `type` controls running-total vs delta rendering. */
  data: { name: string; value: number; type?: 'increase' | 'decrease' | 'total' }[];
  /** Chart height in pixels. */
  height?: number;
  className?: string;
}

function ChartFrame({
  height = 280,
  className,
  children,
}: {
  height?: number | undefined;
  className?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-4',
        className,
      )}
      style={{ height }}
    >
      {children}
    </div>
  );
}

const echartsStyle = { height: '100%', width: '100%' };

const ReactECharts = lazy(() => import('echarts-for-react/lib/core'));

function EChartsCanvas({ option }: { option: unknown }) {
  return (
    <Suspense
      fallback={<div className="h-full w-full animate-pulse rounded bg-[var(--color-bg-muted)]" />}
    >
      <ReactECharts echarts={echarts} option={option} style={echartsStyle} />
    </Suspense>
  );
}

export function LineChart({
  data,
  xKey,
  series,
  height = 280,
  showLegend = true,
  className,
}: CartesianChartProps) {
  const t = useChartTheme();
  const option = {
    ...sharedCartesianAxes(
      data.map((d) => String(d[xKey])),
      t,
      showLegend,
    ),
    tooltip: { trigger: 'axis', ...sharedTooltip(t) },
    legend: showLegend ? sharedLegend(t) : undefined,
    series: series.map((s, i) => ({
      name: s.name ?? s.dataKey,
      type: 'line',
      data: data.map((d) => d[s.dataKey]),
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2.5, color: s.color ?? t.palette[i % t.palette.length] },
      itemStyle: { color: s.color ?? t.palette[i % t.palette.length] },
    })),
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

export function BarChart({
  data,
  xKey,
  series,
  height = 280,
  showLegend = true,
  className,
}: CartesianChartProps) {
  const t = useChartTheme();
  const option = {
    ...sharedCartesianAxes(
      data.map((d) => String(d[xKey])),
      t,
      showLegend,
    ),
    tooltip: { trigger: 'axis', ...sharedTooltip(t) },
    legend: showLegend ? sharedLegend(t) : undefined,
    series: series.map((s, i) => ({
      name: s.name ?? s.dataKey,
      type: 'bar',
      data: data.map((d) => d[s.dataKey]),
      barMaxWidth: 32,
      itemStyle: {
        color: s.color ?? t.palette[i % t.palette.length],
        borderRadius: [4, 4, 0, 0],
      },
    })),
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

export function AreaChart({
  data,
  xKey,
  series,
  height = 280,
  showLegend = true,
  className,
}: CartesianChartProps) {
  const t = useChartTheme();
  const option = {
    ...sharedCartesianAxes(
      data.map((d) => String(d[xKey])),
      t,
      showLegend,
    ),
    tooltip: { trigger: 'axis', ...sharedTooltip(t) },
    legend: showLegend ? sharedLegend(t) : undefined,
    series: series.map((s, i) => {
      const color = s.color ?? t.palette[i % t.palette.length];
      return {
        name: s.name ?? s.dataKey,
        type: 'line',
        data: data.map((d) => d[s.dataKey]),
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2.5, color },
        itemStyle: { color },
        areaStyle: { opacity: 0.22, color },
      };
    }),
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

export function StackedBarChart({
  data,
  xKey,
  series,
  height = 280,
  showLegend = true,
  className,
}: CartesianChartProps) {
  const t = useChartTheme();
  const option = {
    ...sharedCartesianAxes(
      data.map((d) => String(d[xKey])),
      t,
      showLegend,
    ),
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...sharedTooltip(t) },
    legend: showLegend ? sharedLegend(t) : undefined,
    series: series.map((s, i) => ({
      name: s.name ?? s.dataKey,
      type: 'bar',
      stack: 'total',
      data: data.map((d) => d[s.dataKey]),
      itemStyle: { color: s.color ?? t.palette[i % t.palette.length] },
    })),
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

export function PieChart({
  data,
  nameKey,
  valueKey,
  height = 280,
  donut,
  className,
}: PieChartProps) {
  const t = useChartTheme();
  const option = {
    tooltip: { trigger: 'item', ...sharedTooltip(t) },
    legend: sharedLegend(t),
    series: [
      {
        type: 'pie',
        radius: donut ? ['40%', '65%'] : '65%',
        padAngle: 2,
        center: ['50%', '46%'],
        data: data.map((d, i) => ({
          name: d[nameKey],
          value: d[valueKey],
          itemStyle: { color: t.palette[i % t.palette.length] },
        })),
        label: { show: false },
        emphasis: { scale: true, scaleSize: 4 },
      },
    ],
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

export function DonutChart(props: Omit<PieChartProps, 'donut'>) {
  return <PieChart {...props} donut />;
}

export function RadarChart({ categories, series, height = 280, className }: RadarChartProps) {
  const t = useChartTheme();
  const option = {
    tooltip: sharedTooltip(t),
    legend: sharedLegend(t),
    radar: {
      indicator: categories.map((name) => ({ name })),
      axisLine: { lineStyle: { color: t.border } },
      splitLine: { lineStyle: { color: t.border } },
      axisName: { color: t.fgMuted, fontSize: 12 },
    },
    series: [
      {
        type: 'radar',
        data: series.map((s, i) => ({
          name: s.name,
          value: s.data,
          itemStyle: { color: s.color ?? t.palette[i % t.palette.length] },
          areaStyle: { opacity: 0.12, color: s.color ?? t.palette[i % t.palette.length] },
          lineStyle: { color: s.color ?? t.palette[i % t.palette.length] },
        })),
      },
    ],
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

export function GaugeChart({
  value,
  min = 0,
  max = 100,
  label,
  color,
  height = 280,
  className,
}: GaugeChartProps) {
  const t = useChartTheme();
  const gaugeColor = color ?? t.accent;
  const option = {
    series: [
      {
        type: 'gauge',
        min,
        max,
        progress: { show: true, width: 14, itemStyle: { color: gaugeColor } },
        axisLine: { lineStyle: { width: 14, color: [[1, t.border]] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { color: t.fgMuted, fontSize: 11, distance: 20 },
        pointer: { show: false },
        title: {
          show: !!label,
          offsetCenter: [0, '60%'],
          color: t.fgMuted,
          fontSize: 13,
        },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '30%'],
          color: t.fg,
          fontSize: 28,
          fontWeight: 600,
          formatter: '{value}',
        },
        data: [{ value, name: label ?? '' }],
      },
    ],
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

export function HeatmapChart({
  data,
  xLabels,
  yLabels,
  height = 280,
  className,
}: HeatmapChartProps) {
  const t = useChartTheme();
  const option = {
    tooltip: { position: 'top', ...sharedTooltip(t) },
    grid: { top: 12, right: 20, bottom: 40, left: 60 },
    xAxis: {
      type: 'category',
      data: xLabels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: t.fgMuted, fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: t.fgMuted, fontSize: 11 },
    },
    visualMap: {
      min: 0,
      max: Math.max(...data.map((d) => d[2])),
      calculable: false,
      show: false,
      inRange: { color: [colorWithAlpha(t.accent, 0.13), t.accent] },
    },
    series: [
      {
        type: 'heatmap',
        data,
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' } },
      },
    ],
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

export function ScatterChart({ data, xLabel, yLabel, height = 280, className }: ScatterChartProps) {
  const t = useChartTheme();
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (p: { data: number[] }) =>
        `${xLabel ?? 'X'}: ${p.data[0]}<br/>${yLabel ?? 'Y'}: ${p.data[1]}`,
      ...sharedTooltip(t),
    },
    grid: { top: 12, right: 18, bottom: 36, left: 48 },
    xAxis: {
      type: 'value',
      name: xLabel,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: t.border } },
      axisLabel: { color: t.fgMuted, fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      name: yLabel,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: t.border } },
      axisLabel: { color: t.fgMuted, fontSize: 12 },
    },
    series: [
      {
        type: 'scatter',
        data: data.map((d) => [d.x, d.y]),
        symbolSize: (d: number[]) => {
          const item = data.find((p) => p.x === d[0] && p.y === d[1]);
          return item?.size ?? 8;
        },
        itemStyle: { color: t.accent, opacity: 0.8 },
      },
    ],
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

export function FunnelChart({ data, height = 280, className }: FunnelChartProps) {
  const t = useChartTheme();
  const option = {
    tooltip: { trigger: 'item', ...sharedTooltip(t) },
    series: [
      {
        type: 'funnel',
        left: '10%',
        width: '80%',
        sort: 'descending',
        gap: 4,
        label: { show: true, position: 'inside', color: '#fff', fontSize: 12 },
        data: data.map((d, i) => ({
          name: d.name,
          value: d.value,
          itemStyle: { color: t.palette[i % t.palette.length] },
        })),
      },
    ],
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

export function TreemapChart({ data, height = 280, className }: TreemapChartProps) {
  const t = useChartTheme();
  const option = {
    tooltip: { ...sharedTooltip(t) },
    series: [
      {
        type: 'treemap',
        data: data.map((d, i) => ({
          ...d,
          itemStyle: { color: t.palette[i % t.palette.length] },
        })),
        label: { show: true, color: '#fff', fontSize: 12 },
        breadcrumb: { show: false },
        roam: false,
      },
    ],
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

export function WaterfallChart({ data, height = 280, className }: WaterfallChartProps) {
  const t = useChartTheme();

  const bases: number[] = [];
  const deltas: number[] = [];
  let running = 0;
  for (const d of data) {
    if (d.type === 'total') {
      bases.push(0);
      deltas.push(d.value);
    } else {
      bases.push(d.value < 0 ? running + d.value : running);
      deltas.push(Math.abs(d.value));
      running += d.value;
    }
  }

  const colors = data.map((d) => {
    if (d.type === 'total') return t.accent;
    return d.value >= 0 ? t.success : t.danger;
  });

  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...sharedTooltip(t) },
    grid: { top: 12, right: 18, bottom: 36, left: 44 },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: t.fgMuted, fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: t.border } },
      axisLabel: { color: t.fgMuted, fontSize: 12 },
    },
    series: [
      {
        type: 'bar',
        stack: 'waterfall',
        itemStyle: { color: 'transparent', borderColor: 'transparent' },
        data: bases,
        silent: true,
      },
      {
        type: 'bar',
        stack: 'waterfall',
        barMaxWidth: 40,
        data: deltas.map((v, i) => ({
          value: v,
          itemStyle: { color: colors[i], borderRadius: [4, 4, 0, 0] },
        })),
      },
    ],
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

export interface SankeyChartProps {
  /** Named nodes referenced by links. */
  nodes: { name: string }[];
  /** Flows between nodes, weighted by `value`. */
  links: { source: string; target: string; value: number }[];
  /** Chart height in pixels. */
  height?: number;
  className?: string;
}

export function SankeyChart({ nodes, links, height = 320, className }: SankeyChartProps) {
  const t = useChartTheme();
  const option = {
    tooltip: { trigger: 'item', triggerOn: 'mousemove', ...sharedTooltip(t) },
    series: [
      {
        type: 'sankey',
        data: nodes.map((n, i) => ({
          ...n,
          itemStyle: { color: t.palette[i % t.palette.length] },
        })),
        links,
        emphasis: { focus: 'adjacency' },
        lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.35 },
        label: { color: t.fg, fontSize: 12 },
        nodeWidth: 14,
        nodeGap: 12,
      },
    ],
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

export interface CandlestickDatum {
  date: string;
  open: number;
  close: number;
  low: number;
  high: number;
  volume?: number;
}

export interface CandlestickChartProps {
  /** OHLC data points. */
  data: CandlestickDatum[];
  /** Chart height in pixels. */
  height?: number;
  /** Render a volume sub-chart below the candles. */
  showVolume?: boolean;
  /** Show the zoom/pan data slider. */
  showZoom?: boolean;
  className?: string;
}

export function CandlestickChart({
  data,
  height = 360,
  showVolume = false,
  showZoom = true,
  className,
}: CandlestickChartProps) {
  const t = useChartTheme();
  const dates = data.map((d) => d.date);
  const candles = data.map((d) => [d.open, d.close, d.low, d.high]);
  const volumes = data.map((d, i) => ({
    value: d.volume ?? 0,
    itemStyle: {
      color: colorWithAlpha(d.close >= d.open ? t.success : t.danger, 0.45),
    },
    index: i,
  }));
  const hasVolume = showVolume && data.some((d) => d.volume != null);

  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' }, ...sharedTooltip(t) },
    grid: hasVolume
      ? [
          { top: 12, right: 18, bottom: '32%', left: 56 },
          { top: '74%', right: 18, bottom: showZoom ? 48 : 16, left: 56 },
        ]
      : [{ top: 12, right: 18, bottom: showZoom ? 48 : 28, left: 56 }],
    xAxis: (hasVolume ? [0, 1] : [0]).map((gridIndex) => ({
      type: 'category',
      gridIndex,
      data: dates,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: gridIndex === 0 ? { color: t.fgMuted, fontSize: 11 } : { show: false },
    })),
    yAxis: (hasVolume ? [0, 1] : [0]).map((gridIndex) => ({
      type: 'value',
      gridIndex,
      scale: true,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: gridIndex === 0 ? { lineStyle: { color: t.border } } : { show: false },
      axisLabel: gridIndex === 0 ? { color: t.fgMuted, fontSize: 11 } : { show: false },
    })),
    dataZoom: showZoom
      ? [
          { type: 'inside', xAxisIndex: hasVolume ? [0, 1] : [0] },
          {
            type: 'slider',
            xAxisIndex: hasVolume ? [0, 1] : [0],
            height: 18,
            bottom: 8,
            borderColor: t.border,
            fillerColor: colorWithAlpha(t.accent, 0.12),
            handleStyle: { color: t.accent },
            textStyle: { color: t.fgMuted, fontSize: 10 },
          },
        ]
      : [],
    series: [
      {
        type: 'candlestick',
        data: candles,
        itemStyle: {
          color: t.success,
          color0: t.danger,
          borderColor: t.success,
          borderColor0: t.danger,
        },
      },
      ...(hasVolume
        ? [
            {
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: volumes,
              barMaxWidth: 8,
            },
          ]
        : []),
    ],
  };
  return (
    <ChartFrame height={height} className={className}>
      <EChartsCanvas option={option} />
    </ChartFrame>
  );
}

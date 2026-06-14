'use client';

import {
  AreaChart,
  BarChart,
  CandlestickChart,
  DonutChart,
  FunnelChart,
  GanttChart,
  Gauge,
  GaugeChart,
  HeatmapChart,
  LineChart,
  PieChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
  Sparkline,
  StackedBarChart,
  NoSsr,
  TreemapChart,
  WaterfallChart,
} from '@officina/ui';
import type { ReactNode } from 'react';

// ECharts touches the DOM (getComputedStyle) on render, which fails during
// Next's static prerender. Render charts client-only.
const chart = (el: ReactNode) => <NoSsr>{el}</NoSsr>;

const chartData = [
  { month: 'Jan', revenue: 4200, users: 240, costs: 2200 },
  { month: 'Feb', revenue: 5300, users: 310, costs: 2600 },
  { month: 'Mar', revenue: 6100, users: 390, costs: 2800 },
  { month: 'Apr', revenue: 7200, users: 460, costs: 3100 },
  { month: 'May', revenue: 8400, users: 540, costs: 3400 },
  { month: 'Jun', revenue: 9100, users: 620, costs: 3600 },
];

const chartSegments = [
  { segment: 'Enterprise', value: 42 },
  { segment: 'Growth', value: 31 },
  { segment: 'Starter', value: 18 },
  { segment: 'Trial', value: 9 },
];

const heatmapData = Array.from({ length: 7 }, (_, day) =>
  Array.from(
    { length: 6 },
    (_u, hour) => [day, hour, (day + 1) * (hour + 2)] as [number, number, number],
  ),
).flat();

export function LineChartDemo() {
  return chart(
    <LineChart
      data={chartData}
      xKey="month"
      series={[
        { dataKey: 'revenue', name: 'Revenue' },
        { dataKey: 'costs', name: 'Costs' },
      ]}
      height={280}
    />,
  );
}

export function BarChartDemo() {
  return chart(
    <BarChart
      data={chartData}
      xKey="month"
      series={[
        { dataKey: 'revenue', name: 'Revenue' },
        { dataKey: 'users', name: 'Users' },
      ]}
      height={280}
    />,
  );
}

export function AreaChartDemo() {
  return chart(
    <AreaChart
      data={chartData}
      xKey="month"
      series={[
        { dataKey: 'revenue', name: 'Revenue' },
        { dataKey: 'costs', name: 'Costs' },
      ]}
      height={280}
    />,
  );
}

export function StackedBarChartDemo() {
  return chart(
    <StackedBarChart
      data={chartData}
      xKey="month"
      series={[
        { dataKey: 'revenue', name: 'Revenue' },
        { dataKey: 'costs', name: 'Costs' },
      ]}
      height={280}
    />,
  );
}

export function DonutChartDemo() {
  return chart(<DonutChart data={chartSegments} nameKey="segment" valueKey="value" height={280} />);
}

export function PieChartDemo() {
  return chart(<PieChart data={chartSegments} nameKey="segment" valueKey="value" height={280} />);
}

export function RadarChartDemo() {
  return chart(
    <RadarChart
      categories={['Reach', 'Activation', 'Revenue', 'Retention']}
      series={[
        { name: 'Organic', data: [90, 78, 62, 84] },
        { name: 'Paid', data: [74, 65, 80, 58] },
      ]}
      height={280}
    />,
  );
}

export function GaugeChartDemo() {
  return chart(<GaugeChart value={72} label="Quota" height={280} />);
}

export function SankeyChartDemo() {
  return chart(
    <SankeyChart
      nodes={[{ name: 'Visits' }, { name: 'Signups' }, { name: 'Trials' }, { name: 'Paid' }]}
      links={[
        { source: 'Visits', target: 'Signups', value: 4200 },
        { source: 'Signups', target: 'Trials', value: 2600 },
        { source: 'Trials', target: 'Paid', value: 1400 },
      ]}
      height={280}
    />,
  );
}

export function CandlestickChartDemo() {
  return chart(
    <CandlestickChart
      data={[
        { date: 'Jun 2', open: 102, close: 108, low: 100, high: 110, volume: 32_000 },
        { date: 'Jun 3', open: 108, close: 104, low: 103, high: 112, volume: 28_500 },
        { date: 'Jun 4', open: 104, close: 114, low: 104, high: 116, volume: 41_000 },
        { date: 'Jun 5', open: 114, close: 112, low: 109, high: 118, volume: 36_200 },
      ]}
      showVolume
      height={320}
    />,
  );
}

export function HeatmapChartDemo() {
  return chart(
    <HeatmapChart
      data={heatmapData}
      xLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
      yLabels={['00', '04', '08', '12', '16', '20']}
      height={280}
    />,
  );
}

export function ScatterChartDemo() {
  return chart(
    <ScatterChart
      data={[
        { name: 'Starter', x: 12, y: 260, size: 10 },
        { name: 'Growth', x: 35, y: 980, size: 18 },
        { name: 'Enterprise', x: 72, y: 4200, size: 26 },
      ]}
      xLabel="Sessions"
      yLabel="Revenue"
      height={280}
    />,
  );
}

export function FunnelChartDemo() {
  return chart(
    <FunnelChart
      data={[
        { name: 'Visitors', value: 48_000 },
        { name: 'Trials', value: 12_000 },
        { name: 'Activated', value: 7_800 },
        { name: 'Paid', value: 2_900 },
      ]}
      height={280}
    />,
  );
}

export function TreemapChartDemo() {
  return chart(
    <TreemapChart data={chartSegments.map((d) => ({ name: d.segment, value: d.value }))} />,
  );
}

export function WaterfallChartDemo() {
  return chart(
    <WaterfallChart
      data={[
        { name: 'Start', value: 24_000, type: 'total' },
        { name: 'Expansion', value: 4_200 },
        { name: 'Churn', value: -1_400 },
        { name: 'New', value: 3_300 },
        { name: 'End', value: 30_100, type: 'total' },
      ]}
      height={280}
    />,
  );
}

export function SparklineDemo() {
  return chart(
    <div className="flex items-center gap-6">
      <Sparkline data={[4, 7, 5, 9, 6, 11, 14, 12]} aria-label="Revenue trend" fill />
      <Sparkline data={[3, 8, 5, 10, 7, 12, 9, 15]} variant="bars" aria-label="Weekly orders" />
    </div>,
  );
}

export function GaugeDemo() {
  return chart(
    <div className="flex flex-wrap items-end gap-6">
      <Gauge value={72} label="CPU" size={140} />
      <Gauge value={58} variant="semi" label="Memory" size={140} />
    </div>,
  );
}

export function GanttChartDemo() {
  return chart(
    <GanttChart
      items={[
        {
          id: 'phase-1',
          label: 'Feature completion',
          start: new Date(),
          end: new Date(Date.now() + 86_400_000 * 4),
        },
        {
          id: 'phase-2',
          label: 'Launch QA',
          start: new Date(Date.now() + 86_400_000 * 3),
          end: new Date(Date.now() + 86_400_000 * 8),
        },
      ]}
    />,
  );
}

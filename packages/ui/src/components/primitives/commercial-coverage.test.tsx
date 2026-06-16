import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Calendar } from './Calendar';
import { BarChart } from './Chart';
import { NavigationMenu } from './NavigationMenu';
import { TransferList } from './TransferList';
import { VirtualList } from './VirtualList';

beforeEach(() => {
  class ResizeObserverMock implements ResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}
    observe(target: Element) {
      const entry: ResizeObserverEntry = {
        target,
        contentRect: DOMRect.fromRect({ x: 0, y: 0, width: 800, height: 360 }),
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      };

      this.callback([entry], this);
    }
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverMock;
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 360 });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 800 });
  Element.prototype.getBoundingClientRect = () =>
    DOMRect.fromRect({ x: 0, y: 0, width: 800, height: 360 });
});

describe('commercial primitive coverage', () => {
  it('renders Calendar events', () => {
    render(
      <Calendar
        defaultDate={new Date(2026, 4, 10)}
        events={[
          {
            title: 'Launch review',
            start: new Date(2026, 4, 10, 9),
            end: new Date(2026, 4, 10, 10),
          },
        ]}
      />,
    );

    expect(screen.getByText('Launch review')).toBeInTheDocument();
  });

  it('renders Chart container', () => {
    const { container } = render(
      <BarChart
        data={[{ month: 'Jan', revenue: 42 }]}
        xKey="month"
        series={[{ dataKey: 'revenue', name: 'Revenue' }]}
      />,
    );

    // ECharts renders to canvas — assert the chart frame wrapper mounts.
    expect(container.firstChild).toBeInTheDocument();
  });

  it('moves values in TransferList', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TransferList
        items={[
          { label: 'Users', value: 'users' },
          { label: 'Billing', value: 'billing' },
        ]}
        value={['billing']}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('Users'));
    await user.click(screen.getByRole('button', { name: 'Move selected right' }));

    expect(onChange).toHaveBeenCalledWith(['billing', 'users']);
  });

  it('sizes VirtualList from item count and estimate', () => {
    const { container } = render(
      <VirtualList
        items={Array.from({ length: 20 }, (_, index) => `Row ${index + 1}`)}
        renderItem={(item) => <div>{item}</div>}
      />,
    );

    expect(container.querySelector('div[style*="height: 880px"]')).toBeInTheDocument();
  });

  it('opens NavigationMenu trigger content', async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', content: <div>Inventory tools</div> },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: /products/i }));

    expect(within(document.body).getByText('Inventory tools')).toBeInTheDocument();
  });
});

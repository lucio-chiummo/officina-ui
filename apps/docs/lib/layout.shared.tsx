import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/** Shared nav/branding across the home and docs layouts. */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="font-semibold tracking-tight">
          Officina<span className="text-fd-muted-foreground"> UI</span>
        </span>
      ),
    },
    links: [
      { text: 'Docs', url: '/docs', active: 'nested-url' },
      {
        text: 'GitHub',
        url: 'https://github.com/lucio-chiummo/officina-ui',
        external: true,
      },
    ],
  };
}

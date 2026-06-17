import { fileURLToPath } from 'node:url';

import { defineConfig } from 'tsup';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Path aliases used inside the primitive source. The theme store is a
// DOM-driven shim so the library carries no app-state dependency.
const alias: Record<string, string> = {
  '@stores/theme.store': r('src/shims/theme-store.ts'),
  '@primitives': r('src/components/primitives'),
  '@lib': r('src/lib'),
  '@hooks': r('src/hooks'),
  '@': r('src'),
};

export default defineConfig({
  entry: { index: 'src/index.tsx' },
  format: ['esm'],
  target: 'es2022',
  tsconfig: 'tsconfig.build.json',
  dts: true,
  clean: true,
  treeshake: true,
  // echarts + echarts-for-react ship CJS internals; keep them external so the
  // consumer's bundler resolves them directly (avoids __require shims).
  external: [/^echarts(\/|$)/, /^echarts-for-react(\/|$)/],
  // Single client module — safe to import from React Server Components.
  banner: { js: '"use client";' },
  esbuildOptions(options) {
    options.alias = alias;
    // Dependency CSS imports stay external for the consumer's bundler.
    options.loader = { ...options.loader, '.css': 'empty' };
  },
});

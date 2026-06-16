import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@stores/theme.store': r('src/shims/theme-store.ts'),
      '@primitives': r('src/components/primitives'),
      '@lib': r('src/lib'),
      '@': r('src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/lib/test/setup.ts'],
    css: true,
    fileParallelism: false,
    testTimeout: 15_000,
    hookTimeout: 15_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['node_modules/**', 'dist/**', '**/*.test.{ts,tsx}', 'src/lib/test/**'],
    },
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});

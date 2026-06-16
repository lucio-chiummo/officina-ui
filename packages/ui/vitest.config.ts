import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Mirrors the alias map in tsup.config.ts / tsconfig.json so ported tests
// resolve the same way they do in the source admin-template repo.
const alias: Record<string, string> = {
  '@stores/theme.store': r('src/shims/theme-store.ts'),
  '@primitives': r('src/components/primitives'),
  '@lib': r('src/lib'),
  '@': r('src'),
};

export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    fileParallelism: false,
    testTimeout: 15_000,
    hookTimeout: 15_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.stories.tsx',
        '**/*.test.{ts,tsx}',
        'src/test/**',
        'src/index.tsx',
        'src/internal.ts',
      ],
    },
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});

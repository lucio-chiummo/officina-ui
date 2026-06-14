import { fileURLToPath } from 'node:url';

import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// Monorepo root (two levels up from apps/docs-next) — pins Turbopack so it does
// not mis-detect a stray lockfile elsewhere on the machine as the workspace.
const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  turbopack: { root: workspaceRoot },
  // @officina/ui ships ESM/JSX that must be transpiled by Next, and pulls in
  // peer libraries the docs app supplies for live demos.
  transpilePackages: ['@officina/ui'],
};

export default withMDX(config);

/**
 * Re-applies the "use client" directive to every emitted chunk.
 *
 * tsup passes `banner` to esbuild, but `treeshake: true` adds a rollup pass
 * afterwards that drops it — silently, so the package built fine while being
 * unimportable from a React Server Component. Restoring the directive here
 * keeps treeshaking without giving up RSC compatibility.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIRECTIVE = '"use client";';
const distDir = fileURLToPath(new URL('../dist', import.meta.url));

const files = (await readdir(distDir)).filter((f) => f.endsWith('.js'));
if (files.length === 0) {
  throw new Error(`No JS emitted in ${distDir} — did the tsup build run?`);
}

let patched = 0;
for (const file of files) {
  const path = join(distDir, file);
  const source = await readFile(path, 'utf8');
  if (source.startsWith(DIRECTIVE) || source.startsWith("'use client';")) continue;
  await writeFile(path, `${DIRECTIVE}\n${source}`);
  patched += 1;
}

console.log(`[use client] ${patched} of ${files.length} chunk(s) patched`);

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Compares the local drift-manifest.json against a remote one.
 *
 * Usage:
 *   tsx scripts/compare-drift-manifests.ts <path-to-remote-manifest.json>
 *
 * Exit codes:
 *   0 — no prop drift detected
 *   1 — drift found (lists components with added/removed props)
 */

type Manifest = {
  version: number;
  source: string;
  components: Record<string, string[]>;
};

function readManifest(path: string): Manifest {
  return JSON.parse(readFileSync(path, 'utf8')) as Manifest;
}

const remotePath = process.argv[2];
if (!remotePath) {
  console.error('Usage: tsx scripts/compare-drift-manifests.ts <remote-manifest.json>');
  process.exit(2);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const local = readManifest(join(root, 'drift-manifest.json'));
const remote = readManifest(remotePath);

const allComponents = new Set([
  ...Object.keys(local.components),
  ...Object.keys(remote.components),
]);

const driftLines: string[] = [];

for (const name of [...allComponents].sort()) {
  const localProps = local.components[name];
  const remoteProps = remote.components[name];

  if (!localProps) {
    driftLines.push(`  ${name}: only in ${remote.source}`);
    continue;
  }
  if (!remoteProps) {
    driftLines.push(`  ${name}: only in ${local.source}`);
    continue;
  }

  const localSet = new Set(localProps);
  const remoteSet = new Set(remoteProps);
  const added = localProps.filter((p) => !remoteSet.has(p));
  const removed = remoteProps.filter((p) => !localSet.has(p));

  if (added.length > 0 || removed.length > 0) {
    driftLines.push(`  ${name}:`);
    if (added.length > 0) driftLines.push(`    + ${added.join(', ')}  (in ${local.source})`);
    if (removed.length > 0) driftLines.push(`    - ${removed.join(', ')}  (in ${remote.source})`);
  }
}

if (driftLines.length === 0) {
  console.log('✓ No prop drift detected between manifests.');
  process.exit(0);
} else {
  console.log(
    `Prop drift detected (${driftLines.filter((l) => l.startsWith('  ') && !l.startsWith('    ')).length} components):\n`,
  );
  console.log(driftLines.join('\n'));
  process.exit(1);
}

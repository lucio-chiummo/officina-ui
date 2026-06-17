import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import { withCustomConfig } from 'react-docgen-typescript';

/**
 * Generates drift-manifest.json — a committed snapshot of every primitive
 * component's explicit prop surface (names only, sorted).
 *
 * CI runs `drift:check` which regenerates this file and fails if it differs
 * from what is committed, ensuring drift-manifest.json stays in sync with
 * source. Maintainers can compare it against admin-template's drift-manifest.json
 * to detect cross-repo prop drift.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// HTML/ARIA/SVG global attributes inherited through wide DOM intersections.
const HTML_GLOBALS = new Set([
  'about',
  'accessKey',
  'autoCapitalize',
  'autoCorrect',
  'autoFocus',
  'autoSave',
  'className',
  'color',
  'content',
  'contentEditable',
  'contextMenu',
  'dateTime',
  'dangerouslySetInnerHTML',
  'datatype',
  'defaultChecked',
  'defaultValue',
  'dir',
  'draggable',
  'enterKeyHint',
  'exportparts',
  'hidden',
  'id',
  'inert',
  'inlist',
  'inputMode',
  'is',
  'itemID',
  'itemProp',
  'itemRef',
  'itemScope',
  'itemType',
  'lang',
  'nonce',
  'part',
  'popover',
  'popoverTarget',
  'popoverTargetAction',
  'prefix',
  'property',
  'radioGroup',
  'key',
  'ref',
  'rel',
  'resource',
  'results',
  'rev',
  'role',
  'security',
  'slot',
  'spellCheck',
  'style',
  'suppressContentEditableWarning',
  'suppressHydrationWarning',
  'tabIndex',
  'title',
  'translate',
  'typeof',
  'unselectable',
  'vocab',
]);

const isDomGlobal = (name: string) =>
  HTML_GLOBALS.has(name) || name.startsWith('aria-') || name.startsWith('data-');

const isDomEventHandler = (name: string, type: string) =>
  /^on[A-Z]/.test(name) && /EventHandler</.test(type);

// Mirrors the propFilter from generate-component-docs.ts so the drift manifest
// captures the same prop surface as the API docs.
const parser = withCustomConfig(join(root, 'packages/ui/tsconfig.json'), {
  shouldExtractLiteralValuesFromEnum: false,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => {
    const fromNodeModules = prop.parent?.fileName.includes('node_modules') ?? false;
    if (prop.parent && !fromNodeModules) return true;
    if (isDomGlobal(prop.name)) return false;
    if (isDomEventHandler(prop.name, prop.type?.name ?? '')) return false;
    if (fromNodeModules) return false;
    return true;
  },
});

const files = glob
  .sync('packages/ui/src/components/primitives/**/*.tsx', { cwd: root, absolute: true })
  .filter((f) => !f.includes('.test.') && !f.includes('.stories.') && !f.includes('__tests__'));

const components: Record<string, string[]> = {};

for (const file of files) {
  let parsed: ReturnType<typeof parser.parse>;
  try {
    parsed = parser.parse(file);
  } catch {
    continue;
  }
  for (const doc of parsed) {
    if (components[doc.displayName]) continue;
    const props = Object.keys(doc.props).sort();
    if (props.length > 0) {
      components[doc.displayName] = props;
    }
  }
}

const manifest = {
  version: 1,
  source: 'packages/ui/src/components/primitives',
  components: Object.fromEntries(Object.entries(components).sort(([a], [b]) => a.localeCompare(b))),
};

const out = join(root, 'drift-manifest.json');
writeFileSync(out, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated drift-manifest.json for ${Object.keys(components).length} components.`);

import { glob } from 'glob';
/**
 * Extracts prop tables for every primitive component via react-docgen-typescript
 * and writes them to apps/docs/lib/component-props.json, which PropsTable reads
 * to render the API reference under each component's docs page.
 *
 * Run: pnpm docs:props
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { withCustomConfig } from 'react-docgen-typescript';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// HTML/ARIA/SVG global attributes that wide DOM intersections (e.g.
// HTMLMotionProps) drag in. None are a component's documented API.
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

const isDomGlobal = (name: string): boolean =>
  HTML_GLOBALS.has(name) || name.startsWith('aria-') || name.startsWith('data-');

// React DOM event handlers (onClick, onAnimationEnd, …) leak parent-less through
// wide intersections like HTMLMotionProps<'div'>. Their type is always a
// *EventHandler<…>. Component-authored callbacks (onChange, onClose) keep a
// parent in the component's own file and are matched before this runs.
const isDomEventHandler = (name: string, type: string): boolean =>
  /^on[A-Z]/.test(name) && /EventHandler</.test(type);

const parser = withCustomConfig(join(root, 'packages/ui/tsconfig.json'), {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // Keep the API table focused on what the component actually defines: drop
  // node_modules-inherited props, and drop the HTML/ARIA/SVG global attributes
  // that leak through wide intersections like HTMLMotionProps<'div'> (parent-
  // less, alone +276 props). Component-specific props (variant, value, on*
  // callbacks, etc.) are kept.
  propFilter: (prop) => {
    const fromNodeModules = prop.parent?.fileName.includes('node_modules') ?? false;
    // Explicit, component-authored prop: keep even if its name collides with an
    // HTML global (e.g. InputGroup's own `prefix`).
    if (prop.parent && !fromNodeModules) return true;
    // Parent-less or node_modules-inherited: strip DOM/ARIA globals and the
    // leaked React event-handler surface.
    if (isDomGlobal(prop.name)) return false;
    if (isDomEventHandler(prop.name, prop.type?.name ?? '')) return false;
    if (fromNodeModules) return false;
    // Parent-less, non-global, non-handler → keep (cva variant/size spreads).
    return true;
  },
});

function extractDefault(raw: unknown): string | null {
  if (raw && typeof raw === 'object' && 'value' in raw) {
    const { value } = raw;
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (value !== undefined && value !== null) return JSON.stringify(value);
  }
  return null;
}

type PropDoc = {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string | null;
  description: string;
};

type ComponentDoc = {
  name: string;
  description: string;
  props: PropDoc[];
  // Native element whose attributes this component forwards, when it adds no
  // props of its own (e.g. `ComponentPropsWithoutRef<'input'>`). Lets the docs
  // say "forwards all <input> attributes" instead of "no documented props".
  inheritsElement?: string;
};

const elementMap: Record<string, string> = {
  Input: 'input',
  Textarea: 'textarea',
  Anchor: 'a',
};

// Find the native element a thin wrapper forwards to — but only when it can be
// tied to *this* component's own `<Name>Props` declaration, so co-located
// subcomponents (e.g. ListItem living in List.tsx) are never mislabelled. A
// miss falls back to the generic "composed" message rather than a wrong tag.
function detectInheritedElement(file: string, name: string): string | undefined {
  let src = '';
  try {
    src = readFileSync(file, 'utf8');
  } catch {
    return undefined;
  }
  const decl = new RegExp(
    `\\b${name}Props\\b[^\\n=]*=\\s*[^\\n;]*Component(?:PropsWithoutRef|PropsWithRef|Props)<\\s*['"]([a-z]+)['"]`,
  );
  const generic = src.match(decl);
  if (generic) return generic[1];
  const ifaceDecl = new RegExp(
    `interface\\s+${name}Props\\s+extends[^{]*?(\\w+)HTMLAttributes<\\s*HTML(\\w*)Element`,
  );
  const iface = src.match(ifaceDecl);
  if (iface) return elementMap[iface[1]] ?? iface[2].toLowerCase() ?? undefined;
  return undefined;
}

const files = glob
  .sync('packages/ui/src/components/primitives/**/*.tsx', { cwd: root, absolute: true })
  .filter((f) => !f.includes('.test.') && !f.includes('.stories.') && !f.includes('__tests__'));

const docs: Record<string, ComponentDoc> = {};

for (const file of files) {
  let parsed: ReturnType<typeof parser.parse>;
  try {
    parsed = parser.parse(file);
  } catch {
    continue;
  }
  for (const doc of parsed) {
    // Components are unique per name across the library; first parse wins.
    if (docs[doc.displayName]) continue;
    const props = Object.values(doc.props)
      .map((p) => ({
        name: p.name,
        type: p.type.name,
        required: p.required,
        defaultValue: extractDefault(p.defaultValue),
        description: p.description,
      }))
      .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name));
    docs[doc.displayName] = {
      name: doc.displayName,
      description: doc.description,
      props,
      ...(props.length === 0
        ? (() => {
            const el = detectInheritedElement(file, doc.displayName);
            return el ? { inheritsElement: el } : {};
          })()
        : {}),
    };
  }
}

const sorted = Object.fromEntries(Object.entries(docs).sort(([a], [b]) => a.localeCompare(b)));
const payload = `${JSON.stringify(sorted, null, 2)}\n`;

const target = join(root, 'apps/docs/lib/component-props.json');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, payload);

console.log(`Extracted prop docs for ${Object.keys(sorted).length} components.`);

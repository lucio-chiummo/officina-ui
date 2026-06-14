import { isGroup, type FilterCondition, type FilterGroup, type FilterState } from './types';

const VERSION = 'v1';

type CompactCondition = { f: string; o: string; v?: unknown; i?: string };
type CompactGroup = {
  c: 'AND' | 'OR';
  x: Array<CompactCondition | CompactGroup>;
  i?: string;
};
type CompactState = { _v: string; r: CompactGroup };

const toCompactNode = (node: FilterCondition | FilterGroup): CompactCondition | CompactGroup => {
  if (isGroup(node)) {
    return { c: node.combinator, x: node.conditions.map(toCompactNode), i: node.id };
  }
  const out: CompactCondition = { f: node.field, o: node.op, i: node.id };
  if (node.value !== undefined) out.v = node.value;
  return out;
};

const fromCompactNode = (
  node: CompactCondition | CompactGroup,
  freshId: () => string,
): FilterCondition | FilterGroup => {
  if ('c' in node && 'x' in node) {
    return {
      id: node.i ?? freshId(),
      combinator: node.c,
      conditions: node.x.map((n) => fromCompactNode(n, freshId)),
    };
  }
  return {
    id: node.i ?? freshId(),
    field: node.f,
    op: node.o as FilterCondition['op'],
    value: node.v,
  };
};

const b64urlEncode = (s: string): string => {
  const bytes =
    typeof Buffer !== 'undefined'
      ? Buffer.from(s, 'utf-8').toString('base64')
      : btoa(unescape(encodeURIComponent(s)));
  return bytes.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const b64urlDecode = (s: string): string => {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4);
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(padded, 'base64').toString('utf-8');
  }
  return decodeURIComponent(escape(atob(padded)));
};

let counter = 0;
const fallbackId = () => `f${Date.now().toString(36)}${(counter++).toString(36)}`;

export function toUrl(state: FilterState): string {
  if (!state || !state.root || state.root.conditions.length === 0) return '';
  const compact: CompactState = {
    _v: VERSION,
    r: toCompactNode(state.root) as CompactGroup,
  };
  return b64urlEncode(JSON.stringify(compact));
}

export function fromUrl(encoded: string, idFn: () => string = fallbackId): FilterState | null {
  if (!encoded) return null;
  try {
    const json = b64urlDecode(encoded);
    const parsed = JSON.parse(json) as CompactState;
    if (!parsed || parsed._v !== VERSION || !parsed.r) return null;
    const root = fromCompactNode(parsed.r, idFn) as FilterGroup;
    return { root };
  } catch {
    return null;
  }
}

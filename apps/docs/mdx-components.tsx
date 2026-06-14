import defaultComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { Demo } from '@/components/demo';
import { PropsTable } from '@/components/props-table';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    Demo,
    PropsTable,
    ...components,
  };
}

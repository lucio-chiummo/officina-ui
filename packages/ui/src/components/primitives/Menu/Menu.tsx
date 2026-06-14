import { type ReactNode } from 'react';

import { Dropdown, type DropdownSection } from '../Dropdown';

export type MenuProps = {
  align?: 'start' | 'end';
  children: ReactNode;
  className?: string;
  sections: DropdownSection[];
};

export function Menu({ align, children, className, sections }: MenuProps) {
  return (
    <Dropdown
      {...(align ? { align } : {})}
      {...(className ? { className } : {})}
      sections={sections}
      trigger={children}
    />
  );
}

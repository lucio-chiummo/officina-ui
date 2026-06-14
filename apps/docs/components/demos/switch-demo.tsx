'use client';

import { Switch } from '@officina/ui';
import { useState } from 'react';

export function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <Switch
      checked={on}
      onChange={setOn}
      label="Email notifications"
      description="Receive an email when a report finishes."
    />
  );
}

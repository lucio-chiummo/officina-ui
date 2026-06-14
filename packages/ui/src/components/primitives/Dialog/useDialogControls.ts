import { useMemo } from 'react';

import { useDisclosure } from '@/hooks';

type UseDialogControlsOptions = {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export function useDialogControls(options: UseDialogControlsOptions = {}) {
  const disclosure = useDisclosure(options);

  return useMemo(
    () => ({
      ...disclosure,
      dialogProps: {
        onClose: disclosure.close,
        open: disclosure.isOpen,
      },
      triggerProps: {
        'aria-expanded': disclosure.isOpen,
        onClick: disclosure.open,
        type: 'button' as const,
      },
    }),
    [disclosure],
  );
}

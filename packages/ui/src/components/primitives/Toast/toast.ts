import { toast as sonnerToast, type ExternalToast } from 'sonner';

export const toast = {
  success: (message: string, opts?: ExternalToast) => sonnerToast.success(message, opts),
  error: (message: string, opts?: ExternalToast) => sonnerToast.error(message, opts),
  warn: (message: string, opts?: ExternalToast) => sonnerToast.warning(message, opts),
  info: (message: string, opts?: ExternalToast) => sonnerToast.info(message, opts),
  promise: sonnerToast.promise,
};

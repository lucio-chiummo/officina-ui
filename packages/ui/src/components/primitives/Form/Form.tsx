import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@lib/utils/cn';
/**
 * Form — RHF + Zod aware wrapper.
 * Why: PLAN.md §6.6. Every form goes through this primitive; never call register directly in features.
 */
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';

type FormProps<T extends FieldValues> = Omit<
  ComponentPropsWithoutRef<'form'>,
  'onSubmit' | 'children'
> & {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
};

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...rest
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        noValidate
        {...rest}
        onSubmit={(e) => {
          void form.handleSubmit(onSubmit)(e);
        }}
        className={cn('space-y-4', className)}
      >
        {children}
      </form>
    </FormProvider>
  );
}

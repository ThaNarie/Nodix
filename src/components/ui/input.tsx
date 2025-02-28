import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva } from '../../cva.config';
import type { VariantProps } from 'cva';
import type { ReactNode, Ref } from 'react';

const inputVariants = cva({
  base: [
    'border-input file:text-foreground placeholder:text-muted-foreground/50 selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow,border] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium md:text-sm',
    'hover:border-white/25',
    'focus-within:border-white/60!',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    'disabled-within:pointer-events-none disabled-within:cursor-not-allowed disabled-within:bg-muted/25',
  ],
});

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    startContent?: ReactNode;
    endContent?: ReactNode;
    ref?: Ref<HTMLInputElement>;
    inputClassName?: string;
  };

function Input({
  className,
  startContent,
  endContent,
  inputClassName,
  ...props
}: InputProps) {
  return (
    <div className={cn(inputVariants(), className)}>
      {startContent && (
        <span className="pointer-events-none flex items-center text-muted-foreground">
          {startContent}
        </span>
      )}
      <input
        data-slot="input"
        {...props}
        className={cn(
          'w-full bg-transparent outline-none focus-visible:outline-none',
          {
            'pl-1.5': !!startContent,
            'pr-1.5': !!endContent,
          },
          inputClassName,
        )}
      />
      {endContent && (
        <span className="pointer-events-none flex items-center text-muted-foreground">
          {endContent}
        </span>
      )}
    </div>
  );
}

export { Input };

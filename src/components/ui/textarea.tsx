import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva } from '../../cva.config';
import type { VariantProps } from 'cva';
import { type ReactNode, type Ref } from 'react';

const textareaVariants = cva({
  base: [
    'border-input file:text-foreground placeholder:text-muted-foreground/50 selection:bg-primary selection:text-primary-foreground flex min-w-0 w-full rounded-sm border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow,border] outline-none md:text-sm resize-none',
    'hover:border-white/25',
    'focus-within:border-white/60!',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    'disabled-within:pointer-events-none disabled-within:cursor-not-allowed disabled-within:bg-muted/25',
  ],
});

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants> & {
    startContent?: ReactNode;
    endContent?: ReactNode;
    ref?: Ref<HTMLTextAreaElement>;
    textareaClassName?: string;
    minRows?: number;
    maxRows?: number;
  };

export function Textarea({
  className,
  startContent,
  endContent,
  textareaClassName,
  minRows = 2,
  maxRows = 10,
  ...props
}: TextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <div className={cn(textareaVariants(), className)}>
      {startContent && (
        <span className="pointer-events-none flex items-start pt-2 text-muted-foreground">
          {startContent}
        </span>
      )}
      <textarea
        data-slot="textarea"
        ref={textareaRef}
        {...props}
        className={cn(
          'w-full bg-transparent outline-none focus-visible:outline-none field-sizing-content resize-none nowheel',
          {
            'pl-1.5': !!startContent,
            'pr-1.5': !!endContent,
          },
          textareaClassName,
        )}
        style={{
          ...props.style,
          minHeight: minRows ? `${minRows * 1}rem` : undefined,
          maxHeight: maxRows ? `${maxRows * 1}rem` : undefined,
        }}
      />
      {endContent && (
        <span className="pointer-events-none flex items-start pt-2 text-muted-foreground">
          {endContent}
        </span>
      )}
    </div>
  );
}

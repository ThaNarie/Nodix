import React, { type JSX, type Ref } from 'react';
import { cn } from '@/lib/utils';

type BaseNodeProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
  selected?: boolean;
};

export function BaseNode({
  className,
  selected,
  ref,
  ...props
}: BaseNodeProps): JSX.Element {
  return (
    <div
      ref={ref}
      className={cn(
        'relative w-80 rounded-sWm border border-white/15 bg-neutral-900/70 backdrop-blur-sm text-card-foreground text-xs',
        'shadow-[0_0_15px_rgba(255,255,255,0.01)] transition-all duration-150',
        className,
        selected
          ? 'border-neutral-400 shadow-[0_0_20px_rgba(255,255,255,0.025)]'
          : 'hover:shadow-[0_0_25px_rgba(255,255,255,0.04)] hover:border-white/18',
      )}
      tabIndex={0}
      {...props}
    />
  );
}

import React from 'react';
import { Handle, HandleProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export const BaseHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & HandleProps
>(({ className, ...props }, ref) => (
  <Handle
    ref={ref}
    className={cn(
      'w-3 h-3 bg-neutral-400 border-2 border-neutral-300 duration-150 transition-[border,box-shadow] hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,1)]',
      className,
    )}
    {...props}
  />
));
BaseHandle.displayName = 'BaseHandle';

import { Position } from '@xyflow/react';
import type { PropsWithChildren, ReactNode } from 'react';
import { BaseHandle } from '../../base-handle';
import { cn } from '../../../lib/utils';
import { OpenAI } from '../../icons/OpenAI';

export type NodeItemProps = PropsWithChildren<{
  id: string;
  type: 'input' | 'output';
  className?: string;
  hideHandle?: boolean;
}>;

export function NodeItem({
  id,
  type,
  children,
  className,
  hideHandle,
}: NodeItemProps): ReactNode {
  return (
    <div
      className={cn(
        'relative px-5 flex items-center',
        {
          // 'justify-start': type === 'input',
          'justify-end': type === 'output',
        },
        className,
      )}
    >
      {!hideHandle && (
        <BaseHandle
          id={id}
          type={type === 'input' ? 'target' : 'source'}
          position={type === 'input' ? Position.Left : Position.Right}
        />
      )}
      {children}
    </div>
  );
}

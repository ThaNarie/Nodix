import { Position } from '@xyflow/react';
import type { PropsWithChildren, ReactNode } from 'react';
import { BaseHandle } from '../../base-handle';
import { cn } from '../../../lib/utils';
import { HandleTooltip } from './inputs/components/HandleTooltip';
import { type DataType } from '@/components/nodes/FlowNode/FlowNode';

export type NodeItemProps = PropsWithChildren<{
  id: string;
  type: 'input' | 'output';
  className?: string;
  hideHandle?: boolean;
  dataType?: DataType;
  description?: string;
  schema?: string;
}>;

export function NodeItem({
  id,
  type,
  children,
  className,
  hideHandle,
  dataType,
  description,
  schema,
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
        <HandleTooltip
          dataType={dataType}
          description={description}
          schema={schema}
          type={type}
        >
          <BaseHandle
            id={id}
            type={type === 'input' ? 'target' : 'source'}
            position={type === 'input' ? Position.Left : Position.Right}
          />
        </HandleTooltip>
      )}
      {children}
    </div>
  );
}

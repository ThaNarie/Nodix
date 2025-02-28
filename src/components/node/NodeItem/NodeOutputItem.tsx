import type { ReactNode } from 'react';
import { NodeItem, type NodeItemProps } from './NodeItem';
import { cn } from '../../../lib/utils';

type NodeOutputItemProps = Omit<NodeItemProps, 'type'> & {
  displayName?: string;
  isLast?: boolean;
};

export function NodeOutputItem({
  displayName: label,
  isLast,
  ...props
}: NodeOutputItemProps): ReactNode {
  return (
    <NodeItem
      type="output"
      {...props}
      className={cn('bg-neutral-800/50 py-2 h-10', isLast && 'rounded-b-md')}
    >
      <p>{label ?? props.id}</p>
    </NodeItem>
  );
}

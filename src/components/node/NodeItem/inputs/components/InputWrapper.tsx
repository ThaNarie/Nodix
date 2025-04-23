import { Position } from '@xyflow/react';
import { BaseHandle } from '../../../../base-handle';
import { type ReactNode } from 'react';
import { HandleTooltip } from './HandleTooltip';
import { type DataType } from '@/components/nodes/FlowNode/FlowNode';

export type InputWrapperProps = {
  name: string;
  hasHandle?: boolean;
  isDisabled?: boolean;
  children: ReactNode;
  dataType?: DataType | null;
  description?: string;
  schema?: string;
};

// Input wrapper component to handle the BaseHandle positioning
export function InputWrapper({
  name,
  hasHandle,
  children,
  dataType,
  description,
  schema,
}: InputWrapperProps) {
  return (
    <div className="relative">
      {hasHandle && (
        <HandleTooltip
          dataType={dataType}
          description={description}
          schema={schema}
          type="input"
        >
          <BaseHandle
            id={name}
            type="target"
            position={Position.Left}
            className="absolute -left-5"
          />
        </HandleTooltip>
      )}
      {children}
    </div>
  );
}

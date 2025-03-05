import { Position } from '@xyflow/react';
import { BaseHandle } from '../../../base-handle';
import { type InputWrapperProps } from './types';

// Input wrapper component to handle the BaseHandle positioning
export function InputWrapper({ name, hasHandle, isDisabled, children }: InputWrapperProps) {
  return (
    <div className="relative">
      {hasHandle && (
        <BaseHandle
          id={name}
          type="target"
          position={Position.Left}
          className="-left-5"
        />
      )}
      {children}
    </div>
  );
}

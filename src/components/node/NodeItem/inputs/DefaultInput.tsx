import { Position } from '@xyflow/react';
import { BaseHandle } from '../../../base-handle';
import { LabelWrapper } from './components/LabelWrapper';
import { type BaseInputProps } from './types';

type DefaultInputProps = Pick<
  BaseInputProps,
  'name' | 'displayName' | 'hasHandle'
>;

// Default case component (just handle and label)
export function DefaultInput({
  name,
  displayName,
  hasHandle,
}: DefaultInputProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <LabelWrapper name={name} displayName={displayName} />
      {hasHandle && (
        <BaseHandle id={name} type="target" position={Position.Left} />
      )}
    </div>
  );
}

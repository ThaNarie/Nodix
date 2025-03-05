import { useCallback, useState, useEffect } from 'react';
import { Position } from '@xyflow/react';
import { Label } from '@radix-ui/react-label';
import { Switch } from '../../../ui/switch';
import { BaseHandle } from '../../../base-handle';
import { type BaseInputProps } from './types';

// Switch input component
export function SwitchInput({
  name,
  displayName,
  defaultValue = false,
  value,
  hasHandle,
  isDisabled,
  onChange,
}: BaseInputProps) {
  // State for switch
  const [switchValue, setSwitchValue] = useState<boolean>(
    ((value !== undefined ? value : defaultValue) as boolean) ?? false
  );

  // Handle switch change
  const onSwitchChange = useCallback(
    (checked: boolean) => {
      setSwitchValue(checked);
      onChange?.(name, checked);
    },
    [name, onChange]
  );

  // Update local state when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setSwitchValue(value as boolean);
    }
  }, [value]);

  return (
    <div className="w-full flex items-center gap-2 justify-between">
      {hasHandle && (
        <BaseHandle id={name} type="target" position={Position.Left} />
      )}
      <Label htmlFor={name}>{displayName ?? name}</Label>
      <Switch
        id={name}
        checked={switchValue}
        onCheckedChange={onSwitchChange}
        disabled={isDisabled}
      />
    </div>
  );
}

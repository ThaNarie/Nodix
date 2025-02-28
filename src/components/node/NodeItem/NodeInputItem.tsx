import type { ReactNode } from 'react';
import { useCallback, useState, useEffect } from 'react';
import { useNodeConnections } from '@xyflow/react';
import { NodeItem, type NodeItemProps } from './NodeItem';
import { Label } from '@radix-ui/react-label';
import { Input } from '../../ui/input';
import { BaseHandle } from '../../base-handle';
import { Position } from '@xyflow/react';
import { Lock } from 'lucide-react';
import type { InputData } from '../../nodes/FlowNode/FlowNode';
import { Switch } from '../../ui/switch';
import { Slider } from '../../ui/slider';
import { useSliderWithInput } from '../../../hooks/useSliderWithInput';
import { Combobox } from '../../ui/combobox';

type NodeInputItemProps = Omit<NodeItemProps, 'type' | 'id'> & InputData & {
  value?: unknown;
  onChange?: (name: string, value: unknown) => void;
};

export function NodeInputItem({
  type,
  name,
  displayName,
  placeholder,
  defaultValue,
  hasHandle,
  options,
  value,
  onChange,
  ...props
}: NodeInputItemProps): ReactNode {
  const connections = useNodeConnections({
    handleType: 'target',
    handleId: name,
  });
  const isInline = type === 'switch';
  const isDisabled = connections.length > 0;

  // Use the slider hook
  const initialValue = (value !== undefined ? value : defaultValue) as number ?? 0;
  const {
    sliderValue,
    inputValue,
    onSliderChange,
    onInputChange,
    onInputBlur,
  } = useSliderWithInput(initialValue, options);

  // State for select value
  const [selectValue, setSelectValue] = useState<string>(
    (value !== undefined ? value : defaultValue) as string ?? '',
  );

  // State for string input
  const [stringValue, setStringValue] = useState<string>(
    (value !== undefined ? value : defaultValue) as string ?? '',
  );

  // State for switch
  const [switchValue, setSwitchValue] = useState<boolean>(
    (value !== undefined ? value : defaultValue) as boolean ?? false,
  );

  // Handle select change
  const onSelectChange = useCallback((value: string) => {
    setSelectValue(value);
    onChange?.(name, value);
  }, [name, onChange]);

  // Handle string input change
  const onStringChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setStringValue(e.target.value);
    onChange?.(name, e.target.value);
  }, [name, onChange]);

  // Handle switch change
  const onSwitchChange = useCallback((checked: boolean) => {
    setSwitchValue(checked);
    onChange?.(name, checked);
  }, [name, onChange]);

  // Update slider value when it changes
  useEffect(() => {
    if (type === 'slider') {
      onChange?.(name, sliderValue);
    }
  }, [sliderValue, name, onChange, type]);

  // Update local state when external value changes
  useEffect(() => {
    if (value !== undefined) {
      if (type === 'string') {
        setStringValue(value as string);
      } else if (type === 'select') {
        setSelectValue(value as string);
      } else if (type === 'switch') {
        setSwitchValue(value as boolean);
      }
      // Slider is handled by the hook
    }
  }, [value, type]);

  return (
    <NodeItem
      type="input"
      {...props}
      id={name}
      hideHandle={type !== 'none' || !hasHandle}
    >
      {isInline ? (
        <div className="w-full flex items-center gap-2 justify-between">
          {hasHandle && (
            <BaseHandle id={name} type="target" position={Position.Left} />
          )}
          <Label htmlFor={name}>{displayName ?? name}</Label>
          {type === 'switch' && (
            <Switch 
              id={name} 
              checked={switchValue}
              onCheckedChange={onSwitchChange}
              disabled={isDisabled}
            />
          )}
        </div>
      ) : (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor={name}>{displayName ?? name}</Label>
            {type === 'slider' && (
              <Input
                type="text"
                value={inputValue}
                onChange={onInputChange}
                onBlur={onInputBlur}
                disabled={isDisabled}
                className="w-16"
                inputClassName="text-xs text-center"
              />
            )}
          </div>
          {type !== 'none' && (
            <div className="relative">
              {/* this will align the handle with the input */}
              {hasHandle && (
                <BaseHandle
                  id={name}
                  type="target"
                  position={Position.Left}
                  className="-left-5"
                />
              )}
              {type === 'string' && (
                <Input
                  type="text"
                  id={name}
                  placeholder={isDisabled ? 'Receiving input' : placeholder}
                  disabled={isDisabled}
                  value={stringValue}
                  onChange={onStringChange}
                  endContent={
                    isDisabled && <Lock size={16} className="text-white/15" />
                  }
                  inputClassName="text-xs"
                />
              )}
              {type === 'slider' && (
                <Slider
                  id={name}
                  value={[sliderValue]}
                  onValueChange={onSliderChange}
                  min={options?.min ?? 0}
                  max={options?.max ?? 100}
                  step={options?.step ?? 1}
                  disabled={isDisabled}
                  trackGradient={options?.trackGradient}
                />
              )}
              {type === 'select' && options?.selectOptions && (
                <Combobox
                  options={options.selectOptions}
                  value={selectValue}
                  onChange={onSelectChange}
                  placeholder={placeholder}
                  disabled={isDisabled}
                />
              )}
            </div>
          )}
        </div>
      )}
    </NodeItem>
  );
}

import { useCallback, useState, useEffect } from 'react';
import { Combobox } from '../../../ui/combobox';
import { LabelWrapper } from './components/LabelWrapper';
import { InputWrapper } from './components/InputWrapper';
import { type BaseInputProps } from './types';

type SelectInputProps = BaseInputProps & {
  options?: Array<{ label: string; value: string }>;
};

// Select input component
export function SelectInput({
  name,
  displayName,
  placeholder,
  defaultValue = '',
  value,
  hasHandle,
  isDisabled,
  onChange,
  options,
}: SelectInputProps) {
  // State for select value
  const [selectValue, setSelectValue] = useState<string>(
    ((value !== undefined ? value : defaultValue) as string) ?? '',
  );

  // Handle select change
  const onSelectChange = useCallback(
    (value: string) => {
      setSelectValue(value);
      onChange?.(name, value);
    },
    [name, onChange],
  );

  // Update local state when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectValue(value as string);
    }
  }, [value]);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <LabelWrapper name={name} displayName={displayName} />
      <InputWrapper name={name} hasHandle={hasHandle} isDisabled={isDisabled}>
        <Combobox
          options={options ?? []}
          value={selectValue}
          onChange={onSelectChange}
          placeholder={placeholder}
        />
      </InputWrapper>
    </div>
  );
}

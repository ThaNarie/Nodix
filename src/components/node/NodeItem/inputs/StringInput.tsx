import { useCallback, useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { Input } from '../../../ui/input';
import { LabelWrapper } from './LabelWrapper';
import { InputWrapper } from './InputWrapper';
import { type BaseInputProps } from './types';

// String input component
export function StringInput({
  name,
  displayName,
  placeholder,
  defaultValue = '',
  value,
  hasHandle,
  isDisabled,
  onChange,
}: BaseInputProps) {
  // State for string input
  const [stringValue, setStringValue] = useState<string>(
    ((value !== undefined ? value : defaultValue) as string) ?? ''
  );

  // Handle string input change
  const onStringChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStringValue(e.target.value);
      onChange?.(name, e.target.value);
    },
    [name, onChange]
  );

  // Update local state when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setStringValue(value as string);
    }
  }, [value]);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <LabelWrapper name={name} displayName={displayName} />
      <InputWrapper name={name} hasHandle={hasHandle} isDisabled={isDisabled}>
        <Input
          type="text"
          id={name}
          placeholder={isDisabled ? 'Receiving input' : placeholder}
          disabled={isDisabled}
          value={stringValue}
          onChange={onStringChange}
          endContent={isDisabled && <Lock size={16} className="text-white/15" />}
          inputClassName="text-xs"
        />
      </InputWrapper>
    </div>
  );
}

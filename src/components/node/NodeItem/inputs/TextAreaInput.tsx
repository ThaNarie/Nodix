import { useCallback, useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { Textarea } from '../../../ui/textarea';
import { LabelWrapper } from './LabelWrapper';
import { InputWrapper } from './InputWrapper';
import { type BaseInputProps } from './types';

type TextAreaInputProps = BaseInputProps & {
  minRows?: number;
  maxRows?: number;
  autoGrow?: boolean;
};

// TextArea input component
function TextAreaInput({
  name,
  displayName,
  placeholder,
  defaultValue = '',
  value,
  hasHandle,
  isDisabled,
  onChange,
  minRows = 2,
  maxRows = 6,
}: TextAreaInputProps) {
  // State for text area value
  const [textValue, setTextValue] = useState<string>(
    ((value !== undefined ? value : defaultValue) as string) ?? '',
  );

  // Handle text area change
  const onTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextValue(e.target.value);
      onChange?.(name, e.target.value);
    },
    [name, onChange],
  );

  // Update local state when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setTextValue(value as string);
    }
  }, [value]);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <LabelWrapper name={name} displayName={displayName} />
      <InputWrapper name={name} hasHandle={hasHandle} isDisabled={isDisabled}>
        <Textarea
          id={name}
          placeholder={isDisabled ? 'Receiving input' : placeholder}
          disabled={isDisabled}
          value={textValue}
          onChange={onTextChange}
          endContent={
            isDisabled && <Lock size={16} className="text-white/15" />
          }
          textareaClassName="text-xs"
          minRows={minRows}
          maxRows={maxRows}
        />
      </InputWrapper>
    </div>
  );
}

export { TextAreaInput };

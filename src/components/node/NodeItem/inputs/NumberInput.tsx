import { useCallback, useState, useEffect } from 'react';
import { Lock, Plus, Minus } from 'lucide-react';
import { Input } from '../../../ui/input';
import { LabelWrapper } from './LabelWrapper';
import { InputWrapper } from './InputWrapper';
import { type BaseInputProps } from './types';
import { cn } from '@/lib/utils';
import { Button } from '../../../ui/button';

type NumberInputProps = BaseInputProps & {
  min?: number;
  max?: number;
  step?: number;
};

// Number input component with plus/minus buttons
export function NumberInput({
  name,
  displayName,
  placeholder,
  defaultValue = 0,
  value,
  hasHandle,
  isDisabled,
  onChange,
  min,
  max,
  step = 1,
}: NumberInputProps) {
  // State for number input
  const [numberValue, setNumberValue] = useState<number>(
    ((value !== undefined ? value : defaultValue) as number) ?? 0,
  );

  // Handle number input change
  const onNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Only allow numbers and decimal point
      const value = e.target.value.replace(/[^0-9.]/g, '');

      // Prevent multiple decimal points
      const parts = value.split('.');
      const sanitizedValue =
        parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : value;

      const newValue = sanitizedValue === '' ? '' : parseFloat(sanitizedValue);

      // Don't update if it's not a valid number and not empty
      if (sanitizedValue !== '' && isNaN(newValue)) {
        return;
      }

      setNumberValue(newValue as number);
      onChange?.(name, newValue);
    },
    [name, onChange],
  );

  // Handle increment button click
  const onIncrement = useCallback(() => {
    if (isDisabled) return;

    const newValue =
      typeof numberValue === 'number'
        ? numberValue + (step || 1)
        : (defaultValue as number) + (step || 1);

    // Apply max constraint if provided
    const constrainedValue =
      max !== undefined ? Math.min(newValue, max) : newValue;

    setNumberValue(constrainedValue);
    onChange?.(name, constrainedValue);
  }, [name, numberValue, step, max, defaultValue, isDisabled, onChange]);

  // Handle decrement button click
  const onDecrement = useCallback(() => {
    if (isDisabled) return;

    const newValue =
      typeof numberValue === 'number'
        ? numberValue - (step || 1)
        : (defaultValue as number) - (step || 1);

    // Apply min constraint if provided
    const constrainedValue =
      min !== undefined ? Math.max(newValue, min) : newValue;

    setNumberValue(constrainedValue);
    onChange?.(name, constrainedValue);
  }, [name, numberValue, step, min, defaultValue, isDisabled, onChange]);

  // Update local state when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setNumberValue(value as number);
    }
  }, [value]);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <style>{`
        /* Hide native number input arrows */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
      <LabelWrapper name={name} displayName={displayName} />
      <InputWrapper name={name} hasHandle={hasHandle} isDisabled={isDisabled}>
        <Input
          type="text"
          id={name}
          placeholder={isDisabled ? 'Receiving input' : placeholder}
          disabled={isDisabled}
          value={numberValue}
          onChange={onNumberChange}
          min={min}
          max={max}
          step={step}
          endContent={
            isDisabled ? (
              <Lock size={16} className="text-white/15" />
            ) : (
              <div className="flex h-9 flex-col pointer-events-auto border-l border-white/10 ml-1 hover:border-white/20 group">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onIncrement}
                  className={cn(
                    'w-4.5 p-0 flex items-center justify-center cursor-pointer',
                    'text-white/50 hover:text-white/80 hover:bg-white/5',
                    'focus:outline-none focus:text-white/80 transition-colors rounded-none rounded-tr-sm',
                  )}
                  tabIndex={-1}
                >
                  <Plus className="size-3" />
                </Button>
                <div className="h-px w-full shrink-0 bg-white/10 group-hover:bg-white/20"></div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onDecrement}
                  className={cn(
                    'w-4.5 p-0 flex items-center justify-center cursor-pointer',
                    'text-white/50 hover:text-white/80 hover:bg-white/5',
                    'focus:outline-none focus:text-white/80 transition-colors rounded-none rounded-br-sm',
                  )}
                  tabIndex={-1}
                >
                  <Minus className="size-3" />
                </Button>
              </div>
            )
          }
          className="pe-0"
          inputClassName="text-xs"
        />
      </InputWrapper>
    </div>
  );
}

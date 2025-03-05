import { useEffect } from 'react';
import { Input } from '../../../ui/input';
import { Slider } from '../../../ui/slider';
import { useSliderWithInput } from '../../../../hooks/useSliderWithInput';
import { LabelWrapper } from './LabelWrapper';
import { InputWrapper } from './InputWrapper';
import { type BaseInputProps } from './types';

type SliderInputProps = BaseInputProps & {
  options?: {
    min?: number;
    max?: number;
    step?: number;
    trackGradient?: string;
  };
};

// Slider input component
export function SliderInput({
  name,
  displayName,
  defaultValue = 0,
  value,
  hasHandle,
  isDisabled,
  onChange,
  options,
}: SliderInputProps) {
  // Use the slider hook
  const initialValue = ((value !== undefined ? value : defaultValue) as number) ?? 0;
  const {
    sliderValue,
    inputValue,
    onSliderChange,
    onInputChange,
    onInputBlur,
  } = useSliderWithInput(initialValue, options);

  // Update slider value when it changes
  useEffect(() => {
    onChange?.(name, sliderValue);
  }, [sliderValue, name, onChange]);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <LabelWrapper name={name} displayName={displayName}>
        <Input
          type="text"
          value={inputValue}
          onChange={onInputChange}
          onBlur={onInputBlur}
          disabled={isDisabled}
          className="w-16"
          inputClassName="text-xs text-center"
        />
      </LabelWrapper>
      <InputWrapper name={name} hasHandle={hasHandle} isDisabled={isDisabled}>
        <div className="py-2">
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
        </div>
      </InputWrapper>
    </div>
  );
}

import { useState, useCallback } from 'react';

type SliderOptions = {
  min?: number;
  max?: number;
  step?: number;
};

export function useSliderWithInput(initialValue: number = 0, options?: SliderOptions) {
  // State for slider value
  const [sliderValue, setSliderValue] = useState<number>(initialValue);
  // Separate state for input field value
  const [inputValue, setInputValue] = useState<string>(initialValue.toString());
  
  // Handle slider change
  const onSliderChange = useCallback((value: number[]) => {
    const newValue = value[0];
    setSliderValue(newValue);
    setInputValue(newValue.toString());
  }, []);
  
  // Handle input change (just update local state)
  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);
  
  // Handle input blur (apply the value)
  const onInputBlur = useCallback(() => {
    const newValue = parseFloat(inputValue);
    if (!isNaN(newValue)) {
      const min = options?.min ?? 0;
      const max = options?.max ?? 100;
      // Clamp value between min and max
      const clampedValue = Math.min(Math.max(newValue, min), max);
      setSliderValue(clampedValue);
      setInputValue(clampedValue.toString());
    } else {
      // Reset to current slider value if invalid input
      setInputValue(sliderValue.toString());
    }
  }, [inputValue, options?.min, options?.max, sliderValue]);

  return {
    sliderValue,
    inputValue,
    onSliderChange,
    onInputChange,
    onInputBlur
  };
}

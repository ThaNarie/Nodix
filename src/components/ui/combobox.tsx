import { ChevronsUpDown, Check } from 'lucide-react';
import React, { type JSX } from 'react';
import { cn } from '../../lib/utils';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

type ComboBoxOption = {
  label: string;
  value: string;
};

type ComboboxProps = {
  options: ComboBoxOption[];
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export function Combobox({
  options,
  defaultValue,
  value,
  placeholder,
  onChange,
}: ComboboxProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');

  const isControlled = value !== undefined;
  const valueToUse = isControlled ? value : internalValue;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {valueToUse
            ? options.find((option) => option.value === valueToUse)?.label
            : `Select ${placeholder ?? ''}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[278px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder ?? ''}...`} />
          <CommandList className="nowheel">
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    if (!isControlled) {
                      setInternalValue(
                        currentValue === valueToUse ? '' : currentValue,
                      );
                    }
                    setOpen(false);
                    onChange?.(currentValue);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

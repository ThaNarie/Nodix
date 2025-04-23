import { useState, useCallback, useEffect, useRef } from 'react';
import { Plus, X, Lock } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { LabelWrapper } from './components/LabelWrapper';
import { InputWrapper } from './components/InputWrapper';
import { type BaseInputProps } from './types';
import { isEqual } from 'es-toolkit';

// Internal representation with stable IDs
type InternalListItem = {
  id: string;
  value: string;
};

type ListInputProps = BaseInputProps;

// Generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function ListInput({
  name,
  displayName,
  defaultValue = [],
  value,
  hasHandle,
  isDisabled,
  onChange,
}: ListInputProps) {
  // Ref to store the previous external value for comparison
  const prevExternalValueRef = useRef<string[]>((value as string[]) || []);

  // State for internal list items with stable IDs
  const [internalItems, setInternalItems] = useState<InternalListItem[]>(() => {
    const initialValue = value !== undefined ? value : defaultValue;

    // Convert array to array of items with IDs
    if (Array.isArray(initialValue)) {
      return initialValue.map((item) => ({ id: generateId(), value: item }));
    }

    // Always start with at least one empty item
    return [{ id: generateId(), value: '' }];
  });

  // Handle adding a new list item
  const onAddListItem = useCallback(() => {
    setInternalItems((prev) => [...prev, { id: generateId(), value: '' }]);
  }, []);

  // Handle removing a list item
  const onRemoveListItem = useCallback((id: string) => {
    setInternalItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);

      // Ensure there's always at least one item
      if (updated.length === 0) {
        return [{ id: generateId(), value: '' }];
      }

      return updated;
    });
  }, []);

  // Handle value change
  const onItemChange = useCallback((id: string, newValue: string) => {
    setInternalItems((prev) => {
      return prev.map((item) =>
        item.id === id ? { ...item, value: newValue } : item,
      );
    });
  }, []);

  // Convert internal items to external array format and notify parent
  useEffect(() => {
    // Convert array of internal items to external array format
    // Only include non-empty values
    const externalArray = internalItems
      .map(({ value }) => value)
      .filter((value) => value !== '');

    // Only call onChange if we have a handler and the value has actually changed
    if (onChange && !isEqual(externalArray, prevExternalValueRef.current)) {
      prevExternalValueRef.current = externalArray;
      onChange(name, externalArray);
    }
  }, [internalItems, name, onChange]);

  // Update internal state when external value changes
  useEffect(() => {
    // Skip if value is undefined or not an array
    if (value === undefined || !Array.isArray(value)) {
      return;
    }

    // Skip if the external value hasn't changed (deep comparison)
    if (isEqual(value, prevExternalValueRef.current)) {
      return;
    }

    // Update the ref with the new external value
    prevExternalValueRef.current = value as string[];

    // Merge external data with internal state
    setInternalItems((prev) => {
      // Create a map of existing items by their value for quick lookups
      const existingItemsByValue = new Map<string, InternalListItem>();
      prev.forEach((item) => {
        if (item.value) {
          existingItemsByValue.set(item.value, item);
        }
      });

      // Create a new array of items based on the external values
      const updatedItems: InternalListItem[] = [];

      // Track which values we've processed
      const processedValues = new Set<string>();

      // First, add all non-empty items from the previous state that still exist in the external data
      prev.forEach((item) => {
        if (item.value && value.includes(item.value)) {
          updatedItems.push(item);
          processedValues.add(item.value);
        } else if (item.value === '') {
          // Keep empty items
          updatedItems.push(item);
        }
      });

      // Then add any new values from the external data
      value.forEach((val) => {
        if (!processedValues.has(val)) {
          updatedItems.push({
            id: generateId(),
            value: val,
          });
        }
      });

      // Ensure we have at least one item
      if (updatedItems.length === 0) {
        updatedItems.push({ id: generateId(), value: '' });
      }

      return updatedItems;
    });
  }, [value]);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <LabelWrapper name={name} displayName={displayName}>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-7 cursor-pointer hover:bg-green-950/80 hover:text-green-500"
          onClick={onAddListItem}
          disabled={isDisabled}
        >
          <Plus size={14} />
        </Button>
      </LabelWrapper>
      <InputWrapper name={name} hasHandle={hasHandle} isDisabled={isDisabled}>
        <div className="flex flex-col gap-2">
          {internalItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={isDisabled ? 'Disabled' : 'Value'}
                disabled={isDisabled}
                value={item.value}
                onChange={(e) => onItemChange(item.id, e.target.value)}
                endContent={
                  isDisabled && <Lock size={16} className="text-white/15" />
                }
                inputClassName="text-xs"
                className="flex-1"
              />
              {internalItems.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-7 cursor-pointer hover:bg-red-950/80 hover:text-red-500"
                  onClick={() => onRemoveListItem(item.id)}
                  disabled={isDisabled}
                >
                  <X size={14} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </InputWrapper>
    </div>
  );
}

import { useState, useCallback, useEffect, useRef } from 'react';
import { Plus, X, Lock } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { LabelWrapper } from './LabelWrapper';
import { InputWrapper } from './InputWrapper';
import { type BaseInputProps } from './types';
import { isEqual } from 'es-toolkit';

// Internal representation with stable IDs
type InternalKeyValuePair = {
  id: string;
  key: string;
  value: string;
};

type KeyValueInputProps = BaseInputProps;

// Generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function KeyValueInput({
  name,
  displayName,
  defaultValue = {},
  value,
  hasHandle,
  isDisabled,
  onChange,
}: KeyValueInputProps) {
  // Ref to store the previous external value for comparison
  const prevExternalValueRef = useRef<Record<string, string>>(
    (value as Record<string, string>) || {},
  );

  // State for internal key-value pairs with stable IDs
  const [internalPairs, setInternalPairs] = useState<InternalKeyValuePair[]>(
    () => {
      const initialValue = value !== undefined ? value : defaultValue;

      // Convert object to array of key-value pairs with IDs
      if (initialValue && typeof initialValue === 'object') {
        return Object.entries(initialValue as Record<string, string>).map(
          ([key, value]) => ({ id: generateId(), key, value }),
        );
      }

      // Always start with at least one empty pair
      return [{ id: generateId(), key: '', value: '' }];
    },
  );

  // Handle adding a new key-value pair
  const onAddKeyValuePair = useCallback(() => {
    setInternalPairs((prev) => [
      ...prev,
      { id: generateId(), key: '', value: '' },
    ]);
  }, []);

  // Handle removing a key-value pair
  const onRemoveKeyValuePair = useCallback((id: string) => {
    setInternalPairs((prev) => {
      const updated = prev.filter((pair) => pair.id !== id);

      // Ensure there's always at least one pair
      if (updated.length === 0) {
        return [{ id: generateId(), key: '', value: '' }];
      }

      return updated;
    });
  }, []);

  // Handle key or value change
  const onKeyValueChange = useCallback(
    (id: string, field: 'key' | 'value', newValue: string) => {
      setInternalPairs((prev) => {
        return prev.map((pair) =>
          pair.id === id ? { ...pair, [field]: newValue } : pair,
        );
      });
    },
    [],
  );

  // Convert internal pairs to external object format and notify parent
  useEffect(() => {
    // Convert array of internal pairs to external object format
    // Only include non-empty keys
    const externalObject = internalPairs.reduce<Record<string, string>>(
      (obj, { key, value }) => {
        if (key) {
          obj[key] = value;
        }
        return obj;
      },
      {},
    );

    // Only call onChange if we have a handler and the value has actually changed
    if (onChange && !isEqual(externalObject, prevExternalValueRef.current)) {
      prevExternalValueRef.current = externalObject;
      onChange(name, externalObject);
    }
  }, [internalPairs, name, onChange]);

  // Update internal state when external value changes
  useEffect(() => {
    // Skip if value is undefined or not an object
    if (value === undefined || typeof value !== 'object') {
      return;
    }

    // Skip if the external value hasn't changed (deep comparison)
    if (isEqual(value, prevExternalValueRef.current)) {
      return;
    }

    // Update the ref with the new external value
    prevExternalValueRef.current = value as Record<string, string>;

    // Merge external data with internal state while preserving order
    setInternalPairs((prev) => {
      // Create a map of the external data for quick lookups
      const externalData = value as Record<string, string>;

      // Create a filtered copy of the previous state
      // Keep: empty key pairs and pairs whose keys still exist in external data
      const updatedPairs = prev.filter(
        (pair) =>
          pair.key === '' || // Keep empty key pairs
          pair.key in externalData, // Keep pairs that still exist in external data
      );

      // Track which external keys we've processed
      const processedExternalKeys = new Set<string>();

      // First pass: Update existing pairs that match external keys
      for (let i = 0; i < updatedPairs.length; i++) {
        const pair = updatedPairs[i];
        // Only update non-empty keys that exist in the external data
        if (pair.key && pair.key in externalData) {
          // Update the value if it's different
          if (pair.value !== externalData[pair.key]) {
            updatedPairs[i] = {
              ...pair,
              value: externalData[pair.key],
            };
          }
          // Mark this key as processed
          processedExternalKeys.add(pair.key);
        }
      }

      // Second pass: Add new pairs for external keys that weren't in our internal state
      Object.entries(externalData).forEach(([key, value]) => {
        if (!processedExternalKeys.has(key)) {
          // This is a new key, add it to our internal state
          updatedPairs.push({
            id: generateId(),
            key,
            value,
          });
        }
      });

      // Ensure we have at least one empty pair if there are none
      const hasEmptyPair = updatedPairs.some((pair) => pair.key === '');
      if (!hasEmptyPair) {
        updatedPairs.push({ id: generateId(), key: '', value: '' });
      }

      return updatedPairs;
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
          onClick={onAddKeyValuePair}
          disabled={isDisabled}
        >
          <Plus size={14} />
        </Button>
      </LabelWrapper>
      <InputWrapper name={name} hasHandle={hasHandle} isDisabled={isDisabled}>
        <div className="flex flex-col gap-2">
          {internalPairs.map((pair) => (
            <div key={pair.id} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={isDisabled ? 'Disabled' : 'Key'}
                disabled={isDisabled}
                value={pair.key}
                onChange={(e) =>
                  onKeyValueChange(pair.id, 'key', e.target.value)
                }
                endContent={
                  isDisabled && <Lock size={16} className="text-white/15" />
                }
                inputClassName="text-xs"
                className="flex-1"
              />
              <Input
                type="text"
                placeholder={isDisabled ? 'Disabled' : 'Value'}
                disabled={isDisabled}
                value={pair.value}
                onChange={(e) =>
                  onKeyValueChange(pair.id, 'value', e.target.value)
                }
                endContent={
                  isDisabled && <Lock size={16} className="text-white/15" />
                }
                inputClassName="text-xs"
                className="flex-1"
              />
              {internalPairs.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-7 cursor-pointer hover:bg-red-950/80 hover:text-red-500"
                  onClick={() => onRemoveKeyValuePair(pair.id)}
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

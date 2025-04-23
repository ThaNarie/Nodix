// Base props that all input components share
export type BaseInputProps = {
  name: string;
  displayName?: string;
  placeholder?: string;
  defaultValue?: unknown;
  value?: unknown;
  hasHandle?: boolean;
  isDisabled: boolean;
  onChange?: (name: string, value: unknown) => void;
};

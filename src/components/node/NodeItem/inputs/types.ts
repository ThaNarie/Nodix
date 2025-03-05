import type { ReactNode } from 'react';

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

// Props for the input wrapper component
export type InputWrapperProps = {
  name: string;
  hasHandle?: boolean;
  isDisabled?: boolean;
  children: ReactNode;
};

// Props for the label wrapper component
export type LabelWrapperProps = {
  name: string;
  displayName?: string;
  children?: ReactNode;
};

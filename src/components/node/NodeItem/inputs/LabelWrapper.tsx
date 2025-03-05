import { Label } from '@radix-ui/react-label';
import { type LabelWrapperProps } from './types';

// Label wrapper component for consistent label styling
export function LabelWrapper({ name, displayName, children }: LabelWrapperProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label htmlFor={name}>{displayName ?? name}</Label>
      {children}
    </div>
  );
}

import * as React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { type DataType } from '@/components/nodes/FlowNode/FlowNode';

type HandleTooltipProps = {
  children: React.ReactNode;
  dataType?: DataType | null;
  description?: string;
  schema?: string;
  type: 'input' | 'output';
  className?: string;
};

// Description mappings for different data types
const dataTypeDescriptions: Record<DataType, string> = {
  String: 'Text data that can be processed or generated',
  Boolean: 'True/False value used for conditional operations',
  Int: 'Integer number value without decimals',
  Float: 'Decimal number that can represent fractional values',
  LanguageModel: 'AI language model used for text generation',
  Data: 'Generic data structure for various purposes',
  Collection: 'A collection of related items or elements',
  Message: 'Communication or interaction message data',
  Structure: 'Complex structured data with defined schema',
};

export function HandleTooltip({
  children,
  dataType,
  description,
  schema,
  type,
}: HandleTooltipProps) {
  // Generate description based on dataType or use provided description
  const typeDescription =
    dataType && dataTypeDescriptions[dataType]
      ? dataTypeDescriptions[dataType]
      : description || 'No description available';

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={type === 'input' ? 'left' : 'right'}
        sideOffset={16}
        align="center"
        showArrow={false}
        className={cn(
          'p-4 flex flex-col gap-3 w-[400px] text-sm',
          'border border-neutral-700 bg-neutral-900/60 shadow-md backdrop-blur-md',
        )}
      >
        <div className="flex flex-col gap-3">
          {dataType && (
            <div className="flex items-center justify-between">
              <span className="font-medium text-neutral-300">
                {type === 'input' ? 'Input' : 'Output'} Type:
              </span>
              <span className="px-1.5 py-0.5 bg-neutral-200 rounded text-[11px] font-medium">
                {dataType}
              </span>
            </div>
          )}

          {typeDescription && (
            <div className="text-neutral-400 text-[12px]">
              {typeDescription}
            </div>
          )}

          {schema && (
            <div className="mt-1 border-t border-neutral-800 pt-1">
              <div className="font-medium text-neutral-300 mb-0.5">Schema:</div>
              <pre className=" bg-neutral-800 p-1 rounded overflow-x-auto">
                {schema}
              </pre>
            </div>
          )}
        </div>

        <div className="border-t border-neutral-800 pt-3 mt-1">
          <div className="text-neutral-400 mt-0.5 flex flex-col gap-2">
            <p>
              <strong className="text-neutral-300">Drag</strong> to connect
              compatible {type === 'input' ? 'outputs' : 'inputs'}
            </p>
            <p>
              <strong className="text-neutral-300">Click</strong> to filter
              compatible {type === 'input' ? 'outputs' : 'inputs'} and
              components
            </p>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

import { type NodeProps, type Node, useUpdateNodeInternals } from '@xyflow/react';
import { BaseNode } from '../../base-node';
import NodeHeader from '../../node/NodeHeader/NodeHeader';
import { NodeInputItem } from '../../node/NodeItem/NodeInputItem';
import { NodeOutputItem } from '../../node/NodeItem/NodeOutputItem';
import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { cn } from '../../../lib/utils';
import { useNodeData } from '../../../hooks/useNodeData';

type InputType =
  | 'none'
  | 'string'
  | 'int'
  | 'float'
  | 'boolean'
  | 'object'
  | 'array'
  | 'select'
  | 'switch'
  | 'slider';

type DataType =
  | 'String'
  | 'Boolean'
  | 'Int'
  | 'Float'
  | 'LanguageModel'
  | 'Data'
  | 'Collection'
  | 'Message'
  | 'Structure';

export type InputData<T extends string> = {
  type: InputType;
  name: string;
  displayName?: string;
  placeholder?: string;
  info?: string;
  dataType?: DataType;
  isRequired?: boolean;
  hasHandle?: boolean;
  defaultValue?: boolean | number | string;
  options?: {
    min?: number;
    max?: number;
    step?: number;
    trackGradient?: string;
    selectOptions?: Array<{ label: string; value: string }>;
  };
  condition?: Record<T, unknown>;
};

type OutputData = {
  name: string;
  displayName?: string;
  info?: string;
  dataType: DataType;
  allowsLoop?: boolean;
};

export type FlowNodeData<T extends string = string> = {
  icon?: ReactNode;
  iconColorClass?: string;
  title: string;
  description?: string;
  inputs: InputData<T>[];
  outputs: OutputData[];
  values?: Record<string, unknown>;
};

export type FlowNode = Node<FlowNodeData>;

export function FlowNode({
  selected,
  data: { inputs, outputs, values = {}, ...headerProps },
  id,
  dragHandle,
}: NodeProps<FlowNode>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const { updateNodeInputValue } = useNodeData();
  
  // Handler for input value changes
  const handleInputChange = useCallback((name: string, value: unknown) => {
    // Update the node data with the new value using our custom hook
    updateNodeInputValue(id, name, value);
    
    // Refresh the node to ensure connections are properly displayed
    updateNodeInternals(id);
  }, [id, updateNodeInternals, updateNodeInputValue]);
  
  // TODO add cursor-grabbing to header when mouse is down
  return (
    <BaseNode selected={selected} className="cursor-default">
      <NodeHeader
        {...headerProps}
        className={cn('cursor-grab', dragHandle?.slice(1))}
      />
      <div className="flex flex-col py-4 gap-4 border-b border-white/10">
        {inputs.length ? (
          inputs
            .filter((input) => {
              // If no condition is specified, always show the input
              if (!input.condition) return true;
              
              // Check if all conditions match the current values
              return Object.entries(input.condition).every(([key, value]) => {
                // Get the current value for the input with this name
                const currentValue = values[key];
                
                // If the value doesn't exist in the values object, fall back to the default value
                if (currentValue === undefined) {
                  const targetInput = inputs.find(input => input.name === key);
                  if (!targetInput) return false;
                  return targetInput.defaultValue === value;
                }
                
                // Compare the condition value with the current value from the values object
                return currentValue === value;
              });
            })
            .map((input) => (
              <NodeInputItem 
                key={input.name} 
                {...input} 
                value={values[input.name]} 
                onChange={handleInputChange}
              />
            ))
        ) : (
          <>
            <NodeInputItem
              name="a"
              displayName="Text"
              type="string"
              dataType="String"
            />
            <NodeInputItem
              name="b"
              displayName="Something else"
              type="string"
              dataType="String"
            />
          </>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {outputs.length ? (
          outputs.map((output, index) => (
            <NodeOutputItem
              key={output.name}
              id={output.name}
              {...output}
              isLast={index === outputs.length - 1}
            />
          ))
        ) : (
          <>
            <NodeOutputItem id="c" displayName="Message" />
            <NodeOutputItem id="d" displayName="Data" isLast />
          </>
        )}
      </div>
    </BaseNode>
  );
}

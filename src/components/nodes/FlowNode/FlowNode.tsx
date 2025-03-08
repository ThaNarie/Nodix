import {
  type NodeProps,
  type Node,
  useUpdateNodeInternals,
} from '@xyflow/react';
import { BaseNode } from '../../base-node';
import NodeHeader from '../../node/NodeHeader/NodeHeader';
import { NodeInputItem } from '../../node/NodeItem/NodeInputItem';
import { NodeOutputItem } from '../../node/NodeItem/NodeOutputItem';
import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { cn } from '../../../lib/utils';
import { useNodeData } from '../../../hooks/useNodeData';
import { Eye } from 'lucide-react';
import { Button } from '../../ui/button';
import { useToggle } from '@mediamonks/react-kit';
import { dump as yamlDump } from 'js-yaml';

type InputType =
  | 'none'
  | 'string'
  | 'int'
  | 'float'
  | 'boolean'
  // | 'object'
  // | 'array'
  | 'select' // also allow multi-select
  | 'switch'
  | 'slider'
  | 'list' // list of input fields (is this 'array' ?)
  | 'key-value'; // is this 'object' ?

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
  defaultValue?: boolean | number | string | Record<string, unknown>;
  options?: {
    min?: number;
    max?: number;
    step?: number;
    trackGradient?: string;
    selectOptions?: Array<{ label: string; value: string }>;
  };
  condition?: Record<T, unknown>;
};

export type OutputData = {
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
  const [showJson, toggleShowJson] = useToggle(false);

  // Handler for input value changes
  const handleInputChange = useCallback(
    (name: string, value: unknown) => {
      // Update the node data with the new value using our custom hook
      updateNodeInputValue(id, name, value);

      // Refresh the node to ensure connections are properly displayed
      updateNodeInternals(id);
    },
    [id, updateNodeInternals, updateNodeInputValue],
  );

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
                  const targetInput = inputs.find(
                    (input) => input.name === key,
                  );
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

      {/* JSON data viewer */}
      <div className="border-t border-white/10 mt-1">
        <div className="flex justify-end p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-white/10"
            onClick={() => toggleShowJson()}
            title="View node data as JSON"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {showJson && (
          <div className="p-4 border-t border-white/10 max-h-60 overflow-y-auto overflow-x-auto nowheel">
            <pre className="text-xs text-white/70 whitespace-pre">
              {yamlDump(values, {
                indent: 2,
                lineWidth: -1, // No line wrapping
                noRefs: true, // Don't output YAML references
              })}
            </pre>
          </div>
        )}
      </div>
    </BaseNode>
  );
}

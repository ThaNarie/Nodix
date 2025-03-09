import type { ReactNode } from 'react';
import { useNodeConnections } from '@xyflow/react';
import { NodeItem, type NodeItemProps } from './NodeItem';
import type { InputData } from '../../nodes/FlowNode/FlowNode';
import {
  StringInput,
  SliderInput,
  SelectInput,
  SwitchInput,
  DefaultInput,
  KeyValueInput,
  NumberInput,
  ListInput,
} from './inputs';

type NodeInputItemProps = Omit<NodeItemProps, 'type' | 'id'> &
  InputData<string> & {
    value?: unknown;
    onChange?: (name: string, value: unknown) => void;
  };

export function NodeInputItem({
  type,
  name,
  displayName,
  placeholder,
  defaultValue,
  hasHandle,
  options,
  value,
  onChange,
  ...props
}: NodeInputItemProps): ReactNode {
  const connections = useNodeConnections({
    handleType: 'target',
    handleId: name,
  });
  const isDisabled = connections.length > 0;

  // Render the appropriate input component based on type
  const renderInputByType = () => {
    const commonProps = {
      name,
      displayName,
      placeholder,
      defaultValue,
      value,
      hasHandle,
      isDisabled,
      onChange,
    };

    switch (type) {
      case 'string':
        return <StringInput {...commonProps} />;
      case 'float':
      case 'int':
        return (
          <NumberInput
            {...commonProps}
            min={options?.min}
            max={options?.max}
            step={options?.step}
          />
        );
      case 'slider':
        return <SliderInput {...commonProps} options={options} />;
      case 'select':
        return (
          <SelectInput {...commonProps} options={options?.selectOptions} />
        );
      case 'switch':
        return <SwitchInput {...commonProps} />;
      case 'key-value':
        return <KeyValueInput {...commonProps} />;
      case 'list':
        return <ListInput {...commonProps} />;
      case 'none':
        return (
          <DefaultInput
            name={name}
            displayName={displayName}
            hasHandle={hasHandle}
          />
        );
      default:
        return (
          <DefaultInput
            name={name}
            displayName={displayName}
            hasHandle={hasHandle}
          />
        );
    }
  };

  return (
    <NodeItem
      type="input"
      {...props}
      id={name}
      hideHandle={type !== 'none' || !hasHandle}
    >
      {renderInputByType()}
    </NodeItem>
  );
}

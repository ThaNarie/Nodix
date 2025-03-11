# FlowNode Component

The FlowNode component is a customizable node for React Flow that supports conditional rendering of inputs based on the values of other inputs.

## Features

- Conditional rendering of inputs based on other input values
- Support for various input types (string, int, float, boolean, select, etc.)
- Handles input value changes and updates node data

## Usage

### Basic Usage

```tsx
import { FlowNode } from './components/nodes/FlowNode/FlowNode';

// Define your node data
const nodeData = {
  title: 'My Node',
  description: 'A node with conditional inputs',
  inputs: [
    {
      name: 'inputType',
      displayName: 'Input Type',
      type: 'select',
      dataType: 'String',
      options: {
        selectOptions: [
          { label: 'Text', value: 'text' },
          { label: 'Number', value: 'number' },
        ],
      },
      defaultValue: 'text',
    },
    {
      name: 'textInput',
      displayName: 'Text Input',
      type: 'string',
      dataType: 'String',
      condition: { inputType: 'text' }, // Only show when inputType is 'text'
    },
    {
      name: 'numberInput',
      displayName: 'Number Input',
      type: 'int',
      dataType: 'Int',
      condition: { inputType: 'number' }, // Only show when inputType is 'number'
    },
  ],
  outputs: [
    {
      name: 'output',
      displayName: 'Output',
      dataType: 'String',
    },
  ],
};
```

### Conditional Inputs

The `condition` property on an input defines when that input should be displayed. It's an object where:

- Keys are the names of other inputs
- Values are the expected values of those inputs

An input will only be displayed if all conditions are met. If no condition is specified, the input is always displayed.

Example:

```tsx
{
  name: 'advancedOptions',
  displayName: 'Show Advanced Options',
  type: 'switch',
  dataType: 'Boolean',
  defaultValue: false,
},
{
  name: 'option1',
  displayName: 'Advanced Option 1',
  type: 'string',
  dataType: 'String',
  condition: { advancedOptions: true }, // Only show when advancedOptions is true
},
```

## Implementation Details

The FlowNode component uses the following hooks and utilities:

- `useNodeData`: A custom hook for managing node data updates
- `useUpdateNodeInternals`: A React Flow hook for refreshing node internals
- `NodeInputItem`: A component for rendering different types of inputs
- `NodeOutputItem`: A component for rendering node outputs

The component filters inputs based on their conditions and passes the current values and change handlers to the input components.

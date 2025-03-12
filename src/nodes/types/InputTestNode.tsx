import { TestTube2 } from 'lucide-react';
import type { FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';

export const inputTestNode = {
  title: 'Input Test Node',
  description: 'Demonstrates all available input types',
  icon: <TestTube2 width="100%" height="100%" />,
  iconColorClass: 'bg-purple-600',
  inputs: [
    // String input
    {
      type: 'string',
      dataType: 'String',
      name: 'stringInput',
      displayName: 'String Input',
      placeholder: 'Enter text here...',
      info: 'A standard text input field',
      hasHandle: true,
      defaultValue: 'Default text',
    },
    // TextArea input
    {
      type: 'textarea',
      dataType: 'String',
      name: 'textAreaInput',
      displayName: 'TextArea Input',
      placeholder: 'Enter text here...',
      info: 'A text area for multi-line input',
      hasHandle: true,
      defaultValue: 'Default text',
    },

    // Number input
    {
      type: 'float',
      dataType: 'Float',
      name: 'numberInput',
      displayName: 'Number Input',
      placeholder: 'Enter a number',
      info: 'A number input with increment/decrement buttons',
      hasHandle: true,
      defaultValue: 42,
      options: {
        min: 0,
        max: 100,
        step: 1,
      },
    },

    // Slider input
    {
      type: 'slider',
      name: 'sliderInput',
      displayName: 'Slider Input',
      info: 'A slider for selecting numeric values within a range',
      hasHandle: false,
      defaultValue: 50,
      options: {
        min: 0,
        max: 100,
        step: 1,
        trackGradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
      },
    },

    // Select input
    {
      type: 'select',
      name: 'selectInput',
      displayName: 'Select Input',
      info: 'A dropdown menu for selecting from predefined options',
      hasHandle: false,
      defaultValue: 'option2',
      options: {
        selectOptions: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
          { label: 'Option 4', value: 'option4' },
          { label: 'Option 5', value: 'option5' },
          { label: 'Option 6', value: 'option6' },
          { label: 'Option 7', value: 'option7' },
          { label: 'Option 8', value: 'option8' },
          { label: 'Option 9', value: 'option9' },
          { label: 'Option 10', value: 'option10' },
        ],
      },
    },

    // Switch input
    {
      type: 'switch',
      name: 'switchInput',
      displayName: 'Switch Input',
      info: 'A toggle switch for boolean values',
      hasHandle: false,
      defaultValue: true,
    },

    // Key-Value input
    {
      type: 'key-value',
      name: 'keyValueInput',
      displayName: 'Key-Value Input',
      info: 'A dynamic list of key-value pairs',
      hasHandle: false,
      defaultValue: {
        key1: 'value1',
        key2: 'value2',
      },
    },

    // List input
    {
      type: 'list',
      name: 'listInput',
      displayName: 'List Input',
      info: 'A dynamic list of string values',
      hasHandle: false,
      defaultValue: ['item1', 'item2', 'item3'],
    },

    // None type (for handle-only inputs)
    {
      type: 'none',
      name: 'handleOnlyInput',
      displayName: 'Handle-Only Input',
      info: 'An input that only shows a handle with no editable field',
      hasHandle: true,
    },
  ],
  outputs: [
    {
      name: 'stringOutput',
      displayName: 'String Output',
      dataType: 'String',
      info: 'Outputs the string input value',
    },
    {
      name: 'numberOutput',
      displayName: 'Number Output',
      dataType: 'Float',
      info: 'Outputs the number input value',
    },
    {
      name: 'booleanOutput',
      displayName: 'Boolean Output',
      dataType: 'Boolean',
      info: 'Outputs the switch input value',
    },
    {
      name: 'objectOutput',
      displayName: 'Object Output',
      dataType: 'Structure',
      info: 'Outputs the key-value input as an object',
    },
    {
      name: 'arrayOutput',
      displayName: 'Array Output',
      dataType: 'Collection',
      info: 'Outputs the list input as an array of strings',
    },
  ],
} satisfies FlowNodeData;

import { OpenAI } from '../../components/icons/OpenAI';
import type { FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';

export const openAi = {
  title: 'OpenAI',
  description: `Generate content with OpenAI LLMs`,
  icon: <OpenAI />,
  iconColorClass: 'bg-[#00A67E]',
  inputs: [
    {
      type: 'select',
      name: 'model',
      displayName: 'Model',
      info: 'The OpenAI model to use',
      hasHandle: false,
      defaultValue: 'gpt-4o',
      options: {
        selectOptions: [
          { label: 'GPT-4o', value: 'gpt-4o' },
          { label: 'GPT-4o mini', value: 'gpt-4o-mini' },
          { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
          { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
        ],
      },
    },
    {
      type: 'string',
      dataType: 'String',
      name: 'systemMessage',
      displayName: 'System Message',
      info: 'The system message',
      hasHandle: true,
      defaultValue: false,
    },
    {
      type: 'string',
      dataType: 'String',
      name: 'userMessage',
      displayName: 'User Message',
      info: 'The user message',
      hasHandle: true,
      defaultValue: false,
    },
    {
      type: 'switch',
      name: 'stream',
      displayName: 'Stream',
      info: 'Whether to stream the output',
      hasHandle: false,
      defaultValue: false,
    },
    {
      type: 'slider',
      name: 'temperature',
      displayName: 'Temperature',
      info: 'Controls randomness: lower values are more deterministic, higher values are more random',
      hasHandle: false,
      defaultValue: 1.2,
      options: {
        min: 0,
        max: 2,
        step: 0.1,
        trackGradient: 'bg-gradient-to-r from-blue-500 to-red-500',
      },
    },
  ],
  outputs: [
    {
      name: 'message',
      displayName: 'Message',
      dataType: 'String',
    },
  ],
} satisfies FlowNodeData;

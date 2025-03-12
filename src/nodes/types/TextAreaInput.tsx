import type { FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';
import { TextQuote } from 'lucide-react';

export const textAreaInput = {
  title: 'TextArea Input',
  description: 'Enter multi-line text',
  icon: <TextQuote width="100%" height="100%" />,
  iconColorClass: 'bg-muted',
  inputs: [
    {
      dataType: 'String',
      type: 'textarea',
      name: 'text',
      displayName: 'Text',
      placeholder: 'Type something...',
      info: 'Multi-line text input',
      hasHandle: true,
      options: {
        minRows: 2,
        maxRows: 6,
      },
    },
  ],
  outputs: [
    {
      name: 'message',
      displayName: 'Message',
      dataType: 'Message',
    },
    {
      name: 'data',
      displayName: 'Data',
      dataType: 'Data',
    },
  ],
} satisfies FlowNodeData;

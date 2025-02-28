import type { FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';
import { Type } from 'lucide-react';

export const textInput = {
  title: 'Text Input',
  description: 'Enter some text',
  icon: <Type width="100%" height="100%" />,
  iconColorClass: 'bg-muted',
  inputs: [
    {
      dataType: 'String',
      type: 'string',
      name: 'text',
      displayName: 'Text',
      placeholder: 'Type something...',
      info: 'The text',
      hasHandle: true,
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

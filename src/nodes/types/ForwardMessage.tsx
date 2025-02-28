import type { FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';
import { Forward } from 'lucide-react';

export const forwardMessage = {
  title: 'Forward Message',
  description: 'Forward a message',
  icon: <Forward width="100%" height="100%" />,
  iconColorClass: 'bg-muted',
  inputs: [
    {
      type: 'none',
      dataType: 'Message',
      name: 'message',
      displayName: 'Message',
      info: 'The message',
      hasHandle: true,
    },
  ],
  outputs: [
    {
      name: 'message',
      displayName: 'Message',
      dataType: 'Message',
    },
  ],
} satisfies FlowNodeData;

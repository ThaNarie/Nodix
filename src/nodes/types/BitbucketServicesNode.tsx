import { ServerCog } from 'lucide-react';
import type { FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';

export const bitbucketServicesNode = {
  title: 'Bitbucket Services',
  description: 'Defines service containers for Bitbucket Steps',
  icon: <ServerCog width="100%" height="100%" />,
  iconColorClass: 'bg-indigo-500',
  inputs: [
    // Add a key-value input for service configurations
    {
      type: 'key-value',
      name: 'services',
      displayName: 'Services',
      info: 'Define service containers with name and configuration',
      hasHandle: false,
      defaultValue: {},
    },
    
    // Memory option
    {
      type: 'select',
      name: 'memory',
      displayName: 'Memory',
      info: 'Amount of memory to allocate to service containers',
      hasHandle: false,
      defaultValue: '1x',
      options: {
        selectOptions: [
          { label: '1x (Standard)', value: '1x' },
          { label: '2x (Double)', value: '2x' },
          { label: '4x (Quadruple)', value: '4x' },
        ],
      },
    },
  ],
  outputs: [
    {
      name: 'servicesOutput',
      displayName: 'Services Output',
      dataType: 'Structure',
      info: 'The complete services configuration',
    },
  ],
} satisfies FlowNodeData;

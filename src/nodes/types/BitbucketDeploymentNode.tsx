import { Rocket } from 'lucide-react';
import type { FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';

export const bitbucketDeploymentNode = {
  title: 'Bitbucket Deployment',
  description: 'Defines deployment configurations for Bitbucket Steps',
  icon: <Rocket width="100%" height="100%" />,
  iconColorClass: 'bg-red-500',
  inputs: [
    // Environment name
    {
      type: 'string',
      dataType: 'String',
      name: 'name',
      displayName: 'Environment Name',
      placeholder: 'e.g., production, staging',
      info: 'The name of the environment to deploy to',
      hasHandle: false,
      defaultValue: '',
    },
    
    // Deployment trigger
    {
      type: 'select',
      name: 'trigger',
      displayName: 'Trigger',
      info: 'Whether deployment requires manual intervention',
      hasHandle: false,
      defaultValue: 'automatic',
      options: {
        selectOptions: [
          { label: 'Automatic', value: 'automatic' },
          { label: 'Manual', value: 'manual' },
        ],
      },
    },
  ],
  outputs: [
    {
      name: 'deploymentOutput',
      displayName: 'Deployment Output',
      dataType: 'Structure',
      info: 'The complete deployment configuration',
    },
  ],
} satisfies FlowNodeData;

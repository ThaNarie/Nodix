import { GitBranch } from 'lucide-react';
import type { FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';

export const bitbucketCloneNode = {
  title: 'Bitbucket Clone Options',
  description: 'Customizes Git clone operation for Bitbucket Steps',
  icon: <GitBranch width="100%" height="100%" />,
  iconColorClass: 'bg-cyan-500',
  inputs: [
    // Depth
    {
      type: 'float',
      dataType: 'Float',
      name: 'depth',
      displayName: 'Depth',
      placeholder: 'Git clone depth',
      info: 'Number of commits to fetch (shallow clone)',
      hasHandle: false,
      defaultValue: 50,
      options: {
        min: 1,
        max: 1000,
        step: 1,
      },
    },
    
    // LFS
    {
      type: 'switch',
      name: 'lfs',
      displayName: 'LFS',
      info: 'Whether to download Git LFS files',
      hasHandle: false,
      defaultValue: false,
    },
    
    // Enabled
    {
      type: 'switch',
      name: 'enabled',
      displayName: 'Enabled',
      info: 'Whether to clone the repository',
      hasHandle: false,
      defaultValue: true,
    },
  ],
  outputs: [
    {
      name: 'cloneOutput',
      displayName: 'Clone Output',
      dataType: 'Structure',
      info: 'The complete Git clone configuration',
    },
  ],
} satisfies FlowNodeData;

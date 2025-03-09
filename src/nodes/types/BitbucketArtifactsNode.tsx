import { Archive } from 'lucide-react';
import type { FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';

export const bitbucketArtifactsNode = {
  title: 'Bitbucket Artifacts',
  description: 'Defines artifacts to retain from Bitbucket Steps',
  icon: <Archive width="100%" height="100%" />,
  iconColorClass: 'bg-amber-500',
  inputs: [
    // Artifact paths
    {
      type: 'list',
      name: 'paths',
      displayName: 'Paths',
      info: 'List of file/directory paths to retain as artifacts',
      hasHandle: false,
      defaultValue: [],
    },
    
    // Download setting
    {
      type: 'switch',
      name: 'download',
      displayName: 'Download',
      info: 'Whether artifacts should be automatically downloaded in subsequent steps',
      hasHandle: false,
      defaultValue: true,
    },
  ],
  outputs: [
    {
      name: 'artifactsOutput',
      displayName: 'Artifacts Output',
      dataType: 'Structure',
      info: 'The complete artifacts configuration',
    },
  ],
} satisfies FlowNodeData;

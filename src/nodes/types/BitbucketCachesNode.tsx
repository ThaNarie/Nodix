import { Database } from 'lucide-react';
import type { FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';

export const bitbucketCachesNode = {
  title: 'Bitbucket Caches',
  description: 'Defines cache configurations for Bitbucket Steps',
  icon: <Database width="100%" height="100%" />,
  iconColorClass: 'bg-green-500',
  inputs: [
    // List of predefined caches
    {
      type: 'list',
      name: 'predefinedCaches',
      displayName: 'Predefined Caches',
      info: 'Select from predefined Bitbucket caches',
      hasHandle: false,
      defaultValue: [],
      options: {
        selectOptions: [
          { label: 'Node', value: 'node' },
          { label: 'Yarn', value: 'yarn' },
          { label: 'Gradle', value: 'gradle' },
          { label: 'Maven', value: 'maven' },
          { label: 'Pip', value: 'pip' },
          { label: 'Composer', value: 'composer' },
          { label: 'SBT', value: 'sbt' },
          { label: 'Go', value: 'go' }, 
          { label: 'NPM', value: 'npm' },
          { label: 'Dotnet', value: 'dotnetcore' },
        ]
      }
    },
    
    // Custom caches
    {
      type: 'key-value',
      name: 'customCaches',
      displayName: 'Custom Caches',
      info: 'Define custom caches with name and path',
      hasHandle: false,
      defaultValue: {},
    },
  ],
  outputs: [
    {
      name: 'cachesOutput',
      displayName: 'Caches Output',
      dataType: 'Structure',
      info: 'The complete cache configuration',
    },
  ],
} satisfies FlowNodeData;

import { Briefcase } from 'lucide-react';
import type { FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';

export const bitbucketStepNode = {
  title: 'Bitbucket Step',
  description: 'Defines a step in Bitbucket Pipelines',
  icon: <Briefcase width="100%" height="100%" />,
  iconColorClass: 'bg-blue-500',
  inputs: [
    // Step name
    {
      type: 'string',
      dataType: 'String',
      name: 'name',
      displayName: 'Name',
      placeholder: 'Step name',
      info: 'A name for the step to be displayed in the Bitbucket UI',
      hasHandle: false,
      defaultValue: '',
    },
    
    // Docker image
    {
      type: 'string',
      dataType: 'String',
      name: 'image',
      displayName: 'Image',
      placeholder: 'e.g., node:18',
      info: 'The Docker image to use for this step',
      hasHandle: false,
      defaultValue: '',
    },
    
    // Script (connection to script node)
    {
      type: 'none',
      name: 'script',
      displayName: 'Script',
      info: 'Connect to a Script node with shell commands to execute',
      hasHandle: true,
    },
    
    // After-script (connection to after-script node)
    {
      type: 'none',
      name: 'afterScript',
      displayName: 'After Script',
      info: 'Connect to a Script node with shell commands to execute after the main script',
      hasHandle: true,
    },
    
    // Max time
    {
      type: 'float',
      dataType: 'Float',
      name: 'maxTime',
      displayName: 'Max Time',
      placeholder: 'Maximum execution time in minutes',
      info: 'The maximum time (in minutes) the step can run before timing out (1-720)',
      hasHandle: false,
      defaultValue: 120,
      options: {
        min: 1,
        max: 720,
        step: 1,
      },
    },
    
    // Size
    {
      type: 'select',
      name: 'size',
      displayName: 'Size',
      info: 'Allocates additional resources to the step',
      hasHandle: false,
      defaultValue: '1x',
      options: {
        selectOptions: [
          { label: '1x (4GB RAM, 2 CPUs)', value: '1x' },
          { label: '2x (8GB RAM, 4 CPUs)', value: '2x' },
          { label: '4x (16GB RAM, 8 CPUs)', value: '4x' },
          { label: '8x (32GB RAM, 16 CPUs)', value: '8x' },
          { label: '16x (64GB RAM, 32 CPUs)', value: '16x' },
        ],
      },
    },
    
    // Runs on (runners)
    {
      type: 'list',
      name: 'runsOn',
      displayName: 'Runs On',
      info: 'List of self-hosted runner labels',
      hasHandle: false,
      defaultValue: [],
    },
    
    // Fail fast
    {
      type: 'switch',
      name: 'failFast',
      displayName: 'Fail Fast',
      info: 'Whether to immediately halt the pipeline if this step fails',
      hasHandle: false,
      defaultValue: true,
    },
    
    // On fail
    {
      type: 'select',
      name: 'onFail',
      displayName: 'On Fail',
      info: 'Action to take when this step fails',
      hasHandle: false,
      defaultValue: '',
      placeholder: 'Select action on failure',
      options: {
        selectOptions: [
          { label: 'Default', value: '' },
          { label: 'Continue', value: 'continue' },
          { label: 'Stop and Fail', value: 'stop-and-fail' },
          { label: 'Stop and Success', value: 'stop-and-success' },
        ],
      },
    },
    
    // Trigger
    {
      type: 'select',
      name: 'trigger',
      displayName: 'Trigger',
      info: 'Whether this step requires manual intervention',
      hasHandle: false,
      defaultValue: 'automatic',
      options: {
        selectOptions: [
          { label: 'Automatic', value: 'automatic' },
          { label: 'Manual', value: 'manual' },
        ],
      },
    },
    
    // OIDC
    {
      type: 'switch',
      name: 'oidc',
      displayName: 'OIDC',
      info: 'Enable OpenID Connect for this step',
      hasHandle: false,
      defaultValue: false,
    },
    
    // Caches (connection to caches node)
    {
      type: 'none',
      name: 'caches',
      displayName: 'Caches',
      info: 'Connect to a Caches node to define cache configurations',
      hasHandle: true,
    },
    
    // Artifacts (connection to artifacts node)
    {
      type: 'none',
      name: 'artifacts',
      displayName: 'Artifacts',
      info: 'Connect to an Artifacts node to define artifact configurations',
      hasHandle: true,
    },
    
    // Services (connection to services node)
    {
      type: 'none',
      name: 'services',
      displayName: 'Services',
      info: 'Connect to a Services node to define service containers',
      hasHandle: true,
    },
    
    // Deployment (connection to deployment node)
    {
      type: 'none',
      name: 'deployment',
      displayName: 'Deployment',
      info: 'Connect to a Deployment node to define deployment options',
      hasHandle: true,
    },
    
    // Condition (connection to condition node)
    {
      type: 'none',
      name: 'condition',
      displayName: 'Condition',
      info: 'Connect to a Condition node to define execution conditions',
      hasHandle: true,
    },
    
    // Clone options (connection to clone options node)
    {
      type: 'none',
      name: 'clone',
      displayName: 'Clone Options',
      info: 'Connect to a Clone Options node to customize Git clone operation',
      hasHandle: true,
    },
  ],
  outputs: [
    {
      name: 'stepOutput',
      displayName: 'Step Output',
      dataType: 'Structure',
      info: 'The complete Bitbucket step configuration',
    },
  ],
} satisfies FlowNodeData;

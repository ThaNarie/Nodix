import Atlassian from '../../components/icons/Atlassian';
import type { FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';

export const pipelineStepScript = {
  title: 'Pipeline Step Script',
  description: `A script inside a step that executes`,
  icon: <Atlassian />,
  iconColorClass: 'bg-[#2681FF]',
  inputs: [
    {
      type: 'none',
      name: 'trigger',
      displayName: 'Trigger',
      info: 'Links to the step, or a previous script',
      hasHandle: true,
    },
    {
      type: 'select',
      name: 'type',
      displayName: 'Type',
      info: 'How to configure this script',
      hasHandle: false,
      defaultValue: 'script',
      placeholder: 'script type',
      options: {
        selectOptions: [
          { label: 'Script', value: 'script' },
          { label: 'Definition', value: 'definition' },
          { label: 'Pipe', value: 'pipe' },
        ],
      },
    },
    {
      type: 'string',
      dataType: 'String',
      name: 'script',
      displayName: 'Script',
      info: 'Shell Commands to execute, can be multiline',
      hasHandle: false,
      defaultValue: '',
      condition: {
        type: 'script',
      },
    },
    {
      type: 'select',
      name: 'definition',
      displayName: 'Definition',
      info: 'Select a shared script definition',
      hasHandle: false,
      defaultValue: '',
      placeholder: 'definition',
      options: {
        selectOptions: [
          { label: 'None', value: '' },
          { label: 'npm-prepare', value: 'npm-prepare' },
          { label: 'build-container', value: 'build-container' },
        ],
      },
      condition: {
        type: 'definition',
      },
    },
    {
      type: 'select',
      name: 'pipe',
      displayName: 'Pipe',
      info: 'The pipe',
      hasHandle: false,
      defaultValue: false,
      placeholder: 'pipe',
      options: {
        selectOptions: [
          { label: 'None', value: '' },
          {
            label: 'atlassian/google-gar-push-image',
            value: 'atlassian/google-gar-push-image:0.3.1',
          },
          {
            label: 'atlassian/aws-s3-deploy',
            value: 'atlassian/aws-s3-deploy:0.2.2',
          },
        ],
      },
      condition: {
        type: 'pipe',
      },
    },
    {
      type: 'key-value',
      dataType: 'String',
      name: 'variables',
      displayName: 'Variables',
      info: 'Define the variables for the pipe as key-value pairs',
      hasHandle: false,
      defaultValue: {},
      condition: {
        type: 'pipe',
      },
    },
  ],
  outputs: [
    {
      name: 'next',
      displayName: 'Next script',
      dataType: 'String',
    },
  ],
} satisfies FlowNodeData<'type'>;

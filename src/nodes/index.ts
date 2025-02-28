import type { NodeTypes } from '@xyflow/react';

import { PositionLoggerNode } from './PositionLoggerNode';
import { AppNode } from './types';
import { FlowNode } from '../components/nodes/FlowNode/FlowNode';
import { textInput } from './types/TextInput';
import { openAi } from './types/OpenAi';
import { forwardMessage } from './types/ForwardMessage';
import { pipelineStepScript } from './types/PipelineStepScript';

export const initialNodes: AppNode[] = [
  {
    id: 'a',
    type: 'flow',
    position: { x: 0, y: -100 },
    data: textInput,
    dragHandle: '.dragHandle',
  },
  {
    id: 'b',
    type: 'flow',
    position: { x: 0, y: 300 },
    data: {
      title: 'Prompt',
      description: 'Create a prompt template with dynamic variables.',
      inputs: [],
      outputs: [],
    },
    dragHandle: '.dragHandle',
  },
  {
    id: 'c',
    type: 'flow',
    position: { x: 400, y: -50 },
    data: forwardMessage,
    dragHandle: '.dragHandle',
  },
  {
    id: 'd',
    type: 'flow',
    position: { x: 800, y: 100 },
    data: openAi,
    dragHandle: '.dragHandle',
  },
  {
    id: 'script-1',
    type: 'flow',
    position: { x: 400, y: 1000 },
    data: {
      ...pipelineStepScript,
      values: {
        type: 'definition',
        definition: 'npm-prepare',
      },
    },
    dragHandle: '.dragHandle',
  },
  {
    id: 'script-2',
    type: 'flow',
    position: { x: 800, y: 1100 },
    data: {
      ...pipelineStepScript,
      values: {
        type: 'script',
        script: 'npm run build',
      },
    },
    dragHandle: '.dragHandle',
  },
  {
    id: 'script-3',
    type: 'flow',
    position: { x: 1200, y: 1200 },
    data: {
      ...pipelineStepScript,
      values: {
        type: 'pipe',
        pipe: 'atlassian/google-gar-push-image:0.3.1',
        variables: 'env',
      },
    },
    dragHandle: '.dragHandle',
  },
];

export const nodeTypes = {
  'position-logger': PositionLoggerNode,
  flow: FlowNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;

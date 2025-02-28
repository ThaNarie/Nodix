import type { Edge, EdgeTypes } from '@xyflow/react';

export const initialEdges: Edge[] = [
  {
    id: 'a->c',
    source: 'a',
    sourceHandle: 'data',
    target: 'c',
    targetHandle: 'message',
    animated: true,
  },
  { id: 'b->d', source: 'b', target: 'd', targetHandle: 'userMessage' },
  {
    id: 'c->d',
    source: 'c',
    target: 'd',
    targetHandle: 'systemMessage',
    animated: true,
  },
  {
    id: 'script-1>script-2',
    source: 'script-1',
    sourceHandle: 'next',
    target: 'script-2',
    targetHandle: 'trigger',
  },
  {
    id: 'script-2>script-3',
    source: 'script-2',
    sourceHandle: 'next',
    target: 'script-3',
    targetHandle: 'trigger',
  },
];

export const edgeTypes = {
  // Add your custom edge types here!
} satisfies EdgeTypes;

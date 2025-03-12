import { FlowNodeData } from '../components/nodes/FlowNode/FlowNode';
import { textInput } from './types/TextInput';
import { textAreaInput } from './types/TextAreaInput';
import { openAi } from './types/OpenAi';
import { forwardMessage } from './types/ForwardMessage';
import { pipelineStepScript } from './types/PipelineStepScript';
import { inputTestNode } from './types/InputTestNode';
import { bitbucketStepNode } from './types/BitbucketStepNode';
import { bitbucketCachesNode } from './types/BitbucketCachesNode';
import { bitbucketArtifactsNode } from './types/BitbucketArtifactsNode';
import { bitbucketServicesNode } from './types/BitbucketServicesNode';
import { bitbucketDeploymentNode } from './types/BitbucketDeploymentNode';
import { bitbucketConditionNode } from './types/BitbucketConditionNode';
import { bitbucketCloneNode } from './types/BitbucketCloneNode';

// Node category definitions
export type NodeCategory = {
  id: string;
  name: string;
  description?: string;
};

export const nodeCategories: NodeCategory[] = [
  {
    id: 'input-output',
    name: 'Input & Output',
    description: 'Nodes for handling input and output data'
  },
  {
    id: 'ai',
    name: 'AI & ML',
    description: 'Artificial Intelligence and Machine Learning nodes'
  },
  {
    id: 'utility',
    name: 'Utility',
    description: 'General purpose utility nodes'
  },
  {
    id: 'pipeline',
    name: 'Pipeline',
    description: 'Pipeline management nodes'
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    description: 'Bitbucket integration nodes'
  }
];

// Node catalog containing all available node types with category information
export type CatalogNodeData = {
  nodeData: FlowNodeData;
  category: string;
};

export const nodeCatalog: Record<string, CatalogNodeData> = {
  'text-input': {
    nodeData: textInput,
    category: 'input-output'
  },
  'text-area-input': {
    nodeData: textAreaInput,
    category: 'input-output'
  },
  'open-ai': {
    nodeData: openAi,
    category: 'ai'
  },
  'forward-message': {
    nodeData: forwardMessage,
    category: 'utility'
  },
  'pipeline-step-script': {
    nodeData: pipelineStepScript,
    category: 'bitbucket'
  },
  'input-test': {
    nodeData: inputTestNode,
    category: 'input-output'
  },
  'bitbucket-step': {
    nodeData: bitbucketStepNode,
    category: 'bitbucket'
  },
  'bitbucket-caches': {
    nodeData: bitbucketCachesNode,
    category: 'bitbucket'
  },
  'bitbucket-artifacts': {
    nodeData: bitbucketArtifactsNode,
    category: 'bitbucket'
  },
  'bitbucket-services': {
    nodeData: bitbucketServicesNode,
    category: 'bitbucket'
  },
  'bitbucket-deployment': {
    nodeData: bitbucketDeploymentNode,
    category: 'bitbucket'
  },
  'bitbucket-condition': {
    nodeData: bitbucketConditionNode,
    category: 'bitbucket'
  },
  'bitbucket-clone': {
    nodeData: bitbucketCloneNode,
    category: 'bitbucket'
  },
};

// Generate a unique ID for new nodes
export function generateNodeId(prefix: string = 'node'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

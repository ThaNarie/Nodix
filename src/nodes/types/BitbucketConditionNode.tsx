import { CodeSquare } from 'lucide-react';
import type { FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';

export const bitbucketConditionNode = {
  title: 'Bitbucket Condition',
  description: 'Defines conditions for Bitbucket Step execution',
  icon: <CodeSquare width="100%" height="100%" />,
  iconColorClass: 'bg-purple-500',
  inputs: [
    // Condition expression
    {
      type: 'string',
      dataType: 'String',
      name: 'expression',
      displayName: 'Expression',
      placeholder: 'e.g., $BITBUCKET_BRANCH == "master"',
      info: 'Expression that evaluates to true or false for conditional execution',
      hasHandle: false,
      defaultValue: '',
    },
  ],
  outputs: [
    {
      name: 'conditionOutput',
      displayName: 'Condition Output',
      dataType: 'Structure',
      info: 'The complete condition configuration',
    },
  ],
} satisfies FlowNodeData;

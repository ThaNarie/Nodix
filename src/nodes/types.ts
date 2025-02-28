import type { Node, BuiltInNode } from '@xyflow/react';
import type { FlowNode } from '../components/nodes/FlowNode/FlowNode';

export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
export type AppNode = BuiltInNode | PositionLoggerNode | FlowNode;

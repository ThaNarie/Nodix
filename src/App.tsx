import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from '@xyflow/react';

import { initialNodes, nodeTypes } from './nodes';
import { initialEdges, edgeTypes } from './edges';

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      colorMode="dark"
      fitView
      // defaultViewport={{ x: 200, y: 100, zoom: 1 }}
      panOnScroll
      zoomOnScroll={false}
      // snapToGrid
      snapGrid={[20, 20]}
      maxZoom={2}
      minZoom={1}
    >
      <Background gap={20} offset={20} />
      <Controls />
    </ReactFlow>
  );
}

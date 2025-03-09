import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  useReactFlow,
} from '@xyflow/react';

import { initialNodes, nodeTypes } from './nodes';
import { initialEdges, edgeTypes } from './edges';
import { NodesList } from './components/NodesList';
import { nodeCatalog, generateNodeId } from './nodes/nodeCatalog';

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowInstance = useReactFlow();
  
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges],
  );

  const handleAddNode = useCallback(
    (nodeType: string) => {
      const catalogNode = nodeCatalog[nodeType];
      if (!catalogNode) return;

      // Get the viewport center position
      const { x, y, zoom } = reactFlowInstance.getViewport();
      const center = reactFlowInstance.screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });

      // Create a new node
      const newNode = {
        id: generateNodeId(nodeType),
        type: 'flow',
        position: {
          x: center.x,
          y: center.y,
        },
        data: catalogNode.nodeData,
        dragHandle: '.dragHandle',
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <NodesList nodes={nodeCatalog} onNodeAdd={handleAddNode} />
      
      <div className="flex-1 h-full">
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
          panOnScroll
          zoomOnScroll={false}
          snapGrid={[20, 20]}
          maxZoom={4}
          minZoom={0.2}
        >
          <Background gap={20} offset={20} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

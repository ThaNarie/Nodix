import { ReactFlow, Background, Controls } from '@xyflow/react';
import { useCallback } from 'react';

import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';
import { Sidebar } from './components/Sidebar';
import { NodePicker } from './components/NodePicker';
import { useNodeStore } from './store/useNodeStore';
import { useCanvasInteractions } from './hooks/useCanvasInteractions';
import { useAddNode } from './hooks/useAddNode';
import { nodeCatalog } from './nodes/nodeCatalog';

export default function App() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectEnd,
  } = useNodeStore();

  const { handleAddNode } = useAddNode();
  const { onDragOver, onDrop } = useCanvasInteractions();

  // Create a callback for drop that passes handleAddNode
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      onDrop(event, handleAddNode);
    },
    [onDrop, handleAddNode],
  );

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar nodes={nodeCatalog} />

        <div
          className="flex-1 h-full"
          onDragOver={onDragOver}
          onDrop={handleDrop}
        >
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
            onConnectEnd={onConnectEnd}
          >
            <Background gap={20} offset={20} />
            <Controls />
          </ReactFlow>

          {/* We need to render the NodePicker outside the ReactFlow component 
            to avoid any z-index or stacking context issues */}
        </div>
      </div>

      {/* Node picker rendered at the root level to ensure it's above everything */}
      <NodePicker />
    </>
  );
}

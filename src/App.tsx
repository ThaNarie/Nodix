import { useCallback } from 'react';
import { ReactFlow, Background, Controls, useReactFlow } from '@xyflow/react';

import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';
import { Sidebar } from './components/Sidebar';
import { NodePicker } from './components/NodePicker';
import { nodeCatalog } from './nodes/nodeCatalog';
import { useNodeStore } from './store/useNodeStore';
import { useNodeFlow } from './hooks/useNodeFlow';

export default function App() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectEnd,
    closeNodePicker,
  } = useNodeStore();

  const {
    handleAddNode,
    nodePickerPosition,
    connectionNodeId,
    handleNodeSelection,
  } = useNodeFlow();

  const reactFlowInstance = useReactFlow();

  // Handle drag over event to allow dropping
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop event to create a node at the drop position
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      // Get the node type from the drag event
      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;

      // Get the current viewport information
      const { x: vpX, y: vpY, zoom } = reactFlowInstance.getViewport();

      // Get the position where the node was dropped
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();

      // Calculate the drop coordinates in flow space using viewport pan and zoom
      // This is an alternative to using screenToFlowPosition that seems more accurate
      // at different zoom levels

      // Calculate the drop position (already centered because we centered the drag preview)
      const dropPosition = {
        x: (event.clientX - reactFlowBounds.left - vpX) / zoom,
        y: (event.clientY - reactFlowBounds.top - vpY) / zoom,
      };

      // Create the node at the drop position
      handleAddNode(nodeType, dropPosition);
    },
    [reactFlowInstance, handleAddNode],
  );

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar nodes={nodeCatalog} onNodeAdd={handleAddNode} />

        <div className="flex-1 h-full" onDragOver={onDragOver} onDrop={onDrop}>
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
      {nodePickerPosition && (
        <NodePicker
          nodes={nodeCatalog}
          position={nodePickerPosition}
          connectionNodeId={connectionNodeId}
          onSelectNode={handleNodeSelection}
          onClose={closeNodePicker}
        />
      )}
    </>
  );
}

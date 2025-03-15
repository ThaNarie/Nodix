import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

type NodePosition = {
  x: number;
  y: number;
};

export function useCanvasInteractions() {
  const reactFlowInstance = useReactFlow();

  // Handle drag over event to allow dropping
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop event to create a node at the drop position
  const onDrop = useCallback(
    (
      event: React.DragEvent,
      handleAddNode: (nodeType: string, position: NodePosition) => void,
    ) => {
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
    [reactFlowInstance],
  );

  return {
    onDragOver,
    onDrop,
  };
}

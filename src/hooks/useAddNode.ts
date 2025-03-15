import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useNodeStore } from '../store/useNodeStore';

export function useAddNode() {
  const reactFlowInstance = useReactFlow();
  const { addNode } = useNodeStore();

  // Handle adding a node with proper positioning
  const handleAddNode = useCallback(
    (nodeType: string, position?: { x: number; y: number }) => {
      let nodePosition;

      if (position) {
        // Use the provided position (from a drop event)
        nodePosition = position;
      } else {
        // Default to viewport center position if no position provided
        const center = reactFlowInstance.screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
        nodePosition = center;
      }

      addNode(nodeType, nodePosition);
    },
    [reactFlowInstance, addNode],
  );

  return { handleAddNode };
}

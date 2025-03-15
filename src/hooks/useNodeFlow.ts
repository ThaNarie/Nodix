import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useNodeStore } from '../store/useNodeStore';

export function useNodeFlow() {
  const reactFlowInstance = useReactFlow();
  const { handleNodeSelection, nodePickerPosition, connectionContext } =
    useNodeStore();

  // Handle node selection from the NodePicker with coordinate conversion
  const handleNodeSelectionWithConversion = useCallback(
    (nodeType: string, position: { x: number; y: number }) => {
      // Convert the screen coordinates to flow coordinates
      const flowPosition = reactFlowInstance.screenToFlowPosition(position);
      handleNodeSelection(nodeType, flowPosition);
    },
    [reactFlowInstance, handleNodeSelection],
  );

  return {
    handleNodeSelection: handleNodeSelectionWithConversion,
    nodePickerPosition,
    connectionNodeId: connectionContext.nodeId,
  };
}

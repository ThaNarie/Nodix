import { useState, useCallback } from 'react';
import { useReactFlow, type Edge, type OnConnectEnd } from '@xyflow/react';
import { generateNodeId, nodeCatalog } from '../nodes/nodeCatalog';
import type { AppNode } from '../nodes/types';

export function useNodePicker({
  setNodes,
  setEdges,
}: {
  setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}) {
  const reactFlowInstance = useReactFlow();

  // State for node picker
  const [nodePickerPosition, setNodePickerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [connectionNodeId, setConnectionNodeId] = useState<string | null>(null);

  // Handle node selection from the NodePicker
  const handleNodeSelection = useCallback(
    (nodeType: string, position: { x: number; y: number }) => {
      if (!connectionNodeId) return;

      // Convert the screen coordinates to flow coordinates
      const flowPosition = reactFlowInstance.screenToFlowPosition(position);

      // Create the new node
      const id = generateNodeId(nodeType);
      const catalogNode = nodeCatalog[nodeType];

      if (!catalogNode) return;

      const newNode = {
        id,
        type: 'flow',
        position: flowPosition,
        data: catalogNode.nodeData,
        dragHandle: '.dragHandle',
      };

      setNodes((nds) => nds.concat(newNode));

      // Create the new edge
      setEdges((eds) =>
        eds.concat({
          id: `edge-${connectionNodeId}-${id}`,
          source: connectionNodeId,
          target: id,
        }),
      );

      // Reset picker state
      setNodePickerPosition(null);
      setConnectionNodeId(null);
    },
    [connectionNodeId, setNodes, setEdges, reactFlowInstance],
  );

  // Handle edge connect end event
  const onConnectEnd: OnConnectEnd = useCallback((event, connectionState) => {
    if (!connectionState.isValid && connectionState.fromNode) {
      // When a connection is dropped on the pane it's not valid, but we want to show the node picker
      const { clientX, clientY } =
        'changedTouches' in event
          ? event.changedTouches[0]
          : (event as MouseEvent);

      // For the picker, we want to use screen coordinates rather than flow coordinates
      // to position it correctly relative to the viewport
      setNodePickerPosition({
        x: clientX,
        y: clientY,
      });
      setConnectionNodeId(connectionState.fromNode.id);
    }
  }, []);

  // Close node picker
  const closeNodePicker = useCallback(() => {
    setNodePickerPosition(null);
    setConnectionNodeId(null);
  }, []);

  return {
    nodePickerPosition,
    connectionNodeId,
    handleNodeSelection,
    onConnectEnd,
    closeNodePicker,
  };
}

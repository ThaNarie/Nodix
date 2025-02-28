import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { FlowNodeData } from '../components/nodes/FlowNode/FlowNode';

/**
 * Hook to manage node data updates
 * @returns Functions to update node data
 */
export function useNodeData() {
  const { getNodes, setNodes } = useReactFlow();

  /**
   * Update a specific input value for a node
   * @param nodeId The ID of the node to update
   * @param inputName The name of the input to update
   * @param value The new value for the input
   */
  const updateNodeInputValue = useCallback(
    (nodeId: string, inputName: string, value: unknown) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === nodeId) {
            // Create a new values object with the updated value
            const updatedValues = {
              ...(node.data.values || {}),
              [inputName]: value,
            };

            // Return the updated node
            return {
              ...node,
              data: {
                ...node.data,
                values: updatedValues,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  /**
   * Get the current input values for a node
   * @param nodeId The ID of the node to get values for
   * @returns The current values object for the node
   */
  const getNodeValues = useCallback(
    (nodeId: string): Record<string, unknown> => {
      const node = getNodes().find((n) => n.id === nodeId);
      if (!node) return {};
      return (node.data as FlowNodeData).values || {};
    },
    [getNodes]
  );

  return {
    updateNodeInputValue,
    getNodeValues,
  };
}

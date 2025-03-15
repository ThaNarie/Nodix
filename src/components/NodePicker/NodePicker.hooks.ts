import { CatalogNodeData, nodeCategories } from '../../nodes/nodeCatalog';
import { useState, useMemo, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useNodeStore } from '../../store/useNodeStore';
import type { DataType } from '../nodes/FlowNode/FlowNode';

/**
 * Hook for calculating safe node picker positioning that ensures
 * the picker stays within the viewport boundaries
 */
export function useNodePickerPosition(
  position: { x: number; y: number } | null,
) {
  // Constants for the NodePicker dimensions
  const pickerWidth = 512; // w-128 is 32rem = 512px
  const pickerHeight = 400; // maxHeight: '400px'
  const offsetX = 32;
  const offsetY = 40;
  const padding = 16; // padding from viewport edges

  const safePosition = useMemo(() => {
    if (!position) return null;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Initial position
    let left = position.x - offsetX;
    let top = position.y - offsetY;

    // Ensure left edge stays within viewport
    left = Math.max(padding, left);

    // Ensure right edge stays within viewport
    if (left + pickerWidth > viewportWidth - padding) {
      left = viewportWidth - pickerWidth - padding;
    }

    // Ensure top edge stays within viewport
    top = Math.max(padding, top);

    // Ensure bottom edge stays within viewport
    if (top + pickerHeight > viewportHeight - padding) {
      top = viewportHeight - pickerHeight - padding;
    }

    return { left, top };
  }, [position]);

  const style = useMemo(() => {
    if (!safePosition) return null;

    return {
      position: 'absolute' as const,
      left: `${safePosition.left}px`,
      top: `${safePosition.top}px`,
      zIndex: 9999,
      maxHeight: '400px',
      transformOrigin: 'top',
    };
  }, [safePosition]);

  return { style, isVisible: !!position };
}

type FilterOptions = {
  handleType: 'source' | 'target' | null;
  dataType: DataType | null;
};

/**
 * Hook for filtering and categorizing nodes based on search and connection context
 */
export function useNodeFiltering(nodes: Record<string, CatalogNodeData>) {
  const [search, setSearch] = useState('');
  const { connectionContext } = useNodeStore();

  // Extract filter options from connection context
  const filterOptions = useMemo((): FilterOptions => {
    return {
      handleType: connectionContext.handleType as 'source' | 'target' | null,
      dataType: connectionContext.dataType,
    };
  }, [connectionContext]);

  const { nodesByCategory, filteredNodes } = useMemo(() => {
    // Filter nodes based on search and connection compatibility
    const filtered = Object.entries(nodes)
      .filter(([nodeType, node]) => {
        // Apply text search filter
        const isMatchingSearch =
          !search.trim() ||
          nodeType.toLowerCase().includes(search.toLowerCase().trim()) ||
          node.nodeData.title
            .toLowerCase()
            .includes(search.toLowerCase().trim()) ||
          node.nodeData.description
            ?.toLowerCase()
            .includes(search.toLowerCase().trim()) ||
          false ||
          nodeCategories
            .find((cat) => cat.id === node.category)
            ?.name.toLowerCase()
            .includes(search.toLowerCase().trim()) ||
          false;

        // If no connection context, only apply text search
        if (!filterOptions.handleType || !filterOptions.dataType) {
          return isMatchingSearch;
        }

        // Apply data type compatibility filtering based on handle type
        if (filterOptions.handleType === 'source') {
          // We're connecting from an output, so we need to filter nodes with compatible inputs
          const hasCompatibleInput = node.nodeData.inputs?.some(
            (input) =>
              input.hasHandle !== false &&
              input.dataType === filterOptions.dataType,
          );
          return isMatchingSearch && hasCompatibleInput;
        } else {
          // We're connecting from an input, so we need to filter nodes with compatible outputs
          const hasCompatibleOutput = node.nodeData.outputs?.some(
            (output) => output.dataType === filterOptions.dataType,
          );
          return isMatchingSearch && hasCompatibleOutput;
        }
      })
      .map(([nodeType, node]) => ({ nodeType, node }));

    // Organize filtered nodes by category
    const byCategory = nodeCategories
      .map((category) => {
        const categoryNodes = filtered.filter(
          ({ node }) => node.category === category.id,
        );

        return {
          category,
          nodes: categoryNodes,
        };
      })
      .filter((category) => category.nodes.length > 0);

    return {
      filteredNodes: filtered,
      nodesByCategory: byCategory,
    };
  }, [nodes, search, filterOptions]);

  return {
    search,
    setSearch,
    nodesByCategory,
    filteredNodes,
    hasResults: nodesByCategory.length > 0,
    filterOptions,
  };
}

type NodePosition = {
  x: number;
  y: number;
};

export function useNodePicker() {
  const reactFlowInstance = useReactFlow();
  const {
    handleNodeSelection: storeHandleNodeSelection,
    nodePickerPosition,
    closeNodePicker,
    connectionContext,
  } = useNodeStore();

  // Handle node selection from the NodePicker with coordinate conversion
  const handleNodeSelection = useCallback(
    (nodeType: string, position: NodePosition) => {
      // Convert the screen coordinates to flow coordinates
      const flowPosition = reactFlowInstance.screenToFlowPosition(position);
      storeHandleNodeSelection(nodeType, flowPosition);
    },
    [reactFlowInstance, storeHandleNodeSelection],
  );

  return {
    handleNodeSelection,
    nodePickerPosition,
    closeNodePicker,
    connectionContext,
  };
}

import { useState, useMemo } from 'react';
import { CatalogNodeData, nodeCategories } from '../../nodes/nodeCatalog';

/**
 * Hook for calculating safe node picker positioning that ensures
 * the picker stays within the viewport boundaries
 */
function useNodePickerPosition(position: { x: number; y: number } | null) {
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

/**
 * Hook for filtering and categorizing nodes based on search
 */
function useNodeFiltering(nodes: Record<string, CatalogNodeData>) {
  const [search, setSearch] = useState('');

  const { nodesByCategory, filteredNodes } = useMemo(() => {
    // Filter nodes based on search
    const filtered = Object.entries(nodes)
      .filter(([nodeType, node]) => {
        // Always include all nodes when search is empty
        if (!search.trim()) return true;

        const searchLower = search.toLowerCase().trim();
        const typeMatch = nodeType.toLowerCase().includes(searchLower);
        const titleMatch = node.nodeData.title
          .toLowerCase()
          .includes(searchLower);
        const descMatch =
          node.nodeData.description?.toLowerCase().includes(searchLower) || false;
        const categoryMatch =
          nodeCategories
            .find((cat) => cat.id === node.category)
            ?.name.toLowerCase()
            .includes(searchLower) || false;

        return typeMatch || titleMatch || descMatch || categoryMatch;
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
  }, [nodes, search]);

  return {
    search,
    setSearch,
    nodesByCategory,
    filteredNodes,
    hasResults: nodesByCategory.length > 0,
  };
}

export { useNodePickerPosition, useNodeFiltering };

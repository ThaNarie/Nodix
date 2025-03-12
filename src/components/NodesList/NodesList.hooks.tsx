import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { CatalogNodeData, nodeCategories } from '../../nodes/nodeCatalog';

export function useNodeInteractions(
  onNodeAdd: (nodeType: string, position?: { x: number; y: number }) => void,
) {
  const handleNodeClick = useCallback(
    (nodeType: string) => {
      onNodeAdd(nodeType);
    },
    [onNodeAdd],
  );

  const handleDragStart = useCallback(
    (event: React.DragEvent, nodeType: string, element: HTMLDivElement) => {
      // Store the node type in the drag data transfer object
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';

      // Create a clone of the element to use as a drag preview
      const dragPreview = element.cloneNode(true) as HTMLDivElement;
      dragPreview.classList.add(
        'shadow-lg',
        'border',
        'border-zinc-700',
        'absolute',
        'pointer-events-none',
      );
      document.body.appendChild(dragPreview);

      // Set the drag image with an offset to center it on the cursor
      try {
        event.dataTransfer.setDragImage(dragPreview, 0, 0);

        // Remove the element after a short delay
        setTimeout(() => {
          document.body.removeChild(dragPreview);
        }, 0);
      } catch (error) {
        console.error('Error setting drag image:', error);
        // Remove the element if there was an error
        if (document.body.contains(dragPreview)) {
          document.body.removeChild(dragPreview);
        }
      }
    },
    [],
  );

  return {
    handleNodeClick,
    handleDragStart,
  };
}

export function useNodeSearch(nodes: Record<string, CatalogNodeData>) {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useCallback((inputElement: HTMLInputElement | null) => {
    if (inputElement) {
      // Store the ref in a variable that persists between renders
      searchInputRef.current = inputElement;
    }
  }, []);

  // Use a ref to keep track of the search input element
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [],
  );

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if we're not already focused on an input
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter nodes based on search term
  const filteredNodes = useMemo(() => {
    if (searchTerm.trim() === '') return nodes;

    const searchLower = searchTerm.toLowerCase();
    return Object.fromEntries(
      Object.entries(nodes).filter(
        ([nodeType, node]) =>
          nodeType.toLowerCase().includes(searchLower) ||
          node.nodeData.title.toLowerCase().includes(searchLower) ||
          node.nodeData.description?.toLowerCase().includes(searchLower) ||
          false,
      ),
    );
  }, [nodes, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    onSearchChange,
    filteredNodes,
    inputRef,
  };
}

export function useCategoryGrouping(nodes: Record<string, CatalogNodeData>) {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(
    nodeCategories.reduce(
      (acc, category) => ({ ...acc, [category.id]: true }),
      {},
    ),
  );

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }, []);

  // Organize nodes by category
  const nodesByCategory = useMemo(
    () =>
      nodeCategories
        .map((category) => {
          const categoryNodes = Object.entries(nodes)
            .filter(([, node]) => node.category === category.id)
            .map(([nodeType, node]) => ({ nodeType, node }));

          return {
            category,
            nodes: categoryNodes,
          };
        })
        .filter((category) => category.nodes.length > 0),
    [nodes],
  );

  return {
    expandedCategories,
    toggleCategory,
    nodesByCategory,
  };
}

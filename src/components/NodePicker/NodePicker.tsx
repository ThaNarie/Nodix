import { useState, useCallback } from 'react';
import {
  Command,
  CommandInput,
  CommandGroup,
  CommandList,
  CommandEmpty,
  CommandItem,
} from '../ui/command';
import { CatalogNodeData, nodeCategories } from '../../nodes/nodeCatalog';
import { NodePickerItem } from './NodePickerItem';

type NodePickerProps = {
  nodes: Record<string, CatalogNodeData>;
  position: { x: number; y: number } | null;
  connectionNodeId: string | null;
  onSelectNode: (nodeType: string, position: { x: number; y: number }) => void;
  onClose: () => void;
};

function NodePicker({
  nodes,
  position,
  // TODO; use for filtering
  //connectionNodeId,
  onSelectNode,
  onClose,
}: NodePickerProps) {
  const [search, setSearch] = useState('');

  const handleNodeSelect = useCallback(
    (nodeType: string) => {
      if (position) {
        onSelectNode(nodeType, position);
        onClose();
      }
    },
    [position, onSelectNode, onClose],
  );

  // Filter nodes based on search
  const filteredNodes = Object.entries(nodes)
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
  const nodesByCategory = nodeCategories
    .map((category) => {
      const categoryNodes = filteredNodes.filter(
        ({ node }) => node.category === category.id,
      );

      return {
        category,
        nodes: categoryNodes,
      };
    })
    .filter((category) => category.nodes.length > 0);

  if (!position) return null;

  // Position the picker near where the edge was dropped
  // Anchor from the top-left with a slight offset
  const style = {
    position: 'absolute' as const,
    left: `${position.x - 32}px`, // Offset by half the width to the left
    top: `${position.y - 40}px`, // Offset up to show below the cursor
    zIndex: 9999, // Very high z-index to ensure it's above everything
    maxHeight: '400px',
    transformOrigin: 'top', // Ensure it transforms from the top
  };

  return (
    <div
      className="fixed inset-0 bg-black/50" // Increased opacity for better visibility
      style={{ zIndex: 9000 }} // Ensure the backdrop is also above react-flow elements
      onClick={onClose}
    >
      <div
        style={style}
        className="border-1 border-white/20 rounded-md shadow-xl overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-50 duration-75 w-128 origin-top"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="border-none w-full" style={{ width: '100%' }}>
          <CommandInput
            placeholder="Search nodes..."
            value={search}
            onValueChange={setSearch}
            className="h-9"
            autoFocus
          />
          <CommandList
            className="overflow-auto max-h-[320px] w-full"
            style={{ width: '100%' }}
          >
            <CommandEmpty>No nodes found.</CommandEmpty>
            {nodesByCategory.map(({ category, nodes }) => (
              <CommandGroup
                key={category.id}
                heading={category.name}
                className="w-full px-1"
              >
                <div className="space-y-1.5 w-full">
                  {nodes.map(({ nodeType, node }) => (
                    <CommandItem
                      key={nodeType}
                      value={nodeType}
                      onSelect={() => handleNodeSelect(nodeType)}
                      className="p-0 w-full"
                      style={{ width: '100%' }}
                    >
                      <div className="w-full" style={{ width: '100%' }}>
                        <NodePickerItem nodeType={nodeType} node={node} />
                      </div>
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </div>
    </div>
  );
}

export { NodePicker };

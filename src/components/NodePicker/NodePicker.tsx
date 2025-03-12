import { useCallback } from 'react';
import {
  Command,
  CommandInput,
  CommandGroup,
  CommandList,
  CommandEmpty,
  CommandItem,
} from '../ui/command';
import { CatalogNodeData } from '../../nodes/nodeCatalog';
import { NodePickerItem } from './NodePickerItem';
import { useNodePickerPosition, useNodeFiltering } from './NodePicker.hooks';

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
  // Use custom hooks for positioning and filtering
  const { style, isVisible } = useNodePickerPosition(position);
  const { search, setSearch, nodesByCategory } = useNodeFiltering(nodes);

  const handleNodeSelect = useCallback(
    (nodeType: string) => {
      if (position) {
        onSelectNode(nodeType, position);
        onClose();
      }
    },
    [position, onSelectNode, onClose],
  );

  if (!isVisible || !style) return null;

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

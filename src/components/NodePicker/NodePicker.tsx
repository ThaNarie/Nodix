import { useCallback, useEffect } from 'react';
import {
  Command,
  CommandInput,
  CommandGroup,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandDialog,
} from '../ui/command';
import { nodeCatalog } from '../../nodes/nodeCatalog';
import { NodePickerItem } from './NodePickerItem';
import {
  useNodePickerPosition,
  useNodeFiltering,
  useNodePicker,
} from './NodePicker.hooks';

function NodePicker() {
  const {
    nodePickerPosition: position,
    handleNodeSelection,
    closeNodePicker,
  } = useNodePicker();

  // Use custom hooks for positioning and filtering
  const { style, isVisible } = useNodePickerPosition(position);
  const { search, setSearch, nodesByCategory } = useNodeFiltering(nodeCatalog);

  const handleNodeSelect = useCallback(
    (nodeType: string) => {
      if (position) {
        handleNodeSelection(nodeType, position);
        closeNodePicker();
      }
    },
    [position, handleNodeSelection, closeNodePicker],
  );

  // Close node picker on escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        closeNodePicker();
      }
    },
    [closeNodePicker, isVisible],
  );

  // Add event listener for escape key
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isVisible, handleKeyDown]);

  if (!isVisible || !style) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50" // Increased opacity for better visibility
      style={{ zIndex: 9000 }} // Ensure the backdrop is also above react-flow elements
      onClick={closeNodePicker}
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

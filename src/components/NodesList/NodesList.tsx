import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { CatalogNodeData } from '../../nodes/nodeCatalog';
import { NodeListItem } from './NodeListItem';
import {
  useNodeInteractions,
  useCategoryGrouping,
  useNodeSearch,
} from './NodesList.hooks';
import { Input } from '@/components/ui/input';
import { useAddNode } from '../../hooks/useAddNode';

type NodesListProps = {
  nodes: Record<string, CatalogNodeData>;
};

function NodesList({ nodes }: NodesListProps) {
  const { handleDragStart } = useNodeInteractions();
  const { searchTerm, onSearchChange, filteredNodes, inputRef } =
    useNodeSearch(nodes);

  // Group filtered nodes by category
  const { expandedCategories, toggleCategory, nodesByCategory } =
    useCategoryGrouping(filteredNodes);

  const { handleAddNode } = useAddNode();

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 mt-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={onSearchChange}
          startContent={<Search className="h-4 w-4 text-white/50" />}
          endContent={
            <kbd className="text-xs text-white/50 bg-zinc-800 rounded py-0.5 px-1">
              /
            </kbd>
          }
          className="bg-zinc-900 border-zinc-700 focus-within:border-zinc-700 shadow-none"
        />
      </div>

      <div className="py-1 px-2 flex flex-col gap-1.5 overflow-y-auto flex-1">
        {nodesByCategory.length > 0 ? (
          nodesByCategory.map(({ category, nodes }) => (
            <div key={category.id} className="flex flex-col gap-1.5">
              <div
                className="flex items-center gap-1 p-2 rounded cursor-pointer hover:bg-zinc-800 transition-colors"
                onClick={() => toggleCategory(category.id)}
              >
                {expandedCategories[category.id] ? (
                  <ChevronDown className="h-4 w-4 text-white/70" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-white/70" />
                )}
                <span className="font-medium">{category.name}</span>
                <span className="text-xs text-white/50 ml-auto pr-1">
                  {nodes.length}
                </span>
              </div>

              {expandedCategories[category.id] && (
                <div className="flex flex-col gap-1.5">
                  {nodes.map(({ nodeType, node }) => (
                    <NodeListItem
                      key={nodeType}
                      nodeType={nodeType}
                      node={node}
                      onClick={handleAddNode}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="text-zinc-400 mb-2">No matching nodes found</div>
            <div className="text-zinc-500 text-sm max-w-60">
              Try adjusting your search term or clearing the search to see all
              nodes
            </div>
            {searchTerm && (
              <button
                onClick={() =>
                  onSearchChange({
                    target: { value: '' },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                className="mt-4 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { NodesList };

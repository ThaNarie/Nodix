import { ChevronDown, ChevronRight } from 'lucide-react';
import { CatalogNodeData } from '../../nodes/nodeCatalog';
import { NodeListItem } from './NodeListItem';
import { useNodeInteractions, useCategoryGrouping } from './NodesList.hooks';

type NodesListProps = {
  nodes: Record<string, CatalogNodeData>;
  onNodeAdd: (nodeType: string, position?: { x: number; y: number }) => void;
};

function NodesList({ nodes, onNodeAdd }: NodesListProps) {
  const { handleNodeClick, handleDragStart } = useNodeInteractions(onNodeAdd);
  const { expandedCategories, toggleCategory, nodesByCategory } = useCategoryGrouping(nodes);

  return (
    <div className="py-1 px-2 flex flex-col gap-1.5 overflow-y-auto">
      {nodesByCategory.map(({ category, nodes }) => (
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
                  onClick={handleNodeClick}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export { NodesList };

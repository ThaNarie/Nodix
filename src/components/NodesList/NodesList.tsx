import { useCallback, useState } from 'react';
import { type FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CatalogNodeData, NodeCategory, nodeCategories } from '../../nodes/nodeCatalog';

type NodesListProps = {
  nodes: Record<string, CatalogNodeData>;
  onNodeAdd: (nodeType: string) => void;
};

function NodesList({ nodes, onNodeAdd }: NodesListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    nodeCategories.reduce((acc, category) => ({ ...acc, [category.id]: true }), {})
  );

  const handleNodeClick = useCallback(
    (nodeType: string) => {
      onNodeAdd(nodeType);
    },
    [onNodeAdd]
  );

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  // Organize nodes by category
  const nodesByCategory = nodeCategories.map(category => {
    const categoryNodes = Object.entries(nodes)
      .filter(([_, node]) => node.category === category.id)
      .map(([nodeType, node]) => ({ nodeType, node }));
    
    return {
      category,
      nodes: categoryNodes
    };
  }).filter(category => category.nodes.length > 0);

  return (
    <div className="h-full w-64 bg-zinc-900 border-r border-white/10 overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Available Nodes</h2>
        <p className="text-xs text-white/70">Click on a node to add it to the canvas</p>
      </div>
      <div className="flex-1 py-1 px-2 space-y-1 overflow-y-auto">
        {nodesByCategory.map(({ category, nodes }) => (
          <div key={category.id} className="mb-2">
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
              <span className="text-xs text-white/50 ml-auto pr-1">{nodes.length}</span>
            </div>
            
            {expandedCategories[category.id] && (
              <div className="mt-1 space-y-1.5">
                {nodes.map(({ nodeType, node }) => (
                  <div 
                    key={nodeType}
                    className="p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors"
                    onClick={() => handleNodeClick(nodeType)}
                  >
                    <div className="flex items-center gap-2">
                      {node.nodeData.icon && (
                        <div className={cn("min-w-6 min-h-6 w-6 h-6 flex items-center justify-center rounded", node.nodeData.iconColorClass || "bg-blue-500")}>
                          <div className="w-4 h-4">
                            {node.nodeData.icon}
                          </div>
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="font-medium truncate">{node.nodeData.title}</div>
                        {node.nodeData.description && (
                          <div className="text-xs text-white/70 line-clamp-1">{node.nodeData.description}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-white/10">
        <Button 
          className="w-full"
          onClick={() => window.location.reload()}
        >
          Reset Canvas
        </Button>
      </div>
    </div>
  );
}

export { NodesList };

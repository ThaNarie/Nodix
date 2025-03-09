import { useCallback, useState, useRef } from 'react';
import { type FlowNodeData } from '../../components/nodes/FlowNode/FlowNode';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  CatalogNodeData,
  NodeCategory,
  nodeCategories,
} from '../../nodes/nodeCatalog';
import { NodeListItem } from './NodeListItem';

type NodesListProps = {
  nodes: Record<string, CatalogNodeData>;
  onNodeAdd: (nodeType: string, position?: { x: number; y: number }) => void;
};

function NodesList({ nodes, onNodeAdd }: NodesListProps) {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(
    nodeCategories.reduce(
      (acc, category) => ({ ...acc, [category.id]: true }),
      {},
    ),
  );

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

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }, []);

  // Organize nodes by category
  const nodesByCategory = nodeCategories
    .map((category) => {
      const categoryNodes = Object.entries(nodes)
        .filter(([, node]) => node.category === category.id)
        .map(([nodeType, node]) => ({ nodeType, node }));

      return {
        category,
        nodes: categoryNodes,
      };
    })
    .filter((category) => category.nodes.length > 0);

  return (
    <div className="h-full w-64 bg-zinc-900 border-r border-white/10 overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Available Nodes</h2>
        <p className="text-xs text-white/70">
          Click on a node to add it to the canvas
        </p>
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
              <span className="text-xs text-white/50 ml-auto pr-1">
                {nodes.length}
              </span>
            </div>

            {expandedCategories[category.id] && (
              <div className="mt-1 space-y-1.5">
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
      <div className="p-3 border-t border-white/10">
        <Button className="w-full" onClick={() => window.location.reload()}>
          Reset Canvas
        </Button>
      </div>
    </div>
  );
}

export { NodesList };

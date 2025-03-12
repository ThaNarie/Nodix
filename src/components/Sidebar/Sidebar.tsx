import { useCallback } from 'react';
import { Button } from '../ui/button';
import { CatalogNodeData } from '../../nodes/nodeCatalog';
import { NodesList } from '../NodesList/NodesList';

type SidebarProps = {
  nodes: Record<string, CatalogNodeData>;
  onNodeAdd: (nodeType: string, position?: { x: number; y: number }) => void;
};

function Sidebar({ nodes, onNodeAdd }: SidebarProps) {
  const handleNodeAdd = useCallback(
    (nodeType: string, position?: { x: number; y: number }) => {
      onNodeAdd(nodeType, position);
    },
    [onNodeAdd],
  );

  return (
    <div className="h-full w-64 bg-zinc-900 border-r border-white/10 overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Available Nodes</h2>
        <p className="text-xs text-white/70">
          Click on a node to add it to the canvas
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <NodesList nodes={nodes} onNodeAdd={handleNodeAdd} />
      </div>
      
      <div className="p-3 border-t border-white/10">
        <Button className="w-full" onClick={() => window.location.reload()}>
          Reset Canvas
        </Button>
      </div>
    </div>
  );
}

export { Sidebar };

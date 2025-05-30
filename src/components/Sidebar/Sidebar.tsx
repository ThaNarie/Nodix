import { Button } from '../ui/button';
import { CatalogNodeData } from '../../nodes/nodeCatalog';
import { NodesList } from '../NodesList/NodesList';
import { NodixLogo } from '../icons/Nodix';

type SidebarProps = {
  nodes: Record<string, CatalogNodeData>;
};

function Sidebar({ nodes }: SidebarProps) {
  return (
    <div className="h-full w-72 p-1 bg-zinc-900 border-r border-white/10 overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <NodixLogo className="size-7 text-primary" />
          <h1 className="text-xl font-bold">Nodix</h1>
        </div>
        <h2 className=" font-semibold">Available Nodes</h2>
        <p className="text-xs text-white/70">
          Click on a node to add it to the canvas
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <NodesList nodes={nodes} />
      </div>

      <div className="p-3 pt-4 border-t border-white/10">
        <Button className="w-full" onClick={() => window.location.reload()}>
          Reset Canvas
        </Button>
      </div>
    </div>
  );
}

export { Sidebar };

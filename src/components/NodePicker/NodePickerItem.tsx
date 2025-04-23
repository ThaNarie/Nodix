import { memo } from 'react';
import { cn } from '../../lib/utils';
import { CatalogNodeData } from '../../nodes/nodeCatalog';

type NodePickerItemProps = {
  nodeType: string;
  node: CatalogNodeData;
};

function NodePickerItemNaive({ node }: NodePickerItemProps) {
  return (
    <div className="p-2 rounded-md cursor-pointer transition-colors w-full block">
      <div className="flex items-center gap-2 w-full min-w-0">
        {node.nodeData.icon && (
          <div
            className={cn(
              'min-w-6 min-h-6 w-6 h-6 flex items-center justify-center rounded shrink-0',
              node.nodeData.iconColorClass || 'bg-blue-500',
            )}
          >
            <div className="w-4 h-4">{node.nodeData.icon}</div>
          </div>
        )}
        <div className="overflow-hidden flex-1">
          <div className="font-medium truncate">{node.nodeData.title}</div>
          {node.nodeData.description && (
            <div className="text-xs text-white/70 line-clamp-1">
              {node.nodeData.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const NodePickerItem = memo(NodePickerItemNaive);

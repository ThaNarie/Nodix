import { useRef, memo } from 'react';
import { cn } from '../../lib/utils';
import { CatalogNodeData } from '../../nodes/nodeCatalog';

type NodeListItemProps = {
  nodeType: string;
  node: CatalogNodeData;
  onClick: (nodeType: string) => void;
  onDragStart: (
    event: React.DragEvent,
    nodeType: string,
    element: HTMLDivElement,
  ) => void;
};

function NodeListItemNaive({
  nodeType,
  node,
  onClick,
  onDragStart,
}: NodeListItemProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={nodeRef}
      className="p-2 rounded-md bg-zinc-800/70 hover:bg-zinc-700/70 cursor-pointer transition-colors"
      onClick={() => onClick(nodeType)}
      draggable
      onDragStart={(e) => {
        if (nodeRef.current) {
          onDragStart(e, nodeType, nodeRef.current);
        }
      }}
    >
      <div className="flex items-center gap-2">
        {node.nodeData.icon && (
          <div
            className={cn(
              'min-w-6 min-h-6 size-6 flex items-center justify-center rounded',
              node.nodeData.iconColorClass || 'bg-blue-500',
            )}
          >
            <div className="size-4">{node.nodeData.icon}</div>
          </div>
        )}
        <div className="overflow-hidden">
          <div className=" text-sm truncate text-white/80">
            {node.nodeData.title}
          </div>
          {node.nodeData.description && (
            <div className="text-xs text-white/50 line-clamp-1">
              {node.nodeData.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const NodeListItem = memo(NodeListItemNaive);

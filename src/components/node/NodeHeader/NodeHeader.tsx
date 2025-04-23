import { useCallback, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';

type NodeHeaderProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  iconColorClass?: string;
  className?: string;
  onTitleClick?: () => void;
};

function NodeHeader({
  title,
  description,
  icon,
  iconColorClass,
  className,
  onTitleClick,
}: NodeHeaderProps) {
  const handleTitleClick = useCallback(() => {
    onTitleClick?.();
  }, [onTitleClick]);

  return (
    <div
      className={cn(
        'p-4 flex flex-col gap-3 border-b border-white/10',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'w-8 h-8 p-1.5 rounded-sm flex-shrink-0 bg-muted',
            iconColorClass,
          )}
        >
          {icon ?? <ArrowUpDown width="100%" height="100%" />}
        </div>
        <h3
          className="m-0 text-sm font-medium cursor-pointer"
          onClick={handleTitleClick}
        >
          {title}
        </h3>
      </div>
      {description && (
        <p className="my-0 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export default NodeHeader;

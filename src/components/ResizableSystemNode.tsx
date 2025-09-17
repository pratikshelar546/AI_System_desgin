import { memo, useState, useRef, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  Monitor, 
  Shield, 
  Server, 
  Database, 
  Zap, 
  MessageSquare, 
  HardDrive, 
  Globe,
  Scale,
  Activity,
  Lock,
  BarChart3
} from 'lucide-react';
import { SystemNodeData } from '@/types/diagram';

const nodeIcons = {
  client: Monitor,
  gateway: Shield,
  service: Server,
  database: Database,
  cache: Zap,
  queue: MessageSquare,
  storage: HardDrive,
  cdn: Globe,
  loadbalancer: Scale,
  monitor: Activity,
  security: Lock,
  analytics: BarChart3,
};

const nodeColors = {
  client: 'node-client',
  gateway: 'node-gateway', 
  service: 'node-service',
  database: 'node-database',
  cache: 'node-cache',
  queue: 'node-queue',
  storage: 'node-storage',
  cdn: 'node-cdn',
  loadbalancer: 'node-loadbalancer',
  monitor: 'node-monitor',
  security: 'node-security',
  analytics: 'node-analytics',
};

export default memo(({ data, selected }: NodeProps<SystemNodeData>) => {
  const Icon = nodeIcons[data.type];
  const colorClass = nodeColors[data.type];
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: data.width || 180,
    height: data.height || 120
  });

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(140, startWidth + (e.clientX - startX));
      const newHeight = Math.max(100, startHeight + (e.clientY - startY));
      
      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [dimensions]);

  return (
    <div 
      ref={nodeRef}
      className={`
        relative rounded-xl border-2 transition-all duration-300 group
        ${selected 
          ? 'border-primary shadow-glow scale-105 ring-1 ring-primary/50' 
          : 'border-border shadow-node hover:shadow-glow hover:border-primary/50'
        }
        ${isResizing ? 'cursor-se-resize' : ''}
      `}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
        minWidth: 140,
        minHeight: 100
      }}
    >
      {/* Corner Handles */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-left"
        style={{ left: '15%', top: '0' }}
        className="w-2 h-2 !bg-primary border border-background opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-right"
        style={{ left: '85%', top: '0' }}
        className="w-2 h-2 !bg-primary border border-background opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-left"
        style={{ left: '15%', bottom: '0' }}
        className="w-2 h-2 !bg-primary border border-background opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-right"
        style={{ left: '85%', bottom: '0' }}
        className="w-2 h-2 !bg-primary border border-background opacity-0 group-hover:opacity-100 transition-opacity"
      />

      {/* Traditional Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-muted-foreground border-2 border-background hover:!bg-primary transition-colors"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-muted-foreground border-2 border-background hover:!bg-primary transition-colors"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-muted-foreground border-2 border-background hover:!bg-primary transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-muted-foreground border-2 border-background hover:!bg-primary transition-colors"
      />

      {/* Node Content */}
      <div className="bg-gradient-node h-full rounded-xl overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl bg-${colorClass} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-foreground truncate">{data.name}</h4>
              <p className="text-xs text-muted-foreground capitalize">{data.type}</p>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {data.notes && (
              <div className="bg-muted/20 rounded-lg p-2 border border-border/30">
                <p className="text-xs text-muted-foreground line-clamp-3">{data.notes}</p>
              </div>
            )}
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
            
            {/* Resize Handle */}
            <div 
              className="w-3 h-3 cursor-se-resize opacity-30 hover:opacity-100 transition-opacity bg-muted-foreground rounded-sm"
              onMouseDown={handleResizeStart}
              style={{
                background: 'linear-gradient(-45deg, transparent 30%, currentColor 30%, currentColor 70%, transparent 70%)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
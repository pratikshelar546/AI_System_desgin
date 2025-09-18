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
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.name);
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

  const handleNameEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(data.name);
  }, [data.name]);

  const handleNameSave = useCallback(() => {
    setIsEditing(false);
    // You'll need to pass updateNode function as prop to update the node
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(data.name);
    }
  }, [handleNameSave, data.name]);

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
      {/* Corner Connection Points */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-left"
        style={{ left: '20%', top: '-2px' }}
        className="w-3 h-3 !bg-primary/80 border-2 border-background rounded-full hover:!bg-primary hover:scale-110 transition-all duration-200 shadow-sm"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-right" 
        style={{ left: '80%', top: '-2px' }}
        className="w-3 h-3 !bg-primary/80 border-2 border-background rounded-full hover:!bg-primary hover:scale-110 transition-all duration-200 shadow-sm"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-left"
        style={{ left: '20%', bottom: '-2px' }}
        className="w-3 h-3 !bg-primary/80 border-2 border-background rounded-full hover:!bg-primary hover:scale-110 transition-all duration-200 shadow-sm"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-right"
        style={{ left: '80%', bottom: '-2px' }}
        className="w-3 h-3 !bg-primary/80 border-2 border-background rounded-full hover:!bg-primary hover:scale-110 transition-all duration-200 shadow-sm"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-top"
        style={{ left: '-2px', top: '30%' }}
        className="w-3 h-3 !bg-primary/80 border-2 border-background rounded-full hover:!bg-primary hover:scale-110 transition-all duration-200 shadow-sm"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-bottom"
        style={{ left: '-2px', top: '70%' }}
        className="w-3 h-3 !bg-primary/80 border-2 border-background rounded-full hover:!bg-primary hover:scale-110 transition-all duration-200 shadow-sm"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-top"
        style={{ right: '-2px', top: '30%' }}
        className="w-3 h-3 !bg-primary/80 border-2 border-background rounded-full hover:!bg-primary hover:scale-110 transition-all duration-200 shadow-sm"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-bottom"
        style={{ right: '-2px', top: '70%' }}
        className="w-3 h-3 !bg-primary/80 border-2 border-background rounded-full hover:!bg-primary hover:scale-110 transition-all duration-200 shadow-sm"
      />

      {/* Main Connection Points */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ top: '-4px' }}
        className="w-4 h-4 !bg-success border-2 border-background rounded-full hover:!bg-success/80 hover:scale-125 transition-all duration-200 shadow-md"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ bottom: '-4px' }}
        className="w-4 h-4 !bg-warning border-2 border-background rounded-full hover:!bg-warning/80 hover:scale-125 transition-all duration-200 shadow-md"
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ left: '-4px' }}
        className="w-4 h-4 !bg-success border-2 border-background rounded-full hover:!bg-success/80 hover:scale-125 transition-all duration-200 shadow-md"
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ right: '-4px' }}
        className="w-4 h-4 !bg-warning border-2 border-background rounded-full hover:!bg-warning/80 hover:scale-125 transition-all duration-200 shadow-md"
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
              {isEditing ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={handleKeyPress}
                  className="font-semibold text-sm text-foreground bg-transparent border-none outline-none focus:ring-1 focus:ring-primary rounded px-1 w-full"
                  autoFocus
                />
              ) : (
                <h4 
                  className="font-semibold text-sm text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                  onClick={handleNameEdit}
                  title="Click to edit"
                >
                  {data.name}
                </h4>
              )}
              <p className="text-xs text-muted-foreground capitalize">{data.type}</p>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {data.notes && (
              <div className="bg-muted/10 rounded-md p-2 mt-2">
                <p className="text-xs text-muted-foreground line-clamp-2">{data.notes}</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
            
            {/* Resize Handle */}
            <div 
              className="w-3 h-3 cursor-se-resize opacity-40 hover:opacity-100 transition-opacity"
              onMouseDown={handleResizeStart}
              style={{
                background: 'linear-gradient(-45deg, transparent 30%, hsl(var(--muted-foreground)) 30%, hsl(var(--muted-foreground)) 70%, transparent 70%)',
                borderRadius: '2px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
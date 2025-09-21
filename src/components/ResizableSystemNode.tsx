import { memo, useState, useRef, useCallback, useEffect } from 'react';
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
  BarChart3,
  Circle,
  Cloud,
  Cpu,
  Layers,
  Network,
  Router,
  Settings
} from 'lucide-react';
import { SystemNodeData } from '@/types/diagram';

const nodeIcons = {
  // Frontend
  client: Monitor,
  frontend: Monitor,
  web: Monitor,
  mobile: Monitor,
  ui: Monitor,
  
  // Infrastructure
  cdn: Globe,
  static: Globe,
  assets: Globe,
  loadbalancer: Scale,
  lb: Scale,
  infrastructure: Cpu,
  proxy: Router,
  
  // API Layer
  gateway: Shield,
  apigateway: Shield,
  router: Router,
  ingress: Router,
  
  // Security/Middleware
  security: Lock,
  middleware: Layers,
  auth: Lock,
  mesh: Network,
  
  // Business Services
  service: Server,
  microservice: Server,
  backend: Server,
  
  // Data Access
  cache: Zap,
  redis: Zap,
  memcache: Zap,
  queue: MessageSquare,
  kafka: MessageSquare,
  rabbitmq: MessageSquare,
  messaging: MessageSquare,
  
  // Data Layer
  database: Database,
  db: Database,
  postgres: Database,
  mysql: Database,
  mongodb: Database,
  nosql: Database,
  storage: HardDrive,
  
  // Analytics/Monitoring
  analytics: BarChart3,
  monitoring: Activity,
  logs: Activity,
  metrics: BarChart3,
  
  // Real-time
  websocket: Cloud,
  realtime: Cloud,
  streaming: Cloud,
  
  // Fallback
  default: Circle
};

const nodeColors = {
  // Frontend
  client: 'node-client',
  frontend: 'node-client',
  web: 'node-client',
  mobile: 'node-client',
  ui: 'node-client',
  
  // Infrastructure
  cdn: 'node-cdn',
  static: 'node-cdn',
  assets: 'node-cdn',
  loadbalancer: 'node-loadbalancer',
  lb: 'node-loadbalancer',
  infrastructure: 'node-loadbalancer',
  proxy: 'node-loadbalancer',
  
  // API Layer
  gateway: 'node-gateway',
  apigateway: 'node-gateway',
  router: 'node-gateway',
  ingress: 'node-gateway',
  
  // Security/Middleware
  security: 'node-security',
  middleware: 'node-security',
  auth: 'node-security',
  mesh: 'node-security',
  
  // Business Services
  service: 'node-service',
  microservice: 'node-service',
  backend: 'node-service',
  
  // Data Access
  cache: 'node-cache',
  redis: 'node-cache',
  memcache: 'node-cache',
  queue: 'node-queue',
  kafka: 'node-queue',
  rabbitmq: 'node-queue',
  messaging: 'node-queue',
  
  // Data Layer
  database: 'node-database',
  db: 'node-database',
  postgres: 'node-database',
  mysql: 'node-database',
  mongodb: 'node-database',
  nosql: 'node-database',
  storage: 'node-storage',
  
  // Analytics/Monitoring
  analytics: 'node-analytics',
  monitoring: 'node-monitor',
  logs: 'node-monitor',
  metrics: 'node-analytics',
  
  // Real-time
  websocket: 'node-monitor',
  realtime: 'node-monitor',
  streaming: 'node-monitor',
  
  // Fallback
  default: 'node-service'
};

interface ResizableSystemNodeProps extends NodeProps<SystemNodeData> {
  updateNode?: (nodeId: string, updates: Partial<SystemNodeData>) => void;
}

export default memo(({ data, selected, id, updateNode }: ResizableSystemNodeProps) => {
  const Icon = nodeIcons[data.type] || nodeIcons.default;
  const colorClass = nodeColors[data.type] || nodeColors.default;
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
      
      // Update node data with new dimensions
      if (updateNode && id) {
        updateNode(id, {
          width: dimensions.width,
          height: dimensions.height
        });
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [dimensions, updateNode, id]);

  const handleNameEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(data.name);
  }, [data.name]);

  const handleNameSave = useCallback(() => {
    setIsEditing(false);
    
    // Update node data with new name if it changed
    if (updateNode && id && editValue !== data.name) {
      updateNode(id, { name: editValue });
    }
  }, [updateNode, id, editValue, data.name]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(data.name);
    }
  }, [handleNameSave, data.name]);

  // Sync dimensions with data changes
  useEffect(() => {
    setDimensions({
      width: data.width || 180,
      height: data.height || 120
    });
  }, [data.width, data.height]);

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
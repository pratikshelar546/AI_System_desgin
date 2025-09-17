import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  Monitor, 
  Shield, 
  Server, 
  Database, 
  Zap, 
  MessageSquare, 
  HardDrive, 
  Globe 
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
};

export default memo(({ data, selected }: NodeProps<SystemNodeData>) => {
  const Icon = nodeIcons[data.type];
  const colorClass = nodeColors[data.type];
  
  return (
    <div className={`
      relative min-w-[140px] rounded-lg border-2 transition-all duration-200
      ${selected 
        ? 'border-primary shadow-lg scale-105' 
        : 'border-border shadow-node hover:shadow-lg'
      }
    `}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-muted-foreground border-2 border-background"
      />
      
      <div className="bg-gradient-node p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-lg bg-${colorClass} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm text-foreground">{data.name}</h4>
            <p className="text-xs text-muted-foreground capitalize">{data.type}</p>
          </div>
        </div>
        
        {data.notes && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{data.notes}</p>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-muted-foreground border-2 border-background"
      />
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-muted-foreground border-2 border-background"
      />
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-muted-foreground border-2 border-background"
      />
    </div>
  );
});
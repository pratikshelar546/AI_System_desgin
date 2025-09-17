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

const nodeTypes = [
  { type: 'client', icon: Monitor, label: 'Client', color: 'node-client' },
  { type: 'gateway', icon: Shield, label: 'API Gateway', color: 'node-gateway' },
  { type: 'service', icon: Server, label: 'Service', color: 'node-service' },
  { type: 'database', icon: Database, label: 'Database', color: 'node-database' },
  { type: 'cache', icon: Zap, label: 'Cache', color: 'node-cache' },
  { type: 'queue', icon: MessageSquare, label: 'Queue', color: 'node-queue' },
  { type: 'storage', icon: HardDrive, label: 'Storage', color: 'node-storage' },
  { type: 'cdn', icon: Globe, label: 'CDN', color: 'node-cdn' },
  { type: 'loadbalancer', icon: Scale, label: 'Load Balancer', color: 'node-loadbalancer' },
  { type: 'monitor', icon: Activity, label: 'Monitoring', color: 'node-monitor' },
  { type: 'security', icon: Lock, label: 'Security', color: 'node-security' },
  { type: 'analytics', icon: BarChart3, label: 'Analytics', color: 'node-analytics' },
];

interface NodeToolbarProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export default function NodeToolbar({ onDragStart }: NodeToolbarProps) {
  return (
    <div className="bg-card border-r border-border w-24 p-3 flex flex-col gap-2 shadow-panel overflow-y-auto">
      <h3 className="text-xs font-medium text-muted-foreground text-center mb-2">
        System Components
      </h3>
      
      {nodeTypes.map(({ type, icon: Icon, label, color }) => (
        <div
          key={type}
          draggable
          onDragStart={(event) => onDragStart(event, type)}
          className="group cursor-grab active:cursor-grabbing"
          title={label}
        >
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border bg-gradient-node hover:bg-gradient-node-glow hover:shadow-glow transition-all duration-300 group-active:scale-95 group-hover:scale-105">
            <div className={`w-10 h-10 rounded-lg bg-${color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300`}>
              <Icon className="w-5 h-5 text-white drop-shadow-sm" />
            </div>
            <span className="text-xs font-medium text-center leading-tight text-foreground">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
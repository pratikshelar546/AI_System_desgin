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

const nodeTypes = [
  { type: 'client', icon: Monitor, label: 'Client', color: 'node-client' },
  { type: 'gateway', icon: Shield, label: 'API Gateway', color: 'node-gateway' },
  { type: 'service', icon: Server, label: 'Service', color: 'node-service' },
  { type: 'database', icon: Database, label: 'Database', color: 'node-database' },
  { type: 'cache', icon: Zap, label: 'Cache', color: 'node-cache' },
  { type: 'queue', icon: MessageSquare, label: 'Queue', color: 'node-queue' },
  { type: 'storage', icon: HardDrive, label: 'Storage', color: 'node-storage' },
  { type: 'cdn', icon: Globe, label: 'CDN', color: 'node-cdn' },
];

interface NodeToolbarProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export default function NodeToolbar({ onDragStart }: NodeToolbarProps) {
  return (
    <div className="bg-card border-r border-border w-20 p-4 flex flex-col gap-3 shadow-panel">
      <h3 className="text-xs font-medium text-muted-foreground text-center mb-2">
        Components
      </h3>
      
      {nodeTypes.map(({ type, icon: Icon, label, color }) => (
        <div
          key={type}
          draggable
          onDragStart={(event) => onDragStart(event, type)}
          className="group cursor-grab active:cursor-grabbing"
          title={label}
        >
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border bg-gradient-node hover:shadow-md transition-all duration-200 group-active:scale-95">
            <div className={`w-8 h-8 rounded-md bg-${color} flex items-center justify-center`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium text-center leading-tight">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
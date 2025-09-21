import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  ReactFlowProvider,
  ReactFlowInstance,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Save, Upload, Download, FileJson, Server, CookingPot } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import NodeToolbar from './NodeToolbar';
import EnhancedPropertiesPanel from './EnhancedPropertiesPanel';
import AIReviewPanel from './AIReviewPanel';
import ResizableSystemNode from './ResizableSystemNode';
import { DiagramData, DiagramNode, DiagramEdge, SystemNodeData, AIReview } from '@/types/diagram';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import AiGeneratorChat from './AiGenrator';

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: { 
    type: MarkerType.ArrowClosed,
    width: 12,
    height: 12,
    color: 'hsl(217 91% 60%)'
  },
  style: { 
    strokeWidth: 2.5, 
    stroke: 'hsl(217 91% 60%)',
  },
  animated: false, // Disable animation for cleaner look
};

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

export default function ArchitectureDiagram() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<SystemNodeData | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [userDesign, setUserDesign] = useState<DiagramData | null>(null);
  const nodeTypes = useMemo(() => ({
    systemNode: (props: any) => <ResizableSystemNode {...props} updateNode={(nodeId: string, updates: Partial<SystemNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        )
      );
    }} />,
  }), [setNodes]);

  // Auto-save to localStorage
  useEffect(() => {
    const diagramData: DiagramData = {
      nodes: nodes as DiagramNode[],
      edges: edges as DiagramEdge[],
      metadata: {
        updatedAt: new Date().toISOString(),
      },
    };
    localStorage.setItem('architecture-diagram', JSON.stringify(diagramData));
  }, [nodes, edges]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('architecture-diagram');
    if (saved) {
      try {
        const data: DiagramData = JSON.parse(saved);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      } catch (error) {
        console.error('Failed to load saved diagram:', error);
      }
    }
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, ...defaultEdgeOptions }, eds));
    },
    [setEdges]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type: 'systemNode',
        position,
        data: {
          id: getId(),
          type: type as SystemNodeData['type'],
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodeId}`,
          notes: '',
          width: 180,
          height: 120,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data as SystemNodeData);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNode = useCallback((nodeId: string, updates: Partial<SystemNodeData>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
  }, [setNodes]);

  const saveDesign = () => {
    const diagramData: DiagramData = {
      nodes: nodes as DiagramNode[],
      edges: edges as DiagramEdge[],
      metadata: {
        name: 'Architecture Design',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    
    const blob = new Blob([JSON.stringify(diagramData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'architecture-design.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Design exported successfully' });
  };

  // Compact layout algorithm that minimizes space and edge overlap
  const calculateNodePositions = (nodes: any[], edges: any[]) => {
    const positions = new Map();
    const nodeWidth = 180;
    const nodeHeight = 120;
    const minSpacing = 30; // Reduced spacing for compact layout
    
    // Define compact zones with tighter spacing
    const zoneMapping = {
      // Frontend zone
      client: { x: 0, y: 0 }, frontend: { x: 0, y: 0 }, web: { x: 0, y: 0 }, mobile: { x: 0, y: 0 }, ui: { x: 0, y: 0 },
      
      // CDN zone (close to frontend)
      cdn: { x: 0.4, y: -0.3 }, static: { x: 0.4, y: -0.3 }, assets: { x: 0.4, y: -0.3 },
      
      // Infrastructure zone
      loadbalancer: { x: 1, y: 0 }, lb: { x: 1, y: 0 }, infrastructure: { x: 1, y: 0 }, proxy: { x: 1, y: 0 },
      
      // Gateway zone
      gateway: { x: 1.6, y: 0 }, apigateway: { x: 1.6, y: 0 }, router: { x: 1.6, y: 0 }, ingress: { x: 1.6, y: 0 },
      
      // Security zone (above services)
      security: { x: 2.2, y: -0.4 }, middleware: { x: 2.2, y: -0.4 }, auth: { x: 2.2, y: -0.4 }, mesh: { x: 2.2, y: -0.4 },
      
      // Services zone (main vertical stack)
      service: { x: 2.2, y: 0 }, microservice: { x: 2.2, y: 0 }, backend: { x: 2.2, y: 0 },
      
      // Cache zone (below services)
      cache: { x: 2.2, y: 0.6 }, redis: { x: 2.2, y: 0.6 }, memcache: { x: 2.2, y: 0.6 },
      
      // Queue zone (right of services)
      queue: { x: 2.8, y: 0.2 }, kafka: { x: 2.8, y: 0.2 }, rabbitmq: { x: 2.8, y: 0.2 }, messaging: { x: 2.8, y: 0.2 },
      
      // Database zone (far right)
      database: { x: 3.4, y: 0 }, db: { x: 3.4, y: 0 }, postgres: { x: 3.4, y: 0 }, mysql: { x: 3.4, y: 0 }, mongodb: { x: 3.4, y: 0 }, nosql: { x: 3.4, y: 0 },
      
      // Analytics zone (bottom right)
      analytics: { x: 3.8, y: 0.5 }, monitoring: { x: 2.5, y: -0.8 }, logs: { x: 2.5, y: -0.8 }, metrics: { x: 2.5, y: -0.8 },
      
      // WebSocket zone (below gateway)
      websocket: { x: 1.6, y: 0.6 }, realtime: { x: 1.6, y: 0.6 }, streaming: { x: 1.6, y: 0.6 }
    };
    
    // Compact spacing multipliers
    const baseXSpacing = 280; // Reduced from 400px
    const baseYSpacing = 180; // Reduced from 250px
    const startX = 150; // Closer to left edge
    const startY = 200; // Closer to top
    
    // Group nodes by type for better organization
    const typeGroups = new Map();
    nodes.forEach(node => {
      console.log(node,"node");
      const nodeType = (node.type || '').toLowerCase();
      const zone = zoneMapping[nodeType as keyof typeof zoneMapping] || { x: 2.2, y: 0 };
      
      const key = `${zone.x}-${zone.y}`;
      console.log(node.type,nodeType,zone,key);
      
      if (!typeGroups.has(key)) {
        typeGroups.set(key, []);
      }
      typeGroups.set(key, [...typeGroups.get(key), node]);
    });
    
    // Position nodes with compact layout
    typeGroups.forEach((groupNodes, key) => {
      const [zoneX, zoneY] = key.split('-').map(Number);
      
      groupNodes.forEach((node, index) => {
        // Calculate base position
        const x = startX + (zoneX * baseXSpacing);
        const y = startY + (zoneY * baseYSpacing);
        
        // Add small vertical offset for multiple nodes in same zone
        const offsetY = index * (nodeHeight + minSpacing);
        
        positions.set(node.id, { x, y: y + offsetY });
      });
    });
    
    // Final collision detection with minimal adjustments
    const finalPositions = new Map();
    positions.forEach((pos, nodeId) => {
      let finalPos = { ...pos };
      
      finalPositions.forEach((existingPos, existingId) => {
        if (existingId !== nodeId) {
          const distance = Math.sqrt(
            Math.pow(finalPos.x - existingPos.x, 2) + 
            Math.pow(finalPos.y - existingPos.y, 2)
          );
          
          if (distance < nodeWidth + minSpacing) {
            // Minimal adjustment - just move slightly
            finalPos.y += nodeHeight + minSpacing;
          }
        }
      });
      
      finalPositions.set(nodeId, finalPos);
    });
    
    return finalPositions;
  };

  // Generic function to load any architecture data from backend
  const loadArchitectureData = (architectureData: any) => {
    // Calculate smart positions
    const positions = calculateNodePositions(architectureData.nodes, architectureData.edges);
    
    const nodes = architectureData.nodes.map((n: any) => ({
      id: n.id,
      type: "systemNode",
      position: positions.get(n.id) || { x: 0, y: 0 },
      data: {
        id: n.id,
        type: (n.type || 'service') as SystemNodeData['type'],
        name: n.label || n.name || n.title || `Node ${n.id}`,
        notes: n.description || n.notes || '',
        width: 180,
        height: 120,
      }
    }));
  console.log(nodes,"nodes udpated");
  
    const edges = architectureData.edges.map((e: any, i: number) => ({
      id: `e${i}`,
      source: e.source,
      target: e.target,
      type: "smoothstep",
      label: e.label || e.name || '',
      style: { 
        strokeWidth: 2, 
        stroke: 'hsl(217 91% 60%)',
        strokeDasharray: e.label?.includes('Cache') || e.label?.includes('Async') ? '4,4' : undefined,
      },
      markerEnd: { 
        type: MarkerType.ArrowClosed,
        width: 10,
        height: 10,
        color: 'hsl(217 91% 60%)'
      },
      // Add path offset to reduce edge overlap
      pathOptions: {
        offset: (i % 3) * 15 - 15, // -15, 0, +15 offset for parallel edges
      },
      labelStyle: {
        fontSize: '11px',
        fontWeight: '500',
        fill: 'hsl(217 91% 60%)',
        background: 'hsl(var(--background))',
        padding: '1px 4px',
        borderRadius: '3px',
        border: '1px solid hsl(217 91% 60% / 0.3)',
      },
      labelBgStyle: {
        fill: 'hsl(var(--background))',
        fillOpacity: 0.95,
        stroke: 'hsl(217 91% 60% / 0.3)',
        strokeWidth: 1,
      },
    }));
  
    setNodes(nodes);
    setEdges(edges);
    
    // Fit the view to show all nodes
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.1 });
      }
    }, 100);
    
    toast({ title: 'Architecture loaded successfully' });
  };

  const loadDesign = () => {
    // Use the generic function with our sample data
    loadArchitectureData(userDesign || {});
  };

  const mockAIReview = async (data: DiagramData): Promise<AIReview> => {
    // Mock API call - simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response based on diagram
    return {
      critique: `Your architecture shows ${data.nodes.length} components with ${data.edges.length} connections. The design demonstrates good separation of concerns with dedicated components for different system layers.`,
      suggestions: [
        'Consider adding load balancers for high availability',
        'Implement monitoring and logging components',
        'Add security measures like authentication services',
        'Consider caching strategies for better performance'
      ],
      references: [
        'AWS Well-Architected Framework',
        'Microservices Patterns by Chris Richardson',
        'System Design Interview by Alex Xu',
        'Building Microservices by Sam Newman'
      ]
    };
  };  
useEffect(() => {
  if(userDesign) {
    loadDesign();
  }
}, [userDesign]);

  return (
    <div className="h-screen w-full bg-canvas flex">

      {/* <NodeToolbar onDragStart={onDragStart} /> */}
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between shadow-panel">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              System Architecture Designer
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={saveDesign} className="hover:shadow-glow transition-all duration-300">
              <Download className="w-4 h-4 mr-2" />
              Export Design
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => loadDesign()} className="hover:shadow-glow transition-all duration-300">
              <Upload className="w-4 h-4 mr-2" />
              Load Polling Architecture
            </Button>
            {/* <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={loadDesign}
              className="hidden"
            /> */}
            
            <Button 
              variant={showAIPanel ? "default" : "outline"} 
              size="sm"
              onClick={() => setShowAIPanel(!showAIPanel)}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <FileJson className="w-4 h-4 mr-2" />
              AI Analysis
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          <div
            className="flex-1 bg-gradient-canvas"
            ref={reactFlowWrapper}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              defaultEdgeOptions={defaultEdgeOptions}
              connectionRadius={20}
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              fitView
              className="bg-transparent"
            >
            </ReactFlow>
          </div>
          
          {selectedNode && (
            <EnhancedPropertiesPanel
              selectedNode={selectedNode}
              onUpdateNode={updateNode}
              onClose={() => setSelectedNode(null)}
            />
          )}
          
          {showAIPanel && (
            <AIReviewPanel
              diagramData={{
                nodes: nodes as DiagramNode[],
                edges: edges as DiagramEdge[],
              }}
              onGetReview={mockAIReview}
            />
          )}
        </div>
      </div>
      <Tabs defaultValue='use-ai' className='bg-[#141414] border-l border-border h-screen flex flex-col'>
        <TabsList className='bg-card/95 backdrop-blur-sm border-b border-border p-4 flex shadow-panel rounded-none h-18'>
          <TabsTrigger value="node-toolbar" className='h-9 py-4'>System components</TabsTrigger>
          <TabsTrigger value="use-ai" className='h-9'>Use AI</TabsTrigger>
        </TabsList>
        <TabsContent value="node-toolbar" className="flex-1 p-0">
          <div className='h-full max-h-[calc(100vh-80px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 hover:scrollbar-thumb-blue-400 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg'>
            <NodeToolbar onDragStart={onDragStart} />
          </div>
        </TabsContent>
        <TabsContent value="use-ai" className='h-full'>
          <AiGeneratorChat userDesign={userDesign} setUserDesign={setUserDesign} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ArchitectureDiagramWrapper() {
  return (
    <ReactFlowProvider>
      <ArchitectureDiagram />
    </ReactFlowProvider>
  );
}

export { ArchitectureDiagramWrapper as ArchitectureDiagram };
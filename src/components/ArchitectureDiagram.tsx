import { useCallback, useRef, useState, useEffect } from 'react';
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
import { Save, Upload, Download, FileJson, Server } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import NodeToolbar from './NodeToolbar';
import EnhancedPropertiesPanel from './EnhancedPropertiesPanel';
import AIReviewPanel from './AIReviewPanel';
import ResizableSystemNode from './ResizableSystemNode';
import { DiagramData, DiagramNode, DiagramEdge, SystemNodeData, AIReview } from '@/types/diagram';

const nodeTypes = {
  systemNode: ResizableSystemNode,
};

const defaultEdgeOptions = {
  type: 'bezier',
  markerEnd: { 
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: 'hsl(217 91% 70%)'
  },
  style: { 
    strokeWidth: 2, 
    stroke: 'hsl(217 91% 70%)',
    filter: 'drop-shadow(0 2px 4px hsl(217 91% 70% / 0.2))'
  },
  animated: false,
  pathOptions: {
    offset: 10,
    borderRadius: 8
  }
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

  const loadDesign = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data: DiagramData = JSON.parse(e.target?.result as string);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        toast({ title: 'Design imported successfully' });
      } catch (error) {
        toast({ 
          title: 'Import failed', 
          description: 'Invalid file format',
          variant: 'destructive' 
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
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

  return (
    <div className="h-screen w-full bg-canvas flex">
      <NodeToolbar onDragStart={onDragStart} />
      
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
            
            <Button variant="outline" size="sm" asChild className="hover:shadow-glow transition-all duration-300">
              <label htmlFor="import-file" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Import Design
              </label>
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={loadDesign}
              className="hidden"
            />
            
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
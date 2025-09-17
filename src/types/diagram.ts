export interface SystemNodeData {
  id: string;
  type: 'client' | 'gateway' | 'service' | 'database' | 'cache' | 'queue' | 'storage' | 'cdn' | 'loadbalancer' | 'monitor' | 'security' | 'analytics';
  name: string;
  notes?: string;
  width?: number;
  height?: number;
  customProperties?: Record<string, any>;
}

export interface DiagramNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: SystemNodeData;
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface DiagramData {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  metadata?: {
    name?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface AIReview {
  critique: string;
  suggestions: string[];
  references: string[];
}
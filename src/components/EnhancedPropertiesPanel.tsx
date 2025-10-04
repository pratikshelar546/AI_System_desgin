import { X, Settings, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { SystemNodeData } from '@/types/diagram';

interface EnhancedPropertiesPanelProps {
  selectedNode: SystemNodeData;
  onUpdateNode: (nodeId: string, updates: Partial<SystemNodeData>) => void;
  onClose: () => void;
}

export default function EnhancedPropertiesPanel({ 
  selectedNode, 
  onUpdateNode, 
  onClose 
}: EnhancedPropertiesPanelProps) {
  const handleInputChange = (field: keyof SystemNodeData, value: any) => {
    onUpdateNode(selectedNode.id, { [field]: value });
  };

  return (
    <div className="w-full lg:w-80 bg-card border-l border-border shadow-panel overflow-hidden">
      <div className="bg-gradient-primary p-3 sm:p-4 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            <h3 className="font-semibold text-primary-foreground text-sm sm:text-base">Node Properties</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Basic Properties */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-foreground">Basic Properties</h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              <Input
                id="name"
                value={selectedNode.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1 bg-muted/30 border-border/30 focus:border-primary"
                placeholder="Enter node name..."
              />
            </div>
            
            <div>
              <Label htmlFor="type" className="text-sm font-medium">Type</Label>
              <Input
                id="type"
                value={selectedNode.type}
                disabled
                className="mt-1 bg-muted/20 text-muted-foreground"
              />
            </div>
            
            <div>
              <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
              <Textarea
                id="notes"
                value={selectedNode.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="mt-1 bg-muted/30 border-border/30 focus:border-primary min-h-[80px]"
                placeholder="Add notes or description..."
              />
            </div>
          </div>
        </div>

        {/* Size Properties */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground border-b border-border/30 pb-2">
            Dimensions
          </h4>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Width: {selectedNode.width || 180}px</Label>
              <Slider
                value={[selectedNode.width || 180]}
                onValueChange={([value]) => handleInputChange('width', value)}
                min={140}
                max={400}
                step={10}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Height: {selectedNode.height || 120}px</Label>
              <Slider
                value={[selectedNode.height || 120]}
                onValueChange={([value]) => handleInputChange('height', value)}
                min={100}
                max={300}
                step={10}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Advanced Properties */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground border-b border-border/30 pb-2">
            Advanced
          </h4>
          
          <div className="space-y-3">
            <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
              <p className="text-xs text-muted-foreground">
                ID: <code className="font-mono">{selectedNode.id}</code>
              </p>
            </div>
          </div>
        </div>

        {/* Node Preview */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground border-b border-border/30 pb-2">
            Preview
          </h4>
          
          <div className="p-4 bg-muted/10 rounded-lg border-2 border-dashed border-border/30">
            <div className="text-center text-sm text-muted-foreground">
              Node preview will appear here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
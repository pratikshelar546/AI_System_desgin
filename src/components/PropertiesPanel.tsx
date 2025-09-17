import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SystemNodeData } from '@/types/diagram';

interface PropertiesPanelProps {
  selectedNode: SystemNodeData | null;
  onUpdateNode: (nodeId: string, updates: Partial<SystemNodeData>) => void;
  onClose: () => void;
}

export default function PropertiesPanel({ 
  selectedNode, 
  onUpdateNode, 
  onClose 
}: PropertiesPanelProps) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setName(selectedNode.name || '');
      setNotes(selectedNode.notes || '');
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { name, notes });
    }
  };

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="bg-card border-l border-border w-80 p-6 shadow-panel">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Properties</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="node-type" className="text-sm font-medium">
            Type
          </Label>
          <Input
            id="node-type"
            value={selectedNode.type}
            disabled
            className="capitalize bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="node-name" className="text-sm font-medium">
            Name
          </Label>
          <Input
            id="node-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSave}
            placeholder="Enter component name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="node-notes" className="text-sm font-medium">
            Notes
          </Label>
          <Textarea
            id="node-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleSave}
            placeholder="Add description or technical notes"
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Changes are saved automatically
          </p>
        </div>
      </div>
    </div>
  );
}
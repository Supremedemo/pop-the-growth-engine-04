
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { PopupElement, TextElement, ImageElement, FormElement, TimerElement, FormField } from "./PopupElements";

interface PropertyPanelProps {
  selectedElement: PopupElement | null;
  onUpdateElement: (id: string, updates: Partial<PopupElement>) => void;
}

export const PropertyPanel = ({ selectedElement, onUpdateElement }: PropertyPanelProps) => {
  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-slate-500">
        <p>Select an element to edit its properties</p>
      </div>
    );
  }

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const renderTextProperties = (element: TextElement) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text-content">Content</Label>
        <Textarea
          id="text-content"
          value={element.content}
          onChange={(e) => onUpdateElement(element.id, { content: e.target.value })}
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="font-size">Font Size</Label>
        <Input
          id="font-size"
          type="number"
          value={element.fontSize}
          onChange={(e) => onUpdateElement(element.id, { fontSize: parseInt(e.target.value) })}
        />
      </div>
      <div>
        <Label htmlFor="font-weight">Font Weight</Label>
        <Select value={element.fontWeight} onValueChange={(value) => onUpdateElement(element.id, { fontWeight: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
            <SelectItem value="lighter">Light</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="text-align">Text Align</Label>
        <Select value={element.textAlign} onValueChange={(value) => onUpdateElement(element.id, { textAlign: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="text-color">Text Color</Label>
        <div className="flex items-center space-x-3">
          <Input
            id="text-color"
            type="color"
            value={element.color}
            onChange={(e) => onUpdateElement(element.id, { color: e.target.value })}
            className="w-12 h-8"
          />
          <Input
            value={element.color}
            onChange={(e) => onUpdateElement(element.id, { color: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );

  const renderImageProperties = (element: ImageElement) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-src">Image URL</Label>
        <Input
          id="image-src"
          value={element.src}
          onChange={(e) => onUpdateElement(element.id, { src: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="image-alt">Alt Text</Label>
        <Input
          id="image-alt"
          value={element.alt}
          onChange={(e) => onUpdateElement(element.id, { alt: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="border-radius">Border Radius</Label>
        <Input
          id="border-radius"
          type="number"
          value={element.borderRadius}
          onChange={(e) => onUpdateElement(element.id, { borderRadius: parseInt(e.target.value) })}
        />
      </div>
    </div>
  );

  const renderFormProperties = (element: FormElement) => {
    const addField = () => {
      const newField: FormField = {
        id: generateId(),
        type: "text",
        placeholder: "Enter text",
        required: false,
      };
      onUpdateElement(element.id, {
        fields: [...element.fields, newField]
      });
    };

    const removeField = (fieldId: string) => {
      onUpdateElement(element.id, {
        fields: element.fields.filter(f => f.id !== fieldId)
      });
    };

    const updateField = (fieldId: string, updates: Partial<FormField>) => {
      onUpdateElement(element.id, {
        fields: element.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
      });
    };

    return (
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Form Fields</Label>
            <Button size="sm" onClick={addField}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {element.fields.map((field) => (
              <div key={field.id} className="p-3 border rounded space-y-2">
                <div className="flex items-center justify-between">
                  <Select value={field.type} onValueChange={(value: any) => updateField(field.id, { type: value })}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={() => removeField(field.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Placeholder text"
                  value={field.placeholder}
                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="button-text">Button Text</Label>
          <Input
            id="button-text"
            value={element.buttonText}
            onChange={(e) => onUpdateElement(element.id, { buttonText: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="button-color">Button Color</Label>
          <div className="flex items-center space-x-3">
            <Input
              id="button-color"
              type="color"
              value={element.buttonColor}
              onChange={(e) => onUpdateElement(element.id, { buttonColor: e.target.value })}
              className="w-12 h-8"
            />
            <Input
              value={element.buttonColor}
              onChange={(e) => onUpdateElement(element.id, { buttonColor: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderTimerProperties = (element: TimerElement) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="timer-duration">Duration (seconds)</Label>
        <Input
          id="timer-duration"
          type="number"
          value={element.duration}
          onChange={(e) => onUpdateElement(element.id, { duration: parseInt(e.target.value) })}
        />
      </div>
      <div>
        <Label htmlFor="timer-bg">Background Color</Label>
        <div className="flex items-center space-x-3">
          <Input
            id="timer-bg"
            type="color"
            value={element.backgroundColor}
            onChange={(e) => onUpdateElement(element.id, { backgroundColor: e.target.value })}
            className="w-12 h-8"
          />
          <Input
            value={element.backgroundColor}
            onChange={(e) => onUpdateElement(element.id, { backgroundColor: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="timer-text-color">Text Color</Label>
        <div className="flex items-center space-x-3">
          <Input
            id="timer-text-color"
            type="color"
            value={element.textColor}
            onChange={(e) => onUpdateElement(element.id, { textColor: e.target.value })}
            className="w-12 h-8"
          />
          <Input
            value={element.textColor}
            onChange={(e) => onUpdateElement(element.id, { textColor: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );

  const renderPositionProperties = () => (
    <div className="space-y-4">
      <h4 className="font-medium">Position & Size</h4>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="pos-x">X</Label>
          <Input
            id="pos-x"
            type="number"
            value={selectedElement.x}
            onChange={(e) => onUpdateElement(selectedElement.id, { x: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="pos-y">Y</Label>
          <Input
            id="pos-y"
            type="number"
            value={selectedElement.y}
            onChange={(e) => onUpdateElement(selectedElement.id, { y: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            value={selectedElement.width}
            onChange={(e) => onUpdateElement(selectedElement.id, { width: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            value={selectedElement.height}
            onChange={(e) => onUpdateElement(selectedElement.id, { height: parseInt(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      <h3 className="font-medium">Element Properties</h3>
      
      {renderPositionProperties()}
      
      {selectedElement.type === "text" && renderTextProperties(selectedElement as TextElement)}
      {selectedElement.type === "image" && renderImageProperties(selectedElement as ImageElement)}
      {selectedElement.type === "form" && renderFormProperties(selectedElement as FormElement)}
      {selectedElement.type === "timer" && renderTimerProperties(selectedElement as TimerElement)}
    </div>
  );
};

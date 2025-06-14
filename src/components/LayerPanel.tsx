
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Unlock, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { PopupElement } from "./PopupElements";

interface LayerPanelProps {
  elements: PopupElement[];
  selectedElementIds: string[];
  onSelectElements: (ids: string[]) => void;
  onUpdateElement: (id: string, updates: Partial<PopupElement>) => void;
  onDeleteElements: (ids: string[]) => void;
}

export const LayerPanel = ({
  elements,
  selectedElementIds,
  onSelectElements,
  onUpdateElement,
  onDeleteElements
}: LayerPanelProps) => {
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝';
      case 'image': return '🖼️';
      case 'form': return '📋';
      case 'timer': return '⏱️';
      default: return '📦';
    }
  };

  const getElementName = (element: PopupElement) => {
    switch (element.type) {
      case 'text':
        return (element as any).content?.substring(0, 20) || 'Text Element';
      case 'image':
        return (element as any).alt || 'Image';
      case 'form':
        return 'Form';
      case 'timer':
        return 'Timer';
      default:
        return 'Element';
    }
  };

  const handleLayerClick = (id: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      if (selectedElementIds.includes(id)) {
        onSelectElements(selectedElementIds.filter(selectedId => selectedId !== id));
      } else {
        onSelectElements([...selectedElementIds, id]);
      }
    } else {
      onSelectElements([id]);
    }
  };

  const moveLayer = (id: string, direction: 'up' | 'down') => {
    const element = elements.find(el => el.id === id);
    if (!element) return;

    const otherElements = elements.filter(el => el.id !== id);
    const sortedOthers = otherElements.sort((a, b) => a.zIndex - b.zIndex);

    let newZIndex = element.zIndex;

    if (direction === 'up') {
      const higherElement = sortedOthers.find(el => el.zIndex > element.zIndex);
      if (higherElement) {
        newZIndex = higherElement.zIndex + 1;
        // Swap z-indexes
        onUpdateElement(higherElement.id, { zIndex: element.zIndex });
      }
    } else {
      const lowerElement = [...sortedOthers].reverse().find(el => el.zIndex < element.zIndex);
      if (lowerElement) {
        newZIndex = lowerElement.zIndex;
        // Swap z-indexes
        onUpdateElement(lowerElement.id, { zIndex: element.zIndex });
      }
    }

    onUpdateElement(id, { zIndex: newZIndex });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Layers</h3>
        <span className="text-xs text-slate-500">{elements.length} elements</span>
      </div>

      {sortedElements.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No elements on canvas</p>
        </div>
      ) : (
        <div className="space-y-1">
          {sortedElements.map((element) => (
            <div
              key={element.id}
              className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                selectedElementIds.includes(element.id)
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
              onClick={(e) => handleLayerClick(element.id, e)}
            >
              {/* Element Icon */}
              <span className="text-sm">{getElementIcon(element.type)}</span>

              {/* Element Name */}
              <span className="flex-1 text-sm truncate">
                {getElementName(element)}
              </span>

              {/* Layer Controls */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayer(element.id, 'up');
                  }}
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayer(element.id, 'down');
                  }}
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteElements([element.id]);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

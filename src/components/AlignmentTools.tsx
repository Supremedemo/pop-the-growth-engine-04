
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignStartVertical, 
  AlignCenterVertical, 
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter
} from "lucide-react";
import { PopupElement } from "./PopupElements";

interface AlignmentToolsProps {
  selectedElements: PopupElement[];
  onUpdateElements: (updates: Array<{ id: string } & Partial<PopupElement>>) => void;
}

export const AlignmentTools = ({ selectedElements, onUpdateElements }: AlignmentToolsProps) => {
  if (selectedElements.length < 2) return null;

  const alignLeft = () => {
    const leftMost = Math.min(...selectedElements.map(el => el.x));
    const updates = selectedElements.map(el => ({ id: el.id, x: leftMost }));
    onUpdateElements(updates);
  };

  const alignCenter = () => {
    const leftMost = Math.min(...selectedElements.map(el => el.x));
    const rightMost = Math.max(...selectedElements.map(el => el.x + el.width));
    const centerX = (leftMost + rightMost) / 2;
    
    const updates = selectedElements.map(el => ({ 
      id: el.id, 
      x: centerX - el.width / 2 
    }));
    onUpdateElements(updates);
  };

  const alignRight = () => {
    const rightMost = Math.max(...selectedElements.map(el => el.x + el.width));
    const updates = selectedElements.map(el => ({ 
      id: el.id, 
      x: rightMost - el.width 
    }));
    onUpdateElements(updates);
  };

  const alignTop = () => {
    const topMost = Math.min(...selectedElements.map(el => el.y));
    const updates = selectedElements.map(el => ({ id: el.id, y: topMost }));
    onUpdateElements(updates);
  };

  const alignMiddle = () => {
    const topMost = Math.min(...selectedElements.map(el => el.y));
    const bottomMost = Math.max(...selectedElements.map(el => el.y + el.height));
    const centerY = (topMost + bottomMost) / 2;
    
    const updates = selectedElements.map(el => ({ 
      id: el.id, 
      y: centerY - el.height / 2 
    }));
    onUpdateElements(updates);
  };

  const alignBottom = () => {
    const bottomMost = Math.max(...selectedElements.map(el => el.y + el.height));
    const updates = selectedElements.map(el => ({ 
      id: el.id, 
      y: bottomMost - el.height 
    }));
    onUpdateElements(updates);
  };

  const distributeHorizontally = () => {
    if (selectedElements.length < 3) return;
    
    const sorted = [...selectedElements].sort((a, b) => a.x - b.x);
    const leftMost = sorted[0].x;
    const rightMost = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width;
    const totalWidth = rightMost - leftMost;
    const elementWidths = sorted.reduce((sum, el) => sum + el.width, 0);
    const spacing = (totalWidth - elementWidths) / (sorted.length - 1);
    
    let currentX = leftMost;
    const updates = sorted.map(el => {
      const update = { id: el.id, x: currentX };
      currentX += el.width + spacing;
      return update;
    });
    
    onUpdateElements(updates);
  };

  const distributeVertically = () => {
    if (selectedElements.length < 3) return;
    
    const sorted = [...selectedElements].sort((a, b) => a.y - b.y);
    const topMost = sorted[0].y;
    const bottomMost = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height;
    const totalHeight = bottomMost - topMost;
    const elementHeights = sorted.reduce((sum, el) => sum + el.height, 0);
    const spacing = (totalHeight - elementHeights) / (sorted.length - 1);
    
    let currentY = topMost;
    const updates = sorted.map(el => {
      const update = { id: el.id, y: currentY };
      currentY += el.height + spacing;
      return update;
    });
    
    onUpdateElements(updates);
  };

  return (
    <div className="flex items-center space-x-1 p-2 bg-white border rounded">
      <span className="text-xs text-slate-600 mr-2">
        {selectedElements.length} selected
      </span>
      
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={alignLeft}>
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={alignCenter}>
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={alignRight}>
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-px h-4 bg-slate-300" />

      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={alignTop}>
          <AlignStartVertical className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={alignMiddle}>
          <AlignCenterVertical className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={alignBottom}>
          <AlignEndVertical className="w-4 h-4" />
        </Button>
      </div>

      {selectedElements.length >= 3 && (
        <>
          <div className="w-px h-4 bg-slate-300" />
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={distributeHorizontally}>
              <AlignHorizontalDistributeCenter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={distributeVertically}>
              <AlignVerticalDistributeCenter className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

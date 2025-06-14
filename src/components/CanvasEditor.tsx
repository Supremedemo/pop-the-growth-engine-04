
import React, { useRef, useState, useCallback } from "react";
import { CanvasElement } from "./CanvasElement";
import { CanvasGrid } from "./CanvasGrid";
import { PopupElement } from "./PopupElements";
import { CanvasState } from "./PopupBuilder";

interface CanvasEditorProps {
  canvasState: CanvasState;
  selectedElementIds: string[];
  onSelectElements: (ids: string[]) => void;
  onUpdateElement: (id: string, updates: Partial<PopupElement>) => void;
  onDeleteElements: (ids: string[]) => void;
  previewDevice: string;
}

export const CanvasEditor = ({
  canvasState,
  selectedElementIds,
  onSelectElements,
  onUpdateElement,
  onDeleteElements,
  previewDevice
}: CanvasEditorProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const getCanvasStyle = () => {
    const scale = previewDevice === "mobile" ? 0.8 : 1;
    return {
      width: canvasState.width * canvasState.zoom * scale,
      height: canvasState.height * canvasState.zoom * scale,
      backgroundColor: canvasState.backgroundColor,
      transform: `scale(${canvasState.zoom})`,
      transformOrigin: 'top left',
      position: 'relative' as const,
      margin: '40px auto',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      borderRadius: '8px',
      overflow: 'hidden'
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / canvasState.zoom;
      const y = (e.clientY - rect.top) / canvasState.zoom;
      
      setIsSelecting(true);
      setDragStart({ x, y });
      setSelectionBox({ x, y, width: 0, height: 0 });
      onSelectElements([]);
    }
  };

  const handleCanvasMouseMove = useCallback((e: MouseEvent) => {
    if (!isSelecting || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / canvasState.zoom;
    const currentY = (e.clientY - rect.top) / canvasState.zoom;

    setSelectionBox({
      x: Math.min(dragStart.x, currentX),
      y: Math.min(dragStart.y, currentY),
      width: Math.abs(currentX - dragStart.x),
      height: Math.abs(currentY - dragStart.y)
    });
  }, [isSelecting, canvasState.zoom, dragStart]);

  const handleCanvasMouseUp = useCallback(() => {
    if (isSelecting) {
      // Find elements within selection box
      const selectedIds = canvasState.elements
        .filter(element => {
          const elementRight = element.x + element.width;
          const elementBottom = element.y + element.height;
          const selectionRight = selectionBox.x + selectionBox.width;
          const selectionBottom = selectionBox.y + selectionBox.height;

          return (
            element.x < selectionRight &&
            elementRight > selectionBox.x &&
            element.y < selectionBottom &&
            elementBottom > selectionBox.y
          );
        })
        .map(el => el.id);

      if (selectedIds.length > 0) {
        onSelectElements(selectedIds);
      }

      setIsSelecting(false);
      setSelectionBox({ x: 0, y: 0, width: 0, height: 0 });
    }
  }, [isSelecting, selectionBox, canvasState.elements, onSelectElements]);

  React.useEffect(() => {
    if (isSelecting) {
      document.addEventListener('mousemove', handleCanvasMouseMove);
      document.addEventListener('mouseup', handleCanvasMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleCanvasMouseMove);
        document.removeEventListener('mouseup', handleCanvasMouseUp);
      };
    }
  }, [isSelecting, handleCanvasMouseMove, handleCanvasMouseUp]);

  const handleElementSelect = (id: string, addToSelection: boolean = false) => {
    if (addToSelection) {
      if (selectedElementIds.includes(id)) {
        onSelectElements(selectedElementIds.filter(selectedId => selectedId !== id));
      } else {
        onSelectElements([...selectedElementIds, id]);
      }
    } else {
      onSelectElements([id]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' && selectedElementIds.length > 0) {
      onDeleteElements(selectedElementIds);
    }
    if (e.key === 'Escape') {
      onSelectElements([]);
    }
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      onSelectElements(canvasState.elements.map(el => el.id));
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementIds, canvasState.elements]);

  return (
    <div className="w-full h-full overflow-auto bg-slate-100 p-8">
      <div
        ref={canvasRef}
        style={getCanvasStyle()}
        onMouseDown={handleCanvasMouseDown}
        className="relative cursor-default"
      >
        {/* Grid */}
        {canvasState.showGrid && (
          <CanvasGrid 
            width={canvasState.width}
            height={canvasState.height}
            gridSize={canvasState.gridSize}
          />
        )}

        {/* Elements */}
        {canvasState.elements
          .sort((a, b) => a.zIndex - b.zIndex)
          .map(element => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedElementIds.includes(element.id)}
              isPrimarySelection={selectedElementIds[0] === element.id}
              onSelect={handleElementSelect}
              onUpdate={onUpdateElement}
              gridSize={canvasState.gridSize}
              snapToGrid={canvasState.showGrid}
            />
          ))}

        {/* Selection Box */}
        {isSelecting && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-20 pointer-events-none"
            style={{
              left: selectionBox.x,
              top: selectionBox.y,
              width: selectionBox.width,
              height: selectionBox.height
            }}
          />
        )}
      </div>
    </div>
  );
};


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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, scrollX: 0, scrollY: 0 });

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
      overflow: 'hidden',
      border: '1px solid #e2e8f0'
    };
  };

  const getCanvasCoordinates = (e: React.MouseEvent | MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvasState.zoom;
    const y = (e.clientY - rect.top) / canvasState.zoom;
    return { x, y };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if clicking on canvas background
    if (e.target === canvasRef.current) {
      const coords = getCanvasCoordinates(e);
      
      if (e.ctrlKey || e.metaKey) {
        // Start panning with Ctrl/Cmd + click
        setIsPanning(true);
        setPanStart({
          x: e.clientX,
          y: e.clientY,
          scrollX: containerRef.current?.scrollLeft || 0,
          scrollY: containerRef.current?.scrollTop || 0
        });
      } else {
        // Start selection
        setIsSelecting(true);
        setDragStart(coords);
        setSelectionBox({ x: coords.x, y: coords.y, width: 0, height: 0 });
        onSelectElements([]);
      }
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning && containerRef.current) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      
      containerRef.current.scrollLeft = panStart.scrollX - deltaX;
      containerRef.current.scrollTop = panStart.scrollY - deltaY;
      return;
    }

    if (!isSelecting || !canvasRef.current) return;

    const coords = getCanvasCoordinates(e);
    setSelectionBox({
      x: Math.min(dragStart.x, coords.x),
      y: Math.min(dragStart.y, coords.y),
      width: Math.abs(coords.x - dragStart.x),
      height: Math.abs(coords.y - dragStart.y)
    });
  }, [isSelecting, isPanning, canvasState.zoom, dragStart, panStart]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

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
  }, [isSelecting, isPanning, selectionBox, canvasState.elements, onSelectElements]);

  React.useEffect(() => {
    if (isSelecting || isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isPanning ? 'grabbing' : 'crosshair';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
      };
    }
  }, [isSelecting, isPanning, handleMouseMove, handleMouseUp]);

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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Delete' && selectedElementIds.length > 0) {
      e.preventDefault();
      onDeleteElements(selectedElementIds);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onSelectElements([]);
    }
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      onSelectElements(canvasState.elements.map(el => el.id));
    }
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      // Duplicate selected elements
      if (selectedElementIds.length > 0) {
        const elementsToClone = canvasState.elements.filter(el => selectedElementIds.includes(el.id));
        const newElements = elementsToClone.map(el => ({
          ...el,
          id: Math.random().toString(36).substr(2, 9),
          x: el.x + 20,
          y: el.y + 20,
          zIndex: Math.max(...canvasState.elements.map(e => e.zIndex), 0) + 1
        }));
        
        newElements.forEach(el => {
          canvasState.elements.push(el);
        });
        
        onSelectElements(newElements.map(el => el.id));
      }
    }
  }, [selectedElementIds, canvasState.elements, onDeleteElements, onSelectElements]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      // Zoom with mouse wheel
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(canvasState.zoom * delta, 0.25), 3);
      // Update zoom through parent component
      console.log('Zoom requested:', newZoom);
    }
  }, [canvasState.zoom]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-auto bg-slate-100 p-8"
      onWheel={handleWheel}
    >
      <div
        ref={canvasRef}
        style={getCanvasStyle()}
        onMouseDown={handleCanvasMouseDown}
        className={`relative select-none ${
          isPanning ? 'cursor-grabbing' : isSelecting ? 'cursor-crosshair' : 'cursor-default'
        }`}
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
        {isSelecting && selectionBox.width > 0 && selectionBox.height > 0 && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-20 pointer-events-none z-50"
            style={{
              left: selectionBox.x,
              top: selectionBox.y,
              width: selectionBox.width,
              height: selectionBox.height
            }}
          />
        )}

        {/* Helper text */}
        {canvasState.elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">
            <div className="text-center">
              <p className="text-lg font-medium">Start building your popup</p>
              <p className="text-sm mt-1">Add elements from the toolbar on the left</p>
              <p className="text-xs mt-2">
                Tip: Hold Ctrl/Cmd + click to pan • Ctrl/Cmd + scroll to zoom
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

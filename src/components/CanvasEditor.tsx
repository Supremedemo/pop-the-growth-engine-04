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
  onAddElement?: (element: PopupElement) => void;
}

export const CanvasEditor = ({
  canvasState,
  selectedElementIds,
  onSelectElements,
  onUpdateElement,
  onDeleteElements,
  previewDevice,
  onAddElement
}: CanvasEditorProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, scrollX: 0, scrollY: 0 });
  const [isDragOver, setIsDragOver] = useState(false);

  const getCanvasStyle = () => {
    const scale = previewDevice === "mobile" ? 0.8 : 1;
    const layout = canvasState.layout;
    
    let backgroundStyle = {};
    
    if (canvasState.backgroundType === 'color') {
      backgroundStyle = { backgroundColor: canvasState.backgroundColor };
    } else if (canvasState.backgroundType === 'image' && canvasState.backgroundImage) {
      backgroundStyle = {
        backgroundImage: `url(${canvasState.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    } else if (canvasState.backgroundType === 'gradient' && canvasState.backgroundGradient) {
      backgroundStyle = { background: canvasState.backgroundGradient };
    }

    // Layout-specific styling
    let layoutStyle = {};
    switch (layout.type) {
      case 'banner':
        layoutStyle = {
          width: layout.position === 'top' || layout.position === 'bottom' 
            ? '100%' 
            : canvasState.width * scale,
          height: canvasState.height * scale,
          maxWidth: layout.dimensions.maxWidth || '100%',
          borderRadius: layout.position === 'top' || layout.position === 'bottom' ? '0' : '12px'
        };
        break;
      case 'fullscreen':
        layoutStyle = {
          width: '100%',
          height: '100%',
          maxWidth: '100vw',
          maxHeight: '100vh',
          borderRadius: '0'
        };
        break;
      case 'slide-in':
        layoutStyle = {
          width: canvasState.width * scale,
          height: canvasState.height * scale,
          borderRadius: layout.position === 'left' || layout.position === 'right' ? '12px 0 0 12px' : '12px'
        };
        break;
      default:
        layoutStyle = {
          width: canvasState.width * scale,
          height: canvasState.height * scale,
          borderRadius: '12px'
        };
    }
    
    return {
      ...layoutStyle,
      ...backgroundStyle,
      position: 'relative' as const,
      margin: layout.type === 'fullscreen' ? '0' : '40px auto',
      boxShadow: layout.type === 'banner' || layout.type === 'fullscreen' 
        ? 'none' 
        : '0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      border: `2px solid ${isDragOver ? '#3b82f6' : '#e2e8f0'}`,
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
    };
  };

  const getCanvasCoordinates = (e: React.MouseEvent | MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = previewDevice === "mobile" ? 0.8 : 1;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    return { x, y };
  };

  const createElement = (type: string, coords: { x: number; y: number }) => {
    const generateId = () => Math.random().toString(36).substr(2, 9);
    
    switch (type) {
      case 'text':
        return {
          id: generateId(),
          type: "text" as const,
          x: coords.x,
          y: coords.y,
          width: 200,
          height: 40,
          zIndex: Math.max(...canvasState.elements.map(el => el.zIndex), 0) + 1,
          content: "Click to edit text",
          fontSize: 16,
          fontWeight: "normal",
          textAlign: "left",
          color: "#000000",
        };
      case 'image':
        return {
          id: generateId(),
          type: "image" as const,
          x: coords.x,
          y: coords.y,
          width: 150,
          height: 100,
          zIndex: Math.max(...canvasState.elements.map(el => el.zIndex), 0) + 1,
          src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop",
          alt: "Placeholder image",
          borderRadius: 8,
        };
      case 'form':
        return {
          id: generateId(),
          type: "form" as const,
          x: coords.x,
          y: coords.y,
          width: 280,
          height: 140,
          zIndex: Math.max(...canvasState.elements.map(el => el.zIndex), 0) + 1,
          fields: [
            {
              id: generateId(),
              type: "email" as const,
              placeholder: "Enter your email",
              required: true,
            },
          ],
          buttonText: "Subscribe",
          buttonColor: "#3b82f6",
        };
      case 'timer':
        return {
          id: generateId(),
          type: "timer" as const,
          x: coords.x,
          y: coords.y,
          width: 180,
          height: 70,
          zIndex: Math.max(...canvasState.elements.map(el => el.zIndex), 0) + 1,
          duration: 300,
          format: "mm:ss",
          backgroundColor: "#ef4444",
          textColor: "#ffffff",
        };
      case 'html':
        return {
          id: generateId(),
          type: "html" as const,
          x: coords.x,
          y: coords.y,
          width: 200,
          height: 100,
          zIndex: Math.max(...canvasState.elements.map(el => el.zIndex), 0) + 1,
          htmlContent: '<div style="padding: 16px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; border-radius: 8px; text-align: center; font-weight: bold;">Custom HTML Block</div>',
        };
      default:
        return null;
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (e.target === canvasRef.current) {
      const coords = getCanvasCoordinates(e);
      
      if (e.ctrlKey || e.metaKey) {
        setIsPanning(true);
        setPanStart({
          x: e.clientX,
          y: e.clientY,
          scrollX: containerRef.current?.scrollLeft || 0,
          scrollY: containerRef.current?.scrollTop || 0
        });
        document.body.style.cursor = 'grabbing';
      } else {
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
  }, [isSelecting, isPanning, dragStart, panStart, previewDevice]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      document.body.style.cursor = 'default';
      return;
    }

    if (isSelecting) {
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
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const elementType = e.dataTransfer.getData('application/element-type');
    if (elementType && onAddElement) {
      const coords = getCanvasCoordinates(e as any);
      const newElement = createElement(elementType, coords);
      if (newElement) {
        onAddElement(newElement as PopupElement);
      }
    }
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(canvasState.zoom * delta, 0.25), 3);
      console.log('Zoom requested:', newZoom);
    }
  }, [canvasState.zoom]);

  const getLayoutPreviewStyle = () => {
    const layout = canvasState.layout;
    
    switch (layout.type) {
      case 'banner':
        return layout.position === 'top' 
          ? 'border-t-4 border-blue-500' 
          : 'border-b-4 border-blue-500';
      case 'slide-in':
        return layout.position === 'right' 
          ? 'border-r-4 border-green-500' 
          : 'border-l-4 border-green-500';
      case 'fullscreen':
        return 'border-4 border-purple-500';
      default:
        return 'border-2 border-blue-300';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 p-8"
      onWheel={handleWheel}
    >
      {/* Layout indicator */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center space-x-2 text-sm text-slate-600 bg-white px-3 py-1 rounded-full shadow-sm">
          <div className={`w-3 h-3 rounded-full ${
            canvasState.layout.type === 'modal' ? 'bg-blue-500' :
            canvasState.layout.type === 'banner' ? 'bg-orange-500' :
            canvasState.layout.type === 'slide-in' ? 'bg-green-500' :
            canvasState.layout.type === 'fullscreen' ? 'bg-purple-500' : 'bg-gray-500'
          }`} />
          <span>{canvasState.layout.name}</span>
        </div>
      </div>

      <div
        ref={canvasRef}
        style={getCanvasStyle()}
        onMouseDown={handleCanvasMouseDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative select-none transition-all duration-200 ${getLayoutPreviewStyle()} ${
          isPanning ? 'cursor-grabbing' : isSelecting ? 'cursor-crosshair' : 'cursor-default'
        } ${isDragOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
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
            className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-20 pointer-events-none z-50 rounded-sm"
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
            <div className="text-center max-w-md mx-auto">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <p className="text-lg font-medium text-slate-600 mb-2">Start building your {canvasState.layout.type}</p>
              <p className="text-sm text-slate-500 mb-4">Drag elements from the toolbar to create your design</p>
              <div className="text-xs text-slate-400 space-y-1">
                <p>💡 Hold Ctrl/Cmd + click to pan around</p>
                <p>🔍 Hold Ctrl/Cmd + scroll to zoom</p>
                <p>📦 Drag to select multiple elements</p>
                <p>📌 Pin elements to lock them in place</p>
              </div>
            </div>
          </div>
        )}

        {/* Drop zone indicator */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-50 bg-opacity-80 flex items-center justify-center pointer-events-none z-40 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-blue-600 font-medium">Drop to add element</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useRef, useCallback } from "react";
import { PopupElement, ElementRenderer } from "./PopupElements";
import { X, Pin, PinOff } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface CanvasElementProps {
  element: PopupElement;
  isSelected: boolean;
  isPrimarySelection: boolean;
  onSelect: (id: string, addToSelection?: boolean) => void;
  onUpdate: (id: string, updates: Partial<PopupElement>) => void;
  gridSize: number;
  snapToGrid: boolean;
  onBringForward?: (id: string) => void;
  onSendBackward?: (id: string) => void;
  aspectRatioLocked?: boolean;
  onToggleAspectRatioLock?: () => void;
}

export const CanvasElement = ({
  element,
  isSelected,
  isPrimarySelection,
  onSelect,
  onUpdate,
  gridSize,
  snapToGrid,
  onBringForward,
  onSendBackward,
  aspectRatioLocked,
  onToggleAspectRatioLock,
}: CanvasElementProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>("");
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const [resizeStart, setResizeStart] = useState({ 
    x: 0, y: 0, width: 0, height: 0, elementX: 0, elementY: 0 
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState(false);

  const elementRef = useRef<HTMLDivElement>(null);

  const snapToGridValue = useCallback((value: number) => {
    if (!snapToGrid) return Math.round(value);
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isSelected) {
      onSelect(element.id, e.ctrlKey || e.metaKey);
      return;
    }

    if (element.isPinned) return;

    const target = e.target as HTMLElement;
    const handle = target.getAttribute('data-resize-handle');
    
    if (handle) {
      // Start resizing
      setIsResizing(true);
      setResizeHandle(handle);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: element.width,
        height: element.height,
        elementX: element.x,
        elementY: element.y
      });
      document.body.style.cursor = getResizeCursor(handle);
    } else {
      // Start dragging - calculate offset from mouse to element origin
      const rect = elementRef.current?.getBoundingClientRect();
      if (rect) {
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        setIsDragging(true);
        setDragStart({
          x: e.clientX,
          y: e.clientY,
          offsetX: offsetX,
          offsetY: offsetY
        });
      }
      document.body.style.cursor = 'grabbing';
    }
  };

  const getResizeCursor = (handle: string) => {
    const cursors: { [key: string]: string } = {
      'nw': 'nw-resize',
      'n': 'n-resize',
      'ne': 'ne-resize',
      'w': 'w-resize',
      'e': 'e-resize',
      'sw': 'sw-resize',
      's': 's-resize',
      'se': 'se-resize'
    };
    return cursors[handle] || 'default';
  };

  const togglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(element.id, { isPinned: !element.isPinned });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(element.id, { x: -9999 }); // Move offscreen to "delete"
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      // Get the canvas element to calculate relative position
      const canvas = elementRef.current?.parentElement;
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        
        // Calculate new position based on mouse position minus the initial offset
        const newX = snapToGridValue((e.clientX - canvasRect.left) - dragStart.offsetX);
        const newY = snapToGridValue((e.clientY - canvasRect.top) - dragStart.offsetY);
        
        // Constrain to canvas bounds
        const constrainedX = Math.max(0, Math.min(newX, canvas.clientWidth - element.width));
        const constrainedY = Math.max(0, Math.min(newY, canvas.clientHeight - element.height));
        
        onUpdate(element.id, { x: constrainedX, y: constrainedY });
      }
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let updates: Partial<PopupElement> = {};
      const minSize = 20;
      const origWidth = resizeStart.width;
      const origHeight = resizeStart.height;
      const aspect = origWidth / origHeight || 1;

      // Handle aspect ratio locking
      const applyAspect = (width: number, height: number) => {
        if (!isAspectRatioLocked) return { width, height };
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          return { width, height: width / aspect };
        }
        return { width: height * aspect, height };
      };
      switch (resizeHandle) {
        case 'nw': {
          let newWidth = Math.max(minSize, snapToGridValue(origWidth - deltaX));
          let newHeight = Math.max(minSize, snapToGridValue(origHeight - deltaY));
          if (isAspectRatioLocked) {
            const wh = applyAspect(newWidth, newHeight);
            newWidth = wh.width;
            newHeight = wh.height;
          }
          updates = {
            x: snapToGridValue(resizeStart.elementX + (origWidth - newWidth)),
            y: snapToGridValue(resizeStart.elementY + (origHeight - newHeight)),
            width: newWidth,
            height: newHeight
          };
          break;
        }
        case 'ne': {
          let newWidth = Math.max(minSize, snapToGridValue(origWidth + deltaX));
          let newHeight = Math.max(minSize, snapToGridValue(origHeight - deltaY));
          if (isAspectRatioLocked) {
            const wh = applyAspect(newWidth, newHeight);
            newWidth = wh.width;
            newHeight = wh.height;
          }
          updates = {
            y: snapToGridValue(resizeStart.elementY + (origHeight - newHeight)),
            width: newWidth,
            height: newHeight
          };
          break;
        }
        case 'sw': {
          let newWidth = Math.max(minSize, snapToGridValue(origWidth - deltaX));
          let newHeight = Math.max(minSize, snapToGridValue(origHeight + deltaY));
          if (isAspectRatioLocked) {
            const wh = applyAspect(newWidth, newHeight);
            newWidth = wh.width;
            newHeight = wh.height;
          }
          updates = {
            x: snapToGridValue(resizeStart.elementX + (origWidth - newWidth)),
            width: newWidth,
            height: newHeight
          };
          break;
        }
        case 'se': {
          let newWidth = Math.max(minSize, snapToGridValue(origWidth + deltaX));
          let newHeight = Math.max(minSize, snapToGridValue(origHeight + deltaY));
          if (isAspectRatioLocked) {
            const wh = applyAspect(newWidth, newHeight);
            newWidth = wh.width;
            newHeight = wh.height;
          }
          updates = {
            width: newWidth,
            height: newHeight
          };
          break;
        }
        case 'n': {
          let newHeight = Math.max(minSize, snapToGridValue(origHeight - deltaY));
          if (isAspectRatioLocked) {
            let newWidth = newHeight * aspect;
            updates = {
              y: snapToGridValue(resizeStart.elementY + (origHeight - newHeight)),
              width: newWidth,
              height: newHeight
            };
          } else {
            updates = {
              y: snapToGridValue(resizeStart.elementY + (origHeight - newHeight)),
              height: newHeight
            };
          }
          break;
        }
        case 's': {
          let newHeight = Math.max(minSize, snapToGridValue(origHeight + deltaY));
          if (isAspectRatioLocked) {
            let newWidth = newHeight * aspect;
            updates = {
              width: newWidth,
              height: newHeight
            };
          } else {
            updates = {
              height: newHeight
            };
          }
          break;
        }
        case 'w': {
          let newWidth = Math.max(minSize, snapToGridValue(origWidth - deltaX));
          if (isAspectRatioLocked) {
            let newHeight = newWidth / aspect;
            updates = {
              x: snapToGridValue(resizeStart.elementX + (origWidth - newWidth)),
              width: newWidth,
              height: newHeight
            };
          } else {
            updates = {
              x: snapToGridValue(resizeStart.elementX + (origWidth - newWidth)),
              width: newWidth
            };
          }
          break;
        }
        case 'e': {
          let newWidth = Math.max(minSize, snapToGridValue(origWidth + deltaX));
          if (isAspectRatioLocked) {
            let newHeight = newWidth / aspect;
            updates = {
              width: newWidth,
              height: newHeight
            };
          } else {
            updates = {
              width: newWidth
            };
          }
          break;
        }
      }
      
      onUpdate(element.id, updates);
    }
  }, [isDragging, isResizing, dragStart, resizeStart, resizeHandle, element.id, element.width, element.height, onUpdate, snapToGridValue, isAspectRatioLocked]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle("");
    document.body.style.cursor = 'default';
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const ResizeHandle = ({ position, cursor }: { position: string; cursor: string }) => (
    <div
      data-resize-handle={position}
      className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full hover:bg-blue-50 transition-all duration-150 shadow-sm opacity-0 group-hover:opacity-100"
      style={{
        cursor,
        ...(position.includes('n') && { top: -6 }),
        ...(position.includes('s') && { bottom: -6 }),
        ...(position.includes('w') && { left: -6 }),
        ...(position.includes('e') && { right: -6 }),
        ...(position === 'n' && { left: '50%', transform: 'translateX(-50%)' }),
        ...(position === 's' && { left: '50%', transform: 'translateX(-50%)' }),
        ...(position === 'w' && { top: '50%', transform: 'translateY(-50%)' }),
        ...(position === 'e' && { top: '50%', transform: 'translateY(-50%)' })
      }}
    />
  );

  return (
    <div
      ref={elementRef}
      className={`absolute group transition-all duration-200 ${
        isSelected 
          ? isPrimarySelection 
            ? 'ring-2 ring-blue-500 ring-opacity-100 shadow-lg' 
            : 'ring-2 ring-blue-400 ring-opacity-70 shadow-md'
          : isHovered 
            ? 'ring-1 ring-blue-300 ring-opacity-50 shadow-sm' 
            : ''
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: element.zIndex + (isSelected ? 1000 : 0),
        cursor: element.isPinned ? 'default' : isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ElementRenderer
        element={element}
        isSelected={isSelected}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={() => {}}
      />
      
      {/* Action buttons - only show when selected */}
      {isSelected && (
        <TooltipProvider>
          {/* Pin/Unpin */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={togglePin}
                className={`absolute -top-8 left-0 px-2 py-1 rounded text-xs flex items-center space-x-1 transition-colors shadow-md ${
                  element.isPinned 
                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {element.isPinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
                <span>{element.isPinned ? 'Pinned' : 'Pin'}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>Pin/Lock element (prevents moving/resizing)</TooltipContent>
          </Tooltip>
          {/* Delete (use tooltip for button) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleDelete}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
              >
                <X className="w-3 h-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Delete element</TooltipContent>
          </Tooltip>
          {/* Z-order buttons */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={e => {
                  e.stopPropagation();
                  if (onBringForward) onBringForward(element.id);
                }}
                className="absolute -top-8 right-10 px-2 py-1 bg-blue-500 text-white rounded text-xs flex items-center hover:bg-blue-600 transition-colors shadow-md"
              >
                <span>↑</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>Bring Forward</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={e => {
                  e.stopPropagation();
                  if (onSendBackward) onSendBackward(element.id);
                }}
                className="absolute -top-8 right-2 px-2 py-1 bg-blue-500 text-white rounded text-xs flex items-center hover:bg-blue-600 transition-colors shadow-md"
              >
                <span>↓</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>Send Backward</TooltipContent>
          </Tooltip>
          {/* Aspect ratio lock indicator (if resizing) */}
          {isResizing && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs flex items-center bg-gray-800 text-white`}
                >
                  {isAspectRatioLocked ? "Aspect ratio locked" : "Free resize"} (hold Shift)
                </div>
              </TooltipTrigger>
              <TooltipContent>Hold Shift to lock aspect ratio when resizing</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      )}
      
      {/* Enhanced resize handles */}
      {isSelected && !element.isPinned && (
        <>
          <ResizeHandle position="nw" cursor="nw-resize" />
          <ResizeHandle position="n" cursor="n-resize" />
          <ResizeHandle position="ne" cursor="ne-resize" />
          <ResizeHandle position="w" cursor="w-resize" />
          <ResizeHandle position="e" cursor="e-resize" />
          <ResizeHandle position="sw" cursor="sw-resize" />
          <ResizeHandle position="s" cursor="s-resize" />
          <ResizeHandle position="se" cursor="se-resize" />
        </>
      )}
      
      {/* Enhanced tooltip with better styling */}
      {isHovered && !isSelected && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-md whitespace-nowrap z-50 shadow-lg">
          <div className="text-center">
            <div className="font-medium">{element.type.toUpperCase()}</div>
            <div className="text-gray-300">{element.width}×{element.height}px</div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

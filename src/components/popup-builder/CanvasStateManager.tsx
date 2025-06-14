
import { useState, useRef, useCallback } from "react";
import { CanvasState } from "@/components/PopupBuilder";
import { PopupElement } from "@/components/PopupElements";
import { PopupLayout } from "@/components/LayoutSelector";

interface CanvasStateManagerProps {
  initialCanvasState: CanvasState;
  onCanvasStateChange: (state: CanvasState) => void;
}

export const useCanvasStateManager = (initialCanvasState: CanvasState) => {
  const [canvasState, setCanvasState] = useState<CanvasState>(initialCanvasState);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  
  const historyRef = useRef<CanvasState[]>([canvasState]);
  const historyIndexRef = useRef(0);

  const updateCanvasState = useCallback((updates: Partial<CanvasState>) => {
    setCanvasState(prev => {
      const newState = { ...prev, ...updates };
      
      // Add to history
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push(newState);
      historyIndexRef.current = historyRef.current.length - 1;
      
      // Limit history size
      if (historyRef.current.length > 50) {
        historyRef.current = historyRef.current.slice(-50);
        historyIndexRef.current = historyRef.current.length - 1;
      }
      
      return newState;
    });
  }, []);

  const handleLayoutChange = useCallback((layout: PopupLayout) => {
    console.log('Layout changed:', layout);
    updateCanvasState({
      layout,
      width: layout.dimensions.width,
      height: layout.dimensions.height
    });
  }, [updateCanvasState]);

  const handleBackgroundChange = useCallback((type: 'color' | 'image' | 'gradient', value: string) => {
    const updates: Partial<CanvasState> = { backgroundType: type };
    
    if (type === 'color') {
      updates.backgroundColor = value;
      updates.backgroundImage = undefined;
      updates.backgroundGradient = undefined;
    } else if (type === 'image') {
      updates.backgroundImage = value;
      updates.backgroundColor = "#ffffff";
      updates.backgroundGradient = undefined;
    } else if (type === 'gradient') {
      updates.backgroundGradient = value;
      updates.backgroundColor = "#ffffff";
      updates.backgroundImage = undefined;
    }
    
    updateCanvasState(updates);
  }, [updateCanvasState]);

  const addElement = useCallback((element: PopupElement) => {
    const newElement = {
      ...element,
      zIndex: Math.max(...canvasState.elements.map(el => el.zIndex), 0) + 1
    };
    
    updateCanvasState({
      elements: [...canvasState.elements, newElement]
    });
    
    setSelectedElementIds([newElement.id]);
  }, [canvasState.elements, updateCanvasState]);

  const updateElement = useCallback((id: string, updates: Partial<PopupElement>) => {
    updateCanvasState({
      elements: canvasState.elements.map(el => 
        el.id === id ? { ...el, ...updates } as PopupElement : el
      )
    });
  }, [canvasState.elements, updateCanvasState]);

  const deleteElements = useCallback((ids: string[]) => {
    updateCanvasState({
      elements: canvasState.elements.filter(el => !ids.includes(el.id))
    });
    setSelectedElementIds([]);
  }, [canvasState.elements, updateCanvasState]);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      setCanvasState(historyRef.current[historyIndexRef.current]);
      setSelectedElementIds([]);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      setCanvasState(historyRef.current[historyIndexRef.current]);
      setSelectedElementIds([]);
    }
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  return {
    canvasState,
    selectedElementIds,
    setCanvasState,
    setSelectedElementIds,
    updateCanvasState,
    handleLayoutChange,
    handleBackgroundChange,
    addElement,
    updateElement,
    deleteElements,
    undo,
    redo,
    canUndo,
    canRedo
  };
};

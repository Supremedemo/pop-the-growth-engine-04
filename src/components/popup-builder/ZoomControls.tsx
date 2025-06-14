
import { useCallback } from "react";
import { CanvasState } from "@/components/PopupBuilder";

interface ZoomControlsProps {
  canvasState: CanvasState;
  onUpdateCanvasState: (updates: Partial<CanvasState>) => void;
}

export const useZoomControls = ({ canvasState, onUpdateCanvasState }: ZoomControlsProps) => {
  const zoomIn = useCallback(() => {
    onUpdateCanvasState({ zoom: Math.min(canvasState.zoom * 1.25, 3) });
  }, [canvasState.zoom, onUpdateCanvasState]);

  const zoomOut = useCallback(() => {
    onUpdateCanvasState({ zoom: Math.max(canvasState.zoom / 1.25, 0.25) });
  }, [canvasState.zoom, onUpdateCanvasState]);

  const resetZoom = useCallback(() => {
    onUpdateCanvasState({ zoom: 1 });
  }, [onUpdateCanvasState]);

  const toggleGrid = useCallback(() => {
    onUpdateCanvasState({ showGrid: !canvasState.showGrid });
  }, [canvasState.showGrid, onUpdateCanvasState]);

  return {
    zoomIn,
    zoomOut,
    resetZoom,
    toggleGrid
  };
};

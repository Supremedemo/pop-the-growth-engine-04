
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Eye, 
  Save, 
  Smartphone,
  Monitor,
  Grid,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { ElementToolbar } from "./ElementToolbar";
import { PropertyPanel } from "./PropertyPanel";
import { LayoutSelector, PopupLayout } from "./LayoutSelector";
import { CanvasEditor } from "./CanvasEditor";
import { LayerPanel } from "./LayerPanel";
import { AlignmentTools } from "./AlignmentTools";
import { PopupElement } from "./PopupElements";

interface PopupBuilderProps {
  onBack: () => void;
}

export interface CanvasState {
  width: number;
  height: number;
  backgroundColor: string;
  elements: PopupElement[];
  zoom: number;
  showGrid: boolean;
  gridSize: number;
}

export const PopupBuilder = ({ onBack }: PopupBuilderProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    width: 500,
    height: 400,
    backgroundColor: "#ffffff",
    elements: [],
    zoom: 1,
    showGrid: true,
    gridSize: 8
  });

  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [popupLayout, setPopupLayout] = useState<PopupLayout>({
    id: "modal-center",
    name: "Modal - Center",
    type: "modal",
    description: "Classic popup in the center of screen",
    dimensions: { width: 500, height: 400 },
    position: "center"
  });

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

  const zoomIn = useCallback(() => {
    updateCanvasState({ zoom: Math.min(canvasState.zoom * 1.25, 3) });
  }, [canvasState.zoom, updateCanvasState]);

  const zoomOut = useCallback(() => {
    updateCanvasState({ zoom: Math.max(canvasState.zoom / 1.25, 0.25) });
  }, [canvasState.zoom, updateCanvasState]);

  const resetZoom = useCallback(() => {
    updateCanvasState({ zoom: 1 });
  }, [updateCanvasState]);

  const toggleGrid = useCallback(() => {
    updateCanvasState({ showGrid: !canvasState.showGrid });
  }, [canvasState.showGrid, updateCanvasState]);

  const selectedElements = canvasState.elements.filter(el => selectedElementIds.includes(el.id));

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold">Canvas Editor</h1>
            <div className="text-sm text-slate-500">
              {selectedElements.length > 0 && (
                <span>{selectedElements.length} element{selectedElements.length > 1 ? 's' : ''} selected</span>
              )}
            </div>
          </div>
          
          {/* Enhanced Toolbar */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={undo}
              disabled={!canUndo}
              className="disabled:opacity-50"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={redo}
              disabled={!canRedo}
              className="disabled:opacity-50"
            >
              <Redo className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-slate-300" />
            <Button variant="outline" size="sm" onClick={zoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetZoom}
              className="min-w-[60px] text-center"
            >
              {Math.round(canvasState.zoom * 100)}%
            </Button>
            <Button variant="outline" size="sm" onClick={zoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button 
              variant={canvasState.showGrid ? "default" : "outline"} 
              size="sm" 
              onClick={toggleGrid}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-slate-300" />
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel */}
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <ElementToolbar onAddElement={addElement} />
          
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="p-0">
              <PropertyPanel 
                selectedElement={selectedElements[0] || null}
                onUpdateElement={updateElement}
              />
            </TabsContent>

            <TabsContent value="layers" className="p-4">
              <LayerPanel 
                elements={canvasState.elements}
                selectedElementIds={selectedElementIds}
                onSelectElements={setSelectedElementIds}
                onUpdateElement={updateElement}
                onDeleteElements={deleteElements}
              />
            </TabsContent>

            <TabsContent value="layout" className="p-4">
              <LayoutSelector 
                selectedLayout={popupLayout}
                onLayoutChange={setPopupLayout}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Alignment Tools */}
          {selectedElements.length > 1 && (
            <div className="bg-white border-b border-slate-200 p-2">
              <AlignmentTools 
                selectedElements={selectedElements}
                onUpdateElements={(updates) => {
                  updates.forEach(({ id, ...elementUpdates }) => {
                    updateElement(id, elementUpdates);
                  });
                }}
              />
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 bg-slate-100 overflow-hidden">
            <CanvasEditor
              canvasState={canvasState}
              selectedElementIds={selectedElementIds}
              onSelectElements={setSelectedElementIds}
              onUpdateElement={updateElement}
              onDeleteElements={deleteElements}
              previewDevice={previewDevice}
            />
          </div>

          {/* Device Toggle & Status Bar */}
          <div className="bg-white border-t border-slate-200 p-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  variant={previewDevice === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("desktop")}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                </Button>
                <Button
                  variant={previewDevice === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("mobile")}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </Button>
              </div>
              
              <div className="text-sm text-slate-500">
                {canvasState.elements.length} element{canvasState.elements.length !== 1 ? 's' : ''} • 
                Canvas: {canvasState.width}×{canvasState.height}px
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

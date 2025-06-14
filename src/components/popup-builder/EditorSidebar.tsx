
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { ElementToolbar } from "@/components/ElementToolbar";
import { LayoutSelector, PopupLayout } from "@/components/LayoutSelector";
import { PropertyPanel } from "@/components/PropertyPanel";
import { LayerPanel } from "@/components/LayerPanel";
import { BackgroundControls } from "@/components/BackgroundControls";
import { PopupElement } from "@/components/PopupElements";
import { CanvasState } from "@/components/PopupBuilder";

interface EditorSidebarProps {
  canvasState: CanvasState;
  selectedElements: PopupElement[];
  onAddElement: (element: PopupElement) => void;
  onLayoutChange: (layout: PopupLayout) => void;
  onUpdateElement: (id: string, updates: Partial<PopupElement>) => void;
  onSelectElements: (ids: string[]) => void;
  onDeleteElements: (ids: string[]) => void;
  onBackgroundChange: (type: 'color' | 'image' | 'gradient', value: string) => void;
  onUpdateCanvasState: (updates: Partial<CanvasState>) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export const EditorSidebar = ({
  canvasState,
  selectedElements,
  onAddElement,
  onLayoutChange,
  onUpdateElement,
  onSelectElements,
  onDeleteElements,
  onBackgroundChange,
  onUpdateCanvasState,
  onFileUpload,
  isUploading
}: EditorSidebarProps) => {
  return (
    <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
      <ElementToolbar onAddElement={onAddElement} />
      
      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid w-full grid-cols-4 m-4">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="p-4">
          <LayoutSelector 
            selectedLayout={canvasState.layout}
            onLayoutChange={onLayoutChange}
          />
        </TabsContent>

        <TabsContent value="properties" className="p-0">
          <PropertyPanel 
            selectedElement={selectedElements[0] || null}
            onUpdateElement={onUpdateElement}
          />
        </TabsContent>

        <TabsContent value="layers" className="p-4">
          <LayerPanel 
            elements={canvasState.elements}
            selectedElementIds={selectedElements.map(el => el.id)}
            onSelectElements={onSelectElements}
            onUpdateElement={onUpdateElement}
            onDeleteElements={onDeleteElements}
          />
        </TabsContent>

        <TabsContent value="settings" className="p-4">
          <div className="space-y-6">
            <BackgroundControls
              backgroundColor={canvasState.backgroundColor}
              backgroundImage={canvasState.backgroundImage}
              backgroundGradient={canvasState.backgroundGradient}
              onBackgroundChange={onBackgroundChange}
            />
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Upload Image</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Overlay Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showOverlay">Show Overlay</Label>
                  <input
                    id="showOverlay"
                    type="checkbox"
                    checked={canvasState.showOverlay}
                    onChange={(e) => onUpdateCanvasState({ showOverlay: e.target.checked })}
                    className="rounded"
                  />
                </div>
                {canvasState.showOverlay && (
                  <>
                    <div>
                      <Label htmlFor="overlayColor">Overlay Color</Label>
                      <input
                        id="overlayColor"
                        type="color"
                        value={canvasState.overlayColor}
                        onChange={(e) => onUpdateCanvasState({ overlayColor: e.target.value })}
                        className="w-full h-8 rounded"
                      />
                    </div>
                    <div>
                      <Label htmlFor="overlayOpacity">Opacity: {canvasState.overlayOpacity}%</Label>
                      <input
                        id="overlayOpacity"
                        type="range"
                        min="0"
                        max="100"
                        value={canvasState.overlayOpacity}
                        onChange={(e) => onUpdateCanvasState({ overlayOpacity: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Close Button</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showCloseButton">Show Close Button</Label>
                  <input
                    id="showCloseButton"
                    type="checkbox"
                    checked={canvasState.showCloseButton}
                    onChange={(e) => onUpdateCanvasState({ showCloseButton: e.target.checked })}
                    className="rounded"
                  />
                </div>
                {canvasState.showCloseButton && (
                  <div>
                    <Label htmlFor="closeButtonPosition">Position</Label>
                    <select
                      id="closeButtonPosition"
                      value={canvasState.closeButtonPosition}
                      onChange={(e) => onUpdateCanvasState({ closeButtonPosition: e.target.value as any })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

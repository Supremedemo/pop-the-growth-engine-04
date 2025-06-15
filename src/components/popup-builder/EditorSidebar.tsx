
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Layers, Settings, Palette, Grid } from "lucide-react";
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
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col">
      {/* Element Toolbar */}
      <div className="border-b border-slate-200">
        <ElementToolbar onAddElement={onAddElement} />
      </div>
      
      {/* Tabbed Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="layout" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mx-3 mt-3">
            <TabsTrigger value="layout" className="text-xs">
              <Grid className="w-3 h-3 mr-1" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="properties" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              Style
            </TabsTrigger>
            <TabsTrigger value="layers" className="text-xs">
              <Layers className="w-3 h-3 mr-1" />
              Layers
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Canvas
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="layout" className="p-3 m-0">
              <LayoutSelector 
                selectedLayout={canvasState.layout}
                onLayoutChange={onLayoutChange}
              />
            </TabsContent>

            <TabsContent value="properties" className="p-0 m-0">
              <PropertyPanel 
                selectedElement={selectedElements[0] || null}
                onUpdateElement={onUpdateElement}
              />
            </TabsContent>

            <TabsContent value="layers" className="p-3 m-0">
              <LayerPanel 
                elements={canvasState.elements}
                selectedElementIds={selectedElements.map(el => el.id)}
                onSelectElements={onSelectElements}
                onUpdateElement={onUpdateElement}
                onDeleteElements={onDeleteElements}
              />
            </TabsContent>

            <TabsContent value="settings" className="p-3 m-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Background</h3>
                  <BackgroundControls
                    backgroundColor={canvasState.backgroundColor}
                    backgroundImage={canvasState.backgroundImage}
                    backgroundGradient={canvasState.backgroundGradient}
                    onBackgroundChange={onBackgroundChange}
                  />
                </div>
                
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
                      className="w-full"
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
                      <Label htmlFor="showOverlay" className="text-sm">Show Overlay</Label>
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
                          <Label htmlFor="overlayColor" className="text-sm">Overlay Color</Label>
                          <input
                            id="overlayColor"
                            type="color"
                            value={canvasState.overlayColor}
                            onChange={(e) => onUpdateCanvasState({ overlayColor: e.target.value })}
                            className="w-full h-8 rounded mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="overlayOpacity" className="text-sm">
                            Opacity: {canvasState.overlayOpacity}%
                          </Label>
                          <input
                            id="overlayOpacity"
                            type="range"
                            min="0"
                            max="100"
                            value={canvasState.overlayOpacity}
                            onChange={(e) => onUpdateCanvasState({ overlayOpacity: parseInt(e.target.value) })}
                            className="w-full mt-1"
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
                      <Label htmlFor="showCloseButton" className="text-sm">Show Close Button</Label>
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
                        <Label htmlFor="closeButtonPosition" className="text-sm">Position</Label>
                        <select
                          id="closeButtonPosition"
                          value={canvasState.closeButtonPosition}
                          onChange={(e) => onUpdateCanvasState({ closeButtonPosition: e.target.value as any })}
                          className="w-full p-2 border rounded mt-1 text-sm"
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
          </div>
        </Tabs>
      </div>
    </div>
  );
};

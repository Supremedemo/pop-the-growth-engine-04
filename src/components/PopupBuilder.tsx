
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  GripVertical,
  Plus,
  Save,
  Download,
  Upload,
  Eye,
  X,
  Smartphone,
  Monitor,
  LayoutDashboard,
  Layers,
  Lock,
  Unlock,
  Copy,
  Trash2,
  Settings
} from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { ElementRenderer, PopupElement } from "./PopupElements";
import { CanvasEditor } from "./CanvasEditor";
import { TemplateGallery } from "./TemplateGallery";
import { PreviewDialog } from "./PreviewDialog";
import { PublishDialog } from "./PublishDialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { SpinWheelGame } from "./SpinWheelGame";

export interface CanvasState {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundType: 'color' | 'image' | 'gradient';
  backgroundImage?: string;
  backgroundGradient?: string;
  elements: PopupElement[];
  showGrid: boolean;
  gridSize: number;
  zoom: number;
  layout: Layout;
}

export interface Layout {
  type: 'modal' | 'banner' | 'slide-in' | 'fullscreen';
  name: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  dimensions?: {
    maxWidth?: string;
  };
}

interface PopupBuilderProps {
  onBack?: () => void;
}

const defaultLayouts: Layout[] = [
  { type: 'modal', name: 'Modal' },
  { type: 'banner', name: 'Top Banner', position: 'top' },
  { type: 'banner', name: 'Bottom Banner', position: 'bottom' },
  { type: 'slide-in', name: 'Slide-in Left', position: 'left' },
  { type: 'slide-in', name: 'Slide-in Right', position: 'right' },
  { type: 'fullscreen', name: 'Fullscreen' }
];

const initialCanvasState: CanvasState = {
  width: 500,
  height: 400,
  backgroundColor: "#f9f9f9",
  backgroundType: 'color',
  elements: [],
  showGrid: true,
  gridSize: 20,
  zoom: 1,
  layout: defaultLayouts[0]
};

const layoutsConfig = {
  modal: { width: 500, height: 400 },
  banner: { width: 728, height: 90 },
  'slide-in': { width: 300, height: 500 },
  fullscreen: { width: window.innerWidth, height: window.innerHeight }
};

export const PopupBuilder = ({ onBack }: PopupBuilderProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>(initialCanvasState);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [showTemplateGallery, setShowTemplateGallery] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [templateData, setTemplateData] = useState<any>(null);

  React.useEffect(() => {
    if (templateData) {
      // Handle game templates
      if (templateData.type === 'game') {
        setShowTemplateGallery(false);
        setIsGameMode(true);
        setGameType(templateData.gameType);
        return;
      }

      // Handle canvas templates (existing logic)
      if (templateData.elements) {
        const validElements = templateData.elements.map((el: any) => {
          // Ensure each element has a proper type
          if (el.type === 'text') {
            return {
              type: 'text' as const,
              id: el.id || uuidv4(),
              x: el.x || 0,
              y: el.y || 0,
              width: el.width || 200,
              height: el.height || 50,
              zIndex: el.zIndex || 1,
              content: el.content || 'Text',
              fontSize: el.fontSize || 16,
              fontWeight: el.fontWeight || 'normal',
              textAlign: el.textAlign || 'left',
              color: el.color || '#000000'
            };
          } else if (el.type === 'image') {
            return {
              type: 'image' as const,
              id: el.id || uuidv4(),
              x: el.x || 0,
              y: el.y || 0,
              width: el.width || 200,
              height: el.height || 150,
              zIndex: el.zIndex || 1,
              src: el.src || '',
              alt: el.alt || 'Image',
              borderRadius: el.borderRadius || 0
            };
          }
          return null;
        }).filter(Boolean);

        setCanvasState(prev => ({
          ...prev,
          width: templateData.width || 500,
          height: templateData.height || 400,
          backgroundColor: templateData.backgroundColor || "#ffffff",
          backgroundType: templateData.backgroundType || 'color',
          backgroundGradient: templateData.backgroundGradient || "",
          elements: validElements
        }));
        setShowTemplateGallery(false);
      }
    }
  }, [templateData]);

  // Add game mode state
  const [isGameMode, setIsGameMode] = useState(false);
  const [gameType, setGameType] = useState<string>('');

  const handleBackToTemplates = () => {
    setShowTemplateGallery(true);
    setIsGameMode(false);
    setGameType('');
  };

  const handleGameCustomize = (gameConfig: any) => {
    // Store game configuration for publishing
    console.log('Game configuration updated:', gameConfig);
  };

  const handleSelectTemplate = (templateData: any) => {
    setTemplateData(templateData);
  };

  const handleAddElement = (element: PopupElement) => {
    setCanvasState((prev) => ({
      ...prev,
      elements: [...prev.elements, element],
    }));
  };

  const handleSelectElements = (ids: string[]) => {
    setSelectedElementIds(ids);
  };

  const handleUpdateElement = (id: string, updates: Partial<PopupElement>) => {
    setCanvasState((prev) => ({
      ...prev,
      elements: prev.elements.map((element) =>
        element.id === id ? { ...element, ...updates } : element
      ),
    }));
  };

  const handleDeleteElements = (ids: string[]) => {
    setCanvasState((prev) => ({
      ...prev,
      elements: prev.elements.filter((element) => !ids.includes(element.id)),
    }));
    setSelectedElementIds([]);
  };

  const handleCanvasStateUpdate = (updates: Partial<CanvasState>) => {
    setCanvasState((prev) => ({ ...prev, ...updates }));
  };

  const handleLayoutChange = (layout: Layout) => {
    handleCanvasStateUpdate({
      layout: layout,
      width: layoutsConfig[layout.type]?.width || 500,
      height: layoutsConfig[layout.type]?.height || 400
    });
  };

  if (showTemplateGallery) {
    return <TemplateGallery onSelectTemplate={handleSelectTemplate} />;
  }

  if (isGameMode) {
    return (
      <div className="h-screen bg-background">
        <div className="border-b bg-card">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleBackToTemplates}>
                ← Back to Templates
              </Button>
              <div>
                <h1 className="text-xl font-semibold">
                  {gameType === 'spin-wheel' ? 'Spin Wheel Game Editor' : 
                   gameType === 'scratch-card' ? 'Scratch Card Game Editor' :
                   'Game Editor'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Customize your interactive game
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setShowPreview(true)}>
                Preview
              </Button>
              <Button variant="outline" onClick={() => setShowPublishDialog(true)}>
                Publish
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {gameType === 'spin-wheel' && (
            <SpinWheelGame 
              isEditorMode={true}
              onCustomize={handleGameCustomize}
            />
          )}
          {gameType === 'scratch-card' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Scratch Card Game</h2>
                <p className="text-gray-600">Coming soon! This game editor is under development.</p>
              </div>
            </div>
          )}
          {gameType === 'coming-soon' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Game Editor</h2>
                <p className="text-gray-600">This game editor is coming soon!</p>
                <Button onClick={handleBackToTemplates} className="mt-4">
                  Back to Templates
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Dialogs */}
        {showPreview && (
          <PreviewDialog
            canvasState={canvasState}
            gameMode={{
              isActive: true,
              type: gameType,
              config: {} // Game config would be passed here
            }}
            onClose={() => setShowPreview(false)}
          />
        )}

        {showPublishDialog && (
          <PublishDialog
            open={showPublishDialog}
            onOpenChange={setShowPublishDialog}
            templateName={`${gameType} Game`}
            canvasData={canvasState}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setShowTemplateGallery(true)}>
              ← Back to Templates
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Popup Builder</h1>
              <p className="text-sm text-muted-foreground">
                Design your custom popup
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              Preview
            </Button>
            <Button variant="outline" onClick={() => setShowPublishDialog(true)}>
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-64 border-r bg-secondary">
          <div className="px-4 py-6">
            <h2 className="mb-2 font-semibold">Layout</h2>
            <Select onValueChange={(value) => handleLayoutChange(defaultLayouts.find(l => l.type === value) || defaultLayouts[0])}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a layout" />
              </SelectTrigger>
              <SelectContent>
                {defaultLayouts.map((layout) => (
                  <SelectItem key={layout.type} value={layout.type}>
                    {layout.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="px-4 py-6">
            <h2 className="mb-2 font-semibold">Background</h2>
            <Select onValueChange={(value) => handleCanvasStateUpdate({ backgroundType: value as any })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select background type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="color">Color</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
              </SelectContent>
            </Select>

            {canvasState.backgroundType === "color" && (
              <div className="mt-4">
                <Label htmlFor="background-color">Color</Label>
                <Input
                  type="color"
                  id="background-color"
                  value={canvasState.backgroundColor}
                  onChange={(e) =>
                    handleCanvasStateUpdate({ backgroundColor: e.target.value })
                  }
                />
              </div>
            )}

            {canvasState.backgroundType === "image" && (
              <div className="mt-4">
                <Label htmlFor="background-image">Image URL</Label>
                <Input
                  type="text"
                  id="background-image"
                  placeholder="Enter image URL"
                  value={canvasState.backgroundImage || ""}
                  onChange={(e) =>
                    handleCanvasStateUpdate({ backgroundImage: e.target.value })
                  }
                />
              </div>
            )}

            {canvasState.backgroundType === "gradient" && (
              <div className="mt-4">
                <Label htmlFor="background-gradient">Gradient</Label>
                <Input
                  type="text"
                  id="background-gradient"
                  placeholder="linear-gradient(to right, #43cea2, #185a9d)"
                  value={canvasState.backgroundGradient || ""}
                  onChange={(e) =>
                    handleCanvasStateUpdate({ backgroundGradient: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="px-4 py-6">
            <h2 className="mb-2 font-semibold">Canvas</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-grid">Show Grid</Label>
                <Switch
                  id="show-grid"
                  checked={canvasState.showGrid}
                  onCheckedChange={(checked) =>
                    handleCanvasStateUpdate({ showGrid: checked })
                  }
                />
              </div>

              <div>
                <Label htmlFor="grid-size">Grid Size: {canvasState.gridSize}px</Label>
                <Slider
                  id="grid-size"
                  defaultValue={[canvasState.gridSize]}
                  min={10}
                  max={50}
                  step={5}
                  onValueChange={(value) =>
                    handleCanvasStateUpdate({ gridSize: value[0] })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="snap-to-grid">Snap to Grid</Label>
                <Switch
                  id="snap-to-grid"
                  checked={canvasState.showGrid}
                  disabled={!canvasState.showGrid}
                  onCheckedChange={(checked) =>
                    handleCanvasStateUpdate({ showGrid: checked })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="px-4 py-6">
            <h2 className="mb-2 font-semibold">Elements</h2>
            {selectedElementIds.length === 1 ? (
              <>
                {canvasState.elements.filter(el => selectedElementIds.includes(el.id)).map(element => {
                  switch (element.type) {
                    case "text":
                      return (
                        <div key={element.id} className="space-y-4">
                          <Label htmlFor="text-content">Content</Label>
                          <Textarea
                            id="text-content"
                            value={element.content}
                            onChange={(e) =>
                              handleUpdateElement(element.id, { content: e.target.value })
                            }
                          />

                          <Label htmlFor="font-size">Font Size</Label>
                          <Input
                            type="number"
                            id="font-size"
                            value={element.fontSize}
                            onChange={(e) =>
                              handleUpdateElement(element.id, { fontSize: parseInt(e.target.value) })
                            }
                          />

                          <Label htmlFor="font-weight">Font Weight</Label>
                          <Select onValueChange={(value) => handleUpdateElement(element.id, { fontWeight: value })}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={element.fontWeight} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="bold">Bold</SelectItem>
                              <SelectItem value="italic">Italic</SelectItem>
                            </SelectContent>
                          </Select>

                          <Label htmlFor="text-align">Text Align</Label>
                          <Select onValueChange={(value) => handleUpdateElement(element.id, { textAlign: value })}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={element.textAlign} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Left</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                          </Select>

                          <Label htmlFor="text-color">Text Color</Label>
                          <Input
                            type="color"
                            id="text-color"
                            value={element.color}
                            onChange={(e) =>
                              handleUpdateElement(element.id, { color: e.target.value })
                            }
                          />
                        </div>
                      );
                    case "image":
                      return (
                        <div key={element.id} className="space-y-4">
                          <Label htmlFor="image-src">Image URL</Label>
                          <Input
                            type="text"
                            id="image-src"
                            value={element.src}
                            onChange={(e) =>
                              handleUpdateElement(element.id, { src: e.target.value })
                            }
                          />

                          <Label htmlFor="image-alt">Alt Text</Label>
                          <Input
                            type="text"
                            id="image-alt"
                            value={element.alt}
                            onChange={(e) =>
                              handleUpdateElement(element.id, { alt: e.target.value })
                            }
                          />

                          <Label htmlFor="border-radius">Border Radius</Label>
                          <Input
                            type="number"
                            id="border-radius"
                            value={element.borderRadius}
                            onChange={(e) =>
                              handleUpdateElement(element.id, { borderRadius: parseInt(e.target.value) })
                            }
                          />
                        </div>
                      );
                    case "form":
                      return (
                        <div key={element.id} className="space-y-4">
                          <Label htmlFor="button-text">Button Text</Label>
                          <Input
                            type="text"
                            id="button-text"
                            value={element.buttonText}
                            onChange={(e) =>
                              handleUpdateElement(element.id, { buttonText: e.target.value })
                            }
                          />

                          <Label htmlFor="button-color">Button Color</Label>
                          <Input
                            type="color"
                            id="button-color"
                            value={element.buttonColor}
                            onChange={(e) =>
                              handleUpdateElement(element.id, { buttonColor: e.target.value })
                            }
                          />
                        </div>
                      );
                    case "timer":
                      return (
                        <div key={element.id} className="space-y-4">
                          <Label htmlFor="timer-duration">Duration (seconds)</Label>
                          <Input
                            type="number"
                            id="timer-duration"
                            value={element.duration}
                            onChange={(e) =>
                              handleUpdateElement(element.id, { duration: parseInt(e.target.value) })
                            }
                          />

                          <Label htmlFor="timer-format">Format</Label>
                          <Input
                            type="text"
                            id="timer-format"
                            value={element.format}
                            onChange={(e) =>
                              handleUpdateElement(element.id, { format: e.target.value })
                            }
                          />

                          <Label htmlFor="timer-background-color">Background Color</Label>
                          <Input
                            type="color"
                            id="timer-background-color"
                            value={element.backgroundColor}
                            onChange={(e) =>
                              handleUpdateElement(element.id, { backgroundColor: e.target.value })
                            }
                          />

                          <Label htmlFor="timer-text-color">Text Color</Label>
                          <Input
                            type="color"
                            id="timer-text-color"
                            value={element.textColor}
                            onChange={(e) =>
                              handleUpdateElement(element.id, { textColor: e.target.value })
                            }
                          />
                        </div>
                      );
                    case "html":
                      return (
                        <div key={element.id} className="space-y-4">
                          <Label htmlFor="html-content">HTML Content</Label>
                          <Textarea
                            id="html-content"
                            value={element.htmlContent}
                            onChange={(e) =>
                              handleUpdateElement(element.id, { htmlContent: e.target.value })
                            }
                          />
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select an element to edit its properties.
              </p>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-muted">
          <CanvasEditor
            canvasState={canvasState}
            selectedElementIds={selectedElementIds}
            onSelectElements={handleSelectElements}
            onUpdateElement={handleUpdateElement}
            onDeleteElements={handleDeleteElements}
            previewDevice={previewDevice}
            onAddElement={handleAddElement}
          />
        </div>

        {/* Toolbar */}
        <div className="w-48 border-l bg-secondary flex flex-col items-center justify-start pt-4">
          <h2 className="mb-4 font-semibold">Add Elements</h2>
          <div className="flex flex-col items-center space-y-3">
            <Button
              variant="outline"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('application/element-type', 'text')}
            >
              Text
            </Button>
            <Button
              variant="outline"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('application/element-type', 'image')}
            >
              Image
            </Button>
            <Button
              variant="outline"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('application/element-type', 'form')}
            >
              Form
            </Button>
            <Button
              variant="outline"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('application/element-type', 'timer')}
            >
              Timer
            </Button>
            <Button
              variant="outline"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('application/element-type', 'html')}
            >
              HTML
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {showPreview && (
        <PreviewDialog
          canvasState={canvasState}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showPublishDialog && (
        <PublishDialog
          open={showPublishDialog}
          onOpenChange={setShowPublishDialog}
          templateName="Popup"
          canvasData={canvasState}
        />
      )}
    </div>
  );
};

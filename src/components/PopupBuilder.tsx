import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { ElementRenderer, PopupElement, TextElement, ImageElement, FormElement, TimerElement, CustomHtmlElementType } from "./PopupElements";
import { CanvasEditor } from "./CanvasEditor";
import { TemplateGallery } from "./TemplateGallery";
import { PreviewDialog } from "./PreviewDialog";
import { PublishDialog } from "./PublishDialog";
import { MultiStepFormElement } from "./MultiStepFormElement";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
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
  startWithTemplates?: boolean;
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

// Helper function to create properly typed elements
const createTypedElement = (el: any): PopupElement | null => {
  const baseElement = {
    id: el.id || uuidv4(),
    x: el.x || 0,
    y: el.y || 0,
    width: el.width || 200,
    height: el.height || 50,
    zIndex: el.zIndex || 1,
    isPinned: el.isPinned || false
  };

  switch (el.type) {
    case 'text': {
      return {
        ...baseElement,
        type: 'text' as const,
        content: el.content || 'Text',
        fontSize: el.fontSize || 16,
        fontWeight: el.fontWeight || 'normal',
        textAlign: el.textAlign || 'left',
        color: el.color || '#000000'
      } as TextElement;
    }
    case 'image': {
      return {
        ...baseElement,
        type: 'image' as const,
        src: el.src || '',
        alt: el.alt || 'Image',
        borderRadius: el.borderRadius || 0
      } as ImageElement;
    }
    case 'form': {
      return {
        ...baseElement,
        type: 'form' as const,
        fields: el.fields || [],
        buttonText: el.buttonText || 'Submit',
        buttonColor: el.buttonColor || '#000000'
      } as FormElement;
    }
    case 'timer': {
      return {
        ...baseElement,
        type: 'timer' as const,
        duration: el.duration || 60,
        format: el.format || 'mm:ss',
        backgroundColor: el.backgroundColor || '#000000',
        textColor: el.textColor || '#ffffff'
      } as TimerElement;
    }
    case 'html': {
      return {
        ...baseElement,
        type: 'html' as const,
        htmlContent: el.htmlContent || ''
      } as CustomHtmlElementType;
    }
    case 'multi-step-form': {
      return {
        ...baseElement,
        type: 'multi-step-form' as const,
        steps: el.steps || [],
        successPage: el.successPage || {
          title: 'Thank you!',
          message: 'Form submitted successfully',
          showCoupon: false,
          showDismissButton: true,
          dismissButtonText: 'Close',
          showRedirectButton: false,
          redirectButtonText: 'Continue'
        },
        buttonColor: el.buttonColor || '#3b82f6',
        backgroundColor: el.backgroundColor || '#ffffff'
      } as MultiStepFormElement;
    }
    default:
      return null;
  }
};

export const PopupBuilder = ({ onBack, startWithTemplates = true }: PopupBuilderProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>(initialCanvasState);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [showTemplateGallery, setShowTemplateGallery] = useState(startWithTemplates);
  const [showPreview, setShowPreview] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [templateData, setTemplateData] = useState<any>(null);
  const [showModeSelector, setShowModeSelector] = useState(!startWithTemplates);
  const { toast } = useToast();

  React.useEffect(() => {
    if (templateData) {
      // Handle game templates
      if (templateData.type === 'game') {
        setShowTemplateGallery(false);
        setShowModeSelector(false);
        setIsGameMode(true);
        setGameType(templateData.gameType);
        return;
      }

      // Handle canvas templates (existing logic)
      if (templateData.elements) {
        const validElements: PopupElement[] = templateData.elements
          .map(createTypedElement)
          .filter((el): el is PopupElement => el !== null);

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
        setShowModeSelector(false);
      }
    }
  }, [templateData]);

  // Add game mode state
  const [isGameMode, setIsGameMode] = useState(false);
  const [gameType, setGameType] = useState<string>('');

  const handleBackToTemplates = () => {
    setShowTemplateGallery(true);
    setShowModeSelector(false);
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

  const handleModeSelect = (mode: 'template' | 'diy') => {
    if (mode === 'template') {
      setShowTemplateGallery(true);
      setShowModeSelector(false);
    } else {
      setShowTemplateGallery(false);
      setShowModeSelector(false);
    }
  };

  const handleAddElement = (element: PopupElement) => {
    setCanvasState((prev) => ({
      ...prev,
      elements: [...prev.elements, element],
    }));
    
    // Auto-select the new element
    setSelectedElementIds([element.id]);
    
    toast({
      title: "Element Added",
      description: `${element.type} element has been added to the canvas.`,
    });
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
    
    toast({
      title: "Elements Deleted",
      description: `${ids.length} element(s) have been deleted.`,
    });
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
    
    toast({
      title: "Layout Changed",
      description: `Layout changed to ${layout.name}`,
    });
  };

  const handleDuplicateElements = () => {
    if (selectedElementIds.length === 0) return;
    
    const elementsToClone = canvasState.elements.filter(el => selectedElementIds.includes(el.id));
    const newElements = elementsToClone.map(el => ({
      ...el,
      id: uuidv4(),
      x: el.x + 20,
      y: el.y + 20,
      zIndex: Math.max(...canvasState.elements.map(e => e.zIndex), 0) + 1
    }));
    
    setCanvasState(prev => ({
      ...prev,
      elements: [...prev.elements, ...newElements]
    }));
    
    setSelectedElementIds(newElements.map(el => el.id));
    
    toast({
      title: "Elements Duplicated",
      description: `${newElements.length} element(s) have been duplicated.`,
    });
  };

  const handleSaveTemplate = () => {
    const templateData = {
      name: `Template ${Date.now()}`,
      ...canvasState
    };
    
    localStorage.setItem(`template_${Date.now()}`, JSON.stringify(templateData));
    
    toast({
      title: "Template Saved",
      description: "Your template has been saved locally.",
    });
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(canvasState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'popup-design.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Design Exported",
      description: "Your design has been exported as JSON.",
    });
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        setCanvasState(importedData);
        toast({
          title: "Design Imported",
          description: "Your design has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid JSON file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  // Mode selector screen
  if (showModeSelector) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Create Your Popup</h1>
            <p className="text-muted-foreground text-lg">Choose how you'd like to get started</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleModeSelect('template')}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                  </div>
                  <span>Use Template</span>
                </CardTitle>
                <CardDescription>
                  Start with professionally designed templates and customize them to your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Pre-designed layouts</li>
                  <li>• Interactive games</li>
                  <li>• Quick customization</li>
                  <li>• Best practices included</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleModeSelect('diy')}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <span>DIY Editor</span>
                </CardTitle>
                <CardDescription>
                  Build from scratch with our drag-and-drop canvas editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Complete creative control</li>
                  <li>• Drag & drop elements</li>
                  <li>• Custom layouts</li>
                  <li>• Advanced styling options</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {onBack && (
            <Button variant="outline" onClick={onBack} className="mt-8">
              ← Back to Dashboard
            </Button>
          )}
        </div>
      </div>
    );
  }

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
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" onClick={() => setShowPublishDialog(true)}>
                <Upload className="w-4 h-4 mr-2" />
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
    <div className="h-screen bg-background flex flex-col">
      {/* Enhanced Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setShowModeSelector(true)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">DIY Popup Builder</h1>
              <p className="text-sm text-muted-foreground">
                Design your custom popup from scratch
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Device Toggle */}
            <div className="flex items-center space-x-1 bg-secondary rounded-lg p-1">
              <Button
                variant={previewDevice === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewDevice("desktop")}
                className="h-8 px-3"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewDevice === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewDevice("mobile")}
                className="h-8 px-3"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-8" />
            
            {/* Action Buttons */}
            <Button variant="outline" size="sm" onClick={handleSaveTemplate}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExportJSON}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('import-file')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportJSON}
            />
            
            <Separator orientation="vertical" className="h-8" />
            
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={() => setShowPublishDialog(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Sidebar - Properties */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full bg-secondary overflow-y-auto">
              {/* Layout Section */}
              <div className="p-4 border-b">
                <h3 className="font-semibold mb-3 flex items-center">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Layout
                </h3>
                <Select 
                  value={canvasState.layout.type} 
                  onValueChange={(value) => {
                    const layout = defaultLayouts.find(l => l.type === value);
                    if (layout) handleLayoutChange(layout);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
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

              {/* Background Section */}
              <div className="p-4 border-b">
                <h3 className="font-semibold mb-3">Background</h3>
                <div className="space-y-3">
                  <Select 
                    value={canvasState.backgroundType} 
                    onValueChange={(value) => handleCanvasStateUpdate({ backgroundType: value as any })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">Solid Color</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                  </Select>

                  {canvasState.backgroundType === "color" && (
                    <div>
                      <Label className="text-xs">Background Color</Label>
                      <Input
                        type="color"
                        value={canvasState.backgroundColor}
                        onChange={(e) => handleCanvasStateUpdate({ backgroundColor: e.target.value })}
                        className="h-10 w-full"
                      />
                    </div>
                  )}

                  {canvasState.backgroundType === "gradient" && (
                    <div>
                      <Label className="text-xs">CSS Gradient</Label>
                      <Input
                        type="text"
                        placeholder="linear-gradient(45deg, #ff6b6b, #4ecdc4)"
                        value={canvasState.backgroundGradient || ""}
                        onChange={(e) => handleCanvasStateUpdate({ backgroundGradient: e.target.value })}
                      />
                    </div>
                  )}

                  {canvasState.backgroundType === "image" && (
                    <div>
                      <Label className="text-xs">Image URL</Label>
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={canvasState.backgroundImage || ""}
                        onChange={(e) => handleCanvasStateUpdate({ backgroundImage: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Canvas Settings */}
              <div className="p-4 border-b">
                <h3 className="font-semibold mb-3">Canvas Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Grid</Label>
                    <Switch
                      checked={canvasState.showGrid}
                      onCheckedChange={(checked) => handleCanvasStateUpdate({ showGrid: checked })}
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Grid Size: {canvasState.gridSize}px</Label>
                    <Slider
                      value={[canvasState.gridSize]}
                      min={10}
                      max={50}
                      step={5}
                      onValueChange={(value) => handleCanvasStateUpdate({ gridSize: value[0] })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Canvas Size</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Input
                        type="number"
                        placeholder="Width"
                        value={canvasState.width}
                        onChange={(e) => handleCanvasStateUpdate({ width: parseInt(e.target.value) || 500 })}
                      />
                      <Input
                        type="number"
                        placeholder="Height"
                        value={canvasState.height}
                        onChange={(e) => handleCanvasStateUpdate({ height: parseInt(e.target.value) || 400 })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Element Properties */}
              <div className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Properties
                </h3>
                
                {selectedElementIds.length === 1 ? (
                  <>
                    {canvasState.elements.filter(el => selectedElementIds.includes(el.id)).map(element => {
                      switch (element.type) {
                        case "text":
                          return (
                            <div key={element.id} className="space-y-4">
                              <div>
                                <Label className="text-xs">Content</Label>
                                <Textarea
                                  value={element.content}
                                  onChange={(e) => handleUpdateElement(element.id, { content: e.target.value })}
                                  className="mt-1"
                                  rows={3}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-xs">Font Size</Label>
                                  <Input
                                    type="number"
                                    value={element.fontSize}
                                    onChange={(e) => handleUpdateElement(element.id, { fontSize: parseInt(e.target.value) })}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Color</Label>
                                  <Input
                                    type="color"
                                    value={element.color}
                                    onChange={(e) => handleUpdateElement(element.id, { color: e.target.value })}
                                    className="mt-1 h-9"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label className="text-xs">Font Weight</Label>
                                <Select 
                                  value={element.fontWeight} 
                                  onValueChange={(value) => handleUpdateElement(element.id, { fontWeight: value })}
                                >
                                  <SelectTrigger className="w-full mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                    <SelectItem value="lighter">Light</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-xs">Text Align</Label>
                                <Select 
                                  value={element.textAlign} 
                                  onValueChange={(value) => handleUpdateElement(element.id, { textAlign: value })}
                                >
                                  <SelectTrigger className="w-full mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="left">Left</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="right">Right</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          );
                          
                        case "image":
                          return (
                            <div key={element.id} className="space-y-4">
                              <div>
                                <Label className="text-xs">Image URL</Label>
                                <Input
                                  type="url"
                                  value={element.src}
                                  onChange={(e) => handleUpdateElement(element.id, { src: e.target.value })}
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label className="text-xs">Alt Text</Label>
                                <Input
                                  type="text"
                                  value={element.alt}
                                  onChange={(e) => handleUpdateElement(element.id, { alt: e.target.value })}
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label className="text-xs">Border Radius</Label>
                                <Input
                                  type="number"
                                  value={element.borderRadius}
                                  onChange={(e) => handleUpdateElement(element.id, { borderRadius: parseInt(e.target.value) })}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          );
                          
                        case "form":
                          return (
                            <div key={element.id} className="space-y-4">
                              <div>
                                <Label className="text-xs">Button Text</Label>
                                <Input
                                  type="text"
                                  value={element.buttonText}
                                  onChange={(e) => handleUpdateElement(element.id, { buttonText: e.target.value })}
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label className="text-xs">Button Color</Label>
                                <Input
                                  type="color"
                                  value={element.buttonColor}
                                  onChange={(e) => handleUpdateElement(element.id, { buttonColor: e.target.value })}
                                  className="mt-1 h-9"
                                />
                              </div>
                            </div>
                          );
                          
                        case "timer":
                          return (
                            <div key={element.id} className="space-y-4">
                              <div>
                                <Label className="text-xs">Duration (seconds)</Label>
                                <Input
                                  type="number"
                                  value={element.duration}
                                  onChange={(e) => handleUpdateElement(element.id, { duration: parseInt(e.target.value) })}
                                  className="mt-1"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-xs">Background</Label>
                                  <Input
                                    type="color"
                                    value={element.backgroundColor}
                                    onChange={(e) => handleUpdateElement(element.id, { backgroundColor: e.target.value })}
                                    className="mt-1 h-9"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Text Color</Label>
                                  <Input
                                    type="color"
                                    value={element.textColor}
                                    onChange={(e) => handleUpdateElement(element.id, { textColor: e.target.value })}
                                    className="mt-1 h-9"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                          
                        case "html":
                          return (
                            <div key={element.id} className="space-y-4">
                              <div>
                                <Label className="text-xs">HTML Content</Label>
                                <Textarea
                                  value={element.htmlContent}
                                  onChange={(e) => handleUpdateElement(element.id, { htmlContent: e.target.value })}
                                  className="mt-1 font-mono text-xs"
                                  rows={6}
                                />
                              </div>
                            </div>
                          );
                          
                        case "multi-step-form":
                          return (
                            <div key={element.id} className="space-y-4">
                              <div>
                                <Label className="text-xs">Button Color</Label>
                                <Input
                                  type="color"
                                  value={element.buttonColor}
                                  onChange={(e) => handleUpdateElement(element.id, { buttonColor: e.target.value })}
                                  className="mt-1 h-9"
                                />
                              </div>

                              <div>
                                <Label className="text-xs">Background Color</Label>
                                <Input
                                  type="color"
                                  value={element.backgroundColor}
                                  onChange={(e) => handleUpdateElement(element.id, { backgroundColor: e.target.value })}
                                  className="mt-1 h-9"
                                />
                              </div>
                            </div>
                          );
                          
                        default:
                          return null;
                      }
                    })}
                  </>
                ) : selectedElementIds.length > 1 ? (
                  <div className="text-sm text-muted-foreground space-y-3">
                    <p>{selectedElementIds.length} elements selected</p>
                    <div className="space-y-2">
                      <Button size="sm" variant="outline" onClick={handleDuplicateElements} className="w-full">
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteElements(selectedElementIds)} className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select an element to edit its properties
                  </p>
                )}
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Canvas Area */}
          <ResizablePanel defaultSize={60}>
            <CanvasEditor
              canvasState={canvasState}
              selectedElementIds={selectedElementIds}
              onSelectElements={handleSelectElements}
              onUpdateElement={handleUpdateElement}
              onDeleteElements={handleDeleteElements}
              previewDevice={previewDevice}
              onAddElement={handleAddElement}
            />
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Right Sidebar - Elements & Layers */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full bg-secondary">
              <div className="p-4 border-b">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Elements
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('application/element-type', 'text')}
                    className="h-12 flex flex-col items-center justify-center text-xs"
                  >
                    <span className="text-lg mb-1">T</span>
                    Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('application/element-type', 'image')}
                    className="h-12 flex flex-col items-center justify-center text-xs"
                  >
                    <span className="text-lg mb-1">🖼️</span>
                    Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('application/element-type', 'form')}
                    className="h-12 flex flex-col items-center justify-center text-xs"
                  >
                    <span className="text-lg mb-1">📝</span>
                    Form
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('application/element-type', 'timer')}
                    className="h-12 flex flex-col items-center justify-center text-xs"
                  >
                    <span className="text-lg mb-1">⏰</span>
                    Timer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('application/element-type', 'html')}
                    className="h-12 flex flex-col items-center justify-center text-xs"
                  >
                    <span className="text-lg mb-1">⚡</span>
                    HTML
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('application/element-type', 'multi-step-form')}
                    className="h-12 flex flex-col items-center justify-center text-xs"
                  >
                    <span className="text-lg mb-1">📋</span>
                    Multi-Form
                  </Button>
                </div>
              </div>

              {/* Layers Panel */}
              <div className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Layers className="w-4 h-4 mr-2" />
                  Layers ({canvasState.elements.length})
                </h3>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {canvasState.elements
                    .sort((a, b) => b.zIndex - a.zIndex)
                    .map((element) => (
                      <div
                        key={element.id}
                        className={`p-2 rounded text-sm cursor-pointer flex items-center justify-between hover:bg-accent ${
                          selectedElementIds.includes(element.id) ? 'bg-accent' : ''
                        }`}
                        onClick={() => handleSelectElements([element.id])}
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="flex items-center space-x-1">
                            {element.isPinned ? (
                              <Lock className="w-3 h-3 text-muted-foreground" />
                            ) : (
                              <GripVertical className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                          <span className="truncate">
                            {element.type === 'text' ? element.content.slice(0, 20) : 
                             `${element.type} ${element.id.slice(-4)}`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateElement(element.id, { isPinned: !element.isPinned });
                            }}
                            className="h-6 w-6 p-0"
                          >
                            {element.isPinned ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  
                  {canvasState.elements.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No elements yet.<br />
                      Drag from the elements above.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
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
          templateName="Custom Popup"
          canvasData={canvasState}
        />
      )}
    </div>
  );
};

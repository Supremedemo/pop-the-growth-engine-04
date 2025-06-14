import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  ZoomOut,
  Plus,
  X,
  ExternalLink,
  FolderOpen,
  Upload
} from "lucide-react";
import { ElementToolbar } from "./ElementToolbar";
import { PropertyPanel } from "./PropertyPanel";
import { LayoutSelector, PopupLayout } from "./LayoutSelector";
import { CanvasEditor } from "./CanvasEditor";
import { LayerPanel } from "./LayerPanel";
import { AlignmentTools } from "./AlignmentTools";
import { BackgroundControls } from "./BackgroundControls";
import { PublishDialog } from "./PublishDialog";
import { PreviewDialog } from "./PreviewDialog";
import { PopupElement } from "./PopupElements";
import { useTemplates } from "@/hooks/useTemplates";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";

interface PopupBuilderProps {
  onBack: () => void;
  templateId?: string;
}

export interface CanvasState {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  backgroundType: 'color' | 'image' | 'gradient';
  elements: PopupElement[];
  zoom: number;
  showGrid: boolean;
  gridSize: number;
  layout: PopupLayout;
  showOverlay: boolean;
  overlayColor: string;
  overlayOpacity: number;
  showCloseButton: boolean;
  closeButtonPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const PopupBuilder = ({ onBack, templateId }: PopupBuilderProps) => {
  const { templates, saveTemplate, updateTemplate, isSaving } = useTemplates();
  const { createCampaign, isCreating } = useCampaigns();
  const { uploadFile, isUploading } = useFileUpload();

  const defaultLayout: PopupLayout = {
    id: "modal-center",
    name: "Modal - Center",
    type: "modal",
    description: "Classic popup in the center of screen",
    dimensions: { width: 500, height: 400 },
    position: "center"
  };

  // Load template if templateId is provided
  const loadedTemplate = templateId ? templates.find(t => t.id === templateId) : null;
  const initialCanvasState = loadedTemplate?.canvas_data || {
    width: 500,
    height: 400,
    backgroundColor: "#ffffff",
    backgroundType: 'color' as const,
    elements: [],
    zoom: 1,
    showGrid: true,
    gridSize: 8,
    layout: defaultLayout,
    showOverlay: true,
    overlayColor: "#000000",
    overlayOpacity: 50,
    showCloseButton: true,
    closeButtonPosition: 'top-right' as const
  };

  const [canvasState, setCanvasState] = useState<CanvasState>(initialCanvasState);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [currentTemplateId, setCurrentTemplateId] = useState(templateId);

  const historyRef = useRef<CanvasState[]>([canvasState]);
  const historyIndexRef = useRef(0);

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState(loadedTemplate?.name || "");
  const [templateDescription, setTemplateDescription] = useState(loadedTemplate?.description || "");
  const [templateTags, setTemplateTags] = useState<string[]>(loadedTemplate?.tags || []);
  const [newTag, setNewTag] = useState("");

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

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    if (currentTemplateId) {
      // Update existing template
      updateTemplate({
        id: currentTemplateId,
        updates: {
          name: templateName.trim(),
          description: templateDescription.trim() || null,
          canvas_data: canvasState,
          tags: templateTags
        }
      });
    } else {
      // Create new template
      saveTemplate({
        name: templateName.trim(),
        description: templateDescription.trim() || undefined,
        canvasData: canvasState,
        tags: templateTags
      });
    }
    
    setIsSaveDialogOpen(false);
  };

  const handleCreateCampaign = () => {
    if (!templateName.trim()) {
      toast.error('Please save the template first');
      return;
    }

    createCampaign({
      name: `${templateName} Campaign`,
      description: `Campaign based on ${templateName} template`,
      canvasData: canvasState,
      templateId: currentTemplateId
    });
  };

  const handleLoadTemplate = () => {
    setIsTemplateDialogOpen(true);
  };

  const loadTemplate = (template: any) => {
    setCanvasState(template.canvas_data);
    setCurrentTemplateId(template.id);
    setTemplateName(template.name);
    setTemplateDescription(template.description || "");
    setTemplateTags(template.tags || []);
    setIsTemplateDialogOpen(false);
    toast.success(`Template "${template.name}" loaded successfully!`);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadedFile = await uploadFile(file, '/popup-assets/');
      handleBackgroundChange('image', uploadedFile.url);
      toast.success('Image uploaded and set as background!');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !templateTags.includes(newTag.trim())) {
      setTemplateTags([...templateTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTemplateTags(templateTags.filter(tag => tag !== tagToRemove));
  };

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
            <h1 className="text-xl font-semibold">
              {currentTemplateId ? `Editing: ${templateName}` : 'Canvas Editor'}
            </h1>
            <div className="text-sm text-slate-500">
              {selectedElements.length > 0 && (
                <span>{selectedElements.length} element{selectedElements.length > 1 ? 's' : ''} selected</span>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {canvasState.layout.name} - {canvasState.width}×{canvasState.height}px
            </Badge>
          </div>
          
          {/* Enhanced Toolbar */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleLoadTemplate}>
              <FolderOpen className="w-4 h-4 mr-1" />
              Load
            </Button>
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
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsSaveDialogOpen(true)}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={handleCreateCampaign}
              disabled={isCreating}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {isCreating ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </div>
      </div>

      {/* Template Selection Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Load Template</DialogTitle>
            <DialogDescription>
              Choose a template to load into the editor
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer"
                onClick={() => loadTemplate(template)}
              >
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded mb-3"></div>
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Created: {new Date(template.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Template Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentTemplateId ? 'Update Template' : 'Save Template'}
            </DialogTitle>
            <DialogDescription>
              {currentTemplateId ? 'Update your template with the current design' : 'Save your current design as a reusable template'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
              />
            </div>
            <div>
              <Label htmlFor="templateDescription">Description</Label>
              <Textarea
                id="templateDescription"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Describe your template..."
                rows={3}
              />
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button size="sm" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {templateTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate} disabled={isSaving}>
                {isSaving ? 'Saving...' : (currentTemplateId ? 'Update' : 'Save Template')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <PublishDialog
        open={isPublishDialogOpen}
        onOpenChange={setIsPublishDialogOpen}
        templateName={templateName || "Untitled Template"}
        canvasData={canvasState}
      />

      {/* Preview Dialog */}
      <PreviewDialog
        open={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
        canvasState={canvasState}
      />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel */}
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <ElementToolbar onAddElement={addElement} />
          
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
                onLayoutChange={handleLayoutChange}
              />
            </TabsContent>

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

            <TabsContent value="settings" className="p-4">
              <div className="space-y-6">
                <BackgroundControls
                  backgroundColor={canvasState.backgroundColor}
                  backgroundImage={canvasState.backgroundImage}
                  backgroundGradient={canvasState.backgroundGradient}
                  onBackgroundChange={handleBackgroundChange}
                />
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-3">Upload Image</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
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
                        onChange={(e) => updateCanvasState({ showOverlay: e.target.checked })}
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
                            onChange={(e) => updateCanvasState({ overlayColor: e.target.value })}
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
                            onChange={(e) => updateCanvasState({ overlayOpacity: parseInt(e.target.value) })}
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
                        onChange={(e) => updateCanvasState({ showCloseButton: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                    {canvasState.showCloseButton && (
                      <div>
                        <Label htmlFor="closeButtonPosition">Position</Label>
                        <select
                          id="closeButtonPosition"
                          value={canvasState.closeButtonPosition}
                          onChange={(e) => updateCanvasState({ closeButtonPosition: e.target.value as any })}
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
              onAddElement={addElement}
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
                Canvas: {canvasState.width}×{canvasState.height}px • {canvasState.layout.type}
                {currentTemplateId && ' • Template: ' + templateName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

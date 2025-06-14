import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor } from "lucide-react";
import { EditorHeader } from "./popup-builder/EditorHeader";
import { TemplateDialogs } from "./popup-builder/TemplateDialogs";
import { SaveTemplateDialog } from "./popup-builder/SaveTemplateDialog";
import { EditorSidebar } from "./popup-builder/EditorSidebar";
import { LayoutSelector, PopupLayout } from "./LayoutSelector";
import { CanvasEditor } from "./CanvasEditor";
import { AlignmentTools } from "./AlignmentTools";
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
      <EditorHeader
        onBack={onBack}
        currentTemplateId={currentTemplateId}
        templateName={templateName}
        selectedElementsCount={selectedElements.length}
        canvasWidth={canvasState.width}
        canvasHeight={canvasState.height}
        layoutName={canvasState.layout.name}
        zoom={canvasState.zoom}
        showGrid={canvasState.showGrid}
        canUndo={canUndo}
        canRedo={canRedo}
        isSaving={isSaving}
        isCreating={isCreating}
        onLoadTemplate={handleLoadTemplate}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        onToggleGrid={toggleGrid}
        onPreview={() => setIsPreviewDialogOpen(true)}
        onSave={() => setIsSaveDialogOpen(true)}
        onCreateCampaign={handleCreateCampaign}
      />

      <TemplateDialogs
        isTemplateDialogOpen={isTemplateDialogOpen}
        setIsTemplateDialogOpen={setIsTemplateDialogOpen}
        templates={templates}
        onLoadTemplate={loadTemplate}
      />

      <SaveTemplateDialog
        isOpen={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        currentTemplateId={currentTemplateId}
        templateName={templateName}
        setTemplateName={setTemplateName}
        templateDescription={templateDescription}
        setTemplateDescription={setTemplateDescription}
        templateTags={templateTags}
        setTemplateTags={setTemplateTags}
        newTag={newTag}
        setNewTag={setNewTag}
        isSaving={isSaving}
        onSave={handleSaveTemplate}
        onAddTag={addTag}
        onRemoveTag={removeTag}
      />

      <PublishDialog
        open={isPublishDialogOpen}
        onOpenChange={setIsPublishDialogOpen}
        templateName={templateName || "Untitled Template"}
        canvasData={canvasState}
      />

      <PreviewDialog
        open={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
        canvasState={canvasState}
      />

      <div className="flex h-[calc(100vh-80px)]">
        <EditorSidebar
          canvasState={canvasState}
          selectedElements={selectedElements}
          onAddElement={addElement}
          onLayoutChange={handleLayoutChange}
          onUpdateElement={updateElement}
          onSelectElements={setSelectedElementIds}
          onDeleteElements={deleteElements}
          onBackgroundChange={handleBackgroundChange}
          onUpdateCanvasState={updateCanvasState}
          onFileUpload={handleFileUpload}
          isUploading={isUploading}
        />

        <div className="flex-1 flex flex-col">
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


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor } from "lucide-react";
import { EditorHeader } from "./popup-builder/EditorHeader";
import { TemplateDialogs } from "./popup-builder/TemplateDialogs";
import { SaveTemplateDialog } from "./popup-builder/SaveTemplateDialog";
import { EditorSidebar } from "./popup-builder/EditorSidebar";
import { CanvasEditor } from "./CanvasEditor";
import { AlignmentTools } from "./AlignmentTools";
import { PublishDialog } from "./PublishDialog";
import { PreviewDialog } from "./PreviewDialog";
import { PopupElement } from "./PopupElements";
import { PopupLayout } from "./LayoutSelector";
import { useCanvasStateManager } from "./popup-builder/CanvasStateManager";
import { useZoomControls } from "./popup-builder/ZoomControls";
import { useTemplateManager } from "./popup-builder/TemplateManager";

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
  const [previewDevice, setPreviewDevice] = useState("desktop");

  const defaultLayout: PopupLayout = {
    id: "modal-center",
    name: "Modal - Center",
    type: "modal",
    description: "Classic popup in the center of screen",
    dimensions: { width: 500, height: 400 },
    position: "center"
  };

  const initialCanvasState: CanvasState = {
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

  const {
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
  } = useCanvasStateManager(initialCanvasState);

  const { zoomIn, zoomOut, resetZoom, toggleGrid } = useZoomControls({
    canvasState,
    onUpdateCanvasState: updateCanvasState
  });

  const templateManager = useTemplateManager({
    templateId,
    canvasState,
    onLoadTemplate: (template) => {
      setCanvasState(template.canvas_data);
    }
  });

  const selectedElements = canvasState.elements.filter(el => selectedElementIds.includes(el.id));

  return (
    <div className="min-h-screen bg-slate-50">
      <EditorHeader
        onBack={onBack}
        currentTemplateId={templateManager.currentTemplateId}
        templateName={templateManager.templateName}
        selectedElementsCount={selectedElements.length}
        canvasWidth={canvasState.width}
        canvasHeight={canvasState.height}
        layoutName={canvasState.layout.name}
        zoom={canvasState.zoom}
        showGrid={canvasState.showGrid}
        canUndo={canUndo}
        canRedo={canRedo}
        isSaving={templateManager.isSaving}
        isCreating={templateManager.isCreating}
        onLoadTemplate={templateManager.handleLoadTemplate}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        onToggleGrid={toggleGrid}
        onPreview={() => templateManager.setIsPreviewDialogOpen(true)}
        onSave={() => templateManager.setIsSaveDialogOpen(true)}
        onCreateCampaign={templateManager.handleCreateCampaign}
      />

      <TemplateDialogs
        isTemplateDialogOpen={templateManager.isTemplateDialogOpen}
        setIsTemplateDialogOpen={templateManager.setIsTemplateDialogOpen}
        templates={templateManager.templates}
        onLoadTemplate={templateManager.loadTemplate}
      />

      <SaveTemplateDialog
        isOpen={templateManager.isSaveDialogOpen}
        onOpenChange={templateManager.setIsSaveDialogOpen}
        currentTemplateId={templateManager.currentTemplateId}
        templateName={templateManager.templateName}
        setTemplateName={templateManager.setTemplateName}
        templateDescription={templateManager.templateDescription}
        setTemplateDescription={templateManager.setTemplateDescription}
        templateTags={templateManager.templateTags}
        setTemplateTags={templateManager.setTemplateTags}
        newTag={templateManager.newTag}
        setNewTag={templateManager.setNewTag}
        isSaving={templateManager.isSaving}
        onSave={templateManager.handleSaveTemplate}
        onAddTag={templateManager.addTag}
        onRemoveTag={templateManager.removeTag}
      />

      <PublishDialog
        open={templateManager.isPublishDialogOpen}
        onOpenChange={templateManager.setIsPublishDialogOpen}
        templateName={templateManager.templateName || "Untitled Template"}
        canvasData={canvasState}
      />

      <PreviewDialog
        open={templateManager.isPreviewDialogOpen}
        onOpenChange={templateManager.setIsPreviewDialogOpen}
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
          onFileUpload={async (event) => {
            const url = await templateManager.handleFileUpload(event);
            handleBackgroundChange('image', url);
          }}
          isUploading={templateManager.isUploading}
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
                {templateManager.currentTemplateId && ' • Template: ' + templateManager.templateName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

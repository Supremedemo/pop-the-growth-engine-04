
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Eye, 
  Save, 
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  FolderOpen,
  ExternalLink
} from "lucide-react";

interface EditorHeaderProps {
  onBack: () => void;
  currentTemplateId?: string;
  templateName: string;
  selectedElementsCount: number;
  canvasWidth: number;
  canvasHeight: number;
  layoutName: string;
  zoom: number;
  showGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  isCreating: boolean;
  onLoadTemplate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleGrid: () => void;
  onPreview: () => void;
  onSave: () => void;
  onCreateCampaign: () => void;
}

export const EditorHeader = ({
  onBack,
  currentTemplateId,
  templateName,
  selectedElementsCount,
  canvasWidth,
  canvasHeight,
  layoutName,
  zoom,
  showGrid,
  canUndo,
  canRedo,
  isSaving,
  isCreating,
  onLoadTemplate,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleGrid,
  onPreview,
  onSave,
  onCreateCampaign
}: EditorHeaderProps) => {
  return (
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
            {selectedElementsCount > 0 && (
              <span>{selectedElementsCount} element{selectedElementsCount > 1 ? 's' : ''} selected</span>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {layoutName} - {canvasWidth}×{canvasHeight}px
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onLoadTemplate}>
            <FolderOpen className="w-4 h-4 mr-1" />
            Load
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onUndo}
            disabled={!canUndo}
            className="disabled:opacity-50"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRedo}
            disabled={!canRedo}
            className="disabled:opacity-50"
          >
            <Redo className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-slate-300" />
          <Button variant="outline" size="sm" onClick={onZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onResetZoom}
            className="min-w-[60px] text-center"
          >
            {Math.round(zoom * 100)}%
          </Button>
          <Button variant="outline" size="sm" onClick={onZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            variant={showGrid ? "default" : "outline"} 
            size="sm" 
            onClick={onToggleGrid}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-slate-300" />
          <Button variant="outline" onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            variant="outline" 
            onClick={onSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={onCreateCampaign}
            disabled={isCreating}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {isCreating ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
      </div>
    </div>
  );
};

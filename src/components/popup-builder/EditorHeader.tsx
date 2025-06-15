
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Settings, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Grid3X3,
  Eye,
  Save,
  Rocket,
  Code,
  FolderOpen
} from "lucide-react";

interface EditorHeaderProps {
  onBack: () => void;
  currentTemplateId: string | null;
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
  onGenerateCode: () => void;
  onToggleRules: () => void;
  showRulesPanel: boolean;
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
  onCreateCampaign,
  onGenerateCode,
  onToggleRules,
  showRulesPanel
}: EditorHeaderProps) => {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="flex items-center justify-between p-3">
        {/* Left section - Navigation and title */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="h-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-semibold text-slate-900 truncate max-w-64">
              {templateName || 'Untitled Template'}
            </h1>
            
            {selectedElementsCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedElementsCount} selected
              </Badge>
            )}
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-1">
          {/* File operations */}
          <Button variant="ghost" size="sm" onClick={onLoadTemplate} className="h-8">
            <FolderOpen className="w-4 h-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          {/* Edit operations */}
          <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo} className="h-8">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo} className="h-8">
            <Redo className="w-4 h-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          {/* View operations */}
          <Button variant="ghost" size="sm" onClick={onZoomIn} className="h-8">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onZoomOut} className="h-8">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onResetZoom} className="h-8">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button 
            variant={showGrid ? "secondary" : "ghost"} 
            size="sm" 
            onClick={onToggleGrid} 
            className="h-8"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          {/* Preview and publish */}
          <Button variant="ghost" size="sm" onClick={onPreview} className="h-8">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onSave} disabled={isSaving} className="h-8">
            <Save className="w-4 h-4" />
          </Button>
          <Button variant="default" size="sm" onClick={onCreateCampaign} disabled={isCreating} className="h-8">
            <Rocket className="w-4 h-4 mr-2" />
            {isCreating ? 'Creating...' : 'Campaign'}
          </Button>
          <Button variant="outline" size="sm" onClick={onGenerateCode} className="h-8">
            <Code className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />

          <Button
            variant={showRulesPanel ? "default" : "ghost"}
            size="sm"
            onClick={onToggleRules}
            className="h-8"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Status bar */}
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-4">
            <span>Canvas: {canvasWidth}×{canvasHeight}px</span>
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            <span>Layout: {layoutName}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span>{currentTemplateId ? 'Saved Template' : 'Unsaved'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

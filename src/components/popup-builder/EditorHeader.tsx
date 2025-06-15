import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings } from "lucide-react";

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
    <div className="bg-white border-b border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-lg font-semibold text-slate-900">
            {templateName || 'Untitled Template'}
          </div>
          
          {selectedElementsCount > 0 && (
            <Badge variant="secondary">
              {selectedElementsCount} selected
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onLoadTemplate}>
            Load Template
          </Button>
          <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo}>
            Undo
          </Button>
          <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo}>
            Redo
          </Button>
          <Button variant="outline" size="sm" onClick={onZoomIn}>
            Zoom In
          </Button>
          <Button variant="outline" size="sm" onClick={onZoomOut}>
            Zoom Out
          </Button>
          <Button variant="outline" size="sm" onClick={onResetZoom}>
            Reset Zoom
          </Button>
          <Button variant="outline" size="sm" onClick={onToggleGrid}>
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </Button>
          <Button variant="outline" size="sm" onClick={onPreview}>
            Preview
          </Button>
          <Button variant="default" size="sm" onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="default" size="sm" onClick={onCreateCampaign} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Campaign'}
          </Button>
          <Button variant="default" size="sm" onClick={onGenerateCode}>
            Generate Code
          </Button>

          <Button
            variant={showRulesPanel ? "default" : "outline"}
            size="sm"
            onClick={onToggleRules}
          >
            <Settings className="w-4 h-4 mr-2" />
            Rules
          </Button>
        </div>
      </div>
    </div>
  );
};

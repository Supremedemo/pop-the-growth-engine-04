import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Code,
  Eye,
  FileText,
  Loader2,
  Redo,
  Reset,
  Rocket,
  Save,
  Undo,
  ZoomIn,
  ZoomOut,
  LayoutDashboard,
  Brush,
  Grip,
  EyeOff
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  onGenerateCode: () => void;
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
  onGenerateCode
}: EditorHeaderProps) => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="h-6 w-px bg-slate-300" />
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onLoadTemplate}>
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onUndo}
                    disabled={!canUndo}
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onRedo}
                    disabled={!canRedo}
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={onZoomIn}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom In</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={onZoomOut}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom Out</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={onResetZoom}>
                    <Reset className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset Zoom</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={onToggleGrid}>
                    {showGrid ? <Grip className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{showGrid ? 'Hide Grid' : 'Show Grid'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          
          <Button variant="outline" size="sm" onClick={onGenerateCode}>
            <Code className="w-4 h-4 mr-2" />
            Generate Code
          </Button>
          
          <Button 
            size="sm" 
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {currentTemplateId ? 'Update' : 'Save'}
              </>
            )}
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onCreateCampaign}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Create Campaign
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <div>
          <span className="mr-2">
            <LayoutDashboard className="w-3 h-3 inline-block mr-1 align-text-bottom" />
            {layoutName}
          </span>
          <span>
            <Brush className="w-3 h-3 inline-block mr-1 align-text-bottom" />
            {canvasWidth}×{canvasHeight}px
          </span>
        </div>
        
        <div>
          Zoom: {(zoom * 100).toFixed(0)}%
          {currentTemplateId && ' • Template: ' + templateName}
          {selectedElementsCount > 0 && ` • ${selectedElementsCount} element${selectedElementsCount !== 1 ? 's' : ''} selected`}
        </div>
      </div>
    </div>
  );
};

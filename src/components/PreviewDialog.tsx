import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Maximize, X } from "lucide-react";
import { CanvasState } from "./PopupBuilder";
import { ElementRenderer } from "./PopupElements";
import { SpinWheelGame } from "./SpinWheelGame";

interface GameMode {
  isActive: boolean;
  type: string;
  config: any;
}

interface PreviewDialogProps {
  canvasState: CanvasState;
  onClose: () => void;
  gameMode?: GameMode;
}

export const PreviewDialog = ({ canvasState, onClose, gameMode }: PreviewDialogProps) => {
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderPreviewContent = () => {
    // If in game mode, render the game
    if (gameMode?.isActive) {
      switch (gameMode.type) {
        case 'spin-wheel':
          return <SpinWheelGame isEditorMode={false} />;
        default:
          return (
            <div className="flex items-center justify-center h-full">
              <p>Game preview not available</p>
            </div>
          );
      }
    }

    const scale = previewDevice === "mobile" ? 0.8 : 1;
    const layout = canvasState.layout;
    
    let backgroundStyle = {};
    
    if (canvasState.backgroundType === 'color') {
      backgroundStyle = { backgroundColor: canvasState.backgroundColor };
    } else if (canvasState.backgroundType === 'image' && canvasState.backgroundImage) {
      backgroundStyle = {
        backgroundImage: `url(${canvasState.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    } else if (canvasState.backgroundType === 'gradient' && canvasState.backgroundGradient) {
      backgroundStyle = { background: canvasState.backgroundGradient };
    }

    let layoutStyle = {};
    switch (layout.type) {
      case 'banner':
        layoutStyle = {
          width: layout.position === 'top' || layout.position === 'bottom' 
            ? '100%' 
            : canvasState.width * scale,
          height: canvasState.height * scale,
          maxWidth: layout.dimensions.maxWidth || '100%',
          borderRadius: layout.position === 'top' || layout.position === 'bottom' ? '0' : '12px'
        };
        break;
      case 'fullscreen':
        layoutStyle = {
          width: '100%',
          height: '100%',
          maxWidth: '100vw',
          maxHeight: '100vh',
          borderRadius: '0'
        };
        break;
      case 'slide-in':
        layoutStyle = {
          width: canvasState.width * scale,
          height: canvasState.height * scale,
          borderRadius: layout.position === 'left' || layout.position === 'right' ? '12px 0 0 12px' : '12px'
        };
        break;
      default:
        layoutStyle = {
          width: canvasState.width * scale,
          height: canvasState.height * scale,
          borderRadius: '12px'
        };
    }
    
    const containerStyle = {
      ...layoutStyle,
      ...backgroundStyle,
      position: 'relative' as const,
      margin: layout.type === 'fullscreen' ? '0' : '40px auto',
      boxShadow: layout.type === 'banner' || layout.type === 'fullscreen' 
        ? 'none' 
        : '0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    };

    return (
      <div style={containerStyle}>
        {canvasState.elements
          .sort((a, b) => a.zIndex - b.zIndex)
          .map(element => (
            <ElementRenderer
              key={element.id}
              element={element}
              isSelected={false}
              onSelect={() => {}}
              onUpdate={() => {}}
              onDelete={() => {}}
            />
          ))}
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={`max-w-7xl ${isFullscreen ? 'fixed inset-0 max-w-none w-screen h-screen p-0 m-0' : 'max-h-[90vh]'}`}>
        {!isFullscreen && (
          <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <DialogTitle>Preview {gameMode?.isActive ? 'Game' : 'Popup'}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {gameMode?.isActive 
                  ? `Preview your ${gameMode.type} game`
                  : `Preview your ${canvasState.layout.name} design`
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {!gameMode?.isActive && (
                <>
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
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(true)}
              >
                <Maximize className="w-4 h-4 mr-2" />
                Fullscreen
              </Button>
            </div>
          </DialogHeader>
        )}
        
        <div className={`${isFullscreen ? 'h-full' : 'px-6 pb-6'} overflow-auto`}>
          {isFullscreen && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="fixed top-4 right-4 z-50 bg-black/80 text-white hover:bg-black/90"
            >
              <X className="w-4 h-4 mr-2" />
              Exit Fullscreen
            </Button>
          )}
          
          <div className={`${isFullscreen ? 'w-full h-full' : 'bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-8 min-h-[500px]'} flex items-center justify-center`}>
            {renderPreviewContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

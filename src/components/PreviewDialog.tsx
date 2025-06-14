
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Globe, Smartphone, Monitor, RefreshCw } from "lucide-react";
import { CanvasState } from "./PopupBuilder";
import { PopupElement } from "./PopupElements";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canvasState: CanvasState;
}

export const PreviewDialog = ({ open, onOpenChange, canvasState }: PreviewDialogProps) => {
  const [previewUrl, setPreviewUrl] = useState("https://example.com");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const macbookAirResolution = {
    width: 1440,
    height: 900
  };

  const mobileResolution = {
    width: 390,
    height: 844
  };

  const currentResolution = deviceMode === "desktop" ? macbookAirResolution : mobileResolution;

  useEffect(() => {
    if (open) {
      setShowPopup(false);
      setIsLoading(false);
    }
  }, [open]);

  const handleLoadPreview = () => {
    if (!previewUrl.trim()) return;
    
    setIsLoading(true);
    setShowPopup(false);
    
    // Add timeout to show popup after iframe loads
    setTimeout(() => {
      setIsLoading(false);
      setShowPopup(true);
    }, 2000);
  };

  const formatUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const getPopupStyle = () => {
    const layout = canvasState.layout;
    const scale = deviceMode === "mobile" ? 0.8 : 1;
    
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

    let positionStyle = {};
    let sizeStyle = {};

    switch (layout.type) {
      case 'banner':
        sizeStyle = {
          width: layout.position === 'top' || layout.position === 'bottom' ? '100%' : `${canvasState.width * scale}px`,
          height: `${canvasState.height * scale}px`,
          maxWidth: layout.dimensions?.maxWidth || '100%'
        };
        positionStyle = layout.position === 'top' 
          ? { top: 0, left: 0, right: 0 }
          : { bottom: 0, left: 0, right: 0 };
        break;
      case 'fullscreen':
        sizeStyle = { width: '100%', height: '100%' };
        positionStyle = { top: 0, left: 0, right: 0, bottom: 0 };
        break;
      case 'slide-in':
        sizeStyle = {
          width: `${canvasState.width * scale}px`,
          height: `${canvasState.height * scale}px`
        };
        positionStyle = layout.position === 'left'
          ? { left: 0, top: '50%', transform: 'translateY(-50%)' }
          : { right: 0, top: '50%', transform: 'translateY(-50%)' };
        break;
      default: // modal
        sizeStyle = {
          width: `${canvasState.width * scale}px`,
          height: `${canvasState.height * scale}px`
        };
        positionStyle = {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }

    return {
      position: 'absolute' as const,
      zIndex: 9999,
      borderRadius: layout.type === 'fullscreen' ? '0' : '12px',
      boxShadow: layout.type === 'banner' || layout.type === 'fullscreen' 
        ? 'none' 
        : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
      ...backgroundStyle,
      ...sizeStyle,
      ...positionStyle
    };
  };

  const renderElement = (element: PopupElement) => {
    const commonStyle = {
      position: 'absolute' as const,
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      zIndex: element.zIndex
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              ...commonStyle,
              fontSize: element.fontSize,
              fontWeight: element.fontWeight,
              textAlign: element.textAlign as any,
              color: element.color,
              padding: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {element.content}
          </div>
        );
      case 'image':
        return (
          <img
            key={element.id}
            src={element.src}
            alt={element.alt}
            style={{
              ...commonStyle,
              borderRadius: element.borderRadius,
              objectFit: 'cover'
            }}
          />
        );
      case 'form':
        return (
          <div key={element.id} style={{ ...commonStyle, padding: '16px' }}>
            <div className="space-y-3">
              {element.fields?.map((field) => (
                <input
                  key={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              ))}
              <button
                style={{ backgroundColor: element.buttonColor }}
                className="w-full py-2 px-4 rounded-md text-white font-medium text-sm"
              >
                {element.buttonText}
              </button>
            </div>
          </div>
        );
      case 'timer':
        return (
          <div
            key={element.id}
            style={{
              ...commonStyle,
              backgroundColor: element.backgroundColor,
              color: element.textColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              borderRadius: '8px'
            }}
          >
            05:00
          </div>
        );
      case 'html':
        return (
          <div
            key={element.id}
            style={commonStyle}
            dangerouslySetInnerHTML={{ __html: element.htmlContent || '' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Preview Popup</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                See how your popup looks on a real website
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {canvasState.layout.name}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {currentResolution.width} × {currentResolution.height}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex-1 flex items-center space-x-2">
              <Label htmlFor="preview-url" className="text-sm font-medium">
                Website URL:
              </Label>
              <div className="flex-1 flex space-x-2">
                <Input
                  id="preview-url"
                  type="url"
                  value={previewUrl}
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  placeholder="Enter website URL (e.g., example.com)"
                  className="flex-1"
                />
                <Button onClick={handleLoadPreview} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                  Load
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-1">
              <Button
                variant={deviceMode === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setDeviceMode("desktop")}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceMode === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setDeviceMode("mobile")}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 bg-gray-100">
          <div className="relative mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            <div 
              className="relative bg-gray-50"
              style={{
                width: currentResolution.width,
                height: currentResolution.height,
                maxWidth: '100%',
                maxHeight: '100%',
                margin: '0 auto'
              }}
            >
              {/* Browser Chrome */}
              <div className="bg-gray-200 border-b flex items-center px-4 py-2 space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600">
                  {formatUrl(previewUrl)}
                </div>
              </div>

              {/* Website Content */}
              <div className="relative w-full h-full bg-white overflow-hidden">
                {previewUrl && !isLoading ? (
                  <iframe
                    ref={iframeRef}
                    src={formatUrl(previewUrl)}
                    className="w-full h-full border-0"
                    style={{
                      width: currentResolution.width,
                      height: currentResolution.height - 40
                    }}
                    onLoad={() => setIsLoading(false)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    {isLoading ? (
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <p>Loading website...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Enter a URL and click Load to preview</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Popup Overlay */}
                {showPopup && (
                  <>
                    {(canvasState.layout.type === 'modal' || canvasState.layout.type === 'slide-in') && (
                      <div 
                        className="absolute inset-0 bg-black bg-opacity-50"
                        style={{ zIndex: 9998 }}
                      />
                    )}
                    
                    <div style={getPopupStyle()}>
                      {/* Close button */}
                      <button
                        onClick={() => setShowPopup(false)}
                        className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
                        style={{ zIndex: 10000 }}
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>

                      {/* Render popup elements */}
                      {canvasState.elements
                        .sort((a, b) => a.zIndex - b.zIndex)
                        .map(renderElement)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {!showPopup && !isLoading && previewUrl && (
            <div className="text-center mt-4">
              <Button onClick={() => setShowPopup(true)} className="bg-blue-600 hover:bg-blue-700">
                Show Popup
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

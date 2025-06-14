
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Code, Edit, Save, X } from "lucide-react";

interface CustomHtmlElementProps {
  element: any;
  isSelected: boolean;
  onUpdate: (id: string, updates: any) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CustomHtmlElement = ({ 
  element, 
  isSelected, 
  onUpdate, 
  onSelect, 
  onDelete 
}: CustomHtmlElementProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [htmlContent, setHtmlContent] = useState(element.htmlContent || '<div>Custom HTML</div>');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && !isEditing) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <html>
            <head>
              <style>
                body { margin: 0; padding: 8px; font-family: system-ui; overflow: hidden; }
                * { box-sizing: border-box; }
              </style>
            </head>
            <body>${htmlContent}</body>
          </html>
        `);
        doc.close();
      }
    }
  }, [htmlContent, isEditing]);

  const handleSave = () => {
    onUpdate(element.id, { htmlContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setHtmlContent(element.htmlContent || '<div>Custom HTML</div>');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="absolute bg-white border-2 border-blue-500 rounded-lg shadow-lg p-4 z-50"
           style={{ 
             left: element.x, 
             top: element.y, 
             width: Math.max(element.width, 300), 
             height: Math.max(element.height, 200) 
           }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4" />
            <span className="text-sm font-medium">Edit HTML</span>
          </div>
          <div className="flex space-x-1">
            <Button size="sm" onClick={handleSave}>
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
        <Textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          className="w-full h-32 font-mono text-xs"
          placeholder="Enter your HTML code here..."
        />
      </div>
    );
  }

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-blue-300'
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: element.zIndex
      }}
      onClick={() => onSelect(element.id)}
    >
      <iframe
        ref={iframeRef}
        className="w-full h-full rounded"
        style={{ pointerEvents: isSelected ? 'none' : 'auto' }}
      />
      
      {isSelected && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center space-x-1 hover:bg-blue-600"
          >
            <Edit className="w-3 h-3" />
            <span>Edit HTML</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(element.id);
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        </>
      )}
    </div>
  );
};

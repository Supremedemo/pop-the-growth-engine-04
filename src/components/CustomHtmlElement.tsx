
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
  const [htmlContent, setHtmlContent] = useState(element.htmlContent || '<div style="padding: 16px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; border-radius: 8px; text-align: center; font-weight: bold;">Custom HTML Block</div>');
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
                body { 
                  margin: 0; 
                  padding: 0; 
                  font-family: system-ui; 
                  overflow: hidden; 
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
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
    setHtmlContent(element.htmlContent || '<div style="padding: 16px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; border-radius: 8px; text-align: center; font-weight: bold;">Custom HTML Block</div>');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
           onClick={(e) => {
             if (e.target === e.currentTarget) {
               handleCancel();
             }
           }}>
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-semibold">Edit Custom HTML</span>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">HTML Content</label>
              <Textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="w-full h-64 font-mono text-sm"
                placeholder="Enter your HTML code here..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preview</label>
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[100px]">
                <iframe
                  srcDoc={`
                    <html>
                      <head>
                        <style>
                          body { 
                            margin: 0; 
                            padding: 8px; 
                            font-family: system-ui; 
                          }
                          * { box-sizing: border-box; }
                        </style>
                      </head>
                      <body>${htmlContent}</body>
                    </html>
                  `}
                  className="w-full h-32 border-0"
                  title="HTML Preview"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:ring-1 hover:ring-blue-300'
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: element.zIndex
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id);
      }}
    >
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0 rounded"
        style={{ pointerEvents: isSelected ? 'none' : 'auto' }}
        title="Custom HTML Content"
      />
      
      {isSelected && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="absolute -top-8 left-0 bg-blue-500 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 hover:bg-blue-600 transition-colors shadow-md"
          >
            <Edit className="w-3 h-3" />
            <span>Edit HTML</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(element.id);
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
          >
            <X className="w-3 h-3" />
          </button>
        </>
      )}
    </div>
  );
};

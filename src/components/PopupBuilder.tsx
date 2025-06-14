import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Grip,
  LayoutDashboard,
  Image,
  Type,
  Mail,
  Clock,
  Code,
  FileText,
  List,
  X
} from "lucide-react";
import { CanvasEditor } from "./CanvasEditor";
import { ElementToolbar } from "./ElementToolbar";
import { SettingsSidebar } from "./SettingsSidebar";
import { PopupElement } from "./PopupElements";
import { MultiStepFormElement } from "./MultiStepFormElement";

export interface CanvasState {
  width: number;
  height: number;
  zoom: number;
  showGrid: boolean;
  gridSize: number;
  elements: PopupElement[];
  backgroundType: 'color' | 'image' | 'gradient';
  backgroundColor: string;
  backgroundImage: string | null;
  backgroundGradient: string | null;
  layout: LayoutConfig;
}

export interface LayoutConfig {
  type: 'modal' | 'banner' | 'slide-in' | 'fullscreen';
  name: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  dimensions?: {
    maxWidth?: string;
  };
}

const defaultLayouts: LayoutConfig[] = [
  { type: 'modal', name: 'Modal' },
  { type: 'banner', name: 'Top Banner', position: 'top', dimensions: { maxWidth: '100%' } },
  { type: 'banner', name: 'Bottom Banner', position: 'bottom', dimensions: { maxWidth: '100%' } },
  { type: 'slide-in', name: 'Left Slide-in', position: 'left' },
  { type: 'slide-in', name: 'Right Slide-in', position: 'right' },
  { type: 'fullscreen', name: 'Fullscreen' },
];

export const PopupBuilder = () => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    width: 600,
    height: 400,
    zoom: 1,
    showGrid: true,
    gridSize: 20,
    elements: [],
    backgroundType: 'color',
    backgroundColor: '#f0f0f0',
    backgroundImage: null,
    backgroundGradient: null,
    layout: defaultLayouts[0],
  });
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  const handleSelectElements = (ids: string[]) => {
    setSelectedElementIds(ids);
  };

  const handleUpdateElement = (id: string, updates: Partial<PopupElement>) => {
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === id ? { ...el, ...updates } : el
      )
    }));
  };

  const handleDeleteElements = (ids: string[]) => {
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => !ids.includes(el.id))
    }));
    setSelectedElementIds([]);
  };

  const handleAddElement = (element: PopupElement) => {
    setCanvasState(prev => ({
      ...prev,
      elements: [...prev.elements, element]
    }));
    setSelectedElementIds([element.id]);
  };

  const createTypedElement = (type: string, coords: { x: number; y: number }): PopupElement | null => {
    const generateId = () => Math.random().toString(36).substr(2, 9);
    
    switch (type) {
      case 'text':
        return {
          id: generateId(),
          type: "text" as const,
          x: coords.x,
          y: coords.y,
          width: 200,
          height: 40,
          zIndex: Math.max(...canvasState.elements.map(el => el.zIndex), 0) + 1,
          content: "Click to edit text",
          fontSize: 16,
          fontWeight: "normal",
          textAlign: "left",
          color: "#000000",
        };
      case 'image':
        return {
          id: generateId(),
          type: "image" as const,
          x: coords.x,
          y: coords.y,
          width: 150,
          height: 100,
          zIndex: Math.max(...canvasState.elements.map(el => el.zIndex), 0) + 1,
          src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop",
          alt: "Placeholder image",
          borderRadius: 8,
        };
      case 'form':
        return {
          id: generateId(),
          type: "form" as const,
          x: coords.x,
          y: coords.y,
          width: 280,
          height: 140,
          zIndex: Math.max(...canvasState.elements.map(el => el.zIndex), 0) + 1,
          fields: [
            {
              id: generateId(),
              type: "email" as const,
              placeholder: "Enter your email",
              required: true,
            },
          ],
          buttonText: "Subscribe",
          buttonColor: "#3b82f6",
        };
      case 'multi-step-form':
        return {
          id: generateId(),
          type: "multi-step-form" as const,
          x: coords.x,
          y: coords.y,
          width: 400,
          height: 300,
          zIndex: Math.max(...canvasState.elements.map(el => el.zIndex), 0) + 1,
          steps: [
            {
              id: generateId(),
              title: "Step 1",
              description: "Please fill out the information below",
              fields: [
                {
                  id: generateId(),
                  type: "email" as const,
                  label: "Email Address",
                  placeholder: "Enter your email",
                  required: true,
                }
              ]
            }
          ],
          successPage: {
            title: "Thank You!",
            message: "Your form has been submitted successfully.",
            showCoupon: false,
            showDismissButton: true,
            dismissButtonText: "Close",
            showRedirectButton: false,
            redirectButtonText: "Continue",
          },
          buttonColor: "#3b82f6",
          backgroundColor: "#ffffff",
        };
      case 'timer':
        return {
          id: generateId(),
          type: "timer" as const,
          x: coords.x,
          y: coords.y,
          width: 180,
          height: 70,
          zIndex: Math.max(...canvasState.elements.map(el => el.zIndex), 0) + 1,
          duration: 300,
          format: "mm:ss",
          backgroundColor: "#ef4444",
          textColor: "#ffffff",
        };
      case 'html':
        return {
          id: generateId(),
          type: "html" as const,
          x: coords.x,
          y: coords.y,
          width: 200,
          height: 100,
          zIndex: Math.max(...canvasState.elements.map(el => el.zIndex), 0) + 1,
          htmlContent: '<div style="padding: 16px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; border-radius: 8px; text-align: center; font-weight: bold;">Custom HTML Block</div>',
        };
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Element Toolbar */}
      <div className="w-64 flex-shrink-0 bg-white border-r">
        <ElementToolbar onAddElement={handleAddElement} />
      </div>

      {/* Canvas Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gray-200 border-b p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              <span>Settings</span>
            </Button>
            <select
              value={previewDevice}
              onChange={(e) => setPreviewDevice(e.target.value)}
              className="rounded-md border border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
          <div>
            {/* Add any additional top-level controls here */}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <CanvasEditor
            canvasState={canvasState}
            selectedElementIds={selectedElementIds}
            onSelectElements={handleSelectElements}
            onUpdateElement={handleUpdateElement}
            onDeleteElements={handleDeleteElements}
            previewDevice={previewDevice}
            onAddElement={handleAddElement}
          />
        </div>
      </div>

      {/* Settings Sidebar */}
      {isSettingsOpen && (
        <div className="w-80 flex-shrink-0 bg-white border-l overflow-y-auto">
          <SettingsSidebar
            canvasState={canvasState}
            setCanvasState={setCanvasState}
            selectedElementIds={selectedElementIds}
            onUpdateElement={handleUpdateElement}
          />
        </div>
      )}
    </div>
  );
};

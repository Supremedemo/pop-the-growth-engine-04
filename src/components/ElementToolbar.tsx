
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Type, Image, Mail, Clock, Code, FileText, List } from "lucide-react";
import { PopupElement } from "./PopupElements";
import { MultiStepFormElement } from "./MultiStepFormElement";

interface ElementToolbarProps {
  onAddElement: (element: PopupElement) => void;
}

export const ElementToolbar = ({ onAddElement }: ElementToolbarProps) => {
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createElement = (type: string) => {
    const baseProps = {
      id: generateId(),
      x: 50,
      y: 50,
      zIndex: 1
    };

    switch (type) {
      case 'text':
        return {
          ...baseProps,
          type: "text" as const,
          width: 200,
          height: 40,
          content: "Click to edit text",
          fontSize: 16,
          fontWeight: "normal",
          textAlign: "left",
          color: "#000000",
        };
      case 'image':
        return {
          ...baseProps,
          type: "image" as const,
          width: 150,
          height: 100,
          src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop",
          alt: "Placeholder image",
          borderRadius: 8,
        };
      case 'form':
        return {
          ...baseProps,
          type: "form" as const,
          width: 280,
          height: 140,
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
          ...baseProps,
          type: "multi-step-form" as const,
          width: 400,
          height: 300,
          steps: [
            {
              id: generateId(),
              title: "Step 1",
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
        } as MultiStepFormElement;
      case 'timer':
        return {
          ...baseProps,
          type: "timer" as const,
          width: 180,
          height: 70,
          duration: 300,
          format: "mm:ss",
          backgroundColor: "#ef4444",
          textColor: "#ffffff",
        };
      case 'html':
        return {
          ...baseProps,
          type: "html" as const,
          width: 200,
          height: 100,
          htmlContent: '<div style="padding: 16px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; border-radius: 8px; text-align: center; font-weight: bold;">Custom HTML Block</div>',
        };
      default:
        return null;
    }
  };

  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData('application/element-type', elementType);
  };

  const handleAddElement = (type: string) => {
    const element = createElement(type);
    if (element) {
      onAddElement(element as PopupElement);
    }
  };

  const elements = [
    { type: 'text', icon: Type, label: 'Text', description: 'Add text content' },
    { type: 'image', icon: Image, label: 'Image', description: 'Add an image' },
    { type: 'form', icon: Mail, label: 'Simple Form', description: 'Basic form with fields' },
    { type: 'multi-step-form', icon: List, label: 'Multi-Step Form', description: 'Advanced multi-page form' },
    { type: 'timer', icon: Clock, label: 'Timer', description: 'Countdown timer' },
    { type: 'html', icon: Code, label: 'Custom HTML', description: 'Custom HTML content' },
  ];

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-4">Elements</h3>
      <div className="space-y-2">
        {elements.map((element) => {
          const IconComponent = element.icon;
          return (
            <div key={element.type} className="group">
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-200"
                draggable
                onDragStart={(e) => handleDragStart(e, element.type)}
                onClick={() => handleAddElement(element.type)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-200">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{element.label}</div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-600">
                      {element.description}
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          );
        })}
      </div>

      <Separator className="my-4" />
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 <strong>Tip:</strong> Drag elements onto the canvas or click to add at default position</p>
        <p>🎯 Use multi-step forms for complex lead capture flows</p>
      </div>
    </div>
  );
};

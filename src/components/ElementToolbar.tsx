
import { Button } from "@/components/ui/button";
import { Type, Image as ImageIcon, Mail, Clock, Grip } from "lucide-react";
import { PopupElement, TextElement, ImageElement, FormElement, TimerElement } from "./PopupElements";

interface ElementToolbarProps {
  onAddElement: (element: PopupElement) => void;
}

export const ElementToolbar = ({ onAddElement }: ElementToolbarProps) => {
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData('application/element-type', elementType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const addTextElement = () => {
    const element: TextElement = {
      id: generateId(),
      type: "text",
      x: 50,
      y: 50,
      width: 200,
      height: 40,
      zIndex: 1,
      content: "Click to edit text",
      fontSize: 16,
      fontWeight: "normal",
      textAlign: "left",
      color: "#000000",
    };
    onAddElement(element);
  };

  const addImageElement = () => {
    const element: ImageElement = {
      id: generateId(),
      type: "image",
      x: 50,
      y: 100,
      width: 150,
      height: 100,
      zIndex: 1,
      src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop",
      alt: "Placeholder image",
      borderRadius: 8,
    };
    onAddElement(element);
  };

  const addFormElement = () => {
    const element: FormElement = {
      id: generateId(),
      type: "form",
      x: 50,
      y: 150,
      width: 280,
      height: 140,
      zIndex: 1,
      fields: [
        {
          id: generateId(),
          type: "email",
          placeholder: "Enter your email",
          required: true,
        },
      ],
      buttonText: "Subscribe",
      buttonColor: "#3b82f6",
    };
    onAddElement(element);
  };

  const addTimerElement = () => {
    const element: TimerElement = {
      id: generateId(),
      type: "timer",
      x: 50,
      y: 200,
      width: 180,
      height: 70,
      zIndex: 1,
      duration: 300,
      format: "mm:ss",
      backgroundColor: "#ef4444",
      textColor: "#ffffff",
    };
    onAddElement(element);
  };

  const elements = [
    {
      type: "text",
      icon: Type,
      label: "Text",
      description: "Add headings and paragraphs",
      onClick: addTextElement,
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      type: "image",
      icon: ImageIcon,
      label: "Image",
      description: "Add photos and graphics",
      onClick: addImageElement,
      color: "bg-green-50 text-green-600 border-green-200"
    },
    {
      type: "form",
      icon: Mail,
      label: "Form",
      description: "Collect user information",
      onClick: addFormElement,
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      type: "timer",
      icon: Clock,
      label: "Timer",
      description: "Add countdown urgency",
      onClick: addTimerElement,
      color: "bg-red-50 text-red-600 border-red-200"
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center">
        <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
        </svg>
        Elements
      </h3>
      <div className="space-y-3">
        {elements.map((element) => {
          const IconComponent = element.icon;
          return (
            <div
              key={element.type}
              draggable
              onDragStart={(e) => handleDragStart(e, element.type)}
              onClick={element.onClick}
              className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${element.color}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium mb-1">{element.label}</h4>
                  <p className="text-xs opacity-75">{element.description}</p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Grip className="w-4 h-4" />
                </div>
              </div>
              
              {/* Drag indicator */}
              <div className="absolute inset-0 bg-white bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none">
                <div className="absolute top-2 right-2 text-xs font-medium opacity-75">
                  Drag to canvas
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-3 bg-slate-50 rounded-lg">
        <p className="text-xs text-slate-600 leading-relaxed">
          💡 <strong>Pro tip:</strong> Drag elements directly onto the canvas or click to add them at default positions.
        </p>
      </div>
    </div>
  );
};

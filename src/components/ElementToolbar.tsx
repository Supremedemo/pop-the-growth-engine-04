
import { Button } from "@/components/ui/button";
import { Type, Image as ImageIcon, Mail, Clock } from "lucide-react";
import { PopupElement, TextElement, ImageElement, FormElement, TimerElement } from "./PopupElements";

interface ElementToolbarProps {
  onAddElement: (element: PopupElement) => void;
}

export const ElementToolbar = ({ onAddElement }: ElementToolbarProps) => {
  const generateId = () => Math.random().toString(36).substr(2, 9);

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
      width: 250,
      height: 120,
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
      width: 150,
      height: 60,
      zIndex: 1,
      duration: 300, // 5 minutes
      format: "mm:ss",
      backgroundColor: "#ef4444",
      textColor: "#ffffff",
    };
    onAddElement(element);
  };

  return (
    <div className="bg-white border-b border-slate-200 p-4">
      <h3 className="text-sm font-medium mb-3">Add Elements</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={addTextElement}
          className="flex items-center space-x-2"
        >
          <Type className="w-4 h-4" />
          <span>Text</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={addImageElement}
          className="flex items-center space-x-2"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={addFormElement}
          className="flex items-center space-x-2"
        >
          <Mail className="w-4 h-4" />
          <span>Form</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={addTimerElement}
          className="flex items-center space-x-2"
        >
          <Clock className="w-4 h-4" />
          <span>Timer</span>
        </Button>
      </div>
    </div>
  );
};

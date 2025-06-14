
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, X } from "lucide-react";

export interface BaseElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontSize: number;
  fontWeight: string;
  textAlign: string;
  color: string;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  alt: string;
  borderRadius: number;
}

export interface FormElement extends BaseElement {
  type: "form";
  fields: FormField[];
  buttonText: string;
  buttonColor: string;
}

export interface FormField {
  id: string;
  type: "email" | "text" | "phone";
  placeholder: string;
  required: boolean;
}

export interface TimerElement extends BaseElement {
  type: "timer";
  duration: number;
  format: string;
  backgroundColor: string;
  textColor: string;
}

export type PopupElement = TextElement | ImageElement | FormElement | TimerElement;

interface ElementRendererProps {
  element: PopupElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<PopupElement>) => void;
  onDelete: (id: string) => void;
}

export const ElementRenderer = ({ element, isSelected, onSelect, onUpdate, onDelete }: ElementRendererProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - element.x,
      y: e.clientY - element.y
    });
    onSelect(element.id);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    onUpdate(element.id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const baseStyle = {
    position: 'absolute' as const,
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    zIndex: element.zIndex,
    cursor: 'move',
    border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
  };

  const renderElement = () => {
    switch (element.type) {
      case "text":
        const textEl = element as TextElement;
        return (
          <div
            style={{
              ...baseStyle,
              fontSize: textEl.fontSize,
              fontWeight: textEl.fontWeight,
              textAlign: textEl.textAlign as any,
              color: textEl.color,
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: textEl.textAlign === 'center' ? 'center' : textEl.textAlign === 'right' ? 'flex-end' : 'flex-start',
            }}
            onMouseDown={handleMouseDown}
          >
            {textEl.content}
            {isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(element.id);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );

      case "image":
        const imgEl = element as ImageElement;
        return (
          <div style={baseStyle} onMouseDown={handleMouseDown}>
            <img
              src={imgEl.src}
              alt={imgEl.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: imgEl.borderRadius,
              }}
            />
            {isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(element.id);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );

      case "form":
        const formEl = element as FormElement;
        return (
          <div style={baseStyle} onMouseDown={handleMouseDown}>
            <div className="p-4 space-y-3 bg-white rounded">
              {formEl.fields.map((field) => (
                <Input
                  key={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              ))}
              <Button
                style={{ backgroundColor: formEl.buttonColor }}
                className="w-full text-white"
              >
                {formEl.buttonText}
              </Button>
            </div>
            {isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(element.id);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );

      case "timer":
        const timerEl = element as TimerElement;
        const [timeLeft, setTimeLeft] = useState(timerEl.duration);
        
        React.useEffect(() => {
          const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
          }, 1000);
          return () => clearInterval(timer);
        }, []);

        const formatTime = (seconds: number) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };

        return (
          <div style={baseStyle} onMouseDown={handleMouseDown}>
            <div
              className="flex items-center justify-center rounded p-4"
              style={{
                backgroundColor: timerEl.backgroundColor,
                color: timerEl.textColor,
                width: '100%',
                height: '100%',
              }}
            >
              <Clock className="w-5 h-5 mr-2" />
              <span className="text-xl font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
            {isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(element.id);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return renderElement();
};

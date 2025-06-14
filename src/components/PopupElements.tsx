
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, X, Pin, PinOff } from "lucide-react";
import { CustomHtmlElement } from "./CustomHtmlElement";
import { MultiStepFormRenderer, MultiStepFormElement } from "./MultiStepFormElement";

export interface BaseElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isPinned?: boolean;
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

export interface CustomHtmlElementType extends BaseElement {
  type: "html";
  htmlContent: string;
}

export type PopupElement = TextElement | ImageElement | FormElement | TimerElement | CustomHtmlElementType | MultiStepFormElement;

interface ElementRendererProps {
  element: PopupElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<PopupElement>) => void;
  onDelete: (id: string) => void;
}

export const ElementRenderer = ({ element, isSelected, onSelect, onUpdate, onDelete }: ElementRendererProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSelected) {
      onSelect(element.id);
    }
  };

  const togglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(element.id, { isPinned: !element.isPinned });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(element.id);
  };

  const baseStyle = {
    width: '100%',
    height: '100%',
    cursor: element.isPinned ? 'default' : 'move',
    opacity: element.isPinned ? 0.8 : 1,
  };

  const renderElement = () => {
    switch (element.type) {
      case "multi-step-form":
        return (
          <div style={baseStyle} onClick={handleClick}>
            <MultiStepFormRenderer element={element as MultiStepFormElement} />
          </div>
        );

      case "html":
        return (
          <CustomHtmlElement
            element={element}
            isSelected={isSelected}
            onUpdate={onUpdate}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        );

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
            onClick={handleClick}
          >
            {textEl.content}
          </div>
        );

      case "image":
        const imgEl = element as ImageElement;
        return (
          <div style={baseStyle} onClick={handleClick}>
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
          </div>
        );

      case "form":
        const formEl = element as FormElement;
        return (
          <div style={baseStyle} onClick={handleClick}>
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
          <div style={baseStyle} onClick={handleClick}>
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
          </div>
        );

      default:
        return null;
    }
  };

  return renderElement();
};


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, ChevronLeft, ChevronRight, Copy, ExternalLink, Trash2 } from "lucide-react";
import { BaseElement } from "./PopupElements";

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldType[];
}

export interface FormFieldType {
  id: string;
  type: "email" | "text" | "phone" | "number" | "textarea" | "select" | "checkbox" | "radio";
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[]; // for select, radio
}

export interface SuccessPageConfig {
  title: string;
  message: string;
  showCoupon: boolean;
  couponCode?: string;
  showDismissButton: boolean;
  dismissButtonText: string;
  showRedirectButton: boolean;
  redirectButtonText: string;
  redirectUrl?: string;
}

export interface MultiStepFormElement extends BaseElement {
  type: "multi-step-form";
  steps: FormStep[];
  successPage: SuccessPageConfig;
  buttonColor: string;
  backgroundColor: string;
}

interface MultiStepFormRendererProps {
  element: MultiStepFormElement;
  isPreview?: boolean;
  isEditor?: boolean;
  onUpdate?: (updates: Partial<MultiStepFormElement>) => void;
}

export const MultiStepFormRenderer = ({ 
  element, 
  isPreview = false,
  isEditor = false,
  onUpdate 
}: MultiStepFormRendererProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Initialize with default step if none exist in editor mode
  React.useEffect(() => {
    if (element.steps.length === 0 && isEditor && onUpdate) {
      const defaultStep: FormStep = {
        id: `step_${Date.now()}`,
        title: "Step 1",
        description: "Please fill out the information below",
        fields: [
          {
            id: `field_${Date.now()}`,
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true
          }
        ]
      };
      
      onUpdate({
        steps: [defaultStep]
      });
    }
  }, [element.steps.length, isEditor, onUpdate]);

  const handleNext = () => {
    if (currentStep < element.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const copyCoupon = () => {
    if (element.successPage.couponCode) {
      navigator.clipboard.writeText(element.successPage.couponCode);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2000);
    }
  };

  const addNewStep = () => {
    if (!onUpdate) return;
    
    const newStep: FormStep = {
      id: `step_${Date.now()}`,
      title: `Step ${element.steps.length + 1}`,
      description: "Please fill out the information below",
      fields: [
        {
          id: `field_${Date.now()}`,
          type: "text",
          label: "Field Name",
          placeholder: "Enter value",
          required: false
        }
      ]
    };
    
    onUpdate({
      steps: [...element.steps, newStep]
    });
  };

  const updateStep = (stepId: string, updates: Partial<FormStep>) => {
    if (!onUpdate) return;
    
    const updatedSteps = element.steps.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );
    
    onUpdate({ steps: updatedSteps });
  };

  const deleteStep = (stepId: string) => {
    if (!onUpdate || element.steps.length <= 1) return;
    
    const updatedSteps = element.steps.filter(step => step.id !== stepId);
    onUpdate({ steps: updatedSteps });
    
    if (currentStep >= updatedSteps.length) {
      setCurrentStep(Math.max(0, updatedSteps.length - 1));
    }
  };

  const addFieldToStep = (stepId: string) => {
    if (!onUpdate) return;
    
    const newField: FormFieldType = {
      id: `field_${Date.now()}`,
      type: "text",
      label: "New Field",
      placeholder: "Enter value",
      required: false
    };
    
    const updatedSteps = element.steps.map(step =>
      step.id === stepId
        ? { ...step, fields: [...step.fields, newField] }
        : step
    );
    
    onUpdate({ steps: updatedSteps });
  };

  const updateField = (stepId: string, fieldId: string, updates: Partial<FormFieldType>) => {
    if (!onUpdate) return;
    
    const updatedSteps = element.steps.map(step =>
      step.id === stepId
        ? {
            ...step,
            fields: step.fields.map(field =>
              field.id === fieldId ? { ...field, ...updates } : field
            )
          }
        : step
    );
    
    onUpdate({ steps: updatedSteps });
  };

  const deleteField = (stepId: string, fieldId: string) => {
    if (!onUpdate) return;
    
    const updatedSteps = element.steps.map(step =>
      step.id === stepId
        ? {
            ...step,
            fields: step.fields.filter(field => field.id !== fieldId)
          }
        : step
    );
    
    onUpdate({ steps: updatedSteps });
  };

  const renderField = (field: FormFieldType, stepId?: string) => {
    if (isEditor && stepId) {
      return (
        <div className="space-y-2 p-3 border rounded-lg bg-muted/20">
          <div className="flex items-center justify-between">
            <Input
              value={field.label}
              onChange={(e) => updateField(stepId, field.id, { label: e.target.value })}
              className="font-medium bg-transparent border-none p-0 h-auto"
              placeholder="Field Label"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteField(stepId, field.id)}
              className="h-6 w-6 p-0 text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Select 
              value={field.type} 
              onValueChange={(value) => updateField(stepId, field.id, { type: value as any })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="textarea">Textarea</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="radio">Radio</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateField(stepId, field.id, { required: e.target.checked })}
                className="rounded"
              />
              <span className="text-xs">Required</span>
            </div>
          </div>
          
          <Input
            value={field.placeholder}
            onChange={(e) => updateField(stepId, field.id, { placeholder: e.target.value })}
            placeholder="Placeholder text"
            className="h-8"
          />
          
          {(field.type === 'select' || field.type === 'radio') && (
            <Textarea
              value={field.options?.join('\n') || ''}
              onChange={(e) => updateField(stepId, field.id, { 
                options: e.target.value.split('\n').filter(opt => opt.trim()) 
              })}
              placeholder="Enter options (one per line)"
              rows={3}
              className="text-sm"
            />
          )}
        </div>
      );
    }

    // Regular field rendering for preview/live mode
    const commonProps = {
      id: field.id,
      value: formData[field.id] || '',
      onChange: (e: any) => handleFieldChange(field.id, e.target.value),
      required: field.required,
      className: "w-full"
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            placeholder={field.placeholder}
            rows={3}
          />
        );
      case 'select':
        return (
          <Select value={formData[field.id] || ''} onValueChange={(value) => handleFieldChange(field.id, value)}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.id}
              checked={formData[field.id] || false}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              className="rounded"
            />
            <Label htmlFor={field.id} className="text-sm">{field.label}</Label>
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.id}-${option}`}
                  name={field.id}
                  value={option}
                  checked={formData[field.id] === option}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                />
                <Label htmlFor={`${field.id}-${option}`} className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <Input
            {...commonProps}
            type={field.type}
            placeholder={field.placeholder}
          />
        );
    }
  };

  // Success page rendering
  if (isComplete && !isEditor) {
    return (
      <div 
        className="p-6 rounded-lg text-center space-y-4"
        style={{ backgroundColor: element.backgroundColor }}
      >
        <h3 className="text-xl font-bold">{element.successPage.title}</h3>
        <p className="text-gray-600">{element.successPage.message}</p>
        
        {element.successPage.showCoupon && element.successPage.couponCode && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Your coupon code:</p>
            <div className="flex items-center justify-center space-x-2">
              <code className="bg-white px-3 py-2 rounded font-mono text-lg">
                {element.successPage.couponCode}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={copyCoupon}
                className="flex items-center space-x-1"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedCoupon ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex justify-center space-x-3">
          {element.successPage.showDismissButton && (
            <Button variant="outline">
              {element.successPage.dismissButtonText}
            </Button>
          )}
          {element.successPage.showRedirectButton && (
            <Button
              style={{ backgroundColor: element.buttonColor }}
              className="text-white flex items-center space-x-2"
              onClick={() => {
                if (element.successPage.redirectUrl) {
                  window.open(element.successPage.redirectUrl, '_blank');
                }
              }}
            >
              <span>{element.successPage.redirectButtonText}</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Editor mode
  if (isEditor) {
    return (
      <div 
        className="p-6 rounded-lg space-y-6 w-full h-full overflow-auto"
        style={{ backgroundColor: element.backgroundColor }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Multi-Step Form Editor</h3>
          <Button onClick={addNewStep} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </div>

        {/* Steps Editor */}
        <div className="space-y-4">
          {element.steps.map((step, index) => (
            <div key={step.id} className="border rounded-lg p-4 bg-background/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 space-y-2">
                  <Input
                    value={step.title}
                    onChange={(e) => updateStep(step.id, { title: e.target.value })}
                    className="font-semibold"
                    placeholder="Step title"
                  />
                  <Input
                    value={step.description || ''}
                    onChange={(e) => updateStep(step.id, { description: e.target.value })}
                    placeholder="Step description (optional)"
                    className="text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-sm text-muted-foreground">Step {index + 1}</span>
                  {element.steps.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteStep(step.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {step.fields.map(field => (
                  <div key={field.id}>
                    {renderField(field, step.id)}
                  </div>
                ))}
                
                <Button
                  onClick={() => addFieldToStep(step.id)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Success Page Editor */}
        <div className="border rounded-lg p-4 bg-background/50">
          <h4 className="font-semibold mb-3">Success Page</h4>
          <div className="space-y-3">
            <Input
              value={element.successPage.title}
              onChange={(e) => onUpdate?.({ 
                successPage: { ...element.successPage, title: e.target.value }
              })}
              placeholder="Success page title"
            />
            <Textarea
              value={element.successPage.message}
              onChange={(e) => onUpdate?.({ 
                successPage: { ...element.successPage, message: e.target.value }
              })}
              placeholder="Success page message"
              rows={2}
            />
          </div>
        </div>
      </div>
    );
  }

  // Regular form display
  const currentStepData = element.steps[currentStep];
  if (!currentStepData) return null;

  return (
    <div 
      className="p-6 rounded-lg space-y-4 w-full h-full"
      style={{ backgroundColor: element.backgroundColor }}
    >
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
          {currentStepData.description && (
            <p className="text-sm text-gray-600">{currentStepData.description}</p>
          )}
        </div>
        <span className="text-sm text-gray-500">
          {currentStep + 1} of {element.steps.length}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            backgroundColor: element.buttonColor,
            width: `${((currentStep + 1) / element.steps.length) * 100}%`
          }}
        />
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {currentStepData.fields.map(field => (
          <div key={field.id}>
            {field.type !== 'checkbox' && (
              <Label htmlFor={field.id} className="block text-sm font-medium mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
            )}
            {renderField(field)}
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        
        <Button
          style={{ backgroundColor: element.buttonColor }}
          className="text-white flex items-center space-x-2"
          onClick={handleNext}
        >
          <span>{currentStep === element.steps.length - 1 ? 'Submit' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

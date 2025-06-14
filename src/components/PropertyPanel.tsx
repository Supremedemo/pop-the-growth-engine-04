import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Copy, ExternalLink } from "lucide-react";
import { PopupElement, TextElement, ImageElement, FormElement, TimerElement, CustomHtmlElementType, FormField } from "./PopupElements";
import { MultiStepFormElement, FormStep, FormFieldType, SuccessPageConfig } from "./MultiStepFormElement";

interface PropertyPanelProps {
  selectedElement: PopupElement | null;
  onUpdateElement: (id: string, updates: Partial<PopupElement>) => void;
}

export const PropertyPanel = ({ selectedElement, onUpdateElement }: PropertyPanelProps) => {
  const [newFieldType, setNewFieldType] = useState<FormFieldType["type"]>("text");

  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Select an element to edit its properties</p>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<PopupElement>) => {
    onUpdateElement(selectedElement.id, updates);
  };

  const addFormStep = () => {
    if (selectedElement.type === "multi-step-form") {
      const element = selectedElement as MultiStepFormElement;
      const newStep: FormStep = {
        id: Math.random().toString(36).substr(2, 9),
        title: `Step ${element.steps.length + 1}`,
        fields: []
      };
      handleUpdate({
        steps: [...element.steps, newStep]
      });
    }
  };

  const updateFormStep = (stepIndex: number, updates: Partial<FormStep>) => {
    if (selectedElement.type === "multi-step-form") {
      const element = selectedElement as MultiStepFormElement;
      const updatedSteps = element.steps.map((step, index) =>
        index === stepIndex ? { ...step, ...updates } : step
      );
      handleUpdate({ steps: updatedSteps });
    }
  };

  const deleteFormStep = (stepIndex: number) => {
    if (selectedElement.type === "multi-step-form") {
      const element = selectedElement as MultiStepFormElement;
      const updatedSteps = element.steps.filter((_, index) => index !== stepIndex);
      handleUpdate({ steps: updatedSteps });
    }
  };

  const addFieldToStep = (stepIndex: number) => {
    if (selectedElement.type === "multi-step-form") {
      const element = selectedElement as MultiStepFormElement;
      const newField: FormFieldType = {
        id: Math.random().toString(36).substr(2, 9),
        type: newFieldType,
        label: "New Field",
        placeholder: "Enter value...",
        required: false,
        options: newFieldType === "select" || newFieldType === "radio" ? ["Option 1", "Option 2"] : undefined
      };
      
      const updatedSteps = element.steps.map((step, index) =>
        index === stepIndex ? { ...step, fields: [...step.fields, newField] } : step
      );
      handleUpdate({ steps: updatedSteps });
    }
  };

  const updateField = (stepIndex: number, fieldIndex: number, updates: Partial<FormFieldType>) => {
    if (selectedElement.type === "multi-step-form") {
      const element = selectedElement as MultiStepFormElement;
      const updatedSteps = element.steps.map((step, sIndex) =>
        sIndex === stepIndex ? {
          ...step,
          fields: step.fields.map((field, fIndex) =>
            fIndex === fieldIndex ? { ...field, ...updates } : field
          )
        } : step
      );
      handleUpdate({ steps: updatedSteps });
    }
  };

  const deleteField = (stepIndex: number, fieldIndex: number) => {
    if (selectedElement.type === "multi-step-form") {
      const element = selectedElement as MultiStepFormElement;
      const updatedSteps = element.steps.map((step, sIndex) =>
        sIndex === stepIndex ? {
          ...step,
          fields: step.fields.filter((_, fIndex) => fIndex !== fieldIndex)
        } : step
      );
      handleUpdate({ steps: updatedSteps });
    }
  };

  const updateSuccessPage = (updates: Partial<SuccessPageConfig>) => {
    if (selectedElement.type === "multi-step-form") {
      const element = selectedElement as MultiStepFormElement;
      handleUpdate({
        successPage: { ...element.successPage, ...updates }
      });
    }
  };

  const renderMultiStepFormProperties = () => {
    const element = selectedElement as MultiStepFormElement;
    
    return (
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="success">Success</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Form Steps</h3>
            <Button size="sm" onClick={addFormStep}>
              <Plus className="w-4 h-4 mr-1" />
              Add Step
            </Button>
          </div>

          {element.steps.map((step, stepIndex) => (
            <Card key={step.id} className="border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <Input
                      value={step.title}
                      onChange={(e) => updateFormStep(stepIndex, { title: e.target.value })}
                      className="font-medium"
                      placeholder="Step title"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteFormStep(stepIndex)}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Fields</Label>
                  <div className="flex items-center space-x-2">
                    <select
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as FormFieldType["type"])}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="number">Number</option>
                      <option value="textarea">Textarea</option>
                      <option value="select">Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio</option>
                    </select>
                    <Button size="sm" onClick={() => addFieldToStep(stepIndex)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {step.fields.map((field, fieldIndex) => (
                  <div key={field.id} className="p-2 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {field.type}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteField(stepIndex, fieldIndex)}
                        className="text-red-500 h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(stepIndex, fieldIndex, { label: e.target.value })}
                      placeholder="Field label"
                      className="text-xs"
                    />
                    
                    <Input
                      value={field.placeholder}
                      onChange={(e) => updateField(stepIndex, fieldIndex, { placeholder: e.target.value })}
                      placeholder="Placeholder text"
                      className="text-xs"
                    />

                    {(field.type === "select" || field.type === "radio") && (
                      <div>
                        <Label className="text-xs">Options (one per line)</Label>
                        <Textarea
                          value={field.options?.join('\n') || ''}
                          onChange={(e) => updateField(stepIndex, fieldIndex, { 
                            options: e.target.value.split('\n').filter(opt => opt.trim()) 
                          })}
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          rows={3}
                          className="text-xs"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(stepIndex, fieldIndex, { required: e.target.checked })}
                        className="rounded"
                      />
                      <Label className="text-xs">Required</Label>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="success" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Success Page Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="successTitle">Title</Label>
                <Input
                  id="successTitle"
                  value={element.successPage.title}
                  onChange={(e) => updateSuccessPage({ title: e.target.value })}
                  placeholder="Thank you!"
                />
              </div>

              <div>
                <Label htmlFor="successMessage">Message</Label>
                <Textarea
                  id="successMessage"
                  value={element.successPage.message}
                  onChange={(e) => updateSuccessPage({ message: e.target.value })}
                  placeholder="Your form has been submitted successfully."
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Coupon Code</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showCoupon">Show Coupon</Label>
                  <input
                    id="showCoupon"
                    type="checkbox"
                    checked={element.successPage.showCoupon}
                    onChange={(e) => updateSuccessPage({ showCoupon: e.target.checked })}
                    className="rounded"
                  />
                </div>
                
                {element.successPage.showCoupon && (
                  <div>
                    <Label htmlFor="couponCode">Coupon Code</Label>
                    <Input
                      id="couponCode"
                      value={element.successPage.couponCode || ''}
                      onChange={(e) => updateSuccessPage({ couponCode: e.target.value })}
                      placeholder="SAVE20"
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Action Buttons</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showDismiss">Show Dismiss Button</Label>
                  <input
                    id="showDismiss"
                    type="checkbox"
                    checked={element.successPage.showDismissButton}
                    onChange={(e) => updateSuccessPage({ showDismissButton: e.target.checked })}
                    className="rounded"
                  />
                </div>
                
                {element.successPage.showDismissButton && (
                  <div>
                    <Label htmlFor="dismissText">Dismiss Button Text</Label>
                    <Input
                      id="dismissText"
                      value={element.successPage.dismissButtonText}
                      onChange={(e) => updateSuccessPage({ dismissButtonText: e.target.value })}
                      placeholder="Close"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="showRedirect">Show Redirect Button</Label>
                  <input
                    id="showRedirect"
                    type="checkbox"
                    checked={element.successPage.showRedirectButton}
                    onChange={(e) => updateSuccessPage({ showRedirectButton: e.target.checked })}
                    className="rounded"
                  />
                </div>
                
                {element.successPage.showRedirectButton && (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="redirectText">Redirect Button Text</Label>
                      <Input
                        id="redirectText"
                        value={element.successPage.redirectButtonText}
                        onChange={(e) => updateSuccessPage({ redirectButtonText: e.target.value })}
                        placeholder="Continue Shopping"
                      />
                    </div>
                    <div>
                      <Label htmlFor="redirectUrl">Redirect URL</Label>
                      <Input
                        id="redirectUrl"
                        value={element.successPage.redirectUrl || ''}
                        onChange={(e) => updateSuccessPage({ redirectUrl: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <div>
            <Label htmlFor="buttonColor">Button Color</Label>
            <input
              id="buttonColor"
              type="color"
              value={element.buttonColor}
              onChange={(e) => handleUpdate({ buttonColor: e.target.value })}
              className="w-full h-10 rounded border"
            />
          </div>
          
          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <input
              id="backgroundColor"
              type="color"
              value={element.backgroundColor}
              onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
              className="w-full h-10 rounded border"
            />
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  const renderTextProperties = (element: TextElement) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={element.content}
          onChange={(e) => handleUpdate({ content: e.target.value })}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="fontSize">Font Size</Label>
          <Input
            id="fontSize"
            type="number"
            value={element.fontSize}
            onChange={(e) => handleUpdate({ fontSize: parseInt(e.target.value) || 16 })}
          />
        </div>
        <div>
          <Label htmlFor="fontWeight">Font Weight</Label>
          <select
            id="fontWeight"
            value={element.fontWeight}
            onChange={(e) => handleUpdate({ fontWeight: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
            <option value="bolder">Bolder</option>
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="textAlign">Text Align</Label>
        <select
          id="textAlign"
          value={element.textAlign}
          onChange={(e) => handleUpdate({ textAlign: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <Label htmlFor="color">Text Color</Label>
        <input
          id="color"
          type="color"
          value={element.color}
          onChange={(e) => handleUpdate({ color: e.target.value })}
          className="w-full h-10 rounded border"
        />
      </div>
    </div>
  );

  const renderImageProperties = (element: ImageElement) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-src">Image URL</Label>
        <Input
          id="image-src"
          value={element.src}
          onChange={(e) => handleUpdate({ src: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="image-alt">Alt Text</Label>
        <Input
          id="image-alt"
          value={element.alt}
          onChange={(e) => handleUpdate({ alt: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="border-radius">Border Radius</Label>
        <Input
          id="border-radius"
          type="number"
          value={element.borderRadius}
          onChange={(e) => handleUpdate({ borderRadius: parseInt(e.target.value) })}
        />
      </div>
    </div>
  );

  const renderFormProperties = (element: FormElement) => {
    const addField = () => {
      const newField: FormField = {
        id: Math.random().toString(36).substr(2, 9),
        type: "text",
        placeholder: "Enter text",
        required: false,
      };
      handleUpdate({
        fields: [...element.fields, newField]
      });
    };

    const removeField = (fieldId: string) => {
      handleUpdate({
        fields: element.fields.filter(f => f.id !== fieldId)
      });
    };

    const updateField = (fieldId: string, updates: Partial<FormField>) => {
      handleUpdate({
        fields: element.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
      });
    };

    return (
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Form Fields</Label>
            <Button size="sm" onClick={addField}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {element.fields.map((field) => (
              <div key={field.id} className="p-3 border rounded space-y-2">
                <div className="flex items-center justify-between">
                  <Select value={field.type} onValueChange={(value: any) => updateField(field.id, { type: value })}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={() => removeField(field.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Placeholder text"
                  value={field.placeholder}
                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="button-text">Button Text</Label>
          <Input
            id="button-text"
            value={element.buttonText}
            onChange={(e) => handleUpdate({ buttonText: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="button-color">Button Color</Label>
          <div className="flex items-center space-x-3">
            <Input
              id="button-color"
              type="color"
              value={element.buttonColor}
              onChange={(e) => handleUpdate({ buttonColor: e.target.value })}
              className="w-12 h-8"
            />
            <Input
              value={element.buttonColor}
              onChange={(e) => handleUpdate({ buttonColor: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderTimerProperties = (element: TimerElement) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="timer-duration">Duration (seconds)</Label>
        <Input
          id="timer-duration"
          type="number"
          value={element.duration}
          onChange={(e) => handleUpdate({ duration: parseInt(e.target.value) })}
        />
      </div>
      <div>
        <Label htmlFor="timer-bg">Background Color</Label>
        <div className="flex items-center space-x-3">
          <Input
            id="timer-bg"
            type="color"
            value={element.backgroundColor}
            onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
            className="w-12 h-8"
          />
          <Input
            value={element.backgroundColor}
            onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="timer-text-color">Text Color</Label>
        <div className="flex items-center space-x-3">
          <Input
            id="timer-text-color"
            type="color"
            value={element.textColor}
            onChange={(e) => handleUpdate({ textColor: e.target.value })}
            className="w-12 h-8"
          />
          <Input
            value={element.textColor}
            onChange={(e) => handleUpdate({ textColor: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );

  const renderPositionProperties = () => (
    <div className="space-y-4">
      <h4 className="font-medium">Position & Size</h4>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="pos-x">X</Label>
          <Input
            id="pos-x"
            type="number"
            value={selectedElement.x}
            onChange={(e) => handleUpdate({ x: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="pos-y">Y</Label>
          <Input
            id="pos-y"
            type="number"
            value={selectedElement.y}
            onChange={(e) => handleUpdate({ y: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            value={selectedElement.width}
            onChange={(e) => handleUpdate({ width: parseInt(e.target.value) || 100 })}
          />
        </div>
        <div>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            value={selectedElement.height}
            onChange={(e) => handleUpdate({ height: parseInt(e.target.value) || 100 })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="zIndex">Layer</Label>
        <Input
          id="zIndex"
          type="number"
          value={selectedElement.zIndex}
          onChange={(e) => handleUpdate({ zIndex: parseInt(e.target.value) || 0 })}
        />
      </div>
    </div>
  );

  const renderCommonProperties = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium border-b pb-2">Position & Size</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="x">X</Label>
          <Input
            id="x"
            type="number"
            value={selectedElement.x}
            onChange={(e) => handleUpdate({ x: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="y">Y</Label>
          <Input
            id="y"
            type="number"
            value={selectedElement.y}
            onChange={(e) => handleUpdate({ y: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            value={selectedElement.width}
            onChange={(e) => handleUpdate({ width: parseInt(e.target.value) || 100 })}
          />
        </div>
        <div>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            value={selectedElement.height}
            onChange={(e) => handleUpdate({ height: parseInt(e.target.value) || 100 })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="zIndex">Layer</Label>
        <Input
          id="zIndex"
          type="number"
          value={selectedElement.zIndex}
          onChange={(e) => handleUpdate({ zIndex: parseInt(e.target.value) || 0 })}
        />
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold capitalize">
          {selectedElement.type.replace('-', ' ')} Properties
        </h2>
      </div>
      
      <div className="p-4 space-y-6">
        {selectedElement.type === "multi-step-form" && renderMultiStepFormProperties()}
        
        {selectedElement.type === "text" && renderTextProperties(selectedElement as TextElement)}
        {selectedElement.type === "image" && renderImageProperties(selectedElement as ImageElement)}
        {selectedElement.type === "form" && renderFormProperties(selectedElement as FormElement)}
        {selectedElement.type === "timer" && renderTimerProperties(selectedElement as TimerElement)}
        
        {selectedElement.type !== "multi-step-form" && selectedElement.type !== "text" && (
          <div className="text-center text-gray-500 py-4">
            <p>Properties for {selectedElement.type} elements are under development</p>
          </div>
        )}
        
        <Separator />
        {renderCommonProperties()}
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, ChevronLeft, ChevronRight, Copy, ExternalLink } from "lucide-react";
import { BaseElement } from "./PopupElements";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FormStep {
  id: string;
  title: string;
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
}

export const MultiStepFormRenderer = ({ element, isPreview = false }: MultiStepFormRendererProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep < element.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFormSubmission();
    }
  };

  const handleFormSubmission = async () => {
    if (isPreview) {
      setIsComplete(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Get campaign/template context from URL or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const campaignId = urlParams.get('campaign_id') || localStorage.getItem('current_campaign_id');
      const templateId = urlParams.get('template_id') || localStorage.getItem('current_template_id');
      const websiteId = localStorage.getItem('website_id');
      const trackedUserId = localStorage.getItem('tracked_user_id');

      // Prepare form data with step structure
      const submissionData: Record<string, any> = {};
      element.steps.forEach((step, index) => {
        const stepData: Record<string, any> = {};
        step.fields.forEach(field => {
          if (formData[field.id] !== undefined) {
            stepData[field.id] = formData[field.id];
          }
        });
        submissionData[`step_${index + 1}`] = stepData;
      });

      // Prepare user info
      const userInfo = {
        ip_address: null, // Will be filled by edge function
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        page_url: window.location.href
      };

      // Submit to processing function
      const { data, error } = await supabase.functions.invoke('process-form-submission', {
        body: {
          campaignId,
          templateId,
          formData: submissionData,
          userInfo,
          websiteId,
          trackedUserId
        }
      });

      if (error) {
        console.error('Form submission error:', error);
        toast.error('Failed to submit form. Please try again.');
        return;
      }

      console.log('Form submitted successfully:', data);
      setIsComplete(true);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  const handleRedirect = () => {
    if (element.successPage.redirectUrl) {
      window.open(element.successPage.redirectUrl, '_blank');
    }
  };

  const renderField = (field: FormFieldType) => {
    const commonProps = {
      id: field.id,
      value: formData[field.id] || '',
      onChange: (e: any) => handleFieldChange(field.id, e.target.value),
      required: field.required,
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
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
          <select {...commonProps}>
            <option value="">{field.placeholder}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
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

  if (isComplete) {
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
              onClick={handleRedirect}
            >
              <span>{element.successPage.redirectButtonText}</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  const currentStepData = element.steps[currentStep];
  if (!currentStepData) return null;

  return (
    <div 
      className="p-6 rounded-lg space-y-4"
      style={{ backgroundColor: element.backgroundColor }}
    >
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
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
          disabled={currentStep === 0 || isSubmitting}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        
        <Button
          style={{ backgroundColor: element.buttonColor }}
          className="text-white flex items-center space-x-2"
          onClick={handleNext}
          disabled={isSubmitting}
        >
          <span>
            {isSubmitting ? 'Submitting...' : (currentStep === element.steps.length - 1 ? 'Submit' : 'Next')}
          </span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

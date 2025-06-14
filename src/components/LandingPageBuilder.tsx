
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Layout, Sparkles, Eye, ExternalLink } from "lucide-react";
import { PopupBuilder } from "./PopupBuilder";

interface LandingPageBuilderProps {
  onBack: () => void;
}

const landingPageTemplates = [
  {
    id: "hero-cta",
    name: "Hero + CTA",
    description: "Clean hero section with call-to-action",
    category: "Lead Generation",
    preview: "🎯"
  },
  {
    id: "feature-showcase",
    name: "Feature Showcase",
    description: "Highlight product features and benefits",
    category: "Product",
    preview: "⭐"
  },
  {
    id: "testimonial-focused",
    name: "Social Proof",
    description: "Testimonials and social proof focused",
    category: "Trust Building",
    preview: "💬"
  },
  {
    id: "pricing-table",
    name: "Pricing Plans",
    description: "Clean pricing table layout",
    category: "Sales",
    preview: "💰"
  },
  {
    id: "event-registration",
    name: "Event Landing",
    description: "Event registration and details",
    category: "Events",
    preview: "📅"
  },
  {
    id: "newsletter-signup",
    name: "Newsletter",
    description: "Email signup and content preview",
    category: "Lead Generation",
    preview: "📧"
  }
];

export const LandingPageBuilder = ({ onBack }: LandingPageBuilderProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return (
      <PopupBuilder 
        onBack={() => setShowBuilder(false)}
        initialLayout={{
          id: "fullscreen",
          name: "Landing Page",
          type: "fullscreen",
          description: "Full screen landing page",
          dimensions: { width: 1200, height: 800 },
          position: "center"
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Layout className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold">Landing Page Builder</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowBuilder(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Start from Scratch
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose a Template</h2>
          <p className="text-slate-600">
            Start with a pre-designed template and customize it with our drag-and-drop editor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingPageTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:bg-slate-50'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mx-auto flex items-center justify-center text-2xl">
                    {template.preview}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  
                  {selectedTemplate === template.id && (
                    <div className="flex justify-center space-x-2 pt-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowBuilder(true);
                        }}
                      >
                        <Layout className="w-4 h-4 mr-1" />
                        Edit Template
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Preview functionality would go here
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Builder CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Want AI to Build It for You?
              </h3>
              <p className="text-slate-600 mb-4">
                Upload a screenshot and let our AI analyze your design to create a custom landing page
              </p>
              <Button
                onClick={() => {
                  // This would navigate to AI builder - for now just show builder
                  setShowBuilder(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Try AI Builder
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

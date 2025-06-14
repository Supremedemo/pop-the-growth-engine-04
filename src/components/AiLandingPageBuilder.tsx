
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, Upload, Wand2, Eye, ExternalLink, Sparkles } from "lucide-react";
import { PreviewDialog } from "./PreviewDialog";
import { PublishDialog } from "./PublishDialog";
import { CanvasState } from "./PopupBuilder";

interface AiLandingPageBuilderProps {
  onBack: () => void;
}

type LandingPageType = "lead-generation" | "sales" | "event-registration" | "newsletter-signup" | "product-showcase" | "webinar-signup";

interface LandingPageConfig {
  type: LandingPageType;
  title: string;
  description: string;
  primaryColor: string;
  callToAction: string;
  additionalNotes: string;
}

const landingPageTypes = [
  {
    type: "lead-generation" as const,
    title: "Lead Generation",
    description: "Capture leads with forms and compelling offers",
    icon: "📋",
    features: ["Contact forms", "Lead magnets", "Email capture"]
  },
  {
    type: "sales" as const,
    title: "Sales Landing Page",
    description: "Drive sales with persuasive copy and clear CTAs",
    icon: "💰",
    features: ["Product showcase", "Pricing", "Buy now buttons"]
  },
  {
    type: "event-registration" as const,
    title: "Event Registration",
    description: "Register attendees for events and webinars",
    icon: "📅",
    features: ["Event details", "Registration form", "Calendar integration"]
  },
  {
    type: "newsletter-signup" as const,
    title: "Newsletter Signup",
    description: "Grow your email list with newsletter subscriptions",
    icon: "📧",
    features: ["Email signup", "Benefits list", "Social proof"]
  },
  {
    type: "product-showcase" as const,
    title: "Product Showcase",
    description: "Highlight your product features and benefits",
    icon: "🚀",
    features: ["Feature highlights", "Screenshots", "Testimonials"]
  },
  {
    type: "webinar-signup" as const,
    title: "Webinar Signup",
    description: "Drive registrations for webinars and online events",
    icon: "🎥",
    features: ["Webinar details", "Speaker info", "Registration form"]
  }
];

export const AiLandingPageBuilder = ({ onBack }: AiLandingPageBuilderProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const [config, setConfig] = useState<LandingPageConfig>({
    type: "lead-generation",
    title: "",
    description: "",
    primaryColor: "#3b82f6",
    callToAction: "",
    additionalNotes: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCanvas, setGeneratedCanvas] = useState<CanvasState | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!screenshot || !geminiApiKey) return;

    setIsGenerating(true);
    
    try {
      // Convert screenshot to base64
      const base64 = screenshotPreview.split(',')[1];
      
      const prompt = `
        Based on this screenshot, create a ${config.type} landing page with the following requirements:
        - Title: ${config.title}
        - Description: ${config.description}
        - Primary color: ${config.primaryColor}
        - Call to action: ${config.callToAction}
        - Additional notes: ${config.additionalNotes}
        
        Extract the design elements, color scheme, typography, and layout from the screenshot.
        Create a modern, conversion-optimized landing page that maintains the visual style of the original.
        
        Return a JSON object with the landing page structure including:
        - Hero section with headline and subheadline
        - Key features or benefits
        - Call to action sections
        - Contact form if applicable
        - Color scheme and typography suggestions
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64
                }
              }
            ]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]) {
        const generatedContent = data.candidates[0].content.parts[0].text;
        
        // Create a mock canvas state based on the generated content
        const mockCanvas: CanvasState = {
          width: 1200,
          height: 800,
          backgroundColor: config.primaryColor,
          backgroundType: 'color',
          elements: [
            {
              id: 'hero-title',
              type: 'text',
              x: 50,
              y: 100,
              width: 500,
              height: 60,
              zIndex: 1,
              content: config.title || 'AI Generated Landing Page',
              fontSize: 48,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#ffffff'
            },
            {
              id: 'hero-description',
              type: 'text',
              x: 50,
              y: 180,
              width: 500,
              height: 40,
              zIndex: 1,
              content: config.description || 'Generated from your screenshot using AI',
              fontSize: 18,
              fontWeight: 'normal',
              textAlign: 'center',
              color: '#f1f5f9'
            },
            {
              id: 'cta-form',
              type: 'form',
              x: 200,
              y: 300,
              width: 350,
              height: 200,
              zIndex: 1,
              fields: [
                {
                  id: 'email',
                  type: 'email',
                  placeholder: 'Enter your email',
                  required: true
                },
                {
                  id: 'name',
                  type: 'text',
                  placeholder: 'Your name',
                  required: true
                }
              ],
              buttonText: config.callToAction || 'Get Started',
              buttonColor: '#059669'
            }
          ],
          zoom: 1,
          showGrid: false,
          gridSize: 8,
          layout: {
            id: "fullscreen",
            name: "Fullscreen Landing Page",
            type: "fullscreen",
            description: "Full screen landing page",
            dimensions: { width: 1200, height: 800 },
            position: "center"
          },
          showOverlay: false,
          overlayColor: "#000000",
          overlayOpacity: 50,
          showCloseButton: false,
          closeButtonPosition: 'top-right'
        };
        
        setGeneratedCanvas(mockCanvas);
        setCurrentStep(4);
      }
    } catch (error) {
      console.error('Error generating landing page:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    "Upload Screenshot",
    "Select Type",
    "Configure Details",
    "Generate & Preview"
  ];

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
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold">AI Landing Page Builder</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > index + 1 
                    ? 'bg-green-500 text-white' 
                    : currentStep === index + 1 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= index + 1 ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 mx-4 text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Step 1: Upload Screenshot */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Your Website Screenshot
              </CardTitle>
              <CardDescription>
                Upload a screenshot of your existing website or design inspiration. Our AI will analyze the visual elements and create a landing page that matches your style.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="gemini-api-key">Gemini API Key</Label>
                <Input
                  id="gemini-api-key"
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="mt-1"
                />
                <p className="text-sm text-slate-500 mt-1">
                  Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
                </p>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                {screenshotPreview ? (
                  <div className="space-y-4">
                    <img
                      src={screenshotPreview}
                      alt="Screenshot preview"
                      className="max-w-full h-64 object-contain mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-slate-600">Screenshot uploaded successfully!</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setScreenshot(null);
                        setScreenshotPreview("");
                      }}
                    >
                      Upload Different Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-slate-900">Drop your screenshot here</p>
                      <p className="text-slate-500">or click to browse</p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!screenshot || !geminiApiKey}
                >
                  Next: Select Type
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Landing Page Type */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Landing Page Type</CardTitle>
              <CardDescription>
                Select the type of landing page you want to create. This will determine the layout, content structure, and conversion elements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {landingPageTypes.map((type) => (
                  <Card
                    key={type.type}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      config.type === type.type
                        ? 'ring-2 ring-purple-500 bg-purple-50'
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setConfig(prev => ({ ...prev, type: type.type }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900">{type.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{type.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {type.features.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Next: Configure Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Configure Details */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Configure Landing Page Details</CardTitle>
              <CardDescription>
                Provide specific details about your landing page to help the AI generate more targeted content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Landing Page Title</Label>
                  <Input
                    id="title"
                    value={config.title}
                    onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Get Your Free Marketing Guide"
                  />
                </div>

                <div>
                  <Label htmlFor="callToAction">Call to Action Text</Label>
                  <Input
                    id="callToAction"
                    value={config.callToAction}
                    onChange={(e) => setConfig(prev => ({ ...prev, callToAction: e.target.value }))}
                    placeholder="e.g., Download Now, Get Started, Sign Up"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={config.description}
                    onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of what you're offering..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex space-x-2 mt-1">
                    <input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    value={config.additionalNotes}
                    onChange={(e) => setConfig(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    placeholder="Any specific requirements, target audience details, or special features you want included..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!config.title || !config.callToAction || isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Landing Page
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Preview & Publish */}
        {currentStep === 4 && generatedCanvas && (
          <Card>
            <CardHeader>
              <CardTitle>Your AI-Generated Landing Page</CardTitle>
              <CardDescription>
                Your landing page has been generated! Preview it below and make any adjustments before publishing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-100 rounded-lg p-6 border-2 border-dashed border-slate-300">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg mx-auto flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Landing Page Generated!</h3>
                    <p className="text-slate-600">Your AI-powered landing page is ready for preview</p>
                  </div>
                  <div className="flex justify-center space-x-3">
                    <Button onClick={() => setIsPreviewOpen(true)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsPublishOpen(true)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Publish
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Generated Landing Page Details:</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Type:</strong> {landingPageTypes.find(t => t.type === config.type)?.title}</p>
                  <p><strong>Title:</strong> {config.title}</p>
                  <p><strong>Call to Action:</strong> {config.callToAction}</p>
                  <p><strong>Primary Color:</strong> {config.primaryColor}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Edit
                </Button>
                <Button onClick={() => setCurrentStep(1)} variant="outline">
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Preview Dialog */}
      {generatedCanvas && (
        <PreviewDialog
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          canvasState={generatedCanvas}
        />
      )}

      {/* Publish Dialog */}
      {generatedCanvas && (
        <PublishDialog
          open={isPublishOpen}
          onOpenChange={setIsPublishOpen}
          templateName={config.title || "AI Generated Landing Page"}
          canvasData={generatedCanvas}
        />
      )}
    </div>
  );
};

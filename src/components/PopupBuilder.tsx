
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Eye, 
  Save, 
  Settings, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Plus,
  Target,
  Clock,
  Smartphone,
  Monitor
} from "lucide-react";

interface PopupBuilderProps {
  onBack: () => void;
}

export const PopupBuilder = ({ onBack }: PopupBuilderProps) => {
  const [popupConfig, setPopupConfig] = useState({
    title: "Don't Miss Out!",
    subtitle: "Get 20% off your first order",
    buttonText: "Get My Discount",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    buttonColor: "#10b981",
    type: "modal",
    size: "medium",
    position: "center"
  });

  const [previewDevice, setPreviewDevice] = useState("desktop");

  const PopupPreview = () => (
    <div className="relative">
      {/* Device Frame */}
      <div className={`mx-auto ${previewDevice === "desktop" ? "w-full max-w-4xl" : "w-80"}`}>
        <div className={`bg-gray-100 rounded-lg p-4 ${previewDevice === "desktop" ? "aspect-video" : "aspect-[9/16]"}`}>
          {/* Popup Preview */}
          <div className="relative w-full h-full bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              {/* Popup */}
              <div 
                className={`bg-white rounded-lg shadow-2xl p-6 max-w-md mx-4 ${
                  popupConfig.size === "small" ? "w-80" : 
                  popupConfig.size === "large" ? "w-96" : "w-88"
                }`}
                style={{ backgroundColor: popupConfig.backgroundColor }}
              >
                <div className="text-center space-y-4">
                  <h3 
                    className="text-2xl font-bold"
                    style={{ color: popupConfig.textColor }}
                  >
                    {popupConfig.title}
                  </h3>
                  <p 
                    className="text-lg opacity-90"
                    style={{ color: popupConfig.textColor }}
                  >
                    {popupConfig.subtitle}
                  </p>
                  <div className="space-y-3">
                    <Input 
                      placeholder="Enter your email" 
                      className="bg-white border-white/20"
                    />
                    <Button 
                      className="w-full text-white font-semibold"
                      style={{ backgroundColor: popupConfig.buttonColor }}
                    >
                      {popupConfig.buttonText}
                    </Button>
                  </div>
                  <p className="text-xs opacity-70" style={{ color: popupConfig.textColor }}>
                    No spam, unsubscribe at any time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Device Selector */}
      <div className="flex justify-center mt-4 space-x-2">
        <Button
          variant={previewDevice === "desktop" ? "default" : "outline"}
          size="sm"
          onClick={() => setPreviewDevice("desktop")}
        >
          <Monitor className="w-4 h-4 mr-2" />
          Desktop
        </Button>
        <Button
          variant={previewDevice === "mobile" ? "default" : "outline"}
          size="sm"
          onClick={() => setPreviewDevice("mobile")}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Mobile
        </Button>
      </div>
    </div>
  );

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
            <h1 className="text-xl font-semibold">Popup Builder</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              Publish Campaign
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Panel - Controls */}
        <div className="w-80 bg-white border-r border-slate-200 h-screen overflow-y-auto">
          <Tabs defaultValue="design" className="w-full">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="targeting">Targeting</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="p-4 space-y-6">
              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Type className="w-4 h-4 mr-2" />
                    Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Headline</Label>
                    <Input
                      id="title"
                      value={popupConfig.title}
                      onChange={(e) => setPopupConfig({...popupConfig, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Textarea
                      id="subtitle"
                      value={popupConfig.subtitle}
                      onChange={(e) => setPopupConfig({...popupConfig, subtitle: e.target.value})}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="button">Button Text</Label>
                    <Input
                      id="button"
                      value={popupConfig.buttonText}
                      onChange={(e) => setPopupConfig({...popupConfig, buttonText: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Design */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Palette className="w-4 h-4 mr-2" />
                    Colors & Style
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bg-color">Background Color</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        id="bg-color"
                        type="color"
                        value={popupConfig.backgroundColor}
                        onChange={(e) => setPopupConfig({...popupConfig, backgroundColor: e.target.value})}
                        className="w-12 h-8"
                      />
                      <Input
                        value={popupConfig.backgroundColor}
                        onChange={(e) => setPopupConfig({...popupConfig, backgroundColor: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        id="text-color"
                        type="color"
                        value={popupConfig.textColor}
                        onChange={(e) => setPopupConfig({...popupConfig, textColor: e.target.value})}
                        className="w-12 h-8"
                      />
                      <Input
                        value={popupConfig.textColor}
                        onChange={(e) => setPopupConfig({...popupConfig, textColor: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="button-color">Button Color</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        id="button-color"
                        type="color"
                        value={popupConfig.buttonColor}
                        onChange={(e) => setPopupConfig({...popupConfig, buttonColor: e.target.value})}
                        className="w-12 h-8"
                      />
                      <Input
                        value={popupConfig.buttonColor}
                        onChange={(e) => setPopupConfig({...popupConfig, buttonColor: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Popup Size</Label>
                    <Select value={popupConfig.size} onValueChange={(value) => setPopupConfig({...popupConfig, size: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (320px)</SelectItem>
                        <SelectItem value="medium">Medium (400px)</SelectItem>
                        <SelectItem value="large">Large (500px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="targeting" className="p-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Display Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="exit-intent">Exit Intent</Label>
                    <Switch id="exit-intent" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-visitors">New Visitors Only</Label>
                    <Switch id="new-visitors" />
                  </div>
                  <div>
                    <Label>Time Delay (seconds)</Label>
                    <Slider defaultValue={[5]} max={60} step={1} className="mt-2" />
                  </div>
                  <div>
                    <Label>Page Views Threshold</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">After 1 page view</SelectItem>
                        <SelectItem value="2">After 2 page views</SelectItem>
                        <SelectItem value="3">After 3 page views</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="p-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Campaign Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input id="campaign-name" placeholder="My Awesome Popup" />
                  </div>
                  <div>
                    <Label>Popup Type</Label>
                    <Select value={popupConfig.type} onValueChange={(value) => setPopupConfig({...popupConfig, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modal">Modal/Lightbox</SelectItem>
                        <SelectItem value="slide-in">Slide-in</SelectItem>
                        <SelectItem value="banner">Top Banner</SelectItem>
                        <SelectItem value="fullscreen">Fullscreen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mobile-enabled">Mobile Enabled</Label>
                    <Switch id="mobile-enabled" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="desktop-enabled">Desktop Enabled</Label>
                    <Switch id="desktop-enabled" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 p-6">
          <PopupPreview />
        </div>
      </div>
    </div>
  );
};

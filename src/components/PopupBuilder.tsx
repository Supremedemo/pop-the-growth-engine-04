
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Eye, 
  Save, 
  Smartphone,
  Monitor,
  Layers
} from "lucide-react";
import { ElementToolbar } from "./ElementToolbar";
import { ElementRenderer, PopupElement } from "./PopupElements";
import { PropertyPanel } from "./PropertyPanel";
import { LayoutSelector, PopupLayout } from "./LayoutSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Plus,
  Target,
  Clock,
  Settings, 
  Palette, 
  Type, 
  Image as ImageIcon,
} from "lucide-react";

interface PopupBuilderProps {
  onBack: () => void;
}

export const PopupBuilder = ({ onBack }: PopupBuilderProps) => {
  const [elements, setElements] = useState<PopupElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [popupLayout, setPopupLayout] = useState<PopupLayout>({
    id: "modal-center",
    name: "Modal - Center",
    type: "modal",
    description: "Classic popup in the center of screen",
    dimensions: { width: 500, height: 400 },
    position: "center"
  });

  const addElement = (element: PopupElement) => {
    setElements([...elements, element]);
    setSelectedElementId(element.id);
  };

  const updateElement = (id: string, updates: Partial<PopupElement>) => {
    setElements(prevElements => 
      prevElements.map(el => 
        el.id === id ? { ...el, ...updates } as PopupElement : el
      )
    );
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const selectedElement = elements.find(el => el.id === selectedElementId) || null;

  const getPopupContainerStyle = () => {
    const { dimensions, position, type } = popupLayout;
    
    let containerStyle: React.CSSProperties = {
      width: dimensions.width,
      height: dimensions.height,
      maxWidth: dimensions.maxWidth || 'none',
      maxHeight: dimensions.maxHeight || 'none',
      position: 'relative',
      backgroundColor: '#ffffff',
      borderRadius: type === 'banner' ? '0' : '12px',
      boxShadow: type === 'fullscreen' ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
    };

    if (previewDevice === "mobile") {
      containerStyle.width = Math.min(320, dimensions.width);
      containerStyle.height = Math.min(480, dimensions.height);
    }

    return containerStyle;
  };

  const getPreviewWrapperStyle = () => {
    const { position, type } = popupLayout;
    
    let wrapperStyle: React.CSSProperties = {
      display: 'flex',
      minHeight: '600px',
      backgroundColor: '#f1f5f9',
      position: 'relative',
    };

    if (type === 'fullscreen') {
      wrapperStyle.alignItems = 'stretch';
      wrapperStyle.justifyContent = 'stretch';
    } else if (position === 'center') {
      wrapperStyle.alignItems = 'center';
      wrapperStyle.justifyContent = 'center';
    } else if (position === 'top') {
      wrapperStyle.alignItems = 'flex-start';
      wrapperStyle.justifyContent = 'center';
    } else if (position === 'bottom') {
      wrapperStyle.alignItems = 'flex-end';
      wrapperStyle.justifyContent = 'center';
    } else if (position === 'left') {
      wrapperStyle.alignItems = 'center';
      wrapperStyle.justifyContent = 'flex-start';
    } else if (position === 'right') {
      wrapperStyle.alignItems = 'center';
      wrapperStyle.justifyContent = 'flex-end';
    }

    return wrapperStyle;
  };

  const PopupPreview = () => (
    <div className="relative flex-1">
      <div className={`mx-auto ${previewDevice === "desktop" ? "w-full max-w-4xl" : "w-80"}`}>
        <div style={getPreviewWrapperStyle()}>
          <div 
            style={getPopupContainerStyle()}
            onClick={() => setSelectedElementId(null)}
          >
            {elements.map((element) => (
              <ElementRenderer
                key={element.id}
                element={element}
                isSelected={element.id === selectedElementId}
                onSelect={setSelectedElementId}
                onUpdate={updateElement}
                onDelete={deleteElement}
              />
            ))}
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Add elements to start building your popup</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
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
          <ElementToolbar onAddElement={addElement} />
          
          <Tabs defaultValue="layout" className="w-full">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="layout" className="p-4">
              <LayoutSelector 
                selectedLayout={popupLayout}
                onLayoutChange={setPopupLayout}
              />
            </TabsContent>

            <TabsContent value="properties" className="p-0">
              <PropertyPanel 
                selectedElement={selectedElement}
                onUpdateElement={updateElement}
              />
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
                    <Select value={popupLayout.type} onValueChange={(value) => setPopupLayout({...popupLayout, type: value} as any)}>
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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Image as ImageIcon, Layers } from "lucide-react";

interface BackgroundControlsProps {
  backgroundColor: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  onBackgroundChange: (type: 'color' | 'image' | 'gradient', value: string) => void;
}

export const BackgroundControls = ({ 
  backgroundColor, 
  backgroundImage, 
  backgroundGradient,
  onBackgroundChange 
}: BackgroundControlsProps) => {
  const [customImageUrl, setCustomImageUrl] = useState("");

  const gradientPresets = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  ];

  const colorPresets = [
    "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0",
    "#3b82f6", "#8b5cf6", "#ef4444", "#10b981",
    "#f59e0b", "#ec4899", "#06b6d4", "#84cc16"
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-700 flex items-center">
        <Palette className="w-4 h-4 mr-2" />
        Canvas Background
      </h3>
      
      <Tabs defaultValue="color" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="color">Color</TabsTrigger>
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
        </TabsList>

        <TabsContent value="color" className="space-y-3">
          <div className="space-y-2">
            <Label>Custom Color</Label>
            <div className="flex space-x-2">
              <Input
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundChange('color', e.target.value)}
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => onBackgroundChange('color', e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Presets</Label>
            <div className="grid grid-cols-6 gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  onClick={() => onBackgroundChange('color', color)}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    backgroundColor === color ? 'border-blue-500 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gradient" className="space-y-3">
          <div className="space-y-2">
            <Label>Gradient Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              {gradientPresets.map((gradient, index) => (
                <button
                  key={index}
                  onClick={() => onBackgroundChange('gradient', gradient)}
                  className={`h-12 rounded border-2 transition-all ${
                    backgroundGradient === gradient ? 'border-blue-500 scale-105' : 'border-gray-300'
                  }`}
                  style={{ background: gradient }}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-3">
          <div className="space-y-2">
            <Label>Image URL</Label>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              <Button
                onClick={() => {
                  if (customImageUrl) {
                    onBackgroundChange('image', customImageUrl);
                  }
                }}
                size="sm"
              >
                Apply
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Stock Images</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop"
              ].map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => onBackgroundChange('image', imageUrl)}
                  className={`h-16 rounded border-2 bg-cover bg-center transition-all ${
                    backgroundImage === imageUrl ? 'border-blue-500 scale-105' : 'border-gray-300'
                  }`}
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

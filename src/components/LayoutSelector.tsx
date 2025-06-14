
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Smartphone, Square, Maximize2, AlignHorizontalJustifyCenter } from "lucide-react";

export interface PopupLayout {
  id: string;
  name: string;
  type: "modal" | "slide-in" | "banner" | "fullscreen" | "inline";
  description: string;
  dimensions: {
    width: number;
    height: number;
    maxWidth?: string;
    maxHeight?: string;
  };
  position: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

interface LayoutSelectorProps {
  selectedLayout: PopupLayout;
  onLayoutChange: (layout: PopupLayout) => void;
}

export const LayoutSelector = ({ selectedLayout, onLayoutChange }: LayoutSelectorProps) => {
  const layouts: PopupLayout[] = [
    {
      id: "modal-center",
      name: "Modal - Center",
      type: "modal",
      description: "Classic popup in the center of screen",
      dimensions: { width: 500, height: 400 },
      position: "center"
    },
    {
      id: "slide-in-right",
      name: "Slide-in - Right",
      type: "slide-in",
      description: "Slides in from the right side",
      dimensions: { width: 350, height: 500 },
      position: "right"
    },
    {
      id: "slide-in-left",
      name: "Slide-in - Left",
      type: "slide-in",
      description: "Slides in from the left side",
      dimensions: { width: 350, height: 500 },
      position: "left"
    },
    {
      id: "banner-top",
      name: "Banner - Top",
      type: "banner",
      description: "Top banner notification",
      dimensions: { width: 800, height: 80, maxWidth: "100%" },
      position: "top"
    },
    {
      id: "banner-bottom",
      name: "Banner - Bottom",
      type: "banner",
      description: "Bottom banner notification",
      dimensions: { width: 800, height: 80, maxWidth: "100%" },
      position: "bottom"
    },
    {
      id: "fullscreen",
      name: "Fullscreen",
      type: "fullscreen",
      description: "Takes up the entire screen",
      dimensions: { width: 800, height: 600, maxWidth: "100vw", maxHeight: "100vh" },
      position: "center"
    },
    {
      id: "modal-small",
      name: "Modal - Small",
      type: "modal",
      description: "Compact popup for quick actions",
      dimensions: { width: 400, height: 300 },
      position: "center"
    },
    {
      id: "modal-large",
      name: "Modal - Large",
      type: "modal",
      description: "Large popup for detailed content",
      dimensions: { width: 700, height: 500 },
      position: "center"
    }
  ];

  const getLayoutIcon = (type: string) => {
    switch (type) {
      case "modal":
        return <Square className="w-5 h-5" />;
      case "slide-in":
        return <AlignHorizontalJustifyCenter className="w-5 h-5" />;
      case "banner":
        return <Monitor className="w-5 h-5" />;
      case "fullscreen":
        return <Maximize2 className="w-5 h-5" />;
      default:
        return <Square className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Popup Layout</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {layouts.map((layout) => (
          <Card
            key={layout.id}
            className={`cursor-pointer transition-all ${
              selectedLayout.id === layout.id
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "hover:shadow-md"
            }`}
            onClick={() => onLayoutChange(layout)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                {getLayoutIcon(layout.type)}
                <span>{layout.name}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {layout.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-slate-500">
                {layout.dimensions.width} × {layout.dimensions.height}px
                {layout.dimensions.maxWidth && (
                  <span className="block">Max: {layout.dimensions.maxWidth}</span>
                )}
              </div>
              <div className="mt-2">
                <div className="w-full h-12 bg-slate-100 rounded relative overflow-hidden">
                  <div
                    className={`absolute bg-blue-500 rounded-sm ${
                      layout.type === "banner"
                        ? layout.position === "top"
                          ? "top-0 left-0 right-0 h-2"
                          : "bottom-0 left-0 right-0 h-2"
                        : layout.type === "fullscreen"
                        ? "inset-0"
                        : layout.position === "center"
                        ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-4"
                        : layout.position === "right"
                        ? "top-1 right-1 w-3 h-10"
                        : "top-1 left-1 w-3 h-10"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};


export type PredefinedTemplateCategory =
  | "Lead Generation"
  | "E-commerce"
  | "Mobile-First"
  | "Holiday/Seasonal"
  | "B2B";

export interface PredefinedTemplate {
  id: string;
  name: string;
  description: string;
  category: PredefinedTemplateCategory;
  icon: string; // lucide-react icon name
  previewImage: string;
  config: any;
  features: string[];
  tags: string[];
}

export const predefinedTemplates: PredefinedTemplate[] = [
  // Example templates, add full objects later
  {
    id: "fortune-wheel-advanced",
    name: "Fortune Wheel Advanced",
    description: "Customizable spin wheel with probability and prize settings.",
    category: "Lead Generation",
    icon: "RotateCcw",
    previewImage: "/placeholder.svg",
    config: {
      // To be fully defined per template
    },
    features: [
      "Custom segments",
      "Probability controls",
      "Branding options",
      "Realtime tracking"
    ],
    tags: ["Spin Wheel", "Lead", "Game"],
  },
  // ...add more stubs, categories
];

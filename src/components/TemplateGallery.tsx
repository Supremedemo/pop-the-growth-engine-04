
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Star, 
  Eye, 
  ShoppingCart, 
  Mail, 
  Gift, 
  Users, 
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";

interface TemplateGalleryProps {
  onSelectTemplate: () => void;
}

export const TemplateGallery = ({ onSelectTemplate }: TemplateGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Templates", count: 52 },
    { id: "newsletter", name: "Newsletter", count: 12, icon: Mail },
    { id: "ecommerce", name: "E-commerce", count: 18, icon: ShoppingCart },
    { id: "discount", name: "Discounts", count: 10, icon: Gift },
    { id: "lead-gen", name: "Lead Generation", count: 8, icon: Users },
    { id: "exit-intent", name: "Exit Intent", count: 4, icon: Eye }
  ];

  const templates = [
    {
      id: 1,
      name: "Welcome Discount",
      category: "discount",
      type: "Modal",
      preview: "bg-gradient-to-br from-blue-500 to-purple-600",
      rating: 4.8,
      uses: 1247,
      devices: ["desktop", "mobile"],
      description: "Convert first-time visitors with an irresistible welcome offer"
    },
    {
      id: 2,
      name: "Newsletter Signup",
      category: "newsletter",
      type: "Slide-in",
      preview: "bg-gradient-to-br from-green-500 to-teal-600",
      rating: 4.6,
      uses: 892,
      devices: ["desktop", "mobile", "tablet"],
      description: "Build your email list with a clean, professional signup form"
    },
    {
      id: 3,
      name: "Cart Abandonment",
      category: "ecommerce",
      type: "Modal",
      preview: "bg-gradient-to-br from-orange-500 to-red-600",
      rating: 4.9,
      uses: 2156,
      devices: ["desktop", "mobile"],
      description: "Recover lost sales with targeted cart abandonment popups"
    },
    {
      id: 4,
      name: "Exit Intent Offer",
      category: "exit-intent",
      type: "Modal",
      preview: "bg-gradient-to-br from-purple-500 to-pink-600",
      rating: 4.7,
      uses: 734,
      devices: ["desktop"],
      description: "Capture leaving visitors with last-chance offers"
    },
    {
      id: 5,
      name: "Mobile App Download",
      category: "lead-gen",
      type: "Banner",
      preview: "bg-gradient-to-br from-indigo-500 to-blue-600",
      rating: 4.5,
      uses: 445,
      devices: ["mobile"],
      description: "Drive mobile app downloads with compelling CTAs"
    },
    {
      id: 6,
      name: "Product Quiz",
      category: "ecommerce",
      type: "Modal",
      preview: "bg-gradient-to-br from-teal-500 to-green-600",
      rating: 4.8,
      uses: 967,
      devices: ["desktop", "mobile", "tablet"],
      description: "Help customers find perfect products with interactive quizzes"
    },
    {
      id: 7,
      name: "Black Friday Sale",
      category: "discount",
      type: "Fullscreen",
      preview: "bg-gradient-to-br from-gray-900 to-red-900",
      rating: 4.9,
      uses: 1523,
      devices: ["desktop", "mobile"],
      description: "Create urgency with high-impact sale announcements"
    },
    {
      id: 8,
      name: "Webinar Registration",
      category: "lead-gen",
      type: "Modal",
      preview: "bg-gradient-to-br from-blue-600 to-indigo-700",
      rating: 4.6,
      uses: 623,
      devices: ["desktop", "mobile"],
      description: "Drive event registrations with professional forms"
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "desktop": return <Monitor className="w-3 h-3" />;
      case "mobile": return <Smartphone className="w-3 h-3" />;
      case "tablet": return <Tablet className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Template Gallery</h1>
        <p className="text-slate-600">Choose from our collection of high-converting popup templates</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80"
          />
        </div>
        <Button variant="outline" className="bg-white/80">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Categories Sidebar */}
        <div className="lg:w-64">
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-sm">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {Icon && <Icon className="w-4 h-4" />}
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-3">
                  {/* Template Preview */}
                  <div className={`w-full h-32 rounded-lg ${template.preview} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        className="bg-white text-slate-900 hover:bg-slate-100"
                        onClick={onSelectTemplate}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                    {/* Mock popup preview */}
                    <div className="absolute inset-4 bg-white/90 rounded shadow-lg p-2">
                      <div className="h-2 bg-slate-300 rounded mb-1"></div>
                      <div className="h-1 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-blue-500 rounded"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{template.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {template.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600">{template.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{template.rating}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {template.uses.toLocaleString()} uses
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {template.devices.map((device, index) => (
                        <div key={index} className="text-slate-400">
                          {getDeviceIcon(device)}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={onSelectTemplate}
                  >
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search or filter criteria</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

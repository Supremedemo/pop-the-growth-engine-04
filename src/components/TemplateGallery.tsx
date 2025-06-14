import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  Tablet,
  Crown,
  Trophy,
  Zap,
  Target,
  Heart,
  GamepadIcon,
  Rocket,
  Sparkles,
  Clock,
  TrendingUp,
  Award,
  Lock,
  Unlock
} from "lucide-react";

interface TemplateGalleryProps {
  onSelectTemplate: () => void;
}

export const TemplateGallery = ({ onSelectTemplate }: TemplateGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userLevel] = useState(5);
  const [userPoints] = useState(2450);
  const [unlockedTemplates] = useState(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));

  const categories = [
    { id: "all", name: "All Templates", count: 24 },
    { id: "newsletter", name: "Newsletter", count: 4, icon: Mail },
    { id: "ecommerce", name: "E-commerce", count: 6, icon: ShoppingCart },
    { id: "discount", name: "Discounts", count: 5, icon: Gift },
    { id: "lead-gen", name: "Lead Generation", count: 4, icon: Users },
    { id: "exit-intent", name: "Exit Intent", count: 3, icon: Eye },
    { id: "gamified", name: "Gamified", count: 2, icon: GamepadIcon }
  ];

  const achievements = [
    { id: 1, name: "Template Explorer", description: "Use 5 different templates", icon: Eye, completed: true, points: 100 },
    { id: 2, name: "Conversion Master", description: "Achieve 5%+ conversion rate", icon: Target, completed: true, points: 200 },
    { id: 3, name: "Design Guru", description: "Customize 10 templates", icon: Sparkles, completed: false, points: 150 },
    { id: 4, name: "Speed Demon", description: "Create popup in under 5 minutes", icon: Rocket, completed: true, points: 75 }
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
      description: "Convert first-time visitors with an irresistible welcome offer",
      level: 1,
      premium: false,
      conversionRate: "12.5%"
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
      description: "Build your email list with a clean, professional signup form",
      level: 1,
      premium: false,
      conversionRate: "8.3%"
    },
    {
      id: 9,
      name: "AI-Powered Product Recommender",
      category: "ecommerce",
      type: "Modal",
      preview: "bg-gradient-to-br from-violet-600 to-purple-700",
      rating: 4.9,
      uses: 1834,
      devices: ["desktop", "mobile", "tablet"],
      description: "Smart AI recommendations based on browsing behavior and preferences",
      level: 3,
      premium: true,
      conversionRate: "18.7%",
      features: ["AI Analytics", "Smart Targeting", "Dynamic Content"]
    },
    {
      id: 10,
      name: "Spin-to-Win Wheel",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-yellow-500 to-orange-600",
      rating: 4.8,
      uses: 2156,
      devices: ["desktop", "mobile"],
      description: "Gamified discount wheel that increases engagement and conversions",
      level: 2,
      premium: false,
      conversionRate: "15.2%",
      features: ["Gamification", "Sound Effects", "Animated Wheel"]
    },
    {
      id: 11,
      name: "Social Proof Ticker",
      category: "ecommerce",
      type: "Banner",
      preview: "bg-gradient-to-br from-emerald-500 to-teal-600",
      rating: 4.7,
      uses: 1523,
      devices: ["desktop", "mobile", "tablet"],
      description: "Real-time social proof notifications to build trust and urgency",
      level: 2,
      premium: false,
      conversionRate: "9.8%",
      features: ["Real-time Data", "Auto-refresh", "Customizable Timing"]
    },
    {
      id: 12,
      name: "Multi-Step Lead Magnet",
      category: "lead-gen",
      type: "Modal",
      preview: "bg-gradient-to-br from-blue-600 to-indigo-700",
      rating: 4.9,
      uses: 967,
      devices: ["desktop", "mobile"],
      description: "Progressive lead capture with multiple steps for higher quality leads",
      level: 3,
      premium: true,
      conversionRate: "22.1%",
      features: ["Multi-Step Form", "Progress Indicator", "Smart Validation"]
    },
    {
      id: 13,
      name: "Video Background Hero",
      category: "newsletter",
      type: "Fullscreen",
      preview: "bg-gradient-to-br from-gray-900 to-red-900",
      rating: 4.8,
      uses: 734,
      devices: ["desktop"],
      description: "Stunning video background popup for maximum visual impact",
      level: 4,
      premium: true,
      conversionRate: "14.6%",
      features: ["Video Background", "Auto-play", "Mobile Optimized"]
    },
    {
      id: 14,
      name: "Smart Exit Intent",
      category: "exit-intent",
      type: "Modal",
      preview: "bg-gradient-to-br from-red-500 to-pink-600",
      rating: 4.9,
      uses: 1345,
      devices: ["desktop"],
      description: "AI-powered exit intent with personalized last-chance offers",
      level: 3,
      premium: true,
      conversionRate: "19.3%",
      features: ["AI Personalization", "Behavioral Triggers", "Smart Timing"]
    },
    {
      id: 15,
      name: "Scratch Card Reveal",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-amber-500 to-yellow-600",
      rating: 4.7,
      uses: 823,
      devices: ["desktop", "mobile"],
      description: "Interactive scratch card game for discount reveals",
      level: 2,
      premium: false,
      conversionRate: "16.4%",
      features: ["Touch Interaction", "Reveal Animation", "Sound Effects"]
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
      description: "Recover lost sales with targeted cart abandonment popups",
      level: 1,
      premium: false,
      conversionRate: "11.2%"
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
      description: "Capture leaving visitors with last-chance offers",
      level: 1,
      premium: false,
      conversionRate: "7.9%"
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
      description: "Drive mobile app downloads with compelling CTAs",
      level: 1,
      premium: false,
      conversionRate: "6.3%"
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
      description: "Help customers find perfect products with interactive quizzes",
      level: 2,
      premium: false,
      conversionRate: "13.7%"
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
      description: "Create urgency with high-impact sale announcements",
      level: 1,
      premium: false,
      conversionRate: "20.4%"
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
      description: "Drive event registrations with professional forms",
      level: 1,
      premium: false,
      conversionRate: "10.1%"
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

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "bg-green-100 text-green-800";
      case 2: return "bg-blue-100 text-blue-800";
      case 3: return "bg-purple-100 text-purple-800";
      case 4: return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const canUseTemplate = (template: any) => {
    return unlockedTemplates.has(template.id) || userLevel >= template.level;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Header with Gamification */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Template Gallery</h1>
            <p className="text-slate-600">Choose from our collection of high-converting popup templates</p>
          </div>
          
          {/* User Progress */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">Level {userLevel}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{userPoints.toLocaleString()} pts</span>
              </div>
            </div>
            <Progress value={(userPoints % 500) / 5} className="mt-2 w-32" />
            <p className="text-xs text-slate-500 mt-1">{500 - (userPoints % 500)} pts to next level</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`bg-white/60 backdrop-blur-sm rounded-lg p-3 border transition-all ${
                  achievement.completed 
                    ? "border-green-200 bg-green-50/50" 
                    : "border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Icon className={`w-4 h-4 ${achievement.completed ? "text-green-600" : "text-slate-400"}`} />
                  <span className="text-sm font-medium">{achievement.name}</span>
                  {achievement.completed && <Trophy className="w-3 h-3 text-yellow-500" />}
                </div>
                <p className="text-xs text-slate-600">{achievement.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500">+{achievement.points} pts</span>
                  {achievement.completed && <Badge variant="secondary" className="text-xs">Complete</Badge>}
                </div>
              </div>
            );
          })}
        </div>
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
            {filteredTemplates.map((template) => {
              const isLocked = !canUseTemplate(template);
              return (
                <Card key={template.id} className={`bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all group relative ${isLocked ? 'opacity-75' : ''}`}>
                  {isLocked && (
                    <div className="absolute top-2 right-2 z-10">
                      <Lock className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    {/* Template Preview */}
                    <div className={`w-full h-32 rounded-lg ${template.preview} relative overflow-hidden`}>
                      {isLocked && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="text-white text-center">
                            <Lock className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-xs">Level {template.level} Required</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          className="bg-white text-slate-900 hover:bg-slate-100"
                          onClick={onSelectTemplate}
                          disabled={isLocked}
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
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs">
                          {template.type}
                        </Badge>
                        {template.premium && (
                          <Badge className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500">
                            Pro
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600">{template.description}</p>
                    
                    {/* Features */}
                    {template.features && (
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{template.rating}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {template.uses.toLocaleString()} uses
                        </div>
                        {template.conversionRate && (
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs font-medium text-green-600">
                              {template.conversionRate}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {template.devices.map((device, index) => (
                          <div key={index} className="text-slate-400">
                            {getDeviceIcon(device)}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${getLevelColor(template.level)}`}>
                        Level {template.level}
                      </Badge>
                      
                      <Button 
                        className="flex-1 ml-3" 
                        onClick={onSelectTemplate}
                        disabled={isLocked}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Locked
                          </>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4 mr-2" />
                            Use Template
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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

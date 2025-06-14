import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileManager } from "./FileManager";
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
  Unlock,
  FolderOpen,
  Files,
  Dice1,
  Coins,
  Timer,
  RotateCcw,
  Crosshair,
  Puzzle,
  Gamepad2,
  Flame
} from "lucide-react";

interface TemplateGalleryProps {
  onSelectTemplate: () => void;
}

export const TemplateGallery = ({ onSelectTemplate }: TemplateGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("gamified");
  const [searchTerm, setSearchTerm] = useState("");
  const [userLevel] = useState(5);
  const [userPoints] = useState(2450);
  const [unlockedTemplates] = useState(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]));

  const categories = [
    { id: "gamified", name: "🎮 Gamified", count: 12, icon: GamepadIcon },
    { id: "all", name: "All Templates", count: 36 },
    { id: "newsletter", name: "Newsletter", count: 4, icon: Mail },
    { id: "ecommerce", name: "E-commerce", count: 6, icon: ShoppingCart },
    { id: "discount", name: "Discounts", count: 5, icon: Gift },
    { id: "lead-gen", name: "Lead Generation", count: 4, icon: Users },
    { id: "exit-intent", name: "Exit Intent", count: 3, icon: Eye }
  ];

  const achievements = [
    { id: 1, name: "Game Master", description: "Use 10 gamified templates", icon: GamepadIcon, completed: true, points: 200 },
    { id: 2, name: "High Roller", description: "Create spin wheel popup", icon: RotateCcw, completed: true, points: 150 },
    { id: 3, name: "Lucky Winner", description: "Generate 100+ leads with games", icon: Trophy, completed: false, points: 300 },
    { id: 4, name: "Speed Gamer", description: "Setup game popup in 2 minutes", icon: Rocket, completed: true, points: 100 }
  ];

  const templates = [
    // Gamified Templates (Featured)
    {
      id: 16,
      name: "Spin-to-Win Fortune Wheel",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600",
      rating: 4.9,
      uses: 3247,
      devices: ["desktop", "mobile"],
      description: "Interactive spinning wheel with customizable prizes and sound effects",
      level: 1,
      premium: false,
      conversionRate: "24.3%",
      features: ["Animated Wheel", "Sound Effects", "Custom Prizes", "Mobile Touch"]
    },
    {
      id: 17,
      name: "Scratch Card Mystery Box",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-purple-600 via-pink-600 to-red-500",
      rating: 4.8,
      uses: 2156,
      devices: ["desktop", "mobile", "tablet"],
      description: "Digital scratch card revealing instant discounts and prizes",
      level: 1,
      premium: false,
      conversionRate: "19.7%",
      features: ["Touch Scratch", "Instant Reveal", "Prize Animation", "Haptic Feedback"]
    },
    {
      id: 18,
      name: "Memory Card Game",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600",
      rating: 4.7,
      uses: 1834,
      devices: ["desktop", "mobile"],
      description: "Match pairs to unlock exclusive discounts and offers",
      level: 2,
      premium: false,
      conversionRate: "16.2%",
      features: ["Card Flip Animation", "Timer Challenge", "Difficulty Levels", "Leaderboard"]
    },
    {
      id: 19,
      name: "Treasure Hunt Clicker",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-600",
      rating: 4.9,
      uses: 2945,
      devices: ["desktop", "mobile"],
      description: "Click to discover hidden treasures and unlock rewards",
      level: 1,
      premium: false,
      conversionRate: "22.1%",
      features: ["Click Animation", "Hidden Rewards", "Progress Bar", "Surprise Elements"]
    },
    {
      id: 20,
      name: "Slot Machine Jackpot",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600",
      rating: 4.8,
      uses: 2678,
      devices: ["desktop", "mobile"],
      description: "Classic slot machine with spinning reels and winning combinations",
      level: 2,
      premium: true,
      conversionRate: "27.5%",
      features: ["Spinning Reels", "Win Animations", "Jackpot Sound", "Auto-spin"]
    },
    {
      id: 21,
      name: "Quiz Challenge Popup",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
      rating: 4.6,
      uses: 1567,
      devices: ["desktop", "mobile", "tablet"],
      description: "Interactive quiz with rewards for correct answers",
      level: 2,
      premium: false,
      conversionRate: "18.9%",
      features: ["Multiple Choice", "Timer", "Score Tracking", "Reward System"]
    },
    {
      id: 22,
      name: "Dice Roll Fortune",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-red-500 via-pink-500 to-purple-600",
      rating: 4.7,
      uses: 1923,
      devices: ["desktop", "mobile"],
      description: "Roll virtual dice to determine discount percentage",
      level: 1,
      premium: false,
      conversionRate: "20.3%",
      features: ["3D Dice Animation", "Random Rewards", "Sound Effects", "Roll History"]
    },
    {
      id: 23,
      name: "Coin Flip Challenge",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-yellow-600 via-amber-500 to-orange-500",
      rating: 4.5,
      uses: 1245,
      devices: ["desktop", "mobile"],
      description: "Simple heads or tails game with instant rewards",
      level: 1,
      premium: false,
      conversionRate: "15.8%",
      features: ["Coin Animation", "50/50 Chance", "Quick Game", "Instant Result"]
    },
    {
      id: 24,
      name: "Puzzle Piece Collector",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500",
      rating: 4.8,
      uses: 2134,
      devices: ["desktop", "mobile"],
      description: "Collect puzzle pieces through actions to complete the picture",
      level: 3,
      premium: true,
      conversionRate: "21.6%",
      features: ["Drag & Drop", "Progress Tracking", "Completion Reward", "Visual Progress"]
    },
    {
      id: 25,
      name: "Balloon Pop Game",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-pink-400 via-red-400 to-orange-400",
      rating: 4.7,
      uses: 1876,
      devices: ["desktop", "mobile"],
      description: "Pop balloons to reveal hidden prizes and discounts",
      level: 1,
      premium: false,
      conversionRate: "17.4%",
      features: ["Pop Animation", "Hidden Prizes", "Sound Effects", "Floating Balloons"]
    },
    {
      id: 26,
      name: "Lucky Number Generator",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500",
      rating: 4.6,
      uses: 1654,
      devices: ["desktop", "mobile"],
      description: "Generate lucky numbers to win instant discounts",
      level: 1,
      premium: false,
      conversionRate: "14.9%",
      features: ["Number Animation", "Lucky Draw", "Instant Win", "Number History"]
    },
    {
      id: 27,
      name: "Tic-Tac-Toe Challenge",
      category: "gamified",
      type: "Modal",
      preview: "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600",
      rating: 4.8,
      uses: 2087,
      devices: ["desktop", "mobile"],
      description: "Play tic-tac-toe against AI to win rewards",
      level: 2,
      premium: false,
      conversionRate: "19.2%",
      features: ["AI Opponent", "Win Detection", "Game Board", "Victory Animation"]
    },
    // ... keep existing code (other non-gamified templates)
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

  // Add new state for file management
  const [userTemplates, setUserTemplates] = useState([
    {
      id: "user-1",
      name: "My Custom Modal",
      description: "A custom modal I created for my newsletter signup",
      folderId: undefined,
      tags: ["custom", "newsletter", "modal"],
      thumbnail: "bg-gradient-to-br from-green-500 to-blue-600",
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      canvasData: {}
    },
    {
      id: "user-2", 
      name: "Black Friday Banner",
      description: "Special promotion banner for Black Friday sales",
      folderId: "folder-1",
      tags: ["promotion", "sales", "banner"],
      thumbnail: "bg-gradient-to-br from-red-600 to-black",
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      canvasData: {}
    }
  ]);

  const [userFolders, setUserFolders] = useState([
    {
      id: "folder-1",
      name: "Promotions",
      parentId: undefined,
      createdAt: new Date('2024-01-10')
    },
    {
      id: "folder-2", 
      name: "Lead Generation",
      parentId: undefined,
      createdAt: new Date('2024-01-12')
    }
  ]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredUserTemplates = userTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => template.tags.includes(tag));
    return matchesSearch && matchesTags;
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
      case 1: return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case 2: return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case 3: return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case 4: return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const canUseTemplate = (template: any) => {
    return unlockedTemplates.has(template.id) || userLevel >= template.level;
  };

  const handleSaveTemplate = (templateData: any) => {
    const newTemplate = {
      ...templateData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setUserTemplates([...userTemplates, newTemplate]);
  };

  const handleCreateFolder = (folderData: any) => {
    const newFolder = {
      ...folderData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    setUserFolders([...userFolders, newFolder]);
  };

  const handleDeleteTemplate = (id: string) => {
    setUserTemplates(userTemplates.filter(t => t.id !== id));
  };

  const handleDeleteFolder = (id: string) => {
    // Also move templates from deleted folder to root
    setUserTemplates(userTemplates.map(t => 
      t.folderId === id ? { ...t, folderId: undefined } : t
    ));
    setUserFolders(userFolders.filter(f => f.id !== id));
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header with Gamification */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground flex items-center gap-2">
              <GamepadIcon className="w-8 h-8 text-purple-600" />
              Gamified Templates Gallery
            </h1>
            <p className="text-muted-foreground">Boost engagement with interactive games and mini-challenges</p>
          </div>
          
          {/* User Progress */}
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-foreground">Level {userLevel}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-foreground">{userPoints.toLocaleString()} pts</span>
                </div>
              </div>
              <Progress value={(userPoints % 500) / 5} className="mt-2 w-32" />
              <p className="text-xs text-muted-foreground mt-1">{500 - (userPoints % 500)} pts to next level</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <Card
                key={achievement.id}
                className={`transition-all ${
                  achievement.completed 
                    ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20" 
                    : "opacity-60"
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon className={`w-4 h-4 ${achievement.completed ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium text-foreground">{achievement.name}</span>
                    {achievement.completed && <Trophy className="w-3 h-3 text-yellow-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">+{achievement.points} pts</span>
                    {achievement.completed && <Badge variant="secondary" className="text-xs">Complete</Badge>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="gallery" className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Template Gallery</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center space-x-2">
            <FolderOpen className="w-4 h-4" />
            <span>My Templates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Categories Sidebar */}
            <div className="lg:w-64">
              <Card>
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
                            ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                            : "hover:bg-accent text-foreground"
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
                  const isGameTemplate = template.category === "gamified";
                  return (
                    <Card key={template.id} className={`hover:shadow-lg transition-all group relative ${isLocked ? 'opacity-75' : ''} ${isGameTemplate ? 'ring-2 ring-purple-500/20 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10' : ''}`}>
                      {isLocked && (
                        <div className="absolute top-2 right-2 z-10">
                          <Lock className="w-4 h-4 text-red-500" />
                        </div>
                      )}
                      
                      {isGameTemplate && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                            🎮 Game
                          </Badge>
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
                          
                          {/* Mock popup preview with game elements */}
                          <div className="absolute inset-4 bg-white/90 rounded shadow-lg p-2">
                            {isGameTemplate ? (
                              <div className="flex flex-col items-center justify-center h-full">
                                <div className="w-6 h-6 bg-purple-500 rounded-full mb-1 animate-pulse"></div>
                                <div className="h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded w-full"></div>
                              </div>
                            ) : (
                              <>
                                <div className="h-2 bg-slate-300 rounded mb-1"></div>
                                <div className="h-1 bg-slate-200 rounded mb-2"></div>
                                <div className="h-4 bg-blue-500 rounded"></div>
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">{template.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Badge variant="outline" className="text-xs">
                              {template.type}
                            </Badge>
                            {template.premium && (
                              <Badge className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                Pro
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        
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
                              <span className="text-xs font-medium text-foreground">{template.rating}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {template.uses.toLocaleString()} uses
                            </div>
                            {template.conversionRate && (
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3 text-green-500" />
                                <span className={`text-xs font-medium ${isGameTemplate ? 'text-purple-600 dark:text-purple-400' : 'text-green-600 dark:text-green-400'}`}>
                                  {template.conversionRate}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {template.devices.map((device, index) => (
                              <div key={index} className="text-muted-foreground">
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
                            className={`flex-1 ml-3 ${isGameTemplate && !isLocked ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : ''}`}
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
                                {isGameTemplate ? <Gamepad2 className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                                {isGameTemplate ? 'Play Game' : 'Use Template'}
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
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-foreground">No templates found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
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
        </TabsContent>

        <TabsContent value="files">
          <FileManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

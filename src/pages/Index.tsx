
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Lightbulb, Shield, LogOut, User, Moon, Sun, BarChart3, Target, TrendingUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Dashboard } from "@/components/Dashboard";
import { PopupBuilder } from "@/components/PopupBuilder";
import { AiLandingPageBuilder } from "@/components/AiLandingPageBuilder";
import { TemplateGallery } from "@/components/TemplateGallery";
import { Analytics } from "@/components/Analytics";
import { CampaignManager } from "@/components/CampaignManager";
import { Admin } from "@/components/Admin";
import { LandingPageBuilder } from "@/components/LandingPageBuilder";

interface IndexProps {
  username: string;
  onLogout: () => void;
}

const Index = ({ username, onLogout }: IndexProps) => {
  const [activeView, setActiveView] = useState("dashboard");
  const { isDarkMode, toggleTheme } = useTheme();

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveView} />;
      case "builder":
        return <PopupBuilder onBack={() => setActiveView("dashboard")} />;
      case "landing-builder":
        return <LandingPageBuilder onBack={() => setActiveView("dashboard")} />;
      case "ai-builder":
        return <AiLandingPageBuilder onBack={() => setActiveView("dashboard")} />;
      case "templates":
        return <TemplateGallery onSelectTemplate={() => setActiveView("builder")} />;
      case "campaigns":
        return <CampaignManager />;
      case "analytics":
        return <Analytics />;
      case "admin":
        return <Admin />;
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="glass-effect sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/01b275f3-962e-49f3-bc04-9696b715d718.png" 
                  alt="Pop The Builder Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                  Pop The Builder
                </h1>
              </div>
              
              {/* Always Visible Navigation Menu */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setActiveView("dashboard")}
                  variant={activeView === "dashboard" ? "default" : "outline"}
                  size="sm"
                  className="text-sm"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  onClick={() => setActiveView("campaigns")}
                  variant={activeView === "campaigns" ? "default" : "outline"}
                  size="sm"
                  className="text-sm"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Campaigns
                </Button>
                <Button
                  onClick={() => setActiveView("templates")}
                  variant={activeView === "templates" ? "default" : "outline"}
                  size="sm"
                  className="text-sm"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Templates
                </Button>
                <Button
                  onClick={() => setActiveView("analytics")}
                  variant={activeView === "analytics" ? "default" : "outline"}
                  size="sm"
                  className="text-sm"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button
                  onClick={() => setActiveView("admin")}
                  variant={activeView === "admin" ? "default" : "outline"}
                  size="sm"
                  className="text-sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setActiveView("builder")}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm border-0"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Create Popup</span>
                  <span className="sm:hidden">Popup</span>
                </Button>
                <Button
                  onClick={() => setActiveView("landing-builder")}
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-sm border-0"
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Landing Page</span>
                  <span className="sm:hidden">Landing</span>
                </Button>
                <Button
                  onClick={() => setActiveView("ai-builder")}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-sm border-0"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">AI Builder</span>
                  <span className="sm:hidden">AI</span>
                </Button>
              </div>
              
              {/* User section */}
              <div className="flex items-center space-x-2 pl-2">
                <div className="w-px h-6 bg-border"></div>
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground border-0 ring-1 ring-border/30 hover:ring-border/50"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                
                <div className="flex items-center space-x-2 text-foreground px-2 py-1 rounded-lg bg-accent/30">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-sm hidden sm:inline">{username}</span>
                </div>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive hover:ring-destructive/30 border-0 ring-1 ring-border/30"
                >
                  <LogOut className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline text-xs">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default Index;

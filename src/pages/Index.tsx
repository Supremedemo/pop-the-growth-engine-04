
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BarChart3, Settings, Users, Zap, Lightbulb, Target, TrendingUp, Shield, LogOut, User, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Dashboard } from "@/components/Dashboard";
import { PopupBuilder } from "@/components/PopupBuilder";
import { TemplateGallery } from "@/components/TemplateGallery";
import { Analytics } from "@/components/Analytics";
import { CampaignManager } from "@/components/CampaignManager";
import { Admin } from "@/components/Admin";

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
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/01b275f3-962e-49f3-bc04-9696b715d718.png" 
                  alt="Pop The Builder Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Pop The Builder
                </h1>
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/30">
                Pro Plan
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveView("dashboard")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    activeView === "dashboard" 
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium">Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveView("campaigns")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    activeView === "campaigns" 
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span className="font-medium">Campaigns</span>
                </button>
                <button
                  onClick={() => setActiveView("templates")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    activeView === "templates" 
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span className="font-medium">Templates</span>
                </button>
                <button
                  onClick={() => setActiveView("analytics")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    activeView === "analytics" 
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">Analytics</span>
                </button>
                <button
                  onClick={() => setActiveView("admin")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    activeView === "admin" 
                      ? "bg-destructive/10 text-destructive ring-1 ring-destructive/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Admin</span>
                </button>
                <Button
                  onClick={() => setActiveView("builder")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm border-0 ml-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Popup
                </Button>
              </nav>
              
              {/* User section with theme toggle and logout */}
              <div className="flex items-center space-x-3 pl-6">
                <div className="w-px h-6 bg-border"></div>
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground border-0 ring-1 ring-border/30 hover:ring-border/50"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <div className="flex items-center space-x-2 text-foreground px-3 py-1.5 rounded-lg bg-accent/30">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-sm">{username}</span>
                </div>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive hover:ring-destructive/30 border-0 ring-1 ring-border/30"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
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


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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navigation Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/01b275f3-962e-49f3-bc04-9696b715d718.png" 
                  alt="Pop The Builder Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Pop The Builder
                </h1>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Pro Plan
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="flex items-center space-x-6">
                <button
                  onClick={() => setActiveView("dashboard")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeView === "dashboard" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveView("campaigns")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeView === "campaigns" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>Campaigns</span>
                </button>
                <button
                  onClick={() => setActiveView("templates")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeView === "templates" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Templates</span>
                </button>
                <button
                  onClick={() => setActiveView("analytics")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeView === "analytics" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={() => setActiveView("admin")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeView === "admin" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>
                <Button
                  onClick={() => setActiveView("builder")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Popup
                </Button>
              </nav>
              
              {/* User section with theme toggle and logout */}
              <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-6">
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{username}</span>
                </div>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="sm"
                  className="text-slate-600 hover:text-red-600 hover:border-red-300 dark:text-slate-300 dark:hover:text-red-400"
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

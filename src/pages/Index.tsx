
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BarChart3, Settings, Users, Zap, Lightbulb, Target, TrendingUp, Shield } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { PopupBuilder } from "@/components/PopupBuilder";
import { TemplateGallery } from "@/components/TemplateGallery";
import { Analytics } from "@/components/Analytics";
import { CampaignManager } from "@/components/CampaignManager";
import { Admin } from "@/components/Admin";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Pop The Builder
                </h1>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Pro Plan
              </Badge>
            </div>
            
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => setActiveView("dashboard")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeView === "dashboard" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveView("campaigns")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeView === "campaigns" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Target className="w-4 h-4" />
                <span>Campaigns</span>
              </button>
              <button
                onClick={() => setActiveView("templates")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeView === "templates" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>Templates</span>
              </button>
              <button
                onClick={() => setActiveView("analytics")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeView === "analytics" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setActiveView("admin")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeView === "admin" ? "bg-red-100 text-red-700" : "text-slate-600 hover:text-slate-900"
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

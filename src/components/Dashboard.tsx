
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BarChart3, Settings, Users, Zap, Lightbulb, Target, TrendingUp, ChevronRight, Folder } from "lucide-react";
import { FileManager } from "./FileManager";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Mock data for now - this will be replaced with real data from useTemplates hook
  const [templates] = useState([
    {
      id: "1",
      name: "Newsletter Signup",
      description: "A beautiful newsletter signup modal with gradient background",
      folderId: undefined,
      tags: ["email", "marketing", "modal"],
      thumbnail: "bg-gradient-to-br from-blue-500 to-purple-600",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20"),
      canvasData: {}
    },
    {
      id: "2", 
      name: "Exit Intent Popup",
      description: "Catch users before they leave with this exit intent popup",
      folderId: undefined,
      tags: ["exit-intent", "conversion", "popup"],
      thumbnail: "bg-gradient-to-br from-red-500 to-orange-600",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-18"),
      canvasData: {}
    }
  ]);

  const [folders] = useState([
    {
      id: "f1",
      name: "Marketing Campaigns",
      parentId: undefined,
      createdAt: new Date("2024-01-01")
    }
  ]);

  const handleSaveTemplate = (template: any) => {
    console.log("Saving template:", template);
    // This will be implemented with the real useTemplates hook
  };

  const handleCreateFolder = (folder: any) => {
    console.log("Creating folder:", folder);
    // This will be implemented with the real useTemplates hook
  };

  const handleDeleteTemplate = (id: string) => {
    console.log("Deleting template:", id);
    // This will be implemented with the real useTemplates hook
  };

  const handleDeleteFolder = (id: string) => {
    console.log("Deleting folder:", id);
    // This will be implemented with the real useTemplates hook
  };

  const quickActions = [
    {
      title: "Create Popup",
      description: "Build a custom popup with our drag-and-drop editor",
      icon: Plus,
      action: () => onNavigate("builder"),
      gradient: "from-blue-600 to-purple-600"
    },
    {
      title: "Landing Page", 
      description: "Design beautiful landing pages for your campaigns",
      icon: Lightbulb,
      action: () => onNavigate("landing-builder"),
      gradient: "from-green-600 to-blue-600"
    },
    {
      title: "AI Builder",
      description: "Let AI create popups from your screenshots",
      icon: Zap,
      action: () => onNavigate("ai-builder"),
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  const stats = [
    {
      title: "Active Campaigns",
      value: "12",
      description: "Currently running",
      icon: Target,
      trend: "+2 this week"
    },
    {
      title: "Total Views",
      value: "24,563",
      description: "Across all campaigns",
      icon: BarChart3,
      trend: "+15% from last month"
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      description: "Average across campaigns",
      icon: TrendingUp,
      trend: "+0.5% improvement"
    },
    {
      title: "Templates",
      value: templates.length.toString(),
      description: "Saved templates",
      icon: Folder,
      trend: `${folders.length} folders`
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">
            Welcome back! Here's what's happening with your campaigns.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-slate-700 mb-1">{stat.title}</p>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    onClick={action.action}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                        <action.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">{action.title}</h3>
                      <p className="text-sm text-slate-600 mb-4">{action.description}</p>
                      <Button
                        className={`bg-gradient-to-r ${action.gradient} hover:shadow-lg`}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.action();
                        }}
                      >
                        Get Started
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">New campaign "Summer Sale" launched</p>
                        <p className="text-xs text-slate-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">Template "Newsletter Signup" updated</p>
                        <p className="text-xs text-slate-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">Campaign "Holiday Promo" reached 1,000 views</p>
                        <p className="text-xs text-slate-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quick-actions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={action.action}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{action.description}</p>
                    <Button
                      className={`bg-gradient-to-r ${action.gradient} hover:shadow-lg`}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.action();
                      }}
                    >
                      Get Started
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <FileManager
              templates={templates}
              folders={folders}
              onSaveTemplate={handleSaveTemplate}
              onCreateFolder={handleCreateFolder}
              onDeleteTemplate={handleDeleteTemplate}
              onDeleteFolder={handleDeleteFolder}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
          </TabsContent>

          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions and campaign updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Campaign "Summer Sale" launched successfully</p>
                      <p className="text-xs text-slate-500 mb-2">2 hours ago</p>
                      <div className="text-xs text-slate-600">
                        <span className="font-medium">Performance:</span> 156 views, 12 conversions (7.7% rate)
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Template "Newsletter Signup" updated</p>
                      <p className="text-xs text-slate-500 mb-2">1 day ago</p>
                      <div className="text-xs text-slate-600">
                        <span className="font-medium">Changes:</span> Updated styling and improved mobile responsiveness
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Campaign "Holiday Promo" milestone reached</p>
                      <p className="text-xs text-slate-500 mb-2">3 days ago</p>
                      <div className="text-xs text-slate-600">
                        <span className="font-medium">Achievement:</span> 1,000 total views with 4.2% conversion rate
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">New folder "Q1 Campaigns" created</p>
                      <p className="text-xs text-slate-500 mb-2">5 days ago</p>
                      <div className="text-xs text-slate-600">
                        <span className="font-medium">Organization:</span> Better template management for quarterly campaigns
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

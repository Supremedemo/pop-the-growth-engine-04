
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PopupBuilder } from "./PopupBuilder";
import { TemplateGallery } from "./TemplateGallery";
import { CampaignManager } from "./CampaignManager";
import { Analytics } from "./Analytics";
import { WebsiteManager } from "./WebsiteManager";
import { useTemplates } from "@/hooks/useTemplates";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useWebsiteManagement } from "@/hooks/useWebsiteManagement";
import { 
  Plus, 
  FileText, 
  Rocket, 
  BarChart3, 
  Globe,
  Zap,
  ArrowRight 
} from "lucide-react";

interface DashboardProps {
  onNavigateToBuilder: () => void;
}

export const Dashboard = ({ onNavigateToBuilder }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { templates, isLoading: templatesLoading } = useTemplates();
  const { campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { websites, isLoading: websitesLoading } = useWebsiteManagement();

  const stats = {
    templates: templates.length,
    campaigns: campaigns.length,
    websites: websites.length,
    activeWebsites: websites.filter(w => w.tracking_enabled).length
  };

  if (activeTab === "builder") {
    return <PopupBuilder onBack={() => setActiveTab("overview")} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">Manage your popups, templates, and website tracking</p>
            </div>
            <Button onClick={() => setActiveTab("builder")} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Popup
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="websites">Websites</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="builder">Builder</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Templates</CardTitle>
                  <FileText className="w-4 h-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.templates}</div>
                  <p className="text-xs text-slate-600">Created templates</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
                  <Rocket className="w-4 h-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.campaigns}</div>
                  <p className="text-xs text-slate-600">Active campaigns</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Websites</CardTitle>
                  <Globe className="w-4 h-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.websites}</div>
                  <p className="text-xs text-slate-600">Connected websites</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tracking</CardTitle>
                  <Zap className="w-4 h-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeWebsites}</div>
                  <p className="text-xs text-slate-600">Websites with tracking</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("builder")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Popup
                  </CardTitle>
                  <CardDescription>Start building a new popup from scratch</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Start Building <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("websites")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Add Website
                  </CardTitle>
                  <CardDescription>Connect a new website for tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Add Website <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("templates")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Browse Templates
                  </CardTitle>
                  <CardDescription>Explore and use existing templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Browse Templates <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest templates and campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                {templatesLoading || campaignsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading activity...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {templates.slice(0, 3).map((template) => (
                      <div key={template.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-slate-600">Template • {new Date(template.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="secondary">Template</Badge>
                      </div>
                    ))}
                    {campaigns.slice(0, 3).map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-slate-600">Campaign • {new Date(campaign.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="default">Campaign</Badge>
                      </div>
                    ))}
                    {templates.length === 0 && campaigns.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-slate-600">No recent activity. Create your first popup to get started!</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <TemplateGallery onSelectTemplate={() => {
              // Navigate to builder with selected template
              setActiveTab("builder");
            }} />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignManager />
          </TabsContent>

          <TabsContent value="websites">
            <WebsiteManager />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

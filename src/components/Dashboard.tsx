
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Eye, 
  Settings, 
  BarChart3, 
  FileText, 
  Zap,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  Download
} from "lucide-react";
import { Analytics } from "./Analytics";
import { CampaignManager } from "./CampaignManager";
import { PopupBuilder } from "./PopupBuilder";
import { FileManager } from "./FileManager";
import { TemplateGallery } from "./TemplateGallery";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useAnalytics } from "@/hooks/useAnalytics";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const { dashboardStats } = useAnalytics();

  if (showBuilder) {
    return <PopupBuilder onBack={() => setShowBuilder(false)} />;
  }

  const StatCard = ({ title, value, description, icon: Icon, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          {trend && <TrendingUp className="h-3 w-3 mr-1" />}
          {description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Manage your popup campaigns and templates</p>
          </div>
          <Button 
            onClick={() => setShowBuilder(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Impressions"
                value={dashboardStats.totalImpressions.toLocaleString()}
                description="Total popup views"
                icon={Eye}
                trend={true}
              />
              <StatCard
                title="Conversions"
                value={dashboardStats.totalConversions.toLocaleString()}
                description={`${dashboardStats.conversionRate.toFixed(1)}% conversion rate`}
                icon={Users}
                trend={true}
              />
              <StatCard
                title="Revenue"
                value={`$${dashboardStats.totalRevenue.toLocaleString()}`}
                description="Total revenue generated"
                icon={DollarSign}
                trend={true}
              />
              <StatCard
                title="Active Campaigns"
                value={`${dashboardStats.activeCampaigns}/${dashboardStats.totalCampaigns}`}
                description="Currently running"
                icon={Activity}
              />
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowBuilder(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Campaign
                  </CardTitle>
                  <CardDescription>
                    Build a new popup campaign from scratch or use a template
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("templates")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Manage Templates
                  </CardTitle>
                  <CardDescription>
                    Organize and edit your saved popup templates
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("analytics")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Analytics
                  </CardTitle>
                  <CardDescription>
                    Track performance and campaign metrics
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignManager />
          </TabsContent>

          <TabsContent value="templates">
            <FileManager 
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
          </TabsContent>

          <TabsContent value="gallery">
            <TemplateGallery onSelectTemplate={() => setShowBuilder(true)} />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

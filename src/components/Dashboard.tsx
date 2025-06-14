
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  TrendingUp, 
  Users, 
  MousePointer, 
  DollarSign, 
  Eye,
  Play,
  Pause,
  Settings,
  MoreHorizontal
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCampaigns } from "@/hooks/useCampaigns";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { dashboardStats } = useAnalytics();
  const { campaigns, toggleCampaignStatus } = useCampaigns();

  const stats = [
    {
      title: "Total Impressions",
      value: dashboardStats.totalImpressions.toLocaleString(),
      change: "+12.5%", // This could be calculated from historical data
      icon: Eye,
      color: "text-blue-600"
    },
    {
      title: "Conversions",
      value: dashboardStats.totalConversions.toLocaleString(),
      change: "+8.2%",
      icon: MousePointer,
      color: "text-green-600"
    },
    {
      title: "Conversion Rate",
      value: `${dashboardStats.conversionRate.toFixed(2)}%`,
      change: "+0.4%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Revenue Attributed",
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
      change: "+15.7%",
      icon: DollarSign,
      color: "text-orange-600"
    }
  ];

  const recentCampaigns = campaigns.slice(0, 4);

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
            <p className="text-blue-100 mb-4">
              Your campaigns have generated <strong>${dashboardStats.totalRevenue.toLocaleString()}</strong> in attributed revenue this month.
            </p>
            <Button 
              onClick={() => onNavigate("builder")}
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Campaign
            </Button>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-16 h-16 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs">
                    {stat.change}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="bg-card border-border cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onNavigate("builder")}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-600">
              <Plus className="w-5 h-5" />
              <span>Create Popup</span>
            </CardTitle>
            <CardDescription>
              Build a new popup from scratch or use a template
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="bg-card border-border cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onNavigate("templates")}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-600">
              <Eye className="w-5 h-5" />
              <span>Browse Templates</span>
            </CardTitle>
            <CardDescription>
              Choose from 50+ professional popup templates
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="bg-card border-border cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onNavigate("analytics")}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span>View Analytics</span>
            </CardTitle>
            <CardDescription>
              Deep dive into your campaign performance
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Monitor your active and recent popup campaigns</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onNavigate("campaigns")}
              className="bg-background"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-4">Create your first popup campaign to get started</p>
              <Button onClick={() => onNavigate("builder")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {campaign.status === "Active" ? (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                      <span className="font-medium">{campaign.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {campaign.type}
                    </Badge>
                    <Badge 
                      variant={campaign.status === "Active" ? "default" : "secondary"}
                      className={campaign.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="text-center">
                      <div className="font-medium text-foreground">{campaign.impressions.toLocaleString()}</div>
                      <div className="text-xs">Impressions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground">{campaign.conversions.toLocaleString()}</div>
                      <div className="text-xs">Conversions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground">
                        {campaign.impressions > 0 ? ((campaign.conversions / campaign.impressions) * 100).toFixed(2) : '0.00'}%
                      </div>
                      <div className="text-xs">CVR</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground">${Number(campaign.revenue).toLocaleString()}</div>
                      <div className="text-xs">Revenue</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                    >
                      {campaign.status === "Active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

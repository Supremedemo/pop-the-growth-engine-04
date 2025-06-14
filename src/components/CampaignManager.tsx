
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Play, 
  Pause, 
  Copy, 
  Settings, 
  MoreHorizontal, 
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign
} from "lucide-react";

export const CampaignManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const campaigns = [
    {
      id: 1,
      name: "Welcome New Visitors",
      type: "Modal",
      status: "Active",
      created: "2024-01-15",
      impressions: 45632,
      conversions: 1247,
      rate: "2.73%",
      revenue: "$8,950",
      lastModified: "2 hours ago",
      template: "Welcome Discount"
    },
    {
      id: 2,
      name: "Cart Abandonment Recovery",
      type: "Slide-in",
      status: "Active",
      created: "2024-01-12",
      impressions: 23456,
      conversions: 892,
      rate: "3.80%",
      revenue: "$6,840",
      lastModified: "1 day ago",
      template: "Cart Abandonment"
    },
    {
      id: 3,
      name: "Exit Intent Discount",
      type: "Modal",
      status: "Paused",
      created: "2024-01-10",
      impressions: 18743,
      conversions: 456,
      rate: "2.43%",
      revenue: "$3,420",
      lastModified: "3 days ago",
      template: "Exit Intent Offer"
    },
    {
      id: 4,
      name: "Newsletter Signup",
      type: "Banner",
      status: "Active",
      created: "2024-01-08",
      impressions: 56789,
      conversions: 1234,
      rate: "2.17%",
      revenue: "$0",
      lastModified: "5 days ago",
      template: "Newsletter Signup"
    },
    {
      id: 5,
      name: "Holiday Sale Promotion",
      type: "Fullscreen",
      status: "Draft",
      created: "2024-01-20",
      impressions: 0,
      conversions: 0,
      rate: "-",
      revenue: "$0",
      lastModified: "1 hour ago",
      template: "Black Friday Sale"
    },
    {
      id: 6,
      name: "Product Quiz Campaign",
      type: "Modal",
      status: "Scheduled",
      created: "2024-01-18",
      impressions: 0,
      conversions: 0,
      rate: "-",
      revenue: "$0",
      lastModified: "6 hours ago",
      template: "Product Quiz"
    }
  ];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "Paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
      case "Scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case "Paused":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case "Draft":
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
      case "Scheduled":
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Campaign Manager</h1>
          <p className="text-muted-foreground">Manage and monitor all your popup campaigns</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.filter(c => c.status === "Active").length}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Conversions</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.conversions, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <MousePointer className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">$19,210</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            {filteredCampaigns.length} of {campaigns.length} campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(campaign.status)}
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="font-medium">{campaign.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {campaign.type}
                      </Badge>
                      <Badge variant="secondary" className={getStatusColor(campaign.status) + " text-xs"}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Template: {campaign.template}</span>
                      <span>•</span>
                      <span>Created: {campaign.created}</span>
                      <span>•</span>
                      <span>Modified: {campaign.lastModified}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-foreground">{campaign.impressions.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Impressions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground">{campaign.conversions.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Conversions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground">{campaign.rate}</div>
                      <div className="text-xs text-muted-foreground">CVR</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground">{campaign.revenue}</div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      {campaign.status === "Active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

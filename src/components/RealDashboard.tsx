
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, Trash2, Play, Pause, BarChart3 } from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";
import { useCampaigns } from "@/hooks/useCampaigns";

interface RealDashboardProps {
  onNavigate: (view: string) => void;
}

export const RealDashboard = ({ onNavigate }: RealDashboardProps) => {
  const { templates, deleteTemplate, isDeleting } = useTemplates();
  const { campaigns, updateCampaign, isUpdating } = useCampaigns();

  const handleEditTemplate = (templateId: string) => {
    // Navigate to builder with template ID
    onNavigate(`builder?template=${templateId}`);
  };

  const handleToggleCampaign = (campaign: any) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    updateCampaign({
      id: campaign.id,
      updates: { status: newStatus }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const recentTemplates = templates.slice(0, 6);
  const recentCampaigns = campaigns.slice(0, 6);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your popup templates and campaigns
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => onNavigate("builder")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Popup
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">
              Saved designs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Conversions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Templates
            <Button variant="outline" size="sm" onClick={() => onNavigate("templates")}>
              View All
            </Button>
          </CardTitle>
          <CardDescription>
            Your recently created popup templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTemplates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 hover:bg-slate-50">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded mb-3"></div>
                  <h3 className="font-medium mb-1">{template.name}</h3>
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                    {template.description || 'No description'}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">
                      {new Date(template.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditTemplate(template.id)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">No templates yet</p>
              <Button onClick={() => onNavigate("builder")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Template
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Campaigns
            <Button variant="outline" size="sm" onClick={() => onNavigate("campaigns")}>
              View All
            </Button>
          </CardTitle>
          <CardDescription>
            Your recently created campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentCampaigns.length > 0 ? (
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(campaign.status)}`}></div>
                    <div>
                      <h3 className="font-medium">{campaign.name}</h3>
                      <p className="text-sm text-slate-500">
                        {campaign.description || 'No description'}
                      </p>
                      <p className="text-xs text-slate-400">
                        Created: {new Date(campaign.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {campaign.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleCampaign(campaign)}
                      disabled={isUpdating}
                    >
                      {campaign.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">No campaigns yet</p>
              <Button onClick={() => onNavigate("builder")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Campaign
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

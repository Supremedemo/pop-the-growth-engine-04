
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useWebsiteManagement } from "@/hooks/useWebsiteManagement";
import { useTemplates } from "@/hooks/useTemplates";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useUserTracking } from "@/hooks/useUserTracking";
import { 
  Target, 
  Plus, 
  Calendar, 
  Globe, 
  Users, 
  BarChart3, 
  Clock,
  Zap,
  Settings,
  Play,
  Pause,
  Eye
} from "lucide-react";
import { toast } from "sonner";

export const EventBasedCampaignManager = () => {
  const { websites } = useWebsiteManagement();
  const { templates } = useTemplates();
  const { campaigns, createCampaign, updateCampaign, isCreating } = useCampaigns();
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>("");
  const { trackedUsers, userEvents, getEventAnalytics } = useUserTracking(selectedWebsiteId);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    description: "",
    websiteId: "",
    templateId: "",
    triggerEvents: [] as string[],
    targetUrl: "",
    scheduleType: "immediate" as "immediate" | "scheduled",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    isActive: true
  });

  // Standard event types that are commonly tracked
  const standardEvents = [
    { value: "page_view", label: "Page View" },
    { value: "click", label: "Click" },
    { value: "form_submit", label: "Form Submit" },
    { value: "scroll", label: "Scroll" },
    { value: "time_on_page", label: "Time on Page" },
    { value: "session_start", label: "Session Start" },
    { value: "session_end", label: "Session End" },
    { value: "exit_intent", label: "Exit Intent" },
    { value: "cart_abandon", label: "Cart Abandon" },
    { value: "product_view", label: "Product View" }
  ];

  const analytics = selectedWebsiteId ? getEventAnalytics() : null;

  const handleCreateCampaign = () => {
    if (!campaignForm.name.trim() || !campaignForm.websiteId || !campaignForm.templateId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (campaignForm.triggerEvents.length === 0) {
      toast.error('Please select at least one trigger event');
      return;
    }

    const template = templates.find(t => t.id === campaignForm.templateId);
    if (!template) {
      toast.error('Selected template not found');
      return;
    }

    // Create targeting rules based on events
    const targetingRules = {
      websiteId: campaignForm.websiteId,
      triggerEvents: campaignForm.triggerEvents,
      targetUrl: campaignForm.targetUrl || null,
      conditions: []
    };

    // Create display settings based on schedule
    const displaySettings = {
      scheduleType: campaignForm.scheduleType,
      startDate: campaignForm.scheduleType === 'scheduled' ? campaignForm.startDate : null,
      startTime: campaignForm.scheduleType === 'scheduled' ? campaignForm.startTime : null,
      endDate: campaignForm.endDate || null,
      endTime: campaignForm.endTime || null,
      isActive: campaignForm.isActive
    };

    createCampaign({
      name: campaignForm.name,
      description: campaignForm.description || undefined,
      canvasData: template.canvas_data,
      templateId: campaignForm.templateId
    });

    // Reset form
    setCampaignForm({
      name: "",
      description: "",
      websiteId: "",
      templateId: "",
      triggerEvents: [],
      targetUrl: "",
      scheduleType: "immediate",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      isActive: true
    });
    
    setIsCreateDialogOpen(false);
  };

  const toggleEventTrigger = (eventType: string) => {
    setCampaignForm(prev => ({
      ...prev,
      triggerEvents: prev.triggerEvents.includes(eventType)
        ? prev.triggerEvents.filter(e => e !== eventType)
        : [...prev.triggerEvents, eventType]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Event-Based Campaign Manager</h1>
          <p className="text-slate-600 mt-2">
            Create campaigns triggered by user behavior and events on your websites
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Event-Based Campaign</DialogTitle>
              <DialogDescription>
                Set up a campaign that triggers based on user events and behavior
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Campaign Details</h3>
                <div>
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Holiday Sale Popup"
                  />
                </div>
                
                <div>
                  <Label htmlFor="campaignDescription">Description (Optional)</Label>
                  <Textarea
                    id="campaignDescription"
                    value={campaignForm.description}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your campaign goals..."
                  />
                </div>
              </div>

              {/* Website Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Target Website</h3>
                <div>
                  <Label htmlFor="websiteSelect">Select Website</Label>
                  <Select value={campaignForm.websiteId} onValueChange={(value) => setCampaignForm(prev => ({ ...prev, websiteId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a website" />
                    </SelectTrigger>
                    <SelectContent>
                      {websites.map((website) => (
                        <SelectItem key={website.id} value={website.id}>
                          {website.name} ({website.domain})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetUrl">Target URL (Optional)</Label>
                  <Input
                    id="targetUrl"
                    value={campaignForm.targetUrl}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, targetUrl: e.target.value }))}
                    placeholder="/checkout or leave empty for all pages"
                  />
                </div>
              </div>

              {/* Event Triggers */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Trigger Events</h3>
                <p className="text-sm text-slate-600">Select which events should trigger this campaign</p>
                <div className="grid grid-cols-2 gap-3">
                  {standardEvents.map((event) => (
                    <div key={event.value} className="flex items-center space-x-2">
                      <Switch
                        checked={campaignForm.triggerEvents.includes(event.value)}
                        onCheckedChange={() => toggleEventTrigger(event.value)}
                      />
                      <Label className="text-sm">{event.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Popup Template</h3>
                <div>
                  <Label htmlFor="templateSelect">Select Template</Label>
                  <Select value={campaignForm.templateId} onValueChange={(value) => setCampaignForm(prev => ({ ...prev, templateId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Schedule</h3>
                <div>
                  <Label>When should this campaign go live?</Label>
                  <Select value={campaignForm.scheduleType} onValueChange={(value: "immediate" | "scheduled") => setCampaignForm(prev => ({ ...prev, scheduleType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediately</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {campaignForm.scheduleType === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={campaignForm.startDate}
                        onChange={(e) => setCampaignForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={campaignForm.startTime}
                        onChange={(e) => setCampaignForm(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={campaignForm.endDate}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time (Optional)</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={campaignForm.endTime}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCampaign} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Campaign'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Website Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Website Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedWebsiteId} onValueChange={setSelectedWebsiteId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a website to view analytics" />
              </SelectTrigger>
              <SelectContent>
                {websites.map((website) => (
                  <SelectItem key={website.id} value={website.id}>
                    {website.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {analytics && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Total Users:</span>
                    <span className="font-medium">{analytics.uniqueUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Total Events:</span>
                    <span className="font-medium">{analytics.totalEvents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Events/User:</span>
                    <span className="font-medium">{analytics.averageEventsPerUser.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Last 7 days:</span>
                    <span className="font-medium">{analytics.recentEvents} events</span>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    {Object.entries(analytics.eventTypes).slice(0, 3).map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span>{type}:</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Campaigns List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Active Campaigns</h2>
        
        {campaigns.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No campaigns created</h3>
              <p className="text-slate-500 mb-6">
                Create your first event-based campaign to start converting visitors
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {campaign.description || "No description"}
                      </CardDescription>
                    </div>
                    <Badge variant={campaign.status === 'active' ? "default" : "secondary"}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span>Created {new Date(campaign.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    {campaign.start_date && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>Starts {new Date(campaign.start_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      {campaign.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

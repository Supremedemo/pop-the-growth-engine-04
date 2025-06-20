
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useWebsiteManagement } from "@/hooks/useWebsiteManagement";
import { useUserTracking } from "@/hooks/useUserTracking";
import { useTemplates } from "@/hooks/useTemplates";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useCampaignDeployments } from "@/hooks/useCampaignDeployments";
import { AdvancedTriggerBuilder } from "./AdvancedTriggerBuilder";
import { 
  Target, 
  Users, 
  BarChart3, 
  Clock, 
  Globe, 
  Calendar,
  MousePointer,
  Eye,
  FormInput,
  Download,
  Plus,
  Palette,
  ExternalLink,
  Rocket
} from "lucide-react";
import { toast } from "sonner";

export const EventBasedCampaignManager = () => {
  const { websites, isLoading: websitesLoading } = useWebsiteManagement();
  const { templates, saveTemplate, isSaving: isSavingTemplate } = useTemplates();
  const { createCampaign, isCreating } = useCampaigns();
  const { deployCampaign, isDeploying } = useCampaignDeployments();
  
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>("");
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [scheduleType, setScheduleType] = useState<"immediate" | "scheduled">("immediate");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [goLiveAfterCreation, setGoLiveAfterCreation] = useState(false);
  const [triggerRules, setTriggerRules] = useState<any>(null);

  // Template creation state
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [isCanvasEditorOpen, setIsCanvasEditorOpen] = useState(false);

  const { trackedUsers, userEvents, isLoading: trackingLoading, getEventAnalytics } = useUserTracking(selectedWebsiteId);

  const analytics = getEventAnalytics();

  const createBasicCanvasData = () => ({
    width: 400,
    height: 300,
    backgroundColor: '#ffffff',
    backgroundType: 'color' as const,
    backgroundImage: '',
    elements: [],
    zoom: 1,
    showGrid: true,
    gridSize: 8,
    layout: {
      id: "modal-center",
      name: "Modal - Center",
      type: 'modal' as const,
      description: "Classic popup in the center of screen",
      dimensions: { width: 400, height: 300 },
      position: 'center' as const
    },
    showOverlay: true,
    overlayColor: '#000000',
    overlayOpacity: 50,
    showCloseButton: true,
    closeButtonPosition: 'top-right' as const
  });

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    const basicCanvasData = createBasicCanvasData();

    saveTemplate({
      name: newTemplateName.trim(),
      description: newTemplateDescription.trim() || undefined,
      canvasData: basicCanvasData,
      tags: []
    });

    // Reset form
    setNewTemplateName("");
    setNewTemplateDescription("");
    setIsCreateTemplateOpen(false);
    toast.success('Template created! You can now select it.');
  };

  const handleOpenCanvasEditor = () => {
    if (!newTemplateName.trim()) {
      toast.error('Please enter a template name first');
      return;
    }
    setIsCanvasEditorOpen(true);
  };

  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) {
      toast.error('Please enter a campaign name');
      return;
    }

    if (!selectedWebsiteId) {
      toast.error('Please select a website');
      return;
    }

    if (!selectedTemplateId) {
      toast.error('Please select a template');
      return;
    }

    if (!triggerRules || !triggerRules.eventType) {
      toast.error('Please configure trigger rules');
      return;
    }

    const targetingRules = {
      websiteId: selectedWebsiteId,
      eventType: triggerRules.eventType,
      triggerConditions: {
        eventType: triggerRules.eventType,
        logic: triggerRules.logic || 'AND',
        rules: triggerRules.rules || [],
        frequency: 'once_per_session'
      }
    };

    const displaySettings = {
      scheduleType,
      scheduledDate: scheduleType === "scheduled" ? scheduledDate : undefined,
      scheduledTime: scheduleType === "scheduled" ? scheduledTime : undefined,
      autoClose: true,
      closeAfter: 30000,
      showOverlay: true
    };

    const template = templates.find(t => t.id === selectedTemplateId);

    try {
      const result = await new Promise<any>((resolve, reject) => {
        createCampaign({
          name: campaignName,
          description: campaignDescription || undefined,
          canvasData: template?.canvas_data || createBasicCanvasData(),
          templateId: selectedTemplateId,
          targetingRules,
          displaySettings
        }, {
          onSuccess: (campaign: any) => resolve(campaign),
          onError: (error: Error) => reject(error)
        });
      });

      // If user wants to go live immediately, deploy the campaign
      if (goLiveAfterCreation && result?.id) {
        deployCampaign({
          campaignId: result.id,
          websiteId: selectedWebsiteId,
          rules: targetingRules,
          config: displaySettings
        });
      }

      // Reset form
      setCampaignName("");
      setCampaignDescription("");
      setSelectedTemplateId("");
      setScheduleType("immediate");
      setScheduledDate("");
      setScheduledTime("");
      setGoLiveAfterCreation(false);
      setTriggerRules(null);

    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  if (websitesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading websites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-8 h-8" />
            Campaign Creator
          </h1>
          <p className="text-slate-600 mt-2">
            Create campaigns that trigger based on discovered events and advanced rules
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Website Selection & Analytics */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Website Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="website">Select Website</Label>
              <Select value={selectedWebsiteId} onValueChange={setSelectedWebsiteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a website" />
                </SelectTrigger>
                <SelectContent>
                  {websites.map((website) => (
                    <SelectItem key={website.id} value={website.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${website.tracking_enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {website.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedWebsiteId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trackingLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-slate-500">Loading analytics...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{trackedUsers.length}</p>
                        <p className="text-sm text-slate-500">Tracked Users</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{analytics.totalEvents}</p>
                        <p className="text-sm text-slate-500">Total Events</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">Event Types:</p>
                      <div className="space-y-2">
                        {Object.entries(analytics.eventTypes).map(([eventType, count]) => (
                          <div key={eventType} className="flex justify-between items-center">
                            <Badge variant="outline">{eventType}</Badge>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Campaign Creation Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
              <CardDescription>
                Set up a campaign with advanced event-based triggers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Campaign Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Enter campaign name"
                  />
                </div>

                <div>
                  <Label htmlFor="campaignDescription">Description (Optional)</Label>
                  <Textarea
                    id="campaignDescription"
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                    placeholder="Describe your campaign"
                    rows={3}
                  />
                </div>
              </div>

              {/* Advanced Trigger Configuration */}
              {selectedWebsiteId && (
                <AdvancedTriggerBuilder
                  websiteId={selectedWebsiteId}
                  onTriggerRulesChange={setTriggerRules}
                  initialRules={triggerRules}
                />
              )}

              {/* Template Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="template">Template</Label>
                  <div className="flex space-x-2">
                    <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Quick Template
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Palette className="w-5 h-5" />
                            Create New Template
                          </DialogTitle>
                          <DialogDescription>
                            Create a basic template or open the full editor for advanced design
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="newTemplateName">Template Name</Label>
                            <Input
                              id="newTemplateName"
                              value={newTemplateName}
                              onChange={(e) => setNewTemplateName(e.target.value)}
                              placeholder="Enter template name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="newTemplateDescription">Description (Optional)</Label>
                            <Textarea
                              id="newTemplateDescription"
                              value={newTemplateDescription}
                              onChange={(e) => setNewTemplateDescription(e.target.value)}
                              placeholder="Describe your template"
                              rows={3}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setIsCreateTemplateOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={handleOpenCanvasEditor}
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Full Editor
                            </Button>
                            <Button 
                              onClick={handleCreateTemplate}
                              disabled={isSavingTemplate}
                            >
                              {isSavingTemplate ? 'Creating...' : 'Create Basic'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
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

              {/* Go Live Option */}
              <div className="flex items-center space-x-2 p-4 border rounded-lg bg-blue-50">
                <input
                  type="checkbox"
                  id="goLive"
                  checked={goLiveAfterCreation}
                  onChange={(e) => setGoLiveAfterCreation(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="goLive" className="flex items-center gap-2 cursor-pointer">
                  <Rocket className="w-4 h-4" />
                  Deploy campaign immediately after creation
                </Label>
              </div>

              {/* Scheduling */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Campaign Schedule
                </h3>
                
                <div>
                  <Label>Schedule Type</Label>
                  <Select value={scheduleType} onValueChange={(value: "immediate" | "scheduled") => setScheduleType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Go Live Immediately</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {scheduleType === "scheduled" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scheduledDate">Date</Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="scheduledTime">Time</Label>
                      <Input
                        id="scheduledTime"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleCreateCampaign}
                disabled={isCreating || isDeploying}
                className="w-full"
              >
                {isCreating ? 'Creating Campaign...' : 
                 isDeploying ? 'Deploying Campaign...' :
                 goLiveAfterCreation ? 'Create & Deploy Campaign' : 'Create Campaign'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Canvas Editor Dialog */}
      <Dialog open={isCanvasEditorOpen} onOpenChange={setIsCanvasEditorOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Template Designer - {newTemplateName}
            </DialogTitle>
            <DialogDescription>
              Design your template using the full canvas editor
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <iframe
              src="/builder"
              className="w-full h-[80vh] border-0 rounded-lg"
              title="Template Designer"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsCanvasEditorOpen(false)}
            >
              Close Editor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

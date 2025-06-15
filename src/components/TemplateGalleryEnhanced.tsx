
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useGamification } from "@/hooks/useGamification";
import { useTemplateCustomization, GamifiedTemplate } from "@/hooks/useTemplateCustomization";
import { useGamifiedCampaigns } from "@/hooks/useGamifiedCampaigns";
import { GamifiedTemplatePreview } from "./GamifiedTemplatePreview";
import { 
  Star, 
  Trophy, 
  Crown, 
  Rocket,
  Gamepad,
  Palette,
  Save,
  Play,
  Settings,
  Lock,
  Heart,
  Edit,
  Trash2,
  TrendingUp,
  Target,
  RotateCcw,
  Eye,
  Globe,
  Copy,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface TemplateGalleryEnhancedProps {
  onTemplateSelect?: (template: any) => void;
  onCreateCampaign?: (template: any, config: any) => void;
}

export const TemplateGalleryEnhanced = ({ onTemplateSelect, onCreateCampaign }: TemplateGalleryEnhancedProps) => {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<GamifiedTemplate | null>(null);
  const [customizationConfig, setCustomizationConfig] = useState<any>({});
  const [templateName, setTemplateName] = useState("");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");

  const { 
    userProgression, 
    achievements, 
    userAchievements, 
    updateProgression,
    getProgressToNextLevel,
    isLoadingProgression 
  } = useGamification();

  const {
    gamifiedTemplates,
    isLoadingTemplates,
    customizations,
    saveCustomization,
    updateCustomization,
    deleteCustomization,
    isSaving
  } = useTemplateCustomization();

  const { createGamifiedCampaign, isCreating } = useGamifiedCampaigns();

  const progressToNext = getProgressToNextLevel();
  const unlockedAchievements = userAchievements.map(ua => ua.achievement_id);

  const getIconForAchievement = (iconName: string) => {
    const icons: any = {
      Star, Trophy, Crown, Rocket, Gamepad, TrendingUp, Target, RotateCcw
    };
    return icons[iconName] || Star;
  };

  const getLevelIcon = (level: number) => {
    if (level >= 10) return Crown;
    if (level >= 5) return Trophy;
    return Star;
  };

  const handleTemplateCustomize = (template: GamifiedTemplate) => {
    setSelectedTemplate(template);
    setCustomizationConfig(template.default_config);
    setTemplateName(`My ${template.name}`);
    setCampaignName(`${template.name} Campaign`);
    setIsCustomizing(true);
  };

  const handlePreviewTemplate = (template: GamifiedTemplate) => {
    setSelectedTemplate(template);
    setCustomizationConfig(template.default_config);
    setIsPreviewOpen(true);
  };

  const handleCreateCampaignFromTemplate = async () => {
    if (!selectedTemplate || !campaignName.trim()) {
      toast.error('Please enter a campaign name');
      return;
    }

    try {
      const success = await createGamifiedCampaign({
        template: selectedTemplate,
        customization: customizationConfig,
        campaignName: campaignName,
        targetingRules: {
          pageUrl: '/*',
          triggerType: 'time_delay',
          triggerValue: 3000
        },
        displaySettings: {
          showOnMobile: true,
          showOnDesktop: true,
          frequency: 'once_per_session'
        }
      });

      if (success) {
        setIsCustomizing(false);
        if (onCreateCampaign) {
          onCreateCampaign(selectedTemplate, customizationConfig);
        }
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    }
  };

  const handleSaveCustomization = () => {
    if (!selectedTemplate || !templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    saveCustomization({
      template_base_id: selectedTemplate.id,
      customization_data: customizationConfig,
      template_name: templateName,
      is_favorite: false
    });

    updateProgression({ action: 'template_customized' });
    toast.success('Template customization saved!');
  };

  const renderCustomizationControls = () => {
    if (!selectedTemplate) return null;

    const config = customizationConfig;

    return (
      <div className="space-y-6">
        <div>
          <Label htmlFor="templateName">Template Name</Label>
          <Input
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter template name"
          />
        </div>

        {/* Background Color */}
        <div>
          <Label>Background Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={config.backgroundColor || '#ffffff'}
              onChange={(e) => setCustomizationConfig({
                ...config,
                backgroundColor: e.target.value
              })}
              className="w-16 h-10"
            />
            <Input
              value={config.backgroundColor || '#ffffff'}
              onChange={(e) => setCustomizationConfig({
                ...config,
                backgroundColor: e.target.value
              })}
              placeholder="#ffffff"
            />
          </div>
        </div>

        {/* Text Color */}
        <div>
          <Label>Text Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={config.textColor || '#333333'}
              onChange={(e) => setCustomizationConfig({
                ...config,
                textColor: e.target.value
              })}
              className="w-16 h-10"
            />
            <Input
              value={config.textColor || '#333333'}
              onChange={(e) => setCustomizationConfig({
                ...config,
                textColor: e.target.value
              })}
              placeholder="#333333"
            />
          </div>
        </div>

        {/* Primary Color */}
        <div>
          <Label>Primary Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={config.primaryColor || '#4ECDC4'}
              onChange={(e) => setCustomizationConfig({
                ...config,
                primaryColor: e.target.value
              })}
              className="w-16 h-10"
            />
            <Input
              value={config.primaryColor || '#4ECDC4'}
              onChange={(e) => setCustomizationConfig({
                ...config,
                primaryColor: e.target.value
              })}
              placeholder="#4ECDC4"
            />
          </div>
        </div>

        {/* Button Text */}
        <div>
          <Label>Button Text</Label>
          <Input
            value={config.buttonText || ''}
            onChange={(e) => setCustomizationConfig({
              ...config,
              buttonText: e.target.value
            })}
            placeholder="Enter button text"
          />
        </div>

        {/* Template-specific controls */}
        {selectedTemplate.category === 'spin-wheel' && (
          <div className="space-y-4">
            <div>
              <Label>Wheel Prizes (one per line)</Label>
              <Textarea
                value={config.prizes?.join('\n') || ''}
                onChange={(e) => setCustomizationConfig({
                  ...config,
                  prizes: e.target.value.split('\n').filter(p => p.trim())
                })}
                placeholder="10% Off&#10;20% Off&#10;Free Shipping"
                rows={4}
              />
            </div>
          </div>
        )}

        {selectedTemplate.category === 'scratch-card' && (
          <div className="space-y-4">
            <div>
              <Label>Reveal Text</Label>
              <Input
                value={config.revealText || ''}
                onChange={(e) => setCustomizationConfig({
                  ...config,
                  revealText: e.target.value
                })}
                placeholder="You Won 20% Off!"
              />
            </div>
            <div>
              <Label>Reveal Title</Label>
              <Input
                value={config.revealTitle || ''}
                onChange={(e) => setCustomizationConfig({
                  ...config,
                  revealTitle: e.target.value
                })}
                placeholder="Congratulations!"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoadingTemplates) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading templates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Progress Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                {React.createElement(getLevelIcon(userProgression?.level || 1), {
                  className: "w-8 h-8"
                })}
              </div>
              <div>
                <h2 className="text-2xl font-bold">Level {userProgression?.level || 1}</h2>
                <p className="text-blue-100">{userProgression?.total_points || 0} points</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Next Level</p>
              <div className="w-32">
                <Progress 
                  value={progressToNext.percentage} 
                  className="h-2 bg-white/20"
                />
              </div>
              <p className="text-xs text-blue-100 mt-1">
                {progressToNext.current}/{progressToNext.required}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="templates">Game Templates</TabsTrigger>
          <TabsTrigger value="my-templates">My Templates</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gamifiedTemplates.map((template) => {
              const isLocked = (userProgression?.level || 1) < template.level_required;
              
              return (
                <Card key={template.id} className={`relative ${isLocked ? 'opacity-60' : ''}`}>
                  {isLocked && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        <Lock className="w-3 h-3 mr-1" />
                        Level {template.level_required}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Gamepad className="w-12 h-12 text-white/80" />
                      </div>
                      {!isLocked && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 left-2"
                          onClick={() => handlePreviewTemplate(template)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {template.name}
                      <Badge variant="outline">{template.category}</Badge>
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        disabled={isLocked}
                        onClick={() => handleTemplateCustomize(template)}
                        className="w-full"
                      >
                        <Palette className="w-4 h-4 mr-2" />
                        Customize & Deploy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="my-templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customizations.map((customization) => (
              <Card key={customization.id}>
                <CardHeader>
                  <div className="w-full h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Settings className="w-12 h-12 text-white/80" />
                    </div>
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {customization.template_name}
                    {customization.is_favorite && (
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    Based on {gamifiedTemplates.find(t => t.id === customization.template_base_id)?.name}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        const baseTemplate = gamifiedTemplates.find(t => t.id === customization.template_base_id);
                        if (baseTemplate) {
                          setSelectedTemplate(baseTemplate);
                          setCustomizationConfig(customization.customization_data);
                          setTemplateName(customization.template_name);
                          setCampaignName(`${customization.template_name} Campaign`);
                          setIsCustomizing(true);
                        }
                      }}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Deploy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const baseTemplate = gamifiedTemplates.find(t => t.id === customization.template_base_id);
                        if (baseTemplate) {
                          setSelectedTemplate(baseTemplate);
                          setCustomizationConfig(customization.customization_data);
                          setTemplateName(customization.template_name);
                          setIsCustomizing(true);
                        }
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCustomization(customization.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              const IconComponent = getIconForAchievement(achievement.icon);
              
              return (
                <Card key={achievement.id} className={`${isUnlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'opacity-60'}`}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isUnlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-sm">{achievement.name}</CardTitle>
                        <Badge variant={isUnlocked ? "default" : "secondary"} className="text-xs">
                          {achievement.points_reward} points
                        </Badge>
                      </div>
                      {isUnlocked && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {achievement.category}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Customization Dialog */}
      <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customize & Deploy {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Customize your interactive template and deploy it as a campaign on your website
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Customization Controls */}
            <div className="space-y-6">
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
                <Label htmlFor="templateName">Template Name (for saving)</Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                />
              </div>

              {renderCustomizationControls()}
            </div>

            {/* Right Column - Live Preview */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Live Preview</h3>
                <div className="bg-white border rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                  {selectedTemplate && (
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto flex items-center justify-center">
                        <Gamepad className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedTemplate.name} Preview
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setIsPreviewOpen(true)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Full Preview
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsCustomizing(false)}>
                Cancel
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSaveCustomization} 
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
            <Button 
              onClick={handleCreateCampaignFromTemplate} 
              disabled={isCreating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Deploy as Campaign
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      {isPreviewOpen && selectedTemplate && (
        <GamifiedTemplatePreview
          template={selectedTemplate}
          config={customizationConfig}
          onClose={() => setIsPreviewOpen(false)}
          onSubmit={(data) => {
            console.log('Preview submission:', data);
            toast.success('Template preview completed!');
            setIsPreviewOpen(false);
          }}
        />
      )}
    </div>
  );
};

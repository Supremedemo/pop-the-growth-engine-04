
import { useState } from "react";
import { useCampaigns } from "./useCampaigns";
import { useGamification } from "./useGamification";
import { toast } from "sonner";

export interface GamifiedCampaignConfig {
  templateId: string;
  templateName: string;
  customization: any;
  campaignName: string;
  targetingRules?: any;
  displaySettings?: any;
}

export const useGamifiedCampaigns = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { createCampaign } = useCampaigns();
  const { updateProgression } = useGamification();

  const createGamifiedCampaign = async (config: GamifiedCampaignConfig) => {
    try {
      setIsCreating(true);
      
      // Convert gamified template to canvas data format
      const canvasData = {
        elements: [{
          id: 'gamified-element',
          type: 'gamified-template',
          templateId: config.templateId,
          config: config.customization,
          x: 50,
          y: 50,
          width: 400,
          height: 300,
          zIndex: 1
        }],
        width: 500,
        height: 400,
        backgroundColor: config.customization.backgroundColor || '#ffffff',
        showOverlay: true,
        overlayColor: '#000000',
        overlayOpacity: 50,
        showCloseButton: true,
        closeButtonPosition: 'top-right' as const,
        layout: {
          type: 'modal' as const,
          position: 'center' as const
        }
      };

      // Create the campaign
      await new Promise<void>((resolve, reject) => {
        createCampaign({
          name: config.campaignName,
          description: `Interactive ${config.templateName} campaign`,
          canvasData,
          templateId: config.templateId,
          targetingRules: config.targetingRules || {
            pageUrl: '/*',
            triggerType: 'time_delay',
            triggerValue: 3000
          },
          displaySettings: config.displaySettings || {
            showOnMobile: true,
            showOnDesktop: true,
            frequency: 'once_per_session'
          }
        }, {
          onSuccess: () => {
            updateProgression({ action: 'campaign_created' });
            toast.success('Gamified campaign created successfully!');
            resolve();
          },
          onError: (error: Error) => {
            console.error('Error creating campaign:', error);
            toast.error('Failed to create campaign');
            reject(error);
          }
        });
      });

      return true;
    } catch (error) {
      console.error('Error in createGamifiedCampaign:', error);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const getTemplateEmbedCode = (templateId: string, config: any) => {
    return `
<!-- Gamified Template Embed Code -->
<script>
  (function() {
    // Template configuration
    const templateConfig = ${JSON.stringify(config, null, 2)};
    
    // Load template on page
    function loadGamifiedTemplate() {
      // Your gamified template implementation would go here
      console.log('Loading template: ${templateId}', templateConfig);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadGamifiedTemplate);
    } else {
      loadGamifiedTemplate();
    }
  })();
</script>
    `.trim();
  };

  return {
    createGamifiedCampaign,
    getTemplateEmbedCode,
    isCreating
  };
};

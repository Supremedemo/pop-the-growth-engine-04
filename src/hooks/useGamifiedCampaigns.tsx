
import { useState } from "react";
import { useCampaigns } from "./useCampaigns";
import { useGamification } from "./useGamification";
import { toast } from "sonner";
import { CanvasState } from "@/components/PopupBuilder";
import { GamifiedTemplate } from "./useTemplateCustomization";

export interface GamifiedCampaignConfig {
  template: GamifiedTemplate;
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
      
      // Process the HTML template with customization values
      const processedHtml = processTemplate(config.template.html_template, config.customization);
      const processedCss = processTemplate(config.template.css_template, config.customization);
      const processedJs = processTemplate(config.template.js_template, config.customization);

      // Create the full HTML with embedded CSS and JS
      const fullHtml = `
        <style>${processedCss}</style>
        ${processedHtml}
        <script>
          window.templateConfig = ${JSON.stringify(config.customization)};
          ${processedJs}
        </script>
      `;
      
      // Convert gamified template to canvas data format
      const canvasData: CanvasState = {
        elements: [{
          id: 'gamified-element',
          type: 'html',
          htmlContent: fullHtml,
          x: 50,
          y: 50,
          width: 500,
          height: 400,
          zIndex: 1
        }],
        width: 600,
        height: 500,
        backgroundColor: config.customization.backgroundColor || '#ffffff',
        backgroundType: 'color',
        zoom: 1,
        showGrid: false,
        gridSize: 8,
        showOverlay: true,
        overlayColor: '#000000',
        overlayOpacity: 50,
        showCloseButton: true,
        closeButtonPosition: 'top-right' as const,
        layout: {
          id: 'modal-center',
          name: 'Modal - Center',
          type: 'modal' as const,
          position: 'center' as const,
          description: `Interactive ${config.template.name} campaign`,
          dimensions: { width: 600, height: 500 }
        }
      };

      // Create the campaign
      await new Promise<void>((resolve, reject) => {
        createCampaign({
          name: config.campaignName,
          description: `Interactive ${config.template.name} campaign`,
          canvasData,
          templateId: config.template.id,
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

  const processTemplate = (template: string, config: any) => {
    let processed = template;
    
    // Replace template variables with actual values
    Object.keys(config).forEach(key => {
      const placeholder = `{{${key}}}`;
      const value = config[key];
      processed = processed.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return processed;
  };

  const getTemplateEmbedCode = (template: GamifiedTemplate, config: any) => {
    const processedHtml = processTemplate(template.html_template, config);
    const processedCss = processTemplate(template.css_template, config);
    const processedJs = processTemplate(template.js_template, config);

    return `
<!-- Gamified Template Embed Code -->
<div id="gamified-template-container">
  <style>
    ${processedCss}
  </style>
  ${processedHtml}
</div>

<script>
  (function() {
    // Template configuration
    window.templateConfig = ${JSON.stringify(config, null, 2)};
    window.templateConfig.onSubmit = function(data) {
      console.log('Template submission:', data);
      // Handle form submission here
    };
    
    // Initialize template
    ${processedJs}
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

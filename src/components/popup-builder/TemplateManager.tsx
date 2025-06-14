
import { useState, useCallback, useEffect } from "react";
import { CanvasState } from "@/components/PopupBuilder";
import { useTemplates } from "@/hooks/useTemplates";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useAssetManagement } from "@/hooks/useAssetManagement";
import { useTemplateManagement } from "@/hooks/useTemplateManagement";
import { toast } from "sonner";

interface TemplateManagerProps {
  templateId?: string;
  canvasState: CanvasState;
  onLoadTemplate: (template: any) => void;
}

export const useTemplateManager = ({ templateId, canvasState, onLoadTemplate }: TemplateManagerProps) => {
  const { templates, saveTemplate, updateTemplate, isSaving } = useTemplates();
  const { createCampaign, isCreating } = useCampaigns();
  const { uploadAsset, isUploading } = useAssetManagement();
  const { saveTemplateWithCanvas, generateTemplateCode, isSavingTemplate } = useTemplateManagement();

  const [currentTemplateId, setCurrentTemplateId] = useState(templateId);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);

  // Load template if templateId is provided
  const loadedTemplate = currentTemplateId ? templates.find(t => t.id === currentTemplateId) : null;
  
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateTags, setTemplateTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Update template details when a template is loaded
  useEffect(() => {
    if (loadedTemplate) {
      console.log('Loading template details:', loadedTemplate);
      setTemplateName(loadedTemplate.name);
      setTemplateDescription(loadedTemplate.description || "");
      setTemplateTags(loadedTemplate.tags || []);
      
      // Load the canvas data
      if (loadedTemplate.canvas_data) {
        console.log('Loading canvas data:', loadedTemplate.canvas_data);
        onLoadTemplate(loadedTemplate);
      }
    }
  }, [loadedTemplate, onLoadTemplate]);

  const handleSaveTemplate = useCallback(() => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    console.log('Saving template with canvas state:', canvasState);
    console.log('Current template ID:', currentTemplateId);

    if (currentTemplateId && loadedTemplate) {
      // Update existing template
      console.log('Updating existing template:', currentTemplateId);
      updateTemplate({
        id: currentTemplateId,
        updates: {
          name: templateName.trim(),
          description: templateDescription.trim() || null,
          canvas_data: canvasState,
          tags: templateTags
        }
      });
    } else {
      // Create new template
      console.log('Creating new template');
      saveTemplate({
        name: templateName.trim(),
        description: templateDescription.trim() || undefined,
        canvasData: canvasState,
        tags: templateTags
      });
      
      // Set the current template ID after saving (this will be handled by the mutation success)
    }
    
    setIsSaveDialogOpen(false);
  }, [templateName, currentTemplateId, loadedTemplate, updateTemplate, templateDescription, canvasState, templateTags, saveTemplate]);

  const handleCreateCampaign = useCallback(() => {
    if (!templateName.trim()) {
      toast.error('Please save the template first');
      return;
    }

    createCampaign({
      name: `${templateName} Campaign`,
      description: `Campaign based on ${templateName} template`,
      canvasData: canvasState,
      templateId: currentTemplateId
    });
  }, [templateName, createCampaign, canvasState, currentTemplateId]);

  const handleLoadTemplate = useCallback(() => {
    setIsTemplateDialogOpen(true);
  }, []);

  const loadTemplate = useCallback((template: any) => {
    console.log('Loading template:', template);
    setCurrentTemplateId(template.id);
    setTemplateName(template.name);
    setTemplateDescription(template.description || "");
    setTemplateTags(template.tags || []);
    
    // Load canvas data
    if (template.canvas_data) {
      console.log('Loading canvas data from template:', template.canvas_data);
      onLoadTemplate(template);
    }
    
    setIsTemplateDialogOpen(false);
    toast.success(`Template "${template.name}" loaded successfully!`);
  }, [onLoadTemplate]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadedFile = await uploadAsset(file, '/popup-assets/');
      return uploadedFile.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }, [uploadAsset]);

  const addTag = useCallback(() => {
    if (newTag.trim() && !templateTags.includes(newTag.trim())) {
      setTemplateTags([...templateTags, newTag.trim()]);
      setNewTag("");
    }
  }, [newTag, templateTags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setTemplateTags(templateTags.filter(tag => tag !== tagToRemove));
  }, [templateTags]);

  const handleGenerateCode = useCallback(() => {
    setIsCodeDialogOpen(true);
  }, []);

  const generatedCode = generateTemplateCode(canvasState);

  return {
    templates,
    currentTemplateId,
    templateName,
    setTemplateName,
    templateDescription,
    setTemplateDescription,
    templateTags,
    setTemplateTags,
    newTag,
    setNewTag,
    isSaving: isSaving || isSavingTemplate,
    isCreating,
    isUploading,
    isSaveDialogOpen,
    setIsSaveDialogOpen,
    isPublishDialogOpen,
    setIsPublishDialogOpen,
    isPreviewDialogOpen,
    setIsPreviewDialogOpen,
    isTemplateDialogOpen,
    setIsTemplateDialogOpen,
    isCodeDialogOpen,
    setIsCodeDialogOpen,
    generatedCode,
    handleSaveTemplate,
    handleCreateCampaign,
    handleLoadTemplate,
    loadTemplate,
    handleFileUpload,
    handleGenerateCode,
    addTag,
    removeTag
  };
};

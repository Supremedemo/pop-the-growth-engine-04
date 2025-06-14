
import { useState, useCallback } from "react";
import { CanvasState } from "@/components/PopupBuilder";
import { useTemplates } from "@/hooks/useTemplates";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useAssetManagement } from "@/hooks/useAssetManagement";
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

  const [currentTemplateId, setCurrentTemplateId] = useState(templateId);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  // Load template if templateId is provided
  const loadedTemplate = currentTemplateId ? templates.find(t => t.id === currentTemplateId) : null;
  
  const [templateName, setTemplateName] = useState(loadedTemplate?.name || "");
  const [templateDescription, setTemplateDescription] = useState(loadedTemplate?.description || "");
  const [templateTags, setTemplateTags] = useState<string[]>(loadedTemplate?.tags || []);
  const [newTag, setNewTag] = useState("");

  const handleSaveTemplate = useCallback(() => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    if (currentTemplateId) {
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
      saveTemplate({
        name: templateName.trim(),
        description: templateDescription.trim() || undefined,
        canvasData: canvasState,
        tags: templateTags
      });
    }
    
    setIsSaveDialogOpen(false);
  }, [templateName, currentTemplateId, updateTemplate, templateDescription, canvasState, templateTags, saveTemplate]);

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
    onLoadTemplate(template);
    setCurrentTemplateId(template.id);
    setTemplateName(template.name);
    setTemplateDescription(template.description || "");
    setTemplateTags(template.tags || []);
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
    isSaving,
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
    handleSaveTemplate,
    handleCreateCampaign,
    handleLoadTemplate,
    loadTemplate,
    handleFileUpload,
    addTag,
    removeTag
  };
};

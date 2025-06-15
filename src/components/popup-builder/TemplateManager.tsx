
import { useState, useEffect } from "react";
import { useTemplates } from "@/hooks/useTemplates";
import { useFileUpload } from "@/hooks/useFileUpload";
import { CanvasState } from "../PopupBuilder";
import { toast } from "sonner";

interface UseTemplateManagerProps {
  templateId?: string;
  canvasState: CanvasState;
  onLoadTemplate: (template: any) => void;
}

export const useTemplateManager = ({ templateId, canvasState, onLoadTemplate }: UseTemplateManagerProps) => {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  
  const [currentTemplateId, setCurrentTemplateId] = useState(templateId || null);
  const [currentCampaignId, setCurrentCampaignId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateTags, setTemplateTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const { templates, saveTemplate, isSaving } = useTemplates();
  const { uploadFile, isUploading } = useFileUpload();

  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (templateId && templates.length > 0) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setTemplateName(template.name);
        setTemplateDescription(template.description || "");
        setTemplateTags(template.tags || []);
        onLoadTemplate(template);
      }
    }
  }, [templateId, templates, onLoadTemplate]);

  const handleLoadTemplate = () => {
    setIsTemplateDialogOpen(true);
  };

  const loadTemplate = (template: any) => {
    setCurrentTemplateId(template.id);
    setTemplateName(template.name);
    setTemplateDescription(template.description || "");
    setTemplateTags(template.tags || []);
    onLoadTemplate(template);
    setIsTemplateDialogOpen(false);
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    try {
      const templateData = {
        name: templateName,
        description: templateDescription,
        tags: templateTags,
        canvas_data: canvasState,
        is_public: false
      };

      const savedTemplate = await saveTemplate(templateData, currentTemplateId || undefined);
      setCurrentTemplateId(savedTemplate.id);
      setIsSaveDialogOpen(false);
      toast.success("Template saved successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    }
  };

  const handleCreateCampaign = async () => {
    setIsCreating(true);
    try {
      // Create campaign logic would go here
      // For now, just simulate the creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateCode = () => {
    const code = `<!-- Popup Template: ${templateName} -->
<div class="popup-container">
  <!-- Generated popup code would go here -->
</div>`;
    setGeneratedCode(code);
    setIsCodeDialogOpen(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return "";

    try {
      const result = await uploadFile(file, "templates");
      return result.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
      return "";
    }
  };

  const addTag = () => {
    if (newTag.trim() && !templateTags.includes(newTag.trim())) {
      setTemplateTags([...templateTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTemplateTags(templateTags.filter(tag => tag !== tagToRemove));
  };

  return {
    templates,
    currentTemplateId,
    currentCampaignId,
    templateName,
    setTemplateName,
    templateDescription,
    setTemplateDescription,
    templateTags,
    setTemplateTags,
    newTag,
    setNewTag,
    generatedCode,
    isSaving,
    isCreating,
    isUploading,
    isTemplateDialogOpen,
    setIsTemplateDialogOpen,
    isSaveDialogOpen,
    setIsSaveDialogOpen,
    isPreviewDialogOpen,
    setIsPreviewDialogOpen,
    isPublishDialogOpen,
    setIsPublishDialogOpen,
    isCodeDialogOpen,
    setIsCodeDialogOpen,
    handleLoadTemplate,
    loadTemplate,
    handleSaveTemplate,
    handleCreateCampaign,
    handleGenerateCode,
    handleFileUpload,
    addTag,
    removeTag
  };
};

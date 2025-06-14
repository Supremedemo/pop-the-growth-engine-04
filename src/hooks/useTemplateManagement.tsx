
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useTemplates, UserTemplate } from "./useTemplates";
import { toast } from "sonner";

interface TemplateFolder {
  id: string;
  user_id: string;
  name: string;
  parent_folder_id: string | null;
  created_at: string;
}

export const useTemplateManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { templates, isLoading: templatesLoading } = useTemplates();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Fetch folders
  const {
    data: folders = [],
    isLoading: foldersLoading
  } = useQuery({
    queryKey: ['template-folders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('template_folders')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as TemplateFolder[];
    },
    enabled: !!user
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async ({ name, parentId }: { name: string; parentId?: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('template_folders')
        .insert({
          user_id: user.id,
          name,
          parent_folder_id: parentId || null
        })
        .select()
        .single();

      if (error) throw error;
      return data as TemplateFolder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-folders'] });
      toast.success('Folder created successfully!');
    },
    onError: (error) => {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  });

  // Delete folder mutation
  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: string) => {
      const { error } = await supabase
        .from('template_folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-folders'] });
      toast.success('Folder deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    }
  });

  // Move template to folder mutation
  const moveTemplateMutation = useMutation({
    mutationFn: async ({ templateId, folderId }: { templateId: string; folderId: string | null }) => {
      const { error } = await supabase
        .from('user_templates')
        .update({ folder_id: folderId })
        .eq('id', templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template moved successfully!');
    },
    onError: (error) => {
      console.error('Error moving template:', error);
      toast.error('Failed to move template');
    }
  });

  // Utility functions
  const getFilteredTemplates = useCallback(() => {
    let filtered = templates;

    // Filter by current folder
    filtered = filtered.filter(template => 
      (template as any).folder_id === currentFolder
    );

    // Filter by tags if any are selected
    if (selectedTags.length > 0) {
      filtered = filtered.filter(template =>
        selectedTags.some(tag => template.tags.includes(tag))
      );
    }

    return filtered;
  }, [templates, currentFolder, selectedTags]);

  const getCurrentFolderPath = useCallback(() => {
    if (!currentFolder) return ['Root'];
    
    const path: string[] = ['Root'];
    let folder = folders.find(f => f.id === currentFolder);
    const folderPath: TemplateFolder[] = [];
    
    while (folder) {
      folderPath.unshift(folder);
      folder = folder.parent_folder_id 
        ? folders.find(f => f.id === folder!.parent_folder_id) 
        : undefined;
    }
    
    return [...path, ...folderPath.map(f => f.name)];
  }, [currentFolder, folders]);

  const getSubfolders = useCallback(() => {
    return folders.filter(f => f.parent_folder_id === currentFolder);
  }, [folders, currentFolder]);

  const getAllTags = useCallback(() => {
    return Array.from(new Set(templates.flatMap(t => t.tags)));
  }, [templates]);

  return {
    // Data
    templates: getFilteredTemplates(),
    folders,
    subfolders: getSubfolders(),
    allTags: getAllTags(),
    
    // State
    selectedTags,
    setSelectedTags,
    currentFolder,
    setCurrentFolder,
    
    // Loading states
    isLoading: templatesLoading || foldersLoading,
    isCreatingFolder: createFolderMutation.isPending,
    isDeletingFolder: deleteFolderMutation.isPending,
    isMovingTemplate: moveTemplateMutation.isPending,
    
    // Actions
    createFolder: createFolderMutation.mutate,
    deleteFolder: deleteFolderMutation.mutate,
    moveTemplate: moveTemplateMutation.mutate,
    
    // Utilities
    getCurrentFolderPath
  };
};

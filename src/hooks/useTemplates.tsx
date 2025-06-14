
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { CanvasState } from "@/components/PopupBuilder";
import { toast } from "sonner";

export interface UserTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  canvas_data: CanvasState;
  thumbnail_url: string | null;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const useTemplates = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: templates = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['templates', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the Json canvas_data to CanvasState
      return (data || []).map(template => ({
        ...template,
        canvas_data: template.canvas_data as CanvasState
      })) as UserTemplate[];
    },
    enabled: !!user
  });

  const saveTemplateMutation = useMutation({
    mutationFn: async ({ name, description, canvasData, tags }: {
      name: string;
      description?: string;
      canvasData: CanvasState;
      tags?: string[];
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_templates')
        .insert({
          user_id: user.id,
          name,
          description: description || null,
          canvas_data: canvasData as any, // Cast CanvasState to Json
          tags: tags || [],
          is_public: false
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        canvas_data: data.canvas_data as CanvasState
      } as UserTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template saved successfully!');
    },
    onError: (error) => {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, updates }: {
      id: string;
      updates: Partial<Omit<UserTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
    }) => {
      // Cast CanvasState to Json for database storage
      const dbUpdates = {
        ...updates,
        canvas_data: updates.canvas_data ? updates.canvas_data as any : undefined,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_templates')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        canvas_data: data.canvas_data as CanvasState
      } as UserTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase
        .from('user_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  });

  return {
    templates,
    isLoading,
    error,
    saveTemplate: saveTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate,
    isSaving: saveTemplateMutation.isPending,
    isUpdating: updateTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending
  };
};

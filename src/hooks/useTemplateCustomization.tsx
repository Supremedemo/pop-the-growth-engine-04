
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface TemplateCustomization {
  id: string;
  user_id: string;
  template_base_id: string;
  customization_data: any;
  template_name: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface GamifiedTemplate {
  id: string;
  name: string;
  description: string;
  category: 'spin-wheel' | 'scratch-card' | 'slot-machine' | 'memory-game' | 'quiz' | 'survey';
  html_template: string;
  css_template: string;
  js_template: string;
  default_config: any;
  preview_image: string | null;
  level_required: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTemplateCustomization = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch gamified templates from database
  const { data: gamifiedTemplates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['gamified-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gamified_templates')
        .select('*')
        .eq('is_active', true)
        .order('level_required', { ascending: true });
      
      if (error) {
        console.error('Error fetching gamified templates:', error);
        return [];
      }
      
      return data as GamifiedTemplate[];
    }
  });

  // Get user customizations
  const { data: customizations, isLoading } = useQuery({
    queryKey: ['template-customizations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('template_customizations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching customizations:', error);
        return [];
      }
      
      return data as TemplateCustomization[];
    },
    enabled: !!user
  });

  // Save customization
  const saveCustomizationMutation = useMutation({
    mutationFn: async (customization: Omit<TemplateCustomization, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('template_customizations')
        .insert({
          ...customization,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Template customization saved!');
      queryClient.invalidateQueries({ queryKey: ['template-customizations'] });
    },
    onError: (error) => {
      console.error('Error saving customization:', error);
      toast.error('Failed to save customization');
    }
  });

  // Update customization
  const updateCustomizationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TemplateCustomization> }) => {
      const { data, error } = await supabase
        .from('template_customizations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Template updated!');
      queryClient.invalidateQueries({ queryKey: ['template-customizations'] });
    },
    onError: (error) => {
      console.error('Error updating customization:', error);
      toast.error('Failed to update template');
    }
  });

  // Delete customization
  const deleteCustomizationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('template_customizations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Template deleted!');
      queryClient.invalidateQueries({ queryKey: ['template-customizations'] });
    },
    onError: (error) => {
      console.error('Error deleting customization:', error);
      toast.error('Failed to delete template');
    }
  });

  return {
    gamifiedTemplates,
    isLoadingTemplates,
    customizations: customizations || [],
    isLoading,
    saveCustomization: saveCustomizationMutation.mutate,
    updateCustomization: updateCustomizationMutation.mutate,
    deleteCustomization: deleteCustomizationMutation.mutate,
    isSaving: saveCustomizationMutation.isPending,
    isUpdating: updateCustomizationMutation.isPending,
    isDeleting: deleteCustomizationMutation.isPending
  };
};

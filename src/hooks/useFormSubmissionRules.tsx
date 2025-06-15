
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface FormSubmissionRule {
  id: string;
  user_id: string;
  campaign_id: string | null;
  template_id: string | null;
  name: string;
  conditions: Record<string, any>;
  actions: Record<string, any>;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export const useFormSubmissionRules = (campaignId?: string, templateId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: rules = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['form-submission-rules', user?.id, campaignId, templateId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('form_submission_rules')
        .select('*')
        .order('priority', { ascending: false });

      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }
      if (templateId) {
        query = query.eq('template_id', templateId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as FormSubmissionRule[];
    },
    enabled: !!user
  });

  const createRuleMutation = useMutation({
    mutationFn: async (ruleData: Omit<FormSubmissionRule, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('form_submission_rules')
        .insert({
          ...ruleData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as FormSubmissionRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-submission-rules'] });
      toast.success('Rule created successfully!');
    },
    onError: (error) => {
      console.error('Error creating rule:', error);
      toast.error('Failed to create rule');
    }
  });

  const updateRuleMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FormSubmissionRule> }) => {
      const { data, error } = await supabase
        .from('form_submission_rules')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as FormSubmissionRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-submission-rules'] });
      toast.success('Rule updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating rule:', error);
      toast.error('Failed to update rule');
    }
  });

  const deleteRuleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('form_submission_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-submission-rules'] });
      toast.success('Rule deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting rule:', error);
      toast.error('Failed to delete rule');
    }
  });

  return {
    rules,
    isLoading,
    error,
    createRule: createRuleMutation.mutate,
    updateRule: updateRuleMutation.mutate,
    deleteRule: deleteRuleMutation.mutate,
    isCreating: createRuleMutation.isPending,
    isUpdating: updateRuleMutation.isPending,
    isDeleting: deleteRuleMutation.isPending
  };
};

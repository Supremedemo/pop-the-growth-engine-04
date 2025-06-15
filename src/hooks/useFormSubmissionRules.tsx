
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
      
      let query = `
        SELECT * FROM form_submission_rules 
        WHERE user_id = $1
      `;
      const params = [user.id];

      if (campaignId) {
        query += ` AND campaign_id = $${params.length + 1}`;
        params.push(campaignId);
      }
      if (templateId) {
        query += ` AND template_id = $${params.length + 1}`;
        params.push(templateId);
      }

      query += ` ORDER BY priority DESC`;

      const { data, error } = await supabase.functions.invoke('execute-sql', {
        body: { query, params }
      });

      if (error) throw error;
      return (data?.data || []) as FormSubmissionRule[];
    },
    enabled: !!user
  });

  const createRuleMutation = useMutation({
    mutationFn: async (ruleData: Omit<FormSubmissionRule, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('execute-sql', {
        body: {
          query: `
            INSERT INTO form_submission_rules (user_id, campaign_id, template_id, name, conditions, actions, is_active, priority)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
          `,
          params: [
            user.id,
            ruleData.campaign_id,
            ruleData.template_id,
            ruleData.name,
            JSON.stringify(ruleData.conditions),
            JSON.stringify(ruleData.actions),
            ruleData.is_active,
            ruleData.priority
          ]
        }
      });

      if (error) throw error;
      return data?.data?.[0] as FormSubmissionRule;
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
      const { data, error } = await supabase.functions.invoke('execute-sql', {
        body: {
          query: `
            UPDATE form_submission_rules 
            SET name = COALESCE($2, name),
                conditions = COALESCE($3, conditions),
                actions = COALESCE($4, actions),
                is_active = COALESCE($5, is_active),
                priority = COALESCE($6, priority),
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
          `,
          params: [
            id,
            updates.name,
            updates.conditions ? JSON.stringify(updates.conditions) : null,
            updates.actions ? JSON.stringify(updates.actions) : null,
            updates.is_active,
            updates.priority
          ]
        }
      });

      if (error) throw error;
      return data?.data?.[0] as FormSubmissionRule;
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
      const { error } = await supabase.functions.invoke('execute-sql', {
        body: {
          query: 'DELETE FROM form_submission_rules WHERE id = $1',
          params: [id]
        }
      });

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

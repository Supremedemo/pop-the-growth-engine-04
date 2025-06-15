
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Webhook {
  id: string;
  user_id: string;
  name: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  auth_type: 'none' | 'bearer' | 'basic' | 'api_key';
  auth_config: Record<string, any>;
  is_active: boolean;
  last_tested_at: string | null;
  last_test_status: 'success' | 'failed' | 'pending' | null;
  last_test_response: string | null;
  created_at: string;
  updated_at: string;
}

export const useWebhooks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: webhooks = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['webhooks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Webhook[];
    },
    enabled: !!user
  });

  const createWebhookMutation = useMutation({
    mutationFn: async (webhookData: Omit<Webhook, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_tested_at' | 'last_test_status' | 'last_test_response'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('webhooks')
        .insert({
          ...webhookData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Webhook;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook created successfully!');
    },
    onError: (error) => {
      console.error('Error creating webhook:', error);
      toast.error('Failed to create webhook');
    }
  });

  const updateWebhookMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Webhook> }) => {
      const { data, error } = await supabase
        .from('webhooks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Webhook;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating webhook:', error);
      toast.error('Failed to update webhook');
    }
  });

  const deleteWebhookMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting webhook:', error);
      toast.error('Failed to delete webhook');
    }
  });

  const testWebhookMutation = useMutation({
    mutationFn: async (webhookId: string) => {
      const { data, error } = await supabase.functions.invoke('test-webhook', {
        body: { webhookId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook test completed!');
    },
    onError: (error) => {
      console.error('Error testing webhook:', error);
      toast.error('Failed to test webhook');
    }
  });

  return {
    webhooks,
    isLoading,
    error,
    createWebhook: createWebhookMutation.mutate,
    updateWebhook: updateWebhookMutation.mutate,
    deleteWebhook: deleteWebhookMutation.mutate,
    testWebhook: testWebhookMutation.mutate,
    isCreating: createWebhookMutation.isPending,
    isUpdating: updateWebhookMutation.isPending,
    isDeleting: deleteWebhookMutation.isPending,
    isTesting: testWebhookMutation.isPending
  };
};

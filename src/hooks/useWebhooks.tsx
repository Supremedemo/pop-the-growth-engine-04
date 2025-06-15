
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
      
      const { data, error } = await supabase.functions.invoke('execute-sql', {
        body: {
          query: 'SELECT * FROM webhooks WHERE user_id = $1 ORDER BY created_at DESC',
          params: [user.id]
        }
      });

      if (error) throw error;
      return (data?.data || []) as Webhook[];
    },
    enabled: !!user
  });

  const createWebhookMutation = useMutation({
    mutationFn: async (webhookData: Omit<Webhook, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_tested_at' | 'last_test_status' | 'last_test_response'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('execute-sql', {
        body: {
          query: `
            INSERT INTO webhooks (user_id, name, url, method, headers, auth_type, auth_config, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
          `,
          params: [
            user.id,
            webhookData.name,
            webhookData.url,
            webhookData.method,
            JSON.stringify(webhookData.headers),
            webhookData.auth_type,
            JSON.stringify(webhookData.auth_config),
            webhookData.is_active
          ]
        }
      });

      if (error) throw error;
      return data?.data?.[0] as Webhook;
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
      const { data, error } = await supabase.functions.invoke('execute-sql', {
        body: {
          query: `
            UPDATE webhooks 
            SET name = COALESCE($2, name),
                url = COALESCE($3, url),
                method = COALESCE($4, method),
                headers = COALESCE($5, headers),
                auth_type = COALESCE($6, auth_type),
                auth_config = COALESCE($7, auth_config),
                is_active = COALESCE($8, is_active),
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
          `,
          params: [
            id,
            updates.name,
            updates.url,
            updates.method,
            updates.headers ? JSON.stringify(updates.headers) : null,
            updates.auth_type,
            updates.auth_config ? JSON.stringify(updates.auth_config) : null,
            updates.is_active
          ]
        }
      });

      if (error) throw error;
      return data?.data?.[0] as Webhook;
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
      const { error } = await supabase.functions.invoke('execute-sql', {
        body: {
          query: 'DELETE FROM webhooks WHERE id = $1',
          params: [id]
        }
      });

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

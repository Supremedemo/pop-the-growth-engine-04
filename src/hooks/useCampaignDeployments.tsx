
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface CampaignDeployment {
  id: string;
  campaign_id: string;
  website_id: string;
  status: 'pending' | 'active' | 'paused' | 'stopped';
  rules: any;
  deployment_config: any;
  deployed_at: string | null;
  last_triggered_at: string | null;
  trigger_count: number;
  conversion_count: number;
  created_at: string;
  updated_at: string;
}

export const useCampaignDeployments = (campaignId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: deployments = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['campaign-deployments', campaignId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('campaign_deployments')
        .select(`
          *,
          campaigns!inner(user_id),
          websites(name, domain)
        `);
      
      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as CampaignDeployment[];
    },
    enabled: !!user
  });

  const deployMutation = useMutation({
    mutationFn: async ({ 
      campaignId, 
      websiteId, 
      rules, 
      config 
    }: {
      campaignId: string;
      websiteId: string;
      rules?: any;
      config?: any;
    }) => {
      const { data, error } = await supabase.rpc('queue_campaign_deployment', {
        p_campaign_id: campaignId,
        p_website_id: websiteId,
        p_rules: rules || {},
        p_config: config || {}
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-deployments'] });
      toast.success('Campaign deployment queued successfully!');
    },
    onError: (error: any) => {
      console.error('Error deploying campaign:', error);
      toast.error('Failed to deploy campaign');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ 
      deploymentId, 
      status 
    }: {
      deploymentId: string;
      status: 'active' | 'paused' | 'stopped';
    }) => {
      const { data, error } = await supabase
        .from('campaign_deployments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', deploymentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-deployments'] });
      toast.success('Campaign status updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating campaign status:', error);
      toast.error('Failed to update campaign status');
    }
  });

  return {
    deployments,
    isLoading,
    error,
    deployCampaign: deployMutation.mutate,
    updateDeploymentStatus: updateStatusMutation.mutate,
    isDeploying: deployMutation.isPending,
    isUpdating: updateStatusMutation.isPending
  };
};


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { CanvasState } from "@/components/PopupBuilder";
import { toast } from "sonner";

export interface Campaign {
  id: string;
  user_id: string;
  template_id: string | null;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'paused' | 'completed';
  canvas_data: CanvasState;
  targeting_rules: any;
  display_settings: any;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export const useCampaigns = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: campaigns = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['campaigns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the Json canvas_data to CanvasState
      return (data || []).map(campaign => ({
        ...campaign,
        canvas_data: campaign.canvas_data as unknown as CanvasState
      })) as Campaign[];
    },
    enabled: !!user
  });

  const createCampaignMutation = useMutation({
    mutationFn: async ({ 
      name, 
      description, 
      canvasData, 
      templateId, 
      targetingRules, 
      displaySettings 
    }: {
      name: string;
      description?: string;
      canvasData: CanvasState;
      templateId?: string;
      targetingRules?: any;
      displaySettings?: any;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          template_id: templateId || null,
          name,
          description: description || null,
          canvas_data: canvasData as any, // Cast CanvasState to Json
          status: 'draft',
          targeting_rules: targetingRules || {},
          display_settings: displaySettings || {}
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        canvas_data: data.canvas_data as unknown as CanvasState
      } as Campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign created successfully!');
    },
    onError: (error) => {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    }
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, updates }: {
      id: string;
      updates: Partial<Omit<Campaign, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
    }) => {
      // Cast CanvasState to Json for database storage
      const dbUpdates = {
        ...updates,
        canvas_data: updates.canvas_data ? updates.canvas_data as any : undefined,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('campaigns')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        canvas_data: data.canvas_data as unknown as CanvasState
      } as Campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating campaign:', error);
      toast.error('Failed to update campaign');
    }
  });

  return {
    campaigns,
    isLoading,
    error,
    createCampaign: createCampaignMutation.mutate,
    updateCampaign: updateCampaignMutation.mutate,
    isCreating: createCampaignMutation.isPending,
    isUpdating: updateCampaignMutation.isPending
  };
};

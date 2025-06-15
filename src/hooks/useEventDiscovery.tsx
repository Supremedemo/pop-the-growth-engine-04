
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface DiscoveredEvent {
  id: string;
  website_id: string;
  event_type: string;
  event_schema: any;
  sample_payload: any;
  first_seen: string;
  last_seen: string;
  occurrence_count: number;
  is_conversion_event: boolean;
  revenue_mapping: {
    enabled: boolean;
    revenue_field: string;
    fallback_value: number;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface EventTriggerRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'starts_with' | 'ends_with';
  value: any;
  data_type: 'string' | 'number' | 'boolean' | 'array';
}

export const useEventDiscovery = (websiteId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: discoveredEvents = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['discovered-events', websiteId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('discovered_events')
        .select(`
          *,
          websites!inner(user_id, name, domain)
        `);
      
      if (websiteId) {
        query = query.eq('website_id', websiteId);
      }

      const { data, error } = await query.order('last_seen', { ascending: false });

      if (error) throw error;
      return data as DiscoveredEvent[];
    },
    enabled: !!user
  });

  const updateConversionEventMutation = useMutation({
    mutationFn: async ({ 
      eventId, 
      isConversion, 
      revenueMapping 
    }: {
      eventId: string;
      isConversion: boolean;
      revenueMapping?: {
        enabled: boolean;
        revenue_field: string;
        fallback_value: number;
      };
    }) => {
      const { data, error } = await supabase
        .from('discovered_events')
        .update({
          is_conversion_event: isConversion,
          revenue_mapping: revenueMapping || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovered-events'] });
      toast.success('Event configuration updated!');
    },
    onError: (error: any) => {
      console.error('Error updating event:', error);
      toast.error('Failed to update event configuration');
    }
  });

  const triggerEventDiscoveryMutation = useMutation({
    mutationFn: async (websiteId: string) => {
      const { data, error } = await supabase.rpc('trigger_event_discovery', {
        p_website_id: websiteId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovered-events'] });
      toast.success('Event discovery triggered!');
    },
    onError: (error: any) => {
      console.error('Error triggering discovery:', error);
      toast.error('Failed to trigger event discovery');
    }
  });

  return {
    discoveredEvents,
    isLoading,
    error,
    updateConversionEvent: updateConversionEventMutation.mutate,
    triggerEventDiscovery: triggerEventDiscoveryMutation.mutate,
    isUpdating: updateConversionEventMutation.isPending,
    isTriggering: triggerEventDiscoveryMutation.isPending
  };
};

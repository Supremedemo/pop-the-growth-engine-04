
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
      
      // Use raw SQL query since discovered_events table is new
      let query = `
        SELECT de.*, w.name as website_name, w.domain as website_domain
        FROM discovered_events de
        INNER JOIN websites w ON de.website_id = w.id
        WHERE w.user_id = $1
      `;
      
      const params = [user.id];
      
      if (websiteId) {
        query += ` AND de.website_id = $2`;
        params.push(websiteId);
      }
      
      query += ` ORDER BY de.last_seen DESC`;

      const { data, error } = await supabase.rpc('execute_sql', {
        query,
        params
      });

      if (error) {
        console.error('Error fetching discovered events:', error);
        // Fallback to mock data for development
        return [];
      }
      
      return (data || []) as DiscoveredEvent[];
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
      const { data, error } = await supabase.rpc('execute_sql', {
        query: `
          UPDATE discovered_events 
          SET is_conversion_event = $1, 
              revenue_mapping = $2, 
              updated_at = now()
          WHERE id = $3
          RETURNING *
        `,
        params: [isConversion, JSON.stringify(revenueMapping || null), eventId]
      });

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
      // Insert directly into event_queue table
      const { data, error } = await supabase
        .from('event_queue')
        .insert({
          event_type: 'event_discovery',
          payload: { website_id: websiteId },
          priority: 2
        })
        .select()
        .single();

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


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface QueueEvent {
  id: string;
  event_type: string;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;
  scheduled_at: string;
  attempts: number;
  max_attempts: number;
  last_error: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useEventQueue = () => {
  const queryClient = useQueryClient();

  const {
    data: queueEvents = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['event-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_queue')
        .select('*')
        .order('priority', { ascending: false })
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data as QueueEvent[];
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const processEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { data, error } = await supabase.rpc('process_queue_event', {
        event_id: eventId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-queue'] });
      toast.success('Event processed successfully!');
    },
    onError: (error: any) => {
      console.error('Error processing event:', error);
      toast.error('Failed to process event');
    }
  });

  const addEventMutation = useMutation({
    mutationFn: async ({ 
      eventType, 
      payload, 
      priority = 5 
    }: {
      eventType: string;
      payload: any;
      priority?: number;
    }) => {
      const { data, error } = await supabase
        .from('event_queue')
        .insert({
          event_type: eventType,
          payload,
          priority
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-queue'] });
    },
    onError: (error: any) => {
      console.error('Error adding event to queue:', error);
      toast.error('Failed to queue event');
    }
  });

  return {
    queueEvents,
    isLoading,
    error,
    processEvent: processEventMutation.mutate,
    addEvent: addEventMutation.mutate,
    isProcessing: processEventMutation.isPending,
    isAdding: addEventMutation.isPending
  };
};

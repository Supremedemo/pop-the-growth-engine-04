
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface TrackedUser {
  id: string;
  website_id: string;
  cookie_id: string;
  user_agent: string;
  ip_address: string;
  first_seen: string;
  last_seen: string;
  page_views: number;
  session_count: number;
  created_at: string;
}

export interface UserEvent {
  id: string;
  website_id: string;
  tracked_user_id: string;
  event_type: string;
  event_data: any;
  url: string;
  referrer: string;
  timestamp: string;
  session_id: string;
}

export const useUserTracking = (websiteId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch tracked users for a website
  const {
    data: trackedUsers = [],
    isLoading: usersLoading
  } = useQuery({
    queryKey: ['tracked-users', websiteId, user?.id],
    queryFn: async () => {
      if (!user || !websiteId) return [];
      
      const { data, error } = await supabase
        .from('tracked_users')
        .select('*')
        .eq('website_id', websiteId)
        .order('last_seen', { ascending: false });

      if (error) throw error;
      return data as TrackedUser[];
    },
    enabled: !!user && !!websiteId
  });

  // Fetch events for tracked users
  const {
    data: userEvents = [],
    isLoading: eventsLoading
  } = useQuery({
    queryKey: ['user-events', websiteId, user?.id],
    queryFn: async () => {
      if (!user || !websiteId) return [];
      
      const { data, error } = await supabase
        .from('user_events')
        .select('*')
        .eq('website_id', websiteId)
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (error) throw error;
      return data as UserEvent[];
    },
    enabled: !!user && !!websiteId
  });

  // Get event analytics
  const getEventAnalytics = () => {
    const eventTypes = userEvents.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalEvents = userEvents.length;
    const uniqueUsers = new Set(userEvents.map(e => e.tracked_user_id)).size;
    
    // Calculate events per day for the last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentEvents = userEvents.filter(event => 
      new Date(event.timestamp) >= sevenDaysAgo
    );

    return {
      eventTypes,
      totalEvents,
      uniqueUsers,
      recentEvents: recentEvents.length,
      averageEventsPerUser: uniqueUsers > 0 ? totalEvents / uniqueUsers : 0
    };
  };

  // Get user journey for a specific user
  const getUserJourney = (trackedUserId: string) => {
    return userEvents
      .filter(event => event.tracked_user_id === trackedUserId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  return {
    trackedUsers,
    userEvents,
    isLoading: usersLoading || eventsLoading,
    getEventAnalytics,
    getUserJourney
  };
};

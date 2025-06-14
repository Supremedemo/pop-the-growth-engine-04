
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Website {
  id: string;
  user_id: string;
  name: string;
  url: string;
  domain: string;
  beacon_id: string;
  api_key: string;
  tracking_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useWebsiteManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: websites = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['websites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []) as Website[];
    },
    enabled: !!user
  });

  const addWebsiteMutation = useMutation({
    mutationFn: async ({ name, url }: { name: string; url: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Extract domain from URL
      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      const { data, error } = await supabase
        .from('websites')
        .insert({
          user_id: user.id,
          name,
          url,
          domain
        })
        .select()
        .single();

      if (error) throw error;
      
      return data as Website;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websites'] });
      toast.success('Website added successfully!');
    },
    onError: (error) => {
      console.error('Error adding website:', error);
      toast.error('Failed to add website');
    }
  });

  const updateWebsiteMutation = useMutation({
    mutationFn: async ({ id, updates }: {
      id: string;
      updates: Partial<Omit<Website, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
    }) => {
      const { data, error } = await supabase
        .from('websites')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return data as Website;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websites'] });
      toast.success('Website updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating website:', error);
      toast.error('Failed to update website');
    }
  });

  const deleteWebsiteMutation = useMutation({
    mutationFn: async (websiteId: string) => {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', websiteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websites'] });
      toast.success('Website deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting website:', error);
      toast.error('Failed to delete website');
    }
  });

  const generateBeaconCode = (website: Website) => {
    return `<!-- Pop The Builder Tracking Beacon -->
<script>
(function() {
  var ptb = window.ptb = window.ptb || {};
  ptb.websiteId = "${website.beacon_id}";
  ptb.apiKey = "${website.api_key}";
  ptb.apiUrl = "https://qxwjsqnjwjdnawpwotfv.supabase.co";
  
  // Generate or get session ID
  ptb.sessionId = sessionStorage.getItem('ptb_session') || 
    Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessionStorage.setItem('ptb_session', ptb.sessionId);
  
  // Generate or get user ID
  ptb.userId = localStorage.getItem('ptb_user') || 
    Math.random().toString(36).substring(2) + Date.now().toString(36);
  localStorage.setItem('ptb_user', ptb.userId);
  
  // Track page view
  ptb.track = function(eventType, data) {
    var eventData = {
      event_type: eventType,
      website_id: ptb.websiteId,
      user_id: ptb.userId,
      session_id: ptb.sessionId,
      url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      data: data || {}
    };
    
    // Send to your tracking endpoint
    fetch(ptb.apiUrl + '/rest/v1/analytics_events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ptb.apiKey,
        'Authorization': 'Bearer ' + ptb.apiKey
      },
      body: JSON.stringify({
        event_type: eventData.event_type,
        event_data: eventData
      })
    }).catch(function(err) {
      console.warn('PTB tracking failed:', err);
    });
  };
  
  // Auto-track page view
  ptb.track('page_view', {
    title: document.title,
    path: window.location.pathname
  });
  
  // Track clicks
  document.addEventListener('click', function(e) {
    ptb.track('click', {
      element: e.target.tagName,
      id: e.target.id,
      class: e.target.className,
      text: e.target.textContent.substring(0, 100)
    });
  });
  
  // Track form submissions
  document.addEventListener('submit', function(e) {
    ptb.track('form_submit', {
      form_id: e.target.id,
      form_class: e.target.className,
      action: e.target.action
    });
  });
  
  // Track scroll depth
  var maxScroll = 0;
  window.addEventListener('scroll', function() {
    var scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      ptb.track('scroll', { depth: scrollPercent });
    }
  });
  
  // Track time on page
  var startTime = Date.now();
  window.addEventListener('beforeunload', function() {
    var timeOnPage = Math.round((Date.now() - startTime) / 1000);
    ptb.track('time_on_page', { duration: timeOnPage });
  });
})();
</script>
<!-- End Pop The Builder Beacon -->`;
  };

  return {
    websites,
    isLoading,
    error,
    addWebsite: addWebsiteMutation.mutate,
    updateWebsite: updateWebsiteMutation.mutate,
    deleteWebsite: deleteWebsiteMutation.mutate,
    generateBeaconCode,
    isAdding: addWebsiteMutation.isPending,
    isUpdating: updateWebsiteMutation.isPending,
    isDeleting: deleteWebsiteMutation.isPending
  };
};

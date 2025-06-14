
import { useState } from "react";
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
  popup_triggers: any[];
  created_at: string;
  updated_at: string;
}

export const useWebsiteManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user websites
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
      return data as Website[];
    },
    enabled: !!user
  });

  // Add website mutation
  const addWebsiteMutation = useMutation({
    mutationFn: async ({ name, url }: { name: string; url: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Extract domain from URL
      const domain = new URL(url).hostname;
      const beaconId = `beacon_${Math.random().toString(36).substr(2, 12)}`;
      const apiKey = `api_${Math.random().toString(36).substr(2, 16)}`;

      const { data, error } = await supabase
        .from('websites')
        .insert({
          user_id: user.id,
          name,
          url,
          domain,
          beacon_id: beaconId,
          api_key: apiKey,
          tracking_enabled: true,
          popup_triggers: []
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

  // Update website mutation
  const updateWebsiteMutation = useMutation({
    mutationFn: async ({ id, updates }: {
      id: string;
      updates: Partial<Omit<Website, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
    }) => {
      const { data, error } = await supabase
        .from('websites')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
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

  // Delete website mutation
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

  // Generate beacon code for a website
  const generateBeaconCode = (website: Website) => {
    return `
<!-- ${website.name} Tracking Beacon -->
<script>
(function() {
  window.PopupTracker = {
    websiteId: '${website.id}',
    beaconId: '${website.beacon_id}',
    apiKey: '${website.api_key}',
    domain: '${website.domain}',
    apiEndpoint: 'https://qxwjsqnjwjdnawpwotfv.supabase.co/functions/v1/track-events',
    
    // Initialize tracking
    init: function() {
      this.userId = this.getUserId();
      this.sessionId = this.getSessionId();
      this.trackPageView();
      this.setupEventListeners();
    },
    
    // Get or create user ID
    getUserId: function() {
      let userId = localStorage.getItem('popup_user_id');
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 16);
        localStorage.setItem('popup_user_id', userId);
      }
      return userId;
    },
    
    // Get or create session ID
    getSessionId: function() {
      let sessionId = sessionStorage.getItem('popup_session_id');
      if (!sessionId) {
        sessionId = 'session_' + Math.random().toString(36).substr(2, 16);
        sessionStorage.setItem('popup_session_id', sessionId);
      }
      return sessionId;
    },
    
    // Track events
    track: function(eventType, eventData = {}) {
      const payload = {
        website_id: this.websiteId,
        user_id: this.userId,
        session_id: this.sessionId,
        event_type: eventType,
        event_data: eventData,
        url: window.location.href,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        timestamp: Date.now()
      };
      
      fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.apiKey
        },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Tracking error:', err));
      
      // Check for popup triggers
      this.checkTriggers(eventType, eventData);
    },
    
    // Track page view
    trackPageView: function() {
      this.track('page_view', {
        page_title: document.title,
        page_path: window.location.pathname
      });
    },
    
    // Setup event listeners
    setupEventListeners: function() {
      // Track clicks
      document.addEventListener('click', (e) => {
        this.track('click', {
          element: e.target.tagName,
          text: e.target.textContent?.slice(0, 100),
          classes: e.target.className
        });
      });
      
      // Track form submissions
      document.addEventListener('submit', (e) => {
        this.track('form_submit', {
          form_id: e.target.id,
          form_action: e.target.action
        });
      });
      
      // Track scroll depth
      let maxScroll = 0;
      window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
            this.track('scroll_depth', { percent: maxScroll });
          }
        }
      });
      
      // Track time on page
      let timeOnPage = 0;
      setInterval(() => {
        timeOnPage += 10;
        if (timeOnPage % 30 === 0) { // Track every 30 seconds
          this.track('time_on_page', { seconds: timeOnPage });
        }
      }, 10000);
    },
    
    // Check for popup triggers
    checkTriggers: function(eventType, eventData) {
      // This will be enhanced with server-side trigger rules
      // For now, basic client-side triggers
      if (eventType === 'scroll_depth' && eventData.percent >= 50) {
        this.triggerPopup('scroll_trigger');
      }
      
      if (eventType === 'time_on_page' && eventData.seconds >= 60) {
        this.triggerPopup('time_trigger');
      }
    },
    
    // Trigger popup display
    triggerPopup: function(triggerType) {
      this.track('popup_triggered', { trigger_type: triggerType });
      // Load and display popup based on trigger rules
      // This will be enhanced with template loading
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PopupTracker.init());
  } else {
    PopupTracker.init();
  }
})();
</script>`;
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

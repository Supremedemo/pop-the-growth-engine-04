
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface CampaignAnalytic {
  id: string;
  campaign_id: string;
  website_id: string;
  deployment_id: string | null;
  event_type: 'impression' | 'click' | 'conversion' | 'close' | 'form_submit';
  user_session: string | null;
  user_agent: string | null;
  ip_address: string | null;
  referrer: string | null;
  page_url: string;
  metadata: any;
  revenue_value: number;
  timestamp: string;
  created_at: string;
}

export interface AnalyticsSummary {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  conversionRate: number;
  clickThroughRate: number;
  campaignStats: Record<string, {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }>;
}

export const useCampaignAnalytics = (campaignId?: string, websiteId?: string, dateRange?: { from: Date; to: Date }) => {
  const { user } = useAuth();

  const {
    data: analytics = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['campaign-analytics', campaignId, websiteId, dateRange],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('campaign_analytics')
        .select(`
          *,
          campaigns!inner(user_id, name),
          websites(name, domain)
        `);
      
      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }
      
      if (websiteId) {
        query = query.eq('website_id', websiteId);
      }
      
      if (dateRange) {
        query = query
          .gte('timestamp', dateRange.from.toISOString())
          .lte('timestamp', dateRange.to.toISOString());
      }

      const { data, error } = await query.order('timestamp', { ascending: false });

      if (error) throw error;
      return data as CampaignAnalytic[];
    },
    enabled: !!user
  });

  const {
    data: summary,
    isLoading: isSummaryLoading
  } = useQuery({
    queryKey: ['analytics-summary', campaignId, websiteId, dateRange],
    queryFn: async (): Promise<AnalyticsSummary> => {
      if (!user || !analytics.length) {
        return {
          totalImpressions: 0,
          totalClicks: 0,
          totalConversions: 0,
          totalRevenue: 0,
          conversionRate: 0,
          clickThroughRate: 0,
          campaignStats: {}
        };
      }

      const impressions = analytics.filter(a => a.event_type === 'impression');
      const clicks = analytics.filter(a => a.event_type === 'click');
      const conversions = analytics.filter(a => a.event_type === 'conversion');
      
      const totalImpressions = impressions.length;
      const totalClicks = clicks.length;
      const totalConversions = conversions.length;
      const totalRevenue = analytics.reduce((sum, a) => sum + (a.revenue_value || 0), 0);
      
      const conversionRate = totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0;
      const clickThroughRate = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      // Group by campaign
      const campaignStats: Record<string, any> = {};
      analytics.forEach(analytic => {
        const campaignId = analytic.campaign_id;
        if (!campaignStats[campaignId]) {
          campaignStats[campaignId] = {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0
          };
        }
        
        if (analytic.event_type === 'impression') campaignStats[campaignId].impressions++;
        if (analytic.event_type === 'click') campaignStats[campaignId].clicks++;
        if (analytic.event_type === 'conversion') campaignStats[campaignId].conversions++;
        campaignStats[campaignId].revenue += analytic.revenue_value || 0;
      });

      return {
        totalImpressions,
        totalClicks,
        totalConversions,
        totalRevenue,
        conversionRate,
        clickThroughRate,
        campaignStats
      };
    },
    enabled: !!user && !!analytics.length
  });

  return {
    analytics,
    summary: summary || {
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0,
      conversionRate: 0,
      clickThroughRate: 0,
      campaignStats: {}
    },
    isLoading,
    isSummaryLoading,
    error
  };
};

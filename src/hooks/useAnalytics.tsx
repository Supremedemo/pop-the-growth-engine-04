
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Campaign } from './useCampaigns';

export interface DashboardStats {
  totalImpressions: number;
  totalConversions: number;
  totalRevenue: number;
  conversionRate: number;
  totalCampaigns: number;
  activeCampaigns: number;
}

export interface PerformanceData {
  date: string;
  impressions: number;
  conversions: number;
  revenue: number;
}

export const useAnalytics = () => {
  const { user } = useAuth();

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as Campaign[];
    },
    enabled: !!user,
  });

  const { data: analyticsEvents = [] } = useQuery({
    queryKey: ['analytics-events', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('analytics_events')
        .select(`
          *,
          campaigns!inner(user_id)
        `)
        .eq('campaigns.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getDashboardStats = (): DashboardStats => {
    const totalImpressions = campaigns.reduce((sum, campaign) => sum + (campaign.impressions || 0), 0);
    const totalConversions = campaigns.reduce((sum, campaign) => sum + (campaign.conversions || 0), 0);
    const totalRevenue = campaigns.reduce((sum, campaign) => sum + (Number(campaign.revenue) || 0), 0);
    const conversionRate = totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0;
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;

    return {
      totalImpressions,
      totalConversions,
      totalRevenue,
      conversionRate,
      totalCampaigns,
      activeCampaigns,
    };
  };

  const getPerformanceData = (): PerformanceData[] => {
    // Group events by date for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayEvents = analyticsEvents.filter(event => 
        event.created_at.split('T')[0] === date
      );

      const impressions = dayEvents.filter(e => e.event_type === 'impression').length;
      const conversions = dayEvents.filter(e => e.event_type === 'conversion').length;
      const revenue = dayEvents
        .filter(e => e.event_type === 'revenue')
        .reduce((sum, e) => sum + (Number(e.value) || 0), 0);

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        impressions,
        conversions,
        revenue,
      };
    });
  };

  return {
    campaigns,
    analyticsEvents,
    dashboardStats: getDashboardStats(),
    performanceData: getPerformanceData(),
  };
};

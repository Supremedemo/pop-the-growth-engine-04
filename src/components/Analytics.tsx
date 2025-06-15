
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MousePointer, 
  DollarSign, 
  Eye,
  Calendar,
  Download,
  Filter
} from "lucide-react";
import { useCampaignAnalytics } from "@/hooks/useCampaignAnalytics";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useUserTracking } from "@/hooks/useUserTracking";

export const Analytics = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });

  const { campaigns } = useCampaigns();
  const { analytics, summary, isLoading } = useCampaignAnalytics(
    selectedCampaign !== "all" ? selectedCampaign : undefined,
    undefined,
    dateRange
  );
  const { getEventAnalytics } = useUserTracking();

  // Process analytics data for charts
  const processTimeSeriesData = () => {
    const dailyData: Record<string, any> = {};
    
    analytics.forEach(analytic => {
      const date = new Date(analytic.timestamp).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      }
      
      if (analytic.event_type === 'impression') dailyData[date].impressions++;
      if (analytic.event_type === 'click') dailyData[date].clicks++;
      if (analytic.event_type === 'conversion') dailyData[date].conversions++;
      dailyData[date].revenue += analytic.revenue_value || 0;
    });

    return Object.values(dailyData).slice(-7); // Last 7 days
  };

  const processHourlyData = () => {
    const hourlyData: Record<number, number> = {};
    
    analytics.forEach(analytic => {
      if (analytic.event_type === 'conversion') {
        const hour = new Date(analytic.timestamp).getHours();
        hourlyData[hour] = (hourlyData[hour] || 0) + 1;
      }
    });

    const hours = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];
    return hours.map((hour, index) => ({
      hour,
      rate: ((hourlyData[6 + index * 3] || 0) / (analytics.filter(a => a.event_type === 'impression').length || 1)) * 100
    }));
  };

  const processCampaignData = () => {
    return campaigns.map(campaign => {
      const campaignStats = summary.campaignStats[campaign.id] || {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0
      };
      
      const conversionRate = campaignStats.impressions > 0 
        ? (campaignStats.conversions / campaignStats.impressions) * 100 
        : 0;

      return {
        name: campaign.name,
        conversions: campaignStats.conversions,
        revenue: campaignStats.revenue,
        rate: conversionRate
      };
    }).filter(c => c.conversions > 0 || c.revenue > 0);
  };

  const deviceData = [
    { name: "Desktop", value: 45.2, color: "#3b82f6" },
    { name: "Mobile", value: 41.8, color: "#10b981" },
    { name: "Tablet", value: 13.0, color: "#f59e0b" },
  ];

  const timeSeriesData = processTimeSeriesData();
  const hourlyPerformanceData = processHourlyData();
  const campaignPerformanceData = processCampaignData();

  const stats = [
    {
      title: "Total Revenue",
      value: `$${summary.totalRevenue.toFixed(2)}`,
      change: "+15.7%", // TODO: Calculate actual change
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Conversion Rate",
      value: `${summary.conversionRate.toFixed(2)}%`,
      change: "+0.4%", // TODO: Calculate actual change
      trend: "up",
      icon: MousePointer,
      color: "text-blue-600"
    },
    {
      title: "Total Impressions",
      value: summary.totalImpressions.toLocaleString(),
      change: "+12.5%", // TODO: Calculate actual change
      trend: "up",
      icon: Eye,
      color: "text-purple-600"
    },
    {
      title: "Click-Through Rate",
      value: `${summary.clickThroughRate.toFixed(2)}%`,
      change: "-2.1%", // TODO: Calculate actual change
      trend: "down",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your popup performance and revenue attribution</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaigns.map(campaign => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-background">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" className="bg-background">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="bg-background">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card key={index} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <Badge 
                    variant="secondary" 
                    className={`${
                      stat.trend === "up" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    } text-xs flex items-center`}
                  >
                    <TrendIcon className="w-3 h-3 mr-1" />
                    {stat.change}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-card">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Track impressions, conversions, and revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {timeSeriesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="impressions" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Impressions"
                      />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="conversions" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Conversions"
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        name="Revenue ($)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No data available for the selected period</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Device Breakdown and Hourly Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Traffic distribution by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  {deviceData.map((device, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: device.color }}
                      ></div>
                      <span className="text-sm">{device.name}: {device.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Top Performing Hours</CardTitle>
                <CardDescription>Conversion rates by hour of day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
                      <Bar dataKey="rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Detailed metrics for each campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPerformanceData.length > 0 ? (
                  campaignPerformanceData.map((campaign, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-8 bg-blue-500 rounded"></div>
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <p className="text-sm text-muted-foreground">Active Campaign</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-8 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{campaign.conversions.toLocaleString()}</div>
                          <div className="text-muted-foreground">Conversions</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{campaign.rate.toFixed(2)}%</div>
                          <div className="text-muted-foreground">CVR</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">${campaign.revenue.toFixed(2)}</div>
                          <div className="text-muted-foreground">Revenue</div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No campaign data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
              <CardDescription>Understand your visitors and their behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Audience Analytics</h3>
                <p className="text-muted-foreground">Detailed audience insights coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Revenue Attribution</CardTitle>
              <CardDescription>Track revenue generated by your popups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Revenue Tracking</h3>
                <p className="text-muted-foreground">Advanced revenue attribution features coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

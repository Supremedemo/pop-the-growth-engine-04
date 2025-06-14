
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export const Analytics = () => {
  const performanceData = [
    { date: "Jan 1", impressions: 4200, conversions: 120, revenue: 2400 },
    { date: "Jan 2", impressions: 3800, conversions: 98, revenue: 1890 },
    { date: "Jan 3", impressions: 5100, conversions: 145, revenue: 3200 },
    { date: "Jan 4", impressions: 4650, conversions: 132, revenue: 2950 },
    { date: "Jan 5", impressions: 5890, conversions: 168, revenue: 4100 },
    { date: "Jan 6", impressions: 6200, conversions: 175, revenue: 4500 },
    { date: "Jan 7", impressions: 5700, conversions: 156, revenue: 3800 },
  ];

  const campaignData = [
    { name: "Welcome Discount", conversions: 1247, revenue: 8950, rate: 2.73 },
    { name: "Cart Abandonment", conversions: 892, revenue: 6840, rate: 3.80 },
    { name: "Exit Intent", conversions: 456, revenue: 3420, rate: 2.43 },
    { name: "Newsletter", conversions: 1234, revenue: 0, rate: 2.17 },
  ];

  const deviceData = [
    { name: "Desktop", value: 45.2, color: "#3b82f6" },
    { name: "Mobile", value: 41.8, color: "#10b981" },
    { name: "Tablet", value: 13.0, color: "#f59e0b" },
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "$23,156",
      change: "+15.7%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Conversion Rate",
      value: "3.02%",
      change: "+0.4%",
      trend: "up",
      icon: MousePointer,
      color: "text-blue-600"
    },
    {
      title: "Total Impressions",
      value: "127,432",
      change: "+12.5%",
      trend: "up",
      icon: Eye,
      color: "text-purple-600"
    },
    {
      title: "Avg. Session Value",
      value: "$6.02",
      change: "-2.1%",
      trend: "down",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your popup performance and revenue attribution</p>
        </div>
        <div className="flex items-center space-x-3">
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
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
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
              </div>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
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
                    <BarChart data={[
                      { hour: "6AM", rate: 1.2 },
                      { hour: "9AM", rate: 2.8 },
                      { hour: "12PM", rate: 3.4 },
                      { hour: "3PM", rate: 4.1 },
                      { hour: "6PM", rate: 3.8 },
                      { hour: "9PM", rate: 2.5 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
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
                {campaignData.map((campaign, index) => (
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
                        <div className="font-medium">{campaign.rate}%</div>
                        <div className="text-muted-foreground">CVR</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">${campaign.revenue.toLocaleString()}</div>
                        <div className="text-muted-foreground">Revenue</div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
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

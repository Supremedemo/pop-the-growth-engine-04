import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Key, 
  User, 
  Mail, 
  Shield, 
  Zap,
  Database,
  Globe,
  Eye,
  EyeOff,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = (email: string) => {
    // Simulate password reset
    toast({
      title: "Password Reset",
      description: `Password reset email sent to ${email}`,
    });
  };

  const handleApiKeyGenerate = () => {
    // Simulate API key generation
    toast({
      title: "API Key Generated",
      description: "New API key has been generated successfully",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-slate-600">Manage users, settings, and integrations</p>
        </div>
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <Shield className="w-4 h-4 mr-1" />
          Admin Access
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Subscriptions</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-2">
            <Key className="w-4 h-4" />
            <span>API</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement onPasswordReset={handlePasswordReset} />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionManagement />
        </TabsContent>

        <TabsContent value="api">
          <ApiManagement 
            onGenerateKey={handleApiKeyGenerate}
            showApiKey={showApiKey}
            onToggleApiKey={() => setShowApiKey(!showApiKey)}
          />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsManagement />
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const UserManagement = ({ onPasswordReset }: { onPasswordReset: (email: string) => void }) => {
  const [resetEmail, setResetEmail] = useState("");
  
  const users = [
    { id: 1, email: "user1@example.com", role: "Admin", status: "Active", lastLogin: "2 hours ago" },
    { id: 2, email: "user2@example.com", role: "Editor", status: "Active", lastLogin: "1 day ago" },
    { id: 3, email: "user3@example.com", role: "Viewer", status: "Inactive", lastLogin: "1 week ago" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password Reset</CardTitle>
          <CardDescription>Send password reset emails to users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="reset-email">User Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="user@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => {
                if (resetEmail) {
                  onPasswordReset(resetEmail);
                  setResetEmail("");
                }
              }}
              className="mt-6"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{user.email}</div>
                  <div className="text-sm text-slate-600">
                    {user.role} • Last login: {user.lastLogin}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                    {user.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SubscriptionManagement = () => {
  const subscriptions = [
    { 
      id: 1, 
      email: "user1@example.com", 
      plan: "Pro", 
      status: "Active", 
      nextBilling: "2024-07-15",
      amount: "$29/month",
      features: ["Unlimited Popups", "Advanced Analytics", "Priority Support"]
    },
    { 
      id: 2, 
      email: "user2@example.com", 
      plan: "Starter", 
      status: "Active", 
      nextBilling: "2024-07-20",
      amount: "$9/month",
      features: ["5 Popups", "Basic Analytics", "Email Support"]
    },
    { 
      id: 3, 
      email: "user3@example.com", 
      plan: "Enterprise", 
      status: "Cancelled", 
      nextBilling: "2024-06-30",
      amount: "$99/month",
      features: ["Unlimited Everything", "Custom Branding", "Dedicated Support"]
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Overview</CardTitle>
          <CardDescription>Monitor subscription metrics and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">142</div>
              <div className="text-sm text-slate-600">Active Subscriptions</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">$4,280</div>
              <div className="text-sm text-slate-600">Monthly Revenue</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">94.2%</div>
              <div className="text-sm text-slate-600">Retention Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-slate-600">Churn This Month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>Manage individual subscriptions and billing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(subscription.status)}
                    <div>
                      <div className="font-medium">{subscription.email}</div>
                      <div className="text-sm text-slate-600">
                        {subscription.plan} Plan • {subscription.amount}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={subscription.status === "Active" ? "default" : subscription.status === "Cancelled" ? "destructive" : "secondary"}>
                      {subscription.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-slate-600 mb-2">
                  Next billing: {subscription.nextBilling}
                </div>
                <div className="flex flex-wrap gap-1">
                  {subscription.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ApiManagement = ({ 
  onGenerateKey, 
  showApiKey, 
  onToggleApiKey 
}: { 
  onGenerateKey: () => void;
  showApiKey: boolean;
  onToggleApiKey: () => void;
}) => {
  const apiKey = "pk_live_abcd1234567890efghijklmnopqrstuvwxyz";
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage API keys for external integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Public API Key</Label>
            <div className="flex space-x-2">
              <Input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                readOnly
                className="font-mono"
              />
              <Button variant="outline" size="sm" onClick={onToggleApiKey}>
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <Button onClick={onGenerateKey}>
            <Key className="w-4 h-4 mr-2" />
            Generate New Key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>Monitor API usage and rate limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-sm text-slate-600">Requests Today</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">98.5%</div>
              <div className="text-sm text-slate-600">Success Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">2ms</div>
              <div className="text-sm text-slate-600">Avg Response</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const IntegrationsManagement = () => {
  const integrations = [
    { name: "Stripe", status: "Connected", icon: "💳", description: "Payment processing" },
    { name: "Mailchimp", status: "Connected", icon: "📧", description: "Email marketing" },
    { name: "Google Analytics", status: "Disconnected", icon: "📊", description: "Website analytics" },
    { name: "Zapier", status: "Connected", icon: "⚡", description: "Workflow automation" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>Connect and manage third-party services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <div className="font-medium">{integration.name}</div>
                    <div className="text-sm text-slate-600">{integration.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={integration.status === "Connected" ? "default" : "secondary"}>
                    {integration.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {integration.status === "Connected" ? "Configure" : "Connect"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Global system settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Popup Template</Label>
            <select className="w-full p-2 border rounded-md">
              <option>Default Template</option>
              <option>Newsletter Signup</option>
              <option>Exit Intent</option>
              <option>Discount Offer</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label>Session Timeout (minutes)</Label>
            <Input type="number" defaultValue="30" />
          </div>
          
          <div className="space-y-2">
            <Label>Maximum File Upload Size (MB)</Label>
            <Input type="number" defaultValue="10" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Settings</CardTitle>
          <CardDescription>Database configuration and maintenance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Backup Database
            </Button>
            <Button variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Optimize Tables
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

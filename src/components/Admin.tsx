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
  Clock,
  Crown,
  Star,
  Sparkles
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
            <span>My Plan</span>
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
          <UserPlanDetails />
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

const UserPlanDetails = () => {
  const currentPlan = {
    name: "Pro Plan",
    price: "$29",
    billing: "monthly",
    status: "Active",
    nextBilling: "2024-07-15",
    features: [
      "Unlimited Popups",
      "Advanced Analytics",
      "A/B Testing",
      "Custom Templates",
      "Priority Support",
      "White Label Options"
    ],
    usage: {
      popups: { current: 47, limit: "Unlimited" },
      impressions: { current: 127432, limit: "Unlimited" },
      conversions: { current: 3847, limit: "Unlimited" }
    }
  };

  const availablePlans = [
    {
      name: "Starter",
      price: "$9",
      billing: "monthly",
      icon: Star,
      features: ["5 Popups", "Basic Analytics", "Email Support", "Standard Templates"],
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      billing: "monthly",
      icon: Crown,
      features: ["Unlimited Popups", "Advanced Analytics", "A/B Testing", "Custom Templates", "Priority Support", "White Label Options"],
      popular: true,
      current: true
    },
    {
      name: "Enterprise",
      price: "$99",
      billing: "monthly",
      icon: Sparkles,
      features: ["Everything in Pro", "Custom Integrations", "Dedicated Account Manager", "SLA Guarantee", "Advanced Security"],
      popular: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle className="text-blue-900">Your Current Plan</CardTitle>
                <CardDescription className="text-blue-700">Pop The Builder {currentPlan.name}</CardDescription>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-1" />
              {currentPlan.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Plan Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Price:</span>
                  <span className="font-medium">{currentPlan.price}/{currentPlan.billing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Next billing:</span>
                  <span className="font-medium">{currentPlan.nextBilling}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className="font-medium text-green-600">{currentPlan.status}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Usage This Month</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Popups Created:</span>
                  <span className="font-medium">{currentPlan.usage.popups.current} / {currentPlan.usage.popups.limit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Impressions:</span>
                  <span className="font-medium">{currentPlan.usage.impressions.current.toLocaleString()} / {currentPlan.usage.impressions.limit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Conversions:</span>
                  <span className="font-medium">{currentPlan.usage.conversions.current.toLocaleString()} / {currentPlan.usage.conversions.limit}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Plan Features</h4>
            <div className="flex flex-wrap gap-2">
              {currentPlan.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex space-x-3 mt-6">
            <Button variant="outline">
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Billing
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              View Usage History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose the perfect plan for your popup needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availablePlans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative p-4 border rounded-lg ${
                  plan.current 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : plan.popular 
                      ? 'border-purple-200 bg-purple-50/30' 
                      : 'border-gray-200'
                }`}
              >
                {plan.popular && !plan.current && (
                  <Badge className="absolute -top-2 left-4 bg-purple-600">
                    Most Popular
                  </Badge>
                )}
                {plan.current && (
                  <Badge className="absolute -top-2 left-4 bg-blue-600">
                    Current Plan
                  </Badge>
                )}
                <div className="flex items-center space-x-3 mb-3">
                  <plan.icon className={`w-6 h-6 ${
                    plan.current ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <div>
                    <h3 className={`font-semibold ${
                      plan.current ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {plan.name}
                    </h3>
                    <p className="text-2xl font-bold">
                      {plan.price}<span className="text-sm font-normal text-gray-600">/{plan.billing}</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full" 
                  variant={plan.current ? "secondary" : "default"}
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Upgrade"}
                </Button>
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

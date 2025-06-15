import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormSubmissionRulesManager } from "../FormSubmissionRulesManager";
import { AdvancedTriggerBuilder } from "../AdvancedTriggerBuilder";
import { useWebhooks, Webhook } from "@/hooks/useWebhooks";
import { 
  Settings, 
  Webhook as WebhookIcon, 
  Filter, 
  Plus, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trash2,
  Edit,
  Zap,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface RulesPanelProps {
  campaignId?: string;
  templateId?: string;
  websiteId?: string;
  onTriggerRulesChange?: (rules: any) => void;
  initialTriggerRules?: any;
}

export const RulesPanel = ({ 
  campaignId, 
  templateId, 
  websiteId,
  onTriggerRulesChange,
  initialTriggerRules 
}: RulesPanelProps) => {
  const { webhooks, createWebhook, updateWebhook, deleteWebhook, testWebhook, isCreating, isUpdating, isDeleting, isTesting } = useWebhooks();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [isTestingBeforeCreate, setIsTestingBeforeCreate] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("POST");
  const [headers, setHeaders] = useState("");
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'basic' | 'api_key'>('none');
  const [authConfig, setAuthConfig] = useState("");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName("");
    setUrl("");
    setMethod("POST");
    setHeaders("");
    setAuthType('none');
    setAuthConfig("");
    setIsActive(true);
    setTestResult(null);
  };

  const loadWebhookForEdit = (webhook: Webhook) => {
    setName(webhook.name);
    setUrl(webhook.url);
    setMethod(webhook.method);
    setHeaders(JSON.stringify(webhook.headers, null, 2));
    setAuthType(webhook.auth_type);
    setAuthConfig(JSON.stringify(webhook.auth_config, null, 2));
    setIsActive(webhook.is_active);
    setEditingWebhook(webhook);
    setIsEditDialogOpen(true);
  };

  const testWebhookBeforeCreate = async () => {
    if (!url.trim()) {
      toast.error('Please enter webhook URL before testing');
      return;
    }

    setIsTestingBeforeCreate(true);
    setTestResult(null);

    try {
      const parsedHeaders = headers.trim() ? JSON.parse(headers) : {};
      const parsedAuthConfig = authConfig.trim() ? JSON.parse(authConfig) : {};

      // Prepare test payload
      const testPayload = {
        test: true,
        timestamp: new Date().toISOString(),
        message: "This is a test webhook delivery",
        form_data: {
          email: "test@example.com",
          name: "Test User",
          message: "Test message"
        }
      };

      // Prepare headers
      const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...parsedHeaders
      };

      // Add authentication if configured
      if (authType === 'bearer' && parsedAuthConfig.token) {
        requestHeaders['Authorization'] = `Bearer ${parsedAuthConfig.token}`;
      } else if (authType === 'basic' && parsedAuthConfig.username && parsedAuthConfig.password) {
        const credentials = btoa(`${parsedAuthConfig.username}:${parsedAuthConfig.password}`);
        requestHeaders['Authorization'] = `Basic ${credentials}`;
      } else if (authType === 'api_key' && parsedAuthConfig.key && parsedAuthConfig.header) {
        requestHeaders[parsedAuthConfig.header] = parsedAuthConfig.key;
      }

      // Test the webhook
      const response = await fetch(url.trim(), {
        method,
        headers: requestHeaders,
        body: JSON.stringify(testPayload),
      });

      const success = response.ok;
      const message = success 
        ? `Webhook test successful! (${response.status})`
        : `Webhook test failed with status ${response.status}`;

      setTestResult({ success, message });

      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      const message = `Webhook test failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setTestResult({ success: false, message });
      toast.error(message);
    } finally {
      setIsTestingBeforeCreate(false);
    }
  };

  const handleCreateWebhook = () => {
    if (!name.trim() || !url.trim()) {
      toast.error('Please enter webhook name and URL');
      return;
    }

    if (!testResult || !testResult.success) {
      toast.error('Please test the webhook successfully before creating it');
      return;
    }

    try {
      const parsedHeaders = headers.trim() ? JSON.parse(headers) : {};
      const parsedAuthConfig = authConfig.trim() ? JSON.parse(authConfig) : {};

      createWebhook({
        name: name.trim(),
        url: url.trim(),
        method,
        headers: parsedHeaders,
        auth_type: authType,
        auth_config: parsedAuthConfig,
        is_active: isActive
      });

      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error('Invalid JSON in headers or auth config');
    }
  };

  const handleUpdateWebhook = () => {
    if (!editingWebhook || !name.trim() || !url.trim()) {
      toast.error('Please enter webhook name and URL');
      return;
    }

    try {
      const parsedHeaders = headers.trim() ? JSON.parse(headers) : {};
      const parsedAuthConfig = authConfig.trim() ? JSON.parse(authConfig) : {};

      updateWebhook({
        id: editingWebhook.id,
        updates: {
          name: name.trim(),
          url: url.trim(),
          method,
          headers: parsedHeaders,
          auth_type: authType,
          auth_config: parsedAuthConfig,
          is_active: isActive
        }
      });

      resetForm();
      setIsEditDialogOpen(false);
      setEditingWebhook(null);
    } catch (error) {
      toast.error('Invalid JSON in headers or auth config');
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const WebhookForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-sm font-medium">Webhook Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Webhook"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="url" className="text-sm font-medium">URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setTestResult(null); // Reset test result when URL changes
          }}
          placeholder="https://api.example.com/webhook"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="method" className="text-sm font-medium">HTTP Method</Label>
        <Select value={method} onValueChange={(value) => {
          setMethod(value);
          setTestResult(null); // Reset test result when method changes
        }}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="headers" className="text-sm font-medium">Headers (JSON)</Label>
        <Textarea
          id="headers"
          value={headers}
          onChange={(e) => {
            setHeaders(e.target.value);
            setTestResult(null); // Reset test result when headers change
          }}
          placeholder='{"Content-Type": "application/json"}'
          rows={3}
          className="mt-1 text-sm font-mono"
        />
      </div>

      <div>
        <Label htmlFor="authType" className="text-sm font-medium">Authentication</Label>
        <Select value={authType} onValueChange={(value: any) => {
          setAuthType(value);
          setTestResult(null); // Reset test result when auth changes
        }}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="bearer">Bearer Token</SelectItem>
            <SelectItem value="basic">Basic Auth</SelectItem>
            <SelectItem value="api_key">API Key</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {authType !== 'none' && (
        <div>
          <Label htmlFor="authConfig" className="text-sm font-medium">Auth Config (JSON)</Label>
          <Textarea
            id="authConfig"
            value={authConfig}
            onChange={(e) => {
              setAuthConfig(e.target.value);
              setTestResult(null); // Reset test result when auth config changes
            }}
            placeholder={authType === 'bearer' ? '{"token": "your-token"}' : 
                        authType === 'basic' ? '{"username": "user", "password": "pass"}' :
                        '{"key": "your-api-key", "header": "X-API-Key"}'}
            rows={3}
            className="mt-1 text-sm font-mono"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="isActive" className="text-sm">Active</Label>
      </div>

      {!isEdit && (
        <>
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Test Webhook</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={testWebhookBeforeCreate}
                disabled={isTestingBeforeCreate || !url.trim()}
                className="flex items-center gap-1"
              >
                <TestTube className="w-3 h-3" />
                {isTestingBeforeCreate ? 'Testing...' : 'Test'}
              </Button>
            </div>
            
            {testResult && (
              <div className={`flex items-center gap-2 p-2 rounded text-xs ${
                testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {testResult.success ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
            
            {!testResult && (
              <p className="text-xs text-slate-500">
                Test the webhook before creating it.
              </p>
            )}
          </div>
        </>
      )}

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false);
              setEditingWebhook(null);
            } else {
              setIsCreateDialogOpen(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={isEdit ? handleUpdateWebhook : handleCreateWebhook}
          disabled={isEdit ? isUpdating : (isCreating || (!testResult || !testResult.success))}
        >
          {isEdit 
            ? (isUpdating ? 'Updating...' : 'Update')
            : (isCreating ? 'Creating...' : 'Create')
          }
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Automation Rules
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure campaign triggers and automation
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="triggers" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="triggers" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Triggers
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Rules
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-1">
              <WebhookIcon className="w-3 h-3" />
              Webhooks
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="triggers" className="p-4 m-0">
              {websiteId && onTriggerRulesChange ? (
                <AdvancedTriggerBuilder
                  websiteId={websiteId}
                  onTriggerRulesChange={onTriggerRulesChange}
                  initialRules={initialTriggerRules}
                />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Zap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">
                      Select a website to configure advanced triggers
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="rules" className="p-4 m-0">
              <FormSubmissionRulesManager campaignId={campaignId} templateId={templateId} />
            </TabsContent>
            
            <TabsContent value="webhooks" className="p-4 m-0 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Webhooks</h3>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Webhook</DialogTitle>
                      <DialogDescription>
                        Add endpoint to receive form data. The webhook will be tested before creation.
                      </DialogDescription>
                    </DialogHeader>
                    <WebhookForm />
                  </DialogContent>
                </Dialog>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Webhook</DialogTitle>
                      <DialogDescription>
                        Update webhook configuration
                      </DialogDescription>
                    </DialogHeader>
                    <WebhookForm isEdit />
                  </DialogContent>
                </Dialog>
              </div>

              {webhooks.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <WebhookIcon className="w-12 h-12 text-slate-400 mb-3" />
                    <p className="text-sm text-slate-500 text-center mb-4">
                      No webhooks configured
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Webhook
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {webhooks.map((webhook) => (
                    <Card key={webhook.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{webhook.name}</h4>
                            <p className="text-xs text-slate-500 truncate mt-1">
                              {webhook.method} {webhook.url}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-2">
                            {webhook.is_active ? (
                              <Badge variant="default" className="text-xs">Active</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Inactive</Badge>
                            )}
                            {getStatusIcon(webhook.last_test_status)}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testWebhook(webhook.id)}
                            disabled={isTesting}
                            className="flex-1"
                          >
                            <TestTube className="w-3 h-3 mr-1" />
                            Test
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadWebhookForEdit(webhook)}
                            className="flex-1"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteWebhook(webhook.id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};


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
  Edit
} from "lucide-react";
import { toast } from "sonner";

interface RulesPanelProps {
  campaignId?: string;
  templateId?: string;
}

export const RulesPanel = ({ campaignId, templateId }: RulesPanelProps) => {
  const { webhooks, createWebhook, updateWebhook, deleteWebhook, testWebhook, isCreating, isUpdating, isDeleting, isTesting } = useWebhooks();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  
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

  const handleCreateWebhook = () => {
    if (!name.trim() || !url.trim()) {
      toast.error('Please enter webhook name and URL');
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
    <div className="space-y-3">
      <div>
        <Label htmlFor="name" className="text-xs">Webhook Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Webhook"
          className="h-8 text-xs"
        />
      </div>

      <div>
        <Label htmlFor="url" className="text-xs">URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/webhook"
          className="h-8 text-xs"
        />
      </div>

      <div>
        <Label htmlFor="method" className="text-xs">HTTP Method</Label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="h-8 text-xs">
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
        <Label htmlFor="headers" className="text-xs">Headers (JSON)</Label>
        <Textarea
          id="headers"
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder='{"Content-Type": "application/json"}'
          rows={2}
          className="text-xs"
        />
      </div>

      <div>
        <Label htmlFor="authType" className="text-xs">Authentication</Label>
        <Select value={authType} onValueChange={(value: any) => setAuthType(value)}>
          <SelectTrigger className="h-8 text-xs">
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
          <Label htmlFor="authConfig" className="text-xs">Auth Config (JSON)</Label>
          <Textarea
            id="authConfig"
            value={authConfig}
            onChange={(e) => setAuthConfig(e.target.value)}
            placeholder={authType === 'bearer' ? '{"token": "your-token"}' : 
                        authType === 'basic' ? '{"username": "user", "password": "pass"}' :
                        '{"key": "your-api-key", "header": "X-API-Key"}'}
            rows={2}
            className="text-xs"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="isActive" className="text-xs">Active</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          variant="outline" 
          size="sm"
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
          size="sm"
          onClick={isEdit ? handleUpdateWebhook : handleCreateWebhook}
          disabled={isEdit ? isUpdating : isCreating}
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
    <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Automation Rules
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure form submission processing
        </p>
      </div>

      <div className="p-4">
        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rules" className="flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Rules
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-1">
              <WebhookIcon className="w-3 h-3" />
              Webhooks
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rules" className="mt-4">
            <FormSubmissionRulesManager campaignId={campaignId} templateId={templateId} />
          </TabsContent>
          
          <TabsContent value="webhooks" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Webhooks</h3>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-7 px-2">
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Webhook</DialogTitle>
                    <DialogDescription>
                      Add endpoint to receive form data
                    </DialogDescription>
                  </DialogHeader>
                  <WebhookForm />
                </DialogContent>
              </Dialog>

              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
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
                  <WebhookIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500 text-center mb-3">
                    No webhooks configured
                  </p>
                  <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add First Webhook
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {webhooks.map((webhook) => (
                  <Card key={webhook.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-medium truncate">{webhook.name}</h4>
                        <div className="flex items-center space-x-1">
                          {webhook.is_active ? (
                            <Badge variant="default" className="h-4 text-xs">Active</Badge>
                          ) : (
                            <Badge variant="secondary" className="h-4 text-xs">Inactive</Badge>
                          )}
                          {getStatusIcon(webhook.last_test_status)}
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-500 truncate">
                        {webhook.method} {webhook.url}
                      </p>
                      
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testWebhook(webhook.id)}
                          disabled={isTesting}
                          className="h-6 px-2 text-xs"
                        >
                          <TestTube className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => loadWebhookForEdit(webhook)}
                          className="h-6 px-2 text-xs"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteWebhook(webhook.id)}
                          disabled={isDeleting}
                          className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
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
        </Tabs>
      </div>
    </div>
  );
};

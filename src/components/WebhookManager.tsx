
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useWebhooks, Webhook } from "@/hooks/useWebhooks";
import { 
  Webhook as WebhookIcon, 
  Plus, 
  Settings, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trash2,
  Edit
} from "lucide-react";
import { toast } from "sonner";

export const WebhookManager = () => {
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
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Webhook Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Webhook"
        />
      </div>

      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/webhook"
        />
      </div>

      <div>
        <Label htmlFor="method">HTTP Method</Label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger>
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
        <Label htmlFor="headers">Headers (JSON)</Label>
        <Textarea
          id="headers"
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder='{"Content-Type": "application/json"}'
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="authType">Authentication Type</Label>
        <Select value={authType} onValueChange={(value: any) => setAuthType(value)}>
          <SelectTrigger>
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
          <Label htmlFor="authConfig">Auth Configuration (JSON)</Label>
          <Textarea
            id="authConfig"
            value={authConfig}
            onChange={(e) => setAuthConfig(e.target.value)}
            placeholder={authType === 'bearer' ? '{"token": "your-token"}' : 
                        authType === 'basic' ? '{"username": "user", "password": "pass"}' :
                        '{"key": "your-api-key", "header": "X-API-Key"}'}
            rows={3}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex justify-end space-x-2">
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
          disabled={isEdit ? isUpdating : isCreating}
        >
          {isEdit 
            ? (isUpdating ? 'Updating...' : 'Update Webhook')
            : (isCreating ? 'Creating...' : 'Create Webhook')
          }
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <WebhookIcon className="w-8 h-8" />
            Webhook Management
          </h1>
          <p className="text-slate-600 mt-2">
            Configure webhooks to send form submission data to third-party systems
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Webhook</DialogTitle>
              <DialogDescription>
                Add a new webhook endpoint to receive form submission data
              </DialogDescription>
            </DialogHeader>
            <WebhookForm />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {webhooks.map((webhook) => (
          <Card key={webhook.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{webhook.name}</span>
                <div className="flex items-center space-x-2">
                  {webhook.is_active ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                  {getStatusIcon(webhook.last_test_status)}
                </div>
              </CardTitle>
              <CardDescription className="truncate">
                {webhook.method} {webhook.url}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Authentication</p>
                  <Badge variant="outline">{webhook.auth_type}</Badge>
                </div>
                
                {webhook.last_tested_at && (
                  <div>
                    <p className="text-sm text-slate-500">Last Tested</p>
                    <p className="text-sm">
                      {new Date(webhook.last_tested_at).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testWebhook(webhook.id)}
                    disabled={isTesting}
                    className="flex items-center gap-1"
                  >
                    <TestTube className="w-3 h-3" />
                    Test
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadWebhookForEdit(webhook)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteWebhook(webhook.id)}
                    disabled={isDeleting}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {webhooks.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <WebhookIcon className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No webhooks configured</h3>
            <p className="text-slate-500 text-center mb-6">
              Create your first webhook to start receiving form submission data
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Webhook
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

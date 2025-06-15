
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
import { useFormSubmissionRules, FormSubmissionRule } from "@/hooks/useFormSubmissionRules";
import { useWebhooks } from "@/hooks/useWebhooks";
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Zap,
  Filter
} from "lucide-react";
import { toast } from "sonner";

interface FormSubmissionRulesManagerProps {
  campaignId?: string;
  templateId?: string;
}

export const FormSubmissionRulesManager = ({ campaignId, templateId }: FormSubmissionRulesManagerProps) => {
  const { rules, createRule, updateRule, deleteRule, isCreating, isUpdating, isDeleting } = useFormSubmissionRules(campaignId, templateId);
  const { webhooks } = useWebhooks();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<FormSubmissionRule | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [conditions, setConditions] = useState("");
  const [actions, setActions] = useState("");
  const [priority, setPriority] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName("");
    setConditions("");
    setActions("");
    setPriority(0);
    setIsActive(true);
  };

  const loadRuleForEdit = (rule: FormSubmissionRule) => {
    setName(rule.name);
    setConditions(JSON.stringify(rule.conditions, null, 2));
    setActions(JSON.stringify(rule.actions, null, 2));
    setPriority(rule.priority);
    setIsActive(rule.is_active);
    setEditingRule(rule);
    setIsEditDialogOpen(true);
  };

  const handleCreateRule = () => {
    if (!name.trim() || !conditions.trim() || !actions.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const parsedConditions = JSON.parse(conditions);
      const parsedActions = JSON.parse(actions);

      createRule({
        name: name.trim(),
        campaign_id: campaignId || null,
        template_id: templateId || null,
        conditions: parsedConditions,
        actions: parsedActions,
        priority,
        is_active: isActive
      });

      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error('Invalid JSON in conditions or actions');
    }
  };

  const handleUpdateRule = () => {
    if (!editingRule || !name.trim() || !conditions.trim() || !actions.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const parsedConditions = JSON.parse(conditions);
      const parsedActions = JSON.parse(actions);

      updateRule({
        id: editingRule.id,
        updates: {
          name: name.trim(),
          conditions: parsedConditions,
          actions: parsedActions,
          priority,
          is_active: isActive
        }
      });

      resetForm();
      setIsEditDialogOpen(false);
      setEditingRule(null);
    } catch (error) {
      toast.error('Invalid JSON in conditions or actions');
    }
  };

  const getExampleConditions = () => {
    return JSON.stringify({
      "field_conditions": {
        "email": {
          "operator": "contains",
          "value": "@company.com"
        },
        "step_2.company": {
          "operator": "equals",
          "value": "Enterprise Corp"
        }
      },
      "user_conditions": {
        "country": "US",
        "first_time_visitor": true
      }
    }, null, 2);
  };

  const getExampleActions = () => {
    return JSON.stringify({
      "webhooks": [
        {
          "webhook_id": "webhook-uuid-here",
          "delay_seconds": 0,
          "include_fields": ["email", "name", "company"]
        }
      ],
      "notifications": [
        {
          "type": "email",
          "to": "admin@company.com",
          "subject": "New Enterprise Lead"
        }
      ]
    }, null, 2);
  };

  const RuleForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Rule Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enterprise Lead Rule"
        />
      </div>

      <div>
        <Label htmlFor="priority">Priority (higher numbers run first)</Label>
        <Input
          id="priority"
          type="number"
          value={priority}
          onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
          placeholder="0"
        />
      </div>

      <div>
        <Label htmlFor="conditions">Conditions (JSON)</Label>
        <Textarea
          id="conditions"
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          placeholder={getExampleConditions()}
          rows={8}
        />
        <p className="text-sm text-slate-500 mt-1">
          Define when this rule should trigger based on form data and user conditions
        </p>
      </div>

      <div>
        <Label htmlFor="actions">Actions (JSON)</Label>
        <Textarea
          id="actions"
          value={actions}
          onChange={(e) => setActions(e.target.value)}
          placeholder={getExampleActions()}
          rows={8}
        />
        <p className="text-sm text-slate-500 mt-1">
          Define what actions to take when the rule triggers (webhooks, notifications, etc.)
        </p>
      </div>

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
              setEditingRule(null);
            } else {
              setIsCreateDialogOpen(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={isEdit ? handleUpdateRule : handleCreateRule}
          disabled={isEdit ? isUpdating : isCreating}
        >
          {isEdit 
            ? (isUpdating ? 'Updating...' : 'Update Rule')
            : (isCreating ? 'Creating...' : 'Create Rule')
          }
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Filter className="w-6 h-6" />
            Form Submission Rules
          </h2>
          <p className="text-slate-600 mt-1">
            Configure rules to process form submissions and trigger actions
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Rule</DialogTitle>
              <DialogDescription>
                Define conditions and actions for form submission processing
              </DialogDescription>
            </DialogHeader>
            <RuleForm />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Rule</DialogTitle>
              <DialogDescription>
                Update rule configuration
              </DialogDescription>
            </DialogHeader>
            <RuleForm isEdit />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{rule.name}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Priority: {rule.priority}</Badge>
                  {rule.is_active ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </CardTitle>
              <CardDescription>
                {Object.keys(rule.conditions).length} condition(s) • {Object.keys(rule.actions).length} action(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Conditions:</p>
                  <pre className="text-xs bg-slate-50 p-2 rounded border max-h-20 overflow-y-auto">
                    {JSON.stringify(rule.conditions, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Actions:</p>
                  <pre className="text-xs bg-slate-50 p-2 rounded border max-h-20 overflow-y-auto">
                    {JSON.stringify(rule.actions, null, 2)}
                  </pre>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadRuleForEdit(rule)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteRule(rule.id)}
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

      {rules.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No rules configured</h3>
            <p className="text-slate-500 text-center mb-6">
              Create rules to automatically process form submissions and trigger actions
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Rule
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

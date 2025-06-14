
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface SaveTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTemplateId?: string;
  templateName: string;
  setTemplateName: (name: string) => void;
  templateDescription: string;
  setTemplateDescription: (description: string) => void;
  templateTags: string[];
  setTemplateTags: (tags: string[]) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  isSaving: boolean;
  onSave: () => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export const SaveTemplateDialog = ({
  isOpen,
  onOpenChange,
  currentTemplateId,
  templateName,
  setTemplateName,
  templateDescription,
  setTemplateDescription,
  templateTags,
  setTemplateTags,
  newTag,
  setNewTag,
  isSaving,
  onSave,
  onAddTag,
  onRemoveTag
}: SaveTemplateDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentTemplateId ? 'Update Template' : 'Save Template'}
          </DialogTitle>
          <DialogDescription>
            {currentTemplateId ? 'Update your template with the current design' : 'Save your current design as a reusable template'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          <div>
            <Label htmlFor="templateDescription">Description</Label>
            <Textarea
              id="templateDescription"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Describe your template..."
              rows={3}
            />
          </div>
          <div>
            <Label>Tags</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && onAddTag()}
              />
              <Button size="sm" onClick={onAddTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {templateTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                  <button
                    onClick={() => onRemoveTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : (currentTemplateId ? 'Update' : 'Save Template')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

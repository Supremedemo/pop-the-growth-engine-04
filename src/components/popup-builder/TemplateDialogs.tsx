
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserTemplate } from "@/hooks/useTemplates";

interface TemplateDialogsProps {
  isTemplateDialogOpen: boolean;
  setIsTemplateDialogOpen: (open: boolean) => void;
  templates: UserTemplate[];
  onLoadTemplate: (template: UserTemplate) => void;
}

export const TemplateDialogs = ({
  isTemplateDialogOpen,
  setIsTemplateDialogOpen,
  templates,
  onLoadTemplate
}: TemplateDialogsProps) => {
  return (
    <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Load Template</DialogTitle>
          <DialogDescription>
            Choose a template to load into the editor
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer"
              onClick={() => onLoadTemplate(template)}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded mb-3"></div>
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{template.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Created: {new Date(template.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

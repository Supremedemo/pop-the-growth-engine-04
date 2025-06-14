
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Folder, 
  File, 
  Plus, 
  Save, 
  Edit, 
  Trash2, 
  Tag,
  X,
  FolderPlus,
  FilePlus
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  folderId?: string;
  tags: string[];
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  canvasData: any;
}

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: Date;
}

interface FileManagerProps {
  templates: Template[];
  folders: Folder[];
  onSaveTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCreateFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => void;
  onDeleteTemplate: (id: string) => void;
  onDeleteFolder: (id: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const FileManager = ({
  templates,
  folders,
  onSaveTemplate,
  onCreateFolder,
  onDeleteTemplate,
  onDeleteFolder,
  selectedTags,
  onTagsChange
}: FileManagerProps) => {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string | undefined>();
  const [folderName, setFolderName] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateTags, setTemplateTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Get all unique tags from templates
  const allTags = Array.from(new Set(templates.flatMap(t => t.tags)));

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      onCreateFolder({
        name: folderName.trim(),
        parentId: currentFolder
      });
      setFolderName("");
      setIsCreateFolderOpen(false);
    }
  };

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      onSaveTemplate({
        name: templateName.trim(),
        description: templateDescription.trim(),
        folderId: currentFolder,
        tags: templateTags,
        thumbnail: "bg-gradient-to-br from-blue-500 to-purple-600",
        canvasData: {} // This would be the actual canvas data
      });
      setTemplateName("");
      setTemplateDescription("");
      setTemplateTags([]);
      setIsSaveTemplateOpen(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !templateTags.includes(newTag.trim())) {
      setTemplateTags([...templateTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTemplateTags(templateTags.filter(tag => tag !== tagToRemove));
  };

  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const getCurrentFolderTemplates = () => {
    return templates.filter(t => t.folderId === currentFolder);
  };

  const getCurrentSubfolders = () => {
    return folders.filter(f => f.parentId === currentFolder);
  };

  const getBreadcrumb = () => {
    if (!currentFolder) return ["Root"];
    
    const breadcrumb = ["Root"];
    let folder = folders.find(f => f.id === currentFolder);
    const path = [];
    
    while (folder) {
      path.unshift(folder);
      folder = folder.parentId ? folders.find(f => f.id === folder.parentId) : undefined;
    }
    
    return [...breadcrumb, ...path.map(f => f.name)];
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">File Management</h2>
          <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
            {getBreadcrumb().map((name, index) => (
              <span key={index} className="flex items-center">
                {index > 0 && <span className="mx-1">/</span>}
                <button
                  onClick={() => {
                    if (index === 0) setCurrentFolder(undefined);
                    // Handle breadcrumb navigation
                  }}
                  className="hover:text-blue-600"
                >
                  {name}
                </button>
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>
                  Create a new folder to organize your templates
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="Enter folder name"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFolder}>Create Folder</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isSaveTemplateOpen} onOpenChange={setIsSaveTemplateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Save Template</DialogTitle>
                <DialogDescription>
                  Save your current design as a reusable template
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
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button size="sm" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {templateTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsSaveTemplateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveTemplate}>Save Template</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Filter by tags:</Label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleTagFilter(tag)}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTagsChange([])}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      )}

      {/* File browser */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Go up folder */}
        {currentFolder && (
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              const parent = folders.find(f => f.id === currentFolder)?.parentId;
              setCurrentFolder(parent);
            }}
          >
            <CardContent className="p-4 flex items-center space-x-3">
              <Folder className="w-8 h-8 text-slate-400" />
              <span className="font-medium">.. (Go up)</span>
            </CardContent>
          </Card>
        )}

        {/* Subfolders */}
        {getCurrentSubfolders().map((folder) => (
          <Card
            key={folder.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentFolder(folder.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Folder className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-medium">{folder.name}</h3>
                    <p className="text-xs text-slate-500">
                      {templates.filter(t => t.folderId === folder.id).length} templates
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder(folder.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Templates */}
        {getCurrentFolderTemplates().map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className={`w-full h-24 rounded-lg ${template.thumbnail} relative`}>
                <div className="absolute inset-2 bg-white/90 rounded shadow-sm p-1">
                  <div className="h-1 bg-slate-300 rounded mb-1"></div>
                  <div className="h-1 bg-slate-200 rounded mb-1"></div>
                  <div className="h-3 bg-blue-500 rounded"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm truncate">{template.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTemplate(template.id)}
                    className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{template.description}</p>
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 2}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {template.updatedAt.toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {getCurrentFolderTemplates().length === 0 && getCurrentSubfolders().length === 0 && (
        <div className="text-center py-12">
          <File className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No templates found</h3>
          <p className="text-slate-500 mb-4">Create your first template or organize with folders</p>
        </div>
      )}
    </div>
  );
};

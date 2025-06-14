
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, Tag, X, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CanvasState } from "./PopupBuilder";

interface SaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canvasData: CanvasState;
}

const defaultFolders = [
  "My Templates",
  "Landing Pages",
  "Email Capture",
  "Promotions",
  "Games",
  "Custom"
];

const suggestedTags = [
  "newsletter",
  "discount",
  "lead-generation",
  "announcement",
  "popup",
  "modal",
  "banner",
  "conversion",
  "marketing",
  "ecommerce"
];

export const SaveDialog = ({ open, onOpenChange, canvasData }: SaveDialogProps) => {
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("My Templates");
  const [customFolder, setCustomFolder] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const { toast } = useToast();

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddCustomTag = () => {
    if (newTag.trim()) {
      handleAddTag(newTag.trim().toLowerCase());
      setNewTag("");
    }
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      toast({
        title: "Template Name Required",
        description: "Please enter a name for your template.",
        variant: "destructive",
      });
      return;
    }

    const finalFolder = selectedFolder === "Custom" ? customFolder : selectedFolder;
    
    if (!finalFolder.trim()) {
      toast({
        title: "Folder Required",
        description: "Please select or enter a folder name.",
        variant: "destructive",
      });
      return;
    }

    const templateData = {
      id: `template_${Date.now()}`,
      name: templateName.trim(),
      description: description.trim(),
      folder: finalFolder.trim(),
      tags,
      isPrivate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: generateThumbnail(),
      ...canvasData
    };

    // Save to localStorage (in a real app, this would be an API call)
    const savedTemplates = JSON.parse(localStorage.getItem('saved_templates') || '[]');
    savedTemplates.push(templateData);
    localStorage.setItem('saved_templates', JSON.stringify(savedTemplates));

    // Update folders list
    const folders = JSON.parse(localStorage.getItem('template_folders') || JSON.stringify(defaultFolders));
    if (!folders.includes(finalFolder)) {
      folders.push(finalFolder);
      localStorage.setItem('template_folders', JSON.stringify(folders));
    }

    toast({
      title: "Template Saved",
      description: `"${templateName}" has been saved to ${finalFolder}`,
    });

    onOpenChange(false);
    
    // Reset form
    setTemplateName("");
    setDescription("");
    setSelectedFolder("My Templates");
    setCustomFolder("");
    setTags([]);
    setNewTag("");
  };

  const generateThumbnail = () => {
    // In a real app, this would generate an actual thumbnail
    // For now, return a placeholder based on layout type
    const layoutColors = {
      modal: '#3b82f6',
      banner: '#f59e0b',
      'slide-in': '#10b981',
      fullscreen: '#8b5cf6'
    };
    
    return {
      color: layoutColors[canvasData.layout.type] || '#6b7280',
      layout: canvasData.layout.type,
      elements: canvasData.elements.length
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>Save Template</span>
          </DialogTitle>
          <DialogDescription>
            Save your popup design as a reusable template with organized folders and tags.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: generateThumbnail().color }}
                >
                  {canvasData.layout.type.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{canvasData.layout.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {canvasData.elements.length} element{canvasData.elements.length !== 1 ? 's' : ''} • 
                    {canvasData.width}×{canvasData.height}px
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your template..."
                rows={3}
                className="mt-1"
              />
            </div>
          </div>

          {/* Folder Selection */}
          <div>
            <Label className="flex items-center space-x-2 mb-2">
              <Folder className="w-4 h-4" />
              <span>Folder</span>
            </Label>
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {defaultFolders.map(folder => (
                  <SelectItem key={folder} value={folder}>
                    {folder}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedFolder === "Custom" && (
              <Input
                value={customFolder}
                onChange={(e) => setCustomFolder(e.target.value)}
                placeholder="Enter custom folder name..."
                className="mt-2"
              />
            )}
          </div>

          {/* Tags */}
          <div>
            <Label className="flex items-center space-x-2 mb-2">
              <Tag className="w-4 h-4" />
              <span>Tags</span>
            </Label>
            
            {/* Current Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Suggested Tags */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Suggested tags:</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestedTags
                  .filter(tag => !tags.includes(tag))
                  .slice(0, 8)
                  .map(tag => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTag(tag)}
                      className="h-7 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {tag}
                    </Button>
                  ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add custom tag..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
              />
              <Button onClick={handleAddCustomTag} variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <p className="font-medium text-sm">Private Template</p>
              <p className="text-xs text-muted-foreground">
                Only you can see and use this template
              </p>
            </div>
            <Button
              variant={isPrivate ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPrivate(!isPrivate)}
            >
              {isPrivate ? "Private" : "Public"}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

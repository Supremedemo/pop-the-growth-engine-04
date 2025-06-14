import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Folder, 
  File, 
  Plus, 
  Save, 
  Trash2, 
  Tag,
  X,
  FolderPlus,
  Upload,
  Move,
  Image,
  Video,
  FileText
} from "lucide-react";
import { useTemplateManagement } from "@/hooks/useTemplateManagement";
import { useAssetManagement } from "@/hooks/useAssetManagement";
import { useTemplates } from "@/hooks/useTemplates";
import { toast } from "sonner";

export const FileManager = () => {
  const { saveTemplate, isSaving } = useTemplates();
  const {
    templates,
    folders,
    subfolders,
    allTags,
    selectedTags,
    setSelectedTags,
    currentFolder,
    setCurrentFolder,
    isCreatingFolder,
    createFolder,
    deleteFolder,
    getCurrentFolderPath
  } = useTemplateManagement();

  const {
    assets,
    assetFolders,
    images,
    currentAssetFolder,
    setCurrentAssetFolder,
    selectedAssets,
    setSelectedAssets,
    uploadAsset,
    deleteSelectedAssets,
    isUploading,
    isDeleting
  } = useAssetManagement();

  const [activeTab, setActiveTab] = useState<'templates' | 'assets'>('templates');
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateTags, setTemplateTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      createFolder({
        name: folderName.trim(),
        parentId: currentFolder || undefined
      });
      setFolderName("");
      setIsCreateFolderOpen(false);
    }
  };

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      saveTemplate({
        name: templateName.trim(),
        description: templateDescription.trim() || undefined,
        canvasData: {} as any, // This would be the actual canvas data
        tags: templateTags
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
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAssetUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    try {
      await Promise.all(
        Array.from(files).map(file => uploadAsset(file, currentAssetFolder))
      );
      toast.success(`${files.length} file(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    }
  };

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-8 h-8 text-blue-500" />;
    if (mimeType.startsWith('video/')) return <Video className="w-8 h-8 text-purple-500" />;
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header with tabs */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex space-x-4 mb-4">
            <Button
              variant={activeTab === 'templates' ? 'default' : 'outline'}
              onClick={() => setActiveTab('templates')}
            >
              Templates
            </Button>
            <Button
              variant={activeTab === 'assets' ? 'default' : 'outline'}
              onClick={() => setActiveTab('assets')}
            >
              Assets
            </Button>
          </div>
          
          <h2 className="text-2xl font-bold">
            {activeTab === 'templates' ? 'Template Management' : 'Asset Management'}
          </h2>
          
          <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
            {activeTab === 'templates' 
              ? getCurrentFolderPath().map((name, index) => (
                  <span key={index} className="flex items-center">
                    {index > 0 && <span className="mx-1">/</span>}
                    <button
                      onClick={() => {
                        if (index === 0) setCurrentFolder(null);
                      }}
                      className="hover:text-blue-600"
                    >
                      {name}
                    </button>
                  </span>
                ))
              : `Assets: ${currentAssetFolder}`
            }
          </div>
        </div>
        
        <div className="flex space-x-2">
          {activeTab === 'templates' ? (
            <>
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
                      <Button onClick={handleCreateFolder} disabled={isCreatingFolder}>
                        {isCreatingFolder ? 'Creating...' : 'Create Folder'}
                      </Button>
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
            </>
          ) : (
            <>
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleAssetUpload}
                className="hidden"
                id="asset-upload"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('asset-upload')?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </Button>

              {selectedAssets.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteSelectedAssets}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedAssets.length})
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'templates' ? (
        <>
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
                    onClick={() => setSelectedTags([])}
                    className="h-6 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Templates grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Go up folder */}
            {currentFolder && (
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  const parentFolder = folders.find(f => f.id === currentFolder)?.parent_folder_id;
                  setCurrentFolder(parentFolder || null);
                }}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  <Folder className="w-8 h-8 text-slate-400" />
                  <span className="font-medium">.. (Go up)</span>
                </CardContent>
              </Card>
            )}

            {/* Subfolders */}
            {subfolders.map((folder) => (
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
                          {templates.filter(t => (t as any).folder_id === folder.id).length} templates
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder.id);
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
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-full h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 relative">
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
        </>
      ) : (
        /* Assets view */
        <div className="space-y-4">
          {/* Asset stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Image className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{images.length}</div>
                <div className="text-sm text-slate-500">Images</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Video className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{assets.filter(a => a.mime_type.startsWith('video/')).length}</div>
                <div className="text-sm text-slate-500">Videos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <div className="text-2xl font-bold">{assets.filter(a => a.mime_type.startsWith('application/')).length}</div>
                <div className="text-sm text-slate-500">Documents</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <File className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{assets.length}</div>
                <div className="text-sm text-slate-500">Total Files</div>
              </CardContent>
            </Card>
          </div>

          {/* Assets grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {assets.map((asset) => (
              <Card key={asset.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-2">
                  <div className="relative">
                    <div className="flex items-center justify-center h-20 bg-gray-100 rounded mb-2">
                      {asset.mime_type.startsWith('image/') ? (
                        <img 
                          src={(asset as any).url} 
                          alt={asset.original_filename}
                          className="max-w-full max-h-full object-cover rounded"
                        />
                      ) : (
                        getFileIcon(asset.mime_type)
                      )}
                    </div>
                    <Checkbox
                      checked={selectedAssets.includes(asset.id)}
                      onCheckedChange={() => toggleAssetSelection(asset.id)}
                      className="absolute top-1 left-1"
                    />
                  </div>
                  <div className="text-xs">
                    <p className="font-medium truncate">{asset.original_filename}</p>
                    <p className="text-slate-500">{(asset.file_size / 1024).toFixed(1)} KB</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {((activeTab === 'templates' && templates.length === 0 && subfolders.length === 0) ||
        (activeTab === 'assets' && assets.length === 0)) && (
        <div className="text-center py-12">
          <File className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            No {activeTab} found
          </h3>
          <p className="text-slate-500 mb-4">
            {activeTab === 'templates' 
              ? 'Create your first template or organize with folders'
              : 'Upload your first assets to get started'
            }
          </p>
        </div>
      )}
    </div>
  );
};

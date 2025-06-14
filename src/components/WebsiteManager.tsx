
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useWebsiteManagement } from "@/hooks/useWebsiteManagement";
import { 
  Globe, 
  Plus, 
  Copy, 
  Code, 
  BarChart3, 
  Settings, 
  Trash2,
  ExternalLink,
  Zap
} from "lucide-react";
import { toast } from "sonner";

export const WebsiteManager = () => {
  const {
    websites,
    isLoading,
    addWebsite,
    updateWebsite,
    deleteWebsite,
    generateBeaconCode,
    isAdding
  } = useWebsiteManagement();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<any>(null);
  const [newWebsiteName, setNewWebsiteName] = useState("");
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");

  const handleAddWebsite = () => {
    if (!newWebsiteName.trim() || !newWebsiteUrl.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      new URL(newWebsiteUrl); // Validate URL
      addWebsite({ name: newWebsiteName, url: newWebsiteUrl });
      setNewWebsiteName("");
      setNewWebsiteUrl("");
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error('Please enter a valid URL');
    }
  };

  const copyBeaconCode = (website: any) => {
    const code = generateBeaconCode(website);
    navigator.clipboard.writeText(code);
    toast.success('Beacon code copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading websites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Website Management</h1>
          <p className="text-slate-600 mt-2">
            Manage your websites and generate tracking beacons for popup analytics
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Website
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Website</DialogTitle>
              <DialogDescription>
                Add a website to start tracking user behavior and triggering popups
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="websiteName">Website Name</Label>
                <Input
                  id="websiteName"
                  value={newWebsiteName}
                  onChange={(e) => setNewWebsiteName(e.target.value)}
                  placeholder="My Awesome Website"
                />
              </div>
              
              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWebsite} disabled={isAdding}>
                  {isAdding ? 'Adding...' : 'Add Website'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {websites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Globe className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No websites added</h3>
            <p className="text-slate-500 mb-6">
              Add your first website to start tracking user behavior and triggering popups
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Website
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => (
            <Card key={website.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      {website.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <ExternalLink className="w-3 h-3" />
                      {website.domain}
                    </CardDescription>
                  </div>
                  <Badge variant={website.tracking_enabled ? "default" : "secondary"}>
                    {website.tracking_enabled ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Beacon ID</p>
                    <p className="font-mono text-xs bg-slate-100 p-1 rounded">
                      {website.beacon_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">API Key</p>
                    <p className="font-mono text-xs bg-slate-100 p-1 rounded">
                      {website.api_key.slice(0, 8)}...
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyBeaconCode(website)}
                    className="flex-1"
                  >
                    <Code className="w-3 h-3 mr-1" />
                    Copy Beacon
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedWebsite(website)}
                  >
                    <BarChart3 className="w-3 h-3" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteWebsite(website.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Beacon Code Dialog */}
      {selectedWebsite && (
        <Dialog open={!!selectedWebsite} onOpenChange={() => setSelectedWebsite(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Tracking Beacon for {selectedWebsite.name}
              </DialogTitle>
              <DialogDescription>
                Copy this code and add it to your website's HTML before the closing &lt;/body&gt; tag
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-lg p-4">
                <Textarea
                  value={generateBeaconCode(selectedWebsite)}
                  readOnly
                  className="font-mono text-xs text-green-400 bg-transparent border-none resize-none h-96"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-600">
                  This beacon will track user interactions and trigger popups based on your rules
                </div>
                <Button onClick={() => copyBeaconCode(selectedWebsite)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

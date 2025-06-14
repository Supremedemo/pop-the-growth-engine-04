
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  ExternalLink, 
  ShoppingBag, 
  Code, 
  Globe, 
  Link,
  Instagram,
  Monitor
} from "lucide-react";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string;
  canvasData: any;
}

export const PublishDialog = ({ open, onOpenChange, templateName, canvasData }: PublishDialogProps) => {
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState("shopify");
  const [customUrl, setCustomUrl] = useState("");
  const [shopifyStore, setShopifyStore] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const generatePopupCode = () => {
    return `<!-- ${templateName} Popup Code -->
<div id="popup-${Math.random().toString(36).substr(2, 9)}" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
  <div style="width: ${canvasData.width}px; height: ${canvasData.height}px; background: ${canvasData.backgroundColor}; border-radius: 12px; position: relative;">
    <!-- Popup content will be rendered here -->
    <button onclick="this.parentElement.parentElement.style.display='none'" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
  </div>
</div>`;
  };

  const generateScriptTag = () => {
    return `<script>
(function() {
  var popup = document.createElement('div');
  popup.innerHTML = '${generatePopupCode().replace(/'/g, "\\'")}';
  document.body.appendChild(popup.firstElementChild);
  
  // Auto-show popup after 3 seconds
  setTimeout(function() {
    document.querySelector('[id^="popup-"]').style.display = 'flex';
  }, 3000);
})();
</script>`;
  };

  const generateIframeCode = () => {
    return `<iframe 
  src="https://popup.lovable.app/embed/${Math.random().toString(36).substr(2, 9)}" 
  width="${canvasData.width}" 
  height="${canvasData.height}" 
  frameborder="0" 
  style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
</iframe>`;
  };

  const generateShopifyCode = () => {
    return `<!-- Add to your Shopify theme.liquid file before </body> -->
${generateScriptTag()}

<!-- Or add to a specific page template -->
<div class="popup-container">
  ${generatePopupCode()}
</div>`;
  };

  const generateInstagramEmbed = () => {
    return `<!-- Instagram Story/Post Embed Code -->
<div class="instagram-popup" style="max-width: 400px; margin: 0 auto;">
  ${generatePopupCode()}
  <p style="text-align: center; margin-top: 10px; color: #666; font-size: 12px;">
    Swipe up to interact with this popup
  </p>
</div>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Simulate publishing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Published Successfully!",
      description: `Your popup has been published with ${selectedOption} integration`,
    });
    
    setIsPublishing(false);
    onOpenChange(false);
  };

  const publishOptions = [
    {
      id: "shopify",
      name: "Shopify Store",
      icon: ShoppingBag,
      description: "Embed directly in your Shopify store"
    },
    {
      id: "script",
      name: "Script Tag",
      icon: Code,
      description: "Universal script tag for any website"
    },
    {
      id: "iframe",
      name: "iFrame Embed",
      icon: Monitor,
      description: "Safe iframe embed for any platform"
    },
    {
      id: "redirect",
      name: "Redirect URL",
      icon: Link,
      description: "Redirect users to your popup page"
    },
    {
      id: "instagram",
      name: "Instagram Embed",
      icon: Instagram,
      description: "Optimized for Instagram stories/posts"
    },
    {
      id: "webpage",
      name: "Standalone Page",
      icon: Globe,
      description: "Generate a standalone webpage"
    }
  ];

  const getCodeForOption = () => {
    switch (selectedOption) {
      case "shopify": return generateShopifyCode();
      case "script": return generateScriptTag();
      case "iframe": return generateIframeCode();
      case "instagram": return generateInstagramEmbed();
      case "webpage": return `https://popup.lovable.app/view/${Math.random().toString(36).substr(2, 9)}`;
      case "redirect": return customUrl || `https://popup.lovable.app/redirect/${Math.random().toString(36).substr(2, 9)}`;
      default: return generatePopupCode();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Publish "{templateName}"
          </DialogTitle>
          <DialogDescription>
            Choose how you want to deploy your popup template
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Publishing Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-slate-700">Deployment Options</h3>
            <div className="grid grid-cols-1 gap-2">
              {publishOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedOption === option.id
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 mt-0.5 text-blue-600" />
                      <div>
                        <div className="font-medium text-sm">{option.name}</div>
                        <div className="text-xs text-slate-600 mt-1">{option.description}</div>
                      </div>
                      {selectedOption === option.id && (
                        <Badge variant="default" className="ml-auto">Selected</Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom URL Input for Redirect */}
            {selectedOption === "redirect" && (
              <div className="space-y-2">
                <Label htmlFor="customUrl">Redirect URL</Label>
                <Input
                  id="customUrl"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://your-domain.com/popup"
                />
              </div>
            )}

            {/* Shopify Store Input */}
            {selectedOption === "shopify" && (
              <div className="space-y-2">
                <Label htmlFor="shopifyStore">Shopify Store URL</Label>
                <Input
                  id="shopifyStore"
                  value={shopifyStore}
                  onChange={(e) => setShopifyStore(e.target.value)}
                  placeholder="your-store.myshopify.com"
                />
              </div>
            )}
          </div>

          {/* Code Output */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-700">Generated Code</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(getCodeForOption())}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-64">
              <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                {getCodeForOption()}
              </pre>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-sm text-blue-900 mb-2">Implementation Steps:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                {selectedOption === "shopify" && (
                  <>
                    <li>1. Copy the code above</li>
                    <li>2. Go to your Shopify admin → Online Store → Themes</li>
                    <li>3. Edit your theme's theme.liquid file</li>
                    <li>4. Paste the code before the closing &lt;/body&gt; tag</li>
                    <li>5. Save and preview your store</li>
                  </>
                )}
                {selectedOption === "script" && (
                  <>
                    <li>1. Copy the script tag above</li>
                    <li>2. Add it to your website's HTML before &lt;/body&gt;</li>
                    <li>3. The popup will auto-show after 3 seconds</li>
                    <li>4. Customize timing and triggers as needed</li>
                  </>
                )}
                {selectedOption === "iframe" && (
                  <>
                    <li>1. Copy the iframe code above</li>
                    <li>2. Paste it anywhere in your HTML</li>
                    <li>3. Adjust width/height as needed</li>
                    <li>4. Style the container to fit your design</li>
                  </>
                )}
                {selectedOption === "instagram" && (
                  <>
                    <li>1. Use this code in your Instagram bio link tool</li>
                    <li>2. Or embed in Instagram story/post descriptions</li>
                    <li>3. Optimized for mobile viewing</li>
                    <li>4. Include clear call-to-action text</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? "Publishing..." : "Publish Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { PopupBuilder } from "@/components/PopupBuilder";
import { TemplateGallery } from "@/components/TemplateGallery";
import { Analytics } from "@/components/Analytics";
import { Auth } from "@/pages/Auth";
import { Admin } from "@/components/Admin";
import { FileManager } from "@/components/FileManager";
import { WebsiteManagerEnhanced } from "@/components/WebsiteManagerEnhanced";
import { EventBasedCampaignManager } from "@/components/EventBasedCampaignManager";
import { CampaignAnalytics } from "@/components/CampaignAnalytics";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  Palette, 
  Image, 
  BarChart3, 
  Settings, 
  LogOut,
  Folder,
  Globe,
  Target,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const { user, signOut } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  if (!user) {
    return <Auth />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'builder', label: 'Popup Builder', icon: Palette },
    { id: 'campaigns', label: 'Campaign Analytics', icon: TrendingUp },
    { id: 'campaign-creator', label: 'Create Campaign', icon: Target },
    { id: 'templates', label: 'Templates', icon: Image },
    { id: 'websites', label: 'Websites', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'files', label: 'File Manager', icon: Folder },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onNavigateToBuilder={() => setActiveView('builder')} />;
      case 'builder':
        return <PopupBuilder onBack={() => setActiveView('dashboard')} />;
      case 'campaigns':
        return <CampaignAnalytics />;
      case 'campaign-creator':
        return <EventBasedCampaignManager />;
      case 'templates':
        return <TemplateGallery onSelectTemplate={() => setActiveView('builder')} />;
      case 'websites':
        return <WebsiteManagerEnhanced />;
      case 'analytics':
        return <Analytics />;
      case 'files':
        return <FileManager />;
      case 'admin':
        return <Admin />;
      default:
        return <Dashboard onNavigateToBuilder={() => setActiveView('builder')} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <div className="p-4 flex items-center gap-3">
            <img 
              src="/lovable-uploads/01b275f3-962e-49f3-bc04-9696b715d718.png" 
              alt="Pop The Builder Logo" 
              className="w-8 h-8 rounded-lg"
            />
            <h2 className="text-lg font-semibold text-gray-900">Pop The Builder</h2>
          </div>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => setActiveView(item.id)}
                          isActive={activeView === item.id}
                          className="w-full justify-start"
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4 space-y-2">
              <Separator className="mb-2" />
              <div className="text-sm text-gray-600 mb-2">
                Welcome, {user.email}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b p-4 flex items-center">
            <SidebarTrigger />
          </header>
          
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

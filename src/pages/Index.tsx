
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Auth } from './Auth';
import { Dashboard } from '@/components/Dashboard';
import { RealDashboard } from '@/components/RealDashboard';
import { PopupBuilder } from '@/components/PopupBuilder';
import { CampaignManager } from '@/components/CampaignManager';
import { Analytics } from '@/components/Analytics';
import { TemplateGalleryEnhanced } from '@/components/TemplateGalleryEnhanced';
import { WebsiteManagerEnhanced } from '@/components/WebsiteManagerEnhanced';
import { UserProgressDashboard } from '@/components/UserProgressDashboard';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  MousePointer, 
  BarChart3, 
  FileText, 
  Globe, 
  Trophy,
  Menu
} from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'builder', label: 'Popup Builder', icon: MousePointer },
    { id: 'campaigns', label: 'Campaigns', icon: FileText },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'websites', label: 'Websites', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'progress', label: 'Progress', icon: Trophy },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <RealDashboard onNavigate={setActiveView} />;
      case 'builder':
        return <PopupBuilder />;
      case 'campaigns':
        return <CampaignManager />;
      case 'templates':
        return <TemplateGalleryEnhanced />;
      case 'websites':
        return <WebsiteManagerEnhanced />;
      case 'analytics':
        return <Analytics />;
      case 'progress':
        return <UserProgressDashboard />;
      default:
        return <RealDashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r">
          <SidebarContent className="p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeView === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveView(item.id)}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b px-6 py-4 flex items-center">
            <SidebarTrigger>
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
            <h1 className="ml-4 text-xl font-semibold">
              {sidebarItems.find(item => item.id === activeView)?.label || 'Dashboard'}
            </h1>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

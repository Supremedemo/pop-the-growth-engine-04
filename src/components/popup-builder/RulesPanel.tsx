
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebhookManager } from "../WebhookManager";
import { FormSubmissionRulesManager } from "../FormSubmissionRulesManager";
import { Settings, Webhook, Filter } from "lucide-react";

interface RulesPanelProps {
  campaignId?: string;
  templateId?: string;
}

export const RulesPanel = ({ campaignId, templateId }: RulesPanelProps) => {
  return (
    <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Automation Rules
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure form submission processing
        </p>
      </div>

      <div className="p-4">
        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rules" className="flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Rules
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-1">
              <Webhook className="w-3 h-3" />
              Webhooks
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rules" className="mt-4">
            <FormSubmissionRulesManager campaignId={campaignId} templateId={templateId} />
          </TabsContent>
          
          <TabsContent value="webhooks" className="mt-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Webhook Management</CardTitle>
                  <CardDescription className="text-sm">
                    Configure external endpoints to receive form data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('/webhooks', '_blank')}
                    className="w-full"
                  >
                    Open Webhook Manager
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
